const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');

const PROJECTS = [
  //
  'alma',
  'evelyn',
  'jugan',
  'lanceheadte',
  'reagan',
  'lilymini',
  'pipert2refresh',
  // 'kittybt',
];

const BEFORE = ['git checkout staging', 'git pull'];
const AFTER = [
  // 'git add package-lock.json',
  // 'git commit --no-verify -m "chore: update package-lock"',
  // 'git push origin',
  'git checkout master',
  'git pull',
  'git merge --no-ff staging',
  'git push origin master',
  'git checkout staging',
];

const mwRegex = /(?<=git\+ssh:\/\/git@bitbucket\.org\/razersw\/rz-middleware(-audio)?\.git#)\w+/g;
const utilRegex = /(?<=git\+ssh:\/\/git@bitbucket\.org\/razersw\/razer-anne-utilities\.git#)\w+/g;
const utilVerRegex = /(?<=razer-anne-utilities.+\s+"version":\s"0\.0\.)(\d+)/g;

const mw = '';
const util = '';
const utilVer = '';

for (const project of PROJECTS) {
  const cwd = `D:\\Workspaces\\${project}_mw`;
  execSync(BEFORE.join(' && '), { stdio: 'inherit', cwd });

  const path = `${cwd}\\package-lock.json`;
  let content = readFileSync(path, 'utf8');
  if (mw) {
    content = content.replace(mwRegex, mw);
  }
  if (util) {
    content = content.replace(utilRegex, util).replace(utilVerRegex, utilVer);
  }
  writeFileSync(path, content);

  execSync(AFTER.join(' && '), { stdio: 'inherit', cwd });
}
