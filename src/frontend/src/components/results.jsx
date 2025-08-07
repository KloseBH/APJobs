import { use, useState } from 'react'

function Results({data, onReset}) {
  const [gupy, setGupy] = data.Gupy ? useState(data.Gupy) : useState([]);
  const [remotive, setRemotive] = data.Remotive ? useState(data.Remotive) : useState([]);

  const result_portal = (portal) =>{
    console.log(portal);
    let jobs = portal.jobs ? Object.values(portal.jobs) : [];
    return (
      <div className="col-md-6">
        <div className="container" id={portal.name}>
          <div className="row align-items-center">
            <div className="position-relative text-center my-1">
              <a className="text-light" href={portal.link}><h2 className="m-0">{portal.name}</h2></a>

              <i 
                className="bi bi-info-square text-light position-absolute end-0 top-50 translate-middle-y me-3"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title={portal?.warning}>
              </i>
            </div>
          </div>
          <div className="row">
            {jobs.length === 0 ? (
              <p className="text-center">Nenhuma vaga encontrada.</p>
            ) : (
              jobs.map((job) => (
                <div className="col-md-12 p-2 w-100" key={job.link}>
                  <div className="card h-100 text-start" id='card'>
                    <div className="row">
                      <div className="card-body p-2">
                        <h5 className="card-title h-50 border-bottom d-flex justify-content-center align-items-center">
                          <b>{job.title}</b>
                        </h5>
                        <p className="card-text"><b>Empresa: </b><a href={job.company.link}>{job.company.name}</a></p>
                        <p className="card-text"><b>Localização: </b>{job.location}</p>
                        <p className="card-text"><b>Publicado: </b>{job.date}</p>
                        <p className="card-text"><b>Tipo: </b>{job.type}</p>
                        <p className="card-text"><b>Portal: </b>{job.portal}</p>
                      </div>
                    </div>
                    <div className="row pt-3 pb-3 flex-row-reverse">
                      <div className="col-md-4">
                        <a className="btn btn-outline" href={job.link}>Acessar Vaga</a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className='container-fluid results'>
      <div className="row mb-4">
        <div className="col-md-2">
          <a href="#" onClick={onReset} className="btn btn-outline">Nova Consulta</a>
        </div>
        <div className="col-md-8">
          <h2>Resultados</h2>
        </div>
      </div>
      <div className="row">
        {result_portal(remotive)}
        {result_portal(gupy)}
      </div>
    </div>
  )
}

export default Results