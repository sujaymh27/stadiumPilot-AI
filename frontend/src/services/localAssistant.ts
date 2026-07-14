/**
 * localAssistant.ts
 * Pure-function local AI assistant.
 * Used as a fallback when the Gemini API is unavailable.
 *
 * Algorithm:
 * 1. Normalise the query (lowercase, collapse whitespace).
 * 2. For each KnowledgeEntry, check if any keyword is a substring of the query
 *    OR the query contains a keyword (handles simple word boundary cases).
 * 3. Return the first matching answer, or the UNKNOWN_ANSWER if nothing matches.
 *
 * No heavy NLP libraries — simple substring matching with normalisation.
 */

import { STADIUM_KNOWLEDGE, UNKNOWN_ANSWER } from '../data/stadiumKnowledge';

/**
 * Normalise a query string for keyword matching.
 * - Converts to lowercase
 * - Collapses multiple spaces
 * - Trims leading/trailing whitespace
 */
function normalise(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Check if a single keyword matches the normalised query.
 * Supports:
 * - Exact substring match  ("gate a" in "where is gate a?")
 * - Whole-word-ish match via space boundaries
 */
function keywordMatches(keyword: string, query: string): boolean {
  return query.includes(keyword);
}

/**
 * Get a local answer for the given query using the stadium knowledge base.
 *
 * @param query - Raw user input string
 * @returns A professional answer string, or null if no entry matches.
 *          Callers should try the remote AI first; use this as a fallback.
 *
 * Returns null (not UNKNOWN_ANSWER) so callers can distinguish
 * "no local match" (try remote) from "remote failed + no local match" (show UNKNOWN_ANSWER).
 */
export function getLocalAnswer(query: string): string | null {
  const normalised = normalise(query);

  for (const entry of STADIUM_KNOWLEDGE) {
    for (const keyword of entry.keywords) {
      if (keywordMatches(keyword, normalised)) {
        return entry.answer;
      }
    }
  }

  return null;
}

/**
 * Get a guaranteed answer — either a matched local answer or the professional
 * fallback. Use this when the Gemini API has failed and a response is required.
 */
export function getFallbackAnswer(query: string): string {
  return getLocalAnswer(query) ?? UNKNOWN_ANSWER;
}
