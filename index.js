#!/usr/bin/env node

const chalk = require('chalk')
const path = require('path')
const { listOptions, getOptions } = require('./commands/options')

const [, , ...userArguments] = process.argv

if (userArguments.length < 1) exitTerminal('Enter an option argument')
else if (userArguments.length < 2) exitTerminal('Enter a valid name')

const [option, name] = userArguments
const options = getOptions()

if (options.includes(option)) {
  const create = require(path.join(__dirname, `/commands/${option}/index.js`))
  create(name)
} else {
  listOptions()
  exitTerminal('Option not found')
}

function exitTerminal (message) {
  console.error(chalk.red(message))
  process.exit()
}
