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
            title: "Philosophy of Integral Humanism",
            chapters: [
                {
                    title: "Holistic View of Life",
                    description: "Understanding the organic unity of individual, society, and nature.",
                    orderIndex: 1,
                    topics: [
                        { title: "Organic Unity Concept", description: "Refuting fragmented views of life components.", orderIndex: 1 },
                        { title: "Body, Mind & Soul", description: "The triad of human existence in Deen Dayal's view.", orderIndex: 2 },
                        { title: "Global Holistic Vision", description: "Universal application of integral thoughts.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Four Purusharthas",
                    description: "The fundamental goals of human life: Dharma, Artha, Kama, Moksha.",
                    orderIndex: 2,
                    topics: [
                        { title: "Dharma as Foundation", description: "Ethical conduct and social laws.", orderIndex: 1 },
                        { title: "Artha & Kama Balance", description: "Regulated pursuit of wealth and desires.", orderIndex: 2 },
                        { title: "Moksha - The Ultimate Goal", description: "Spiritual liberation in daily actions.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Critique of Modern Systems",
                    description: "Pt Deen Dayal's analysis of Capitalism and Socialism.",
                    orderIndex: 3,
                    topics: [
                        { title: "Capitalism Critique", description: "Inherent flaws in extreme individualism.", orderIndex: 1 },
                        { title: "Socialism Critique", description: "Neglect of individual freedom in collectivism.", orderIndex: 2 },
                        { title: "Third Path (Integralism)", description: "Alternative to Western binary models.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Indigenous Economic Model",
                    description: "Developing an economy based on local culture and resources.",
                    orderIndex: 4,
                    topics: [
                        { title: "Decentralized Growth", description: "Empowering rural and small-scale sectors.", orderIndex: 1 },
                        { title: "Swadeshi Principles", description: "Self-reliance and local production focus.", orderIndex: 2 },
                        { title: "Man-centric Economy", description: "Human welfare over profit maximization.", orderIndex: 3 }
                    ]
                },
                {
                    title: "National Identity & Chiti",
                    description: "The concept of collective consciousness of a nation.",
                    orderIndex: 5,
                    topics: [
                        { title: "Concept of Chiti", description: "The soul of the nation and its uniqueness.", orderIndex: 1 },
                        { title: "Virat - National Vitality", description: "The energy that drives a culture forward.", orderIndex: 2 },
                        { title: "Dharma of a Nation", description: "The unique path of national development.", orderIndex: 3 }
                    ]
                }
            ]
        },
        {
            unitNumber: 2,
            title: "Social and Cultural Vision",
            chapters: [
                {
                    title: "Social Samarasata",
                    description: "Equality and harmony in the social structure.",
                    orderIndex: 1,
                    topics: [
                        { title: "Social Harmony Concept", description: "Overcoming caste and class barriers.", orderIndex: 1 },
                        { title: "Untouchability Critique", description: "Pt Deen Dayal's stance against social evils.", orderIndex: 2 },
                        { title: "Dignity for All", description: "Respect for every individual's contribution.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Family as a Building Block",
                    description: "The role of family in sustaining culture and values.",
                    orderIndex: 2,
                    topics: [
                        { title: "Family Values", description: "Learning cooperation and sacrifice at home.", orderIndex: 1 },
                        { title: "Social Security via Family", description: "Family as a natural safety net.", orderIndex: 2 },
                        { title: "Modern Family Challenges", description: "Preserving values in urban settings.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Cultural Nationalism",
                    description: "Bharatiya identity based on shared heritage.",
                    orderIndex: 3,
                    topics: [
                        { title: "Roots of Culture", description: "Historical continuity and civilizational pride.", orderIndex: 1 },
                        { title: "Language & Identity", description: "Role of mother tongue in national growth.", orderIndex: 2 },
                        { title: "National Symbols", description: "Respect for the flag, anthem, and history.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Youth & National Character",
                    description: "Developing Samskaras among the younger generation.",
                    orderIndex: 4,
                    topics: [
                        { title: "Role of Youth", description: "Builders of tomorrow's Bharat.", orderIndex: 1 },
                        { title: "Discipline & Service", description: "Values of hard work and selflessness.", orderIndex: 2 },
                        { title: "Leadership Qualities", description: "Integrity and vision in youth leaders.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Antyodaya - The Last Mile",
                    description: "The philosophy of serving the poorest person first.",
                    orderIndex: 5,
                    topics: [
                        { title: "Antyodaya Meaning", description: "Rise of the last person in the line.", orderIndex: 1 },
                        { title: "Service as Worship", description: "Dharma of serving the needy.", orderIndex: 2 },
                        { title: "Policy Focus", description: "Directing state resources to the bottom layer.", orderIndex: 3 }
                    ]
                }
            ]
        },
        {
            unitNumber: 3,
            title: "Political and Economic Thoughts",
            chapters: [
                {
                    title: "Concept of Dharma Rajya",
                    description: "Rule of Law and morality in governance.",
                    orderIndex: 1,
                    topics: [
                        { title: "State vs Dharma", description: "State as an instrument of Dharma.", orderIndex: 1 },
                        { title: "Limits of Power", description: "Ethical boundaries for rulers.", orderIndex: 2 },
                        { title: "Public Welfare (Lok Kalyan)", description: "The primary duty of the state.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Democracy & Representation",
                    description: "Decentralized power and true representation.",
                    orderIndex: 2,
                    topics: [
                        { title: "Panchayati Raj", description: "Base-level democracy and empowering villages.", orderIndex: 1 },
                        { title: "Accountability", description: "Responsibility of representatives to people.", orderIndex: 2 },
                        { title: "Voting & Dharma", description: "Voting as a moral duty.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Right to Work",
                    description: "Economics of full employment and dignity of labour.",
                    orderIndex: 3,
                    topics: [
                        { title: "Employment as Right", description: "Economic security for every hand.", orderIndex: 1 },
                        { title: "Small Scale Industry", description: "The engine of mass employment.", orderIndex: 2 },
                        { title: "Work Ethics", description: "Respect for physical and manual labour.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Resource Management",
                    description: "Sustainability and ethical use of resources.",
                    orderIndex: 4,
                    topics: [
                        { title: "Need vs Greed", description: "Balanced consumption model.", orderIndex: 1 },
                        { title: "Rural Wealth", description: "Stopping migration via rural prosperity.", orderIndex: 2 },
                        { title: "Energy & Nature", description: "Eco-friendly industrialization.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Global Order Vision",
                    description: "Vasudhaiva Kutumbakam: The world as one family.",
                    orderIndex: 5,
                    topics: [
                        { title: "Universal Brotherhood", description: "Beyond narrow geophysics.", orderIndex: 1 },
                        { title: "Global Peace", description: "Peace through integral understanding.", orderIndex: 2 },
                        { title: "Cultural Exchange", description: "Sharing values globally with pride.", orderIndex: 3 }
                    ]
                }
            ]
        },
        {
            unitNumber: 4,
            title: "Educational and Professional Vision",
            chapters: [
                {
                    title: "Gurukul & Modernity",
                    description: "Blending traditional values with modern science.",
                    orderIndex: 1,
                    topics: [
                        { title: "Value-based Education", description: "Character building in schools.", orderIndex: 1 },
                        { title: "Scientific Temper", description: "Encouraging inquiry and innovation.", orderIndex: 2 },
                        { title: "Teacher's Role", description: "Gurudeo as a mentor and guide.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Vocational Skills",
                    description: "Education for self-reliance and jobs.",
                    orderIndex: 2,
                    topics: [
                        { title: "Skill Development", description: "Hands-on training for all students.", orderIndex: 1 },
                        { title: "Entrepreneurship", description: "Creating job givers, not just seekers.", orderIndex: 2 },
                        { title: "Life Skills", description: "Decision making and emotional resilience.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Professional Ethics",
                    description: "Integrity in business and professions.",
                    orderIndex: 3,
                    topics: [
                        { title: "Honesty in Trade", description: "Fair practice and social trust.", orderIndex: 1 },
                        { title: "Corporate Responsibility", description: "Company as a part of society.", orderIndex: 2 },
                        { title: "Legal Integrity", description: "Adhering to laws both spirit and letter.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Research for Bharat",
                    description: "Identifying local solutions for local problems.",
                    orderIndex: 4,
                    topics: [
                        { title: "Applied Research", description: "Innovation in agriculture and SME.", orderIndex: 1 },
                        { title: "Traditional Wisdom", description: "Modernizing Ayurvedic/Yoga research.", orderIndex: 2 },
                        { title: "Global Competitiveness", description: "Excellence in production standards.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Legacy & Sustainability",
                    description: "Ensuring long-term impact of Deen Dayal's vision.",
                    orderIndex: 5,
                    topics: [
                        { title: "Policy Legacy", description: "Analysis of modern schemes (Ujjwala, Jan Dhan).", orderIndex: 1 },
                        { title: "Vision for 2047", description: "Amrit Kaal and Integral Humanism.", orderIndex: 2 },
                        { title: "Conclusion", description: "Summary of Pt Deen Dayal's message.", orderIndex: 3 }
                    ]
                }
            ]
        }
    ]
};

const EngineeringMechanics = {
    name: "Engineering Mechanics",
    code: "KME101",
    branch: "ME",
    year: 1,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2000",
    units: [
        {
            unitNumber: 1,
            title: "Introduction to Mechanics of Solid",
            chapters: [
                {
                    title: "Stress & Strain Fundamentals",
                    description: "Introduction to normal and shear stress, and axial strain components.",
                    orderIndex: 1,
                    topics: [
                        { title: "Normal Stress & Strain", description: "Axial loading, cross-sectional stress, and linear strain.", orderIndex: 1 },
                        { title: "Shear Stress & Strain", description: "Tangential force, shear modulus, and angular deformation.", orderIndex: 2 },
                        { title: "Hooke's Law", description: "Proportionality limit and elastic region analysis.", orderIndex: 3 },
                        { title: "Factor of Safety", description: "Design considerations and safe working limits.", orderIndex: 4 }
                    ]
                },
                {
                    title: "Elastic Constants & Relationships",
                    description: "Analysis of Poisson's ratio and inter-relationships between E, G, and K.",
                    orderIndex: 2,
                    topics: [
                        { title: "Poisson's Ratio", description: "Lateral vs longitudinal strain relationship.", orderIndex: 1 },
                        { title: "Elastic Constants (E, G, K)", description: "Modulus of elasticity, rigidity, and bulk modulus.", orderIndex: 2 },
                        { title: "Inter-relationship Derivations", description: "Mathematical linking of elastic properties.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Material Behavior & Diagrams",
                    description: "Stress-strain characteristics for ductile and brittle materials.",
                    orderIndex: 3,
                    topics: [
                        { title: "Ductile Materials (Mild Steel)", description: "Yield point, necking, and ultimate strength.", orderIndex: 1 },
                        { title: "Brittle Materials", description: "Direct failure without significant deformation.", orderIndex: 2 },
                        { title: "Stress-Strain Diagram", description: "Graphical representation of material property segments.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Beams & Loading Types",
                    description: "Classification of beams and various loading conditions.",
                    orderIndex: 4,
                    topics: [
                        { title: "Classification of Beams", description: "Simply supported, cantilever, and overhanging beams.", orderIndex: 1 },
                        { title: "Loading Profiles", description: "Point loads, UDL, and UVL understanding.", orderIndex: 2 },
                        { title: "Statically Determinate Beams", description: "Solving reactions using equilibrium equations.", orderIndex: 3 }
                    ]
                },
                {
                    title: "SFD & BMD Analysis",
                    description: "Shear Force and Bending Moment diagrams for different beams.",
                    orderIndex: 5,
                    topics: [
                        { title: "Shear Force Diagrams (SFD)", description: "Graphical variation of internal shear forces.", orderIndex: 1 },
                        { title: "Bending Moment Diagrams (BMD)", description: "Visualizing flexural moment across beam span.", orderIndex: 2 },
                        { title: "SF-BM Sign Conventions", description: "Standard sign rules for diagram construction.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Load-Shear-Moment Relations",
                    description: "Mathematical relationship between udl, shear force, and bending moment.",
                    orderIndex: 6,
                    topics: [
                        { title: "Shear-Load Relationship", description: "Derivative of SF as intensity of load.", orderIndex: 1 },
                        { title: "Moment-Shear Relationship", description: "Derivative of BM as the shear force.", orderIndex: 2 },
                        { title: "Inflexion & Max BM", description: "Locating points of zero shear and zero moment.", orderIndex: 3 }
                    ]
                }
            ]
        },
        {
            unitNumber: 2,
            title: "Introduction to Fluid Mechanics and Applications",
            chapters: [
                {
                    title: "Fluid Properties & Measurements",
                    description: "Standard properties of fluids like pressure, density, and viscosity.",
                    orderIndex: 1,
                    topics: [
                        { title: "Density & Specific Gravity", description: "Mass per unit volume and relative density.", orderIndex: 1 },
                        { title: "Fluid Pressure", description: "Concept of pressure intensity in fluid mass.", orderIndex: 2 },
                        { title: "Fluid viscosity", description: "Internal resistance to flow in liquids.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Viscosity & Fluid Types",
                    description: "Dynamic and Kinematic viscosity and flow classification.",
                    orderIndex: 2,
                    topics: [
                        { title: "Dynamic vs Kinematic Viscosity", description: "Absolute viscosity vs diffusivity of momentum.", orderIndex: 1 },
                        { title: "Newtonian Fluids", description: "Fluids following linear stress-rate relation.", orderIndex: 2 },
                        { title: "Non-Newtonian Fluids", description: "Thixotropic, dilatant, and pseudoplastic flow.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Fluid Pressure & Pascal's Law",
                    description: "Principles of static fluid pressure and its applications.",
                    orderIndex: 3,
                    topics: [
                        { title: "Pascal's Law Statement", description: "Pressure transmission in confined fluids.", orderIndex: 1 },
                        { title: "Applications of Pascal's Law", description: "Hydraulic lifts, jacks, and braking systems.", orderIndex: 2 },
                        { title: "Hydrostatic Paradox", description: "Pressure independence from container shape.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Conservation Laws (Continuity)",
                    description: "Conservation of mass principle for fluid flow systems.",
                    orderIndex: 4,
                    topics: [
                        { title: "Continuity Equation", description: "Mass flow rate and area-velocity relation.", orderIndex: 1 },
                        { title: "Flow Visualization", description: "Streamlines, streaklines, and pathlines.", orderIndex: 2 },
                        { title: "Mass Conservation Numerical", description: "Solving flow problems in variable pipes.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Energy Principles (Bernoulli's)",
                    description: "Bernoulli's equation and mechanical energy conservation.",
                    orderIndex: 5,
                    topics: [
                        { title: "Bernoulli's Principle", description: "Total head conservation in ideal flow.", orderIndex: 1 },
                        { title: "Practical Applications", description: "Venturimeter, Orificemeter, and Pitot tube.", orderIndex: 2 },
                        { title: "Assumptions & Limitations", description: "Defining boundaries for Bernoulli's usage.", orderIndex: 3 }
                    ]
                }
            ]
        },
        {
            unitNumber: 3,
            title: "Introduction to IC Engines and RAC",
            chapters: [
                {
                    title: "IC Engine Basics",
                    description: "Internal combustion engine components and classifications.",
                    orderIndex: 1,
                    topics: [
                        { title: "Basic Components", description: "Cylinder, piston, crank, and valves.", orderIndex: 1 },
                        { title: "Construction Overview", description: "Structural assembly of IC engines.", orderIndex: 2 },
                        { title: "Engine Classification", description: "Internal vs External combustion types.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Engine Cycles & Types",
                    description: "Operation of Two-stroke and Four-stroke engines.",
                    orderIndex: 2,
                    topics: [
                        { title: "4-Stroke SI & CI Engines", description: "Intake, compression, power, exhaust cycles.", orderIndex: 1 },
                        { title: "2-Stroke Engines", description: "Simplified cycles for small engine usage.", orderIndex: 2 },
                        { title: "SI vs CI Merits", description: "Efficiency and operational differences.", orderIndex: 3 },
                        { title: "SI & CI Demerits", description: "Maintenance and emission challenges.", orderIndex: 4 }
                    ]
                },
                {
                    title: "EV & Hybrid Vehicles",
                    description: "Introduction to electric and hybrid propulsion systems.",
                    orderIndex: 3,
                    topics: [
                        { title: "Electric Vehicles (EV)", description: "Battery, motor, and controller basics.", orderIndex: 1 },
                        { title: "Hybrid Electric Vehicles (HEV)", description: "Combining IC engine with electric power.", orderIndex: 2 },
                        { title: "Modern EV Trends", description: "Charging infra and energy storage evolution.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Refrigeration Principles",
                    description: "Concept of refrigeration, units, and COP.",
                    orderIndex: 4,
                    topics: [
                        { title: "Meaning of Refrigeration", description: "Artificial cooling and heat rejection.", orderIndex: 1 },
                        { title: "Unit of Refrigeration (TR)", description: "Tonne of refrigeration and its definition.", orderIndex: 2 },
                        { title: "COP - Coeff of Performance", description: "Efficiency metric for cooling systems.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Refrigeration Systems",
                    description: "Domestic refrigerators, heat pumps, and cooling loads.",
                    orderIndex: 5,
                    topics: [
                        { title: "Domestic Refrigerator", description: "Vapor compression cycle and construction.", orderIndex: 1 },
                        { title: "Heat Pump Concept", description: "Reverse refrigeration for heating apps.", orderIndex: 2 },
                        { title: "Cooling Load Numericals", description: "Calculating heat removal requirements.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Air Conditioning (AC)",
                    description: "Fundamentals of air conditioning and humidity management.",
                    orderIndex: 6,
                    topics: [
                        { title: "Humidity & Temperatures", description: "Dry bulb, wet bulb, and dew point.", orderIndex: 1 },
                        { title: "AC Comfort Conditions", description: "Defining optimal environment human health.", orderIndex: 2 },
                        { title: "Window Air Conditioner", description: "Working of unitized air cooling systems.", orderIndex: 3 }
                    ]
                }
            ]
        },
        {
            unitNumber: 4,
            title: "Introduction to Mechatronics",
            chapters: [
                {
                    title: "Mechatronics Fundamentals",
                    description: "Evolution, scope, and advantages of mechatronic systems.",
                    orderIndex: 1,
                    topics: [
                        { title: "Evolution of Mechatronics", description: "From mechanical to smart integrated systems.", orderIndex: 1 },
                        { title: "Industrial Advantages", description: "Precision, speed, and reliability gains.", orderIndex: 2 },
                        { title: "Limitations & Disadvantages", description: "Complexity and cost-related challenges.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Industrial Applications",
                    description: "Application of Mechatronics in modern industry.",
                    orderIndex: 2,
                    topics: [
                        { title: "Industrial Mechatronics", description: "Robotics and automated assembly lines.", orderIndex: 1 },
                        { title: "Autotronics & Bionics", description: "Smart automotive and biological systems.", orderIndex: 2 },
                        { title: "Avionics Overview", description: "Electronic systems in aviation.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Sensors in Systems",
                    description: "Types of sensors used in mechatronic integration.",
                    orderIndex: 3,
                    topics: [
                        { title: "Types of Sensors", description: "Proximity, pressure, and optic sensors.", orderIndex: 1 },
                        { title: "Sensor Characteristics", description: "Sensitivity, resolution, and linearity.", orderIndex: 2 },
                        { title: "Sensor Applications", description: "Feedback loops in automated control.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Transducers & Integration",
                    description: "Conversion of energy forms and transducer types.",
                    orderIndex: 4,
                    topics: [
                        { title: "Types of Transducers", description: "Passive vs Active transducer systems.", orderIndex: 1 },
                        { title: "Transducer characteristics", description: "Frequency response and dynamic range.", orderIndex: 2 },
                        { title: "Energy Conversion Basics", description: "Signal processing in mechatronic interfaces.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Actuation Systems",
                    description: "Overview of mechanical and electronic actuation.",
                    orderIndex: 5,
                    topics: [
                        { title: "Mechanical Actuation", description: "Gears, cams, and linkages in control.", orderIndex: 1 },
                        { title: "Electronic Actuation", description: "Motors, solenoids, and relays.", orderIndex: 2 },
                        { title: "System Overview", description: "Integrated control of mechanical motion.", orderIndex: 3 }
                    ]
                }
            ]
        }
    ]
};

const EngineeringPhysics = {
    name: "Engineering Physics",
    code: "KAS101",
    branch: "ALL",
    year: 1,
    image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=2000",
    units: [
        {
            unitNumber: 1,
            title: "Relativistic Mechanics",
            chapters: [
                {
                    title: "Frames of Reference",
                    description: "Understanding inertial and non-inertial frames and Galilean transformations.",
                    orderIndex: 1,
                    topics: [
                        { title: "Inertial & Non-inertial Frames", description: "Reference frames with and without acceleration.", orderIndex: 1 },
                        { title: "Galilean Transformations", description: "Classical coordinate transformations.", orderIndex: 2 }
                    ]
                },
                {
                    title: "Michelson-Morley Experiment",
                    description: "Study of the experiment and importance of its negative results.",
                    orderIndex: 2,
                    topics: [
                        { title: "Experimental Setup", description: "Michelson interferometer configuration.", orderIndex: 1 },
                        { title: "Negative Result Significance", description: "Why the null result changed physics.", orderIndex: 2 }
                    ]
                },
                {
                    title: "Special Theory of Relativity",
                    description: "Einstein's postulates and Lorentz transformations.",
                    orderIndex: 3,
                    topics: [
                        { title: "Postulates of STR", description: "Constancy of light speed and physics laws.", orderIndex: 1 },
                        { title: "Lorentz Transformations", description: "Coordinate conversion between frames.", orderIndex: 2 }
                    ]
                },
                {
                    title: "Relativistic Kinematics",
                    description: "Effects like length contraction and time dilation.",
                    orderIndex: 4,
                    topics: [
                        { title: "Length Contraction", description: "Shortening of length in motion.", orderIndex: 1 },
                        { title: "Time Dilation", description: "Slowing of time at high speeds.", orderIndex: 2 },
                        { title: "Velocity Addition Theorem", description: "Combining relativistic velocities.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Relativistic Dynamics",
                    description: "Variation of mass and mass-energy relation.",
                    orderIndex: 5,
                    topics: [
                        { title: "Variation of Mass", description: "Mass increase with velocity.", orderIndex: 1 },
                        { title: "Einstein's Mass-Energy Relation", description: "The famous E=mc^2.", orderIndex: 2 },
                        { title: "Energy-Momentum Relation", description: "Linking E, p and m.", orderIndex: 3 }
                    ]
                }
            ]
        },
        {
            unitNumber: 2,
            title: "Electromagnetic Theory",
            chapters: [
                {
                    title: "Static Fields & Laws",
                    description: "Fundamental laws of electrostatics and magnetostatics.",
                    orderIndex: 1,
                    topics: [
                        { title: "Gauss's Theorem", description: "Electrostatics flux calculations.", orderIndex: 1 },
                        { title: "Ampere's Law", description: "Magnetostatics and current loops.", orderIndex: 2 },
                        { title: "Ohm's Law", description: "Relation between current and voltage.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Electromagnetic Induction",
                    description: "Study of induction and current displacement.",
                    orderIndex: 2,
                    topics: [
                        { title: "Laws of EM Induction", description: "Faraday's and Lenz's laws.", orderIndex: 1 },
                        { title: "Self & Mutual Induction", description: "Energy storage and transfer.", orderIndex: 2 }
                    ]
                },
                {
                    title: "Displacement Current",
                    description: "Refining Ampere's law for time-varying fields.",
                    orderIndex: 3,
                    topics: [
                        { title: "Concept of Displacement Current", description: "Maxwell's correction to Ampere's law.", orderIndex: 1 }
                    ]
                },
                {
                    title: "Maxwell's Equations",
                    description: "The core equations of electromagnetism.",
                    orderIndex: 4,
                    topics: [
                        { title: "Equations in Free Space", description: "Vacuum form of Maxwell's laws.", orderIndex: 1 },
                        { title: "Equations in Media", description: "Maxwell's laws in dielectrics.", orderIndex: 2 }
                    ]
                },
                {
                    title: "EM-Wave Propagation",
                    description: "Transmission of waves through space.",
                    orderIndex: 5,
                    topics: [
                        { title: "Waves in Free Space", description: "Propagation characteristics.", orderIndex: 1 }
                    ]
                }
            ]
        },
        {
            unitNumber: 3,
            title: "Wave Optics, Laser & Fiber",
            chapters: [
                {
                    title: "Interference",
                    description: "Superposition of light waves and thin films.",
                    orderIndex: 1,
                    topics: [
                        { title: "Conditions for Interference", description: "Coherence and amplitude requirements.", orderIndex: 1 },
                        { title: "Newton's Rings", description: "Applications in measurement.", orderIndex: 2 },
                        { title: "Wedge Shaped Thin Films", description: "Fringe formation in thin layers.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Diffraction",
                    description: "Bending of light and grating spectra.",
                    orderIndex: 2,
                    topics: [
                        { title: "Single & Double Slit", description: "Fraunhofer diffraction patterns.", orderIndex: 1 },
                        { title: "Diffraction Grating", description: "Spectra and dispersive power.", orderIndex: 2 }
                    ]
                },
                {
                    title: "Resolving Power",
                    description: "Limits of optical instruments.",
                    orderIndex: 3,
                    topics: [
                        { title: "Rayleigh's Criterion", description: "Condition for resolution.", orderIndex: 1 },
                        { title: "Grating Resolving Power", description: "Limits of spectral resolution.", orderIndex: 2 }
                    ]
                },
                {
                    title: "Laser Systems",
                    description: "Principles and working of common lasers.",
                    orderIndex: 4,
                    topics: [
                        { title: "Emission Processes", description: "Spontaneous and stimulated emission.", orderIndex: 1 },
                        { title: "Ruby & He-Ne Lasers", description: "Construction and mechanism.", orderIndex: 2 },
                        { title: "Laser Applications", description: "Practical uses in technology.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Fiber Optics",
                    description: "Light transmission through fibers.",
                    orderIndex: 5,
                    topics: [
                        { title: "Optical Fiber Construction", description: "Core, cladding and protection.", orderIndex: 1 },
                        { title: "Fiber Uses", description: "Communication and sensing.", orderIndex: 2 }
                    ]
                }
            ]
        },
        {
            unitNumber: 4,
            title: "Quantum Mechanics",
            chapters: [
                {
                    title: "Radiation Laws",
                    description: "Classical failures and early quantum laws.",
                    orderIndex: 1,
                    topics: [
                        { title: "Black Body Spectrum", description: "Energy distribution vs frequency.", orderIndex: 1 },
                        { title: "Classical Laws", description: "Stefan's, Wien's and Rayleigh-Jeans laws.", orderIndex: 2 },
                        { title: "Planck's Law", description: "The quantum energy concept.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Wave-Particle Duality",
                    description: "The dual nature of matter and radiation.",
                    orderIndex: 2,
                    topics: [
                        { title: "Matter Waves", description: "De Broglie hypothesis.", orderIndex: 1 },
                        { title: "Dual Nature", description: "Particle vs Wave behavior.", orderIndex: 2 }
                    ]
                },
                {
                    title: "Wave Equations",
                    description: "Formulating quantum mechanics.",
                    orderIndex: 3,
                    topics: [
                        { title: "Time-Independent Equation", description: "Schrodinger's steady state formulation.", orderIndex: 1 },
                        { title: "Time-Dependent Equation", description: "Evolution of quantum systems.", orderIndex: 2 }
                    ]
                },
                {
                    title: "Physical Interpretation",
                    description: "Meaning of the wave function.",
                    orderIndex: 4,
                    topics: [
                        { title: "Wave Function Psi", description: "Statistical interpretation.", orderIndex: 1 }
                    ]
                },
                {
                    title: "Quantum Bound State",
                    description: "Solving for a constrained particle.",
                    orderIndex: 5,
                    topics: [
                        { title: "Particle in a 1D Box", description: "Energy levels and wave functions.", orderIndex: 1 }
                    ]
                }
            ]
        }
    ]
};

const MathematicsI = {
    name: "Mathematics-I",
    code: "KAS103",
    branch: "ALL",
    year: 1,
    image: "https://images.unsplash.com/photo-1509228468518-180dd4821901?auto=format&fit=crop&q=80&w=2000",
    units: [
        {
            unitNumber: 1,
            title: "Matrices & Linear Algebra",
            chapters: [
                {
                    title: "Matrix Fundamentals",
                    description: "Types of matrices, elementary transformations, and rank of a matrix.",
                    orderIndex: 1,
                    topics: [
                        { title: "Inverse by Elementary Transf", description: "Calculating inverse using row/column operations.", orderIndex: 1 },
                        { title: "Rank of a Matrix", description: "Echelon form and normal form methods.", orderIndex: 2 },
                        { title: "Linear Independence", description: "Checking independence of vectors.", orderIndex: 3 }
                    ]
                },
                {
                    title: "System of Linear Equations",
                    description: "Consistency and solutions of linear equations.",
                    orderIndex: 2,
                    topics: [
                        { title: "Consistency Criteria", description: "Rouche-Capelli theorem application.", orderIndex: 1 },
                        { title: "Homogeneous Equations", description: "Trivial and non-trivial solutions.", orderIndex: 2 },
                        { title: "Non-Homogeneous Equations", description: "Cramer's rule and Matrix method.", orderIndex: 3 }
                    ]
                },
                {
                    title: "EigenValues & EigenVectors",
                    description: "Characteristic equations and diagonalization.",
                    orderIndex: 3,
                    topics: [
                        { title: "Characteristic Equation", description: "Finding roots of det(A-lI)=0.", orderIndex: 1 },
                        { title: "Cayley-Hamilton Theorem", description: "Statement, proof, and finding A inverse.", orderIndex: 2 },
                        { title: "Diagonalization", description: "Similarity transformations and modal matrix.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Linear Transformations",
                    description: "Mappings between vector spaces.",
                    orderIndex: 4,
                    topics: [
                        { title: "Properties of Transformations", description: "Linearity and matrix representation.", orderIndex: 1 },
                        { title: "Orthogonal Transformations", description: "Preserving length and dot product.", orderIndex: 2 },
                        { title: "Quadratic Forms", description: "Canonical form and nature of forms.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Complex Matrices",
                    description: "Hermitian, Skew-Hermitian, and Unitary matrices.",
                    orderIndex: 5,
                    topics: [
                        { title: "Hermitian Matrices", description: "Properties and Eigenvalues of Hermitian forms.", orderIndex: 1 },
                        { title: "Unitary Matrices", description: "Characterization and importance in physics.", orderIndex: 2 },
                        { title: "Complex Eigenproblems", description: "Solving systems over complex field.", orderIndex: 3 }
                    ]
                }
            ]
        },
        {
            unitNumber: 2,
            title: "Differential Calculus - I",
            chapters: [
                {
                    title: "Successive Differentiation",
                    description: "nth order derivatives and Leibniz theorem.",
                    orderIndex: 1,
                    topics: [
                        { title: "Leibniz Theorem", description: "nth derivative of product of two functions.", orderIndex: 1 },
                        { title: "Standard nth Derivatives", description: "Formulas for e^ax, sin(ax+b), log(ax+b).", orderIndex: 2 },
                        { title: "Partial Differentiation", description: "Basics of multi-variable derivatives.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Taylor's & Maclaurin's Series",
                    description: "Power series expansion of functions of one variable.",
                    orderIndex: 2,
                    topics: [
                        { title: "Maclaurin Series Expansion", description: "Expanding standard functions at x=0.", orderIndex: 1 },
                        { title: "Taylor Series Expansion", description: "Expansion about a general point a.", orderIndex: 2 },
                        { title: "Error Estimation", description: "Remainder terms in series expansions.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Asymptotes & Curve Tracing",
                    description: "Geometric properties and behavior of curves.",
                    orderIndex: 3,
                    topics: [
                        { title: "Rectangular Asymptotes", description: "Horizontal and vertical asymptotic lines.", orderIndex: 1 },
                        { title: "Curve Tracing (Cartesian)", description: "Symmetry, intercepts, and regions of existence.", orderIndex: 2 },
                        { title: "Polar Curve Tracing", description: "Tracing cardioids and spirals.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Curvature & Evolutes",
                    description: "Measure of bending of a curve.",
                    orderIndex: 4,
                    topics: [
                        { title: "Radius of Curvature", description: "Intrinsic, Cartesian, and Polar formulas.", orderIndex: 1 },
                        { title: "Evolutes", description: "Locus of center of curvature.", orderIndex: 2 },
                        { title: "Circle of Curvature", description: "Geometric construction at a point.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Envelopes",
                    description: "Curves tangent to a family of curves.",
                    orderIndex: 5,
                    topics: [
                        { title: "Envelope of family of lines", description: "Calculating envelopes for standard families.", orderIndex: 1 },
                        { title: "Envelope of family of curves", description: "C-discriminant and p-discriminant methods.", orderIndex: 2 },
                        { title: "Applications", description: "Optics and mechanics envelopes.", orderIndex: 3 }
                    ]
                }
            ]
        },
        {
            unitNumber: 3,
            title: "Differential Calculus - II",
            chapters: [
                {
                    title: "Partial Differentiation",
                    description: "Functions of several variables and Euler's theorem.",
                    orderIndex: 1,
                    topics: [
                        { title: "Euler's Theorem", description: "Homogeneous functions and partial derivatives.", orderIndex: 1 },
                        { title: "Total Differential", description: "Chain rule for multi-variable functions.", orderIndex: 2 },
                        { title: "Errors and Approximations", description: "Using differentials for small changes.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Jacobians",
                    description: "Functional dependence and coordinate transformations.",
                    orderIndex: 2,
                    topics: [
                        { title: "Jacobian Definition", description: "Properties of Jacobians in mapping.", orderIndex: 1 },
                        { title: "Functional Dependence", description: "Checking dependence of U, V on X, Y.", orderIndex: 2 },
                        { title: "Transformation of Variables", description: "Usage in double and triple integrals.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Extrema of Functions",
                    description: "Maxima and Minima of multi-variable functions.",
                    orderIndex: 3,
                    topics: [
                        { title: "Stationary Points", description: "Identifying local candidates for extrema.", orderIndex: 1 },
                        { title: "Saddle Points", description: "Analysis using second derivative test.", orderIndex: 2 },
                        { title: "Lagrange Multipliers", description: "Constrained optimization problems.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Integral Calculus Basics",
                    description: "Definite integrals and Beta-Gamma functions.",
                    orderIndex: 4,
                    topics: [
                        { title: "Beta Functions", description: "Properties and relationship with Gammas.", orderIndex: 1 },
                        { title: "Gamma Functions", description: "Evaluating improper integrals using G.", orderIndex: 2 },
                        { title: "Dirichlet's Integral", description: "Evaluating volume integrals.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Double Integrals",
                    description: "Area calculation and change of order.",
                    orderIndex: 5,
                    topics: [
                        { title: "Change of Order", description: "Rearranging limits for easier integration.", orderIndex: 1 },
                        { title: "Area by Double Integral", description: "Cartesian and Polar coordinates usage.", orderIndex: 2 },
                        { title: "Mass & Center of Gravity", description: "Application in physical systems.", orderIndex: 3 }
                    ]
                }
            ]
        },
        {
            unitNumber: 4,
            title: "Multiple Integrals & Vector Calculus",
            chapters: [
                {
                    title: "Triple Integrals",
                    description: "Volume calculation and coordinate changes.",
                    orderIndex: 1,
                    topics: [
                        { title: "Volume by Triple Integral", description: "Defining limits in 3D space.", orderIndex: 1 },
                        { title: "Spherical & Cylindrical Coord", description: "Simplifying symmetrical 3D integrals.", orderIndex: 2 },
                        { title: "Applications in Physics", description: "Moment of Inertia calculations.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Vector Differentiation",
                    description: "Gradient, Divergence, and Curl operations.",
                    orderIndex: 2,
                    topics: [
                        { title: "Scalar and Vector Fields", description: "Directional derivative and Gradient.", orderIndex: 1 },
                        { title: "Divergence & Curl", description: "Physical meaning and formulas.", orderIndex: 2 },
                        { title: "Solenoidal & Irrotational", description: "Classifying vector fields.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Vector Integration",
                    description: "Line, Surface, and Volume integrals.",
                    orderIndex: 3,
                    topics: [
                        { title: "Line Integrals", description: "Work done and circulation concepts.", orderIndex: 1 },
                        { title: "Surface Integrals", description: "Flux calculation across a boundary.", orderIndex: 2 },
                        { title: "Conservative Fields", description: "Independence of path for line integrals.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Integral Theorems",
                    description: "Gauss, Stokes, and Green theorems.",
                    orderIndex: 4,
                    topics: [
                        { title: "Gauss Divergence Theorem", description: "Relating volume and surface flux.", orderIndex: 1 },
                        { title: "Stokes Theorem", description: "Relating surface and line integrals.", orderIndex: 2 },
                        { title: "Green's Theorem in Plane", description: "Simplifying line integrals in XY plane.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Curvilinear Coordinates",
                    description: "Orthogonal coordinate systems.",
                    orderIndex: 5,
                    topics: [
                        { title: "Unit Vectors & Scale Factors", description: "Basics of general coordinates.", orderIndex: 1 },
                        { title: "Length, Area, Volume", description: "Elements in curvilinear systems.", orderIndex: 2 },
                        { title: "Operator Formulas", description: "Grad, Div, Curl in polar/spherical.", orderIndex: 3 }
                    ]
                }
            ]
        }
    ]
};

const YogaSubject = {
    name: "Yoga and Meditation",
    code: "KAS106",
    branch: "ALL",
    year: 1,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=2000",
    units: [
        {
            unitNumber: 1,
            title: "Introduction to Yoga",
            chapters: [
                {
                    title: "History and Origin",
                    description: "Exploring the ancient roots of Yoga from Vedic period to modern era.",
                    orderIndex: 1,
                    topics: [
                        { title: "Vedic & Pre-Vedic Yoga", description: "Yoga in Indus Valley and early scriptures.", orderIndex: 1 },
                        { title: "Classical Yoga Period", description: "The era of Patanjali and major Upanishads.", orderIndex: 2 },
                        { title: "Modern Yoga Pioneers", description: "Vivekananda, Krishnamacharya, and global spread.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Definitions & Goals",
                    description: "Understanding exactly what Yoga is and what it aims to achieve.",
                    orderIndex: 2,
                    topics: [
                        { title: "Yoga Sutra Definitions", description: "Chitta Vritti Nirodha explained.", orderIndex: 1 },
                        { title: "Practical Goals of Yoga", description: "Physical health, mental peace, and liberation.", orderIndex: 2 },
                        { title: "Yoga as a Science", description: "Methodological approach to self-realization.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Major Schools of Yoga",
                    description: "Different paths of Yoga practice for different temperaments.",
                    orderIndex: 3,
                    topics: [
                        { title: "Jnana & Bhakti Yoga", description: "Path of knowledge and path of devotion.", orderIndex: 1 },
                        { title: "Karma & Raja Yoga", description: "Path of action and path of meditation.", orderIndex: 2 },
                        { title: "Hatha Yoga Basics", description: "Focus on physical purification and energy.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Misconceptions of Yoga",
                    description: "Debunking common myths and commercial distortions.",
                    orderIndex: 4,
                    topics: [
                        { title: "Yoga vs Gymnastics", description: "Beyond physical flexibility and stunts.", orderIndex: 1 },
                        { title: "Religious Aspect", description: "Yoga as a universal secular science.", orderIndex: 2 },
                        { title: "Yoga and Age", description: "Accessibility for all stages of life.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Modern Relevance",
                    description: "Why Yoga is essential in today's fast-paced world.",
                    orderIndex: 5,
                    topics: [
                        { title: "Stress management", description: "Countering modern lifestyle diseases.", orderIndex: 1 },
                        { title: "Work-Life Balance", description: "Yoga at the workplace and productivity.", orderIndex: 2 },
                        { title: "Global Harmony", description: "Yoga for collective peace and empathy.", orderIndex: 3 }
                    ]
                }
            ]
        },
        {
            unitNumber: 2,
            title: "Yoga Texts & Philosophy",
            chapters: [
                {
                    title: "Patanjali Yoga Sutras",
                    description: "Foundational text of Raja Yoga and the eight limbs.",
                    orderIndex: 1,
                    topics: [
                        { title: "Philosophy of Samadhi", description: "The ultimate state of meditative absorption.", orderIndex: 1 },
                        { title: "Concept of Kaivalya", description: "Absolute freedom and spiritual isolation.", orderIndex: 2 },
                        { title: "Kriya Yoga", description: "Tapas, Svadhyaya, and Ishvara Pranidhana.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Ashtanga Yoga (8 Limbs)",
                    description: "The structured path to self-mastery.",
                    orderIndex: 2,
                    topics: [
                        { title: "External Limbs (Yama to Pratyahara)", description: "Social and personal discipline.", orderIndex: 1 },
                        { title: "Internal Limbs (Dharana, Dhyana, Samadhi)", description: "Advanced meditative states.", orderIndex: 2 },
                        { title: "Pratyahara - Sense Withdrawal", description: "Linking outer and inner worlds.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Bhagavad Gita & Yoga",
                    description: "Yoga in the battlefield of life according to Krishna.",
                    orderIndex: 3,
                    topics: [
                        { title: "Yoga of Equanimity", description: "Samatvam Yoga Uchyate explained.", orderIndex: 1 },
                        { title: "Yoga of Action (Karma)", description: "Skill in action and non-attachment.", orderIndex: 2 },
                        { title: "Yoga of Wisdom", description: "Seeing the self in all beings.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Hatha Yoga Texts",
                    description: "Purification and awakening through physical means.",
                    orderIndex: 4,
                    topics: [
                        { title: "Pradipika & Gheranda Samhita", description: "Comparison of key Hatha texts.", orderIndex: 1 },
                        { title: "Nadi & Chakra System", description: "Energy channels and centers in the body.", orderIndex: 2 },
                        { title: "Kundalini Concept", description: "The latent spiritual energy at the base.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Moral & Ethical Precepts",
                    description: "Living a Yogic life through Yamas and Niyamas.",
                    orderIndex: 5,
                    topics: [
                        { title: "Ahimsa & Satya", description: "Non-violence and truth in thought and deed.", orderIndex: 1 },
                        { title: "Asteya, Brahmacharya, Aparigraha", description: "Integrity and non-possessiveness.", orderIndex: 2 },
                        { title: "Saucha & Santosha", description: "Purity and contentment as foundations.", orderIndex: 3 }
                    ]
                }
            ]
        },
        {
            unitNumber: 3,
            title: "Yoga & Human Body",
            chapters: [
                {
                    title: "Anatomy of Asanas",
                    description: "How physical postures affect muscles and joints.",
                    orderIndex: 1,
                    topics: [
                        { title: "Skeleton & Muscle movement", description: "Biomechanics of standard postures.", orderIndex: 1 },
                        { title: "Spinal Alignment", description: "Importance of spine health in Yoga.", orderIndex: 2 },
                        { title: "Joint Protection", description: "Preventing injury through proper form.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Endocrine & Nervous System",
                    description: "Yoga's impact on hormones and brain function.",
                    orderIndex: 2,
                    topics: [
                        { title: "Stress Response (SNS vs PNS)", description: "Relaxation response via Dhyana.", orderIndex: 1 },
                        { title: "Glandular Health", description: "Stimulating glands through inverted poses.", orderIndex: 2 },
                        { title: "Neuroplasticity & Yoga", description: "Brain changes due to long-term practice.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Pranayama & Respiration",
                    description: "Science of breath control and energy regulation.",
                    orderIndex: 3,
                    topics: [
                        { title: "Mechanism of Breathing", description: "Diaphragmatic vs shallow breathing.", orderIndex: 1 },
                        { title: "Nadi Shodhana (Alternate Nostril)", description: "Balancing left and right brain.", orderIndex: 2 },
                        { title: "Kapalbhati & Bhastrika", description: "Cleansing and energizing breaths.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Shatkarmas (Cleansing)",
                    description: "The six purificatory techniques of Hatha Yoga.",
                    orderIndex: 4,
                    topics: [
                        { title: "Neti & Dhauti", description: "Nasal and stomach cleansing basics.", orderIndex: 1 },
                        { title: "Basti & Nauli", description: "Lower digestive and abdominal exercises.", orderIndex: 2 },
                        { title: "Trataka & Kapalbhati", description: "Eye focus and frontal brain cleansing.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Mudras & Bandhas",
                    description: "Seals and locks that direct vital energy.",
                    orderIndex: 5,
                    topics: [
                        { title: "Hand Mudras (Jnana, Chin)", description: "Gestures for focus and peace.", orderIndex: 1 },
                        { title: "Jalandhara & Mula Bandha", description: "Throat and root locks explained.", orderIndex: 2 },
                        { title: "Uddiyana Bandha", description: "Abdominal lock for visceral health.", orderIndex: 3 }
                    ]
                }
            ]
        },
        {
            unitNumber: 4,
            title: "Applied Yoga",
            chapters: [
                {
                    title: "Yoga for Stress",
                    description: "Practical management of high-pressure lifestyles.",
                    orderIndex: 1,
                    topics: [
                        { title: "Yoga Nidra", description: "Guided deeply relaxing yogic sleep.", orderIndex: 1 },
                        { title: "Restorative Yoga", description: "Gentle poses for recovery and calm.", orderIndex: 2 },
                        { title: "Meditation Techniques", description: "Mindfulness and object-based focus.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Mental Health Apps",
                    description: "Using Yoga for anxiety, depression, and trauma.",
                    orderIndex: 2,
                    topics: [
                        { title: "Trauma-Informed Yoga", description: "Safe spaces and somatic release.", orderIndex: 1 },
                        { title: "Anxiety Relief", description: "Grounding poses and soothing breath.", orderIndex: 2 },
                        { title: "Depression & Vitality", description: "Heart openers and energizing flows.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Yoga for Fitness",
                    description: "Enhancing strength, flexibility, and endurance.",
                    orderIndex: 3,
                    topics: [
                        { title: "Surya Namaskar", description: "Complete systemic workout and prayer.", orderIndex: 1 },
                        { title: "Core Stability", description: "Building inner strength via balance.", orderIndex: 2 },
                        { title: "Flexibility Drills", description: "Safe stretching and range of motion.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Personality Development",
                    description: "Improving confidence and social intelligence.",
                    orderIndex: 4,
                    topics: [
                        { title: "Emotional Intelligence", description: "Detachment and witness consciousness.", orderIndex: 1 },
                        { title: "Self-discipline (Tapas)", description: "Willpower building through practice.", orderIndex: 2 },
                        { title: "Leadership via Yoga", description: "Centerness and clarity in command.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Teaching Methodology",
                    description: "Basics of sharing the wisdom of Yoga.",
                    orderIndex: 5,
                    topics: [
                        { title: "Class Sequencing", description: "Logical flow of poses for safety.", orderIndex: 1 },
                        { title: "Adjustment & Safety", description: "Hands-on vs verbal cues for students.", orderIndex: 2 },
                        { title: "Ethics for Teachers", description: "Conduct and responsibility of a Guru.", orderIndex: 3 }
                    ]
                }
            ]
        }
    ]
};

const ProfessionalCommunication = {
    name: "Professional Communication",
    code: "KAS107",
    branch: "ALL",
    year: 1,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2000",
    units: [
        {
            unitNumber: 1,
            title: "Fundamentals of Communication",
            chapters: [
                {
                    title: "The Communication Process",
                    description: "Understanding the flow of information and feedback loops.",
                    orderIndex: 1,
                    topics: [
                        { title: "SMR Model", description: "Sender, Message, Receiver and Channel role.", orderIndex: 1 },
                        { title: "Feedback Importance", description: "Closing the loop for effective understanding.", orderIndex: 2 },
                        { title: "Noise in Communication", description: "Identifying interference in data flow.", orderIndex: 3 }
                    ]
                },
                {
                    title: "The 7 C's of Communication",
                    description: "Core principles for clear and effective professional messaging.",
                    orderIndex: 2,
                    topics: [
                        { title: "Clarity & Conciseness", description: "Being direct and easy to understand.", orderIndex: 1 },
                        { title: "Correctness & Completeness", description: "Ensuring factual accuracy and full info.", orderIndex: 2 },
                        { title: "Courtesy & Consideration", description: "Maintaining professional politeness.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Barriers to Communication",
                    description: "Identifying and overcoming common communication hurdles.",
                    orderIndex: 3,
                    topics: [
                        { title: "Semantic & Physical Barriers", description: "Language issues and environmental noise.", orderIndex: 1 },
                        { title: "Psychological Barriers", description: "Impact of emotions and bias on decoding.", orderIndex: 2 },
                        { title: "Cultural Barriers", description: "Navigating cross-cultural differences.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Verbal vs Non-Verbal",
                    description: "Comparing spoken words with body language and tone.",
                    orderIndex: 4,
                    topics: [
                        { title: "Kinesics & Proxemics", description: "Body movements and use of personal space.", orderIndex: 1 },
                        { title: "Paralanguage", description: "Role of tone, pitch, and speed in speech.", orderIndex: 2 },
                        { title: "Haptics & Chronemics", description: "Touch and time management in comms.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Ethics in Communication",
                    description: "Maintaining integrity and transparency in messaging.",
                    orderIndex: 5,
                    topics: [
                        { title: "Plagiarism & Attribution", description: "Respecting intellectual property.", orderIndex: 1 },
                        { title: "Confidentiality", description: "Handling sensitive professional info.", orderIndex: 2 },
                        { title: "Honest Reporting", description: "Avoiding distortion of facts.", orderIndex: 3 }
                    ]
                }
            ]
        },
        {
            unitNumber: 2,
            title: "Business Correspondence & Writing",
            chapters: [
                {
                    title: "Professional Email Etiquette",
                    description: "Drafting effective and polite emails in a corporate setup.",
                    orderIndex: 1,
                    topics: [
                        { title: "Subject Lines & Salutations", description: "First impressions in digital comms.", orderIndex: 1 },
                        { title: "The Three-Part Body", description: "Intro, Core Message, and Call to Action.", orderIndex: 2 },
                        { title: "Attachments & Sign-offs", description: "Proper file handling and closing.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Business Letter Writing",
                    description: "Traditional correspondence for formal notices.",
                    orderIndex: 2,
                    topics: [
                        { title: "Enquiry & Complaint Letters", description: "Drafting specific business requests.", orderIndex: 1 },
                        { title: "Sales & Adjustment Letters", description: "Persuasive and corrective writing.", orderIndex: 2 },
                        { title: "Quotation & Order Letters", description: "Handling commerce-related docs.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Memo & Circular Drafting",
                    description: "Internal communication within an organization.",
                    orderIndex: 3,
                    topics: [
                        { title: "Purpose of Memos", description: "Information dissemination to employees.", orderIndex: 1 },
                        { title: "Writing for Clarity", description: "Avoiding ambiguity in official orders.", orderIndex: 2 },
                        { title: "Circular Distribution", description: "Broadcasting news across departments.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Report Writing Basics",
                    description: "Structured presentation of data and findings.",
                    orderIndex: 4,
                    topics: [
                        { title: "Types of Reports", description: "Informational vs Analytical reports.", orderIndex: 1 },
                        { title: "Report Structure", description: "From title page to bibliography.", orderIndex: 2 },
                        { title: "Data Visualization in Reports", description: "Using charts and tables for clarity.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Proposal Writing",
                    description: "Drafting bids and pitching ideas formally.",
                    orderIndex: 5,
                    topics: [
                        { title: "Executive Summary", description: "The core pitch in 500 words.", orderIndex: 1 },
                        { title: "Technical Section", description: "Defining methodology and scope.", orderIndex: 2 },
                        { title: "Cost & Timeline Analysis", description: "Budgeting and scheduling in proposals.", orderIndex: 3 }
                    ]
                }
            ]
        },
        {
            unitNumber: 3,
            title: "Advanced Grammar & Technical Writing",
            chapters: [
                {
                    title: "Grammar Fundamentals",
                    description: "Reviewing parts of speech and sentence structure.",
                    orderIndex: 1,
                    topics: [
                        { title: "Subject-Verb Agreement", description: "Grammatical consistency check.", orderIndex: 1 },
                        { title: "Tense Usage", description: "Accurate time-frames in reporting.", orderIndex: 2 },
                        { title: "Active vs Passive Voice", description: "When to use direct vs indirect tone.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Technical Writing Style",
                    description: "Scientific and objective writing techniques.",
                    orderIndex: 2,
                    topics: [
                        { title: "Impersonal Style", description: "Using third-person for objectivity.", orderIndex: 1 },
                        { title: "Precision & Brevity", description: "Technical vocab and concise sentences.", orderIndex: 2 },
                        { title: "Defining Terms", description: "Parenthetical and expanded definitions.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Instruction & User Manuals",
                    description: "Writing for the end-user's understanding.",
                    orderIndex: 3,
                    topics: [
                        { title: "Step-by-Step Guides", description: "Logical flow of instructions.", orderIndex: 1 },
                        { title: "Warning & Caution labels", description: "Safety communication in docs.", orderIndex: 2 },
                        { title: "Troubleshooting Sections", description: "Helpful problem-solving guides.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Précis Writing",
                    description: "Abstracting large documents into short summaries.",
                    orderIndex: 4,
                    topics: [
                        { title: "The Art of Condensation", description: "Retaining core meaning in 1/3 size.", orderIndex: 1 },
                        { title: "Abstracting Techniques", description: "Identifying key sentences and themes.", orderIndex: 2 },
                        { title: "Drafting Summaries", description: "Writing for busy executives.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Technical Description",
                    description: "Describing products, processes, and systems.",
                    orderIndex: 5,
                    topics: [
                        { title: "Product Analysis", description: "Physical vs functional description.", orderIndex: 1 },
                        { title: "Process Flow Charts", description: "Describing systems visually and verbally.", orderIndex: 2 },
                        { title: "Material Specifications", description: "Technical data presentation standards.", orderIndex: 3 }
                    ]
                }
            ]
        },
        {
            unitNumber: 4,
            title: "Soft Skills & Career Preparedness",
            chapters: [
                {
                    title: "Public Speaking & Presentations",
                    description: "Mastering oral communication in front of groups.",
                    orderIndex: 1,
                    topics: [
                        { title: "Overcoming Stage Fear", description: "Confidence building techniques.", orderIndex: 1 },
                        { title: "Visual Aids Usage", description: "Effective PPTs and props.", orderIndex: 2 },
                        { title: "Q&A Handling", description: "Think-on-your-feet skills.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Group Discussions",
                    description: "Collaborative and competitive verbal interaction.",
                    orderIndex: 2,
                    topics: [
                        { title: "Initiating & Summarizing", description: "Key phases of a GD.", orderIndex: 1 },
                        { title: "Interpersonal Dynamics", description: "Listening and respecting counter-arguments.", orderIndex: 2 },
                        { title: "Body Language in GD", description: "Non-verbal cues for leadership.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Job Interviews",
                    description: "Strategies for successful career placement.",
                    orderIndex: 3,
                    topics: [
                        { title: "Resume & Portfolio", description: "Documenting skills attractively.", orderIndex: 1 },
                        { title: "Standard Interview Qs", description: "Preparing for common HR/Technical Qs.", orderIndex: 2 },
                        { title: "Post-Interview Manners", description: "Thank you notes and follow-ups.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Leadership & Teamwork",
                    description: "Effective collaboration in professional teams.",
                    orderIndex: 4,
                    topics: [
                        { title: "Emotional Intelligence", description: "Empathy and self-regulation at work.", orderIndex: 1 },
                        { title: "Conflict Resolution", description: "Managing team disagreements healthily.", orderIndex: 2 },
                        { title: "Goal Alignment", description: "Linking personal and org objectives.", orderIndex: 3 }
                    ]
                },
                {
                    title: "Corporate Culture & Values",
                    description: "Adapting to the modern workplace environment.",
                    orderIndex: 5,
                    topics: [
                        { title: "Time Management", description: "Prioritization and deadline adherence.", orderIndex: 1 },
                        { title: "Workplace Etiquette", description: "Professional dress, talk, and conduct.", orderIndex: 2 },
                        { title: "Lifelong Learning", description: "Adapting to tech and role changes.", orderIndex: 3 }
                    ]
                }
            ]
        }
    ]
};

const seedData = async () => {
    try {
        await connectDB();
        console.log("ℹ️ Skipping deleteMany commands as per user instructions.");

        const subjects = [
            EngineeringMechanics, 
            EngineeringPhysics, 
            MathematicsI, 
            ProfessionalCommunication,
            BriefDeenDayalSubject,
            YogaSubject
        ];
        
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
