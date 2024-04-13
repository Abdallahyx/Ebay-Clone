import './App.css';
import { Routes,Route,BrowserRouter } from 'react-router-dom';
import Login from './Login/Login'
import RegisterPage from './Pages/RegisterPage';
import HomePage from './Pages/HomePage';
function App() {
  return(
    <BrowserRouter>
    <Routes>
      <Route index element={<Login/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<RegisterPage/>}/>
      <Route path="/home" element={<HomePage/>}/>
   
    </Routes>
    </BrowserRouter>

  )

}

export default App;
