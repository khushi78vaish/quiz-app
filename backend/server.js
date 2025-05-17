const express = require('express');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../public')));

// API endpoint to fetch quiz questions
app.get('/api/questions', async (req, res) => {
  try {
    // Try fetching questions from external API
    const response = await axios.get('https://opentdb.com/api.php?amount=10');

    const formattedQuestions = response.data.results.map(q => {
      const options = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);

      return {
        question: decodeHTML(q.question),
        options: options.map(decodeHTML),
        answer: decodeHTML(q.correct_answer),
      };
    });

    res.json(formattedQuestions);
  } catch (error) {
    console.warn('⚠️ API failed, using local questions.json instead:', error.message);

    // Fallback: Load from local questions.json
    try {
      const questionsPath = path.join(__dirname, 'questions.json');
      const rawData = fs.readFileSync(questionsPath, 'utf-8');
      const localQuestions = JSON.parse(rawData);
      res.json(localQuestions);
    } catch (readError) {
      console.error('❌ Failed to read local questions.json:', readError.message);
      res.status(500).json({ error: 'No questions available at the moment.' });
    }
  }
});

// Utility: Decode HTML entities in question text
function decodeHTML(html) {
  return html
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&eacute;/g, 'é');
}

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
