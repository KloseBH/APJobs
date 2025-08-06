import { useState } from 'react'

function Results() {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [time, setTime] = useState(new Date());
    const [page, setPage] = useState(1);

    const Submit = (event) => {
      event.preventDefault();
      Consulta({
          title:    title,
          location: location,
          time:     time,
          page:     page
      });
    }
    
    return (
        <form onSubmit={Submit}>
          <h2>Consulta de Vagas</h2>
          <label htmlFor="title">Título da vaga:</label>
          <input type="text" name="title" id="title" required
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Desenvolvedor Java"/>
          <label htmlFor="location">Localização:</label>
          <input type="text" name="location" id="location" 
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ex: Brasil"/>
          <label htmlFor="time">Tempo desde a publicação:</label>
          <input type="date" name="time" id="time" value={time}
            onChange={(e) => setTime(e.target.value)}/>
          <label htmlFor="page">Paginação:</label>
          <input type="text" name="page" id="page" value={page}
            onChange={(e) => setPage(e.target.value)}
            placeholder="1-100"
            pattern="^(\d{1,3})$"/>
          <button type="submit">Buscar</button>
        </form>
    )
}

export default Results