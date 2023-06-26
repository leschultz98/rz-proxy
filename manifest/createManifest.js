import crypto from 'crypto';
import { mkdirSync, writeFileSync } from 'fs';

const serialize = (_json) => {
  if (_json === null || typeof _json !== 'object' || _json.toJSON != null) {
    return JSON.stringify(_json);
  }

  if (Array.isArray(_json)) {
    return (
      '[' +
      _json.reduce((t, cv, ci) => {
        const comma = ci === 0 ? '' : ',';
        const value = cv === undefined || typeof cv === 'symbol' ? null : cv;
        return t + comma + serialize(value);
      }, '') +
      ']'
    );
  }

  return (
    '{' +
    Object.keys(_json)
      .sort()
      .reduce((t, cv) => {
        if (_json[cv] === undefined || typeof _json[cv] === 'symbol') {
          return t;
        }
        const comma = t.length === 0 ? '' : ',';
        return t + comma + serialize(cv) + ':' + serialize(_json[cv]);
      }, '') +
    '}'
  );
};

const hash = async (buffer, hex) => {
  const result = {};
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const uint8Array = new Uint8Array(hashBuffer);

  if (hex) {
    result.sha256 = Array.from(uint8Array)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  }

  const base64String = Buffer.from(uint8Array).toString('base64');
  result.integrity = `sha256-${base64String}`;

  return result;
};

const hashJSON = async (obj) => {
  const buffer = Buffer.from(serialize(obj), 'utf-8');
  obj.jws = await hash(buffer);
};

const versionRegex = /(?<=v)((\d+\.){3}\d+)(?=\.\w+$)/;

export default async function (path, { name, releaseNotesURL = '', description, resources }) {
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

  writeFileSync(publicPath + 'installer-manifest.json', JSON.stringify(installerManifest, null, 2) + '\n');

  const manifest = { resources: [] };

  for (const { resourceName, url } of resources) {
    const res = await fetch(url);

    manifest.resources.push({
      resourceName,
      resourceVersion: url.match(versionRegex)[0],
      url,
      path: name,
      overwriteApp: '',
      type: res.headers.get('Content-Type'),
      size: parseInt(res.headers.get('Content-Length')),
      ...(await hash(await res.arrayBuffer(), true)),
      noCache: false,
      restartRequired: false,
      action: {
        saveToDisk: {
          filePath: 'Drivers',
          runOnInstall: '/S /LAUNCH',
        },
      },
    });
  }

  await hashJSON(manifest);

  mkdirSync(publicPath + 'manifests', { recursive: true });
  writeFileSync(publicPath + 'manifests\\manifest-1.0.0.json', JSON.stringify(manifest, null, 2) + '\n');
}