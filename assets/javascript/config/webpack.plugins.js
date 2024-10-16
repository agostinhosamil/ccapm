var webpack = require('webpack')

module.exports = [
  new webpack.SourceMapDevToolPlugin({
    filename: '../../../public/assets/javascript/application.js.map',
    append: '\n//# sourceMappingURL=/hiya/assets/javascript/application.js.map'
  })
]
