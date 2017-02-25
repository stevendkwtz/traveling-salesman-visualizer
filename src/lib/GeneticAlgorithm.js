/**
 * Manages algorithms for evolving population
 **/
import Population from './Population'
import {randCoordinate} from './utils'
import Tour from './Tour'

export default class GeneticAlgorithm {
  constructor (tourManager) {
    // GA Parameters
    this.mutationRate = 0.015
    this.tournamentSize = 5
    this.elitism = true
    this.tourManager = tourManager
  }

  // Evolves a population over one generation
  evolvePopulation(pop) {
    const newPopulation = new Population(this.tourManager, pop.populationSize(), false)
    // Keep our best individual if elitism is enabled
    let elitismOffset = 0
    if (this.elitism) {
      newPopulation.saveTour(0, pop.getFittest())
      elitismOffset = 1
    }

    // Crossover population
    // Loop over the new population's size and create individuals from
    // Current population
    for (let i = elitismOffset; i < newPopulation.populationSize(); i++) {
      // Select parents
      let parent1 = this.tournamentSelection(pop)
      let parent2 = this.tournamentSelection(pop)
      // Crossover parents
      let child = this.crossover(parent1, parent2)
      // Add child to new population
      newPopulation.saveTour(i, child)
    }

    // Mutate the new population a bit to add some new genetic material
    for (let j = elitismOffset; j < newPopulation.populationSize(); j++) {
      this.mutate(newPopulation.getTour(j))
    }

    return newPopulation
  }

  // Applies crossover to a set of parents and creates offspring
  crossover (parent1, parent2) {
    // Create new child tour
    const child = new Tour(this.tourManager)

    // Get start and end sub tour positions for parent1's tour
    let startPos = randCoordinate(parent1.tourSize())
    let endPos = randCoordinate(parent1.tourSize())

    // Loop and add the sub tour from parent1 to our child
    for (let i = 0; i < child.tourSize(); i++) {
      // If our start position is less than the end position
      if (startPos < endPos && i > startPos && i < endPos) {
        child.setCity(i, parent1.getCity(i))
      } else if (startPos > endPos) { // If our start position is larger
        if (!(i < startPos && i > endPos)) {
          child.setCity(i, parent1.getCity(i))
        }
      }
    }
    // Loop through parent2's city tour
    for (let j = 0; j < parent2.tourSize(); j++) {
      // If child doesn't have the city add it
      if (!child.containsCity(parent2.getCity(j))) {
        // Loop to find a spare position in the child's tour
        for (let jj = 0; jj < child.tourSize(); jj++) {
          // Spare position found, add city
          if (!child.getCity(jj)) {
            child.setCity(jj, parent2.getCity(j))
            break
          }
        }
      }
    }

    return child
  }

  // Mutate a tour using swap mutation
  mutate (tour) {
    // Loop through tour cities
    for (let tourPos1 = 0; tourPos1 < tour.tourSize(); tourPos1++) {
      // Apply mutation rate
      if (Math.random() < this.mutationRate) {
        // Get a second random position in the tour

        let tourPos2 = randCoordinate(tour.tourSize())

        // Get the cities at target position in tour and swap them
        tour.swapCities(tourPos1, tourPos2)
      }
    }
  }

  // Selects candidate tour for crossover
  tournamentSelection (pop) {
    // Create a tournament population
    const tournament = new Population(this.tourManager, this.tournamentSize, false)
    
    // For each place in the tournament get a random candidate tour and add it
    for (let i = 0; i < this.tournamentSize; i++) {
      let randomId = randCoordinate(pop.populationSize())
      tournament.saveTour(i, pop.getTour(randomId))
    }

    // Get the fittest tour
    return tournament.getFittest()
  }
}