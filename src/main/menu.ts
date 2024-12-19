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

    const popupPath = path.join(__dirname, 'popups', contentFile);
    popupWindow.loadFile(popupPath);

    popupWindow.setMenu(null); // Remove the menu bar (optional)

    popupWindow.on('blur', () => popupWindow.close());

    const { ipcMain } = require('electron');
    ipcMain.once('close-popup', () => popupWindow.close());

    popupWindow.webContents.once('did-finish-load', () => {
      popupWindow.webContents.send('set-title', title);
    });
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const UserManagementMenu: DarwinMenuItemConstructorOptions = {
      label: 'Users',
      submenu: [
        {
          label: 'Manage',
          click: () => this.openPopup('Manage Users', 'manage_users.html', 800, 600),
        },
        {
          label: 'Roles',
          click: () => this.openPopup('User Roles', 'user_roles.html', 800, 600),
        },
      ],
    };
    const SystemPreferencesMenu: DarwinMenuItemConstructorOptions = {
      label: 'Settings',
      submenu: [
        {
          label: 'Currency',
          click: () => this.openPopup('Currency Settings', 'currency_settings.html', 800, 600),
        },
        {
          label: 'Units',
          click: () => this.openPopup('Measurement Units', 'measurement_units.html', 800, 600),
        },
      ],
    };
    const FileReportPreferencesMenu: DarwinMenuItemConstructorOptions = {
      label: 'Reports',
      submenu: [
        {
          label: 'Export',
          click: () => this.openPopup('Default Export Format', 'default_export_format.html', 800, 600),
        },
        {
          label: 'Location',
          click: () => this.openPopup('Save Location', 'save_location.html', 800, 600),
        },
      ],
    };
    const DataBackupRestoreMenu: DarwinMenuItemConstructorOptions = {
      label: 'Backup',
      submenu: [
        {
          label: 'Backup',
          click: () => this.openPopup('Backup Data', 'backup_data.html', 800, 600),
        },
        {
          label: 'Restore',
          click: () => this.openPopup('Restore Data', 'restore_data.html', 800, 600),
        },
      ],
    };
    const HelpSupportMenu: MenuItemConstructorOptions = {
      label: 'Help',
      submenu: [
        {
          label: 'Info',
          click: () => this.openPopup('Company Info', 'company_info.html', 700, 500),
        },
        {
          label: 'Support',
          click: () => this.openPopup('Contact Support', 'contact_support.html', 700, 500),
        },
      ],
    };

    return [
      UserManagementMenu,
      SystemPreferencesMenu,
      FileReportPreferencesMenu,
      DataBackupRestoreMenu,
      HelpSupportMenu,
    ];
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
