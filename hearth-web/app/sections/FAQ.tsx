"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/app/lib/utils";

const faqs = [
    {
        question: "Does it work if one of us has Android?",
        answer: "Yes! The pet lives in the app, so it works on iPhone and Android."
    },
    {
        question: "Can we use it for long distance?",
        answer: "Perfect for that. Raising a pet together makes you feel close, even when far apart."
    },
    {
        question: "How do the widgets update?",
        answer: "When you feed or care for the pet, it updates on your partner's phone too."
    },
    {
        question: "How does our companion grow?",
        answer: "Consistency makes it grow. The more you care for it, the bigger and happier it gets."
    },
    {
        question: "Can we use different devices?",
        answer: "Yes, love doesn't care about phones. Your pet is safe in the cloud."
    },
    {
        question: "Can we change our companion later?",
        answer: "Sure! You can adopt a new pet anytime. Old pets go to your Memory Garden."
    }
];

export function FAQ() {
    return (
        <section className="py-16 lg:py-24 px-6 max-w-4xl mx-auto" id="faq">
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-lavender/20 text-purple-500 mb-6">
                    <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-4xl lg:text-5xl font-outfit font-bold text-charcoal mb-4">Curious Minds</h2>
                <p className="text-charcoal/60 font-medium font-dm-sans text-lg">Common questions about raising your digital pet together.</p>
            </div>

            <div className="space-y-4">
                {faqs.map((item, i) => (
                    <FAQItem key={i} question={item.question} answer={item.answer} />
                ))}
            </div>
        </section>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={cn(
            "border rounded-3xl overflow-hidden transition-all duration-300",
            isOpen ? "bg-white border-charcoal/10 shadow-lg scale-[1.01]" : "bg-white/50 border-charcoal/5 hover:bg-white/80"
        )}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 lg:p-8 text-left"
            >
                <span className={cn(
                    "font-outfit font-bold text-lg lg:text-xl transition-colors",
                    isOpen ? "text-charcoal" : "text-charcoal/80"
                )}>{question}</span>
                <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                    isOpen ? "bg-charcoal text-white rotate-180" : "bg-charcoal/5 text-charcoal/40"
                )}>
                    <ChevronDown className="w-5 h-5" />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-6 lg:px-8 pb-8 text-charcoal/70 font-dm-sans leading-relaxed text-base lg:text-lg">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
