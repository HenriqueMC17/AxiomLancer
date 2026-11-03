-- AlterTable
ALTER TABLE "users" ADD COLUMN "current_score" DECIMAL(12,2) NOT NULL DEFAULT 0.00;

-- CreateIndex
CREATE INDEX "idx_project_feedback_user" ON "project_feedback"("user_id");
CREATE INDEX "idx_cycle_evaluation_user" ON "cycle_evaluation"("user_id");