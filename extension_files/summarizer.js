// summarizer.js
const axios = require('axios');

const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function summarizeContent(content) {
    console.log("Inside summarizer.js");
    try {
        const response = await axios.post(OPENROUTER_API_URL, {
            model: 'google/gemini-2.0-flash-lite-001',
            messages: [
                { role: 'system', content: 'You are a helpful assistant that summarizes privacy policies, focusing on key areas of data handling.' },
                { role: 'user', content: `Analyze the following privacy policy content and provide a summary in three sections. For each section, provide a title followed by a concise 1-2 sentence summary:
            
            1. Access to Medical/Financial Data: Summarize how the company handles access to sensitive medical or financial information.
            
            2. Data Storage: Explain how and where the company stores user data.
            
            3. Data Sharing with Third Parties: Describe the company's practices for sharing data with third parties or other companies.
            
            Privacy Policy Content:
            ${content}
            
            Please format each section with a clear title followed by the summary sentence(s).` }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error calling OpenRouter API:', error);
        throw new Error('Failed to generate summary');
    }
}

function splitSummary(summary) {
    const regex = /\*\*(.*?)\*\*\n([\s\S]*?)(?=\n\n\*\*|$)/g;
    const matches = [...summary.matchAll(regex)];
    return matches.map(match => [match[1].trim(), match[2].trim()]);
  }

module.exports = { summarizeContent, splitSummary };
