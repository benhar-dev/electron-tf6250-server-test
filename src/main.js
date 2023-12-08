const path = require("path");

// require("electron-reload")(__dirname, {
//   electron: path.join(__dirname, "../", "node_modules", ".bin", "electron"),
// });

const { app, BrowserWindow, ipcMain } = require("electron");
const packageJson = require("../package.json");
const fs = require("fs");

ipcMain.on("request-notices", (event) => {
  const filePath = path.join(
    app.getAppPath(),
    "../",
    "THIRD-PARTY-NOTICES.txt"
  );

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      event.reply("notices-response", "Error reading file");
      return;
    }
    event.reply("notices-response", data);
  });
});

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
  win.loadFile(path.join(__dirname, "index.html"));

  win.once("ready-to-show", () => {
    win.setTitle(`TF6250 Server Tester - v${packageJson.version}`);
  });
}

app.whenReady().then(createWindow);
