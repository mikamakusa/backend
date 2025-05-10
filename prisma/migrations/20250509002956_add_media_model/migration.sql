-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "original" TEXT NOT NULL,
    "processed" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);
