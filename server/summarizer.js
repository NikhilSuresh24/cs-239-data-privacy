// summarizer.js
const axios = require('axios');

const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// async function summarizeContent(content) {
//     console.log("Inside summarizer.js");
//     try {
//         const response = await axios.post(OPENROUTER_API_URL, {
//             model: 'google/gemini-2.0-flash-lite-001',
//             messages: [
//                 { role: 'system', content: 'You are a helpful assistant that summarizes and rates privacy policies, focusing on key areas of data handling.' },
//                 { role: 'user', content: `Analyze the following privacy policy content and provide a summary in three sections. For each section:
//                 1. Provide a title
//                 2. Give a concise 1-2 sentence summary
//                 3. Rate user privacy on a scale of 1-5 (1 being poor privacy, 5 being excellent privacy)
            
//                 Sections to analyze:
//                 1. Access to Medical/Financial Data: Summarize how the company handles access to sensitive medical or financial information.
//                 2. Data Storage: Explain how and where the company stores user data.
//                 3. Data Sharing with Third Parties: Describe the company's practices for sharing data with third parties or other companies.
            
//                 Privacy Policy Content:
//                 ${content}
            
//                 Please format each section as follows:
//                 **Title**
//                 Summary: [Your 1-2 sentence summary]
//                 Privacy Rating: [1-5]` }
//             ]
//         }, {
//             headers: {
//                 'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         return response.data.choices[0].message.content;
//     } catch (error) {
//         console.error('Error calling OpenRouter API:', error);
//         throw new Error('Failed to generate summary');
//     }
// }

async function getInitialSummary(content) {
    try {
        const response = await axios.post(OPENROUTER_API_URL, {
            model: 'google/gemini-2.0-flash-lite-001',
            messages: [
                { role: 'system', content: 'You are a helpful assistant that summarizes privacy policies, focusing on key areas of data handling.' },
                { role: 'user', content: `Analyze the following privacy policy content and provide a summary in three sections, each with about 4 sentences. Please focus on what the policy explicitly states about data handling practices.

                Sections to analyze:
                1. Access to Medical/Financial Data: Summarize how the company handles access to sensitive medical or financial information.
                2. Data Storage: Explain how and where the company stores user data.
                3. Data Sharing with Third Parties: Describe the company's practices for sharing data with third parties or other companies.

                Privacy Policy Content:
                ${content}

                Please format each section as follows:
                **Title**
                Summary: [Your 4 sentence summary]` }
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

async function analyzeSummary(summary) {
    try {
        const response = await axios.post(OPENROUTER_API_URL, {
            model: 'google/gemini-2.0-flash-lite-001',
            messages: [
                { role: 'system', content: 'You are a helpful assistant that analyzes privacy policy summaries and identifies key concerns across multiple areas.' },
                { role: 'user', content: `Analyze the following summaries for three areas of data handling and provide a 1 sentence bullet point for each area on what a user needs to know or what is most alarming. Then, rate each area on a scale of 1-5 (1 being a major issue, 5 being a minor issue). For reference, consider the following examples:
                
                Example 1: "The company shares user data with third parties without explicit consent." (Rating: 1)
                Example 2: "The company stores user data securely but does not specify how long it is kept." (Rating: 3)

                Summaries:
                ${summary}

                Please format your response as follows:
                **Access to Medical/Financial Data**
                Summary: * [1 sentence bullet point]
                Privacy Rating: [1-5]
                Learn More: [The original summary for Access to Medical/Financial Data]
                **Data Storage**
                Summary: * [1 sentence bullet point]
                Privacy Rating: [1-5]
                Learn More: [The original summary for Data Storage]
                **Data Sharing with Third Parties**
                Summary: * [1 sentence bullet point]
                Privacy Rating: [1-5]
                Learn More: [The original summary for Data Sharing with Third Parties]` }
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
        throw new Error('Failed to analyze summary');
    }
}

async function summarizeContent(content) {
    console.log("Inside summarizer.js");
    const initialSummary = await getInitialSummary(content);
    const analyzedSummary = await analyzeSummary(initialSummary);
    return analyzedSummary;
}

function splitSummary(summary) {
    const regex = /\*\*(.*?)\*\*\nSummary: \* (.*?)\nPrivacy Rating: (\d)\nLearn More: ([\s\S]*?)(?=\n\n\*\*|$)/g;
    const matches = [...summary.matchAll(regex)];
    console.log(matches);
    return matches.map(match => [
        match[1].trim(),  // Title
        match[2].trim(),  // Summary
        parseInt(match[3]),  // Privacy Rating
        match[4].trim()  // Learn More
    ]);
}



module.exports = { summarizeContent, splitSummary };
