import {shuffle, hasPoint, dupe} from './utils'

export default class Tour {
  constructor (tourManager, tour) {
    this.tourManager = tourManager
    this.fitness = 0
    this.distance = 0
    // this.tour = tour ? tour : new Array(tourManager.numberOfCities())
    if (tour) {
      this.tour = tour
    } else {
      this.tour = new Array(tourManager.numberOfCities())
    }
    // this.tour = tour ? tour : new Array(tourManager.numberOfCities())
  }

  numberOfCities () {
    return this.tourManager.numberOfCities()
  }

  getTour () {
    return dupe(this.tour)
  }

  // Creates a random individual
  generateIndividual () {
    // Loop through all our destination cities and add them to our tour
    for (let cityIndex = 0; cityIndex < this.numberOfCities(); cityIndex++) {
      this.setCity(cityIndex, this.tourManager.getCity(cityIndex))
    }

    // Randomly reorder the tour
    this.tour = shuffle(this.tour)
  }

  // Sets a city in a certain position within a tour
  setCity (tourPosition, city) {
    this.tour[tourPosition] = city
    // If the tours been altered we need to reset the fitness and distance
    this.fitness = 0
    this.distance = 0
  }

  // Gets a city from the tour
  getCity (tourPosition) {
    return this.tour[tourPosition]
  }

  // Gets the tours fitness
  getFitness () {
   if (this.fitness === 0) {
     this.fitness = 1 / this.getDistance()
   }

   return this.fitness
  }

  // Gets the total distance of the tour
  getDistance () {
    if (this.distance === 0) {
      let tourDistance = 0
      // Loop through our tour's cities
      for (let cityIndex = 0; cityIndex < this.tourSize(); cityIndex++) {
        // Get city we're travelling from
        const fromCity = this.getCity(cityIndex)
        // City we're travelling to
        const destinationCity = this.nextCity(cityIndex)

        // Get the distance between the two cities
        tourDistance += fromCity.distanceTo(destinationCity)
      }
      this.distance = tourDistance
    }

    return this.distance
  }

  // Check we're not on our tour's last city, if we are set our
  // tour's final destination city to our starting city
  nextCity (cityIndex) {
    const nextIndex = cityIndex + 1

    if (nextIndex < this.tourSize()) {
      return this.getCity(nextIndex)
    } else {
      return this.getCity(0)
    }
  }

  // Get number of cities on our tour
  tourSize () {
    return this.tour.length
  }

 // Swaps two cities in tour to mutate
  swapCities (tourPos1, tourPos2) {
    const city1 = this.getCity(tourPos1)
    const city2 = this.getCity(tourPos2)

    this.setCity(tourPos2, city1)
    this.setCity(tourPos1, city2)
  }

  // Check if the tour contains a city
  containsCity (city) {
    return hasPoint(this.tour, city)
  }

  toString () {
    let geneString = "|"
    for (let i = 0; i < this.tourSize(); i++) {
      geneString += this.getCity(i) + "|"
    }

    return geneString
  }
}