const fs = require('fs')
const options = fs.readdirSync(__dirname, { withFileTypes: true })

function listOptions() {
  console.log('Allowed options:')
  options.forEach((option, index) => {
    if (options[index].isFile()) return
    console.log(` -- ${option.name}`)
  })
}

function getOptions() {
  return options.map(option => option.name)
}

module.exports = {
  listOptions,
  getOptions
}