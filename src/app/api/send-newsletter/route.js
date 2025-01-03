import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { parse } from "csv-parse/sync";
import path from "path";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req) {
  try {
    const body = await req.json();
    const { content } = body;

    const csvPath = path.join(
      process.cwd(),
      "data",
      "newsletter-responses2.csv"
    );
    const csvContent = await fs.readFile(csvPath, "utf-8");
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    const subscribers = records
      .filter((record) => record["Your Email address"]?.trim())
      .map((record) => ({
        name:
          record["Name you'll like to be addressed as"]?.trim() || "Subscriber",
        email: record["Your Email address"].trim(),
      }));

    let sentCount = 0;
    let errorCount = 0;
    const errors = [];

    const batchSize = 10;

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);

      try {
        await Promise.all(
          batch.map((subscriber) =>
            transporter.sendMail({
              from: process.env.FROM_EMAIL,
              to: subscriber.email,
              subject: "Stories by Riri",
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <p>Hello ${subscriber.name},</p>
                  <p>${content}</p>
                </div>
              `,
            })
          )
        );
        sentCount += batch.length;
      } catch (error) {
        console.error("Batch error:", error);
        errorCount += batch.length;
        batch.forEach((subscriber) => {
          errors.push({
            email: subscriber.email,
            error: error instanceof Error ? error.message : String(error),
          });
        });

        if (errorCount > 5) {
          throw new Error("Too many errors encountered, stopping the process.");
        }
      }
    }

    if (errorCount > 0) {
      return NextResponse.json(
        {
          partialSuccess: true,
          sentCount,
          errorCount,
          errors,
        },
        { status: 207 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Newsletter sent successfully to ${sentCount} subscribers.`,
        sentCount: sentCount,
        totalSubscribers: subscribers.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in sending newsletter:", error);
    return NextResponse.json(
      {
        error: "Failed to send newsletter",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
