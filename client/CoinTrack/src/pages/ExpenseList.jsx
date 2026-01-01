import { useState, useEffect } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  MdShoppingCart, 
  MdDirectionsCar, 
  MdApartment, 
  MdShoppingBag, 
  MdLocalHospital, 
  MdSchool, 
  MdLocalMovies,
  MdAttachMoney 
} from 'react-icons/md'

const CATEGORIES = [
  "Groceries", "Vegetables", "Milk", "Fruits", "Bakery", "DiningOut", "Snacks",
  "Fuel", "PublicTransport", "Cab", "VehicleMaintenance", "Parking", "Toll",
  "Rent", "Electricity", "Water", "Gas", "Internet", "MobileRecharge", "Maintenance", "HouseHelp",
  "Clothing", "Footwear", "Electronics", "Furniture", "OnlineShopping",
  "Doctor", "Medicine", "Hospital", "HealthInsurance",
  "SchoolFees", "CollegeFees", "Books", "Coaching", "OnlineCourses",
  "Entertainment", "Movies", "Subscriptions", "Gym", "Salon", "PersonalCare",
  "EMI", "LoanRepayment", "Insurance", "Tax",
  "Gifts", "Donations", "Functions", "Festivals",
  "Miscellaneous"
]

const getCategoryIcon = (category) => {
  const iconProps = { size: 20, className: 'me-2' }
  switch(category) {
    case 'Groceries':
    case 'Vegetables':
    case 'Milk':
    case 'Fruits':
    case 'Bakery':
    case 'DiningOut':
    case 'Snacks':
      return <MdShoppingCart {...iconProps} />
    case 'Fuel':
    case 'PublicTransport':
    case 'Cab':
    case 'VehicleMaintenance':
    case 'Parking':
    case 'Toll':
      return <MdDirectionsCar {...iconProps} />
    case 'Rent':
    case 'Electricity':
    case 'Water':
    case 'Gas':
    case 'Internet':
    case 'MobileRecharge':
    case 'Maintenance':
    case 'HouseHelp':
      return <MdApartment {...iconProps} />
    case 'Clothing':
    case 'Footwear':
    case 'Electronics':
    case 'Furniture':
    case 'OnlineShopping':
      return <MdShoppingBag {...iconProps} />
    case 'Doctor':
    case 'Medicine':
    case 'Hospital':
    case 'HealthInsurance':
      return <MdLocalHospital {...iconProps} />
    case 'SchoolFees':
    case 'CollegeFees':
    case 'Books':
    case 'Coaching':
    case 'OnlineCourses':
      return <MdSchool {...iconProps} />
    case 'Entertainment':
    case 'Movies':
    case 'Subscriptions':
    case 'Gym':
    case 'Salon':
    case 'PersonalCare':
      return <MdLocalMovies {...iconProps} />
    default:
      return <MdAttachMoney {...iconProps} />
  }
}

export default function ExpenseList() {
  const { token } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('')
  const [limit, setLimit] = useState(50)
  const [skip, setSkip] = useState(0)
  const [total, setTotal] = useState(0)

  const fetchExpenses = async () => {
    setLoading(true)
    setError(null)

    try {
      if (!token) {
        throw new Error('Authentication token not found. Please login first.')
      }

      const params = new URLSearchParams({
        limit: limit,
        skip: skip
      })

      if (filter && filter.trim() !== '') {
        params.append('category', filter)
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE || 'http://localhost:8080'}/api/expense?${params}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Error: ${response.status}`)
      }

      const data = await response.json()
      setExpenses(data.data || [])
      setTotal(data.pagination?.total || 0)
    } catch (err) {
      console.error('Fetch Expenses Error:', err)
      setError(err.message || 'Failed to fetch expenses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [token, filter, limit, skip])

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const handlePrevious = () => {
    if (skip > 0) {
      setSkip(Math.max(0, skip - limit))
    }
  }

  const handleNext = () => {
    if (skip + limit < total) {
      setSkip(skip + limit)
    }
  }

  const currentPage = Math.floor(skip / limit) + 1
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="page">
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {/* Header */}
      <div className="expense-list-header mb-4">
        <h3 className="mb-3">Expense Tracker</h3>
        
        {/* Filter by Category */}
        <Form.Group className="mb-3">
          <Form.Label className="small fw-bold">Filter by Category</Form.Label>
          <Form.Select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value)
              setSkip(0)
            }}
            className="form-select-sm"
          >
            <option value="">📊 All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : expenses.length === 0 ? (
        <Alert variant="info" className="text-center">
          <div className="mb-2">No expenses found</div>
          <Link to="/add" className="btn btn-sm btn-primary">Add your first expense</Link>
        </Alert>
      ) : (
        <>
          {/* Expense Cards */}
          <div className="expense-cards">
            {expenses.map(e => (
              <div key={e._id} className="expense-item">
                <div className="expense-left">
                  <div className="expense-icon-wrapper">
                    {getCategoryIcon(e.category)}
                  </div>
                  <div className="expense-details">
                    <h6 className="expense-title">{e.title}</h6>
                    <small className="expense-meta">
                      {e.category} • {formatDate(e.date)}
                    </small>
                  </div>
                </div>
                <div className="expense-right">
                  <div className="expense-amount">${Number(e.amount).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination-section mt-4 pt-3">
            <small className="text-muted d-block mb-2 text-center">
              Showing {skip + 1} - {Math.min(skip + limit, total)} of {total}
            </small>
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handlePrevious}
                disabled={skip === 0}
                className="px-3"
              >
                ← Prev
              </Button>
              <span className="text-muted align-self-center small">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleNext}
                disabled={skip + limit >= total}
                className="px-3"
              >
                Next →
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}