const { execSync } = require('child_process');

const SAMPLE_PROJECT = { name: 'alma', isNested: true };
const PROJECTS = [
  SAMPLE_PROJECT,
  { name: 'evelyn', isNested: true },
  { name: 'jugan', isNested: true },
  { name: 'lanceheadte' },
  { name: 'lilymini' },
  { name: 'pipert2refresh' },
];

const BEFORE = ['git checkout staging', 'git pull'];
const AFTER = [
  'git add lib-version.json',
  'git commit -m "update lib-version"',
  'git push origin',
  'git checkout master',
  'git pull',
  'git merge --no-ff staging',
  'git push origin master',
  'git checkout staging',
];

const getPath = (name, isNested) => {
  return `D:\\Workspaces\\${isNested ? 'port_ui\\projects\\' : ''}${name}`;
};

for (const { name, isNested } of PROJECTS) {
  const pwd = getPath(name, isNested);
  const cd = `cd ${pwd}`;
  const copy = `xcopy /y ${getPath(
    SAMPLE_PROJECT.name,
    SAMPLE_PROJECT.isNested
  )}\\lib-version.json ${pwd}\\lib-version.json`;
  const commands = SAMPLE_PROJECT.name === name ? [cd, AFTER] : [cd, BEFORE, copy, AFTER];

  execSync(commands.flat().join(' && '), { stdio: 'inherit' });
}
