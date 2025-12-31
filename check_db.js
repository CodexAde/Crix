import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Subject } from './backend/models/syllabus.model.js';

dotenv.config();

async function checkSubjects() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    const subjects = await Subject.find({}, 'name code branch year');
    console.log('Total Subjects:', subjects.length);
    console.log('Subjects:', JSON.stringify(subjects, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSubjects();
