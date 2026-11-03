-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('INFRA', 'SAAS', 'CONTABILIDADE', 'EQUIPAMENTO', 'IMPOSTOS', 'OUTROS');
CREATE TYPE "ExpenseStatus" AS ENUM ('PENDING', 'PAID', 'CANCELED');

-- CreateTable
CREATE TABLE "professional_expenses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "category" "ExpenseCategory" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "due_date" DATE,
    "paid_at" TIMESTAMPTZ,
    "status" "ExpenseStatus" NOT NULL DEFAULT 'PENDING',
    "is_fixed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "professional_expenses_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "professional_expenses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "idx_professional_expenses_user_status" ON "professional_expenses"("user_id", "status");