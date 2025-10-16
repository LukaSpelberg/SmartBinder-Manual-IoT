require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartbinder';

const cardSchema = new mongoose.Schema({
  energy: String,
  HP: String,
  Image: String,
  createdAt: { type: Date, default: Date.now }
}, { collection: 'cards' });
const Card = mongoose.model('Card', cardSchema);

async function run(){
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB:', mongoUri);

  const sample = [
    { energy: 'Psychic', HP: '60', Image: 'https://images.pokemontcg.io/base1/49_hires.png' },
    { energy: 'Fire', HP: '70', Image: 'https://images.pokemontcg.io/base1/58_hires.png' },
    { energy: 'Water', HP: '50', Image: 'https://images.pokemontcg.io/base1/35_hires.png' },
    { energy: 'Grass', HP: '50', Image: 'https://images.pokemontcg.io/base1/55_hires.png' },
    { energy: 'Lightning', HP: '40', Image: 'https://images.pokemontcg.io/base1/66_hires.png' },
    { energy: 'Fighting', HP: '50', Image: 'https://images.pokemontcg.io/base1/56_hires.png' },
    { energy: 'Metal', HP: '60', Image: 'https://images.pokemontcg.io/neo1/8_hires.png' },
    { energy: 'Darkness', HP: '60', Image: 'https://images.pokemontcg.io/neo1/5_hires.png' },
    { energy: 'Fairy', HP: '60', Image: 'https://images.pokemontcg.io/xy1/100_hires.png' },
    { energy: 'Dragon', HP: '70', Image: 'https://images.pokemontcg.io/bw6/84_hires.png' }
  ];

  const inserted = await Card.insertMany(sample.map(s => ({ ...s, createdAt: new Date() })));
  console.log('Inserted cards:', inserted.length);
  await mongoose.disconnect();
}

run().catch(err=>{ console.error(err); process.exit(1); });
