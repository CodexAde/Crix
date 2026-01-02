import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Subject } from './models/syllabus.model.js';

dotenv.config();

async function findIds() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const subject = await Subject.findById("6956379a15c0b58c4fc1c103");
    if (subject) {
      subject.units.forEach(u => {
        u.chapters.forEach(c => {
          console.log(`Chapter: ${c.title}, ID: ${c._id}`);
          c.topics.forEach(t => {
            console.log(`  Topic: ${t.title}, ID: ${t._id}`);
          });
        });
      });
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

findIds();
