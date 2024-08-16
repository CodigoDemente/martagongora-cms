-- CreateEnum
CREATE TYPE "LanguageCodeType" AS ENUM ('sr', 'ro', 'ii', 'ty', 'tl', 'yi', 'ak', 'ms', 'ar', 'no', 'oj', 'ff', 'fa', 'sq', 'ay', 'az', 'zh', 'cr', 'et', 'gn', 'ik', 'iu', 'kr', 'kv', 'kg', 'ku', 'lv', 'mg', 'mn', 'om', 'ps', 'qu', 'sc', 'sw', 'uz', 'za', 'bi', 'nb', 'nn', 'id', 'tw', 'eo', 'ia', 'ie', 'io', 'vo', 'bh', 'he', 'sa', 'cu', 'pi', 'ae', 'la', 'hy', 'ss', 'bo', 'nr', 'sl', 'or', 'nd', 'na', 'mi', 'mr', 'lu', 'rn', 'km', 'fy', 'bn', 'av', 'ab', 'aa', 'af', 'am', 'an', 'as', 'bm', 'ba', 'eu', 'be', 'bs', 'br', 'bg', 'my', 'ca', 'ch', 'ce', 'ny', 'cv', 'kw', 'co', 'hr', 'cs', 'da', 'dv', 'nl', 'dz', 'en', 'ee', 'fo', 'fj', 'fi', 'fr', 'gl', 'ka', 'de', 'el', 'gu', 'ht', 'ha', 'hz', 'hi', 'ho', 'hu', 'ga', 'ig', 'is', 'it', 'ja', 'jv', 'kl', 'kn', 'ks', 'kk', 'ki', 'rw', 'ky', 'ko', 'kj', 'lb', 'lg', 'li', 'ln', 'lo', 'lt', 'gv', 'mk', 'ml', 'mt', 'mh', 'nv', 'ne', 'ng', 'oc', 'os', 'pa', 'pl', 'pt', 'rm', 'ru', 'sd', 'se', 'sm', 'sg', 'gd', 'sn', 'si', 'sk', 'so', 'st', 'es', 'su', 'sv', 'ta', 'te', 'tg', 'th', 'ti', 'tk', 'tn', 'to', 'tr', 'ts', 'tt', 'ug', 'uk', 'ur', 've', 'vi', 'wa', 'cy', 'wo', 'xh', 'yo', 'zu');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuration" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "value" JSONB,

    CONSTRAINT "Configuration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" UUID NOT NULL,
    "code" "LanguageCodeType" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Translation" (
    "id" UUID NOT NULL,
    "language" TEXT NOT NULL DEFAULT '',
    "key" TEXT NOT NULL DEFAULT '',
    "value" TEXT NOT NULL DEFAULT '',
    "compoundKey" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Picture" (
    "id" UUID NOT NULL,
    "image_id" TEXT,
    "image_filesize" INTEGER,
    "image_width" INTEGER,
    "image_height" INTEGER,
    "image_extension" TEXT,
    "code" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Picture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Configuration_name_key" ON "Configuration"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Language_code_key" ON "Language"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Translation_compoundKey_key" ON "Translation"("compoundKey");

-- CreateIndex
CREATE INDEX "Translation_language_idx" ON "Translation"("language");

-- CreateIndex
CREATE INDEX "Translation_key_idx" ON "Translation"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Picture_code_key" ON "Picture"("code");
