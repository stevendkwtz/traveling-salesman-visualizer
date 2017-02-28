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
import {generatePermutations, bruteForceIterate} from './lib/BruteForce'

export default class Canvas extends React.Component {
  constructor (...args) {
    super(...args)

    this.state = {
      points: [],
      cities: [],
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
    this.limitBruceForcePoints = this.limitBruceForcePoints.bind(this)
  }

  handleClick (e) {
    if (this.state.running) return

    let points = dupe(this.state.points)
    const click = getClickLocation(e)

    // Remove point if user clicks on it's radius. TODO: Improve logic so user can click on surrounding pixels
    hasPoint(points, click) ? points = removePoint(points, click) : points.push(click)

    this.setState({points, cities: this.createCities(points)})
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
    clearInterval(this.interval)

    this.setState({points: [], running: false, cities: []})
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

    const points = this.state.points.concat(newPoints)
    this.setState({points, cities: this.createCities(points) })
  }

  runGeneticAlgorithm () {
    let points = this.state.points
    let result = evolvePopulation(tspGA(points))

    let generation = 1
    const intervalFunction = () => {
      this.setState({ points: result.points, fitness: result.fitness, distance: Math.round(result.distance), generation})
      result = evolvePopulation({pop: result.pop, GA: result.GA})
      generation++
    }

    this.interval = setInterval(intervalFunction, 20)
  }

  runSimulatedAnnealingAlgorithm () {
    let result = annealLoop(simulatedAnnealing(this.state.points))

    const intervalFunction = () => {
      this.setState({ points: result.points, distance: Math.round(result.distance), running: true, temp: result.temp.toFixed(3) })
      result = annealLoop(result)
    }

    this.interval = setInterval(intervalFunction, (20))
  }

  limitBruceForcePoints () {
    const points = this.state.points.slice(0,10)
    this.setState({points, cities: this.createCities(points)})

    return points
  }

  runBruteForceAlgorithm () {
    const points = this.limitBruceForcePoints()
    const perms = generatePermutations(points)
    let best = perms[0]
    let result

    let generation = 0
    const intervalFunction = () => {
      result = bruteForceIterate({best, next: perms[generation]})
      best = result.best
      generation++
      this.setState({ points: result.points, distance: Math.round(result.distance), generation})
    }



    this.interval = setInterval(intervalFunction, 20)
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
        return 'Best value: ' + this.state.distance + '. Generation: ' + this.state.generation + '. Number of Points: ' + this.state.points.length
      case types.SIMULATED_ANNEALING:
        return 'Best value: ' + this.state.distance + '. Temperature: ' + this.state.temp + '. Number of Points: ' + this.state.points.length
      case types.BRUTE_FORCE:
        return 'Best value: ' + this.state.distance + '. Iteration: ' + this.state.generation + '. Number of Points: ' + this.state.points.length
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
        <FlatButton label='Add 10 Random Points' onClick={this.addRandomPoints.bind(null, 10)} disabled={this.state.running}/>
        <FlatButton label='Start' primary={true} onClick={this.runAlgorithm} disabled={this.state.points.length < 3 || !this.props.selectedAlgorithm}/>
        <FlatButton label='Clear All' secondary={true} onClick={this.clearPoints} />
        <p>{stats}</p>
        <div id='canvas-container' onClick={this.handleClick}>
          <Stage width={this.props.canvasWidth} height={this.props.canvasHeight}>
            <Layer>
              {lines}
              {this.state.cities}
            </Layer>
          </Stage>
        </div>
      </div>
    )
  }
}