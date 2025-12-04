-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CONTRIBUTOR');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "PoolCategory" AS ENUM ('FOOD_STUFFS', 'LIVESTOCK');

-- CreateEnum
CREATE TYPE "PoolStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CreatorIdType" AS ENUM ('NIN', 'VOTERS_CARD', 'DRIVERS_LICENSE', 'PASSPORT');

-- CreateEnum
CREATE TYPE "CreatorStatus" AS ENUM ('PENDING', 'VERIFIED', 'SUSPENDED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "avatar" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CONTRIBUTOR',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "totalContributed" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pools" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "PoolCategory" NOT NULL,
    "goal" DOUBLE PRECISION NOT NULL,
    "contributors" INTEGER NOT NULL,
    "currentAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currentContributors" INTEGER NOT NULL DEFAULT 0,
    "location" TEXT NOT NULL,
    "localGovernment" TEXT NOT NULL,
    "town" TEXT,
    "street" TEXT,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" "PoolStatus" NOT NULL DEFAULT 'ACTIVE',
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creators" (
    "id" TEXT NOT NULL,
    "avatar" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "organization" TEXT,
    "address" TEXT,
    "idType" "CreatorIdType" NOT NULL,
    "idNumber" TEXT NOT NULL,
    "status" "CreatorStatus" NOT NULL DEFAULT 'PENDING',
    "poolsCreated" INTEGER NOT NULL DEFAULT 0,
    "totalRaised" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "creators_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "pools_slug_key" ON "pools"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "creators_email_key" ON "creators"("email");

-- CreateIndex
CREATE UNIQUE INDEX "creators_phone_key" ON "creators"("phone");
