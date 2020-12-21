const Either = require('data.either')
const { List } = require('immutable-ext')
const { pipe, map, filter, length } = require('ramda')

const { readFile } = require('./utils')

const { Left, Right } = Either

const input = readFile('./4.input.txt')
  .map((contents) => contents.split('\n\n'))
  .map((entries) =>
    entries.map((entry) => entry.replace(/\n/g, ' ').split(' '))
  )
  .map((entries) =>
    entries.map((entry) =>
      entry.reduce((acc, dataStr) => {
        const [key, value] = dataStr.split(':')
        acc[key] = value
        return acc
      }, {})
    )
  )

const Success = (x) => ({
  x,
  isFailure: false,
  fold: (f, g) => g(x),
  concat: (other) => (other.isFailure ? other : Success(x)),
})

const Fail = (x) => ({
  x,
  isFailure: true,
  fold: (f, g) => f(x),
  concat: (other) => (other.isFailure ? Fail(x).concat(other.x) : Fail(x)),
})

const Validation = (run) => ({
  run,
  concat: (other) =>
    Validation((key, x) => run(key, x).concat(other.run(key, x))),
})

const isPresent = Validation((key, x) =>
  !!x ? Success(x) : Fail([`${key} needs to be present`])
)

const validate = (spec, obj) =>
  List(Object.keys(spec)).foldMap(
    (key) => spec[key].run(key, obj[key]),
    Success([obj])
  )

const isValidPassport = {
  byr: isPresent,
  iyr: isPresent,
  eyr: isPresent,
  hgt: isPresent,
  hcl: isPresent,
  ecl: isPresent,
  pid: isPresent,
}

const star1 = input.map(
  pipe(
    map((entry) => validate(isValidPassport, entry)),
    filter((validation) => !validation.isFailure),
    length
  )
)

module.exports = {
  star1,
}
