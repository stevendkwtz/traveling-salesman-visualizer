/**
 * Runs Genetic Algorithm for TSP
 **/

import TourManager from './TourManager'
import City from './City'
import Population from './Population'
import GeneticAlgorithm from './GeneticAlgorithm'

export function tspGA (points) {
  const tourManager = new TourManager()

  // Create and add cities to tour manager from points
  points.forEach((point, index) => {
    const city = new City(point, index)
    tourManager.addCity(city)
  })

  // Initialize population
  const GA = new GeneticAlgorithm(tourManager)
  const pop = new Population(tourManager, tourManager.numberOfCities(), true)

  return {
    pop,
    GA
  }
  // return evolvePopulation(pop, GA)
}

export function evolvePopulation (props) {
  const pop = props.GA.evolvePopulation(props.pop)
  const fittest = pop.getFittest()

  return {
    pop,
    GA: props.GA,
    fitness: fittest.fitness,
    distance: fittest.distance,
    points: fittest.tour.map((city) => city.point)
  }
}