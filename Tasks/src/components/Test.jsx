import React, { useContext } from 'react'
import UserContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Test = () => {
    const navigate=useNavigate()
    const { user,setUser } = useContext(UserContext);
    console.log(user)
  const handleLogin = () => {
    setUser({ name: 'Yash', email: 'yash@example.com' });
    navigate("/profile")
  };

  return (
    <button onClick={handleLogin}>Login</button>
  );
  
}

export default Test
