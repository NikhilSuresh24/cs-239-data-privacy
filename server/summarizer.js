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
        "rating": { "type": "int" },
        "learn_more": { "type": "string" },
        "references": { "type": "array", "items": { "type": "string" } }
      },
      "required": ["title", "summary", "rating", "learn_more", "references"]
    }
  };

  const schema2 = {
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
        "title": { "type": "string" },
        "summary": { "type": "string" },
        "references": { 
          "type": "array",
          "items": { "type": "string" }
        }
      },
      "required": ["summary", "references"]
    }
  };

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
                1. Access to Medical/Financial Data: Summarize how the company will handle access to sensitive medical or financial information.
                2. Data Storage: Explain how and where the company stores user data and the security measures they take.
                3. Data Sharing with Third Parties: Describe the company's practices for sharing data with third parties or other companies.

                Privacy Policy Content:
                ${content}

                Please format each section as follows:
                **Section Title** (one of: Access to Medical/Financial Data, Data Storage, Data Sharing with Third Parties)
                Summary: [Your 4 sentence summary]
                References: [For each section, provide 2-4 short (75 character max) direct quotes from the policy that support the summary]`}
            ],
            "response_format": {
                "type": "json_schema",
                "json_schema": {
                    "name": "privacy_policy_initial",
                    "schema": schema2
                }
            }
        }, {
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        // console.log("response.data.choices[0].message.content in getInitialSummary: summarizer.js", response.data.choices[0].message.content);  
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
                { role: 'user', content: `Analyze the following summaries for three areas of data handling and provide a 1 sentence bullet point for each area outlining what policy is most negatively impactful to individuals privacy. Then, rate each area on a scale of 1-5 based on the following scale:
                    1 - the policy is very vague and not explicit about data handling practices. if it is explicit, their practices are very negative for user data privacy.
                    2 - the policy is vague and not explicit about data handling practices. if it is explicit, their practices are negative for user data privacy.
                    3 - the policy is somewhat explicit about data handling practices and/or it is somewhat negative for users.
                    4 - the policy is explicit about data handling practices but those practices are not necessarily good at maintaining data privacy and security.
                    5 - the policy is explicit about data handling practices and those practices are good at maintaining data privacy and security.

                Summaries:
                ${summary}

                Format your response in accordance to the schema provided.
                the references should be taken from the summary provided and returned in the references field
                the summary field should be the concise single sentence, and the learn_more should be the inital summary you were given with references removed. 
                the learn_more SHOULD ALWAYS BE LONGER THAN SUMMARY.
                
                ` }
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

module.exports = { summarizeContent };




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