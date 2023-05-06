import './App.css';
import Form from './Form'
import Chart1 from './Chart1'
import Chart2 from './Chart2'
import Chart3 from './Chart3'
import Chart4 from './Chart4'
import Chart5 from './Chart5'
import { useState } from "react";

export default function App() {

  let [charts, setCharts] = useState([]);

  let chartsComponents = {
    "Additions based on pull requests' author": Chart1,
    "Deletions based on pull requests' author": Chart2,
    "Balance based on pull requests' author": Chart3,
    "Commits per author based on pull requests'": Chart4,
    "Number of pull requests per author": Chart5,
    "Doughnut": null,
    "Pie": null,
    "Polar": null,
  }

  let chart_types = Object.keys(chartsComponents);


  const onClick = async (values) => {
    const newCharts = [];

    for (const chartType of values.selectedCharts) {
      const ChartComponent = chartsComponents[chartType];
      newCharts.push(<ChartComponent key={chartType} values={values} />);
    }

    setCharts(newCharts);
  };

  return (
    <div className="App">
      {/* TODO: HEADER */}
      <Form chartTypes={chart_types} onClick={onClick} />
      {charts}
    </div>
  );
}
