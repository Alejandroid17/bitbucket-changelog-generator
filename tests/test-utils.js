import path from 'path'
import fs from 'fs'
import nock from 'nock'

const BASE_URL_V2 = 'https://api.bitbucket.org/2.0/repositories'

const rootTestFolder = './'
const envFilePath = path.join(rootTestFolder, '.env')

function fileEnvironment (configurationPath) {
  function create () {
    fs.writeFileSync(envFilePath,
      `BITBUCKET_USERNAME = "test-username"\nBITBUCKET_WORKSPACE = "test-workspace"\nBITBUCKET_APP_PASSWORD = "test-app-password"\nBITBUCKET_REPO_SLUG = "test-repo-slug"\nCHANGELOG_CONFIG_PATH = "${configurationPath}"`,
      (error) => {
        if (error) throw error
        console.log('Env file created.')
      })
  }

  function remove () {
    fs.unlinkSync(envFilePath)
  }

  return { create, remove }
}

function fileChangelog (changeLogPath) {
  function create () {
    fs.writeFileSync(changeLogPath,
      '# Changelog\n\n<!--- LastTime: 1677782981338 --->\n',
      (error) => {
        if (error) throw error
        console.log('Changelog file created.')
      })
  }

  function remove () {
    fs.unlinkSync(changeLogPath)
  }

  return { create, remove }
}

const initNock = (branchFilter, responseData) => {
  nock(BASE_URL_V2)
    .get(uri => uri.includes('pullrequests'))
    .query(query => {
      return query.q.includes(branchFilter)
    })
    .reply(200, { ...responseData })
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export {
  initNock,
  fileEnvironment,
  fileChangelog,
  delay
}
