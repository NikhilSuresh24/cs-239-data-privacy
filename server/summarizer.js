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
                { role: 'system', content: 'You are a helpful assistant that summarizes and rates privacy policies, focusing on key areas of data handling.' },
                { role: 'user', content: `Analyze the following privacy policy content and provide a summary in three sections. For each section:
                1. Provide a title
                2. Give a concise 1-2 sentence summary
                3. Rate user privacy on a scale of 1-5 (1 being poor privacy, 5 being excellent privacy)
            
                Sections to analyze:
                1. Access to Medical/Financial Data: Summarize how the company handles access to sensitive medical or financial information.
                2. Data Storage: Explain how and where the company stores user data.
                3. Data Sharing with Third Parties: Describe the company's practices for sharing data with third parties or other companies.
            
                Privacy Policy Content:
                ${content}
            
                Please format each section as follows:
                **Title**
                Summary: [Your 1-2 sentence summary]
                Privacy Rating: [1-5]` }
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
    const regex = /\*\*(.*?)\*\*\nSummary: (.*?)\nPrivacy Rating: (\d)/g;
    const matches = [...summary.matchAll(regex)];
    return matches.map(match => [
        match[1].trim(),  // Title
        match[2].trim(),  // Summary
        parseInt(match[3])  // Privacy Rating
    ]);
}

module.exports = { summarizeContent, splitSummary };
