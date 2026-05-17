import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0a0a0f",
  surface: "#111118",
  card: "#16161f",
  border: "#1e1e2e",
  purple: "#7c6af7",
  gold: "#f0a500",
  text: "#e8e8f0",
  muted: "#6b6b80",
  danger: "#f75a5a",
  success: "#4ade80",
};

const neu = (active = false) => ({
  background: active ? COLORS.purple : COLORS.card,
  border: `1px solid ${active ? COLORS.purple : COLORS.border}`,
  borderRadius: 14,
  boxShadow: active ? `0 0 20px ${COLORS.purple}44` : `4px 4px 10px #05050a, -2px -2px 8px #1c1c28`,
  color: active ? "#fff" : COLORS.text,
  cursor: "pointer",
  transition: "all 0.2s ease",
});

const Icons = {
  Logo: () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill={COLORS.purple} opacity="0.15" stroke={COLORS.purple} strokeWidth="1.5"/>
      <polygon points="14,7 21,11 21,17 14,21 7,17 7,11" fill={COLORS.purple} opacity="0.3"/>
      <circle cx="14" cy="14" r="3" fill={COLORS.purple}/>
    </svg>
  ),
  Chat: ({ active }) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M4 4h14a2 2 0 012 2v8a2 2 0 01-2 2H8l-4 3V6a2 2 0 012-2z" stroke={active ? COLORS.purple : COLORS.muted} strokeWidth="1.5" fill={active ? COLORS.purple+"22" : "none"}/>
    </svg>
  ),
  Reel: ({ active }) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="3" y="3" width="16" height="16" rx="3" stroke={active ? COLORS.purple : COLORS.muted} strokeWidth="1.5" fill={active ? COLORS.purple+"22" : "none"}/>
      <polygon points="9,8 15,11 9,14" fill={active ? COLORS.purple : COLORS.muted}/>
    </svg>
  ),
  Channel: ({ active }) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="8" stroke={active ? COLORS.purple : COLORS.muted} strokeWidth="1.5" fill={active ? COLORS.purple+"22" : "none"}/>
      <path d="M8 8l6 3-6 3V8z" fill={active ? COLORS.purple : COLORS.muted}/>
    </svg>
  ),
  Profile: ({ active }) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="8" r="3.5" stroke={active ? COLORS.purple : COLORS.muted} strokeWidth="1.5" fill={active ? COLORS.purple+"22" : "none"}/>
      <path d="M4 19c0-3.866 3.134-7 7-7h0c3.866 0 7 3.134 7 7" stroke={active ? COLORS.purple : COLORS.muted} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Send: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M2 9L16 2l-4 7 4 7L2 9z" fill="#fff"/>
      <line x1="9" y1="9" x2="16" y2="9" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  Mic: ({ recording }) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="7" y="2" width="6" height="10" rx="3" fill={recording ? COLORS.danger : COLORS.muted}/>
      <path d="M4 10a6 6 0 0012 0" stroke={recording ? COLORS.danger : COLORS.muted} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="10" y1="16" x2="10" y2="18" stroke={recording ? COLORS.danger : COLORS.muted} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Play: ({ color }) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <polygon points="3,2 13,7 3,12" fill={color || COLORS.purple}/>
    </svg>
  ),
  Pause: ({ color }) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="2" width="4" height="10" rx="1" fill={color || COLORS.purple}/>
      <rect x="8" y="2" width="4" height="10" rx="1" fill={color || COLORS.purple}/>
    </svg>
  ),
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="8" cy="8" r="5" stroke={COLORS.muted} strokeWidth="1.5"/>
      <path d="M13 13l3 3" stroke={COLORS.muted} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Back: () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M14 6l-6 5 6 5" stroke={COLORS.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Lock: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="6" width="10" height="7" rx="1.5" stroke={COLORS.success} strokeWidth="1.2"/>
      <path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" stroke={COLORS.success} strokeWidth="1.2"/>
    </svg>
  ),
  Plus: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 3v12M3 9h12" stroke={COLORS.text} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Image: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="12" rx="2" stroke={COLORS.muted} strokeWidth="1.3"/>
      <circle cx="7" cy="8.5" r="1.5" fill={COLORS.muted}/>
      <path d="M2 14l4-4 3 3 3-3 6 4" stroke={COLORS.muted} strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  ),
  Edit: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M9 2l3 3-7 7H2v-3l7-7z" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  ),
  Shield: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2l5 2v4c0 3-2.5 5-5 6C5.5 13 3 11 3 8V4l5-2z" stroke={COLORS.gold} strokeWidth="1.3" fill={COLORS.gold+"22"}/>
      <path d="M5.5 8l2 2 3-3" stroke={COLORS.gold} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  Bot: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="5" width="12" height="9" rx="2" stroke={COLORS.purple} strokeWidth="1.3" fill={COLORS.purple+"22"}/>
      <circle cx="6" cy="9.5" r="1.2" fill={COLORS.purple}/>
      <circle cx="10" cy="9.5" r="1.2" fill={COLORS.purple}/>
      <path d="M8 2v3" stroke={COLORS.purple} strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="8" cy="1.5" r="1" fill={COLORS.purple}/>
    </svg>
  ),
  Camera: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M2 7a2 2 0 012-2h1l1.5-2h7L15 5h1a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" stroke={COLORS.muted} strokeWidth="1.3"/>
      <circle cx="10" cy="10.5" r="2.5" stroke={COLORS.muted} strokeWidth="1.3"/>
    </svg>
  ),
};

function Avatar({ name, size = 44, radius = "50%", pic }) {
  return pic
    ? <img src={pic} alt={name} style={{ width: size, height: size, borderRadius: radius, objectFit: "cover", flexShrink: 0 }} />
    : <div style={{ width: size, height: size, borderRadius: radius, background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.gold})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size * 0.38, color: "#fff", flexShrink: 0 }}>{name?.[0]?.toUpperCase()}</div>;
}

function Waveform({ progress = 0, light = false }) {
  const bars = [3,6,10,8,5,12,9,7,11,6,4,9,13,8,5,10,7,6,9,4];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 24, flex: 1 }}>
      {bars.map((h, i) => (
        <div key={i} style={{ width: 3, height: h, borderRadius: 2, background: (i / bars.length) < progress ? (light ? "#fff" : COLORS.purple) : (light ? "rgba(255,255,255,0.35)" : COLORS.muted+"55"), transition: "background 0.1s" }} />
      ))}
    </div>
  );
}

function VoiceNote({ from }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const isMe = from === "me";

  const toggle = () => {
    if (playing) {
      clearInterval(timerRef.current);
      setPlaying(false);
    } else {
      setPlaying(true);
      timerRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 1) { clearInterval(timerRef.current); setPlaying(false); return 0; }
          return p + 0.033;
        });
      }, 100);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 170 }}>
      <button onClick={toggle} style={{ background: isMe ? "rgba(255,255,255,0.2)" : COLORS.border, border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
        {playing ? <Icons.Pause color={isMe ? "#fff" : COLORS.purple} /> : <Icons.Play color={isMe ? "#fff" : COLORS.purple} />}
      </button>
      <div style={{ flex: 1 }}>
        <Waveform progress={progress} light={isMe} />
        <div style={{ fontSize: 10, color: isMe ? "rgba(255,255,255,0.55)" : COLORS.muted, marginTop: 2 }}>0:05</div>
      </div>
    </div>
  );
}

const mockChats = [
  { id: 1, name: "Amara Osei", username: "amara.o", lastMsg: "Did you see the update?", time: "2m", unread: 3, online: true },
  { id: 2, name: "Kwame N.", username: "kwame_n", lastMsg: "Encrypted 🔒", time: "1h", unread: 0, online: false },
  { id: 3, name: "Zara Ahmed", username: "zara.a", lastMsg: "Hive is clean bro 🔥", time: "3h", unread: 1, online: true },
  { id: 4, name: "Dev Group", username: "group", lastMsg: "New build dropped", time: "5h", unread: 0, isGroup: true },
  { id: 5, name: "HiveBot", username: "bot_hive", lastMsg: "How can I help?", time: "1d", unread: 0, isBot: true, online: true },
];

const mockMessages = [
  { id: 1, from: "them", text: "Hive is actually fire bro", time: "10:12" },
  { id: 2, from: "me", text: "Right? E2E from day one 🔒", time: "10:13" },
  { id: 3, from: "them", voice: true, time: "10:14" },
  { id: 4, from: "me", text: "Yeah the whole thing is clean", time: "10:15" },
  { id: 5, from: "me", voice: true, time: "10:16" },
];

const mockReels = [
  { id: 1, user: "amara.o", caption: "Morning vibes 🌅", bg: "linear-gradient(135deg, #1a1a2e, #16213e)", duration: "0:12" },
  { id: 2, user: "zara.a", caption: "New track dropping soon 🎵", bg: "linear-gradient(135deg, #0f0c29, #302b63)", duration: "0:30" },
  { id: 3, user: "kwame_n", caption: "Building something big 👀", bg: "linear-gradient(135deg, #1a0533, #2d1b69)", duration: "0:08" },
];

const mockChannels = [
  { id: 1, name: "LUMINAR Updates", handle: "@luminar", members: "12.4K", verified: true },
  { id: 2, name: "Tech Kenya", handle: "@techke", members: "8.1K", verified: false },
  { id: 3, name: "Nairobi Devs", handle: "@nbi_devs", members: "3.2K", verified: false },
];

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const inp = { width: "100%", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "13px 16px", color: COLORS.text, fontSize: 15, outline: "none", boxSizing: "border-box", boxShadow: `inset 2px 2px 6px #06060c`, fontFamily: "inherit" };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 28px", gap: 20 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}><Icons.Logo /></div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>HIVE</h1>
        <p style={{ margin: "6px 0 0", color: COLORS.muted, fontSize: 13 }}>Your private sanctuary</p>
      </div>
      <div style={{ display: "flex", gap: 6, background: COLORS.card, borderRadius: 14, padding: 4 }}>
        {["login","signup"].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "10px", borderRadius: 11, border: "none", cursor: "pointer", background: mode===m ? COLORS.purple : "transparent", color: mode===m ? "#fff" : COLORS.muted, fontFamily: "inherit", fontSize: 14, fontWeight: 600, transition: "all 0.2s" }}>
            {m==="login" ? "Sign In" : "Create Account"}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {mode==="signup" && <input style={inp} placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />}
        <input style={inp} placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input style={inp} placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      </div>
      <button onClick={() => onAuth({ email, username: username||email.split("@")[0]||"you" })} style={{ ...neu(true), border:"none", padding:"15px", fontSize:15, fontWeight:700, fontFamily:"inherit", borderRadius:14 }}>
        {mode==="login" ? "Sign In" : "Join Hive"}
      </button>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ flex:1, height:1, background:COLORS.border }} />
        <span style={{ color:COLORS.muted, fontSize:12 }}>or</span>
        <div style={{ flex:1, height:1, background:COLORS.border }} />
      </div>
      <button onClick={() => onAuth({ email:"google@user.com", username:"googleuser" })} style={{ ...neu(), border:`1px solid ${COLORS.border}`, padding:"13px", fontFamily:"inherit", fontSize:14, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:10, borderRadius:14 }}>
        <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
        Continue with Google
      </button>
      <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:6 }}>
        <Icons.Lock />
        <span style={{ color:COLORS.muted, fontSize:11 }}>End-to-end encrypted · Zero data collection</span>
      </div>
    </div>
  );
}

function ChatList({ onOpen }) {
  const [search, setSearch] = useState("");
  const filtered = mockChats.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:"20px 20px 12px", flexShrink:0 }}>
        <h2 style={{ margin:"0 0 14px", fontSize:22, fontWeight:700 }}>Messages</h2>
        <div style={{ display:"flex", alignItems:"center", gap:10, background:COLORS.card, borderRadius:12, padding:"10px 14px", boxShadow:`inset 2px 2px 6px #06060c` }}>
          <Icons.Search />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search" style={{ background:"none", border:"none", outline:"none", color:COLORS.text, fontFamily:"inherit", fontSize:14, flex:1 }} />
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"0 12px" }}>
        {filtered.map(chat => (
          <div key={chat.id} onClick={() => onOpen(chat)} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 10px", borderRadius:14, cursor:"pointer", marginBottom:2, transition:"background 0.15s" }}
            onMouseEnter={e=>e.currentTarget.style.background=COLORS.card}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{ position:"relative" }}>
              <Avatar name={chat.name} size={46} />
              {chat.isBot && <div style={{ position:"absolute", bottom:-2, right:-2, background:COLORS.card, borderRadius:"50%", padding:2 }}><Icons.Bot /></div>}
              {!chat.isBot && chat.online && <div style={{ position:"absolute", bottom:1, right:1, width:10, height:10, borderRadius:"50%", background:COLORS.success, border:`2px solid ${COLORS.bg}` }} />}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <span style={{ fontWeight:600, fontSize:15 }}>{chat.name}</span>
                  {chat.isBot && <span style={{ fontSize:10, color:COLORS.purple, background:COLORS.purple+"22", borderRadius:4, padding:"1px 5px" }}>BOT</span>}
                </div>
                <span style={{ color:COLORS.muted, fontSize:11 }}>{chat.time}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ color:COLORS.muted, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:190 }}>{chat.lastMsg}</span>
                {chat.unread > 0 && <div style={{ background:COLORS.purple, borderRadius:"50%", width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff", flexShrink:0 }}>{chat.unread}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatWindow({ chat, onBack }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [recording, setRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const bottomRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const send = () => {
    if (!msg.trim()) return;
    setMessages(p => [...p, { id:Date.now(), from:"me", text:msg, time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) }]);
    setMsg("");
  };

  const startRec = () => {
    setRecording(true);
    timerRef.current = setInterval(() => setRecordSecs(s=>s+1), 1000);
  };

  const stopRec = () => {
    clearInterval(timerRef.current);
    setRecording(false);
    setRecordSecs(0);
    setMessages(p => [...p, { id:Date.now(), from:"me", voice:true, time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) }]);
  };

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", borderBottom:`1px solid ${COLORS.border}`, flexShrink:0 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex" }}><Icons.Back /></button>
        <Avatar name={chat.name} size={36} />
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontWeight:600, fontSize:15 }}>{chat.name}</span>
            {chat.isBot && <span style={{ fontSize:10, color:COLORS.purple, background:COLORS.purple+"22", borderRadius:4, padding:"1px 5px" }}>BOT</span>}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:4 }}><Icons.Lock /><span style={{ color:COLORS.success, fontSize:11 }}>End-to-end encrypted</span></div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"14px 14px 8px", display:"flex", flexDirection:"column", gap:8 }}>
        {messages.map(m => (
          <div key={m.id} style={{ display:"flex", justifyContent:m.from==="me"?"flex-end":"flex-start" }}>
            <div style={{ maxWidth:"72%", background:m.from==="me"?COLORS.purple:COLORS.card, borderRadius:m.from==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"10px 14px", boxShadow:m.from==="me"?`0 0 16px ${COLORS.purple}33`:`2px 2px 8px #05050a` }}>
              {m.voice ? <VoiceNote from={m.from} /> : <p style={{ margin:0, fontSize:14, lineHeight:1.5 }}>{m.text}</p>}
              <span style={{ fontSize:10, color:m.from==="me"?"rgba(255,255,255,0.55)":COLORS.muted, float:"right", marginTop:4, marginLeft:8 }}>{m.time}</span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding:"10px 14px 14px", borderTop:`1px solid ${COLORS.border}`, flexShrink:0 }}>
        {recording ? (
          <div style={{ display:"flex", alignItems:"center", gap:12, background:COLORS.card, borderRadius:22, padding:"10px 16px" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:COLORS.danger }} />
            <span style={{ color:COLORS.danger, fontSize:14, flex:1 }}>Recording... 0:{String(recordSecs).padStart(2,"0")}</span>
            <button onPointerUp={stopRec} style={{ background:COLORS.danger, border:"none", width:40, height:40, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", padding:0, flexShrink:0, cursor:"pointer", boxShadow:`0 0 16px ${COLORS.danger}44` }}>
              <Icons.Mic recording />
            </button>
          </div>
        ) : (
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button style={{ background:"none", border:"none", cursor:"pointer", padding:4, display:"flex" }}><Icons.Image /></button>
            <button style={{ background:"none", border:"none", cursor:"pointer", padding:4, display:"flex" }}><Icons.Camera /></button>
            <div style={{ flex:1, background:COLORS.card, borderRadius:22, padding:"10px 16px", boxShadow:`inset 2px 2px 6px #06060c`, display:"flex", alignItems:"center" }}>
              <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Message..." style={{ background:"none", border:"none", outline:"none", color:COLORS.text, fontFamily:"inherit", fontSize:14, width:"100%" }} />
            </div>
            {msg.trim() ? (
              <button onClick={send} style={{ background:COLORS.purple, border:"none", width:42, height:42, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", padding:0, flexShrink:0, cursor:"pointer", boxShadow:`0 0 20px ${COLORS.purple}44` }}>
                <Icons.Send />
              </button>
            ) : (
              <button onPointerDown={startRec} style={{ ...neu(), border:`1px solid ${COLORS.border}`, width:42, height:42, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", padding:0, flexShrink:0 }}>
                <Icons.Mic />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ReelsTab() {
  const [active, setActive] = useState(0);
  const r = mockReels[active];
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:"20px 20px 12px", flexShrink:0 }}>
        <h2 style={{ margin:0, fontSize:22, fontWeight:700 }}>Status</h2>
      </div>
      <div style={{ flex:1, margin:"0 16px 12px", borderRadius:20, background:r.bg, display:"flex", flexDirection:"column", justifyContent:"space-between", padding:20, boxShadow:`0 8px 32px #00000066`, overflow:"hidden" }}>
        <div style={{ display:"flex", gap:4 }}>
          {mockReels.map((_,i) => (
            <div key={i} onClick={() => setActive(i)} style={{ flex:1, height:3, borderRadius:2, background:i<=active?"#fff":"rgba(255,255,255,0.3)", cursor:"pointer" }} />
          ))}
        </div>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <Avatar name={r.user} size={32} />
            <div>
              <div style={{ fontWeight:600, fontSize:13 }}>@{r.user}</div>
              <div style={{ color:"rgba(255,255,255,0.6)", fontSize:11 }}>{r.duration}</div>
            </div>
          </div>
          <p style={{ margin:0, fontWeight:600, fontSize:16 }}>{r.caption}</p>
        </div>
      </div>
      <div style={{ padding:"0 16px 12px", flexShrink:0 }}>
        <button style={{ ...neu(), border:`1px solid ${COLORS.border}`, padding:"12px 18px", fontFamily:"inherit", fontSize:14, borderRadius:12, display:"flex", alignItems:"center", gap:8 }}>
          <Icons.Plus /><span>New Status</span>
        </button>
      </div>
    </div>
  );
}

function ChannelsTab() {
  const [showCreate, setShowCreate] = useState(false);
  const [picPrev, setPicPrev] = useState(null);
  const [chName, setChName] = useState("");
  const fileRef = useRef(null);

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:"20px 20px 12px", flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <h2 style={{ margin:0, fontSize:22, fontWeight:700 }}>Channels</h2>
          <button onClick={() => setShowCreate(!showCreate)} style={{ ...neu(true), border:"none", padding:"8px 14px", fontSize:12, fontWeight:600, fontFamily:"inherit", borderRadius:10 }}>+ Create</button>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10, background:COLORS.card, borderRadius:12, padding:"10px 14px", boxShadow:`inset 2px 2px 6px #06060c` }}>
          <Icons.Search />
          <input placeholder="Find channels" style={{ background:"none", border:"none", outline:"none", color:COLORS.text, fontFamily:"inherit", fontSize:14, flex:1 }} />
        </div>
      </div>

      {showCreate && (
        <div style={{ margin:"0 16px 10px", ...neu(), padding:16, borderRadius:16, flexShrink:0 }}>
          <p style={{ margin:"0 0 12px", fontWeight:600, fontSize:14 }}>New Channel</p>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
            <div onClick={() => fileRef.current?.click()} style={{ width:48, height:48, borderRadius:12, background:picPrev?"none":COLORS.border, border:`2px dashed ${COLORS.purple}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", overflow:"hidden", flexShrink:0 }}>
              {picPrev ? <img src={picPrev} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <Icons.Camera />}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={e=>{ const f=e.target.files[0]; if(f) setPicPrev(URL.createObjectURL(f)); }} style={{ display:"none" }} />
            <input value={chName} onChange={e=>setChName(e.target.value)} placeholder="Channel name" style={{ flex:1, background:COLORS.bg, border:`1px solid ${COLORS.border}`, borderRadius:10, padding:"10px 12px", color:COLORS.text, fontFamily:"inherit", fontSize:14, outline:"none" }} />
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => setShowCreate(false)} style={{ flex:1, ...neu(), border:`1px solid ${COLORS.border}`, padding:"10px", fontFamily:"inherit", fontSize:13, borderRadius:10 }}>Cancel</button>
            <button onClick={() => setShowCreate(false)} style={{ flex:1, ...neu(true), border:"none", padding:"10px", fontFamily:"inherit", fontSize:13, fontWeight:600, borderRadius:10 }}>Create</button>
          </div>
        </div>
      )}

      <div style={{ flex:1, overflowY:"auto", padding:"0 16px" }}>
        {mockChannels.map(ch => (
          <div key={ch.id} style={{ ...neu(), marginBottom:10, padding:"14px 16px", display:"flex", alignItems:"center", gap:14, cursor:"pointer" }}>
            <Avatar name={ch.name} size={44} radius={12} />
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                <span style={{ fontWeight:600, fontSize:15 }}>{ch.name}</span>
                {ch.verified && <Icons.Shield />}
              </div>
              <div style={{ color:COLORS.muted, fontSize:12 }}>{ch.handle} · {ch.members} followers</div>
            </div>
            <button style={{ background:COLORS.purple+"22", border:`1px solid ${COLORS.purple}44`, borderRadius:10, padding:"6px 12px", color:COLORS.purple, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Follow</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileTab({ user }) {
  const [pic, setPic] = useState(null);
  const [showBot, setShowBot] = useState(false);
  const [botName, setBotName] = useState("");
  const [botLinked, setBotLinked] = useState(false);
  const fileRef = useRef(null);

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"20px 20px", overflowY:"auto" }}>
      <h2 style={{ margin:"0 0 18px", fontSize:22, fontWeight:700 }}>Profile</h2>

      <div style={{ ...neu(), padding:20, borderRadius:18, marginBottom:12, textAlign:"center" }}>
        <div onClick={() => fileRef.current?.click()} style={{ position:"relative", width:72, height:72, margin:"0 auto 12px", cursor:"pointer" }}>
          {pic
            ? <img src={pic} style={{ width:72, height:72, borderRadius:"50%", objectFit:"cover" }} />
            : <div style={{ width:72, height:72, borderRadius:"50%", background:`linear-gradient(135deg, ${COLORS.purple}, ${COLORS.gold})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:700 }}>{(user?.username||"Z")[0].toUpperCase()}</div>
          }
          <div style={{ position:"absolute", bottom:0, right:0, background:COLORS.purple, borderRadius:"50%", width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center" }}><Icons.Edit /></div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={e=>{ const f=e.target.files[0]; if(f) setPic(URL.createObjectURL(f)); }} style={{ display:"none" }} />
        <div style={{ fontWeight:700, fontSize:17 }}>{user?.username||"zachariakariuki"}</div>
        <div style={{ color:COLORS.muted, fontSize:13, marginTop:3 }}>{user?.email||"zappyblues234@gmail.com"}</div>
      </div>

      <div style={{ ...neu(), padding:16, borderRadius:14, marginBottom:10, cursor:"pointer" }} onClick={() => setShowBot(!showBot)}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Icons.Bot />
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:600, fontSize:14 }}>Link a Bot</div>
            <div style={{ color:COLORS.muted, fontSize:12, marginTop:2 }}>{botLinked?`@${botName} is active`:"Acts as you · automates replies"}</div>
          </div>
          {botLinked && <span style={{ fontSize:10, color:COLORS.success, background:COLORS.success+"22", borderRadius:4, padding:"2px 6px" }}>ACTIVE</span>}
        </div>
        {showBot && (
          <div style={{ marginTop:12, display:"flex", gap:8 }} onClick={e=>e.stopPropagation()}>
            <input value={botName} onChange={e=>setBotName(e.target.value)} placeholder="bot_username" style={{ flex:1, background:COLORS.bg, border:`1px solid ${COLORS.border}`, borderRadius:10, padding:"9px 12px", color:COLORS.text, fontFamily:"inherit", fontSize:13, outline:"none" }} />
            <button onClick={() => { if(botName){ setBotLinked(true); setShowBot(false); }}} style={{ ...neu(true), border:"none", padding:"9px 14px", fontFamily:"inherit", fontSize:13, fontWeight:600, borderRadius:10 }}>Link</button>
          </div>
        )}
      </div>

      {[
        { label:"Privacy", sub:"Manage who can contact you", icon:<Icons.Lock /> },
        { label:"Security", sub:"Encryption & key management", icon:<Icons.Shield /> },
      ].map(item => (
        <div key={item.label} style={{ ...neu(), padding:"14px 16px", borderRadius:14, marginBottom:10, display:"flex", alignItems:"center", gap:14, cursor:"pointer" }}>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:600, fontSize:14 }}>{item.label}</div>
            <div style={{ color:COLORS.muted, fontSize:12, marginTop:2 }}>{item.sub}</div>
          </div>
          {item.icon}
        </div>
      ))}

      <div style={{ marginTop:"auto", textAlign:"center", paddingTop:16 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginBottom:6 }}>
          <Icons.Lock />
          <span style={{ color:COLORS.success, fontSize:12 }}>Zero-knowledge architecture</span>
        </div>
        <span style={{ color:COLORS.muted, fontSize:11 }}>LUMINAR_inc · All rights reserved</span>
      </div>
    </div>
  );
}

function BottomNav({ tab, setTab }) {
  const tabs = [
    { id:"chats", label:"Chats", Icon:Icons.Chat },
    { id:"reels", label:"Status", Icon:Icons.Reel },
    { id:"channels", label:"Channels", Icon:Icons.Channel },
    { id:"profile", label:"Profile", Icon:Icons.Profile },
  ];
  return (
    <div style={{ display:"flex", borderTop:`1px solid ${COLORS.border}`, background:COLORS.surface, padding:"8px 0 12px", flexShrink:0 }}>
      {tabs.map(({ id, label, Icon }) => (
        <button key={id} onClick={() => setTab(id)} style={{ flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"6px 0" }}>
          <Icon active={tab===id} />
          <span style={{ fontSize:10, color:tab===id?COLORS.purple:COLORS.muted, fontFamily:"inherit", fontWeight:tab===id?600:400 }}>{label}</span>
        </button>
      ))}
    </div>
  );
}

export default function HiveApp() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("chats");
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  if (!user) return (
    <div style={{ minHeight:"100vh", background:COLORS.bg, color:COLORS.text, fontFamily:"'DM Sans', sans-serif", display:"flex", flexDirection:"column", maxWidth:430, margin:"0 auto" }}>
      <AuthScreen onAuth={setUser} />
    </div>
  );

  return (
    <div style={{ height:"100vh", background:COLORS.bg, color:COLORS.text, fontFamily:"'DM Sans', sans-serif", display:"flex", flexDirection:"column", maxWidth:430, margin:"0 auto", overflow:"hidden" }}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {activeChat
          ? <ChatWindow chat={activeChat} onBack={() => setActiveChat(null)} />
          : <>
              {tab==="chats" && <ChatList onOpen={setActiveChat} />}
              {tab==="reels" && <ReelsTab />}
              {tab==="channels" && <ChannelsTab />}
              {tab==="profile" && <ProfileTab user={user} />}
            </>
        }
      </div>
      {!activeChat && <BottomNav tab={tab} setTab={setTab} />}
    </div>
  );
}
