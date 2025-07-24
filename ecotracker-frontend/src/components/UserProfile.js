import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Input, Button, Stack, Table, Thead, Tbody, Tr, Th, Td, Select, Spinner, useToast } from '@chakra-ui/react';
import api from '../api';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', location: '' });
  const [locations, setLocations] = useState([]);
  const [reports, setReports] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem('ecotrackerUserId');
        if (!userId) {
          setUser(null);
          setLoading(false);
          return;
        }
        const [userRes, reportsRes, locationsRes] = await Promise.all([
          api.get(`/api/auth/user/${userId}`),
          api.get(`/api/reports/user/${userId}`),
          api.get('/api/locations-data'),
        ]);
        setUser(userRes.data);
        setForm({ name: userRes.data.name, location: userRes.data.location });
        setReports(reportsRes.data);
        setLocations(locationsRes.data.map(l => l.name));
        // Fetch NFTs (reuse logic from Dashboard)
        const WALLET_ADDRESS = userRes.data.email; // or use a wallet field if available
        // For now, just use placeholder NFTs
        setNfts(userRes.data.nfts || []);
      } catch (err) {
        setUser(null);
        toast({ title: 'Failed to load profile', status: 'error', duration: 3000, isClosable: true });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setForm({ name: user.name, location: user.location });
  };
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSave = async () => {
    setSaving(true);
    try {
      const userId = localStorage.getItem('ecotrackerUserId');
      await api.put(`/api/auth/user/${userId}`, form);
      setUser(u => ({ ...u, ...form }));
      setEditMode(false);
      toast({ title: 'Profile updated', status: 'success', duration: 3000, isClosable: true });
    } catch (err) {
      toast({ title: 'Failed to update profile', status: 'error', duration: 3000, isClosable: true });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner size="lg" />;
  if (!user) return <Text>User not found. Please make sure you are logged in. If the problem persists, try logging out and logging in again.</Text>;

  return (
    <Box maxW="700px" mx="auto" mt={8} p={6} borderWidth={1} borderRadius={16} boxShadow="lg" bg="white">
      <Heading as="h2" size="lg" mb={4}>User Profile</Heading>
      <Stack spacing={4} mb={6}>
        <Box>
          <Text fontWeight="bold">Name:</Text>
          {editMode ? (
            <Input name="name" value={form.name} onChange={handleChange} />
          ) : (
            <Text>{user.name}</Text>
          )}
        </Box>
        <Box>
          <Text fontWeight="bold">Email:</Text>
          <Text>{user.email}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Location:</Text>
          {editMode ? (
            <Select name="location" value={form.location} onChange={handleChange}>
              {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </Select>
          ) : (
            <Text>{user.location}</Text>
          )}
        </Box>
        {editMode ? (
          <Stack direction="row">
            <Button colorScheme="blue" onClick={handleSave} isLoading={saving}>Save</Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Stack>
        ) : (
          <Button onClick={handleEdit}>Edit Profile</Button>
        )}
      </Stack>
      <Heading as="h3" size="md" mb={2}>Report History</Heading>
      <Table variant="simple" mb={6}>
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Location</Th>
            <Th>CO₂ Level</Th>
          </Tr>
        </Thead>
        <Tbody>
          {reports.length === 0 ? (
            <Tr><Td colSpan={3}>No reports yet.</Td></Tr>
          ) : reports.map(r => (
            <Tr key={r._id}>
              <Td>{new Date(r.timestamp).toLocaleString()}</Td>
              <Td>{r.locationName || r.location}</Td>
              <Td>{r.co2Level}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Heading as="h3" size="md" mb={2}>Earned NFTs</Heading>
      <Box>
        {nfts.length === 0 ? <Text>No NFTs earned yet.</Text> : (
          <Stack direction="row" spacing={4}>
            {nfts.map((nft, idx) => (
              <Box key={idx} borderWidth={1} borderRadius={8} p={2} textAlign="center">
                <img src={nft.image || 'https://via.placeholder.com/100'} alt={nft.name} style={{ width: 100, height: 100 }} />
                <Text fontWeight="bold">{nft.name}</Text>
                <Text fontSize="sm" color="gray.500">{nft.description}</Text>
                {nft.tokenId && (
                  <a
                    href={`https://testnets.opensea.io/assets/amoy/${nft.contract || ''}/${nft.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#3182ce", textDecoration: "underline", display: "block", marginTop: 8 }}
                  >
                    View on OpenSea
                  </a>
                )}
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default UserProfile; 