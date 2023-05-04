import Login from "./components/Login";
import Register from "./components/Register"; 
import Home from  "./components/Home";
import { Routes,Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
function App() {

  const {currentUser} = useContext(AuthContext)

  // to redirect th user if he is not logged in
  const ProtectedRoute = ({children})=>{
    if(!currentUser)
      return <Navigate to="/login"/>

    return children
  }

  return (
    <Routes>
      <Route path="/" index element={<ProtectedRoute> <Home/> </ProtectedRoute>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
    </Routes>
  );
}

export default App;
