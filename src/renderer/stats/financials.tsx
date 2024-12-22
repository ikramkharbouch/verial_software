import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';
import '../styles/dashboard.css'

const InvoicesOverviewBar = () => {
  const data = [
    { month: "January", outstanding: 4000, paid: 3000 },
    { month: "February", outstanding: 5000, paid: 2500 },
    { month: "March", outstanding: 3000, paid: 4000 },
  ];

  return (
    <ResponsiveBar
      data={data}
      keys={['outstanding', 'paid']}
      indexBy="month"
      margin={{ top: 50, right: 130, bottom: 70, left: 60 }} // Increased bottom margin
      padding={0.3}
      layout="vertical" // Vertical bars
      colors={{ scheme: 'set2' }} // Color scheme for bars
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -45, // Rotated labels for better visibility
        legend: 'Month',
        legendPosition: 'middle',
        legendOffset: 50, // Adjusted offset to accommodate rotated labels
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Amount ($)',
        legendPosition: 'middle',
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      enableGridX={false} // Gridlines on the Y-axis
      enableGridY={true} // Gridlines on the X-axis
      tooltip={({ id, value, color }) => (
        <strong style={{ color }}>
          {id}: ${value}
        </strong>
      )}
      label={({ value }) => `$${value}`} // Labels for each bar
      legends={[
        {
          dataFrom: 'keys',
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      animate={true}
    />
  );
};


const DueDatesLineChart = () => {
  const data = [
    {
      id: "Invoices",
      data: [
        { x: "2024-10-01", y: 5 },
        { x: "2024-10-10", y: 7 },
        { x: "2024-10-20", y: 4 },
      ],
    },
  ];

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true }}
      axisBottom={{ legend: 'Date', legendPosition: 'middle', legendOffset: 36 }}
      axisLeft={{ legend: 'Due Invoices', legendPosition: 'middle', legendOffset: -40 }}
    />
  );
};

const RevenueExpensesLineChart = () => {
  const data = [
    {
      id: "Revenue",
      data: [
        { x: "January", y: 10000 },
        { x: "February", y: 12000 },
        { x: "March", y: 9000 },
      ],
    },
    {
      id: "Expenses",
      data: [
        { x: "January", y: 7000 },
        { x: "February", y: 8000 },
        { x: "March", y: 6000 },
      ],
    },
  ];

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
      axisBottom={{ legend: 'Month', legendPosition: 'middle', legendOffset: 36 }}
      axisLeft={{ legend: 'Amount ($)', legendPosition: 'middle', legendOffset: -40 }}
    />
  );
};




const InvoiceStatusPieChart = () => {
  return (<div className='financials-container'>
    <InvoicesOverviewBar />
    <DueDatesLineChart />
    <RevenueExpensesLineChart />
  </div>)
};

export default InvoiceStatusPieChart;
