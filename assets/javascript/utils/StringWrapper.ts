import { subStrReplace } from "."

export class StringWrapper {
  /**
   * @var Array<string> store
   * 
   * The store of all wrapped strings
   * 
   */
  private store: Array<string> = []

  /**
   * @method string
   * 
   * wrap whole the strings inside a given peace of code
   * 
   */
  public wrap(code: string): string {
    let i = 0

    const re = /(['"`])/

    const charIsNotEscaped = (charIndex: number): boolean => {
      if (charIndex === 0) {
        return false
      }

      const precedingCharIndex = -1 + charIndex
      const precedingChar = code[precedingCharIndex]

      if (precedingChar !== '\\') {
        return false
      }

      return !charIsNotEscaped(precedingCharIndex)
    }

    for (; i < code.length; i++) {
      const openingChar = code[i]

      const reMatch = re.exec(openingChar)

      if (reMatch) {
        let n = i + 1

        for (; n < code.length; n++) {
          const closingChar = code[n]

          if (reMatch[0] === closingChar && !charIsNotEscaped(n)) {
            const stringBody = code.slice(i, n + 1)
            const stringId = this.store.length

            this.store.push(stringBody)

            code = subStrReplace(code, i, n + 1, `::#str:${stringId}:`)
            break
          }
        }
      }
    }

    return code
  }

  /**
   * @method string
   * 
   * unwrap whole the strings inside a given peace of code
   * 
   */
  public unwrap(code: string): string {
    const re = /::#str:([0-9]+):/

    let result = re.exec(code)

    while (result) {
      const stringId = Number(result[1])

      code = code.replace(re, this.store[stringId])

      result = re.exec(code)
    }

    return code
  }
}
