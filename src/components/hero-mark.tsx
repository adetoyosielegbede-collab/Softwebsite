export function HeroMark() {
  return (
    <div className="hero-haze pointer-events-none absolute inset-x-0 top-[16%] flex justify-center md:top-[18%]" aria-hidden>
      <div className="flex items-center">
        <span className="orb orb-signal" />
        <span className="bridge" />
        <span className="orb orb-accent" />
      </div>
    </div>
  );
}
