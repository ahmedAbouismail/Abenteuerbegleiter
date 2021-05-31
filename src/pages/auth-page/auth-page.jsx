import React, { useState } from 'react';

import FormAuth from "../../reuseable-components/form-auth/form-auth.components";
import { ReactComponent as Cover } from "../../assets/auth-cover.svg";

import "./_auth-page.scss";
import Button from '../../reuseable-components/button/button.component';

const AuthPage = () => {

    const [loginInput, setLoginInput] = useState({
        username: "",
        password: ""
    })

    const [isRegistered, setIsRegistered] = useState(true);
    const [message, setMessage] = useState("");


    const handleSubmit = () => {

    }

    const handleChange = (e) => {

    }

    const toggleIsRegistered = () => {
        setIsRegistered(prevValue => !prevValue);
    }

    return (
        <div className="auth-page">
            <h3 className="message">{message}</h3>
            <Cover className="cover" />
            <div className="ground" />
            <form className={isRegistered ? "auth-box" : "auth-box none"} onSubmit={handleSubmit} >
                <h1>Login</h1>
                <FormAuth
                    name="email"
                    type="text"
                    value={loginInput.username}
                    handleChange={handleChange}
                    label="Email"
                    backcolor="transparent"
                />
                <FormAuth
                    name="password"
                    type="password"
                    value={loginInput.password}
                    handleChange={handleChange}
                    label="Password"
                    backcolor="transparent"
                />
                <Button
                    type="submit"
                    backcolor="#521262"
                    color="#ffffff"
                    desc="Login"
                />
                <p>
                    Don't have an account yet?
                </p>
                <p className="alternative" onClick={toggleIsRegistered}>
                    Register
                </p>
            </form>
            <form className={isRegistered ? "auth-box none" : "auth-box"} onSubmit={handleSubmit}>
                <h1>Register</h1>
                <FormAuth
                    name="displayName"
                    type="text"
                    value={loginInput.username}
                    handleChange={handleChange}
                    label="Display Name"
                    backcolor="transparent"
                />
                <FormAuth
                    name="emailReg"
                    type="text"
                    value={loginInput.username}
                    handleChange={handleChange}
                    label="Email"
                    backcolor="transparent"
                />
                <FormAuth
                    name="passwordReg"
                    type="password"
                    value={loginInput.password}
                    handleChange={handleChange}
                    label="Password"
                    backcolor="transparent"
                />
                <FormAuth
                    name="confirmPasswordReg"
                    type="password"
                    value={loginInput.password}
                    handleChange={handleChange}
                    label="Cofirm password"
                    backcolor="transparent"
                />
                <Button
                    type="submit"
                    backcolor="#521262"
                    color="#ffffff"
                    desc="Register"
                />
                <p>
                    I already have an account.
                </p>
                <p className="alternative" onClick={toggleIsRegistered}>
                    Login
                </p>
            </form>

        </div>
    );
};

export default AuthPage;