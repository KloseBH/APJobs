const axios = require('axios');
const cheerio = require('cheerio');

async function searchJobs(req, res) {
    try {
        if(!req.query.title) {
            return res.status(400).json({
                message: 'Parametro title é obrigatorio, exemplo: /jobs?title=Desenvolvedor Java'
            });
        }

        const jobsRemotive = await apiRemotive(req.query);
        const jobsGupy = await crawlerGP(req.query);
        res.status(200).json({
            Remotive: jobsRemotive?jobsRemotive:[],
            Gupy: jobsGupy?jobsGupy:[]
        });
    } catch (error) {
        console.error('Erro ao buscar vagas:', error);
        res.status(500).json({jobs});
    }
}

function parseTempo(tempoParam) {
  if (!tempoParam) return null;

  const match = tempoParam.match(/^(\d+)(h|d)$/);
  if (!match) return null;

  const value = parseInt(match[1]);
  const unit = match[2];

  if (unit === 'h') {
    return value * 3600; 
  } else if (unit === 'd') {
    return value * 86400;
  }

  return null;
}

async function crawlerGP(params){
    console.log('Crawler Gupy...');

    let json_response = {};
    json_response['aviso'] = "As vagas coletadas a partir da plataforma Gupy são obtidas por meio de consultas públicas permitidas pelo arquivo robots.txt. A coleta é realizada com responsabilidade, respeitando limites técnicos e sem sobrecarregar os servidores. Utilizamos apenas endpoints acessíveis pelo próprio site da Gupy, com frequência controlada. Todas as vagas mantêm seu link original e podem ser acessadas diretamente pela plataforma oficial."
    json_response['url_portal'] = 'https://gupy.io/';

    const location = params.location ? `&country=${params.location}` : ''; 
    const title = params.title.replace(/\s/g, '+');
    const time = params.time ? parseTempo(params.time) : parseTempo('31d');
    let page = params.page ? parseInt(params.page, 10) : 1;

    if(typeof page !== 'number') {
        limit = 1;
    }

    let url;
    let jobs = {};
    try {
        let id = 0;
        console.log('Coletando ' + (page*100) + ' vagas');
        for (let i = (page*100) - 100; i < (page*100); i+= 10) {
            setTimeout(() => {}, 500);
            url = 'https://employability-portal.gupy.io/api/v1/jobs?jobName=' + title + location + '&offset=' + i;
            console.log(url);
            
            let response = await axios.get(url)
                            .then(response => response)
                            .catch(error => error.response);

            if(response.status !== 200) {
                console.log('Coletadas todas as vagas disponiveis na Gupy!');
                break;
            }

            const json = await response.data.data;

            if(!json || json.length === 0) {
                console.log('Coletadas todas as vagas disponiveis na Gupy!');
                break;
            }

            json.forEach(job => {
                if (!job.publishedDate) return;

                const dataPublicada = new Date(job.publishedDate);
                const dataReferencia = (new Date() - dataPublicada) / 1000;

                if (dataReferencia >= time) return;

                jobs[id] = {
                    portal: 'Gupy',
                    title: job.name || 'Sem título',
                    type: job.isRemoteWork ? 'Remoto' : 'Presencial',
                    description: job.description || '',
                    company: {
                        name: job.careerPageName || 'Desconhecida',
                        link: job.careerPageUrl || ''
                    },
                    location: `${job.country || 'País não informado'} - ${job.state || ''} - ${job.city || ''}`,
                    date: job.publishedDate.split('T')[0],
                    link: job.jobUrl || ''
                };

                id++;
            });
            console.log('Coletadas ' + Object.keys(jobs).length + ' vagas');
        }        
    } catch (error) {
        console.error('Erro no crawler da Gupy:', error);
        json_response['message'] = 'Erro ao buscar vaga na Gupy';
        json_response['error'] = error;
        return json_response;
    }

    if(!jobs || Object.keys(jobs).length === 0) {
        json_response['message'] = 'Nenhuma vaga encontrada na Gupy para o titulo: ' + params.title;
        return json_response;
    }

    json_response['jobs'] = jobs;
    return json_response;
}

async function apiRemotive(params) {
    console.log('Acessado API da Remotive...');

    let json_response = {};
    json_response['aviso'] = "As vagas obtidas da plataforma Remotive são acessadas por meio de sua API pública, conforme permitido em sua documentação oficial. A coleta é realizada com moderação, respeitando os limites de requisições recomendados (até 4 vezes ao dia) e com atribuição adequada. Todas as vagas incluem o link original e mencionam a Remotive como fonte, garantindo transparência e conformidade com os termos de uso da plataforma.";
    json_response['url_portal'] = 'https://remotive.com/';

    const title = params.title.replace(/\s/g, '+');
    const time = params.time ? parseTempo(params.time) : parseTempo('31d');
    const location = params.location??null;
    const page = params.page ? parseInt(params.page, 10) : 1;

    const limit = 100;
    let offset;
    if(typeof page !== 'number') {
        offset = 0;
    }else{
        offset = (page-1)*100;
    }

    let url;
    let jobs = {};
    try {
        console.log('Coletando vagas da Remotive...');
        setTimeout(() => {}, 500);
        url = 'https://remotive.com/api/remote-jobs?search=' + title;
        console.log(url);
        
        let response = await axios.get(url)
                        .then(response => response)
                        .catch(error => error.response);

        if(response.status !== 200) {
            console.log('Coletadas todas as vagas disponiveis na Remotive!');
            json_response['message'] = 'Nenhuma vaga encontrada na Remotive para o titulo: ' + params.title;
            return json_response;
        }

        const json = await response.data.jobs;

        if(!json || json.length === 0) {
            console.log('Coletadas todas as vagas disponiveis na Remotive!');
            json_response['message'] = 'Nenhuma vaga encontrada na Remotive para o titulo: ' + params.title;
            return json_response;
        }

        let id = 0;
        let count = 0;
        json.forEach(job => {
            if (!job.publication_date) return;

            if (offset > 0){
                offset--;
                return;
            }; 
            if (count >= limit) return;
            count++;

            const dataPublicada = new Date(job.publication_date);
            const dataReferencia = (new Date() - dataPublicada) / 1000;

            if (dataReferencia >= time) return;
            if (location && !job.candidate_required_location.includes(location)) return;

            jobs[id] = {
                portal: 'Remotive',
                title: job.title || 'Sem título',
                type: 'Remoto',
                description: job.description || '',
                company: {
                    name: job.company_name || 'Desconhecida'
                },
                location: job.candidate_required_location || '',
                date: job.publication_date.split('T')[0],
                link: job.url || ''
            };

            id++;
        });
        console.log('Coletadas ' + Object.keys(jobs).length + ' vagas');       
    } catch (error) {
        console.error('Erro ao coletar da API da Remotive:', error);
        json_response['message'] = 'Erro ao buscar vaga na Remotive';
        json_response['error'] = error;
        return json_response;
    }

    if(!jobs || Object.keys(jobs).length === 0) {
        json_response['message'] = 'Nenhuma vaga encontrada na Remotive para o titulo: ' + params.title;
        return json_response;
    }

    json_response['jobs'] = jobs;
    return json_response;
}

module.exports = {
    searchJobs
}