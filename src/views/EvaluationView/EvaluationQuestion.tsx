import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Label } from "@/components/Label";
import { RadioGroup, RadioGroupItem } from "@/components/RadioGroup";
import { H2 } from "@/components/Typography";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Props = {
  id: string;
  title: string;
  description: string;
  options: string[];
  inputData?: string;
  correctIndex: string;
  explanation: string;
  trainingData?: string[];
};

export default function EvaluationQuestion({
  id,
  title,
  description,
  options,
  inputData,
  trainingData,
  correctIndex,
  explanation,
}: Readonly<Props>) {
  const [chosenAnswer, setChosenAnswer] = useState<string | undefined>(
    undefined,
  );
  const isAnswered = chosenAnswer !== undefined;
  const isCorrect = chosenAnswer == correctIndex;

  const onFormSubmit = (data: FormData) => {
    setChosenAnswer(data.get("question")?.toString());
  };

  return (
    <form action={onFormSubmit}>
      <H2>{title}</H2>
      <p className="mb-2">{description}</p>

      <div className="flex gap-2">
        {trainingData && (
          <div className="flex-1 flex flex-col gap-1">
            <b className="text-sm">Datos de entrenamiento</b>
            <div className="border rounded-lg flex-1 p-2 text-sm flex flex-col gap-2">
              {trainingData.map((value) => (
                <p
                  key={value}
                  className="border border-input rounded-md py-1 px-2"
                >
                  {value}
                </p>
              ))}
            </div>
          </div>
        )}
        {inputData && (
          <div className="flex-1 flex flex-col gap-1">
            <b className="text-sm">Datos de entrada</b>
            <div className="border rounded-lg flex-1 p-2 text-sm">
              {inputData}
            </div>
          </div>
        )}
      </div>

      <RadioGroup className="w-fit min-w-1/3 mt-4" name="question" required>
        {options.map((value, index) => {
          const needsHighlight =
            isAnswered && index.toString() === correctIndex;

          return (
            <Field key={value} orientation="horizontal">
              <RadioGroupItem
                value={index.toString()}
                id={`${id}-${index}`}
                className={cn([
                  "transition",
                  needsHighlight && "ring-2 ring-success",
                ])}
              />
              <Label
                htmlFor={`${id}-${index}`}
                className={cn([
                  "transition",
                  needsHighlight && "text-success border-success",
                ])}
              >
                {value}
              </Label>
            </Field>
          );
        })}
      </RadioGroup>

      <Button className="my-4">Enviar</Button>

      {isAnswered && (
        <div className="text-sm flex flex-col gap-1 border border-input rounded-lg p-2">
          <b className={isCorrect ? "text-success" : "text-destructive"}>
            {" "}
            {isCorrect ? "¡Muy bien!" : "Vaya, parece ser que no..."}
          </b>
          <p className="ml-3">{explanation}</p>
        </div>
      )}
    </form>
  );
}
