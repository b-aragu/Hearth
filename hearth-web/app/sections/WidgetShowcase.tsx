"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Creature } from "@/app/components/ui/Creature";
import { cn } from "@/app/lib/utils";
import { Heart, Battery, Wifi, Signal, Sparkles, Moon } from "lucide-react";
import { useState, useEffect } from "react";

export function WidgetShowcase() {
    // Mouse Tilt Effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
    const brightness = useTransform(mouseYSpring, [-0.5, 0.5], [1.1, 0.9]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <section className="py-16 lg:py-32 px-6 bg-[#0B0B11] relative overflow-hidden text-white perspective-[2000px]" id="widgets">
            {/* Ambient Background Lighting */}
            <div className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[900px] h-[900px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow delay-1000" />

            <NightParticles />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16 lg:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] mb-6 backdrop-blur-xl"
                    >
                        <Moon className="w-3.5 h-3.5 text-purple-300 fill-purple-300" />
                        <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider font-dm-sans">Night Mode Ready</span>
                    </motion.div>
                    <h2 className="text-4xl lg:text-6xl font-outfit font-bold mb-6 bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent">Always Connected</h2>
                    <p className="text-white/50 text-lg lg:text-2xl font-dm-sans max-w-2xl mx-auto font-light leading-relaxed">
                        Keep your companion—and your partner—close. <br className="hidden md:block" /> No checking feeds, just checking in.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-32">

                    {/* Interactive 3D Phone Mockup */}
                    <motion.div
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{ rotateX, rotateY, filter: `brightness(${brightness})` }}
                        className="relative group cursor-pointer w-full max-w-[360px]"
                    >
                        {/* Glow behind phone */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/30 to-purple-500/30 blur-[80px] rounded-full scale-110 group-hover:scale-125 transition-transform duration-700" />

                        <div className="relative w-full aspect-[9/18] bg-black rounded-[2.5rem] md:rounded-[4rem] border-[8px] md:border-[10px] border-[#1f1f22] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col justify-between p-5 md:p-7 transform-style-3d">
                            {/* Glass Reflection */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent z-50 pointer-events-none opacity-50 rounded-[3.5rem]" />

                            {/* Dynamic Wallpaper */}
                            <div className="absolute inset-0 bg-gradient-to-b from-[#1a1233] via-[#2d1b4e] to-black z-0" />
                            <div className="absolute inset-0 z-0 opacity-60">
                                {/* Blurred creature as wallpaper background */}
                                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 scale-[4] blur-[60px] opacity-40 animate-pulse-slow">
                                    <Creature emoji="🐶" size="xl" animated={false} />
                                </div>
                            </div>

                            {/* Status Bar */}
                            <div className="flex justify-between items-center text-xs font-semibold text-white/70 z-10 px-2 mt-2">
                                <span>22:41</span>
                                <div className="flex gap-1.5 items-center">
                                    <Signal className="w-3.5 h-3.5" />
                                    <Wifi className="w-3.5 h-3.5" />
                                    <Battery className="w-3.5 h-3.5" />
                                </div>
                            </div>

                            {/* Clock & Date */}
                            <div className="flex flex-col items-center mt-12 z-10 text-white/90">
                                <div className="text-lg font-medium tracking-wide mb-1 text-white/70 font-outfit">Monday, June 12</div>
                                <div className="text-[5.5rem] leading-none font-extralight tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 drop-shadow-xl font-outfit">22:41</div>
                            </div>

                            {/* Lock Screen Widgets */}
                            <div className="flex justify-center gap-4 mt-8 z-10">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center shadow-lg cursor-pointer hover:bg-white/10 transition-colors overflow-hidden"
                                >
                                    <motion.div
                                        animate={{ y: [0, -3, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        className="scale-75 -mb-1"
                                    >
                                        <Creature emoji="🐶" size="sm" animated={false} />
                                    </motion.div>
                                    <span className="text-[9px] font-bold text-white/80 leading-none mt-1">Lvl 5</span>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="w-36 h-16 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center p-3 gap-3 shadow-lg cursor-pointer hover:bg-white/10 transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-full bg-coral/20 flex items-center justify-center shadow-inner">
                                        <Sparkles className="w-4 h-4 text-coral animate-pulse" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Streak</span>
                                        <span className="text-lg font-bold">42 Days</span>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Live Activity Notification - ANIMATED */}
                            <motion.div
                                initial={{ y: 200, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                whileHover={{ scale: 1.02 }}
                                transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 20 }}
                                className="mt-auto mb-16 z-20 cursor-pointer"
                            >
                                <div className="bg-black/40 backdrop-blur-[20px] border border-white/10 p-5 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-white/20 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-coral to-orange-500 flex items-center justify-center shadow-md animate-pulse">
                                                <Creature emoji="🐶" size="sm" animated={false} className="scale-50" />
                                            </div>
                                            <span className="text-[11px] font-bold tracking-wider text-white/70 uppercase">Hearth • Growing</span>
                                        </div>
                                        <span className="text-[10px] font-medium text-white/40">Now</span>
                                    </div>

                                    <div className="flex gap-4 items-center">
                                        <div className="flex-1">
                                            <h4 className="font-outfit font-bold text-xl mb-0.5 tracking-tight">Daily Check-in</h4>
                                            <p className="text-white/70 text-sm font-dm-sans">Sarah just answered!</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl relative shadow-inner">
                                            🐻
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-[3px] border-[#151515]" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Home Indicator */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full z-50"></div>
                        </div>
                    </motion.div>

                    {/* Explainer Cards */}
                    <div className="flex flex-col gap-8 max-w-sm">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-sm opacity-50 hover:opacity-100 transition-opacity duration-500 group"
                        >
                            <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3 group-hover:text-white/50 transition-colors">The Old Way</div>
                            <h3 className="text-xl font-bold mb-2 font-outfit">Just text.</h3>
                            <p className="text-white/40 text-sm leading-relaxed mb-4 group-hover:text-white/60 transition-colors">"Did you remember to check in today?"</p>
                            <div className="h-1 w-12 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors" />
                        </motion.div>

                        <div className="relative">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-coral to-pink-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-pink-500/30">RECOMMENDED</div>

                                <div className="text-xs font-bold text-pink-300 uppercase tracking-widest mb-3">The Hearth Way</div>
                                <h3 className="text-2xl font-bold mb-2 text-white font-outfit">Heart-melting.</h3>
                                <p className="text-white/70 text-sm font-dm-sans leading-relaxed mb-8">
                                    A gentle nudge on your lock screen. A shared moment of joy when you both sync up.
                                </p>

                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-3">
                                        <div className="w-10 h-10 rounded-full border-[3px] border-[#13121d] bg-coral/20 flex items-center justify-center text-sm shadow-lg">🐶</div>
                                        <div className="w-10 h-10 rounded-full border-[3px] border-[#13121d] bg-mint/20 flex items-center justify-center text-sm shadow-lg">🐻</div>
                                    </div>
                                    <span className="text-xs font-bold text-white/50">+ 10k others</span>
                                </div>
                            </motion.div>

                            {/* Decorative blur behind card */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[3rem] blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

function NightParticles() {
    const [particles, setParticles] = useState<{ id: number; top: number; left: number; delay: number; duration: number }[]>([]);

    useEffect(() => {
        const newParticles = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            top: Math.random() * 100,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 3 + Math.random() * 5,
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 0.4, 0],
                        scale: [0, 1.5, 0],
                        y: [0, -50]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeInOut"
                    }}
                    className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
                    style={{
                        top: `${p.top}%`,
                        left: `${p.left}%`,
                    }}
                />
            ))}
        </div>
    )
}
