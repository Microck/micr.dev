import express from 'express';
import bcrypt from 'bcryptjs';
import { QuestionService } from '../server/questionService';

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const hashedPassword = process.env.ADMIN_PASSWORD_HASH;
    if (!hashedPassword) {
      return res.status(500).json({ error: 'Admin not configured' });
    }

    const isValid = await bcrypt.compare(password, hashedPassword);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // In a real app, you'd issue a JWT token here
    // For simplicity, we'll just return success
    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get unanswered questions
router.get('/questions', (req, res) => {
  try {
    const questions = QuestionService.getUnansweredQuestions();
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Post an answer
router.post('/answer', (req, res) => {
  try {
    const { questionId, content } = req.body;
    
    if (!questionId || !content) {
      return res.status(400).json({ error: 'Question ID and content are required' });
    }

    if (content.trim().length === 0) {
      return res.status(400).json({ error: 'Answer content cannot be empty' });
    }

    if (content.trim().length > 2000) {
      return res.status(400).json({ error: 'Answer must be less than 2000 characters' });
    }

    const answer = QuestionService.addAnswer(questionId, content);
    if (!answer) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.status(201).json({ message: 'Answer posted successfully' });
  } catch (error) {
    console.error('Error posting answer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as adminRouter };