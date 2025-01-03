import { ResponsivePie } from '@nivo/pie';
import { Provider } from '@renderer/types/types';

interface Providers {
  data: Provider[];
}

// Normalize and aggregate data, ensuring values are integers
const normalizeAndAggregateData = (
  data: Provider[]
): { id: string; label: string; value: number; color: string }[] => {
  // Extract and normalize required fields
  const normalizedData = data.map((item) => ({
    id: item.label, // Use label as id
    label: item.label, // Use label for display
    value: Math.round(item.value || 0), // Ensure value is an integer, default to 0
    color: item.color || 'hsl(0, 0%, 50%)', // Default color if missing
  }));

  // Aggregate data by id
  const aggregatedData = normalizedData.reduce((acc, current) => {
    const existing = acc.find((item) => item.id === current.id);
    if (existing) {
      existing.value += current.value; // Aggregate values and ensure integer
    } else {
      acc.push(current);
    }
    return acc;
  }, [] as { id: string; label: string; value: number; color: string }[]);

  // Ensure all values are integers
  return aggregatedData.map((item) => ({
    ...item,
    value: Math.round(item.value), // Final integer conversion for safety
  }));
};

const InvoiceStatusPieChart = ({data}: Providers) => {

  // Normalize and aggregate the raw data
  const processedData = normalizeAndAggregateData(data);

  console.log(processedData);

  return (
    <ResponsivePie
      data={processedData as any}
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
