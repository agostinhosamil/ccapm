type Config = {
  pathPrefix: string
  urlPrefix: string
}

export const config: Config = {
  get pathPrefix() {
    return '/hiya'
  },

  get urlPrefix() {
    return window.location.origin + this.pathPrefix
  }
}
