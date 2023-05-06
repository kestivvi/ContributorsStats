import './App.css';
import Form from './Form'
import Chart1 from './Chart1'
import { useState } from "react";

export default function App() {

  let [chart, setChart] = useState("");
  let chart_types = [
    "Additions based on pull requests' author",
    "Bar",
    "Radar",
    "Doughnut",
    "Pie",
    "Polar",
  ]



  const onClick = async (values) => {
    // Check what type of chart user wants
    console.log(values.chartType)
    switch (values.chartType) {
      case "Additions based on pull requests' author":
        setChart(<Chart1 values={values} />)
        break;

      default:
        break;
    }

    // Generate that chart



  };

  return (
    <div className="App">
      {/* TODO: HEADER */}
      <Form chartTypes={chart_types} onClick={onClick} />
      {/* TODO: Wykres */}
      {chart}
    </div>
  );
}
