const detectPort = require('detect-port');
const { spawn } = require('child_process');
const path = require('path');

async function startDevServer() {
  const port = await detectPort(3005);
  
  if (port !== 3005) {
    console.log(`Port 3005 is occupied, using ${port} instead`);
  }
  
  const env = { ...process.env, PORT: port.toString(), BROWSER: 'none' };
  
  const server = spawn('npm', ['start'], {
    env,
    stdio: 'inherit',
    shell: true
  });
  
  return { server, port };
}

async function startElectron(port) {
  const electron = spawn('electron', ['.'], {
    env: { ...process.env, ELECTRON_DEV_PORT: port.toString() },
    stdio: 'inherit',
    shell: true
  });
  
  return electron;
}

startDevServer().then(({ server, port }) => {
  console.log(`Development server starting on port ${port}`);
  
  server.on('error', (err) => {
    console.error('Failed to start dev server:', err);
    process.exit(1);
  });
  
  server.on('exit', (code) => {
    console.log(`Dev server exited with code ${code}`);
    process.exit(code);
  });
  
  setTimeout(() => {
    console.log(`Starting Electron on port ${port}`);
    startElectron(port);
  }, 3000);
}).catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
