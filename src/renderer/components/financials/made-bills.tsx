import React, { useEffect, useState } from 'react';
import {
  Table,
  Input,
  DatePicker,
  InputNumber,
  Button,
  Row,
  Col,
  Popconfirm,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment, { Moment } from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import {
  fetchAllMadeBills,
  removeMadeBill,
  downloadInvoice,
} from '../../../store/slices/financialsSlice';

const { RangePicker } = DatePicker;

// Define RangeValue manually
type RangeValue<T> = [T | null, T | null] | null;

// Update the type for MadeBill based on your backend data
interface MadeBill {
  id: string; // Example: "MB005"
  provider: string; // Example: "Knight-Newton"
  amount: string; // Example: "1343.73"
  method: string; // Example: "Cash"
  date: string; // ISO string (e.g., "2024-07-31T23:00:00.000Z")
  status: string; // Example: "Paid"
}

// Filters type
interface Filters {
  provider: string;
  method: string;
  status: string;
  dateRange: RangeValue<Moment>;
  minAmount: number | undefined;
  maxAmount: number | undefined;
}

const MadeBills: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Access Redux state
  const { madeBills, loading } = useSelector(
    (state: RootState) => state.financials.madeBillsState,
  );

  // Local state for filters
  const [filters, setFilters] = useState<Filters>({
    provider: '',
    method: '',
    status: '',
    dateRange: null,
    minAmount: undefined,
    maxAmount: undefined,
  });

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchAllMadeBills());
  }, [dispatch]);

  // Filter data based on local state
  const filteredData = madeBills.filter((bill) => {
    const { provider, method, status, dateRange, minAmount, maxAmount } =
      filters;

    const isProviderMatch = provider
      ? bill.provider.toLowerCase().includes(provider.toLowerCase())
      : true;

    const isMethodMatch = method ? bill.method === method : true;

    const isStatusMatch = status ? bill.status === status : true;

    const isDateInRange =
      dateRange && dateRange[0] && dateRange[1]
        ? moment(bill.date).isBetween(dateRange[0], dateRange[1], 'day', '[]')
        : true;

    const isAmountMatch =
      (minAmount === undefined ||
        parseFloat(bill.amount as any) >= minAmount) &&
      (maxAmount === undefined || parseFloat(bill.amount as any) <= maxAmount);

    return (
      isProviderMatch &&
      isMethodMatch &&
      isStatusMatch &&
      isDateInRange &&
      isAmountMatch
    );
  });

  // Define table columns
  const columns: ColumnsType<MadeBill> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Provider',
      dataIndex: 'provider',
      key: 'provider',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string) => `\$${parseFloat(amount).toFixed(2)}`, // Format to 2 decimal places
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => moment(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: MadeBill) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Download Action */}
          <Button
            type="link"
            onClick={() => dispatch(downloadInvoice(record.id))}
          >
            Download
          </Button>

          {/* Edit Action */}
          <Button type="link" onClick={() => console.log('Edit', record.id)}>
            Edit
          </Button>

          {/* Delete Action */}
          <Popconfirm
            title="Are you sure to delete this bill?"
            onConfirm={() => dispatch(removeMadeBill(record.id))}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1>Received Bills</h1>

      {/* Filters Section */}
      <Row gutter={[16, 16]} style={{ margin: '16px 0 16px 0' }}>
        <Col span={6}>
          <Input
            placeholder="Search Provider"
            value={filters.provider}
            onChange={(e) =>
              setFilters({ ...filters, provider: e.target.value })
            }
          />
        </Col>
        <Col span={6}>
          <Input
            placeholder="Search Method"
            value={filters.method}
            onChange={(e) => setFilters({ ...filters, method: e.target.value })}
          />
        </Col>
        <Col span={6}>
          <Input
            placeholder="Search Status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          />
        </Col>
        <Col span={6}>
          <RangePicker
            onChange={(dates: any) =>
              setFilters({ ...filters, dateRange: dates })
            }
          />
        </Col>
        <Col span={3}>
          <InputNumber
            placeholder="Min Amount"
            value={filters.minAmount}
            onChange={(value) =>
              setFilters({ ...filters, minAmount: value || undefined })
            }
            style={{ width: '100%' }}
          />
        </Col>
        <Col span={3}>
          <InputNumber
            placeholder="Max Amount"
            value={filters.maxAmount}
            onChange={(value) =>
              setFilters({ ...filters, maxAmount: value || undefined })
            }
            style={{ width: '100%' }}
          />
        </Col>
      </Row>

      {/* Table Section */}
      <Table
        columns={columns as any}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default MadeBills;
