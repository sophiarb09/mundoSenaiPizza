import express from 'express';
import cors from 'cors';

const app = express();

const PORT = 3331;

app.use(cors());
app.use(express.json())

app.listen(PORT, () => {
    "O servidor esta rodando na porta: ", PORT
});