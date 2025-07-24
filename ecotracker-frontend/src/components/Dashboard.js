import React, { useEffect, useState } from 'react';
import { useToast as chakraToast } from '@chakra-ui/react';
import { Box, Button, Heading, SimpleGrid, Text, Select, Input, useToast, Spinner, Progress } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import NairobiMap from './NairobiMap';
import api from '../api';
import 'chart.js/auto';
import Leaderboard from './Leaderboard';
import Lottie from 'lottie-react';
import mintingAnimation from '../assets/minting.json';

const ALCHEMY_API_KEY = process.env.REACT_APP_ALCHEMY_API_KEY;
const WALLET_ADDRESS = process.env.REACT_APP_WALLET_ADDRESS;
const ALCHEMY_BASE_URL = `https://polygon-amoy.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}/getNFTsForOwner`;

const SAMPLE_NFT = {
  image: 'https://via.placeholder.com/200x200?text=EcoTracker+NFT',
  name: 'EcoTracker NFT',
  description: 'Congratulations! You have claimed your NFT.',
  contract: '0xE10C0C4076F3d2dFa27A1dA38901cf2Ba74b89eD',
  tokenId: '1',
};

// Simulated quest data
const QUESTS = [
  {
    id: 1,
    title: 'First Report',
    description: 'Report pollution at any location.',
    progress: 1,
    goal: 1,
    reward: 'Eco Warrior NFT',
    claimed: false,
  },
  {
    id: 2,
    title: 'Eco Reporter',
    description: 'Report pollution 5 times.',
    progress: 2,
    goal: 5,
    reward: 'Green Guardian NFT',
    claimed: false,
  },
  {
    id: 3,
    title: 'Explorer',
    description: 'Report pollution in 3 different locations.',
    progress: 1,
    goal: 3,
    reward: 'Explorer Badge',
    claimed: false,
  },
];

const Dashboard = () => {
  const [cancerData, setCancerData] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [report, setReport] = useState({ locationName: '', co2Level: '' });
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);
  const toast = useToast();
  const [nfts, setNfts] = useState([]);
  const [nftLoading, setNftLoading] = useState(true);
  const [nftError, setNftError] = useState(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintedNft, setMintedNft] = useState(null);
  const [quests, setQuests] = useState([]);
  const [userQuests, setUserQuests] = useState([]);
  const [questsLoading, setQuestsLoading] = useState(true);
  const [questsError, setQuestsError] = useState(null);
  const [leaderboardUsers, setLeaderboardUsers] = useState([]);

  const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const fetchLeaderboard = async () => {
  try {
    const res = await api.get('/api/leaderboard');
    setLeaderboardUsers(res.data);
  } catch (err) {
    console.error('Failed to fetch leaderboard:', err);
    // Optionally show a toast or message
  }
};


  // Placeholder NFT data
  const NFT_CONTRACT_ADDRESS = "0xE10C0C4076F3d2dFa27A1dA38901cf2Ba74b89eD";
  const NFT_CHAIN = "amoy"; // OpenSea uses 'amoy' for the Amoy testnet

  const nftsPlaceholder = [
    { id: 1, name: 'Eco Warrior', image: 'https://via.placeholder.com/100', description: 'Awarded for 1st report', tokenId: 1 },
    { id: 2, name: 'Green Guardian', image: 'https://via.placeholder.com/100', description: 'Awarded for 5 reports', tokenId: 2 },
  ];

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const fetchLocationsData = async () => {
  setLoading(true);
  setError(null);
  try {
    const res = await api.get('/api/locations-data');
    setLocations(res.data);
    setCancerData({
      labels: res.data.map(l => l.name),
      datasets: [
        {
          label: 'Cancer Risk (%)',
          data: res.data.map(l => l.cancerRisk ?? 0),
          backgroundColor: 'rgba(75, 192, 192, 0.6)'
        }
      ]
    });
  } catch (err) {
    console.error(err);
    setError('Failed to fetch dashboard data');
  } finally {
    setLoading(false);
  }
};

  // Fetch NFTs for the wallet address on Amoy testnet
  const fetchNFTs = async () => {
    setNftLoading(true);
    setNftError(null);
    try {
      const url = `${ALCHEMY_BASE_URL}?owner=${WALLET_ADDRESS}&withMetadata=true`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch NFTs');
      const data = await res.json();
      setNfts(data.ownedNfts || []);
    } catch (err) {
      setNftError('Failed to fetch NFTs');
    } finally {
      setNftLoading(false);
    }
  };

  // Fetch all quests and user's quest progress
  const fetchQuests = async () => {
    setQuestsLoading(true);
    setQuestsError(null);
    try {
      const userId = localStorage.getItem('ecotrackerUserId');
      const [questsRes, userQuestsRes] = await Promise.all([
        api.get('/api/quests'),
        userId ? api.get(`/api/quests/user/${userId}`) : Promise.resolve({ data: [] })
      ]);
      setQuests(questsRes.data);
      setUserQuests(userQuestsRes.data);
    } catch (err) {
      setQuestsError('Failed to fetch quests');
    } finally {
      setQuestsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationsData();
    fetchNFTs();
    fetchQuests();
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    // After locations are loaded, check user's location risk
    const userLocation = localStorage.getItem('ecotrackerUserLocation');
    if (userLocation && locations.length > 0) {
      const loc = locations.find(l => l.name === userLocation);
      if (loc && loc.cancerRisk * 100 > 60) {
        toast({
          title: `Alert: Cancer risk in your area (${userLocation}) is above 60%!`,
          status: 'warning',
          duration: 9000,
          isClosable: true,
          position: 'top',
        });
      }
    }
  }, [locations]);

  // Helper: Get user quest progress by questId
  const getUserQuest = (questId) => userQuests.find(q => q.questId && (q.questId._id === questId || q.questId === questId));

  // Assign quest to user
  const handleAssignQuest = async (questId) => {
    try {
      const userId = localStorage.getItem('ecotrackerUserId');
      await api.post('/api/quests/assign', { userId, questId });
      fetchQuests();
    } catch (err) {
      toast({ title: 'Failed to assign quest', status: 'error', duration: 3000, isClosable: true });
    }
  };

  // Claim quest reward
  const handleClaimReward = async (questId) => {
    try {
      const userId = localStorage.getItem('ecotrackerUserId');
      await api.post('/api/quests/claim', { userId, questId });
      fetchQuests();
      toast({ title: 'Reward claimed!', status: 'success', duration: 3000, isClosable: true });
    } catch (err) {
      toast({ title: 'Failed to claim reward', status: 'error', duration: 3000, isClosable: true });
    }
  };

  const handleReport = async () => {
    setReportLoading(true);
    setReportError(null);
    try {
      const userId = localStorage.getItem('ecotrackerUserId');
      if (!userId) {
        setReportError('You must be logged in to report pollution.');
        setReportLoading(false);
        return;
      }
      await api.post('/api/report', {
        userId,
        co2Level: report.co2Level,
        locationName: report.locationName
      });
      toast({ title: 'Pollution reported!', description: 'Your report has been submitted and your leaderboard count will update shortly.', status: 'success', duration: 3000, isClosable: true });
      setReport({ locationName: '', co2Level: '' });
      // Refetch data after reporting
      fetchLocationsData();
      fetchLeaderboard(); // Refresh leaderboard after report
      // Update quest progress for all assigned 'report' type quests
      const reportQuests = userQuests.filter(q => q.questId && q.questId.type === 'report' && !q.completed);
      await Promise.all(reportQuests.map(q =>
        api.post('/api/quests/progress', { userId, questId: q.questId._id, increment: 1 })
      ));
      fetchQuests();
    } catch (err) {
      setReportError('Failed to report pollution');
    } finally {
      setReportLoading(false);
    }
  };

  const handleClaimNFT = () => {
    setIsMinting(true);
    setMintedNft(null);
    // Simulate minting process (e.g., 3 seconds)
    setTimeout(() => {
      setIsMinting(false);
      setMintedNft(SAMPLE_NFT);
    }, 3000);
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>{error}</div>;

  function getRiskColor(risk) {
    if (risk * 100 > 60) return 'red.400';
    if (risk * 100 > 30) return 'yellow.300';
    return 'green.300';
  }

  const userLocation = localStorage.getItem('ecotrackerUserLocation');
  const userLocObj = locations.find(l => l.name === userLocation);
  const userRisk = userLocObj ? userLocObj.cancerRisk : null;
  const riskPercent = userRisk !== null ? Math.round(userRisk * 100) : null;
  const riskColor = userRisk !== null ? getRiskColor(userRisk) : 'gray.200';

  return (
    <Box p={8}>
      {userLocation && userRisk !== null && (
        <Box
          mb={6}
          p={4}
          borderRadius="md"
          bg={riskColor}
          color={riskPercent > 60 ? 'white' : 'black'}
          fontWeight="bold"
          textAlign="center"
          fontSize="lg"
          boxShadow="md"
        >
          Cancer risk in <b>{userLocation}</b>: {riskPercent}%
          {riskPercent > 60 && " ⚠️ High Risk!"}
          {riskPercent > 30 && riskPercent <= 60 && " ⚠️ Moderate Risk"}
          {riskPercent <= 30 && " ✅ Low Risk"}
        </Box>
      )}
      <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} gap={8}>
        <Box flex={2}>
          <Heading mb={6}>Dashboard</Heading>
          <Box mb={8}>
            <Heading as="h3" size="md" mb={4}>Nairobi Map</Heading>
            <NairobiMap />
          </Box>
        </Box>
        <Box flex={1}>
          <Leaderboard users={leaderboardUsers} onRefresh={fetchLeaderboard} />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard; 