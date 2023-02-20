
import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../contexts/auth';

export default function RouteWrapper({
  component: Component,
  isPrivate,
  ...rest
}){

  const { user, signed, loading } = useContext(AuthContext);

  if(loading ){
    return(
      <div></div>
    )
  }

  if(signed && !isPrivate){
    return <Redirect to="/dashboard" />
  }else if(!signed && isPrivate){
    return <Redirect to="/sistema" />
  }

  return(
    <Route
      {...rest}
      render={ props => (
        <Component {...props} />
      )}
    />
  )
}