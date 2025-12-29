import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

const Subject = mongoose.model('Subject', new mongoose.Schema({}, { strict: false }));
const Reply = mongoose.model('Reply', new mongoose.Schema({}, { strict: false }));
const Progress = mongoose.model('Progress', new mongoose.Schema({}, { strict: false }));

const subjectId = '69523590ed85d3771e10efc7';

const subject = await Subject.findById(subjectId);
if (!subject) {
  console.log('Subject not found!');
  await mongoose.disconnect();
  process.exit(1);
}

const topicIds = [];
for (const unit of subject.units || []) {
  for (const chapter of unit.chapters || []) {
    for (const topic of chapter.topics || []) {
      topicIds.push(topic._id);
    }
  }
}

console.log('Found', topicIds.length, 'topics in subject');

const replyResult = await Reply.deleteMany({ topicId: { $in: topicIds } });
console.log('Deleted replies:', replyResult.deletedCount);

const progressResult = await Progress.deleteMany({ subjectId: new mongoose.Types.ObjectId(subjectId) });
console.log('Deleted progress entries:', progressResult.deletedCount);

const subjectResult = await Subject.deleteOne({ _id: subjectId });
console.log('Deleted subject:', subjectResult.deletedCount);

console.log('\n✅ Done! Pandit Deen Dayal Upadhyaya ka saara data delete ho gaya');

await mongoose.disconnect();
