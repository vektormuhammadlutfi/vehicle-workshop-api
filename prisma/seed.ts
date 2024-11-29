import { prisma } from "../src/libs/prisma";

async function main() {
  // Seed Customers
  const customer1 = await prisma.customer.create({
    data: {
      firstName: "John",
      lastName: "Doe",
      branch: "Main Branch",
      email: "john@example.com",
      phoneNo: "1234567890",
      customerAddress: "123 Main St, City, Country",
      dateOfBirth: new Date("1990-01-01"),
      identificationType: "Passport",
      identificationNo: "A1234567",
      createdAt: new Date(),
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      firstName: "Jane",
      lastName: "Smith",
      branch: "Secondary Branch",
      email: "jane@example.com",
      phoneNo: "0987654321",
      customerAddress: "456 Elm St, City, Country",
      dateOfBirth: new Date("1995-05-05"),
      identificationType: "Driver License",
      identificationNo: "B7654321",
      createdAt: new Date(),
    },
  });

  // Seed Vehicle Brands
  const toyota = await prisma.vehicleBrand.create({
    data: {
      name: "Toyota",
    },
  });

  const ford = await prisma.vehicleBrand.create({
    data: {
      name: "Ford",
    },
  });

  // Seed Vehicle Models
  const camry = await prisma.vehicleModel.create({
    data: {
      name: "Camry",
      brandId: toyota.id,
    },
  });

  const mustang = await prisma.vehicleModel.create({
    data: {
      name: "Mustang",
      brandId: ford.id,
    },
  });

  // Seed Vehicle Types
  const sedan = await prisma.vehicleType.create({
    data: {
      name: "Sedan",
      modelId: camry.id,
    },
  });

  const coupe = await prisma.vehicleType.create({
    data: {
      name: "Coupe",
      modelId: mustang.id,
    },
  });

  // Seed Vehicle Colors
  const red = await prisma.vehicleColor.create({
    data: {
      name: "Red",
      typeId: coupe.id,
    },
  });

  const blue = await prisma.vehicleColor.create({
    data: {
      name: "Blue",
      typeId: sedan.id,
    },
  });

  // Seed Vehicle Units
  await prisma.vehicleUnit.create({
    data: {
      rrn: "RRN123456",
      vinCode: "VIN987654321",
      vehicleRegistrationNumber: "REG123",
      registrationDate: new Date(),
      engineSerialNo: "ENG987654",
      frameSerialNo: "FRAME123456",
      vehicleModel: camry.name,
      color: blue.name,
      licensePlateNumber: "XYZ123",
      customerId: customer1.id,
      createdAt: new Date(),
    },
  });

  await prisma.vehicleUnit.create({
    data: {
      rrn: "RRN654321",
      vinCode: "VIN123456789",
      vehicleRegistrationNumber: "REG456",
      registrationDate: new Date(),
      engineSerialNo: "ENG123456",
      frameSerialNo: "FRAME654321",
      vehicleModel: mustang.name,
      color: red.name,
      licensePlateNumber: "ABC456",
      customerId: customer2.id,
      createdAt: new Date(),
    },
  });

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });