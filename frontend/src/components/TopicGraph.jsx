import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Check, Lock, Play, HelpCircle } from 'lucide-react';

export default function TopicGraph({ topics, onSelectTopic }) {
  
  return (
    <div className="relative py-10 px-4 max-w-2xl mx-auto">
       <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200 rounded-full" />

       <div className="space-y-12">
           {topics.map((topic, index) => {
               // Logic: If status is 'not_started', it's locked mainly if previous wasn't done?
               // For now let's just show status as is.
               // We can unlock everything for beta.
               const isLocked = false; 
               const status = topic.status; // 'not_started', 'in_progress', 'completed', 'doubts'

               return (
                   <div key={topic._id} className="relative flex items-center group">
                       <button 
                            onClick={() => onSelectTopic(topic)}
                            className={clsx(
                                "z-10 w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all bg-white shadow-soft",
                                status === 'completed' && "border-green-500 text-green-500",
                                status === 'doubts' && "border-red-400 text-red-500",
                                (status === 'in_progress' || status === 'not_started') && "border-accent text-accent",
                                // Simulate active
                            )}
                       >
                            {status === 'completed' && <Check className="w-6 h-6" />}
                            {status === 'doubts' && <HelpCircle className="w-6 h-6" />}
                            {(status === 'in_progress' || status === 'not_started') && <Play className="w-6 h-6 ml-1" />}
                       </button>
                       
                       <div className={clsx(
                           "h-1 w-12 transition-colors",
                           status === 'completed' ? 'bg-green-500/20' : 'bg-gray-200'
                       )} />

                       <motion.div 
                            whileHover={{ scale: 1.02 }}
                            onClick={() => onSelectTopic(topic)}
                            className={clsx(
                                "flex-1 rounded-[1.5rem] p-5 border transition-all cursor-pointer",
                                status === 'doubts' ? "bg-red-50 border-red-200" : "bg-white border-border-soft shadow-soft",
                            )}
                       >
                            <h3 className="text-lg font-bold text-primary mb-1">{topic.title}</h3>
                            <p className="text-sm text-secondary">{topic.description}</p>
                       </motion.div>
                   </div>
               )
           })}
       </div>
    </div>
  );
}
