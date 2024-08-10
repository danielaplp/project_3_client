import { useContext} from 'react';
import { AuthContext } from '../contexts/auth.context';
import { Navigate } from 'react-router-dom';

function Anon({children}) {

    const {loading, user} = useContext(AuthContext)

    if (loading) return <p>Loading..</p>;

    if(user) {
        return <Navigate to="/" />;
    } else {
        return children;
    }

}

export default Anon