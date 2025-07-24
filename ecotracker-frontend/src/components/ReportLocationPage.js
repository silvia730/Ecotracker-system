import React, { useState, useEffect } from 'react';
import { Box, Heading, Select, Input, Button, Stack, useToast } from '@chakra-ui/react';
import api from '../api';

const ReportLocationPage = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [co2, setCo2] = useState('');
  const toast = useToast();

  useEffect(() => {
    // Fetch locations from backend
    api.get('/api/locations-data').then(res => {
      setLocations(res.data.map(l => l.name));
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLocation || !co2) {
      toast({ title: 'Please select a location and enter CO₂ value.', status: 'warning', duration: 3000, isClosable: true });
      return;
    }
    // For now, just log the values
    console.log('Reporting pollution:', { location: selectedLocation, co2 });
    toast({ title: 'Pollution reported!', status: 'success', duration: 3000, isClosable: true });
    setSelectedLocation('');
    setCo2('');
  };

  return (
    <Box maxW="500px" mx="auto" mt={8} p={6} borderWidth={1} borderRadius={16} boxShadow="lg" bg="white">
      <Heading as="h2" size="lg" mb={4}>Report Pollution</Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <Select placeholder="Select location" value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}>
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </Select>
          <Input placeholder="CO₂ value (ppm)" value={co2} onChange={e => setCo2(e.target.value)} type="number" min="0" />
          <Button colorScheme="teal" type="submit">Report Pollution</Button>
        </Stack>
      </form>
    </Box>
  );
};

export default ReportLocationPage; 