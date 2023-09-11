import React from 'react';
import Signup from './Signup';
import { AuthProvider } from "../contexts/AuthContext"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Dashboard from './Dashboard';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import ForgotPassword from './ForgotPassword';
import UpdateProfile from './UpdateProfile';
import UserInformation from './userInformation';

function App() {

  return (


      <div className="w-100">
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>}></Route>
              <Route path="/user-information" element={<PrivateRoute><UserInformation /></PrivateRoute>}></Route>
              <Route path="/update-profile" element={<PrivateRoute><UpdateProfile /></PrivateRoute>}></Route>
              <Route path='/signup' element={<Signup/>} />
              <Route path='/login' element={<Login/>} />
              <Route path='/forgot-password' element={<ForgotPassword/>} />
            </Routes>
          </AuthProvider>
        </Router>
      </div>


);

}

export default App;
