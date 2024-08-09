const { app, Menu } = require("electron");

const isMac = process.platform === "darwin";

const template = [
  ...(isMac
    ? [
        {
          label: "Files",
          submenu: [
            {
              label: "Company data",
              submenu: [
                { label: "Company data" },
                { label: "Company personal" },
                { label: "Company bank accounts" },
                { label: "Companies in this 'group of companies" },
              ],
            },
            { type: "separator" },
            {
              label: "Locations",
              submenu: [
                { label: "Currencies" },
                { label: "Countries" },
                { label: "Provinces" },
                { label: "Locations" },
              ],
            },
            { type: "separator" },
            { label: "Banks" },
            { type: "separator" },
            { label: "Taxes" },
            { type: "separator" },
            { label: "Withholdings" },
            { type: "separator" },
            { label: "Collection / Payment Periodicity" },
            { type: "separator" },
            { label: "Collection / payment methods" },
            { type: "separator" },
            { label: "Series" },
            { type: "separator" },
            { label: "Sales areas" },
            { type: "separator" },
            { label: "Remittances" },
            { type: "separator" },
            { label: "Incidents" },
            { type: "separator" },
            { label: "Apparatus" },
            { type: "separator" },
            { label: "Calendar" },
            { type: "separator" },
            { label: "Exit (press Alt + F4 on keyboard)" },
          ],
        },
        {
          label: "Reports",
          submenu: [
            {
              label: "Articles",
              submenu: [
                { label: "Articles" },
                { label: "Profiles" },
                { label: "Categories" },
                { label: "Manufacturers" },
                { label: "Batches (Sets)" },
                { label: "Rates" },
                { label: "Stock movements" },
              ],
            },
            {
              label: "Customers",
              submenu: [
                { label: "Customers" },
                { label: "Groups" },
                { label: "Sales reports and management documents" },
                { label: "Printing of management documents" },
                { label: "Commissions" },
                { label: "Registration of issued invoices" },
                { label: "Collections" },
                { label: "S.E.P.A. mandates" },
              ],
            },
            { label: "Suppliers", 
            submenu: [
                { label: "Suppliers" },
                { label: "Groups" },
                { label: "Purchase reports and management documents" },
                { label: "Invoices received" },
                { label: "Payments" },
            ]},
            { label: "Warehouse", 
                submenu: [{label: "Warehouse Docs"}] },
            { label: "Cash registers",
            submenu: [
                {label: "Cash drawers"},
                {label: "Cash status (pre-checks)"},
                {label: "Cash register operations"},
            ] },
            { label: "Names / Addresses" },
            { label: "Personal" },
            { label: " Bank Accounts" },
            { label: "Banks" },
            { label: "Withholdings" },
            { label: "Remittances" },
            { label: "Withholdings" },
            { label: "Sales and purchases statistics" },
            { label: "Incidents" },
            { label: "Operations by users or by posts" },
            { label: "Registration of modifications in cards" },
            { label: "Equipment" },
            { label: "Repairs" },
            { label: "Overhauls" },
            { label: "Work orders" },
            { label: "Customer and Supplier Item Categories" },
            { label: "Calendar" },
            { label: "Frequently used reports" },
          ],
        },
        {
            label: 'Articles',
            submenu: [
                {label: 'Articles tab'},
                {label: 'Profiles'},
                {label: 'Categories'},
                {label: 'Batches (definition of sets of items)'},
                {label: 'Price inquiry of items'},
                {label: 'Warehouses'},
                {label: 'Manufacturers'},
                {label: 'Prices'}
            ]
        },
        {
            label: 'Customers',
            submenu: [
                {label: 'Customer file'},
                {label: 'Groups'},
                {label: 'Agent zones / routes'},
                {label: "Carriers' zones / routes"},
                {label: 'Commission agents'},
                {label: 'Commission groups'},
                {label: 'Commission settlements'},
                {label: 'Commissions register'},
                {label: 'Management documents'},
                {label: 'Daily summary process of simplified invoices'},
                {label: "Invoices issued and 'invoice summaries'"},
                {label: 'Customer collections'},
                {label: 'Quick confirmation of multiple collections'},
                {label: 'S.E.P.A. debit mandates'},
            ]
        },
        {
            label: 'Proveedores',
            submenu: [
                {label: 'Ficha de proveedores y acreedores'},
                {label: 'Grupos'},
                {label: 'Documentos de gestion'},
                {label: 'Facturas recibidas'},
                {label: 'Pagos'},
                {label: 'Confirmación rápida de múltiples pagos'}
            ]
        },
        {
            label: 'Warehouse',
            submenu: [
                {label: 'Warehouse receipts'},
                {label: 'Outputs from the warehouse'},
                {label: 'Transfers between warehouses'},
                {label: 'Inventories'},
            ]
        },
        {
            label: 'Boxes',
            submenu: [
                {label: 'Coin boxes'},
                {label: 'Cash drawers'},
                {label: 'Cashier operations'},
                {label: 'Cashier operations'},
                {label: 'Quick cashiering process'},
            ]
        },
        {
            label: 'Configuration',
            submenu: [
                {label: 'Configurations'},
                {label: 'Positions'},
                {label: 'Users'},
                {label: 'User profiles'},
                {label: 'Devices'},
                {label: 'Printers'},
                {label: 'Search lists (validations)'},
            ]
        },
        {
            label: 'Auxiliary',
            submenu: [
                {label: 'Special processes',
                submenu: [
                    {label: 'Retrieve password from server administrator'},
                    {label: 'Monitor numbering'},
                    {label: 'S.Q.L. server access (restricted)'},
                    {label: 'Debug mode '},
                    {label: 'Registration of modifications on cards'},
                    {label: 'Simulate a reading from a serial port'},
                    {label: 'Execute the D.O.T tool'},
                    {label: 'Execute F.T.P client tool'},
                    {label: 'Execute (internal commands)'},
                    {label: 'Make a backup copy now'},
                    {label: 'Send data via Internet to Verial Soft'},
                    {label: 'Mass data deletion'},
                    {label: 'Monitor active workstations'},
                    {label: 'Monitoring of electronic cards'},
                    {label: 'Operations with item images'},
                    {label: 'Join generated reports as PDF files'},
                    {label: 'Synchronize the time (by accessing the Internet)'},
                    {label: 'Update a field from a file'}
                ]},
                {
                    label: 'Change user',
                },
                { label: 'Send message'},
                { label: 'Regenerate indexes and optimize files'},
                { label: 'Check data integrity'},
                { label: 'Change currency'},
                { label: 'Regenerate document concept'},
                { label: 'Check uppercase letters in names and addresses'},
                { label: 'Block modifications to old documents'},
                { label: 'Change the default year when entering dates'},
                { label: 'Update balances from previous years'},
                { label: 'Extra-accounting operations'},
                { label: 'Install extreme consultants'},
                { label: 'Install add-ins'},
                { label: 'Import data'},
                { label: 'Virtual store (on the Internet)'},
                { label: 'View all open windows'}    
            ],
            
        },
        {
            label: 'Help',
            submenu: [
                {label: 'View Changes to the latest version',
                submenu: [
                    {label: 'Common to all programs'},
                    {label: 'Commercial management'},
                    {label: 'Accounting'}
                ]},
                {label: 'Download iso manual',
                submenu: [
                    {label: 'Manual of program management'},
                    {label: 'Commercial Management Manual'},
                ]},
                {label: "Visit Verial Soft's website"},
                {label: "Send suggestions to Verial Soft"},
                {label: "Search for an update on the Internet"},
                {label: "Quick Help (press key F1)"},
                {label: "Open IP tunnel (remote assistance)"},
                {label: "Request remote control of the computer"},
                {label: "About the program"},
            ]
        }
        
      ]
    : []),
];

console.log(isMac);

let mainMenu = Menu.buildFromTemplate(template);

export default mainMenu;