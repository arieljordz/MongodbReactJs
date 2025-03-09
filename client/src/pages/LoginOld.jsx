import React from 'react'

function LoginOld() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card shadow p-4" style={{width: 350}}>
            <h3 className="text-center mb-4">LoginPage</h3>
            <form>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" placeholder="Enter email" required />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" placeholder="Enter password" required />
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="rememberMe" />
                <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
            </div>
            <button type="submit" className="btn btn-primary w-100">LoginPage</button>
            </form>
            <div className="text-center mt-3">
            <a href="#">Forgot password?</a>
            </div>
        </div>
    </div>
  )
}

export default LoginOld
