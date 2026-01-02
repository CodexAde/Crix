import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Test } from './models/test.model.js';

dotenv.config();

async function seedTest() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const topicId = "6956385115c0b58c4fc1c112"; // Metastable State
    const subjectId = "6956379a15c0b58c4fc1c103"; // Questions (Physics)

    // Delete existing test if any
    await Test.deleteMany({ referenceId: topicId });

    const newTest = await Test.create({
        title: "Metastable State - Concept Check",
        description: "A quick test to verify your understanding of Metastable States and their role in Laser action.",
        type: "topic",
        referenceId: topicId,
        subjectId: subjectId,
        questions: [
            {
                question: "What is a Metastable State?",
                options: [
                    "A state where electrons stay for a very short time (10^-8 s)",
                    "A state where electrons stay for a longer time (10^-3 s to 10^-2 s)",
                    "A state with the lowest possible energy",
                    "A state where electrons are completely free"
                ],
                correctAnswer: "A state where electrons stay for a longer time (10^-3 s to 10^-2 s)",
                explanation: "Metastable states are excited states with relatively long lifetimes compared to ordinary excited states.",
                type: "mcq"
            },
            {
                question: "Why is a Metastable state necessary for Laser action?",
                options: [
                    "To increase the temperature",
                    "To achieve Population Inversion",
                    "To decrease the number of photons",
                    "To stabilize the ground state"
                ],
                correctAnswer: "To achieve Population Inversion",
                explanation: "Without a metastable state, atoms would quickly return to the ground state, making it impossible to accumulate enough atoms in the excited state for population inversion.",
                type: "mcq"
            },
            {
                question: "The lifetime of an atom in a metastable state is approximately:",
                options: [
                    "10^-8 seconds",
                    "10^10 seconds",
                    "10^-3 seconds",
                    "10^-12 seconds"
                ],
                correctAnswer: "10^-3 seconds",
                explanation: "Standard excited states last about 10^-8 seconds, while metastable states last about 10^-3 seconds.",
                type: "mcq"
            }
        ],
        duration: 5
    });

    console.log('Test seeded successfully:', newTest.title);

    // Also seed a chapter test for LASERS
    const chapterId = "6956385115c0b58c4fc1c111";
    await Test.deleteMany({ referenceId: chapterId });
    const chapterTest = await Test.create({
        title: "LASERS - Chapter Mastery Test",
        description: "Test your complete knowledge of the LASERS chapter.",
        type: "chapter",
        referenceId: chapterId,
        subjectId: subjectId,
        questions: [
            {
                question: "What does LASER stand for?",
                options: [
                    "Light Absorption by Stimulated Emission of Radiation",
                    "Light Amplification by Stimulated Emission of Radiation",
                    "Light Amplification by Spontaneous Emission of Radiation",
                    "Light Absorption by Spontaneous Emission of Radiation"
                ],
                correctAnswer: "Light Amplification by Stimulated Emission of Radiation",
                explanation: "LASER is an acronym for Light Amplification by Stimulated Emission of Radiation.",
                type: "mcq"
            },
            {
                question: "He-Ne laser is a ________ laser.",
                options: [
                    "Solid state",
                    "Gas",
                    "Semiconductor",
                    "Liquid"
                ],
                correctAnswer: "Gas",
                explanation: "He-Ne laser uses a mixture of Helium and Neon gases as the active medium.",
                type: "mcq"
            }
        ],
        duration: 10
    });
    console.log('Chapter test seeded successfully:', chapterTest.title);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedTest();
