/**
 * Holds population of tours
 **/

import Tour from './Tour'

export default class Population {
  constructor (tourManager, populationSize, initialize) {
    this.tours = [] // Holds population of tours

    for (let i = 0; i < populationSize; i++) {
      this.tours.push(null)
    }

    // If we need to initialize a population of tours, do so
    if (initialize) {
      // Loop and create individuals
      for (let i = 0; i < tourManager.numberOfCities(); i++) {
        let newTour = new Tour(tourManager)
        newTour.generateIndividual()
        this.saveTour(i, newTour)
      }
    }
  }

  // Saves a tour
  saveTour (index, tour) {
    this.tours[index] = tour
  }

  // Gets a tour from population
  getTour (index) {
    return this.tours[index]
  }

  // Gets the best tour in the population
  getFittest () {
    let fittest = this.tours[0]
    // Loop through individuals to find fittest
    for (let i = 1; i < this.populationSize(); i++) {
      let tour = this.getTour(i)
      if(fittest.getFitness() <= tour.getFitness()) {
        fittest = tour
      }
    }

    return fittest
  }

  // Gets population size
  populationSize () {
    return this.tours.length
  }
}