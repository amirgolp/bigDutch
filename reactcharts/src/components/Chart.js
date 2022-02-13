import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';
import logo from '../logo.svg';
import '../App.css';
import axios from 'axios';

class Chart extends Component{
  constructor(props){
    super(props);
    this.state = {
      chartData: props.chartData,
      batchData:{ 
        batchName: '',
        stockingDate: '',
        animalCount: ''
      },
      sensorData:{
        sensor1:{ value: [] },
        sensor2:{ value: [] }
      },
      animalCount: [],
      dates: [0,],
      FCR: [0,],
      newReportCounter: 0
    }
    // console.log(props.)
  }

  static defaultProps = {
    displayTitle:true,
    displayLegend: true,
    legendPosition:'right',
    location:'City'
  }

  onChange(e) {
    const batchData = this.state.batchData
    this.setState({ batchData: {...batchData, [e.target.name]: e.target.value }});
  }

  async onSubmit(e){
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const body = JSON.stringify({ 
      batchName: this.state.batchData.batchName, 
      stockingDate: this.state.batchData.stockingDate, 
      animalCount: this.state.batchData.animalCount, 
    });
    
    const res = await axios.post('http://localhost:5000/api/batch', body, config);

    this.state.animalCount.push(parseInt(res.data.batch.animalCount));
    this.state.sensorData.sensor1.value.push(this.newSensor1());
    this.state.sensorData.sensor2.value.push(this.newSensor2());

    setInterval(this.sensorDataParser, 1000);
    setInterval(this.manualEntriesParser, 7000);
  };

  manualEntriesParser = () => {
    const arr = [
      this.newManualEntry(), 
      this.newManualEntry(), 
      this.newManualEntry(), 
      this.newManualEntry(), 
      this.newManualEntry(), 
      this.newManualEntry(), 
      this.newManualEntry()
    ]

    arr.forEach(el => {
      this.state.animalCount.push(this.state.animalCount.at(-1) - el);
    });
    
    const numOfLastEntries = this.state.dates.length;
    for (let index = numOfLastEntries; index < numOfLastEntries + arr.length; index++) {
      this.state.dates.push(index);
      this.state.FCR.push(
        (this.state.sensorData.sensor1.value[index]) / 
        ((this.state.sensorData.sensor2.value[index] - this.state.sensorData.sensor2.value[index-1] + 1e-8) * 
        this.state.animalCount[index])
      );
    }
    
    // console.log(this.state.FCR)
    if (numOfLastEntries > 8) {
      this.setState({newReportCounter: this.state.newReportCounter + 1})
      this.getChartData();
    }
  }

  sensorDataParser = () => {
    this.state.sensorData.sensor1.value.push(this.newSensor1());
    this.state.sensorData.sensor2.value.push(this.newSensor2());
  }

  newManualEntry = () => {
    return Math.floor(Math.random() * 20);
  }

  newSensor1 = () => { // Consider SensorId 1 as "Total feed consumption today"
    return 400 + Math.floor(Math.random() * 50) * (Math.round(Math.random()) ? 1 : -1);
  }

  newSensor2(){ // Consider SensorId 2 as "Average weight (per Bird) today"
    return 150 + Math.floor(Math.random() * 50) * (Math.round(Math.random()) ? 1 : -1);
  }

  getChartData = () => {
    // Ajax calls here
    // console.log(this.state.dates)
    // console.log(this.state.FCR)
    const end = this.state.FCR.length - 1;
    const backG = [];
    if (end > 1) {
      for (let index = 0; index < end; index++) {
        backG.push('rgba(255, 99, 132, 0.6)'); 
      }
    }
    this.setState({
      chartData:{
        labels: this.state.dates.slice(0, end),
        datasets:[
          {
            label:'FCR',
            data: this.state.FCR.slice(0, end),
            backgroundColor:backG
          }
        ]
      }
    });
  }

  render(){

    const { batchName, stockingDate, animalCount } = this.state.batchData;
    // this.setState({chartData: {...this.props.charData}})
    // console.log(this.state.chartData)
    // console.log('datasets --> ', this.state.datasets)
    // console.log('labels -->', this.state.labels)
    return (
      <div className="chart">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div>
          <form onSubmit={e => this.onSubmit(e)}>
            <div>
            <input
              type='text'
              placeholder='Batch Name'
              name='batchName'
              value={batchName}
              onChange={e => this.onChange(e)}
            />
          </div>
          <div>
            <input
              type='text'
              placeholder='Stocking Date'
              name='stockingDate'
              value={stockingDate}
              onChange={e => this.onChange(e)}
            />
          </div>
          <div>
            <input
              type='text'
              placeholder='Animal Count'
              name='animalCount'
              value={animalCount}
              onChange={e => this.onChange(e)}
            />
          </div>
          <input type='submit' value='Register' />
          </form>
        </div>
        {/* <Bar
          data={this.state.chartData}
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
        /> */}

        <Line
          data={this.state.chartData}
          options={{
            title:{
              display:this.props.displayTitle,
              text:'FCR in farm at '+this.props.location,
              fontSize:25
            },
            legend:{
              display:this.props.displayLegend,
              position:this.props.legendPosition
            }
          }}
        />

        {/* <Pie
          data={this.state.chartData}
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
        /> */}
      </div>
    )
  }
}

export default Chart;