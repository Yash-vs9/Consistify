import React, { useEffect } from 'react';
import './botinterface.css';
const BotpressWidget = ({ username }) => {
  useEffect(() => {
    if (document.getElementById('bp-webchat')) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v3.1/inject.js';
    script.async = true;
    script.id = 'bp-webchat';
    document.body.appendChild(script);

    script.onload = () => {
      window.botpress.init({
        botId: '0b639e72-ebb2-471f-9430-18aa97f879b4',
        clientId: '23256eb0-67de-406d-9967-3f5ccb897ca2',
        messagingUrl: 'https://messaging.botpress.cloud',
        hostUrl: 'https://cdn.botpress.cloud/webchat/v3.1',
        user: {
          data: {
            username: username || 'guest@consistify.app'
          }
        },
        configuration: {
          botName: 'Task Helper',
          color: '#3B82F6',
          themeMode: 'dark',
          fontFamily: 'Inter',
          radius: 2,
          showPoweredBy: false,
          additionalStylesheetUrl: '/botinterface.css'
        }
      });
    };

    return () => {
      const s = document.getElementById('bp-webchat');
      if (s) document.body.removeChild(s);
    };
  }, [username]);

  return null;
};

export default BotpressWidget;
