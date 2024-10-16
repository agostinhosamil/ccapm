exports.pathsToModuleNameMapper = function pathsToModuleNameMapper (paths, options = null) {
  const path = require('path')
  
  const defaultOptions = {
    prefix: path.resolve(__dirname, '..')
  }

  options = options instanceof Object ? options : defaultOptions

  if (!options.prefix) {
    options.prefix = defaultOptions.prefix
  }

  const moduleNameMapper = {}

  /**
   * path => "@components/*": ["./components/*"]
   * moduleNameMapper => '@components': path.resolve (options.prefix, 'components')
   */

  Object.keys(paths).forEach(pathKey => {
    const moduleNameMapperKey = pathKey.replace(/(\/+\*)+$/, '')

    const pathSourceList = paths[pathKey] instanceof Array ? paths[pathKey] : [paths[pathKey]]

    const moduleNameMapperSource = pathSourceList[0]?.replace(/(\/+\*)+$/, '')

    moduleNameMapper[moduleNameMapperKey] = path.resolve(options.prefix, moduleNameMapperSource)
  })

  return moduleNameMapper
}
