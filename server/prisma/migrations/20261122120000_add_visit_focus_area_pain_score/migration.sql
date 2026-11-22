-- AlterTable
ALTER TABLE "visits" ADD COLUMN     "focus_area" TEXT,
ADD COLUMN     "pain_score" INTEGER;

-- Pain score is a 0-10 scale (or not recorded).
ALTER TABLE "visits" ADD CONSTRAINT "visits_pain_score_range" CHECK ("pain_score" IS NULL OR ("pain_score" >= 0 AND "pain_score" <= 10));
