import TourManager from './TourManager'
import Tour from './Tour'
import City from './City'
import {randCoordinate} from './utils'

// Calculate the acceptance probability
function acceptanceProbability (energy, newEnergy, temp) {
  const diff = newEnergy - energy
  // If the new solution is better, accept it
  // If the new solution is worse, calculate an acceptance probability
  return diff < 0 || Math.exp(-diff/temp) > Math.random()
}

const coolingRate = 0.003 // Cooling rate

export function simulatedAnnealing (points) {
  const tourManager = new TourManager()

  // Create and add cities to tour manager from points
  points.forEach((point, index) => {
    const city = new City(point, index)
    tourManager.addCity(city)
  })

  // Initialize initial solution
  let currentSolution = new Tour(tourManager)
  currentSolution.generateIndividual()

  // Set as current best
  let best = new Tour(tourManager, currentSolution.getTour())

  return {
    best,
    currentSolution,
    tourManager,
    temp: 10000
  }
}

function createNeighbor (tourManager, currentSolution) {
  let newSolution = new Tour(tourManager, currentSolution.getTour());

  for (let i = 0; i < 1; i++) {
    // Get a random positions in the tour
    let tourPos1 = randCoordinate(newSolution.tourSize())
    let tourPos2 = randCoordinate(newSolution.tourSize())


    // Get the cities at selected positions in the tour and swap them
    newSolution.swapCities(tourPos1, tourPos2)
  }

  return newSolution
}

export function annealLoop (props) {
  // Create new neighbour tour
  const tourManager = props.tourManager
  let currentSolution = props.currentSolution
  const newSolution = createNeighbor(tourManager, currentSolution)
  let best = props.best

  // Get energy of solution
  let currentEnergy = currentSolution.getDistance()
  let neighborEnergy = newSolution.getDistance()

  // Decide if we should accept the neighbour
  if (acceptanceProbability(currentEnergy, neighborEnergy, props.temp)) {
    currentSolution = new Tour(tourManager, newSolution.getTour())
  }

  // Keep track of the best solution found
  if (currentSolution.getDistance() < best.getDistance()) {
    best = new Tour(tourManager, currentSolution.getTour())
  }

  return {
    best,
    distance: best.getDistance(),
    currentSolution,
    tourManager,
    temp: props.temp *= 1- coolingRate, // Cool system
    points: best.getTour().map(city => city.point)
  }
}