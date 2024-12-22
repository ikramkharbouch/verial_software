import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import '../styles/dashboard.css';

// Define the types for RevenueExpenses data
export interface RevenueExpensesDataPoint {
  x: string; // Represents the category (e.g., "January")
  y: number; // Represents the value (e.g., 10000)
}

export interface RevenueExpensesSeries {
  id: string;                        // Name of the series (e.g., "Revenue", "Expenses")
  data: RevenueExpensesDataPoint[];  // Array of data points for the series
}

// Props for RevenueExpensesLineChart
interface RevenueExpensesLineChartProps {
  data: RevenueExpensesSeries[]; // The data for the line chart
}

// Component: RevenueExpensesLineChart
const RevenueExpensesLineChart: React.FC<RevenueExpensesLineChartProps> = ({ data }) => {
  return (
    <div style={{ height: '300px', width: '100%', overflow: 'hidden' }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
        axisBottom={{
          legend: 'Month',
          legendPosition: 'middle',
          legendOffset: 36,
        }}
        axisLeft={{
          legend: 'Amount ($)',
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        colors={{ scheme: 'nivo' }}
        enableGridX={false}
        enableGridY={true}
        pointSize={10}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: 'top-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

// Props for InvoiceStatusPieChart
interface InvoiceStatusPieChartProps {
  data: RevenueExpensesSeries[]; // The data for the pie chart
}

// Component: InvoiceStatusPieChart
const InvoiceStatusPieChart: React.FC<InvoiceStatusPieChartProps> = ({ data }) => {
  return (
    <div className="financials-container">
      <RevenueExpensesLineChart data={data} />
    </div>
  );
};

export default InvoiceStatusPieChart;
