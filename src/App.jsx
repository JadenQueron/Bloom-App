import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "linear-gradient(135deg, #c4b5fd 0%, #e879f9 55%, #f9a8d4 100%)",
  card: "#FFFFFF",
  primary: "#D946A8",
  primaryLight: "#FCE4F3",
  secondary: "#7C3AED",
  secondaryLight: "#EDE9FE",
  accent: "#F472B6",
  text: "#1a1528",
  textMuted: "#7c6b8a",
  success: "#10B981",
  border: "#F0E8F8",
};

const WORD_PAIRS = [
  { english: "Water", tagalog: "Tubig", emoji: "💧" },
  { english: "Sun", tagalog: "Araw", emoji: "☀️" },
  { english: "Family", tagalog: "Pamilya", emoji: "👨‍👩‍👧" },
  { english: "Love", tagalog: "Pag-ibig", emoji: "❤️" },
  { english: "Food", tagalog: "Pagkain", emoji: "🍚" },
  { english: "House", tagalog: "Bahay", emoji: "🏠" },
  { english: "Flower", tagalog: "Bulaklak", emoji: "🌸" },
  { english: "Moon", tagalog: "Buwan", emoji: "🌙" },
  { english: "Friend", tagalog: "Kaibigan", emoji: "🤝" },
  { english: "Heart", tagalog: "Puso", emoji: "💗" },
  { english: "Tree", tagalog: "Puno", emoji: "🌳" },
  { english: "Bird", tagalog: "Ibon", emoji: "🐦" },
  { english: "Fish", tagalog: "Isda", emoji: "🐟" },
  { english: "Sky", tagalog: "Langit", emoji: "🌤️" },
  { english: "Star", tagalog: "Bituin", emoji: "⭐" },
];



// Word Match Game
function WordMatchGame({ onProgress }) {
  const [pairs, setPairs] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [elapsed, setElapsed] = useState(null);
  const [shake, setShake] = useState(null);

  useEffect(() => {
    const shuffled = [...WORD_PAIRS].sort(() => Math.random() - 0.5).slice(0, 4);
    const cards = [
      ...shuffled.map((p, i) => ({ id: `en-${i}`, text: p.english, emoji: p.emoji, pairId: i, lang: "english" })),
      ...shuffled.map((p, i) => ({ id: `tl-${i}`, text: p.tagalog, pairId: i, lang: "tagalog" })),
    ].sort(() => Math.random() - 0.5);
    setPairs(cards);
    setStartTime(Date.now());
  }, []);

  const handleSelect = (card) => {
    if (matched.includes(card.pairId) || selected.find((c) => c.id === card.id)) return;
    if (selected.length === 1 && selected[0].lang === card.lang) {
      setShake(card.id);
      setTimeout(() => setShake(null), 500);
      return;
    }
    const newSelected = [...selected, card];
    setSelected(newSelected);
    if (newSelected.length === 2) {
      if (newSelected[0].pairId === newSelected[1].pairId) {
        const newMatched = [...matched, newSelected[0].pairId];
        setMatched(newMatched);
        setSelected([]);
        if (newMatched.length === 4) {
          const time = ((Date.now() - startTime) / 1000).toFixed(1);
          setElapsed(time);
          setCompleted(true);
          onProgress({ type: "wordMatch", time: parseFloat(time) });
        }
      } else {
        setTimeout(() => setSelected([]), 800);
      }
    }
  };

  if (completed) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
        <div style={{ fontSize: "1.5rem", fontWeight: "700", color: COLORS.primary, marginBottom: ".5rem" }}>
          Napakagaling! Amazing!
        </div>
        <div style={{ color: COLORS.textMuted, fontSize: "1.1rem", marginBottom: "1.5rem" }}>
          You matched all words in <strong>{elapsed}s</strong>! 🌟
        </div>
        <button
          onClick={() => { setMatched([]); setSelected([]); setCompleted(false);
            const shuffled = [...WORD_PAIRS].sort(() => Math.random() - 0.5).slice(0, 4);
            const cards = [
              ...shuffled.map((p, i) => ({ id: `en-${i}`, text: p.english, emoji: p.emoji, pairId: i, lang: "english" })),
              ...shuffled.map((p, i) => ({ id: `tl-${i}`, text: p.tagalog, pairId: i, lang: "tagalog" })),
            ].sort(() => Math.random() - 0.5);
            setPairs(cards); setStartTime(Date.now());
          }}
          style={btnStyle(COLORS.primary)}
        >
          Play Again / Maglaro Ulit
        </button>
      </div>
    );
  }

  return (
    <div>
      <p style={{ textAlign: "center", color: COLORS.textMuted, marginBottom: "1rem", fontSize: ".95rem" }}>
        Match each English word with its Tagalog pair! / Itugma ang bawat salita!
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
        {pairs.map((card) => {
          const isSelected = selected.find((c) => c.id === card.id);
          const isMatched = matched.includes(card.pairId);
          const isShaking = shake === card.id;
          return (
            <button
              key={card.id}
              onClick={() => handleSelect(card)}
              style={{
                padding: "1rem .5rem",
                borderRadius: "14px",
                border: `2.5px solid ${isMatched ? COLORS.success : isSelected ? COLORS.primary : COLORS.border}`,
                background: isMatched ? "#EBF7F1" : isSelected ? COLORS.primaryLight : COLORS.card,
                cursor: isMatched ? "default" : "pointer",
                fontFamily: "inherit",
                fontSize: "1rem",
                fontWeight: "600",
                color: isMatched ? COLORS.success : COLORS.text,
                transition: "all .2s",
                animation: isShaking ? "shake .3s" : "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: ".25rem",
              }}
            >
              {card.emoji && <span style={{ fontSize: "1.5rem" }}>{card.emoji}</span>}
              {card.text}
              <span style={{ fontSize: ".7rem", color: COLORS.textMuted, fontWeight: "400" }}>
                {card.lang === "english" ? "English" : "Tagalog"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const SYSTEM_PROMPT = `You are a warm, encouraging speech and cognitive therapy companion named "Bloom" for a woman recovering from brain tumor surgery that affected her communication abilities. She is a Tagalog and English speaker and sometimes has difficulty switching between the two languages.

LANGUAGE RULES — follow these exactly every single message:
- You must alternate strictly: if your previous message was in English, your next must be in Tagalog. If it was in Tagalog, your next must be in English.
- Use ONLY pure English OR pure Tagalog — never mix the two in a single message.
- At the end of EVERY message, add one short line asking her to reply in the opposite language. Examples:
  - (after an English message): "Now try to answer in Tagalog! 🇵🇭"
  - (after a Tagalog message): "Now try to answer in English! 🇺🇸"
- Start your very first message in English.

Your role:
- Have gentle, warm, friendly conversations that exercise her language switching and memory
- Keep sentences SHORT and SIMPLE — no more than 2-3 sentences per message
- Always be positive, patient, and encouraging — never correct harshly
- If she struggles, gently offer the word she might be looking for in the target language
- Ask simple questions about her day, family, food, memories, feelings — familiar topics
- Celebrate every response warmly: in English use "Amazing!", "Well done!", "You're doing great!"; in Tagalog use "Napakagaling!", "Maganda!", "Tama!", "Galing mo!"
- Use emojis occasionally to make it feel warm and fun 🌸
- If she uses the wrong language or mixes, respond kindly as if you understood, then still remind her which language to try next

Keep responses under 60 words always. Be like a kind, patient friend — not a clinical therapist.`;

// AI-powered Conversation
function ConversationGame({ onProgress }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const lastBloomMsgTime = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const startChat = async () => {
    setStarted(true);
    setLoading(true);
    try {
      const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
      console.log("[Bloom] VITE_GEMINI_API_KEY loaded:", geminiKey ? `✅ (${geminiKey.length} chars)` : "❌ undefined");
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: "Please start our conversation with a warm greeting." }] }],
          generationConfig: { maxOutputTokens: 1000 },
        }),
      });
      const data = await res.json();
      console.log("[Bloom] startChat response:", JSON.stringify(data, null, 2));
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Kumusta! Hello! How are you today? 🌸";
      setMessages([{ role: "assistant", content: text }]);
      lastBloomMsgTime.current = Date.now();
    } catch (err) {
      console.error("[Bloom] startChat error:", err);
      setMessages([{ role: "assistant", content: "Kumusta! Hello! I'm so happy to talk with you today! 🌸 How are you feeling?" }]);
    }
    setLoading(false);
  };

  const detectLanguage = async (text) => {
    try {
      const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: `Classify the language of the user's message as exactly one of: "english", "tagalog", or "mixed".
Reply with ONLY that single word, nothing else.
"mixed" means the message contains a meaningful blend of both English and Tagalog words.
If the message is too short to classify (e.g. "yes", "ok", "oo"), use "mixed".` }] },
          contents: [{ role: "user", parts: [{ text }] }],
          generationConfig: { maxOutputTokens: 20 },
        }),
      });
      const data = await res.json();
      const raw = (data.candidates?.[0]?.content?.parts?.[0]?.text || "").trim().toLowerCase();
      if (raw === "english" || raw === "tagalog" || raw === "mixed") return raw;
      return "mixed";
    } catch {
      return "mixed";
    }
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const typingStart = lastBloomMsgTime.current || Date.now();
    const responseTimeSec = parseFloat(((Date.now() - typingStart) / 1000).toFixed(1));
    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const replyRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: newMessages.map(m => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
          generationConfig: { maxOutputTokens: 1000 },
        }),
      });
      const data = await replyRes.json();
      console.log("[Bloom] sendMessage response:", JSON.stringify(data, null, 2));
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maganda! That's wonderful! 🌸";
      setMessages(prev => [...prev, { role: "assistant", content: text }]);
      lastBloomMsgTime.current = Date.now();
      await sleep(500);
      const lang = await detectLanguage(userMsg);
      onProgress({ type: "conversation", responseTime: responseTimeSec, language: lang, message: userMsg });
    } catch (err) {
      console.error("[Bloom] sendMessage error:", err);
      setMessages(prev => [...prev, { role: "assistant", content: "Pasensya na! Sorry, let's try again. 😊" }]);
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  if (!started) {
    return (
      <div style={{ textAlign: "center", padding: "1.5rem 1rem" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🌸</div>
        <div style={{ fontSize: "1.2rem", fontWeight: "700", color: COLORS.text, marginBottom: ".5rem" }}>
          Talk with Bloom
        </div>
        <div style={{ fontSize: ".95rem", color: COLORS.textMuted, marginBottom: ".5rem", lineHeight: 1.6 }}>
          Your friendly AI companion is here to chat in English and Tagalog!
        </div>
        <div style={{ fontSize: ".85rem", color: COLORS.secondary, marginBottom: "1.75rem", fontStyle: "italic" }}>
          Ang iyong kasamahan para sa usapan 💬
        </div>
        <button onClick={startChat} style={btnStyle(COLORS.primary)}>
          Start Talking / Magsalita Na
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "400px" }}>
      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: ".75rem",
        paddingBottom: ".5rem",
        paddingRight: "4px",
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
          }}>
            {msg.role === "assistant" && (
              <div style={{
                width: "30px", height: "30px", borderRadius: "50%",
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: ".9rem", flexShrink: 0, marginRight: ".5rem", marginTop: "2px",
              }} />
            )}
            <div style={{
              maxWidth: "78%",
              padding: ".7rem .9rem",
              borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: msg.role === "user"
                ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`
                : "#F5F0FC",
              color: msg.role === "user" ? "#fff" : COLORS.text,
              fontSize: ".95rem",
              lineHeight: 1.55,
              border: msg.role === "assistant" ? `1.5px solid ${COLORS.border}` : "none",
              boxShadow: "0 2px 8px rgba(0,0,0,.06)",
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "50%",
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".9rem",
            }} />
            <div style={{
              padding: ".6rem .9rem", borderRadius: "16px 16px 16px 4px",
              background: "#F5F0FC", border: `1.5px solid ${COLORS.border}`,
              display: "flex", gap: "4px", alignItems: "center",
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: "7px", height: "7px", borderRadius: "50%",
                  background: COLORS.primary, opacity: 0.7,
                  animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        display: "flex",
        gap: ".5rem",
        paddingTop: ".75rem",
        borderTop: `1.5px solid ${COLORS.border}`,
        marginTop: ".5rem",
      }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Type here / Mag-type dito..."
          style={{
            flex: 1,
            padding: ".75rem 1rem",
            borderRadius: "12px",
            border: `2px solid ${COLORS.border}`,
            fontFamily: "inherit",
            fontSize: ".95rem",
            color: COLORS.text,
            background: "#F5F0FC",
            outline: "none",
          }}
          onFocus={e => e.target.style.borderColor = COLORS.primary}
          onBlur={e => e.target.style.borderColor = COLORS.border}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            background: loading || !input.trim() ? COLORS.border : COLORS.primary,
            color: loading || !input.trim() ? COLORS.textMuted : "#fff",
            border: "none",
            borderRadius: "12px",
            padding: ".75rem 1rem",
            cursor: loading || !input.trim() ? "default" : "pointer",
            fontSize: "1.2rem",
            transition: "all .2s",
            fontFamily: "inherit",
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

// Picture Word Game
function PictureWordGame({ onProgress }) {
  const [current, setCurrent] = useState(() => WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)]);
  const [mode, setMode] = useState(() => Math.random() > 0.5 ? "english" : "tagalog");
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const wrong = WORD_PAIRS.filter(p => p.english !== current.english)
      .sort(() => Math.random() - 0.5).slice(0, 3);
    const all = [...wrong, current].sort(() => Math.random() - 0.5);
    setChoices(all);
  }, [current]);

  const handleAnswer = (choice) => {
    setSelected(choice);
    const correct = choice.english === current.english;
    onProgress({ type: "pictureWord", correct, time: ((Date.now() - startTime) / 1000).toFixed(1) });
  };

  const next = () => {
    setSelected(null);
    const next = WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)];
    setCurrent(next);
    setMode(Math.random() > 0.5 ? "english" : "tagalog");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontSize: "5rem",
        marginBottom: ".5rem",
        filter: "drop-shadow(0 4px 8px rgba(0,0,0,.1))",
        lineHeight: 1,
      }}>
        {current.emoji}
      </div>
      <div style={{ fontSize: ".9rem", color: COLORS.textMuted, marginBottom: "1.25rem" }}>
        {mode === "english" ? "What is this in English?" : "Ano ito sa Tagalog?"}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".65rem", marginBottom: "1rem" }}>
        {choices.map((c) => {
          const label = mode === "english" ? c.english : c.tagalog;
          const isCorrect = c.english === current.english;
          const isSelected = selected?.english === c.english;
          let bg = COLORS.card, border = COLORS.border, color = COLORS.text;
          if (selected) {
            if (isCorrect) { bg = "#EBF7F1"; border = COLORS.success; color = COLORS.success; }
            else if (isSelected) { bg = "#FDE8E8"; border = "#E07070"; color = "#E07070"; }
          }
          return (
            <button key={c.english} onClick={() => !selected && handleAnswer(c)} style={{
              padding: ".9rem .5rem",
              borderRadius: "12px",
              border: `2px solid ${border}`,
              background: bg,
              fontFamily: "inherit",
              fontSize: ".95rem",
              fontWeight: "600",
              color,
              cursor: selected ? "default" : "pointer",
              transition: "all .2s",
            }}>
              {label}
            </button>
          );
        })}
      </div>
      {selected && (
        <div>
          <div style={{ marginBottom: ".75rem", fontSize: "1rem", color: selected.english === current.english ? COLORS.success : COLORS.primary, fontWeight: "600" }}>
            {selected.english === current.english ? "🎉 Tama! Correct!" : `💪 It's "${mode === "english" ? current.english : current.tagalog}" — Keep going!`}
          </div>
          <button onClick={next} style={btnStyle(COLORS.primary)}>
            Next / Susunod →
          </button>
        </div>
      )}
    </div>
  );
}

// Progress View
function ProgressView({ history }) {
  const wordTimes = history.filter(h => h.type === "wordMatch").map(h => h.time);
  const chatMsgs = history.filter(h => h.type === "conversation");
  const pictureCorrect = history.filter(h => h.type === "pictureWord" && h.correct).length;
  const pictureTotal = history.filter(h => h.type === "pictureWord").length;
  const avgWordTime = wordTimes.length ? (wordTimes.reduce((a, b) => a + b, 0) / wordTimes.length).toFixed(1) : null;

  // Language breakdown
  const langCounts = { english: 0, tagalog: 0, mixed: 0 };
  chatMsgs.forEach(m => { if (m.language) langCounts[m.language]++; });
  const totalLang = langCounts.english + langCounts.tagalog + langCounts.mixed;
  const langPct = (k) => totalLang ? Math.round((langCounts[k] / totalLang) * 100) : 0;

  // Response times from chat
  const chatTimes = chatMsgs.filter(m => m.responseTime && m.responseTime > 0 && m.responseTime < 300).map(m => m.responseTime);
  const avgChatTime = chatTimes.length ? (chatTimes.reduce((a, b) => a + b, 0) / chatTimes.length).toFixed(1) : null;
  const recentChatTimes = chatTimes.slice(-8);

  const LANG_COLORS = { english: COLORS.secondary, tagalog: COLORS.primary, mixed: COLORS.accent };
  const LANG_LABELS = { english: "English 🇺🇸", tagalog: "Tagalog 🇵🇭", mixed: "Taglish 🌸" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2rem" }}>📊</div>
        <div style={{ fontSize: "1.1rem", fontWeight: "700", color: COLORS.text }}>Your Progress</div>
        <div style={{ fontSize: ".85rem", color: COLORS.textMuted, fontStyle: "italic" }}>Ang Iyong Progreso · Tuloy lang! 🌸</div>
      </div>

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".65rem" }}>
        {[
          { label: "Chat Messages", value: chatMsgs.length, emoji: "💬", color: COLORS.secondary },
          { label: "Avg Reply Time", value: avgChatTime ? `${avgChatTime}s` : "–", emoji: "⏱️", color: COLORS.primary },
          { label: "Picture Correct", value: pictureTotal ? `${pictureCorrect}/${pictureTotal}` : "–", emoji: "🖼️", color: COLORS.accent },
          { label: "Avg Match Time", value: avgWordTime ? `${avgWordTime}s` : "–", emoji: "🎯", color: COLORS.success },
        ].map((s) => (
          <div key={s.label} style={{
            background: COLORS.card, border: `2px solid ${COLORS.border}`,
            borderRadius: "14px", padding: ".85rem", textAlign: "center",
          }}>
            <div style={{ fontSize: "1.4rem" }}>{s.emoji}</div>
            <div style={{ fontSize: "1.4rem", fontWeight: "800", color: s.color, lineHeight: 1.2 }}>{s.value || "–"}</div>
            <div style={{ fontSize: ".7rem", color: COLORS.textMuted, marginTop: "2px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Language breakdown */}
      {totalLang > 0 && (
        <div style={{ background: COLORS.card, border: `2px solid ${COLORS.border}`, borderRadius: "14px", padding: "1rem" }}>
          <div style={{ fontSize: ".85rem", fontWeight: "700", color: COLORS.text, marginBottom: ".75rem" }}>
            🗣️ Language Used in Chat
          </div>
          {/* Bar */}
          <div style={{ display: "flex", borderRadius: "8px", overflow: "hidden", height: "16px", marginBottom: ".75rem" }}>
            {["english", "tagalog", "mixed"].map(k => langPct(k) > 0 && (
              <div key={k} style={{
                width: `${langPct(k)}%`, background: LANG_COLORS[k],
                transition: "width .5s",
              }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
            {["english", "tagalog", "mixed"].map(k => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: ".3rem", fontSize: ".8rem", color: COLORS.text }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: LANG_COLORS[k], flexShrink: 0 }} />
                <span>{LANG_LABELS[k]}</span>
                <span style={{ fontWeight: "700", color: LANG_COLORS[k] }}>{langPct(k)}%</span>
              </div>
            ))}
          </div>
          {langCounts.tagalog > 0 && (
            <div style={{ marginTop: ".65rem", fontSize: ".8rem", color: COLORS.success, fontWeight: "600" }}>
              {langCounts.tagalog >= langCounts.english
                ? "🇵🇭 Great Tagalog practice! Magaling!"
                : "💪 Keep using Tagalog — Huwag mahiyang magsalita!"}
            </div>
          )}
        </div>
      )}

      {/* Chat response time chart */}
      {recentChatTimes.length > 1 && (
        <div style={{ background: COLORS.card, border: `2px solid ${COLORS.border}`, borderRadius: "14px", padding: "1rem" }}>
          <div style={{ fontSize: ".85rem", fontWeight: "700", color: COLORS.text, marginBottom: ".65rem" }}>
            ⚡ Chat Reply Speed (last {recentChatTimes.length} messages)
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "5px", height: "52px" }}>
            {recentChatTimes.map((t, i) => {
              const maxT = Math.max(...recentChatTimes);
              const h = Math.max(6, (t / maxT) * 48);
              const improving = i > 0 && t < recentChatTimes[i - 1];
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                  <div style={{
                    width: "100%", height: `${h}px`,
                    background: improving ? COLORS.success : COLORS.secondary,
                    borderRadius: "4px 4px 0 0", transition: "height .3s",
                  }} />
                  <div style={{ fontSize: ".6rem", color: COLORS.textMuted }}>{t}s</div>
                </div>
              );
            })}
          </div>
          {recentChatTimes.length > 2 && recentChatTimes[recentChatTimes.length - 1] < recentChatTimes[0] && (
            <div style={{ marginTop: ".5rem", textAlign: "center", color: COLORS.success, fontSize: ".8rem", fontWeight: "600" }}>
              🎉 Replying faster! Bumibilis ang sagot mo!
            </div>
          )}
        </div>
      )}

      {/* Word match chart */}
      {wordTimes.length > 1 && (
        <div style={{ background: COLORS.card, border: `2px solid ${COLORS.border}`, borderRadius: "14px", padding: "1rem" }}>
          <div style={{ fontSize: ".85rem", fontWeight: "700", color: COLORS.text, marginBottom: ".65rem" }}>
            🎯 Word Match Speed
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "5px", height: "52px" }}>
            {wordTimes.map((t, i) => {
              const maxT = Math.max(...wordTimes);
              const h = Math.max(6, (t / maxT) * 48);
              const improving = i > 0 && t < wordTimes[i - 1];
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                  <div style={{ width: "100%", height: `${h}px`, background: improving ? COLORS.success : COLORS.primary, borderRadius: "4px 4px 0 0" }} />
                  <div style={{ fontSize: ".6rem", color: COLORS.textMuted }}>{t}s</div>
                </div>
              );
            })}
          </div>
          {wordTimes[wordTimes.length - 1] < wordTimes[0] && (
            <div style={{ marginTop: ".5rem", textAlign: "center", color: COLORS.success, fontSize: ".8rem", fontWeight: "600" }}>
              🎉 Getting faster! Bumibilis ka na!
            </div>
          )}
        </div>
      )}

      {history.length === 0 && (
        <div style={{ textAlign: "center", color: COLORS.textMuted, padding: "1rem", fontSize: ".9rem", lineHeight: 1.6 }}>
          Start chatting or playing games to see your progress! 🌱<br />
          <span style={{ fontStyle: "italic" }}>Maglaro na para makita ang progreso mo!</span>
        </div>
      )}
    </div>
  );
}

function btnStyle(color) {
  return {
    background: `linear-gradient(135deg, ${color}, #7C3AED)`,
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: ".85rem 1.75rem",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 4px 15px rgba(180,0,160,0.25)",
    letterSpacing: ".2px",
  };
}

const TABS = [
  { id: "chat", label: "Talk" },
  { id: "wordmatch", label: "Match" },
  { id: "picture", label: "Picture" },
  { id: "progress", label: "Progress" },
];

export default function App() {
  const [tab, setTab] = useState("chat");
  const [progressHistory, setProgressHistory] = useState([]);
  const [gameKey, setGameKey] = useState(0);

  const addProgress = (entry) => {
    setProgressHistory(h => [...h, { ...entry, timestamp: Date.now() }]);
  };

  const switchTab = (id) => {
    setTab(id);
    if (id !== "progress") setGameKey(k => k + 1);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.bg,
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingBottom: "90px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        button:active { transform: scale(0.97); }
        * { box-sizing: border-box; }
        input:focus { outline: none; }
      `}</style>

      {/* Header */}
      <div style={{
        width: "100%",
        maxWidth: "480px",
        padding: "2.5rem 1.25rem 1.25rem",
        textAlign: "center",
      }}>
        <div style={{
          fontSize: "2rem",
          fontWeight: "800",
          color: "#fff",
          letterSpacing: "-1px",
          marginBottom: ".35rem",
          textShadow: "0 2px 12px rgba(100,0,100,0.18)",
        }}>
          Bloom
        </div>
        <div style={{
          fontSize: ".9rem",
          color: "rgba(255,255,255,0.82)",
          fontWeight: "400",
          letterSpacing: ".2px",
        }}>
          Your daily mind garden · Ang iyong hardin ng isipan
        </div>
      </div>

      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: "480px",
        padding: "0 1rem",
      }}>
        <div style={{
          background: "rgba(255,255,255,0.97)",
          borderRadius: "24px",
          padding: "1.75rem 1.5rem",
          boxShadow: "0 8px 40px rgba(120,0,180,0.18), 0 2px 8px rgba(0,0,0,0.06)",
          minHeight: "340px",
          backdropFilter: "blur(8px)",
        }}>
          {tab === "chat" && <ConversationGame key={gameKey} onProgress={addProgress} />}
          {tab === "wordmatch" && <WordMatchGame key={gameKey} onProgress={addProgress} />}
          {tab === "picture" && <PictureWordGame key={gameKey} onProgress={addProgress} />}
          {tab === "progress" && <ProgressView history={progressHistory} />}
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(255,255,255,0.97)",
        borderTop: `1.5px solid rgba(200,180,230,0.3)`,
        display: "flex",
        justifyContent: "center",
        padding: ".5rem 0 .85rem",
        backdropFilter: "blur(12px)",
        boxShadow: "0 -4px 20px rgba(120,0,180,0.08)",
      }}>
        <div style={{ display: "flex", gap: "0", maxWidth: "480px", width: "100%" }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => switchTab(t.id)}
              style={{
                flex: 1,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: ".5rem .25rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: ".2rem",
                fontFamily: "inherit",
              }}
            >
              <span style={{
                fontSize: ".7rem",
                fontWeight: tab === t.id ? "700" : "400",
                color: tab === t.id ? COLORS.primary : COLORS.textMuted,
                letterSpacing: ".2px",
              }}>
                {t.label}
              </span>
              {tab === t.id && (
                <div style={{ width: "20px", height: "3px", background: COLORS.primary, borderRadius: "2px" }} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}