import React, { useState, useEffect } from 'react'
import RouteConfig from './routes/routes';
import { UseSelector,useDispatch } from "react-redux";
import { Provider } from 'react-redux';
import store from './redux/store';
import "./App.css"
function App() {
  const [data, setData] = useState()
  return (
    <>
     <Provider store={store}>
      <RouteConfig/>
    </Provider>
    </>
   )
}

export default App