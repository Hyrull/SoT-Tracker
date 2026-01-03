import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useToast } from '../../contexts/ToastContext'
import { login as loginService } from '../../services/auth';
import './Login.scss'

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const { success, token, error } = await loginService(email, password)

    if (success && token) {
      localStorage.setItem('token', token)
      navigate('/commendations')
      window.location.reload()
    } else {
      showToast(error || 'Invalid email or password', 'error')
    }
  }

return (
  <main>
    <h2>Log in</h2>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          placeholder="joe.neate@rare.sot"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
          <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          placeholder='"ShroudedGhostIsReal1985"'
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Log in</button>
    </form>
  <p className='signup-here'>
    Don't have an account? You can{' '}
    <Link to="/signup" className="signup-link">sign up here</Link>
  </p>
  </main>
)
}

export default Login