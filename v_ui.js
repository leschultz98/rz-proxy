const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');

const PROJECTS = [
  //
  { name: 'port_ui\\projects\\alma', num: 4 },
  { name: 'port_ui\\projects\\evelyn', num: 25 },
  { name: 'port_ui\\projects\\jugan', num: 25 },
  // { name: 'port_ui\\projects\\lanceheadte', num: 4 },
  { name: 'port_ui\\projects\\reagan', num: 4 },
  // { name: 'lilywireless', num: 25 },
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

const getAfterScripts = (num) => {
  const newV = `release/v0.0.${num + 1}`;

  return [
    'git add lib-version.json',
    'git commit -m "update lib-version"',
    'git push origin',
    `git checkout -b ${newV} origin/release/v0.0.${num}`,
    'git merge --no-ff staging',
    `git push origin ${newV}`,
    'git checkout master',
    'git pull',
    `git merge --no-ff ${newV}`,
    'git push origin master',
    `git branch -D ${newV}`,
    'git checkout staging',
  ];
};

const commonRegex = /(?<=staging.+\s\s\s\s"commit":\s")\w+/;
const jstestRegex = /(?<=dev.+\s\s\s\s"commit":\s")\w+/;
const timeRegex = /(?<="time":\s)\d+/g;

const common = '717646999a2d3d18cb17535281c99e183bf99284';
const jstest = '7c7613356bedf69f35796e75cffb0f0642fcce35';
const time = Date.now();

for (const { name, num } of PROJECTS) {
  const pwd = `D:\\Workspaces\\${name}`;
  const cd = `cd ${pwd}`;

  execSync([cd, BEFORE].flat().join(' && '), { stdio: 'inherit' });

  const path = `${pwd}\\lib-version.json`;
  const content = readFileSync(path, 'utf8');
  const newContent = content.replace(commonRegex, common).replace(jstestRegex, jstest).replace(timeRegex, time);
  writeFileSync(path, newContent);

  const after = getAfterScripts(num);
  execSync([cd, after].flat().join(' && '), { stdio: 'inherit' });
}
