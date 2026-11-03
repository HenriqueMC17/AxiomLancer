-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELED', 'PENDING_SIGNATURE');

-- CreateTable
CREATE TABLE "contract" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "contract_value" DECIMAL(12,2) NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'PENDING_SIGNATURE',
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "terms_clause" TEXT,
    "accepted_at" TIMESTAMPTZ,
    "signer_name" VARCHAR(255),
    "signer_email" VARCHAR(255),
    "signer_ip" VARCHAR(50),
    "signature_hash" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "contract_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "chk_contract_dates" CHECK ("end_date" IS NULL OR "end_date" >= "start_date"),
    CONSTRAINT "contract_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "idx_contract_user" ON "contract"("user_id");
CREATE INDEX "idx_contract_client" ON "contract"("client_id");