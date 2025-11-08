import React, { useState } from 'react'
import { useToast } from '../../contexts/ToastContext'
import { signup as signupService } from '../../services/auth';
import './Signup.scss'

const Signup: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const { showToast } = useToast()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (password !== passwordCheck) {
      showToast('Passwords do not match!', 'error')
      return;
    }

    const { success, message, error } = await signupService(nickname, email, password)

    if (success) showToast(message || 'Account created successfully!', 'success')
    else showToast(error || 'Error creating the account', 'error')
  }

  return (
    <main>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nickname">Nickname</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            placeholder="ThreeSheetsNeate"
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
            placeholder="joe.neate@rare.sot"
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
            placeholder='"ShroudedGhostIsReal1985"'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
            <label htmlFor="password">Confirm password</label>
            {/* {password && !/^(?=.*[A-Z])(?=.*\d).{6,}$/.test(password) && (
            <p className="error-message"><br/>Your password must be six characters long or more, and include a capitalized character and a number.</p>
            )} */}
          <input
            type="password"
            id="password-check"
            value={passwordCheck}
            placeholder='"ShroudedGhostIsReal1985"'
            onChange={(e) => setPasswordCheck(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </main>
  )
}

export default Signup;