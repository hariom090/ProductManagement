import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // make sure this is at the very top

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS 
  }
});

export const sendAdminMail = async (email, fullName, role, password) => {
  try {
    const info = await transporter.sendMail({
      from: `"APSA Admin" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Admin Account Credentials",
      text: `Hello ${fullName},\n\nYou are added as ${role}.\nLogin details:\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after first login.`
    });
    console.log("✅ Mail sent:", info.messageId);
  } catch (err) {
    console.error("❌ Mail error:", err.message);
  }
};
