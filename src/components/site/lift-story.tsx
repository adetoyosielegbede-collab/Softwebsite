import { LIFT_PAGE_HTML } from "@/components/site/lift-page-html";
import "@/components/site/lift-page.css";

/** Full Lift product page replica of softcom-lift.html (diagrams + screens). */
export function LiftStory() {
  return (
    <div
      className="lift-page"
      // Static markup from the Softcom Lift HTML brief; diagrams are intentional HTML/SVG.
      dangerouslySetInnerHTML={{ __html: LIFT_PAGE_HTML }}
    />
  );
}
