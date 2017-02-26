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

export function permute(permutation) {
  const length = permutation.length
  let result = new Array([0, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600][length])
  let c = new Array(length).fill(0)
  let i = 1
  let j = 1

  result[0] = permutation.slice()

  while (i < length) {
    if (c[i] < i) {
      let k = (i % 2) ? c[i] : 0
      let p = permutation[i]
      permutation[i] = permutation[k]
      permutation[k] = p
      ++c[i]
      i = 1
      result[j] = permutation.slice()
      ++j
    } else {
      c[i] = 0
      ++i
    }
  }
  return result
}