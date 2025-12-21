import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Subject } from './models/syllabus.model.js';
import connectDB from './db/index.js';

dotenv.config({ path: './.env' });

const seedYogaData = async () => {
    await connectDB();

    const yogaSubject = {
        name: "Physical Fitness and Recreation",
        code: "SE 1PED",
        branch: "ALL",
        year: 1,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=2000",
        units: [
            {
                unitNumber: 1,
                title: "Introduction to body conditioning",
                chapters: [
                    {
                        title: "Body Conditioning Basics",
                        description: "Fundamentals of body conditioning and physical fitness.",
                        orderIndex: 1,
                        topics: [
                            { title: "Introduction to body conditioning", description: "Overview of body conditioning principles.", orderIndex: 1 },
                            { title: "Concept of body conditioning and fitness", description: "Understanding the relationship between conditioning and overall fitness.", orderIndex: 2 },
                            { title: "Warm up exercises", description: "Importance and types of warm-up routines.", orderIndex: 3 },
                            { title: "Relaxation / cooling down exercises", description: "Techniques for recovery after physical activity.", orderIndex: 4 },
                            { title: "Learning different types of exercises", description: "Exploration of various exercise modalities.", orderIndex: 5 }
                        ]
                    }
                ]
            },
            {
                unitNumber: 2,
                title: "Recreational Activities",
                chapters: [
                    {
                        title: "Recreation and Games",
                        description: "Importance of recreation and participation in various games.",
                        orderIndex: 1,
                        topics: [
                            { title: "Need and importance of recreational activities", description: "Why recreation is essential for health and well-being.", orderIndex: 1 },
                            { title: "Participation in minor games and sports activities", description: "Engaging in basic competitive and recreational sports.", orderIndex: 2 },
                            { title: "Participation in Indigenous sports activities", description: "Traditional and local sports participation.", orderIndex: 3 }
                        ]
                    }
                ]
            },
            {
                unitNumber: 3,
                title: "Physical Fitness",
                chapters: [
                    {
                        title: "Fitness and Yoga",
                        description: "Deep dive into physical fitness components and Yogic practices.",
                        orderIndex: 1,
                        topics: [
                            { title: "Need and importance of physical fitness", description: "The role of fitness in a healthy lifestyle.", orderIndex: 1 },
                            { title: "Components of physical fitness and motor fitness", description: "Analysis of strength, endurance, flexibility, etc.", orderIndex: 2 },
                            { title: "Participation in Yogic activities/asanas/pranayama", description: "Practical application of Yoga, postures, and breathing techniques.", orderIndex: 3 }
                        ]
                    }
                ]
            }
        ]
    };

    try {
        // Clear existing Yoga subject if any
        await Subject.deleteMany({ code: "SE 1PED" });
        
        // Create the subject
        await Subject.create(yogaSubject);
        console.log("✅ Seeded Yoga Syllabus Data (SE 1PED)");
        
        console.log("\n🎉 Yoga syllabus seeded successfully!");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

seedYogaData();
