import { IconType } from 'react-icons';
import {
  SiPython, SiCplusplus, SiTypescript, SiJavascript, SiMysql, SiGnubash, SiLatex,
  SiPytorch, SiTensorflow, SiScikitlearn, SiOpencv, SiPandas, SiNumpy,
  SiKeras, SiRay, SiMlflow,
  SiReact, SiNextdotjs, SiFastapi, SiFlask, SiNodedotjs,
  SiDocker, SiGit, SiGithub, SiAmazonwebservices, SiGooglecloud,
  SiLinux, SiApachespark, SiApacheairflow, SiRedis, SiPostgresql,
  SiJenkins, SiGithubactions, SiJupyter, SiVim, SiWeightsandbiases
} from 'react-icons/si';
import { TbBrandOpenai, TbCloud } from 'react-icons/tb';
import { FaCode, FaJava } from 'react-icons/fa';
import { DiVisualstudio } from 'react-icons/di';

export interface TechItem {
  name: string;
  icon: IconType;
  category: "language" | "ml" | "web" | "tools";
  color: string;
}

export const techStack: TechItem[] = [
  // Languages
  { name: "Python", icon: SiPython, category: "language", color: "#3776AB" },
  { name: "C++", icon: SiCplusplus, category: "language", color: "#00599C" },
  { name: "Java", icon: FaJava, category: "language", color: "#007396" },
  { name: "TypeScript", icon: SiTypescript, category: "language", color: "#3178C6" },
  { name: "JavaScript", icon: SiJavascript, category: "language", color: "#F7DF1E" },
  { name: "SQL", icon: SiMysql, category: "language", color: "#CC2927" },
  { name: "Bash", icon: SiGnubash, category: "language", color: "#4EAA25" },
  { name: "LaTeX", icon: SiLatex, category: "language", color: "#008080" },

  // ML/AI Frameworks & Libraries
  { name: "PyTorch", icon: SiPytorch, category: "ml", color: "#EE4C2C" },
  { name: "TensorFlow", icon: SiTensorflow, category: "ml", color: "#FF6F00" },
  { name: "Hugging Face", icon: TbBrandOpenai, category: "ml", color: "#FFD21E" },
  { name: "scikit-learn", icon: SiScikitlearn, category: "ml", color: "#F7931E" },
  { name: "OpenCV", icon: SiOpencv, category: "ml", color: "#5C3EE8" },
  { name: "Pandas", icon: SiPandas, category: "ml", color: "#E70488" },
  { name: "NumPy", icon: SiNumpy, category: "ml", color: "#013243" },
  { name: "Keras", icon: SiKeras, category: "ml", color: "#D00000" },
  { name: "ONNX", icon: FaCode, category: "ml", color: "#005CED" },
  { name: "Ray", icon: SiRay, category: "ml", color: "#028CF0" },
  { name: "Transformers", icon: TbBrandOpenai, category: "ml", color: "#FFD21E" },
  { name: "LangChain", icon: FaCode, category: "ml", color: "#00A67E" },
  { name: "Weights & Biases", icon: SiWeightsandbiases, category: "ml", color: "#FFBE00" },
  { name: "MLflow", icon: SiMlflow, category: "ml", color: "#0194E2" },
  { name: "Stable Diffusion", icon: TbBrandOpenai, category: "ml", color: "#8B5CF6" },

  // Web Development
  { name: "React", icon: SiReact, category: "web", color: "#61DAFB" },
  { name: "Next.js", icon: SiNextdotjs, category: "web", color: "#000000" },
  { name: "FastAPI", icon: SiFastapi, category: "web", color: "#009688" },
  { name: "Flask", icon: SiFlask, category: "web", color: "#000000" },
  { name: "Node.js", icon: SiNodedotjs, category: "web", color: "#339933" },
  { name: "REST API", icon: FaCode, category: "web", color: "#009688" },

  // Tools & Infrastructure
  { name: "Docker", icon: SiDocker, category: "tools", color: "#2496ED" },
  { name: "Git", icon: SiGit, category: "tools", color: "#F05032" },
  { name: "GitHub", icon: SiGithub, category: "tools", color: "#181717" },
  { name: "AWS", icon: SiAmazonwebservices, category: "tools", color: "#FF9900" },
  { name: "GCP", icon: SiGooglecloud, category: "tools", color: "#4285F4" },
  { name: "Azure", icon: TbCloud, category: "tools", color: "#0078D4" },
  { name: "Linux", icon: SiLinux, category: "tools", color: "#FCC624" },
  { name: "Apache Spark", icon: SiApachespark, category: "tools", color: "#E25A1C" },
  { name: "Airflow", icon: SiApacheairflow, category: "tools", color: "#017CEE" },
  { name: "Redis", icon: SiRedis, category: "tools", color: "#DC382D" },
  { name: "PostgreSQL", icon: SiPostgresql, category: "tools", color: "#336791" },
  { name: "Jenkins", icon: SiJenkins, category: "tools", color: "#D24939" },
  { name: "GitHub Actions", icon: SiGithubactions, category: "tools", color: "#2088FF" },
  { name: "Jupyter", icon: SiJupyter, category: "tools", color: "#F37626" },
  { name: "VS Code", icon: DiVisualstudio, category: "tools", color: "#007ACC" },
  { name: "Vim", icon: SiVim, category: "tools", color: "#019733" },
];

export const categoryLabels: Record<TechItem["category"], string> = {
  language: "Languages",
  ml: "ML & AI",
  web: "Web Development",
  tools: "Tools & Infrastructure",
};
