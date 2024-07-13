import express from 'express';
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import dotenv from 'dotenv';
import { uc1, ac1, ac2 } from './constants';

dotenv.config();

const app = express();
app.use(express.json());

const endpoint = process.env.AZURE_OPENAI_ENDPOINT || '';
const azureApiKey = process.env.AZURE_OPENAI_KEY || '';

app.post('/summarize', async (req, res) => {
  try {
    const { text, lang } = req.body;
    let languageName = new Intl.DisplayNames(["en"], { type: "language" });
    let ln = languageName.of(lang); // eg: hi - "hindi"
    
    const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
    const deploymentName = 'ai-summariser-gpt-35-turbo';
    const systemContent = `You are a Ping AI summariser whose job is to create a summary of the text in a webpage. You help the user by creating bullet points which make it easier to get a gist of the webpage he is viewing. You also add emojis in the bullet points to make it more engaging. You create short, to-the-point summaries for the user. Each point must not be more than a short sentence. The summary should be in "${ln}" - language.`;
    
    const result = await client.getChatCompletions(deploymentName, [
      {
        role: 'system',
        content: systemContent,
      },
      {
        role: 'user',
        content: uc1
      },
      {
        role: 'assistant',
        content: ac1
      },
      {
        role: 'assistant',
        content: ac2
      },
      {
        role: 'user',
        content: text,
      }
    ], {
      maxTokens: 800,
      temperature: 0.5,
      frequency_penalty: 0,
      presence_penalty: 0,
      top_p: 0.95,
      stop: null
    });

    const headerTextResult = await client.getChatCompletions(deploymentName, [
      {
        role: 'system',
        content: `translate in "${ln}" - language. in 2-3 words only`,
      },
      {
        role: 'user',
        content: "Text summary",
      }
    ], {
      maxTokens: 800,
      temperature: 0.5,
      frequency_penalty: 0,
      presence_penalty: 0,
      top_p: 0.95,
      stop: null
    });

    let summary = "";
    for (const choice of result.choices) {
      summary += choice.message.content;
    }
    let headerText = "";
    for (const choice of headerTextResult.choices) {
      headerText += choice.message.content;
    }
    res.json({ summary, headerText });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while summarizing the text.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});