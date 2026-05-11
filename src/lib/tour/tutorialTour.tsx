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
    padding: 0,
    position: "center",
    content: (
      <>
        <p>
          Pero, ¿cómo va a poder el programa crear texto? La clave está en
          simplificar el objetivo. El modelo se centra únicamente en{" "}
          <b>crear la siguiente palabra</b>.
        </p>
        <br />
        <p>
          Para ello, se fija en las secuencias de palabras en sus datos de
          entrenamiento, buscando casos similares a lo que recibe en sus datos
          de entrada.
        </p>
      </>
    ),
  },
  {
    selector: "#training-data-list",
    content: (props) => (
      <>
        <p>
          Teniendo en cuenta estos datos de entrenamiento... ¿Qué palabra crees
          que usará el modelo para completar la frase "Hoy el día está"?
        </p>
        <br />
        <div className="flex gap-2 justify-around">
          <Button
            className="flex-1"
            onClick={() => props.setCurrentStep((n) => n + 1)}
          >
            Soleado
          </Button>
          <Button
            className="flex-1"
            onClick={() => props.setCurrentStep((n) => n + 1)}
          >
            Nublado
          </Button>
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
        <p>
          Parece que el modelo ha escogido la palabra "soleado". Este modelo usa
          las 3 últimas palabras de la entrada como contexto: "el día está".
        </p>
        <br />
        <p>
          Este conjunto de palabras lo denominamos <b>n-grama</b>.
        </p>
      </>
    ),
  },
  {
    selector: "#training-data-list",
    content: (
      <>
        <p>
          Podemos ver que en los primeros 3 ejemplos, ese n-grama aparece
          seguido de la palabra "soleado".
        </p>
        <br />
        <p>
          Cambiémoslo para que pueda usar otras palabras para completar la
          frase.
        </p>
      </>
    ),
  },
  {
    selector: "#training-section",
    content: (
      <>
        <p>
          Añade 2 frases más de ejemplo que contengan el n-grama "el día está"
          seguido de una palabra distinta palabra cada vez: "Nublado" y
          "lluvioso".
        </p>
        <br />
        <p>
          Para ello, escribe en el recuadro el ejemplo y haz click en el botón
          de "Añadir texto" para incluir la frase en los datos de entrenamiento.
        </p>
        <br />
        <p>
          Repite el proceso con la otra frase y, cuando termines, haz click en
          el botón de "Entrenar".
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
          ¿Qué observas? ¿Hay alguna palabra que sea elegida más que otra? ¿O
          escoge únicamente la misma todo el rato? ¿Por qué crees que es?
        </p>
      </>
    ),
  },
  {
    selector: "#prediction-area",
    content: (
      <>
        <p>
          Al haber más palabras entre las que escoger, el modelo escoge
          aleatoriamente entre ellas.
        </p>
        <br />
        <p>
          Sin embargo, no lo hace a ciegas: intenta que las palabras que
          aparecen más frecuentemente en sus datos de entrenamiento tengan
          prioridad frente a aquellas menos comunes.
        </p>
        <br />
        <p>
          En este caso, sigue habiendo más ejemplos con la palabra "soleado",
          por lo cual tiene preferencia por escogerla.
        </p>
      </>
    ),
  },
  {
    selector: "#prediction-charts",
    content: (
      <>
        Puedes ver la probabilidad de que el modelo escoja cada palabra en este
        panel de estadísticas.
      </>
    ),
  },
  {
    selector: ".none",
    padding: 0,
    position: "center",
    content: (props) => (
      <>
        <p>
          Probemos otra cosa. ¿Qué crees que pasará cuando el modelo reciba como
          entrada un n-grama que no ha visto antes?
        </p>
        <br />
        <div className="flex gap-2 justify-around flex-wrap">
          <Button
            className="flex-1"
            onClick={() => props.setCurrentStep((n) => n + 1)}
          >
            No podrá completar nada
          </Button>
          <Button
            className="flex-1"
            onClick={() => props.setCurrentStep((n) => n + 1)}
          >
            Probará con un n-grama más pequeño
          </Button>
        </div>
      </>
    ),
  },
  {
    selector: "#prediction-area",
    content: (
      <>
        <p>
          ¿Qué tal si lo comprobamos? Escribe en la caja de texto una frase que
          no esté incluida en los datos de entrenamiento pero que termine con la
          palabra "está", como por ejemplo "Veo que hoy está". ¿Puedes pulsar el
          botón?
        </p>
        <br />
        <p>
          ¡Ambos comportamientos, en realidad, podrían ser estrategias válidas!
          El modelo actual, de hecho, usa la segunda estrategia (denominada
          Back-off), con lo que puede intentar ser más flexible a la hora de
          generar palabras.
        </p>
      </>
    ),
  },
  {
    selector: "#prediction-area",
    content: (
      <>
        <p>
          Parece que el modelo sigue pudiendo realizar predicciones. Esta vez ha
          tomado como referencia la palabra "está" en vez del n-grama completo.
        </p>
        <br />
        <p>
          Aunque, quizás sería conveniente poder cambiar este comportamiento
          para tener un modelo más estricto. O quizás podríamos ver cómo se
          comporta el modelo con tamaños más grandes o pequeños de n-grama.
          ¿Cómo manejamos esto en esta herramienta?
        </p>
      </>
    ),
  },
  {
    selector: "#advancedModeSection",
    content: (
      <>
        <p>
          Este interruptor de aquí activa el modo avanzado, que te deja
          configurar el modelo a tu antojo. Prueba a activarlo.
        </p>
      </>
    ),
    resizeObservables: ["#advancedModeSection"],
  },
  {
    selector: "#advancedModeSection",
    content: (
      <>
        <p>
          Puede parecer abrumador, pero no tienes que modificar todas las
          opciones a la vez, ¡ve a tu propio ritmo!
        </p>
        <br />
        <p>
          A la derecha tienes un ejemplo de cómo afectarían los parámetros
          escogidos al comportamiento de un modelo al predecir para ayudarte a
          entender mejor su funcionamiento.
        </p>
        <br />
        <p>
          Cada parámetro, además, puede ofrecerte un texto explicativo. ¡Prueba
          a jugar con los distintos parámetros! Recuerda que se aplicarán al
          modelo una vez lo entrenes.
        </p>
      </>
    ),
    resizeObservables: ["#advancedModeSection"],
  },
  {
    selector: ".none",
    padding: 0,
    position: "center",
    content: (
      <>
        <p>
          ¡Eso es todo! Prueba a modificar los ejemplos y configuraciones a tu
          antojo, o, si quieres, puedes escoger entre algunas configuraciones
          pre-hechas.
        </p>
        <br />
        <p>Y, sobre todo, ¡diviértete!</p>
      </>
    ),
  },
];
