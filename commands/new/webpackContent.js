/**
 * @typedef {Object} Answers
 * @property {string} packageManager
 * @property {string} language
 * @property {string} bundler
 * @property {boolean} routing
 * @property {string} stylesheet
 * @property {string[]} plugins
 */

/**
 * @param {string} contents
 * @returns {string}
 */
function replace (contents) {
  return contents
    .replace(this.importPlaceholder, this.import)
    .replace(this.usePlaceholder, this.use)
}

const WEBPACK_CONTENT = {
  HtmlWebpackPlugin: {
    dependency: 'html-webpack-plugin'
  },
  MiniCSSExtractPlugin: {
    importPlaceholder: /MINI_CSS_EXTRACT_PLUGIN_IMPORT/,
    usePlaceholder: /MINI_CSS_EXTRACT_PLUGIN_USE/,
    import: 'const MiniCssExtractPlugin = require(\'mini-css-extract-plugin\')',
    use: 'new MiniCssExtractPlugin(),',
    replace,
    dependency: 'mini-css-extract-plugin'
  },
  WebpackBundleAnalyzer: {
    importPlaceholder: /WEBPACK_BUNDLE_ANALYZER_IMPORT/,
    usePlaceholder: /WEBPACK_BUNDLE_ANALYZER_USE/,
    import: 'const BundleAnalyzerPlugin = require(\'webpack-bundle-analyzer\').BundleAnalyzerPlugin',
    use: 'new BundleAnalyzerPlugin({\n      analyzerMode: \'static\',\n      openAnalyzer: false,\n    }),',
    replace,
    dependency: 'webpack-bundle-analyzer'
  },
  CopyWebpackPlugin: {
    importPlaceholder: /COPY_WEBPACK_PLUGIN_IMPORT/,
    usePlaceholder: /COPY_WEBPACK_PLUGIN_USE/,
    import: 'const CopyPlugin = require(\'copy-webpack-plugin\')',
    use: 'new CopyPlugin({\n      patterns: [],\n    }),',
    replace,
    dependency: 'copy-webpack-plugin'
  },
  CleanWebpackPlugin: {
    importPlaceholder: /CLEAN_WEBPACK_PLUGIN_IMPORT/,
    usePlaceholder: /CLEAN_WEBPACK_PLUGIN_USE/,
    import: 'const { CleanWebpackPlugin } = require(\'clean-webpack-plugin\')',
    use: 'new CleanWebpackPlugin(),',
    replace,
    dependency: 'clean-webpack-plugin'
  }
}

/**
 * @param {string} contents
 * @param {Answers} answers
 */

function replaceOptionalPlugins (contents, { plugins }) {
  plugins.forEach(plugin => {
    contents = WEBPACK_CONTENT[plugin].replace(contents)
  })

  contents = contents.replace(/^.*(USE|IMPORT)$/gm, '')

  return contents
}

function getPluginsDependencies () {
  let plugins = {}
  for (const plugin of Object.keys(WEBPACK_CONTENT)) {
    plugins = {
      ...plugins,
      [plugin]: WEBPACK_CONTENT[plugin].dependency
    }
  }
  return plugins
}

function getPluginsNames () {
  const keys = Object.keys(WEBPACK_CONTENT)
    .filter(name => name !== 'HtmlWebpackPlugin')
  return keys
}

module.exports = {
  replaceOptionalPlugins,
  getPluginsDependencies,
  getPluginsNames
}
