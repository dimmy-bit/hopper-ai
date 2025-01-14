import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Grid,
  IconButton,
  Tooltip,
  Fade,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Zoom,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CodeIcon from '@mui/icons-material/Code';
import SettingsIcon from '@mui/icons-material/Settings';
import BoltIcon from '@mui/icons-material/Bolt';
import MenuIcon from '@mui/icons-material/Menu';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4F46E5', // Modern Indigo
      light: '#818CF8',
      dark: '#3730A3',
    },
    secondary: {
      main: '#10B981', // Emerald
      light: '#34D399',
      dark: '#059669',
    },
    background: {
      default: '#0B1120', // Deep Navy
      paper: 'rgba(15, 23, 42, 0.8)', // Slate with transparency
    },
    text: {
      primary: '#F8FAFC', // Bright text
      secondary: '#CBD5E1', // Muted text
    },
    error: {
      main: '#EF4444', // Modern Red
    },
    warning: {
      main: '#F59E0B', // Modern Amber
    },
    info: {
      main: '#3B82F6', // Modern Blue
    },
    success: {
      main: '#10B981', // Modern Green
    }
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      background: 'linear-gradient(135deg, #4F46E5 0%, #10B981 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    subtitle1: {
      fontSize: '1.125rem',
      fontWeight: 500,
      color: '#CBD5E1',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(20px)',
          borderRadius: 24,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 32px rgba(0, 0, 0, 0.2)',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.9375rem',
          padding: '10px 24px',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(79, 70, 229, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #4F46E5 0%, #10B981 100%)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.2)',
            },
          },
        },
      },
    },
  },
});

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState('chat');
  const messagesEndRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial welcome animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([{
        role: 'assistant',
        content: `# Welcome to HopperAI 

Your Advanced AI Assistant for:

- Complete Code Solutions
- AI Image Generation
- Project Development
- Technical Support
- Learning Resources

Type your request below to get started!`
      }]);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const endpoint = currentMode === 'image' ? '/generate-image' : '/chat';
      const response = await axios.post(`http://localhost:8000${endpoint}`, {
        content: userMessage
      });

      const responseContent = currentMode === 'image' 
        ? `![Generated Image](${response.data.image_url})`
        : response.data.response;

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: responseContent
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: ' Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: <CodeIcon />, title: 'Code Generation', description: 'Production-ready code solutions' },
    { icon: <ImageIcon />, title: 'Image Creation', description: 'AI-powered image generation' },
    { icon: <BoltIcon />, title: 'Real-time Responses', description: 'Fast and efficient assistance' },
    { icon: <AutoAwesomeIcon />, title: 'Smart Context', description: 'Maintains conversation context' },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'radial-gradient(circle at top, #1E1B4B 0%, #0F172A 100%)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '40%',
          height: '40%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, rgba(124, 58, 237, 0) 70%)',
          animation: 'pulse 15s ease-in-out infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '35%',
          height: '35%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0) 70%)',
          animation: 'pulse 15s ease-in-out infinite alternate',
        },
        '@keyframes pulse': {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '50%': { transform: 'scale(1.2) translate(5%, 5%)' },
          '100%': { transform: 'scale(1) translate(0, 0)' },
        },
      }} />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ flex: 1, py: 4, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Zoom in={true} timeout={1000}>
          <Box sx={{ 
            textAlign: 'center', 
            mb: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              mb: 2
            }}>
              <SmartToyIcon sx={{ 
                fontSize: '3rem',
                color: 'primary.main'
              }} />
              <Typography variant="h1" sx={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #10B981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                letterSpacing: '-0.02em'
              }}>
                HopperAI
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '600px',
              textAlign: 'center',
              mb: 3
            }}>
              Your Advanced AI Assistant powered by cutting-edge technology
            </Typography>
            
            {/* Feature Grid */}
            <Grid container spacing={2} justifyContent="center" maxWidth="lg">
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Fade in={true} timeout={1000 + index * 200}>
                    <Paper elevation={0} sx={{
                      p: 2,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      background: 'rgba(255, 255, 255, 0.03)',
                      transition: 'transform 0.2s, background 0.2s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        background: 'rgba(255, 255, 255, 0.05)'
                      }
                    }}>
                      <Box sx={{ 
                        p: 1.5,
                        borderRadius: '50%',
                        background: index % 2 === 0 
                          ? 'rgba(124, 58, 237, 0.1)'
                          : 'rgba(16, 185, 129, 0.1)',
                        mb: 2
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Paper>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Zoom>

        {/* Chat Interface */}
        <Paper 
          elevation={0}
          sx={{
            height: '60vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(17, 24, 39, 0.7)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Messages */}
          <Box sx={{
            flex: 1,
            overflowY: 'auto',
            p: 3,
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
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
              },
            },
          }}>
            {messages.map((message, index) => (
              <Fade in={true} timeout={500} key={index}>
                <Box
                  sx={{
                    alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: isMobile ? '90%' : '70%',
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      background: message.role === 'user' 
                        ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(124, 58, 237, 0.2) 100%)'
                        : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.2) 100%)',
                      borderRadius: 3,
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: 'inherit',
                        border: '1px solid',
                        borderColor: message.role === 'user' 
                          ? 'rgba(124, 58, 237, 0.2)'
                          : 'rgba(16, 185, 129, 0.2)',
                        opacity: 0.5,
                      }
                    }}
                  >
                    <Typography component="div" sx={{ 
                      '& p': { m: 0 },
                      '& pre': {
                        background: 'rgba(0, 0, 0, 0.2)',
                        p: 2,
                        borderRadius: 2,
                        overflowX: 'auto'
                      },
                      '& code': {
                        background: 'rgba(0, 0, 0, 0.2)',
                        p: 0.5,
                        borderRadius: 1,
                        fontFamily: 'monospace'
                      },
                      '& img': {
                        maxWidth: '100%',
                        borderRadius: 2,
                        mt: 1
                      },
                      '& h1, & h2, & h3': {
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        pb: 1,
                        mb: 2
                      },
                      '& ul, & ol': {
                        pl: 3
                      }
                    }}>
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </Typography>
                  </Paper>
                </Box>
              </Fade>
            ))}
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box sx={{ 
            p: 2, 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(0, 0, 0, 0.2)'
          }}>
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item xs>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  variant="outlined"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  disabled={isLoading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 3,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)'
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title={currentMode === 'image' ? 'Switch to Chat' : 'Switch to Image Generation'}>
                  <IconButton
                    color={currentMode === 'image' ? 'secondary' : 'inherit'}
                    onClick={() => setCurrentMode(mode => mode === 'image' ? 'chat' : 'image')}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    {currentMode === 'image' ? <FormatPaintIcon /> : <ImageIcon />}
                  </IconButton>
                </Tooltip>
                <Button
                  variant="contained"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  endIcon={<SendIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #7C3AED 0%, #10B981 100%)',
                    px: 3,
                    py: 1.5,
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                    }
                  }}
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
