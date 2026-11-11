// Committed entrypoint for the Vercel backend service.
//
// Vercel requires the entrypoint file to exist before the build starts, but
// the real server is bundled DURING the build (npm run build ->
// scripts/bundle-vercel.mjs -> dist-vercel/app.cjs). This file simply hands
// that bundle to Vercel. The bundle is a complete Express app: require("express")
module.exports = require("./dist-vercel/app.cjs");
