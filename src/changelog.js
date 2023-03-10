import fs from 'fs'
import CONFIGURATION from './configuration.js'
import nunjucks from 'nunjucks'
import { listPullRequest } from './bitbucket.js'
import { PrependLineTransform, RemoveFirstLineTransform } from './transforms.js'
import readline from 'readline'
import ora from 'ora'

const sort = '-created_on'
const state = 'MERGED'
const spinner = ora()
const LAST_LOG_DATE_REGEX = /<!---\s*LastTime:\s*(\d+)\s*--->/

nunjucks.configure()

class Changelog {
  constructor () {
    this.readStream = fs.createReadStream(CONFIGURATION.outputPath)
    this.writeStream = fs.createWriteStream(`${CONFIGURATION.outputPath}.tmp`)
  }

  async generateChangeLog () {
    // Gets last log date
    const lastLogDate = await this.#getLastLogTime()
    spinner.succeed('Get the last log time')

    // Gets the data of the logs for each section
    const sectionData = await this.#getSectionLogs(lastLogDate)
    spinner.succeed('Gets the data from the different sections')

    // Generate the current log with the data.
    const content = await this.#getContent(sectionData)
    spinner.succeed('Create the new content of the changelog')

    // Generate the changelog file with the new content.
    this.#generateChangeLog(content)
    spinner.succeed('Generate the new changelog')

    spinner.succeed('Changelog generated')
  }

  async #getSectionLogs (lastLogDate) {
    const data = {}

    for await (const section of CONFIGURATION.sections) {
      const { slug, branchFilter } = section

      const { size, data: sectionData } = await this.#getLogs(lastLogDate, branchFilter)
      data[slug] = { ...section, values: sectionData, size }
    }

    return data
  }

  async #renameTemporary () {
    fs.rename(`${CONFIGURATION.outputPath}.tmp`, CONFIGURATION.outputPath, () => undefined)
  }

  async #generateChangeLog (content) {
    const stat = fs.statSync(`${CONFIGURATION.outputPath}`)
    if (stat.size === 0) {
      this.writeStream.write(content)
      this.writeStream.close()
      this.#renameTemporary()
    } else {
      const stream = this.readStream
        .pipe(new RemoveFirstLineTransform())
        .pipe(new PrependLineTransform(content))
        .pipe(this.writeStream)

      await stream.on('close', () => this.#renameTemporary())
    }
  }

  async #getLogs (lastLogDate, branchFilter) {
    let currentPage = 1
    let hasNext = true
    let data = []
    let dataSize = 0

    while (hasNext) {
      const { values, next, size, page } = await listPullRequest({
        page: currentPage,
        sort,
        q: {
          updateDate: lastLogDate,
          brachName: branchFilter,
          state
        },
        fields: CONFIGURATION.fields
      })
      hasNext = Boolean(next)
      dataSize = size | 0
      currentPage = page + 1
      if (values) data = [...data, ...values]
    }
    return { size: dataSize, data }
  }

  async #getContent (data) {
    return nunjucks.render(CONFIGURATION.defaultTemplatePath, {
      sections: data,
      currentDate: Intl.DateTimeFormat(
        CONFIGURATION.currentDate.locale,
        CONFIGURATION.currentDate.options
      ).format(Date.now()),
      currentTimeStamp: Date.now(),
      template: CONFIGURATION.templatePath,
      changelogTitle: CONFIGURATION.title
    })
  }

  async #getLastLogTime () {
    const lineReader = readline.createInterface({
      input: fs.createReadStream(CONFIGURATION.outputPath)
    })

    return new Promise((resolve, reject) => {
      let lastLogTime = new Date()

      lineReader.on('line', async (line) => {
        line = line.replace(/(\r\n|\n|\r)/gm, '')
        const match = LAST_LOG_DATE_REGEX.exec(line)
        if (match) {
          const timestamp = Number(match[1])
          lastLogTime = new Date(timestamp)
          lineReader.close()
          lineReader.removeAllListeners()
        }
      })

      lineReader.on('close', () => resolve(lastLogTime))
    })
  }
}

export { Changelog }
