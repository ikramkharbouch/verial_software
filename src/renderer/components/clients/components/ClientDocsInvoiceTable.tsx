import React from 'react';
import { Table } from 'antd';

const InvoiceTable = ({ data, columns, rowSelection }: any) => {
  return (
    <Table
      rowSelection={rowSelection as any}
      dataSource={data}
      columns={columns}
      rowKey="id"
      scroll={{ x: 'max-content' }}
      pagination={{
        pageSize: 7,
        showSizeChanger: true, // Allow the user to change the page size
        showQuickJumper: true, // Allow the user to quickly jump to a page
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} items`, // Show total number of items
      }}
      style={{ width: '100%' }}
    />
  );
};

export default InvoiceTable;
