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
    // await Subject.deleteMany({ code: "ME103" });
    
    const mechanicsSubject = await Subject.create(
 
        

  );

    console.log("✅ Created Subject ME103 (5 Units)");

    const contentMap =  {
        
    }
    
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
