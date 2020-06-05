import React, { useState, useEffect } from 'react';
import { FaTrashAlt, FaEdit } from 'react-icons/fa'
import api from './services/api';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [select, setSelect] = useState([]);
  const [resfresh, setRefresh] = useState(false);
  const [edit, setEdit] = useState(false);

  const [id, setId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [nota, setNota] = useState('');
  const [categoria, setCategoria] = useState('');

  useEffect(() => {
    api.get('/notas').then(res => {
      setData(res.data);
      setRefresh(true);
    }).catch(err => console.log(err));
  }, [resfresh]);

  useEffect(() => {
    api.get('/categorias').then(res => {
      setSelect(res.data);
    }).catch(err => console.log(err))
  }, []);

  const handleTitulo = (e) => {
    setTitulo(e.target.value);
  }

  const handleCategoria = (e) => {
    setCategoria(e.target.value);
  }

  const handleNotas = (e) => {
    setNota(e.target.value);
  }

  const handleEdit = (id) => {
    api.get(`/notas/${id}`).then(res => {
      setId(id);
      setTitulo(res.data.titulo);
      setNota(res.data.nota);
      setCategoria(res.data.categoria);

      setEdit(true);
    }).catch(err => console.log(err))
  }

  const handleDelete = (id) => {
    api.delete(`/notas/${id}`).then(res => {
      if(res.status == 200){
        setRefresh(false);
      }
    }).catch(err => console.log(err))
  }

  const notaUpdate = (e) => {
    e.preventDefault();

    api.put(`/notas/${id}`, {
      titulo,
      nota,
      categoria
    }).then(res => {
      if(res.status == 200){
        setTitulo('');
        setNota('');
        setCategoria('');

        setEdit(false);
        setRefresh(false);
      }
    }).catch(err => console.log(err));
    
  }

  const notaNew = (e) => {
    e.preventDefault();

    api.post('/notas', {
      titulo,
      nota,
      categoria
    }).then(res => {
      if(res.status == 200){
        setTitulo('');
        setNota('');
        setCategoria('');

        setRefresh(false);
      }
    }).catch(err => console.log(err));

  }

  return (
    <>
      <div className="App-Header">
        <span>Notas</span>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-around', flexDirection: 'row', backgroundColor: '#DDD'}}>
       
        <div className="App-New">
          <form onSubmit={edit ? notaUpdate : notaNew}>
            <div>
              <label>Titulo</label>
              <br/>
              <input value={titulo} onChange={handleTitulo}/>
            </div>
            <div>
              <label>Categoria</label><br/>
              <select name="categoria" onChange={handleCategoria}>
                <option>Escolha uma opção...</option>
                {
                  select.map((data, index) => (
                    <option key={data.id} value={data.id}>{data.descricao}</option>
                  ))
                }
              </select>
            </div>
            <div>
              <textarea value={nota} onChange={handleNotas} rows="10" cols="30"></textarea>
            </div>
              <button>{edit ? 'Atualizar' : 'Enviar'}</button>
          </form>
        </div>
        
        <div className="App-Content">
          <div className="App-Content-Grid">
            {
              data.map(result => (
                <div className="App-Card" key={result.id}>
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                    <span>{result.titulo}</span>
                    <span>{result.created_at}</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-around'}}>
                    <span onClick={() => {handleEdit(result.id)}} style={{cursor: 'pointer'}}>
                      <FaEdit/>
                    </span>
                    <span onClick={() => {handleDelete(result.id)}} style={{cursor: 'pointer'}}>
                      <FaTrashAlt />
                    </span>
                  </div>
                </div>
              ))
            }    
          </div>
        </div>
        
      </div>
    </>
  );
}

export default App;
