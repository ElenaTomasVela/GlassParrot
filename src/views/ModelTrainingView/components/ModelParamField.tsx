import { Field, FieldLabel } from "@/components/Field";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip";
import { Info } from "lucide-react";
import type { ReactNode } from "react";

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
          <FieldLabel htmlFor={name}>
            <Info />
            {label}
          </FieldLabel>
        </TooltipTrigger>
        <TooltipContent align="start" className="block">
          {description}
        </TooltipContent>
      </Tooltip>
      {children}
    </Field>
  );
};
