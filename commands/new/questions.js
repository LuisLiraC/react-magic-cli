const { getPluginsNames } = require('./webpackContent')

const BUNDLERS = {
  Webpack: 'Webpack',
  Vite: 'Vite'
}

const GENERAL_QUESTIONS = [
  {
    name: 'language',
    type: 'list',
    message: 'Select language',
    choices: ['JavaScript', 'TypeScript']
  },
  {
    name: 'bundler',
    type: 'list',
    message: 'Select bundler',
    choices: [BUNDLERS.Webpack, BUNDLERS.Vite]
  },
  {
    name: 'routing',
    type: 'confirm',
    message: 'Would you like to add React Router?'
  },
  {
    name: 'stylesheet',
    type: 'list',
    message: 'Select stylesheet format',
    choices: [
      'CSS',
      'SCSS',
      'SASS',
      'PostCSS',
      'LESS',
      'Stylus'
    ]
  }
]

const WEBPACK_QUESTIONS = [
  {
    name: 'plugins',
    type: 'checkbox',
    message: 'What Webpack plugins will you use?',
    choices: getPluginsNames()
  }
]

const VITE_QUESTIONS = []

module.exports = {
  BUNDLERS,
  GENERAL_QUESTIONS,
  WEBPACK_QUESTIONS,
  VITE_QUESTIONS
}
