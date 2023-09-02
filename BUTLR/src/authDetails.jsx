import React, {useEffect, useState} from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthDetails = () => {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
            } else {
                setAuthUser(null);
            }
        });

        return () => {
            listen();
        }

    }, []);

    const userLogOut = () => {
        signOut(auth).then(() => {
            console.log("User logged out successfully")
        }).catch(error => console.log(error))
    };
    
    return (
        <div>
            { authUser ? <><p>{`Logged In as ${authUser.email}`}</p><button onClick={userLogOut}>Log Out</button></> : <p>Logged Out</p>}
        </div>
        )

}

export default AuthDetails;