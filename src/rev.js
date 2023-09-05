import { execSync } from 'child_process';
import { WORKSPACES } from '../utils/index.js';

const PROJECTS = [
  //
  'commonrepository',
  { name: 'jstestrzdevice', branch: 'dev' },
  'rz-middleware-kb',
  'razer-anne-utilities',
  { name: 'razer-types', branch: 'master' },
];

for (const data of PROJECTS) {
  const name = data.name || data;
  const branch = data.branch || 'staging';
  const cwd = `${WORKSPACES}\\${name}`;

  execSync('git pull', { cwd, stdio: 'ignore' });
  const output = execSync(`git rev-parse origin/${branch}`, { cwd });
  const rev = output.toString().trim();
  console.log(name, branch, rev);
}
