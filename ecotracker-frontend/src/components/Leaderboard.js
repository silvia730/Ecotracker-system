import React from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Badge, Button } from '@chakra-ui/react';

function getBadge(reportsCount) {
  if (reportsCount >= 20) return <Badge colorScheme="purple">Community Leader</Badge>;
  if (reportsCount >= 10) return <Badge colorScheme="green">Green Guardian</Badge>;
  if (reportsCount >= 3) return <Badge colorScheme="blue">Eco Warrior</Badge>;
  return <Badge colorScheme="gray">New User</Badge>;
}

const Leaderboard = ({ users = [], onRefresh }) => {
  return (
    <Box mb={8}>
      <Box display="flex" alignItems="center" mb={4}>
        <Heading as="h3" size="md" flex={1}>Leaderboard</Heading>
        {onRefresh && (
          <Button size="sm" colorScheme="teal" onClick={onRefresh} ml={2}>
            Refresh
          </Button>
        )}
      </Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Rank</Th>
            <Th>Name</Th>
            <Th>Reports</Th>
            <Th>Badge</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user, idx) => (
            <Tr key={user._id || user.name}>
              <Td>{idx + 1}</Td>
              <Td>{user.name}</Td>
              <Td>{user.reportsCount}</Td>
              <Td>{getBadge(user.reportsCount)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Leaderboard; 