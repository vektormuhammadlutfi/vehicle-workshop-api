//import context
import { Context } from "hono";

//import { prisma }client
import { prisma } from "../libs/prisma";

/**
 * Getting all vehicle brands
 */
// export const getVehicleBrands = async (c: Context) => {
//     try {
//         // Get all vehicle brands
//         const vehicleBrands = await prisma.vehicleBrand.findMany({ orderBy: { id: 'desc' } });

//         // Return JSON
//         return c.json({
//             success: true,
//             message: 'List of Vehicle Brands!',
//             data: vehicleBrands
//         }, 200);

//     } catch (e: unknown) {
//         console.error(`Error getting vehicle brands: ${e}`);
//         return c.json({ success: false, message: 'Error retrieving vehicle brands' }, 500);
//     }
// }

export const getVehicleBrands = async (c: Context) => {
  try {
    // Get the query parameters for pagination
    const page = parseInt(c.req.query("page") || "1"); // Default to page 1
    const limit = parseInt(c.req.query("limit") || "10"); // Default limit to 10

    // Calculate the offset for pagination
    const offset = (page - 1) * limit;

    // Get paginated vehicle brands
    const vehicleBrands = await prisma.vehicleBrand.findMany({
      skip: offset, // Skip offset records
      take: limit, // Limit the number of records returned
      orderBy: { id: "desc" }, // Order by id descending
    });

    // Get the total count of vehicle brands for total pages
    const totalCount = await prisma.vehicleBrand.count();

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Return JSON
    return c.json(
      {
        success: true,
        message: "List of Vehicle Brands!",
        data: {
          vehicleBrands,
          pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalCount: totalCount,
            limit: limit,
          },
        },
      },
      200
    );
  } catch (e: unknown) {
    console.error(`Error getting vehicle brands: ${e}`);
    return c.json(
      { success: false, message: "Error retrieving vehicle brands" },
      500
    );
  }
};

/**
 * Creating a vehicle brand
 */
export const createVehicleBrand = async (c: Context) => {
  try {
    // Get body request
    const body = await c.req.parseBody();

    // Check if name is a string
    const name = typeof body["name"] === "string" ? body["name"] : "";

    // Create vehicle brand
    const vehicleBrand = await prisma.vehicleBrand.create({
      data: { name },
    });

    // Return JSON
    return c.json(
      {
        success: true,
        message: "Vehicle Brand Created Successfully!",
        data: vehicleBrand,
      },
      201
    );
  } catch (e: unknown) {
    console.error(`Error creating vehicle brand: ${e}`);
    return c.json(
      { success: false, message: "Error creating vehicle brand" },
      500
    );
  }
};

/**
 * Getting a vehicle brand by ID
 */
export const getVehicleBrandById = async (c: Context) => {
  try {
    // Convert id to number
    const brandId = c.req.param("id");

    // Get vehicle brand by id
    const vehicleBrand = await prisma.vehicleBrand.findUnique({
      where: { id: brandId },
    });

    // If vehicle brand not found
    if (!vehicleBrand) {
      // Return JSON
      return c.json(
        {
          success: false,
          message: "Vehicle Brand Not Found!",
        },
        404
      );
    }

    // Return JSON
    return c.json(
      {
        success: true,
        message: `Detail Data Vehicle Brand By ID: ${brandId}`,
        data: vehicleBrand,
      },
      200
    );
  } catch (e: unknown) {
    console.error(`Error finding vehicle brand: ${e}`);
    return c.json(
      { success: false, message: "Error finding vehicle brand" },
      500
    );
  }
};

/**
 * Updating a vehicle brand
 */
export const updateVehicleBrand = async (c: Context) => {
  try {
    // Convert id to number
    const brandId = c.req.param("id");

    // Get body request
    const body = await c.req.parseBody();

    // Check if name is a string
    const name = typeof body["name"] === "string" ? body["name"] : "";

    // Update vehicle brand with Prisma
    const vehicleBrand = await prisma.vehicleBrand.update({
      where: { id: brandId },
      data: { name },
    });

    // Return JSON
    return c.json(
      {
        success: true,
        message: "Vehicle Brand Updated Successfully!",
        data: vehicleBrand,
      },
      200
    );
  } catch (e: unknown) {
    console.error(`Error updating vehicle brand: ${e}`);
    return c.json(
      { success: false, message: "Error updating vehicle brand" },
      500
    );
  }
};

/**
 * Deleting a vehicle brand
 */
export const deleteVehicleBrand = async (c: Context) => {
  try {
    // Convert id to number
    const brandId = c.req.param("id");

    // Delete vehicle brand with Prisma
    await prisma.vehicleBrand.delete({
      where: { id: brandId },
    });

    // Return JSON
    return c.json(
      {
        success: true,
        message: "Vehicle Brand Deleted Successfully!",
      },
      200
    );
  } catch (e: unknown) {
    console.error(`Error deleting vehicle brand: ${e}`);
    return c.json(
      { success: false, message: "Error deleting vehicle brand" },
      500
    );
  }
};
