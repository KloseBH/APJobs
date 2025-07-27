const routes = require('express').Router();
const jobsController = require('../controllers/jobsController');

routes.get('/', (req, res) => {
    res.status(200).json({
        message: 'Bem vindo ao APJobs',
        routes: {
            jobs: {
                get: '/jobs',
                params: {
                    title: 'string do nome do cargo ou vaga, exemplo: /jobs?title=Desenvolvedor Java',
                    location: 'string do pais, exemplo: /jobs?title=Desenvolvedor Java&location=Brasil',
                    time: 'tempo em horas ou dias, exemplo: /jobs?title=Desenvolvedor Java&time=2h ou /jobs?title=Desenvolvedor Java&time=2d',
                    page: 'numero da pagina, cada página possui 100 vagas no máximo, exemplo: /jobs?title=Desenvolvedor Java&page=1'
                }
            }
        }
    });
});

routes.get('/jobs', jobsController.searchJobs);

module.exports = routes;