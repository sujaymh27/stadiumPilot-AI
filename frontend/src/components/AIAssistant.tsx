import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';
import { queryAI, buildHistory } from '../api/client';
import { Send, Accessibility } from 'lucide-react';
import type { RouteData } from '../store';

export default function AIAssistant() {
  const { t } = useTranslation();
  const messages = useAppStore(s => s.messages);
  const isLoading = useAppStore(s => s.isLoading);
  const accessibleMode = useAppStore(s => s.accessibleMode);
  const addMessage = useAppStore(s => s.addMessage);
  const setLoading = useAppStore(s => s.setLoading);
  const setAccessibleMode = useAppStore(s => s.setAccessibleMode);
  const setCurrentRoute = useAppStore(s => s.setCurrentRoute);
  const setCrowdData = useAppStore(s => s.setCrowdData);

  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    setInput('');
    addMessage({ role: 'user', content: text });
    setLoading(true);
    scrollToBottom();

    try {
      const history = buildHistory(messages);
      const result = await queryAI({ message: text, history, accessible: accessibleMode });

      addMessage({
        role: 'assistant',
        content: result.reply,
        toolsUsed: result.toolsUsed,
      });

      if (result.routeData) {
        setCurrentRoute(result.routeData as RouteData);
      }
      if (result.crowdData) {
        // Partial crowd update from AI tool
        const crowd = result.crowdData as { sections?: unknown[]; phase?: string };
        if (crowd.sections) {
          setCrowdData(crowd as Parameters<typeof setCrowdData>[0]);
        }
      }
    } catch {
      addMessage({
        role: 'assistant',
        content: 'I was unable to process your request. Please try again.',
      });
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const QUICK_PROMPTS = [
    'How do I get to Section 300?',
    'Find the nearest restroom from Gate A',
    'How crowded is Section 110?',
    'How do I get to Penn Station after the match?',
  ];

  return (
    <section className="ai-panel" aria-label="AI assistant">
      <div className="ai-panel-header">
        <h2 className="panel-title">AI Assistant</h2>
        <label className="toggle-label" htmlFor="accessible-toggle">
          <Accessibility size={15} aria-hidden="true" />
          <span>{t('dashboard.accessibility_label')}</span>
          <button
            id="accessible-toggle"
            role="switch"
            aria-checked={accessibleMode}
            className={`toggle ${accessibleMode ? 'toggle--on' : ''}`}
            onClick={() => setAccessibleMode(!accessibleMode)}
          >
            <span className="toggle-thumb" />
          </button>
        </label>
      </div>

      <div className="ai-messages" aria-live="polite" aria-label="Conversation">
        {messages.length === 0 && (
          <div className="ai-welcome">
            <p>Welcome to StadiumPilot AI. Ask me anything about navigating MetLife Stadium.</p>
            <div className="quick-prompts" aria-label="Quick prompts">
              {QUICK_PROMPTS.map((q, i) => (
                <button
                  key={i}
                  className="quick-prompt-btn"
                  onClick={() => { setInput(q); inputRef.current?.focus(); }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <article
            key={msg.id}
            className={`message message--${msg.role}`}
            aria-label={`${msg.role === 'user' ? 'You' : 'Assistant'}: ${msg.content}`}
          >
            <div className="message-bubble">
              <p>{msg.content}</p>
              {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                <div className="message-tools" aria-label="Tools used">
                  {msg.toolsUsed.map(tool => (
                    <span key={tool} className="tool-badge">{tool.replace(/_/g, ' ')}</span>
                  ))}
                </div>
              )}
            </div>
            <time className="message-time" dateTime={msg.timestamp.toISOString()}>
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </time>
          </article>
        ))}

        {isLoading && (
          <div className="message message--assistant" role="status" aria-live="polite">
            <div className="message-bubble">
              <span className="thinking-dots" aria-label={t('dashboard.thinking')}>
                <span /><span /><span />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} aria-hidden="true" />
      </div>

      <form className="ai-form" onSubmit={handleSubmit} aria-label="Ask a question">
        <input
          ref={inputRef}
          id="ai-input"
          type="text"
          className="ai-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('dashboard.ask_placeholder')}
          disabled={isLoading}
          maxLength={2000}
          aria-label={t('dashboard.ask_placeholder')}
          autoComplete="off"
        />
        <button
          type="submit"
          className="ai-send-btn"
          disabled={isLoading || !input.trim()}
          aria-label={t('dashboard.ask_button')}
        >
          <Send size={18} aria-hidden="true" />
        </button>
      </form>
    </section>
  );
}
