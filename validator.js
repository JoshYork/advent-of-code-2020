const { List } = require('immutable-ext')
const { __, equals, where, gt, lt, anyPass } = require('ramda')

const Success = (value) => ({
  value,
  isFailure: false,
  fold: (f, g) => g(value),
  concat: (other) => (other.isFailure ? other : Success(value)),
})

const Fail = (value) => ({
  value,
  isFailure: true,
  fold: (f, g) => f(value),
  concat: (other) => (other.isFailure ? other : Fail(value)),
})

const Validation = (run) => ({
  run,
  concat: (other) =>
    Validation((key, value) => {
      const result = run(key, value)
      return result.isFailure ? result : result.concat(other.run(key, value))
    }),
})

const isPresent = Validation((key, x) =>
  x && !!x.value
    ? Success(x.raw)
    : Fail([`${key} needs to be present. Received ${x}`]),
)

const isValidBirthYear = Validation((key, { value, raw }) =>
  value >= 1920 && value <= 2002
    ? Success(raw)
    : Fail([`${key} must be between 1920 and 2002. Received: ${value}`]),
)

const isValidIssueYear = Validation((key, { value }) =>
  value >= 2010 && value <= 2020
    ? Success(value)
    : Fail([`${key} must be between 2010 and 2020. Recived ${value}`]),
)

const isValidExpirationYear = Validation((key, { value }) =>
  value >= 2020 && value <= 2030
    ? Success(value)
    : Fail([`${key} must be between 2020 and 2030. Received: ${value}`]),
)

const isValidHeight = Validation((key, x) => {
  const { unit, value, raw } = x

  if (!unit || !['cm', 'in'].includes(unit)) {
    return Fail([`${key} must have unit 'cm' or 'in'. Recived ${unit || raw}`])
  }

  if (
    where(
      {
        unit: equals('cm'),
        value: anyPass([lt(__, 150), gt(__, 193)]),
      },
      x,
    )
  ) {
    return Fail([`${key} must be between 150cm and 193cm. Received ${raw}`])
  }

  if (
    where(
      {
        unit: equals('in'),
        value: anyPass([lt(__, 59), gt(__, 76)]),
      },
      x,
    )
  ) {
    return Fail([`${key} must be between 59in and 76in. Recived ${x.raw}`])
  }

  return Success(value)
})

const isValidHairColor = Validation((key, x) => {
  const [hash] = x.value
  const hexCode = x.value.slice(1)

  if (x.value[0] !== '#') {
    return Fail([`${key} must start with #. Recived ${x.raw}`])
  }

  if (!/^[0-9a-f]{6}$/i.test(hexCode)) {
    return Fail([`${key} must end in 6 characters 0-9 a-f. Recived ${x.raw}`])
  }

  return Success(x.value)
})

const isValidEyeColor = Validation((key, { value }) =>
  ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(value)
    ? Success(value)
    : Fail([
        `${key} must be one of 'amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'. Recived ${value}`,
      ]),
)

const isValidPassportId = Validation((key, { value, raw }) =>
  new RegExp('^[0-9]+$').test(value) && value.length === 9
    ? Success(value)
    : Fail([
        `${key} must be a 9 digit number. Recived ${raw} Length: ${raw.length}`,
      ]),
)

const validate = (spec, obj) =>
  List(Object.keys(spec)).foldMap(
    (key) => spec[key].run(key, obj[key]),
    Success([obj]),
  )

module.exports = {
  Success,
  Fail,
  Validation,
  validate,
  isPresent,
  isValidBirthYear,
  isValidIssueYear,
  isValidExpirationYear,
  isValidHeight,
  isValidHairColor,
  isValidEyeColor,
  isValidPassportId,
}
