import { readFileSync } from 'fs';
import { checkExists } from '../utils/index.js';

const prefix = 'NormalDriver_';

const getPrefix = (url) => {
  const string = url.toLowerCase();
  if (string.includes('.dll') || string.includes(prefix)) return '';
  return prefix;
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
    resources: manifest.resources.map(
      ({
        resourceName,
        url,
        path,
        action: {
          saveToDisk: { filePath },
        },
      }) => ({
        resourceName: getPrefix(url) + resourceName,
        url,
        path,
        filePath,
      })
    ),
  };
}
