import { useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { FiExternalLink, FiBookOpen, FiActivity, FiLayers, FiCrosshair } from "react-icons/fi";
import type { IconType } from "react-icons";

interface WorkoutDay {
    day: string;
    type: string;
    focus: string;
    exercises: string[];
}

interface HobbyBase {
    title: string;
    icon: IconType;
    description: string;
    color: string;
}

interface ChessHobby extends HobbyBase {
    id: "chess";
    links: { name: string; href: string }[];
}

interface BuildingHobby extends HobbyBase {
    id: "building";
    projects: string[];
}

interface ReadingHobby extends HobbyBase {
    id: "reading";
    current: string;
    lastRead: string;
}

interface FitnessHobby extends HobbyBase {
    id: "fitness";
    routine: WorkoutDay[];
}

type Hobby = ChessHobby | BuildingHobby | ReadingHobby | FitnessHobby;

const hobbies: Hobby[] = [
    {
        id: "chess",
        title: "Chess",
        icon: FiCrosshair,
        description: "I enjoy deep strategy and tactical puzzles. Catch me on the board!",
        links: [
            { name: "Chess.com", href: "https://www.chess.com/member/aryansarswat" },
            { name: "Lichess", href: "https://lichess.org/@/IsMyYear2022" },
        ],
        color: "#a855f7",
    },
    {
        id: "building",
        title: "I love building random stuff",
        icon: FiLayers,
        description: "Turning 'what if' into 'here it is'. I build quirky product experiments.",
        projects: ["Next Watch Recommender", "Next Apartment Finder"],
        color: "#3b82f6",
    },
    {
        id: "reading",
        title: "Reading",
        icon: FiBookOpen,
        description: "Exploring sci-fi universes and technical deep-dives.",
        current: "Children of Time",
        lastRead: "Project Hail Mary",
        color: "#10b981",
    },
    {
        id: "fitness",
        title: "Working Out",
        icon: FiActivity,
        description: "Maintaining peak performance with a disciplined routine.",
        routine: [
            { day: "Mon", type: "Push", focus: "Chest & Shoulders", exercises: ["Bench Press", "Shoulder Press", "Machine Chest Press", "Lateral Raises", "Tricep Pushdowns"] },
            { day: "Tue", type: "Run", focus: "Cardio", exercises: ["5KM Zone 2 Run"] },
            { day: "Wed", type: "Pull", focus: "Back & Biceps", exercises: ["Pullups", "Reverse-grip barbell rows", "Machine Rows", "Machine bicep curls", "Bayesian Bicep Curls"] },
            { day: "Thu", type: "Run", focus: "Cardio", exercises: ["5KM Zone 2 Run"] },
            { day: "Fri", type: "Legs", focus: "Legs", exercises: ["Deadlifts", "Squats", "Leg Curls", "Leg Extensions"] },
        ],
        color: "#ef4444",
    },
];

export default function Hobbies() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeWorkoutDay, setActiveWorkoutDay] = useState(0);
    const { scrollXProgress } = useScroll({
        container: containerRef,
    });

    const scroll = (direction: "left" | "right") => {
        if (containerRef.current) {
            const scrollAmount = direction === "left" ? -500 : 500;
            containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <section id="hobbies" className="relative py-20 overflow-hidden">
            {/* Top Transition Blur */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--color-accent)]/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Background Decor */}
            <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-[var(--color-accent)]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="mx-auto max-w-7xl px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div>
                        <h2 className="text-5xl font-black text-white sm:text-7xl tracking-tighter mb-6">
                            Beyond the <span className="text-white/40">Code.</span>
                        </h2>
                        <p className="max-w-2xl text-lg font-medium text-[var(--color-muted)] sm:text-xl">
                            When I'm not training models, I'm usually engaged in these pursuits.
                        </p>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => scroll("left")}
                            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-all active:scale-90"
                            aria-label="Previous"
                        >
                            ←
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-all active:scale-90"
                            aria-label="Next"
                        >
                            →
                        </button>
                    </div>
                </div>

                {/* Carousel Container */}
                <div
                    ref={containerRef}
                    tabIndex={0}
                    role="region"
                    aria-label="Hobbies carousel"
                    onKeyDown={(e) => {
                        if (e.key === "ArrowLeft") scroll("left");
                        if (e.key === "ArrowRight") scroll("right");
                    }}
                    className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar scroll-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50 focus-visible:rounded-lg"
                    style={{ scrollbarWidth: 'none' }}
                >
                    {hobbies.map((hobby) => (
                        <div
                            key={hobby.id}
                            className="flex-shrink-0 w-[300px] sm:w-[500px] snap-center"
                        >
                            <div className="glass p-10 rounded-[40px] border-white/5 bg-black/40 h-full flex flex-col group transition-all duration-500 hover:border-[var(--color-accent)]/30">
                                <div className="flex items-start justify-between mb-8">
                                    <div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 relative"
                                        style={{ backgroundColor: `${hobby.color}15`, color: hobby.color }}
                                    >
                                        <motion.div
                                            className="absolute inset-0 rounded-2xl"
                                            animate={hobby.id === 'fitness' ? {
                                                boxShadow: [`0 0 0 0px ${hobby.color}40`, `0 0 0 10px ${hobby.color}00`]
                                            } : {}}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                        <hobby.icon
                                            size={32}
                                            className={`transition-transform duration-500 group-hover:rotate-12 ${hobby.id === 'fitness' ? 'animate-pulse' : ''}`}
                                        />
                                    </div>
                                </div>

                                <h3 className="text-4xl font-black text-white mb-6 tracking-tighter">
                                    {hobby.title}
                                </h3>

                                <p className="text-[var(--color-muted)] font-medium mb-10 leading-relaxed text-lg">
                                    {hobby.description}
                                </p>

                                <div className="mt-auto">
                                    {hobby.id === "chess" && (
                                        <div className="flex flex-wrap gap-4">
                                            {(hobby as ChessHobby).links.map((link) => (
                                                <a
                                                    key={link.name}
                                                    href={link.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/5 text-sm font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                                                >
                                                    {link.name} <FiExternalLink size={16} />
                                                </a>
                                            ))}
                                        </div>
                                    )}

                                    {hobby.id === "building" && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {(hobby as BuildingHobby).projects.map((item) => (
                                                <div key={item} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 group/project hover:border-blue-500/30 transition-all">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500 group-hover/project:scale-150 transition-transform" />
                                                    <span className="text-sm font-bold text-white/80">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {hobby.id === "reading" && (
                                        <div className="space-y-4">
                                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                                                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-2 font-black">Recently Finished</p>
                                                <p className="text-lg font-black text-white/90">{(hobby as ReadingHobby).lastRead}</p>
                                            </div>
                                            <div className="p-5 rounded-2xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 group-hover:bg-[var(--color-accent)]/20 transition-all">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)] font-black">Currently Reading</p>
                                                    <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                                                </div>
                                                <p className="text-lg font-black text-white">{(hobby as ReadingHobby).current}</p>
                                            </div>
                                        </div>
                                    )}

                                    {hobby.id === "fitness" && (
                                        <div className="space-y-6">
                                            {/* Vital Stats Style Grid */}
                                            <div className="flex gap-2">
                                                {(hobby as FitnessHobby).routine.map((r, i) => (
                                                    <button
                                                        key={r.day}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveWorkoutDay(i);
                                                        }}
                                                        className={`flex-1 group/day relative h-12 rounded-xl border transition-all duration-300 overflow-hidden flex flex-col items-center justify-center
                                                            ${activeWorkoutDay === i
                                                                ? "bg-red-500/20 border-red-500/40"
                                                                : "bg-white/5 border-white/5 hover:border-white/20"}`}
                                                    >
                                                        <span className={`text-[10px] font-black tracking-tighter transition-colors ${activeWorkoutDay === i ? "text-red-400" : "text-white/40 group-hover/day:text-white/60"}`}>
                                                            {r.day}
                                                        </span>
                                                        {activeWorkoutDay === i && (
                                                            <motion.div
                                                                layoutId="activeDayTab"
                                                                className="absolute bottom-0 inset-x-0 h-0.5 bg-red-500"
                                                            />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Dashboard View */}
                                            <div className="p-6 rounded-[24px] bg-red-500/5 border border-red-500/10 min-h-[160px] relative overflow-hidden group/dash">
                                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/dash:opacity-20 transition-opacity">
                                                    <FiActivity size={40} className="text-red-500" />
                                                </div>

                                                <motion.div
                                                    key={activeWorkoutDay}
                                                    initial={{ opacity: 0, x: 10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="relative z-10"
                                                >
                                                    <p className="text-[10px] uppercase tracking-[0.2em] text-red-500 font-black mb-1">
                                                        {(hobby as FitnessHobby).routine[activeWorkoutDay].type} Focus
                                                    </p>
                                                    <h4 className="text-xl font-black text-white mb-4 tracking-tight">
                                                        {(hobby as FitnessHobby).routine[activeWorkoutDay].focus}
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {(hobby as FitnessHobby).routine[activeWorkoutDay].exercises.map((ex) => (
                                                            <div key={ex} className="flex items-center gap-2">
                                                                <div className="w-1 h-1 rounded-full bg-red-500/40" />
                                                                <span className="text-sm font-bold text-white/70">{ex}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Scroll Indicator */}
                <div className="flex items-center gap-4 mt-8">
                    <div className="h-[1px] flex-1 bg-white/10 relative">
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-[var(--color-accent)]"
                            style={{ scaleX: scrollXProgress, transformOrigin: "left" }}
                        />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-muted)]">
                        Swipe to explore
                    </span>
                </div>
            </div>
        </section>
    );
}
