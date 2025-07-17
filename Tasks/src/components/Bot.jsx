import { useEffect, useState } from 'react';

const Bot = () => {
  const [chatVisible, setChatVisible] = useState(false);

  useEffect(() => {
    const loadBot = async () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.botpress.cloud/webchat/v1/inject.js';
      script.async = true;

      script.onload = () => {
        window.botpressWebChat.init({
          clientId: '23256eb0-67de-406d-9967-3f5ccb897ca2',
          hostUrl: 'https://cdn.botpress.cloud/webchat/v1',
          messagingUrl: 'https://messaging.botpress.cloud',
          botName: 'HelperBot',
          theme: 'prism',
          themeColor: '#0ea5e9',
          showPoweredBy: false,
          showCloseButton: true,
        });
      };

      document.body.appendChild(script);
    };

    loadBot();
  }, []);

  const toggleChat = () => {
    const event = { type: chatVisible ? 'hide' : 'show' };
    window.botpressWebChat?.sendEvent(event);
    setChatVisible(!chatVisible);
  };

  return (
    <button
      onClick={toggleChat}
      className="fixed bottom-5 right-5 px-4 py-2 bg-cyan-600 text-white rounded-full shadow-lg hover:bg-cyan-700"
    >
      {chatVisible ? 'Hide Chat' : 'Chat with Bot'}
    </button>
  );
};

export default Bot;