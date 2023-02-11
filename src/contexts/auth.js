import { useState, createContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import firebase from '../services/firebaseConnection';


export const AuthContext = createContext({});

function AuthProvider({ children }){
   const [user, setUser] = useState(null);//quando user  null signed é falso e quando falso só pode entrar na rota de login e de cadastro
   const [loadingAuth, setLoadingAuth] = useState(false);
   const [loading, setLoading] = useState(true);
  
   useEffect(()=>{

    function loadStorage(){
      const  storageUser = localStorage.getItem('SistemaUser');

      if(storageUser){
          setUser(JSON.parse(storageUser));
          setLoading(false);
      }

      setLoading(false);

    } 

    loadStorage();

  }, [])



  //Fazendo login do usuário
  async function singIn(email, password){
    setLoadingAuth(true);

    await firebase.auth().signInWithEmailAndPassword(email, password)
    .then(async (value) => {
      let uid = value.user.uid;

      const userProfile = await firebase.firestore().collection('users')
      .doc(uid).get();

      let data = {
        uid: uid,
        nome: userProfile.data().nome,
        avatarUrl: userProfile.data().avatarUrl,
        email: value.user.email
      };


      setUser(data);
      storageUser(data);
      setLoadingAuth(false);
      toast.success('Bem vindo de volta!')



    })
    .catch((error) => {
      console.log(error)
      toast.error('Ops, algo deu errado!!')
      setLoading(false)
    })


  }

  async function signUp(email, password, nome){ // função para cadastrar usuário
    setLoadingAuth(true);  
    await firebase.auth().createUserWithEmailAndPassword(email, password)
    .then( async (value)=>{
      let uid = value.user.uid;
      await firebase.firestore().collection('users') // cadastrou no banco 
      .doc(uid).set({
        nome: nome,
        avatarUrl: null,
      })
      .then((response) => {
        
        let data = { // disponibiliza pro setUser
          uid: uid,
          nome: nome,
          email: value.user.email,
          avatarUrl: null
        };

        setUser(data);
        storageUser(data);
        setLoadingAuth(false);
        toast.success('Bem vindo a plataforma')

      })
    
    })
    .catch((error) => {
       console.log(error);
       toast.error('Ops algo deu errado')
       setLoadingAuth(false);
    })

  }



  function storageUser(data){
    localStorage.setItem('SistemaUser', JSON.stringify(data));
  }
  
  // lOGOUT DO USUÁRIO
  async function signOut(){
    await firebase.auth().signOut();
    localStorage.removeItem('SistemaUser')
    setUser(null)
  }




  return(
    <AuthContext.Provider 
    value={{
       signed: !!user, 
       user, 
       loading, 
       signUp,
       signOut,
       singIn,
       loadingAuth,
       setUser,
       storageUser
    }}
    > 
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;