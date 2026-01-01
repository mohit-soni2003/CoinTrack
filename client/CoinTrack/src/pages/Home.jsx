import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Lottie from 'lottie-react'
import coinsAnimation from '../assets/Coins.json'

export default function Home() {
  return (
    <div className="page page-center">
      <h2 className='pb-2 mt-0'>Welcome to CoinTrack</h2>
      <p>Simple mobile-first expense tracker.</p>
      <div className="lottie-container" style={{ width: '200px', height: '200px', margin: '0 auto 20px' }}>
        <Lottie animationData={coinsAnimation} loop={true} />
      </div>
      <div className="spaced" style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button as={Link} to="/dashboard" variant="primary" size="sm">Open Dashboard</Button>
        <Button as={Link} to="/expenses" variant="outline-secondary" size="sm">My Expenses</Button>
      </div>
    </div>
  )
}