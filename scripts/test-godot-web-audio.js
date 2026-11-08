// Compatibility entry point; the real-browser check fails on silent output.
const { spawnSync } = require('node:child_process');
const { join } = require('node:path');
const result = spawnSync(process.env.PYTHON || 'python3', [
  join(__dirname, 'test-godot-web.py'), ...process.argv.slice(2),
], { stdio: 'inherit' });
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
