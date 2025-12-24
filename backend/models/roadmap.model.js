import mongoose from "mongoose";

const stepSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  topic: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
});

const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    duration: {
      type: Number,
      required: true,
    },
    steps: [stepSchema],
  },
  { timestamps: true }
);

export const Roadmap = mongoose.model("Roadmap", roadmapSchema);
