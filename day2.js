const { readFile } = require('./utils')
const { length, pipe, filter } = require('ramda')

const input = readFile('./2.input.txt')
  .map((contents) => contents.trim().split('\n'))
  .map((entries) =>
    entries.map((entry) => {
      const [range, letter, value] = entry.split(' ')
      const [min, max] = range.split('-').map(Number)

      return {
        min,
        max,
        letter: letter[0],
        value: value.split(''),
      }
    })
  )

const star1 = input
  .map((passwords) =>
    passwords.filter((p) => {
      const { min, max, letter, value } = p
      const lettersFound = pipe(
        filter((x) => x === letter),
        length
      )(value)

      return lettersFound >= min && lettersFound <= max
    })
  )
  .map(length)

const star2 = input
  .map((passwords) =>
    passwords.filter((p) => {
      const { min, max, letter, value } = p

      return value[min - 1] === letter
        ? value[max - 1] !== letter
        : value[max - 1] === letter
    })
  )
  .map(length)

module.exports = {
  star1,
  star2,
}
