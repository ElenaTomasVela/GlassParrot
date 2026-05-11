import { useTour } from "@reactour/tour";
import { ModelTrainingView } from "../../views/ModelTrainingView";
import { useEffect } from "react";

export const TutorialView = () => {
  const { setIsOpen, setCurrentStep } = useTour();

  useEffect(() => {
    setCurrentStep(0);
    setIsOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ModelTrainingView defaultExample={0} />;
};
