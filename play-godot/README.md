# Godot Web build output

This directory is generated; only this README belongs in source control.

From the repository root, with Godot **4.6.3** installed:

```sh
npm run build:godot
npm run preview:godot
```

Open `http://127.0.0.1:4174/`. The build exports the current game pack and
uses the verified runtime in `vendor/godot-web/`; export templates are not needed.
See `godot/README.md` for tests, cache policy and release retention.
