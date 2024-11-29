// Import context
import { Context } from "hono";

// Import Prisma client
import { prisma } from "../libs/prisma";

/**
 * Getting all vehicle units with pagination
 */
export const getVehicleUnits = async (c: Context) => {
  try {
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "10");
    const offset = (page - 1) * limit;

    const vehicleUnits = await prisma.vehicleUnit.findMany({
      skip: offset,
      take: limit,
      orderBy: { id: "desc" },
      include: { customer: true }, // Include customer info if necessary
    });

    const totalCount = await prisma.vehicleUnit.count();
    const totalPages = Math.ceil(totalCount / limit);

    return c.json({
        success: true,
        message: "List of Vehicle Units!",
        data: {
            vehicleUnits,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalCount: totalCount,
                limit: limit,
            },
        },
    });
    
  } catch (e) {
    console.error(`Error getting vehicle units: ${e}`);
    return c.json({ success: false, message: "Error retrieving vehicle units" }, 500);
  }
};

/**
 * Getting a vehicle unit by ID
 */
export const getVehicleUnitById = async (c: Context) => {
  try {
    const vehicleUnitId = c.req.param("id");

    const vehicleUnit = await prisma.vehicleUnit.findUnique({
      where: { id: vehicleUnitId },
      include: { customer: true }, // Include customer info if needed
    });

    if (!vehicleUnit) {
      return c.json({
        success: false,
        message: "Vehicle Unit Not Found!",
      }, 404);
    }

    return c.json({
        success: true,
        message: `Detail Data Vehicle Unit By ID: ${vehicleUnitId}`,
        data: vehicleUnit,
    });
    
  } catch (e) {
    console.error(`Error finding vehicle unit: ${e}`);
    return c.json({ success: false, message: "Error finding vehicle unit" }, 500);
  }
};

