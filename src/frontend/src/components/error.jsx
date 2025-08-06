function Error({message, onReset}) {
    return (
        <div>
            <h2>Erro: {message}</h2>
            <button onClick={onReset}>Tentar novamente</button>
        </div>
    )
}

export default Error