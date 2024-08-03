import {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


function SignUp() {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [errorMessage, setErrorMessage] = useState(null);
const [loading, setLoading] = useState(false);


const navigate = useNavigate();

const handleName = (event) => setName(event.target.value);
const handleEmail = (event) => setEmail(event.target.value);
const handlePassword = (event) => setPassword(event.target.value);

const handleSubmit = async (event) => {
    event.preventDefault()

};

  return (
    <div className='SignupPage'>
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Name</label>
            <input type="text" name='name' id='name' value={name} onChange={handleName}/>

            <label htmlFor="email">Email</label>
            <input type="email" name='email' id='email' value={email} onChange={handleEmail}/>

            <label htmlFor="password">Password</label>
            <input type="password" name='password' id='password' value={password} onChange={handlePassword}/>


            <button type='submit' disabled={loading}>Sign up</button>

        </form>

        {errorMessage && <p className='error-message'>{errorMessage}</p>}

        <p>Already have an account?</p>
        <Link to="/login">Login</Link>

    </div>
  )
}

export default SignUp