import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Subject model - adjust path if needed
import { Subject } from '../models/syllabus.model.js';

dotenv.config({ path: "./backend/.env" });

async function checkSubjects() {
  try {
    console.log('Connecting to:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    const subjects = await Subject.find({}, 'name code branch year');
    console.log('Total Subjects in DB:', subjects.length);
    
    const yearCounts = {};
    subjects.forEach(s => {
      yearCounts[s.year] = (yearCounts[s.year] || 0) + 1;
    });
    
    console.log('Counts by Year:', yearCounts);
    console.log('Detailed Data:', JSON.stringify(subjects, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkSubjects();
