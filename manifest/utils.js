import crypto from 'crypto';
import { execSync } from 'child_process';
import { getProjectPath } from '../utils/index.js';

export const serialize = (_json) => {
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

export const hash = async (buffer, hex) => {
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

export const hashJSON = async (obj) => {
  delete obj.jws;
  const buffer = Buffer.from(serialize(obj), 'utf-8');
  obj.jws = await hash(buffer);
};

export const fetchResource = async (url) => {
  const res = await fetch(url);
  return {
    type: res.headers.get('Content-Type'),
    size: parseInt(res.headers.get('Content-Length')),
    ...(await hash(await res.arrayBuffer(), true)),
  };
};

export const versionRegex = /(?<=v)((\d+\.){3}\d+)(?=\.\w+$)/;

export const parseVersion = (url, defaultValue) => url.match(versionRegex)?.[0] || defaultValue;

export const commit = (message, project) => {
  const cwd = getProjectPath(project);
  const script = [
    //
    'git add .',
    `git commit --no-verify -m "${message}"`,
    'git push origin',
  ].join(' && ');

  execSync(script, { stdio: 'inherit', cwd });

  const commit = execSync('git rev-parse HEAD', { cwd }).toString().trim();
  execSync(`start https://bitbucket.org/razersw/${project}/commits/${commit}`);
};
