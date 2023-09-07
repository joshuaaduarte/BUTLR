import React, { useState , useRef } from 'react'
import { Card, Button, Alert, Form } from 'react-bootstrap'
import { Link , useNavigate } from "react-router-dom"
import { useAuth  } from "../contexts/AuthContext"
import { db } from '../firebase'
import { setDoc, doc ,serverTimestamp } from "firebase/firestore"; 

 



export default function Dashboard() {
    const [error, setError] = useState("")
    const { currentUser, logout, } = useAuth()
    const navigate = useNavigate()
    const firstNameRef = useRef()
    const lastNameRef = useRef()
    const personType = useRef()
    const calendarUse = useRef()

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
        e.preventDefault();

        const firstNameValue = firstNameRef.current.value;
        const lastNameValue = lastNameRef.current.value;
        const personTypeValue = personType.current.value;
        const calendarUseValue = calendarUse.current.value;
        const userUID = currentUser.uid;
        // const elementsArray = [...e.target.elements];
        // const formData = elementsArray.reduce((accumulator, currentValue) => {
        //     if (currentValue.id) {
        //         accumulator[currentValue.id] = currentValue.value;
        //     }
        //     return accumulator;
        // }, {})

        try{
            //const docRef = doc(collection(db, 'users'))
            const docRef = await setDoc(doc(db, "users", userUID),({
                userID : userUID,
                firstName: firstNameValue, 
                lastName: lastNameValue,
                personType : personTypeValue,
                calendarUse : calendarUseValue,
                timestamp : serverTimestamp(),

            }))
            
            console.log("document written with ID:", docRef.id)

            


            
        } catch {
            setError('Failed to save user information')
        }

        

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
    <Card className="mt-3">
        <Card.Body>
        <h2 className="text-center mb-4" >Basic User Information</h2>
        <Form onSubmit={handleSubmit}>
            <Form.Group >
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" ref={firstNameRef} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" ref={lastNameRef} />
            </Form.Group>
            <Form.Group>
            <Form.Label>What type of person are you?
                    <Form.Select ref={personType}>
                        <option value='Morning Person' >Morning Person</option>
                        <option value='Night Owl' >Night Owl</option>
                        <option value='Good after my coffee' >Good after my coffee</option>
                        <option value='No Preferences' >No Preference</option>
                    </Form.Select>
                </Form.Label>
            </Form.Group>
            <Form.Group>
                <Form.Label>How often do you use a calendar?
                    <Form.Select ref={calendarUse}>
                        <option value='Everyday' >Everyday</option>
                        <option value='Once a week' >Once a Week</option>
                        <option value='Once a month' >Once a Month</option>
                        <option value='Never' >Never</option>
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

 