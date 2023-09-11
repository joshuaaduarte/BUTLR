import React, {useRef, useState,useEffect } from 'react'
import { Card, Form, Button, Container} from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { db } from '../firebase'
import { getDoc, setDoc, doc ,serverTimestamp } from "firebase/firestore";
import Navbar from 'react-bootstrap/Navbar';


export default function UserInformation() {
    const { currentUser } = useAuth()
    const [ setError] = useState('')
    const navigate = useNavigate()


    const firstNameRef = useRef()
    const lastNameRef = useRef()
    const personType = useRef()
    const calendarUse = useRef()

    async function getInformation() {   
        const docRef = doc(db, "users", currentUser.uid);
        
        try {
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()) {
                navigate("/")

            } else {
                console.log("Document does not exist")
            }
        
        } catch(error) {
            console.log(error)
        }

    }


    async function handleSubmit(e) {
        e.preventDefault();

        const firstNameValue = firstNameRef.current.value;
        const lastNameValue = lastNameRef.current.value;
        const personTypeValue = personType.current.value;
        const calendarUseValue = calendarUse.current.value;
        const userUID = currentUser.uid;
        navigate("/");

        


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
    useEffect(() => {
        getInformation();
        });

    
    return (
    <>
    <Navbar bg="dark" data-bs-theme="dark" className="bg-body-tertiary ">
      <Container>
        <Navbar.Brand href='/'>butlr</Navbar.Brand>

      </Container>
    </Navbar>

    <Container fluid 
      className="d-flex align-items-center justify-content-center bg-dark"
      style={{minHeight: "100vh"}}
    >
    <div className="w-100" style={{maxWidth: "400px"}}>
    
    <Card >
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
            <Button  className="w-100 mt-2 border-dark bg-dark" type="submit">Submit</Button>

            </Form>
        </Card.Body>
    </Card>
    </div>
    </Container>
    </>
    )
}
