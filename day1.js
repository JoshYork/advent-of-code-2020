const { identity } = require('ramda')
const { Product, readFile } = require('./utils')
const { List } = require('immutable-ext')

const input = readFile('./1.input.txt')
  .map((contents) => contents.trim().split('\n'))
  .map((x) => x.map(Number))

const star1 = input.map((nums) =>
  List(nums)
    .filter((x) => nums.find((y) => y === 2020 - x))
    .foldMap(Product, Product.empty())
    .fold(identity)
)

const star2 = input.map((nums) =>
  List(nums)
    .filter((x) => nums.find((y) => nums.find((z) => z === 2020 - y - x)))
    .foldMap(Product, Product.empty())
    .fold(identity)
)

module.exports = {
  star1,
  star2,
}
