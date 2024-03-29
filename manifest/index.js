import { execSync } from 'child_process';
import createManifest from './createManifest.js';
import readManifest from './readManifest.js';
import updateJs from './updateJs.js';
import { fetchResource, hash, serialize } from './utils.js';

const script = [
  //
  `git add . ":!.idea"`,
  'git commit --no-verify -m "feat: update manifest (ANN-16890)"',
  'git push origin',
].join(' && ');

[
  // { name: 'avat1refresh', ui: 'port_ui\\projects\\' },
  // { name: 'pipert1' },
].forEach(async ({ name, ui, data }) => {
  name = name.toLowerCase();
  const mw = name + '_mw';
  const cwd = `D:\\Workspaces\\${mw}`;
  await createManifest(mw, data || readManifest((ui || '') + name));

  const skip = updateJs(mw);
  if (skip) {
    console.log('---> SKIP', name);
    return;
  }

  execSync(script, { stdio: 'inherit', cwd });

  const commit = execSync('git rev-parse HEAD', { cwd }).toString().trim();
  execSync(`start https://bitbucket.org/razersw/${mw}/commits/${commit}`);
});

// data sample
/* const data = {
  name: 'string',
  releaseNotesURL: 'string',
  description: {},
  resources: [{ resourceName: 'string', url: 'string', path?, filePath? }],
}; */

const object = {};
(async () => {
  delete object.jws;
  Object.keys(object).length && console.log('hash object', await hash(Buffer.from(serialize(object), 'utf-8')));
})();

const resource = '';

(async () => {
  resource && console.log('hash resource', await fetchResource('https://app-assets.razer.com/' + resource));
})();
