import React, { useState } from 'react';

import FormAuth from "../../reuseable-components/form-auth/form-auth.components";
import Button from '../../reuseable-components/button/button.component';

import { projectAuth } from "../../firebase/config";

import { ReactComponent as Cover } from "../../assets/auth-cover.svg";
import "./_auth-page.scss";

const AuthPage = () => {

    const [loginInput, setLoginInput] = useState({
        email: "",
        password: ""
    })

    const [regInput, setRegInput] = useState({
        displayName: "",
        emailReg: "",
        passwordReg: "",
        confirmPasswordReg: ""
    })

    const [isRegistered, setIsRegistered] = useState(true)
    const [message, setMessage] = useState("")

    const MESSAGES = {
        INVALID_EMAIL: "auth/invalid-email",
        WRONG_PASSWORD: "auth/wrong-password",
        USER_NOT_FOUND: "auth/user-not-found"
    }

    const checkLogin = (code) => {
        switch (code) {
            case MESSAGES.INVALID_EMAIL:
                setMessage("Email is invalid!")
                break;

            case MESSAGES.USER_NOT_FOUND:
                setMessage("User not found!")
                break

            case MESSAGES.WRONG_PASSWORD:
                setMessage("Wrong user / password combination")
                break

            default:
                break;
        }
    }

    const login = (e) => {
        e.preventDefault()
        projectAuth.signInWithEmailAndPassword(loginInput.email, loginInput.password)
            .then(() => {
                reset()
            })
            .catch(err => {
                console.error(err);
                checkLogin(err.code);
            })
    }

    const register = (e) => {
        console.log(regInput);
        e.preventDefault();
        projectAuth.createUserWithEmailAndPassword(regInput.emailReg, regInput.passwordReg)
            .then(() => {
                reset()
            })
            .catch(err => {
                console.error(err);
            })
    }

    const handleChange = (e) => {
        const name = e.target.name,
            value = e.target.value

        if (isRegistered) {
            setLoginInput(prevValue => ({
                ...prevValue,
                [name]: value
            }))
        } else {
            setRegInput(prevValue => ({
                ...prevValue,
                [name]: value
            }))
        }
    }

    const toggleIsRegistered = () => {
        setIsRegistered(prevValue => !prevValue)
        reset();
    }

    const reset = () => {
        setLoginInput({
            email: "",
            password: ""
        })
        setRegInput({
            displayName: "",
            emailReg: "",
            passwordReg: "",
            confirmPasswordReg: ""
        })
        setMessage("")
    }

    return (
        <div className="auth-page">
            {message &&
                <>
                    <h3 className="message">
                        {message}
                    </h3>
                    <i className="far fa-times-circle" onClick={reset}></i>
                </>}
            <Cover className="cover" />
            <div className="ground" />
            <form className={isRegistered ? "auth-box" : "auth-box none"} onSubmit={login} >
                <h1>Login</h1>
                <FormAuth
                    name="email"
                    type="text"
                    value={loginInput.email}
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
            <form className={isRegistered ? "auth-box none" : "auth-box"} onSubmit={register}>
                <h1>Register</h1>
                <FormAuth
                    name="displayName"
                    type="text"
                    value={regInput.displayName}
                    handleChange={handleChange}
                    label="Display Name"
                    backcolor="transparent"
                />
                <FormAuth
                    name="emailReg"
                    type="text"
                    value={regInput.emailReg}
                    handleChange={handleChange}
                    label="Email"
                    backcolor="transparent"
                />
                <FormAuth
                    name="passwordReg"
                    type="password"
                    value={regInput.passwordReg}
                    handleChange={handleChange}
                    label="Password"
                    backcolor="transparent"
                />
                <FormAuth
                    name="confirmPasswordReg"
                    type="password"
                    value={regInput.confirmPasswordReg}
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