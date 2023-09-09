import React, { useState , useRef, useEffect } from 'react'
import { Container, Card, Button, Alert, Form, Row, Col, Navbar } from 'react-bootstrap'
import Nav from 'react-bootstrap/Nav';
import { Link , useNavigate } from "react-router-dom"
import { useAuth  } from "../contexts/AuthContext"
import { db } from '../firebase'
import { getDoc,setDoc, doc ,serverTimestamp } from "firebase/firestore";
 

  import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
  import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

 
  const API_KEY = '';
  

  // "Explain things like you would to a 10 year old learning how to code."
  const systemMessage = { //  Explain things like you're talking to a software professional with 5 years of experience.
    "role": "system", "content": "Explain things like you're talking to a software professional with 2 years of experience."
  }


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
    
    // for chat ui
    const [messages, setMessages] = useState([
      {
        message: "Hello, I'm ChatGPT! Ask me anything!",
        sentTime: "just now",
        sender: "ChatGPT"
      }
    ]);

    const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    
    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) { // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
    });
    
    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act. 
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,  // The system message DEFINES the logic of our chatGPT
        ...apiMessages // The messages from our chat with ChatGPT
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", 
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
      setIsTyping(false);
    });
  }

    // to get information from firebase pertaining to the user to display as needed.

    async function getInformation() {   
        const docRef = doc(db, "users", currentUser.uid);
        
        try {
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()) {
                setFirstName(docSnap.data()['firstName']);
                setLastName(docSnap.data()['lastName']);

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
    {/* Pertaining to the navbar */}
    <Navbar bg="dark" data-bs-theme="dark" className="bg-body-tertiary ">
      <Container>
        <Navbar.Brand href="#home">butlr</Navbar.Brand>
        <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href='/update-profile'>Update Profile</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
        </Nav>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a>{firstName} {lastName}</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    {/* Pertaining to the nav bar */}

    {/* Pertaining to the information on the dashboard */}
    <Container fluid
      className="d-flex flex-column bg-dark"
      style={{minHeight: "100vh"}}
    >
    <Row className=" justify-content-center">
    <Col sm={6} className='d-flex justify-content-center align-items-center ' style={{minHeight: "100vh", maxWidth: "400px"}}>
    
    <div style={{ position:"relative", height: "800px", width: "700px"  }}>
      <h2 className='text-center text-white' >Chat with me</h2>
        <MainContainer>
          <ChatContainer>       
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => {
                console.log(message)
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />        
          </ChatContainer>
        </MainContainer>
      </div>
    </Col>
    <Col sm={6} className=' d-flex justify-content-center align-items-center' style={{minHeight: "100vh", maxWidth: "400px"}}>
    <div className="" >
    {/* <Card className="mt-3">
        <Card.Body>
        <h2 className="text-center mb-4" >Profile</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <strong>Email: </strong> {currentUser.email}
        <Link to="/update-profile" className="btn btn-primary w-100 mt-2" >
            Update Profile
        </Link>
        </Card.Body>
    </Card> */}
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
            <Button  className="w-100 mt-2 border-dark bg-dark" type="submit">Submit</Button>
        </Form>
        </Card.Body>
    </Card>
    <div className="w-100 text-center mt-2">
        <Button className='bg-light border-light text-dark' onClick={handleLogout}>Log Out</Button>
    </div>
    </div>
    </Col>
    </Row>
    </Container>
    </>

  )
}

 