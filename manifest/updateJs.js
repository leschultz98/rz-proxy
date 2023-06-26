import { readFileSync, writeFileSync } from 'fs';

const regex = /(?<=middlewareInjector.useFeature\('rzDeviceType.+)(\n)/;

export default function (path) {
  const filePath = `D:\\Workspaces\\${path}\\src\\index.ts`;
  let content = readFileSync(filePath, 'utf8');
  if (!content.includes('useMWManifest')) {
    content = content.replace(regex, "\nmiddlewareInjector.useFeature('useMWManifest', 'yes');\n");
  }
  writeFileSync(filePath, content);
}
