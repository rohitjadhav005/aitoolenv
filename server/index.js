import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from './db.js';
import crypto from 'crypto';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_123';

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log('A client connected');
});

// Middleware to authenticate
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

  try {
    const hash = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();
    
    const stmt = db.prepare('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)');
    stmt.run(id, name, email, hash);

    const token = jwt.sign({ id, email, name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id, name, email } });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Real Google Login
app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body; // Actually access_token from useGoogleLogin
  if (!credential) return res.status(400).json({ error: 'Token required' });

  try {
    const userInfoRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${credential}` }
    });
    
    const payload = userInfoRes.data;
    if (!payload || !payload.email) throw new Error('Invalid Google payload');
    
    const email = payload.email;
    const name = payload.name;
    const avatar = payload.picture;
    
    let stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    let user = stmt.get(email);

    if (!user) {
      const id = crypto.randomUUID();
      const hash = crypto.randomBytes(32).toString('hex');
      const insertStmt = db.prepare('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)');
      insertStmt.run(id, name, email, hash);
      user = { id, name, email };
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatar } });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ error: 'Google login failed' });
  }
});

// Real GitHub Login
app.post('/api/auth/github', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code required' });

  try {
    // 1. Exchange code for access token
    const tokenRes = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }, {
      headers: { Accept: 'application/json' }
    });

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) throw new Error('Failed to get GitHub access token');

    // 2. Get User Info
    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    // 3. Get User Email (GitHub sometimes hides email)
    const emailRes = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    const primaryEmail = emailRes.data.find((e) => e.primary)?.email || emailRes.data[0]?.email;
    if (!primaryEmail) throw new Error('No email found for GitHub user');

    const email = primaryEmail;
    const name = userRes.data.name || userRes.data.login;
    const avatar = userRes.data.avatar_url;

    let stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    let user = stmt.get(email);

    if (!user) {
      const id = crypto.randomUUID();
      const hash = crypto.randomBytes(32).toString('hex');
      const insertStmt = db.prepare('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)');
      insertStmt.run(id, name, email, hash);
      user = { id, name, email };
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatar } });
  } catch (error) {
    console.error('GitHub Auth Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'GitHub login failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email);

    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile
app.get('/api/auth/me', authenticate, (req, res) => {
  const stmt = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?');
  const user = stmt.get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

// Get all AI tools
app.get('/api/tools', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM tools ORDER BY created_at DESC');
    const tools = stmt.all();
    res.json({ tools });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new AI tool (protected)
app.post('/api/tools', authenticate, (req, res) => {
  const { name, tagline, description, website, pricing, logo, category } = req.body;
  
  if (!name || !website || !category) {
    return res.status(400).json({ error: 'Name, website, and category are required' });
  }

  try {
    const id = crypto.randomUUID();
    const stmt = db.prepare(`
      INSERT INTO tools (id, name, tagline, description, website, pricing, logo, category, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id, name, tagline || null, description || null, website, 
      pricing || 'free', logo || null, category, req.user.id
    );

    const newToolStmt = db.prepare('SELECT * FROM tools WHERE id = ?');
    const newTool = newToolStmt.get(id);

    io.emit('tool_added', newTool);

    res.json({ message: 'Tool added successfully', toolId: id });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin Stats
app.get('/api/admin/stats', (req, res) => {
  try {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const toolCount = db.prepare('SELECT COUNT(*) as count FROM tools').get().count;
    res.json({ totalUsers: userCount, totalTools: toolCount });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
