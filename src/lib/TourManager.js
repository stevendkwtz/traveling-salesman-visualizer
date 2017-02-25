export default class TourManager {
  constructor (cities = []) {
    this.destinationCities = cities
  }

  addCity (city) {
    this.destinationCities.push(city)
  }

  getCity (index) {
    return this.destinationCities[index]
  }

  numberOfCities () {
    return this.destinationCities.length
  }
}