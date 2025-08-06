import { useState } from 'react'

function Form({ Consulta }) {
    const [formData, setFormData] = useState({
      title:    '',
      location: '',
      time:     new Date(),
      page:     1
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState, 
            [name]: value, 
        }));
    };

    const Submit = (event) => {
      event.preventDefault();
      Consulta(formData);
    }
    
    return (
        <form onSubmit={Submit}>
          <h2>Consulta de Vagas</h2>
          <label htmlFor="title">Título da vaga:</label>
          <input type="text" name="title" id="title" required
            onChange={handleChange}
            placeholder="Ex: Desenvolvedor Java"/>
          <label htmlFor="location">Localização:</label>
          <input type="text" name="location" id="location" 
            onChange={handleChange}
            placeholder="Ex: Brasil"/>
          <label htmlFor="time">Tempo desde a publicação:</label>
          <input type="date" name="time" id="time" value={formData.time}
            onChange={handleChange}/>
          <label htmlFor="page">Paginação:</label>
          <input type="text" name="page" id="page" value={formData.page}
            onChange={handleChange}
            placeholder="1-100"
            pattern="^(\d{1,3})$"/>
          <button type="submit">Buscar</button>
        </form>
    )
}

export default Form