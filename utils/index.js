import { existsSync } from 'fs';
import { execSync } from 'child_process';

export const WORKSPACES = 'D:\\Workspaces';

export const checkExists = (project) => {
  const command = existsSync(`${WORKSPACES}\\${project}`)
    ? 'git checkout staging && git pull'
    : `git clone git@bitbucket.org:razersw/${project}.git -b staging`;
  execSync(command, { stdio: 'inherit', cwd: WORKSPACES });
};
