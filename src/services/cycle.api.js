import axios from "axios";

class CycleAPIService {
      constructor() {
        this.baseURL = import.meta.env.VITE_API_URL
        this.authToken = localStorage.getItem("authToken")
      }

      getAllCycleRoutes() {
        return axios.get(`${this.baseURL}/api/cycleroutes`,{
            headers: {
            Authorization: `Bearer, ${this.authToken}`,
            },
        });
      }
    }


export default CycleAPIService;