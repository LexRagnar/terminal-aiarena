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

// Estilos inline atualizados com novos elementos para voz
const styles = {
  // ... (todos os estilos anteriores permanecem iguais)
  
  // Novos estilos para controles de voz
  voiceControl: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#2a2a2a',
    borderRadius: '5px',
  },
  voiceSettings: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  voiceSliderContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  voiceSlider: {
    flex: 1,
    height: '4px',
    WebkitAppearance: 'none',
    background: '#444',
    borderRadius: '2px',
    outline: 'none',
  },
  voiceTestButton: {
    backgroundColor: '#5F4B86',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'all 0.3s ease',
  },
  audioVisualizer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    height: '30px',
    margin: '10px 0',
  },
  audioBar: {
    width: '3px',
    backgroundColor: '#5F4B86',
    borderRadius: '1px',
  },
  voiceIndicator: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    marginRight: '8px',
    transition: 'all 0.3s ease',
  },
  muteButton: {
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
};

// Continua na próxima parte...

// Componente principal App
const App = () => {
  // Estados originais
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

  // Novos estados para voz
  const [availableVoices, setAvailableVoices] = useState([]);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [entity1Voice, setEntity1Voice] = useState(null);
  const [entity2Voice, setEntity2Voice] = useState(null);
  const [entity1Pitch, setEntity1Pitch] = useState(0.7);
  const [entity2Pitch, setEntity2Pitch] = useState(1.3);
  const [entity1Rate, setEntity1Rate] = useState(0.9);
  const [entity2Rate, setEntity2Rate] = useState(1.1);
  const [isMuted, setIsMuted] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [currentSpeakingEntity, setCurrentSpeakingEntity] = useState(null);

  // Referências
  const lastTextareaRef = useRef(null);
  const animationRef = useRef(null);
  const conversationDisplayRef = useRef(null);
  const cursorRef = useRef(null);
  const speechSynthRef = useRef(window.speechSynthesis);
  const currentUtteranceRef = useRef(null);

  // Efeito para carregar vozes disponíveis
  useEffect(() => {
    const loadVoices = () => {
      const synth = speechSynthRef.current;
      const voices = synth.getVoices();
      
      if (voices.length > 0) {
        setAvailableVoices(voices);
        setVoicesLoaded(true);
        
        // Configurar vozes padrão
        const defaultVoices = selectDefaultVoices(voices);
        setEntity1Voice(defaultVoices.entity1Voice);
        setEntity2Voice(defaultVoices.entity2Voice);
      }
    };
    
    loadVoices();
    speechSynthRef.current.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthRef.current.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  // Função para selecionar vozes padrão
  const selectDefaultVoices = (voices) => {
    const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
    const allVoices = englishVoices.length > 1 ? englishVoices : voices;
    
    let entity1Voice = allVoices.find(voice => 
      voice.name.toLowerCase().includes('male') && 
      (voice.name.toLowerCase().includes('deep') || voice.name.toLowerCase().includes('low'))
    );
    
    let entity2Voice = allVoices.find(voice => 
      voice.name.toLowerCase().includes('robot') || 
      (voice.name.toLowerCase().includes('female') && !voice.name.toLowerCase().includes('deep'))
    );
    
    if (!entity1Voice) {
      entity1Voice = allVoices.find(v => v.name.includes('Male')) || allVoices[0];
    }
    
    if (!entity2Voice || entity2Voice === entity1Voice) {
      entity2Voice = allVoices.find(v => v !== entity1Voice) || allVoices[allVoices.length > 1 ? 1 : 0];
    }
    
    return { entity1Voice, entity2Voice };
  };

  // Função para falar texto
  const speakText = (text, isEntity1) => {
    if (!isVoiceEnabled || isMuted || !window.speechSynthesis) return;
    
    const synth = speechSynthRef.current;
    
    if (currentUtteranceRef.current) {
      synth.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    currentUtteranceRef.current = utterance;
    
    if (isEntity1) {
      utterance.voice = entity1Voice;
      utterance.pitch = entity1Pitch;
      utterance.rate = entity1Rate;
      setCurrentSpeakingEntity('entity1');
    } else {
      utterance.voice = entity2Voice;
      utterance.pitch = entity2Pitch;
      utterance.rate = entity2Rate;
      setCurrentSpeakingEntity('entity2');
    }
    
    utterance.onend = () => {
      currentUtteranceRef.current = null;
      setCurrentSpeakingEntity(null);
    };
    
    synth.speak(utterance);
  };

  // Função para testar voz
  const testVoice = (isEntity1) => {
    const testText = isEntity1 
      ? `Iniciando teste de voz para ${entity1Name}. Esta é uma simulação de diálogo futurista.`
      : `Iniciando teste de voz para ${entity2Name}. Esta é uma simulação de diálogo futurista.`;
    
    speakText(testText, isEntity1);
  };

  // Continua na próxima parte...

    // JSX do componente
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
            
            {/* Seção de Configurações Gerais */}
            <div style={styles.configSection}>
              <h2 style={styles.sectionHeading}>Configurações Gerais</h2>
              {/* ... configurações gerais existentes ... */}
            </div>
  
            {/* Nova Seção: Configuração de Voz */}
            <div style={styles.configSection}>
              <h2 style={styles.sectionHeading}>Configuração de Voz</h2>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Ativar Vozes:</label>
                <input 
                  type="checkbox"
                  checked={isVoiceEnabled}
                  onChange={(e) => setIsVoiceEnabled(e.target.checked)}
                  style={{width: '20px', height: '20px'}}
                />
              </div>
              
              {isVoiceEnabled && (
                <>
                  {/* Configurações de Voz para Entidade 1 */}
                  <div style={styles.voiceSettings}>
                    <h3 style={{...styles.sectionHeading, fontSize: '16px'}}>
                      Voz de {entity1Name}
                    </h3>
                    
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Selecionar Voz:</label>
                      <select
                        style={styles.input}
                        value={entity1Voice ? availableVoices.indexOf(entity1Voice) : ''}
                        onChange={(e) => setEntity1Voice(availableVoices[Number(e.target.value)])}
                      >
                        {availableVoices.map((voice, index) => (
                          <option key={`voice1-${index}`} value={index}>
                            {voice.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div style={styles.voiceSliderContainer}>
                      <label style={styles.label}>Tom:</label>
                      <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={entity1Pitch}
                        onChange={(e) => setEntity1Pitch(Number(e.target.value))}
                        style={styles.voiceSlider}
                      />
                      <span style={styles.sliderValue}>{entity1Pitch}</span>
                    </div>
                    
                    <button 
                      className="voice-test-button"
                      style={styles.voiceTestButton}
                      onClick={() => testVoice(true)}
                    >
                      Testar Voz de {entity1Name}
                    </button>
                  </div>
  
                  {/* Configurações de Voz para Entidade 2 */}
                  <div style={styles.voiceSettings}>
                    <h3 style={{...styles.sectionHeading, fontSize: '16px'}}>
                      Voz de {entity2Name}
                    </h3>
                    
                    {/* ... configurações similares para Entidade 2 ... */}
                  </div>
                </>
              )}
            </div>
  
            {/* Seção de Mensagens */}
            <div style={styles.configSection}>
              <h2 style={styles.sectionHeading}>Mensagens da Conversa</h2>
              {/* ... código existente das mensagens ... */}
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
                {/* Mensagens anteriores */}
                {conversation.slice(0, currentMessageIndex).map((msg, index) => (
                  <div key={msg.id || index} style={styles.message}>
                    <div style={styles.messageSender(msg.entity === 'entity1')}>
                      {currentSpeakingEntity === msg.entity && (
                        <span className="voice-indicator voice-active"></span>
                      )}
                      {msg.entity === 'entity1' ? entity1Name : entity2Name}:
                    </div>
                    <div style={styles.messageContent(msg.entity === 'entity1')}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                
                {/* Mensagem atual sendo digitada */}
                {(isAnimating || isPaused) && currentMessageIndex < conversation.length && (
                  <div style={styles.message}>
                    <div style={styles.messageSender(conversation[currentMessageIndex].entity === 'entity1')}>
                      {currentSpeakingEntity === conversation[currentMessageIndex].entity && (
                        <span className="voice-indicator voice-active"></span>
                      )}
                      {conversation[currentMessageIndex].entity === 'entity1' ? entity1Name : entity2Name}:
                    </div>
                    <div style={{
                      ...styles.messageContent(conversation[currentMessageIndex].entity === 'entity1'),
                      position: 'relative'
                    }}>
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
            
            {/* Controles do Terminal */}
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
  
              {/* Botão de Mudo */}
              {isVoiceEnabled && (
                <div className={isMuted ? "muted" : ""}>
                  <button 
                    className="mute-button"
                    style={styles.terminalButton} 
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? '🔇 Ativar Som' : '🔊 Silenciar'}
                  </button>
                </div>
              )}
            </div>
  
            {/* Visualizador de Áudio */}
            {isVoiceEnabled && isAnimating && !isMuted && currentSpeakingEntity && (
              <div className={`audio-visualizer speaking-${currentSpeakingEntity}`}>
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={`bar-${i}`} 
                    className="audio-bar" 
                    style={{
                      animationDelay: `${i * 0.05}s`,
                      height: `${20 + Math.random() * 80}%`
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  export default App;