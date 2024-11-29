-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "branch" VARCHAR(100) NOT NULL,
    "customerAddress" TEXT,
    "officeAddress" TEXT,
    "phoneNo" VARCHAR(100),
    "mobileNo" VARCHAR(100),
    "dateOfBirth" DATE,
    "placeOfBirth" VARCHAR(100),
    "identificationType" CHAR(36),
    "identificationNo" VARCHAR(100),
    "religion" CHAR(36),
    "occupation" CHAR(36),
    "customerType" VARCHAR(50),
    "gender" VARCHAR(40),
    "email" VARCHAR(50),
    "country" CHAR(5),
    "province" INTEGER,
    "city" INTEGER,
    "district" INTEGER,
    "subDistrict" INTEGER,
    "postalCode" CHAR(10),
    "rt" CHAR(4),
    "rw" CHAR(4),
    "simCardNo" VARCHAR(50),
    "marriedStatus" CHAR(3),
    "incomePerMonth" DECIMAL(11,0),
    "expensesPerMonth" DECIMAL(11,0),
    "hobby" VARCHAR(40),
    "favoriteFood" VARCHAR(40),
    "favoriteDrink" VARCHAR(40),
    "businessFields" VARCHAR(100),
    "registeredDate" TIMESTAMP(6),
    "vehiclePhoneNo" VARCHAR(100),
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "userCreated" INTEGER,
    "updatedAt" TIMESTAMP(6),
    "userUpdate" INTEGER,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_units" (
    "id" TEXT NOT NULL,
    "rrn" VARCHAR(100),
    "vinCode" VARCHAR(100),
    "vehicleRegistrationNumber" VARCHAR(100),
    "registrationDate" TIMESTAMP(6),
    "registrationExpiryDate" TIMESTAMP(6),
    "engineSerialNo" VARCHAR(100),
    "frameSerialNo" VARCHAR(100),
    "vehicleModel" CHAR(36),
    "color" CHAR(36),
    "licensePlateNumber" VARCHAR(100),
    "vehicleDeliveryDate" TIMESTAMP(6),
    "applicationForInvoiceDate" TIMESTAMP(6),
    "productionYear" INTEGER,
    "dailyAverageMileage" INTEGER,
    "lastMileageRecord" INTEGER,
    "lastServiceDate" TIMESTAMP(6),
    "expectedNextServiceDate" TIMESTAMP(6),
    "nextServiceMileage" INTEGER,
    "nextService" CHAR(36),
    "customerId" CHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "userCreated" INTEGER,
    "updatedAt" TIMESTAMP(6),
    "userUpdate" INTEGER,
    "deletedAt" TIMESTAMP(6),
    "insuranceExpireDate" TIMESTAMP(6),
    "paymentMethod" CHAR(50),

    CONSTRAINT "vehicle_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "vehicle_brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,

    CONSTRAINT "vehicle_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,

    CONSTRAINT "vehicle_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_colors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "typeId" TEXT,

    CONSTRAINT "vehicle_colors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_identificationNo_key" ON "customers"("identificationNo");

-- CreateIndex
CREATE INDEX "customers_identificationType_idx" ON "customers"("identificationType");

-- CreateIndex
CREATE INDEX "customers_religion_idx" ON "customers"("religion");

-- CreateIndex
CREATE INDEX "customers_occupation_idx" ON "customers"("occupation");

-- CreateIndex
CREATE INDEX "vehicle_units_customerId_idx" ON "vehicle_units"("customerId");

-- CreateIndex
CREATE INDEX "vehicle_units_frameSerialNo_idx" ON "vehicle_units"("frameSerialNo");

-- AddForeignKey
ALTER TABLE "vehicle_units" ADD CONSTRAINT "vehicle_units_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_models" ADD CONSTRAINT "vehicle_models_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "vehicle_brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_types" ADD CONSTRAINT "vehicle_types_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "vehicle_models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_colors" ADD CONSTRAINT "vehicle_colors_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "vehicle_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
