import { useState, useEffect, createContext } from "react";
import axios from "axios";

//create context
const AuthContext = createContext()

//Create wrapper function
function AuthProviderWrapper(props){
const [loading, setLoading] = useState(true);
const [user, setUser] = useState(null);
//const [loggedIn, setLoggerdIn] = useState(false);


//function to store the token
const storeToken = (token) => {
    localStorage.setItem('authToken', token)
};



const authenticateUser = async () => {
    // Check if there's a token on localstorage
    //we either get the token or null
    const  storedToken = localStorage.getItem('authToken')
    //if there's a token we call /verify on the API
    if(storedToken){
      try {
        setLoading(true);
        //on the get request the second argument is the configuration/options object, NOT the req.body
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/verify`, {
            headers : {
                Authorization: `Bearer ${storedToken}`, 
            }, 
        });

        setUser(response.data);
        /*
        _id_ '2324',
        username,
        email,
        profilePic
         */
        setLoading(false)

      } catch (error) {
        setUser(null);
        setLoading(false);
      }

    } else {
        setUser(null);
        setLoading(false);
    }
    //return user information OR an error
};

const logout = () => {
    localStorage.removeItem('authToken');
    authenticateUser();
}

useEffect(() => {
    authenticateUser();
}, []);

return(
    <AuthContext.Provider value={{loading, user, storeToken, authenticateUser, logout}}>
        {props.children}
    </AuthContext.Provider>
)

}

export { AuthContext, AuthProviderWrapper }
