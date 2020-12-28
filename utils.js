const Task = require('data.task')
const fs = require('fs')

const Sum = (x) => ({
  x,
  fold: (f) => f(x),
  concat: (other) => Sum(x + other.x),
})

Sum.empty = () => Sum(0)

const Product = (x) => ({
  x,
  fold: (f) => f(x),
  concat: (other) => Product(x * other.x),
})

Product.empty = () => Product(1)

const readFile = (filename, encoding = 'utf-8') => {
  return new Task((reject, result) => {
    return fs.readFile(filename, encoding, (err, contents) =>
      err ? reject(error) : result(contents),
    )
  })
}

module.exports = {
  Sum,
  Product,
  readFile,
}
