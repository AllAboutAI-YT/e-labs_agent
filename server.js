import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Verify environment variables are set
if (!process.env.AGENT_ID || !process.env.ELEVEN_LABS_API_KEY) {
  console.error('Missing required environment variables. Please check your .env file.');
  process.exit(1);
}

app.use(express.static('public'));

app.get('/signed-url', async (req, res) => {
  try {
    console.log('Requesting signed URL for agent:', process.env.AGENT_ID);
    
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${process.env.AGENT_ID}`, // Updated endpoint
      {
        method: 'GET',
        headers: {
          'xi-api-key': process.env.ELEVEN_LABS_API_KEY,
          'Content-Type': 'application/json'
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`API responded with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Successfully obtained signed URL');
    res.json({ signedUrl: data.signed_url });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      error: 'Failed to get signed URL', 
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Using Agent ID:', process.env.AGENT_ID);
});
