import { readFileSync } from 'fs';
import { checkExists } from '../utils/index.js';

const getPrefix = (url) => {
  if (url.toLowerCase().includes('.dll')) return '';
  return 'NormalDriver_';
};

export default function (path) {
  checkExists(path);
  const publicPath = `D:\\Workspaces\\${path}\\public\\`;
  const installerManifest = JSON.parse(readFileSync(publicPath + 'installer-manifest.json'));
  const manifest = JSON.parse(readFileSync(publicPath + 'manifests\\' + installerManifest.latest.url));

  return {
    name: installerManifest.name,
    releaseNotesURL: installerManifest.latest.releaseNotesURL,
    description: installerManifest.description,
    resources: manifest.resources.map(({ resourceName, url }) => ({
      resourceName: getPrefix(url) + resourceName,
      url,
    })),
  };
}
