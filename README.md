# APJobs
## Autor

Daniel Dias - Full Stack Developer

> ⚠️ Aviso legal: Este projeto é destinado exclusivamente a fins educacionais. O uso de scraping em sites de terceiros pode violar os termos de uso dessas plataformas. O autor não se responsabiliza pelo uso indevido deste código.

## Contexto

**APJobs** é uma API simples e eficiente para consulta de vagas de emprego disponíveis pela internet, utilizando web scraping com `axios` e `cheerio` e também APIs públicas. Atualmente, a API permite buscas personalizadas por meio de parâmetros como título da vaga, localização, tempo de publicação e paginação.

## Funcionalidades

- Consulta de vagas de emprego
- Filtro por:
  - Título da vaga (`title`)
  - Localização (`location`)
  - Tempo desde a publicação (`time`)
  - Paginação (`page`)
- Retorno de até 100 vagas por página
- Dados obtidos via **crawler** (axios + cheerio)

## Como usar

### Requisitos

- Node.js v14+ (preferencialmente LTS)
- npm ou yarn

### Instalação

```bash
git clone https://github.com/seu-usuario/apjobs.git
cd apjobs
npm install
```

### Executando a API

```bash
npm start
```

A API estará disponível em: `http://localhost:3000`

## Rotas

### `GET /`

Rota de boas-vindas com informações sobre a API.

**Resposta:**

```json
{
  "message": "Bem vindo ao APJobs",
  "routes": {
    "jobs": {
      "get": "/jobs",
      "params": {
        "title": "string do nome do cargo ou vaga, exemplo: /jobs?title=Desenvolvedor Java",
        "location": "string do pais, exemplo: /jobs?title=Desenvolvedor Java&location=Brasil",
        "time": "tempo em horas ou dias, exemplo: /jobs?title=Desenvolvedor Java&time=2h ou /jobs?title=Desenvolvedor Java&time=2d",
        "page": "numero da pagina, cada página possui 100 vagas no máximo, exemplo: /jobs?title=Desenvolvedor Java&page=1"
      }
    }
  }
}
```

---

### `GET /jobs`

Retorna vagas com base nos parâmetros informados.

#### Parâmetros disponíveis:

| Parâmetro | Tipo   | Descrição |
|----------|--------|-----------|
| `title`  | string | Nome da vaga (ex: `Desenvolvedor Java`) **(obrigatório)** |
| `location` | string | País onde a vaga está disponível (ex: `Brasil`) |
| `time` | string | Tempo desde a publicação (ex: `2h` ou `3d`) |
| `page` | número | Número da página de resultados (cada página contém até 100 vagas) |

#### Exemplo de requisição

```
GET /jobs?title=Desenvolvedor Java&location=Brasil&time=2d&page=1
```

#### Exemplo de resposta

```json
[
  {
    "title": "Desenvolvedor Java Pleno",
    "company": "Empresa X",
    "location": "São Paulo, Brasil",
    "posted": "2 dias atrás",
    "link": "https://www.exemplosite.com/jobs/123456789/"
  }
]
```

## Tecnologias utilizadas

- [Express.js](https://expressjs.com/)
- [Axios](https://axios-http.com/)
- [Cheerio](https://cheerio.js.org/)
- [Node.js](https://nodejs.org/)
- [Vite.js](https://vite.dev/)
- [React](https://react.dev/)

*O script respeita limites de acesso e é projetado para ser leve, evitando sobrecarga nos servidores alvo.*
