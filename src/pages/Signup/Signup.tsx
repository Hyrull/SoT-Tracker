import React, { useState } from 'react'
import './Signup.scss'

const Signup: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiResponse, setApiResponse] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('https://backend.sot-tracker.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nickname,
          email,
          password,
        }),
      })
      const data = await response.json();
      setApiResponse(data.message || 'Error creating the account! Email might already be in use.');
    } catch (error) {
      console.error('There was an error signing up!', error)
    }
  }

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nickname">Nickname</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
            <label htmlFor="password">Password</label>
            {/* {password && !/^(?=.*[A-Z])(?=.*\d).{6,}$/.test(password) && (
            <p className="error-message"><br/>Your password must be six characters long or more, and include a capitalized character and a number.</p>
            )} */}
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {apiResponse && <p className="api-response">{apiResponse}</p>}
    </div>
  )
}

export default Signup;