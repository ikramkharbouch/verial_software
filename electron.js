// electron.js
import { app, BrowserWindow } from "electron";
import { join } from "path";
import isDev from "electron-is-dev";

var DevEnv = process.env.APP_DEV ? process.env.APP_DEV.trim() == "true" : false;
// import mainMenu from "./menumaker.js";

// app.isPackaged || import('electron-reloader')(module);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const startURL = isDev
    ? "http://localhost:3000"
    : `file://${join(__dirname, "../build/index.html")}`;

  mainWindow.loadURL(startURL);

  mainWindow.on("closed", () => (mainWindow = null));

  // open dev tools if we are in development mode
  if (DevEnv) {
    console.log(DevEnv);
    // reload actively when in dev mode
    require("electron-reload")(__dirname);
  }

  // Menu.setApplicationMenu(mainMenu);
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
