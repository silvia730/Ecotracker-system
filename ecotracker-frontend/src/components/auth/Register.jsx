import React, { useState, useEffect } from 'react';
import { Button, Input, Select, Stack, Box, Heading, Text, useToast } from '@chakra-ui/react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch locations from backend (same as Dashboard)
    const fetchLocations = async () => {
      try {
        const res = await api.get('/api/locations-data');
        setLocations(res.data.map(l => l.name));
        // Set default location to first in list if not set
        setFormData(f => ({ ...f, location: res.data[0]?.name || '' }));
      } catch (err) {
        setLocations([]);
      }
    };
    fetchLocations();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/register', formData);
      localStorage.setItem('ecotrackerToken', data.token);
      localStorage.setItem('ecotrackerUserId', data.userId);
      localStorage.setItem('ecotrackerUserLocation', data.location);
      toast({ title: 'Registration successful', status: 'success', duration: 3000, isClosable: true });
      navigate('/login');
    } catch (error) {
      toast({ title: 'Registration failed', description: error.response?.data?.msg || 'Something went wrong', status: 'error', duration: 5000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bgGradient="linear(to-br, blue.100, blue.300, blue.200)" display="flex" alignItems="center" justifyContent="center">
      <Box p={12} maxWidth="420px" bg="white" borderWidth={1} borderRadius={24} boxShadow="2xl" mx="auto" mt={0} textAlign="center" fontFamily="'Segoe UI', 'Roboto', 'Arial', sans-serif">
        <Box display="flex" flexDirection="column" alignItems="center" mb={6}>
          <FaLeaf size={48} color="#3182ce" style={{ marginBottom: 8 }} />
          <Heading as="h2" size="xl" mb={2} color="black" fontWeight="extrabold">EcoTracker</Heading>
          <Text fontSize="lg" color="gray.500" mb={2}>Create your account</Text>
        </Box>
        <form onSubmit={handleSubmit}>
          <Stack spacing={6}>
            <Input name="name" type="text" placeholder="Full Name" value={formData.name} onChange={handleChange} required bg="gray.50" fontSize="lg" py={6} borderRadius={12} />
            <Input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required bg="gray.50" fontSize="lg" py={6} borderRadius={12} />
            <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required bg="gray.50" fontSize="lg" py={6} borderRadius={12} />
            <Select name="location" value={formData.location} onChange={handleChange} bg="gray.50" fontSize="lg" py={6} borderRadius={12}>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </Select>
            <Select name="role" value={formData.role} onChange={handleChange} bg="gray.50" fontSize="lg" py={6} borderRadius={12}>
              <option value="user">Regular User</option>
              <option value="doctor">Doctor</option>
            </Select>
            <Button type="submit" colorScheme="blue" isLoading={loading} loadingText="Registering..." size="lg" borderRadius={12} fontWeight="bold" transition="all 0.2s" _hover={{ bg: 'blue.600', transform: 'scale(1.03)' }}>Create Account</Button>
            <Text textAlign="center" mt={4} color="gray.600">
              Already have an account?{' '}
              <Button variant="link" colorScheme="blue" onClick={() => navigate('/login')}>Login here</Button>
            </Text>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default Register; 