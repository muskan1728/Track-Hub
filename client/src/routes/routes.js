import Dashboard from '../Components/Dashboard';
import Tagmanager from '../Components/Tagmanager';
import  Login from "../Components/Login/Login";
import { BrowserRouter, Route, Routes } from 'react-router-dom';


const RouteConfig = () => (
  <BrowserRouter>
  <Routes>
    <Route path='/dashboard' element={<Dashboard />} />
    <Route path='/tag' element={<Tagmanager />} />
    <Route path='/' element={<Login />} />

  </Routes>

</BrowserRouter>
);

export default RouteConfig;
