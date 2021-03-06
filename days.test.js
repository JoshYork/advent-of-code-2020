const cases = require('jest-in-case')
const { identity, map, addIndex } = require('ramda')

const {
  isPresent,
  isValidBirthYear,
  isValidHeight,
  isValidPassportId,
} = require('./validator')
const day1 = require('./day1')
const day2 = require('./day2')
const day3 = require('./day3')
const day4 = require('./day4')
const day5 = require('./day5')
const day6 = require('./day6')

const mapIndexed = addIndex(map)

const caseify = mapIndexed((options, i) => ({
  name: `day ${Math.floor(i / 2 + 1)} star ${(i % 2) + 1} = ${options.answer}`,
  ...options,
}))

cases(
  'advent of code',
  (opts, done) => {
    return opts.task.fork(console.error, (result) => {
      expect(result).toEqual(opts.answer)
      done()
    })
  },
  caseify([
    { task: day1.star1, answer: 539851 },
    { task: day1.star2, answer: 212481360 },
    { task: day2.star1, answer: 638 },
    { task: day2.star2, answer: 699 },
    { task: day3.star1, answer: 153 },
    { task: day3.star2, answer: 2421944712 },
    { task: day4.star1, answer: 206 },
    { task: day4.star2, answer: 123 },
    { task: day5.star1, answer: 832 },
    { task: day5.star2, answer: 517 },
    { task: day6.star1, answer: 6878 },
  ]),
)
