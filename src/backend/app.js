const jobRoutes = require('./routes/index.js');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', jobRoutes);

app.listen(3000, () => console.log('Rodando na porta 3000: http://localhost:3000/'));