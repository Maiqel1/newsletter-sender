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

    for (const subscriber of subscribers) {
      const personalizedContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p>Hello ${subscriber.name},</p>
          <p class="mt-3">${content}</p>
           
        </div>
      `;

      try {
        await Promise.all(
          batch.map((subscriber) =>
            transporter.sendMail({
              from: process.env.FROM_EMAIL,
              to: subscriber.email,
              subject: "Newsletter Update",
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
        // await delay(5000);
      } catch (error) {
        console.error(`Failed to send email to ${subscriber.email}:`, error);
        console.error("Batch error:", error);
        errorCount += batch.length;
        // errorCount++;
        errors.push({
          email: subscriber.email,
          error: error instanceof Error ? error.message : String(error),
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
