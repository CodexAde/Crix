import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Subject } from '../models/syllabus.model.js';
import { Reply } from '../models/reply.model.js';

dotenv.config({ path: "./backend/.env" });

const seedDeenDayalFull = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // 1. Clear existing data
        // await Subject.deleteMany({ name: "Pt. Deen Dayal Upadhyaya" });
        // We'll delete replies after creating the subject to ensure we match the new IDs
        // console.log("Cleared existing Pt. Deen Dayal Upadhyaya Subject");

        // 2. Define Pt. Deen Dayal Upadhyaya Subject
        const deenDayalSubject = await Subject.create({
            name: "Pt. Deen Dayal Upadhyaya",
            code: "KNC-101",
            branch: "All",
            year: 1,
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Deendayal_Upadhyaya.jpg/220px-Deendayal_Upadhyaya.jpg",
            units: [
                {
                    unitNumber: 1,
                    title: "Introduction to Pt. Deen Dayal Upadhyaya",
                    chapters: [
                        {
                            title: "Life and Time",
                            topics: [
                                { title: "Early Life and Education", description: "Birth, childhood, and educational journey of Pt. Deen Dayal Upadhyaya." },
                                { title: "Social and Political Influence", description: "The era and the forces that shaped his ideology." }
                            ]
                        }
                    ]
                },
                {
                    unitNumber: 2,
                    title: "Integral Humanism (Ekatma Manav-Vaad)",
                    chapters: [
                        {
                            title: "Philosophy of Integral Humanism",
                            topics: [
                                { title: "Concept of Body, Mind, Intellect and Soul", description: "The four-fold human existence." },
                                { title: "Integralism vs Individualism/Socialism", description: "How Integral Humanism differs from Western ideologies." }
                            ]
                        }
                    ]
                },
                {
                    unitNumber: 3,
                    title: "Economy and Society",
                    chapters: [
                        {
                            title: "Economic Thoughts",
                            topics: [
                                { title: "Antyodaya", description: "Welfare of the last person in the line." },
                                { title: "Decentralized Economy", description: "Local production for local needs." }
                            ]
                        }
                    ]
                },
                {
                    unitNumber: 4,
                    title: "Political Thought",
                    chapters: [
                        {
                            title: "Nationalism and Democracy",
                            topics: [
                                { title: "Chiti and Virat", description: "The soul and life-force of a nation." },
                                { title: "Dharma Rajya", description: "The concept of an ideal state under Dharma." }
                            ]
                        }
                    ]
                }
            ]
        });

        console.log("Created Pt. Deen Dayal Upadhyaya Subject");

        // Clear all replies to avoid old ID conflicts
        await Reply.deleteMany({});
        console.log("Cleared all existing Replies");

        const replies = [];

        // Mapping Content for each topic
        const contentMap = {
            "Early Life and Education": {
                summarize: "## Summary: Early Life and Education 📚\n\nBhai, Pt. Deen Dayal Upadhyaya ji ka janam 25 September 1916 ko Dhanya gaon (Mathura) mein hua. Bachpan mein hi unhone apne parents ko kho diya tha, isliye life mein struggle bhaut zyada raha. 🕰️\n\n**Academic Journey:**\n- Wo hamesha se ek brilliant student rahe. ✨\n- Unhone Pilani aur Kanpur jaise shehron se apni higher education complete ki.\n- **Great Sacrifice:** Unhone PCS exam clear kiya tha par society ki seva ke liye sarkari naukri join nahi ki. 💪\n\nUnka jeevan discipline aur selfless service ki ek sachi misaal hai. Samajh aaya bhai? 😎",
                mcq: "## 5 MCQs: Early Life and Education 🎯\n\nQ1. Pt. Deen Dayal Upadhyaya ka janm kab hua?\nA) 1914\nB) 1916\nC) 1918\nD) 1920\n\n```diff\nB) 1916\nExplanation: He was born on September 25, 1916. ✅\n```\n\nQ2. Unka janm sthal kaunsa gaon tha?\nA) Kanpur\nB) Dhanya (Nagla Chandrabhan)\nC) Mathura City\nD) Delhi\n\n```diff\nB) Dhanya\nExplanation: He was born in the village of Dhanya, near Mathura. ✅\n```\n\nQ3. Unhone Kanpur mein kis college se padhai ki?\nA) IIT Kanpur\nB) SD College\n) Medical College\nD) Law College\n\n```diff\nB) Sanatan Dharma College (SD College)\nExplanation: He completed his graduation from this college. ✅\n```\n\nQ4. Unhone kaunsa competitive exam clear kiya tha?\nA) IAS\nB) PCS\nC) NDA\nD) Banking\n\n```diff\nB) PCS\nExplanation: He cleared the Provincial Civil Services exam but didn't join. ✅\n```\n\nQ5. Unka bachpan kaisa raha?\nA) Luxurious\nB) Full of struggle and orphaned early\nC) Abroad\nD) In a palace\n\n```diff\nB) Full of struggle\nExplanation: Losing his parents early made his childhood very challenging. ✅\n```"
            },
            "Social and Political Influence": {
                summarize: "## Summary: Social & Political Influence 🌍\n\nBhai, Deen Dayal ji par sabse bada influence RSS (Rashtriya Swayamsevak Sangh) aur unke mentors ka tha. Unhone British rule aur Western ideologies se India ko bacha ke Bharatiya sanskriti par aadharit vikas ki soch rakhi. 🇮🇳\n\n**Key Points:**\n- **RSS Influence:** 1937 mein RSS join kiya aur Dr. Hedgewar ke vicharon se prabhavit huye.\n- **Political Role:** Bharatiya Jana Sangh ke general secretary bane (1951-1967).\n- **Vision:** Wo chahte the ki India ka development western blind imitation se nahi balki apni roots se ho. 🏛️",
                mcq: "## 5 MCQs: Social & Political Influence 🎯\n\nQ1. Deen Dayal ji ne RSS kab join kiya?\nA) 1930\nB) 1937\nC) 1947\nD) 1951\n\n```diff\nB) 1937\nExplanation: He joined RSS while studying in Kanpur. ✅\n```\n\nQ2. Wo kis party ke founding member aur General Secretary the?\nA) Congress\nB) Bharatiya Jana Sangh\nC) Communist Party\nD) Swatantra Party\n\n```diff\nB) Bharatiya Jana Sangh\nExplanation: He served as GS for 15 years. ✅\n```\n\nQ3. Unke vicharon ka main source kya tha?\nA) Western Capitalism\nB) Bharatiya Culture & Values\nC) Soviet Socialism\nD) Colonial Laws\n\n```diff\nB) Bharatiya Culture & Values\nExplanation: He believed in an indigenous model of development. ✅\n```\n\nQ4. Who was the founder of Bharatiya Jana Sangh alongside him?\nA) Nehru\nB) Dr. Syama Prasad Mookerjee\nC) Sardar Patel\nD) Gandhi ji\n\n```diff\nB) Dr. Syama Prasad Mookerjee\nExplanation: They together laid the foundation of the party. ✅\n```\n\nQ5. He advocated for a type of Nationalism that was:\nA) Aggressive\nB) Cultural and Value-based\nC) Expansionist\nD) Religious only\n\n```diff\nB) Cultural and Value-based\nExplanation: His nationalism was rooted in the nation's soul (Chiti). ✅\n```"
            },
            "Concept of Body, Mind, Intellect and Soul": {
                summarize: "## Summary: Body, Mind, Intellect and Soul 🧘‍♂️🧠\n\nBhai, Deen Dayal ji ne kaha ki insaan sirf ek 'Body' nahi hai. Manav ke char pehlu (layers) hote hain jinhe ignore nahi kiya ja sakta: ⚖️\n\n1. **Sharir (Body):** Physical needs (Roti, Kapda, Makaan).\n2. **Manas (Mind):** Emotions aur feelings.\n3. **Buddhi (Intellect):** Sahi-galat ki samajh (Reasoning).\n4. **Atman (Soul):** Spiritual connection aur santushti. ✨\n\n**True Progress** wahi hai jisme ye charo balanced hon. West siraf Body aur Mind pe focus karta hai, isliye wahan happiness adhuri hai. 😎",
                mcq: "## 5 MCQs: Body, Mind, Intellect & Soul 🎯\n\nQ1. Manav ke kitne levels ya layers hote hain?\nA) 2\nB) 3\nC) 4\nD) 5\n\n```diff\nC) 4\nExplanation: Sharira, Manas, Buddhi, and Atman. ✅\n```\n\nQ2. Decision making aur reasoning kis layer ka part hai?\nA) Body\nB) Mind\nC) Intellect (Buddhi)\nD) Soul\n\n```diff\nC) Intellect (Buddhi)\nExplanation: Buddhi handles logic and discernment. ✅\n```\n\nQ3. 'Atman' ka relation kis se hai?\nA) Gym\nB) School\nC) Spiritual guidance/Inner self\nD) Food\n\n```diff\nC) Spiritual guidance/Inner self\nExplanation: Atman is the source of moral values. ✅\n```\n\nQ4. Balanced development kiss cheez ki zaroorat hai?\nA) Money only\nB) Harmony of all 4 aspects\nC) Only Body fitness\nD) Only Mind reading\n\n```diff\nB) Harmony of all 4 aspects\nExplanation: Neglecting any one leads to unhappiness. ✅\n```\n\nQ5. Western ideologies ko wo kyun criticize karte the?\nA) Too fast\nB) Too materialistic & fragmented focus\nC) Too ancient\nD) Too loud\n\n```diff\nB) Too materialistic & fragmented focus\nExplanation: They ignore the Soul (Atman). ✅\n```"
            },
            "Integralism vs Individualism/Socialism": {
                summarize: "## Summary: Integralism vs Individualism/Socialism ⚔️\n\nBhai, simple comparison hai: 🧐\n\n- **Individualism (Capitalism):** Sirf 'Me' (Vyakti) pe focus karta hai. Isme log selfish ho jate hain.\n- **Socialism:** Sirf 'State' (Samaj) pe focus karta hai. Isme insaan apni identity kho deta hai.\n- **Integralism:** Kahta hai ki Vyakti aur Samaj ek organic whole hain. 🔄\n\nJaise ek ped (tree) aur uske patte (leaves) ek doosre ke bina adhure hain, waise hi Vyakti aur Samaj ek doosre ko complete karte hain. Cooperation hi key hai! 🤝🔥",
                mcq: "## 5 MCQs: Integralism vs Others 🎯\n\nQ1. Individualism kis cheez ko priority deta hai?\nA) The Nation\nB) The Individual self\nC) The Environment\nD) The State\n\n```diff\nB) The Individual self\nExplanation: It focuses on personal profit and rights above all. ✅\n```\n\nQ2. Socialism mein individual ko kya mana jata hai?\nA) King\nB) Part of a machine (subordinate to state)\nC) God\nD) Free spirit\n\n```diff\nB) Part of a machine\nExplanation: Individual freedom is often suppressed by the state. ✅\n```\n\nQ3. Integral Humanism vyakti aur samaj ko kaisa dekhta hai?\nA) Dushman (Enemies)\nB) Alag-alag (Disconnected)\nC) Complementary and Integral (Sanhit)\nD) Equal to machines\n\n```diff\nC) Complementary and Integral\nExplanation: They are layers of the same organic entity. ✅\n```\n\nQ4. Integralism ka source kya hai?\nA) American Law\nB) Bharatiya Darshan (Indian Philosophy)\nC) Communist Manifesto\nD) French Revolution\n\n```diff\nB) Bharatiya Darshan\nExplanation: It's rooted in Indian culture and harmony. ✅\n```\n\nQ5. Sabka vikas (Progress for all) kis ideology ka aim hai?\nA) Individualism\nB) Integralism\nC) Capitalism only\nD) Anarchy\n\n```diff\nB) Integralism\nExplanation: It seeks harmony and progress for every entity in the chain. ✅\n```"
            },
            "Antyodaya": {
                summarize: "## Summary: Antyodaya (Rise of the Last) 🪜\n\nBhai, Antyodaya ka clear message hai: **'Sabse peeche khade vyakti ka uday'**. ⏫\n\nDeen Dayal ji ka maanna tha ki jab tak line mein khada sabse gareeb insaan develop nahi hota, tab tak desh ki pragati bekaar hai. 📉\n\n- **Principle:** Niche se upar (Bottom-up) progress.\n- **Service:** Gareeb ki seva hi Bhagwan ki seva (Daridra Narayan). 👨‍🌾\n\nYehi unka economic mantra tha. ✨",
                mcq: "## 5 MCQs: Antyodaya 🎯\n\nQ1. 'Antyodaya' word ka meaning kya hai?\nA) End of the world\nB) Rise of the Last person\nC) Rise of the Leader\nD) Rise of the Sun\n\n```diff\nB) Rise of the Last person\nExplanation: Focusing on the most marginalized. ✅\n```\n\nQ2. It follows which development model?\nA) Top-Down\n) Bottom-Up\nC) Random\nD) City-only\n\n```diff\nB) Bottom-Up\nExplanation: Prosperity should start from the grassroots. ✅\n```\n\n**Q3. Poor person is referred to as...?**\nA) Burden\nB) Target\nC) Daridra Narayan\nD) Client\n\n```diff\nC) Daridra Narayan\nExplanation: Serving the poor is serving the Divine. ✅\n```\n\n**Q4. Which modern Indian schemes are inspired by this?**\nA) International trips\nB) Antyodaya Anna Yojana\nC) Stock Market apps\nD) Luxury housing\n\n```diff\nB) Antyodaya Anna Yojana\nExplanation: Schemes for the poorest of the poor. ✅\n```\n\n**Q5. Development measure according to him is:**\nA) Total GDP\nB) Condition of the last person\nC) Number of malls\nD) Foreign Exchange\n\n```diff\nB) Condition of the last person\nExplanation: The real benchmark of success. ✅\n```"
            },
            "Decentralized Economy": {
                summarize: "## Summary: Decentralized Economy 🚜🏘️\n\nBhai, unka idea tha ki power aur production ek hi jagah (shehar) mein jama nahi hona chahiye. 🏙️❌\n\n**Main Vision:**\n- **Village Centric:** Gaon mein hi employment aur industries hon taaki log shehar na bhaagein.\n- **Human over Machine:** Machine insaan ka kaam asaan kare, use berozgaar na kare. 🤖🤝\n- **Local Production:** Local needs ke liye local production ho. 💰👐",
                mcq: "## 5 MCQs: Decentralized Economy 🎯\n\nQ1. Decentralization prevents:\nA) Production\nB) Concentration of wealth/power\nC) Trade\n) Progress\n\n```diff\nB) Concentration of wealth/power\nExplanation: It ensures mass participation in economy. ✅\n```\n\nQ2. Small scale industries allow for:\nA) More pollution\nB) Mass employment at local level\nC) Only cities to grow\nD) Less innovation\n\n```diff\nB) Mass employment at local level\nExplanation: It creates jobs where people live. ✅\n```\n\nQ3. What was his view on Large Machines?\nA) Ban them\nB) Use them where necessary but don't let them replace humans blindly\nC) Use them everywhere to replace people\nD) Only for foreign trade\n\n```diff\nB) Moderate use\nExplanation: He balanced technology with human labor. ✅\n```\n\nQ4. Swavalamban means:\nA) Self-reliance\nB) Debt based growth\nC) Foreign Aid\nD) Dependence\n\n```diff\nA) Self-reliance\nExplanation: Making the local economy independent. ✅\n```\n\nQ5. Ideal economic unit for him was:\nA) The Planet\nB) The Village/Local cluster\nC) The Corporate House\nD) The Stock Exchange\n\n```diff\nB) The Village/Local cluster\nExplanation: Grassroots economic units. ✅\n```"
            },
            "Chiti and Virat": {
                summarize: "## Summary: Chiti and Virat 🇮🇳🕉️\n\nBhai, ye do concepts desh ki aatma ko samjhne ke liye hain: ⚡\n\n1. **Chiti (National Soul):** Har desh ka apna ek fundamental nature hota hai (Soul). India ki Chiti Dharma aur Spirituality hai. 🧘‍♂️\n2. **Virat (Manifested Power):** Wo energy jo Chiti ko protect aur implement karti hai. Jaise ek body ko chlane wala vigor. 💪\n\nJab hum apni Chiti (Soul) ko bhool ke West ko copy karte hain, tabhi desh kamzor hota hai. 🇮🇳✨",
                mcq: "## 5 MCQs: Chiti and Virat 🎯\n\nQ1. 'Chiti' represents a nation's:\nA) Money\nB) Soul/Innate Nature\nC) Population\nD) Map\n\n```diff\nB) Soul/Innate Nature\nExplanation: It's the core identity of a nation. ✅\n```\n\nQ2. 'Virat' is the nation's:\nA) Name\nB) Awakening power/Vitality\nC) Capital city\nD) Constitution paper\n\n```diff\nB) Awakening power/Vitality\nExplanation: It is the energy generated by the harmony of society. ✅\n```\n\nQ3. According to him, what happens if Chiti is ignored?\nA) Nation grows faster\nB) Nation loses its character and perishes\nC) No change\nD) More money comes\n\n```diff\nB) Nation loses its character and perishes\nExplanation: National integrity depends on Chiti. ✅\n```\n\nQ4. India's Chiti is primarily:\nA) Consumerist\nB) Dharma and Culture based\nC) Military based\nD) Science-less\n\n```diff\nB) Dharma and Culture based\nExplanation: Our identity is spiritual. ✅\n```\n\nQ5. Relationship between individual and Chiti:\nA) Individual is a part of the national soul\nB) No relation\nC) Individual is above Chiti\nD) Chiti is a myth\n\n```diff\nA) Integral part\nExplanation: National consciousness flows through individuals. ✅\n```"
            },
            "Dharma Rajya": {
                summarize: "## Summary: Dharma Rajya (Ideal State) ⚖️🚩\n\nBhai, log confusion mein rehte hain, Dharma Rajya koi 'Theocracy' nahi hai. ❌\n\n- **Dharma = Moral Law:** Rajya (State) se upar Dharma hota hai. Raja bhi niyam se badha hota hai. 📜\n- **Justice:** Sabko barabar justice mile. Minority-Majority ka bhed-bhaav khatam ho. 🤝\n- **Purpose:** State ka kaam hai insaan ko 4 purusharth (Dharma, Artha, Kama, Moksha) pane mein help karna. ✨\n\nYe ek ideal state hai jahan 'Law of Nature' rules! 😎",
                mcq: "## 5 MCQs: Dharma Rajya 🎯\n\nQ1. Is Dharma Rajya a religious state?\nA) Yes, for one religion only\nB) No, it's a state based on universal ethics/justice\nC) Yes, run by priests\nD) It means No Law\n\n```diff\nB) No\nExplanation: It refers to moral governance. ✅\n```\n\nQ2. In Dharma Rajya, the Ruler is:\nA) Absolute Dictator\nB) Servant of Dharma\nC) Above the Law\nD) Random person\n\n```diff\nB) Servant of Dharma\nExplanation: Even the ruler must follow ethical duties. ✅\n```\n\nQ3. What determines the rules of society?\nA) Majority's whim\nB) Universal Moral Laws (Dharma)\nC) Powerful people\nD) Foreign countries\n\n```diff\nB) Universal Moral Laws (Dharma)\nExplanation: Dharma is the ultimate sovereign. ✅\n```\n\nQ4. Fundamental duty of the State:\nA) Only Tax collection\nB) Ensuring ethical growth and protection of citizens\nC) Creating wars\nD) Building malls\n\n```diff\nB) Safe and ethical environment\nExplanation: To help man attain prosperity and peace. ✅\n```\n\nQ5. Concept of secularism in Dharma Rajya:\nA) Equal respect for all paths (Sarva Dharma Sambhava)\nB) Hate for all religions\nC) Only one religion allowed\nD) No religion allowed\n\n```diff\nA) Equal respect\nExplanation: Dharma includes ethical values common to all. ✅\n```"
            }
        };

        // 3. Populate Replies using precise IDs from the created subject
        deenDayalSubject.units.forEach(unit => {
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
            console.log(`Successfully seeded ${replies.length} replies!`);
        } else {
            console.error("Critical Error: No topics matched. Check titles.");
        }

        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error("Seeding Error:", error);
    }
};

seedDeenDayalFull();
