-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "category_averages" JSONB;

-- CreateTable
CREATE TABLE "AssetMedia" (
    "id" UUID NOT NULL,
    "assetId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "media_type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssetMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AssetMedia_assetId_idx" ON "AssetMedia"("assetId");

-- AddForeignKey
ALTER TABLE "AssetMedia" ADD CONSTRAINT "AssetMedia_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
