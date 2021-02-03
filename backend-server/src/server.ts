import express from 'express'

const app = express();

app.get('/users', (request, response) => {
    console.log('Listagem de usuários');

    response.json([
        'Marcos',
        'Gansola',
        'Yamete',
        'Rafael',
        'Negão'
    ]);

});

app.listen(3333);

