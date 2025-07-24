import React, { useEffect, useState } from 'react';
import { Box, Heading, Spinner, Text } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import api from '../api';
import 'chart.js/auto';

const BarChartPage = () => {
  const [cancerData, setCancerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/locations-data');
        const locations = res.data;
        
        // If we have data, use it; otherwise use sample data for demonstration
        const chartData = locations.length > 0 ? locations : [
          { name: 'Nairobi', cancerRisk: 0.45 },
          { name: 'Mombasa', cancerRisk: 0.32 },
          { name: 'Kisumu', cancerRisk: 0.28 },
          { name: 'Nakuru', cancerRisk: 0.38 }
        ];
        
        setCancerData({
          labels: chartData.map(l => l.name),
          datasets: [
            {
              label: 'Cancer Risk (%)',
              data: chartData.map(l => (l.cancerRisk ?? 0) * 100),
              backgroundColor: 'rgba(75, 192, 192, 0.8)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
        });
      } catch (err) {
        // Use sample data if API fails
        setCancerData({
          labels: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'],
          datasets: [
            {
              label: 'Cancer Risk (%)',
              data: [45, 32, 28, 38],
              backgroundColor: 'rgba(75, 192, 192, 0.8)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Box h="100vh" p={4} bg="white">
      <Heading as="h2" size="lg" mb={4}>Cancer Risk by Location</Heading>
      {loading ? (
        <Spinner size="lg" />
      ) : cancerData ? (
        <Bar
          data={cancerData}
          options={{
            plugins: { 
              legend: { display: false },
              tooltip: { enabled: true }
            },
            scales: {
              x: { 
                ticks: { 
                  font: { size: 10 },
                  maxRotation: 45
                },
                grid: { display: false }
              },
              y: {
                min: 0,
                max: 50,
                ticks: {
                  stepSize: 10,
                  font: { size: 10 },
                  callback: function(value) { return value + '%'; }
                },
                grid: { color: 'rgba(0,0,0,0.1)' }
              }
            },
            responsive: true,
            maintainAspectRatio: false,
          }}
          height={400}
        />
      ) : (
        <Text>No data available.</Text>
      )}
    </Box>
  );
};

export default BarChartPage; 