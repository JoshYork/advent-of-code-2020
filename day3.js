const { pipe, length, split, head } = require('ramda')
const { readFile } = require('./utils')

const input = readFile('./3.input.txt')
  .map((contents) => contents.trim().split('\n'))
  .map((lines) => ({
    lines,
    height: lines.length,
    patternWidth: pipe(head, split(''), length)(lines),
  }))

const calcTreesHit = (traversal) => ({ lines, height, patternWidth }) => {
  const [xTraversal, yTraversal] = traversal
  const widthNeeded = (height * xTraversal) / yTraversal
  const repeats = Math.ceil(widthNeeded / patternWidth) + 1
  const map = lines.map((x) => x.repeat(repeats).split(''))
  let currentX = 0
  let currentY = 0
  let trees = 0

  while (currentY < map.length - 1) {
    currentX += xTraversal
    currentY += yTraversal

    if (map[currentY][currentX] === '#') {
      trees += 1
    }
  }

  return trees
}

const star1 = input.map(calcTreesHit([3, 1]))

const star2 = input.map((lines) =>
  [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ]
    .map(calcTreesHit)
    .map((f) => f(lines))
    .reduce((acc, x) => acc * x, 1)
)

module.exports = {
  star1,
  star2,
}
