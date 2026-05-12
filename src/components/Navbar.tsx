import { Link } from "@tanstack/react-router";
import { Separator } from "./Separator";
import type { ReactNode } from "react";
import LogoSvg from "/public/GlassParrot.svg";

const NavLink = ({ to, children }: { to: string; children: ReactNode }) => {
  return (
    <Link
      to={to}
      className="rounded-sm px-2.5 py-1.5 text-sm font-medium transition-all 
      hover:bg-muted focus:bg-muted focus-visible:ring-ring/50 focus-visible:outline-1 
      disabled:pointer-events-none disabled:opacity-50"
    >
      {children}
    </Link>
  );
};

export const Navbar = () => {
  return (
    <>
      <div className="flex gap-2 px-8 py-2 items-center">
        <Link to="/" className="flex items-center text-sm font-black gap-2">
          <img src={LogoSvg} className="size-10 my-1" />
          <span>GlassParrot</span>
        </Link>

        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/tutorial">Tutorial</NavLink>
        <NavLink to="/evaluation">Ponte a prueba</NavLink>
      </div>
      <Separator />
    </>
  );
};
