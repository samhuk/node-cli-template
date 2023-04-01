import { createGFError } from 'good-flow'
import { baseCommand } from '../base'

type CliArgsOptions = { name: string }

export const hello = baseCommand<CliArgsOptions>(async args => {
  // -- Validate CLI args
  if (args.name == null || args.name.length === 0) {
    return createGFError({
      msg: 'Invalid CLI argument(s).',
      inner: createGFError(c => `<name> must be defined and not empty. Received: ${c.cyan(args.name)}`),
    })
  }

  // -- Create response
  const response = `Hello ${args.name}!`

  // -- Print response to console
  console.log(response)
  return null
})
