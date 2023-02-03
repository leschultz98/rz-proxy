const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');

const PROJECTS = [
  //
  // 'alma',
  // 'evelyn',
  // 'jugan',
  // 'lanceheadte',
  // 'lilymini',
  // 'pipert2refresh',
];

const BEFORE = ['git checkout staging', 'git pull'];
const AFTER = [
  'git add package-lock.json',
  'git commit -m "update package-lock"',
  'git push origin',
  'git checkout master',
  'git pull',
  'git merge --no-ff staging',
  'git push origin master',
  'git checkout staging',
];

const regex = /(?<=git\+ssh:\/\/git@bitbucket\.org\/razersw\/rz-middleware\.git#)\w+/g;
const replace = 'commit';

for (const project of PROJECTS) {
  const pwd = `D:\\Workspaces\\${project}_mw`;
  const cd = `cd ${pwd}`;

  execSync([cd, BEFORE].flat().join(' && '), { stdio: 'inherit' });

  const path = `${pwd}\\package-lock.json`;
  const content = readFileSync(path, 'utf8');
  const newContent = content.replace(regex, replace);
  writeFileSync(path, newContent);

  execSync([cd, AFTER].flat().join(' && '), { stdio: 'inherit' });
}
