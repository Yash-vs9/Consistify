import React, { useEffect } from 'react';

const BotpressWidget = ({username}) => {
    console.log(username)
  useEffect(() => {
    if (document.getElementById('bp-webchat')) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v3.1/inject.js';
    script.async = true;
    script.id = 'bp-webchat';
    document.body.appendChild(script);

    script.onload = () => {
      // ✅ Get email from localStorage token or fallback
      const token = localStorage.getItem('authToken');
      let useremail = 'guest@consistify.app';

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          useremail = payload.email || payload.sub || useremail;
        } catch (err) {
          console.warn('Invalid token');
        }
      }

      window.botpress.init({
        botId: '0b639e72-ebb2-471f-9430-18aa97f879b4', // your bot ID
        clientId: '23256eb0-67de-406d-9967-3f5ccb897ca2', // your client ID
        messagingUrl: 'https://messaging.botpress.cloud',
        hostUrl: 'https://cdn.botpress.cloud/webchat/v3.1',
        "user": {
      "data": {
        "username": username, // Use the email from fetchLogin
        // Use the password from fetchLogin
      }
    }
      });

      // Optional: open chat immediately
      window.botpress.on('webchat:ready', () => {
        window.botpress.open();
      });
    };

    return () => {
      const script = document.getElementById('bp-webchat');
      if (script) document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default BotpressWidget;