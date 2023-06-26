import { readFileSync, writeFileSync } from 'fs';

const HUSKY = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
if [ -f 'node_modules/.bin/check-manifest' ]; then
    ./node_modules/.bin/check-manifest
else
    echo -e "\\x1b[31mplease install or upgrade your local razer-cli-tools.\\x1b[0m\\nnpm uninstall razer-cli-tools --save\\nnpm i bitbucket:razersw/razer-cli-tools#staging --save"
    exit 1
fi
`;

const updateHusky = (path) => {
  const filePath = `D:\\Workspaces\\${path}\\.husky\\pre-commit`;
  const content = readFileSync(filePath, 'utf8');
  if (!content.includes('./node_modules/.bin/check-manifest')) {
    writeFileSync(filePath, HUSKY);
  }
};

const regex = /(?<=middlewareInjector.useFeature\('rzDeviceType.+)(\n)/;

export default function (path) {
  updateHusky(path);

  const filePath = `D:\\Workspaces\\${path}\\src\\index.ts`;
  let content = readFileSync(filePath, 'utf8');
  if (!content.includes('useMWManifest')) {
    content = content.replace(regex, "\nmiddlewareInjector.useFeature('useMWManifest', 'yes');\n");
  }
  writeFileSync(filePath, content);
}
