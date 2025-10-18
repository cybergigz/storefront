#!/bin/bash

# Get Windows host IP (this is usually the gateway in WSL2)
WINDOWS_IP=$(ip route | grep default | awk '{print $3}')

echo "================================================"
echo "Starting Expo Dev Server"
echo "================================================"
echo ""
echo "WSL detected. Windows Host IP: $WINDOWS_IP"
echo ""
echo "To access from your phone on 192.168.1.x network:"
echo "1. Find your Windows PC's IP by running in PowerShell:"
echo "   ipconfig"
echo "2. Look for IPv4 Address under your network adapter"
echo "3. Use that IP:8081 to connect"
echo ""
echo "Starting Expo in LAN mode..."
echo "================================================"
echo ""

# Start Expo with LAN mode
npx expo start --lan
