import React, { useEffect, useState } from 'react';
import logo from '../assets/DeWatermark.ai_1739087600948.png';
import styles from './Sign.module.css';
import { signData, loginUser } from './api';
import { useNavigate, useParams } from 'react-router-dom';

const Sign = () => {
    const [active, setActive] = useState(false);
    const [name, setName] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const param = useParams();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const name = await loginUser(loginEmail, loginPassword);
            setName(name);
            navigate(`/home`);
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed');
        }
    };

    const goToReg = () => {
        setActive(true);
    };

    const goToLogin = () => {
        setActive(false);
    };

    const registerSubmit = async (e) => {
        e.preventDefault();
        try {
            const name1 = await signData(username, registerEmail, registerPassword);
            console.log(name1);
            if (name1) {
                navigate(`/home`);
            }
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <div className={`${styles.container} ${active ? styles.active : ''}`}>
            <div className={styles.left}>
                <div className={styles['login-container']}>
                    <h2>Sign In</h2>
                    <form onSubmit={handleLogin}>
                        <div className={styles['input-field']}>
                            <input
                                className={styles['login-email']}
                                type="email"
                                placeholder="Email"
                                required
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                            />
                        </div>
                        <div className={styles['input-field']}>
                            <input
                                className={styles['login-password']}
                                type="password"
                                placeholder="Password"
                                required
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                            />
                        </div>
                        <div className={styles.options}>
                            <label><input type="checkbox" /> Remember Me</label>
                            <a href="#">Forgot Password?</a>
                        </div>
                        <button className={styles['login-submit']} type="submit">Sign In</button>
                        <div className={styles.Switch}>
                            New to our site? <a onClick={goToReg} id="RegisterLink">Create account!</a>
                        </div>
                    </form>
                </div>

                <div className={styles['register-container']}>
                    <h2>Sign Up</h2>
                    <form onSubmit={registerSubmit}>
                        <div className={styles['input-field']}>
                            <input
                                className={styles['register-username']}
                                placeholder="Username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className={styles['input-field']}>
                            <input
                                className={styles['register-email']}
                                type="email"
                                placeholder="Email"
                                required
                                value={registerEmail}
                                onChange={(e) => setRegisterEmail(e.target.value)}
                            />
                        </div>
                        <div className={styles['input-field']}>
                            <input
                                className={styles['register-password']}
                                type="password"
                                placeholder="Password"
                                required
                                value={registerPassword}
                                onChange={(e) => setRegisterPassword(e.target.value)}
                            />
                        </div>
                        <button className={styles['register-submit']} type="submit">Register</button>
                        <div className={styles.Switch}>
                            Already have an account? <a onClick={goToLogin} id="LoginLink">Login</a>
                        </div>
                    </form>
                </div>
            </div>

            <div className={styles.right}>
                <img src={logo} alt="Something :>" />
            </div>
        </div>
    );
};

export default Sign;