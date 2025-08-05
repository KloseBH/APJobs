const axios = require('axios');
const cheerio = require('cheerio');

async function searchJobs(req, res) {
    try {
        if(!req.query.title) {
            return res.status(400).json({
                message: 'Parametro title é obrigatorio, exemplo: /jobs?title=Desenvolvedor Java'
            });
        }

        const jobsLinkedIn = await crawlerLinkedIn(req.query);
        const jobsGupy = await crawlerGupy(req.query);
        jobs = {
            LinkedIn: jobsLinkedIn?jobsLinkedIn:[],
            Gupy: jobsGupy?jobsGupy:[]
        }
        res.status(200).json({
            jobs
        });
    } catch (error) {
        console.error('Erro ao buscar vagas:', error);
        res.status(500).json({jobs});
    }
}

async function crawlerLinkedIn(params){
    console.log('Crawler LinkedIn...');
    
    const tempoEmSegundos = parseTempo(params.time);
    const f_TPR = tempoEmSegundos ? `&f_TPR=r${tempoEmSegundos}` : '';
    const location = params.location ? `&location=${params.location}` : ''; 
    const title = params.title.replace(/\s/g, '+');
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
            url = 'https://br.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=' + title +  f_TPR + location + '&start=' + i;
            console.log(url);
            
            let response = await axios.get(url)
                            .then(response => response)
                            .catch(error => error.response);

            if(response.status !== 200) {
                console.log('Coletadas todas as vagas disponiveis no LinkedIn!');
                break;
            }

            let html = await response.data;
            let $ = cheerio.load(html);

            $('li').each((index, element) => {
                let title = $(element).find('.base-search-card__title').text().trim();
                let companyName = $(element).find('.base-search-card__subtitle > a').text().trim();
                let companyLink = $(element).find('.base-search-card__subtitle > a').attr('href');
                let location = $(element).find('.job-search-card__location').text().trim();
                let date = $(element).find('.job-search-card__listdate').text().trim();
                if (!date) {
                    date = $(element).find('.job-search-card__listdate--new').text().trim();
                }
                let jobLink = $(element).find('.base-card__full-link').attr('href');

                if (title && jobLink) { 
                    jobs[id] = {
                        portal: 'LinkedIn',
                        title: title,
                        company: {
                            name: companyName,
                            link: companyLink
                        },
                        location: location,
                        date: date,
                        link: jobLink
                    };
                }
                id++;
            });   
            console.log('Coletadas ' + Object.keys(jobs).length + ' vagas');
        }        
    } catch (error) {
        console.error('Erro no crawler do LinkedIn:', error);
        return {
            message: 'Erro ao buscar vaga no LinkedIn',
            error: error
        }
    }

    if(!jobs || Object.keys(jobs).length === 0) {
        return {
            message: 'Nenhuma vaga encontrada no LinkedIn para o titulo: ' + params.title
        }
    }

    return jobs;
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

async function crawlerGupy(params){
    console.log('Crawler Gupy...');

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
        return {
            message: 'Erro ao buscar vaga na Gupy',
            error: error
        }
    }

    if(!jobs || Object.keys(jobs).length === 0) {
        return {
            message: 'Nenhuma vaga encontrada na Gupy para o titulo: ' + params.title
        }
    }

    return jobs;
}


module.exports = {
    searchJobs
}