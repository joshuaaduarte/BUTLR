import React, {useRef, useState, } from 'react'
import { Card, Form, Button, Alert, Container} from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';


export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login} = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        try {
        setError("")
        setLoading(true)
        await login(emailRef.current.value, passwordRef.current.value)
        navigate("/")
        } catch {
            setError("Failed to Log In")
            
        }
        setLoading(false)
    }
    
    return (
    <>
    <Navbar bg="dark" data-bs-theme="dark" className="bg-body-tertiary ">
      <Container>
        <Navbar.Brand href="#home">butlr</Navbar.Brand>

      </Container>
    </Navbar>
    <Container fluid 
      className="d-flex align-items-center justify-content-center bg-dark"
      style={{minHeight: "100vh"}}
    >
    <div className="w-100" style={{maxWidth: "400px"}}>
    
    <Card className=' border-dark '>
        <Card.Body>
            <h2 className="text-center mb-4" >Log In</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group id='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required />
                </Form.Group>
                <Form.Group id='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} required />
                </Form.Group>
                <Button disabled={loading} className="border-dark w-100 mt-3 bg-dark" type="submit">Log In</Button>
            </Form>
            <div className="w-100 text-center mt-3">
                <Link to="/forgot-password">Forgot Password?</Link>
            </div>
        </Card.Body>
    </Card>
    <div className="w-100 text-center text-white mt-2">
        Need an Account? <Link to="/signup">Sign Up</Link>
    </div>
    </div>
    </Container>
    </>
    )
}
