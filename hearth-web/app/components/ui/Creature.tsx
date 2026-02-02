"use client";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";

interface CreatureProps {
    emoji: string;
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
    animated?: boolean;
}

export function Creature({ emoji, className, size = "md", animated = true }: CreatureProps) {
    const sizeClasses = {
        sm: "text-4xl",
        md: "text-6xl",
        lg: "text-8xl",
        xl: "text-[10rem]", // Custom huge size for Hero/FinalCTA
    };

    const animationProps = animated ? {
        animate: {
            y: [0, -15, 0],
        },
        whileHover: {
            rotate: [0, -10, 10, 0],
        },
        transition: {
            y: { duration: 6, ease: "easeInOut" as const, repeat: Infinity },
            rotate: { duration: 0.5 }
        }
    } : {};

    return (
        <div className="relative inline-flex flex-col items-center justify-center">
            <motion.div
                {...animationProps}
                className={cn(
                    "leading-none select-none filter drop-shadow-2xl",
                    sizeClasses[size],
                    className
                )}
            >
                {emoji}
            </motion.div>
            {animated && (
                <motion.div
                    animate={{ scale: [1, 0.8, 1], opacity: [0.3, 0.2, 0.3] }}
                    transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
                    className="w-1/2 h-4 bg-black/10 rounded-full blur-md mt-4"
                />
            )}
        </div>
    );
}
