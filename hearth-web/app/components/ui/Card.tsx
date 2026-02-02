"use client";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
    return (
        <motion.div
            initial={false}
            whileHover={hover ? { y: -8, transition: { type: "spring", stiffness: 400 } } : {}}
            className={cn(
                "bg-white/70 backdrop-blur-xl border border-white/80 shadow-xl shadow-coral/10 rounded-3xl overflow-hidden",
                className
            )}
        >
            {children}
        </motion.div>
    );
}
