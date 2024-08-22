        
     import { Link } from "react-router-dom";
     import { useContext } from "react";
     import { AuthContext } from "../contexts/auth.context";
     
     function Navbar() {
       const { user, loading, logout } = useContext(AuthContext);
     
       return (
         <nav>
          <p>{user ? user.username: "Hello"}</p>
         
           <ul>
             <Link to="/">
               <button>Home</button>
             </Link>
             
     
  

{!loading && user && (
    <>
          <Link to="/cycleroutes">
            <button>Cycle Routes</button>
          </Link>
          <Link to="/cycleroutes/new">
            <button>Add a Cycle Route</button>
          </Link>
        
          <Link to="/parking">
            <button>Parkings</button>
          </Link>
          <Link to="/parking/new">
            <button>Add a Parking</button>
          </Link>
          <button onClick={logout}>Logout</button>
          </>
        )}
        {!loading && !user && (
          <>
            <Link to="/signup">
              <button>Signup</button>
            </Link>
            <Link to="/login">
              <button>Login</button>
            </Link>
          </>
        )}



           </ul>
         </nav>
       );
     }
     
     export default Navbar;