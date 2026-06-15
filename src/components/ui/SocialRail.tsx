import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { GITHUB_URL, LINKEDIN_URL, MAILTO } from "../../data/config";

const socials = [
  { name: "GitHub", href: GITHUB_URL, Icon: FiGithub },
  { name: "LinkedIn", href: LINKEDIN_URL, Icon: FiLinkedin },
  { name: "Email", href: MAILTO, Icon: FiMail },
];

export default function SocialRail() {
  return (
    <div className="social-rail">
      {socials.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          target={name === "Email" ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={name}
        >
          <Icon size={18} />
        </a>
      ))}
    </div>
  );
}
