const http = require('http');
const url = require('url');

// Simulation d'une base de données de comptes
const accounts = {
    "FR761234": { owner: "Mira Expert", balance: 15000, currency: "EUR" },
    "FR765678": { owner: "Jean DevOps", balance: 2500, currency: "EUR" }
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    res.setHeader('Content-Type', 'application/json');

    // Route : /health (Pour que Kubernetes sache si l'app va bien)
    if (parsedUrl.pathname === '/health') {
        res.statusCode = 200;
        return res.end(JSON.stringify({ status: "UP", env: "BNP-Production" }));
    }

    // Route : /api/balance?iban=FR761234
    if (parsedUrl.pathname === '/api/balance') {
        const iban = parsedUrl.query.iban;
        if (accounts[iban]) {
            res.statusCode = 200;
            return res.end(JSON.stringify(accounts[iban]));
        } else {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: "Compte non trouvé" }));
        }
    }

    // Route par défaut
    res.statusCode = 200;
    res.end(JSON.stringify({ message: "Bienvenue sur l'API BNP Core Banking v1" }));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Banque démarrée sur le port ${PORT}`);
});