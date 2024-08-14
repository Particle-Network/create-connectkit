#!/usr/bin/env node
import chalk from 'chalk';
import { Command } from 'commander';
import cpy from 'cpy';
import { execa } from 'execa';
import fs from 'fs-extra';
import { createRequire } from 'module';
import path from 'path';
import prompts from 'prompts';
import { fileURLToPath } from 'url';
import validateNpmPackageName from 'validate-npm-package-name';
import { detectPackageManager } from './detectPackageManager';

const log = console.log;

const erc4337Map = {
  BICONOMY: '2.0.0',
  SIMPLE: '2.0.0',
  CYBERCONNECT: '1.0.0',
  LIGHT: '1.0.0',
  XTERIO: '1.0.0',
} as const;

type ERC4337Name = keyof typeof erc4337Map;

class FriendlyError extends Error {}

async function run() {
  try {
    let projectPath = '';

    const packageJson = createRequire(import.meta.url)('../package.json');

    const program = new Command(packageJson.name)
      .version(packageJson.version)
      .arguments('[project-directory]')
      .usage(`${chalk.green('[project-directory]')} [options]`)
      .action((name) => {
        projectPath = name;
      })
      .option('--use-npm', 'Explicitly tell the CLI to bootstrap the app using npm')
      .option('--use-yarn', 'Explicitly tell the CLI to bootstrap the app using Yarn')
      .option('--use-pnpm', 'Explicitly tell the CLI to bootstrap the app using pnpm')
      .option('--skip-git', 'Skip initializing a git repository')
      .option('--template <templateName>', 'Choose app template', '')
      .option('--chains [chains...]', 'Select the chains supported by the app:\nsolana\nevm', '')
      .option(
        '--erc4337 <erc4337>',
        `Set the app to support ERC-4337(only support EVM chains):\n${Object.keys(erc4337Map).join('\n')}`,
        ''
      )
      .option('--embedded-wallet', 'Enable embedded wallet')
      .allowUnknownOption()
      .parse(process.argv);

    const options = program.opts();

    const reservedPackageNames = ['@particle-network/connectkit', 'next', 'react', 'react-dom'];

    log();
    log(chalk.green('🤩 Welcome to Particle Network!'));

    const isValidProjectName = (value: string) => validateNpmPackageName(value).validForNewPackages;

    const invalidProjectNameErrorMessage = 'Project name must be a valid npm package name.';

    if (typeof projectPath === 'string') {
      projectPath = projectPath.trim();
    }

    if (!projectPath) {
      log();
      const { value } = await prompts({
        initial: 'particle-connectkit-app',
        message: 'What is the name of your project?',
        name: 'value',
        type: 'text',
        validate: (value) => {
          if (!isValidProjectName(value)) {
            return invalidProjectNameErrorMessage;
          }

          if (reservedPackageNames.includes(value)) {
            return `"${value}" is a reserved package name.`;
          }

          return true;
        },
      });

      if (typeof value === 'undefined') {
        log();
        return;
      }

      projectPath = value;
    }

    log();

    if (!isValidProjectName(projectPath)) {
      throw new FriendlyError(
        [
          chalk.red('👀 The project name you provided is not a valid package name.'),
          `🙏 ${invalidProjectNameErrorMessage}`,
        ].join('\n')
      );
    }

    if (reservedPackageNames.includes(projectPath)) {
      throw new FriendlyError(
        [
          chalk.red('👀 The project name you provided is a reserved package name.'),
          `🙏 Please use a project name other than "${reservedPackageNames.find((x) => x === projectPath)}".`,
        ].join('\n')
      );
    }

    const targetPath = path.join(process.cwd(), projectPath);

    if (fs.existsSync(targetPath)) {
      throw new FriendlyError(
        [
          chalk.red(`👀 The target directory "${projectPath}" already exists.`),
          '🙏 Please remove this directory or choose a different project name.',
        ].join('\n')
      );
    }

    const __dirname = fileURLToPath(new URL('.', import.meta.url));
    const templatesPath = path.join(__dirname, '..', 'templates');
    let templateName = options.template;
    if (!templateName) {
      const { value } = await prompts({
        type: 'select',
        message: 'What is the template of your project?',
        name: 'value',
        initial: 0,
        choices: [
          { title: 'create-next-app', value: 'next-connectkit-app' },
          { title: 'create-react-app', value: 'react-connectkit-app' },
        ],
      });
      templateName = value;
    }

    const selectedTemplatePath = path.join(templatesPath, templateName);

    if (!fs.existsSync(selectedTemplatePath)) {
      throw new FriendlyError(
        [
          chalk.red(`👀 The template directory "${selectedTemplatePath}" not exists.`),
          '🙏 Please choose a different template.',
        ].join('\n')
      );
    }

    let chains = options.chains as string[];
    if (!chains || chains.some((chain) => !['evm', 'solana'].includes(chain))) {
      const { value } = await prompts({
        type: 'multiselect',
        message: 'Which chains does your app support?​',
        name: 'value',
        min: 1,
        choices: [
          { title: 'EVM', value: 'evm', selected: true },
          { title: 'Solana', value: 'solana' },
        ],
      });
      chains = value;
    }

    if (!chains || !chains.length) {
      throw new FriendlyError(chalk.red(`👀 You must choose the chains your app supports.`));
    }

    let erc4337 = options.erc4337;
    if (!erc4337 || !Object.keys(erc4337Map).includes(erc4337)) {
      const { value } = await prompts({
        type: 'select',
        message: 'Which ERC-4337 Contract does your app support?​',
        name: 'value',
        initial: 0,
        choices: [
          { title: 'DISABLE', value: '' },
          ...Object.keys(erc4337Map).map((value) => {
            return { title: `${value}-${erc4337Map[value as ERC4337Name]}`, value };
          }),
        ],
      });
      erc4337 = value;
    }

    let embeddedWallet = options.embeddedWallet;
    if (embeddedWallet == null) {
      const { value } = await prompts({
        type: 'confirm',
        message: 'Does it support an embedded wallet?​',
        name: 'value',
        initial: true,
      });
      embeddedWallet = value;
    }

    let connectkitCode = fs.readFileSync(`${selectedTemplatePath}/src/connectkit.tsx`, 'utf8');

    if (chains.length === 1) {
      if (chains[0] === 'evm') {
        // remove solana
        const solanaRegex = /\/\/ solana start[\s\S]*?\/\/ solana end/g;
        connectkitCode = connectkitCode.replace(solanaRegex, '');
      } else if (chains[0] === 'solana') {
        // remove evm
        const evmRegex = /\/\/ evm start[\s\S]*?\/\/ evm end/g;
        connectkitCode = connectkitCode.replace(evmRegex, '');
      }
    }

    if (!embeddedWallet) {
      const regex = /\/\/ embedded wallet start[\s\S]*?\/\/ embedded wallet end/g;
      connectkitCode = connectkitCode.replace(regex, '');
    }

    if (!erc4337 || !chains.includes('evm')) {
      const disableAARegex = /\/\/ aa start[\s\S]*?\/\/ aa end/g;
      connectkitCode = connectkitCode.replace(disableAARegex, '');
      const disableAAConfigRegex = /\/\/ aa config start[\s\S]*?\/\/ aa config end/g;
      connectkitCode = connectkitCode.replace(disableAAConfigRegex, '');
    } else {
      const version = erc4337Map[erc4337 as ERC4337Name];
      const aaRegex = /\/\/ aa config start[\s\S]*?\/\/ aa config end/g;
      connectkitCode = connectkitCode.replace(
        aaRegex,
        `
    // aa config start
    aa({
      name: '${erc4337}',
      version: '${version}',
    }),
    // aa config end
  `
      );
    }

    log(chalk.cyan(`🚀 Creating a new Connectkit app in ${chalk.bold(targetPath)}`));

    const ignoreList: string[] = ['node_modules', '.next', 'CHANGELOG.md', 'yarn.lock'];

    await cpy(path.join(selectedTemplatePath, '**', '*'), targetPath, {
      filter: (src) =>
        ignoreList.every((ignore) => {
          const relativePath = path.relative(selectedTemplatePath, src.path);
          return !relativePath.includes(ignore);
        }),
    });

    // Update package name
    const pkgJson = await fs.readJson(path.join(targetPath, 'package.json'));
    pkgJson.name = projectPath;
    pkgJson.version = '0.1.0';

    delete pkgJson.dependencies['@particle-network/connectkit'];
    delete pkgJson.dependencies['viem'];

    await fs.writeFile(path.join(targetPath, 'package.json'), JSON.stringify(pkgJson, null, 2));

    await fs.writeFile(path.join(`${targetPath}/src`, 'connectkit.tsx'), connectkitCode);

    const packageManager = options.usePnpm
      ? 'pnpm'
      : options.useYarn
        ? 'yarn'
        : options.useNpm
          ? 'npm'
          : detectPackageManager();

    log(chalk.cyan(`📦 Installing dependencies with ${chalk.bold(packageManager)}. This could take a while.`));
    await execa(packageManager, ['install'], {
      cwd: targetPath,
      stdio: 'inherit',
    });

    await execa(
      packageManager,
      [packageManager === 'yarn' ? 'add' : 'install', '@particle-network/connectkit', 'viem@2'],
      {
        cwd: targetPath,
        stdio: 'inherit',
      }
    );

    if (!options.skipGit) {
      log(chalk.cyan('📚 Initializing git repository'));
      await execa('git', ['init'], { cwd: targetPath });
      await execa('git', ['add', '.'], { cwd: targetPath });
      await execa('git', ['commit', '--no-verify', '--message', 'Initial commit from create-connectkit'], {
        cwd: targetPath,
      });
    }

    log(
      chalk.green(
        '🤩 Done! Thanks for using Particle Network 🙏\nGet more information: https://developers.particle.network/api-reference/connect/desktop/web'
      )
    );
    log();

    log(chalk.yellow('❗Before starting, configure the .env file by referring to the README.md.❗'));

    log();
    log(
      chalk.cyan(
        `👉 To get started, run ${chalk.bold(`cd ${projectPath}`)} and then ${chalk.bold(
          `${packageManager}${packageManager === 'npm' ? ' run' : ''} ${templateName?.includes?.('next') ? 'dev' : 'start'}`
        )}`
      )
    );
    log();
  } catch (err) {
    if (err instanceof FriendlyError) {
      log(chalk.yellow(err.message));
      process.exit(1);
    } else {
      throw err;
    }
  }
}

run();
