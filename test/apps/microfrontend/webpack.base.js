// Disable the build plugin's production analytics for this local compatibility fixture.
process.env.BUILD_PLUGINS_ENV = 'development'

const path = require('node:path')

module.exports = ({ name, plugins, entry }) => ({
  mode: 'development',
  ...(entry ? { entry } : {}),
  devtool: 'source-map',
  module: {
    rules: [{ test: /\.ts$/, use: 'ts-loader' }],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `${name}.js`,
    chunkFilename: `chunks/[name]-[contenthash]-${name}.js`,
    publicPath: 'auto',
  },
  plugins,
})
