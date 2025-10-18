# WSL Network Setup for Expo

## Problem

WSL runs in a separate network namespace from Windows. When Expo starts in WSL, it binds to WSL's internal IP, not your Windows machine's LAN IP (192.168.1.156).

## Solution Options

### Option 1: Port Forwarding (Recommended)

Run this command in **Windows PowerShell as Administrator**:

```powershell
netsh interface portproxy add v4tov4 listenport=8081 listenaddress=0.0.0.0 connectport=8081 connectaddress=172.24.160.1
```

Replace `172.24.160.1` with your WSL IP. To find your WSL IP, run in WSL:

```bash
ip addr show eth0 | grep "inet " | awk '{print $2}' | cut -d/ -f1
```

To remove the port forwarding later:

```powershell
netsh interface portproxy delete v4tov4 listenport=8081 listenaddress=0.0.0.0
```

### Option 2: Use Tunnel Mode

From the mobile directory in WSL:

```bash
npx expo start --tunnel
```

This uses ngrok to create a public URL that works from anywhere.

### Option 3: Run Expo from Windows (Not WSL)

1. Install Node.js on Windows
2. Navigate to the mobile directory in Windows (e.g., `D:\storefront\mobile`)
3. Run: `npx expo start --lan`

This way Expo runs directly on Windows and can bind to 192.168.1.156.

## Current Server Status

The Expo dev server is currently running and accessible at:

- From WSL: `http://localhost:8081`
- From Windows: `http://localhost:8081`
- From your phone: Needs port forwarding (see Option 1)

## Testing Connection

From WSL, test if server is running:

```bash
curl http://localhost:8081/status
```

Should return: `packager-status:running`
