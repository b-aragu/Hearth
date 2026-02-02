"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Heart, ArrowRight, Send } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Button } from "./Button";
import { Card } from "./Card";

interface QuizModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const steps = [
    {
        id: "vibe",
        title: "What's your couple vibe?",
        options: [
            { label: "Chill & Cozy 🍵", value: "chill", color: "bg-lavender" },
            { label: "Adventurous 🏔️", value: "adventure", color: "bg-mint" },
            { label: "Playful Chaos 🎪", value: "chaos", color: "bg-coral" },
            { label: "Power Couple 💼", value: "power", color: "bg-charcoal" }
        ]
    },
    {
        id: "goal",
        title: "Growth Goal?",
        options: [
            { label: "More Romance 💖", value: "romance", color: "bg-pink-100" },
            { label: "Better Comms 🗣️", value: "comms", color: "bg-blue-100" },
            { label: "Consistency 📅", value: "consistency", color: "bg-orange-100" },
            { label: "Just Fun 🎉", value: "fun", color: "bg-yellow-100" }
        ]
    },
    {
        id: "custom",
        title: "Dream Pet?",
        subtitle: "Have a specific creature in mind? Tell us!",
        type: "input"
    }
];

export function QuizModal({ isOpen, onClose }: QuizModalProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleOptionSelect = (value: string) => {
        setAnswers(prev => ({ ...prev, [steps[currentStep].id]: value }));
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSuccess(true);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-colors z-20"
                        >
                            <X className="w-5 h-5 text-charcoal/60" />
                        </button>

                        <div className="relative z-10 min-h-[400px] flex flex-col items-center justify-center text-center">
                            {!isSuccess ? (
                                <>
                                    {/* Progress Bar */}
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
                                        <motion.div
                                            className="h-full bg-coral"
                                            initial={{ width: "0%" }}
                                            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                        />
                                    </div>

                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentStep}
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: -20, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-full flex-1 flex flex-col items-center pt-8"
                                        >
                                            <div className="mb-8">
                                                <h3 className="text-3xl font-outfit font-bold text-charcoal mb-2">
                                                    {steps[currentStep].title}
                                                </h3>
                                                {steps[currentStep].subtitle && (
                                                    <p className="text-charcoal/60">{steps[currentStep].subtitle}</p>
                                                )}
                                            </div>

                                            {steps[currentStep].type === "input" ? (
                                                <div className="w-full space-y-4">
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Baby Dragon, Red Panda..."
                                                        className="w-full p-4 rounded-xl border border-charcoal/10 focus:border-coral focus:ring-2 focus:ring-coral/20 outline-none text-center text-lg font-dm-sans transition-all"
                                                        onChange={(e) => setAnswers(prev => ({ ...prev, custom: e.target.value }))}
                                                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                                    />
                                                    <Button
                                                        onClick={handleSubmit}
                                                        className="w-full py-4 mt-4"
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? <Sparkles className="w-4 h-4 animate-spin" /> : "Find My Match"}
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 gap-3 w-full">
                                                    {steps[currentStep].options?.map((option) => (
                                                        <motion.button
                                                            key={option.value}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => handleOptionSelect(option.value)}
                                                            className={cn(
                                                                "w-full p-4 rounded-2xl text-left flex items-center justify-between group transition-all duration-300 hover:shadow-lg",
                                                                option.color,
                                                                "bg-opacity-20 hover:bg-opacity-30"
                                                            )}
                                                        >
                                                            <span className="font-bold text-charcoal/80 text-lg">{option.label}</span>
                                                            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                        <Sparkles className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h3 className="text-3xl font-outfit font-bold text-charcoal mb-4">We've got just the thing!</h3>
                                    <p className="text-charcoal/60 mb-8 max-w-[260px] leading-relaxed">
                                        Based on your {answers.vibe || "vibe"} style, we recommend checking out the <strong>Fox</strong> or joining the waitlist for your custom {answers.custom || "creature"}!
                                    </p>
                                    <Button onClick={onClose} size="lg" className="px-10">
                                        Explore Creatures
                                    </Button>
                                </motion.div>
                            )}
                        </div>

                        {/* Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-coral/5 rounded-full blur-3xl -z-10" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-mint/10 rounded-full blur-3xl -z-10" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
