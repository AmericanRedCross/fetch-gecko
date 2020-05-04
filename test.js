const { spawn } = require('child_process');

const syncScript = spawn('onedrive', ["--synchronize"])
syncScript.stdout.on('data', (data) => {
  console.log(`onedrive stdout: ${data}`);
});
syncScript.stderr.on('data', (data) => {
  console.error(`onedrive stderr: ${data}`);
});
syncScript.on('close', (code) => {
  console.log(`child process for onedrive exited with code ${code}`);
});