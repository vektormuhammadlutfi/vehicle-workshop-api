// src/controllers/VehicleModelController.ts

import { Context } from "hono";
import { prisma } from "../libs/prisma"; // Adjust the path according to your project structure

/**
 * Getting all vehicle models
 */
export const getVehicleModels = async (c: Context) => {
  try {
    const vehicleModels = await prisma.vehicleModel.findMany({
      orderBy: { id: "desc" },
    });
    return c.json(
      {
        success: true,
        message: "List of Vehicle Models!",
        data: vehicleModels,
      },
      200
    );
  } catch (e: unknown) {
    console.error(`Error getting vehicle models: ${e}`);
    return c.json(
      { success: false, message: "Error retrieving vehicle models" },
      500
    );
  }
};

/**
 * Creating a vehicle model
 */
export const createVehicleModel = async (c: Context) => {
  try {
    const body = await c.req.parseBody();
    const name = typeof body["name"] === "string" ? body["name"] : "";
    const brandId = typeof body["brandId"] === "string" ? body["brandId"] : "";

    const vehicleModel = await prisma.vehicleModel.create({
      data: { name, brandId },
    });

    return c.json(
      {
        success: true,
        message: "Vehicle Model Created Successfully!",
        data: vehicleModel,
      },
      201
    );
  } catch (e: unknown) {
    console.error(`Error creating vehicle model: ${e}`);
    return c.json(
      { success: false, message: "Error creating vehicle model" },
      500
    );
  }
};

/**
 * Getting a vehicle model by ID
 */
export const getVehicleModelById = async (c: Context) => {
  try {
    const modelId = c.req.param("id");
    const vehicleModel = await prisma.vehicleModel.findUnique({
      where: { id: modelId },
    });

    if (!vehicleModel) {
      return c.json(
        { success: false, message: "Vehicle Model Not Found!" },
        404
      );
    }

    return c.json(
      {
        success: true,
        message: `Detail of Vehicle Model ID: ${modelId}`,
        data: vehicleModel,
      },
      200
    );
  } catch (e: unknown) {
    console.error(`Error finding vehicle model: ${e}`);
    return c.json(
      { success: false, message: "Error finding vehicle model" },
      500
    );
  }
};

/**
 * Updating a vehicle model
 */
export const updateVehicleModel = async (c: Context) => {
  try {
    const modelId = c.req.param("id");
    const body = await c.req.parseBody();

    const name = typeof body["name"] === "string" ? body["name"] : "";
    const brandId =
      typeof body["brandId"] === "string" ? body["brandId"] : undefined;

    const vehicleModel = await prisma.vehicleModel.update({
      where: { id: modelId },
      data: { name, brandId },
    });

    return c.json(
      {
        success: true,
        message: "Vehicle Model Updated Successfully!",
        data: vehicleModel,
      },
      200
    );
  } catch (e: unknown) {
    console.error(`Error updating vehicle model: ${e}`);
    return c.json(
      { success: false, message: "Error updating vehicle model" },
      500
    );
  }
};

/**
 * Deleting a vehicle model
 */
export const deleteVehicleModel = async (c: Context) => {
  try {
    const modelId = c.req.param("id");
    await prisma.vehicleModel.delete({
      where: { id: modelId },
    });

    return c.json(
      {
        success: true,
        message: "Vehicle Model Deleted Successfully!",
      },
      200
    );
  } catch (e: unknown) {
    console.error(`Error deleting vehicle model: ${e}`);
    return c.json(
      { success: false, message: "Error deleting vehicle model" },
      500
    );
  }
};
