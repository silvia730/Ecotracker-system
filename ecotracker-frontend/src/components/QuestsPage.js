import React, { useEffect, useState } from 'react';
import { Box, Heading, Spinner, Text, Progress, Button } from '@chakra-ui/react';
import api from '../api';

const QuestsPage = () => {
  const [quests, setQuests] = useState([]);
  const [userQuests, setUserQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuests = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem('ecotrackerUserId');
      const [questsRes, userQuestsRes] = await Promise.all([
        api.get('/api/quests'),
        userId ? api.get(`/api/quests/user/${userId}`) : Promise.resolve({ data: [] })
      ]);
      setQuests(questsRes.data);
      setUserQuests(userQuestsRes.data);
    } catch (err) {
      setError('Failed to fetch quests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuests(); }, []);

  const getUserQuest = (questId) => userQuests.find(q => q.questId && (q.questId._id === questId || q.questId === questId));

  const handleAssignQuest = async (questId) => {
    try {
      const userId = localStorage.getItem('ecotrackerUserId');
      await api.post('/api/quests/assign', { userId, questId });
      fetchQuests();
    } catch (err) {}
  };

  const handleClaimReward = async (questId) => {
    try {
      const userId = localStorage.getItem('ecotrackerUserId');
      await api.post('/api/quests/claim', { userId, questId });
      fetchQuests();
    } catch (err) {}
  };

  return (
    <Box maxW="700px" mx="auto" mt={8} p={6} borderWidth={1} borderRadius={16} boxShadow="lg" bg="white">
      <Heading as="h2" size="lg" mb={4}>Quests</Heading>
      {loading ? (
        <Spinner size="lg" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : quests.length === 0 ? (
        <Text>No quests available.</Text>
      ) : (
        quests.map(quest => {
          const userQuest = getUserQuest(quest._id);
          return (
            <Box key={quest._id} borderWidth={1} borderRadius={8} p={4} mb={4} bg={userQuest && userQuest.claimed ? 'green.50' : 'white'}>
              <Text fontWeight="bold">{quest.title}</Text>
              <Text fontSize="sm" color="gray.600">{quest.description}</Text>
              {userQuest ? (
                <>
                  <Progress value={Math.min((userQuest.progress / quest.goal) * 100, 100)} size="sm" colorScheme="green" mt={2} mb={2} />
                  <Text fontSize="sm">{userQuest.progress} / {quest.goal}</Text>
                  <Text fontSize="sm" color="blue.500">Reward: {quest.reward}</Text>
                  {userQuest.completed && !userQuest.claimed && (
                    <Button colorScheme="teal" size="sm" mt={2} onClick={() => handleClaimReward(quest._id)}>
                      Claim Reward
                    </Button>
                  )}
                  {userQuest.claimed && <Text color="green.600" fontWeight="bold" mt={2}>Reward Claimed!</Text>}
                </>
              ) : (
                <Button colorScheme="blue" size="sm" mt={2} onClick={() => handleAssignQuest(quest._id)}>
                  Accept Quest
                </Button>
              )}
            </Box>
          );
        })
      )}
    </Box>
  );
};

export default QuestsPage; 