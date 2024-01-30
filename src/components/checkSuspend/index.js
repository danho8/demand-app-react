import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function CheckSuspend() {
    const [status,setStatus] = useState(localStorage.getItem("status"))
    const location = useLocation();
        

    return(
        status === "0" ?  <Navigate to="/" state={{ from: location }} replace/> : <Outlet/>
    )
}

export default CheckSuspend;