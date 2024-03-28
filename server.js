// server.js
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();

// Servir les fichiers statiques de votre application React
app.use(express.static(path.join(__dirname, 'build')));

// Un catch-all handler pour toutes les autres requêtes renvoyant index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Chemins vers vos fichiers de certificat générés par mkcert
const options = {
    key: fs.readFileSync(path.join(__dirname, 'rootCA-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'rootCA.pem'))
};

// Créer un serveur HTTPS
https.createServer(options, app).listen(3000, () => {
    console.log('Serveur HTTPS démarré sur https://localhost:3000');
});
