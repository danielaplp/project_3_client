import React from 'react'
import { useState } from "react";
import axios from 'axios';
import { useNavigate} from "react-router-dom";


function AddParking() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const navigate = useNavigate()


  return (
    <div>AddParking</div>
  )
}

export default AddParking