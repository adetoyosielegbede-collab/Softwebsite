import { SENTINEL_HERO_DESK, SENTINEL_HERO_MOB } from "@/components/site/sentinel-hero-svgs";
import "@/components/site/sentinel-page.css";

/** Hero three-layer diagram from softcom-sentinel.html (desk + mobile variants). */
export function SentinelHeroVisual() {
  return (
    <div className="ss-wrap">
      <div className="ss-desk" dangerouslySetInnerHTML={{ __html: SENTINEL_HERO_DESK }} />
      <div className="ss-mob" dangerouslySetInnerHTML={{ __html: SENTINEL_HERO_MOB }} />
    </div>
  );
}
