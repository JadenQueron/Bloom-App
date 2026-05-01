import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import AuthScreen from "./AuthScreen";

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
      const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      console.log("[Bloom] VITE_ANTHROPIC_API_KEY loaded:", anthropicKey ? `✅ (${anthropicKey.length} chars)` : "❌ undefined");
      const data = await claudeCall({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: "Please start our conversation with a warm greeting." }],
      });
      console.log("[Bloom] startChat response:", JSON.stringify(data, null, 2));
      const text = data.content?.[0]?.text || "Kumusta! Hello! How are you today? 🌸";
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
      const data = await claudeCall({
        model: "claude-sonnet-4-20250514",
        max_tokens: 20,
        system: `Classify the language of the user's message as exactly one of: "english", "tagalog", or "mixed".
Reply with ONLY that single word, nothing else.
"mixed" means the message contains a meaningful blend of both English and Tagalog words.
If the message is too short to classify (e.g. "yes", "ok", "oo"), use "mixed".`,
        messages: [{ role: "user", content: text }],
      });
      const raw = (data.content?.[0]?.text || "").trim().toLowerCase();
      if (raw === "english" || raw === "tagalog" || raw === "mixed") return raw;
      return "mixed";
    } catch {
      return "mixed";
    }
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const claudeCall = async (body) => {
    const key = import.meta.env.VITE_ANTHROPIC_API_KEY;
    const url = "https://api.anthropic.com/v1/messages";
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    };
    let res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
    if (res.status === 429) {
      console.warn("[Bloom] 429 rate limit hit — waiting 30s before retry");
      setMessages(prev => [...prev, { role: "assistant", content: "Give me a moment to think... 🌸" }]);
      await sleep(30000);
      res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
    }
    return res.json();
  };

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
      const data = await claudeCall({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: newMessages.map(m => ({ role: m.role, content: m.content })),
      });
      console.log("[Bloom] sendMessage response:", JSON.stringify(data, null, 2));
      const text = data.content?.[0]?.text || "Maganda! That's wonderful! 🌸";
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

// Progress View — calendar-based
function ProgressView({ history }) {
  const [viewTab, setViewTab] = useState("monthly");
  const [selectedDay, setSelectedDay] = useState(null);
  const [calDate, setCalDate] = useState(() => new Date());

  const today = new Date();
  const todayStr = today.toLocaleDateString("en-CA"); // YYYY-MM-DD

  // Group all entries by local date string YYYY-MM-DD
  const byDate = {};
  history.forEach(entry => {
    const d = new Date(entry.timestamp).toLocaleDateString("en-CA");
    if (!byDate[d]) byDate[d] = [];
    byDate[d].push(entry);
  });

  const dayActivityColor = (count) => {
    if (count === 0) return { bg: "#EDE9FE", text: "#a89cc0" };
    if (count <= 2) return { bg: "#BBF7D0", text: "#065f46" };
    return { bg: "#10B981", text: "#fff" };
  };

  const iconBtn = {
    background: COLORS.primaryLight,
    border: "none",
    borderRadius: "8px",
    width: "28px",
    height: "28px",
    cursor: "pointer",
    fontSize: "1rem",
    color: COLORS.primary,
    fontWeight: "700",
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  // ── MONTHLY ──────────────────────────────────────────────────────────────
  const renderMonthly = () => {
    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    const firstDow = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthLabel = calDate.toLocaleString("en-US", { month: "long", year: "numeric" });

    const cells = [];
    for (let i = 0; i < firstDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return (
      <>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".75rem" }}>
          <button style={iconBtn} onClick={() => setCalDate(new Date(year, month - 1, 1))}>‹</button>
          <span style={{ fontWeight: "700", color: COLORS.text, fontSize: ".92rem" }}>{monthLabel}</span>
          <button style={iconBtn} onClick={() => setCalDate(new Date(year, month + 1, 1))}>›</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "3px", marginBottom: "3px" }}>
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: ".6rem", color: COLORS.textMuted, fontWeight: "600", paddingBottom: "2px" }}>
              {d}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "3px" }}>
          {cells.map((d, i) => {
            if (d === null) return <div key={`e${i}`} />;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            const count = (byDate[dateStr] || []).length;
            const { bg, text } = dayActivityColor(count);
            const isToday = dateStr === todayStr;
            const isSel = dateStr === selectedDay;
            return (
              <div
                key={dateStr}
                onClick={() => { setSelectedDay(dateStr); setViewTab("daily"); }}
                style={{
                  aspectRatio: "1",
                  borderRadius: "7px",
                  background: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: ".72rem",
                  fontWeight: isToday ? "800" : "500",
                  color: text,
                  cursor: "pointer",
                  border: isToday
                    ? `2px solid ${COLORS.primary}`
                    : isSel
                    ? `2px solid ${COLORS.secondary}`
                    : "2px solid transparent",
                  transition: "transform .1s",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.12)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                {d}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: ".75rem", justifyContent: "center", marginTop: ".85rem" }}>
          {[
            { bg: "#EDE9FE", label: "No activity" },
            { bg: "#BBF7D0", label: "1–2 sessions" },
            { bg: "#10B981", label: "3+ sessions" },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: ".3rem", fontSize: ".65rem", color: COLORS.textMuted }}>
              <div style={{ width: "11px", height: "11px", borderRadius: "3px", background: l.bg, border: "1px solid rgba(0,0,0,.07)", flexShrink: 0 }} />
              {l.label}
            </div>
          ))}
        </div>
      </>
    );
  };

  // ── DAILY ─────────────────────────────────────────────────────────────────
  const renderDaily = () => {
    const dateStr = selectedDay || todayStr;
    const [y, m, d] = dateStr.split("-").map(Number);
    const label = new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    const entries = byDate[dateStr] || [];

    const typeInfo = {
      wordMatch:    { emoji: "🎯", label: "Word Match" },
      conversation: { emoji: "💬", label: "Chat" },
      pictureWord:  { emoji: "🖼️", label: "Picture Quiz" },
    };

    return (
      <>
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: "1rem" }}>
          <button style={iconBtn} onClick={() => setViewTab("monthly")}>‹</button>
          <span style={{ fontWeight: "700", color: COLORS.text, fontSize: ".88rem", lineHeight: 1.3 }}>{label}</span>
        </div>

        {entries.length === 0 ? (
          <div style={{ textAlign: "center", color: COLORS.textMuted, padding: "1.25rem 0", fontSize: ".88rem", lineHeight: 1.7 }}>
            No activity recorded this day 🌱<br />
            <span style={{ fontStyle: "italic", fontSize: ".8rem" }}>Walang aktibidad ngayong araw</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: ".45rem" }}>
            {entries.map((e, i) => {
              const info = typeInfo[e.type] || { emoji: "📝", label: e.type };
              const timeStr = new Date(e.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
              let detail = "";
              if (e.type === "wordMatch" && e.time != null)
                detail = `${e.time}s to complete`;
              else if (e.type === "conversation")
                detail = [e.responseTime && `${e.responseTime}s reply`, e.language].filter(Boolean).join(" · ");
              else if (e.type === "pictureWord")
                detail = (e.correct ? "✅ Correct" : "❌ Incorrect") + (e.time != null ? ` · ${e.time}s` : "");

              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: ".7rem",
                  background: "#F5F0FC", borderRadius: "12px",
                  padding: ".65rem .85rem",
                  border: `1.5px solid ${COLORS.border}`,
                }}>
                  <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>{info.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: "600", color: COLORS.text, fontSize: ".88rem" }}>{info.label}</div>
                    {detail && <div style={{ fontSize: ".73rem", color: COLORS.textMuted, marginTop: "1px" }}>{detail}</div>}
                  </div>
                  <div style={{ fontSize: ".68rem", color: COLORS.textMuted, flexShrink: 0 }}>{timeStr}</div>
                </div>
              );
            })}
            <div style={{ textAlign: "center", fontSize: ".75rem", color: COLORS.primary, fontWeight: "600", marginTop: ".25rem" }}>
              {entries.length} {entries.length === 1 ? "session" : "sessions"} · Magaling! 🌸
            </div>
          </div>
        )}
      </>
    );
  };

  // ── WEEKLY ────────────────────────────────────────────────────────────────
  const renderWeekly = () => {
    const now = new Date();
    const sundayOffset = now.getDay(); // days since last Sunday
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - sundayOffset);

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const dateStr = d.toLocaleDateString("en-CA");
      return {
        dateStr,
        shortDay: d.toLocaleDateString("en-US", { weekday: "short" }),
        dayNum: d.getDate(),
        count: (byDate[dateStr] || []).length,
        isToday: dateStr === todayStr,
      };
    });

    const maxCount = Math.max(...days.map(d => d.count), 1);
    const weekTotal = days.reduce((s, d) => s + d.count, 0);
    const activeDays = days.filter(d => d.count > 0).length;

    return (
      <>
        <div style={{ fontWeight: "700", color: COLORS.text, fontSize: ".92rem", textAlign: "center", marginBottom: ".25rem" }}>
          This Week
        </div>
        <div style={{ fontSize: ".75rem", color: COLORS.textMuted, textAlign: "center", marginBottom: "1rem" }}>
          {weekTotal} total sessions · {activeDays}/7 days active
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: "5px", height: "90px" }}>
          {days.map(({ dateStr, shortDay, dayNum, count, isToday }) => {
            const barH = count === 0 ? 5 : Math.max(14, (count / maxCount) * 78);
            return (
              <div
                key={dateStr}
                onClick={() => { setSelectedDay(dateStr); setViewTab("daily"); }}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", cursor: "pointer" }}
              >
                <div style={{ fontSize: ".62rem", color: count > 0 ? COLORS.primary : "transparent", fontWeight: "700" }}>
                  {count}
                </div>
                <div style={{
                  width: "100%",
                  height: `${barH}px`,
                  borderRadius: "5px 5px 0 0",
                  background: count === 0
                    ? "#EDE9FE"
                    : isToday
                    ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`
                    : `linear-gradient(135deg, #10B981, #059669)`,
                  border: isToday ? `2px solid ${COLORS.primary}` : "none",
                  transition: "height .3s",
                }} />
                <div style={{ fontSize: ".62rem", fontWeight: isToday ? "800" : "500", color: isToday ? COLORS.primary : COLORS.textMuted }}>
                  {shortDay}
                </div>
                <div style={{ fontSize: ".58rem", color: COLORS.textMuted }}>{dayNum}</div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: ".9rem", textAlign: "center", fontSize: ".73rem", color: COLORS.textMuted }}>
          Tap a bar to see that day · I-tap para makita ang araw
        </div>
      </>
    );
  };

  // ── YEARLY ────────────────────────────────────────────────────────────────
  const renderYearly = () => {
    const year = calDate.getFullYear();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth();

    const months = Array.from({ length: 12 }, (_, m) => {
      const prefix = `${year}-${String(m + 1).padStart(2, "0")}`;
      const count = Object.entries(byDate)
        .filter(([d]) => d.startsWith(prefix))
        .reduce((sum, [, arr]) => sum + arr.length, 0);
      return {
        m,
        name: new Date(year, m, 1).toLocaleString("en-US", { month: "short" }),
        count,
      };
    });

    const maxCount = Math.max(...months.map(m => m.count), 1);

    const monthBg = (count) => {
      if (count === 0) return "#EDE9FE";
      const ratio = count / maxCount;
      if (ratio < 0.25) return "#D1FAE5";
      if (ratio < 0.6)  return "#6EE7B7";
      return "#10B981";
    };

    const yearTotal = months.reduce((s, m) => s + m.count, 0);

    return (
      <>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".5rem" }}>
          <button style={iconBtn} onClick={() => setCalDate(new Date(year - 1, 0, 1))}>‹</button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: "700", color: COLORS.text, fontSize: ".92rem" }}>{year}</div>
            <div style={{ fontSize: ".7rem", color: COLORS.textMuted }}>{yearTotal} total sessions</div>
          </div>
          <button style={iconBtn} onClick={() => setCalDate(new Date(year + 1, 0, 1))}>›</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: ".45rem", marginTop: ".5rem" }}>
          {months.map(({ m, name, count }) => {
            const isCurrent = year === thisYear && m === thisMonth;
            return (
              <div
                key={m}
                onClick={() => { setCalDate(new Date(year, m, 1)); setViewTab("monthly"); }}
                style={{
                  background: monthBg(count),
                  borderRadius: "11px",
                  padding: ".65rem .4rem",
                  textAlign: "center",
                  cursor: "pointer",
                  border: isCurrent ? `2px solid ${COLORS.primary}` : "2px solid transparent",
                  transition: "transform .1s",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                <div style={{ fontWeight: "700", color: COLORS.text, fontSize: ".82rem" }}>{name}</div>
                <div style={{ fontSize: ".72rem", color: count > 0 ? "#065f46" : COLORS.textMuted, fontWeight: "600", marginTop: "2px" }}>
                  {count > 0 ? `${count} 🌸` : "–"}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: ".75rem", textAlign: "center", fontSize: ".72rem", color: COLORS.textMuted }}>
          Tap a month to see its calendar · I-tap ang buwan
        </div>
      </>
    );
  };

  const VIEW_TABS = [
    { id: "daily",   label: "Daily"   },
    { id: "weekly",  label: "Weekly"  },
    { id: "monthly", label: "Monthly" },
    { id: "yearly",  label: "Yearly"  },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".85rem" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "1.05rem", fontWeight: "700", color: COLORS.text }}>📊 Your Progress</div>
        <div style={{ fontSize: ".78rem", color: COLORS.textMuted, fontStyle: "italic", marginTop: "2px" }}>
          Ang Iyong Progreso · Tuloy lang! 🌸
        </div>
      </div>

      {/* View tab strip */}
      <div style={{ display: "flex", background: "#EDE9FE", borderRadius: "11px", padding: "3px", gap: "3px" }}>
        {VIEW_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setViewTab(t.id)}
            style={{
              flex: 1,
              border: "none",
              borderRadius: "8px",
              padding: ".38rem .2rem",
              fontSize: ".7rem",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "inherit",
              background: viewTab === t.id ? "#fff" : "transparent",
              color: viewTab === t.id ? COLORS.primary : COLORS.textMuted,
              boxShadow: viewTab === t.id ? "0 1px 4px rgba(0,0,0,.1)" : "none",
              transition: "all .15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Calendar / chart panel */}
      <div style={{
        background: COLORS.card,
        border: `2px solid ${COLORS.border}`,
        borderRadius: "16px",
        padding: "1rem",
      }}>
        {viewTab === "daily"   && renderDaily()}
        {viewTab === "weekly"  && renderWeekly()}
        {viewTab === "monthly" && renderMonthly()}
        {viewTab === "yearly"  && renderYearly()}
      </div>

      {history.length === 0 && (
        <div style={{ textAlign: "center", color: COLORS.textMuted, fontSize: ".83rem", lineHeight: 1.7 }}>
          Start playing to see your progress here! 🌱<br />
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

// Map a Supabase row back to the shape ProgressView expects
function rowToEntry(row) {
  if (row.type === "wordMatch") {
    return { type: "wordMatch", time: row.score, timestamp: new Date(row.created_at).getTime() };
  }
  if (row.type === "conversation") {
    return { type: "conversation", responseTime: row.response_time, language: row.language_used, timestamp: new Date(row.created_at).getTime() };
  }
  if (row.type === "pictureWord") {
    return { type: "pictureWord", correct: row.score === 1, time: row.response_time, timestamp: new Date(row.created_at).getTime() };
  }
  return null;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tab, setTab] = useState("chat");
  const [progressHistory, setProgressHistory] = useState([]);
  const [gameKey, setGameKey] = useState(0);

  // Auth state listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Save profile and load history when user logs in
  useEffect(() => {
    if (!user) {
      setProgressHistory([]);
      return;
    }

    // Upsert profile
    supabase.from("profiles").upsert({ id: user.id, email: user.email }, { onConflict: "id", ignoreDuplicates: true });

    // Fetch progress history
    supabase
      .from("progress_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (error) { console.error("[Bloom] fetch progress error:", error); return; }
        const entries = (data || []).map(rowToEntry).filter(Boolean);
        setProgressHistory(entries);
      });
  }, [user]);

  const addProgress = async (entry) => {
    console.log("[Bloom] addProgress called with entry:", entry);
    console.log("[Bloom] current user at call time:", user ? `id=${user.id} email=${user.email}` : "null — will skip DB insert");

    const withTimestamp = { ...entry, timestamp: Date.now() };
    setProgressHistory(h => [...h, withTimestamp]);

    if (!user) {
      console.warn("[Bloom] addProgress: user is null, skipping Supabase insert");
      return;
    }

    const row = {
      user_id: user.id,
      date: new Date().toISOString(),
      type: entry.type,
      score: entry.type === "wordMatch" ? entry.time
           : entry.type === "pictureWord" ? (entry.correct ? 1 : 0)
           : null,
      response_time: entry.type === "conversation" ? entry.responseTime
                   : entry.type === "pictureWord" ? parseFloat(entry.time)
                   : null,
      language_used: entry.type === "conversation" ? entry.language : null,
    };

    console.log("[Bloom] inserting row into progress_entries:", row);
    const { data, error } = await supabase.from("progress_entries").insert(row).select();
    if (error) {
      console.error("[Bloom] INSERT FAILED — code:", error.code, "| message:", error.message, "| details:", error.details, "| hint:", error.hint);
    } else {
      console.log("[Bloom] INSERT SUCCESS — saved row:", data);
    }
  };

  const switchTab = (id) => {
    setTab(id);
    if (id !== "progress") setGameKey(k => k + 1);
  };

  const handleSignOut = () => supabase.auth.signOut();

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#fff", fontSize: "1.1rem", fontFamily: "'Inter', system-ui, sans-serif" }}>Loading... 🌸</div>
      </div>
    );
  }

  if (!user) return <AuthScreen />;

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
        position: "relative",
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
        <button
          onClick={handleSignOut}
          style={{
            position: "absolute",
            top: "2.5rem",
            right: "1.25rem",
            background: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.35)",
            borderRadius: "8px",
            color: "#fff",
            fontSize: ".75rem",
            fontWeight: "600",
            padding: ".35rem .7rem",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Sign out
        </button>
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
