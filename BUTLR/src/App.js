import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { Login } from "./login";
import { Register } from "./register";
import AuthDetails  from "./authDetails";


function App() {
  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm =  (formName) => {
    setCurrentForm(formName);

  }

  return (
    <div className="App">
      {
        currentForm === "login" ? <Login onFormSwitch={toggleForm} /> : <Register onFormSwitch={toggleForm}/>
      }
      < AuthDetails />
    </div>
  );
}

export default App;
