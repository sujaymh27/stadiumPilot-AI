import {
  useRef,
  useState,
  useCallback,
  useEffect,
  memo,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';
import { queryAI, buildHistory, getApiErrorMessage } from '../api/client';
import { getFallbackAnswer } from '../services/localAssistant';
import { Send, Accessibility, Trash2, Copy, Check } from 'lucide-react';
import SuggestedQuestions from './SuggestedQuestions';

// ─── Sub-components (memoized to avoid re-renders) ────────────────────────

interface ToolBadgesProps {
  tools: string[];
}

const ToolBadges = memo(function ToolBadges({ tools }: ToolBadgesProps) {
  if (tools.length === 0) return null;
  return (
    <div className="message-tools" aria-label="Tools used">
      {tools.map((tool) => (
        <span key={tool} className="tool-badge">
          {tool.replace(/_/g, ' ')}
        </span>
      ))}
    </div>
  );
});

// ─── Main component ───────────────────────────────────────────────────────

function AIAssistant() {
  const { t } = useTranslation();

  // Granular selectors — each component slice re-renders only when its slice changes
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
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom whenever messages change or loading state changes
  useEffect(() => {
    const timer = setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }),
      80
    );
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      const text = input.trim();
      if (!text || isLoading) return;

      setInput('');
      setErrorBanner(null);
      addMessage({ role: 'user', content: text });
      setLoading(true);

      try {
        const history = buildHistory(messages);
        const result = await queryAI({ message: text, history, accessible: accessibleMode });

        addMessage({
          role: 'assistant',
          content: result.reply,
          toolsUsed: result.toolsUsed,
        });

        if (result.routeData) {
          setCurrentRoute(result.routeData);
        }
        if (result.crowdData) {
          setCrowdData(result.crowdData);
        }
      } catch (err) {
        // Surface a user-friendly error and fall back to local assistant
        const apiMsg = getApiErrorMessage(err);
        setErrorBanner(apiMsg);
        const localReply = getFallbackAnswer(text);
        addMessage({
          role: 'assistant',
          content: localReply,
        });
      } finally {
        setLoading(false);
      }
    },
    [
      input,
      isLoading,
      addMessage,
      setLoading,
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
        // Clipboard API unavailable (e.g. non-HTTPS) — silently ignore
      }
    },
    [],
  );

  const handleClear = useCallback(() => clearMessages(), [clearMessages]);

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

      {/* Error banner — shown when API fails */}
      {errorBanner && (
        <div
          className="ai-error-banner"
          role="alert"
          aria-live="assertive"
        >
          <span>{errorBanner}</span>
          <button
            type="button"
            className="ai-error-dismiss"
            onClick={() => setErrorBanner(null)}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

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
              {msg.toolsUsed && <ToolBadges tools={msg.toolsUsed} />}
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

export default memo(AIAssistant);
