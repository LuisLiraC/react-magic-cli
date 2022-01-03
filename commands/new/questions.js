const BUNDLERS = {
  Webpack: 'Webpack',
  Snowpack: 'Snowpack'
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
    choices: [BUNDLERS.Webpack]
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
    choices: [
      'MiniCSSExtracPlugin',
      'CleanWebpackPlugin',
      'CopyWebpackPlugin',
      'WebpackBundleAnalyzer'
    ]
  }
]

module.exports = {
  BUNDLERS,
  GENERAL_QUESTIONS,
  WEBPACK_QUESTIONS
}
