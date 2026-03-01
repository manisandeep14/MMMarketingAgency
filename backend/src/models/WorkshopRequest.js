import mongoose from "mongoose";

const workshopRequestSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    requirement: String,
  },
  { timestamps: true }
);

export default mongoose.model("WorkshopRequest", workshopRequestSchema);