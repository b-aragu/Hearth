"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Creature } from "@/app/components/ui/Creature";
import { Button } from "@/app/components/ui/Button";

const creatures = [
    {
        id: "bear",
        name: "Bear",
        emoji: "🐻",
        description: "The ultimate snuggle buddy. Big softie who loves napping and long hugs.",
        color: "bg-coral",
        gradient: "from-coral to-peach",
        evolution: ["🧸", "🐻", "🐻‍❄️"]
    },
    {
        id: "bunny",
        name: "Bunny",
        emoji: "🐰",
        description: "Pure fluff & chaos. Zoomies followed by aggressive cuddles.",
        color: "bg-mint",
        gradient: "from-mint to-teal-300",
        evolution: ["🐰", "🐇", "🐇"]
    },
    {
        id: "puppy",
        name: "Puppy",
        emoji: "🐶",
        description: "Golden retriever energy. Always happy to see you and loves literally everyone.",
        color: "bg-orange-400",
        gradient: "from-orange-400 to-yellow-400",
        evolution: ["🦴", "🐶", "🐕"]
    },
    {
        id: "cat",
        name: "Cat",
        emoji: "🐱",
        description: "The cozy expert. Soft paws, loud purrs, and sleepy aesthetics.",
        color: "bg-lavender",
        gradient: "from-lavender to-purple-300",
        evolution: ["🐱", "🐈", "🐈‍⬛"]
    },
    {
        id: "hamster",
        name: "Hamster",
        emoji: "🐹",
        description: "Pocket-sized potato. Stuffs cheeks with snacks and loves cozy pockets.",
        color: "bg-peach",
        gradient: "from-peach to-orange-300",
        evolution: ["🥜", "🐹", "🐹"]
    },
    {
        id: "penguin",
        name: "Penguin",
        emoji: "🐧",
        description: "Waddling definition of cute. Loyal, clumsy, and strictly soft vibes.",
        color: "bg-blue-400",
        gradient: "from-blue-400 to-cyan-300",
        evolution: ["🥚", "🐧", "🐧"]
    }
];

export function CreatureSelector() {
    const [selected, setSelected] = useState(creatures[0].id);
    const [hovered, setHovered] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            const index = Math.round(scrollRef.current.scrollLeft / (scrollRef.current.clientWidth * 0.6)); // approx for snap
            // Better: measure card width.
            const cardWidth = scrollRef.current.children[0]?.clientWidth || scrollRef.current.clientWidth;
            const newIndex = Math.round(scrollRef.current.scrollLeft / cardWidth);
            setActiveIndex(newIndex);
        }
    };

    return (
        <section className="py-24 px-4 relative overflow-hidden bg-[#FFF9F0]" id="companions">
            {/* Background Elements */}
            <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-lavender/15 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-peach/15 rounded-full blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-charcoal/5 shadow-sm mb-4"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-coral" />
                        <span className="text-[11px] font-bold text-charcoal/60 uppercase tracking-wider font-dm-sans">Love at first sight</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-outfit font-bold text-charcoal mb-6"
                    >
                        Choose. Name. <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral to-peach">Raise.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-charcoal/60 font-dm-sans max-w-2xl mx-auto leading-relaxed"
                    >
                        Find the little one that melts your heart. You'll name them, care for them, and watch them grow together.
                    </motion.p>
                </div>

                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-12 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 px-4 -mx-4 md:mx-0 scrollbar-hide"
                >
                    {creatures.map((creature, index) => {
                        const isSelected = selected === creature.id;
                        const isHovered = hovered === creature.id;

                        return (
                            <motion.div
                                key={creature.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                onMouseEnter={() => setHovered(creature.id)}
                                onMouseLeave={() => setHovered(null)}
                                onClick={() => setSelected(creature.id)}
                                className={cn(
                                    "relative rounded-[2.5rem] p-8 lg:p-10 cursor-pointer transition-all duration-300 border overflow-hidden group flex flex-col items-center text-center",
                                    "min-w-[85vw] md:min-w-0 snap-center shrink-0", // Mobile Carousel Sizing
                                    isSelected
                                        ? `border-${creature.color.replace("bg-", "")}/30 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] scale-[1.01] z-10 bg-white`
                                        : "border-transparent bg-white/40 hover:bg-white/90 hover:shadow-lg hover:-translate-y-1 hover:border-white/50"
                                )}
                            >
                                {/* Background Gradient for Selected State */}
                                {isSelected && (
                                    <motion.div
                                        layoutId="selected-bg"
                                        className={cn("absolute inset-0 opacity-[0.05] bg-gradient-to-b", creature.gradient)}
                                    />
                                )}

                                {/* Creature Stats Pill (Visible on hover/select) */}
                                <div className={cn(
                                    "absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-opacity duration-300",
                                    isSelected || isHovered ? "bg-white shadow-sm text-charcoal/80 opacity-100" : "opacity-0"
                                )}>
                                    {creature.evolution[0]} Baby
                                </div>

                                {/* Creature Visualization */}
                                <div className="relative h-40 w-full flex items-center justify-center mb-6 z-10 mt-2">
                                    <AnimatePresence mode="wait">
                                        {isHovered && !isSelected ? (
                                            // Evolution Preview on Hover
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="flex items-center gap-3"
                                            >
                                                {creature.evolution.map((evo, i) => (
                                                    <div key={i} className="flex flex-col items-center gap-2">
                                                        <span className={cn("text-4xl filter drop-shadow-sm transition-all duration-300", i === 2 ? "scale-110" : "opacity-40 grayscale blur-[0.5px]")}>{evo}</span>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        ) : (
                                            // Main Creature
                                            <motion.div
                                                animate={isSelected || isHovered ? {
                                                    scale: [1, 1.05, 1],
                                                    rotate: [0, -2, 2, 0],
                                                    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                                                } : {}}
                                            >
                                                <Creature
                                                    emoji={creature.emoji}
                                                    size="lg"
                                                    animated={isSelected}
                                                    className={cn("transition-all duration-500 drop-shadow-xl", !isSelected && !isHovered && "grayscale-[0.1] opacity-80 scale-95")}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Persistent Evolution Display on Selection (Mobile Friendly) */}
                                {isSelected && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="flex items-center justify-center gap-4 mb-6"
                                    >
                                        {creature.evolution.map((evo, i) => (
                                            <div key={i} className="flex flex-col items-center gap-1">
                                                <span className="text-2xl">{evo}</span>
                                                <div className="h-1 w-1 rounded-full bg-charcoal/10" />
                                            </div>
                                        ))}
                                    </motion.div>
                                )}

                                {/* Content */}
                                <div className="relative z-10 w-full max-w-[280px]">
                                    <h3 className="text-2xl font-outfit font-bold text-charcoal mb-3">{creature.name}</h3>
                                    <p className="text-base text-charcoal/60 font-dm-sans leading-relaxed mb-8 min-h-[3rem]">
                                        {creature.description}
                                    </p>

                                    {/* "Select" Action */}
                                    <div className="h-12 flex items-center justify-center w-full">
                                        {isSelected ? (
                                            <a href="#cta" className="w-full">
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className={cn(
                                                        "px-6 py-2.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 bg-charcoal text-white shadow-lg cursor-pointer hover:bg-black transition-colors"
                                                    )}
                                                >
                                                    Adopt {creature.name} <ArrowRight className="w-4 h-4" />
                                                </motion.div>
                                            </a>
                                        ) : (
                                            <div className={cn(
                                                "px-6 py-2.5 rounded-full text-sm font-bold text-charcoal/40 border-2 border-charcoal/5 group-hover:border-charcoal/10 group-hover:text-charcoal/60 transition-all",
                                                isHovered ? "opacity-100" : "opacity-0"
                                            )}>
                                                Pick Me
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </motion.div>
                        );
                    })}
                </div>

                {/* Mobile Dots Indicator */}
                <div className="flex justify-center gap-2 mt-4 md:hidden">
                    {creatures.map((_, i) => (
                        <motion.button
                            key={i}
                            onClick={() => {
                                if (scrollRef.current) {
                                    scrollRef.current.scrollTo({
                                        left: i * scrollRef.current.clientWidth, // Close enough
                                        behavior: "smooth"
                                    });
                                }
                            }}
                            className={cn(
                                "h-2 rounded-full transition-all duration-300",
                                i === activeIndex ? "w-6 bg-coral" : "w-2 bg-charcoal/20"
                            )}
                            animate={{ scale: i === activeIndex ? 1 : 0.8 }}
                        />
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <Button size="lg" variant="outline" className="border-charcoal/10 text-charcoal/50 hover:text-charcoal hover:border-charcoal/30 bg-white/50 backdrop-blur-md px-8 rounded-full">
                        Not sure? Take the Quiz <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>

            </div>
        </section >
    );
}
