import { createFileRoute } from "@tanstack/react-router";
import { TutorialView } from "../views/TutorialView/TutorialView";

export const Route = createFileRoute("/tutorial")({
  component: RouteComponent,
});

function RouteComponent() {
  return <TutorialView />;
}
