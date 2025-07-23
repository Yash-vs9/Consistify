import { useEffect } from 'react';

interface BotpressWidgetProps {
  username?: string;
}

declare global {
  interface Window {
    botpress: any;
  }
}

const BotpressWidget = ({ username }: BotpressWidgetProps) => {
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
            username: username,
          },
        },
        configuration: {
          botName: 'Task Manager',
          color: '#06b6d4',
          themeMode: 'dark',
          fontFamily: 'Inter',
          radius: 2,
          showPoweredBy: false,
          additionalStylesheetUrl: '/botcss.css' // ✅ Make sure it's accessible
        }
      });
      window.botpress.onEvent((event: any) => {
        if (event.type === 'custom' && event.payload?.type === 'xp_result') {
          console.log('🧠 XP Result Received:', event.payload.value);
          if (onXPResult) onXPResult(event.payload.value); // Send data to parent
        }
      });
    };

    return () => {
      const existing = document.getElementById('bp-webchat');
      if (existing) document.body.removeChild(existing);
    };
  }, [username]);
    
  return null;
};

export default BotpressWidget;
