import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * Chat with AI Nutrition Assistant
 * Uses Groq Llama model for responses
 * POST /api/chat
 */
router.post('/', authenticate, async (req, res) => {
  const { message, history = [] } = req.body;
  console.log('💬 Chat: Message received:', message?.substring(0, 50));

  if (!message || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Groq API key not configured' });
  }

  try {
    // Limit history to last 4 messages to save API calls
    const recentHistory = history.slice(-4);

    const systemPrompt = `You are NourishAI Assistant, a friendly nutrition expert chatbot.
Keep responses SHORT and helpful (2-3 sentences max).
Focus on: nutrition advice, healthy eating tips, calorie info, diet suggestions.
If asked non-nutrition questions, politely redirect to health topics.
Use emojis sparingly to be friendly. Be concise!`;

    // Build messages array
    const messages = [
      { role: 'system', content: systemPrompt },
      ...recentHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.7,
        max_tokens: 300  // Keep responses short to save tokens
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Groq Chat error:', error);
      return res.status(500).json({ error: 'Failed to get AI response' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    console.log('💬 Chat: Response sent');
    res.json({
      success: true,
      reply: reply.trim()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Chat failed' });
  }
});

export default router;
