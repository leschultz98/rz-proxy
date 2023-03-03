const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');

const PROJECTS = [
  //
  // 'port_ui\\projects\\alma',
  // 'port_ui\\projects\\evelyn',
  // 'port_ui\\projects\\jugan',
  // 'port_ui\\projects\\lanceheadte',
  // 'lilymini',
  // 'pipert2refresh',
];

const BEFORE = ['git checkout staging', 'git pull'];
const AFTER = [
  'git add lib-version.json',
  'git commit -m "chore: update lib-version"',
  'git push origin',
  'git checkout master',
  'git pull',
  'git merge --no-ff staging',
  'git push origin master',
  'git checkout staging',
];

const commonRegex = /(?<=staging.+\s\s\s\s"commit":\s")\w+/;
const jstestRegex = /(?<=dev.+\s\s\s\s"commit":\s")\w+/;
const timeRegex = /(?<="time":\s)\d+/g;

const common = 'common';
const jstest = 'jstest';
const time = Date.now();

for (const project of PROJECTS) {
  const pwd = `D:\\Workspaces\\${project}`;
  const cd = `cd ${pwd}`;

  execSync([cd, BEFORE].flat().join(' && '), { stdio: 'inherit' });

  const path = `${pwd}\\lib-version.json`;
  const content = readFileSync(path, 'utf8');
  const newContent = content.replace(commonRegex, common).replace(jstestRegex, jstest).replace(timeRegex, time);
  writeFileSync(path, newContent);

  execSync([cd, AFTER].flat().join(' && '), { stdio: 'inherit' });
}
