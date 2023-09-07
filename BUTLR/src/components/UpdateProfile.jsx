import React, {useRef, useState,useEffect } from 'react'
import { Card, Form, Button, Alert, Container} from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { db } from '../firebase'
import { getDoc, doc } from "firebase/firestore";


export default function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { currentUser, updatesEmail, updatesPassword } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [calendarUse, setCalendarUse] = useState('')
    const [personType, setPersonType] = useState('')

    async function getInformation() {   
        const docRef = doc(db, "users", currentUser.uid);
        
        try {
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()) {
                setFirstName(docSnap.data()['firstName']);
                setLastName(docSnap.data()['lastName']);
                setCalendarUse(docSnap.data()['calendarUse']);
                setPersonType(docSnap.data()['personType'])
                console.log(docSnap.data()['calendarUse']);
            } else {
                console.log("Document does not exist")
            }
        
        } catch(error) {
            console.log(error)
        }

        return (firstName)
      }


    function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value){
            return setError("Passwords do not match")
        }
        


        const promises = []
        setLoading(true)
        setError("")
        if (emailRef.current.value !== currentUser.email) {
            promises.push(updatesEmail(emailRef.current.value))
        }
        if (passwordRef.current.value) {
            promises.push(updatesPassword(passwordRef.current.value))
        }

        Promise.all(promises).then(() => {
            navigate('/')
        }).catch(() => {
            setError('Failed to update account')
        }).finally(() => {
            setLoading(false)
        })



    }

     // Call the getInformation function when the component mounts
    useEffect(() => {
    getInformation();
  });
    
    return (
    <>
    <Container 
      className="d-flex align-items-center justify-content-center"
      style={{minHeight: "100vh"}}
    >
    <div className="w-100" style={{maxWidth: "400px"}}>
    
    <Card >
        <Card.Body>
            <h2 className="text-center mb-4" >Update Profile</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control  readOnly defaultValue={firstName}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control readOnly defaultValue={lastName}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Calendar Use</Form.Label>
                    <Form.Control readOnly defaultValue={calendarUse}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Person Type</Form.Label>
                    <Form.Control readOnly defaultValue={personType}/>
                </Form.Group>
                <Form.Group id='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required defaultValue={currentUser.email}/>
                </Form.Group>
                <Form.Group id='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} placeholder="Leave blank to keep the same" />
                </Form.Group>
                <Form.Group id='password-confirm'>
                    <Form.Label>Password Confirmation</Form.Label>
                    <Form.Control type="password" ref={passwordConfirmRef} placeholder="Leave blank to keep the same"/>
                </Form.Group>
                <Button disabled={loading} className="w-100 mt-3" type="submit">Update</Button>
            </Form>
        </Card.Body>
    </Card>
    <div className="w-100 text-center mt-2">
        <Link to="/">Cancel</Link>
    </div>
    </div>
    </Container>
    </>
    )
}
