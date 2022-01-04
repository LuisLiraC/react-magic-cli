const STYLES_CONFIG = {
  css: `
    {
      test: /\\.css$/,
      use: [
        STYLE_LOADER,
        'css-loader'
      ]
    },
  `,
  postcss: `
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
  sass: `
    {
      test: /\\.(scss|sass)$/,
      use: [
        STYLE_LOADER,
        'css-loader',
        'sass-loader'
      ]
    },
  `,
  less: `
    {
      test: /\\.less$/,
      use: [
        STYLE_LOADER,
        'css-loader',
        'less-loader'
      ]
    },
  `,
  stylus: `
    {
      test: /\\.styl$/,
      use: [
        STYLE_LOADER,
        'css-loader',
        'stylus-loader'
      ]
    },
  `
}

/**
 * @param {string} styleFormat
 * @param {boolean} hasMiniCssExtractPlugin
 * @returns {string}
 */

function getStylesConfig (styleFormat, hasMiniCssExtractPlugin) {
  /** @type {string} */
  if (styleFormat === 'scss') {
    styleFormat = 'sass'
  }

  let styleConfig = STYLES_CONFIG[styleFormat]
  if (hasMiniCssExtractPlugin) {
    styleConfig = styleConfig.replace(/STYLE_LOADER/, 'MiniCssExtractPlugin.loader')
  } else {
    styleConfig = styleConfig.replace(/STYLE_LOADER/, '\'style-loader\'')
  }

  return styleConfig
}

module.exports = getStylesConfig
