import firebase from '../../services/firebaseConnection'
import { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';

import { FiPlusCircle } from 'react-icons/fi'

import './new.css'

export default function New() {


  const [loadCustomers, setLoadcustomers] = useState(true)
  const [customers, setCustomers] = useState([])
  const [customerSelected, setCustomerSelected] = useState(0)

  const [assunto, setAssunto] = useState('Suporte')
  const [status, setStatus] = useState('Aberto')
  const [complemento, setComplemento] = useState('')


  const { user } = useContext(AuthContext);


  useEffect(() => {
    async function loadCustmers() {
      setLoadcustomers(true)
      await firebase.firestore().collection('customers')
        .get()
        .then((snapshot) => {
          let lista = [];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              nomeFantasia: doc.data().nomeFantasia
            })
          })

          if (lista.length === 0) {
            console.log('NENHUMA EMPRESA ENCONTRADA')
            setCustomers([{ id: '1', nomeFantasia: 'FREELA' }])
            setLoadcustomers(false)
            return
          }

          setCustomers(lista)
          setLoadcustomers(false)

        })
        .catch((error) => {
          console.log('Deu algum erro, ERRO!', error)
          setLoadcustomers(false)
          setCustomers([{ id: '1', nomeFantasia: '' }])
        })
    }

    loadCustmers();

  }, [])


  async function handleRegister(e) {
    e.preventDefault();

    await firebase.firestore().collection('chamados')  
    .add({
      created: new Date(),
      cliente: customers[customerSelected].nomeFantasia,
      clienteId: customers[customerSelected].id,
      assunto: assunto,
      status: status,
      complemento: complemento,
      userId: user.uid
    })
    .then(()=>{
      toast.success('Chamado criado com sucesso')  
      setComplemento('')
      setCustomerSelected(0)
    })
    .catch((err)=>{
      toast.error('Ops erro ao tentar registrar , tente mais tarde')
      console.log(err)
    })
   
  }

  // Chama quando troca assunto
  function handleChangeSelect(e) {
    setAssunto(e.target.value)
    console.log(e.target.value)
  }

  //Chama quando troca o status
  function handleOptionChange(e) {
    setStatus(e.target.value)

  }
  // chama quando troca de cliente
  function hendleChangeCustomers(e) {
    //console.log('INDEX DO CLIENTE SELECIONADO', e.target.value)
    //console.log('Cliente selecionado', customers[e.target.value])
    setCustomerSelected(e.target.value)
  }



  return (
    <div>
      <Header />

      <div className='content'>
        <Title name='Novo Chamado'>
          <FiPlusCircle size={25} />
        </Title>

        <div className='container'>

          <form className='form-profile' onSubmit={handleRegister}>

            <label>Cliente</label>

            <select value={customerSelected} onChange={hendleChangeCustomers}>
              {(loadCustomers) ?
                <option>Carregando ...</option>
                :
                customers.map((item, index) => {
                  return (
                    <option key={item.id} value={index}>
                      {item.nomeFantasia}
                    </option>
                  )
               })}
            </select>


            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value='Suporte'>Suporte</option>
              <option value='Visita técnica'>Visita Técnica</option>
              <option value='Financeiro'>Financeiro</option>
            </select>

            <label>Status</label>
            <div className='status'>
              <input
                id="aberto"
                type='radio'
                name='radio'
                value='Aberto'
                onChange={handleOptionChange}
                checked={status === 'Aberto'}
              />
              <label htmlFor="aberto">Em Aberto</label>

              <input
                id="Progresso"
                type='radio'
                name='radio'
                value='Progresso'
                onChange={handleOptionChange}
                checked={status === 'Progresso'}
              />
              <label htmlFor="Progresso">Progresso</label>

              <input
                id="atendido"
                type='radio'
                name='radio'
                value='Atendido'
                onChange={handleOptionChange}
                checked={status === 'Atendido'}
              />
              <label htmlFor="atendido">Atendido</label>
            </div>

            <label>Complemento</label>
            <textarea
              type='text'
              placeholder='Descreva seu problema (opcional).'
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />

            <button type='submit'>Registrar</button>

          </form>

        </div>


      </div>
    </div>
  )
}