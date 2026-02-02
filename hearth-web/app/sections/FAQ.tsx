"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/app/lib/utils";

const faqs = [
    {
        question: "Does it work if one of us has Android?",
        answer: "Absolutely! Hearth is fully cross-platform. You can be on iPhone while your partner is on Android. As long as you're synced via the app, your connection knows no boundaries."
    },
    {
        question: "Can we use it for long distance?",
        answer: "It was built for exactly that. Whether you're 5 miles or 5,000 miles apart, Hearth gives you a way to feel their presence without needing a call or text. It's a quiet 'I'm thinking of you' right on your lock screen."
    },
    {
        question: "How do the widgets update?",
        answer: "Magic (and some code). When you check in or complete a daily prompt, your partner's widget updates instantly. It's like sending a signal flare of love."
    },
    {
        question: "How does our companion grow?",
        answer: "Just like your relationship! Consistency is key. As your streak grows, your companion evolves directly on your Lock Screen—unlocking new moods, outfits, and celebrations."
    },
    {
        question: "Can we use different devices?",
        answer: "Love shouldn't care about operating systems. We're thinking cross-platform from day one. As long as you're synced in the cloud, you're synced in heart."
    },
    {
        question: "Can we change our companion later?",
        answer: "Of course! You can welcome a new companion anytime. Your previous ones will retire happily to your Memory Garden, where you can visit them and your past streaks."
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
                <p className="text-charcoal/60 font-medium font-dm-sans text-lg">Everything you need to know before you start your streaks.</p>
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
