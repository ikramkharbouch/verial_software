import React, { useState } from 'react';
import { Button, Table, Space, Card, Input, DatePicker, Select } from 'antd';
import moment, { Moment } from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface SalesData {
  id: string;
  productName: string;
  manufacturer: string;
  category: string;
  dateOfSale: string;
  quantitySold: number;
  totalSaleValue: string;
}

interface SalesOverviewProps {
  onClose: () => void;
}

const SalesOverview: React.FC<SalesOverviewProps> = ({ onClose }) => {
  const initialSalesData: SalesData[] = [
    { id: '1', productName: 'All-Season Tire A', manufacturer: 'Tire Co.', category: 'Tires', dateOfSale: '2024-10-01', quantitySold: 5, totalSaleValue: '$500' },
    { id: '2', productName: 'Winter Tire B', manufacturer: 'Winter Wheels', category: 'Tires', dateOfSale: '2024-10-02', quantitySold: 3, totalSaleValue: '$300' },
    { id: '3', productName: 'Performance Tire C', manufacturer: 'Speedy Tires', category: 'Tires', dateOfSale: '2024-10-03', quantitySold: 10, totalSaleValue: '$1000' },
    { id: '4', productName: 'Oil Synthetic X', manufacturer: 'Lubricants Inc.', category: 'Oil', dateOfSale: '2024-10-04', quantitySold: 20, totalSaleValue: '$400' },
    { id: '5', productName: 'All-Season Tire D', manufacturer: 'Tire Co.', category: 'Tires', dateOfSale: '2024-10-05', quantitySold: 15, totalSaleValue: '$1500' },
    { id: '6', productName: 'Oil Mineral Y', manufacturer: 'Engine Essentials', category: 'Oil', dateOfSale: '2024-10-06', quantitySold: 8, totalSaleValue: '$160' },
    { id: '7', productName: 'Sport Tire E', manufacturer: 'Racing Tires', category: 'Tires', dateOfSale: '2024-10-07', quantitySold: 4, totalSaleValue: '$800' },
    { id: '8', productName: 'Oil Synthetic Z', manufacturer: 'Lubricants Inc.', category: 'Oil', dateOfSale: '2024-10-08', quantitySold: 12, totalSaleValue: '$240' },
    { id: '9', productName: 'Truck Tire F', manufacturer: 'Heavy Duty Tires', category: 'Tires', dateOfSale: '2024-10-09', quantitySold: 2, totalSaleValue: '$300' },
    { id: '10', productName: 'All-Season Tire G', manufacturer: 'Tire Co.', category: 'Tires', dateOfSale: '2024-10-10', quantitySold: 6, totalSaleValue: '$600' },
  ];

  const [filteredData, setFilteredData] = useState<SalesData[]>(initialSalesData);
  const [productName, setProductName] = useState<string>('');
  const [manufacturer, setManufacturer] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[Moment | null, Moment | null]>([null, null]);

  const handleSearch = () => {
    const filtered = initialSalesData.filter(item => {
      const matchesProductName = item.productName.toLowerCase().includes(productName.toLowerCase());
      const matchesManufacturer = manufacturer ? item.manufacturer === manufacturer : true;
      const matchesDateRange = dateRange[0] && dateRange[1] 
        ? new Date(item.dateOfSale) >= dateRange[0]?.toDate() && new Date(item.dateOfSale) <= dateRange[1]?.toDate()
        : true;
      return matchesProductName && matchesManufacturer && matchesDateRange;
    });
    setFilteredData(filtered);
  };

  function handlePrint(SalesData: any) {
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";

    document.body.appendChild(iframe);

    // Convert SalesData to HTML content here. Example:
    const content = `
        <div>
            <h1>Sales Report</h1>
            <p>Product Name: ${SalesData.productName}</p>
            <p>Quantity Sold: ${SalesData.quantitySold}</p>
            <p>Total Sale Value: ${SalesData.totalSaleValue}</p>
            <!-- Add other relevant sales data fields as needed -->
        </div>
    `;

    iframe.contentWindow?.document.open();
    iframe.contentWindow?.document.write(`
        <html>
            <head>
                <title>Print Preview</title>
                <style>
                    /* Add necessary styling here */
                </style>
            </head>
            <body onload="window.print(); window.close();">
                ${content}
            </body>
        </html>
    `);
    iframe.contentWindow?.document.close();

    // Cleanup after printing
    iframe.onload = () => {
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 1000);
    };
}

  

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Sales Overview</h2>
      <Card style={{ marginBottom: '20px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space style={{ marginBottom: '10px' }}>
            <Input 
              placeholder="Search by Product Name" 
              value={productName} 
              onChange={(e) => setProductName(e.target.value)} 
              onPressEnter={handleSearch} // Trigger search on Enter key
            />
            <Select 
              placeholder="Select Manufacturer" 
              style={{ width: '200px' }} 
              onChange={(value) => setManufacturer(value as string)}
              allowClear
            >
              <Option value="Tire Co.">Tire Co.</Option>
              <Option value="Winter Wheels">Winter Wheels</Option>
              <Option value="Speedy Tires">Speedy Tires</Option>
              <Option value="Lubricants Inc.">Lubricants Inc.</Option>
              <Option value="Engine Essentials">Engine Essentials</Option>
              <Option value="Racing Tires">Racing Tires</Option>
              <Option value="Heavy Duty Tires">Heavy Duty Tires</Option>
            </Select>
            <RangePicker 
              onChange={(dates: any) => {
                setDateRange(dates);
                handleSearch(); // Trigger search when dates are selected
              }} 
              value={dateRange as any}
            />
            <Button onClick={handleSearch}>Search</Button>
          </Space>
        </Space>
      </Card>
      <Table
        dataSource={filteredData}
        columns={[
          { title: 'ID', dataIndex: 'id', key: 'id' },
          { title: 'Product Name', dataIndex: 'productName', key: 'productName' },
          { title: 'Manufacturer', dataIndex: 'manufacturer', key: 'manufacturer' },
          { title: 'Category', dataIndex: 'category', key: 'category' },
          { title: 'Date of Sale', dataIndex: 'dateOfSale', key: 'dateOfSale' },
          { title: 'Quantity Sold', dataIndex: 'quantitySold', key: 'quantitySold' },
          { title: 'Total Sale Value', dataIndex: 'totalSaleValue', key: 'totalSaleValue' },
          {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
              <Space size="middle">
                <Button>View</Button>
                <Button onClick={() => handlePrint(record)}>Print</Button>
                <Button>Email</Button>
              </Space>
            ),
          },
        ]}
        pagination={{ pageSize: 7 }}
      />
      <Button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px' }}>
        Close
      </Button>
    </div>
  );
};

export default SalesOverview;
