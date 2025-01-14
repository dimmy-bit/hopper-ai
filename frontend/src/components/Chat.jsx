import { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Paper, Typography, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (isImageGeneration = false) => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const endpoint = isImageGeneration ? '/generate-image' : '/chat';
      const response = await axios.post(`http://localhost:8000${endpoint}`, {
        [isImageGeneration ? 'prompt' : 'content']: userMessage
      });

      const responseData = isImageGeneration 
        ? { role: 'assistant', content: `![Generated Image](${response.data.image_url})` }
        : { role: 'assistant', content: response.data.response };

      setMessages(prev => [...prev, responseData]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(17, 24, 39, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      {/* Messages Container */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
          },
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                background: message.role === 'user' 
                  ? 'rgba(124, 58, 237, 0.1)'
                  : 'rgba(16, 185, 129, 0.1)',
                borderRadius: 2,
              }}
            >
              <Typography
                component="div"
                sx={{
                  '& p': { m: 0 },
                  '& img': { maxWidth: '100%', borderRadius: 1, mt: 1 },
                }}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </Typography>
            </Paper>
          </Box>
        ))}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Container */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(0, 0, 0, 0.2)',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              },
            }}
          />
          <IconButton
            color="primary"
            onClick={() => handleSend(false)}
            disabled={isLoading || !input.trim()}
            sx={{
              backgroundColor: 'rgba(124, 58, 237, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(124, 58, 237, 0.2)',
              },
            }}
          >
            <SendIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleSend(true)}
            disabled={isLoading || !input.trim()}
            sx={{
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
              },
            }}
          >
            <ImageIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
}

export default Chat;
