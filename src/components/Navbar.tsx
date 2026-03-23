import { Separator } from "./Separator"

export const Navbar = (props: {}) => {
  return (
    <>
      <div className="flex gap-4 px-8 py-2">
        <a>Inicio</a>
        <a>Tutorial</a>
        <a>Ponte a prueba</a>
      </div>
      <Separator />
    </>
  )
}
