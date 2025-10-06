import React from "react";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Addltems from "./components/Addltems";
import List from "./components/List";
import Order from "./components/Order";
import Navbar from './components/Navbar';
const App = () => {
  return (
    <>
    
       <Navbar/>
      <Routes>
        <Route path="/" element={<Addltems />} />
        <Route path="/list" element={<List />} />
        <Route path="/orders" element={<Order />} />
      </Routes>
     
    </>
  );
};

export default App;
