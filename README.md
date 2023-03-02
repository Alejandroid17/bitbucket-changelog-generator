<div align="center">
    <h1>
        📓
        <br />
        Bitbucket changelog generator
        <br />
    </h1>
</div>

<div align="center">

[![npm (tag)](https://img.shields.io/npm/v/bitbucket-changelog-generator/latest?style=flat-square)](https://www.npmjs.com/package/bitbucket-changelog-generator)
[![License](https://img.shields.io/github/license/Alejandroid17/bitbucket-changelog?style=flat-square)](https://github.com/Alejandroid17/bitbucket-changelog/blob/main/LICENSE)
[![Examples](https://img.shields.io/badge/examples-🚀-yellow.svg?style=flat-square)](https://github.com/Alejandroid17/bitbucket-changelog-generator/tree/main/examples)

<br />
</div>

<div align="center"> 
<strong>A changelog generator for bitbucket, using the merged pull requests and template</strong>
<br />
<br />
<strong><a href="https://github.com/Alejandroid17/bitbucket-changelog-generator/tree/main/examples">Examples</a></strong>
</div>


<div align="center"> 
<br />
<pre>npm i <a href="https://www.npmjs.com/package/bitbucket-changelog-generator">bitbucket-changelog-generator</a></pre>
<br />
</div>

<!-- TABLE OF CONTENTS -->

<details open>
  <summary>Table of Contents</summary>
  <ul>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#how-to-use">How to use</a></li>
    <ul>
      <li><a href="#environment-variables">Environment variables</a></li>
      <li><a href="#default-template">Default template</a></li>
    </ul>
    <li><a href="#overwrite-the-default-configuration">Overwrite the default configuration</a></li>
    <ul>
      <li><a href="#how-to-do-it">How to do it</a></li>
    </ul>
  </ul>
</details>

## Installation

```shell
pnpm install bitbucket-changelog-generator
```
or
```shell
npm install bitbucket-changelog-generator
```

## How to use

```shell
export <REQUIRED_ENV> 
bitbucket-changelog
```

### Environment variables

| Name                    | Description                                                     | Required |
|-------------------------|-----------------------------------------------------------------|----------|
| BITBUCKET_USERNAME*     | Username to connect via API                                     | Yes      |
| BITBUCKET_APP_PASSWORD* | APP password to connect via API                                 | Yes      |
| BITBUCKET_WORKSPACE     | Workspace from which to obtain pull request                     | Yes      |
| BITBUCKET_REPO_SLUG     | `slug` of the repository from which to obtain the pull request  | Yes      |
| CHANGELOG_CONFIG_PATH   | Path of the `json` file if you want to modify the configuration | No       |

> \* It is necessary to create an [APP password](https://support.atlassian.com/bitbucket-cloud/docs/app-passwords/) with pull request [reading](https://developer.atlassian.com/cloud/bitbucket/rest/intro/#scopes) permissions.

### Default template
Bitbucket changelog has a default template that is used if you do not overwrite it. You can see the template code here: [template.md](https://raw.githubusercontent.com/Alejandroid17/bitbucket-changelog/main/src/template.md)

## Overwrite the default configuration
You can overwrite the configuration to overwrite:
- the default template
- the title
- sections
- etc

### How to do it
1. Create a `.json` file.
2. Define the environment var `CHANGELOG_CONFIG_PATH` with the path to the `json` file that overwrites the configuration.
3. Define the custom configuration, the options are:

```js
{
  "title": "Changelog",   // Title of the changelog.
  "outputPath": "CHANGELOG.md",   // Changelog file path.
  "templatePath": "template.md",    // Custom template path.
  "fields": [   // Query fields from which to obtain data (see https://developer.atlassian.com/cloud/bitbucket/rest/intro/#querying)
    "size", 
    "values.id", 
    "values.title", 
    "values.created_on", 
    "values.links.html.href"
  ],
  "sections": [   // Sections in which to separate the log.
    {
      "slug": "feature",    // Key that can be used in the template.
      "title": "Feature",   // Section title.
      "branchFilter": "feature/"    // Filter applied on branch names (case-insensitive text contains).
    },
    {
      "slug": "bugfix",
      "title": "Bugfix",
      "branchFilter": "bugfix/"
    }
  ]
}
```
