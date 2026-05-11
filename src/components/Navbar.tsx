import { Link } from "@tanstack/react-router";
import { Separator } from "./Separator";

export const Navbar = (props: {}) => {
  return (
    <>
      <div className="flex gap-4 px-8 py-2">
        <Link to="/">Inicio</Link>
        <Link to="/tutorial">Tutorial</Link>
        <a>Ponte a prueba</a>
      </div>
      <Separator />
    </>
  );
};
