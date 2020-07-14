require('./src/config/database');
const app = require('./src/config/express');

const PORT = 4200;

app.listen(PORT, () => {
    console.log(`Rodando na porta ${PORT}`);
});