// src/controllers/VehicleTypeController.ts

import { Context } from "hono";
import { prisma } from "../libs/prisma"; // Adjust the path according to your project structure

/**
 * Getting all vehicle types
 */
export const getVehicleTypes = async (c: Context) => {
  try {
    const vehicleTypes = await prisma.vehicleType.findMany({
      orderBy: { id: "desc" },
    });
    return c.json(
      {
        success: true,
        message: "List of Vehicle Types!",
        data: vehicleTypes,
      },
      200
    );
  } catch (e: unknown) {
    console.error(`Error getting vehicle types: ${e}`);
    return c.json(
      { success: false, message: "Error retrieving vehicle types" },
      500
    );
  }
};

/**
 * Creating a vehicle type
 */
export const createVehicleType = async (c: Context) => {
  try {
    const body = await c.req.parseBody();
    const name = typeof body["name"] === "string" ? body["name"] : "";
    const modelId = typeof body["modelId"] === "string" ? body["modelId"] : ""; // Default to 0 or another appropriate value

    const vehicleType = await prisma.vehicleType.create({
      data: { name, modelId },
    });

    return c.json(
      {
        success: true,
        message: "Vehicle Type Created Successfully!",
        data: vehicleType,
      },
      201
    );
  } catch (e: unknown) {
    console.error(`Error creating vehicle type: ${e}`);
    return c.json(
      { success: false, message: "Error creating vehicle type" },
      500
    );
  }
};

/**
 * Getting a vehicle type by ID
 */
export const getVehicleTypeById = async (c: Context) => {
  try {
    const typeId = c.req.param("id");
    const vehicleType = await prisma.vehicleType.findUnique({
      where: { id: typeId },
    });

    if (!vehicleType) {
      return c.json(
        { success: false, message: "Vehicle Type Not Found!" },
        404
      );
    }

    return c.json(
      {
        success: true,
        message: `Detail of Vehicle Type ID: ${typeId}`,
        data: vehicleType,
      },
      200
    );
  } catch (e: unknown) {
    console.error(`Error finding vehicle type: ${e}`);
    return c.json(
      { success: false, message: "Error finding vehicle type" },
      500
    );
  }
};

/**
 * Updating a vehicle type
 */
export const updateVehicleType = async (c: Context) => {
  try {
    const typeId = c.req.param("id");
    const body = await c.req.parseBody();

    const name = typeof body["name"] === "string" ? body["name"] : "";
    const modelId =
      typeof body["modelId"] === "number" ? body["modelId"] : undefined;

    const vehicleType = await prisma.vehicleType.update({
      where: { id: typeId },
      data: { name, modelId },
    });

    return c.json(
      {
        success: true,
        message: "Vehicle Type Updated Successfully!",
        data: vehicleType,
      },
      200
    );
  } catch (e: unknown) {
    console.error(`Error updating vehicle type: ${e}`);
    return c.json(
      { success: false, message: "Error updating vehicle type" },
      500
    );
  }
};

/**
 * Deleting a vehicle type
 */
export const deleteVehicleType = async (c: Context) => {
  try {
    const typeId = c.req.param("id");
    await prisma.vehicleType.delete({
      where: { id: typeId },
    });

    return c.json(
      {
        success: true,
        message: "Vehicle Type Deleted Successfully!",
      },
      200
    );
  } catch (e: unknown) {
    console.error(`Error deleting vehicle type: ${e}`);
    return c.json(
      { success: false, message: "Error deleting vehicle type" },
      500
    );
  }
};
