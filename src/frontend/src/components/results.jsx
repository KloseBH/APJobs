import { useState } from 'react'

function Results({data, onReset}) {
  const [jobsGP, setJobsGP] = useState(Object.values(data.Gupy.jobs));
  
  return (
    <>
      <a href="#" onClick={onReset}>Nova Consulta</a>
      <h2>Resultados</h2>
      <ul>
        {jobsGP.map((job) => (
          <li key={job.id}>
            <h3>{job.title}</h3>
            <p>{job.company.name}</p>
            <p>{job.location}</p>
            <p>{job.description}</p>
            <p>{job.url}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

export default Results