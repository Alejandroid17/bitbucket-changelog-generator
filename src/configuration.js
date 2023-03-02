import * as dotenv from 'dotenv'
import merge from 'just-merge'
import fs from 'fs'
import path from 'path'
import ora from 'ora'

const spinner = ora()
const rootFolder = process.env.NODE_ENV === 'development' ? 'src' : './node_modules/bitbucket-changelog-generator/dist/'
const defaultTemplatePath = path.join(rootFolder, 'default-template.md')

const {
  parsed: {
    BITBUCKET_WORKSPACE,
    BITBUCKET_REPO_SLUG,
    BITBUCKET_USERNAME,
    BITBUCKET_APP_PASSWORD,
    CHANGELOG_CONFIG_PATH
  }
} = dotenv.config()

const FIXED_CONFIGURATION = {
  environment: {
    workspace: BITBUCKET_WORKSPACE,
    repository: BITBUCKET_REPO_SLUG,
    username: BITBUCKET_USERNAME,
    appPassword: BITBUCKET_APP_PASSWORD
  },
  defaultTemplatePath
}

const DEFAULT_CONFIGURATION = {
  currentDate: {
    locale: 'en-US',
    options: {}
  },
  title: 'Changelog',
  outputPath: 'CHANGELOG.md',
  templatePath: path.join(rootFolder, 'template.md'),
  fields: ['size', 'values.id', 'values.title', 'values.created_on', 'values.links.html.href'],
  sections: [
    {
      slug: 'feature',
      title: 'Features',
      branchFilter: 'feature/'
    },
    {
      slug: 'bugfix',
      title: 'Bugfixes',
      branchFilter: 'bugfix/'
    },
    {
      slug: 'hotfix',
      title: 'Hotfixes',
      branchFilter: 'hotfix/'
    },
    {
      slug: 'release',
      title: 'Releases',
      branchFilter: 'release/'
    }
  ]
}

let CUSTOM_CONFIGURATION = {}
if (CHANGELOG_CONFIG_PATH) {
  spinner.info('Using a custom configuration')
  const rawData = fs.readFileSync(CHANGELOG_CONFIG_PATH)
  const data = JSON.parse(rawData)
  CUSTOM_CONFIGURATION = data
}

const CONFIGURATION = merge(
  DEFAULT_CONFIGURATION,
  CUSTOM_CONFIGURATION,
  FIXED_CONFIGURATION
)

export default CONFIGURATION
