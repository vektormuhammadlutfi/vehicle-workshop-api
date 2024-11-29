import { Hono } from "hono";

import {
  getVehicleBrands,
  createVehicleBrand,
  getVehicleBrandById,
  updateVehicleBrand,
  deleteVehicleBrand,
} from "../controllers/brand";
import {
  getVehicleModels,
  createVehicleModel,
  getVehicleModelById,
  updateVehicleModel,
  deleteVehicleModel,
} from "../controllers/model";
import {
  getVehicleTypes,
  createVehicleType,
  getVehicleTypeById,
  updateVehicleType,
  deleteVehicleType,
} from "../controllers/type";

import {
  getCustomers,
  getCustomerById
} from '../controllers/customer';

import {
  getVehicleUnits,
  getVehicleUnitById
} from '../controllers/vehicleUnit';

// Initialize router
export const router = new Hono();

router.get("/", (c) =>
  c.json({
    message: "API Routes",
    endpoints: ["/api/vehicle-brands", "/api/vehicle-models", "/api/vehicle-types", "/api/customers", "/api/vehicle-units"],
  })
);

// Routes for vehicle brands`
router.get("/vehicle-brands", (c) => getVehicleBrands(c)); // Get all vehicle brands
router.post("/vehicle-brands", (c) => createVehicleBrand(c)); // Create a new vehicle brand
router.get("/vehicle-brands/:id", (c) => getVehicleBrandById(c)); // Get vehicle brand by ID
router.patch("/vehicle-brands/:id", (c) => updateVehicleBrand(c)); // Update vehicle brand
router.delete("/vehicle-brands/:id", (c) => deleteVehicleBrand(c)); // Delete vehicle brand

// Routes for vehicle models
router.get("/vehicle-models", (c) => getVehicleModels(c)); // Get all vehicle models
router.post("/vehicle-models", (c) => createVehicleModel(c)); // Create a new vehicle model
router.get("/vehicle-models/:id", (c) => getVehicleModelById(c)); // Get vehicle model by ID
router.patch("/vehicle-models/:id", (c) => updateVehicleModel(c)); // Update vehicle model
router.delete("/vehicle-models/:id", (c) => deleteVehicleModel(c)); // Delete vehicle model

// Routes for vehicle types
router.get("/vehicle-types", (c) => getVehicleTypes(c)); // Get all vehicle types
router.post("/vehicle-types", (c) => createVehicleType(c)); // Create a new vehicle type
router.get("/vehicle-types/:id", (c) => getVehicleTypeById(c)); // Get vehicle type by ID
router.patch("/vehicle-types/:id", (c) => updateVehicleType(c)); // Update vehicle type
router.delete("/vehicle-types/:id", (c) => deleteVehicleType(c)); // Delete vehicle type

// Routes for customers
router.get("/customers", (c) => getCustomers(c)); // Get all customers
router.get("/customers/:id", (c) => getCustomerById(c)); // Get customer by ID

router.get("/vehicle-units", (c) => getVehicleUnits(c)); // Get all vehicle units
router.get("/vehicle-units/:id", (c) => getVehicleUnitById(c)); // Get vehicle unit by ID
