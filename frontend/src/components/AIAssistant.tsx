import {
  useRef,
  useState,
  useCallback,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';
import { queryAI, buildHistory } from '../api/client';
import { getFallbackAnswer } from '../services/localAssistant';
import { Send, Accessibility, Trash2, Copy, Check } from 'lucide-react';
import type { RouteData } from '../store';
import SuggestedQuestions from './SuggestedQuestions';

export default function AIAssistant() {
  const { t } = useTranslation();
  const messages = useAppStore((s) => s.messages);
  const isLoading = useAppStore((s) => s.isLoading);
  const accessibleMode = useAppStore((s) => s.accessibleMode);
  const addMessage = useAppStore((s) => s.addMessage);
  const setLoading = useAppStore((s) => s.setLoading);
  const setAccessibleMode = useAppStore((s) => s.setAccessibleMode);
  const setCurrentRoute = useAppStore((s) => s.setCurrentRoute);
  const setCrowdData = useAppStore((s) => s.setCrowdData);
  const clearMessages = useAppStore((s) => s.clearMessages);

  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, []);

  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
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
          const crowd = result.crowdData as { sections?: unknown[]; phase?: string };
          if (crowd.sections) {
            setCrowdData(crowd as Parameters<typeof setCrowdData>[0]);
          }
        }
      } catch {
        // Gemini API unavailable — activate local assistant fallback
        const localReply = getFallbackAnswer(text);
        addMessage({
          role: 'assistant',
          content: localReply,
        });
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    },
    [
      input,
      isLoading,
      addMessage,
      setLoading,
      scrollToBottom,
      messages,
      accessibleMode,
      setCurrentRoute,
      setCrowdData,
    ],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleSuggestedQuestion = useCallback(
    (question: string) => {
      setInput(question);
      inputRef.current?.focus();
    },
    [],
  );

  const handleCopy = useCallback(
    async (id: string, content: string) => {
      try {
        await navigator.clipboard.writeText(content);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      } catch {
        // Clipboard API not available — silently ignore
      }
    },
    [],
  );

  const handleClear = useCallback(() => {
    clearMessages();
  }, [clearMessages]);

  return (
    <section className="ai-panel" aria-label="AI assistant">
      <div className="ai-panel-header">
        <h2 className="panel-title">AI Assistant</h2>
        <div className="ai-panel-actions">
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
          {messages.length > 0 && (
            <button
              type="button"
              className="ai-clear-btn"
              onClick={handleClear}
              aria-label="Clear conversation"
              title="Clear conversation"
            >
              <Trash2 size={15} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div className="ai-messages" aria-live="polite" aria-label="Conversation">
        {messages.length === 0 && (
          <div className="ai-welcome">
            <p>Welcome to StadiumPilot AI. Ask me anything about navigating MetLife Stadium.</p>
            <SuggestedQuestions onSelect={handleSuggestedQuestion} />
          </div>
        )}

        {messages.map((msg) => (
          <article
            key={msg.id}
            className={`message message--${msg.role}`}
            aria-label={`${msg.role === 'user' ? 'You' : 'Assistant'}: ${msg.content}`}
          >
            <div className="message-bubble">
              <p>{msg.content}</p>
              {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                <div className="message-tools" aria-label="Tools used">
                  {msg.toolsUsed.map((tool) => (
                    <span key={tool} className="tool-badge">
                      {tool.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="message-meta">
              <time className="message-time" dateTime={msg.timestamp.toISOString()}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </time>
              {msg.role === 'assistant' && (
                <button
                  type="button"
                  className="message-copy-btn"
                  onClick={() => handleCopy(msg.id, msg.content)}
                  aria-label={copiedId === msg.id ? 'Copied' : 'Copy response'}
                  title={copiedId === msg.id ? 'Copied' : 'Copy response'}
                >
                  {copiedId === msg.id ? (
                    <Check size={12} aria-hidden="true" />
                  ) : (
                    <Copy size={12} aria-hidden="true" />
                  )}
                </button>
              )}
            </div>
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
        <textarea
          ref={inputRef}
          id="ai-input"
          className="ai-input ai-input--textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`${t('dashboard.ask_placeholder')} (Shift+Enter for new line)`}
          disabled={isLoading}
          maxLength={2000}
          aria-label={t('dashboard.ask_placeholder')}
          autoComplete="off"
          rows={1}
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
