import mongoose from "mongoose";
import dotenv from "dotenv";
import { Subject } from "./models/syllabus.model.js";
import { Reply } from "./models/reply.model.js";

dotenv.config();

const seedMechanicsFull = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    // Clean up existing subject if it exists
    await Subject.deleteMany({ code: "ME103" });
    
    const mechanicsSubject = await Subject.create({
      name: "Fundamentals of Mechanical Engineering & Mechatronics",
      code: "ME103",
      branch: "All",
      year: 1,
      image: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=2000&auto=format&fit=crop",
      units: [
        {
          unitNumber: 1,
          title: "Mechanics of Solids",
          chapters: [
            {
              title: "Basics of Solids",
              topics: [
                { title: "Stress and Strain", description: "Internal resisting force and deformation." },
                { title: "Hooke’s Law", description: "Proportionality between stress and strain within elastic limit." },
                { title: "Elastic Constants", description: "Modulus of elasticity, rigidity and bulk modulus." },
                { title: "Stress-Strain Diagram", description: "Behavior of ductile and brittle materials under load." }
              ]
            }
          ]
        },
        {
          unitNumber: 2,
          title: "Introduction to IC Engines and RAC",
          chapters: [
            {
              title: "Heat Engines and Cooling",
              topics: [
                { title: "IC Engine Basics", description: "Principles and components of internal combustion engines." },
                { title: "SI and CI Engines", description: "Comparison between petrol and diesel engines." },
                { title: "Refrigeration System", description: "Basics of cooling and COP." },
                { title: "Air Conditioning", description: "Comfort conditions and atmospheric control." }
              ]
            }
          ]
        },
        {
          unitNumber: 3,
          title: "Fluid Mechanics and Applications",
          chapters: [
            {
              title: "Fluid Properties and Laws",
              topics: [
                { title: "Fluid Properties", description: "Density, viscosity, and specific gravity." },
                { title: "Pascal’s Law", description: "Pressure transmission in static fluids." },
                { title: "Continuity Equation", description: "Conservation of mass in fluid flow." },
                { title: "Bernoulli’s Equation", description: "Conservation of energy in fluid dynamics." }
              ]
            }
          ]
        },
        {
          unitNumber: 4,
          title: "Measurements and Control Systems",
          chapters: [
            {
              title: "Metrology and Control",
              topics: [
                { title: "Errors and Accuracy", description: "Understanding measurement errors, precision, and resolution." },
                { title: "Measurement of Parameters", description: "Methods for measuring pressure, force, and temperature." },
                { title: "Limits, Fits and Tolerance", description: "Engineering standards for manufacturing parts." },
                { title: "Control System Concepts", description: "Open loop and closed loop control systems." }
              ]
            }
          ]
        },
        {
          unitNumber: 5,
          title: "Introduction to Mechatronics",
          chapters: [
            {
              title: "Mechatronic Systems",
              topics: [
                { title: "Mechatronics Scope", description: "Evolution and industrial significance of mechatronics." },
                { title: "Sensors and Transducers", description: "Devices for converting physical signals to data." },
                { title: "Actuation Systems", description: "Mechanical, hydraulic, and pneumatic actuators." },
                { title: "Industrial Applications", description: "Robotics and automated manufacturing." }
              ]
            }
          ]
        }
      ]
    });

    console.log("✅ Created Subject ME103 (5 Units)");

    const contentMap = {
      // Unit 1
      "Stress and Strain": {
        summarize: "## Summary: Stress and Strain 💪📐\n\nBhai, **Stress aur Strain** mechanical engineering ke sabse pehle aur sabse important concepts hain. Jab bhi kisi rod, beam ya structure par bahar se force lagta hai, toh us material ke andar resistance develop hota hai — isi resistance ko **Stress** kehte hain.\n\nStress hamesha internal hota hai aur material ke andar ka reaction batata hai. Iska direct relation safety aur strength se hota hai.\n\nAb baat karte hain **Strain** ki. Jab load lagne se material ki length, shape ya size change hoti hai, us change ka ratio **Strain** kehlata hai. Ye batata hai ki material kitna deform hua hai 👀.\n\nSimple bolu toh: **force lagaya = stress**, **kitna change hua = strain**. In dono ko samajh liya toh aadhi mechanics clear ho jaati hai 😎🔥.",
        mcq: "## 5 MCQs: Stress and Strain 🎯\n\nQ1. Stress represents?\n\nA) Shape change\nB) Internal resisting force\nC) External motion\nD) Temperature\n\n```diff\nB) Internal resisting force\nExplanation: Stress material ke andar develop hone wali resisting force hoti hai jab bahar se load lagta hai ✅\n```\n\nQ2. Strain is defined as?\n\nA) Force applied\nB) Deformation ratio\nC) Energy stored\nD) Pressure developed\n\n```diff\nB) Deformation ratio\nExplanation: Strain = change in dimension / original dimension hota hai ✅\n```\n\nQ3. Unit of stress is?\n\nA) Newton\nB) Pascal\nC) Meter\nD) Joule\n\n```diff\nB) Pascal\nExplanation: Stress = Force/Area hota hai, standard unit Pascal (N/m²) hai ✅\n```\n\nQ4. Strain ka unit kya hota hai?\n\nA) Newton\nB) Meter\nC) Pascal\nD) No unit\n\n```diff\nD) No unit\nExplanation: Strain do similar dimensions ka ratio hai, isliye dimensionless hota hai ✅\n```\n\nQ5. Design mein main practical use?\n\nA) Cooking\nB) Safety of structures\nC) Painting\nD) Web design\n\n```diff\nB) Safety of structures\nExplanation: Buildings aur machines design karte waqt stress analysis zaroori hai ✅\n```"
      },
      "Hooke’s Law": {
        summarize: "## Summary: Hooke’s Law 🔗📏\n\nBhai, **Hooke’s Law** material ke elastic behavior ko explain karta hai. Ye law kehta hai ki jab tak material elastic limit ke andar hota hai, tab tak **Stress directly proportional hota hai Strain ke**.\n\nIska matlab ye hua ki agar load hata diya jaaye, toh material wapas apni original shape aur size mein aa jaata hai 🔄. Ye property elastic materials jaise steel aur springs mein clearly dikhti hai.\n\nHooke’s Law ka use har jagah hota hai — spring balance, suspension systems, bridges, buildings, sab isi concept par based hote hain. Isliye ye law mechanical engineering ka backbone mana jaata hai 😎💪.",
        mcq: "## 5 MCQs: Hooke’s Law 🎯\n\nQ1. Hooke’s Law kab tak valid hota hai?\n\nA) Breaking point tak\nB) Elastic limit tak\nC) Zero load tak\nD) Infinity tak\n\n```diff\nB) Elastic limit tak\nExplanation: Elastic limit ke bahar material permanent deform ho jaata hai aur law valid nahi rehta ✅\n```\n\nQ2. Stress/Strain ratio kya hota hai?\n\nA) Mass\nB) Modulus of Elasticity\nC) Pressure\nD) Speed\n\n```diff\nB) Modulus of Elasticity\nExplanation: Hooke's Law (σ = Eε) se E = σ/ε hota hai ✅\n```\n\nQ3. Elasticity ka matlab kya hai?\n\nA) Toot jana\nB) Wapas shape mein aana\nC) Pigal jana\nD) Rang badalna\n\n```diff\nB) Wapas shape mein aana\nExplanation: Loading hatane par material ka recovery behavior ✅\n```\n\nQ4. Rubber aur Steel mein se kaun zyada elastic hai?\n\nA) Rubber\nB) Steel\nC) Dono same\nD) Koi nahi\n\n```diff\nB) Steel\nExplanation: Young's Modulus of steel is much higher than rubber, making it more 'elastic' in physics terms ✅\n```\n\nQ5. Hooke's Law follow karne wale material ko kya kehte hain?\n\nA) Plastic\nB) Linear Elastic\nC) Brittle\nD) Hard\n\n```diff\nB) Linear Elastic\n```"
      },
      "Elastic Constants": {
        summarize: "## Summary: Elastic Constants 🧠📊\n\nBhai, **Elastic constants** material ki stiffness aur deformation resistance ko measure karte hain. Matlab material kitna hard hai ya kitna easily deform ho jaata hai, ye sab elastic constants batate hain.\n\nTeen main elastic constants hote hain:\n\n- **Young’s Modulus (E):** Tension aur compression ke against resistance batata hai (Linear stiffness).\n- **Shear Modulus (G):** Shape change (shearing) ke against resistance batata hai.\n- **Bulk Modulus (K):** Volume change ke against resistance batata hai.\n\nSimple rule yaad rakh: **Modulus zyada = material zyada stiff**. Engineering design mein material selection isi ke base par hota hai 😎🔥.",
        mcq: "## 5 MCQs: Elastic Constants 🎯\n\nQ1. Young’s Modulus kisko resist karta hai?\n\nA) Twisting\nB) Stretching/Compression\nC) Volume change\nD) Color change\n\n```diff\nB) Stretching/Compression\nExplanation: Ye linear scaling ko resist karta hai ✅\n```\n\nQ2. Bulk Modulus K ka relation kis se hai?\n\nA) Length\nB) Volume\nC) Shape\nD) Mass\n\n```diff\nB) Volume\nExplanation: Bulk modulus hydrostatic pressure aur volumetric strain ka ratio hai ✅\n```\n\nQ3. Shear modulus kya measure karta hai?\n\nA) Weight\nB) Rigidity against shape change\nC) Elasticity\nD) Heat capacity\n\n```diff\nB) Rigidity\nExplanation: Modulus of Rigidity shape deformation ko resist karta hai ✅\n```\n\nQ4. Poisson's ratio kya hai?\n\nA) Stress/Strain\nB) Lateral Strain / Longitudinal Strain\nC) Force/Area\nD) Mass/Volume\n\n```diff\nB) Lateral Strain / Longitudinal Strain\nExplanation: Sideways expansion vs longitudinal contraction ka ratio ✅\n```\n\nQ5. Steel ka Young's modulus approx kitna hota hai?\n\nA) 200 GPa\nB) 10 GPa\nC) 1000 GPa\nD) 0.5 GPa\n\n```diff\nA) 200 GPa\n```"
      },
      "Stress-Strain Diagram": {
        summarize: "## Summary: Stress–Strain Diagram 📈🔥\n\nBhai, **Stress–Strain diagram** material ka poora life story dikhata hai — load lagne se leke fracture hone tak. Is diagram ke through material ka elastic behavior, plastic behavior aur failure clearly samajh aata hai 👀.\n\nDiagram mein elastic region hota hai jahan material recover kar leta hai, phir yield point aata hai jahan plastic deformation start hoti hai. Uske baad ultimate stress aur finally fracture point aata hai.\n\nIs diagram ki help se ductile (jaise steel) aur brittle (jaise glass) materials ka difference samajhna ekdam clear ho jaata hai 😎💡.",
        mcq: "## 5 MCQs: Stress–Strain Diagram 🎯\n\nQ1. Ductile material mein yielding ke baad kya hota hai?\n\nA) Sudden break\nB) Large plastic deformation\nC) Elasticity grows\nD) Becomes harder immediately\n\n```diff\nB) Large plastic deformation\nExplanation: Ductile material kaafi kichta hai tootne se pehle ✅\n```\n\nQ2. Brittle material ka example kaunsa hai?\n\nA) Mild Steel\nB) Copper\nC) Cast Iron\nD) Aluminum\n\n```diff\nC) Cast Iron\nExplanation: Cast iron, glass, concrete brittle hote hain ✅\n```\n\nQ3. Ultimate Tensile Strength (UTS) kya hai?\n\nA) Starting point\nB) Maximum stress a material can handle\nC) Breaking point\nD) Elastic limit\n\n```diff\nB) Maximum stress\nExplanation: Diagram ka highest point ✅\n```\n\nQ4. Area under the curve kya represent karta hai?\n\nA) Weight\nB) Toughness (Energy absorbed)\nC) Speed\nD) Hardness\n\n```diff\nB) Toughness\nExplanation: Total energy absorbed before fracture ✅\n```\n\nQ5. Necking kahan se shuru hoti hai?\n\nA) Elastic limit\nB) Yield point\nC) Ultimate stress point के बाद\nD) Zero se\n\n```diff\nC) Ultimate stress point के बाद\nExplanation: Area reduce hone lagta hai point of failure pe ✅\n```"
      },

      // Unit 2
      "IC Engine Basics": {
        summarize: "## Summary: IC Engine Basics 🚗🔥\n\nBhai, **IC Engine (Internal Combustion Engine)** mechanical engineering ka dil hai. Ye wahi machine hai jo fuel jalake humari gaadiyon ko chalati hai.\n\nIske do main types hote hain: **Two-stroke** aur **Four-stroke**. 4-stroke engines zyada efficient hote hain aur aaj kal almost har gaadi mein wahi use hote hain. Fuel ke jalne se jo pressure banta hai, wo piston ko dhakka deta hai aur gaadi chalti hai 😎.\n\nMechanical engineering mein thermodynamics aur mechanics ka ye best example hai! 💪",
        mcq: "## 5 MCQs: IC Engine Basics 🎯\n\nQ1. IC engine mein combustion kahan hota hai?\n\nA) Outside cylinder\nB) Inside cylinder\nC) Fuel tank\nD) Exhaust pipe\n\n```diff\nB) Inside cylinder\nExplanation: Internal Combustion matlab cylinder ke andar jalta hai fuel ✅\n```\n\nQ2. 4-stroke engine ka correct sequence?\n\nA) Suction-Compression-Power-Exhaust\nB) Power-Suction-Exhaust-Compression\nC) Suction-Power-Compression-Exhaust\nD) Exhaust-Power-Suction-Compression\n\n```diff\nA) Suction-Compression-Power-Exhaust\n```\n\nQ3. Piston ki linear motion ko rotatory kis se milti hai?\n\nA) Connecting rod & Crankshaft\nB) Valve\nC) Piston ring\nD) Fuel pump\n\n```diff\nA) Connecting rod & Crankshaft\n```\n\nQ4. Power stroke mein piston ki position?\n\nA) TDC to BDC\nB) BDC to TDC\nC) Constant\nD) Side to side\n\n```diff\nA) TDC to BDC\nExplanation: Expansion stroke mein piston niche jaata hai ✅\n```\n\nQ5. Spark plug kahan use hota hai?\n\nA) Diesel engine\nB) Petrol engine\nC) Steam engine\nD) Electric motor\n\n```diff\nB) Petrol engine\n```"
      },
      "SI and CI Engines": {
        summarize: "## Summary: SI and CI Engines ⛽️🚜\n\nBhai, SI aur CI engines basically Petrol aur Diesel engines hain. 🧐\n\n- **SI (Spark Ignition):** Ye petrol engines hote hain jisme spark plug fuel ko jalata hai. Ye lightweight hote hain aur bikes/cars mein use hote hain.\n- **CI (Compression Ignition):** Ye diesel engines hote hain jisme high pressure se air ko garam karke fuel jalaya jaata hai. Ye heavy loads ke liye best hote hain jaise Trucks/Tractors 🚜.\n\nPetrol fast hai, Diesel powerful hai — Simple logic! 😎🔥",
        mcq: "## 5 MCQs: SI and CI Engines 🎯\n\nQ1. Petrol engine (SI) mein compress kya hota hai?\n\nA) Air only\nB) Fuel only\nC) Air and Fuel mixture\nD) Water\n\n```diff\nC) Air and Fuel mixture\nExplanation: SI engines premixed fuel-air handle karte hain ✅\n```\n\nQ2. CI engine stands for?\n\nA) Constant Ignition\nB) Compression Ignition\nC) Central Injection\nD) Cooling Induction\n\n```diff\nB) Compression Ignition\n```\n\nQ3. Compression Ratio kiska zyada hota hai?\n\nA) SI engine\nB) CI engine\nC) Dono same\nD) Zero\n\n```diff\nB) CI engine\nExplanation: Diesel engines need much higher compression (16:1 to 24:1) ✅\n```\n\nQ4. Kaunsa engine heavy duty trucks ke liye use hota hai?\n\nA) SI engine\nB) CI engine\nC) Dono\nD) Koi nahi\n\n```diff\nB) CI engine\nExplanation: Due to high torque and durability ✅\n```\n\nQ5. Fuel Injector kahan zaroori hai?\n\nA) SI engine\nB) CI engine\nC) Steam engine\nD) Cycle\n\n```diff\nB) CI engine\n```"
      },
      "Refrigeration System": {
        summarize: "## Summary: Refrigeration System ❄️🍦\n\nBhai, Refrigeration ka matlab hai kisi jagah ko surrounding se thanda rakhna. Hamare ghar ka Fridge iska perfect example hai.\n\nIsme **COP (Coefficient of Performance)** dekha jaata hai — ye batata hai ki kitni kam bijli mein kitni zyada cooling kar raha hai fridge. Isme fluids (Refrigerants) heat ko andar se nikaal ke bahar phekte hain 🌡️💨.\n\nPhase change (evaporation aur condensation) hi iska secret sauce hai! 🍦😎",
        mcq: "## 5 MCQs: Refrigeration System 🎯\n\nQ1. COP ka full form?\n\nA) Cooling Of Product\nB) Coefficient Of Performance\nC) Circuit Of Power\nD) Common Operating Pressure\n\n```diff\nB) Coefficient Of Performance\n```\n\nQ2. Fridge mein component jo heat release karta hai?\n\nA) Evaporator\nB) Condenser\nC) Expansion Valve\nD) Compressor\n\n```diff\nB) Condenser\nExplanation: Peeche ki coils heat release karti hain ✅\n```\n\nQ3. Cooling kahan par hoti hai?\n\nA) Condenser\nB) Evaporator\nC) Plug\nD) Handle\n\n```diff\nB) Evaporator\nExplanation: Andar ki coils heat absorb karti hain ✅\n```\n\nQ4. Common refrigerant kaunsa hai?\n\nA) Petrol\nB) R134a / Amonnia\nC) Water\nD) Milk\n\n```diff\nB) R134a / Amonnia\n```\n\nQ5. 1 Ton of refrigeration (TR) kya hai?\n\nA) Weight of AC\nB) Heat removal capacity\nC) Price\nD) Power consumption\n\n```diff\nB) Heat removal capacity\n```"
      },
      "Air Conditioning": {
        summarize: "## Summary: Air Conditioning 🌬️🆒\n\nBhai, AC sirf thanda karne ke liye nahi hota. AC ka matlab hai: **Temperature + Humidity + Air Quality** sabko control karna.\n\nHuman comfort ke liye approx 24°C aur 50% humidity best maani jaati hai. AC dhool mitti ko filter karta hai aur humein fresh aur thandi hawa deta hai. \n\nMechanical engineering mein isse HVAC (Heating, Ventilation, and Air Conditioning) kehte hain. 🏙️❄️",
        mcq: "## 5 MCQs: Air Conditioning 🎯\n\nQ1. Comfort AC mein temperature approx?\n\nA) 10-15°C\nB) 22-25°C\nC) 0°C\nD) 40°C\n\n```diff\nB) 22-25°C\n```\n\nQ2. Humidity control ka kya matlab?\n\nA) Water removal from air\nB) Air filtration\nC) Noise reduction\nD) Color change\n\n```diff\nA) Water removal from air\nExplanation: Moisture level adjust karna ✅\n```\n\nQ3. AC system mein component jo pressure badhata hai?\n\nA) Fan\nB) Compressor\nC) Filter\nD) Remote\n\n```diff\nB) Compressor\n```\n\nQ4. HVAC standout for?\n\nA) Heating Ventilation and Air Conditioning\nB) High Voltage AC\nC) Home Vacuum Air Cleaner\nD) Hot Valve Air Cooling\n\n```diff\nA) Heating Ventilation and Air Conditioning\n```\n\nQ5. AC windows karke kyu lagate hain?\n\nA) Style\nB) Efficient ventilation/heat exchange\nC) Weight limit\nD) Price\n\n```diff\nB) Efficient ventilation/heat exchange\n```"
      },

      // Unit 3
      "Fluid Properties": {
        summarize: "## Summary: Fluid Properties 🌊📊\n\nBhai, **Fluid Properties** fluid ka basic nature samjhate hain. Matlab koi fluid heavy hai ya light, flow karna easy hai ya tough – ye sab properties decide karti hain.\n\nSabse pehli property hoti hai **Density**. Ye batati hai ki given volume mein kitna mass hai. \n\nDusri important property hai **Viscosity**. Ye fluid ki flow resistance hoti hai. Honey ki viscosity zyada hoti hai, isliye wo dheere flow karta hai 💡.\n\n**Specific Gravity** density ka comparison hota hai water ke saath. Ye hydraulically systems design karne mein kaam aati hai 😎💪.",
        mcq: "## 5 MCQs: Fluid Properties 🎯\n\nQ1. Viscosity kya represent karti hai?\n\nA) Weight\nB) Resistance to flow\nC) Speed\nD) Color\n\n```diff\nB) Resistance to flow\nExplanation: 'Gadapan' fluid ka ✅\n```\n\nQ2. Density of water approx?\n\nA) 100 kg/m³\nB) 500 kg/m³\nC) 1000 kg/m³\nD) 2000 kg/m³\n\n```diff\nC) 1000 kg/m³\n```\n\nQ3. Fluid jo force handle kare stress ke bina?\n\nA) Solid\nB) Liquid/Gas (Fluid)\nC) Crystal\nD) Ice\n\n```diff\nB) Liquid/Gas (Fluid)\n```\n\nQ4. Dynamic viscosity ka unit?\n\nA) Pascal-second\nB) Newton\nC) Meter/Sec\nD) Joule\n\n```diff\nA) Pascal-second (Pa.s)\n```\n\nQ5. Specific gravity unit?\n\nA) kg/m³\nB) N/m²\nC) No unit\nD) Sec\n\n```diff\nC) No unit\nExplanation: Ratio of two densities ✅\n```"
      },
      "Pascal’s Law": {
        summarize: "## Summary: Pascal’s Law ⚙️💧\n\nBhai, **Pascal’s Law** fluid pressure ka ek bahut important rule hai. Ye kehta hai ki jab kisi confined fluid par pressure apply kiya jaata hai, toh wo pressure **har direction mein equally transmit** hota hai.\n\nSimple example le: hydraulic jack. Thoda sa force lagake heavy truck utha lete hain 🚚💪. Ye magic Pascal’s Law ki wajah se hota hai.\n\nIs law ka use hydraulic brakes, lifts, presses aur heavy machinery mein hota hai 😎🔥.",
        mcq: "## 5 MCQs: Pascal’s Law 🎯\n\nQ1. Pascal's law kahan apply hota hai?\n\nA) Flowing water only\nB) Static confined fluid\nC) Air outside\nD) Solid blocks\n\n```diff\nB) Static confined fluid\n```\n\nQ2. Pressure transmission kaisa hota hai?\n\nA) Only downwards\nB) Only upwards\nC) Equally in all directions\nD) In a spiral\n\n```diff\nC) Equally in all directions\n```\n\nQ3. Hydraulic brakes kis par based hain?\n\nA) Bernoulli's\nB) Pascal's Law\nC) Newton's 1st Law\nD) Hooke's Law\n\n```diff\nB) Pascal's Law\n```\n\nQ4. Small piston area (A1) aur large (A2) pe force multiplier?\n\nA) A2/A1\nB) A1/A2\nC) A1+A2\nD) 1\n\n```diff\nA) A2/A1\nExplanation: For same pressure, Force increases with Area ✅\n```\n\nQ5. Pressure ka unit?\n\nA) N\nB) N/m² (Pascal)\nC) J\nD) m/s\n\n```diff\nB) N/m² (Pascal)\n```"
      },
      "Continuity Equation": {
        summarize: "## Summary: Continuity Equation 🔄🌊\n\nBhai, **Continuity Equation** flow ke andar mass conservation ko explain karti hai. Iska matlab hai ki jo fluid pipe ke andar enter karta hai, wahi amount exit bhi karega — na zyada, na kam 😎.\n\nAgar pipe patli ho jaaye, toh fluid speed badh jaati hai. Agar pipe moti ho jaaye, toh speed kam ho jaati hai. Relation Simple hai: **Area × Velocity = Constant** 💡.\n\nNozzles aur water jets isi logic pe kaam karte hain 🧠🔥.",
        mcq: "## 5 MCQs: Continuity Equation 🎯\n\nQ1. Continuity Equation kis law pe based hai?\n\nA) Conservation of Energy\nB) Conservation of Mass\nC) Conservation of Momentum\nD) Law of Gravity\n\n```diff\nB) Conservation of Mass\n```\n\nQ2. Narrow pipe section mein velocity?\n\nA) Decreases\nB) Increases\nC) Constant\nD) Zero\n\n```diff\nB) Increases\nExplanation: Area kam toh speed zyada taaki same mass flow ho ✅\n```\n\nQ3. Incompressible flow ke liye formula?\n\nA) A1V1 = A2V2\nB) P1V1 = P2V2\nC) F = ma\nD) E = mc²\n\n```diff\nA) A1V1 = A2V2\n```\n\nQ4. Streamline flow mein divergence?\n\nA) High\nB) Zero\nC) One\nD) Infinity\n\n```diff\nB) Zero\n```\n\nQ5. Area doubling se velocity kitni hogi?\n\nA) Half\nB) Double\nC) Same\nD) Four times\n\n```diff\nA) Half\n```"
      },
      "Bernoulli’s Equation": {
        summarize: "## Summary: Bernoulli’s Equation ⚡🌊\n\nBhai, **Bernoulli’s Equation** fluid ke andar energy conservation ko explain karti hai. Ye kehti hai ki fluid ke flow mein **pressure energy, kinetic energy aur potential energy ka total constant rehta hai**.\n\nIska matlab jab fluid ki speed badhti hai, toh pressure kam ho jaata hai. Aeroplane wings ka lift, carburetor ka working aur spray bottle ka effect isi principle par based hai ✈️💨.\n\nEnergy transformation ka ye badhiya theorem hai 😎🔥.",
        mcq: "## 5 MCQs: Bernoulli’s Equation 🎯\n\nQ1. Bernoulli's principle kiska conservation hai?\n\nA) Mass\nB) Energy\nC) Momentum\nD) Force\n\n```diff\nB) Energy\n```\n\nQ2. Fluid velocity badhne se pressure?\n\nA) Increases\nB) Decreases\nC) Stays same\nD) Fluctuates\n\n```diff\nB) Decreases\nExplanation: Energy trade-off between pressure and speed ✅\n```\n\nQ3. Aeroplane wings profile kya create karti hai?\n\nA) Weight\nB) Pressure difference (Lift)\nC) Drag increase\nD) Noise\n\n```diff\nB) Pressure difference (Lift)\n```\n\nQ4. Venturimeter kis liye use hota hai?\n\nA) Speed limit\nB) Flow rate measurement\nC) Tank height\nD) Color detection\n\n```diff\nB) Flow rate measurement\nExplanation: Based on Bernoulli's principle ✅\n```\n\nQ5. Equation valid for?\n\nA) Ideal, incompressible, steady flow\nB) Turbulent flow\nC) Viscous oil\nD) Solid motion\n\n```diff\nA) Ideal, incompressible, steady flow\n```"
      },

      // Unit 4
      "Errors and Accuracy": {
        summarize: "## Summary: Errors and Accuracy 📐🎯\n\nBhai, measurement mein perfection kabhi nahi hoti. Jo actual value aur measured value mein difference hota hai, use **Error** kehte hain.\n\n- **Accuracy:** Ye batata hai ki aap True Value ke kitne paas ho 🎯.\n- **Precision:** Ye batata hai ki aap kitne repeatably same result de rahe ho, bhale hi wo galat ho 🧐.\n- **Resolution:** Sabse chhota change jo instrument detect kar sake.\n\nEngineering mein galti ki gunjayish kam karne ke liye ye concepts zaroori hain 😎🔥.",
        mcq: "## 5 MCQs: Errors and Accuracy 🎯\n\nQ1. Accuracy matlab?\n\nA) Consistency\nB) Closeness to true value\nC) Instrument cost\nD) Size of instrument\n\n```diff\nB) Closeness to true value\n```\n\nQ2. Precision matlab?\n\nA) Being right\nB) Repeatability / Consistency\nC) Being fast\nD) Being heavy\n\n```diff\nB) Repeatability / Consistency\n```\n\nQ3. Resolution kya hai?\n\nA) Final decision\nB) Smallest measurable change\nC) Error amount\nD) Calibration\n\n```diff\nB) Smallest measurable change\n```\n\nQ4. Random error ko kaise kam karte hain?\n\nA) Stop measuring\nB) Taking multiple readings and averaging\nC) Buying new instrument only\nD) Changing the room\n\n```diff\nB) Taking multiple readings and averaging\n```\n\nQ5. Systematic error ka reason?\n\nA) Bad weather only\nB) Calibration or instrument fault\nC) Luck\nD) Speed of measurement\n\n```diff\nB) Calibration or instrument fault\n```"
      },
      "Measurement of Parameters": {
        summarize: "## Summary: Measurement of Parameters 🌡️⚖️\n\nBhai, mechanical systems chlane ke liye parameters like Pressure, Force aur Temperature measure karna zaroori hai.\n\n- **Pressure:** Bourdon Tube ya Manometers use hote hain.\n- **Force:** Load cells ya Proving rings kaam aati hain.\n- **Temperature:** Thermocouples, RTDs ya Thermometers use hote hain.\n\nCorrect measurement hi correct automation aur safety ki base hai 😎💡.",
        mcq: "## 5 MCQs: Measurement of Parameters 🎯\n\nQ1. High pressure measure karne ke liye commonly used?\n\nA) Thermometer\nB) Bourdon Tube Gauge\nC) Ruler\nD) Litmus paper\n\n```diff\nB) Bourdon Tube Gauge\n```\n\nQ2. Temperature sensing element in a simple thermometer?\n\nA) Water\nB) Mercury\nC) Oil\nD) Milk\n\n```diff\nB) Mercury\n```\n\nQ3. Force/Load measure karne wala modern device?\n\nA) Scale\nB) Load Cell (Strain gauge based)\nC) Speedometer\nD) Barometer\n\n```diff\nB) Load Cell\n```\n\nQ4. Thermocouple kis principle pe kaam karta hai?\n\nA) Seebeck Effect\nB) Bernoulli Principle\nC) Pascal Law\nD) Hooke's Law\n\n```diff\nA) Seebeck Effect (Temp difference to Voltage)\n```\n\nQ5. Manometer kya measure karta hai?\n\nA) Time\nB) Fluid Pressure\nC) Distance\nD) Color intensity\n\n```diff\nB) Fluid Pressure\n```"
      },
      "Limits, Fits and Tolerance": {
        summarize: "## Summary: Limits, Fits and Tolerance ⚙️📏\n\nBhai, mass production mein har part exact size ka nahi ban sakta. Isliye hum **Tolerance** (limit of variation) dete hain.\n\n- **Limits:** Max aur Min allowed size.\n- **Fits:** Do parts (Hole aur Shaft) jab milte hain, toh wo kitne loose ya tight hain (Clearance, Interference, Transition).\n- **Tolerance:** Upper Limit aur Lower Limit ka difference.\n\nIndustrial assembly lines isi system par based hain taaki parts exchangeable ho saken 😎🔥.",
        mcq: "## 5 MCQs: Limits, Fits and Tolerance 🎯\n\nQ1. Tolerance kya hai?\n\nA) Exact size\nB) Difference between upper and lower limit\nC) Machine speed\nD) Weight\n\n```diff\nB) Difference between upper and lower limit\n```\n\nQ2. Hole shaft se bada hai toh kaunsa fit?\n\nA) Interference fit\nB) Clearance fit\nC) Tight fit\nD) Broken fit\n\n```diff\nB) Clearance fit\n```\n\nQ3. Interchangeability ka fayda?\n\nA) Parts match perfectly without adjustment\nB) Higher cost\nC) Hard to fix\nD) More noise\n\n```diff\nA) Parts match perfectly without adjustment\n```\n\nQ4. Interference fit kahan use hota hai?\n\nA) Sliding door\nB) Tight press fit (bearings)\nC) Loose nuts\nD) Windows\n\n```diff\nB) Tight press fit\n```\n\nQ5. 'Limits' ka main reason?\n\nA) Human error allowance and mass production\nB) Style\nC) To waste material\nD) Speeding up transport\n\n```diff\nA) Human error allowance and mass production\n```"
      },
      "Control System Concepts": {
        summarize: "## Summary: Control Systems 🧠🔄\n\nBhai, Control system system ko intelligent banata hai.\n\n- **Open Loop:** Direct input, koi check nahi. Jaise Bread Toaster ya Normal Fan (ek baar on kiya toh chalta rahega, koi feedback nahi) 🍞.\n- **Closed Loop:** Isme Feedback hota hai. Sensor output check karta hai aur input adjust karta hai. Jaise AC (set temp pe band/on hona) ya Cruise control 🔄.\n\nAutomation ki jaan Closed Loop system hi hai 😎🔥.",
        mcq: "## 5 MCQs: Control System Concepts 🎯\n\nQ1. Feedback kis system mein hota hai?\n\nA) Open Loop\nB) Closed Loop\nC) Both\nD) None\n\n```diff\nB) Closed Loop\n```\n\nQ2. Normal Fan (without sensor) example of?\n\nA) Open Loop\nB) Closed Loop\nC) Fully automated\nD) Biological system\n\n```diff\nA) Open Loop\n```\n\nQ3. Closed Loop system ka alternative name?\n\nA) Forward system\nB) Feedback Control System\nC) Manual system\nD) Noisy system\n\n```diff\nB) Feedback Control System\n```\n\nQ4. Automatic AC system kaisa hai?\n\nA) Open loop\nB) Closed loop\nC) Manual loop\nD) Fixed loop\n\n```diff\nB) Closed loop\nExplanation: Senses room temp and adjusts cooling ✅\n```\n\nQ5. Open loop system ka disadvantage?\n\nA) Complex\nB) Accurate nahi hota deviation hone pe\nC) Costly\nD) Heavy\n\n```diff\nB) Accurate nahi hota deviation hone pe\n```"
      },

      // Unit 5
      "Mechatronics Scope": {
        summarize: "## Summary: Mechatronics Scope 🤖🚀\n\nBhai, **Mechatronics** ka matlab hai mechanical engineering mein software aur electronics ka tadka! 🌶️\n\nIska scope modern robotics, drones, medical devices, aur smart appliances mein bahut bada hai. Ye purani mechanical engineering ko 'intelligent' banata hai taaki machines khud decision le sakein.\n\nMechatronics engineered products fast, reliable aur smart hote hain 😎🔥.",
        mcq: "## 5 MCQs: Mechatronics Scope 🎯\n\nQ1. Mechatronics integration hai?\n\nA) Mech + Electronics + Control + Software\nB) Only Mech\nC) Only software\nD) Construction\n\n```diff\nA) Mech + Electronics + Control + Software\n```\n\nQ2. Smart products ka advantage?\n\nA) High power consumption\nB) Intelligence and reliability\nC) Hard to fix\nD) Very heavy\n\n```diff\nB) Intelligence and reliability\n```\n\nQ3. Mechatronics kahan use nahi hota?\n\nA) Drones\nB) Washing machines\nC) Normal paper book\nD) CNC Machines\n\n```diff\nC) Normal paper book\n```\n\nQ4. Evolution path?\n\nA) Mechanical -> Mechatronics\nB) Electrical -> Wood\nC) Software -> Rocks\nD) Same since 100 years\n\n```diff\nA) Mechanical -> Mechatronics\n```\n\nQ5. Mechatronics system ka primary goal?\n\nA) Automation and optimization\nB) Only coloring\nC) Increasing weight\nD) Manual labor\n\n```diff\nA) Automation and optimization\n```"
      },
      "Sensors and Transducers": {
        summarize: "## Summary: Sensors and Transducers 👀🔌\n\nBhai, ye system ke 'Sensory Organs' hain.\n\n- **Sensor:** Wo device jo physical changes (temp, light, touch) ko detect kare 👀.\n- **Transducer:** Jo ek form of energy (physical) ko doosri form (electrical signal) mein convert kare taaki processor samajh sake 🔌.\n\nProximity sensors, LVDTs, aur IR sensors hi robotics ki aakhon aur haathon ka signals dete hain 😎💡.",
        mcq: "## 5 MCQs: Sensors and Transducers 🎯\n\nQ1. Transducer ka kaam?\n\nA) Store energy\nB) Change energy form\nC) Increase speed\nD) Stop signals\n\n```diff\nB) Change energy form\n```\n\nQ2. LVDT kya measure karta hai?\n\nA) Temperature\nB) Displacement\nC) Light\nD) Sound\n\n```diff\nB) Displacement\n```\n\nQ3. Proximity sensor kya hai?\n\nA) Touching sensor\nB) Non-contact distance sensor\nC) Heat sensor\nD) Weight scale\n\n```diff\nB) Non-contact distance sensor\n```\n\nQ4. Piezoelectric sensor use case?\n\nA) Boiling water\nB) Converting pressure/vibration to electricity\nC) Cooling a fan\nD) Reading books\n\n```diff\nB) Converting pressure/vibration to electricity\n```\n\nQ5. Microphone kya hai?\n\nA) Sensor (sound to electrical)\nB) Heater\nC) Motor\nD) Battery\n\n```diff\nA) Sensor\n```"
      },
      "Actuation Systems": {
        summarize: "## Summary: Actuation Systems 🦾⚙️\n\nBhai, actuators system ke 'Muscles' hain.\n\n- **Mechanical:** Gears, Belts, Cams jo motion dete hain ⚙️.\n- **Hydraulic:** Oil pressure se heavy load uthane ke liye (JCB/Brakes) 🚜.\n- **Pneumatic:** Hawa ke pressure se fast actions ke liye (Factory robotic arms) 💨.\n- **Electrical:** Motors aur Solenoids jo electrical input ko motion mein badalte hain ⚡.\n\nAction tabhi huga jab Actuator chalega! 😎🔥",
        mcq: "## 5 MCQs: Actuation Systems 🎯\n\nQ1. Pneumatic system kya use karta hai?\n\nA) Oil\nB) Water\nC) Compressed Air\nD) Steam\n\n```diff\nC) Compressed Air\n```\n\nQ2. Heavy lifting ke liye best?\n\nA) Mechanical\nB) Hydraulic\nC) Pneumatic\nD) Electrical\n\n```diff\nB) Hydraulic\nExplanation: High force capability of high-pressure oils ✅\n```\n\nQ3. Solenoid kya karta hai?\n\nA) Changes heat to light\nB) Converts electrical impulse to linear motion\nC) Cools the room\nD) Cuts metal\n\n```diff\nB) Converts electrical impulse to linear motion\n```\n\nQ4. Fast and light automation ke liye?\n\nA) Hydraulic\nB) Pneumatic\nC) Manual\nD) Stone based\n\n```diff\nB) Pneumatic\n```\n\nQ5. Gears kaunsa type hai?\n\nA) Electrical actuator\nB) Mechanical actuation system\nC) Sensor\nD) Software\n\n```diff\nB) Mechanical actuation system\n```"
      },
      "Industrial Applications": {
        summarize: "## Summary: Industrial Applications 🏭🤖\n\nBhai, real magic yahan hai! Mechatronics ne industry ko **Industry 4.0** bana diya hai.\n\n- **Robotics:** Automotive assembly mein welding aur painting bots 🦾.\n- **Drones:** Delivery aur surveillance 🚁.\n- **Smart Manufacturing:** Machines jo khud bataati hain ki unhe repair ki zaroorat hai.\n- **Autotronics:** Modern cars mein ABS, Airbags, aur Autopilot sab mechatronics hai.\n\nYe futuristic vision aaj ki reality hai! 😎🔥",
        mcq: "## 5 MCQs: Industrial Applications 🎯\n\nQ1. Industry 4.0 ka core kya hai?\n\nA) Manual labor\nB) Smart automation and IoT\nC) Steam engines\nD) Hand tools\n\n```diff\nB) Smart automation and IoT\n```\n\nQ2. Robot mein mechatronics kaise use hota hai?\n\nA) Sensors for vision\nB) Controllers for logic\nC) Actuators for motion\nD) All of above\n\n```diff\nD) All of above\n```\n\nQ3. CNC machine kya measure of?\n\nA) Manual cutting\nB) Computer controlled automated machining\nC) Drawing only\nD) Wood carving only\n\n```diff\nB) Computer controlled automated machining\n```\n\nQ4. Autotronics relates to?\n\nA) Aircraft\nB) Automobiles electronics/mech\nC) Kitchen apps\nD) Gardening\n\n```diff\nB) Automobiles electronics/mech\n```\n\nQ5. Modern industry mein Mechatronics se kya badhta hai?\n\nA) Waste\nB) Productivity and Quality\nC) Fatigue\nD) Number of manual workers\n\n```diff\nB) Productivity and Quality\n```"
      }
    };

    const replies = [];

    // 3. Populate Replies using precise IDs from the created subject
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
              content: data.mcq
            });
            replies.push({
              topicId: topic._id,
              action: 'Explain simpler',
              content: `## ${topic.title}: Simple Bolu Toh... ✨\n\nBhai, dekh ${topic.title} ka concept ekdum simple hai. \n\n${data.summarize.split('\n\n')[1] || topic.description}\n\nSamajh aaya? Bas yehi main baat hai! 😎💪`
            });
          }
        });
      });
    });

    if (replies.length > 0) {
      await Reply.insertMany(replies);
      console.log(`✅ Successfully seeded ${replies.length} replies!`);
    } else {
      console.error("❌ Critical Error: No topics matched. Check titles.");
    }

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Seeding Error:", error);
  }
};

seedMechanicsFull();
