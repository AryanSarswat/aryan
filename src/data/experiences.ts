export interface Experience {
  year: string;
  title: string;
  company: string;
  category: string;
  description: string;
  isCurrent?: boolean;
}

export const experiences: Experience[] = [
  {
    year: "Present",
    title: "Machine Learning Scientist II",
    company: "Expedia Group",
    category: "Industry",
    description: "Architecting LLM evaluation frameworks, developing agentic prompt engineering platforms, and leading ChatGPT MCP server integrations.",
    isCurrent: true,
  },
  {
    year: "2024",
    title: "Machine Learning Science Intern",
    company: "Expedia Group",
    category: "Internship",
    description: "Developed Image2Text pipelines using VLMs and deployed production image ranking systems generating significant revenue uplift.",
  },
  {
    year: "2024-2025",
    title: "Graduate Teaching Assistant",
    company: "Georgia Institute of Technology",
    category: "Academic",
    description: "Deep Learning course TA. Created transformer assignments, held office hours, and mentored course projects.",
  },
  {
    year: "2023-2025",
    title: "Master of Science in CS",
    company: "Georgia Institute of Technology",
    category: "Education",
    description: "GPA: 4.0/4.0. Specialization in AI, Perception, and Natural Systems.",
  },
  {
    year: "2022-2023",
    title: "Research Assistant",
    company: "A*STAR",
    category: "Research",
    description: "Developed state-of-the-art deepfake detection models and scalable video processing pipelines.",
  },
  {
    year: "2019-2023",
    title: "Bachelor of Computing",
    company: "National University of Singapore",
    category: "Education",
    description: "Distinction in AI. University Scholar Programme (Top 1%).",
  },
];
