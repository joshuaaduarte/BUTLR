import React, { useState , useRef, useEffect } from 'react'
import { Container, Card, Button, Alert, Form, Row, Col, Navbar } from 'react-bootstrap'
import Nav from 'react-bootstrap/Nav';
import { Link , useNavigate } from "react-router-dom"
import { useAuth  } from "../contexts/AuthContext"
import { db } from '../firebase'
import { getDoc,setDoc, doc ,serverTimestamp } from "firebase/firestore";
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import "../css/CalendarStyles.css";
 

  import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
  import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

 
  const API_KEY = '';
  
  const styles = {
    wrap: {
      display: "flex"
    },
    left: {
      marginRight: "10px"
    },
    main: {
      flexGrow: "1"
    }
  };
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

    // calendar 
    const calendarRef = useRef()

    const editEvent = async (e) => {
      const dp = calendarRef.current.control;
      const modal = await DayPilot.Modal.prompt("Update event text:", e.text());
      if (!modal.result) { return; }
      e.data.text = modal.result;
      dp.events.update(e);
    };
  
    const [calendarConfig, setCalendarConfig] = useState({
      viewType: "Week",
      durationBarVisible: false,
      timeRangeSelectedHandling: "Enabled",
      onTimeRangeSelected: async args => {
        const dp = calendarRef.current.control;
        const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
        dp.clearSelection();
        if (!modal.result) { return; }
        dp.events.add({
          start: args.start,
          end: args.end,
          id: DayPilot.guid(),
          text: modal.result
        });
      },
      onEventClick: async args => {
        await editEvent(args.e);
      },
      contextMenu: new DayPilot.Menu({
        items: [
          {
            text: "Delete",
            onClick: async args => {
              const dp = calendarRef.current.control;
              dp.events.remove(args.source);
            },
          },
          {
            text: "-"
          },
          {
            text: "Edit...",
            onClick: async args => {
              await editEvent(args.source);
            }
          }
        ]
      }),
      onBeforeEventRender: args => {
        args.data.areas = [
          {
            top: 3,
            right: 3,
            width: 20,
            height: 20,
            symbol: "icons/daypilot.svg#minichevron-down-2",
            fontColor: "#fff",
            toolTip: "Show context menu",
            action: "ContextMenu",
          },
          {
            top: 3,
            right: 25,
            width: 20,
            height: 20,
            symbol: "icons/daypilot.svg#x-circle",
            fontColor: "#fff",
            action: "None",
            toolTip: "Delete event",
            onClick: async args => {
              const dp = calendarRef.current.control;
              dp.events.remove(args.source);
            }
          }
        ];
  
  
        const participants = args.data.participants;
        if (participants > 0) {
          // show one icon for each participant
          for (let i = 0; i < participants; i++) {
            args.data.areas.push({
              bottom: 5,
              right: 5 + i * 30,
              width: 24,
              height: 24,
              action: "None",
              image: `https://picsum.photos/24/24?random=${i}`,
              style: "border-radius: 50%; border: 2px solid #fff; overflow: hidden;",
            });
          }
        }
      }
    });
  


    
    // for chat ui
    const [messages, setMessages] = useState([
      {
        message: "Hi! I'm butlr, lets get to planning!",
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
        const events = [
          {
            id: 1,
            text: "Event 1",
            start: "2023-10-02T10:30:00",
            end: "2023-10-02T13:00:00",
            participants: 2,
          },
          {
            id: 2,
            text: "Event 2",
            start: "2023-10-03T09:30:00",
            end: "2023-10-03T11:30:00",
            backColor: "#6aa84f",
            participants: 1,
          },
          {
            id: 3,
            text: "Event 3",
            start: "2023-10-03T12:00:00",
            end: "2023-10-03T15:00:00",
            backColor: "#f1c232",
            participants: 3,
          },
          {
            id: 4,
            text: "Event 4",
            start: "2023-10-01T11:30:00",
            end: "2023-10-01T14:30:00",
            backColor: "#cc4125",
            participants: 4,
          },
        ];
    
        const startDate = "2023-10-02";
    
        calendarRef.current.control.update({startDate, events});
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
            Signed in as: <a>{firstName} {lastName} &nbsp;&nbsp;&nbsp;&nbsp;  </a>
          </Navbar.Text>
          <Nav.Link className='text-white' onClick={handleLogout} >Log Out</Nav.Link>
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
    <Col sm={3} className='d-flex justify-content-center align-items-center ' style={{minHeight: "100vh", maxWidth: "400px"}}>
    
    <div style={{ position:"relative", height: "600px", width: "700px"  }}>
      <h2 className='text-center text-white' >Plan your week</h2>
        <MainContainer >
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
    <Col md={8} className=' d-flex justify-content-center align-items-center' style={{minHeight: "100vh", maxWidth: "1200px"}}>
    <div className="" >

    <div style={styles.wrap}>
      <div style={styles.left}>
        <DayPilotNavigator
          selectMode={"Week"}
          showMonths={3}
          skipMonths={3}
          startDate={"2023-10-02"}
          selectionDay={"2023-10-02"}
          onTimeRangeSelected={ args => {
            calendarRef.current.control.update({
              startDate: args.day
            });
          }}
        />
      </div>
      <div style={styles.main}>
        <DayPilotCalendar
          {...calendarConfig}
          ref={calendarRef}
        />
      </div>
    </div>
    {/* <Container fluid className='text-white'>
      <Row>
        <h2 className='text-center text-white'>9/11-9/17</h2>
      </Row>
      <Row>
        <Col sm={1}>
          <Card >
              Time
          </Card>
        </Col>
        <Col sm={2}>
          <Card >
              Monday
          </Card>
        </Col>
        <Col sm={2}>
          <Card >
              Tuesday
          </Card>
        </Col>
        <Col sm={2}>
          <Card >
              Wednesday
          </Card>
        </Col>
        <Col sm={2}>
          <Card >
              Thursday
          </Card>
        </Col>
        <Col sm={2}>
          <Card >
             Friday
          </Card>
        </Col>

      </Row>

    </Container> */}


    {/* <Card className="mt-3">
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
    </Card> */}

    </div>
    </Col>
    </Row>
    </Container>
    </>

  )
}

 