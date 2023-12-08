const path = require("path");
require("electron-reload")(__dirname, {
  electron: path.join(__dirname, "../", "node_modules", ".bin", "electron"),
});

const { app, BrowserWindow } = require("electron");
const packageJson = require("../package.json");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.setMenu(null);
  win.loadFile("./index.html");

  win.once("ready-to-show", () => {
    win.setTitle(`TF6250 Server Tester - v${packageJson.version}`);
  });
}

app.whenReady().then(createWindow);
