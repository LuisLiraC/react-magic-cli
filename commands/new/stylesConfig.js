const STYLES_CONFIG = {
  CSS: {
    import: 'import \'./styles/styles.css\'',
    extension: '.css',
    webpackRule: `
      {
        test: /\\.css$/,
        use: [
          STYLE_LOADER,
          'css-loader'
        ]
      },
    `,
    content: ''
  },
  PostCSS: {
    import: 'import \'./styles/styles.css\'',
    extension: '.css',
    webpackRule: `
      {
        test: /\\.css$/,
        use: [
          STYLE_LOADER,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      },
    `,
    content: ''
  },
  SASS: {
    import: 'import \'./styles/styles.sass\'',
    extension: '.sass',
    webpackRule: `
      {
        test: /\\.sass$/,
        use: [
          STYLE_LOADER,
          'css-loader',
          'sass-loader'
        ]
      },
    `,
    content: ''
  },
  SCSS: {
    import: 'import \'./styles/styles.scss\'',
    extension: '.scss',
    webpackRule: `
      {
        test: /\\.scss$/,
        use: [
          STYLE_LOADER,
          'css-loader',
          'sass-loader'
        ]
      },
    `,
    content: ''
  },
  LESS: {
    import: 'import \'./styles/styles.less\'',
    extension: '.less',
    webpackRule: `
      {
        test: /\\.less$/,
        use: [
          STYLE_LOADER,
          'css-loader',
          'less-loader'
        ]
      },
    `,
    content: ''
  },
  Stylus: {
    import: 'import \'./styles/styles.styl\'',
    extension: '.styl',
    webpackRule: `
      {
        test: /\\.styl$/,
        use: [
          STYLE_LOADER,
          'css-loader',
          'stylus-loader'
        ]
      },
    `,
    content: ''
  }
}

/**
 * @param {string} stylesheet
 * @param {boolean} hasMiniCssExtractPlugin
 * @returns {string}
 */

function getStylesConfig (stylesheet, hasMiniCssExtractPlugin) {
  /** @type {string} */
  let styleConfig = STYLES_CONFIG[stylesheet].webpackRule
  if (hasMiniCssExtractPlugin) {
    styleConfig = styleConfig.replace(/STYLE_LOADER/, 'MiniCssExtractPlugin.loader')
  } else {
    styleConfig = styleConfig.replace(/STYLE_LOADER/, '\'style-loader\'')
  }

  return styleConfig
}

/**
 * @param {string} stylesheet
 * @returns {string}
 */
function getStylesImport (stylesheet) {
  return STYLES_CONFIG[stylesheet].import
}

/**
 * @param {string} stylesheet
 * @returns {string}
 */
function getStylesExt (stylesheet) {
  return STYLES_CONFIG[stylesheet].extension
}

module.exports = {
  getStylesConfig,
  getStylesImport,
  getStylesExt
}
