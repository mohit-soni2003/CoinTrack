import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import { useAuth } from '../contexts/AuthContext'
import { AiOutlinePlusCircle } from 'react-icons/ai'

const VALID_CATEGORIES = [
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

export default function AddExpense() {
  const { token } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Miscellaneous',
    date: new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Title is required')
      }
      if (!formData.amount || Number(formData.amount) <= 0) {
        throw new Error('Amount must be a positive number')
      }
      if (!formData.category.trim()) {
        throw new Error('Category is required')
      }

      // Check if token exists
      if (!token) {
        throw new Error('Authentication token not found. Please login first.')
      }

      // Call API
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE || 'http://localhost:8080'}/api/expense`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: formData.title.trim(),
            amount: Number(formData.amount),
            category: formData.category,
            date: formData.date
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Error: ${response.status}`)
      }

      const data = await response.json()
      
      // Reset form and show success
      setFormData({
        title: '',
        amount: '',
        category: 'Miscellaneous',
        date: new Date().toISOString().split('T')[0]
      })
      setSuccess(true)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Add Expense Error:', err)
      setError(err.message || 'Failed to add expense')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="expense-header d-flex align-items-center mb-3">
        <AiOutlinePlusCircle className="me-2 expense-icon" size={24} />
        <h3 className="mb-0">Add Expense</h3>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
          Expense added successfully!
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2 inline-field">
          <Form.Label className="mb-0">Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter expense title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={loading}
            required
            className="form-control-lg"
          />
        </Form.Group>

        <Form.Group className="mb-2 inline-field">
          <Form.Label className="mb-0">Amount</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0"
            disabled={loading}
            required
            className="form-control-lg"
          />
        </Form.Group>

        <Form.Group className="mb-2 inline-field">
          <Form.Label className="mb-0">Category</Form.Label>
          <Form.Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={loading}
            required
            className="form-select-lg"
          >
            {VALID_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3 inline-field">
          <Form.Label className="mb-0">Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            disabled={loading}
            required
            className="form-control-lg"
          />
        </Form.Group>

          <Button 
            className="w-100 btn-lg" 
            variant="primary" 
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Saving...
              </>
            ) : (
              'Save Expense'
            )}
          </Button>
        </Form>
      </div>

  )
}