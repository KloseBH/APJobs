
function parseDate(str) {
  const [year, month, day] = str.split('-').map(Number);
  return new Date(year, month - 1, day);
}

async function fetchJobs(params) {
    let title = params.title.replace(/\s/g, '+');
    let location = params.location ? params.location.replace(/\s/g, '+') : '';
    let page = params.page ? params.page : '';
    let time = '';
    if(params.time){
        let now = new Date();
        let date = parseDate(params.time);
        let milisegundos = now - date;
        let horas = Math.floor(milisegundos / 1000 / 60 / 60);
        time = horas <= 0 ? '24h' : horas + 'h';
    }

    let url = 'http://localhost:3000/jobs?title=' + title + '&location=' + location + '&time=' + time + '&page=' + page;
    console.log(url);
    return fetch(url, { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response.json(); 
        })
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(error => {
            console.error("Falha ao buscar dados:", error);
            throw error;
        });
}

export default fetchJobs