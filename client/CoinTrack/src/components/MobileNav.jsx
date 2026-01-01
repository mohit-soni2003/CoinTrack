import { Nav } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiList, FiPlusCircle, FiUsers } from 'react-icons/fi'
// import './MobileNav.css'

export default function MobileNav() {
  const { pathname } = useLocation()

  return (
    <Nav className="mobile-nav" activeKey={pathname}>
      <Nav.Item>
        <Nav.Link as={Link} to="/" eventKey="/">
          <FiHome size={22} />
          <div className="nav-label">Home</div>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/expenses" eventKey="/expenses">
          <FiList size={22} />
          <div className="nav-label">Expenses</div>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/add" eventKey="/add" className="center-action">
          <FiPlusCircle size={36} />
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/family" eventKey="/family">
          <FiUsers size={22} />
          <div className="nav-label">Family</div>
        </Nav.Link>
      </Nav.Item>
    </Nav>
  )
}