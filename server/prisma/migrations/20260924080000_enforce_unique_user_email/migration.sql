-- Normalize existing user email values before enforcing uniqueness.
UPDATE "users"
SET "email" = LOWER(BTRIM("email"))
WHERE "email" IS NOT NULL
  AND BTRIM("email") <> '';

-- Treat whitespace-only email values as not provided.
UPDATE "users"
SET "email" = NULL
WHERE "email" IS NOT NULL
  AND BTRIM("email") = '';

-- One account per email address.
-- PostgreSQL allows multiple NULL values.
CREATE UNIQUE INDEX "users_email_key"
ON "users"("email");