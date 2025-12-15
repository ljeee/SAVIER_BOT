// This service calls Hugging Face API.
import { Injectable } from '@nestjs/common';
import { InferenceClient } from '@huggingface/inference';

@Injectable()
export class HuggingFaceService {
  async generate(prompt: string, model = process.env.HF_MODEL || 'EssentialAI/rnj-1-instruct', retries = 2): Promise<string> {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) throw new Error('HUGGINGFACE_API_KEY not set');
    const client = new InferenceClient(apiKey);
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const chatCompletion = await client.chatCompletion({
          model: model + ':together',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 300,
        });
        const responseText = chatCompletion.choices[0]?.message?.content || '';
        if (!responseText || responseText.trim().length === 0) throw new Error('Empty response');
        return responseText;
      } catch (error: any) {
        if (attempt === retries) throw error;
        await new Promise((resolve) => setTimeout(resolve, 2000 * Math.pow(2, attempt)));
      }
    }
    throw new Error('Failed after retries');
  }
}
