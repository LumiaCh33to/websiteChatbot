const express = require('express');
const axios = require('axios');
const app = express();

const CLIENT_ID = 'gp762nuuoqcoxypju8c569th9wz7q5';
const CLIENT_SECRET = 'dajopafajop3c83';
const REDIRECT_URI = 'http://localhost:3000/auth/twitch/callback';

app.use(express.static('public'));

app.get('/login', (req, res) => {
  const scope = 'chat:read chat:edit';
  const url = `https://id.twitch.tv/oauth2/authorize` +
    `?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scope)}`;

  res.redirect(url);
});

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
    res.send('OAuth Fehler');
  }
});

app.listen(3000, () => {
  console.log('Server läuft auf http://localhost:3000');
});
