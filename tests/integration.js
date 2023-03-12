import assert from 'assert'
import fs from 'fs'
import MockDate from 'mockdate'
import { describe, it } from 'node:test'
import path from 'path'
import { testBugfixData, testFeatureData, testHotfixData, testReleaseData } from './test-data.js'
import { delay, fileChangelog, fileEnvironment, initNock } from './test-utils.js'

const rootTestFolder = './tests/'

describe('Generate Changelog', (t) => {
  it('Default configuration', async () => {
    const changeLogPath = path.join(rootTestFolder, 'TEST-DEFAULT-CHANGELOG.md')
    const changeLog = fileChangelog(changeLogPath)

    const configurationPath = path.join(rootTestFolder, 'test-default-configuration.json')
    const environment = fileEnvironment(configurationPath)

    environment.create()
    changeLog.create()

    MockDate.set(1677782981338)

    const { Changelog } = await import('./../src/changelog.js')

    initNock('feature/', testFeatureData)
    initNock('bugfix/', testBugfixData)
    initNock('hotfix/', testHotfixData)
    initNock('release/', testReleaseData)

    const changelogInstance = new Changelog()
    await changelogInstance.generateChangeLog()

    // Wait, because the streams are asynchronous and the files are read before the end of the process.
    await delay(2000)

    const expectedChangeLogPath = path.join('examples', 'default', 'CHANGELOG.md')
    const expectedData = fs.readFileSync(expectedChangeLogPath)
    const changeLogData = fs.readFileSync(changeLogPath)

    environment.remove()
    changeLog.remove()

    assert.strictEqual(
      changeLogData.toString(),
      expectedData.toString()
    )
  })
})
