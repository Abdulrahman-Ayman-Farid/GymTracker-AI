
import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { Log, Workout } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] || '' });
  }

  async getWorkoutAnalysis(workout: Workout, logs: Log[]): Promise<string> {
    if (!process.env['API_KEY']) {
      return "Please configure your API Key to use the Smart Coach feature.";
    }

    const recentLogs = logs.slice(0, 5).map(l => 
      `${new Date(l.date).toLocaleDateString()}: ${l.weight}kg x ${l.reps} reps`
    ).join('\n');

    const prompt = `
      You are an elite fitness coach. Analyze this user's recent progress on ${workout.name}.
      
      Recent Logs:
      ${recentLogs}

      Provide a brief (max 3 sentences) motivating comment or specific advice on how to improve or what to aim for next session. Be encouraging but technical.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      return "Could not connect to the coach right now. Keep pushing!";
    }
  }
}
