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
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'Ficheros',
      submenu: [
        {
          label: 'Datos de la empresa',
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
      label: 'Informes',
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
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'Articulos',
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
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: 'Clientes',
      submenu: [
        {
          label: 'Ficha de clientes',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        { label : 'Grupos' },
        { label : ' Zonas / rutas de agentes' },
        { label : 'Zonas / rutas de transportistas' },
        { label : 'Comisionistas' },
        { label : 'Grupos de comisiones' },
        { label : 'Liquidaciones de comisiones' },
        { label : 'Registro de comisiones ' },
        { label : 'Documentos de gestion' },
        { label : 'Processo de resumen diario de facturas simplificadas' },
        { label : 'Facturas emitidas y ‘resúmenes de fras’' },
        { label : 'Cobros a clientes' },
        { label : 'Confirmación rápida de múltiples cobros' },
        { label : 'Mandatos para los adeudos S.E.P.A' },
      ],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: 'Proveedores',
      submenu: [
        {
          label: 'Ficha de proveedores y acreedores',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: 'Grupos', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Documentos de gestion', selector: 'arrangeInFront:' },
        { label: 'Facturas recibidas', selector: 'arrangeInFront:' },
        { label: 'Pagos', selector: 'arrangeInFront:' },
        { label: 'Confirmación rápida de múltiples pagos', selector: 'arrangeInFront:' },
      ],
    };
    const CajasMenu: MenuItemConstructorOptions = {
      label: 'Cajas',
      submenu: [
        {
          label: 'Cajones de monedas ',
          click() {
            shell.openExternal('https://electronjs.org');
          },
        },
        {
          label: 'Arqueos',
          click() {
            shell.openExternal('https://electronjs.org');
          },
        },
        {
          label: 'Operaciones de caja',
          click() {
            shell.openExternal(
              'https://github.com/electron/electron/tree/main/docs#readme',
            );
          },
        },
        {
          label: 'Abrir el cajón de monedas',
          click() {
            shell.openExternal('https://www.electronjs.org/community');
          },
        },
        {
          label: 'Proceso de arqueo rápido',
          click() {
            shell.openExternal('https://github.com/electron/electron/issues');
          },
        },
      ],
    };

    const ConfiguracionMenu: MenuItemConstructorOptions = {
      label: 'Configuracion',
      submenu: [
        {
          label: 'Configuraciones',
          click() {
            shell.openExternal('https://electronjs.org');
          },
        },
        {
          label: 'Puestos',
          click() {
            shell.openExternal(
              'https://github.com/electron/electron/tree/main/docs#readme',
            );
          },
        },
        {
          label: 'Usuarios',
          click() {
            shell.openExternal('https://www.electronjs.org/community');
          },
        },
        {
          label: 'Perfiles de usuarios',
          click() {
            shell.openExternal('https://github.com/electron/electron/issues');
          },
        },
        {
          label: 'Dispositivos',
          click() {
            shell.openExternal('https://github.com/electron/electron/issues');
          },
        },
        {
          label: 'Impresoras',
          click() {
            shell.openExternal('https://github.com/electron/electron/issues');
          },
        },
        {
          label: 'Listas de búsqueda (validaciones)',
          click() {
            shell.openExternal('https://github.com/electron/electron/issues');
          },
        }
      ],
    };

    const subMenuHelp: MenuItemConstructorOptions = {
      label: 'Almacen',
      submenu: [
        {
          label: 'Entradas al almacén',
          click() {
            shell.openExternal('https://electronjs.org');
          },
        },
        {
          label: 'Salidas del almacén',
          click() {
            shell.openExternal(
              'https://github.com/electron/electron/tree/main/docs#readme',
            );
          },
        },
        {
          label: 'Traspasos entre almacenes',
          click() {
            shell.openExternal('https://www.electronjs.org/community');
          },
        },
        {
          label: 'Inventarios',
          click() {
            shell.openExternal('https://github.com/electron/electron/issues');
          },
        },
      ],
    };


    const AuxiliarMenu: MenuItemConstructorOptions = {
      label: 'Auxiliar',
      submenu: [
        {
          label: 'Procesos especiales',
          click() {
            shell.openExternal('https://electronjs.org');
          },
          submenu: [
            { label: 'Recuperar clave del administrador del servidor' },
            { label: 'Supervisar numeraciones' },
            { label: 'Acceso (restringido) al servidor S.Q.L' },
            { label: 'Modo de Depuracion' },
            { label: 'Registro de modificaciones en fichas' },
            { label: 'Simular una lectura desde un puerto serie' },
            { label: 'Ejecutar la herramienta D.O.T' },
            { label: 'Ejecutar la herramienta cliente F.T.P' },
            { label: 'Ejecutar (órdenes internas)' },
            { label: 'Realizar ahora una copia de seguridad' },
            { label: 'Enviar datos por Internet a Verial Soft' },
            { label: 'Borrado masivo de datos' },
            { label: 'Monitorizar los puestos activos' },
            { label: 'Supervisión de tarjetas electrónicas' },
            { label: 'Operaciones con la imágenes de los artículos' },
            { label: 'Unir informes generados como Ficheros PDF' },
            { label: 'Sincronizar la hora (accediendo a Internet)' },
            { label: 'Actualizar un campo a partir de un fichero' },
          ]
        },
        {
          label: 'Cambiar de usuario',
          click() {
            shell.openExternal('https://electronjs.org');
          },
        },
        {
          label: 'Enviar mensaje',
          click() {
            shell.openExternal(
              'https://github.com/electron/electron/tree/main/docs#readme',
            );
          },
        },
        {
          label: 'Regenerar índices y optimizar ficheros',
          click() {
            shell.openExternal('https://www.electronjs.org/community');
          },
        },
        {
          label: 'Comprobar la integridad de los datos',
          click() {
            shell.openExternal('https://github.com/electron/electron/issues');
          },
        },
        {
          label: 'Cambio de divisa',
          click() {
            shell.openExternal('https://github.com/electron/electron/issues');
          },
        },
        {
          label: 'Cambio de divisa',
          click() {
            shell.openExternal('https://github.com/electron/electron/issues');
          },
        },
        { label: 'Regenerar el concepto de los documentos' },
        { label: 'Comprobar letras mayúsculas en nombres y direcciones' },
        { label: 'Bloquear las modificaciones a documentos antiguos' },
        { label: 'Cambiar el ano por defecto al introducir fechas' },
        { label: 'Actualizar saldos de ejercicios anteriores' },
        { label: 'Operaciones extracontables' },
        { label: 'Instalar consultores extremos' },
        { label: 'Instalar complementos' },
        { label: 'Importación de datos' },
        { label: 'Tienda virtual (en Internet)' },
        { label: 'Ver todas las ventanas que están abiertas' }
      ],
    };

    const AyudaMenu: MenuItemConstructorOptions = {
      label: 'Ayuda',
      submenu: [
        {
          label: 'Cajones de monedas ',
          click() {
            shell.openExternal('https://electronjs.org');
          },
        },
        {
          label: 'Arqueos',
          click() {
            shell.openExternal('https://electronjs.org');
          },
        },
        {
          label: 'Operaciones de caja',
          click() {
            shell.openExternal(
              'https://github.com/electron/electron/tree/main/docs#readme',
            );
          },
        },
        {
          label: 'Abrir el cajón de monedas',
          click() {
            shell.openExternal('https://www.electronjs.org/community');
          },
        },
        {
          label: 'Proceso de arqueo rápido',
          click() {
            shell.openExternal('https://github.com/electron/electron/issues');
          },
        },
      ],
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp, CajasMenu, ConfiguracionMenu, AuxiliarMenu, AyudaMenu];
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
