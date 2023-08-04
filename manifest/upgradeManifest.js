import { readFileSync } from 'fs';
import { WORKSPACES, writeJSON } from '../utils/index.js';
import { commit, fetchResource, hashJSON, parseVersion } from './utils.js';

const project = 'mabelt1';
const version = '1.0.5';

const manifestFile = `manifest-${version}.json`;
const publicPath = `${WORKSPACES}\\${project}\\public`;
const installerPath = `${publicPath}\\installer-manifest.json`;
const manifestPath = `${publicPath}\\manifests\\${manifestFile}`;

const installerManifest = JSON.parse(readFileSync(installerPath));
const manifest = JSON.parse(readFileSync(manifestPath));

installerManifest.archive.push({ ...installerManifest.latest });
installerManifest.latest.version = version;
installerManifest.latest.url = manifestFile;
installerManifest.latest.releaseDate = Date.now();

(async () => {
  await hashJSON(installerManifest);
  writeJSON(installerPath, installerManifest);

  for (const resource of manifest.resources) {
    const { type, size, sha256, integrity } = await fetchResource(resource.url);
    resource.resourceVersion = parseVersion(resource.url, resource.resourceVersion);
    resource.type = type;
    resource.size = size;
    resource.sha256 = sha256;
    resource.integrity = integrity;
  }

  await hashJSON(manifest);
  writeJSON(manifestPath, manifest);

  commit(`chore(manifest): v${version}`, project);
})();
