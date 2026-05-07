import { Button } from "@/components/Button";
import type { StepType } from "@reactour/tour";

export const tutorialTourSteps: StepType[] = [
  {
    selector: ".none",
    padding: 0,
    position: "center",
    content: (
      <>
        <p>
          <b>¡Bienvenido!</b>
        </p>
        <br />
        <p>
          En este tutorial aprenderás los conceptos básicos en los cuales se
          basan los modelos de lenguaje de Inteligencia Artificial.
        </p>
        <br />
        <p>
          En primer lugar, vayamos por encima de un ejemplo para ilustrar lo que
          realizan estos sistemas.
        </p>
      </>
    ),
  },
  {
    selector: ".none",
    padding: 0,
    position: "center",
    content: (
      <>
        Hay varios tipos de modelos que se especializan en distintas tareas,
        pero nos centraremos en aquellos cuyo objetivo es <b>generar texto</b>.
      </>
    ),
  },
  {
    selector: "#training-data-list",
    content: (
      <>
        Para ello, hacen uso de texto de referencia o, como los denominaremos
        ahora, <b>datos de entrenamiento</b>.
      </>
    ),
  },
  {
    selector: "#prediction-area",
    content: (
      <>
        Adicionalmente, usan de punto de partida otro texto, que denominaremos{" "}
        <b>datos de entrada</b>. Estos modelos intentan completar los datos de
        entrada a partir de lo que han visto mediante los datos de
        entrenamiento.
      </>
    ),
  },
  {
    selector: ".none",
    position: "center",
    padding: 0,
    content: (props) => (
      <>
        <p>
          Teniendo en cuenta estos datos de entrenamiento... ¿Qué palabra crees
          que usará el modelo para completar esta frase?
        </p>
        <br />
        <div className="flex gap-2 justify-around">
          <Button onClick={() => props.setCurrentStep((n) => n + 1)}>
            Esta palabra
          </Button>
          <Button>Esta otra palabra</Button>
        </div>
      </>
    ),
  },
  {
    selector: "#prediction-area",
    content: (
      <>
        Ejecutemos el modelo para ver si estás en lo cierto. Presiona el botón
        "Generar palabra"
      </>
    ),
  },
  {
    selector: ".none",
    padding: 0,
    position: "center",
    content: (
      <>
        Parece que el modelo ha escogido esta palabra. Este modelo usa las 3
        últimas palabras de la entrada como contexto: "". Podemos ver que en el
        segundo ejemplo, esas 3 palabras aparecen seguidas de la palabra "".
        Cambiémoslo para que pueda usar otras palabras para completar la frase.
      </>
    ),
  },
  {
    selector: "#training-section",
    content: (
      <>
        <p>
          Añade 2 frases más de ejemplo. Escribe en el recuadro el ejemplo y haz
          click en el botón de "Añadir texto" para incluir la frase en los datos
          de entrenamiento.
        </p>
        <br />
        <p>
          Haz esto otra vez más con la segunda frase y, cuando termines, haz
          click en el botón de "Entrenar".
        </p>
        <br />
        <p>
          Asegúrate de que esa secuencia de 3 palabras esté incluida en tus
          ejemplos, ¡o no podrá usar tus ejemplos!
        </p>
      </>
    ),
  },
  {
    selector: "#prediction-area",
    content: (
      <>
        <p>
          Ahora que el modelo está entrenado con nuevos datos, borra la última
          palabra y haz click en "Generar Palabra". Repite este proceso varias
          veces, contando cuántas veces decide escoger cada palabra.
        </p>
        <br />
        <p>
          ¿Qué observas? ¿Hay alguna palabra que sea elegida más que otra? ¿Por
          qué crees que es?
        </p>
      </>
    ),
  },
  {
    selector: "#prediction-area",
    content: (
      <>
        Al haber más palabras entre las que escoger, el modelo escoge
        aleatoriamente entre ellas. Sin embargo, no lo hace a ciegas: intenta
        que las palabras que aparecen más frecuentemente en sus datos de
        entrenamiento tengan prioridad frente a aquellas menos comunes.
        Dependiendo de lo que hayas puesto como ejemplo, tenderá a escoger unas
        palabras u otras.
      </>
    ),
  },
];
