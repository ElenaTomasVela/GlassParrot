import { useTour } from "@reactour/tour";
import { ModelTrainingView } from "../../views/ModelTrainingView";
import { useEffect } from "react";
import { tutorialTourSteps } from "@/lib/tour/tutorialTour";

export const TutorialView = () => {
  const { setIsOpen, setCurrentStep, setSteps } = useTour();

  useEffect(() => {
    if (setSteps) setSteps(tutorialTourSteps);
    setCurrentStep(0);
    setIsOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ModelTrainingView defaultExample={0} />;
};
