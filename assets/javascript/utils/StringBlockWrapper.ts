import { regReplaceCallback, subStrReplace } from "."

export class StringBlockWrapper {
  /**
   * @var Array<string> store
   * 
   * The store of all wrapped blocks
   * 
   */
  private static store: Array<string> = []

  /**
   * @var RegExp
   * 
   * block regular expression
   * 
   */
  public static readonly re: RegExp = /::#block:([0-9]+):/

  /**
   * @method string
   * 
   * wrap whole the blocks inside a given peace of code
   * 
   */
  public wrap(code: string): string {
    let i = 0

    const re = /([({[])/ // /([\(\{\[])/

    const blocksMap = {
      '(': ')',
      '[': ']',
      '{': '}'
    }

    for (; i < code.length; i++) {
      const openingChar = code[i]

      const reMatch = re.exec(openingChar)

      if (reMatch) {
        let n = i + 1

        let expectedEnds = 1

        for (; n < code.length; n++) {
          const closingChar = code[n]

          const blockClosingCharKey = String(reMatch[0]) as keyof (typeof blocksMap)

          if (blocksMap[blockClosingCharKey] === closingChar) {

            if (!(expectedEnds <= 1)) {
              expectedEnds--
              continue
            }

            const blockBody: string = code.slice(i, n + 1)
            const blockId: number = StringBlockWrapper.store.length
            const wrappedBlockContent: Array<string> = [
              blockClosingCharKey,
              this.wrap(blockBody.slice(1, -1)),
              blocksMap[blockClosingCharKey]
            ]

            StringBlockWrapper.store.push(wrappedBlockContent.join(''))

            // console.log('>>> blockBody >>> ', this.store[blockId])

            code = subStrReplace(code, i, n + 1, `::#block:${blockId}:`)

            break
          }

          if (closingChar === reMatch[0]) {
            expectedEnds++
          }
        }
      }
    }

    // console.log('\n\n\n\n\n\n\n\nthis.store => ', this.store)

    return code
  }

  /**
   * @method string
   * 
   * unwrap whole the blocks and nested blocks inside a given peace of code
   * 
   */
  public unwrapAll(code: string): string {
    const re = StringBlockWrapper.re // /::#block:([0-9]+):/

    let result = re.exec(code)

    while (result) {
      const blockId = Number(result[1])

      code = code.replace(re, String(StringBlockWrapper.store[blockId]))

      result = re.exec(code)
    }

    return code
  }

  /**
   * @method string
   * 
   * unwrap whole the blocks and nested blocks inside a given peace of code
   * 
   */
  public unwrap(code: string): string {
    return regReplaceCallback(StringBlockWrapper.re, code, match => {
      const blockId = Number(match[1])

      return StringBlockWrapper.store[blockId]
    })
  }
}
