Overview
Conversational AI: deploy customized, interactive voice agents in minutes.

​
What is ElevenLabs Conversational AI?
ElevenLabs Conversational AI is a platform for deploying customized, interactive voice agents. Our Conversational AI orchestration platform combines

Speech to Text (the ears)
LLM (the brain)
Text to Speech (the voice)
along with built in interruption handling, turn taking logic, and knowledge bases. All together, our platform makes it easy to create an interactive agents that you and your users can talk to like a person.

Companies and creators use our Conversational AI orchestration platform to create:

Customer service reps that are trained on company help docs that can support customers with complex queries.
Virtual assistants that help users with tasks like scheduling, reminders, and information lookup.
Retail assistants that can handle product searches, recommendations, and order tracking.
Interactive game characters that can tell stories and guide players as they explore custom worlds.
​
Configuring your agent
To get started, head to Conversational AI.

When creating your agent, you’ll be prompted with the option to start with a blank template or you can choose one of our preset templates. The only difference is that the preset templates come with the first message and system prompt filled out to match the relevant personas.

​
Setting up your LLM, System Prompt, and Knowledge Base
​
Choosing your LLM
With our Conversational AI Platform, you can select from the leading models from Anthropic, OpenAI and Google. Soon, you’ll also be able to bring your own custom LLM via our Server integration.

There is some tradeoff between model performance and latency, so we recommend testing a few options to see which best fits your use case.

​
System Prompt Best Practices

Your system prompt will inform your agent’s behavior, style, and demeanor. Here are some example prompts we’ve had success with:

(1) Customer Support Agent Prompt

You are a technical support agent named Alex. You will try to answer any questions that the user might have about the Elevenlabs service. You will be given documentation on the Elevenlabs product and should only use this information to answer questions about the Elevenlabs product. You should be helpful, friendly and relatively professional. If you’re unable to answer the question you should point the user to email support@elevenlabs.io.

Your output will be read by a text to speech service so should be formatted as it is pronounced. For example: instead of outputting “please contact support@elevenlabs.io” you should output “please contact support at elevenlabs dot I O”. Do not format your text response with bullet points, bold or headers. Do not return long lists but instead summarise them and ask which ones the user is interested in. Do not return code samples but instead suggest the user views the code samples in our documentation on our website. Return the response directly, do not start responses with “Agent:” or anything similar.

Answer succinctly in a couple of sentences and let the user guide you on where to give more detail. DO not respond with bullet point lists

(2) Aristotle Prompt

You are Aristotle, the ancient Greek philosopher. Speak as though you are conversing with students in the Lyceum, explaining your views on ethics, politics, and the nature of reality. Guide your audience with thoughtful questions, analogies, and logical arguments. Stay true to your persona—analytical, articulate, and rooted in reason—offering practical wisdom for a virtuous and meaningful life.

(3) Librarian Prompt

You are a librarian named Jessica. You are very friendly and enthusiastic really want to help people find a book they will love. You are in charge of a library of books and have been provided with a full list of books and their authors. Only recommend books that are currently in your library. Respond in 2-4 sentences in most cases.

If someone asks you about a book you do not have, say that you do not have it and recommend similar novels. Only recommend books that are in your library.

​
Configuring your Knowledge Base
Your knowledge base is additional information you can provide your agent on top of the base understanding of the LLM you selected.

Non-enterprise users are limited to 5 files or links and up to 20MB total. Contact our sales team to discuss an enterprise plan to raise your limit.

​
Choosing a Voice
You can use Conversational AI with any of our default or library voices, or even with a custom voice clone. For the best results, we recommend selecting one of our Default Voices that were trained for conversational use cases, like Chris or Jessica.

​
Success Criteria and Data Collection
​
Success Criteria
Use success criteria to specify custom prompts you’d like to run on call transcripts to analyze the results. Some examples:

Title: handled_inquiry

Prompt: The agent was able to answer all of the queries from the user without having to refer them to a further support channel

Title: pleasant_experience

Prompt: The user didn’t react negatively to any of the provided answers from the agent

​
Data Collection
Use Data Collection to extract relevant information from call transcripts. Some examples:

Title: conversation_topic

Prompt: This value should be a single entry from the following list which best represents the main conversation topic: “websocket”, “model_features”, “voices”, “pricing”, “accent_issues”, “api”

Title: call_type

Prompt: This should take one of the three values: “bug_report”, “feature_request”, “support_issue"

"feature_request” should be returned if the user is asking for a feature that doesn’t currently exist

”support_issue” should be returned if the user is asking for support with existing functionality or needs help with known issues that are detailed in the documentation

”bug_report” should be returned if the user is reporting a new bug that was unknown by the agent


​
Testing your Agent and Reviewing Call History
You can demo your agent by talking to it within our dashboard and review the call recording and transcript in the History tab.


​
Deploying the Widget
Once you’ve tested your agent and you’re ready to deploy it to your site, you can either

(1) Head to the “Widget” subnav, customize your widget, and grab the custom embed code for your site.

(2) Interact with your agent through our SDK and build your own custom interface.

JavaScript SDKs
Client SDK
Conversational AI SDK: deploy customized, interactive voice agents in minutes.

Also see the Conversational AI overview
​
Installation
Install the package in your project through package manager.


npm install @11labs/client
# or
yarn add @11labs/client
# or
pnpm install @11labs/client
​
Usage
This library is primarily meant for development in vanilla JavaScript projects, or as a base for libraries tailored to specific frameworks. It is recommended to check whether your specific framework has it’s own library. However, you can use this library in any JavaScript-based project.

​
Initialize conversation
First, initialize the Conversation instance:


const conversation = await Conversation.startSession(options);
This will kick off the websocket connection and start using microphone to communicate with the ElevenLabs Conversational AI agent. Consider explaining and allowing microphone access in your apps UI before the Conversation kicks off:


// call after explaning to the user why the microphone access is needed
await navigator.mediaDevices.getUserMedia();
​
Session configuration
The options passed to startSession specifiy how the session is established. There are two ways to start a session:

Using Agent ID
Agent ID can be acquired through ElevenLabs UI. For public agents, you can use the ID directly:


const conversation = await Conversation.startSession({
  agentId: "<your-agent-id>",
});
Using a signed URL
If the conversation requires authorization, you will need to add a dedicated endpoint to your server that will request a signed url using the ElevenLabs API and pass it back to the client.

Here’s an example of how it could be set up:


// Node.js server

app.get("/signed-url", yourAuthMiddleware, async (req, res) => {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${process.env.AGENT_ID}`,
    {
      method: "GET",
      headers: {
        // Requesting a signed url requires your ElevenLabs API key
        // Do NOT expose your API key to the client!
        "xi-api-key": process.env.XI_API_KEY,
      },
    }
  );

  if (!response.ok) {
    return res.status(500).send("Failed to get signed URL");
  }

  const body = await response.json();
  res.send(body.signed_url);
});

// Client

const response = await fetch("/signed-url", yourAuthHeaders);
const signedUrl = await response.text();

const conversation = await Conversation.startSession({ signedUrl });
​
Optional callbacks
The options passed to startSession can also be used to register optional callbacks:

onConnect - handler called when the conversation websocket connection is established.
onDisconnect - handler called when the conversation websocket connection is ended.
onMessage - handler called when a new text message is received. These can be tentative or final transcriptions of user voice, replies produced by LLM. Primarily used for handling conversation transcription.
onError - handler called when an error is encountered.
onStatusChange - handler called whenever connection status changes. Can be connected, connecting and disconnected (initial).
onModeChange - handler called when a status changes, eg. agent switches from speaking to listening, or the other way around.
​
Return value
startSession returns a Conversation instance that can be used to control the session. The method will throw an error if the session cannot be established. This can happen if the user denies microphone access, or if the websocket connection fails.

endSession
A method to manually end the conversation. The method will end the conversation and disconnect from websocket. Afterwards the conversation instance will be unusable and can be safely discarded.


await conversation.endSession();
getId
A method returning the conversation ID.


const id = conversation.geId();
setVolume
A method to set the output volume of the conversation. Accepts object with volume field between 0 and 1.


await conversation.setVolume({ volume: 0.5 });
getInputVolume / getOutputVolume
Methods that return the current input/output volume on a scale from 0 to 1 where 0 is -100 dB and 1 is -30 dB.


const inputVolume = await conversation.getInputVolume();
const outputVolume = await conversation.getOutputVolume();
getInputByteFrequencyData / getOutputByteFrequencyData
Methods that return Uint8Arrays containg the current input/output frequency data. See AnalyserNode.getByteFrequencyData for more information.