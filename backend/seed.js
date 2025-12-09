import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Subject } from './models/syllabus.model.js';
import connectDB from './db/index.js';

dotenv.config({ path: './.env' });

const seedData = async () => {
    await connectDB();

    // =========================================
    // ENGINEERING MECHANICS - KME101
    // =========================================
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
            // UNIT 2 - Fluid Mechanics and Applications
            {
                unitNumber: 2,
                title: "Introduction to Fluid Mechanics and Applications",
                chapters: [
                    {
                        title: "Fluids Properties",
                        description: "Understanding fundamental properties of fluids.",
                        orderIndex: 1,
                        topics: [
                            { title: "Pressure and Density", description: "Basic properties of fluids.", orderIndex: 1 },
                            { title: "Dynamic and Kinematic Viscosity", description: "Viscosity types and their applications.", orderIndex: 2 },
                            { title: "Specific Gravity", description: "Ratio of density to water density.", orderIndex: 3 },
                            { title: "Newtonian and Non-Newtonian Fluids", description: "Classification based on viscosity behavior.", orderIndex: 4 }
                        ]
                    },
                    {
                        title: "Fluid Mechanics Laws",
                        description: "Fundamental laws governing fluid behavior.",
                        orderIndex: 2,
                        topics: [
                            { title: "Pascal's Law", description: "Pressure transmission in fluids.", orderIndex: 1 },
                            { title: "Continuity Equation", description: "Mass conservation in fluid flow.", orderIndex: 2 },
                            { title: "Bernoulli's Equation", description: "Energy conservation in fluid flow.", orderIndex: 3 },
                            { title: "Applications of Bernoulli's Equation", description: "Venturimeter, Pitot tube, etc.", orderIndex: 4 },
                            { title: "Basic Numerical Problems", description: "Solving fluid mechanics problems.", orderIndex: 5 }
                        ]
                    }
                ]
            },
            // UNIT 3 - IC Engines and RAC
            {
                unitNumber: 3,
                title: "Introduction to IC Engines and RAC",
                chapters: [
                    {
                        title: "IC Engine Fundamentals",
                        description: "Basic components and working of Internal Combustion Engines.",
                        orderIndex: 1,
                        topics: [
                            { title: "IC Engine Basic Components", description: "Piston, cylinder, crankshaft, valves, etc.", orderIndex: 1 },
                            { title: "Construction of IC Engine", description: "Assembly and parts arrangement.", orderIndex: 2 },
                            { title: "Working of Two Stroke Engine", description: "Complete cycle in two strokes.", orderIndex: 3 },
                            { title: "Working of Four Stroke Engine", description: "Complete cycle in four strokes.", orderIndex: 4 },
                            { title: "SI and CI Engines", description: "Spark Ignition vs Compression Ignition.", orderIndex: 5 },
                            { title: "Merits and Demerits of IC Engines", description: "Advantages and disadvantages.", orderIndex: 6 },
                            { title: "Electric and Hybrid Electric Vehicles", description: "Introduction to EVs and HEVs.", orderIndex: 7 }
                        ]
                    },
                    {
                        title: "Refrigeration",
                        description: "Principles and applications of refrigeration systems.",
                        orderIndex: 2,
                        topics: [
                            { title: "Meaning and Application of Refrigeration", description: "Definition and uses.", orderIndex: 1 },
                            { title: "Unit of Refrigeration", description: "Ton of refrigeration (TR).", orderIndex: 2 },
                            { title: "Coefficient of Performance (COP)", description: "Efficiency measure of refrigeration.", orderIndex: 3 },
                            { title: "Methods of Refrigeration", description: "Various cooling techniques.", orderIndex: 4 },
                            { title: "Construction of Domestic Refrigerator", description: "Components and working.", orderIndex: 5 },
                            { title: "Concept of Heat Pump", description: "Reverse refrigeration cycle.", orderIndex: 6 },
                            { title: "Numerical Problems on Cooling Load", description: "Formula based calculations.", orderIndex: 7 }
                        ]
                    },
                    {
                        title: "Air Conditioning",
                        description: "Understanding air conditioning systems and comfort conditions.",
                        orderIndex: 3,
                        topics: [
                            { title: "Meaning and Application of Air Conditioning", description: "Definition and uses of AC.", orderIndex: 1 },
                            { title: "Humidity and Psychrometry", description: "Moisture content in air.", orderIndex: 2 },
                            { title: "Dry Bulb and Wet Bulb Temperature", description: "Temperature measurement types.", orderIndex: 3 },
                            { title: "Dew Point Temperature", description: "Condensation temperature of moisture.", orderIndex: 4 },
                            { title: "Comfort Conditions", description: "Human thermal comfort parameters.", orderIndex: 5 },
                            { title: "Construction of Window AC", description: "Components and working of window AC.", orderIndex: 6 }
                        ]
                    }
                ]
            },
            // UNIT 4 - Mechatronics
            {
                unitNumber: 4,
                title: "Introduction to Mechatronics",
                chapters: [
                    {
                        title: "Mechatronics Fundamentals",
                        description: "Evolution and scope of Mechatronics.",
                        orderIndex: 1,
                        topics: [
                            { title: "Evolution of Mechatronics", description: "History and development.", orderIndex: 1 },
                            { title: "Scope of Mechatronics", description: "Applications in modern industry.", orderIndex: 2 },
                            { title: "Advantages of Mechatronics", description: "Benefits of integrated systems.", orderIndex: 3 },
                            { title: "Disadvantages of Mechatronics", description: "Challenges and limitations.", orderIndex: 4 },
                            { title: "Industrial Applications", description: "Real-world mechatronics applications.", orderIndex: 5 },
                            { title: "Autotronics", description: "Mechatronics in automotive systems.", orderIndex: 6 },
                            { title: "Bionics", description: "Mechatronics in biological systems.", orderIndex: 7 },
                            { title: "Avionics", description: "Mechatronics in aviation systems.", orderIndex: 8 }
                        ]
                    },
                    {
                        title: "Sensors and Transducers",
                        description: "Types and applications of sensors and transducers.",
                        orderIndex: 2,
                        topics: [
                            { title: "Types of Sensors", description: "Classification of sensors.", orderIndex: 1 },
                            { title: "Types of Transducers", description: "Classification of transducers.", orderIndex: 2 },
                            { title: "Sensor Characteristics", description: "Properties and specifications.", orderIndex: 3 },
                            { title: "Transducer Characteristics", description: "Properties and performance.", orderIndex: 4 },
                            { title: "Mechanical Actuation System", description: "Overview of mechanical actuators.", orderIndex: 5 }
                        ]
                    }
                ]
            }
        ]
    };

    // =========================================
    // ENGINEERING PHYSICS - EPHY101
    // =========================================
    const physicsSubject = {
        name: "Engineering Physics",
        code: "EPHY101",
        branch: "ALL",
        year: 1,
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=2000",
        units: [
            // UNIT 1 - Relativistic Mechanics
            {
                unitNumber: 1,
                title: "Relativistic Mechanics",
                chapters: [
                    {
                        title: "Special Theory of Relativity",
                        description: "Fundamentals of Einstein's special theory of relativity.",
                        orderIndex: 1,
                        topics: [
                            { title: "Inertial & Non-Inertial Frames", description: "Reference frames in physics.", orderIndex: 1 },
                            { title: "Galilean Transformations", description: "Classical coordinate transformations.", orderIndex: 2 },
                            { title: "Michelson-Morley Experiment", description: "Famous experiment and its importance.", orderIndex: 3 },
                            { title: "Importance of Negative Results", description: "Significance of null result.", orderIndex: 4 },
                            { title: "Postulates of Special Theory of Relativity", description: "Einstein's fundamental postulates.", orderIndex: 5 },
                            { title: "Lorentz Transformations", description: "Relativistic coordinate transformations.", orderIndex: 6 }
                        ]
                    },
                    {
                        title: "Relativistic Effects",
                        description: "Consequences of special relativity.",
                        orderIndex: 2,
                        topics: [
                            { title: "Length Contraction", description: "Relativistic length shortening.", orderIndex: 1 },
                            { title: "Time Dilation", description: "Relativistic time slowing.", orderIndex: 2 },
                            { title: "Velocity Addition Theorem", description: "Adding velocities in relativity.", orderIndex: 3 },
                            { title: "Variation of Mass with Velocity", description: "Relativistic mass increase.", orderIndex: 4 },
                            { title: "Einstein's Mass Energy Relation", description: "E = mc² and its significance.", orderIndex: 5 },
                            { title: "Relation between Energy and Momentum", description: "Relativistic energy-momentum relation.", orderIndex: 6 }
                        ]
                    }
                ]
            },
            // UNIT 2 - Electromagnetic Theory
            {
                unitNumber: 2,
                title: "Electromagnetic Theory",
                chapters: [
                    {
                        title: "Electrostatics and Magnetostatics",
                        description: "Fundamental theorems and laws of E&M.",
                        orderIndex: 1,
                        topics: [
                            { title: "Gauss's Theorem of Electrostatics", description: "Electric flux and Gauss's law.", orderIndex: 1 },
                            { title: "Ampere's Law of Magnetostatics", description: "Magnetic field around current.", orderIndex: 2 },
                            { title: "Ohm's Law", description: "Relation between V, I, and R.", orderIndex: 3 },
                            { title: "Laws of Electromagnetic Induction", description: "Faraday's and Lenz's laws.", orderIndex: 4 },
                            { title: "Self and Mutual Induction", description: "Inductance concepts.", orderIndex: 5 },
                            { title: "Displacement Current", description: "Maxwell's modification to Ampere's law.", orderIndex: 6 }
                        ]
                    },
                    {
                        title: "Maxwell's Equations",
                        description: "Complete electromagnetic theory.",
                        orderIndex: 2,
                        topics: [
                            { title: "Maxwell's Equations in Free Space", description: "EM equations in vacuum.", orderIndex: 1 },
                            { title: "Maxwell's Equations in Dielectric Media", description: "EM in material media.", orderIndex: 2 },
                            { title: "Propagation of EM Waves in Free Space", description: "Wave equation and solutions.", orderIndex: 3 }
                        ]
                    }
                ]
            },
            // UNIT 3 - Wave Optics
            {
                unitNumber: 3,
                title: "Wave Optics",
                chapters: [
                    {
                        title: "Interference",
                        description: "Light interference phenomena.",
                        orderIndex: 1,
                        topics: [
                            { title: "Condition of Interference", description: "Requirements for interference.", orderIndex: 1 },
                            { title: "Necessity of Extended Sources", description: "Why extended sources are needed.", orderIndex: 2 },
                            { title: "Newton's Rings", description: "Circular interference pattern.", orderIndex: 3 },
                            { title: "Applications of Newton's Rings", description: "Practical uses of the phenomenon.", orderIndex: 4 },
                            { title: "Wedge Shaped Thin Films", description: "Interference in thin films.", orderIndex: 5 }
                        ]
                    },
                    {
                        title: "Diffraction",
                        description: "Bending of light around obstacles.",
                        orderIndex: 2,
                        topics: [
                            { title: "Fraunhofer Diffraction at Single Slit", description: "Single slit diffraction pattern.", orderIndex: 1 },
                            { title: "Fraunhofer Diffraction at Double Slit", description: "Double slit diffraction pattern.", orderIndex: 2 },
                            { title: "Diffraction Grating", description: "Multiple slit diffraction.", orderIndex: 3 },
                            { title: "Spectra with Grating", description: "Spectral analysis using gratings.", orderIndex: 4 },
                            { title: "Resolving Power of Grating", description: "Ability to separate wavelengths.", orderIndex: 5 },
                            { title: "Rayleigh's Criterion of Resolution", description: "Minimum resolvable separation.", orderIndex: 6 }
                        ]
                    },
                    {
                        title: "Laser",
                        description: "Light Amplification by Stimulated Emission of Radiation.",
                        orderIndex: 3,
                        topics: [
                            { title: "Spontaneous Emission of Radiation", description: "Natural light emission.", orderIndex: 1 },
                            { title: "Stimulated Emission of Radiation", description: "Induced light emission.", orderIndex: 2 },
                            { title: "Einstein's Coefficients", description: "A and B coefficients.", orderIndex: 3 },
                            { title: "Ruby Laser", description: "First solid-state laser.", orderIndex: 4 },
                            { title: "He-Ne Laser", description: "Common gas laser.", orderIndex: 5 },
                            { title: "Laser Applications", description: "Uses of laser technology.", orderIndex: 6 },
                            { title: "Optical Fiber", description: "Light transmission through fibers.", orderIndex: 7 },
                            { title: "Uses of Optical Fiber", description: "Applications of optical fibers.", orderIndex: 8 }
                        ]
                    }
                ]
            },
            // UNIT 4 - Quantum Mechanics
            {
                unitNumber: 4,
                title: "Quantum Mechanics",
                chapters: [
                    {
                        title: "Black Body Radiation",
                        description: "Study of thermal radiation.",
                        orderIndex: 1,
                        topics: [
                            { title: "Black Body Spectrum", description: "Radiation spectrum of black body.", orderIndex: 1 },
                            { title: "Stefan's Law", description: "Total radiant power formula.", orderIndex: 2 },
                            { title: "Wien's Law", description: "Wavelength of peak emission.", orderIndex: 3 },
                            { title: "Rayleigh-Jeans Law", description: "Classical approach to radiation.", orderIndex: 4 },
                            { title: "Planck's Law", description: "Quantum theory of radiation.", orderIndex: 5 }
                        ]
                    },
                    {
                        title: "Wave-Particle Duality",
                        description: "Dual nature of matter and radiation.",
                        orderIndex: 2,
                        topics: [
                            { title: "Wave Particle Duality", description: "Matter as waves and particles.", orderIndex: 1 },
                            { title: "Matter Waves", description: "de Broglie wavelength.", orderIndex: 2 }
                        ]
                    },
                    {
                        title: "Schrödinger Wave Equation",
                        description: "Fundamental equation of quantum mechanics.",
                        orderIndex: 3,
                        topics: [
                            { title: "Time-Dependent Schrödinger Wave Equation", description: "General Schrödinger equation.", orderIndex: 1 },
                            { title: "Time-Independent Schrödinger Wave Equation", description: "Stationary state equation.", orderIndex: 2 },
                            { title: "Interpretation of Wave Function", description: "Physical meaning of ψ.", orderIndex: 3 },
                            { title: "Particle in a One-Dimensional Box", description: "Quantum mechanics of confined particle.", orderIndex: 4 }
                        ]
                    }
                ]
            }
        ]
    };

    try {
        // Clear existing subjects to avoid duplicates during dev
        await Subject.deleteMany({ code: { $in: ["KME101", "EPHY101"] } });
        
        // Create both subjects
        await Subject.create(mechSubject);
        console.log("✅ Seeded Engineering Mechanics Data (KME101)");
        
        await Subject.create(physicsSubject);
        console.log("✅ Seeded Engineering Physics Data (EPHY101)");
        
        console.log("\n🎉 All subjects seeded successfully!");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

seedData();
