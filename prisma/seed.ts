// TODO: Create seeder
// 1. Manual entries
// 2. Generate Zod schema via prisma-zod-generator
// 2. Mock entries using @anatine/zod-mock

// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

// Helper functions
function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function main() {
  try {
    // Seed branches
    const branches = await Promise.all(
      Array(5)
        .fill(null)
        .map(async (_, index) => {
          return await prisma.common_branch.create({
            data: {
              BranchId: `BR${String(index + 1).padStart(3, "0")}`,
              BranchName: `Branch ${index + 1}`,
              BranchType: 1,
              LocationStatus: 1,
              BranchAddress: `Street ${index + 1}`,
              PhoneNo: `021-${String(index + 1).padStart(7, "0")}`,
              Email: `branch${index + 1}@example.com`,
            },
          });
        })
    );

    // Seed brands
    const brands = await Promise.all(
      ["Toyota", "Honda", "Suzuki"].map(async (brandName) => {
        return await prisma.sales_vehiclebrand.create({
          data: {
            Oid: randomUUID(),
            BrandName: brandName,
          },
        });
      })
    );

    // Seed models
    const models = await Promise.all(
      brands.flatMap((brand) =>
        Array(3)
          .fill(null)
          .map(async (_, index) => {
            return await prisma.sales_vehiclemodel.create({
              data: {
                Oid: randomUUID(),
                VehicleModelName: `${brand.BrandName} Model ${index + 1}`,
                Brand: brand.Oid,
                Category: ["Sedan", "SUV", "MPV"][index],
              },
            });
          })
      )
    );

    // Seed colors
    const colors = await Promise.all(
      [
        { code: "WHT", name: "White", nameId: "Putih" },
        { code: "BLK", name: "Black", nameId: "Hitam" },
        { code: "SLV", name: "Silver", nameId: "Silver" },
        { code: "RED", name: "Red", nameId: "Merah" },
        { code: "BLU", name: "Blue", nameId: "Biru" },
      ].map(async (color) => {
        return await prisma.sales_vehiclecolor.create({
          data: {
            Oid: randomUUID(),
            ColorCode: color.code,
            Description: color.name,
            ColorNameEn: color.name,
            ColorNameId: color.nameId,
          },
        });
      })
    );

    // Seed full models
    const fullModels = await Promise.all(
      models.flatMap((model) =>
        Array(3)
          .fill(null)
          .map(async (_, index) => {
            return await prisma.sales_vehiclefullmodel.create({
              data: {
                VehicleFullModelId: randomUUID(),
                VehicleFullModelName: `${model.VehicleModelName} ${
                  ["Basic", "Medium", "Premium"][index]
                }`,
                VehicleModel: model.Oid,
                ToyotaFullModelId: `${
                  model.VehicleModelName?.substring(0, 3) ?? "UNK"
                }${index + 1}`,
              },
            });
          })
      )
    );

    // Seed customers
    const customers = await Promise.all(
      Array(50)
        .fill(null)
        .map(async (_, index) => {
          return await prisma.common_customer.create({
            data: {
              Oid: randomUUID(),
              FirstName: `Customer${index + 1}`,
              LastName: `Lastname${index + 1}`,
              CustomerAddress: `Address ${index + 1}`,
              MobileNo: `08${String(index + 1).padStart(10, "0")}`,
              IdentificationNo: `ID${String(index + 1).padStart(3, "0")}`,
              Province: randomNumber(1, 34),
              City: randomNumber(1, 100),
              District: randomNumber(1, 500),
              CustomerType: Math.random() > 0.5 ? "RETAIL" : "FLEET",
            },
          });
        })
    );

    // Seed dealers
    const dealers = await Promise.all(
      Array(10)
        .fill(null)
        .map(async (_, index) => {
          return await prisma.common_dealer.create({
            data: {
              Oid: randomUUID(),
              DealerName: `Dealer ${index + 1}`,
              DealerType: randomNumber(1, 3),
              Branch: branches[randomNumber(0, branches.length - 1)].BranchId,
            },
          });
        })
    );

    // Seed contact persons
    const contactPersons = await Promise.all(
      Array(50)
        .fill(null)
        .map(async (_, index) => {
          return await prisma.common_contactperson.create({
            data: {
              Oid: randomUUID(),
              ContactPersonName: `Contact ${index + 1}`,
              MobileNo: `08${String(index + 1).padStart(10, "0")}`,
              DefaultContact: 1,
            },
          });
        })
    );

    // Seed service advisors
    const serviceAdvisors = await Promise.all(
      Array(10)
        .fill(null)
        .map(async (_, index) => {
          return await prisma.users.create({
            data: {
              username: `advisor${index + 1}`,
              password: "hashedpassword123",
              email: `advisor${index + 1}@example.com`,
              first_name: `Advisor`,
              last_name: `${index + 1}`,
              active: 1,
            },
          });
        })
    );

    // Seed repair types
    const repairTypes = await Promise.all(
      [
        "Regular Service",
        "Body Repair",
        "Engine Repair",
        "Electrical Repair",
        "General Repair",
      ].map(async (desc, index) => {
        return await prisma.service_repairtype.create({
          data: {
            RepairTypeId: BigInt(index + 1),
            RepairTypeDescription: desc,
            Branch: branches[0].BranchId,
          },
        });
      })
    );

    // Seed mobile service types
    const mobileServiceTypes = await Promise.all(
      ["Home Service", "Emergency Service", "Regular Service"].map(
        async (desc, index) => {
          return await prisma.service_mobileservicetype.create({
            data: {
              Description: desc,
            },
          });
        }
      )
    );

    // Seed vehicle units
    const vehicleUnits = await Promise.all(
      Array(100)
        .fill(null)
        .map(async (_, index) => {
          return await prisma.sales_vehicleunit.create({
            data: {
              Oid: randomUUID(),
              LicensePlateNumber: `B ${String(index + 1).padStart(4, "0")} CD`,
              FrameSerialNo: `FRAME${String(index + 1).padStart(3, "0")}`,
              EngineSerialNo: `ENGINE${String(index + 1).padStart(3, "0")}`,
              VehicleDeliveryDate: randomDate(new Date(2020, 0, 1), new Date()),
              Color: colors[randomNumber(0, colors.length - 1)].Oid,
              VehicleModel: models[randomNumber(0, models.length - 1)].Oid,
              VehicleFullModel:
                fullModels[randomNumber(0, fullModels.length - 1)]
                  .VehicleFullModelId,
              Customer: customers[randomNumber(0, customers.length - 1)].Oid,
              Dealer: dealers[randomNumber(0, dealers.length - 1)].Oid,
              DefaultContact:
                contactPersons[randomNumber(0, contactPersons.length - 1)].Oid,
            },
          });
        })
    );

    // Seed work orders
    await Promise.all(
      Array(100)
        .fill(null)
        .map(async (_, index) => {
          const totalJob = randomNumber(500000, 2000000);
          const totalPart = randomNumber(300000, 1000000);
          const partDiscount = Math.floor(totalPart * 0.1);
          const jobDiscount = Math.floor(totalJob * 0.1);
          const partVAT = Math.floor((totalPart - partDiscount) * 0.11);
          const jobVAT = Math.floor((totalJob - jobDiscount) * 0.11);

          return await prisma.service_workorder.create({
            data: {
              Oid: randomUUID(),
              WorkOrderNo: `WO${String(index + 1).padStart(3, "0")}`,
              WorkOrderDate: randomDate(new Date(2023, 0, 1), new Date()),
              BookingNo: `BK${String(index + 1).padStart(3, "0")}`,
              Branch: branches[randomNumber(0, branches.length - 1)].BranchId,
              WorkOrderStatus: randomNumber(1, 5),
              ServiceAdvisor:
                serviceAdvisors[
                  randomNumber(0, serviceAdvisors.length - 1)
                ].id.toString(),
              VehicleUnit: vehicleUnits[index].Oid,
              RepairType:
                repairTypes[randomNumber(0, repairTypes.length - 1)]
                  .RepairTypeId,
              DamageCategory: randomNumber(1, 3),
              ServiceStartOn: randomDate(new Date(2023, 0, 1), new Date()),
              GrossJobSales: totalJob,
              GrossPartSales: totalPart,
              TotalPartDiscount: partDiscount,
              TotalPartProgram: 0,
              TotalPartVAT: partVAT,
              TotalJobDiscount: jobDiscount,
              TotalJobProgram: 0,
              TotalJobVAT: jobVAT,
              TotalJob: totalJob - jobDiscount + jobVAT,
              TotalPart: totalPart - partDiscount + partVAT,
              TotalInvoice:
                totalJob -
                jobDiscount +
                jobVAT +
                (totalPart - partDiscount + partVAT),
              RepairSubType: ["Regular", "Express", "Premium"][
                randomNumber(0, 2)
              ],
              SPKReference: `SPK${String(index + 1).padStart(3, "0")}`,
              MobileServiceType:
                mobileServiceTypes[
                  randomNumber(0, mobileServiceTypes.length - 1)
                ].Oid,
            },
          });
        })
    );

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
