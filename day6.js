const { map, identity, uniq, length, split, pipe, reduce } = require('ramda')
const { List } = require('immutable-ext')

const { readFile, Sum } = require('./utils')

const input = readFile('./6.input.txt')
  .map((contents) => contents.trim())
  .map(split('\n\n'))
  .map(map(split('\n')))

const star1 = input
  .map(
    map(
      pipe(
        reduce((acc, x) => acc.concat(x), ''),
        split(''),
        uniq,
        length,
      ),
    ),
  )
  .map(List)
  .map((uniqueAnswers) =>
    uniqueAnswers.foldMap(Sum, Sum.empty()).fold(identity),
  )

module.exports = {
  star1,
}
