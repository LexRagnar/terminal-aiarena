import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Símbolos alienígenas e robóticos para o fundo
const alienSymbols = [
  '⏁', '⏂', '⏃', '⏄', '⏅', '⏆', '⏇', '⏈', '⏉', '⏊', '⏋', '⏌', '⏍', '⏎', '⏏', 
  '⏐', '⏑', '⏒', '⏓', '⏔', '⏕', '⏖', '⏗', '⏘', '⏙', '⏚', '⏛', '⏜', '⏝', '⏞', 
  '⏟', '⏠', '⏡', '⏢', '⏣', '⏤', '⏥', '⏦', '⏧', '⏨', '⏩', '⏪', '⏫', '⏬', '⏭',
  '⎈', '⎉', '⎊', '⎋', '⎌', '⎍', '⎎', '⎏', '⎐', '⎑', '⎒', '⎓', '⎔', '⎕', '⎖', 
  '⎗', '⎘', '⎙', '⎚', '⎛', '⎜', '⎝', '⎞', '⎟', '⎠', '⎡', '⎢', '⎣', '⎤'
];

// Estilos inline para substituir a importação do CSS
const styles = {
  app: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '"Courier New", monospace',
  },
  toggleViewBtn: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    zIndex: 1000,
  },
  adminPanel: {
    backgroundColor: '#1a1a1a',
    borderRadius: '10px',
    padding: '20px',
    marginTop: '20px',
  },
  heading: {
    color: '#ddd',
    textAlign: 'center',
    marginBottom: '30px',
  },
  configSection: {
    backgroundColor: '#222',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  sectionHeading: {
    color: '#ddd',
    marginBottom: '15px',
    borderBottom: '1px solid #444',
    paddingBottom: '10px',
  },
  formGroup: {
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    width: '200px',
    color: '#bbb',
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    border: '1px solid #555',
    color: '#ddd',
    padding: '8px 12px',
    borderRadius: '4px',
  },
  conversationCreator: {
    maxHeight: '600px',
    overflowY: 'auto',
    marginBottom: '20px',
  },
  messageItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: '6px',
    padding: '10px',
    marginBottom: '10px',
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  entityTag: (isEntity1) => ({
    padding: '4px 8px',
    borderRadius: '4px',
    color: 'white',
    backgroundColor: isEntity1 ? '#5F4B86' : '#EA830D', // Cores invertidas
  }),
  messageControl: {
    backgroundColor: '#444',
    color: 'white',
    border: 'none',
    width: '30px',
    height: '30px',
    borderRadius: '15px',
    marginLeft: '5px',
    cursor: 'pointer',
  },
  disabledButton: {
    backgroundColor: '#333',
    cursor: 'not-allowed',
  },
  textarea: {
    width: '100%',
    backgroundColor: '#333',
    border: '1px solid #555',
    color: '#ddd',
    padding: '10px',
    borderRadius: '4px',
    resize: 'vertical',
    fontFamily: '"Courier New", monospace',
    whiteSpace: 'pre-wrap',
  },
  addMessageSection: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  addButton: (isEntity1) => ({
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    color: 'white',
    cursor: 'pointer',
    flex: 1,
    margin: '0 5px',
    backgroundColor: isEntity1 ? '#5F4B86' : '#EA830D', // Cores invertidas
  }),
  terminalContainer: {
    marginTop: '20px',
  },
  terminalControls: {
    display: 'flex',
    justifyContent: 'center',
    margin: '20px 0',
  },
  terminalButton: {
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    margin: '0 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  terminalHeader: {
    backgroundColor: '#000',
    padding: '10px 20px',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  terminalTitle: {
    color: '#0f0',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  terminal: {
    height: '70vh',
    backgroundColor: '#000',
    borderBottomLeftRadius: '10px',
    borderBottomRightRadius: '10px',
    overflow: 'hidden',
    position: 'relative',
  },
  matrixBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
  },
  conversationDisplay: {
    padding: '20px',
    overflowY: 'auto',
    height: '100%',
    position: 'relative',
    zIndex: 2,
  },
  message: {
    marginBottom: '20px',
    opacity: 0.9,
  },
  messageSender: (isEntity1) => ({
    fontWeight: 'bold',
    marginBottom: '5px',
    color: isEntity1 ? '#5F4B86' : '#EA830D', // Cores invertidas
  }),
  messageContent: (isEntity1) => ({
    padding: '5px 0',
    lineHeight: 1.5,
    color: isEntity1 ? '#5F4B86' : '#EA830D', // Cores invertidas
    textShadow: isEntity1 
      ? '0 0 10px rgba(95, 75, 134, 0.4)' 
      : '0 0 10px rgba(234, 131, 13, 0.4)',
    fontFamily: '"Courier New", monospace',
    whiteSpace: 'pre-wrap',
  }),
};

// Componente MatrixBackground para criar efeito Matrix com símbolos alienígenas
const MatrixBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const cols = Math.floor(canvas.width / 20);
    const ypos = Array(cols).fill(0);
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    function matrix() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0f0';
      ctx.font = '15px monospace';
      
      ypos.forEach((y, ind) => {
        // Usar símbolos alienígenas em vez de caracteres ASCII aleatórios
        const symbolIndex = Math.floor(Math.random() * alienSymbols.length);
        const text = alienSymbols[symbolIndex];
        const x = ind * 20;
        ctx.fillText(text, x, y);
        if (y > 100 + Math.random() * 10000) {
          ypos[ind] = 0;
        } else {
          ypos[ind] = y + 20;
        }
      });
    }
    
    const matrixInterval = setInterval(matrix, 100);
    
    return () => {
      clearInterval(matrixInterval);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        opacity: 0.15
      }} 
    />
  );
};

// Componente principal
const App = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [entity1Name, setEntity1Name] = useState('Entidade 1');
  const [entity2Name, setEntity2Name] = useState('Entidade 2');
  const [terminalName, setTerminalName] = useState('Matrix Terminal');
  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [conversation, setConversation] = useState([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [typedChars, setTypedChars] = useState([]);
  
  // Referência para o último textarea adicionado
  const lastTextareaRef = useRef(null);
  const animationRef = useRef(null);
  const conversationDisplayRef = useRef(null);
  const cursorRef = useRef(null);

  // Inicializar efeito do cursor piscante
  useEffect(() => {
    cursorRef.current = setInterval(() => {
      const cursor = document.querySelector('.cursor');
      if (cursor) {
        cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
      }
    }, 500);
    
    return () => {
      if (cursorRef.current) {
        clearInterval(cursorRef.current);
      }
    };
  }, []);

  // Adicionar nova mensagem e focar na caixa de texto
  const addMessage = (entity, text) => {
    const newConversation = [...conversation, { entity, text, id: Date.now() }];
    setConversation(newConversation);
  };

  // Efeito para focar na última caixa de texto adicionada
  useEffect(() => {
    if (conversation.length > 0 && lastTextareaRef.current) {
      // Focar na última caixa de texto
      lastTextareaRef.current.focus();
      
      // Rolar para a última mensagem
      const conversationCreator = document.querySelector('[data-conversation-creator]');
      if (conversationCreator) {
        conversationCreator.scrollTop = conversationCreator.scrollHeight;
      }
    }
  }, [conversation.length]);

  // Remover mensagem
  const removeMessage = (index) => {
    const newConversation = [...conversation];
    newConversation.splice(index, 1);
    setConversation(newConversation);
  };

  // Iniciar animação
  const startAnimation = () => {
    if (conversation.length === 0) return;
    
    if (isPaused) {
      // Se pausado, apenas despausar
      setIsPaused(false);
      setIsAnimating(true);
    } else {
      // Se não pausado, iniciar do começo
      setIsAnimating(true);
      setCurrentMessageIndex(0);
      setCurrentCharIndex(0);
      setDisplayedText('');
      setTypedChars([]);
    }
  };

  // Pausar animação
  const pauseAnimation = () => {
    setIsPaused(true);
    setIsAnimating(false);
  };

  // Parar animação completamente
  const stopAnimation = () => {
    setIsAnimating(false);
    setIsPaused(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  // Reiniciar animação
  const restartAnimation = () => {
    stopAnimation();
    setCurrentMessageIndex(0);
    setCurrentCharIndex(0);
    setDisplayedText('');
    setTypedChars([]);
    startAnimation();
  };

  // Trocar entre Admin e Terminal
  const toggleView = () => {
    setIsAdmin(!isAdmin);
    if (!isAdmin) {
      stopAnimation();
    }
  };

  // Mover mensagem para cima na ordem
  const moveMessageUp = (index) => {
    if (index === 0) return;
    const newConversation = [...conversation];
    const temp = newConversation[index];
    newConversation[index] = newConversation[index - 1];
    newConversation[index - 1] = temp;
    setConversation(newConversation);
  };

  // Mover mensagem para baixo na ordem
  const moveMessageDown = (index) => {
    if (index === conversation.length - 1) return;
    const newConversation = [...conversation];
    const temp = newConversation[index];
    newConversation[index] = newConversation[index + 1];
    newConversation[index + 1] = temp;
    setConversation(newConversation);
  };

  // Efeito de digitação com fade-in de branco para a cor
  useEffect(() => {
    if (!isAnimating) return;

    const currentMessage = conversation[currentMessageIndex];
    if (!currentMessage) {
      setIsAnimating(false);
      return;
    }

    if (currentCharIndex < currentMessage.text.length) {
      animationRef.current = setTimeout(() => {
        const newChar = currentMessage.text[currentCharIndex];
        
        // Adiciona caractere à lista com um ID único
        setTypedChars(prev => [
          ...prev, 
          {
            char: newChar,
            id: `${currentMessageIndex}-${currentCharIndex}`,
            timestamp: Date.now()
          }
        ]);
        
        setDisplayedText(prev => prev + newChar);
        setCurrentCharIndex(currentCharIndex + 1);
        
        // Rolagem automática
        if (conversationDisplayRef.current) {
          conversationDisplayRef.current.scrollTop = conversationDisplayRef.current.scrollHeight;
        }
      }, animationSpeed);
    } else {
      animationRef.current = setTimeout(() => {
        setCurrentMessageIndex(currentMessageIndex + 1);
        setCurrentCharIndex(0);
        setDisplayedText('');
        setTypedChars([]);
      }, 1000);
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isAnimating, currentMessageIndex, currentCharIndex, conversation, animationSpeed]);

  return (
    <div style={styles.app}>
      <button 
        style={styles.toggleViewBtn} 
        onClick={toggleView}
      >
        {isAdmin ? 'Ver Terminal' : 'Voltar para Admin'}
      </button>

      {isAdmin ? (
        <div style={styles.adminPanel}>
          <h1 style={styles.heading}>Configuração do Terminal</h1>
          
          <div style={styles.configSection}>
            <h2 style={styles.sectionHeading}>Configurações Gerais</h2>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nome do Terminal:</label>
              <input 
                style={styles.input}
                type="text" 
                value={terminalName} 
                onChange={(e) => setTerminalName(e.target.value)} 
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nome da Entidade 1:</label>
              <input 
                style={styles.input}
                type="text" 
                value={entity1Name} 
                onChange={(e) => setEntity1Name(e.target.value)} 
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nome da Entidade 2:</label>
              <input 
                style={styles.input}
                type="text" 
                value={entity2Name} 
                onChange={(e) => setEntity2Name(e.target.value)} 
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Velocidade da Animação (ms):</label>
              <input 
                style={styles.input}
                type="number" 
                value={animationSpeed} 
                onChange={(e) => setAnimationSpeed(Number(e.target.value))} 
                min="10" 
                max="200" 
              />
            </div>
          </div>

          <div style={styles.configSection}>
            <h2 style={styles.sectionHeading}>Mensagens da Conversa</h2>
            <div 
              style={styles.conversationCreator}
              data-conversation-creator="true"
            >
              {conversation.map((msg, index) => (
                <div key={msg.id || index} style={styles.messageItem}>
                  <div style={styles.messageHeader}>
                    <span style={styles.entityTag(msg.entity === 'entity1')}>
                      {msg.entity === 'entity1' ? entity1Name : entity2Name}
                    </span>
                    <div>
                      <button 
                        style={{
                          ...styles.messageControl,
                          ...(index === 0 ? styles.disabledButton : {})
                        }} 
                        onClick={() => moveMessageUp(index)} 
                        disabled={index === 0}
                      >
                        ↑
                      </button>
                      <button 
                        style={{
                          ...styles.messageControl,
                          ...(index === conversation.length - 1 ? styles.disabledButton : {})
                        }} 
                        onClick={() => moveMessageDown(index)} 
                        disabled={index === conversation.length - 1}
                      >
                        ↓
                      </button>
                      <button 
                        style={styles.messageControl} 
                        onClick={() => removeMessage(index)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <textarea 
                    ref={index === conversation.length - 1 ? lastTextareaRef : null}
                    style={styles.textarea}
                    value={msg.text} 
                    onChange={(e) => {
                      const newConversation = [...conversation];
                      newConversation[index].text = e.target.value;
                      setConversation(newConversation);
                    }}
                    rows="3"
                  />
                </div>
              ))}
            </div>
            
            <div style={styles.addMessageSection}>
              <button 
                style={styles.addButton(true)} 
                onClick={() => addMessage('entity1', '')}
              >
                Adicionar Mensagem para {entity1Name}
              </button>
              <button 
                style={styles.addButton(false)} 
                onClick={() => addMessage('entity2', '')}
              >
                Adicionar Mensagem para {entity2Name}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.terminalContainer}>
          <div style={styles.terminalHeader}>
            <div style={styles.terminalTitle}>{terminalName}</div>
          </div>
          
          <div style={styles.terminal}>
            <MatrixBackground />
            
            <div 
              style={styles.conversationDisplay}
              ref={conversationDisplayRef}
            >
              {conversation.slice(0, currentMessageIndex).map((msg, index) => (
                <div key={msg.id || index} style={styles.message}>
                  <div style={styles.messageSender(msg.entity === 'entity1')}>
                    {msg.entity === 'entity1' ? entity1Name : entity2Name}:
                  </div>
                  <div style={styles.messageContent(msg.entity === 'entity1')}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {(isAnimating || isPaused) && currentMessageIndex < conversation.length && (
                <div style={styles.message}>
                  <div style={styles.messageSender(conversation[currentMessageIndex].entity === 'entity1')}>
                    {conversation[currentMessageIndex].entity === 'entity1' ? entity1Name : entity2Name}:
                  </div>
                  <div style={{
                    ...styles.messageContent(conversation[currentMessageIndex].entity === 'entity1'),
                    position: 'relative'
                  }}>
                    {/* Implementação com fade-in de caracteres individuais */}
                    {typedChars.map((charObj) => (
                      <span key={charObj.id} className="typed-char">
                        {charObj.char}
                      </span>
                    ))}
                    <span className="cursor">|</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div style={styles.terminalControls}>
            <button style={styles.terminalButton} onClick={restartAnimation}>
              Reiniciar
            </button>
            
            <button 
              style={styles.terminalButton} 
              onClick={isAnimating ? pauseAnimation : startAnimation}
            >
              {isAnimating ? 'Pausar' : isPaused ? 'Continuar' : 'Iniciar'}
            </button>
            
            <button style={styles.terminalButton} onClick={stopAnimation}>
              Parar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;