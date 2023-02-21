import * as dotenv from 'dotenv'

dotenv.config()

const CONFIGURATION = {
  environment: {
    workspace: process.env.BITBUCKET_WORKSPACE,
    repository: process.env.BITBUCKET_REPO_SLUG,
    username: process.env.BITBUCKET_USERNAME,
    appPassword: process.env.BITBUCKET_APP_PASSWORD
  },
  currentDate: {
    locale: 'en-US',
    options: {}
  },
  title: 'Changelog',
  outputPath: 'CHANGELOG.md',
  defaultTemplatePath: 'default-template.md',
  templatePath: 'template.md',
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

export default CONFIGURATION
