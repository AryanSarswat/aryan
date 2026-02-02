export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  techStack: string[];
  image?: string;
  link?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Cobalt: Scalable Teleoperation",
    category: "Robotics/AI",
    description: "Masters Thesis. Developed a teleoperation platform to democratize robot learning at scale using vectorized environments and load-balanced infrastructure.",
    techStack: ["Python", "Simulation", "GPU", "Robotics"],
    link: "https://cobalt-teleop.github.io/",
  },
  {
    id: 2,
    title: "Efficient Backdoor Unlearning",
    category: "LLM Security",
    description: "Explored early-stage detection and removal of backdoors in LMs utilizing SPECTRE's robust covariance estimation.",
    techStack: ["Python", "PyTorch", "LLMs", "Security"],
  },
  {
    id: 3,
    title: "Zero-Shot Adaptation Policy",
    category: "Robotics/AI",
    description: "Combined diffusion-based trajectory planners with LLM-generated loss functions for zero-shot policy adaptation in MetaWorld.",
    techStack: ["Python", "Diffusion Models", "LLMs", "Reinforcement Learning"],
  },
  {
    id: 4,
    title: "Efficient-Selection-via-Pruning",
    category: "ML Efficiency",
    description: "Novel data selection approach using model pruning and quantization for active learning, achieving 1.2-2x speed-up.",
    techStack: ["Python", "PyTorch", "Pruning", "Quantization"],
  },
  {
    id: 5,
    title: "Deep RL in 3D Connect 4",
    category: "Reinforcement Learning",
    description: "Investigated DQN, Actor-Critic, and PPO via self-play, consistently outperforming Minimax agents.",
    techStack: ["Python", "PyTorch", "DQN", "PPO"],
  },
  {
    id: 6,
    title: "Historical Document Restoration",
    category: "Computer Vision",
    description: "Trained Pix2Pix GAN to reconstruct damaged documents and fine-tuned TrOCR for improved OCR accuracy.",
    techStack: ["Python", "GANs", "Pix2Pix", "TrOCR"],
  },
];
