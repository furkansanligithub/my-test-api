const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

const port = 3000;

app.use(express.json()); // Needed to parse JSON request body
app.use(cors());

// ✅ 1. MongoDB Connection
const mongoUri1 = 'mongodb+srv://furkansanli:furkansanli@mytestcluster.rwhohc0.mongodb.net/?retryWrites=true&w=majority&appName=myTestCluster';
const mongoUri1 = 'mongodb+srv://furkansanli:Wasd123+654+789@mymongousers.pscuiyq.mongodb.net/?retryWrites=true&w=majority&appName=myMongoUsers';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ 2. Define the Phone Schema & Model
const phoneSchema = new mongoose.Schema({
  original: String,
  phoneWithCountryCode: String,
  phoneWithoutCountryCode: String,
  countryCode: String,
  countryName: String
});

const Phone = mongoose.model('Phone', phoneSchema);

// ✅ 3. Phone Formatter Function
function formatPhone(phone) {
  const countryMap = {
    '+1': 'United States/Canada',
    '+44': 'United Kingdom',
    '+49': 'Germany',
    '+33': 'France',
    '+34': 'Spain',
    '+90': 'Turkiye',
    '+91': 'India',
    '+81': 'Japan',
    '+61': 'Australia',
    '+86': 'China',
    '+39': 'Italy',
    '+55': 'Brazil',
  };

  let cleaned = phone.replace(/[\s\-\(\)]/g, '');

  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }

  const matchedCode = Object.keys(countryMap)
    .sort((a, b) => b.length - a.length)
    .find(code => cleaned.startsWith(code));

  if (!matchedCode) {
    throw new Error('Unknown or unsupported country code');
  }

  const phoneWithoutCountryCode = cleaned.slice(matchedCode.length);
  const phoneWithCountryCode = matchedCode + phoneWithoutCountryCode;
  const countryName = countryMap[matchedCode];

  return {
    phoneWithCountryCode,
    phoneWithoutCountryCode,
    countryCode: matchedCode,
    countryName
  };
}

// ✅ 4. POST Route to Format & Save Phone
app.post('/format-phone', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: "Missing 'phone' in request body" });
    }

    const result = formatPhone(phone);
    const saved = await Phone.create({ original: phone, ...result });

    console.log('✅ Saved phone:', saved);
    res.json(saved);
  } catch (error) {
    console.error('❌ Error in /format-phone:', error);
    res.status(400).json({ error: error.message });
  }
});

// ✅ 5. GET Route to Fetch All Phones
app.get('/phones', async (req, res) => {
  try {
    const phones = await Phone.find();
    res.json(phones);
  } catch (err) {
    console.error('❌ Error fetching phones:', err);
    res.status(500).json({ error: 'Failed to fetch phones' });
  }
});

// ✅ 6. Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
