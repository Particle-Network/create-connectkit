import fs from 'fs-extra';

let connectkitCode = fs.readFileSync(`templates/next-connectkit-app/src/connectkit.tsx`, 'utf8');
// const regex = /\/\/ embedded wallet start[\s\S]*?\/\/ embedded wallet end/g;
// connectkitCode = connectkitCode.replace(regex, '');

// const evmRegex = /\/\/ solana start[\s\S]*?\/\/ solana end/g;
// connectkitCode = connectkitCode.replace(evmRegex, '');

// const disableAARegex = /\/\/ aa start[\s\S]*?\/\/ aa end/g;
// connectkitCode = connectkitCode.replace(disableAARegex, '');

// const aaRegex = /\/\/ aa config start[\s\S]*?\/\/ aa config end/g;
// connectkitCode = connectkitCode.replace(
//   aaRegex,
//   `
//     // aa config start
//     aa({
//       name: 'BICONOMY',
//       version: '1.0.0',
//     }),
//     // aa config end
//   `
// );

console.log(connectkitCode);
