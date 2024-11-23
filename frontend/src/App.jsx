import { useState } from "react";
import {
  Typography,
  Container,
  Box,
  IconButton
} from "@mui/material";
import './App.css';
import Chat from "./Chat";
import ChatIcon from "@mui/icons-material/Chat";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";


const HomePage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="app-container">
    <nav className="navbar">
      <div className="logo">Universidade EAD</div>
      <ul className="nav-links">
        <li>Home</li>
        <li>Cursos</li>
        <li>Preços</li>
        <li>Contato</li>
      </ul>
      <button className="enroll-button">Inscreva-se</button>
    </nav>

    <section className="hero">
      <div className="hero-content">
        <h1>Educação de Qualidade ao Alcance de Todos</h1>
        <p>Cursos 100% online, com suporte especializado e flexibilidade total para você aprender no seu ritmo.</p>
        <button className="enroll-button">Inscreva-se</button>
      </div>
    </section>

    <section className="features">
      <div className="feature-item">
        <div className="placeholder-icon">
          <img src="./src/assets/money.png" alt="Icon" className="icon-img" />
        </div>
        <h3>Testes Gratuitos</h3>
        <p>Descubra o potencial dos nossos cursos com acesso gratuito. Sem compromisso, apenas conhecimento!</p>
      </div>
      <div className="feature-item">
        <div className="placeholder-icon">
        <img src="./src/assets/certificate.png" alt="Icon" className="icon-img" />
        </div>
        <h3>Certificação Reconhecida</h3>
        <p>Ganhe certificações valorizadas pelo mercado e destaque-se em sua carreira com diplomas reconhecidos.</p>
      </div>
      <div className="feature-item">
        <div className="placeholder-icon">
          <img src="./src/assets/teacher.png" alt="Icon" className="icon-img" />
        </div>
        <h3>Melhores Professores</h3>
        <p>Aprenda com especialistas que estão prontos para guiar seu caminho ao sucesso!</p>
      </div>
      <div className="feature-item">
        <div className="placeholder-icon">
          <img src="./src/assets/support.png" alt="Icon" className="icon-img" />
        </div>
        <h3>Suporte 24/7</h3>
        <p>Estamos aqui para ajudar você a qualquer hora, todos os dias. Suporte dedicado sempre ao seu lado!</p>
      </div>
    </section>
      <IconButton
        onClick={toggleChat}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          backgroundColor: "#007BFF",
          color: "#fff",
          "&:hover": { backgroundColor: "#005bb5" },
        }}
      >
        <ChatIcon />
      </IconButton>

      {isChatOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 80,
            right: 20,
            width: "600px",
            height: "730px",
            backgroundColor: "#fff",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
            overflow: "hidden",
            zIndex: 2
          }}
        >
          <Chat />
        </Box>
      )}

      <Box sx={{ py: 4, backgroundColor: "#f5f5f5", textAlign: "center", width: "100vw" }}>
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ color: "#666" }}>
            Universidade EAD © 2024. Todos os direitos reservados.
          </Typography>
        </Container>
      </Box>
    </div>
  );
};

export default HomePage;
