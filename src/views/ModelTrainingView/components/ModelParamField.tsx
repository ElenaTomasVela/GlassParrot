import { Field } from "@/components/Field";
import { Label } from "@/components/Label";
import { Slider } from "@/components/Slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip";
import { Info } from "lucide-react";
import { type Slider as SliderPrimitive } from "radix-ui";
import type { ReactNode } from "react";

interface ModelParamSliderProps extends Omit<
  React.ComponentProps<typeof SliderPrimitive.Root>,
  "value"
> {
  value: number;
  label: string;
  description: ReactNode;
}

interface ModelParamFieldProps {
  name: string;
  label: string;
  description: ReactNode;
  children: ReactNode;
}

export const ModelParamField = ({
  name,
  children,
  label,
  description,
}: ModelParamFieldProps) => {
  return (
    <Field
      orientation="horizontal"
      className="grid grid-cols-subgrid col-span-2 items-center"
    >
      <Tooltip disableHoverableContent>
        <TooltipTrigger>
          <Label htmlFor={name}>
            <Info />
            {label}
          </Label>
        </TooltipTrigger>
        <TooltipContent align="start" className="block">
          {description}
        </TooltipContent>
      </Tooltip>
      {children}
    </Field>
  );
};
