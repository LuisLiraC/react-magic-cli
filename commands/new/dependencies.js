const DEPENDENCIES = {
  react: ['react', 'react-dom'],
  reactRouter: ['react-router-dom']
}

const DEV_DEPENDENCIES = {
  webpack: ['webpack', 'webpack-cli', 'webpack-dev-server'],
  webpackPlugins: {
    htmlWebpackPlugin: 'html-webpack-plugin',
    miniCssExtractPlugin: 'mini-css-extract-plugin',
    webpackBundleAnalyzer: 'webpack-bundle-analyzer',
    copyWebpackPlugin: 'copy-webpack-plugin',
    cleanWebpackPlugin: 'clean-webpack-plugin'
  },
  styles: {
    base: ['css-loader', 'style-loader'],
    preprocessors: {
      postcss: ['postcss-loader', 'autoprefixer'],
      sass: ['sass-loader'],
      less: ['less', 'less-loader'],
      stylus: ['stylus', 'stylus-loader']
    }
  },
  babel: [
    'babel-loader',
    '@babel/core',
    '@babel/preset-env',
    '@babel/preset-react'
  ],
  typescript: ['typescript', 'ts-loader'],
  types: {
    react: ['@types/react', '@types/react-dom']
  }
}

module.exports = {
  DEPENDENCIES,
  DEV_DEPENDENCIES
}
