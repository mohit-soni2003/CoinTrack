import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ToggleButton from 'react-bootstrap/ToggleButton'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const [mode, setMode] = useState('member') // 'member' or 'admin'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [familyCode, setFamilyCode] = useState('')
  const [familyName, setFamilyName] = useState('')
  const [startingBalance, setStartingBalance] = useState('')
  const [error, setError] = useState(null)
  const auth = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!auth) {
      setError('Authentication context not available')
      return
    }
    try {
      if (mode === 'member') {
        // member signup requires familyCode
        await auth.register({ name, email, password, familyCode })
      } else {
        // admin signup requires familyName
        await auth.registerAdmin({ name, email, password, familyName, familyCode, startingBalance: startingBalance ? Number(startingBalance) : 0 })
      }
      nav('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <h3 className="mb-3">Create account</h3>

      <ToggleButtonGroup type="radio" name="modes" defaultValue={mode} className="mb-3">
        <ToggleButton id="tbtn-member" variant={mode==='member'? 'primary':'outline-primary'} value={'member'} onClick={() => setMode('member')}>Register (Member)</ToggleButton>
        <ToggleButton id="tbtn-admin" variant={mode==='admin'? 'primary':'outline-primary'} value={'admin'} onClick={() => setMode('admin')}>Create Family (Admin)</ToggleButton>
      </ToggleButtonGroup>

      <Form onSubmit={submit}>
        <Form.Group className="mb-2"><Form.Control value={name} onChange={e=>setName(e.target.value)} placeholder="Name" required /></Form.Group>
        <Form.Group className="mb-2"><Form.Control value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email" required /></Form.Group>
        <Form.Group className="mb-2"><Form.Control value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" required /></Form.Group>

        {mode === 'member' ? (
          <Form.Group className="mb-3"><Form.Control value={familyCode} onChange={e=>setFamilyCode(e.target.value)} placeholder="Family Code (required)" required /></Form.Group>
        ) : (
          <>
            <Form.Group className="mb-2"><Form.Control value={familyName} onChange={e=>setFamilyName(e.target.value)} placeholder="Family Name (required)" required /></Form.Group>
            <Form.Group className="mb-2"><Form.Control value={familyCode} onChange={e=>setFamilyCode(e.target.value)} placeholder="Desired Family Code (optional)" /></Form.Group>
            <Form.Group className="mb-3"><Form.Control value={startingBalance} onChange={e=>setStartingBalance(e.target.value)} type="number" placeholder="Starting Balance (optional)" min="0" step="0.01" /></Form.Group>
          </>
        )}

        {error && <div className="text-danger mb-2">{error}</div>}
        <Button type="submit" variant="primary" className="w-100 mb-2">{mode==='member' ? 'Register' : 'Create Family & Signup'}</Button>
      </Form>
    </div>
  )
}