import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import { getCharges } from "../../../api/financialsService"; // Fetch charges data
import { Bill } from "@renderer/types/types";

const MadeBillsPage: React.FC = () => {
  const [charges, setCharges] = useState<Bill[]>([]); // For Made Bills
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCharges();
  }, []);

  const fetchCharges = async () => {
    setLoading(true);
    try {
      const data = await getCharges();
      setCharges(data);
    } catch (error) {
      message.error("Failed to load made bills");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Provider", dataIndex: "payer", key: "payer" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Method", dataIndex: "method", key: "method" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  return (
    <div>
      <h1>Made Bills</h1>
      <Table
        columns={columns}
        dataSource={charges}
        loading={loading}
        rowKey={(record) => record.id.toString()}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default MadeBillsPage;
