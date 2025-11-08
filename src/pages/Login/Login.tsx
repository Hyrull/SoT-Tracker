import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useToast } from '../../contexts/ToastContext'
import './Login.scss'

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('https://backend.sot-tracker.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token)
        navigate('/commendations')
        window.location.reload()
      } else {
        showToast(data.message || 'Invalid email or password', 'error');
      }
    } catch (error) {
      console.error('There was an error logging in!', error)
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
    <span onClick={() => navigate('/signup')} className="signup-link">
      sign up here
    </span>.
  </p>
  </main>
)
}

export default Login