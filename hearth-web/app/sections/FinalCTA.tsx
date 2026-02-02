"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/Button";
import { ArrowRight, Check, Send, Sparkles, Plus, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/app/lib/utils";

export function FinalCTA() {
    return (
        <section id="cta" className="relative py-20 lg:py-32 px-4 overflow-hidden flex flex-col items-center justify-center text-center">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-coral/5 via-[#FFF9F0] to-white -z-20" />
            <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-white to-transparent -z-10" />

            {/* Decorative Orbs */}
            <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-orange-200/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-purple-200/20 rounded-full blur-[100px]" />

            <div className="max-w-5xl mx-auto w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-8"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-coral/10 text-coral text-xs font-bold uppercase tracking-wider mb-6">
                        <Sparkles className="w-3.5 h-3.5" />
                        Join the Beta
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-outfit font-extrabold text-charcoal mb-6 tracking-tight leading-tight">
                        Build Your Haven. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral to-orange-500">Together.</span>
                    </h2>
                    <p className="text-xl text-charcoal/60 font-dm-sans max-w-2xl mx-auto leading-relaxed mb-12">
                        Hearth is evolving. Help us shape the future of digital intimacy.
                        Vote on features you want to see and get early access.
                    </p>
                </motion.div>

                {/* Interactive Feature Poll & Email Form */}
                <FeaturePollForm />

                {/* Trust Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 flex flex-col items-center gap-4"
                >
                    <div className="flex items-center gap-2 text-charcoal/40 text-sm font-medium">
                        <Check className="w-4 h-4 text-green-500" /> No spam, ever
                        <span className="w-1 h-1 bg-charcoal/20 rounded-full" />
                        <Check className="w-4 h-4 text-green-500" /> Direct access to the founder
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function FeaturePollForm() {
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [customFeature, setCustomFeature] = useState("");
    const [showCustomInput, setShowCustomInput] = useState(false);

    // Status: idle -> loading -> success -> error
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const features = [
        { id: "widgets", label: "Lock Screen Widgets", icon: "📱" },
        { id: "journal", label: "Shared Journal", icon: "📔" },
        { id: "evolution", label: "Creature Evolution", icon: "✨" },
        { id: "android", label: "Cross-Platform Sync", icon: "🔄" }
    ];

    const toggleFeature = (id: string) => {
        if (selectedFeatures.includes(id)) {
            setSelectedFeatures(selectedFeatures.filter(f => f !== id));
        } else {
            setSelectedFeatures([...selectedFeatures, id]);
        }
    };

    const toggleCustomInput = () => {
        setShowCustomInput(!showCustomInput);
        if (!showCustomInput) {
            // Focus logic if needed
        } else {
            setCustomFeature("");
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !name) return;

        setStatus("loading");

        try {
            const formData = new FormData();
            formData.append("access_key", "e45a93b2-fbd2-49e7-a123-9638da848768");
            formData.append("name", name);
            formData.append("email", email);

            // Combine features and custom wish into message
            const featureList = selectedFeatures.join(', ') || "None";
            const wish = customFeature || "None";
            const message = `Voted Features: ${featureList}\nCustom Feature Wish: ${wish}`;

            formData.append("message", message);
            // Also append custom fields if Web3Forms supports them, but message is safest
            formData.append("subject", `New Hearth Beta Request from ${name}`);

            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setStatus("success");
            } else {
                console.error("Web3Forms Error:", data);
                setErrorMessage("Something went wrong. Please try again.");
                setStatus("error");
            }
        } catch (error) {
            console.error("Submission Error:", error);
            setErrorMessage("Network error. Please try again.");
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 md:p-12 rounded-[2.5rem] shadow-xl shadow-coral/10 border-2 border-green-100 max-w-lg mx-auto"
            >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Check className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-charcoal mb-4 font-outfit">Welcome Home, {name.split(' ')[0]}! 🏡</h3>
                <p className="text-charcoal/60 text-lg mb-8 leading-relaxed">
                    We've received your request. An invite will be sent to <strong>{email}</strong> from <em>The Hearth Team</em> soon.
                </p>
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => { setStatus("idle"); setName(""); setEmail(""); setErrorMessage(""); }}
                        className="text-sm text-charcoal/40 hover:text-charcoal"
                    >
                        Register another partner?
                    </Button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 text-left bg-white/50 backdrop-blur-md p-8 rounded-[3rem] border border-white max-w-5xl mx-auto shadow-xl shadow-coral/5">

            {/* Left Col: Poll */}
            <div className="flex flex-col">
                <h3 className="text-xl font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-coral/10 text-coral flex items-center justify-center text-sm font-bold shadow-sm">1</span>
                    What features matter to you?
                </h3>
                <div className="grid grid-cols-1 gap-3">
                    {features.map((feature) => (
                        <button
                            key={feature.id}
                            type="button"
                            onClick={() => toggleFeature(feature.id)}
                            className={cn(
                                "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left group relative overflow-hidden",
                                selectedFeatures.includes(feature.id)
                                    ? "border-coral bg-white shadow-md shadow-coral/10"
                                    : "border-transparent bg-white/60 hover:bg-white hover:scale-[1.01]"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                                selectedFeatures.includes(feature.id)
                                    ? "border-coral bg-coral text-white"
                                    : "border-charcoal/10 group-hover:border-coral/40"
                            )}>
                                {selectedFeatures.includes(feature.id) && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <span className="text-2xl">{feature.icon}</span>
                            <span className={cn(
                                "font-bold text-lg",
                                selectedFeatures.includes(feature.id) ? "text-charcoal" : "text-charcoal/60"
                            )}>{feature.label}</span>
                        </button>
                    ))}

                    {/* Custom Feature Option */}
                    <div className={cn(
                        "rounded-2xl border-2 transition-all duration-200 bg-white/60 focus-within:bg-white focus-within:border-coral/50 focus-within:shadow-md",
                        showCustomInput ? "border-coral/50 bg-white" : "border-transparent"
                    )}>
                        <button
                            type="button"
                            onClick={toggleCustomInput}
                            className="w-full flex items-center gap-4 p-4 text-left"
                        >
                            <div className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                                showCustomInput ? "border-coral bg-coral text-white" : "border-charcoal/10"
                            )}>
                                {showCustomInput ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-charcoal/40" />}
                            </div>
                            <span className={cn(
                                "font-bold text-lg flex-1",
                                showCustomInput ? "text-charcoal" : "text-charcoal/60"
                            )}>Something else?</span>
                        </button>

                        <AnimatePresence>
                            {showCustomInput && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden px-4 pb-4 pl-[3.5rem]"
                                >
                                    <input
                                        type="text"
                                        value={customFeature}
                                        onChange={(e) => setCustomFeature(e.target.value)}
                                        placeholder="e.g. Apple Watch App..."
                                        className="w-full bg-charcoal/5 px-4 py-2 rounded-xl text-base text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-coral/20"
                                        autoFocus
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Right Col: Email Form */}
            <div className="flex flex-col">
                <h3 className="text-xl font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-coral/10 text-coral flex items-center justify-center text-sm font-bold shadow-sm">2</span>
                    Claim your invite
                </h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 h-full">
                    <div className="space-y-4 flex-1">
                        {/* Name Input */}
                        <div className="relative group">
                            <label className="text-xs font-bold text-charcoal/40 uppercase tracking-wider ml-1 mb-1 block">Your Name</label>
                            <input
                                name="name"
                                type="text"
                                placeholder="e.g. Alex"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full bg-white px-5 py-4 rounded-xl border-2 border-charcoal/5 text-lg font-medium text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:border-coral transition-colors shadow-sm group-hover:border-charcoal/10"
                            />
                        </div>

                        {/* Email Input */}
                        <div className="relative group">
                            <label className="text-xs font-bold text-charcoal/40 uppercase tracking-wider ml-1 mb-1 block">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="alex@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-white px-5 py-4 rounded-xl border-2 border-charcoal/5 text-lg font-medium text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:border-coral transition-colors shadow-sm group-hover:border-charcoal/10"
                            />
                        </div>

                        {/* Explanation Note */}
                        <div className="bg-blue-50/50 p-3 rounded-xl flex items-start gap-3 border border-blue-100/50">
                            <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                            <p className="text-xs text-blue-900/60 leading-relaxed">
                                <strong>Why email?</strong> We (the founders) personally read every response. Use your best email so we can send your invite directly.
                            </p>
                        </div>

                        {status === "error" && (
                            <div className="bg-red-50 p-3 rounded-xl flex items-center gap-2 text-red-600 text-sm font-bold animate-pulse">
                                <Info className="w-4 h-4" /> {errorMessage}
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <Button
                            size="xl"
                            disabled={status === "loading" || !email || !name}
                            className={cn(
                                "w-full py-6 text-lg shadow-xl shadow-coral/20 hover:shadow-2xl hover:shadow-coral/30 transition-all duration-300",
                                (status === "loading" || (!email || !name)) && "opacity-80",
                                status === "loading" && "cursor-wait"
                            )}
                        >
                            {status === "loading" ? (
                                <span className="flex items-center gap-2 animate-pulse">
                                    <Sparkles className="w-5 h-5 animate-spin" /> Sending to Founder...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Send Request <ArrowRight className="w-5 h-5" />
                                </span>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
