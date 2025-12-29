import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Subject } from './models/syllabus.model.js';

dotenv.config();

const fetchSyllabus = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        const subjects = await Subject.find({});
        console.log("--- SYLLABUS DATA ---");
        subjects.forEach(subject => {
            console.log(`Subject: ${subject.name} (${subject._id})`);
            subject.units.forEach(unit => {
                console.log(`  Unit ${unit.unitNumber}: ${unit.title}`);
                unit.chapters.forEach(chapter => {
                    console.log(`    Chapter: ${chapter.title} (${chapter._id})`);
                    chapter.topics.forEach(topic => {
                        console.log(`      Topic: ${topic.title} (${topic._id})`);
                    });
                });
            });
        });
        
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error("Error fetching syllabus:", error);
    }
};

fetchSyllabus();
