import { existsSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

export const WORKSPACES = 'D:\\Workspaces';

export const getProjectPath = (project) => `${WORKSPACES}\\${project}`;

export const checkExists = (project) => {
  const cwd = getProjectPath(project);
  if (existsSync(cwd)) {
    execSync('git checkout staging && git fetch origin && git reset --hard origin/staging', {
      stdio: 'inherit',
      cwd,
    });
  } else {
    execSync(`git clone git@bitbucket.org:razersw/${project}.git -b staging`, { stdio: 'inherit', cwd: WORKSPACES });
  }
};

export const writeJSON = (path, data) => {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
};
