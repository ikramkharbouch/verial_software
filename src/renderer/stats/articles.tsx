import { ResponsiveBar } from '@nivo/bar';
import { Article } from '@renderer/types/types';

interface ArticleData {
  name: string; // Name of the product
  sales: number; // Sales data from backend
  used: number; // Used data from backend
}

interface ArticlesPerformanceProps {
  data: Article[];
}

const ArticlesPerformanceBarChart = ({ data }: ArticlesPerformanceProps) => {
  // Sort articles by sales in descending order and pick the top 5
  const topArticles = [...data]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  // Transform the data to match the required format
  const transformedData = topArticles.map((item) => ({
    product: item.name, // Rename 'name' to 'product'
    sold: item.sales, // Rename 'sales' to 'sold'
    used: item.used, // Keep 'used' as it is
  }));

  const keys = ['sold', 'used'];

  return (
    <ResponsiveBar
      data={transformedData}
      keys={keys}
      indexBy="product"
      margin={{ top: 50, right: 130, bottom: 70, left: 60 }} // Adjusted bottom margin
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={{ scheme: 'nivo' }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 45, // Rotate labels to prevent overlap
        legend: 'Product',
        legendPosition: 'middle',
        legendOffset: 50, // Adjusted to align with rotated labels
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
      barAriaLabel={(e) =>
        `${e.id}: ${e.value} units for ${e.indexValue}`
      }
    />
  );
};

export default ArticlesPerformanceBarChart;
