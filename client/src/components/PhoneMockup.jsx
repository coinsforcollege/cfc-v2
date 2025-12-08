import { motion } from "framer-motion";
import { Check, MessageSquare, Wallet, Shield } from "lucide-react";

export const PhoneMockup = ({ variant = "default", frameStyle = "glass" }) => {
  
  const frameClasses = {
    dark: "border-gray-800 bg-gray-800 shadow-xl",
    glass: "border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl ring-1 ring-white/30",
    minimal: "border-transparent bg-transparent shadow-2xl",
  };

  return (
    <div className={`relative mx-auto border-[14px] rounded-[2.5rem] h-[600px] w-[300px] transition-all duration-500 ${frameClasses[frameStyle]}`}>
      {frameStyle !== "minimal" && (
         <div className="w-[148px] h-[18px] bg-black/20 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-20 backdrop-blur-md"></div>
      )}
      <div className="h-[46px] w-[3px] bg-slate-400/50 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
      <div className="h-[46px] w-[3px] bg-slate-400/50 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
      <div className="h-[64px] w-[3px] bg-slate-400/50 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
      
      <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white relative">
        {/* Content Container */}
        <div className="absolute inset-0 bg-slate-50 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="h-14 bg-white border-b border-b-slate-100 flex items-center justify-between px-4 pt-4 shrink-0 z-10">
                <div className="text-xs font-bold text-slate-900">9:41</div>
                <div className="flex gap-1.5">
                    <div className="w-4 h-2.5 bg-slate-900 rounded-[1px]" />
                    <div className="w-3 h-2.5 bg-slate-900 rounded-[1px]" />
                    <div className="w-4 h-2.5 border border-slate-900 rounded-[1px]" />
                </div>
            </div>

            {/* Body Content based on Variant */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
                
                {variant === "vault" && (
                    <div className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <div className="font-bold text-green-900">Visa Ready</div>
                            </div>
                            <div className="h-2 bg-green-200 rounded-full overflow-hidden">
                                <div className="h-full w-[85%] bg-green-500" />
                            </div>
                            <div className="text-xs text-green-700 mt-2 font-medium">85% Complete</div>
                        </div>

                        <div className="space-y-2">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Documents</div>
                            {["Passport", "Bank Statements", "Tax Returns (2023)", "Tax Returns (2024)", "Academic Transcripts"].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                                    <span className="text-sm font-medium text-slate-700">{item}</span>
                                    <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                 {variant === "graph" && (
                    <div className="space-y-6">
                         <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="font-bold text-slate-900">German Proficiency</div>
                                <div className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">B2 Level</div>
                            </div>
                            {/* Fixed Height Container for Graph */}
                            <div className="h-40 flex items-end justify-between gap-2 px-2 pb-2">
                                {[40, 55, 45, 60, 75, 85].map((h, i) => (
                                    <div key={i} className="w-full bg-slate-100 rounded-t-sm relative group h-full flex items-end">
                                        <motion.div 
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${h}%` }}
                                            transition={{ duration: 0.8, delay: i * 0.1 }}
                                            className="w-full bg-purple-600 rounded-t-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                             <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
                                <div className="text-2xl font-bold text-slate-900 mb-1">1,200</div>
                                <div className="text-xs text-slate-500">Vocab Words</div>
                             </div>
                             <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
                                <div className="text-2xl font-bold text-slate-900 mb-1">45h</div>
                                <div className="text-xs text-slate-500">Speaking Practice</div>
                             </div>
                        </div>
                    </div>
                )}

            </div>
          
          {/* Bottom Nav */}
          <div className="mt-auto h-16 bg-white border-t border-slate-100 flex items-center justify-around px-6">
             <div className="w-6 h-6 bg-purple-600 rounded-full opacity-20" />
             <div className="w-6 h-6 bg-slate-200 rounded-full" />
             <div className="w-6 h-6 bg-slate-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
