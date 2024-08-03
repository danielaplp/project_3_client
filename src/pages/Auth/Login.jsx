import { useState, useContext } from "react";
import axios, { formToJSON } from "axios"; 
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/auth.context";


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const { storeToken, authenticateUser } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleEmail = (event) => setEmail(event.target.value)
    const handlePassword = (event) => setPassword(event.target.value);

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
         const response =  await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {email, password});

         storeToken(response.data.authToken);

         authenticateUser();
         
         navigate("/");

        } catch (error) {
            

            setErrorMessage(error.response.data.message);
        }
    };

  return (
    <div className="LoginPage">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>

        <label htmlFor="email">Email</label>
            <input type="email" name='email' id='email' value={email} onChange={handleEmail}/>
            <label htmlFor="password">Password</label>
            <input type="password" name='password' id='password' value={password} onChange={handlePassword}/>
    
           <button type="submit">Login</button>

        </form>

        {errorMessage && <p>{errorMessage}</p>}

    <p>Don't have an account?</p>
    <Link to="/signup">Signup</Link>

    </div>
  )
}

export default Login