import { JOURNEY, scrollToId } from "../../data/journey";

export default function ProgressRail({ active }: { active: string }) {
  return (
    <div className="progress-rail" aria-hidden="true">
      {JOURNEY.map((s) => (
        <button
          key={s.id}
          className="progress-tick"
          data-active={active === s.id}
          onClick={() => scrollToId(s.id)}
          tabIndex={-1}
        >
          <span className="tick-label">
            {s.index} · {s.label}
          </span>
          <span className="tick-dot" />
        </button>
      ))}
    </div>
  );
}
