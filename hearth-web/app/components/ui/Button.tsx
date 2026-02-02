"use client";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/app/lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg" | "xl";
    children: React.ReactNode;
}

export function Button({ className, variant = "primary", size = "md", children, ...props }: ButtonProps) {
    const variants = {
        primary: "bg-gradient-to-r from-coral to-peach text-white shadow-lg shadow-coral/30 hover:shadow-xl hover:shadow-coral/40 border-none",
        secondary: "bg-white text-charcoal shadow-md hover:bg-soft-gray border-none",
        outline: "border-2 border-white/80 text-charcoal hover:bg-white/20 bg-transparent", // Adjusted for visibility on light bg usually
        ghost: "bg-transparent text-charcoal hover:bg-black/5 border-none",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
        xl: "px-10 py-5 text-xl",
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className={cn(
                "rounded-full font-bold font-nunito transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer outline-none ring-offset-2 focus:ring-2 ring-coral/50",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
}
