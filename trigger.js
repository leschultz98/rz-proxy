const { execSync } = require('child_process');

const PROJECTS = [
  //
  // 'alma',
  // 'evelyn',
  // 'jugan',
  // 'lanceheadte',
  // 'lilymini',
  // 'pipert2refresh',
  // 'port_ui\\projects\\reagan',
];

const SCRIPTS = [
  'git checkout staging',
  'git pull',
  'git commit --allow-empty -m "trigger build"',
  'git push origin',
  // 'git checkout master',
  // 'git pull',
  // 'git commit --allow-empty -m "trigger build"',
  // 'git push origin master',
  // 'git checkout staging',
];

for (const project of PROJECTS) {
  const cd = `cd D:\\Workspaces\\${project}`;

  execSync([cd, SCRIPTS].flat().join(' && '), { stdio: 'inherit' });
}
