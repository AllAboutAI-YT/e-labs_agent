let conversation = null;
const startButton = document.getElementById('startButton');
const endButton = document.getElementById('endButton');
const volumeSlider = document.getElementById('volumeSlider');
const statusDiv = document.getElementById('status');
const transcriptDiv = document.getElementById('transcript');

// Update UI with new messages
function addMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.textContent = `${sender}: ${text}`;
  transcriptDiv.appendChild(messageDiv);
  transcriptDiv.scrollTop = transcriptDiv.scrollHeight;
}

async function startConversation() {
  try {
    // Request microphone access
    await navigator.mediaDevices.getUserMedia({ audio: true });

    // Fetch the signed URL from the server
    const response = await fetch('/signed-url');
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.details || 'Failed to get signed URL');
    }

    const signedUrl = data.signedUrl;
    if (!signedUrl) {
      throw new Error('No signed URL received from server');
    }

    // Check if the SDK is loaded
    if (typeof window.ElevenLabs === 'undefined') {
      throw new Error('ElevenLabs SDK not loaded properly');
    }

    // Initialize the conversation using the SDK
    conversation = await window.ElevenLabs.Conversation.startSession({
      signedUrl,
      onConnect: () => {
        statusDiv.textContent = 'Status: Connected';
        startButton.disabled = true;
        endButton.disabled = false;
      },
      onDisconnect: () => {
        statusDiv.textContent = 'Status: Disconnected';
        startButton.disabled = false;
        endButton.disabled = true;
      },
      onMessage: (message) => {
        addMessage(message.text, message.sender);
      },
      onError: (error) => {
        console.error('Conversation error:', error);
        statusDiv.textContent = `Status: Error - ${error.message}`;
      },
      onStatusChange: (status) => {
        statusDiv.textContent = `Status: ${status}`;
      },
      onModeChange: (mode) => {
        console.log('Mode changed:', mode);
      },
    });

    console.log('Conversation started successfully');
  } catch (error) {
    console.error('Failed to start conversation:', error);
    statusDiv.textContent = `Status: Error - ${error.message}`;
  }
}

async function endConversation() {
  if (conversation) {
    try {
      await conversation.endSession();
      conversation = null;
      statusDiv.textContent = 'Status: Disconnected';
      startButton.disabled = false;
      endButton.disabled = true;
    } catch (error) {
      console.error('Error ending conversation:', error);
      statusDiv.textContent = `Status: Error - ${error.message}`;
    }
  }
}

// Event Listeners
startButton.addEventListener('click', startConversation);
endButton.addEventListener('click', endConversation);
volumeSlider.addEventListener('input', (e) => {
  if (conversation) {
    conversation.setVolume({ volume: e.target.value / 100 });
  }
});

// Debug logging
console.log('App.js loaded and initialized');
console.log('SDK availability:', {
  ElevenLabs: window.ElevenLabs,
  Conversation: window.ElevenLabs?.Conversation
});
