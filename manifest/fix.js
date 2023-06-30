import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { checkExists, WORKSPACES } from '../utils/index.js';
import { hashJSON } from './createManifest.js';

const getProjectPath = (project) => `${WORKSPACES}\\${project}_mw`;
const getManifestPath = (project) => `${getProjectPath(project)}\\public\\manifests\\manifest-1.0.0.json`;

const getResourceName = ({ resourceName, url }) => {
  if (url.includes('.exe')) {
    return 'NormalDriver_' + url.split('/').pop().split('_')[0];
  }
  return resourceName;
};

const script = [
  //
  'git add .',
  'git commit --no-verify -m "fix: resourceName manifest"',
  'git push origin',
].join(' && ');

const PROJECTS = [
  // 'pipert1'
];

(async () => {
  for (const project of PROJECTS) {
    checkExists(project + '_mw');

    const manifestPath = getManifestPath(project);
    const manifest = JSON.parse(readFileSync(manifestPath));
    const result = {
      resources: manifest.resources.map((resource) => ({ ...resource, resourceName: getResourceName(resource) })),
    };

    await hashJSON(result);
    writeFileSync(manifestPath, JSON.stringify(result, null, 2) + '\n');
    execSync(script, { stdio: 'inherit', cwd: getProjectPath(project) });
  }
})();
