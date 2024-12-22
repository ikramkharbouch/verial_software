import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';
import '../styles/dashboard.css';
import { DueInvoicesDataset, InvoiceOverview } from '@renderer/types/types';

interface InvoicesOverview {
  data: InvoiceOverview[]; // Ensure `data` is an array of `InvoiceOverview`
}

interface InvoicesOverviewBarProps {
  data: InvoiceOverview[]; // Expecting an array of InvoiceOverview
}

// const InvoicesOverviewBar: React.FC<InvoicesOverviewBarProps> = ({ data }) => {
//   return (
//     <ResponsiveBar
//       data={data as any}
//       keys={['outstanding', 'paid']}
//       indexBy="month"
//       margin={{ top: 50, right: 130, bottom: 80, left: 60 }}
//       padding={0.3}
//       layout="vertical"
//       colors={{ scheme: 'set2' }}
//       borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
//       axisTop={null}
//       axisRight={null}
//       axisBottom={{
//         tickSize: 5,
//         tickPadding: 5,
//         tickRotation: -45,
//         legend: 'Month',
//         legendPosition: 'middle',
//         legendOffset: 60,
//       }}
//       axisLeft={{
//         tickSize: 5,
//         tickPadding: 5,
//         tickRotation: 0,
//         legend: 'Amount ($)',
//         legendPosition: 'middle',
//         legendOffset: -40,
//       }}
//       labelSkipWidth={12}
//       labelSkipHeight={12}
//       labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
//       enableGridX={false}
//       enableGridY={true}
//       tooltip={({ id, value, color }) => (
//         <strong style={{ color }}>
//           {id}: ${value}
//         </strong>
//       )}
//       label={({ value }) => `$${value}`}
//       legends={[
//         {
//           dataFrom: 'keys',
//           anchor: 'bottom-right',
//           direction: 'column',
//           justify: false,
//           translateX: 120,
//           translateY: 0,
//           itemsSpacing: 2,
//           itemWidth: 100,
//           itemHeight: 20,
//           itemDirection: 'left-to-right',
//           itemOpacity: 0.85,
//           symbolSize: 20,
//           effects: [
//             {
//               on: 'hover',
//               style: {
//                 itemOpacity: 1,
//               },
//             },
//           ],
//         },
//       ]}
//       animate={true}
//     />
//   );
// };


// const DueDatesLineChart = (tempData: DueInvoicesDataset) => {
//   const data = [
//     {
//       id: 'Invoices',
//       data: [
//         { x: '2024-10-01', y: 5 },
//         { x: '2024-10-10', y: 7 },
//         { x: '2024-10-20', y: 4 },
//       ],
//     },
//   ];

//   return (
//     <ResponsiveLine
//       data={data as any}
//       margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
//       xScale={{ type: 'point' }}
//       yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true }}
//       axisBottom={{
//         legend: 'Date',
//         legendPosition: 'middle',
//         legendOffset: 36,
//       }}
//       axisLeft={{
//         legend: 'Due Invoices',
//         legendPosition: 'middle',
//         legendOffset: -40,
//       }}
//     />
//   );
// };

const RevenueExpensesLineChart = () => {
  const data = [
    {
      id: 'Revenue',
      data: [
        { x: 'January', y: 10000 },
        { x: 'February', y: 12000 },
        { x: 'March', y: 9000 },
      ],
    },
    {
      id: 'Expenses',
      data: [
        { x: 'January', y: 7000 },
        { x: 'February', y: 8000 },
        { x: 'March', y: 6000 },
      ],
    },
  ];

  return (
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
    />
  );
};

const InvoiceStatusPieChart = (data: InvoicesOverview) => {
  return (
    <div className="financials-container">
      {/* <InvoicesOverviewBar data={data as any} /> */}
      {/* <DueDatesLineChart data={[]} id={''} /> */}
      <RevenueExpensesLineChart />
    </div>
  );
};

export default InvoiceStatusPieChart;
