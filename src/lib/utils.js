/**
 * Helper utils
 *
 */

export function dupe (array) {
  return array.slice()
}

export function removePoint (points, removedPoint) {
  return points.filter(point => point.x !== removedPoint.x && point.y !== removedPoint.y)
}

export function hasPoint (points, point) {
  return points.filter(el => el.x === point.x && el.y === point.y).length > 0
}

export function randCoordinate (max) {
  return Math.floor(Math.random() * (max))
}

export function distance(p1, p2) {
  return euclidean(p1.x-p2.x, p1.y-p2.y);
}

function euclidean(dx, dy) {
  return Math.sqrt(dx*dx + dy*dy);
}

export function next (array, index) {
  return index === (array.length - 1) ? array[0] : array[index + 1]
}

export function getClickLocation (e) {
  const dim = e.target.getBoundingClientRect()

  return {
    x: e.clientX - dim.left,
    y: e.clientY - dim.top
  }
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
export function shuffle (array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    let temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }

  return array
}