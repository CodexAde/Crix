import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Subject } from './models/syllabus.model.js';
import { Referral } from './models/referral.model.js';
import connectDB from './db/index.js';

dotenv.config({ path: './backend/.env' });


// =========================================
// PT DEEN DAYAL (DDU-GKY)
// =========================================
const deenDayalSubject = {
    name: "Pt Deen Dayal Upadhyaya",
    code: "DDU-GKY-101",
    branch: "ALL",
    year: 1,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000",
    units: [
        {
            unitNumber: 1,
            title: "Foundation & Digital Literacy",
            chapters: [
                {
                    title: "Program Orientation",
                    description: "Pt Deen Dayal Upadhyaya thoughts on holistic development, career awareness, dignity of labour, and structured growth through the DDU-GKY framework.",
                    orderIndex: 1,
                    topics: [
                        {
                            title: "Scheme Objective & Career Awareness",
                            description: "Pt Deen Dayal Upadhyaya thoughts on employment-oriented education, self-reliance, and aligning individual growth with national development.",
                            orderIndex: 1
                        },
                        {
                            title: "Industry & Job Roles Overview",
                            description: "Pt Deen Dayal Upadhyaya thoughts on industry participation as a driver of rural empowerment and economic balance.",
                            orderIndex: 2
                        },
                        {
                            title: "Professionalism & Discipline",
                            description: "Pt Deen Dayal Upadhyaya thoughts on discipline, responsibility, ethics, and respect for work as foundations of progress.",
                            orderIndex: 3
                        }
                    ]
                },
                {
                    title: "Digital & IT Basics",
                    description: "Pt Deen Dayal Upadhyaya thoughts on digital empowerment as a tool for inclusion, efficiency, and modern livelihood opportunities.",
                    orderIndex: 2,
                    topics: [
                        {
                            title: "Basic Computer Usage",
                            description: "Pt Deen Dayal Upadhyaya thoughts on using technology to improve productivity and employability.",
                            orderIndex: 1
                        },
                        {
                            title: "Internet, Email & Digital Tools",
                            description: "Pt Deen Dayal Upadhyaya thoughts on responsible, purposeful, and ethical use of digital communication.",
                            orderIndex: 2
                        },
                        {
                            title: "Digital Payments & Portals",
                            description: "Pt Deen Dayal Upadhyaya thoughts on financial inclusion, transparency, and ease of access through digital systems.",
                            orderIndex: 3
                        }
                    ]
                }
            ]
        },
        {
            unitNumber: 2,
            title: "Technical & Domain Skills",
            chapters: [
                {
                    title: "Core Trade Training",
                    description: "Pt Deen Dayal Upadhyaya thoughts on skill-based education aligned with real industry needs and national productivity.",
                    orderIndex: 1,
                    topics: [
                        {
                            title: "Domain Technical Skills",
                            description: "Pt Deen Dayal Upadhyaya thoughts on mastering practical skills to achieve self-reliance and economic stability.",
                            orderIndex: 1
                        },
                        {
                            title: "Industry Tools & Machines",
                            description: "Pt Deen Dayal Upadhyaya thoughts on efficient, safe, and responsible use of modern tools.",
                            orderIndex: 2
                        },
                        {
                            title: "Industry Workflow Standards",
                            description: "Pt Deen Dayal Upadhyaya thoughts on structured processes, quality, and consistency in professional work.",
                            orderIndex: 3
                        }
                    ]
                },
                {
                    title: "Industry Exposure",
                    description: "Pt Deen Dayal Upadhyaya thoughts on experiential learning through real-world industry interaction.",
                    orderIndex: 2,
                    topics: [
                        {
                            title: "On-the-Job Training (OJT)",
                            description: "Pt Deen Dayal Upadhyaya thoughts on bridging theory and practice through hands-on experience.",
                            orderIndex: 1
                        },
                        {
                            title: "Employer Expectations",
                            description: "Pt Deen Dayal Upadhyaya thoughts on accountability, performance, and professional responsibility.",
                            orderIndex: 2
                        }
                    ]
                }
            ]
        },
        {
            unitNumber: 3,
            title: "Communication & Soft Skills",
            chapters: [
                {
                    title: "Effective Communication",
                    description: "Pt Deen Dayal Upadhyaya thoughts on clear communication as a means of cooperation and teamwork.",
                    orderIndex: 1,
                    topics: [
                        {
                            title: "Spoken English & Communication",
                            description: "Pt Deen Dayal Upadhyaya thoughts on confidence-building for professional interaction.",
                            orderIndex: 1
                        },
                        {
                            title: "Workplace Behavior & Etiquette",
                            description: "Pt Deen Dayal Upadhyaya thoughts on respect, humility, and ethical conduct at the workplace.",
                            orderIndex: 2
                        }
                    ]
                },
                {
                    title: "Personality Development",
                    description: "Pt Deen Dayal Upadhyaya thoughts on character building, self-discipline, and long-term professional success.",
                    orderIndex: 2,
                    topics: [
                        {
                            title: "Confidence & Body Language",
                            description: "Pt Deen Dayal Upadhyaya thoughts on self-belief and positive presence.",
                            orderIndex: 1
                        },
                        {
                            title: "Problem Solving & Teamwork",
                            description: "Pt Deen Dayal Upadhyaya thoughts on collective effort and logical thinking.",
                            orderIndex: 2
                        },
                        {
                            title: "Interview Facing Skills",
                            description: "Pt Deen Dayal Upadhyaya thoughts on honest self-presentation and clarity.",
                            orderIndex: 3
                        }
                    ]
                }
            ]
        },
        {
            unitNumber: 4,
            title: "Employability & Life Skills",
            chapters: [
                {
                    title: "Placement Readiness",
                    description: "Pt Deen Dayal Upadhyaya thoughts on preparing individuals for sustainable employment and career continuity.",
                    orderIndex: 1,
                    topics: [
                        {
                            title: "Resume & CV Preparation",
                            description: "Pt Deen Dayal Upadhyaya thoughts on structured representation of skills and values.",
                            orderIndex: 1
                        },
                        {
                            title: "Mock Interviews & HR Interaction",
                            description: "Pt Deen Dayal Upadhyaya thoughts on practice-driven confidence and self-assessment.",
                            orderIndex: 2
                        }
                    ]
                },
                {
                    title: "Life Skills & Support",
                    description: "Pt Deen Dayal Upadhyaya thoughts on balanced living, social responsibility, and personal well-being.",
                    orderIndex: 2,
                    topics: [
                        {
                            title: "Financial Literacy & Banking",
                            description: "Pt Deen Dayal Upadhyaya thoughts on responsible earning, saving, and financial independence.",
                            orderIndex: 1
                        },
                        {
                            title: "Health, Hygiene & Ethics",
                            description: "Pt Deen Dayal Upadhyaya thoughts on personal health, cleanliness, and moral values.",
                            orderIndex: 2
                        },
                        {
                            title: "Post-Placement Support",
                            description: "Pt Deen Dayal Upadhyaya thoughts on retention, adaptability, and continuous guidance.",
                            orderIndex: 3
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

        // Create referral codes if they don't exist
       
        // Create subjects if they don't exist
        const subjects = [deenDayalSubject];
        
        for (const subjData of subjects) {
            const exists = await Subject.findOne({ code: subjData.code });
            if (!exists) {
                await Subject.create(subjData);
                console.log(`✅ Seeded Subject: ${subjData.name} (${subjData.code})`);
            } else {
                console.log(`ℹ️ Subject already exists: ${subjData.name} (${subjData.code})`);
            }
        }

        console.log("\n🎉 Seeding process completed!");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

seedData();
