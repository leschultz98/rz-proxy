import { execSync } from 'child_process';

import createManifest from './createManifest.js';
import readManifest from './readManifest.js';
import updateJs from './updateJs.js';

const script1 = [
  //
  'git checkout staging',
  'git pull',
].join(' && ');

const script2 = [
  //
  'git add .',
  'git commit --no-verify -m "feat: update manifest (ANN-16890)"',
  'git push origin',
].join(' && ');

[
  //
  { mw: 'jugan_mw', ui: 'port_ui\\projects\\jugan' },
].forEach(async ({ mw, ui, data }) => {
  const cwd = `D:\\Workspaces\\${mw}`;
  execSync(script1, { stdio: 'inherit', cwd });
  await createManifest(mw, ui ? readManifest(ui) : data);
  updateJs(mw);
  execSync(script2, { stdio: 'inherit', cwd });
});

// data sample
/* const data = {
  name: 'string',
  releaseNotesURL: 'string',
  description: {},
  resources: [{ resourceName: 'string', url: 'string' }],
}; */
