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
import { H1 } from "@/components/Typography";
import UnderlinedWords from "@/components/UnderlinedWords";
import type { ModelSmoothingType } from "@/lib/types";
import { useTour } from "@reactour/tour";
import { Cog, Download, Plus, Trash } from "lucide-react";
import { Bar, Pie } from "react-chartjs-2";
import { ModelParamField } from "./components/ModelParamField";
import { useController } from "./ModelTrainingView.controller";
import { dataPresets } from "@/lib/modelPresets";
import { ButtonGroup } from "@/components/ButtonGroup";

export const ModelTrainingView = ({
  defaultExample,
}: {
  defaultExample?: number;
}) => {
  const { data, actions } = useController(defaultExample);

  return (
    <div>
      <section id="advancedModeSection">
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
                <ModelParamField
                  name="ngramSize"
                  label="Tamaño del n-grama"
                  description={
                    <>
                      <p>
                        Número de palabras que el modelo usará como contexto.
                      </p>
                      <br />
                      <p>
                        Ten en cuenta que, en caso elegir alguna opción de
                        suavizado, poner valores altos hace que el entrenamiento
                        sea más lento.
                      </p>
                    </>
                  }
                >
                  <Slider
                    id="ngramSize"
                    value={[data.modelParams.ngramSize]}
                    onValueChange={actions.handleNgramSizeChange}
                    min={1}
                    max={5}
                  />
                </ModelParamField>
                <ModelParamField
                  name="temperature"
                  label="Temperatura"
                  description={
                    <>
                      <p>
                        Cuánto preferirá el modelo desviarse de las predicciones
                        más frecuentes.
                      </p>
                      <br />
                      <p>
                        Cuanta mayor sea la temperatura, más se igualarán las
                        probabilidades de cualquier predición.
                      </p>
                    </>
                  }
                >
                  <Slider
                    id="temperature"
                    min={0.1}
                    max={10}
                    step={0.1}
                    value={[data.modelParams.temperature]}
                    onValueChange={actions.handleTemperatureChange}
                  />
                </ModelParamField>
                <ModelParamField
                  name="topK"
                  label="Top-K"
                  description={
                    <>
                      El número de palabras más probables entre las que el
                      modelo escogerá la siguiente predicción.
                    </>
                  }
                >
                  <Slider
                    id="topK"
                    min={1}
                    max={10}
                    value={[data.modelParams.topK]}
                    onValueChange={actions.handleTopKChange}
                  />
                </ModelParamField>
                <ModelParamField
                  label="Suavizado"
                  name="smoothing"
                  description={
                    <div className="flex flex-col gap-2">
                      <p>
                        Otras operaciones que se aplican en las probabilidades
                        de predecir cada palabra.
                      </p>
                      <hr />
                      <dl className="grid grid-cols-[max-content_1fr] gap-2">
                        <dt className="font-bold">Back-off.</dt>
                        <dd>
                          Si no encuentra ninguna palabra posible a completar,
                          intenta repetir el proceso asumiendo que el tamaño del
                          n-grama es menor, hasta encontrar al menos una
                          coincidencia.
                        </dd>
                        <dt className="font-bold">Interpolado.</dt>
                        <dd>
                          Usa la probabilidad media calculada por el modelo
                          actual y todos los que tengan tamaño de n-grama menor.
                          Por ejemplo, si se aplica interpolación con tamaño de
                          n-grama 3, se calculará la probabilidad a partir de la
                          predicción con tamaños de n-grama 3, 2 y 1.
                        </dd>
                      </dl>
                    </div>
                  }
                >
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
                </ModelParamField>
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
      </section>

      <section id="training-section">
        <H1>Entrenamiento</H1>
        <form action={actions.handleTrainingExampleSubmit}>
          <div className="flex gap-2 mb-2 not-lg:flex-col">
            <Textarea
              className="flex-1 resize-none min-h-50"
              placeholder="Escribe texto de entrenamiento..."
              id="trainingExample"
              name="trainingExample"
              required
            />
            <div
              className="border rounded-lg flex-1 p-2 flex flex-col gap-2 h-80 max-h-80 overflow-auto"
              id="training-data-list"
            >
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
                  No hay ejemplos. Añade alguno mediante el panel de la
                  izquierda.
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-between not-md:flex-col gap-2">
            <div className="flex gap-2 w-fit flex-wrap flex-1">
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
            <div className="flex gap-2 flex-1 justify-end">
              <ButtonGroup className="flex-1">
                <Select onValueChange={actions.handleSelectedPresetChange}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Ejemplos predefinidos" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {dataPresets.map((preset, index) => (
                      <SelectItem value={index.toString()} key={index}>
                        {preset.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  type="button"
                  onClick={actions.handleLoadPreset}
                >
                  <Download />
                  Cargar ejemplo
                </Button>
              </ButtonGroup>
              <Button
                className="w-fit"
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
      </section>

      <br />

      <H1>Prueba</H1>
      <div className="flex gap-2 not-md:flex-col">
        <div className="flex flex-col gap-2 flex-1" id="prediction-area">
          <Textarea
            className=""
            placeholder={
              data.model === undefined
                ? "Entrena un modelo antes de probar."
                : `Escribe al menos ${
                    data.model.smoothing === "none"
                      ? `${data.model.ngramSize} palabras`
                      : "1 palabra"
                  } como entrada para tu modelo...`
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
          <div className="flex flex-col gap-3 flex-1" id="prediction-charts">
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
            <div className="flex gap-2 items-center px-4 h-full not-xl:flex-col">
              <div className="flex-1 relative h-80 w-full">
                <Bar
                  data={data.nextWordBarData}
                  options={data.nextWordChartOptions}
                />
              </div>
              <div className="flex-1 relative h-80">
                <Pie data={data.nextWordPieData} />
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
};
