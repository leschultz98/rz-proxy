const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');

const PROJECTS = [
  //
  // 'alma',
  // 'evelyn',
  // 'jugan',
  // 'lanceheadte',
  // 'reagan',
  // 'lilymini',
  // 'pipert2refresh',
];

const BEFORE = ['git checkout staging', 'git pull'];
const AFTER = [
  'git add package-lock.json',
  'git commit -m "chore: update package-lock"',
  'git push origin',
  'git checkout master',
  'git pull',
  'git merge --no-ff staging',
  'git push origin master',
  'git checkout staging',
];

const mwRegex = /(?<=git\+ssh:\/\/git@bitbucket\.org\/razersw\/rz-middleware(-audio)?\.git#)\w+/g;
const utilRegex = /(?<=git\+ssh:\/\/git@bitbucket\.org\/razersw\/razer-anne-utilities\.git#)\w+/g;
const utilVerRegex = /(?<=razer-anne-utilities.+\s+"version":\s"0\.0\.)(\d+)/g;

const mw = '28b7ddb35756cca593faf2ac420c5f12f90da0f5';
const util = 'a8def8bb2f35a62e0e1a89efea129538b8c1155a';
const utilVer = '61';

for (const project of PROJECTS) {
  const pwd = `D:\\Workspaces\\${project}_mw`;
  const cd = `cd ${pwd}`;

  execSync([cd, BEFORE].flat().join(' && '), { stdio: 'inherit' });

  const path = `${pwd}\\package-lock.json`;
  const content = readFileSync(path, 'utf8');
  const newContent = content.replace(mwRegex, mw).replace(utilRegex, util).replace(utilVerRegex, utilVer);
  writeFileSync(path, newContent);

  execSync([cd, AFTER].flat().join(' && '), { stdio: 'inherit' });
}
