import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';
import path from 'path';
import Store from 'electron-store';
const store = new Store();

const setLanguage = (lang: string) => {
  store.set('language', lang); // Save globally
  console.log(`Language set to: ${lang}`);
};


interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

// Update to `menu.ts`

openPopup(title: string, contentFile: string, width = 800, height = 600): void {
  const popupWindow = new BrowserWindow({
    width, // Configurable width
    height, // Configurable height
    parent: this.mainWindow,
    modal: true, // Prevent interaction with the main window
    title,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the popup content dynamically
  const popupPath = path.join(__dirname, 'popups', contentFile);
  popupWindow.loadFile(popupPath);

  popupWindow.setMenu(null); // Remove the menu bar (optional)

  // Close popup when clicking outside
  popupWindow.on('blur', () => popupWindow.close());

  // Close popup via event from renderer
  const { ipcMain } = require('electron');
  ipcMain.once('close-popup', () => popupWindow.close());

  popupWindow.webContents.once('did-finish-load', () => {
    popupWindow.webContents.send('set-title', title);
  });
}

buildDarwinTemplate(): MenuItemConstructorOptions[] {
  const UserManagementMenu: DarwinMenuItemConstructorOptions = {
    label: 'User Management',
    submenu: [
      {
        label: 'Configuration',
        click: () => this.openPopup('Configuration', 'configuration.html', 800, 600),
      },
      { type: 'separator' },
      {
        label: 'Auxiliary',
        click: () => this.openPopup('Auxiliary', 'auxiliary.html', 600, 400),
      },
    ],
  };
  const SystemSettingsMenu: DarwinMenuItemConstructorOptions = {
    label: 'System Settings',
    submenu: [
      {
        label: 'Files',
        click: () => this.openPopup('Files', 'files.html', 900, 700),
      },
      {
        label: 'Reports',
        click: () => this.openPopup('Reports', 'reports.html', 1000, 800),
      },
      { type: 'separator' },
      {
        label: 'Articles',
        click: () => this.openPopup('Articles', 'articles.html', 800, 600),
      },
      {
        label: 'Clients',
        click: () => this.openPopup('Clients', 'clients.html', 800, 600),
      },
      {
        label: 'Warehouse',
        click: () => this.openPopup('Warehouse', 'warehouse.html', 850, 650),
      },
      {
        label: 'Cash Registers',
        click: () => this.openPopup('Cash Registers', 'cash_registers.html', 800, 600),
      },
    ],
  };
  const HelpSupportMenu: MenuItemConstructorOptions = {
    label: 'Help/Support',
    submenu: [
      {
        label: 'Help',
        click: () => this.openPopup('Help', 'help.html', 700, 500),
      },
    ],
  };

  return [UserManagementMenu, SystemSettingsMenu, HelpSupportMenu];
}


  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O',
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  },
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  },
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.webContents.toggleDevTools();
                  },
                },
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  },
                },
              ],
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Learn More',
            click() {
              shell.openExternal('https://electronjs.org');
            },
          },
          {
            label: 'Documentation',
            click() {
              shell.openExternal(
                'https://github.com/electron/electron/tree/main/docs#readme'
              );
            },
          },
          {
            label: 'Community Discussions',
            click() {
              shell.openExternal('https://www.electronjs.org/community');
            },
          },
          {
            label: 'Search Issues',
            click() {
              shell.openExternal('https://github.com/electron/electron/issues');
            },
          },
        ],
      },
    ];

    return templateDefault;
  }
}