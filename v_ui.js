const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');

const PROJECTS = [
  //
  'port_ui\\projects\\alma',
  'port_ui\\projects\\evelyn',
  'port_ui\\projects\\jugan',
  'port_ui\\projects\\lanceheadte',
  'port_ui\\projects\\reagan',
  'lilymini',
  'pipert2refresh',
  // 'C:\\Users\\phuc.le\\WebstormProjects\\audio-visualizer',
];

const BEFORE = ['git checkout staging', 'git pull'];

const getPath = (name) => {
  if (name.includes('C:\\')) return name;
  return `D:\\Workspaces\\${name}`;
};

const getAfterScripts = (cwd) => {
  const output = execSync('git branch -r', { cwd });
  let num = Math.max(
    ...output
      .toString()
      .split('\n')
      .filter((v) => v.includes('origin/release/v0.0.'))
      .map((v) => parseInt(v.replace('origin/release/v0.0.', '').trim()))
  );

  if (!Number.isInteger(num)) num = 0;

  const newV = `release/v0.0.${num + 1}`;

  return [
    // 'git add lib-version.json',
    // 'git commit -m "chore: update lib-version"',
    // 'git push origin',
    `git checkout -b ${newV} ${num ? `origin/release/v0.0.${num}` : 'master'}`,
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

const commonRegex = /(?<=staging.+\s+"commit":\s")\w+/;
const jstestRegex = /(?<=dev.+\s+"commit":\s")\w+/;
const timeRegex = /(?<="time":\s)\d+/g;

const common = '947d78021b71b357407a9b6f1b6e4bc3621870ca';
const jstest = '699ac6dfad5992dad3e0556850b9c303b293f767';
const time = Date.now();

for (const name of PROJECTS) {
  const cwd = getPath(name);
  execSync(BEFORE.join(' && '), { stdio: 'inherit', cwd });

  // const path = `${cwd}\\lib-version.json`;
  // const content = readFileSync(path, 'utf8');
  // const newContent = content.replace(commonRegex, common).replace(jstestRegex, jstest).replace(timeRegex, time);
  // writeFileSync(path, newContent);

  const after = getAfterScripts(cwd);
  execSync(after.join(' && '), { stdio: 'inherit', cwd });
}
