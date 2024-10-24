import { ResponsiveBar } from '@nivo/bar';

const ArticlesPerformanceBarChart = () => {
  const data = [
    {
      product: "Michelin",
      sold: 500,
      used: 700,
    },
    {
      product: "Bridgestone",
      sold: 400,
      used: 500,
    },
    {
      product: "Goodyear",
      sold: 300,
      used: 450,
    },
    {
      product: "Pirelli",
      sold: 200,
      used: 300,
    },
    {
      product: "Continental",
      sold: 100,
      used: 150,
    },
  ];

  const keys = ['sold', 'used'];

  return (
    <ResponsiveBar
      data={data}
      keys={keys}
      indexBy="product"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={{ scheme: 'nivo' }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Product',
        legendPosition: 'middle',
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Units',
        legendPosition: 'middle',
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
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
      role="application"
      ariaLabel="Articles performance bar chart"
      barAriaLabel={function (e) {
        return `${e.id}: ${e.value} units for ${e.indexValue}`;
      }}
    />
  );
};

export default ArticlesPerformanceBarChart;
