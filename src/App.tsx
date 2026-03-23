import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Colors,
  Legend,
  LinearScale,
  PieController,
  Title,
  Tooltip,
} from "chart.js";
import { Navbar } from "./components/Navbar";
import { ModelTrainingView } from "./views/ModelTrainingView";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PieController,
  ArcElement,
  Colors,
  // Title,
  Tooltip,
  // Legend,
);

function App() {
  return (
    <>
      <Navbar />
      <div className="px-8 py-4">
        <ModelTrainingView />
      </div>
    </>
  );
}

export default App;
