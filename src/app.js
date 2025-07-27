const jobRoutes = require('./routes/index.js');
const express = require('express');

const app = express();

app.use(express.json());
app.use('/', jobRoutes);

app.listen(3000, () => console.log('Rodando na porta 3000: http://localhost:3000/'));