import React from 'react'
import GoogleLoginButton from "../customPages/GoogleLoginButton"

function Login() {
    return (
        <div>
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <div className="card shadow p-4" style={{width: 350}}>
                    <h3 className="text-center mb-4">Google Login</h3>
                    <GoogleLoginButton />
                </div>
            </div>   
        </div>
      )
}

export default Login
