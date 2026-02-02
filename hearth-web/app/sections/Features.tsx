"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { Calendar, HeartHandshake, History, Smartphone, Flame, MessageCircle, Heart, Star } from "lucide-react";
import { Creature } from "@/app/components/ui/Creature";

const features = [
    {
        id: "streaks",
        title: "Daily Streaks",
        icon: <Flame className="w-5 h-5" />,
        color: "bg-coral",
        gradient: "from-coral to-orange-400",
        description: "Build a habit of showing up. Seeing your streak grow becomes a shared point of pride only you two understand.",
        visual: <StreaksVisual />
    },
    {
        id: "decisions",
        title: "Daily Decisions",
        icon: <HeartHandshake className="w-5 h-5" />,
        color: "bg-mint",
        gradient: "from-mint to-teal-500",
        description: "Meaningful questions that spark conversation. Discover new layers of your partner every single day.",
        visual: <DecisionsVisual />
    },
    {
        id: "timeline",
        title: "Memory Timeline",
        icon: <History className="w-5 h-5" />,
        color: "bg-lavender",
        gradient: "from-lavender to-purple-500",
        description: "Look back on your journey. See how your companion grew alongside your relationship milestones.",
        visual: <TimelineVisual />
    },
    {
        id: "widgets",
        title: "Love Widgets",
        icon: <Smartphone className="w-5 h-5" />,
        color: "bg-blue-500",
        gradient: "from-blue-500 to-cyan-500",
        description: "Keep your connection visible. See your companion and streak status right from your home screen.",
        visual: <WidgetsVisual />
    }
];

export function Features() {
    const [activeTab, setActiveTab] = useState(features[0].id);
    const activeFeature = features.find(f => f.id === activeTab) || features[0];

    return (
        <section className="py-32 px-6 bg-[#FCF8F5] relative overflow-hidden" id="features">
            {/* Background Decoration - Stronger gradients */}
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-peach/30 rounded-full blur-[80px] -z-10 mix-blend-multiply" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-lavender/30 rounded-full blur-[80px] -z-10 mix-blend-multiply" />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl lg:text-5xl font-outfit font-bold text-charcoal mb-6">More Than Just an App</h2>
                    <p className="text-lg lg:text-xl text-charcoal/70 font-dm-sans max-w-2xl mx-auto font-medium">
                        OurHaven is built to fit seamlessly into your life, turning small moments into lasting memories.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
                    {/* Navigation (Left Side) */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                        {features.map((feature) => {
                            const isActive = activeTab === feature.id;
                            return (
                                <button
                                    key={feature.id}
                                    onClick={() => setActiveTab(feature.id)}
                                    className={cn(
                                        "group flex items-start gap-5 p-6 rounded-[2rem] text-left transition-all duration-300 border-2 relative overflow-hidden",
                                        isActive
                                            ? `bg-white border-${feature.color.replace("bg-", "")}/20 shadow-xl shadow-black/5 scale-105 z-10`
                                            : "bg-white/40 border-transparent hover:bg-white/80 hover:scale-[1.02]"
                                    )}
                                >
                                    {/* Active Indicator Background */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-bg"
                                            className={cn("absolute inset-0 opacity-[0.08] bg-gradient-to-r", feature.gradient)}
                                        />
                                    )}

                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm text-white",
                                        isActive
                                            ? `bg-gradient-to-br ${feature.gradient} shadow-${feature.color.replace("bg-", "")}/30`
                                            : "bg-charcoal/5 text-charcoal/40 group-hover:bg-charcoal/10"
                                    )}>
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className={cn(
                                            "text-xl font-outfit font-bold mb-2 transition-colors",
                                            isActive ? "text-charcoal" : "text-charcoal/60"
                                        )}>
                                            {feature.title}
                                        </h3>
                                        <p className={cn(
                                            "text-sm font-dm-sans leading-relaxed transition-colors",
                                            isActive ? "text-charcoal/80" : "text-charcoal/50"
                                        )}>
                                            {feature.description}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Visualization (Right Side - Phone Mockup) */}
                    <div className="lg:col-span-7 relative flex items-center justify-center lg:justify-end">

                        {/* Distinct Background Glow behind Phone */}
                        <div className={cn(
                            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr opacity-20 blur-[60px] rounded-full transition-colors duration-500",
                            activeFeature.gradient
                        )} />

                        <div className="relative w-[340px] aspect-[9/19] bg-charcoal rounded-[3.5rem] p-3 shadow-2xl ring-8 ring-charcoal/10 transform transition-transform duration-500 hover:scale-[1.01] z-10 drop-shadow-2xl">
                            {/* Phone Notch/Island */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-8 w-32 bg-black rounded-b-2xl z-50 flex items-center justify-center gap-2 pointer-events-none">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                <div className="w-16 h-1.5 rounded-full bg-white/10" />
                            </div>

                            {/* Screen Content */}
                            <div className="w-full h-full bg-white rounded-[2.8rem] overflow-hidden relative border-[3px] border-black">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-full h-full"
                                    >
                                        {activeFeature.visual}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Status Bar Overlay */}
                                <div className="absolute top-3.5 left-7 text-[10px] font-bold text-charcoal/80 z-20 mix-blend-darken">9:41</div>
                                <div className="absolute top-4 right-7 flex gap-1 z-20 mix-blend-darken">
                                    <div className="w-3.5 h-3.5 rounded-full border border-charcoal/40" />
                                    <div className="w-3.5 h-3.5 rounded-full bg-charcoal/80" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

// --- Visual Components with BOOSTED COLORS ---

function StreaksVisual() {
    return (
        <div className="w-full h-full bg-[#FFF5F0] flex flex-col relative overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10">
                <div className="mb-3 uppercase tracking-widest text-[10px] font-extrabold text-coral mt-8">You're on fire!</div>
                <div className="text-6xl font-outfit font-bold text-coral mb-1 tracking-tight">42</div>
                <div className="text-charcoal/60 font-dm-sans font-bold text-sm mb-10">Day Streak</div>

                <div className="relative w-48 h-48 flex items-center justify-center mb-10">
                    <div className="absolute inset-0 bg-coral/10 rounded-full animate-pulse" />
                    <div className="absolute inset-6 bg-coral/20 rounded-full animate-pulse delay-100" />
                    <div className="bg-gradient-to-br from-coral to-red-500 w-32 h-32 rounded-full flex items-center justify-center shadow-xl shadow-coral/40 ring-4 ring-white z-10">
                        <Flame className="w-16 h-16 text-white fill-white drop-shadow-md" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-3xl shadow-lg border border-coral/10 w-full max-w-[280px]">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-charcoal/80">This Week</span>
                        <span className="text-[9px] font-bold text-coral bg-coral/10 px-2 py-1 rounded-full">Perfect!</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                            <div key={i} className="flex flex-col items-center gap-1.5">
                                <div className={cn(
                                    "w-full aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold shadow-sm transition-transform hover:scale-105",
                                    i < 5 ? "bg-gradient-to-b from-coral to-orange-500 text-white" : "bg-gray-100 text-gray-300"
                                )}>
                                    {i < 5 && <Flame className="w-3 h-3 fill-white" />}
                                </div>
                                <span className="text-[8px] text-charcoal/60 font-bold">{day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function DecisionsVisual() {
    return (
        <div className="w-full h-full bg-[#E0F7FA] flex flex-col relative">
            <div className="p-6 pt-16 pb-6 bg-gradient-to-b from-white to-[#E0F7FA]/0">
                <h4 className="text-center text-teal-700/80 font-bold text-xs uppercase tracking-wider mb-2">Daily Connection</h4>
                <p className="text-center text-teal-900 font-outfit font-bold text-lg leading-tight">Watering your relationship garden 🌱</p>
            </div>

            <div className="flex-1 px-5 space-y-6 overflow-hidden relative">
                {/* Question Card */}
                <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-teal-100/50 border border-teal-100/50 text-center relative overflow-hidden group hover:scale-[1.01] transition-transform">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-teal-400" />
                    <p className="text-lg font-dm-sans font-bold text-charcoal leading-relaxed">
                        "What's one small adventure we could go on this weekend?"
                    </p>
                </div>

                {/* Partner Answer */}
                <div className="flex gap-3 items-end">
                    <div className="w-10 h-10 rounded-full bg-peach flex items-center justify-center text-sm font-bold text-white border-2 border-white shadow-md">P</div>
                    <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm text-sm font-medium text-charcoal/80 border border-charcoal/5 leading-relaxed max-w-[80%]">
                        We should finally try that pottery class downtown! 🏺
                    </div>
                </div>

                {/* User Answer */}
                <div className="flex gap-3 items-end justify-end">
                    <div className="bg-teal-500 text-white p-4 rounded-2xl rounded-br-none shadow-lg shadow-teal-500/20 text-sm font-medium leading-relaxed max-w-[80%]">
                        Omg yes! I was just thinking about that. Let's book it.
                    </div>
                    <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center text-sm font-bold text-white border-2 border-white shadow-md">Me</div>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-teal-100">
                    <Heart className="w-4 h-4 text-coral fill-coral animate-bounce" />
                    <span className="text-xs font-bold text-charcoal tracking-wide">Bond Strenghtened!</span>
                </div>
            </div>
        </div>
    )
}

function TimelineVisual() {
    return (
        <div className="w-full h-full bg-gradient-to-b from-[#F3E5F5] to-white flex flex-col relative overflow-hidden">
            <div className="absolute left-9 top-0 bottom-0 w-[3px] bg-purple-200" />

            <div className="pt-20 px-5 space-y-8 pl-14">
                {[
                    { date: "Oct 12", title: "Met on Hearth", icon: "🌱", color: "bg-emerald-400", shadow: "shadow-emerald-200" },
                    { date: "Nov 01", title: "1st Month Streak", icon: "🔥", color: "bg-orange-400", shadow: "shadow-orange-200" },
                    { date: "Dec 25", title: "First Christmas", icon: "🎄", color: "bg-red-500", shadow: "shadow-red-200" },
                    { date: "Feb 14", title: "Valentine's Date", icon: "💖", color: "bg-pink-500", shadow: "shadow-pink-200" },
                    { date: "Mar 20", title: "Spring Trip", icon: "✈️", color: "bg-blue-400", shadow: "shadow-blue-200" },
                ].map((item, i) => (
                    <div key={i} className="relative group">
                        <div className={cn(
                            "absolute -left-[38px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border-4 border-white flex items-center justify-center text-sm shadow-md z-10 transition-transform group-hover:scale-110",
                            item.color
                        )}>
                            {item.icon}
                        </div>
                        <div className={cn(
                            "bg-white p-4 rounded-2xl shadow-sm border border-purple-50 transition-all hover:shadow-md hover:translate-x-1",
                            item.shadow
                        )}>
                            <div className="text-[10px] font-bold text-purple-400 uppercase mb-1">{item.date}</div>
                            <div className="font-bold text-charcoal text-base">{item.title}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Gradient fade at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>
    )
}

function WidgetsVisual() {
    return (
        <div className="w-full h-full bg-gradient-to-br from-sky-50 to-indigo-50 flex flex-col items-center justify-center p-6 relative">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay" />

            <div className="w-full max-w-[260px] space-y-6 relative z-10">

                {/* Small Widget */}
                <div className="bg-white p-5 rounded-[2.5rem] shadow-xl shadow-blue-200/50 border border-white/50 aspect-square flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-md">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500" />
                    <div className="scale-125 mb-2">
                        <Creature emoji="🐧" size="lg" animated={true} />
                    </div>
                    <div className="mt-1 text-center">
                        <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Together</div>
                        <div className="text-3xl font-outfit font-bold text-charcoal">42</div>
                        <div className="text-[10px] text-charcoal/40 font-bold">Days</div>
                    </div>
                </div>

                {/* Medium Widget */}
                <div className="bg-white p-5 rounded-[2rem] shadow-lg shadow-blue-100/50 border border-white/50 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-coral to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-coral/30 text-white">
                        <Flame className="w-6 h-6 fill-white" />
                    </div>
                    <div>
                        <div className="font-bold text-charcoal text-base">Keep it up!</div>
                        <div className="text-xs text-charcoal/50 font-medium">Check in before 8pm</div>
                    </div>
                </div>

                <div className="text-center pt-4">
                    <span className="bg-charcoal/5 text-charcoal/60 text-[10px] font-bold px-4 py-1.5 rounded-full border border-charcoal/5">iOS 18 Ready</span>
                </div>

            </div>
        </div>
    )
}
