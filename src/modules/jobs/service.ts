import { Context } from "hono";
import fs from "fs";

import prisma from "@/database";
import logger from "@/logging";
import { CsvJobStatus } from "@/types";
import { errorUtils } from "@/modules/error/utils";

export async function getJobStatus(c: Context) {
  try {
    const { jobId } = c.req.param();
    const userId = c.get("userId");

    const job = await prisma.csvJobs.findFirst({
      where: {
        id: jobId,
        user_created: userId,
      },
    });

    if (!job) {
      return c.json(
        {
          success: false,
          message: "Job not found",
        },
        404
      );
    }

    return c.json({
      success: true,
      data: {
        id: job.id,
        status: job.status,
        fileName: job.fileName,
        fileSize: job.fileSize
          ? `${(Number(job.fileSize) / 1024 / 1024).toFixed(2)} MB`
          : null,
        created_at: job.created_at,
        updated_at: job.updated_at,
        error: job.error,
      },
    });
  } catch (error: unknown) {
    logger.app.error("Error fetching job status:", {
      error: errorUtils.getErrorMessage(error),
      stack: errorUtils.isErrorWithMessage(error) ? error.stack : undefined,
    });

    return c.json(
      {
        success: false,
        message: "Failed to fetch job status",
        error: errorUtils.getErrorMessage(error),
      },
      500
    );
  }
}

export async function downloadReport(c: Context) {
  try {
    const { jobId } = c.req.param();
    const userId = c.get("userId");

    const job = await prisma.csvJobs.findFirst({
      where: {
        id: jobId,
        user_created: userId,
        status: CsvJobStatus.COMPLETED,
      },
    });

    if (!job) {
      return c.json(
        {
          success: false,
          message: "Report not found or not ready",
        },
        404
      );
    }

    if (!fs.existsSync(job.filePath)) {
      return c.json(
        {
          success: false,
          message: "Report file not found",
        },
        404
      );
    }

    const fileStream = fs.createReadStream(job.filePath);
    const readableStream = new ReadableStream({
      start(controller) {
        fileStream.on("data", (chunk) => controller.enqueue(chunk));
        fileStream.on("end", () => controller.close());
        fileStream.on("error", (err) => controller.error(err));
      },
    });

    return c.newResponse(readableStream, 200, {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${job.fileName}"`,
    });
  } catch (error: unknown) {
    logger.app.error("Error downloading report:", {
      error: errorUtils.getErrorMessage(error),
      stack: errorUtils.isErrorWithMessage(error) ? error.stack : undefined,
    });

    return c.json(
      {
        success: false,
        message: "Failed to download report",
        error: errorUtils.getErrorMessage(error),
      },
      500
    );
  }
}

export async function listJobs(c: Context) {
  try {
    const userId = c.get("userId");
    const { page = "1", limit = "10" } = c.req.query();

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [jobs, total] = await Promise.all([
      prisma.csvJobs.findMany({
        where: { user_created: userId },
        orderBy: { created_at: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.csvJobs.count({
        where: { user_created: userId },
      }),
    ]);

    return c.json({
      success: true,
      data: {
        jobs: jobs.map((job) => ({
          id: job.id,
          status: job.status,
          fileName: job.fileName,
          fileSize: job.fileSize
            ? `${(Number(job.fileSize) / 1024 / 1024).toFixed(2)} MB`
            : null,
          created_at: job.created_at,
          updated_at: job.updated_at,
          error: job.error,
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error: unknown) {
    logger.app.error("Error listing jobs:", {
      error: errorUtils.getErrorMessage(error),
      stack: errorUtils.isErrorWithMessage(error) ? error.stack : undefined,
    });

    return c.json(
      {
        success: false,
        message: "Failed to list jobs",
        error: errorUtils.getErrorMessage(error),
      },
      500
    );
  }
}
