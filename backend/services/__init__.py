import os
import requests
import logging
from typing import List, Dict, Optional
from prompts import SYSTEM_PROMPT
from config import Config


logger = logging.getLogger(__name__)


class OpenRouterService:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        self.model = Config.DEFAULT_MODEL
        self.fallback_models = Config.FALLBACK_MODELS
        self.conversation_history: List[Dict[str, str]] = []
        self.max_history = Config.MAX_HISTORY

    def add_to_history(self, role: str, content: str):
        """Add message to conversation history"""
        self.conversation_history.append({"role": role, "content": content})

        # Keep only last max_history messages
        if len(self.conversation_history) > self.max_history:
            self.conversation_history = self.conversation_history[-self.max_history:]

    def clear_history(self):
        """Clear conversation history"""
        self.conversation_history = []

    def get_chat_response(self, user_message: str, mode: str = "casual") -> Dict:
        """Get response from OpenRouter API"""
        if not self.api_key:
            logger.error("OPENROUTER_API_KEY is not configured")
            return {
                "reply": "I cannot connect to the AI tutor right now because the API key is missing.",
                "correction": "Please add OPENROUTER_API_KEY in backend/.env and restart the backend.",
                "score": {"grammar": 0, "fluency": 0, "confidence": 0}
            }

        try:
            # Add user message to history
            self.add_to_history("user", user_message)

            # Prepare messages for API
            mode_instructions = self._build_mode_instruction(mode)
            messages = [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "system", "content": mode_instructions},
                *self.conversation_history
            ]

            result = self._call_openrouter_with_fallback(messages)

            # Extract the reply
            if result.get("choices") and len(result["choices"]) > 0:
                reply = result["choices"][0]["message"]["content"]
                reply = self._shorten_reply(reply)

                # Add assistant response to history
                self.add_to_history("assistant", reply)

                # Generate scores based on user message
                scores = self._generate_scores(user_message)

                return {
                    "reply": reply,
                    "correction": self._extract_correction(reply),
                    "score": scores
                }
            else:
                raise Exception("No response from API")

        except Exception as e:
            logger.exception("OpenRouter chat failed: %s", str(e))
            return {
                "reply": "I had a temporary connection issue with the AI service. Please try again in a moment.",
                "correction": "If this keeps happening, verify your OpenRouter API key and internet connection.",
                "score": {"grammar": 0, "fluency": 0, "confidence": 0}
            }

    def _call_openrouter_with_fallback(self, messages: List[Dict[str, str]]) -> Dict:
        """Try primary and fallback models before failing."""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "VoiceBot Pro",
        }

        model_candidates = [self.model, *self.fallback_models]
        last_error: Optional[Exception] = None

        for model_name in model_candidates:
            try:
                payload = {
                    "model": model_name,
                    "messages": messages,
                    "temperature": Config.TEMPERATURE,
                    "max_tokens": Config.MAX_TOKENS,
                }
                response = requests.post(
                    self.base_url,
                    headers=headers,
                    json=payload,
                    timeout=Config.API_TIMEOUT,
                )
                response.raise_for_status()
                return response.json()
            except requests.RequestException as exc:
                last_error = exc
                response_text = ""
                if exc.response is not None:
                    response_text = exc.response.text[:500]
                logger.warning(
                    "OpenRouter request failed with model '%s': %s | response: %s",
                    model_name,
                    str(exc),
                    response_text,
                )

        raise Exception("All OpenRouter model attempts failed") from last_error

    def _generate_scores(self, message: str) -> Dict[str, int]:
        """Generate basic scores for the user message"""
        # Simple heuristic scoring
        grammar_score = min(10, 5 + len(message) // 20)
        fluency_score = min(10, 4 + len(message) // 25)
        confidence_score = min(10, 6 + len(message) // 30)

        return {
            "grammar": max(1, grammar_score),
            "fluency": max(1, fluency_score),
            "confidence": max(1, confidence_score)
        }

    def _extract_correction(self, reply: str) -> Optional[str]:
        """Extract correction suggestion from reply if present"""
        # Look for correction patterns in the reply
        if "should be" in reply.lower() or "correct" in reply.lower():
            return reply
        return None

    def _build_mode_instruction(self, mode: str) -> str:
        """Build a compact instruction for the selected conversation mode."""
        mode_map = {
            "casual": "Use casual daily English.",
            "interview": "Simulate a job interview and ask interview-style follow-up questions.",
            "travel": "Use travel-related vocabulary and practical scenarios.",
            "tech": "Use workplace and software/tech communication vocabulary.",
            "daily": "Use practical daily-life topics and short speaking drills.",
        }
        selected = mode_map.get(mode, mode_map["casual"])
        return (
            f"Conversation mode: {mode}. {selected} "
            "Keep every response to 1-2 short sentences, plus one short follow-up question. "
            "Do not write long explanations."
        )

    def _shorten_reply(self, reply: str) -> str:
        """Enforce concise output for a better voice UX."""
        clean = " ".join(reply.split())
        if len(clean) <= Config.MAX_REPLY_CHARS:
            return clean

        # Keep at most first two sentences when available.
        sentence_candidates = clean.replace("?", ".").replace("!", ".").split(".")
        sentence_candidates = [segment.strip() for segment in sentence_candidates if segment.strip()]
        if sentence_candidates:
            two_sentences = ". ".join(sentence_candidates[:2]).strip()
            if two_sentences and len(two_sentences) <= Config.MAX_REPLY_CHARS:
                return f"{two_sentences}."

        return f"{clean[: Config.MAX_REPLY_CHARS - 1].rstrip()}."




