import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Subject } from './models/syllabus.model.js';
import { Referral } from './models/referral.model.js';
import connectDB from './db/index.js';

dotenv.config({ path: './backend/.env' });


// =========================================
// PT DEEN DAYAL (DDU-GKY)
// =========================================
const BriefDeenDayalSubject = {
    name: "Short notes of Pt Deen Dayal",
    code: "DDU-GKY-101",
    branch: "ALL",
    year: 1,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000",
    units: [
        {
            unitNumber: 1,
            title: "Foundation, Digital Literacy & Core Skills",
            chapters: [
                {
                    title: "Program Orientation & Digital Basics",
                    description: "Pt Deen Dayal Upadhyaya thoughts on holistic development, employment-oriented education, dignity of labour, self-reliance, and digital empowerment for inclusive growth under the DDU-GKY framework.",
                    orderIndex: 1,
                    topics: [
                        {
                            title: "Scheme Objective, Career Awareness & Industry Overview",
                            description: "Pt Deen Dayal Upadhyaya thoughts on aligning individual growth with national development, industry participation, rural empowerment, and economic balance.",
                            orderIndex: 1
                        },
                        {
                            title: "Professionalism, Discipline & Work Ethics",
                            description: "Pt Deen Dayal Upadhyaya thoughts on discipline, responsibility, ethics, respect for work, and structured growth.",
                            orderIndex: 2
                        },
                        {
                            title: "Digital & IT Fundamentals",
                            description: "Pt Deen Dayal Upadhyaya thoughts on basic computer usage, internet, email, digital tools, digital payments, financial inclusion, transparency, and ethical digital communication.",
                            orderIndex: 3
                        }
                    ]
                },
                {
                    title: "Technical & Industry Skills",
                    description: "Pt Deen Dayal Upadhyaya thoughts on skill-based education aligned with real industry needs, productivity, and experiential learning.",
                    orderIndex: 2,
                    topics: [
                        {
                            title: "Domain Skills, Tools & Workflow Standards",
                            description: "Pt Deen Dayal Upadhyaya thoughts on mastering practical skills, efficient and safe use of tools, quality standards, and consistency in professional work.",
                            orderIndex: 1
                        },
                        {
                            title: "Industry Exposure & On-the-Job Training",
                            description: "Pt Deen Dayal Upadhyaya thoughts on bridging theory and practice through real-world industry interaction and hands-on experience.",
                            orderIndex: 2
                        }
                    ]
                }
            ]
        },
        {
            unitNumber: 2,
            title: "Communication, Employability & Life Skills",
            chapters: [
                {
                    title: "Communication & Personality Development",
                    description: "Pt Deen Dayal Upadhyaya thoughts on communication, cooperation, character building, self-discipline, and ethical workplace conduct.",
                    orderIndex: 1,
                    topics: [
                        {
                            title: "Professional Communication & Workplace Etiquette",
                            description: "Pt Deen Dayal Upadhyaya thoughts on spoken English, confidence, respectful behavior, humility, and teamwork.",
                            orderIndex: 1
                        },
                        {
                            title: "Personality, Problem Solving & Interview Skills",
                            description: "Pt Deen Dayal Upadhyaya thoughts on self-belief, body language, logical thinking, honest self-presentation, and clarity.",
                            orderIndex: 2
                        }
                    ]
                },
                {
                    title: "Employability, Life Skills & Post-Placement Support",
                    description: "Pt Deen Dayal Upadhyaya thoughts on sustainable employment, balanced living, social responsibility, and long-term career stability.",
                    orderIndex: 2,
                    topics: [
                        {
                            title: "Placement Readiness & HR Interaction",
                            description: "Pt Deen Dayal Upadhyaya thoughts on resume preparation, structured representation of skills, mock interviews, and practice-driven confidence.",
                            orderIndex: 1
                        },
                        {
                            title: "Financial Literacy, Health, Ethics & Retention",
                            description: "Pt Deen Dayal Upadhyaya thoughts on responsible earning, saving, personal health, hygiene, moral values, adaptability, and continuous guidance after placement.",
                            orderIndex: 2
                        }
                    ]
                }
            ]
        }
    ]
};



const seedData = async () => {
    try {
        await connectDB();

        // NO DELETE MANY - As per user request
        console.log("ℹ️ Skipping deleteMany commands as per user instructions.");

        // Create subjects if they don't exist, or update if they do
        const subjects = [BriefDeenDayalSubject];
        
        for (const subjData of subjects) {
            const exists = await Subject.findOne({ code: subjData.code });
            if (!exists) {
                await Subject.create(subjData);
                console.log(`✅ Seeded Subject: ${subjData.name} (${subjData.code})`);
            } else {
                await Subject.findOneAndUpdate({ code: subjData.code }, subjData);
                console.log(`🔄 Updated Subject: ${subjData.name} (${subjData.code})`);
            }
        }

        console.log("\n🎉 Seeding/Updating process completed!");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

seedData();
