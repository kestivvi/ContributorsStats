import './App.css';
import Form from './Form'
import Chart1 from './Chart1'
import { useState } from "react";

export default function App() {

  let [charts, setCharts] = useState([]);

  let chartsComponents = {
    "Additions based on pull requests' author": Chart1,
    "Bar": null,
    "Radar": null,
    "Doughnut": null,
    "Pie": null,
    "Polar": null,
  }

  let chart_types = Object.keys(chartsComponents);


  const onClick = async (values) => {
    // Check what type of chart user wants
    console.log(values.chartTypes)

    for (const chartType of values.selectedCharts) {
      if (chartType == "Additions based on pull requests' author") {
        setCharts(charts.concat(<Chart1 values={values} />));
      }
    }


    console.log(charts)

  };

  return (
    <div className="App">
      {/* TODO: HEADER */}
      <Form chartTypes={chart_types} onClick={onClick} />
      {charts}
    </div>
  );
}
