import React, { useState } from 'react';
import { Button, Input, InputGroup, InputLeftElement, Stack, Box, Heading, Text, useToast } from '@chakra-ui/react';
import { FaEnvelope, FaLock, FaLeaf } from 'react-icons/fa';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('ecotrackerToken', data.token);
      localStorage.setItem('ecotrackerUserId', data.userId);
      localStorage.setItem('ecotrackerUserLocation', data.location);
      toast({ title: 'Login successful', status: 'success', duration: 3000, isClosable: true });
      navigate('/dashboard');
    } catch (error) {
      toast({ title: 'Login failed', description: error.response?.data?.msg || 'Something went wrong', status: 'error', duration: 5000, isClosable: true });
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
          <Text fontSize="lg" color="gray.500" mb={2}>Welcome back! Please login.</Text>
        </Box>
        <form onSubmit={handleSubmit}>
          <Stack spacing={6}>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none"><FaEnvelope color="gray.400" /></InputLeftElement>
              <Input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required bg="gray.50" fontSize="lg" py={6} borderRadius={12} />
            </InputGroup>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none"><FaLock color="gray.400" /></InputLeftElement>
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required bg="gray.50" fontSize="lg" py={6} borderRadius={12} />
            </InputGroup>
            <Button type="submit" colorScheme="blue" isLoading={loading} loadingText="Logging in..." size="lg" borderRadius={12} fontWeight="bold" transition="all 0.2s" _hover={{ bg: 'blue.600', transform: 'scale(1.03)' }}>Sign In</Button>
            <Text textAlign="center" mt={4} color="gray.600">
              Don't have an account?{' '}
              <Button variant="link" colorScheme="blue" onClick={() => navigate('/register')}>Register here</Button>
            </Text>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default Login; 