import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { content } = body;
    const subscribers = [
      { name: "Riri", email: "oyeboderejoice@gmail.com" },
      { name: "Michael", email: "michaelolowe321@gmail.com" },
    ];

    for (const subscriber of subscribers) {
      const personalizedContent = `
        <p>Hello, ${subscriber.name},</p>
        <p className="mt-3">${content}</p>
      `;

      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: subscriber.email,
        subject: "Newsletter Update",
        html: personalizedContent,
      });
    }

    return NextResponse.json(
      { message: "Newsletter sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending newsletter:", error);
    return NextResponse.json(
      { error: "Failed to send newsletter" },
      { status: 500 }
    );
  }
}
