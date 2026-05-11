import { createFileRoute } from "@tanstack/react-router";
import { ModelTrainingView } from "../views/ModelTrainingView";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ModelTrainingView />;
}
