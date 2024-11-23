import { useState } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import TutorIcon from "./assets/Tutor.png"
import SecretariaIcon from "./assets/Secretaria.png"

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      message: "Bem-vindo ao suporte da Universidade EAD!",
      sentTime: "agora",
      sender: "Suporte",
      direction: "incoming",
      avatar: SecretariaIcon,
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);

  function capitalizeSentences(text) {
    return text.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  }

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


  const handleSendMessage = async (userMessage) => {
    const newMessage = {
      message: userMessage,
      sender: "Usuário",
      direction: "outgoing",
      backgroundColor: "#c6e3fa" 
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    setIsTyping(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/processar_pergunta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pergunta: userMessage }),
      });

      const data = await response.json();

      const res = capitalizeSentences(data.resposta);

      if (messages[messages.length - 1]?.sender === "Secretaria" && data.agente === "tutor") {
        const forwardingMessage = {
          message: "Estou encaminhando para o tutor aguarde um momento.",
          sender: "Secretaria",
          direction: "incoming",
          avatar: SecretariaIcon,
          backgroundColor: "#f1f1f1"
        };
        setMessages((prevMessages) => [...prevMessages, forwardingMessage]);

        await delay(3000);
      }

      const botMessage = {
        message: res,
        sender: data.agente === "tutor" ? "Tutor" : "Secretaria",
        direction: "incoming",
        avatar: data.agente === "tutor" ? TutorIcon : SecretariaIcon,
        backgroundColor: "#f1f1f1"
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ height: "730px", position: "relative" }}>
      <MainContainer>
        <ChatContainer>
          <MessageList>
            {messages.map((msg, i) => (
              <Message
                key={i}
                model={{
                  message: msg.message,
                  sentTime: "agora",
                  sender: msg.sender,
                  direction: msg.direction,
                }}
                style={{
                  textAlign: "left"
                }}
                >
                {msg.avatar && <Avatar src={msg.avatar} name={msg.sender} />}
              </Message>
            ))}
            {isTyping && (
              <Message
                model={{
                  message: "Digitando...",
                  sentTime: "agora",
                  sender: "Suporte",
                  direction: "incoming",
                }}
                contentStyle={{ backgroundColor: "#f1f1f1" }}
              />
            )}
          </MessageList>
          <MessageInput
            placeholder="Digite sua mensagem aqui..."
            onSend={handleSendMessage}
            style={{
              textAlign: "left"
            }}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default Chat;
