-- CreateEnum
CREATE TYPE "CycleTriggerType" AS ENUM ('MILESTONE_10_PROJECTS', 'MONTHLY_30_DAYS', 'MANUAL');
CREATE TYPE "CycleEvaluationStatus" AS ENUM ('PENDING', 'COMPLETED', 'EXPIRED');

-- AlterTable
ALTER TABLE "cycle_evaluation"
    ADD COLUMN IF NOT EXISTS "trigger_type" "CycleTriggerType" NOT NULL DEFAULT 'MANUAL',
    ADD COLUMN IF NOT EXISTS "status" "CycleEvaluationStatus" NOT NULL DEFAULT 'PENDING',
    ADD COLUMN IF NOT EXISTS "score_demand_delivery" DECIMAL(12,2),
    ADD COLUMN IF NOT EXISTS "invitation_token" VARCHAR(255) UNIQUE,
    ADD COLUMN IF NOT EXISTS "invitation_sent_at" TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS "completed_at" TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS "client_name" VARCHAR(255);

-- Allow null scores while in PENDING state
ALTER TABLE "cycle_evaluation"
    ALTER COLUMN "score_communication" DROP NOT NULL,
    ALTER COLUMN "score_proactivity" DROP NOT NULL,
    ALTER COLUMN "score_results" DROP NOT NULL,
    ALTER COLUMN "score_understanding" DROP NOT NULL;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_cycle_evaluation_token" ON "cycle_evaluation"("invitation_token");