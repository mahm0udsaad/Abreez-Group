"use server";

import nodemailer from "nodemailer";

export async function sendEmail({ name, email, subject, message }) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Replace with your SMTP server
    port: 587,
    secure: false,
    auth: {
      user: "saad123mn123@gmail.com",
      pass: "lblslwqqfvnezark",
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: "info@abreezgroup.com", // Replace with your email
    subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email. Please try again later.");
  }
}
