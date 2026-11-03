-- CreateEnum
CREATE TYPE "ToneOfVoice" AS ENUM ('AMIGAVEL', 'FIRME', 'EXECUTIVO');
CREATE TYPE "ChannelType" AS ENUM ('EMAIL', 'SMS', 'WHATSAPP');

-- CreateTable
CREATE TABLE "message_template" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "tone_of_voice" "ToneOfVoice" NOT NULL,
    "channel" "ChannelType" NOT NULL,
    "subject" VARCHAR(255),
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "message_template_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "message_template_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "idx_message_template_user" ON "message_template"("user_id");