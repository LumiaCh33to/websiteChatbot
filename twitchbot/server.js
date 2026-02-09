const express = require('express');
const axios = require('axios');
const app = express();


// Environment Variables nutzen
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;


const PORT = process.env.PORT || 3000;


app.use(express.static('public'));


// Login Route
app.get('/login', (req, res) => {
const scope = 'chat:read chat:edit';
const url = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scope)}`;
res.redirect(url);
});


// Callback Route für Twitch OAuth
app.get('/auth/twitch/callback', async (req, res) => {
const code = req.query.code;
try {
const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
params: {
client_id: CLIENT_ID,
client_secret: CLIENT_SECRET,
code,
grant_type: 'authorization_code',
redirect_uri: REDIRECT_URI
}
});


const accessToken = response.data.access_token;


res.send(`
<h1>Login erfolgreich 🎉</h1>
<p>Access Token:</p>
<code>${accessToken}</code>
`);
} catch (err) {
console.error(err.response ? err.response.data : err);
res.send('<h1>OAuth Fehler 😢</h1><p>Check logs.</p>');
}
});


// Server starten
app.listen(PORT, () => {
console.log(`Server läuft auf Port ${PORT}`);
});
