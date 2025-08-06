import { useState } from 'react';
import './styles/App.css';
import Form from './components/form';
import Results from './components/results';
import Loading from './components/loading';
import Error from './components/error';
import fetchJobs from './services/apjobs';

function App() {
  const [view, setView] = useState('form');
  const [apiData, setApiData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async (formData) => {
    setView('loading');
    
    try {
      const results = await fetchJobs({
        title: formData.title,
        location: formData.location,
        time: formData.time,
        page: formData.page
      });
      
      setApiData(results);
      setView('results');
    } catch (error) {
      setErrorMessage(error.message);
      setView('error');
    }
  };

  const handleReset = () => setView('form');

  const renderContent = () => {
    switch(view) {
      case 'loading': return <Loading />;
      case 'results': return <Results data={apiData} onReset={handleReset} />;
      case 'error': return <Error message={errorMessage} onReset={handleReset} />;
      default:
        return <Form Consulta={handleSearch} />;
    }
  };

  return (
    <>
      <div>
        <h1>APJobs</h1>
        <h2>API de busca de vagas de emprego</h2>
        {renderContent()}
      </div>
    </>
  )
}

export default App
