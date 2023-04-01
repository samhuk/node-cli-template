import { createGFError, GFError } from 'good-flow'
import { exit } from 'process'

type CommandExecuteFn<TCliArgs extends {} = {}> = (args: TCliArgs) => Promise<GFError | undefined | null>

type CommandFn<TCliArgs extends {} = {}> = (args: TCliArgs) => void

export const baseCommand = <TCliArgs extends {}>(
  command: CommandExecuteFn<TCliArgs>,
  options?: {
    /**
     * @default true
     */
    exitOnReturn?: boolean
  },
): CommandFn<TCliArgs> => async (args: TCliArgs) => {
    try {
      const err = await command(args)
      if (err != null) {
        err.log()
        exit(1)
      }
      else if (options?.exitOnReturn ?? false) {
        exit(0)
      }
    }
    catch (e: any) {
      createGFError({
        msg: 'An unexpected error occured.',
        inner: e,
      }).log()
      exit(1)
    }
  }
