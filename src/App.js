import React, { Component } from 'react';
import './css/App.css';
import AppHeaderContainer from './AppHeaderContainer'
import CanvasContainer from './CanvasContainer'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>The Traveling Salesman Problem Visualizer</h2>
        </div>
        <AppHeaderContainer />
        <CanvasContainer />
      </div>
    );
  }
}

export default App;
