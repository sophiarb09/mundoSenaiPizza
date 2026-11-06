import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3331;

const pastaHtml = path.join(__dirname, '../frontend/html');
app.use('/', express.static(pastaHtml)); 

const pastaAdmin = path.join(__dirname, '../frontend/adminHtml');
app.use('/adminHtml', express.static(pastaAdmin));

// CSS, JS, imagens
const pastaFrontend = path.join(__dirname, '../frontend');
app.use(express.static(pastaFrontend));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(pastaHtml, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
});