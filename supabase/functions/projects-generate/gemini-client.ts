import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.24.1';\nimport { logger } from '../_shared/logger.ts';

export function createGeminiClient(apiKey: string) {
  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
    generationConfig: {
      maxOutputTokens: 50000, // Increased for comprehensive HTML generation
      temperature: 0.5,
      topP: 0.95,
      topK: 40,
    },
  });

  return {
    async generateLandingPage(prompt: string): Promise<string> {
      try {
        logger.info('Generating landing page with Gemini AI', {
          promptLength: prompt.length,
          containsSwipeScores: prompt.includes('スワイプスコアランキング'),
          containsCriticalInstructions: prompt.includes('最終必須実装事項'),
          promptPreview: prompt.substring(prompt.length - 500)
        });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedText = response.text();
        
        logger.info('Gemini response received', {
          responseLength: generatedText.length,
          responsePreview: generatedText.substring(0, 200)
        });
        
        // Extract HTML from the response
        // Gemini might wrap the HTML in markdown code blocks
        const htmlMatch = generatedText.match(/```html\n([\s\S]*?)\n```/) || 
                         generatedText.match(/<(!DOCTYPE|html)[\s\S]*<\/html>/i);
        
        if (htmlMatch) {
          return htmlMatch[1] || htmlMatch[0];
        }
        
        // If no HTML tags found, assume the entire response is HTML
        if (generatedText.includes('<!DOCTYPE') || generatedText.includes('<html')) {
          return generatedText;
        }
        
        throw new Error('Generated content does not appear to be valid HTML');
      } catch (error) {
        logger.error('Gemini API Error', error);
        throw new Error(`Failed to generate landing page: ${error.message}`);
      }
    }
  };
}