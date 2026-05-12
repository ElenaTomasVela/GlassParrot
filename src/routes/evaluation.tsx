import EvaluationView from "@/views/EvaluationView/EvaluationView";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/evaluation")({
  component: RouteComponent,
});

function RouteComponent() {
  return <EvaluationView />;
}
