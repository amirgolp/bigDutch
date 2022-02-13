import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// import LineChart from './components/LineChart';
import Chart from './components/Chart';
import axios from 'axios';
// import Horizontalchart from './components/HhorizontalChart';

class App extends Component {
  constructor(){
    super();
    this.state = {
      chartData:{},
    }
  }

  componentWillMount(){
    this.getChartData();
  }

  getChartData = () => {

    this.setState({
      chartData:{
        labels: [],
        datasets:[
          {
            label:'FCR',
            data: [],
            backgroundColor:[]
          }
        ]
      }
    });
  }

  render() {

    return (
      <div className="App">
        
        {/* <LineChart chartData={this.state.chartData} /> */}
        <Chart chartData={this.state.chartData} location="Vechta" legendPosition="bottom"/>
        {/* <Horizontalchart /> */}
      </div>
    );
  }
}

export default App;
