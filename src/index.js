#!/usr/bin/env node
import { Changelog } from './changelog.js'
import ora from 'ora'

const spinner = ora()

spinner.succeed('Starting to generate the log')
const changelogInstance = new Changelog()
await changelogInstance.generateChangeLog()
