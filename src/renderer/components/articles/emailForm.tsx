import React, { useState } from "react";
import jsPDF from "jspdf";

interface SalesData {
    productName: string;
    quantitySold: number;
    totalSaleValue: number;
}

const EmailForm: React.FC<{ salesData: SalesData }> = ({ salesData }) => {
    const [recipient, setRecipient] = useState("");
    const [subject, setSubject] = useState("Sales Report");
    const [message, setMessage] = useState("Please find attached the sales report.");

    const handleSendEmail = async () => {
        // Generate PDF
        const doc = new jsPDF();
        doc.text("Sales Report", 10, 10);
        doc.text(`Product Name: ${salesData.productName}`, 10, 20);
        doc.text(`Quantity Sold: ${salesData.quantitySold}`, 10, 30);
        doc.text(`Total Sale Value: ${salesData.totalSaleValue}`, 10, 40);
        const pdfBlob = doc.output("blob");

        // Create FormData for sending email data and PDF
        const formData = new FormData();
        formData.append("recipient", recipient);
        formData.append("subject", subject);
        formData.append("message", message);
        formData.append("pdf", pdfBlob, "sales_report.pdf");

        // Send data to backend
        const response = await fetch("http://localhost:3001/email/send-email", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            alert("Email sent successfully!");
        } else {
            alert("Failed to send email.");
        }
    };

    return (
    <div>
            <h3>Send Sales Report</h3>
            <form onSubmit={(e) => e.preventDefault()}>
                <label>
                    Recipient:
                    <input type="email" value={recipient} onChange={(e) => setRecipient(e.target.value)} required />
                </label>
                <label>
                    Subject:
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
                </label>
                <label>
                    Message:
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
                </label>
                <button type="button" onClick={handleSendEmail}>Send Email</button>
            </form>
        </div>
    );
};

export default EmailForm;
