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
      getAllParkings() {
        return axios.get(`${this.baseURL}/api/parking`,{
            headers: {
            Authorization: `Bearer, ${this.authToken}`,
            },
        });
      }
      getAllRepairStores() {
        return axios.get(`${this.baseURL}/api/repairstore`,{
            headers: {
            Authorization: `Bearer, ${this.authToken}`,
            },
        });
      }
     
    }


export default CycleAPIService;