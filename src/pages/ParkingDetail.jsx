import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import CycleAPIService from "../services/cycle.api";
import { AuthContext } from "../contexts/auth.context";

const cycleService = new CycleAPIService();

const ParkingDetail = () => {
  const [parking, setParking] = useState(null); //usa um null value quando ele ainda n existe (false value)
  const { parkingId } = useParams();
  const {user} = useContext(AuthContext)
  const navigate = useNavigate();

  console.log(parkingId);

  const getSingleParking = async _id => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/parking/${_id}`,
      );
      setParking(response.data); 
    } catch (error) {
      console.log("error fetching the parking", error);
    }
  };
  const deleteHandler = async (_id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/parking/${_id}`);
      console.log(`Parking with ID ${_id} deleted`);
    } catch (error) {
      console.log('Error of deleting parking:', error);
    }
    navigate('/parking');
  };
  
  const EditHandler = async (_id) => {
    navigate(`/parking/edit/${_id}`);
  
  };

  useEffect(() => {
    getSingleParking(parkingId);
  }, [parkingId]);

  

  return (
    <div>
      <h1>Parking Details</h1>
      {!parking && <h3>No Parking found</h3>}
      {parking && (
        <div>
          <h2>{parking.type}</h2>
        </div>
      )}

      {parking && (
        <div key={parking._id}>
          <p>{parking.startLocation?.lat || "No Lat"}</p>
          <p>{parking.startLocation?.lng || "No Lng"}</p>
          <p>{parking.endLocation?.lat || "No Lat"}</p>
          <p>{parking.endLocation?.lng || "No Lng"}</p>
          <p>{parking.quantity}</p>
          <p>{parking.parkingPic}</p>
          {
                          user._id === parking.creator && (<>
                          <button onClick={() => deleteHandler(parking._id)}>Delete</button>
                  
                          <button onClick={() => EditHandler(parking._id)}>Edit</button>
                          </>)
                        }
          
        </div>
      )}

      <Link to="/parking">Back to Parking</Link>
    </div>
  );
};

export default ParkingDetail;
