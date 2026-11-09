const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

if (process.platform === 'win32') {
  const electronPackagePath = require.resolve('electron/package.json');
  const electronDirectory = path.dirname(electronPackagePath);
  const electronPackage = require(electronPackagePath);
  const architecture = process.env.npm_config_arch || process.arch;
  const executablePath = path.join(electronDirectory, 'dist', 'electron.exe');
  const pathFile = path.join(electronDirectory, 'path.txt');

  if (!fs.existsSync(executablePath)) {
    const cacheRoot = process.env.electron_config_cache ||
      path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local'), 'electron', 'Cache');
    const archiveName = `electron-v${electronPackage.version}-win32-${architecture}.zip`;

    function findArchive(directory) {
      if (!fs.existsSync(directory)) return null;

      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const entryPath = path.join(directory, entry.name);
        if (entry.isFile() && entry.name === archiveName) return entryPath;
        if (entry.isDirectory()) {
          const archivePath = findArchive(entryPath);
          if (archivePath) return archivePath;
        }
      }

      return null;
    }

    const archivePath = findArchive(cacheRoot);
    if (!archivePath) {
      throw new Error(`Electron ${electronPackage.version} Windows ${architecture} archive was not found in ${cacheRoot}`);
    }

    fs.mkdirSync(path.dirname(executablePath), { recursive: true });
    execFileSync('tar.exe', ['-xf', archivePath, '-C', path.dirname(executablePath)], { stdio: 'inherit' });
  }

  if (!fs.existsSync(executablePath)) {
    throw new Error(`Electron executable was not extracted to ${executablePath}`);
  }

  fs.writeFileSync(pathFile, 'electron.exe');
}
