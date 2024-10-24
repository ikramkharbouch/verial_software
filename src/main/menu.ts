import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';

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

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const UserManagementMenu: DarwinMenuItemConstructorOptions = {
      label: 'User Management',
      submenu: [
        {
          label: 'User Management',
          selector: 'orderFrontStandardAboutPanel:',
          submenu: [
            { label: 'Datos de la empresa' },
            { label: 'Personal de la empresa' },
            { label: 'Cuentas bancarias de la empresa' },
            { label: 'Empresas de este ‘grupo de empresas' },
          ],
        },
        { type: 'separator' },
        {
          label: 'Ubicaciones',
          submenu: [
            { label: 'Divisas' },
            { label: 'Paises' },
            { label: 'Provincias' },
            { label: 'Localidades' },
          ],
        },
        { type: 'separator' },
        {
          label: 'Bancos',
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: 'Impuestos',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        { label: 'Retenciones', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Periodicidades de cobro / pago',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
        {
          label: 'Métodos de cobro / pago',
          selector: 'unhideAllApplications:',
        },
        { label: 'Series', selector: 'unhideAllApplications:' },
        { label: 'Areas de venta', selector: 'unhideAllApplications:' },
        { label: 'Remesas', selector: 'unhideAllApplications:' },
        { label: 'Incidencias', selector: 'unhideAllApplications:' },
        { label: 'Aparatos', selector: 'unhideAllApplications:' },
        { label: 'Calendario', selector: 'unhideAllApplications:' },
        {
          label: 'Salir (press Alt + F4 on keyboard)',
          selector: 'unhideAllApplications:',
        },
      ],
    };
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: 'System Settings',
      submenu: [
        {
          label: 'Articulos',
          accelerator: 'Command+Z',
          selector: 'undo:',
          submenu: [
            { label: 'Articulos' },
            { label: 'Perfiles' },
            { label: 'Categorias' },
            { label: 'Fabricantes' },
            { label: 'Lotes (Conjuntos)' },
            { label: 'Tarifas' },
            { label: 'Movimientos de stock' },
          ],
        },
        {
          label: 'Clientes',
          accelerator: 'Shift+Command+Z',
          selector: 'redo:',
          submenu: [
            { label: 'Clientes' },
            { label: 'Grupos' },
            { label: 'Informes de ventas y documentos de gestión' },
            { label: 'Impresión de documentos de gestión' },
            { label: 'Comisiones' },
            { label: 'Registro de facturas emitidas ' },
            { label: 'Cobros' },
            { label: 'Mandatos S.E.P.A' },
          ],
        },
        { type: 'separator' },
        {
          label: 'Proveedores',
          accelerator: 'Command+X',
          selector: 'cut:',
          submenu: [
            { label: 'Proveedores' },
            { label: 'Grupos' },
            { label: 'Informes de compras y documentos de gestión' },
            { label: 'Registro de facturas recibidas' },
            { label: 'Pagos' },
          ],
        },
        {
          label: 'Almacen',
          accelerator: 'Command+C',
          selector: 'copy:',
          submenu: [
            {
              label: 'Documentos de almacén',
            },
          ],
        },
        {
          label: 'Cajas',
          accelerator: 'Command+V',
          selector: 'paste:',
          submenu: [
            { label: 'Arqueos' },
            { label: 'Estado de la caja (pre-arqueos)' },
            { label: 'Operaciones de caja' },
          ],
        },
        {
          label: 'Nombres / Direcciones',
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
        {
          label: 'Personal',
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
        {
          label: 'Cuentas Bancarias'
        },
        {
          label: 'Bancos'
        },
        { label: 'Retenciones' },
        { label: 'Remesas' },
        { label: 'Estadísticas de compras y ventas' },
        { label: 'Incidencias' },
        { label: 'Operaciones por usuarios o por puestos' },
        { label: 'Registro de modificaciones en fichas' },
        { label: 'Aparatos' },
        { label: 'Reparaciones' },
        { label: 'Revisiones' },
        { label: 'Órdenes de trabajo' },
        { label: 'Categorias de articulos para clientes y proveedores' },
        { label: 'Calendario' },
        { label: 'Informes de uso frecuente' },
      ],
    };
    const HelpSupportMenu: MenuItemConstructorOptions = {
      label: 'Help/Support',
      submenu: [
        {
          label: 'Ficha de articulos',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Perfiles',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
        { label: 'Categorias' },
        { label: 'Lotes (definición de conjuntos de artículos)' },
        { label: 'Consulta de precios de artículos' },
        { label: 'Almacenes' },
        { label: 'Fabricantes' },
        { label: 'Tarifas' },
      ],
    };

    return [UserManagementMenu, subMenuEdit, HelpSupportMenu];
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
                      !this.mainWindow.isFullScreen(),
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
                      !this.mainWindow.isFullScreen(),
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
                'https://github.com/electron/electron/tree/main/docs#readme',
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
