import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import axios from 'axios';

const CycleRouteDetail = () => {
    const [cycleRoutes, setCycleRoutes] = useState(null) 
    const { cycleRoutetId } = useParams();
    console.log(cycleRoutetId);

    const getSingleCycleRoute = async (_id) => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cycleroutes/${_id}`);
                setCycleRoutes(response.data); 
            } catch (error) {
                console.log('error fetching the cycleroute', error)
            }
    };

  
    useEffect(() => {
        getSingleCycleRoute (cycleRoutetId);
    }, [cycleRoutetId])



    return (
        <div>
            <h1>Cycle Routes Details</h1>
            {!cycleRoutes && <h3>No Cycle Route found</h3>}
            {cycleRoutes && (
                <div>
                    <h2>{cycleRoutes.type}</h2>
                    <p>{cycleRoutes.startLocation?.lat}</p>
                    
                </div>
            )}

            {cycleRoutes && cycleRoutes.map(task => {
                return (
                    <div key={cycleRoutes.id}>
                        <h3>{cycleRoutes.startLocation?.lat}</h3>
                        
                       
                    </div>
                );
            })}

          <Link to='/cycleroutes'>Back to cycle Routes</Link>

        </div>
    );
};

export default CycleRouteDetail;