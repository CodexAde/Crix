import mongoose from "mongoose";
import dotenv from "dotenv";
import { Subject } from "../models/syllabus.model.js";
import { Reply } from "../models/reply.model.js";
import { Test } from "../models/test.model.js";

dotenv.config({ path: "./backend/.env" }); // Adjusted for scripts folder

const seedMechanicsFull = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    // 1. Clean up existing subject data safely
    const existingSubject = await Subject.findOne({ name: "Engineering Physics" });
    if (existingSubject) {
      console.log("🔍 Found existing Engineering Physics subject, cleaning up...");
      
      // Get all topic IDs for this subject to clear related replies and tests
      const topicIds = [];
      existingSubject.units.forEach(unit => {
        unit.chapters.forEach(chapter => {
          chapter.topics.forEach(topic => {
            topicIds.push(topic._id);
          });
        });
      });

      await Reply.deleteMany({ topicId: { $in: topicIds } });
      await Test.deleteMany({ subjectId: existingSubject._id });
      await Subject.deleteOne({ _id: existingSubject._id });
      
      console.log(`🗑️ Cleared existing data: ${topicIds.length} topics, their replies and tests.`);
    }

    // 2. Create the new subject
    const mechanicsSubject = await Subject.create(
      {
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
      }
    );

    console.log("✅ Created Subject ME103 (5 Units)");

    const contentMap = {
      // Unit 1
      "Inertial & Non-inertial Frames": {
        summarize: "## Summary: Inertial & Non-inertial Frames 🚀🧭\n\nBhai, **Frame of Reference** ka matlab hota hai wo perspective jiske respect mein hum motion ko observe karte hain. Agar frame constant velocity se move kar raha hai (ya rest mein hai), toh usse **Inertial Frame** kehte hain.\n\nInertial frame mein Newton ke laws perfectly valid hote hain. Matlab koi extra imaginary force lagani nahi padti 💡.\n\nAb aata hai **Non-inertial Frame**. Ye wo frame hota hai jo accelerate kar raha ho (jaise turning car ya rotating frame). Yaha Newton ke laws directly kaam nahi karte jab tak hum **pseudo force** na lagayein.\n\nSimple bolu toh: **No acceleration = Inertial**, **Acceleration present = Non-inertial**. Ye concept relativity aur advanced mechanics ka base hai 😎🔥.",
        mcq: "## 5 MCQs: Inertial & Non-inertial Frames 🎯\n\nQ1. Inertial frame mein kaunse laws valid hote hain?\n\nA) Only first law\n\nB) Newton ke sabhi laws\n\nC) Only third law\n\nD) Koi law nahi\n\n```diff\nB) Newton ke sabhi laws\nExplanation: Inertial frame mein Newtonian mechanics perfectly apply hoti hai ✅\n```\n\nQ2. Non-inertial frame ka example?\n\nA) Train at constant speed\n\nB) Lift with constant velocity\n\nC) Rotating merry-go-round\n\nD) Resting table\n\n```diff\nC) Rotating merry-go-round\nExplanation: Rotation matlab acceleration present hai ✅\n```\n\nQ3. Non-inertial frame mein Newton laws apply karne ke liye kya add karte hain?\n\nA) Real force\n\nB) Magnetic force\n\nC) Pseudo force\n\nD) Friction\n\n```diff\nC) Pseudo force\nExplanation: Acceleration effect ko balance karne ke liye pseudo force lagti hai ✅\n```\n\nQ4. Constant velocity frame hota hai?\n\nA) Non-inertial\n\nB) Rotational\n\nC) Inertial\n\nD) Accelerated\n\n```diff\nC) Inertial\nExplanation: Velocity constant hai toh acceleration zero hota hai ✅\n```\n\nQ5. Ye concept kis theory ka base hai?\n\nA) Thermodynamics\n\nB) Relativity\n\nC) Optics\n\nD) Acoustics\n\n```diff\nB) Relativity\nExplanation: Relativity frames ke comparison par based hai ✅\n```"
      },

      "Galilean Transformations": {
        summarize: "## Summary: Galilean Transformations 🔄📐\n\nBhai, **Galilean Transformations** classical mechanics ke transformation rules hain jo ek inertial frame se doosre inertial frame mein coordinates convert karte hain.\n\nIsme time absolute maana jaata hai, matlab sab observers ke liye same time hota hai ⏱️.\n\nYe transformations low speed (light se bahut kam) ke cases mein kaafi accurate hote hain. Par jaise hi speed light ke paas jaati hai, ye fail ho jaate hain — yahin se Einstein ki relativity start hoti hai 😎.",
        mcq: "## 5 MCQs: Galilean Transformations 🎯\n\nQ1. Galilean transformation kis mechanics ka part hai?\n\nA) Quantum\n\nB) Classical\n\nC) Relativistic\n\nD) Nuclear\n\n```diff\nB) Classical\nExplanation: Ye Newtonian mechanics ka part hai ✅\n```\n\nQ2. Galilean transformation mein time hota hai?\n\nA) Relative\n\nB) Absolute\n\nC) Variable\n\nD) Zero\n\n```diff\nB) Absolute\nExplanation: Classical physics mein time sabke liye same hota hai ✅\n```\n\nQ3. Ye transformation kab fail hota hai?\n\nA) Low speed\n\nB) Medium speed\n\nC) High speed (near light)\n\nD) Rest\n\n```diff\nC) High speed (near light)\nExplanation: Light speed ke paas classical rules fail ho jaate hain ✅\n```\n\nQ4. Galilean transformation ka use kaha hota hai?\n\nA) Daily life motion\n\nB) Atomic physics\n\nC) Nuclear reactions\n\nD) Space-time\n\n```diff\nA) Daily life motion\nExplanation: Normal speed ke motions mein kaam karta hai ✅\n```\n\nQ5. Galilean transformation ka limitation kya hai?\n\nA) Complex\n\nB) Ignores speed of light\n\nC) Uses calculus\n\nD) Uses vectors\n\n```diff\nB) Ignores speed of light\nExplanation: Light speed constant hone ka concept nahi maanta ✅\n```"
      },

      "Postulates of STR": {
        summarize: "## Summary: Postulates of Special Theory of Relativity 🌌⚡\n\nBhai, Einstein ki **Special Theory of Relativity (STR)** do powerful postulates par based hai.\n\nPehla: **Physics ke laws sab inertial frames mein same hote hain**. Matlab koi bhi frame special nahi hai.\n\nDusra: **Light ki speed vacuum mein constant hoti hai**, chahe source move kare ya observer.\n\nIn do ideas ne space aur time ki definition hi change kar di. Time slow ho sakta hai, length shrink ho sakti hai — jo pehle impossible lagta tha 😎🔥.",
        mcq: "## 5 MCQs: Postulates of STR 🎯\n\nQ1. STR ke kitne postulates hote hain?\n\nA) 1\n\nB) 2\n\nC) 3\n\nD) 4\n\n```diff\nB) 2\nExplanation: Einstein ne sirf do fundamental postulates diye ✅\n```\n\nQ2. Light ki speed vacuum mein hoti hai?\n\nA) Variable\n\nB) Observer dependent\n\nC) Constant\n\nD) Zero\n\n```diff\nC) Constant\nExplanation: Ye relativity ka core idea hai ✅\n```\n\nQ3. STR kis frames ke liye valid hai?\n\nA) Non-inertial\n\nB) Rotating\n\nC) Inertial\n\nD) Accelerated\n\n```diff\nC) Inertial\nExplanation: STR inertial frames ke liye valid hai ✅\n```\n\nQ4. Kis concept ko STR ne change kiya?\n\nA) Force\n\nB) Energy\n\nC) Space & Time\n\nD) Mass only\n\n```diff\nC) Space & Time\nExplanation: Space-time relative ho gaya STR ke baad ✅\n```\n\nQ5. STR kis scientist ne di?\n\nA) Newton\n\nB) Maxwell\n\nC) Einstein\n\nD) Galileo\n\n```diff\nC) Einstein\nExplanation: Einstein ne 1905 mein STR propose ki ✅\n```"
      },

      "Lorentz Transformations": {
        summarize: "## Summary: Lorentz Transformations 🌠📏\n\nBhai, **Lorentz Transformations** Galilean transformation ka upgraded version hai jo high speed cases handle karta hai.\n\nIsme space aur time mix ho jaate hain, matlab time absolute nahi rehta ⏱️.\n\nYe transformations ensure karte hain ki light ki speed sab frames mein same rahe. Length contraction aur time dilation isi se nikalte hain 😎🔥.",
        mcq: "## 5 MCQs: Lorentz Transformations 🎯\n\nQ1. Lorentz transformation kis theory ka part hai?\n\nA) Classical\n\nB) Quantum\n\nC) Relativity\n\nD) Thermodynamics\n\n```diff\nC) Relativity\nExplanation: STR ka mathematical backbone hai ✅\n```\n\nQ2. Lorentz transformation ka main goal?\n\nA) Newton laws save karna\n\nB) Light speed constant rakhna\n\nC) Energy conserve karna\n\nD) Force balance\n\n```diff\nB) Light speed constant rakhna\nExplanation: Ye relativity ka core condition hai ✅\n```\n\nQ3. Isme kaun absolute nahi rehta?\n\nA) Mass\n\nB) Time\n\nC) Energy\n\nD) Force\n\n```diff\nB) Time\nExplanation: Time relative ho jaata hai high speed pe ✅\n```\n\nQ4. Galilean se better kyu hai?\n\nA) Simple\n\nB) High speed valid\n\nC) Easy math\n\nD) Old\n\n```diff\nB) High speed valid\nExplanation: Near light speed cases handle karta hai ✅\n```\n\nQ5. Lorentz factor depend karta hai?\n\nA) Mass\n\nB) Speed\n\nC) Force\n\nD) Distance\n\n```diff\nB) Speed\nExplanation: Velocity light ke respect mein hoti hai ✅\n```"
      },

      "Experimental Setup": {
        summarize: "## Summary: Michelson-Morley Experimental Setup 🔬🌊\n\nBhai, **Michelson-Morley Experiment** physics ki sabse famous experiments mein se ek hai. Is experiment ka goal tha **ether** ko detect karna — wo hypothetical medium jo light carry karta tha.\n\nSetup mein ek **Michelson Interferometer** use hota hai jisme light beam ko do perpendicular paths mein split kiya jaata hai, phir wapas combine karke interference pattern dekha jaata hai.\n\nAgar ether hota, toh Earth ki motion ki wajah se dono beams mein time difference aata aur fringe shift dikhta. Par surprisingly, **koi shift nahi mili** — ye result revolutionary tha 😎🔥.",
        mcq: "## 5 MCQs: Experimental Setup 🎯\n\nQ1. Michelson-Morley experiment ka goal kya tha?\n\nA) Light speed measure karna\n\nB) Ether detect karna\n\nC) Gravity measure karna\n\nD) Sound speed nikalna\n\n```diff\nB) Ether detect karna\nExplanation: Ether ko prove karna tha ✅\n```\n\nQ2. Experiment mein kya use hota hai?\n\nA) Prism\n\nB) Interferometer\n\nC) Telescope\n\nD) Microscope\n\n```diff\nB) Interferometer\nExplanation: Michelson Interferometer use hota hai ✅\n```\n\nQ3. Light beam ko kitne parts mein split kiya jaata hai?\n\nA) 3\n\nB) 4\n\nC) 2\n\nD) 5\n\n```diff\nC) 2\nExplanation: Do perpendicular paths mein split hoti hai ✅\n```\n\nQ4. Interference pattern kis liye dekha jaata hai?\n\nA) Color detection\n\nB) Time difference check\n\nC) Temperature\n\nD) Pressure\n\n```diff\nB) Time difference check\nExplanation: Path difference se fringe shift detect hoti hai ✅\n```\n\nQ5. Experiment result kya tha?\n\nA) Positive\n\nB) Null/Negative\n\nC) Variable\n\nD) Infinite\n\n```diff\nB) Null/Negative\nExplanation: Koi fringe shift nahi mili ✅\n```"
      },

      "Negative Result Significance": {
        summarize: "## Summary: Negative Result Significance 🚫✨\n\nBhai, Michelson-Morley experiment ka **null result** physics ki duniya mein earthquake la diya.\n\nIs experiment ne prove kar diya ki **ether exist nahi karta**. Light ko travel karne ke liye kisi medium ki zaroorat nahi hai.\n\nYe result directly lead karta hai **Einstein's Special Relativity** ki taraf. Agar ether nahi hai, toh light ki speed sab frames mein constant hai — yahi STR ka second postulate hai 😎🔥.",
        mcq: "## 5 MCQs: Negative Result Significance 🎯\n\nQ1. Null result ne kya prove kiya?\n\nA) Ether exists\n\nB) Ether doesn't exist\n\nC) Light is slow\n\nD) Earth is stationary\n\n```diff\nB) Ether doesn't exist\nExplanation: Ether ka concept reject ho gaya ✅\n```\n\nQ2. Negative result kis theory ko support karta hai?\n\nA) Newton's laws\n\nB) Special Relativity\n\nC) Thermodynamics\n\nD) Quantum theory\n\n```diff\nB) Special Relativity\nExplanation: Einstein ki theory ko direct support mila ✅\n```\n\nQ3. Light ko travel karne ke liye kya chahiye?\n\nA) Ether\n\nB) Air\n\nC) No medium needed\n\nD) Water\n\n```diff\nC) No medium needed\nExplanation: EM waves vacuum mein bhi travel karti hain ✅\n```\n\nQ4. Is result ka impact physics par?\n\nA) Minor\n\nB) Revolutionary\n\nC) No impact\n\nD) Negative\n\n```diff\nB) Revolutionary\nExplanation: Modern physics ka foundation ban gaya ✅\n```\n\nQ5. Experiment failure tha ya success?\n\nA) Failure\n\nB) Success in proving null\n\nC) Incomplete\n\nD) Invalid\n\n```diff\nB) Success in proving null\nExplanation: Null result bhi ek important discovery hai ✅\n```"
      },

      "Length Contraction": {
        summarize: "## Summary: Length Contraction 📏⚡\n\nBhai, **Length Contraction** Special Relativity ka ek amazing consequence hai.\n\nJab koi object light ke comparable speed se move karta hai, toh uski length motion ki direction mein **shrink** ho jaati hai — observer ke liye.\n\nYe contraction real hai par sirf high speeds par noticeable hai. Formula hai: **L = L₀√(1 - v²/c²)**\n\nDaily life mein nahi dikhta kyunki humari speeds light se bahut kam hain 😎🔥.",
        mcq: "## 5 MCQs: Length Contraction 🎯\n\nQ1. Length contraction kab hota hai?\n\nA) Rest par\n\nB) High speed motion mein\n\nC) Low speed\n\nD) Zero velocity\n\n```diff\nB) High speed motion mein\nExplanation: Light ke comparable speed par visible hota hai ✅\n```\n\nQ2. Length kis direction mein shrink hoti hai?\n\nA) Perpendicular\n\nB) Along motion\n\nC) All directions\n\nD) Upward\n\n```diff\nB) Along motion\nExplanation: Sirf motion ki direction mein contraction hota hai ✅\n```\n\nQ3. Proper length kya hoti hai?\n\nA) Contracted length\n\nB) Length at rest\n\nC) Moving length\n\nD) Zero length\n\n```diff\nB) Length at rest\nExplanation: L₀ rest frame mein measure hoti hai ✅\n```\n\nQ4. Daily life mein length contraction kyu nahi dikhta?\n\nA) Doesn't exist\n\nB) Our speeds are too low\n\nC) Only in space\n\nD) Temperature effect\n\n```diff\nB) Our speeds are too low\nExplanation: Effect tabhi noticeable hai jab v ~ c ho ✅\n```\n\nQ5. Length contraction kis theory se aata hai?\n\nA) Classical\n\nB) Special Relativity\n\nC) Quantum\n\nD) Thermodynamics\n\n```diff\nB) Special Relativity\nExplanation: Lorentz transformation ka consequence hai ✅\n```"
      },

      "Time Dilation": {
        summarize: "## Summary: Time Dilation ⏱️🚀\n\nBhai, **Time Dilation** Relativity ka sabse mind-blowing concept hai.\n\nJab koi object high speed se move karta hai, toh uske liye time **slow** ho jaata hai compared to stationary observer.\n\nFormula hai: **t = t₀/√(1 - v²/c²)**\n\nGPS satellites mein is effect ko account karna padta hai warna location accuracy bigad jaati hai. Twin paradox bhi isi concept par based hai 😎🔥.",
        mcq: "## 5 MCQs: Time Dilation 🎯\n\nQ1. Time dilation mein moving clock?\n\nA) Tez chalta hai\n\nB) Slow chalta hai\n\nC) Ruk jaata hai\n\nD) Same rehta hai\n\n```diff\nB) Slow chalta hai\nExplanation: Moving clock slow tick karta hai ✅\n```\n\nQ2. Proper time kya hai?\n\nA) Dilated time\n\nB) Time in rest frame\n\nC) Universal time\n\nD) Zero time\n\n```diff\nB) Time in rest frame\nExplanation: Observer ke rest frame mein measured time ✅\n```\n\nQ3. Time dilation ka practical use?\n\nA) Cooking\n\nB) GPS satellites\n\nC) Painting\n\nD) Music\n\n```diff\nB) GPS satellites\nExplanation: Accuracy ke liye time dilation correct karna padta hai ✅\n```\n\nQ4. Twin paradox kis concept par based hai?\n\nA) Length contraction\n\nB) Time dilation\n\nC) Mass increase\n\nD) Energy\n\n```diff\nB) Time dilation\nExplanation: Space traveler younger rehta hai ✅\n```\n\nQ5. Speed badhne par time dilation?\n\nA) Decreases\n\nB) Increases\n\nC) Constant\n\nD) Zero\n\n```diff\nB) Increases\nExplanation: Jitni zyada speed, utna zyada dilation ✅\n```"
      },

      "Velocity Addition Theorem": {
        summarize: "## Summary: Velocity Addition Theorem ➕🚀\n\nBhai, Classical physics mein velocities simply add hoti hain (v₁ + v₂). Par **Relativistic Velocity Addition** different hai.\n\nJab speeds light ke paas hoti hain, Einstein ka formula use hota hai:\n**u = (v + u')/(1 + vu'/c²)**\n\nYe ensure karta hai ki result kabhi bhi speed of light se zyada na ho. Agar dono speeds c hain, toh bhi result c hi aata hai 😎🔥.",
        mcq: "## 5 MCQs: Velocity Addition Theorem 🎯\n\nQ1. Classical velocity addition kya hai?\n\nA) v₁ × v₂\n\nB) v₁ + v₂\n\nC) v₁ - v₂\n\nD) v₁/v₂\n\n```diff\nB) v₁ + v₂\nExplanation: Simple addition hoti hai classical mein ✅\n```\n\nQ2. Relativistic addition kab zaroori hai?\n\nA) Low speeds\n\nB) High speeds near c\n\nC) Rest\n\nD) Zero velocity\n\n```diff\nB) High speeds near c\nExplanation: Light speed ke paas classical fail hota hai ✅\n```\n\nQ3. Relativistic addition ensure karta hai?\n\nA) Speed > c possible\n\nB) Speed never exceeds c\n\nC) Speed = 0\n\nD) Infinite speed\n\n```diff\nB) Speed never exceeds c\nExplanation: Light speed limit preserve hoti hai ✅\n```\n\nQ4. c + c = ?\n\nA) 2c\n\nB) c\n\nC) 0\n\nD) Infinity\n\n```diff\nB) c\nExplanation: Relativistic formula se c hi aata hai ✅\n```\n\nQ5. Ye theorem kis theory ka part hai?\n\nA) Classical\n\nB) Quantum\n\nC) Special Relativity\n\nD) Thermodynamics\n\n```diff\nC) Special Relativity\nExplanation: Einstein ki theory ka important result hai ✅\n```"
      },

      "Variation of Mass": {
        summarize: "## Summary: Variation of Mass ⚖️🚀\n\nBhai, **Relativistic Mass** ka concept kehta hai ki jab object ki speed badhti hai, toh uska mass bhi badhta hai.\n\nFormula hai: **m = m₀/√(1 - v²/c²)**\n\nJab v → c, mass → infinity. Isliye kisi bhi massive object ko light speed tak accelerate karna impossible hai — infinite energy lagegi.\n\nParticle accelerators mein ye effect clearly observe hota hai 😎🔥.",
        mcq: "## 5 MCQs: Variation of Mass 🎯\n\nQ1. Speed badhne par mass?\n\nA) Decreases\n\nB) Increases\n\nC) Constant\n\nD) Zero\n\n```diff\nB) Increases\nExplanation: Relativistic mass increase hota hai ✅\n```\n\nQ2. Rest mass kya hai?\n\nA) Moving mass\n\nB) Mass at v=0\n\nC) Infinite mass\n\nD) Zero mass\n\n```diff\nB) Mass at v=0\nExplanation: m₀ rest frame mein measured mass hai ✅\n```\n\nQ3. v = c par mass?\n\nA) Zero\n\nB) Finite\n\nC) Infinity\n\nD) Negative\n\n```diff\nC) Infinity\nExplanation: Denominator zero ho jaata hai ✅\n```\n\nQ4. Object ko light speed tak accelerate karna?\n\nA) Easy\n\nB) Impossible\n\nC) Cheap\n\nD) Automatic\n\n```diff\nB) Impossible\nExplanation: Infinite energy lagegi ✅\n```\n\nQ5. Mass variation kahan observe hota hai?\n\nA) Kitchen\n\nB) Particle accelerators\n\nC) Garden\n\nD) Library\n\n```diff\nB) Particle accelerators\nExplanation: High speed particles mein clearly dikhta hai ✅\n```"
      },

      "Einstein's Mass-Energy Relation": {
        summarize: "## Summary: E = mc² ⚡💥\n\nBhai, **E = mc²** duniya ka sabse famous equation hai. Einstein ne prove kiya ki mass aur energy same cheez ke do forms hain.\n\nIs equation ka matlab hai ki chhoti si mass mein bhi bahut zyada energy store hoti hai kyunki c² bahut bada number hai.\n\nNuclear reactions — fission aur fusion — isi principle par kaam karti hain. Sun ki energy bhi isi se aati hai 😎🔥.",
        mcq: "## 5 MCQs: Einstein's Mass-Energy Relation 🎯\n\nQ1. E = mc² mein c kya hai?\n\nA) Mass\n\nB) Speed of light\n\nC) Energy\n\nD) Force\n\n```diff\nB) Speed of light\nExplanation: c ≈ 3×10⁸ m/s hai ✅\n```\n\nQ2. Is equation ka meaning?\n\nA) Mass aur energy different hain\n\nB) Mass-energy equivalence\n\nC) Energy zero hai\n\nD) Mass infinite hai\n\n```diff\nB) Mass-energy equivalence\nExplanation: Mass energy mein convert ho sakta hai ✅\n```\n\nQ3. Nuclear bomb kis principle par based hai?\n\nA) Gravity\n\nB) E = mc²\n\nC) Sound\n\nD) Heat\n\n```diff\nB) E = mc²\nExplanation: Mass energy mein convert hota hai ✅\n```\n\nQ4. Sun ki energy kahan se aati hai?\n\nA) Burning\n\nB) Nuclear fusion\n\nC) Chemical reaction\n\nD) Wind\n\n```diff\nB) Nuclear fusion\nExplanation: Hydrogen fusion se mass energy mein convert hoti hai ✅\n```\n\nQ5. Equation kisne diya?\n\nA) Newton\n\nB) Einstein\n\nC) Faraday\n\nD) Maxwell\n\n```diff\nB) Einstein\nExplanation: Special Relativity ka part hai ✅\n```"
      },

      "Energy-Momentum Relation": {
        summarize: "## Summary: Energy-Momentum Relation 🔗⚡\n\nBhai, **Energy-Momentum Relation** relativistic physics ka complete equation hai:\n\n**E² = (pc)² + (m₀c²)²**\n\nYe equation mass, energy aur momentum ko connect karta hai. Photons ke liye m₀ = 0, toh E = pc.\n\nYe relation particle physics mein fundamental hai aur collision calculations mein use hota hai 😎🔥.",
        mcq: "## 5 MCQs: Energy-Momentum Relation 🎯\n\nQ1. Complete relativistic energy formula?\n\nA) E = mc²\n\nB) E² = (pc)² + (m₀c²)²\n\nC) E = mv\n\nD) E = hν\n\n```diff\nB) E² = (pc)² + (m₀c²)²\nExplanation: Ye complete relation hai ✅\n```\n\nQ2. Photon ke liye m₀ = ?\n\nA) 1\n\nB) 0\n\nC) Infinity\n\nD) c\n\n```diff\nB) 0\nExplanation: Photon ka rest mass zero hai ✅\n```\n\nQ3. Photon ki energy?\n\nA) E = mc²\n\nB) E = pc\n\nC) E = 0\n\nD) E = mv\n\n```diff\nB) E = pc\nExplanation: m₀ = 0 se ye result aata hai ✅\n```\n\nQ4. Ye relation kahan use hota hai?\n\nA) Cooking\n\nB) Particle physics\n\nC) Painting\n\nD) Music\n\n```diff\nB) Particle physics\nExplanation: Collision calculations mein fundamental hai ✅\n```\n\nQ5. p kya represent karta hai?\n\nA) Power\n\nB) Momentum\n\nC) Pressure\n\nD) Potential\n\n```diff\nB) Momentum\nExplanation: Relativistic momentum hai ✅\n```"
      },

      "Wedge Shaped Thin Films": {
        summarize: "## Summary: Wedge Shaped Thin Films 📐🌈\n\nBhai, **Wedge Shaped Thin Film** ek non-uniform thickness wali film hoti hai jo ek end par moti aur doosre par patli hoti hai.\n\nJab light is film par padti hai, toh interference hota hai aur **parallel straight fringes** banti hain.\n\nYe experiment film ki thickness, refractive index ya wavelength measure karne ke liye use hota hai 😎🔥.",
        mcq: "## 5 MCQs: Wedge Shaped Thin Films 🎯\n\nQ1. Wedge film mein thickness?\n\nA) Uniform\n\nB) Non-uniform\n\nC) Zero\n\nD) Infinite\n\n```diff\nB) Non-uniform\nExplanation: Ek taraf moti, doosri taraf patli hoti hai ✅\n```\n\nQ2. Fringes ka shape kya hota hai?\n\nA) Circular\n\nB) Straight parallel\n\nC) Random\n\nD) Spiral\n\n```diff\nB) Straight parallel\nExplanation: Wedge geometry se straight fringes banti hain ✅\n```\n\nQ3. Wedge angle ka effect fringes par?\n\nA) No effect\n\nB) Fringe width change\n\nC) Color change\n\nD) Disappear\n\n```diff\nB) Fringe width change\nExplanation: Angle badhne se fringe width kam hoti hai ✅\n```\n\nQ4. Is experiment ka use?\n\nA) Temperature measure\n\nB) Thickness/wavelength measure\n\nC) Speed measure\n\nD) Mass measure\n\n```diff\nB) Thickness/wavelength measure\nExplanation: Optical measurements ke liye useful hai ✅\n```\n\nQ5. Fringes kis phenomenon se banti hain?\n\nA) Diffraction\n\nB) Interference\n\nC) Reflection\n\nD) Refraction\n\n```diff\nB) Interference\nExplanation: Thin film interference hota hai ✅\n```"
      },

      "Single & Double Slit": {
        summarize: "## Summary: Single & Double Slit Diffraction 🌊📏\n\nBhai, **Single Slit Diffraction** mein light ek narrow slit se pass karke screen par bright aur dark bands banaati hai.\n\nCentral maximum sabse bright hota hai aur side par secondary maxima weaker hote hain.\n\n**Double Slit** mein interference aur diffraction dono hoti hai — Thomas Young ne is experiment se light ki wave nature prove ki thi 😎🔥.",
        mcq: "## 5 MCQs: Single & Double Slit 🎯\n\nQ1. Single slit mein central maximum?\n\nA) Dimmest\n\nB) Brightest\n\nC) No light\n\nD) Same as sides\n\n```diff\nB) Brightest\nExplanation: Maximum intensity center par hoti hai ✅\n```\n\nQ2. Young's double slit experiment prove karta hai?\n\nA) Particle nature\n\nB) Wave nature of light\n\nC) Heat nature\n\nD) Magnetic nature\n\n```diff\nB) Wave nature of light\nExplanation: Interference pattern wave behavior hai ✅\n```\n\nQ3. Double slit mein kya hota hai?\n\nA) Only diffraction\n\nB) Only interference\n\nC) Both diffraction + interference\n\nD) No pattern\n\n```diff\nC) Both diffraction + interference\nExplanation: Dono effects milte hain ✅\n```\n\nQ4. Slit width badhane par central maximum?\n\nA) Widens\n\nB) Narrows\n\nC) Disappears\n\nD) No change\n\n```diff\nB) Narrows\nExplanation: Wider slit = narrower diffraction pattern ✅\n```\n\nQ5. Fraunhofer diffraction mein source?\n\nA) Near\n\nB) At infinity\n\nC) On screen\n\nD) Inside slit\n\n```diff\nB) At infinity\nExplanation: Parallel rays use hote hain ✅\n```"
      },

      // ===============================
      // UNIT 2 – ELECTROMAGNETIC THEORY
      // ===============================

      "Gauss's Theorem": {
        summarize: "## Summary: Gauss's Theorem ⚡📦\n\nBhai, **Gauss's Theorem** electrostatics ka powerful law hai jo electric flux aur enclosed charge ke beech relation batata hai.\n\nSimple language mein: closed surface ke through total electric flux depend karta hai sirf enclosed charge par, shape par nahi 💡.\n\nHighly symmetric systems (sphere, cylinder) ke electric field calculate karne mein ye law super useful hai 😎.",
        mcq: "## 5 MCQs: Gauss's Theorem 🎯\n\nQ1. Gauss's law kis quantity se related hai?\n\nA) Magnetic field\n\nB) Electric flux\n\nC) Current\n\nD) Energy\n\n```diff\nB) Electric flux\nExplanation: Flux aur charge ka relation deta hai ✅\n```\n\nQ2. Electric flux depend karta hai?\n\nA) Shape\n\nB) Area only\n\nC) Enclosed charge\n\nD) Distance\n\n```diff\nC) Enclosed charge\nExplanation: Sirf charge matter karta hai ✅\n```\n\nQ3. Gauss law best use hota hai?\n\nA) Random charge\n\nB) Symmetric systems\n\nC) AC circuits\n\nD) Motors\n\n```diff\nB) Symmetric systems\nExplanation: Calculation easy ho jaati hai symmetry se ✅\n```\n\nQ4. Closed surface ka matlab?\n\nA) Open wire\n\nB) Infinite plane\n\nC) Enclosing surface\n\nD) Loop\n\n```diff\nC) Enclosing surface\nExplanation: Pura charge ko surround karti hai ✅\n```\n\nQ5. Gauss law kis field ka part hai?\n\nA) Mechanics\n\nB) Electrostatics\n\nC) Optics\n\nD) Acoustics\n\n```diff\nB) Electrostatics\nExplanation: Static charges ke liye apply hota hai ✅\n```"
      },

      "Ampere's Law": {
        summarize: "## Summary: Ampere's Law 🧲🔄\n\nBhai, **Ampere's Law** magnetostatics ka rule hai jo magnetic field aur current ke beech relation batata hai.\n\nYe kehta hai ki closed loop ke along magnetic field ka line integral enclosed current ke proportional hota hai.\n\nLong straight wire, solenoid aur toroid jaise cases mein magnetic field nikalna easy ho jaata hai 😎.",
        mcq: "## 5 MCQs: Ampere's Law 🎯\n\nQ1. Ampere's law kis se related hai?\n\nA) Electric field\n\nB) Magnetic field\n\nC) Energy\n\nD) Voltage\n\n```diff\nB) Magnetic field\nExplanation: Current se magnetic field relate karta hai ✅\n```\n\nQ2. Ampere's law kab best apply hota hai?\n\nA) Random fields\n\nB) Symmetric current distribution\n\nC) AC signals\n\nD) Capacitors\n\n```diff\nB) Symmetric current distribution\nExplanation: Symmetry se calculation simple hoti hai ✅\n```\n\nQ3. Enclosed current ka matlab?\n\nA) External current\n\nB) Loop ke andar current\n\nC) Surface current\n\nD) Zero current\n\n```diff\nB) Loop ke andar current\nExplanation: Loop ke through pass hota current matter karta hai ✅\n```\n\nQ4. Ampere law kis condition mein incomplete tha?\n\nA) Static current\n\nB) Time varying fields\n\nC) DC only\n\nD) Rest state\n\n```diff\nB) Time varying fields\nExplanation: Maxwell ne displacement current add kiya ✅\n```\n\nQ5. Solenoid ke magnetic field ke liye kaunsa law use hota hai?\n\nA) Coulomb\n\nB) Gauss\n\nC) Ampere\n\nD) Faraday\n\n```diff\nC) Ampere\nExplanation: Symmetric current distribution hai ✅\n```"
      },

      "Ohm's Law": {
        summarize: "## Summary: Ohm’s Law ⚡🔌\n\nBhai, **Ohm’s Law** electricity ka sabse basic aur powerful rule hai. Ye batata hai ki **current (I)** kisi conductor mein kaise flow karta hai jab **voltage (V)** apply hota hai.\n\nSimple words mein: **jitna zyada voltage, utna zyada current**, jab resistance constant ho. Is relation ko likhte hain: V ∝ I ya V = IR 💡.\n\nOhm’s Law circuits ko design aur analyze karne ka base hai. Har electrical aur electronic device — bulb, heater, resistor — sab isi rule par kaam karte hain 😎.",
        mcq: "## 5 MCQs: Ohm’s Law 🎯\n\nQ1. Ohm’s Law ka relation kya hai?\n\nA) V = I/R\n\nB) V = IR\n\nC) I = VR\n\nD) R = VI\n\n```diff\nB) V = IR\nExplanation: Voltage current aur resistance ka product hota hai ✅\n```\n\nQ2. Ohm’s Law kis condition mein valid hota hai?\n\nA) Variable temperature\n\nB) Constant temperature\n\nC) High frequency\n\nD) Vacuum\n\n```diff\nB) Constant temperature\nExplanation: Temperature change se resistance change hoti hai ❌\n```\n\nQ3. Resistance ka unit kya hota hai?\n\nA) Ampere\n\nB) Volt\n\nC) Ohm\n\nD) Watt\n\n```diff\nC) Ohm\nExplanation: Resistance ka SI unit Ohm hota hai ✅\n```\n\nQ4. Agar resistance increase ho aur voltage same rahe?\n\nA) Current increase\n\nB) Current decrease\n\nC) Current zero\n\nD) No change\n\n```diff\nB) Current decrease\nExplanation: I = V/R, R badhne se I kam hota hai ✅\n```\n\nQ5. Ohm’s Law ka main use?\n\nA) Circuit analysis\n\nB) Heating only\n\nC) Magnetism\n\nD) Optics\n\n```diff\nA) Circuit analysis\nExplanation: Electrical networks samajhne ka base hai ✅\n```"
      },

      "Laws of EM Induction": {
        summarize: "## Summary: Laws of EM Induction 🔄🧲\n\nBhai, **Electromagnetic Induction** ka matlab hota hai current ka generate hona jab magnetic flux change hota hai.\n\n**Faraday’s Law** kehta hai ki induced EMF magnetic flux ke rate of change ke proportional hota hai.\n\n**Lenz’s Law** direction batata hai — induced current hamesha change ko oppose karta hai. Ye law energy conservation ko ensure karta hai 💪.\n\nGenerators, transformers aur induction cooktops sab isi principle par kaam karte hain 😎.",
        mcq: "## 5 MCQs: Laws of EM Induction 🎯\n\nQ1. EM induction ka cause kya hai?\n\nA) Constant flux\n\nB) Changing magnetic flux\n\nC) Electric field\n\nD) Resistance\n\n```diff\nB) Changing magnetic flux\nExplanation: Flux change se hi EMF induce hota hai ✅\n```\n\nQ2. Faraday’s law kis cheez se related hai?\n\nA) Direction\n\nB) Magnitude of EMF\n\nC) Resistance\n\nD) Energy\n\n```diff\nB) Magnitude of EMF\nExplanation: Rate of change of flux par depend karta hai ✅\n```\n\nQ3. Lenz’s Law kya batata hai?\n\nA) Magnitude\n\nB) Direction of induced current\n\nC) Speed\n\nD) Frequency\n\n```diff\nB) Direction of induced current\nExplanation: Induced current hamesha cause ko oppose karta hai ✅\n```\n\nQ4. Lenz’s law kis principle ko follow karta hai?\n\nA) Momentum conservation\n\nB) Energy conservation\n\nC) Charge conservation\n\nD) Mass conservation\n\n```diff\nB) Energy conservation\nExplanation: Free energy creation ko prevent karta hai ✅\n```\n\nQ5. EM induction ka practical use?\n\nA) Motors\n\nB) Generators\n\nC) Capacitors\n\nD) Batteries\n\n```diff\nB) Generators\nExplanation: Mechanical energy ko electrical mein convert karta hai ✅\n```"
      },

      "Self & Mutual Induction": {
        summarize: "## Summary: Self & Mutual Induction 🔁⚡\n\nBhai, **Self Induction** tab hota hai jab kisi coil mein current change hone par usi coil mein EMF induce ho jaata hai.\n\nIska effect hota hai ki circuit current change ko oppose karta hai. Is property ko **Inductance** kehte hain.\n\n**Mutual Induction** mein ek coil ke current change se paas wali coil mein EMF induce hota hai. Transformer isi principle par kaam karta hai 💡.\n\nInduction energy storage aur power transfer ka base hai 😎.",
        mcq: "## 5 MCQs: Self & Mutual Induction 🎯\n\nQ1. Self induction kis mein hota hai?\n\nA) Two coils\n\nB) Same coil\n\nC) Capacitor\n\nD) Battery\n\n```diff\nB) Same coil\nExplanation: Current change se usi coil mein EMF induce hota hai ✅\n```\n\nQ2. Mutual induction ka example?\n\nA) Motor\n\nB) Transformer\n\nC) Battery\n\nD) Heater\n\n```diff\nB) Transformer\nExplanation: Ek coil se doosri coil mein EMF induce hota hai ✅\n```\n\nQ3. Inductance ka SI unit?\n\nA) Ohm\n\nB) Henry\n\nC) Tesla\n\nD) Weber\n\n```diff\nB) Henry\nExplanation: Inductance ka unit Henry hota hai ✅\n```\n\nQ4. Induction ka effect kis cheez ko oppose karta hai?\n\nA) Voltage\n\nB) Current change\n\nC) Resistance\n\nD) Power\n\n```diff\nB) Current change\nExplanation: Lenz’s law follow karta hai ✅\n```\n\nQ5. Energy induction mein kis form mein store hoti hai?\n\nA) Heat\n\nB) Chemical\n\nC) Magnetic field\n\nD) Light\n\n```diff\nC) Magnetic field\nExplanation: Inductor energy magnetic field mein store karta hai ✅\n```"
      },

      "Concept of Displacement Current": {
        summarize: "## Summary: Displacement Current ⚡🧠\n\nBhai, **Displacement Current** Maxwell ka ek revolutionary idea tha. Ampere’s law sirf steady current ke liye valid tha, par time-varying fields mein fail ho jaata tha.\n\nMaxwell ne bola ki changing electric field bhi current jaisa effect produce karta hai — isi ko displacement current kehte hain.\n\nCapacitor ke plates ke beech actual current nahi hota, phir bhi magnetic field milti hai — ye displacement current se explain hota hai 😎🔥.",
        mcq: "## 5 MCQs: Displacement Current 🎯\n\nQ1. Displacement current kisne introduce kiya?\n\nA) Faraday\n\nB) Maxwell\n\nC) Ampere\n\nD) Einstein\n\n```diff\nB) Maxwell\nExplanation: Ampere’s law ko complete kiya ✅\n```\n\nQ2. Displacement current kis se related hai?\n\nA) Changing magnetic field\n\nB) Changing electric field\n\nC) Constant current\n\nD) Resistance\n\n```diff\nB) Changing electric field\nExplanation: Time-varying electric field se aata hai ✅\n```\n\nQ3. Capacitor gap mein current kaise explain hota hai?\n\nA) Real charges\n\nB) Heat\n\nC) Displacement current\n\nD) Zero current\n\n```diff\nC) Displacement current\nExplanation: Magnetic field ka source wahi hota hai ✅\n```\n\nQ4. Displacement current add karne ka reason?\n\nA) New theory banana\n\nB) Ampere’s law ko correct karna\n\nC) Energy save karna\n\nD) Speed badhana\n\n```diff\nB) Ampere’s law ko correct karna\nExplanation: Time varying fields handle karne ke liye ✅\n```\n\nQ5. Displacement current ka unit?\n\nA) Ampere\n\nB) Volt\n\nC) Ohm\n\nD) Tesla\n\n```diff\nA) Ampere\nExplanation: Ye current ke barabar dimension rakhta hai ✅\n```"
      },

      "Equations in Free Space": {
        summarize: "## Summary: Maxwell’s Equations in Free Space 🌌⚡\n\nBhai, **Maxwell’s Equations** electromagnetism ka heart hain. Free space ka matlab jaha koi material medium nahi hota.\n\nIn equations se pata chalta hai kaise electric aur magnetic fields generate hote hain aur ek doosre se linked hote hain.\n\nYe equations prove karti hain ki light ek **electromagnetic wave** hai. Physics ka ye sabse powerful result mana jaata hai 😎🔥.",
        mcq: "## 5 MCQs: Maxwell’s Equations (Free Space) 🎯\n\nQ1. Maxwell’s equations kitni hoti hain?\n\nA) 2\n\nB) 3\n\nC) 4\n\nD) 5\n\n```diff\nC) 4\nExplanation: Electromagnetism ke 4 fundamental equations hain ✅\n```\n\nQ2. Free space ka matlab?\n\nA) Conductor\n\nB) Dielectric\n\nC) Vacuum\n\nD) Metal\n\n```diff\nC) Vacuum\nExplanation: No material medium present hota hai ✅\n```\n\nQ3. Maxwell equations kis cheez ko link karti hain?\n\nA) Force & energy\n\nB) Electric & magnetic fields\n\nC) Mass & charge\n\nD) Voltage & current\n\n```diff\nB) Electric & magnetic fields\nExplanation: EM fields ka interaction batati hain ✅\n```\n\nQ4. Light ko kya prove karti hain?\n\nA) Particle only\n\nB) Electromagnetic wave\n\nC) Sound wave\n\nD) Matter wave\n\n```diff\nB) Electromagnetic wave\nExplanation: EM waves ka nature bataya Maxwell ne ✅\n```\n\nQ5. Maxwell equations ka use?\n\nA) Circuit only\n\nB) Antennas & waves\n\nC) Cooking\n\nD) Painting\n\n```diff\nB) Antennas & waves\nExplanation: Communication systems ka base hain ✅\n```"
      },

      "Equations in Media": {
        summarize: "## Summary: Maxwell’s Equations in Media 🧪⚡\n\nBhai, jab electric aur magnetic fields kisi **material medium** mein hote hain, tab Maxwell’s equations thodi modify ho jaati hain.\n\nMedium ki properties jaise permittivity aur permeability field behavior ko affect karti hain.\n\nIs case mein polarization aur magnetization important ho jaate hain. Ye equations real materials ke EM behavior ko explain karti hain 😎.",
        mcq: "## 5 MCQs: Maxwell’s Equations (Media) 🎯\n\nQ1. Maxwell equations media mein kis se change hoti hain?\n\nA) Mass\n\nB) Permittivity & permeability\n\nC) Temperature\n\nD) Pressure\n\n```diff\nB) Permittivity & permeability\nExplanation: Medium ki properties matter karti hain ✅\n```\n\nQ2. Polarization kis se related hai?\n\nA) Magnetic field\n\nB) Electric field\n\nC) Current\n\nD) Resistance\n\n```diff\nB) Electric field\nExplanation: Electric dipoles align hote hain ✅\n```\n\nQ3. Magnetization kis se related hai?\n\nA) Electric field\n\nB) Magnetic field\n\nC) Voltage\n\nD) Energy\n\n```diff\nB) Magnetic field\nExplanation: Magnetic dipoles align hote hain ✅\n```\n\nQ4. Maxwell equations media mein kyu important hain?\n\nA) Ideal theory\n\nB) Real materials samajhne ke liye\n\nC) Only vacuum\n\nD) No use\n\n```diff\nB) Real materials samajhne ke liye\nExplanation: Practical EM systems ke liye zaroori hai ✅\n```\n\nQ5. Dielectrics kis category mein aate hain?\n\nA) Free space\n\nB) Media\n\nC) Vacuum\n\nD) Conductor\n\n```diff\nB) Media\nExplanation: Dielectric ek material medium hota hai ✅\n```"
      },

      "Waves in Free Space": {
        summarize: "## Summary: EM Waves in Free Space 🌊⚡\n\nBhai, **Electromagnetic waves** bina kisi medium ke bhi travel kar sakti hain — vacuum mein bhi. Ye Maxwell equations ka direct result hai.\n\nIn waves mein electric aur magnetic fields ek doosre ke perpendicular hote hain aur direction of propagation ke bhi perpendicular hote hain.\n\nLight, radio waves, X-rays — sab EM waves hain. Communication aur astronomy ka base yahi concept hai 😎🔥.",
        mcq: "## 5 MCQs: EM Waves in Free Space 🎯\n\nQ1. EM waves kis medium mein travel kar sakti hain?\n\nA) Only solid\n\nB) Only gas\n\nC) Vacuum\n\nD) Liquid only\n\n```diff\nC) Vacuum\nExplanation: Medium ki zaroorat nahi hoti EM waves ko ✅\n```\n\nQ2. EM wave mein electric aur magnetic fields hote hain?\n\nA) Parallel\n\nB) Anti-parallel\n\nC) Perpendicular\n\nD) Random\n\n```diff\nC) Perpendicular\nExplanation: Dono ek doosre aur propagation ke perpendicular hote hain ✅\n```\n\nQ3. EM wave ki speed vacuum mein?\n\nA) Variable\n\nB) Zero\n\nC) Constant\n\nD) Infinite\n\n```diff\nC) Constant\nExplanation: Speed of light constant hoti hai vacuum mein ✅\n```\n\nQ4. Light kis type ki wave hai?\n\nA) Mechanical\n\nB) Sound\n\nC) Electromagnetic\n\nD) Matter\n\n```diff\nC) Electromagnetic\nExplanation: Light EM spectrum ka part hai ✅\n```\n\nQ5. EM waves ka use kaha hota hai?\n\nA) Communication\n\nB) Medical imaging\n\nC) Astronomy\n\nD) All of these\n\n```diff\nD) All of these\nExplanation: EM waves har jagah use hoti hain ✅\n```"
      },




      "Conditions for Interference": {
        summarize: "## Summary: Conditions for Interference 🌈✨\n\nBhai, **Interference** tab hota hai jab do light waves superpose karti hain aur brightness ka pattern ban jaata hai — kabhi bright, kabhi dark fringes.\n\nPar har do light sources interference nahi dikha sakte. Sabse pehli condition hoti hai **Coherence**. Matlab dono sources ka frequency same hona chahiye aur phase difference constant rehna chahiye.\n\nDusri important condition hai **Amplitude**. Agar ek wave bahut strong ho aur doosri bahut weak, toh clear fringes nahi milte.\n\nSimple bolu toh: **same frequency + stable phase + comparable amplitude = clear interference** 😎🔥.",
        mcq: "## 5 MCQs: Conditions for Interference 🎯\n\nQ1. Interference ke liye sabse important condition?\n\nA) High intensity\n\nB) Coherence\n\nC) Reflection\n\nD) Polarization\n\n```diff\nB) Coherence\nExplanation: Stable phase difference interference ke liye zaroori hai ✅\n```\n\nQ2. Coherent sources ka matlab?\n\nA) Same color\n\nB) Same phase difference\n\nC) Same intensity\n\nD) Same direction\n\n```diff\nB) Same phase difference\nExplanation: Phase difference constant hona chahiye ✅\n```\n\nQ3. Agar amplitudes bahut different ho toh?\n\nA) Bright fringes milengi\n\nB) Clear pattern nahi dikhega\n\nC) Only dark fringes\n\nD) No light\n\n```diff\nB) Clear pattern nahi dikhega\nExplanation: Fringe visibility kam ho jaati hai ✅\n```\n\nQ4. Interference kis principle par based hai?\n\nA) Reflection\n\nB) Superposition\n\nC) Refraction\n\nD) Diffraction\n\n```diff\nB) Superposition\nExplanation: Waves add ya subtract karti hain ✅\n```\n\nQ5. Interference prove karta hai?\n\nA) Particle nature\n\nB) Wave nature of light\n\nC) Thermal nature\n\nD) Electrical nature\n\n```diff\nB) Wave nature of light\nExplanation: Interference wave behavior ka proof hai ✅\n```"
      },

      "Newton's Rings": {
        summarize: "## Summary: Newton's Rings 🔵📏\n\nBhai, **Newton’s Rings** circular interference fringes hote hain jo tab bante hain jab ek plano-convex lens ko flat glass plate par rakha jaata hai.\n\nIs setup mein lens aur plate ke beech ek thin air film ban jaati hai jiska thickness center se bahar jaate hue badhta hai. Isi wajah se concentric bright aur dark rings dikhti hain 👀.\n\nNewton’s Rings ka sabse bada use hota hai **wavelength of light**, **refractive index**, aur **lens curvature** measure karne mein. Isliye ye experiment exams mein bahut important hai 😎.",
        mcq: "## 5 MCQs: Newton’s Rings 🎯\n\nQ1. Newton’s Rings ka reason kya hai?\n\nA) Diffraction\n\nB) Polarization\n\nC) Thin film interference\n\nD) Reflection only\n\n```diff\nC) Thin film interference\nExplanation: Air film ke kaaran interference hota hai ✅\n```\n\nQ2. Rings ka shape kaisa hota hai?\n\nA) Straight\n\nB) Elliptical\n\nC) Circular\n\nD) Random\n\n```diff\nC) Circular\nExplanation: Symmetric air film ki wajah se rings circular hoti hain ✅\n```\n\nQ3. Center par ring hoti hai?\n\nA) Bright\n\nB) Dark\n\nC) Colored\n\nD) Random\n\n```diff\nB) Dark\nExplanation: Zero thickness par destructive interference hota hai ✅\n```\n\nQ4. Newton’s Rings ka practical use?\n\nA) Measuring wavelength\n\nB) Measuring force\n\nC) Measuring temperature\n\nD) Measuring current\n\n```diff\nA) Measuring wavelength\nExplanation: Fringe diameter se wavelength nikalte hain ✅\n```\n\nQ5. Newton’s Rings prove karta hai?\n\nA) Particle nature\n\nB) Wave nature\n\nC) Thermal nature\n\nD) Magnetic nature\n\n```diff\nB) Wave nature\nExplanation: Interference wave behavior ka proof hai ✅\n```"
      },

      "Diffraction Grating": {
        summarize: "## Summary: Diffraction Grating 🌈📊\n\nBhai, **Diffraction Grating** ek optical element hota hai jisme bahut saari parallel slits hoti hain, equally spaced.\n\nJab light in slits se pass karti hai, toh diffraction aur interference dono combine ho jaate hain aur sharp spectral lines milti hain.\n\nGrating ka main fayda hota hai **high resolution** aur **accurate wavelength measurement**. Isliye spectroscopy mein iska use bahut common hai 😎🔥.",
        mcq: "## 5 MCQs: Diffraction Grating 🎯\n\nQ1. Diffraction grating mein kya hota hai?\n\nA) One slit\n\nB) Two slits\n\nC) Many equally spaced slits\n\nD) Random holes\n\n```diff\nC) Many equally spaced slits\nExplanation: Multiple slits se sharp spectra milta hai ✅\n```\n\nQ2. Grating ka main advantage?\n\nA) Low intensity\n\nB) High resolving power\n\nC) Cheap\n\nD) No dispersion\n\n```diff\nB) High resolving power\nExplanation: Closely spaced wavelengths ko separate karta hai ✅\n```\n\nQ3. Grating spectra kis phenomenon se banta hai?\n\nA) Reflection only\n\nB) Refraction only\n\nC) Diffraction + Interference\n\nD) Polarization\n\n```diff\nC) Diffraction + Interference\nExplanation: Dono effects milkar spectra banate hain ✅\n```\n\nQ4. Grating ka use kaha hota hai?\n\nA) Microscopy\n\nB) Spectroscopy\n\nC) Photography\n\nD) Heating\n\n```diff\nB) Spectroscopy\nExplanation: Wavelength analysis ke liye use hota hai ✅\n```\n\nQ5. Zyada slits ka effect?\n\nA) Blurred lines\n\nB) Sharper maxima\n\nC) No effect\n\nD) Darkness\n\n```diff\nB) Sharper maxima\nExplanation: Zyada slits se peaks sharp hoti hain ✅\n```"
      },

      // ===============================
      // RESOLVING POWER
      // ===============================

      "Rayleigh's Criterion": {
        summarize: "## Summary: Rayleigh’s Criterion 🔍✨\n\nBhai, **Resolving Power** ka matlab hota hai optical instrument ki capability ki wo do bahut close objects ko alag-alag dikha paaye ya nahi.\n\n**Rayleigh’s Criterion** kehta hai ki do images tab just resolved mani jaati hain jab ek image ka central maximum doosri image ke first minimum par aaye.\n\nSimple bolu toh: agar images zyada paas aa jaayein aur overlap ho jaaye, toh instrument confuse ho jaata hai 👀.\n\nMicroscope, telescope aur camera lens ka performance judge karne ke liye Rayleigh’s criterion bahut important hai 😎🔥.",
        mcq: "## 5 MCQs: Rayleigh’s Criterion 🎯\n\nQ1. Rayleigh’s criterion kis se related hai?\n\nA) Magnification\n\nB) Resolution\n\nC) Brightness\n\nD) Polarization\n\n```diff\nB) Resolution\nExplanation: Do close objects ko alag pehchanna resolution kehlata hai ✅\n```\n\nQ2. Just resolved condition kab hoti hai?\n\nA) Maxima overlap\n\nB) Central max at first min\n\nC) Complete overlap\n\nD) No overlap\n\n```diff\nB) Central max at first min\nExplanation: Ye Rayleigh ka condition hai ✅\n```\n\nQ3. Resolving power depend karta hai?\n\nA) Aperture size\n\nB) Wavelength\n\nC) Instrument design\n\nD) All of these\n\n```diff\nD) All of these\nExplanation: Resolution multiple factors par depend karta hai ✅\n```\n\nQ4. Zyada resolving power ka matlab?\n\nA) Blurred image\n\nB) Sharper image\n\nC) Dim image\n\nD) No image\n\n```diff\nB) Sharper image\nExplanation: Close objects clearly distinguish hote hain ✅\n```\n\nQ5. Rayleigh’s criterion mainly use hota hai?\n\nA) Mechanics\n\nB) Optics\n\nC) Thermodynamics\n\nD) Electronics\n\n```diff\nB) Optics\nExplanation: Optical instruments ka limit batata hai ✅\n```"
      },

      "Grating Resolving Power": {
        summarize: "## Summary: Grating Resolving Power 🌈📊\n\nBhai, **Diffraction Grating** ka resolving power batata hai ki wo do bahut close wavelengths ko kitna clearly separate kar sakta hai.\n\nGrating ka resolving power depend karta hai **number of slits** aur **order of spectrum** par.\n\nZyada slits aur higher order = better resolution 💡.\n\nIsi wajah se spectroscopy mein diffraction grating ko prism se zyada prefer kiya jaata hai 😎🔥.",
        mcq: "## 5 MCQs: Grating Resolving Power 🎯\n\nQ1. Grating resolving power kis cheez ko measure karta hai?\n\nA) Intensity\n\nB) Wavelength separation\n\nC) Reflection\n\nD) Refraction\n\n```diff\nB) Wavelength separation\nExplanation: Close wavelengths ko alag karne ki ability ✅\n```\n\nQ2. Resolving power increase hoti hai jab?\n\nA) Slits kam ho\n\nB) Order kam ho\n\nC) Slits aur order zyada ho\n\nD) Wavelength zyada ho\n\n```diff\nC) Slits aur order zyada ho\nExplanation: Resolution improve hoti hai ✅\n```\n\nQ3. Spectroscopy mein grating kyu use hoti hai?\n\nA) Cheap hai\n\nB) High resolving power\n\nC) Heavy hoti hai\n\nD) Easy cleaning\n\n```diff\nB) High resolving power\nExplanation: Fine spectral lines clearly dikhti hain ✅\n```\n\nQ4. Grating prism se better kyu hai?\n\nA) Less dispersion\n\nB) More absorption\n\nC) Sharper spectral lines\n\nD) Smaller size\n\n```diff\nC) Sharper spectral lines\nExplanation: Interference maxima narrow hoti hain ✅\n```\n\nQ5. Resolving power kis par depend nahi karta?\n\nA) Number of slits\n\nB) Order of spectrum\n\nC) Speed of light\n\nD) Wavelength\n\n```diff\nC) Speed of light\nExplanation: Resolution ka direct relation nahi hota ❌\n```"
      },

      // ===============================
      // LASER SYSTEMS
      // ===============================

      "Emission Processes": {
        summarize: "## Summary: Emission Processes 🔦⚛️\n\nBhai, **Laser** ka base concept emission processes par hi khada hai. Mainly teen processes hote hain — absorption, spontaneous emission aur stimulated emission.\n\n**Spontaneous emission** mein excited atom bina kisi external trigger ke photon emit karta hai, jo random direction aur phase ka hota hai.\n\n**Stimulated emission** laser ka heart hai. Isme incoming photon same energy ka naya photon generate karta hai — same direction, same phase 🔥.\n\nIsi wajah se laser light highly coherent aur intense hoti hai 😎.",
        mcq: "## 5 MCQs: Emission Processes 🎯\n\nQ1. Laser ka main principle?\n\nA) Absorption\n\nB) Spontaneous emission\n\nC) Stimulated emission\n\nD) Reflection\n\n```diff\nC) Stimulated emission\nExplanation: Same phase aur direction ke photons milte hain ✅\n```\n\nQ2. Spontaneous emission mein photons hote hain?\n\nA) Coherent\n\nB) Same direction\n\nC) Random\n\nD) Parallel\n\n```diff\nC) Random\nExplanation: Direction aur phase random hota hai ❌\n```\n\nQ3. Stimulated emission ka result?\n\nA) One photon\n\nB) No photon\n\nC) Two identical photons\n\nD) Heat\n\n```diff\nC) Two identical photons\nExplanation: Laser amplification ka base hai ✅\n```\n\nQ4. Laser light ki khasiyat?\n\nA) Incoherent\n\nB) Multicolor\n\nC) Coherent\n\nD) Weak\n\n```diff\nC) Coherent\nExplanation: Same phase aur wavelength hoti hai ✅\n```\n\nQ5. Emission processes relate to?\n\nA) Atomic energy levels\n\nB) Gravity\n\nC) Pressure\n\nD) Sound\n\n```diff\nA) Atomic energy levels\nExplanation: Electron transitions se emission hota hai ✅\n```"
      },

      "Ruby & He-Ne Lasers": {
        summarize: "## Summary: Ruby & He-Ne Lasers 🔴🔦\n\nBhai, **Ruby Laser** ek solid-state laser hai jisme ruby crystal (Al₂O₃ doped with Cr³⁺) use hota hai. Ye optical pumping se kaam karta hai aur pulsed output deta hai.\n\n**He-Ne Laser** gas laser hota hai jisme helium aur neon gas mixture hota hai. Ye continuous wave laser hai aur red light emit karta hai.\n\nHe-Ne laser zyada stable aur precise hota hai, isliye labs aur alignment work mein common hai 😎🔥.",
        mcq: "## 5 MCQs: Ruby & He-Ne Lasers 🎯\n\nQ1. Ruby laser kis type ka laser hai?\n\nA) Gas\n\nB) Liquid\n\nC) Solid state\n\nD) Semiconductor\n\n```diff\nC) Solid state\nExplanation: Ruby crystal use hota hai ✅\n```\n\nQ2. He-Ne laser ka output kaisa hota hai?\n\nA) Pulsed\n\nB) Continuous\n\nC) Random\n\nD) Infrared\n\n```diff\nB) Continuous\nExplanation: Stable CW laser hota hai ✅\n```\n\nQ3. Optical pumping kis laser mein hoti hai?\n\nA) He-Ne\n\nB) Ruby\n\nC) Diode\n\nD) Fiber\n\n```diff\nB) Ruby\nExplanation: Flash lamp se excitation hota hai ✅\n```\n\nQ4. He-Ne laser ka color?\n\nA) Blue\n\nB) Green\n\nC) Red\n\nD) Violet\n\n```diff\nC) Red\nExplanation: 632.8 nm wavelength hoti hai ✅\n```\n\nQ5. Zyada stable laser kaunsa hai?\n\nA) Ruby\n\nB) He-Ne\n\nC) Both same\n\nD) None\n\n```diff\nB) He-Ne\nExplanation: Continuous aur low noise output hota hai ✅\n```"
      },

      "Laser Applications": {
        summarize: "## Summary: Laser Applications 🚀🔬\n\nBhai, **Lasers** modern technology ka backbone ban chuke hain. Medical surgery se leke space communication tak lasers ka use hota hai.\n\nIndustry mein lasers cutting, welding aur drilling ke liye use hote hain kyunki beam highly focused hoti hai.\n\nCommunication, barcode scanners, fiber optics, defence systems — har jagah laser power dikhti hai 😎🔥.",
        mcq: "## 5 MCQs: Laser Applications 🎯\n\nQ1. Laser surgery ka fayda?\n\nA) Less precision\n\nB) Blood loss zyada\n\nC) High precision\n\nD) Slow healing\n\n```diff\nC) High precision\nExplanation: Focused beam accurate cutting karti hai ✅\n```\n\nQ2. Industrial laser ka use?\n\nA) Painting\n\nB) Cutting & welding\n\nC) Cooling\n\nD) Lighting\n\n```diff\nB) Cutting & welding\nExplanation: High energy density hoti hai ✅\n```\n\nQ3. Barcode scanner kis principle par kaam karta hai?\n\nA) Reflection of laser\n\nB) Diffraction\n\nC) Interference\n\nD) Polarization\n\n```diff\nA) Reflection of laser\nExplanation: Reflected signal detect hota hai ✅\n```\n\nQ4. Fiber communication mein kya use hota hai?\n\nA) LED only\n\nB) Laser\n\nC) Bulb\n\nD) Heater\n\n```diff\nB) Laser\nExplanation: Coherent light long distance travel karti hai ✅\n```\n\nQ5. Laser defence mein kyu useful hai?\n\nA) Heavy\n\nB) Accurate targeting\n\nC) Random\n\nD) Cheap\n\n```diff\nB) Accurate targeting\nExplanation: Highly directional beam hoti hai ✅\n```"
      },

      // ===============================
      // FIBER OPTICS
      // ===============================

      "Optical Fiber Construction": {
        summarize: "## Summary: Optical Fiber Construction 🌐🔗\n\nBhai, **Optical Fiber** ek thin transparent fiber hota hai jo light ke through information carry karta hai.\n\nFiber ke teen main parts hote hain — **Core**, **Cladding**, aur **Protective jacket**.\n\nCore se light travel karti hai, cladding total internal reflection ensure karti hai, aur jacket fiber ko damage se protect karti hai 😎.",
        mcq: "## 5 MCQs: Optical Fiber Construction 🎯\n\nQ1. Light fiber mein kaise travel karti hai?\n\nA) Reflection\n\nB) Refraction\n\nC) Total internal reflection\n\nD) Diffraction\n\n```diff\nC) Total internal reflection\nExplanation: Core-cladding boundary par hota hai ✅\n```\n\nQ2. Fiber ka central part?\n\nA) Jacket\n\nB) Cladding\n\nC) Core\n\nD) Shield\n\n```diff\nC) Core\nExplanation: Light yahin propagate karti hai ✅\n```\n\nQ3. Cladding ka role?\n\nA) Signal generate\n\nB) Reflection allow\n\nC) TIR ensure karna\n\nD) Cooling\n\n```diff\nC) TIR ensure karna\nExplanation: Lower refractive index hota hai cladding ka ✅\n```\n\nQ4. Fiber jacket ka kaam?\n\nA) Light guide\n\nB) Protection\n\nC) Amplification\n\nD) Reflection\n\n```diff\nB) Protection\nExplanation: Mechanical damage se bachata hai ✅\n```\n\nQ5. Fiber kis material se bana hota hai?\n\nA) Metal\n\nB) Plastic ya glass\n\nC) Wood\n\nD) Rubber\n\n```diff\nB) Plastic ya glass\nExplanation: Transparent medium hota hai ✅\n```"
      },

      "Fiber Uses": {
        summarize: "## Summary: Fiber Uses 🌍📡\n\nBhai, **Optical fibers** ne communication world ko revolutionize kar diya hai. Internet, phone calls aur cable TV sab fiber par hi based hain.\n\nMedical field mein fibers endoscopy aur imaging ke liye use hote hain.\n\nSensors, defence aur space communication mein bhi fiber optics ka bada role hai 😎🔥.",
        mcq: "## 5 MCQs: Fiber Uses 🎯\n\nQ1. Fiber optics ka main use?\n\nA) Heating\n\nB) Communication\n\nC) Lighting\n\nD) Cooking\n\n```diff\nB) Communication\nExplanation: High speed data transfer ke liye best hai ✅\n```\n\nQ2. Fiber ka advantage?\n\nA) High loss\n\nB) Low bandwidth\n\nC) High bandwidth\n\nD) Noise\n\n```diff\nC) High bandwidth\nExplanation: Zyada data carry kar sakta hai ✅\n```\n\nQ3. Medical field mein fiber use?\n\nA) Surgery\n\nB) Imaging\n\nC) Endoscopy\n\nD) All of these\n\n```diff\nD) All of these\nExplanation: Diagnosis aur treatment dono mein use hota hai ✅\n```\n\nQ4. Fiber EMI noise se kyu safe hai?\n\nA) Metal nahi hota\n\nB) Plastic coating\n\nC) Optical signal\n\nD) Heavy\n\n```diff\nC) Optical signal\nExplanation: Light par based signal hota hai, electrical nahi ✅\n```\n\nQ5. Fiber future-ready kyu hai?\n\nA) Cheap\n\nB) High speed & low loss\n\nC) Heavy\n\nD) Manual\n\n```diff\nB) High speed & low loss\nExplanation: Next-gen communication ka base hai ✅\n```"
      },


      // ===============================
      // RADIATION LAWS
      // ===============================

      "Black Body Spectrum": {
        summarize: "## Summary: Black Body Spectrum 🌡️⚛️\n\nBhai, **Black Body** ek ideal system hota hai jo aane wali saari radiation absorb kar leta hai aur temperature ke according radiation emit karta hai.\n\nJab black body radiation ka graph draw karte hain (intensity vs wavelength), toh ek smooth curve milta hai jisme ek peak hoti hai. Temperature badhne par ye peak short wavelength ki taraf shift ho jaati hai 🔁.\n\nImportant baat ye hai ki classical physics is curve ko properly explain nahi kar paayi, especially high frequency region mein. Isi failure ne quantum mechanics ke door khole 😎🔥.",
        mcq: "## 5 MCQs: Black Body Spectrum 🎯\n\nQ1. Black body kya karta hai?\n\nA) Sab reflect karta hai\n\nB) Sab absorb karta hai\n\nC) Sab transmit karta hai\n\nD) Kuch nahi karta\n\n```diff\nB) Sab absorb karta hai\nExplanation: Ideal black body perfect absorber hota hai ✅\n```\n\nQ2. Temperature badhne par spectrum ka peak?\n\nA) Long wavelength ki taraf\n\nB) Short wavelength ki taraf\n\nC) Same jagah\n\nD) Disappear\n\n```diff\nB) Short wavelength ki taraf\nExplanation: Wien displacement law ka effect hai ✅\n```\n\nQ3. Black body spectrum kis par depend karta hai?\n\nA) Shape\n\nB) Material\n\nC) Temperature\n\nD) Size\n\n```diff\nC) Temperature\nExplanation: Sirf temperature matter karta hai ✅\n```\n\nQ4. Classical theory kis region mein fail hui?\n\nA) Low frequency\n\nB) Medium frequency\n\nC) High frequency\n\nD) Infrared\n\n```diff\nC) High frequency\nExplanation: Ultraviolet catastrophe yahin aayi ❌\n```\n\nQ5. Black body radiation ka importance?\n\nA) Heating\n\nB) Quantum theory ka base\n\nC) Sound waves\n\nD) Mechanics\n\n```diff\nB) Quantum theory ka base\nExplanation: Quantum concept yahin se start hua ✅\n```"
      },

      "Classical Laws": {
        summarize: "## Summary: Classical Radiation Laws 📜🌈\n\nBhai, black body radiation ko explain karne ke liye classical physics ne kuch laws diye the.\n\n**Stefan’s Law** kehta hai ki total energy radiated temperature ke fourth power ke proportional hoti hai.\n\n**Wien’s Law** peak wavelength aur temperature ke beech inverse relation batata hai.\n\n**Rayleigh–Jeans Law** low frequency region ko explain karta hai par high frequency par fail ho jaata hai, jisse ultraviolet catastrophe hui 😎.",
        mcq: "## 5 MCQs: Classical Laws 🎯\n\nQ1. Stefan’s law relate karta hai?\n\nA) Peak wavelength\n\nB) Total energy\n\nC) Frequency\n\nD) Pressure\n\n```diff\nB) Total energy\nExplanation: Total radiated power ∝ T⁴ hota hai ✅\n```\n\nQ2. Wien’s law kya batata hai?\n\nA) Energy distribution\n\nB) Peak wavelength vs temperature\n\nC) Total power\n\nD) Intensity\n\n```diff\nB) Peak wavelength vs temperature\nExplanation: λmax T = constant hota hai ✅\n```\n\nQ3. Rayleigh–Jeans law kis region mein valid hai?\n\nA) High frequency\n\nB) Low frequency\n\nC) UV region\n\nD) X-rays\n\n```diff\nB) Low frequency\nExplanation: Long wavelength region mein sahi hai ✅\n```\n\nQ4. Ultraviolet catastrophe ka reason?\n\nA) Wien law\n\nB) Stefan law\n\nC) Rayleigh–Jeans law\n\nD) Planck law\n\n```diff\nC) Rayleigh–Jeans law\nExplanation: High frequency par intensity infinite batata tha ❌\n```\n\nQ5. Classical laws ka limitation?\n\nA) Simple the\n\nB) Quantum effects ignore kiye\n\nC) Accurate the\n\nD) Universal the\n\n```diff\nB) Quantum effects ignore kiye\nExplanation: Isi wajah se fail hue ❌\n```"
      },

      "Planck's Law": {
        summarize: "## Summary: Planck’s Law ⚛️📘\n\nBhai, **Planck** ne classical physics ki problem ko solve kar diya by introducing a revolutionary idea.\n\nUsne bola ki energy continuous nahi hoti, balki **small packets (quanta)** mein emit ya absorb hoti hai.\n\nEnergy ka formula diya: E = hν, jahan h Planck constant hai.\n\nPlanck’s law black body spectrum ko perfectly explain karta hai aur ultraviolet catastrophe ko completely remove kar deta hai 😎🔥.",
        mcq: "## 5 MCQs: Planck’s Law 🎯\n\nQ1. Planck ne energy ko kaisa mana?\n\nA) Continuous\n\nB) Discrete\n\nC) Infinite\n\nD) Random\n\n```diff\nB) Discrete\nExplanation: Energy quanta mein hoti hai ✅\n```\n\nQ2. Energy quantum ka formula?\n\nA) E = mc²\n\nB) E = hν\n\nC) E = mv²\n\nD) E = qV\n\n```diff\nB) E = hν\nExplanation: h Planck constant hota hai ✅\n```\n\nQ3. Planck’s law kis phenomenon ko explain karta hai?\n\nA) Photoelectric effect\n\nB) Black body radiation\n\nC) Compton effect\n\nD) Interference\n\n```diff\nB) Black body radiation\nExplanation: Perfect explanation deta hai ✅\n```\n\nQ4. Quantum theory ka foundation kisne rakha?\n\nA) Newton\n\nB) Einstein\n\nC) Planck\n\nD) Bohr\n\n```diff\nC) Planck\nExplanation: Quantum concept yahin se shuru hua ✅\n```\n\nQ5. Ultraviolet catastrophe ka solution?\n\nA) Wien law\n\nB) Stefan law\n\nC) Planck law\n\nD) Rayleigh law\n\n```diff\nC) Planck law\nExplanation: Quantization ne problem solve ki ✅\n```"
      },

      // ===============================
      // WAVE–PARTICLE DUALITY
      // ===============================

      "Matter Waves": {
        summarize: "## Summary: Matter Waves 🌊🧠\n\nBhai, **De Broglie** ne bola ki sirf light hi nahi, balki har moving particle ke saath bhi wave associated hoti hai.\n\nIs wave ko **matter wave** kehte hain aur wavelength ka formula hota hai λ = h/p.\n\nYe idea classical thinking ke bilkul opposite tha aur isi ne quantum mechanics ko solid base diya 😎🔥.",
        mcq: "## 5 MCQs: Matter Waves 🎯\n\nQ1. Matter waves kisne propose ki?\n\nA) Newton\n\nB) Einstein\n\nC) De Broglie\n\nD) Bohr\n\n```diff\nC) De Broglie\nExplanation: Matter-wave hypothesis unhone di ✅\n```\n\nQ2. Matter wave wavelength depend karti hai?\n\nA) Charge\n\nB) Momentum\n\nC) Energy\n\nD) Mass only\n\n```diff\nB) Momentum\nExplanation: λ = h/p hota hai ✅\n```\n\nQ3. Matter waves ka proof?\n\nA) Photoelectric effect\n\nB) Electron diffraction\n\nC) Compton effect\n\nD) Interference\n\n```diff\nB) Electron diffraction\nExplanation: Davisson–Germer experiment ✅\n```\n\nQ4. Heavy particle ki wavelength?\n\nA) Large\n\nB) Small\n\nC) Infinite\n\nD) Zero\n\n```diff\nB) Small\nExplanation: Momentum zyada hone se λ kam hoti hai ✅\n```\n\nQ5. Matter waves kis nature ko show karti hain?\n\nA) Classical\n\nB) Wave nature of particles\n\nC) Thermal\n\nD) Magnetic\n\n```diff\nB) Wave nature of particles\nExplanation: Dual nature ka proof hai ✅\n```"
      },

      "Dual Nature": {
        summarize: "## Summary: Dual Nature ⚖️🌊\n\nBhai, **Dual nature** ka matlab hai ki light aur matter dono kabhi particle jaise behave karte hain aur kabhi wave jaise.\n\nInterference aur diffraction wave nature prove karte hain, jabki photoelectric aur Compton effect particle nature.\n\nYe duality quantum mechanics ka core concept hai aur classical physics se complete break hai 😎🔥.",
        mcq: "## 5 MCQs: Dual Nature 🎯\n\nQ1. Dual nature kis par apply hoti hai?\n\nA) Only light\n\nB) Only electrons\n\nC) Light and matter both\n\nD) Sound\n\n```diff\nC) Light and matter both\nExplanation: Dono wave aur particle behave karte hain ✅\n```\n\nQ2. Particle nature ka proof?\n\nA) Interference\n\nB) Diffraction\n\nC) Photoelectric effect\n\nD) Polarization\n\n```diff\nC) Photoelectric effect\nExplanation: Photon particle jaise behave karta hai ✅\n```\n\nQ3. Wave nature ka proof?\n\nA) Photoelectric effect\n\nB) Interference\n\nC) Compton effect\n\nD) Heating\n\n```diff\nB) Interference\nExplanation: Superposition wave property hai ✅\n```\n\nQ4. Duality ka concept kis theory ka base hai?\n\nA) Classical mechanics\n\nB) Quantum mechanics\n\nC) Thermodynamics\n\nD) Optics\n\n```diff\nB) Quantum mechanics\nExplanation: Quantum physics ka heart hai ✅\n```\n\nQ5. Dual nature contradict karti hai?\n\nA) Quantum theory\n\nB) Modern physics\n\nC) Classical physics\n\nD) Relativity\n\n```diff\nC) Classical physics\nExplanation: Classical mein particle aur wave alag the ❌\n```"
      },

      // ===============================
      // WAVE EQUATIONS
      // ===============================

      "Time-Independent Equation": {
        summarize: "## Summary: Time-Independent Schrödinger Equation 📐⚛️\n\nBhai, **Schrödinger equation** quantum mechanics ka fundamental equation hai.\n\nTime-independent form tab use hoti hai jab system ka potential time ke saath change nahi karta.\n\nIs equation se allowed energy levels aur wave functions milte hain, jo particle ke behavior ko describe karte hain 😎🔥.",
        mcq: "## 5 MCQs: Time-Independent Equation 🎯\n\nQ1. Time-independent equation kab use hoti hai?\n\nA) Time varying potential\n\nB) Constant potential\n\nC) Random motion\n\nD) Accelerated frame\n\n```diff\nB) Constant potential\nExplanation: Potential time ke saath change nahi karta ✅\n```\n\nQ2. Is equation ka output kya hota hai?\n\nA) Force\n\nB) Energy levels\n\nC) Velocity\n\nD) Temperature\n\n```diff\nB) Energy levels\nExplanation: Allowed energies milti hain ✅\n```\n\nQ3. Schrödinger equation kis theory ka base hai?\n\nA) Classical\n\nB) Quantum\n\nC) Relativistic\n\nD) Nuclear\n\n```diff\nB) Quantum\nExplanation: Quantum mechanics ka foundation hai ✅\n```\n\nQ4. Wave function ka square kya deta hai?\n\nA) Energy\n\nB) Force\n\nC) Probability\n\nD) Momentum\n\n```diff\nC) Probability\nExplanation: |ψ|² probability density hoti hai ✅\n```\n\nQ5. Ye equation kis particle par apply hoti hai?\n\nA) Classical\n\nB) Microscopic\n\nC) Macroscopic\n\nD) Astronomical\n\n```diff\nB) Microscopic\nExplanation: Quantum world ke liye hai ✅\n```"
      },

      "Time-Dependent Equation": {
        summarize: "## Summary: Time-Dependent Schrödinger Equation ⏳⚛️\n\nBhai, jab quantum system time ke saath evolve karta hai, tab **time-dependent Schrödinger equation** use hoti hai.\n\nYe equation batati hai ki wave function time ke saath kaise change hota hai.\n\nQuantum dynamics, transitions aur measurements ko samajhne ke liye ye equation bahut important hai 😎🔥.",
        mcq: "## 5 MCQs: Time-Dependent Equation 🎯\n\nQ1. Time-dependent equation kya batati hai?\n\nA) Energy only\n\nB) Time evolution of system\n\nC) Force\n\nD) Mass\n\n```diff\nB) Time evolution of system\nExplanation: Wave function ka time evolution dikhati hai ✅\n```\n\nQ2. Ye equation kis condition mein use hoti hai?\n\nA) Static system\n\nB) Time varying potential\n\nC) Zero energy\n\nD) Rest\n\n```diff\nB) Time varying potential\nExplanation: Dynamic systems ke liye hai ✅\n```\n\nQ3. Quantum transitions kis equation se study hote hain?\n\nA) Newton\n\nB) Time-independent\n\nC) Time-dependent\n\nD) Maxwell\n\n```diff\nC) Time-dependent\nExplanation: State change ko describe karti hai ✅\n```\n\nQ4. Is equation ka variable kya hota hai?\n\nA) Space only\n\nB) Time only\n\nC) Space and time both\n\nD) Energy only\n\n```diff\nC) Space and time both\nExplanation: ψ(x,t) depend karta hai dono par ✅\n```\n\nQ5. Ye equation kis physics ka part hai?\n\nA) Mechanics\n\nB) Optics\n\nC) Quantum mechanics\n\nD) Thermodynamics\n\n```diff\nC) Quantum mechanics\nExplanation: Quantum system dynamics ka base hai ✅\n```"
      },

      // ===============================
      // PHYSICAL INTERPRETATION
      // ===============================

      "Wave Function Psi": {
        summarize: "## Summary: Wave Function Psi (ψ) 📊⚛️\n\nBhai, **Wave function ψ** quantum system ki state ko represent karta hai, par ψ khud physically measurable nahi hota.\n\nMax Born ne interpretation di ki **|ψ|² probability density** hoti hai — matlab particle kisi position par milne ki probability.\n\nYe concept classical certainty ko probability se replace karta hai. Quantum world inherently probabilistic hai 😎🔥.",
        mcq: "## 5 MCQs: Wave Function Psi 🎯\n\nQ1. ψ represent karta hai?\n\nA) Force\n\nB) Energy\n\nC) Quantum state\n\nD) Velocity\n\n```diff\nC) Quantum state\nExplanation: System ki complete information deta hai ✅\n```\n\nQ2. |ψ|² kya deta hai?\n\nA) Energy\n\nB) Probability density\n\nC) Momentum\n\nD) Charge\n\n```diff\nB) Probability density\nExplanation: Particle milne ki probability batata hai ✅\n```\n\nQ3. ψ physically measurable hai?\n\nA) Yes\n\nB) No\n\nC) Sometimes\n\nD) Depends\n\n```diff\nB) No\nExplanation: Sirf |ψ|² measurable hota hai ❌\n```\n\nQ4. Probability interpretation kisne di?\n\nA) Planck\n\nB) Bohr\n\nC) Born\n\nD) Einstein\n\n```diff\nC) Born\nExplanation: Max Born interpretation ✅\n```\n\nQ5. Quantum mechanics kis nature ko show karti hai?\n\nA) Deterministic\n\nB) Probabilistic\n\nC) Certain\n\nD) Fixed\n\n```diff\nB) Probabilistic\nExplanation: Outcome probability based hota hai ✅\n```"
      },

      // ===============================
      // QUANTUM BOUND STATE
      // ===============================

      "Particle in a 1D Box": {
        summarize: "## Summary: Particle in a 1D Box 📦⚛️\n\nBhai, **Particle in a 1D Box** quantum mechanics ka simplest bound-state problem hai.\n\nYaha particle ek box ke andar confined hota hai aur bahar nahi ja sakta. Is wajah se particle sirf **discrete energy levels** par hi exist kar sakta hai.\n\nLowest energy zero nahi hoti — ise **zero-point energy** kehte hain. Ye classical physics se bilkul different result hai 😎🔥.",
        mcq: "## 5 MCQs: Particle in a 1D Box 🎯\n\nQ1. Energy levels particle in box mein kaise hote hain?\n\nA) Continuous\n\nB) Random\n\nC) Discrete\n\nD) Infinite\n\n```diff\nC) Discrete\nExplanation: Quantized energy levels milti hain ✅\n```\n\nQ2. Ground state energy?\n\nA) Zero\n\nB) Negative\n\nC) Minimum non-zero\n\nD) Infinite\n\n```diff\nC) Minimum non-zero\nExplanation: Zero-point energy hoti hai ✅\n```\n\nQ3. Particle box ke bahar ja sakta hai?\n\nA) Yes\n\nB) No\n\nC) Sometimes\n\nD) Depends\n\n```diff\nB) No\nExplanation: Infinite potential walls hoti hain ❌\n```\n\nQ4. Ye model kis cheez ko explain karta hai?\n\nA) Classical motion\n\nB) Quantization\n\nC) Magnetism\n\nD) Heat\n\n```diff\nB) Quantization\nExplanation: Energy quantization ka clear example hai ✅\n```\n\nQ5. Particle in box kis field ka base example hai?\n\nA) Mechanics\n\nB) Optics\n\nC) Quantum mechanics\n\nD) Thermodynamics\n\n```diff\nC) Quantum mechanics\nExplanation: Bound state concept ko samjhata hai ✅\n```"
      }
    };

    const testDataMap = {
      "Inertial & Non-inertial Frames": [
        {
          question: "In which of the following frames are Newton's laws valid?",
          options: ["Inertial frames", "Non-inertial frames", "Accelerated frames", "None of the above"],
          correctAnswer: "Inertial frames",
          explanation: "Newton's laws of motion are valid only in inertial frames of reference.",
          type: 'mcq'
        },
        {
          question: "A frame of reference moving with constant velocity relative to an inertial frame is:",
          options: ["Inertial", "Non-inertial", "Rotating", "None of the above"],
          correctAnswer: "Inertial",
          explanation: "Since velocity is constant, acceleration is zero, making it an inertial frame.",
          type: 'mcq'
        },
        {
          question: "Pseudo forces are needed only in:",
          options: ["Inertial frames", "Non-inertial frames", "Stationary frames", "All frames"],
          correctAnswer: "Non-inertial frames",
          explanation: "To apply Newton's second law in a non-inertial frame, pseudo forces must be added.",
          type: 'mcq'
        }
      ],
      "Galilean Transformations": [
        {
          question: "Galilean transformations are applicable when relative velocities are:",
          options: [
            "Comparable to speed of light",
            "Much less than speed of light",
            "Greater than speed of light",
            "Zero only"
          ],
          correctAnswer: "Much less than speed of light",
          explanation: "Galilean transformations assume classical (low-speed) motion.",
          type: "mcq"
        },
        {
          question: "In Galilean transformation, time between two events is:",
          options: [
            "Different for different observers",
            "Dependent on velocity",
            "Same for all observers",
            "Undefined"
          ],
          correctAnswer: "Same for all observers",
          explanation: "Classical mechanics treats time as absolute.",
          type: "mcq"
        },
        {
          question: "Which quantity remains unchanged under Galilean transformation?",
          options: [
            "Velocity",
            "Acceleration",
            "Position",
            "Distance"
          ],
          correctAnswer: "Acceleration",
          explanation: "Acceleration is invariant in Galilean transformations.",
          type: "mcq"
        },
        {
          question: "Galilean transformations fail mainly because they:",
          options: [
            "Ignore gravity",
            "Ignore electromagnetic waves",
            "Assume absolute time",
            "Ignore mass"
          ],
          correctAnswer: "Assume absolute time",
          explanation: "At high speeds, time is not absolute.",
          type: "mcq"
        },
        {
          question: "Galilean transformations are replaced by Lorentz transformations in:",
          options: [
            "Classical mechanics",
            "Quantum mechanics",
            "Relativistic mechanics",
            "Fluid mechanics"
          ],
          correctAnswer: "Relativistic mechanics",
          explanation: "Relativity handles high-speed motion accurately.",
          type: "mcq"
        }
      ],

      "Lorentz Transformations": [
        {
          question: "Lorentz transformations are required when velocities are:",
          options: [
            "Very small",
            "Zero",
            "Comparable to speed of light",
            "Constant only"
          ],
          correctAnswer: "Comparable to speed of light",
          explanation: "They handle relativistic speeds.",
          type: "mcq"
        },
        {
          question: "Which quantity becomes relative in Lorentz transformations?",
          options: [
            "Force",
            "Mass",
            "Time",
            "Charge"
          ],
          correctAnswer: "Time",
          explanation: "Time depends on observer’s frame.",
          type: "mcq"
        },
        {
          question: "Lorentz transformation ensures invariance of:",
          options: [
            "Newton’s laws",
            "Mass",
            "Speed of light",
            "Acceleration"
          ],
          correctAnswer: "Speed of light",
          explanation: "Light speed remains constant in all inertial frames.",
          type: "mcq"
        },
        {
          question: "Which effect is explained using Lorentz transformations?",
          options: [
            "Doppler effect (sound)",
            "Thermal expansion",
            "Length contraction",
            "Viscosity"
          ],
          correctAnswer: "Length contraction",
          explanation: "Objects contract along direction of motion.",
          type: "mcq"
        },
        {
          question: "Lorentz factor depends on:",
          options: [
            "Mass",
            "Distance",
            "Velocity",
            "Force"
          ],
          correctAnswer: "Velocity",
          explanation: "It depends on v/c ratio.",
          type: "mcq"
        }
      ],
      "Experimental Setup": [
        {
          question: "Michelson-Morley experiment was designed to detect:",
          options: [
            "Gravitational waves",
            "Ether wind",
            "Electron charge",
            "Magnetic field"
          ],
          correctAnswer: "Ether wind",
          explanation: "Ether was assumed as medium for light.",
          type: "mcq"
        },
        {
          question: "Which device was used in the experiment?",
          options: [
            "Spectrometer",
            "Interferometer",
            "Oscilloscope",
            "Photometer"
          ],
          correctAnswer: "Interferometer",
          explanation: "Interference pattern was analyzed.",
          type: "mcq"
        },
        {
          question: "The expected fringe shift was due to:",
          options: [
            "Earth’s rotation",
            "Earth’s motion through ether",
            "Gravity",
            "Temperature change"
          ],
          correctAnswer: "Earth’s motion through ether",
          explanation: "Ether wind should change light speed.",
          type: "mcq"
        },
        {
          question: "The actual result of the experiment was:",
          options: [
            "Positive",
            "Negative (null)",
            "Inconclusive",
            "Variable"
          ],
          correctAnswer: "Negative (null)",
          explanation: "No ether was detected.",
          type: "mcq"
        },
        {
          question: "This experiment supported the idea of:",
          options: [
            "Ether existence",
            "Classical mechanics",
            "Relativity",
            "Quantum theory"
          ],
          correctAnswer: "Relativity",
          explanation: "It led to Einstein’s STR.",
          type: "mcq"
        }
      ],
      "Negative Result Significance": [
  {
    question: "The null result of Michelson-Morley experiment disproved the existence of:",
    options: ["Gravitational field", "Ether", "Vacuum", "Magnetic waves"],
    correctAnswer: "Ether",
    explanation: "No ether wind was detected in the experiment.",
    type: "mcq"
  },
  {
    question: "The negative result of the experiment supported which theory?",
    options: ["Newtonian mechanics", "Special Theory of Relativity", "Thermodynamics", "Quantum mechanics"],
    correctAnswer: "Special Theory of Relativity",
    explanation: "It led to Einstein’s postulates.",
    type: "mcq"
  },
  {
    question: "Light can propagate in:",
    options: ["Ether only", "Air only", "Vacuum", "Water only"],
    correctAnswer: "Vacuum",
    explanation: "Light does not require a material medium.",
    type: "mcq"
  },
  {
    question: "The impact of the null result on physics was:",
    options: ["Minor", "Revolutionary", "Temporary", "Negative"],
    correctAnswer: "Revolutionary",
    explanation: "It changed classical concepts of space and time.",
    type: "mcq"
  },
  {
    question: "A null result experiment is considered:",
    options: ["Failure", "Invalid", "Successful discovery", "Incomplete"],
    correctAnswer: "Successful discovery",
    explanation: "Absence of expected effect is meaningful.",
    type: "mcq"
  }
],

"Length Contraction": [
  {
    question: "Length contraction is observed when an object moves with:",
    options: ["Low speed", "Uniform speed", "Speed comparable to light", "Zero speed"],
    correctAnswer: "Speed comparable to light",
    explanation: "Effect becomes significant near speed of light.",
    type: "mcq"
  },
  {
    question: "Length contraction occurs along the direction of:",
    options: ["Force", "Motion", "Gravity", "Acceleration"],
    correctAnswer: "Motion",
    explanation: "Only the dimension parallel to motion contracts.",
    type: "mcq"
  },
  {
    question: "Proper length is measured in the frame where the object is:",
    options: ["Moving", "Accelerating", "At rest", "Rotating"],
    correctAnswer: "At rest",
    explanation: "Rest frame gives proper length.",
    type: "mcq"
  },
  {
    question: "Length contraction is not noticeable in daily life because:",
    options: ["It does not exist", "Speeds are very small", "Objects are rigid", "Measurement errors"],
    correctAnswer: "Speeds are very small",
    explanation: "Relativistic speeds are required.",
    type: "mcq"
  },
  {
    question: "Length contraction is a consequence of:",
    options: ["Classical mechanics", "Quantum mechanics", "Special Relativity", "Thermodynamics"],
    correctAnswer: "Special Relativity",
    explanation: "It arises from Lorentz transformations.",
    type: "mcq"
  }
],

"Time Dilation": [
  {
    question: "According to time dilation, a moving clock runs:",
    options: ["Faster", "Slower", "Same", "Stops"],
    correctAnswer: "Slower",
    explanation: "Moving clocks tick slower for a stationary observer.",
    type: "mcq"
  },
  {
    question: "Proper time is measured in the frame where the clock is:",
    options: ["Moving", "Accelerating", "At rest", "Rotating"],
    correctAnswer: "At rest",
    explanation: "Rest frame gives proper time.",
    type: "mcq"
  },
  {
    question: "Time dilation becomes significant when speed is:",
    options: ["Low", "Zero", "Comparable to light", "Random"],
    correctAnswer: "Comparable to light",
    explanation: "Relativistic speeds are required.",
    type: "mcq"
  },
  {
    question: "Which practical system requires time dilation correction?",
    options: ["Radio", "GPS satellites", "Bulb", "Motor"],
    correctAnswer: "GPS satellites",
    explanation: "Relativistic correction is essential for accuracy.",
    type: "mcq"
  },
  {
    question: "Twin paradox is related to:",
    options: ["Length contraction", "Time dilation", "Mass increase", "Energy loss"],
    correctAnswer: "Time dilation",
    explanation: "Moving twin ages slower.",
    type: "mcq"
  }
],

"Velocity Addition Theorem": [
  {
    question: "Classical velocity addition is given by:",
    options: ["v₁ + v₂", "v₁ × v₂", "v₁ − v₂", "v₁ / v₂"],
    correctAnswer: "v₁ + v₂",
    explanation: "Used in classical mechanics.",
    type: "mcq"
  },
  {
    question: "Relativistic velocity addition is required when velocities are:",
    options: ["Low", "Zero", "Near speed of light", "Random"],
    correctAnswer: "Near speed of light",
    explanation: "Classical formula fails at high speeds.",
    type: "mcq"
  },
  {
    question: "Relativistic velocity addition ensures that:",
    options: ["Speed exceeds c", "Speed is zero", "Speed never exceeds c", "Speed is infinite"],
    correctAnswer: "Speed never exceeds c",
    explanation: "Light speed is the upper limit.",
    type: "mcq"
  },
  {
    question: "If u = c and v = c, resultant velocity is:",
    options: ["2c", "c", "0", "Infinity"],
    correctAnswer: "c",
    explanation: "Relativistic formula preserves speed limit.",
    type: "mcq"
  },
  {
    question: "Velocity addition theorem is part of:",
    options: ["Classical mechanics", "Quantum mechanics", "Special Relativity", "Fluid mechanics"],
    correctAnswer: "Special Relativity",
    explanation: "Einstein’s theory governs high-speed motion.",
    type: "mcq"
  }
],

"Variation of Mass": [
  {
    question: "According to relativity, mass increases with:",
    options: ["Decrease in speed", "Increase in speed", "Decrease in force", "Increase in distance"],
    correctAnswer: "Increase in speed",
    explanation: "Relativistic mass depends on velocity.",
    type: "mcq"
  },
  {
    question: "Rest mass is the mass of an object when its velocity is:",
    options: ["Maximum", "Minimum", "Zero", "Infinite"],
    correctAnswer: "Zero",
    explanation: "Rest mass is measured at rest.",
    type: "mcq"
  },
  {
    question: "As velocity approaches speed of light, relativistic mass becomes:",
    options: ["Zero", "Finite", "Infinite", "Negative"],
    correctAnswer: "Infinite",
    explanation: "Denominator approaches zero.",
    type: "mcq"
  },
  {
    question: "Because of mass variation, accelerating an object to light speed is:",
    options: ["Easy", "Possible", "Impossible", "Cheap"],
    correctAnswer: "Impossible",
    explanation: "Infinite energy would be required.",
    type: "mcq"
  },
  {
    question: "Mass variation is clearly observed in:",
    options: ["Daily life", "Particle accelerators", "Laboratory scales", "Thermometers"],
    correctAnswer: "Particle accelerators",
    explanation: "Particles move at relativistic speeds.",
    type: "mcq"
  }
],

"Einstein's Mass-Energy Relation": [
  {
    question: "In E = mc², c represents:",
    options: ["Charge", "Speed of light", "Current", "Energy"],
    correctAnswer: "Speed of light",
    explanation: "c ≈ 3 × 10⁸ m/s.",
    type: "mcq"
  },
  {
    question: "E = mc² establishes equivalence between:",
    options: ["Mass and force", "Mass and energy", "Energy and power", "Mass and velocity"],
    correctAnswer: "Mass and energy",
    explanation: "Mass can be converted into energy.",
    type: "mcq"
  },
  {
    question: "Nuclear energy is based on:",
    options: ["Newton’s law", "E = mc²", "Ohm’s law", "Faraday’s law"],
    correctAnswer: "E = mc²",
    explanation: "Small mass converts into huge energy.",
    type: "mcq"
  },
  {
    question: "The Sun produces energy due to:",
    options: ["Chemical reaction", "Burning", "Nuclear fusion", "Fission"],
    correctAnswer: "Nuclear fusion",
    explanation: "Hydrogen nuclei fuse to release energy.",
    type: "mcq"
  },
  {
    question: "E = mc² was proposed by:",
    options: ["Newton", "Einstein", "Bohr", "Maxwell"],
    correctAnswer: "Einstein",
    explanation: "Part of Special Relativity.",
    type: "mcq"
  }
],

"Energy-Momentum Relation": [
  {
    question: "The complete relativistic energy equation is:",
    options: ["E = mc²", "E = mv²", "E² = (pc)² + (m₀c²)²", "E = hν"],
    correctAnswer: "E² = (pc)² + (m₀c²)²",
    explanation: "It relates energy, momentum and mass.",
    type: "mcq"
  },
  {
    question: "Rest mass of a photon is:",
    options: ["1", "0", "Infinite", "c"],
    correctAnswer: "0",
    explanation: "Photons have zero rest mass.",
    type: "mcq"
  },
  {
    question: "Energy of a photon is given by:",
    options: ["E = mc²", "E = pc", "E = mv", "E = 0"],
    correctAnswer: "E = pc",
    explanation: "Derived from energy-momentum relation.",
    type: "mcq"
  },
  {
    question: "Energy-momentum relation is mainly used in:",
    options: ["Thermodynamics", "Particle physics", "Optics", "Electrostatics"],
    correctAnswer: "Particle physics",
    explanation: "Used in collision calculations.",
    type: "mcq"
  },
  {
    question: "Symbol p in the equation represents:",
    options: ["Power", "Pressure", "Momentum", "Potential"],
    correctAnswer: "Momentum",
    explanation: "Relativistic momentum.",
    type: "mcq"
  }
],

"Wedge Shaped Thin Films": [
  {
    question: "Thickness of a wedge-shaped thin film is:",
    options: ["Uniform", "Non-uniform", "Zero", "Infinite"],
    correctAnswer: "Non-uniform",
    explanation: "Thickness varies along length.",
    type: "mcq"
  },
  {
    question: "Fringes produced in wedge-shaped film are:",
    options: ["Circular", "Straight and parallel", "Random", "Spiral"],
    correctAnswer: "Straight and parallel",
    explanation: "Due to linear variation in thickness.",
    type: "mcq"
  },
  {
    question: "Wedge-shaped film interference is caused due to:",
    options: ["Diffraction", "Refraction", "Interference", "Polarization"],
    correctAnswer: "Interference",
    explanation: "Path difference creates fringes.",
    type: "mcq"
  },
  {
    question: "Increasing wedge angle results in:",
    options: ["Increase in fringe width", "Decrease in fringe width", "No change", "Disappearance"],
    correctAnswer: "Decrease in fringe width",
    explanation: "Fringes become closer.",
    type: "mcq"
  },
  {
    question: "Wedge-shaped thin films are used to measure:",
    options: ["Mass", "Temperature", "Thickness", "Force"],
    correctAnswer: "Thickness",
    explanation: "Optical measurement technique.",
    type: "mcq"
  }
],

"Single & Double Slit": [
  {
    question: "In single slit diffraction, the central maximum is:",
    options: ["Dark", "Brightest", "Weakest", "Absent"],
    correctAnswer: "Brightest",
    explanation: "Maximum intensity at center.",
    type: "mcq"
  },
  {
    question: "Young’s double slit experiment demonstrates:",
    options: ["Particle nature of light", "Wave nature of light", "Magnetic nature", "Thermal nature"],
    correctAnswer: "Wave nature of light",
    explanation: "Interference confirms wave behavior.",
    type: "mcq"
  },
  {
    question: "Double slit pattern is due to:",
    options: ["Diffraction only", "Interference only", "Both diffraction and interference", "Reflection"],
    correctAnswer: "Both diffraction and interference",
    explanation: "Each slit diffracts light.",
    type: "mcq"
  },
  {
    question: "Increasing slit width in single slit diffraction makes central maximum:",
    options: ["Wider", "Narrower", "Disappear", "Brighter"],
    correctAnswer: "Narrower",
    explanation: "Width inversely proportional to slit width.",
    type: "mcq"
  },
  {
    question: "In Fraunhofer diffraction, light source is considered at:",
    options: ["Finite distance", "Infinity", "Slit", "Screen"],
    correctAnswer: "Infinity",
    explanation: "Parallel rays are assumed.",
    type: "mcq"
  }
],
"Gauss's Theorem": [
  {
    question: "Gauss’s law relates electric flux with:",
    options: ["Electric field", "Charge enclosed", "Area", "Distance"],
    correctAnswer: "Charge enclosed",
    explanation: "Total electric flux depends only on enclosed charge.",
    type: "mcq"
  },
  {
    question: "Electric flux through a closed surface depends on:",
    options: ["Shape of surface", "Size of surface", "Enclosed charge", "Electric field direction"],
    correctAnswer: "Enclosed charge",
    explanation: "Shape does not matter in Gauss’s law.",
    type: "mcq"
  },
  {
    question: "Gauss’s law is most useful for calculating electric field in:",
    options: ["Random charge systems", "Symmetric charge systems", "AC circuits", "Conductors only"],
    correctAnswer: "Symmetric charge systems",
    explanation: "High symmetry simplifies calculations.",
    type: "mcq"
  },
  {
    question: "A Gaussian surface must be:",
    options: ["Open", "Closed", "Flat", "Infinite"],
    correctAnswer: "Closed",
    explanation: "Flux is defined for closed surfaces.",
    type: "mcq"
  },
  {
    question: "Gauss’s law is a part of:",
    options: ["Mechanics", "Electrostatics", "Optics", "Thermodynamics"],
    correctAnswer: "Electrostatics",
    explanation: "It deals with electric fields due to charges.",
    type: "mcq"
  }
],

"Ampere's Law": [
  {
    question: "Ampere’s law relates magnetic field with:",
    options: ["Charge", "Current", "Voltage", "Resistance"],
    correctAnswer: "Current",
    explanation: "Magnetic field is produced by current.",
    type: "mcq"
  },
  {
    question: "Ampere’s law is best applied to systems with:",
    options: ["Random currents", "Symmetric current distribution", "Alternating current", "Capacitors"],
    correctAnswer: "Symmetric current distribution",
    explanation: "Symmetry simplifies field calculation.",
    type: "mcq"
  },
  {
    question: "Enclosed current in Ampere’s law refers to:",
    options: ["External current", "Current passing through loop", "Surface current", "Zero current"],
    correctAnswer: "Current passing through loop",
    explanation: "Only current enclosed by loop contributes.",
    type: "mcq"
  },
  {
    question: "Ampere’s law was incomplete for:",
    options: ["Steady currents", "Time-varying fields", "DC circuits", "Static charges"],
    correctAnswer: "Time-varying fields",
    explanation: "Maxwell added displacement current.",
    type: "mcq"
  },
  {
    question: "Magnetic field inside a long solenoid is calculated using:",
    options: ["Gauss’s law", "Ampere’s law", "Faraday’s law", "Coulomb’s law"],
    correctAnswer: "Ampere’s law",
    explanation: "Solenoid has high symmetry.",
    type: "mcq"
  }
],

"Ohm's Law": [
  {
    question: "Ohm’s law gives the relation between:",
    options: ["Voltage and charge", "Current and resistance", "Voltage, current and resistance", "Power and energy"],
    correctAnswer: "Voltage, current and resistance",
    explanation: "V = IR relates all three quantities.",
    type: "mcq"
  },
  {
    question: "Ohm’s law is valid when temperature is:",
    options: ["Increasing", "Decreasing", "Constant", "Zero"],
    correctAnswer: "Constant",
    explanation: "Resistance changes with temperature.",
    type: "mcq"
  },
  {
    question: "SI unit of resistance is:",
    options: ["Volt", "Ampere", "Ohm", "Watt"],
    correctAnswer: "Ohm",
    explanation: "Resistance is measured in ohms.",
    type: "mcq"
  },
  {
    question: "If resistance increases and voltage is constant, current will:",
    options: ["Increase", "Decrease", "Remain same", "Become zero"],
    correctAnswer: "Decrease",
    explanation: "I = V/R, so current decreases.",
    type: "mcq"
  },
  {
    question: "Ohm’s law is mainly used for:",
    options: ["Magnetism", "Circuit analysis", "Optics", "Heat transfer"],
    correctAnswer: "Circuit analysis",
    explanation: "It is fundamental for circuit calculations.",
    type: "mcq"
  }
],

"Laws of EM Induction": [
  {
    question: "Electromagnetic induction occurs due to:",
    options: ["Constant magnetic flux", "Changing magnetic flux", "Electric charge", "Resistance"],
    correctAnswer: "Changing magnetic flux",
    explanation: "Change in flux induces EMF.",
    type: "mcq"
  },
  {
    question: "Faraday’s law gives information about:",
    options: ["Direction of current", "Magnitude of induced EMF", "Energy loss", "Resistance"],
    correctAnswer: "Magnitude of induced EMF",
    explanation: "Depends on rate of change of flux.",
    type: "mcq"
  },
  {
    question: "Lenz’s law is related to:",
    options: ["Magnitude of EMF", "Direction of induced current", "Speed of current", "Charge flow"],
    correctAnswer: "Direction of induced current",
    explanation: "It opposes the cause producing it.",
    type: "mcq"
  },
  {
    question: "Lenz’s law is based on conservation of:",
    options: ["Momentum", "Charge", "Energy", "Mass"],
    correctAnswer: "Energy",
    explanation: "Prevents creation of free energy.",
    type: "mcq"
  },
  {
    question: "Which device works on electromagnetic induction?",
    options: ["Battery", "Generator", "Capacitor", "Resistor"],
    correctAnswer: "Generator",
    explanation: "Mechanical energy converts to electrical.",
    type: "mcq"
  }
],

"Self & Mutual Induction": [
  {
    question: "Self induction occurs when current changes in:",
    options: ["Two coils", "Same coil", "Capacitor", "Battery"],
    correctAnswer: "Same coil",
    explanation: "Changing current induces EMF in same coil.",
    type: "mcq"
  },
  {
    question: "Mutual induction occurs between:",
    options: ["Two nearby coils", "Single wire", "Battery and coil", "Capacitor plates"],
    correctAnswer: "Two nearby coils",
    explanation: "Change in one coil affects the other.",
    type: "mcq"
  },
  {
    question: "SI unit of inductance is:",
    options: ["Ohm", "Henry", "Tesla", "Weber"],
    correctAnswer: "Henry",
    explanation: "Inductance is measured in henry.",
    type: "mcq"
  },
  {
    question: "Induced EMF always opposes:",
    options: ["Voltage", "Resistance", "Change in current", "Charge"],
    correctAnswer: "Change in current",
    explanation: "According to Lenz’s law.",
    type: "mcq"
  },
  {
    question: "Energy in an inductor is stored in the form of:",
    options: ["Electric field", "Magnetic field", "Heat", "Light"],
    correctAnswer: "Magnetic field",
    explanation: "Inductors store energy magnetically.",
    type: "mcq"
  }
],

"Concept of Displacement Current": [
  {
    question: "Displacement current was introduced by:",
    options: ["Faraday", "Ampere", "Maxwell", "Einstein"],
    correctAnswer: "Maxwell",
    explanation: "It completed Ampere’s law.",
    type: "mcq"
  },
  {
    question: "Displacement current is associated with:",
    options: ["Changing magnetic field", "Changing electric field", "Steady current", "Resistance"],
    correctAnswer: "Changing electric field",
    explanation: "Time-varying electric field produces it.",
    type: "mcq"
  },
  {
    question: "Displacement current explains magnetic field in:",
    options: ["Resistor", "Capacitor gap", "Battery", "Wire"],
    correctAnswer: "Capacitor gap",
    explanation: "No real current flows there.",
    type: "mcq"
  },
  {
    question: "Displacement current was added to correct:",
    options: ["Gauss’s law", "Ampere’s law", "Faraday’s law", "Ohm’s law"],
    correctAnswer: "Ampere’s law",
    explanation: "For time-varying fields.",
    type: "mcq"
  },
  {
    question: "Unit of displacement current is:",
    options: ["Volt", "Ampere", "Tesla", "Ohm"],
    correctAnswer: "Ampere",
    explanation: "It has dimensions of current.",
    type: "mcq"
  }
],

"Equations in Free Space": [
  {
    question: "Number of Maxwell’s equations is:",
    options: ["2", "3", "4", "5"],
    correctAnswer: "4",
    explanation: "There are four fundamental equations.",
    type: "mcq"
  },
  {
    question: "Free space means:",
    options: ["Conductor", "Dielectric", "Vacuum", "Metal"],
    correctAnswer: "Vacuum",
    explanation: "No material medium is present.",
    type: "mcq"
  },
  {
    question: "Maxwell’s equations connect:",
    options: ["Force and mass", "Electric and magnetic fields", "Charge and energy", "Voltage and current"],
    correctAnswer: "Electric and magnetic fields",
    explanation: "They describe EM interactions.",
    type: "mcq"
  },
  {
    question: "Maxwell’s equations prove that light is:",
    options: ["Particle", "Electromagnetic wave", "Sound wave", "Matter wave"],
    correctAnswer: "Electromagnetic wave",
    explanation: "Light is an EM phenomenon.",
    type: "mcq"
  },
  {
    question: "Maxwell’s equations are used in:",
    options: ["Painting", "Communication systems", "Cooking", "Carpentry"],
    correctAnswer: "Communication systems",
    explanation: "They explain EM wave propagation.",
    type: "mcq"
  }
],

"Equations in Media": [
  {
    question: "In media, Maxwell’s equations depend on:",
    options: ["Mass", "Permittivity and permeability", "Charge only", "Temperature"],
    correctAnswer: "Permittivity and permeability",
    explanation: "Material properties affect fields.",
    type: "mcq"
  },
  {
    question: "Polarization is related to:",
    options: ["Magnetic field", "Electric field", "Current", "Resistance"],
    correctAnswer: "Electric field",
    explanation: "Electric dipoles align with E-field.",
    type: "mcq"
  },
  {
    question: "Magnetization is related to:",
    options: ["Electric field", "Magnetic field", "Voltage", "Energy"],
    correctAnswer: "Magnetic field",
    explanation: "Magnetic dipoles align with B-field.",
    type: "mcq"
  },
  {
    question: "Maxwell’s equations in media help in understanding:",
    options: ["Ideal vacuum", "Real materials", "Only conductors", "Only gases"],
    correctAnswer: "Real materials",
    explanation: "They explain EM behavior in matter.",
    type: "mcq"
  },
  {
    question: "Dielectrics are classified as:",
    options: ["Free space", "Media", "Vacuum", "Conductors"],
    correctAnswer: "Media",
    explanation: "They are material media.",
    type: "mcq"
  }
],

"Waves in Free Space": [
  {
    question: "Electromagnetic waves can travel in:",
    options: ["Solid only", "Liquid only", "Vacuum", "Gas only"],
    correctAnswer: "Vacuum",
    explanation: "No medium is required.",
    type: "mcq"
  },
  {
    question: "In EM waves, electric and magnetic fields are:",
    options: ["Parallel", "Opposite", "Perpendicular", "Random"],
    correctAnswer: "Perpendicular",
    explanation: "They are mutually perpendicular.",
    type: "mcq"
  },
  {
    question: "Speed of EM waves in vacuum is:",
    options: ["Variable", "Zero", "Constant", "Infinite"],
    correctAnswer: "Constant",
    explanation: "Equal to speed of light.",
    type: "mcq"
  },
  {
    question: "Light is an example of:",
    options: ["Mechanical wave", "Sound wave", "Electromagnetic wave", "Matter wave"],
    correctAnswer: "Electromagnetic wave",
    explanation: "Light belongs to EM spectrum.",
    type: "mcq"
  },
  {
    question: "EM waves are widely used in:",
    options: ["Communication", "Medicine", "Astronomy", "All of these"],
    correctAnswer: "All of these",
    explanation: "They have multiple applications.",
    type: "mcq"
  }
],

"Conditions for Interference": [
  {
    question: "Most important condition for sustained interference is:",
    options: ["High intensity", "Coherence", "Reflection", "Refraction"],
    correctAnswer: "Coherence",
    explanation: "Phase difference must remain constant.",
    type: "mcq"
  },
  {
    question: "Coherent sources have:",
    options: ["Same wavelength", "Same phase difference", "Same intensity", "Same direction"],
    correctAnswer: "Same phase difference",
    explanation: "Phase relation must be fixed.",
    type: "mcq"
  },
  {
    question: "Large difference in amplitudes results in:",
    options: ["Clear fringes", "Poor visibility", "Only dark fringes", "No light"],
    correctAnswer: "Poor visibility",
    explanation: "Fringe contrast decreases.",
    type: "mcq"
  },
  {
    question: "Interference is based on principle of:",
    options: ["Reflection", "Superposition", "Diffraction", "Polarization"],
    correctAnswer: "Superposition",
    explanation: "Waves add algebraically.",
    type: "mcq"
  },
  {
    question: "Interference confirms the:",
    options: ["Particle nature of light", "Wave nature of light", "Thermal nature", "Magnetic nature"],
    correctAnswer: "Wave nature of light",
    explanation: "Interference is a wave phenomenon.",
    type: "mcq"
  }
],

"Newton's Rings": [
  {
    question: "Newton’s rings are formed due to:",
    options: ["Diffraction", "Polarization", "Thin film interference", "Reflection only"],
    correctAnswer: "Thin film interference",
    explanation: "Air film causes interference.",
    type: "mcq"
  },
  {
    question: "Shape of Newton’s rings is:",
    options: ["Straight", "Elliptical", "Circular", "Random"],
    correctAnswer: "Circular",
    explanation: "Symmetric air film produces circles.",
    type: "mcq"
  },
  {
    question: "Central ring in Newton’s rings experiment is:",
    options: ["Bright", "Dark", "Colored", "Absent"],
    correctAnswer: "Dark",
    explanation: "Destructive interference at zero thickness.",
    type: "mcq"
  },
  {
    question: "Newton’s rings are used to measure:",
    options: ["Force", "Temperature", "Wavelength of light", "Current"],
    correctAnswer: "Wavelength of light",
    explanation: "Fringe diameters give wavelength.",
    type: "mcq"
  },
  {
    question: "Newton’s rings demonstrate:",
    options: ["Particle nature", "Wave nature", "Thermal nature", "Magnetic nature"],
    correctAnswer: "Wave nature",
    explanation: "Interference proves wave behavior.",
    type: "mcq"
  }
],

"Diffraction Grating": [
  {
    question: "A diffraction grating consists of:",
    options: ["Single slit", "Two slits", "Many equally spaced slits", "Random openings"],
    correctAnswer: "Many equally spaced slits",
    explanation: "Large number of slits improve resolution.",
    type: "mcq"
  },
  {
    question: "Main advantage of diffraction grating is:",
    options: ["Low cost", "High resolving power", "No diffraction", "Low intensity"],
    correctAnswer: "High resolving power",
    explanation: "Closely spaced wavelengths can be resolved.",
    type: "mcq"
  },
  {
    question: "Grating spectrum is due to:",
    options: ["Diffraction only", "Interference only", "Diffraction and interference", "Reflection"],
    correctAnswer: "Diffraction and interference",
    explanation: "Both phenomena occur simultaneously.",
    type: "mcq"
  },
  {
    question: "Diffraction grating is commonly used in:",
    options: ["Microscopy", "Spectroscopy", "Photography", "Heating devices"],
    correctAnswer: "Spectroscopy",
    explanation: "For wavelength analysis.",
    type: "mcq"
  },
  {
    question: "Increasing number of slits results in:",
    options: ["Blurred maxima", "Sharper maxima", "No pattern", "Dark screen"],
    correctAnswer: "Sharper maxima",
    explanation: "Peaks become narrow and intense.",
    type: "mcq"
  }
],
"Rayleigh's Criterion": [
  {
    question: "Rayleigh’s criterion is related to:",
    options: ["Magnification", "Resolution", "Brightness", "Polarization"],
    correctAnswer: "Resolution",
    explanation: "It defines the limit of resolution of optical instruments.",
    type: "mcq"
  },
  {
    question: "Two images are just resolved when:",
    options: [
      "Their maxima overlap completely",
      "Central maximum of one coincides with first minimum of the other",
      "They are far apart",
      "They form one image"
    ],
    correctAnswer: "Central maximum of one coincides with first minimum of the other",
    explanation: "This is Rayleigh’s condition.",
    type: "mcq"
  },
  {
    question: "Resolving power depends on:",
    options: ["Aperture size", "Wavelength", "Instrument design", "All of these"],
    correctAnswer: "All of these",
    explanation: "Resolution is affected by multiple factors.",
    type: "mcq"
  },
  {
    question: "Higher resolving power means:",
    options: ["Blurred image", "Sharper image", "Dim image", "No image"],
    correctAnswer: "Sharper image",
    explanation: "Closer objects can be distinguished clearly.",
    type: "mcq"
  },
  {
    question: "Rayleigh’s criterion is mainly used in:",
    options: ["Mechanics", "Optics", "Thermodynamics", "Electronics"],
    correctAnswer: "Optics",
    explanation: "It applies to optical instruments.",
    type: "mcq"
  }
],

"Grating Resolving Power": [
  {
    question: "Grating resolving power measures the ability to:",
    options: ["Increase intensity", "Separate close wavelengths", "Reflect light", "Refract light"],
    correctAnswer: "Separate close wavelengths",
    explanation: "It defines spectral resolution.",
    type: "mcq"
  },
  {
    question: "Resolving power of a grating increases with:",
    options: ["Fewer slits", "Lower order", "More slits and higher order", "Longer wavelength"],
    correctAnswer: "More slits and higher order",
    explanation: "R = nN depends on order and number of slits.",
    type: "mcq"
  },
  {
    question: "Diffraction grating is preferred in spectroscopy because of:",
    options: ["Low cost", "High resolving power", "Easy handling", "Low dispersion"],
    correctAnswer: "High resolving power",
    explanation: "It produces sharp spectral lines.",
    type: "mcq"
  },
  {
    question: "Grating gives sharper spectral lines due to:",
    options: ["Refraction", "Reflection", "Interference", "Absorption"],
    correctAnswer: "Interference",
    explanation: "Multiple slit interference narrows maxima.",
    type: "mcq"
  },
  {
    question: "Resolving power does NOT depend on:",
    options: ["Number of slits", "Order of spectrum", "Speed of light", "Wavelength"],
    correctAnswer: "Speed of light",
    explanation: "Speed of light has no direct role.",
    type: "mcq"
  }
],

"Emission Processes": [
  {
    question: "Laser action is based on:",
    options: ["Absorption", "Spontaneous emission", "Stimulated emission", "Reflection"],
    correctAnswer: "Stimulated emission",
    explanation: "Laser amplification occurs due to stimulated emission.",
    type: "mcq"
  },
  {
    question: "Spontaneous emission produces photons that are:",
    options: ["Coherent", "Same phase", "Random", "Parallel"],
    correctAnswer: "Random",
    explanation: "Direction and phase are random.",
    type: "mcq"
  },
  {
    question: "Stimulated emission results in:",
    options: ["One photon", "Two identical photons", "No photon", "Heat"],
    correctAnswer: "Two identical photons",
    explanation: "Same energy, phase and direction.",
    type: "mcq"
  },
  {
    question: "Laser light is highly:",
    options: ["Incoherent", "Divergent", "Coherent", "Weak"],
    correctAnswer: "Coherent",
    explanation: "All photons are in phase.",
    type: "mcq"
  },
  {
    question: "Emission processes are related to:",
    options: ["Gravity", "Atomic energy levels", "Pressure", "Sound"],
    correctAnswer: "Atomic energy levels",
    explanation: "Photon emission occurs during transitions.",
    type: "mcq"
  }
],

"Ruby & He-Ne Lasers": [
  {
    question: "Ruby laser is a:",
    options: ["Gas laser", "Liquid laser", "Solid state laser", "Semiconductor laser"],
    correctAnswer: "Solid state laser",
    explanation: "Uses ruby crystal as active medium.",
    type: "mcq"
  },
  {
    question: "Output of He-Ne laser is:",
    options: ["Pulsed", "Continuous", "Random", "Infrared"],
    correctAnswer: "Continuous",
    explanation: "It gives stable continuous output.",
    type: "mcq"
  },
  {
    question: "Optical pumping is used in:",
    options: ["He-Ne laser", "Ruby laser", "Diode laser", "Fiber laser"],
    correctAnswer: "Ruby laser",
    explanation: "Flash lamp excites chromium ions.",
    type: "mcq"
  },
  {
    question: "He-Ne laser emits light of color:",
    options: ["Blue", "Green", "Red", "Violet"],
    correctAnswer: "Red",
    explanation: "Wavelength is 632.8 nm.",
    type: "mcq"
  },
  {
    question: "More stable laser is:",
    options: ["Ruby laser", "He-Ne laser", "Both", "None"],
    correctAnswer: "He-Ne laser",
    explanation: "Continuous low-noise output.",
    type: "mcq"
  }
],

"Laser Applications": [
  {
    question: "Major advantage of laser surgery is:",
    options: ["Low precision", "High blood loss", "High precision", "Slow healing"],
    correctAnswer: "High precision",
    explanation: "Laser beam is highly focused.",
    type: "mcq"
  },
  {
    question: "Industrial lasers are used for:",
    options: ["Painting", "Cutting and welding", "Cooling", "Lighting"],
    correctAnswer: "Cutting and welding",
    explanation: "High energy density enables machining.",
    type: "mcq"
  },
  {
    question: "Barcode scanners work on:",
    options: ["Laser reflection", "Diffraction", "Interference", "Polarization"],
    correctAnswer: "Laser reflection",
    explanation: "Reflected signal is detected.",
    type: "mcq"
  },
  {
    question: "Optical fiber communication uses:",
    options: ["Bulb", "LED only", "Laser", "Heater"],
    correctAnswer: "Laser",
    explanation: "Coherent light travels long distance.",
    type: "mcq"
  },
  {
    question: "Laser is useful in defence due to:",
    options: ["Weight", "Accurate targeting", "Random beam", "Low cost"],
    correctAnswer: "Accurate targeting",
    explanation: "Highly directional beam.",
    type: "mcq"
  }
],

"Optical Fiber Construction": [
  {
    question: "Light propagation in optical fiber occurs due to:",
    options: ["Reflection", "Refraction", "Total internal reflection", "Diffraction"],
    correctAnswer: "Total internal reflection",
    explanation: "Occurs at core-cladding boundary.",
    type: "mcq"
  },
  {
    question: "Central part of optical fiber is called:",
    options: ["Jacket", "Cladding", "Core", "Shield"],
    correctAnswer: "Core",
    explanation: "Light propagates through core.",
    type: "mcq"
  },
  {
    question: "Function of cladding is to:",
    options: ["Generate light", "Absorb light", "Ensure TIR", "Amplify signal"],
    correctAnswer: "Ensure TIR",
    explanation: "Lower refractive index than core.",
    type: "mcq"
  },
  {
    question: "Outer jacket of fiber provides:",
    options: ["Reflection", "Amplification", "Mechanical protection", "Refraction"],
    correctAnswer: "Mechanical protection",
    explanation: "Protects fiber from damage.",
    type: "mcq"
  },
  {
    question: "Optical fibers are made of:",
    options: ["Metal", "Glass or plastic", "Wood", "Rubber"],
    correctAnswer: "Glass or plastic",
    explanation: "Transparent materials are used.",
    type: "mcq"
  }
],

"Fiber Uses": [
  {
    question: "Primary use of optical fiber is:",
    options: ["Heating", "Communication", "Lighting", "Cooking"],
    correctAnswer: "Communication",
    explanation: "Used for data transmission.",
    type: "mcq"
  },
  {
    question: "Main advantage of optical fiber is:",
    options: ["High loss", "Low bandwidth", "High bandwidth", "Electrical noise"],
    correctAnswer: "High bandwidth",
    explanation: "Carries large data rates.",
    type: "mcq"
  },
  {
    question: "Fiber optics is used in medical field for:",
    options: ["Endoscopy", "Imaging", "Surgery", "All of these"],
    correctAnswer: "All of these",
    explanation: "Widely used in diagnostics.",
    type: "mcq"
  },
  {
    question: "Fiber is immune to EMI because it uses:",
    options: ["Metal", "Plastic", "Optical signals", "Shielding"],
    correctAnswer: "Optical signals",
    explanation: "No electrical interference.",
    type: "mcq"
  },
  {
    question: "Optical fiber is future-proof due to:",
    options: ["Low speed", "High speed and low loss", "Heavy weight", "Manual operation"],
    correctAnswer: "High speed and low loss",
    explanation: "Ideal for next-gen communication.",
    type: "mcq"
  }
],

"Particle in a 1D Box": [
  {
    question: "Energy levels of a particle in a 1D box are:",
    options: ["Continuous", "Random", "Discrete", "Infinite"],
    correctAnswer: "Discrete",
    explanation: "Energy is quantized.",
    type: "mcq"
  },
  {
    question: "Ground state energy of particle in a box is:",
    options: ["Zero", "Negative", "Minimum non-zero", "Infinite"],
    correctAnswer: "Minimum non-zero",
    explanation: "Zero-point energy exists.",
    type: "mcq"
  },
  {
    question: "Particle in a box cannot exist outside the box due to:",
    options: ["Friction", "Infinite potential walls", "Gravity", "Low energy"],
    correctAnswer: "Infinite potential walls",
    explanation: "Probability outside is zero.",
    type: "mcq"
  },
  {
    question: "Particle in a box model explains:",
    options: ["Classical motion", "Energy quantization", "Magnetism", "Heat"],
    correctAnswer: "Energy quantization",
    explanation: "Allowed energies are discrete.",
    type: "mcq"
  },
  {
    question: "Particle in a box is a model of:",
    options: ["Mechanics", "Optics", "Quantum mechanics", "Thermodynamics"],
    correctAnswer: "Quantum mechanics",
    explanation: "It is a quantum bound-state problem.",
    type: "mcq"
  }
],





"Postulates of STR": [
  {
    question: "Einstein's first postulate of STR states that physics laws are same in all:",
    options: ["Inertial frames", "Non-inertial frames", "Accelerated frames", "Rotating frames"],
    correctAnswer: "Inertial frames",
    explanation: "The laws of physics are invariant in all inertial reference frames.",
    type: "mcq"
  },
  {
    question: "The second postulate states that the speed of light in vacuum is:",
    options: ["Dependent on source speed", "Dependent on observer speed", "Constant for all observers", "Infinite"],
    correctAnswer: "Constant for all observers",
    explanation: "Light speed is absolute and independent of source or observer motion.",
    type: "mcq"
  },
  {
    question: "Which of these is a direct consequence of Einstein's postulates?",
    options: ["Length contraction", "Time dilation", "Mass-energy equivalence", "All of the above"],
    correctAnswer: "All of the above",
    explanation: "Postulates form the basis for all relativistic effects.",
    type: "mcq"
  },
  {
    question: "According to STR, absolute rest is:",
    options: ["Always detectable", "Impossible to define", "A physical reality", "Only for light"],
    correctAnswer: "Impossible to define",
    explanation: "There is no preferred inertial frame of reference.",
    type: "mcq"
  },
  {
    question: "Postulates of STR were proposed in the year:",
    options: ["1900", "1905", "1915", "1921"],
    correctAnswer: "1905",
    explanation: "Einstein published his STR paper in 1905.",
    type: "mcq"
  }
],

"Black Body Spectrum": [
  {
    question: "An ideal black body is one which:",
    options: ["Reflects all radiation", "Absorbs all radiation", "Transmits all radiation", "Emits only black light"],
    correctAnswer: "Absorbs all radiation",
    explanation: "A perfect black body absorbs all incident electromagnetic radiation.",
    type: "mcq"
  },
  {
    question: "As the temperature of a black body increases, its total emitted power:",
    options: ["Decreases", "Remains same", "Increases", "Becomes zero"],
    correctAnswer: "Increases",
    explanation: "Radiated power is proportional to T^4.",
    type: "mcq"
  },
  {
    question: "The shape of the black body spectrum depends ONLY on:",
    options: ["Material", "Shape", "Size", "Temperature"],
    correctAnswer: "Temperature",
    explanation: "Black body radiation is characteristic of temperature only.",
    type: "mcq"
  },
  {
    question: "As temperature increases, the peak of the spectrum shifts towards:",
    options: ["Longer wavelengths", "Shorter wavelengths", "The center", "It does not shift"],
    correctAnswer: "Shorter wavelengths",
    explanation: "According to Wien's displacement law.",
    type: "mcq"
  },
  {
    question: "Black body radiation failure in classical physics led to:",
    options: ["Relativity", "Quantum mechanics", "Thermodynamics", "Optics"],
    correctAnswer: "Quantum mechanics",
    explanation: "Planck's solution started the quantum revolution.",
    type: "mcq"
  }
],

"Classical Laws": [
  {
    question: "Stefan-Boltzmann law states that E is proportional to:",
    options: ["T", "T^2", "T^3", "T^4"],
    correctAnswer: "T^4",
    explanation: "Total energy radiated per unit area per unit time is ∝ T^4.",
    type: "mcq"
  },
  {
    question: "Wien's displacement law is expressed as:",
    options: ["λm T = constant", "λm / T = constant", "T / λm = constant", "λm + T = constant"],
    correctAnswer: "λm T = constant",
    explanation: "Peak wavelength is inversely proportional to temperature.",
    type: "mcq"
  },
  {
    question: "Rayleigh-Jeans law fails primarily at:",
    options: ["Low frequencies", "High frequencies", "Absolute zero", "Room temperature"],
    correctAnswer: "High frequencies",
    explanation: "This failure is known as the Ultraviolet Catastrophe.",
    type: "mcq"
  },
  {
    question: "Rayleigh-Jeans law assumes that energy is:",
    options: ["Quantized", "Continuous", "Zero", "Random"],
    correctAnswer: "Continuous",
    explanation: "Classical theory assumes continuous energy distribution.",
    type: "mcq"
  },
  {
    question: "Ultraviolet catastrophe means infinite energy at:",
    options: ["Infrared region", "Visible region", "Short wavelength region", "Long wavelength region"],
    correctAnswer: "Short wavelength region",
    explanation: "Classical theory predicted infinite intensity for small wavelengths.",
    type: "mcq"
  }
],

"Planck's Law": [
  {
    question: "Planck assumed that radiation is emitted in discrete packets called:",
    options: ["Electrons", "Quanta", "Waves", "Atoms"],
    correctAnswer: "Quanta",
    explanation: "He introduced the concept of energy quantization.",
    type: "mcq"
  },
  {
    question: "The energy of a single quantum (photon) is given by:",
    options: ["E = mc^2", "E = hν", "E = mv", "E = pλ"],
    correctAnswer: "E = hν",
    explanation: "Energy is proportional to frequency.",
    type: "mcq"
  },
  {
    question: "Planck's constant (h) has dimensions of:",
    options: ["Force", "Energy", "Power", "Action (Angular Momentum)"],
    correctAnswer: "Action (Angular Momentum)",
    explanation: "Units are Joule-seconds.",
    type: "mcq"
  },
  {
    question: "Planck's law reduces to Rayleigh-Jeans law at:",
    options: ["High frequencies", "Low frequencies", "High temperatures", "Zero temperature"],
    correctAnswer: "Low frequencies",
    explanation: "Classical results are valid for long wavelengths.",
    type: "mcq"
  },
  {
    question: "Planck's law successfully explained:",
    options: ["Black body spectrum", "UV catastrophe solution", "Quantization", "All of the above"],
    correctAnswer: "All of the above",
    explanation: "It provided the complete correct distribution formula.",
    type: "mcq"
  }
],

"Matter Waves": [
  {
    question: "De Broglie hypothesis states that moving particles behave like:",
    options: ["Static points", "Waves", "Only particles", "None"],
    correctAnswer: "Waves",
    explanation: "Dual nature of matter.",
    type: "mcq"
  },
  {
    question: "The de Broglie wavelength (λ) is given by:",
    options: ["h/p", "hp", "p/h", "h/m"],
    correctAnswer: "h/p",
    explanation: "λ = h/(mv) states the wave-particle relation.",
    type: "mcq"
  },
  {
    question: "Matter waves are also known as:",
    options: ["EM waves", "Sound waves", "De Broglie waves", "Transverse waves"],
    correctAnswer: "De Broglie waves",
    explanation: "Named after Louis de Broglie.",
    type: "mcq"
  },
  {
    question: "If momentum increases, the de Broglie wavelength:",
    options: ["Increases", "Decreases", "Remains same", "Becomes negative"],
    correctAnswer: "Decreases",
    explanation: "Wavelength is inversely proportional to momentum.",
    type: "mcq"
  },
  {
    question: "Matter waves were experimentally confirmed by:",
    options: ["Einstein", "Newton", "Davisson and Germer", "Faraday"],
    correctAnswer: "Davisson and Germer",
    explanation: "Electron diffraction experiment proved matter waves.",
    type: "mcq"
  }
],

"Dual Nature": [
  {
    question: "Wave nature of light is demonstrated by:",
    options: ["Photoelectric effect", "Compton effect", "Interference", "Black body radiation"],
    correctAnswer: "Interference",
    explanation: "Interference and diffraction are wave phenomena.",
    type: "mcq"
  },
  {
    question: "Particle nature of light is demonstrated by:",
    options: ["Dispersion", "Refraction", "Photoelectric effect", "Polarization"],
    correctAnswer: "Photoelectric effect",
    explanation: "Involves photon-electron interaction.",
    type: "mcq"
  },
  {
    question: "The concept of duality applies to:",
    options: ["Only light", "Only electrons", "Both light and matter", "None"],
    correctAnswer: "Both light and matter",
    explanation: "Everything shows both properties at quantum scale.",
    type: "mcq"
  },
  {
    question: "Which scientist proposed the dual nature of matter?",
    options: ["Planck", "Einstein", "De Broglie", "Newton"],
    correctAnswer: "De Broglie",
    explanation: "His 1924 thesis proposed matter duality.",
    type: "mcq"
  },
  {
    question: "In dual nature, wave and particle behaviors are:",
    options: ["Mutually exclusive in a single measurement", "Always present together", "Classical effects", "Irrelevant"],
    correctAnswer: "Mutually exclusive in a single measurement",
    explanation: "Complementarity principle by Bohr.",
    type: "mcq"
  }
],

"Time-Independent Equation": [
  {
    question: "Schrödinger's time-independent equation is used when potential is:",
    options: ["Varying with time", "Constant with time", "Infinite", "Zero"],
    correctAnswer: "Constant with time",
    explanation: "Applicable to stationary states.",
    type: "mcq"
  },
  {
    question: "The solution to the Schrödinger equation is called:",
    options: ["Force function", "Wave function (ψ)", "Velocity function", "Mass function"],
    correctAnswer: "Wave function (ψ)",
    explanation: "ψ contains all information about the system.",
    type: "mcq"
  },
  {
    question: "Total energy operator in Schrödinger equation is:",
    options: ["Momentum operator", "Hamiltonian (H)", "Potential operator", "Kinetic operator"],
    correctAnswer: "Hamiltonian (H)",
    explanation: "Hψ = Eψ.",
    type: "mcq"
  },
  {
    question: "Quantization of energy emerges from solving the equation for:",
    options: ["Free particles", "Bound states", "Uniform motion", "Relativistic motion"],
    correctAnswer: "Bound states",
    explanation: "Constraints lead to discrete energy levels.",
    type: "mcq"
  },
  {
    question: "Schrödinger equation is a:",
    options: ["Linear algebraic equation", "Differential equation", "Integrable equation", "Vector equation"],
    correctAnswer: "Differential equation",
    explanation: "It is a second-order partial differential equation.",
    type: "mcq"
  }
],

"Time-Dependent Equation": [
  {
    question: "Time-dependent Schrödinger equation describes system:",
    options: ["Statics", "Evolution over time", "Geometry", "Mass only"],
    correctAnswer: "Evolution over time",
    explanation: "Shows how ψ(x,t) changes with time.",
    type: "mcq"
  },
  {
    question: "The factor 'i' (imaginary unit) in the equation indicates:",
    options: ["Error", "Wave-like phase evolution", "Infinite energy", "Negative mass"],
    correctAnswer: "Wave-like phase evolution",
    explanation: "Crucial for quantum interference and dynamics.",
    type: "mcq"
  },
  {
    question: "Linearity of Schrödinger equation allows:",
    options: ["Superposition of states", "Chaos", "Non-linear waves", "Particle collisions"],
    correctAnswer: "Superposition of states",
    explanation: "Sum of solutions is also a solution.",
    type: "mcq"
  },
  {
    question: "Time-dependent equation is fundamental for studying:",
    options: ["Stationary states", "Quantum transitions", "Static potential", "Zero energy"],
    correctAnswer: "Quantum transitions",
    explanation: "Essential for dynamics and change.",
    type: "mcq"
  },
  {
    question: "The Hamiltonian in the time-dependent equation represents:",
    options: ["Total Energy", "Force", "Rate of change", "Position"],
    correctAnswer: "Total Energy",
    explanation: "It is the energy operator for the system.",
    type: "mcq"
  }
],

"Wave Function Psi": [
  {
    question: "The physical interpretation of |ψ|^2 is:",
    options: ["Energy density", "Force density", "Probability density", "Charge density"],
    correctAnswer: "Probability density",
    explanation: "Probability of finding particle at a point.",
    type: "mcq"
  },
  {
    question: "Max Born's interpretation established that quantum mechanics is:",
    options: ["Deterministic", "Probabilistic", "Classical", "Exact"],
    correctAnswer: "Probabilistic",
    explanation: "Outcomes are predicted using probabilities.",
    type: "mcq"
  },
  {
    question: "A valid wave function (ψ) must be:",
    options: ["Single-valued", "Continuous", "Finite", "All of the above"],
    correctAnswer: "All of the above",
    explanation: "Mathematical requirements for physical meaning.",
    type: "mcq"
  },
  {
    question: "The condition that total probability must be 1 is called:",
    options: ["Orthogonality", "Normalization", "Quantization", "Linearity"],
    correctAnswer: "Normalization",
    explanation: "∫|ψ|^2 dx = 1.",
    type: "mcq"
  },
  {
    question: "ψ(x,t) itself is generally a:",
    options: ["Real number", "Complex number", "Integer", "Vector"],
    correctAnswer: "Complex number",
    explanation: "It has magnitude and phase.",
    type: "mcq"
  }
],
    };

    const replies = [];
    const tests = [];

    // 3. Populate Replies and Tests using precise IDs from the created subject
    mechanicsSubject.units.forEach(unit => {
      unit.chapters.forEach(chapter => {
        chapter.topics.forEach(topic => {
          const data = contentMap[topic.title];
          if (data) {
            replies.push({
              topicId: topic._id,
              action: 'Summarize',
              content: data.summarize
            });
            replies.push({
              topicId: topic._id,
              action: 'Give me 5 MCQs',
              content: `${data.mcq}\n\n### 🎓 Time to test your knowledge!\n\nBhai, tune topic toh samajh liya hai, ab dekhte hain kitna solid hua hai concept. Niche wala test complete kar aur apna score check kar! 🔥\n\n[SHOW_TEST_BLOCK]`
            });
            replies.push({
              topicId: topic._id,
              action: 'Explain simpler',
              content: `## ${topic.title}: Simple Bolu Toh... ✨\n\nBhai, dekh ${topic.title} ka concept ekdum simple hai. \n\n${data.summarize.split('\n\n')[1] || topic.description}\n\nSamajh aaya? Bas yehi main baat hai! 😎💪\n\n---\n\n**Bhai ab thoda test bhi toh ho jaye? 🎯**\nNiche MCQs try kar aur dekh kitna mast samajh aaya hai!`
            });

            // Check if test data exists for this topic
            if (testDataMap[topic.title]) {
              tests.push({
                title: `${topic.title} Practice Test`,
                description: `Test your understanding of ${topic.title} with these conceptual questions.`,
                type: 'topic',
                referenceId: topic._id,
                subjectId: mechanicsSubject._id,
                duration: 10,
                questions: testDataMap[topic.title]
              });
            }
          }
        });
      });
    });

    if (replies.length > 0) {
      await Reply.insertMany(replies);
      console.log(`✅ Successfully seeded ${replies.length} replies!`);
    }

    if (tests.length > 0) {
      await Test.insertMany(tests);
      console.log(`✅ Successfully seeded ${tests.length} tests!`);
    }

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Seeding Error:", error);
  }
};

seedMechanicsFull();
