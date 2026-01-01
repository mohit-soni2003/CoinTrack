import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const auth = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await auth.login(email, password)
      nav('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <h3>Login</h3>
      <Form onSubmit={submit}>
        <Form.Group className="mb-2">
          <Form.Control value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required />
        </Form.Group>
        {error && <div className="text-danger mb-2">{error}</div>}
        <Button type="submit" variant="primary" className="w-100">Sign in</Button>
      </Form>
      <div className="d-flex flex-column gap-2 mt-2 small">
        <div className="muted">No account? <Link to="/register">Register</Link></div>
        <div className="muted">Need to create a family? <Link to="/admin-signup">Admin Signup</Link></div>
      </div>
    </div>
  )
}