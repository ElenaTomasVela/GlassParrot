import { TourProvider } from "@reactour/tour";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Tooltip as ChartTooltip,
  Colors,
  LinearScale,
  PieController,
} from "chart.js";
import { Navbar } from "../components/Navbar";
import { TooltipProvider } from "../components/Tooltip";
import { tutorialTourSteps } from "../lib/tour/tutorialTour";

export const Route = createRootRoute({
  component: RootComponent,
});

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PieController,
  ArcElement,
  Colors,
  ChartTooltip,
);

function RootComponent() {
  return (
    <>
      <Navbar />
      <TourProvider
        steps={tutorialTourSteps}
        onClickMask={() => {}}
        className="max-w-lg!"
        styles={{
          popover: (base) => ({
            ...base,
            borderRadius: "var(--radius-md)",
            "--reactour-accent": "var(--primary)",
          }),
          maskArea: (base) => ({
            ...base,
            rx: 8,
          }),
        }}
      >
        <TooltipProvider>
          <div className="px-8 py-4">
            <Outlet />
          </div>
        </TooltipProvider>
      </TourProvider>
    </>
  );
}
