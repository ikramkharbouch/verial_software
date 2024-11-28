import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import { getPayments } from "../../../api/financialsService"; // Fetch payments data
import { Bill } from "@renderer/types/types";

const ReceivedBillsPage: React.FC = () => {
  const [payments, setPayments] = useState<Bill[]>([]); // For Received Bills
  const [loading, setLoading] = useState(false);

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

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Client", dataIndex: "payer", key: "payer" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Method", dataIndex: "method", key: "method" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  return (
    <div>
      <h1>Received Bills</h1>
      <Table
        columns={columns}
        dataSource={payments}
        loading={loading}
        rowKey={(record) => record.id.toString()}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ReceivedBillsPage;
