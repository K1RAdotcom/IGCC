/*
  Warnings:

  - A unique constraint covering the columns `[display_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `display_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "display_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_display_id_key" ON "users"("display_id");
