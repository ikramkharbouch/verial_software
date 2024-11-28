import React, { useEffect, useState } from 'react';
import { Table, Input, Button } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import {
  fetchAllMadeBills,
  removeMadeBill,
  downloadInvoice
} from '../../../store/slices/financialsSlice';

const MadeBillsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Get state from Redux
  const { madeBills, loading } = useSelector((state: RootState) => state.financials.madeBillsState);

  const [filteredData, setFilteredData] = useState(madeBills);
  const [searchText, setSearchText] = useState('');

  // Fetch made bills on component mount
  useEffect(() => {
    dispatch(fetchAllMadeBills());
  }, [dispatch]);

  // Update filtered data whenever the original data changes
  useEffect(() => {
    setFilteredData(madeBills);
  }, [madeBills]);

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = madeBills.filter((bill) =>
      Object.values(bill).some((field) =>
        String(field).toLowerCase().includes(value)
      )
    );
    setFilteredData(filtered);
  };

  const handleDownload = (id: string) => {
    console.log("handle download id", id);
    dispatch(downloadInvoice(id)); // Dispatch within the function
  }
  // Handle deleting a made bill
  const handleDelete = (id: string) => {
    dispatch(removeMadeBill(id));
  };

  // Define table columns
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Provider', dataIndex: 'provider', key: 'provider' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount: number) => `$${amount}` },
    { title: 'Method', dataIndex: 'method', key: 'method' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <div>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record.id)}
            style={{ marginRight: 8 }}
          >
            Download
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1>Made Bills</h1>
      <Input
        placeholder="Search anything..."
        value={searchText}
        onChange={handleSearch}
        prefix={<SearchOutlined />}
        style={{ marginBottom: '20px', width: '300px' }}
      />
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
};

export default MadeBillsPage;
