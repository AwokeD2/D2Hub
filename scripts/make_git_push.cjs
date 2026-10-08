const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

if (!fs.existsSync('src-tauri/src/bin')) {
  fs.mkdirSync('src-tauri/src/bin', { recursive: true });
}

console.log('Generating source files...');
