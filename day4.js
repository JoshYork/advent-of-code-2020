const Either = require('data.either')
const { List } = require('immutable-ext')
const { pipe, map, filter, length, reduce } = require('ramda')

const {
  validate,
  isPresent,
  isValidBirthYear,
  isValidExpirationYear,
  isValidPassportId,
  isValidEyeColor,
  isValidHairColor,
  isValidHeight,
  isValidIssueYear,
} = require('./validator')
const { readFile } = require('./utils')
const { Left, Right } = Either

const numberParser = (str) => ({ value: Number(str), raw: str })
const stringParser = (str) => ({ value: str, raw: str })

const parseByKey = {
  byr: numberParser,
  iyr: numberParser,
  eyr: numberParser,
  hgt: (str) => {
    const [value, unit] = str.match(new RegExp('([0-9]+)|([a-zA-Z]+)', 'g'))

    return { value, unit, raw: str }
  },
  hcl: stringParser,
  ecl: stringParser,
  pid: stringParser,
  cid: numberParser,
}

const input = readFile('./4.input.txt')
  .map((contents) => contents.trim())
  .map((contents) => contents.split('\n\n'))
  .map((entries) =>
    entries.map((entry) => entry.replace(/\n/g, ' ').split(' ')),
  )
  .map((entries) =>
    entries.map((entry) =>
      entry.reduce((acc, dataStr) => {
        const [key, valueStr] = dataStr.split(':')

        acc[key] = parseByKey[key](valueStr)

        return acc
      }, {}),
    ),
  )

const hasRequiredKeys = {
  byr: isPresent,
  iyr: isPresent,
  eyr: isPresent,
  hgt: isPresent,
  hcl: isPresent,
  ecl: isPresent,
  pid: isPresent,
}

const getValidPassportLengthBySpec = (spec) =>
  pipe(
    map((entry) => validate(spec, entry)),
    filter((validation) => validation.isFailure === false),
    length,
  )

const star1 = input.map(getValidPassportLengthBySpec(hasRequiredKeys))

const isValidPassport = {
  byr: isPresent.concat(isValidBirthYear),
  iyr: isPresent.concat(isValidIssueYear),
  eyr: isPresent.concat(isValidExpirationYear),
  hgt: isPresent.concat(isValidHeight),
  hcl: isPresent.concat(isValidHairColor),
  ecl: isPresent.concat(isValidEyeColor),
  pid: isPresent.concat(isValidPassportId),
}

const star2 = input.map(getValidPassportLengthBySpec(isValidPassport))

module.exports = {
  star1,
  star2,
}
