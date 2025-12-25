
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { NewsArticle, Category, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPersonalizedNews = async (profile: UserProfile): Promise<NewsArticle[]> => {
  const interests = profile.interests.join(', ') || 'latest major news';
  const historyTitles = profile.readingHistory.slice(-5).map(h => h.title).join(' | ');
  const locationText = profile.location?.region ? `in ${profile.location.region}, India` : 'in India';
  
  const prompt = `
    Find the absolute latest, high-quality news headlines for a user interested in: ${interests}.
    PRIORITY: Indian national and regional news first (${locationText}), then Global.
    USER HISTORY: ${historyTitles || 'None'}
    
    For each article, you MUST provide a valid, high-resolution image URL related to the story found via Google Search.
    
    Return JSON array:
    - title: String
    - summary: Concise 2-sentence summary
    - source: String (Name of the news agency)
    - url: Original news URL
    - imageUrl: A working, high-quality image URL from the news source or a highly relevant stock image if unavailable.
    - category: One of: General, Politics, Technology, Sports, Entertainment, Health, Finance, Environment
    - isIndian: Boolean
    - credibilityScore: 0-100
    - similarityScore: 0-100 based on user interests.
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
              imageUrl: { type: Type.STRING },
              category: { type: Type.STRING },
              isIndian: { type: Type.BOOLEAN },
              credibilityScore: { type: Type.NUMBER },
              similarityScore: { type: Type.NUMBER },
            },
            required: ['title', 'summary', 'source', 'url', 'imageUrl', 'category', 'isIndian', 'credibilityScore', 'similarityScore']
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
    Carefully verify this claim for authenticity: "${article.title}"
    Report from: ${article.source}
    
    Return JSON:
    - status: 'verified', 'suspicious', or 'debunked'
    - explanation: Short, clear reasoning.
    - sources: Array of verification URLs.
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
            status: { type: Type.STRING },
            explanation: { type: Type.STRING },
            sources: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['status', 'explanation', 'sources']
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      const groundingUrls = chunks.map(chunk => chunk.web?.uri).filter(Boolean) as string[];
      result.sources = Array.from(new Set([...(result.sources || []), ...groundingUrls]));
    }
    return result;
  } catch (error) {
    return { status: 'unverified', explanation: 'Verification unavailable.', sources: [] };
  }
};

export const chatbotResponse = async (query: string, context?: NewsArticle): Promise<string> => {
  const contextStr = context ? `Article: "${context.title}" Source: ${context.source}.` : '';
  const prompt = `
    You are SmartNews AI. 
    1. Answer very concisely (max 2 sentences).
    2. If providing links, put them on a new line.
    3. Be neutral and fact-focused.
    Context: ${contextStr}
    Query: ${query}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] }
    });
    let text = response.text || "I'm sorry, I'm having trouble responding.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      const urls = Array.from(new Set(chunks.map(c => c.web?.uri).filter(Boolean)));
      if (urls.length > 0) text += `\n\n${urls.join('\n')}`;
    }
    return text;
  } catch (error) {
    return "Connection error.";
  }
};
