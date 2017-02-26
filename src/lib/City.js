import {distance} from './utils'

export default class City {
  constructor (point) {
    this.x = point && point.x
    this.y = point && point.y
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

  toString () {
    return this.getX() + ", " + this.getY()
  }
}