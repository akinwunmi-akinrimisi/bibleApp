import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { processAudio } from './verse-matcher';

// Define WebSocket connection states
enum ConnectionState {
  CONNECTED,
  PROCESSING_AUDIO,
  ERROR
}

// Define client structure for tracking
interface Client {
  socket: WebSocket;
  state: ConnectionState;
  lastActivity: number;
}

export function setupWebSocket(httpServer: Server) {
  // Create WebSocket server on a specific path to avoid conflicts with Vite's HMR
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/ws'
  });
  
  // Track all clients
  const clients: Map<WebSocket, Client> = new Map();
  
  // Connection handler
  wss.on('connection', (socket) => {
    console.log('WebSocket client connected');
    
    // Add client to tracking map
    clients.set(socket, {
      socket,
      state: ConnectionState.CONNECTED,
      lastActivity: Date.now()
    });
    
    // Message handler
    socket.on('message', async (message) => {
      try {
        const client = clients.get(socket);
        if (!client) return;
        
        // Update activity timestamp
        client.lastActivity = Date.now();
        
        // Parse message
        const data = JSON.parse(message.toString());
        
        if (data.type === 'audio') {
          // Update client state
          client.state = ConnectionState.PROCESSING_AUDIO;
          
          // Process audio data (base64-encoded)
          const audioData = data.payload.data;
          const settings = data.payload.settings || { bibleVersion: 'KJV', confidenceThreshold: 70 };
          
          // Convert base64 to Buffer
          const audioBuffer = Buffer.from(audioData, 'base64');
          
          // Process audio and get transcription + matches
          const result = await processAudio(audioBuffer, settings);
          
          // Send result back to client if socket is still open
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
              type: 'transcription',
              payload: result
            }));
            
            // Update client state
            client.state = ConnectionState.CONNECTED;
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        
        // Update client state
        const client = clients.get(socket);
        if (client) {
          client.state = ConnectionState.ERROR;
        }
        
        // Send error to client
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: 'error',
            payload: { message: 'Failed to process audio data' }
          }));
        }
      }
    });
    
    // Error handler
    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      
      // Update client state
      const client = clients.get(socket);
      if (client) {
        client.state = ConnectionState.ERROR;
      }
    });
    
    // Close handler
    socket.on('close', () => {
      console.log('WebSocket client disconnected');
      
      // Remove client from tracking map
      clients.delete(socket);
    });
  });
  
  // Setup periodic inactive client cleanup (every 30 seconds)
  const INACTIVE_TIMEOUT = 30000; // 30 seconds
  
  setInterval(() => {
    const now = Date.now();
    
    for (const [socket, client] of clients.entries()) {
      if (now - client.lastActivity > INACTIVE_TIMEOUT) {
        console.log('Closing inactive WebSocket connection');
        socket.terminate();
        clients.delete(socket);
      }
    }
  }, 30000);
  
  return wss;
}
