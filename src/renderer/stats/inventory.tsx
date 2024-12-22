import { BarDatum, ResponsiveBar } from '@nivo/bar';
import { InventoryItem } from '@renderer/types/types';

interface InventoryProps {
  data: InventoryItem[]; // Expecting an array of `InventoryItem` objects
}

const InventoryOverview: React.FC<InventoryProps> = ({ data }) => {
  return (
    <div style={{ height: 400 }}>
      <ResponsiveBar
        data={data as any}
        keys={['stock_level', 'low_stock']} // Fields to plot
        indexBy="brand" // X-axis labels
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: 'set3' }}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45, // Rotate if labels are long
          legend: 'Tire Brands',
          legendPosition: 'middle',
          legendOffset: 50,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Stock Level',
          legendPosition: 'middle',
          legendOffset: -50,
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
    </div>
  );
};


export default InventoryOverview;
