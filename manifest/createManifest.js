import { mkdirSync } from 'fs';
import { checkExists, writeJSON } from '../utils/index.js';
import { fetchResource, hashJSON, parseVersion } from './utils.js';

export default async function (path, { name, releaseNotesURL = '', description, resources }) {
  checkExists(path);
  const publicPath = `D:\\Workspaces\\${path}\\public\\`;
  const installerManifest = {
    name,
    app: 'common',
    baseURL: `synapse/products/${name}/mw/manifests`,
    latest: {
      version: '1.0.0',
      url: 'manifest-1.0.0.json',
      releaseDate: Date.now(),
      releaseNotesURL,
    },
    archive: [],
    description,
  };

  await hashJSON(installerManifest);

  writeJSON(publicPath + 'installer-manifest.json', installerManifest);

  const manifest = { resources: [] };

  for (const { resourceName, resourceVersion, url, path, filePath } of resources) {
    const data = {
      resourceName,
      resourceVersion: parseVersion(url, resourceVersion),
      url,
      path: path || name,
      overwriteApp: '',
      ...(await fetchResource(url)),
      noCache: false,
      restartRequired: false,
      action: {
        saveToDisk: {
          filePath: filePath || '',
        },
      },
    };

    if (url.includes('.exe')) {
      data.action.saveToDisk.runOnInstall = '/S /LAUNCH';
    }

    manifest.resources.push(data);
  }

  await hashJSON(manifest);

  mkdirSync(publicPath + 'manifests', { recursive: true });
  writeJSON(publicPath + 'manifests\\manifest-1.0.0.json', manifest);
}
