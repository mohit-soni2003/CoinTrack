import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function AdminSignup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [familyCode, setFamilyCode] = useState('')
  const [familyName, setFamilyName] = useState('')
  const [error, setError] = useState(null)
  const auth = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await auth.registerAdmin({ name, email, password, familyName, familyCode })
      nav('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <h3>Create Family & Admin</h3>
      <p className="text-muted">Create a new family and your admin account. Optionally provide a Family Code.</p>
      <Form onSubmit={submit}>
        <Form.Group className="mb-2"><Form.Control value={name} onChange={e=>setName(e.target.value)} placeholder="Admin Name" required /></Form.Group>
        <Form.Group className="mb-2"><Form.Control value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email" required /></Form.Group>
        <Form.Group className="mb-2"><Form.Control value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" required /></Form.Group>
        <Form.Group className="mb-2"><Form.Control value={familyName} onChange={e=>setFamilyName(e.target.value)} placeholder="Family Name (required)" required /></Form.Group>
        <Form.Group className="mb-3"><Form.Control value={familyCode} onChange={e=>setFamilyCode(e.target.value)} placeholder="Desired Family Code (optional)" /></Form.Group>
        {error && <div className="text-danger mb-2">{error}</div>}
        <Button type="submit" variant="primary" className="w-100">Create Family & Signup</Button>
      </Form>
    </div>
  )
}
