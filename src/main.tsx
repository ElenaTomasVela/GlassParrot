import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { TooltipProvider } from "./components/Tooltip.tsx";
import { TourProvider } from "@reactour/tour";
import { tutorialTourSteps } from "./lib/tour/tutorialTour.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TourProvider
      steps={tutorialTourSteps}
      onClickMask={() => {}}
      className="rounded-md"
      highlightedMaskClassName="text-red-500"
      styles={{
        maskArea: (base) => ({
          ...base,
          rx: 8,
        }),
      }}
    >
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </TourProvider>
  </StrictMode>,
);
