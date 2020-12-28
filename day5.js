const {
  pipe,
  filter,
  sort,
  map,
  head,
  split,
  splitAt,
  reduce,
  max,
} = require('ramda')

const { readFile } = require('./utils')

const input = readFile('./5.input.txt').map((contents) => contents.split('\n'))

const sliceFront = (items) => items.slice(0, items.length / 2)
const sliceBack = (items) => items.slice(items.length / 2)

const findSeatPart = (frontKey = 'F') => (boardingPass) => {
  const seatParts = [...Array(frontKey === 'F' ? 128 : 8).keys()]

  return pipe(
    split(''),
    reduce(
      (acc, frontOrBack) =>
        frontOrBack === frontKey ? sliceFront(acc) : sliceBack(acc),
      seatParts,
    ),
    head,
  )(boardingPass)
}

const findRow = findSeatPart('F')
const findColumn = findSeatPart('L')

const findSeatId = (boardingPass) => {
  const [rowPass, columnPass] = splitAt(7)(boardingPass)
  return findRow(rowPass) * 8 + findColumn(columnPass)
}

const getSeatIds = map(findSeatId)

const star1 = input.map(getSeatIds).map(reduce(max, -Infinity))

const star2 = input.map(getSeatIds).map((ids) => {
  return pipe(
    filter((x) => ids.indexOf(x - 1) === -1 && ids.indexOf(x - 2) !== -1),
    map((x) => x - 1),
    head,
  )(ids)
})

module.exports = {
  star1,
  star2,
}
