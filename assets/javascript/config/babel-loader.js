module.exports = {
  test: /\.m?[jt]sx?$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        '@babel/preset-env',
        '@babel/preset-typescript'
      ],
      plugins: [
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-transform-react-jsx'
        // [
        //   '@babel/plugin-transform-react-jsx',
        //   {
        //     'throwIfNamespace': false,
        //     'runtime': 'automatic',
        //     'importSource': '~/lib/jsx'
        //   }
        // ]
      ]
    }
  }
}
