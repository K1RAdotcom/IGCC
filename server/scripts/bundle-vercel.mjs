/*
 * Bundles the Express app and ALL of its dependencies into one file so the
 * Vercel function does not depend on node_modules being packaged.
 *
 * Vercel runs the compiled file dist/src/app.js as the function handler, but
 * lays out node_modules under a different path than that file (a known quirk
 * for services whose code lives in a subfolder), so require("dotenv/config")
 * and every other package fail to resolve. Overwriting dist/src/app.js with a
 * self-contained bundle removes the dependency on node_modules entirely.
 *
 * Runs after tsc. Render's `node dist/src/server.js` keeps working: server.js
 * requires ./app, and the bundle exports the same Express app.
 */
import { build } from "esbuild";

await build({
  entryPoints: ["src/app.ts"],
  bundle: true,
  platform: "node",
  target: "node22",
  format: "cjs",
  outfile: "dist/src/app.js",
  // pg tries to load its optional native bindings inside a try/catch.
  external: ["pg-native"],
  // Lets Vercel's Express detection see that this entry is an Express app
  // even though express itself is inlined into the bundle.
  banner: { js: '// Express app bundle: require("express")' },
  // Vercel expects the Express app itself to be the module export.
  footer: {
    js: "module.exports = Object.assign(module.exports.default, { default: module.exports.default });",
  },
  logLevel: "info",
});
