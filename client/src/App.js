import React from 'react';
import logo from './logo.svg';
import './App.css';
import Queue from './services/Queue.js'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Tick />
        <Queue />
      </header>
    </div>
  );
}

class Tick extends React.Component{
  constructor(props){
    super(props);
    this.state = {date: new Date()};
  }
  componentDidMount(){
    this.timerId = setInterval(
      () => this.tick(), 1000
    );
  }
  
  componentWillUnmount(){
    clearInterval(this.timerId);
  }

  tick(){
    this.setState({
      date: new Date()
    });
  }

  render(){
    return (
      <div>
        <h1>Hello, mental healthcare provider!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}</h2>
      </div>
    );
  }
}

export default App;
