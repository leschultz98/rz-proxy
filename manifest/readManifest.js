import { readFileSync } from 'fs';

export default function (path) {
  const publicPath = `D:\\Workspaces\\${path}\\public\\`;
  const installerManifest = JSON.parse(readFileSync(publicPath + 'installer-manifest.json'));
  const manifest = JSON.parse(readFileSync(publicPath + 'manifests\\' + installerManifest.latest.url));

  return {
    name: installerManifest.name,
    description: installerManifest.description,
    resources: manifest.resources.map(({ resourceName, url }) => ({
      resourceName: 'NormalDriver_' + resourceName,
      url,
    })),
  };
}
