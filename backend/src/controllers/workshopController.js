import WorkshopRequest from "../models/WorkshopRequest.js";
import User from "../models/User.js";
import { sendEmail } from "../config/brevo.js";

export const createWorkshopRequest = async (req, res) => {
  try {
    const { name, email, phone, requirement } = req.body;

    const request = await WorkshopRequest.create({
      name,
      email,
      phone,
      requirement,
    });

    // 🔔 Send Email To All Admins
    const admins = await User.find({ role: "admin" });

    const htmlContent = `
      <h2>New Workshop Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Requirement:</strong></p>
      <p>${requirement}</p>
      <p><strong>Submitted On:</strong> ${new Date().toLocaleString()}</p>
    `;

    for (const admin of admins) {
      if (admin.email) {
        await sendEmail({
          to: admin.email,
          subject: "🛠️ New Workshop Custom Furniture Request",
          html: htmlContent,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "Workshop request submitted successfully",
    });

  } catch (error) {
    console.error("Workshop Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit workshop request",
    });
  }
};