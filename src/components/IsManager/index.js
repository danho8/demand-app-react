import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function IsManager() {
    const [role] = useState(JSON.parse(localStorage.getItem('role')));
    const location = useLocation();


    return (
        (role !== 0 ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />)
    )
}

export default IsManager;