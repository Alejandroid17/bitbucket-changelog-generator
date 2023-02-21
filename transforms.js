import { Transform } from 'stream'

const PrependLineTransform = class extends Transform {
  #buffer = ''
  #isPrepended = false
  #content = ''
  constructor (content) {
    super()
    this.#content = content
  }

  _transform (chunk, _, callback) {
    if (this.#isPrepended) {
      this.push(chunk)
    } else {
      this.#buffer += chunk
      const contentBuffer = Buffer.from(this.#content)
      this.push(contentBuffer + this.#buffer)
      this.#buffer = null
      this.#isPrepended = true
    }
    callback()
  }
}

const RemoveFirstLineTransform = class extends Transform {
  #buffer = ''
  #isRemoved = false

  _transform (chunk, _, callback) {
    if (this.#isRemoved) {
      this.push(chunk)
    } else {
      this.#buffer += chunk.toString()
      if (this.#buffer.indexOf('\n') !== -1) {
        this.push(this.#buffer.slice(this.#buffer.indexOf('\n') + 1))
        this.#buffer = null
        this.#isRemoved = true
      }
    }
    callback()
  }
}

export {
  RemoveFirstLineTransform,
  PrependLineTransform
}
