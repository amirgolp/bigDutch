import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

const LineChart = () => {
  const chartData = {}
  const [data, setChartData] = useState({});
  const chart = () => {
    setChartData({...chartData});
  };

  useEffect(() => {
    chart();
  }, []);
  return (
    <div className="App">
      <h1> Line Chart </h1>
      <div>
        <Line
          data={data}
          options={{
            title:{
              display:this.props.displayTitle,
              text:'Largest Cities In '+this.props.location,
              fontSize:25
            },
            legend:{
              display:this.props.displayLegend,
              position:this.props.legendPosition
            }
          }}
        />
      </div>
    </div>
  );
};

export default LineChart;