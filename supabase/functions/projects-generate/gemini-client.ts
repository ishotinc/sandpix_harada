import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.24.1';

export function createGeminiClient(apiKey: string) {
  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      maxOutputTokens: 32768, // Increased for comprehensive HTML generation
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
    },
  });

  return {
    async generateLandingPage(prompt: string): Promise<string> {
      try {
        console.log('Generating landing page with Gemini AI...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedText = response.text();
        
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
        console.error('Gemini API Error:', error);
        throw new Error(`Failed to generate landing page: ${error.message}`);
      }
    }
  };
}