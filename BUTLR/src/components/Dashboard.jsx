import React, { useState , useRef, useEffect } from 'react'
import { Container, Card, Button, Alert, Form } from 'react-bootstrap'
import { Link , useNavigate } from "react-router-dom"
import { useAuth  } from "../contexts/AuthContext"
import { db } from '../firebase'
import { getDoc,setDoc, doc ,serverTimestamp } from "firebase/firestore";
import {
    MDBContainer,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarToggler,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBCollapse,
    MDBIcon,
  } from 'mdb-react-ui-kit'; 

 



export default function Dashboard() {
    const [error, setError] = useState("")
    const { currentUser, logout, } = useAuth()
    const navigate = useNavigate()
    const firstNameRef = useRef()
    const lastNameRef = useRef()
    const personType = useRef()
    const calendarUse = useRef()
    const [showNav, setShowNav] = useState(false);
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    

    async function getInformation() {   
        const docRef = doc(db, "users", currentUser.uid);
        
        try {
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()) {
                setFirstName(docSnap.data()['firstName']);
                setLastName(docSnap.data()['lastName']);
                console.log(docSnap.data()['calendarUse']);
            } else {
                console.log("Document does not exist")
            }
        
        } catch(error) {
            console.log(error)
        }

        return (firstName)
    }

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
    
    <MDBNavbar expand='lg' light bgColor='light'>
      <MDBContainer fluid>
        <MDBNavbarBrand href='#'>Navbar</MDBNavbarBrand>
        <MDBNavbarToggler
          type='button'
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => setShowNav(!showNav)}
        >
          <MDBIcon icon='bars' fas />
        </MDBNavbarToggler>
        <MDBCollapse navbar show={showNav}>
          <MDBNavbarNav>
            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page' href='#'>
                Home
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='#'>Features</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='#'>Pricing</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink disabled href='#' tabIndex={-1} aria-disabled='true'>
                Disabled
              </MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
    <Container 
      className="d-flex align-items-center justify-content-center"
      style={{minHeight: "100vh"}}
    >
    <div className="w-100" style={{maxWidth: "400px"}}>
    <h2 className="text-center"> Welcome, {firstName} {lastName}!</h2>
    <Card className="mt-3">
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
    </div>
    </Container>
    </>

  )
}

 