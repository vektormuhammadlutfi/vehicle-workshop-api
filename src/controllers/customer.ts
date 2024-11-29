// Import context
import { Context } from "hono";

// Import Prisma client
import { prisma } from "../libs/prisma";

/**
 * Getting all customers with pagination
 */
export const getCustomers = async (c: Context) => {
  try {
    // Get the query parameters for pagination
    const page = parseInt(c.req.query("page") || "1"); // Default to page 1
    const limit = parseInt(c.req.query("limit") || "10"); // Default limit to 10

    // Calculate the offset for pagination
    const offset = (page - 1) * limit;

    // Get paginated customers
    const customers = await prisma.customer.findMany({
      skip: offset, // Skip offset records
      take: limit, // Limit the number of records returned
      orderBy: { id: "desc" }, // Order by id descending
    });

    // Get the total count of customers for total pages
    const totalCount = await prisma.customer.count();

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Return JSON
    return c.json(
      {
        success: true,
        message: "List of Customers!",
        data: {
          customers,
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
  } catch (e) {
    console.error(`Error getting customers: ${e}`);
    return c.json(
      { success: false, message: "Error retrieving customers" },
      500
    );
  }
};

/**
 * Getting a customer by ID
 */
export const getCustomerById = async (c: Context) => {
  try {
    const customerId = c.req.param("id");

    // Get customer by id
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    // If customer not found
    if (!customer) {
      return c.json(
        {
          success: false,
          message: "Customer Not Found!",
        },
        404
      );
    }

    // Return JSON
    return c.json(
      {
        success: true,
        message: `Detail Data Customer By ID: ${customerId}`,
        data: customer,
      },
      200
    );
  } catch (e) {
    console.error(`Error finding customer: ${e}`);
    return c.json(
      { success: false, message: "Error finding customer" },
      500
    );
  }
};
