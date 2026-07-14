/**
 * SuggestedQuestions.tsx
 * Renders a list of clickable suggested question chips for the AI assistant.
 * Displayed when the conversation is empty to guide users.
 */

import { memo, useCallback } from 'react';

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

const SUGGESTED_QUESTIONS: readonly string[] = [
  'Where is Gate A?',
  'Where can I park?',
  'Nearest restroom?',
  'Food courts nearby?',
  'Medical assistance',
  'Wheelchair access',
  'Lost and Found',
  'Emergency exits',
  'Current crowd status',
  'Stadium rules',
] as const;

function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  const handleClick = useCallback(
    (question: string) => () => onSelect(question),
    [onSelect],
  );

  return (
    <div className="suggested-questions" aria-label="Suggested questions">
      {SUGGESTED_QUESTIONS.map((question) => (
        <button
          key={question}
          type="button"
          className="suggested-question-btn"
          onClick={handleClick(question)}
          aria-label={`Ask: ${question}`}
        >
          {question}
        </button>
      ))}
    </div>
  );
}

export default memo(SuggestedQuestions);
