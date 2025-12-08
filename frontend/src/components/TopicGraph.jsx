import { clsx } from 'clsx';
import { Check, Play, HelpCircle, Sparkles, ChevronRight } from 'lucide-react';

export default function TopicGraph({ topics, onSelectTopic }) {
  
  return (
    <div className="py-10 px-6 max-w-3xl mx-auto">
       <div className="space-y-5">
           {topics.map((topic, index) => {
               const status = topic.status;
               const isCompleted = status === 'completed';
               const hasDoubts = status === 'doubts';

               return (
                   <div 
                       key={topic._id} 
                       onClick={() => onSelectTopic(topic)}
                       className={clsx(
                           "group relative p-6 rounded-2xl border cursor-pointer transition-all duration-200",
                           "hover:shadow-strong hover:-translate-y-0.5",
                           isCompleted && "bg-green-500/5 border-green-500/30 hover:border-green-500/50",
                           hasDoubts && "bg-red-500/5 border-red-500/30 hover:border-red-500/50",
                           !isCompleted && !hasDoubts && "bg-card border-border-soft hover:border-accent/30"
                       )}
                   >
                       <div className="flex items-start gap-4">
                           {/* Status Icon */}
                           <div className={clsx(
                               "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                               isCompleted && "bg-green-500/10 text-green-500",
                               hasDoubts && "bg-red-500/10 text-red-500",
                               !isCompleted && !hasDoubts && "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white"
                           )}>
                               {isCompleted && <Check className="w-6 h-6" />}
                               {hasDoubts && <HelpCircle className="w-6 h-6" />}
                               {!isCompleted && !hasDoubts && <Play className="w-6 h-6 ml-0.5" />}
                           </div>
                           
                           {/* Content */}
                           <div className="flex-1 min-w-0">
                               <div className="flex items-center gap-2 mb-1">
                                   <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                                       Topic {index + 1}
                                   </span>
                                   {isCompleted && (
                                       <span className="text-[10px] font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                                           Completed
                                       </span>
                                   )}
                                   {hasDoubts && (
                                       <span className="text-[10px] font-medium text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                                           Has Doubts
                                       </span>
                                   )}
                               </div>
                               <h3 className="text-lg font-bold text-primary mb-1 group-hover:text-accent transition-colors">
                                   {topic.title}
                               </h3>
                               <p className="text-sm text-secondary line-clamp-2">
                                   {topic.description}
                               </p>
                           </div>

                           {/* Arrow */}
                           <div className="flex items-center self-center">
                               <ChevronRight className="w-5 h-5 text-secondary group-hover:text-accent group-hover:translate-x-1 transition-all" />
                           </div>
                       </div>

                       {/* AI Indicator */}
                       <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="flex items-center gap-1.5 text-accent">
                               <Sparkles className="w-3.5 h-3.5" />
                               <span className="text-[10px] font-medium">Learn with AI</span>
                           </div>
                       </div>
                   </div>
               )
           })}
       </div>
    </div>
  );
}
