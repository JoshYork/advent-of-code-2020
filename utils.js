const Task = require('data.task')
const fs = require('fs')

const Product = (x) => ({
  x,
  fold: (f) => f(x),
  concat: (other) => Product(x * other.x),
})

Product.empty = () => Product(1)

module.exports.Product = Product

module.exports.readFile = (filename, encoding = 'utf-8') => {
  return new Task((reject, result) => {
    return fs.readFile(filename, encoding, (err, contents) =>
      err ? reject(error) : result(contents)
    )
  })
}
