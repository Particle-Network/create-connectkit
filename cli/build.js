import cpy from 'cpy';
import * as esbuild from 'esbuild';
import path from 'path';

const targetPath = './templates';
const ignoreList = ['node_modules', '.next', 'dist', 'CHANGELOG.md', 'yarn.lock', 'next-env.d.ts', '.env.local'];
const templatesPath = '../examples';
await cpy(path.join(templatesPath, '**', '*'), targetPath, {
  filter: (src) => {
    const relativePath = path.relative(templatesPath, src.path);
    return (
      ignoreList.every((ignore) => {
        return !relativePath.includes(ignore);
      }) && relativePath !== 'README.md'
    );
  },
  rename: (name) => name.replace(/^_dot_/, '.'),
});

const isWatching = process.argv.includes('--watch');

esbuild
  .build({
    bundle: true,
    entryPoints: ['./src/index.ts'],
    format: 'esm',
    outdir: 'dist',
    platform: 'node',
    plugins: [
      {
        name: 'make-all-packages-external',
        setup(build) {
          const filter = /^[^./]|^\.[^./]|^\.\.[^/]/; // Must not start with "/" or "./" or "../"
          build.onResolve({ filter }, (args) => ({
            external: true,
            path: args.path,
          }));
        },
      },
    ],
    watch: isWatching
      ? {
          onRebuild(error, result) {
            if (error) console.error('watch build failed:', error);
            else console.log('watch build succeeded:', result);
          },
        }
      : undefined,
  })
  .then(() => {
    if (isWatching) {
      console.log('watching...');
    }
  })
  .catch(() => process.exit(1));
