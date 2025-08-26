import React, { useState, useEffect, useMemo } from 'react';
import { range } from 'lodash-es';
import { format, addDays } from 'date-fns';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Container, Typography } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HeavyDashboard: React.FC = () => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: []
  });

  // Optimized: Memoize expensive data generation
  const chartConfig = useMemo(() => {
    const labels = range(0, 50).map(i => format(addDays(new Date(), i), 'yyyy-MM-dd')); // Reduced from 100 to 50
    const data = range(0, 50).map(() => Math.random() * 1000);
    
    return {
      labels,
      datasets: [
        {
          label: 'Sample Data',
          data,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        },
      ],
    };
  }, []);

  useEffect(() => {
    // Simulate loading delay for demonstration
    const timer = setTimeout(() => {
      setChartData(chartConfig);
    }, 500);

    return () => clearTimeout(timer);
  }, [chartConfig]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        📊 Heavy Dashboard - {format(new Date(), 'MMMM do yyyy, h:mm:ss a')}
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        This component is lazy-loaded to improve initial bundle size and loading performance.
      </Typography>
      {chartData.labels.length > 0 ? (
        <Line 
          data={chartData} 
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
              title: {
                display: true,
                text: 'Performance Optimized Chart'
              }
            }
          }}
        />
      ) : (
        <Typography>Loading chart data...</Typography>
      )}
    </Container>
  );
};

export default HeavyDashboard;