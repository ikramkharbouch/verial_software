import { ResponsiveBar } from '@nivo/bar';

const InventoryBarChart = () => {
  const data = [
    { brand: "Michelin", stockLevel: 150, lowStock: 20 },
    { brand: "Goodyear", stockLevel: 200, lowStock: 10 },
    { brand: "Bridgestone", stockLevel: 80, lowStock: 30 },
    { brand: "Pirelli", stockLevel: 50, lowStock: 15 },
    { brand: "Continental", stockLevel: 120, lowStock: 25 },
    { brand: "Dunlop", stockLevel: 90, lowStock: 5 },
  ];

  return (
    <ResponsiveBar
      data={data}
      keys={['stockLevel', 'lowStock']}
      indexBy="brand"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      colors={{ scheme: 'set3' }} // Color scheme for different bars
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Tire Brands',
        legendPosition: 'middle',
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Stock Level',
        legendPosition: 'middle',
        legendOffset: -40,
      }}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      tooltip={({ id, value, color }) => (
        <strong style={{ color }}>
          {id}: {value} tires
        </strong>
      )}
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

export default InventoryBarChart;
