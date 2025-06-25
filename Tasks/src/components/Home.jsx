import React, { useEffect } from 'react';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const getUsernameFromToken = (token) => {
    if (!token) return null;
    try {
      const payloadBase64Url = token.split('.')[1];
      const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      return payload.sub || payload.username || null;
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  };

  const token = localStorage.getItem('authToken');
  const usernameJWT = getUsernameFromToken(token);
  console.log('Username from token:', usernameJWT);

  useEffect(() => {
    if (!token) {
      alert('Token not found');
      navigate('/sign');
    }
  }, [token, navigate]);

  useEffect(() => {
    const scripts = [
      "https://cdn.botpress.cloud/webchat/v2.2/inject.js",
      "/script.js",
      "/script2.js"
    ];

    const loadedScripts = scripts.map((src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
      return script;
    });

    return () => {
      loadedScripts.forEach((script) => {
        document.body.removeChild(script);
      });
    };
  }, []);

  return (
    <div>
      <div className={styles.can}>
        <div className={styles.nav}>
          <a href={`/${usernameJWT}/friends`}>Add Friends</a>
          <img src="rectangle-list-regular.svg" alt="icon" />
          <p>Consistify</p>
          <a href="/sign" className={styles.btn}>Go to Sign</a>
        </div>

        <div className={styles.welcome}>
          <p className={styles.wtc}>Welcome to Consistify!</p>
        </div>
        <canvas id="particlesCanvas"></canvas>
      </div>

      <hr />

      <div className={styles.over}>
        <div className={styles.left1}>
          <div className={styles.text}>What exactly is Consistify?</div>
        </div>
        <div className={styles.right1}>
          <div className={styles.texta}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam ullam doloremque aliquam molestiae libero...
          </div>
        </div>
      </div>

      <hr />

      <div className={styles.cont}>
        <div className={styles.left1}>
          <div className={styles.texta}>
            <ul>
              <li>Leveling up system</li>
              <li>New AI Chatbot</li>
              <li>Leveling up with friends</li>
              <li>Ranks for every level</li>
              <li>Something</li>
              <li>Something</li>
            </ul>
          </div>
        </div>
        <div className={styles.right1}>
          <div className={styles.text}>What's new in Consistify?</div>
        </div>
      </div>

      <hr />

      <div className={styles.footer}>
        {[1, 2, 3, 4, 5].map((num) => (
          <span key={num} className={styles.sliderSpan} id={`slider-span${num}`}></span>
        ))}

        <div className={styles.imageSlider}>
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className={styles.slidesDiv} id={`slide-${num}`}>
              <div className={styles.svg} id={`svg${num}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <circle cx="256" cy="256" r="200" fill="#ddd" />
                </svg>
              </div>
              <a href={`#slider-span${num}`} className={styles.button} id={`button-${num}`}></a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;