"use client";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/app/lib/utils";
import { Sparkles, MessageCircle, Heart, Check, TrendingUp } from "lucide-react";
import { Creature } from "@/app/components/ui/Creature";

const steps = [
    {
        title: "1. Choose Your Companion",
        desc: "Pick a virtual friend that matches your couple style. They'll grow as you grow.",
        color: "bg-coral",
        gradient: "from-coral to-peach",
        visual: <Step1Visual />
    },
    {
        title: "2. Daily Check-in",
        desc: "Answer one meaningful question together every day. Spark convos, not just logistics.",
        color: "bg-mint",
        gradient: "from-mint to-teal-300",
        visual: <Step2Visual />
    },
    {
        title: "3. Watch It Grow",
        desc: "Consistency evolves your creature. Build your streak and see your love level up.",
        color: "bg-lavender",
        gradient: "from-lavender to-purple-400",
        visual: <Step3Visual />
    }
];

export function HowItWorks() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section ref={containerRef} className="py-16 lg:py-32 px-6 relative overflow-hidden bg-white/50" id="how-it-works">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-coral/5 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-mint/5 rounded-full blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16 lg:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-charcoal/5 shadow-sm mb-4"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-coral" />
                        <span className="text-[11px] font-bold text-charcoal/60 uppercase tracking-wider font-dm-sans">Simple Ritual</span>
                    </motion.div>
                    <h2 className="text-4xl lg:text-5xl font-outfit font-bold text-charcoal mb-6">Simple, Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral to-peach">Magic</span></h2>
                    <p className="text-charcoal/60 text-lg lg:text-xl font-dm-sans max-w-2xl mx-auto">Three steps to a consistently stronger relationship. No pressure, just connection.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="absolute top-[160px] left-0 w-full h-[2px] bg-gradient-to-r from-coral/20 via-mint/20 to-lavender/20 hidden lg:block -z-10 dashed-line" />

                    {steps.map((step, i) => (
                        <StepCard key={i} step={step} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function StepCard({ step, index }: { step: any, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            className="group relative"
        >
            <div className="relative z-10 bg-white rounded-[2.5rem] p-2 shadow-xl hover:shadow-2xl transition-shadow duration-500 border border-charcoal/5">
                {/* Visual Area */}
                <div className="h-[280px] bg-[#F9FAFB] rounded-[2rem] overflow-hidden relative mb-6 group-hover:bg-[#F2F4F7] transition-colors duration-500">
                    <div className="absolute inset-0 flex items-center justify-center">
                        {step.visual}
                    </div>

                    {/* Step Number Badge */}
                    <div className={cn(
                        "absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg",
                        step.color
                    )}>
                        {index + 1}
                    </div>
                </div>

                {/* Text Content */}
                <div className="px-6 pb-8 text-center">
                    <h3 className="text-2xl font-outfit font-bold text-charcoal mb-3 group-hover:text-coral transition-colors duration-300">{step.title}</h3>
                    <p className="text-charcoal/60 font-dm-sans leading-relaxed text-sm lg:text-base">
                        {step.desc}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}

// --- Visual Components for Each Step ---

function Step1Visual() {
    return (
        <div className="w-[180px] h-full flex items-center justify-center relative">
            <div className="grid grid-cols-2 gap-3 w-full opacity-50 scale-90 blur-[1px]">
                <div className="bg-white p-2 rounded-xl border opacity-50"><div className="w-8 h-8 rounded-full bg-gray-100 mx-auto" /></div>
                <div className="bg-white p-2 rounded-xl border opacity-50"><div className="w-8 h-8 rounded-full bg-gray-100 mx-auto" /></div>
                <div className="bg-white p-2 rounded-xl border opacity-50"><div className="w-8 h-8 rounded-full bg-gray-100 mx-auto" /></div>
                <div className="bg-white p-2 rounded-xl border opacity-50"><div className="w-8 h-8 rounded-full bg-gray-100 mx-auto" /></div>
            </div>

            {/* Selected Card Pop-up */}
            <motion.div
                animate={{ scale: [1, 1.05, 1], y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bg-white p-4 rounded-2xl shadow-xl border border-coral/20 flex flex-col items-center z-10 w-32"
            >
                <Creature emoji="🐶" size="lg" animated={true} />
                <div className="h-2 w-16 bg-gray-100 rounded-full mt-3 mb-1" />
                <div className="px-3 py-1 bg-coral text-white text-[8px] font-bold rounded-full mt-1">PICKED</div>
            </motion.div>
        </div>
    )
}

function Step2Visual() {
    return (
        <div className="w-full max-w-[200px] flex flex-col gap-3 relative">
            {/* Question Bubble */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-black/5 self-start max-w-[85%]"
            >
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-mint uppercase">Daily Question</span>
                </div>
                <div className="text-xs font-medium text-charcoal">What made you smile today?</div>
            </motion.div>

            {/* Answer Bubble */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="bg-coral p-3 rounded-2xl rounded-tr-sm shadow-md self-end max-w-[85%]"
            >
                <div className="text-xs text-white">Seeing the sunrise! ☀️</div>
                <div className="flex justify-end mt-1">
                    <span className="text-[8px] text-white/80 flex items-center gap-0.5">8:30 AM <Check className="w-2 h-2" /></span>
                </div>
            </motion.div>
        </div>
    )
}

function Step3Visual() {
    const [progress, setProgress] = useState(0);

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="relative mb-4">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <Creature emoji="🐶" size="lg" animated={false} />
                </motion.div>

                {/* Level Badge */}
                <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-2 -right-4 bg-yellow-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm"
                >
                    Lvl 5
                </motion.div>
            </div>

            {/* Growth Chart */}
            <div className="w-40 h-24 bg-white rounded-xl border border-charcoal/5 p-3 flex items-end justify-between shadow-sm relative overflow-hidden">
                {[30, 45, 40, 60, 55, 75, 80].map((h, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        transition={{ delay: 0.5 + (i * 0.1), duration: 0.5 }}
                        className="w-3 bg-mint rounded-t-sm"
                    />
                ))}

                {/* Trending Line Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none p-3" preserveAspectRatio="none">
                    <motion.path
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        d="M0 60 C 20 50, 40 40, 60 40 C 80 40, 100 20, 140 10"
                        fill="none"
                        stroke="#FFB7B2"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
        </div>
    )
}
