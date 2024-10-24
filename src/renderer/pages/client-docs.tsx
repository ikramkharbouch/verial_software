import React from 'react';
import { Table, Button } from 'antd';

interface Document {
    id: number;
    title: string;
    clientName: string;
    date: string;
    actions: string; // or more detailed action definitions
}

const documentsData: Document[] = [
    { id: 1, title: 'Document 1', clientName: 'Client A', date: '2024-01-01', actions: 'View/Edit' },
    { id: 2, title: 'Document 2', clientName: 'Client B', date: '2024-02-15', actions: 'View/Edit' },
    // Add more document data as needed
];

const ClientDocs: React.FC = () => {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Document Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Client Name',
            dataIndex: 'clientName',
            key: 'clientName',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_: any, record: Document) => (
                <Button type="link" onClick={() => handleViewDocument(record.id)}>
                    View
                </Button>
            ),
        },
    ];

    const handleViewDocument = (id: number) => {
        // Implement the logic to view the document
        console.log(`Viewing document with ID: ${id}`);
    };

    const handleUploadDocument = () => {
        // Implement the logic to upload a new document
        console.log('Upload new document');
    };

    return (
        <div>
            <h1>Client Documents</h1>
            <Button type="primary" onClick={handleUploadDocument} style={{ marginBottom: '20px' }}>
                Upload Document
            </Button>
            <Table
                dataSource={documentsData}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                style={{ width: '100%' }}
            />
        </div>
    );
};

export default ClientDocs;
