#!/usr/bin/env node
import { Command } from 'commander'

import { NAME_CAPITALIZED } from '../common/name'
import { hello } from './commands/hello'

const program = new Command()

program
  .name(NAME_CAPITALIZED)
  .description(`${NAME_CAPITALIZED} CLI`)
  .version('0.0.1')

// -- Hello
program
  .command('hello')
  .description('Say hello')
  .argument('<name>', 'Your name')
  .action((...args) => {
    hello({ name: args[0] })
  })

program.parse()
