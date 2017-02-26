import TourManager from './TourManager'
import Tour from './Tour'
import City from './City'
import {permute} from './utils'

const tourManager = new TourManager()


export function generatePermutations (points) {

  // Create and add cities to tour manager from points
  const cities = points.map(point => new City(point))
  cities.forEach(city => tourManager.addCity(city))

  const perms = permute(cities.slice(1))
  perms.forEach(perm => perm.unshift(cities[0]))

  return perms
}

export function bruteForceIterate (props) {
  let best = new Tour(tourManager, props.best)
  const next = new Tour(tourManager, props.next)

  // Keep track of the best solution found
  if (next.getDistance() < best.getDistance()) {
    best = next
  }

  return {
    best: best.getTour(),
    distance: best.getDistance(),
    tourManager,
    points: best.getTour().map(city => city.point)
  }
}