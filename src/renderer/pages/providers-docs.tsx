import React, { useState } from 'react';
import { Button, Table, Checkbox } from 'antd';

interface ProviderDocument {
  id: string;
  invoiceNumber: string;
  providerName: string;
  invoiceType: string;
  date: string;
  totalPrice: string;
}

const ProvidersDocumentsPage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const columns = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
    },
    {
      title: 'Provider Name',
      dataIndex: 'providerName',
      key: 'providerName',
    },
    {
      title: 'Invoice Type',
      dataIndex: 'invoiceType',
      key: 'invoiceType',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Total Price (with TVA)',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
    },
    {
      title: 'Download',
      key: 'download',
      render: () => <Button type="link">Download</Button>,
    },
  ];

  const data: ProviderDocument[] = Array.from({ length: 50 }, (_, i) => ({
    id: (i + 1).toString(),
    invoiceNumber: `INV-${1000 + i}`,
    providerName: `Provider ${i + 1}`,
    invoiceType: i % 2 === 0 ? 'Standard' : 'Express',
    date: `2024-10-${(i % 30) + 1}`,
    totalPrice: `$${(Math.random() * 1000 + 100).toFixed(2)}`,
  }));

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  return (
    <div>
      <h1 style={{ marginBottom: '16px' }}>Providers Documents</h1>
      <div style={{ marginBottom: '16px' }}>
        <Checkbox
          checked={selectedRowKeys.length === data.length}
          indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < data.length}
          onChange={(e) =>
            setSelectedRowKeys(e.target.checked ? data.map((item) => item.id) : [])
          }
          style={{ marginRight: '12px' }}
        >
          Select All
        </Checkbox>
        <Button
          type="primary"
          onClick={() => console.log('Download selected as ZIP:', selectedRowKeys)}
          disabled={selectedRowKeys.length === 0}
        >
          Download All as ZIP
        </Button>
      </div>
      <Table<ProviderDocument>
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ pageSize: 7 }}
      />
    </div>
  );
};

export default ProvidersDocumentsPage;
