import { Button } from "@/components/Button";
import { Field, FieldGroup } from "@/components/Field";
import FileUpload from "@/components/FileUpload/FileUpload";
import { Label } from "@/components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { Slider } from "@/components/Slider";
import { Switch } from "@/components/Switch";
import { Textarea } from "@/components/Textarea";
import H1 from "@/components/Typography";
import UnderlinedWords from "@/components/UnderlinedWords";
import { Cog, Plus, Trash } from "lucide-react";
import { Bar, Pie } from "react-chartjs-2";
import { useController } from "./ModelTrainingView.controller";
import type { ModelSmoothingType } from "@/lib/types";
import { Separator } from "@/components/Separator";

export const ModelTrainingView = (props: {}) => {
  const { data, actions } = useController();

  return (
    <div>
      <Field orientation="horizontal" className="mb-4">
        <Switch
          name="advancedMode"
          id="advancedMode"
          checked={data.isAdvancedModeEnabled}
          onCheckedChange={actions.setIsAdvancedModeEnabled}
        />
        <Label htmlFor="advancedMode">Modo avanzado</Label>
      </Field>

      {data.isAdvancedModeEnabled && (
        <>
          <H1>Configuración del modelo</H1>
          <div className="flex gap-4">
            <FieldGroup className="grid grid-cols-2 flex-1">
              <Field
                orientation="horizontal"
                className="grid grid-cols-subgrid col-span-2"
              >
                <Label
                  htmlFor="ngramSize"
                  title="Número de palabras que el modelo usará como contexto."
                >
                  Tamaño del n-grama
                </Label>
                <Slider
                  id="ngramSize"
                  min={1}
                  max={5}
                  value={[data.modelParams.ngramSize]}
                  onValueChange={actions.handleNgramSizeChange}
                />
              </Field>
              <Field
                orientation="horizontal"
                className="grid grid-cols-subgrid col-span-2"
              >
                <Label
                  htmlFor="temperature"
                  title="Cuánto preferirá el modelo desviarse de las predicciones más frecuentes. Cuanta mayor sea la temperatura, más se igualarán las probabilidades de cualquier predición."
                >
                  Temperatura
                </Label>
                <Slider
                  id="temperature"
                  min={0.1}
                  max={10}
                  step={0.1}
                  value={[data.modelParams.temperature]}
                  onValueChange={actions.handleTemperatureChange}
                />
              </Field>
              <Field
                orientation="horizontal"
                className="grid grid-cols-subgrid col-span-2"
              >
                <Label
                  htmlFor="topK"
                  title="El número de palabras más probables entre las que el modelo escogerá la siguiente predicción."
                >
                  Top-K
                </Label>
                <Slider
                  id="topK"
                  min={1}
                  max={10}
                  value={[data.modelParams.topK]}
                  onValueChange={actions.handleTopKChange}
                />
              </Field>
              <Field
                orientation="horizontal"
                className="grid grid-cols-subgrid col-span-2"
              >
                <Label
                  htmlFor="smoothing"
                  title={
                    "Otras operaciones que se aplican en las probabilidades de predecir cada palabra.\n\n" +
                    "- Back-off: Si no encuentra ninguna palabra posible a completar, intenta repetir el proceso asumiendo " +
                    "que el tamaño del n-grama es menor, hasta encontrar al menos una coincidencia.\n" +
                    "- Interpolación: Usa la probabilidad media calculada por el modelo actual y todos los que tengan " +
                    "tamaño de n-grama menor. Por ejemplo, si se aplica interpolación con tamaño de n-grama 3, se calculará " +
                    "la probabilidad a partir de la predicción con tamaños de n-grama 3, 2 y 1."
                  }
                >
                  Suavizado
                </Label>
                <Select
                  defaultValue={"backoff" as ModelSmoothingType}
                  onValueChange={actions.handleSmoothingChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="none">Ninguno</SelectItem>
                    <SelectItem value="backoff">Back-off</SelectItem>
                    <SelectItem value="interpolated">Interpolado</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
            <div className="flex-1 pl-10">
              <UnderlinedWords
                text="El sol de la mañana se alza frente el cielo"
                underlinedWords={data.modelParams.ngramSize}
              />
              ...
              <div className="h-60">
                <Bar
                  data={data.exampleData}
                  options={data.exampleChartOptions}
                />
              </div>
            </div>
          </div>
          <br />
        </>
      )}

      <H1>Entrenamiento</H1>
      <form action={actions.handleTrainingExampleSubmit}>
        <div className="flex gap-2 mb-2 not-md:flex-col">
          <div className="flex-1 flex flex-col gap-2">
            <Textarea
              className="flex-1 resize-none min-h-50"
              placeholder="Escribe texto de entrenamiento..."
              id="trainingExample"
              name="trainingExample"
              required
            />
          </div>
          <div className="border rounded-lg flex-1 p-2 flex flex-col gap-2 h-80 max-h-80 overflow-auto">
            {data.modelParams.examples.length ? (
              data.modelParams.examples.map((example, index) => (
                <div
                  key={index}
                  className="text-sm rounded-sm border px-2 py-1 flex justify-between"
                >
                  <span className="line-clamp-10">{example}</span>
                  <Button
                    className="min-h-full"
                    variant="destructive"
                    type="button"
                    onClick={() => actions.removeExample(index)}
                  >
                    <Trash />
                  </Button>
                </div>
              ))
            ) : (
              <span className="text-sm text-muted-foreground text-center self-center text-balance items-center flex h-full">
                No hay ejemplos. Añade alguno mediante el panel de la izquierda.
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between not-md:flex-col gap-2">
          <div className="flex gap-2 w-fit flex-wrap">
            <Button type="submit" variant="outline" className="w-fit">
              <Plus />
              Añadir texto
            </Button>
            <FileUpload onUploadConfirm={actions.handleUploadedFiles} />
            <Button
              type="button"
              variant="destructive"
              onClick={actions.handleDeleteAllExamples}
            >
              <Trash />
              Borrar ejemplos
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              className="w-full"
              type="button"
              onClick={actions.handleCompileModel}
              disabled={data.isTrainingButtonDisabled}
            >
              <Cog className={`${data.isTraining && "animate-spin"}`} />
              Entrenar
            </Button>
          </div>
        </div>
      </form>

      <br />

      <H1>Prueba</H1>
      <div className="flex gap-2 not-md:flex-col">
        <div className="flex flex-col gap-2">
          <Textarea
            className=""
            placeholder={
              data.model === undefined
                ? "Entrena un modelo antes de probar."
                : `Escribe al menos ${
                    data.model.smoothing === "none" ? data.model.ngramSize : 1
                  } palabras como entrada para tu modelo...`
            }
            value={data.modelInput}
            onChange={actions.handleModelInputChange}
            disabled={!data.model}
          />
          <Button
            onClick={actions.handleGenerateNextWord}
            disabled={data.isGenerateNextWordDisabled}
          >
            Generar siguiente palabra
          </Button>
        </div>
        {
          // !data.isGenerateNextWordDisabled &&
          <div className="flex flex-col gap-3 flex-1">
            <div>
              Probabilidades de siguiente palabra a partir del n-grama:{" "}
              <b>
                {!data.isGenerateNextWordDisabled &&
                  data.modelInput
                    .trim()
                    .split(" ")
                    .slice(-data.model!.ngramSize)
                    .join(" ")}
              </b>
            </div>
            <div className="flex gap-2 items-center px-4 h-full not-md:flex-col">
              <div className="flex-1 relative h-80">
                <Bar
                  data={data.nextWordBarData}
                  options={data.nextWordChartOptions}
                />
              </div>
              <div className="flex-1 relative h-80">
                <Pie
                  data={data.nextWordPieData}
                  // options={data.nextWordPieOptions}
                />
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
};
