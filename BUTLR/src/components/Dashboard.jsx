import React, {useState} from 'react'
import { Card, Button, Alert, Form } from 'react-bootstrap'
import { Link , useNavigate } from "react-router-dom"
import { useAuth  } from "../contexts/AuthContext"



export default function Dashboard() {
    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()

    async function handleLogout() {
        setError('')

        try {
            await logout()
            navigate('/login')
            
        }catch {
            setError('Failed to log out')
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

    }


  return (
    <>
    <Card>
        <Card.Body>
        <h2 className="text-center mb-4" >Profile</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <strong>Email: </strong> {currentUser.email}
        <Link to="/update-profile" className="btn btn-primary w-100 mt-2" >
            Update Profile
        </Link>
        </Card.Body>
    </Card>
    <Card>
        <Card.Body>
        <h2 className="text-center mb-4" >Basic User Information</h2>
        <Form>
            <Form.Group onSubmit={handleSubmit}>
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" />
            </Form.Group>
            <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" />
            </Form.Group>
            <Form.Group>
            <Form.Label>What type of person are you?
                    <Form.Select>
                        <option value='1' >Morning Person</option>
                        <option value='1' >Night Owl</option>
                        <option value='1' >Good after my coffee</option>
                        <option value='1' >No Preference</option>
                    </Form.Select>
                </Form.Label>
            </Form.Group>
            <Form.Group>
                <Form.Label>How often do you use a calendar?
                    <Form.Select>
                        <option value='1' >Everyday</option>
                        <option value='1' >Once a Week</option>
                        <option value='1' >Once a Month</option>
                        <option value='1' >Never</option>
                    </Form.Select>
                </Form.Label>
            </Form.Group>
            <Button  className="w-100 mt-2" type="submit">Submit</Button>
        </Form>
        </Card.Body>
    </Card>
    <div className="w-100 text-center mt-2">
        <Button onClick={handleLogout}>Log Out</Button>
    </div>
    </>
  )
}
