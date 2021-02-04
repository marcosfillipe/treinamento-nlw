import express, { request, response } from 'express';
import routes from './routes'; 

const app = express();

app.use(express.json());


//Rota: Endereço completo da requisição
//Recurso: Qual entidade estamos acessando do Sistema

//GET: Buscar uma ou mais informações do back-end
//POST: Criar uma nova informação do back-end
//PUT: Atualizar uma informação existente no back-end
//DELETE: Remover uma informação do back-end


//Request Param: Parâmetros que vem na própria rota que identificam um recurso
//Query Param: Parâmetros que vem na própria rota geralmente opcionais para filtros, paginação
//Request Body: Parâmetros para criação/atualização de informações


app.use(routes);
app.listen(3333);

