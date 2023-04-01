import { build } from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'

export const buildCli = () => {
  const buildResult = build({
    entryPoints: ['src/cli/index.ts'],
    bundle: true,
    platform: 'node',
    outdir: 'build/cli',
    format: 'cjs',
    sourcemap: true,
    plugins: [
      nodeExternalsPlugin({
        packagePath: './package.json',
      }),
    ],
  })
}
