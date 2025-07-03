import React, { useEffect, useState } from 'react';
import logo from '../assets/DeWatermark.ai_1739087600948.png';
import styles from './Sign.module.css';
import { signData, loginUser } from './api';
import { useNavigate } from 'react-router-dom';

const Sign = () => {
  const [active, setActive] = useState(false);
  const [name, setName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const name = await loginUser(loginEmail, loginPassword);
      setName(name);
      navigate(`/home`);
    } catch (error) {
      alert('Login failed');
    }
  };

  const registerSubmit = async (e) => {
    e.preventDefault();
    try {
      const name1 = await signData(username, registerEmail, registerPassword);
      if (name1) navigate(`/home`);
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div className={`${styles.signWrapper} ${active ? styles.active : ''}`}>
      <div className={styles.signLeft}>
        <div className={styles.loginBox}>
          <h2>Sign In</h2>
          <form onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <input
                type="email"
                placeholder="Email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
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
            <button className={styles.primaryButton} type="submit">Sign In</button>
            <div className={styles.switchText}>
              New to our site? <span onClick={() => setActive(true)}>Create account</span>
            </div>
          </form>
        </div>

        <div className={styles.registerBox}>
          <h2>Sign Up</h2>
          <form onSubmit={registerSubmit}>
            <div className={styles.inputGroup}>
              <input
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="email"
                placeholder="Email"
                required
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="Password"
                required
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
            </div>
            <button className={styles.primaryButton} type="submit">Register</button>
            <div className={styles.switchText}>
              Already have an account? <span onClick={() => setActive(false)}>Login</span>
            </div>
          </form>
        </div>
      </div>

      <div className={styles.signRight}>
        <img src={logo} alt="Logo" />
      </div>
    </div>
  );
};

export default Sign;