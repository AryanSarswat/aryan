import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const navLinks = [
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Work", href: "#work" },
    { name: "Skills", href: "#skills" },
    { name: "Hobbies", href: "#hobbies" },
    { name: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            // Update active section based on scroll position
            const sections = navLinks.map(link => link.href.substring(1));
            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        setActiveSection(sectionId);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ${isScrolled ? "w-[90%] md:w-auto" : "w-full md:w-auto"
                }`}
        >
            <div className={`glass px-8 md:px-12 py-4 rounded-full flex items-center gap-10 ${isScrolled ? "bg-black/40" : "bg-transparent border-transparent"
                }`}>
                <a href="#" className="text-xl font-black tracking-tighter text-white leading-tight hover:text-[var(--color-accent)] transition-colors">
                    AS<span className="text-[var(--color-accent)]">.</span>
                </a>

                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-medium transition-all hover:text-white ${activeSection === link.href.substring(1)
                                ? "text-white"
                                : "text-[var(--color-muted)]"
                                }`}
                        >
                            <div className="relative">
                                {link.name}
                                {activeSection === link.href.substring(1) && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--color-accent)]"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </div>
                        </a>
                    ))}
                </div>

                <a
                    href="/aryan/resume.pdf"
                    target="_blank"
                    className="text-sm font-medium text-[var(--color-accent)] transition-all hover:text-white"
                >
                    Resume
                </a>
            </div>
        </motion.nav>
    );
}
