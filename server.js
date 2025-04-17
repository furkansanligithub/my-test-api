const express = require('express');
const app = express();

app.use(express.json()); // Needed to parse JSON request body

function formatPhone(phone) {
  const countryMap = {
    '+1': 'United States/Canada',
    '+44': 'United Kingdom',
    '+49': 'Germany',
    '+33': 'France',
    '+34': 'Spain',
    '+90': 'Turkey',
    '+91': 'India',
    '+81': 'Japan',
    '+61': 'Australia',
    '+86': 'China',
    '+39': 'Italy',
  };

  // Clean up input
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Make sure it starts with +
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }

  // ✅ Try exact matches with country codes only (no extra digits)
  const matchedCode = Object.keys(countryMap)
    .sort((a, b) => b.length - a.length) // try longest first
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

// POST /format-phone
app.post('/format-phone', (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: "Missing 'phone' in request body" });
    }

    const result = formatPhone(phone);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
