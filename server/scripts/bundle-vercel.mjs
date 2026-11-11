/*
 * Bundles the Express app and ALL of its dependencies into one file so the
 * Vercel function does not depend on node_modules being packaged.
 * Output: dist-vercel/app.cjs (used as the backend service entrypoint).
 */
import { build } from "esbuild";

await build({
  entryPoints: ["src/app.ts"],
  bundle: true,
  platform: "node",
  target: "node22",
  format: "cjs",
  outfile: "dist-vercel/app.cjs",
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
