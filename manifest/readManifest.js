import { readFileSync } from 'fs';
import { checkExists } from '../utils/index.js';

const getResourceName = ({ resourceName, url }) => {
  if (url.includes('.exe')) {
    return 'NormalDriver_' + url.split('/').pop().split('_')[0];
  }
  return resourceName;
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
        resourceVersion,
        url,
        path,
        action: {
          saveToDisk: { filePath },
        },
      }) => ({
        resourceName: getResourceName({ resourceName, url }),
        resourceVersion,
        url,
        path,
        filePath,
      })
    ),
  };
}
