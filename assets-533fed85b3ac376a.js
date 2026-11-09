/* Page-scoped immutable binary transport. No service worker or vendor patches. */
(function () {
  'use strict';
  const CACHE = 'orbital-binaries-v1';
  const originalFetch = window.fetch.bind(window);
  const hex = buffer => Array.from(new Uint8Array(buffer), b => b.toString(16).padStart(2, '0')).join('');
  window.OrbitalAssets = {
    stats: [], music: {}, onProgress: null,
    install(config) {
      this.music = config.music || {};
      const assets = new Map(Object.entries(config.transport).map(([name, entry]) => [new URL(name, document.baseURI).href, entry]));
      const pending = new Map();
      const initial = new Map(Object.keys(config.fileSizes).map(name => [new URL(name, document.baseURI).href, 0]));
      const initialTotal = [...initial.keys()].reduce((sum, url) => sum + assets.get(url).gzipBytes, 0);
      const progress = (url, bytes) => {
        if (!initial.has(url)) return;
        initial.set(url, bytes);
        this.onProgress?.([...initial.values()].reduce((a, b) => a + b, 0), initialTotal);
      };
      let cachePromise = Promise.resolve(null);
      try { cachePromise = caches.open(CACHE).catch(() => null); } catch (_) { /* private mode */ }
      // Prune only this game's own cache, retaining this and the previous release.
      cachePromise.then(async cache => {
        if (!cache) return;
        const keep = new Set([...assets.keys(), ...(config.previousAssets || []).map(name => new URL(name, document.baseURI).href)]);
        for (const request of await cache.keys()) {
          if (new URL(request.url).pathname.startsWith(new URL('.', document.baseURI).pathname) && !keep.has(request.url)) await cache.delete(request);
        }
      }).catch(() => {});
      async function valid(data, entry) {
        return data.byteLength === entry.bytes && hex(await crypto.subtle.digest('SHA-256', data)) === entry.sha256;
      }
      const load = async (url, entry) => {
        const cache = await cachePromise;
        if (cache) {
          try {
            const hit = await cache.match(url);
            if (hit && await valid(await hit.clone().arrayBuffer(), entry)) {
              this.stats.push({url, cached: true, bytes: 0});
              progress(url, entry.gzipBytes);
              return hit;
            }
            if (hit) await cache.delete(url);
          } catch (_) { /* storage failure must not block entry */ }
        }
        let data, transferred = 0;
        if (entry.gzip && typeof DecompressionStream !== 'undefined') {
          try {
            const response = await originalFetch(url + '.gz');
            if (!response.ok) throw new Error('Compressed asset unavailable');
            const reader = response.body.getReader(), chunks = [];
            while (true) {
              const {done, value} = await reader.read();
              if (done) break;
              chunks.push(value); transferred += value.byteLength;
              progress(url, Math.min(transferred, entry.gzipBytes));
            }
            const packed = new Uint8Array(transferred);
            let offset = 0;
            for (const chunk of chunks) { packed.set(chunk, offset); offset += chunk.byteLength; }
            // Some hosts set Content-Encoding even on .gz; Fetch then already decoded it.
            data = packed[0] === 31 && packed[1] === 139
              ? await new Response(new Blob([packed]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer()
              : packed.buffer;
            if (!await valid(data, entry)) throw new Error('Compressed asset integrity mismatch');
          } catch (_) { data = null; }
        }
        if (!data) {
          const response = await originalFetch(url);
          if (!response.ok) throw new Error('下载失败，请重试（' + response.status + '）');
          data = await response.arrayBuffer();
          transferred += data.byteLength;
          if (!await valid(data, entry)) throw new Error('下载校验未通过，请刷新重试');
        }
        const response = new Response(data, {headers: {'Content-Type': entry.type, 'Content-Length': String(data.byteLength)}});
        if (cache) { try { await cache.put(url, response.clone()); } catch (_) { /* quota exceeded */ } }
        this.stats.push({url, cached: false, bytes: transferred});
        progress(url, entry.gzipBytes);
        return response;
      };
      window.fetch = (input, options) => {
        const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url, document.baseURI).href;
        const entry = assets.get(url);
        const method = options?.method || (input instanceof Request ? input.method : 'GET');
        const headers = new Headers(options?.headers || (input instanceof Request ? input.headers : undefined));
        if (!entry || method !== 'GET' || headers.has('Range') || headers.has('Authorization')) return originalFetch(input, options);
        if (!pending.has(url)) pending.set(url, load(url, entry).finally(() => pending.delete(url)));
        return pending.get(url).then(response => response.clone());
      };
    },
  };
}());
