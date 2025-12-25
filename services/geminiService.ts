
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { NewsArticle, Category, UserProfile } from "../types";

// Always use a direct reference to process.env.API_KEY for initialization as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPersonalizedNews = async (profile: UserProfile): Promise<NewsArticle[]> => {
  const interests = profile.interests.join(', ') || 'latest major news';
  const locationText = profile.location?.region ? `in ${profile.location.region}, India` : 'in India';
  
  const prompt = `
    Find the latest important news stories specifically for a user interested in ${interests}.
    PRIORITY 1: Major news from India ${locationText}.
    PRIORITY 2: Global international news relevant to an Indian audience.
    
    For each article, provide:
    - Title
    - Concise 2-sentence summary
    - Source name
    - Original URL
    - Category (one of: General, Politics, Technology, Sports, Entertainment, Health, Finance, Environment)
    - Whether it is an Indian source (boolean)
    - Estimated credibility score (0-100) based on source reputation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              source: { type: Type.STRING },
              url: { type: Type.STRING },
              category: { type: Type.STRING },
              isIndian: { type: Type.BOOLEAN },
              credibilityScore: { type: Type.NUMBER },
            },
            required: ['title', 'summary', 'source', 'url', 'category', 'isIndian', 'credibilityScore']
          }
        }
      }
    });

    const results = JSON.parse(response.text || '[]') as any[];
    return results.map((item, index) => ({
      ...item,
      id: `news-${Date.now()}-${index}`,
      publishedAt: new Date().toISOString(),
      factCheckStatus: 'unverified'
    }));
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

export const verifyNews = async (article: NewsArticle): Promise<{ status: string; explanation: string; sources: string[] }> => {
  const prompt = `
    Verify the following news article for authenticity and detect potential misinformation or fake news.
    Title: ${article.title}
    Source: ${article.source}
    Summary: ${article.summary}
    URL: ${article.url}
    
    Use Google Search to cross-reference multiple reliable sources.
    Return a status (verified, suspicious, debunked) and a detailed explanation of why.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, description: 'verified, suspicious, or debunked' },
            explanation: { type: Type.STRING },
            sources: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['status', 'explanation', 'sources']
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    // Mandatory: If Google Search is used, extract the URLs from groundingChunks and list them.
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      const groundingUrls = chunks
        .map(chunk => chunk.web?.uri)
        .filter(Boolean) as string[];
      if (groundingUrls.length > 0) {
        result.sources = Array.from(new Set([...(result.sources || []), ...groundingUrls]));
      }
    }
    
    return result;
  } catch (error) {
    console.error("Error verifying news:", error);
    return { status: 'unverified', explanation: 'Unable to verify at this time.', sources: [] };
  }
};

export const chatbotResponse = async (query: string, context?: NewsArticle): Promise<string> => {
  const contextStr = context ? `User is currently looking at this article: "${context.title}" from ${context.source}.` : '';
  const prompt = `
    You are SmartNews AI Chatbot. 
    ${contextStr}
    
    RULES:
    1. Give SIMPLE, VERY SHORT answers (1-2 sentences max).
    2. If asked about fake news, give a quick verdict.
    3. If providing a link, place the URL on its own line. 
    4. Prioritize Indian context.
    
    User Query: ${query}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    
    let text = response.text || "I'm sorry, I couldn't process that request.";
    
    // If Google Search used, clean up and append links clearly
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      const groundingUrls = chunks
        .map(chunk => chunk.web?.uri)
        .filter(Boolean) as string[];
      if (groundingUrls.length > 0) {
        const uniqueUrls = Array.from(new Set(groundingUrls));
        // Ensure links are on new lines for the parser in Chatbot.tsx
        text += `\n\n${uniqueUrls.join('\n')}`;
      }
    }
    
    return text;
  } catch (error) {
    return "Error connecting to AI. Please try again.";
  }
};
