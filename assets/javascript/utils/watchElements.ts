export type WatchHandler = () => void

export function watchElements(watchHandlers: Array<WatchHandler>): void {
  function handleWatchHandlers() {
    let watchHandlerIndex = 0

    for (; watchHandlerIndex < watchHandlers.length; watchHandlerIndex++) {
      const watchHandler = watchHandlers[watchHandlerIndex]

      if (typeof watchHandler === 'function') {
        watchHandler()
      }
    }
  }

  handleWatchHandlers()

  if ('function' === typeof MutationObserver && watchHandlers instanceof Array) {
    const domChangeObserver = new MutationObserver(handleWatchHandlers)

    domChangeObserver.observe(document, {
      attributes: false,
      childList: true,
      characterData: false,
      subtree: true
    })
  }
}
