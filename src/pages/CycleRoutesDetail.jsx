import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import axios from 'axios';
import CycleAPIService from '../services/cycle.api';

const cycleService = new CycleAPIService();

const CycleRoutesDetail = () => {
    const [cycleRoute, setCycleRoute] = useState(null) //usa um null value quando ele ainda n existe (false value)
    const { cycleRouteId } = useParams();
    console.log(cycleRouteId);

    const getSingleCycleRoute = async (_id) => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cycleroutes/${_id}`);
                setProject(response.data); //in axios we always put .data
            } catch (error) {
                console.log('error fetching the cycleRoute', error)
            }
    };

    useEffect(() => {
         getSingleCycleRoute(projectId);
    }, [cycleRouteId])

    //find returns the first element matching the condition
    //returns null if no element is found
    //const foundProject = projects.find(project => project._id === projectId)

    return (
        <div>
            <h1>Cycle Routes Details</h1>
            {!cycleRoute && <h3>No cycle route found</h3>}
            {cycleRoute && (
                <div>

                        <h2>{cycleRoute.type}</h2>
                        
                </div>
            )}

            {cycleRoute && cycleRoute.map(task => {
                return (
                    <div key={cycleRoute._id}>
                        <p>{cycleRoute.startLocation?.lat || 'No Lat'}</p>
                        <p>{cycleRoute.startLocation?.lng || 'No Lng'}</p>
                        <p>{cycleRoute.endLocation?.lat || 'No Lat'}</p>
                        <p>{cycleRoute.endLocation?.lng || 'No Lng'}</p>
                    </div>
                );
            })}

          <Link to='/projects'>Back to Cycle Routes</Link>

        </div>
    );
};

export default CycleRoutesDetail;