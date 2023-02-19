import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import './styles.css';


const EmailVerify = () => {
    const [validUrl, setValidUrl] = useState(true);
    const [response, setResponse] = useState<any>("");
    const param = useParams();

    useEffect(() => {
        const verifyEmailUrl = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/user/verify/${param.id}/${param.token}`, {
                    method: 'Get',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                console.log(response);
                setValidUrl(true);
            } catch (error) {
                console.log(error);
                setValidUrl(false);
            }
        };
        verifyEmailUrl();
    }, [param]);

    return (
        <div>
            {validUrl ? (
                <div className="container">
                    <img src="images/2.jpg" alt="success_img" className="success_img" />
                    <h1>Email verified successfully</h1>
                    <Link to="/sign-in">
                        <button className="green_btn ">Login</button>
                    </Link>
                </div>
            ) : (
                <h1>Please verify your email</h1>
            )}
        </div>
    );
};

export default EmailVerify;