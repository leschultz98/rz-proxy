import { existsSync } from 'fs';
import { execSync } from 'child_process';

export const WORKSPACES = 'D:\\Workspaces';

export const checkExists = (project) => {
  if (!existsSync(`${WORKSPACES}\\${project}`)) {
    execSync(`git clone git@bitbucket.org:razersw/${project}.git`, { stdio: 'inherit', cwd: WORKSPACES });
  }
};
