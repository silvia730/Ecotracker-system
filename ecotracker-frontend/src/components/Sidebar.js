import React, { useEffect, useState } from 'react';
import { Box, VStack, Button, Text, Icon, Divider, Spacer } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaTasks, FaImages, FaMapMarkerAlt, FaChartBar } from 'react-icons/fa';
import WalletConnect from './WalletConnect';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
  { to: '/profile', label: 'Profile', icon: FaUser },
  { to: '/quests', label: 'Quests', icon: FaTasks },
  { to: '/nft-gallery', label: 'NFT Gallery', icon: FaImages },
  { to: '/report-location', label: 'Report Location', icon: FaMapMarkerAlt },
  { to: '/bar-chart', label: 'Bar Chart' },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <Box minH="100vh" w="220px" bg="teal.700" color="white" p={4} boxShadow="lg" display="flex" flexDirection="column">
      <Text fontSize="2xl" fontWeight="bold" mb={8} letterSpacing="wide">EcoTracker</Text>
      <VStack align="stretch" spacing={2} flex={1}>
        {navLinks.map(link => (
          <Button
            as={Link}
            to={link.to}
            leftIcon={link.icon ? <Icon as={link.icon} /> : undefined}
            variant={location.pathname === link.to.split('#')[0] ? 'solid' : 'ghost'}
            colorScheme="teal"
            justifyContent="flex-start"
            key={link.to}
            fontWeight="bold"
            borderRadius={8}
            _hover={{ bg: 'teal.600' }}
          >
            {link.label}
          </Button>
        ))}
      </VStack>
      <Divider my={4} />
      <WalletConnect />
      <Divider my={4} />
    </Box>
  );
};

export default Sidebar; 