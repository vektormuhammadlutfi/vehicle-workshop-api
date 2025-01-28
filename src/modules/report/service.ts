import { Context } from "hono";
import { createObjectCsvWriter } from "csv-writer";
import fs from "fs";

import prisma from "@/database";
import logger from "@/logging";
import { CsvJobStatus, WorkOrderReportParams, WorkOrder } from "@/types";
import { getReportPath } from "@/utils/storage";
import { errorUtils } from "@/modules/error/utils";

export async function generateWorkOrderReport(c: Context) {
  try {
    const params: WorkOrderReportParams = await c.req.json();
    const userId = c.get("userId");

    // Validate date parameters
    if (!params.startDate || !params.endDate) {
      return c.json(
        {
          success: false,
          message: "Start date and end date are required",
        },
        400
      );
    }

    // Create CSV job record
    const csvJob = await prisma.csv_jobs.create({
      data: {
        id: crypto.randomUUID(),
        status: CsvJobStatus.PENDING,
        params: JSON.stringify(params),
        fileName: "",
        filePath: "",
        user_created: userId,
      },
    });

    // Start processing in background
    processWorkOrderReport(csvJob.id, params);

    return c.json({
      success: true,
      message: "Report generation initiated",
      data: { jobId: csvJob.id },
    });
  } catch (error: unknown) {
    logger.app.error("Error initiating report:", {
      error: errorUtils.getErrorMessage(error),
      stack: errorUtils.isErrorWithMessage(error) ? error.stack : undefined,
    });

    return c.json(
      {
        success: false,
        message: "Failed to initiate report",
        error: errorUtils.getErrorMessage(error),
      },
      500
    );
  }
}

async function processWorkOrderReport(
  jobId: string,
  params: WorkOrderReportParams
) {
  try {
    // Update status to processing
    await prisma.csv_jobs.update({
      where: { id: jobId },
      data: { status: CsvJobStatus.PROCESSING },
    });

    // Generate filename using storage utility
    const timestamp = Date.now();
    const filename = `workorders_${params.startDate}_${params.endDate}_${timestamp}.csv`;
    const filepath = getReportPath(filename); // Using the utility function

    logger.app.info({
      message: "Starting report generation",
      jobId,
      params,
    });

    // Execute query with progress logging
    logger.app.info({
      message: "Executing database query",
      jobId,
      dateRange: { startDate: params.startDate, endDate: params.endDate },
    });

    // Execute query
    // TODO: Use relationLoadStrategy: "join"
    const workOrders = await prisma.$queryRaw<WorkOrder[]>`
         SELECT
             sw.Oid,
             sw.WorkOrderNo,
             DATE_FORMAT(sw.WorkOrderDate, '%Y-%m-%d') as WorkOrderDate,
             sw.BookingNo,
             sw.Branch,
             sw.WorkOrderStatus,
             sw.ServiceAdvisor,
             CAST(sw.TotalPartWithholdingTax AS CHAR) as TotalPartWithholdingTax,
             sw.VehicleUnit,
             sw.RepairType,
             sw.DamageCategory,
             DATE_FORMAT(sw.ServiceStartOn, '%Y-%m-%d') as ServiceStartOn,
             CAST(sw.GrossJobSales AS CHAR) as GrossJobSales,
             CAST(sw.GrossPartSales AS CHAR) as GrossPartSales,
             CAST(sw.TotalPartDiscount AS CHAR) as TotalPartDiscount,
             CAST(sw.TotalPartProgram AS CHAR) as TotalPartProgram,
             CAST(sw.TotalPartVAT AS CHAR) as TotalPartVAT,
             CAST(sw.TotalJobDiscount AS CHAR) as TotalJobDiscount,
             CAST(sw.TotalJobProgram AS CHAR) as TotalJobProgram,
             CAST(sw.TotalJobVAT AS CHAR) as TotalJobVAT,
             CAST(sw.TotalJob AS CHAR) as TotalJob,
             CAST(sw.TotalPart AS CHAR) as TotalPart,
             CAST(sw.TotalInvoice AS CHAR) as TotalInvoice,
             sw.RepairSubType,
             sw.SPKReference,
             u.first_name AS ServiceAdvisorName,
             svu.LicensePlateNumber,
             svu.FrameSerialNo,
             svu.EngineSerialNo,
             DATE_FORMAT(svu.VehicleDeliveryDate, '%Y-%m-%d') as VehicleDeliveryDate,
             svc.Description AS Color,
             svu.VehicleModel,
             svfm.VehicleFullModelName,
             cc.FirstName AS Customer,
             cc.CustomerAddress AS Street,
             cc.MobileNo AS CustomerMobileNo,
             cc.IdentificationNo,
             cc.Province,
             cc.City,
             cc.District,
             cc.CustomerType,
             cp.ContactPersonName,
             cp.MobileNo AS ContactPersonMobileNo,
             srt.RepairTypeDescription,
             cb.BranchName,
             svm.VehicleModelName,
             svb.BrandName,
             cd.DealerName,
             cd.DealerType,
             smt.Description AS MobileServiceType
         FROM service_workorder sw
         JOIN common_branch cb ON sw.Branch = cb.BranchId
         JOIN service_repairtype srt ON sw.RepairType = srt.RepairTypeId
         JOIN sales_vehicleunit svu ON sw.VehicleUnit = svu.Oid
         JOIN common_customer cc ON svu.Customer = cc.Oid
         JOIN common_dealer cd ON svu.Dealer = cd.Oid
         JOIN sales_vehiclemodel svm ON svu.VehicleModel = svm.Oid
         JOIN sales_vehiclecolor svc ON svu.Color = svc.Oid
         JOIN sales_vehiclebrand svb ON svm.Brand = svb.Oid
         LEFT JOIN service_mobileservicetype smt ON sw.MobileServiceType = smt.Oid
         JOIN sales_vehiclefullmodel svfm ON svu.VehicleFullModel = svfm.VehicleFullModelId
         LEFT JOIN common_contactperson cp ON svu.DefaultContact = cp.Oid
         LEFT JOIN users u ON sw.ServiceAdvisor = u.id
         WHERE sw.WorkOrderDate BETWEEN ${params.startDate} AND ${params.endDate}
         ORDER BY sw.WorkOrderNo ASC
     `;

    logger.app.info({
      message: "Query completed",
      jobId,
      recordCount: workOrders.length,
    });

    // Configure CSV Writer
    const csvWriter = createObjectCsvWriter({
      path: filepath,
      header: [
        { id: "Oid", title: "ID" },
        { id: "WorkOrderNo", title: "Work Order No" },
        { id: "WorkOrderDate", title: "Work Order Date" },
        { id: "BookingNo", title: "Booking No" },
        { id: "Branch", title: "Branch" },
        { id: "WorkOrderStatus", title: "Status" },
        { id: "ServiceAdvisor", title: "Service Advisor" },
        { id: "TotalPartWithholdingTax", title: "Part Withholding Tax" },
        { id: "VehicleUnit", title: "Vehicle Unit" },
        { id: "RepairType", title: "Repair Type" },
        { id: "DamageCategory", title: "Damage Category" },
        { id: "ServiceStartOn", title: "Service Start On" },
        { id: "GrossJobSales", title: "Gross Job Sales" },
        { id: "GrossPartSales", title: "Gross Part Sales" },
        { id: "TotalPartDiscount", title: "Total Part Discount" },
        { id: "TotalPartProgram", title: "Total Part Program" },
        { id: "TotalPartVAT", title: "Total Part VAT" },
        { id: "TotalJobDiscount", title: "Total Job Discount" },
        { id: "TotalJobProgram", title: "Total Job Program" },
        { id: "TotalJobVAT", title: "Total Job VAT" },
        { id: "TotalJob", title: "Total Job" },
        { id: "TotalPart", title: "Total Part" },
        { id: "TotalInvoice", title: "Total Invoice" },
        { id: "RepairSubType", title: "Repair Sub Type" },
        { id: "SPKReference", title: "SPK Reference" },
        { id: "ServiceAdvisorName", title: "Service Advisor Name" },
        { id: "LicensePlateNumber", title: "License Plate Number" },
        { id: "FrameSerialNo", title: "Frame Serial No" },
        { id: "EngineSerialNo", title: "Engine Serial No" },
        { id: "VehicleDeliveryDate", title: "Vehicle Delivery Date" },
        { id: "Color", title: "Color" },
        { id: "VehicleModel", title: "Vehicle Model" },
        { id: "VehicleFullModelName", title: "Vehicle Full Model Name" },
        { id: "Customer", title: "Customer" },
        { id: "Street", title: "Street" },
        { id: "CustomerMobileNo", title: "Customer Mobile No" },
        { id: "IdentificationNo", title: "Identification No" },
        { id: "Province", title: "Province" },
        { id: "City", title: "City" },
        { id: "District", title: "District" },
        { id: "CustomerType", title: "Customer Type" },
        { id: "ContactPersonName", title: "Contact Person Name" },
        { id: "ContactPersonMobileNo", title: "Contact Person Mobile No" },
        { id: "RepairTypeDescription", title: "Repair Type Description" },
        { id: "BranchName", title: "Branch Name" },
        { id: "VehicleModelName", title: "Vehicle Model Name" },
        { id: "BrandName", title: "Brand Name" },
        { id: "DealerName", title: "Dealer Name" },
        { id: "DealerType", title: "Dealer Type" },
        { id: "MobileServiceType", title: "Mobile Service Type" },
      ],
    });

    // Write CSV file with progress logging
    logger.app.info({
      message: "Writing CSV file",
      jobId,
      filepath,
    });

    await csvWriter.writeRecords(workOrders);

    // Get file stats
    const stats = fs.statSync(filepath);
    const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);

    // Update job record with success
    await prisma.csv_jobs.update({
      where: { id: jobId },
      data: {
        status: CsvJobStatus.COMPLETED,
        fileName: filename,
        filePath: filepath,
        fileSize: stats.size,
      },
    });

    logger.app.info({
      message: "Report generated successfully",
      jobId,
      filepath,
      recordCount: workOrders.length,
      fileSize: `${fileSizeMB} MB`,
      params,
    });
  } catch (error: unknown) {
    logger.app.error("Error processing report:", {
      error: errorUtils.getErrorMessage(error),
      jobId,
      params,
    });

    // Update job record with error
    await prisma.csv_jobs.update({
      where: { id: jobId },
      data: {
        status: CsvJobStatus.FAILED,
        error: errorUtils.getErrorMessage(error),
      },
    });

    // Optional: Clean up partially created file
    try {
      const partialFilePath = getReportPath(
        `workorders_${params.startDate}_${params.endDate}_${Date.now()}.csv`
      );
      if (fs.existsSync(partialFilePath)) {
        fs.unlinkSync(partialFilePath);
        logger.app.info(`Cleaned up partial file: ${partialFilePath}`);
      }
    } catch (cleanupError) {
      logger.app.error("Error cleaning up partial file:", cleanupError);
    }
  }
}
