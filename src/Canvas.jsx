import React from 'react'
import {Layer, Stage} from 'react-konva'
import CanvasCircle from './CanvasCircle'
import CanvasLine from './CanvasLine'
import './css/index.css'
import FlatButton from 'material-ui/FlatButton'
import { dupe, removePoint, hasPoint, randCoordinate, next, getClickLocation } from './lib/utils'
import {tspGA, evolvePopulation} from './lib/TSP_GA'
import {simulatedAnnealing, annealLoop} from './lib/SimulatedAnnealing'
import * as types from './constants'

export default class Canvas extends React.Component {
  constructor (...args) {
    super(...args)

    this.state = {
      points: [],
      running: false
    }

    this.handleClick = this.handleClick.bind(this)
    this.createCities = this.createCities.bind(this)
    this.createLines = this.createLines.bind(this)
    this.clearPoints = this.clearPoints.bind(this)
    this.addRandomPoints = this.addRandomPoints.bind(this)
    this.runAlgorithm = this.runAlgorithm.bind(this)
    this.runSimulatedAnnealingAlgorithm = this.runSimulatedAnnealingAlgorithm.bind(this)
    this.createMapStats = this.createMapStats.bind(this)
    this.createAlgorithmStats = this.createAlgorithmStats.bind(this)

    this.timeouts = {}
  }

  handleClick (e) {
    if (this.state.running) return

    let points = dupe(this.state.points)
    const click = getClickLocation(e)

    // Remove point if user clicks on it's radius. TODO: Improve logic so user can click on surrounding pixels
    hasPoint(points, click) ? points = removePoint(points, click) : points.push(click)

    this.setState({points})
  }

  createCities (points) {
    return points.map((point, index) => {
      return (
      <CanvasCircle
        key={index}
        x={point.x}
        y={point.y}
      />
      )
    })
  }

  getLineTo (point, index) {
    const nextPoint = next(this.state.points, index)

    return {
      x: nextPoint.x - point.x,
      y: nextPoint.y - point.y
    }
  }

  createLines () {
    if (!this.state.running) return

    const points = this.state.points
    return points.map((point, index) => {
      return (
        <CanvasLine
          key={index}
          x={point.x}
          y={point.y}
          lineTo={this.getLineTo(point, index)}
        />
      )
    })
  }

  clearPoints () {
    Object.keys(this.timeouts).forEach(timeout => clearInterval(this.timeouts[timeout]))

    this.setState({points: [], running: false})
  }

  addRandomPoints (n) {
    const newPoints = []

    for (let i = 0; i < n; i++) {
      const newPoint = {
        x: randCoordinate(this.props.canvasWidth),
        y: randCoordinate(this.props.canvasHeight)
      }

      newPoints.push(newPoint)
    }

    this.setState({points: this.state.points.concat(newPoints)})
  }

  runGeneticAlgorithm () {
    let points = this.state.points
    let result = evolvePopulation(tspGA(points))

    const timeoutFunction = (generation) => {
      this.setState({ points: result.points, fitness: result.fitness, distance: Math.round(result.distance), generation})
      result = evolvePopulation({pop: result.pop, GA: result.GA})
    }


    for (let i = 1; i <= 1000; i++) {
      this.timeouts['timeout_' + i] = setTimeout(timeoutFunction.bind(null, i), (20*i))
    }
  }

  runSimulatedAnnealingAlgorithm () {
    let result = annealLoop(simulatedAnnealing(this.state.points))

    const timeoutFunction = () => {
      this.setState({ points: result.points, distance: Math.round(result.distance), running: true, temp: Math.round(result.temp) })
      result = annealLoop(result)
    }

    for (let i = 1; i <= 1000; i++) {
      this.timeouts['timeout_' + i] = setTimeout(timeoutFunction, (50*i))
    }

  }

  runBruteForceAlgorithm () {

  }

  runAlgorithm () {
    this.setState({running: true})

    switch (this.props.selectedAlgorithm) {
      case types.GENETIC:
        this.runGeneticAlgorithm()
        break
      case types.SIMULATED_ANNEALING:
        this.runSimulatedAnnealingAlgorithm()
        break
      case types.BRUTE_FORCE:
        this.runBruteForceAlgorithm()
        break
      default:
        return
    }
  }

  createAlgorithmStats () {
    switch (this.props.selectedAlgorithm) {
      case types.GENETIC:
        return 'Best value: ' + this.state.distance + '. Generation: ' + this.state.generation
      case types.SIMULATED_ANNEALING:
        return 'Best value: ' + this.state.distance + '. Temperature: ' + this.state.temp
      case types.BRUTE_FORCE:
        return ''
      default:
        return ''
    }
  }

  createMapStats () {
    const points = this.state.points

    let stats = 'There are '+ points.length + ' cities on the map. '
    if (points.length < 1) {
      stats += 'Click to add some. '
    }

    if (!this.props.selectedAlgorithm) {
      stats += 'Select an algorithm to run.'
    }
    return stats
  }


  render () {
    const lines = this.createLines()
    const stats = this.state.running ? this.createAlgorithmStats() : this.createMapStats()

    return (
      <div>
        <FlatButton label='Add 50 Random Points' onClick={this.addRandomPoints.bind(null, 50)} disabled={this.state.running}/>
        <FlatButton label='Start' primary={true} onClick={this.runAlgorithm} disabled={this.state.points.length < 3 || !this.props.selectedAlgorithm || this.props.selectedAlgorithm === types.BRUTE_FORCE}/>
        <FlatButton label='Clear All' secondary={true} onClick={this.clearPoints} />
        <p>{stats}</p>
        <div id='canvas-container' onClick={this.handleClick}>
          <Stage width={this.props.canvasWidth} height={this.props.canvasHeight}>
            <Layer>
              {lines}
              {this.createCities(this.state.points)}
            </Layer>
          </Stage>
        </div>
      </div>
    )
  }
}