import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Subject } from './models/syllabus.model.js';
import connectDB from './db/index.js';

dotenv.config({ path: './.env' });

const seedData = async () => {
    await connectDB();

    const mechSubject = {
        name: "Engineering Mechanics",
        code: "KME101",
        branch: "ME",
        year: 1,
        image: "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?auto=format&fit=crop&q=80&w=2000",
        units: [
            {
                unitNumber: 1,
                title: "Introduction to Mechanics of Solid",
                chapters: [
                    {
                        title: "Stress and Strain",
                        description: "Understanding the fundamental concepts of stress and strain in materials.",
                        orderIndex: 1,
                        topics: [
                            { title: "Normal and Shear Stress", description: "Definition and types of stress.", orderIndex: 1 },
                            { title: "Strain", description: "Longitudinal, volumetric, and shear strain.", orderIndex: 2 },
                            { title: "Hooke's Law", description: "Proportionality between stress and strain.", orderIndex: 3 },
                            { title: "Poisson's Ratio", description: "Ratio of lateral stain to longitudinal strain.", orderIndex: 4 },
                            { title: "Elastic Constants", description: "E, G, K and their relationships.", orderIndex: 5 },
                            { title: "Stress-Strain Diagram", description: "For ductile and brittle materials.", orderIndex: 6 },
                            { title: "Factor of Safety", description: "Importance in design.", orderIndex: 7 }
                        ]
                    },
                    {
                        title: "Beams and Loads",
                        description: "Analysis of beams under different loading conditions.",
                        orderIndex: 2,
                        topics: [
                            { title: "Types of Beams", description: "Cantilever, Simply Supported, Overhanging.", orderIndex: 1 },
                            { title: "Types of Loads", description: "Point load, UDL, UVL.", orderIndex: 2 },
                            { title: "Shear Force (SF)", description: "Calculation of SF at cross-sections.", orderIndex: 3 },
                            { title: "Bending Moment (BM)", description: "Calculation of BM at cross-sections.", orderIndex: 4 },
                            { title: "SF and BM Diagrams", description: "Graphical representation.", orderIndex: 5 },
                            { title: "Relation between Load, SF, BM", description: "Differential relationships.", orderIndex: 6 }
                        ]
                    }
                ]
            },
            // Placeholders for other units
            { unitNumber: 2, title: "Forces and Friction (Coming Soon)", chapters: [] },
            { unitNumber: 3, title: "Beam Trusses (Coming Soon)", chapters: [] },
            { unitNumber: 4, title: "Centroid and MOI (Coming Soon)", chapters: [] }
        ]
    };

    try {
        // Clear existing to avoid duplicates during dev
        await Subject.deleteMany({ code: "KME101" });
        await Subject.create(mechSubject);
        console.log("✅ Seeded Engineering Mechanics Data");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

seedData();
