-- Prevent more than one Administrator account.
CREATE UNIQUE INDEX "users_single_admin_idx"
ON "users" ("role")
WHERE "role" = 'ADMIN';
