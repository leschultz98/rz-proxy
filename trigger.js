const { execSync } = require('child_process');

const PROJECTS = [
  //
  // 'alma',
  // 'evelyn',
  // 'jugan',
  // 'lanceheadte',
  // 'reagan',
  // 'lilymini_mw',
  // 'pipert2refresh',
  // 'port_ui\\projects\\reagan',
];

const SCRIPTS = [
  'git checkout staging',
  'git pull',
  'git commit --allow-empty -m "trigger build"',
  'git push origin',
  'git checkout master',
  'git pull',
  'git commit --allow-empty --no-verify -m "trigger build"',
  'git push origin master',
  'git checkout staging',
];

for (const project of PROJECTS) {
  const cwd = `D:\\Workspaces\\${project}`;
  execSync(SCRIPTS.join(' && '), { stdio: 'inherit', cwd });
}
