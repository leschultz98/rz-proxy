import { existsSync } from 'fs';
import { execSync } from 'child_process';

export const WORKSPACES = 'D:\\Workspaces';

export const checkExists = (project) => {
  const projectPath = `${WORKSPACES}\\${project}`;
  if (existsSync(projectPath)) {
    execSync('git checkout staging && git fetch origin && git reset --hard origin/staging', {
      stdio: 'inherit',
      cwd: projectPath,
    });
  } else {
    execSync(`git clone git@bitbucket.org:razersw/${project}.git -b staging`, { stdio: 'inherit', cwd: WORKSPACES });
  }
};
