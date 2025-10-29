-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "image" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "verifiedEmail" BOOLEAN NOT NULL DEFAULT false,
    "subscription" TEXT NOT NULL DEFAULT 'free',
    "subscriptionValidity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contact" TEXT,
    "cookie" TEXT,
    "cookieExp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "device" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionToken")
);

-- CreateTable
CREATE TABLE "public"."Filter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'default',
    "needWhatsappActive" BOOLEAN NOT NULL DEFAULT true,
    "pointWhatsappActive" INTEGER NOT NULL DEFAULT 20,
    "needMobVerified" BOOLEAN NOT NULL DEFAULT true,
    "pointMobVerified" INTEGER NOT NULL DEFAULT 20,
    "needEmailVerified" BOOLEAN NOT NULL DEFAULT true,
    "pointEmailVerified" INTEGER NOT NULL DEFAULT 20,
    "needBuyerReply" BOOLEAN NOT NULL DEFAULT true,
    "pointBuyerReply" INTEGER NOT NULL DEFAULT 20,
    "needBuyerRequirement" BOOLEAN NOT NULL DEFAULT true,
    "pointBuyerRequirement" INTEGER NOT NULL DEFAULT 20,
    "needBuyerCalls" BOOLEAN NOT NULL DEFAULT true,
    "pointBuyerCalls" INTEGER NOT NULL DEFAULT 20,
    "needSec" BOOLEAN NOT NULL DEFAULT true,
    "pointSec" INTEGER NOT NULL DEFAULT 20,
    "minPointsForPurchase" INTEGER NOT NULL DEFAULT 40,
    "allowMessaging" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "allowCountries" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "allowCategories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "restrictMedicines" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "allowOnlyMedicines" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "totalMessages" INTEGER NOT NULL DEFAULT 1,
    "aiInstructions" TEXT NOT NULL,
    "triggerOn" TEXT NOT NULL DEFAULT 'Purchase and Message',
    "triggerType" TEXT NOT NULL DEFAULT 'Premium',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Filter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerCountry" TEXT NOT NULL,
    "medicineName" TEXT NOT NULL,
    "medicineCategory" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Filter_title_key" ON "public"."Filter"("title");

-- CreateIndex
CREATE UNIQUE INDEX "UserHistory_id_key" ON "public"."UserHistory"("id");

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Filter" ADD CONSTRAINT "Filter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserHistory" ADD CONSTRAINT "UserHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
