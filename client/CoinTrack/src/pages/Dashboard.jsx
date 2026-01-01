import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'

export default function Dashboard() {
  return (
    <div className="page">
      <h3>Dashboard</h3>
      <p>Monthly summary</p>
      <div className="card summary">
        <div><strong>Spent</strong><div>$1,234</div></div>
        <div><strong>Budget</strong><div>$2,500</div></div>
      </div>
      <div className="spaced">
        <Button as={Link} to="/expenses" variant="outline-primary">View expenses</Button>
        <Button as={Link} to="/add" variant="primary">Add expense</Button>
      </div>
    </div>
  )
}