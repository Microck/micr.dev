import express from 'express';
import { QuestionService } from '../server/questionService';
import axios from 'axios';

const router = express.Router();

// Submit a new question
router.post('/', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Question content is required' });
    }

    if (content.trim().length > 1000) {
      return res.status(400).json({ error: 'Question must be less than 1000 characters' });
    }

    const question = QuestionService.addQuestion(content);
    
    // Send notification to ntfy if configured
    if (process.env.NTFY_URL) {
      try {
        await axios.post(process.env.NTFY_URL, {
          title: 'New Anonymous Question',
          message: content,
          priority: 'high',
          tags: ['question'],
        });
      } catch (error) {
        console.error('Failed to send ntfy notification:', error);
      }
    }
    
    res.status(201).json({ message: 'Question submitted successfully' });
  } catch (error) {
    console.error('Error submitting question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all Q&A pairs
router.get('/qa', (req, res) => {
  try {
    const qa = QuestionService.getAllQA();
    res.json(qa);
  } catch (error) {
    console.error('Error fetching Q&A:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Regenerate message (grammar correction)
router.post('/regenerate', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // If OpenAI API is configured, use it for grammar correction
    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Please correct the grammar and spelling of the following text while preserving the original meaning. Do not change the tone or intent. Return only the corrected text, no additional commentary.'
            },
            {
              role: 'user',
              content: content
            }
          ],
          max_tokens: 1000,
          temperature: 0.1,
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        const corrected = response.data.choices[0].message.content.trim();
        res.json({ corrected });
      } catch (error) {
        console.error('OpenAI API error:', error);
        res.json({ corrected: content }); // Fallback to original content
      }
    } else {
      // Fallback: return original content
      res.json({ corrected: content });
    }
  } catch (error) {
    console.error('Error regenerating message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as questionsRouter };