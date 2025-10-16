// load environment variables from .env (if present)
require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();
const desiredPort = parseInt(process.env.PORT,10) || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Mongoose Card model
const cardSchema = new mongoose.Schema({
  energy: String,
  HP: String,
  Image: String,
  createdAt: { type: Date, default: Date.now }
}, { collection: 'cards' });
const Card = mongoose.model('Card', cardSchema);

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartbinder';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('Connected to MongoDB'))
  .catch(err=> console.error('MongoDB connection error:', err));

// Helper to map DB fields to view-friendly objects
function mapCard(doc){
  // Prefer DB-provided image URL; support common field name variants
  const imageUrl = doc.Image || doc.image || doc.img || null;
  // Infer createdAt from ObjectId timestamp if missing
  const inferredCreated = (doc.createdAt)
    ? new Date(doc.createdAt)
    : (typeof doc._id?.getTimestamp === 'function' ? doc._id.getTimestamp() : new Date(0));
  return {
    id: doc._id,
    energy: (doc.energy || '').toString(),
    img: imageUrl, // no local fallback; only use DB
    createdAt: inferredCreated
  };
}

app.get('/', async (req, res) => {
  try{
    const raw = await Card.find().lean();
    const cards = raw.map(mapCard)
      .sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
    const recent = cards.slice(0, 10);
    const spotlight = recent[0] || cards[0] || {};

    // determine if there are any cards added since user's last visit
    const lastVisit = req.cookies.lastVisit ? new Date(req.cookies.lastVisit) : null;
    const newSinceLast = lastVisit ? cards.filter(c => new Date(c.createdAt) > lastVisit).slice(0,6) : [];

    // update lastVisit cookie to now
    res.cookie('lastVisit', new Date().toISOString(), { maxAge: 1000*60*60*24*365 });

    res.render('home', { cards, recent, spotlight, newSinceLast });
  }catch(err){
    console.error('Error loading home data', err);
    res.status(500).send('Server error');
  }
});

app.get('/collection', async (req, res) => {
  try{
    const raw = await Card.find().lean();
    const cards = raw.map(mapCard)
      .sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
    res.render('collection', { cards });
  }catch(err){
    console.error('Error loading collection', err);
    res.status(500).send('Server error');
  }
});

app.get('/lights', (req, res) => {
  res.render('lights');
});

app.get('/settings', (req, res) => {
  res.render('settings');
});

function startServer(port, attemptsLeft=3){
  const server = app.listen(port, () => {
    console.log(`SmartBinder prototype running: http://localhost:${port}`);
  });
  server.on('error', (err)=>{
    if(err && err.code === 'EADDRINUSE' && attemptsLeft>0){
      const next = port + 1;
      console.warn(`Port ${port} in use, trying ${next}...`);
      startServer(next, attemptsLeft-1);
    }else{
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

startServer(desiredPort);
