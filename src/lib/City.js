import {distance} from './utils'

export default class City {
  constructor (point, index) {
    this.x = point && point.x
    this.y = point && point.y
    this.index = index
    this.point = point && point
  }

  getX () {
    return this.x
  }

  getY () {
    return this.y
  }

  distanceTo (city) {
    if (!city) {
    }
    return distance(this.point, city.point)
  }

  computeDistancesPairs(cities) {
    const distances_pair = []

    cities.forEach((fromCity) => {
      distances_pair.push(new Array(fromCity.index))

      cities.slice(0, fromCity.index).forEach((toCity) => {
        distances_pair[fromCity.index][toCity.index] = fromCity.distanceTo(toCity)
      })
    })

    return distances_pair
  }

  toString () {
    return this.getX() + ", " + this.getY()
  }
}