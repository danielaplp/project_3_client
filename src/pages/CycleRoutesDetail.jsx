import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import CycleAPIService from "../services/cycle.api";
import { AuthContext } from "../contexts/auth.context";


const cycleService = new CycleAPIService();

const CycleRoutesDetail = () => {
  const [cycleRoute, setCycleRoute] = useState(null); 
  const { cycleRouteId } = useParams();
  const {user} = useContext(AuthContext)
  const navigate = useNavigate();

  console.log(cycleRouteId);

  const getSingleCycleRoute = async _id => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/cycleroutes/${_id}`,
      );
      setCycleRoute(response.data);
    } catch (error) {
      console.log("error fetching the cycleRoute", error);
    }
  };
  const deleteHandler = async (_id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/cycleroutes/${_id}`);
      console.log(`Cycle Route with ID ${_id} deleted`);
    } catch (error) {
      console.log('Error of deleting cycleroute:', error);
    }
    navigate('/cycleroutes');
  };
  
  const EditHandler = async (_id) => {
    navigate(`/cycleroutes/edit/${_id}`);
  
  };

  useEffect(() => {
    getSingleCycleRoute(cycleRouteId);
  }, [cycleRouteId]);

  

  return (
    <div>
      <h1>Cycle Routes Details</h1>
      {!cycleRoute && <h3>No cycle route found</h3>}
      {cycleRoute && (
        <div>
          <h2>{cycleRoute.type}</h2>
        </div>
      )}

      {cycleRoute && (
        <div key={cycleRoute._id}>
          <p>{cycleRoute.startLocation?.lat || "No Lat"}</p>
          <p>{cycleRoute.startLocation?.lng || "No Lng"}</p>
          <p>{cycleRoute.endLocation?.lat || "No Lat"}</p>
          <p>{cycleRoute.endLocation?.lng || "No Lng"}</p>
          {
                          user._id === cycleRoute.creator && (<>
                          <button onClick={() => deleteHandler(cycleRoute._id)}>Delete</button>
                  
                          <button onClick={() => EditHandler(cycleRoute._id)}>Edit</button>
                          </>)
                        }
          
        </div>
      )}

      <Link to="/cycleroutes">Back to Cycle Routes</Link>
    </div>
  );
};

export default CycleRoutesDetail;
