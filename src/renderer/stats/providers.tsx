import { ResponsivePie } from '@nivo/pie';

const InvoiceStatusPieChart = () => {
  const data = [
    {
      id: "Paid",
      label: "Paid",
      value: 12000,
      color: "hsl(120, 70%, 50%)",
    },
    {
      id: "Unpaid",
      label: "Unpaid",
      value: 8000,
      color: "hsl(0, 70%, 50%)",
    },
    {
      id: "Partially Paid",
      label: "Partially Paid",
      value: 4000,
      color: "hsl(45, 70%, 50%)",
    },
  ];

  return (
    <ResponsivePie
      data={data}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5} // Donut chart style
      padAngle={0.7}
      cornerRadius={3}
      colors={{ datum: 'data.color' }}
      borderWidth={1}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: 'color',
        modifiers: [['darker', 2]],
      }}
      legends={[
        {
          anchor: 'bottom',
          direction: 'row',
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: '#999',
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: '#000',
              },
            },
          ],
        },
      ]}
    />
  );
};

export default InvoiceStatusPieChart;