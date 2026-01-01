import { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useAuth } from '../contexts/AuthContext'
import { getFamilyMembers, getFamilyBalance } from '../services/family.service'
import { MdGroup, MdAccountBalance, MdPerson } from 'react-icons/md'

export default function Family() {
  const { token } = useAuth()
  const [familyData, setFamilyData] = useState(null)
  const [balanceData, setBalanceData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFamilyData = async () => {
      setLoading(true)
      setError(null)

      try {
        if (!token) {
          throw new Error('Authentication token not found. Please login first.')
        }

        // Fetch family members and balance data in parallel
        const [membersRes, balanceRes] = await Promise.all([
          getFamilyMembers(token),
          getFamilyBalance(token)
        ])

        if (membersRes.success) {
          setFamilyData(membersRes.data)
        }
        if (balanceRes.success) {
          setBalanceData(balanceRes.data)
        }
      } catch (err) {
        console.error('Fetch Family Data Error:', err)
        setError(err.message || 'Failed to fetch family data')
      } finally {
        setLoading(false)
      }
    }

    fetchFamilyData()
  }, [token])

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

  if (loading) {
    return (
      <div className="page text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }

  return (
    <div className="page">
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {!familyData ? (
        <Alert variant="info">
          <MdGroup size={20} className="me-2" />
          No family data found
        </Alert>
      ) : (
        <>
          {/* Family Header */}
          <div className="family-header mb-4">
            <h3 className="mb-3 d-flex align-items-center">
              <MdGroup size={28} className="me-2 text-primary" />
              {familyData.familyName}
            </h3>

            {/* Family Info Cards */}
            <Row className="g-3 mb-4">
              <Col xs={12} sm={6} md={3}>
                <Card className="family-info-card shadow-sm">
                  <Card.Body className="text-center">
                    <small className="text-muted d-block">Family ID</small>
                    <code className="small text-primary">{familyData.familyId}</code>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} sm={6} md={3}>
                <Card className="family-info-card shadow-sm">
                  <Card.Body className="text-center">
                    <small className="text-muted d-block">Total Members</small>
                    <h5 className="mb-0 text-success">{familyData.totalMembers}</h5>
                  </Card.Body>
                </Card>
              </Col>

              {balanceData && (
                <>
                  <Col xs={12} sm={6} md={3}>
                    <Card className="family-info-card shadow-sm">
                      <Card.Body className="text-center">
                        <small className="text-muted d-block">Family Balance</small>
                        <h5 className="mb-0 text-info">${balanceData.totalFamilyBalance?.toFixed(2) || '0.00'}</h5>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col xs={12} sm={6} md={3}>
                    <Card className="family-info-card shadow-sm">
                      <Card.Body className="text-center">
                        <small className="text-muted d-block">Total Members Balance</small>
                        <h5 className="mb-0 text-warning">${balanceData.totalMembersBalance?.toFixed(2) || '0.00'}</h5>
                      </Card.Body>
                    </Card>
                  </Col>
                </>
              )}
            </Row>
          </div>

          {/* Admin Member */}
          <div className="family-admin mb-4">
            <h5 className="mb-3 text-primary">
              <MdPerson size={20} className="me-2" />
              Family Admin
            </h5>
            <Card className="member-card shadow-sm">
              <Card.Body>
                <Row className="align-items-center">
                  <Col xs="auto">
                    {familyData.admin?.profilePhoto ? (
                      <img
                        src={familyData.admin.profilePhoto}
                        alt={familyData.admin.name}
                        className="member-avatar rounded-circle"
                        width={60}
                        height={60}
                      />
                    ) : (
                      <div className="member-avatar-placeholder rounded-circle d-flex align-items-center justify-content-center bg-light">
                        <MdPerson size={30} className="text-muted" />
                      </div>
                    )}
                  </Col>
                  <Col>
                    <div>
                      <h6 className="mb-1">{familyData.admin?.name}</h6>
                      <small className="text-muted">{familyData.admin?.email}</small>
                      <div className="mt-2">
                        <Badge bg="primary" className="me-2">Admin</Badge>
                        <Badge bg="info" className="me-2">
                          Role: {familyData.admin?.role}
                        </Badge>
                      </div>
                    </div>
                  </Col>
                  <Col xs="auto" className="text-end">
                    <div className="member-balance">
                      <small className="text-muted d-block">Balance</small>
                      <h6 className="mb-0 text-success">
                        ${familyData.admin?.balance?.toFixed(2) || '0.00'}
                      </h6>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>

          {/* Family Members */}
          {familyData.members && familyData.members.length > 0 && (
            <div className="family-members">
              <h5 className="mb-3 text-primary">
                <MdGroup size={20} className="me-2" />
                Family Members ({familyData.members.length})
              </h5>
              <div className="members-list">
                {familyData.members.map(member => (
                  <Card key={member._id} className="member-card shadow-sm mb-3">
                    <Card.Body>
                      <Row className="align-items-center">
                        <Col xs="auto">
                          {member.profilePhoto ? (
                            <img
                              src={member.profilePhoto}
                              alt={member.name}
                              className="member-avatar rounded-circle"
                              width={60}
                              height={60}
                            />
                          ) : (
                            <div className="member-avatar-placeholder rounded-circle d-flex align-items-center justify-content-center bg-light">
                              <MdPerson size={30} className="text-muted" />
                            </div>
                          )}
                        </Col>
                        <Col>
                          <div>
                            <h6 className="mb-1">{member.name}</h6>
                            <small className="text-muted d-block">{member.email}</small>
                            <small className="text-muted d-block">
                              Joined: {formatDate(member.joinedAt)}
                            </small>
                          </div>
                        </Col>
                        <Col xs="auto" className="text-end">
                          <div className="member-info">
                            <Badge bg="secondary" className="me-2">
                              {member.role}
                            </Badge>
                            <div className="member-balance mt-2">
                              <small className="text-muted d-block">Balance</small>
                              <h6 className="mb-0 text-success">
                                ${member.balance?.toFixed(2) || '0.00'}
                              </h6>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Balance Breakdown */}
          {balanceData && balanceData.memberBalances && balanceData.memberBalances.length > 0 && (
            <div className="balance-breakdown mt-4">
              <h5 className="mb-3 text-primary">
                <MdAccountBalance size={20} className="me-2" />
                Balance Breakdown
              </h5>
              <Card className="shadow-sm">
                <Card.Body>
                  <div className="table-responsive">
                    <table className="table table-sm mb-0">
                      <thead>
                        <tr>
                          <th>Member</th>
                          <th>Email</th>
                          <th className="text-end">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {balanceData.memberBalances.map(member => (
                          <tr key={member.memberId}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                {member.profilePhoto ? (
                                  <img
                                    src={member.profilePhoto}
                                    alt={member.name}
                                    className="rounded-circle"
                                    width={32}
                                    height={32}
                                  />
                                ) : (
                                  <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{width: 32, height: 32}}>
                                    <MdPerson size={16} className="text-muted" />
                                  </div>
                                )}
                                <span>{member.name}</span>
                              </div>
                            </td>
                            <td><small>{member.email}</small></td>
                            <td className="text-end">
                              <strong className="text-success">
                                ${member.balance?.toFixed(2) || '0.00'}
                              </strong>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  )
}