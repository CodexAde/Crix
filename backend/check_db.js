import mongoose from "mongoose";
import dotenv from "dotenv";
import { Subject } from "./models/syllabus.model.js";

dotenv.config();

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const subjects = await Subject.find({}, "_id name code branch year");
    console.log("Subjects in DB:");
    subjects.forEach(s => {
      console.log(`- ${s.name} (${s.code}) | ID: ${s._id} | Branch: ${s.branch} | Year: ${s.year}`);
    });
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

checkDB();
