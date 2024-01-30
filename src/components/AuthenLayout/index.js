import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"

const AuthenLayout = () => {
    return (
        <main>
            <Outlet />
        </main>
    )
}

export default AuthenLayout