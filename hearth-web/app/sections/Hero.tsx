"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/Button";
import { Play, ArrowRight, Heart, Check } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Creature } from "@/app/components/ui/Creature";

export function Hero() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const [isMobile, setIsMobile] = useState(false);
    const [activePhone, setActivePhone] = useState<0 | 1>(0);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <section className="relative min-h-[110vh] w-full flex items-center justify-center overflow-hidden pt-20 pb-20 lg:pt-0 lg:pb-0">

            {/* --- Background Enhancements --- */}
            {/* Multi-layer Animated Gradients */}
            <div className="absolute inset-0 bg-[#FFF9F0] transition-colors duration-1000 -z-30" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay -z-20 pointer-events-none" />

            {/* Mesh Gradient Orbs */}
            <motion.div
                animate={{ y: [0, 20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-coral/20 rounded-full blur-[100px] -z-20 mix-blend-multiply"
            />
            <motion.div
                animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-lavender/25 rounded-full blur-[120px] -z-20 mix-blend-multiply"
            />
            <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, -10, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[20%] left-[30%] w-[500px] h-[500px] bg-mint/20 rounded-full blur-[100px] -z-20 mix-blend-multiply"
            />

            <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 w-full relative z-10">

                {/* --- Left Content --- */}
                <div className="flex flex-col justify-center text-center lg:text-left pt-10 lg:pt-0">

                    {/* Social Proof Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/40 px-4 py-2 rounded-full self-center lg:self-start shadow-sm mb-8 hover:shadow-md transition-shadow cursor-default"
                    >
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-bold text-charcoal/80 font-dm-sans">
                            10,247 couples growing together
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-5xl lg:text-7xl font-outfit font-extrabold leading-[1.1] mb-6 text-charcoal tracking-tight"
                    >
                        Grow Something <br className="hidden lg:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral via-purple-400 to-mint animate-gradient-shift bg-[length:200%_auto]">
                            Beautiful Together
                        </span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg lg:text-xl text-charcoal/70 font-dm-sans leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0"
                    >
                        <strong className="text-charcoal block mb-2 text-xl">The daily ritual that makes love visible.</strong>
                        Raise a virtual companion together. Watch your relationship grow, one day at a time.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
                    >
                        <a href="#cta" className="w-full sm:w-auto">
                            <Button
                                size="xl"
                                className="w-full px-8 py-6 text-lg shadow-[0_12px_32px_rgba(255,154,162,0.4)] hover:shadow-[0_16px_40px_rgba(255,154,162,0.5)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Start Growing Together <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
                            </Button>
                        </a>

                    </motion.div>
                </div>


                {/* --- Right Content (Phones) --- */}
                {/* --- Right Content (Phones) --- */}
                <div className="relative h-auto min-h-[600px] lg:h-[800px] flex items-center justify-center perspective-[2000px] py-10 lg:py-0">

                    {/* Context Particles floating around */}
                    <ContextParticles />

                    {/* --- Main Phone (Phone 0) --- */}
                    <motion.div
                        onClick={() => setActivePhone(0)}
                        style={{ y: isMobile ? 0 : y1 }}
                        animate={activePhone === 0
                            ? { x: 0, scale: 1, zIndex: 30, rotateY: 0, rotateX: 0, filter: "brightness(100%)" }
                            : { x: isMobile ? -50 : -60, scale: 0.9, zIndex: 10, rotateY: 15, rotateX: 5, filter: "brightness(95%)" }
                        }
                        transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                        className="absolute w-[280px] lg:w-[340px] h-[600px] lg:h-[680px] bg-white rounded-[3rem] shadow-[0_20px_40px_rgba(0,0,0,0.15),0_40px_80px_rgba(255,154,162,0.2),inset_0_0_0_8px_rgba(255,255,255,0.5)] border-[8px] border-charcoal overflow-hidden cursor-pointer"
                    >
                        {/* Dynamic Island */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-b-2xl z-50 flex items-center justify-center gap-2 overflow-hidden">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <div className="w-1 h-1 rounded-full bg-orange-500/50" />
                        </div>

                        {/* Status Bar */}
                        <div className="absolute top-3 left-6 text-[10px] font-bold text-charcoal/80 z-40">9:41</div>
                        <div className="absolute top-3 right-6 flex gap-1 z-40">
                            <div className="w-4 h-2.5 border border-charcoal/30 rounded-[2px]" />
                        </div>

                        {/* Screen Content - Scaled Down Slightly */}
                        <div className="w-full h-full bg-[#FFF5F5] relative flex flex-col pt-8 px-5 scale-[0.85] origin-top">
                            {/* Top Bar */}
                            <div className="flex justify-between items-center mb-2 pl-1">
                                <span className="font-bold font-outfit text-charcoal text-lg tracking-tight">OurHaven</span>
                                <div className="flex items-center gap-1.5 bg-white/60 px-2.5 py-1 rounded-full border border-black/5 shadow-sm backdrop-blur-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
                                    <span className="text-[9px] font-bold text-coral tracking-widest uppercase">Level 5</span>
                                </div>
                            </div>

                            {/* Main Character Area */}
                            <div className="flex-1 flex flex-col items-center justify-start relative pt-1">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.02, 1],
                                        rotate: [0, 1, -1, 0]
                                    }}
                                    transition={{
                                        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                                        rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                    className="relative mb-1 shrink-0 scale-75"
                                >
                                    <Creature emoji="🐻" size="xl" animated={false} />

                                    {/* Floating Hearts from Bear */}
                                    <motion.div
                                        animate={{ y: -40, opacity: [0, 1, 0], x: [0, 10, -10] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                                        className="absolute top-2 right-4 text-xl"
                                    >♥</motion.div>
                                </motion.div>

                                <h3 className="text-xl font-bold font-outfit text-charcoal mb-1">Barnaby</h3>
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/50 rounded-full border border-black/5 mb-2">
                                    <div className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                    <span className="text-[9px] text-charcoal/60 font-bold tracking-widest uppercase">Growing Strong</span>
                                </div>
                            </div>

                            {/* Streak Section - Redesigned for cleaner look */}
                            <div className="bg-white rounded-3xl p-3 mb-2 border border-stone-100 shadow-md shadow-coral/5 relative overflow-hidden shrink-0">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-coral/5 rounded-bl-[4rem] -z-10 transition-transform group-hover:scale-110" />

                                <div className="flex flex-col items-center text-center">
                                    <span className="text-[9px] font-bold text-charcoal/50 uppercase tracking-widest mb-0.5">Current Streak</span>
                                    <div className="flex items-baseline gap-1 mb-1.5">
                                        <span className="text-2xl font-outfit font-bold text-coral">5</span>
                                        <span className="text-base font-bold text-coral/80">Days</span>
                                    </div>

                                    <div className="flex justify-center gap-1 mb-1.5 w-full max-w-[160px]">
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 1 + (i * 0.1) }}
                                                className="w-5 h-5 bg-gradient-to-br from-coral to-orange-400 rounded-full flex items-center justify-center text-white text-[9px] shadow-sm"
                                            >
                                                🔥
                                            </motion.div>
                                        ))}
                                        {[...Array(2)].map((_, i) => (
                                            <div key={i} className="w-5 h-5 bg-black/5 rounded-full border border-black/5" />
                                        ))}
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full max-w-[140px] h-1 bg-gray-100 rounded-full overflow-hidden mt-0.5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "71%" }}
                                            transition={{ delay: 1.5, duration: 1 }}
                                            className="h-full bg-gradient-to-r from-coral to-peach rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Check-in Status - Minimizing to save space if needed or polishing */}
                            <div className="bg-white rounded-[1.5rem] p-2.5 mb-2 flex items-center gap-2.5 shadow-sm border border-black/5 shrink-0 transform hover:scale-[1.02] transition-transform cursor-pointer">
                                <div className="flex -space-x-2">
                                    <div className="w-7 h-7 rounded-full bg-lavender border-2 border-white flex items-center justify-center text-[9px] font-bold shadow-sm text-purple-600">You</div>
                                    <div className="w-7 h-7 rounded-full bg-mint border-2 border-white flex items-center justify-center text-[9px] font-bold shadow-sm text-teal-600">Al</div>
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="text-xs font-bold text-charcoal leading-tight">All checked in!</div>
                                    <div className="text-[9px] text-charcoal/50 font-medium">Great job today ✨</div>
                                </div>
                                <div className="w-6 h-6 rounded-full bg-green-100/50 text-green-600 flex items-center justify-center border border-green-200/30">
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}><Check className="w-3 h-3" /></motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>


                    {/* --- Secondary Phone (Phone 1 - Partner View) --- */}
                    <motion.div
                        onClick={() => setActivePhone(1)}
                        style={{ y: isMobile ? 0 : y2 }}
                        animate={activePhone === 1
                            ? { x: 0, scale: 1, zIndex: 30, rotateY: 0, rotateX: 0, filter: "brightness(100%)" }
                            : { x: isMobile ? 90 : 60, scale: 0.9, zIndex: 10, rotateY: -30, rotateX: 5, filter: "brightness(95%)" }
                        }
                        whileHover={activePhone === 0 ? { scale: 0.92, filter: "brightness(100%)" } : {}}
                        transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                        className="absolute w-[280px] lg:w-[340px] h-[560px] lg:h-[680px] bg-white rounded-[2.5rem] shadow-2xl border-[6px] border-charcoal/90 overflow-hidden cursor-pointer"
                    >
                        {/* Connecting Arc Visualization (Only visible if secondary inactive? keeps it subtly visible) */}
                        <div className="absolute top-1/2 -left-32 w-40 h-40 border-t-2 border-dashed border-charcoal/20 rounded-full -rotate-45 pointer-events-none z-0 opacity-50" />

                        {/* Status Bar */}
                        <div className="absolute top-3 left-6 text-[10px] font-bold text-charcoal/80 z-40">9:41</div>

                        {/* Screen Content */}
                        <div className="w-full h-full bg-[#F0F4FF] p-6 pt-12 relative group scale-[0.95] origin-top">

                            {/* Partner View Header */}
                            <div className="flex items-center gap-3 mb-12 opacity-60">
                                <div className="w-8 h-8 rounded-full bg-charcoal/10" />
                                <div className="w-24 h-3 bg-charcoal/10 rounded-full" />
                            </div>

                            {/* Partner View Bear */}
                            <div className="flex flex-col items-center">
                                <Creature emoji="🐻" size="lg" animated={false} className="grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" />

                                {/* Notification Card */}
                                <div className="mt-8 w-full">
                                    <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-lg text-center border border-coral/20 animate-[bounce_3s_infinite]">
                                        <div className="text-3xl mb-3">💌</div>
                                        <div className="font-bold text-charcoal text-lg mb-1">Missed you!</div>
                                        <div className="text-sm text-charcoal/60 mb-4">Alex sent a Daily Note</div>
                                        <div className="w-full bg-coral text-white text-sm font-bold py-3 rounded-xl shadow-md cursor-pointer hover:bg-coral/90 transition-colors">
                                            Read Note
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Reactions */}
                            <div className="absolute top-24 right-4 flex flex-col gap-3">
                                {["❤️", "🔥", "🥺"].map((emoji, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.5 + (0.1 * i) }}
                                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-lg"
                                    >
                                        {emoji}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function ContextParticles() {
    const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number; duration: number; char: string; colorClass: string }[]>([]);

    useEffect(() => {
        const newParticles = Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            x: Math.random() * 400 - 200,
            y: Math.random() * 400 - 200,
            delay: Math.random() * 5,
            duration: 5 + Math.random() * 10,
            char: ["♥", "★", "✨", "🌸"][i % 4],
            colorClass: i % 2 === 0 ? "text-coral" : "text-mint"
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none select-none z-0">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className={cn("absolute text-xl opactiy-60", p.colorClass)}
                    initial={{
                        x: p.x,
                        y: p.y,
                        opacity: 0
                    }}
                    animate={{
                        y: [0, -100],
                        opacity: [0, 1, 0],
                        rotate: [0, 180]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear"
                    }}
                    style={{
                        left: "50%",
                        top: "50%"
                    }}
                >
                    {p.char}
                </motion.div>
            ))}
        </div>
    )
}
