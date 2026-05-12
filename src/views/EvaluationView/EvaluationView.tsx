import { H1 } from "@/components/Typography";
import EvaluationQuestion from "./EvaluationQuestion";

export default function EvaluationView() {
  return (
    <>
      <H1>Ponte a prueba</H1>
      <p>
        ¡Pon a prueba tus conocimientos sobre modelos de lenguaje respondiendo
        estas preguntas!
      </p>
      <br />
      <p>
        Por defecto, se considera que los modelos tienen los siguientes
        parámetros:
      </p>
      <ul className="text-sm list-disc pl-10 mt-1">
        <li>Tamaño de n-grama: 3</li>
        <li>Temperatura: Media</li>
        <li>Top-k: 10</li>
        <li>Suavizado: Back-off</li>
      </ul>

      <br />

      <EvaluationQuestion
        id="question1"
        title="Pregunta 1"
        description="Dados los datos de entrada, ¿qué n-grama será el que el modelo use de referencia para generar la siguiente palabra?"
        inputData="Parece que hoy el cielo está"
        options={[
          "Hoy el cielo está",
          "Está",
          "El cielo está",
          "Parece que hoy el cielo está",
        ]}
        correctIndex="2"
        explanation={
          'Al tener tamaño de n-grama 3, el modelo coge las 3 últimas palabras: "El cielo está"'
        }
      />

      <br />

      <EvaluationQuestion
        id="question2"
        title="Pregunta 2"
        description="Dados estos datos de entrenamiento y datos de entrada, ¿qué palabra es más probable que sea escogida?"
        options={["Nublado", "Soleado", "Las dos aproximadamente por igual"]}
        inputData="Parece que hoy está"
        trainingData={[
          "Hoy está soleado, hace mucha calor.",
          "Ahora que por fin hoy está soleado, voy a salir a pasear.",
          "Hoy está nublado. Es posible que llueva después.",
        ]}
        correctIndex="1"
        explanation={`El tamaño del n-grama es 3, pero el n-grama "que hoy
          está" no aparece en los ejemplos. Al probar con 2 como tamaño de n-grama,
          obtenemos 2 coincidencias para "soleado" y 1 para "nublado", con lo que la
          palabra "soleado" es más probable de ser escogida.`}
      />

      <br />

      <EvaluationQuestion
        id="question3"
        title="Pregunta 3"
        description="Dados los siguientes datos de entrenamiento y los siguientes datos de entrada, ¿qué palabras puede usar el modelo?"
        options={["Nublado", "Soleado", "Ambas", "Ninguna"]}
        inputData="El cielo está"
        trainingData={[
          "Hoy está soleado, hace mucha calor.",
          "Hoy, el cielo está nublado. Es posible que llueva después.",
        ]}
        correctIndex="0"
        explanation={`El segundo ejemplo tiene una coincidencia exacta con el n-grama.
          El primero solo contribuiría a las probabilidades si el tamaño del n-grama fuese de tamaño 1
          o si el segundo ejemplo coincidiera con un n-grama de tamaño 1.`}
      />

      <br />

      <EvaluationQuestion
        id="question4"
        title="Pregunta 4"
        description="Dados los siguientes datos de entrenamiento y los siguientes datos de entrada, adicionalmente aplicando suavizado por interpolación, ¿qué palabras puede usar el modelo?"
        options={["Nublado", "Soleado", "Ambas", "Ninguna"]}
        inputData="El cielo está"
        trainingData={[
          "Hoy está soleado, hace mucha calor.",
          "Hoy, el cielo está nublado. Es posible que llueva después.",
        ]}
        correctIndex="2"
        explanation={`El suavizado por interpolación causa que se consideren las coincidencias tanto
          con el tamaño de n-grama actual como con n-gramas más pequeños. Por ello, en este caso, 
          ambos ejemplos contribuyen a las probabilidades.`}
      />

      <br />

      <EvaluationQuestion
        id="question5"
        title="Pregunta 5"
        description="Dados estos datos de entrenamiento y datos de entrada y habiendo establecido un muy alto valor de temperatura, ¿qué palabra es más probable que sea escogida?"
        options={["Nublado", "Soleado", "Las dos aproximadamente por igual"]}
        inputData="Parece que hoy está"
        trainingData={[
          "Hoy está soleado, hace mucha calor.",
          "Ahora que por fin hoy está soleado, voy a salir a pasear.",
          "Hoy está nublado. Es posible que llueva después.",
        ]}
        correctIndex="2"
        explanation={`Tenemos el mismo razonamiento que la pregunta 2, pero al
          tener una temperatura muy alta, las probabilidades de escoger cada palabra se vuelven similares.`}
      />
    </>
  );
}
