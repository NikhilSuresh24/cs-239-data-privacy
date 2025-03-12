// summarizer.js
const axios = require('axios');

const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const schema = {
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
        "title": { "type": "string" },
        "summary": { "type": "string" },
        "rating": { "type": "string" },
        "learn_more": { "type": "string" }
      },
      "required": ["title", "summary", "rating", "learn_more"]
    }
  }

//moved commented function to bottom

async function getInitialSummary(content) {
    try {
        const response = await axios.post(OPENROUTER_API_URL, {
            model: 'google/gemini-2.0-flash-lite-001',
            messages: [
                { role: 'system', content: 'You summarize privacy policies, focusing on explainingkey areas of data privacy and the implications of privacy policies. Your goal is to make the policy accesible to laymen while remaining specific.' },
                { role: 'user', content: `Analyze the following privacy policy content and provide a summary in three sections, each with about 4 sentences. Focus on what the policy explicitly states about data handling practices. Your answer will contain 
                    information about what is in the policy and the implications of the policy on user privacy.

                Sections to analyze:
                1. Access to Medical/Financial Data: Summarize how the company handles access to sensitive medical or financial information.
                2. Data Storage: Explain how and where the company stores user data.
                3. Data Sharing with Third Parties: Describe the company's practices for sharing data with third parties or other companies.

                Privacy Policy Content:
                ${content}

                Please format each section as follows:
                **Section Title**
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
                { role: 'system', content: 'You analyze privacy policy summaries and identify key concerns across multiple areas. Your goal is to make the policy accessible to laymen while remaining specific.' },
                { role: 'user', content: `Analyze the following summaries for three areas of data handling and provide a 1 sentence bullet point for each area outlining what policy is most negatively impactful to individuals privacy. Then, rate each area on a scale of 1-5 (1 meaning the policy is highly negatively impactful to privacy, 5 meaning the policy is least negatively impactful to privacy). For reference, consider the following examples:
                
                Example 1: "The company shares user data with third parties without explicit consent." (Rating: 1)
                Example 2: "The company stores user data securely but does not specify how long it is kept." (Rating: 3)

                Summaries:
                ${summary}

                Format your response like this in accordance to the schema:
                **Access to Medical/Financial Data**
                Summary: * [1 to 75 character sentence with the most crucial information]
                Privacy Rating: [1-5]
                *Learn_More*: [The original provided information for Access to Medical/Financial Data]

                **Data Storage**
                Summary: * [1 to 75 character sentence with the most crucial information]
                Privacy Rating: [1-5]
                *Learn_More*: [The original provided information for Data Storage]

                **Data Sharing with Third Parties**
                Summary: * [1 to 75 character sentence with the most crucial information]
                Privacy Rating: [1-5]
                *Learn_More*: [The original provided information for Data Sharing with Third Parties]` }
            ],
            "response_format": {
                "type": "json_schema",
                "json_schema": {
                    "name": "privacy_policy_analysis",
                    "schema": schema
                }
            }
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
    console.log("analyzedSummary in summarizeContent: summarizer.js", analyzedSummary);
    return analyzedSummary;
}

function splitSummary(summary) {
    const regex = /\*\*(.*?)\*\*\nSummary: \* (.*?)\nPrivacy Rating: (\d)\nLearn More: ([\s\S]*?)(?=\n\n\*\*|$)/g;
    const matches = [...summary.matchAll(regex)];
    console.log("matches in splitSummary: summarizer.js", matches);
    return matches.map(match => [
        match[1].trim(),  // Title
        match[2].trim(),  // Summary
        parseInt(match[3]),  // Privacy Rating
        match[4].trim()  // Learn More
    ]);
}



module.exports = { summarizeContent, splitSummary };




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