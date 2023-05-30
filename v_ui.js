const { execSync } = require('child_process');
const { readFileSync, writeFileSync, existsSync } = require('fs');

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
    // 'git commit --no-verify -m "chore: update lib-version"',
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
// const timeRegex = /(?<="time":\s)\d+/g;

const common = '';
const jstest = '';
// const time = Date.now();

for (const name of PROJECTS) {
  const cwd = getPath(name);

  if (!existsSync(cwd)) {
    execSync(`git clone git@bitbucket.org:razersw/${name}.git`, { stdio: 'inherit', cwd: 'D:\\Workspaces' });
  }

  execSync(BEFORE.join(' && '), { stdio: 'inherit', cwd });

  // const path = `${cwd}\\lib-version.json`;
  // let content = readFileSync(path, 'utf8');
  // if (common) {
  //   content = content.replace(commonRegex, common);
  // }
  // if (jstest) {
  //   content = content.replace(jstestRegex, jstest);
  // }
  // writeFileSync(path, content);

  const after = getAfterScripts(cwd);
  execSync(after.join(' && '), { stdio: 'inherit', cwd });
}
