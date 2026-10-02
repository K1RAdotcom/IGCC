const fs = require("fs");

fs.cpSync(
  "dist/generated/prisma",
  "generated/prisma",
  { recursive: true, force: true }
);

console.log("Copied compiled Prisma client to generated/prisma.");