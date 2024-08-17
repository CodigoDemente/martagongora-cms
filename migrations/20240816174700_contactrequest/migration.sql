-- CreateTable
CREATE TABLE "ContactRequest" (
    "id" UUID NOT NULL,
    "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "data" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "ContactRequest_pkey" PRIMARY KEY ("id")
);
