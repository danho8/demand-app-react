import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function IsAdmin() {
    const [role] = useState(JSON.parse(localStorage.getItem('role')));
    const location = useLocation();


    return (
        (role === 2 ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />)
    )
}

export default IsAdmin;