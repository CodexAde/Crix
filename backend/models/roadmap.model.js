import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  orderIndex: Number,
  content: String,
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
});

const daySchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true },
  title: { type: String, required: true },
  topics: [topicSchema],
});

const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    code: String,
    branch: String,
    year: Number,
    image: String,
    subject: {
      type: String,
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    description: String,
    duration: {
      type: Number,
      required: true,
    },
    days: [daySchema],
  },
  { timestamps: true }
);

export const Roadmap = mongoose.model("Roadmap", roadmapSchema);
