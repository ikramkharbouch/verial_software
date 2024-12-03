import React, { useEffect, useState } from "react";
import { Table, Input, InputNumber, DatePicker, Button, Row, Col, message, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import moment, { Moment } from "moment";
import { getPayments } from "../../../api/financialsService"; // Fetch payments data
import { Bill } from "@renderer/types/types";

const { RangePicker } = DatePicker;

// Define RangeValue manually
type RangeValue<T> = [T | null, T | null] | null;

// Define the type for filters
interface Filters {
  payer: string;
  method: string;
  status: string;
  dateRange: RangeValue<Moment>;
  minAmount: number | undefined;
  maxAmount: number | undefined;
}

const ReceivedBillsPage: React.FC = () => {
  const [payments, setPayments] = useState<Bill[]>([]); // For Received Bills
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    payer: "",
    method: "",
    status: "",
    dateRange: null,
    minAmount: undefined,
    maxAmount: undefined,
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await getPayments();
      setPayments(data);
    } catch (error) {
      message.error("Failed to load received bills");
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Action
  const handleDelete = (id: string) => {
    console.log("Delete bill with ID:", id);
    // Add logic for deletion here (e.g., call an API endpoint)
  };

  // Handle Edit Action
  const handleEdit = (id: string) => {
    console.log("Edit bill with ID:", id);
    // Add logic for editing here (e.g., open a modal or navigate to an edit page)
  };

  // Handle Download Action
  const handleDownload = (id: string) => {
    console.log("Download bill with ID:", id);
    // Add logic for downloading here (e.g., call an API endpoint to download the invoice)
  };

  // Filtered Data
  const filteredData = payments.filter((bill) => {
    const { payer, method, status, dateRange, minAmount, maxAmount } = filters;

    const isPayerMatch = payer
      ? bill.payer.toLowerCase().includes(payer.toLowerCase())
      : true;

    const isMethodMatch = method ? bill.method === method : true;

    const isStatusMatch = status ? bill.status === status : true;

    const isDateInRange =
      dateRange && dateRange[0] && dateRange[1]
        ? moment(bill.date).isBetween(dateRange[0], dateRange[1], "day", "[]")
        : true;

    const isAmountMatch =
      (minAmount === undefined || bill.amount >= minAmount) &&
      (maxAmount === undefined || bill.amount <= maxAmount);

    return isPayerMatch && isMethodMatch && isStatusMatch && isDateInRange && isAmountMatch;
  });

  // Define table columns
  const columns: ColumnsType<Bill> = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Client", dataIndex: "payer", key: "payer" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Method", dataIndex: "method", key: "method" },
    { title: "Date", dataIndex: "date", key: "date", render: (date: string) => moment(date).format("YYYY-MM-DD") },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: Bill) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button type="link" onClick={() => handleDownload(record.id as any)}>
            Download
          </Button>
          <Button type="link" onClick={() => handleEdit(record.id as any)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this bill?"
            onConfirm={() => handleDelete(record.id as any)}
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
      <Row gutter={[16, 16]} style={{ margin: "16px 0 16px 0" }}>
        <Col span={6}>
          <Input
            placeholder="Search Client"
            value={filters.payer}
            onChange={(e) => setFilters({ ...filters, payer: e.target.value })}
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
            onChange={(dates: any) => setFilters({ ...filters, dateRange: dates })}
          />
        </Col>
        <Col span={3}>
          <InputNumber
            placeholder="Min Amount"
            value={filters.minAmount}
            onChange={(value) => setFilters({ ...filters, minAmount: value || undefined })}
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={3}>
          <InputNumber
            placeholder="Max Amount"
            value={filters.maxAmount}
            onChange={(value) => setFilters({ ...filters, maxAmount: value || undefined })}
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={6}>
          <Button type="primary" block>
            Apply Filters
          </Button>
        </Col>
      </Row>

      {/* Table Section */}
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey={(record) => record.id.toString()}
        pagination={{ pageSize: 7 }}
      />
    </div>
  );
};

export default ReceivedBillsPage;