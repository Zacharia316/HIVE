import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://pdyovubfflihmhqvizui.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkeW92dWJmZmxpaG1scXZpenVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNTI5MzAsImV4cCI6MjA5NDYyODkzMH0.VLABoq6yj2yNqIVBZDOU1U_tCSlczED5s7oRapUrDXo";
const sb = createClient(SUPABASE_URL, SUPABASE_ANON);

// File size limits (bytes)
const LIMITS = {
  dm_photo: 10 * 1024 * 1024,   // 10MB
  dm_video: 200 * 1024 * 1024,  // 200MB
  status_photo: 5 * 1024 * 1024, // 5MB
  status_video: 20 * 1024 * 1024, // 20MB
};

const COLORS = {
  bg: "#0a0a0f", surface: "#111118", card: "#16161f", border: "#1e1e2e",
  purple: "#7c6af7", gold: "#f0a500", text: "#e8e8f0", muted: "#6b6b80",
  danger: "#f75a5a", success: "#4ade80",
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

const inp = {
  width: "100%", background: COLORS.card, border: `1px solid ${COLORS.border}`,
  borderRadius: 12, padding: "13px 16px", color: COLORS.text, fontSize: 15,
  outline: "none", boxSizing: "border-box", boxShadow: `inset 2px 2px 6px #06060c`,
  fontFamily: "inherit",
};

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
  Video: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="5" width="12" height="10" rx="2" stroke={COLORS.muted} strokeWidth="1.3"/>
      <path d="M14 8l4-2v8l-4-2V8z" stroke={COLORS.muted} strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  ),
  Logout: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke={COLORS.danger} strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M11 11l3-3-3-3M14 8H6" stroke={COLORS.danger} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
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

function VoiceNote({ audioUrl, from }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const isMe = from === "me";

  useEffect(() => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("timeupdate", () => setProgress(audio.currentTime / audio.duration));
    audio.addEventListener("ended", () => { setPlaying(false); setProgress(0); });
    return () => audio.pause();
  }, [audioUrl]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  const fmt = (s) => `0:${String(Math.floor(s)||0).padStart(2,"0")}`;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 170 }}>
      <button onClick={toggle} style={{ background: isMe ? "rgba(255,255,255,0.2)" : COLORS.border, border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
        {playing ? <Icons.Pause color={isMe ? "#fff" : COLORS.purple} /> : <Icons.Play color={isMe ? "#fff" : COLORS.purple} />}
      </button>
      <div style={{ flex: 1 }}>
        <Waveform progress={progress} light={isMe} />
        <div style={{ fontSize: 10, color: isMe ? "rgba(255,255,255,0.55)" : COLORS.muted, marginTop: 2 }}>{fmt(duration * progress)} / {fmt(duration)}</div>
      </div>
    </div>
  );
}

// ─── AUTH ────────────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    try {
      if (mode === "signup") {
        if (!username.trim()) { setError("Username is required"); setLoading(false); return; }
        const existing = await sb.from("profiles").select("id").eq("username", username.trim()).single();
        if (existing.data) { setError("Username taken"); setLoading(false); return; }
        const { data, error: e } = await sb.auth.signUp({ email, password });
        if (e) throw e;
        if (data.user) {
          await sb.from("profiles").insert({ id: data.user.id, username: username.trim(), full_name: username.trim() });
          onAuth(data.user);
        }
      } else {
        const { data, error: e } = await sb.auth.signInWithPassword({ email, password });
        if (e) throw e;
        onAuth(data.user);
      }
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const handleGoogle = async () => {
    await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.href } });
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 28px", gap: 20 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}><Icons.Logo /></div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>HIVE</h1>
        <p style={{ margin: "6px 0 0", color: COLORS.muted, fontSize: 13 }}>Your private sanctuary</p>
      </div>
      <div style={{ display: "flex", gap: 6, background: COLORS.card, borderRadius: 14, padding: 4 }}>
        {["login","signup"].map(m => (
          <button key={m} onClick={() => { setMode(m); setError(""); }} style={{ flex: 1, padding: "10px", borderRadius: 11, border: "none", cursor: "pointer", background: mode===m ? COLORS.purple : "transparent", color: mode===m ? "#fff" : COLORS.muted, fontFamily: "inherit", fontSize: 14, fontWeight: 600, transition: "all 0.2s" }}>
            {m==="login" ? "Sign In" : "Create Account"}
          </button>
        ))}
      </div>
      {error && <div style={{ background: COLORS.danger+"22", border:`1px solid ${COLORS.danger}44`, borderRadius:10, padding:"10px 14px", color:COLORS.danger, fontSize:13 }}>{error}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {mode==="signup" && <input style={inp} placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />}
        <input style={inp} placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input style={inp} placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} />
      </div>
      <button onClick={handleSubmit} disabled={loading} style={{ ...neu(true), border:"none", padding:"15px", fontSize:15, fontWeight:700, fontFamily:"inherit", borderRadius:14, opacity: loading ? 0.7 : 1 }}>
        {loading ? "Please wait..." : mode==="login" ? "Sign In" : "Join Hive"}
      </button>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ flex:1, height:1, background:COLORS.border }} />
        <span style={{ color:COLORS.muted, fontSize:12 }}>or</span>
        <div style={{ flex:1, height:1, background:COLORS.border }} />
      </div>
      <button onClick={handleGoogle} style={{ ...neu(), border:`1px solid ${COLORS.border}`, padding:"13px", fontFamily:"inherit", fontSize:14, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:10, borderRadius:14 }}>
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

// ─── CHAT LIST ───────────────────────────────────────────────────────────────
function ChatList({ currentUser, profile, onOpen }) {
  const [search, setSearch] = useState("");
  const [convos, setConvos] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadConvos = useCallback(async () => {
    const { data: memberships } = await sb.from("conversation_members").select("conversation_id").eq("user_id", currentUser.id);
    if (!memberships?.length) { setLoading(false); return; }
    const ids = memberships.map(m => m.conversation_id);
    const { data: members } = await sb.from("conversation_members").select("conversation_id, user_id, profiles(id,username,avatar_url,is_online)").in("conversation_id", ids).neq("user_id", currentUser.id);
    const { data: lastMsgs } = await sb.from("messages").select("conversation_id, content, type, created_at").in("conversation_id", ids).order("created_at", { ascending: false });

    const convoMap = {};
    members?.forEach(m => {
      if (!convoMap[m.conversation_id]) convoMap[m.conversation_id] = { id: m.conversation_id, other: m.profiles, lastMsg: null };
    });
    lastMsgs?.forEach(msg => {
      if (convoMap[msg.conversation_id] && !convoMap[msg.conversation_id].lastMsg) {
        convoMap[msg.conversation_id].lastMsg = msg;
      }
    });
    setConvos(Object.values(convoMap).sort((a,b) => new Date(b.lastMsg?.created_at||0) - new Date(a.lastMsg?.created_at||0)));
    setLoading(false);
  }, [currentUser.id]);

  useEffect(() => { loadConvos(); }, [loadConvos]);

  const searchUsers = async (q) => {
    if (!q.trim()) { setAllUsers([]); return; }
    const { data } = await sb.from("profiles").select("id,username,avatar_url,is_online").ilike("username", `%${q}%`).neq("id", currentUser.id).limit(20);
    setAllUsers(data || []);
  };

  const openOrCreate = async (otherUser) => {
    const { data: myMems } = await sb.from("conversation_members").select("conversation_id").eq("user_id", currentUser.id);
    const { data: theirMems } = await sb.from("conversation_members").select("conversation_id").eq("user_id", otherUser.id);
    const myIds = new Set(myMems?.map(m => m.conversation_id));
    const shared = theirMems?.find(m => myIds.has(m.conversation_id));
    if (shared) {
      onOpen({ id: shared.conversation_id, other: otherUser });
    } else {
      const { data: conv } = await sb.from("conversations").insert({}).select().single();
      await sb.from("conversation_members").insert([{ conversation_id: conv.id, user_id: currentUser.id }, { conversation_id: conv.id, user_id: otherUser.id }]);
      onOpen({ id: conv.id, other: otherUser });
    }
    setShowSearch(false); setSearch("");
  };

  const fmtTime = (ts) => {
    if (!ts) return "";
    const d = new Date(ts), now = new Date();
    const diff = now - d;
    if (diff < 60000) return "now";
    if (diff < 3600000) return `${Math.floor(diff/60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff/3600000)}h`;
    return `${Math.floor(diff/86400000)}d`;
  };

  const fmtLast = (msg) => {
    if (!msg) return "Start chatting";
    if (msg.type === "image") return "📷 Photo";
    if (msg.type === "video") return "🎥 Video";
    if (msg.type === "voice") return "🎤 Voice note";
    return msg.content || "";
  };

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:"20px 20px 12px", flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <h2 style={{ margin:0, fontSize:22, fontWeight:700 }}>Messages</h2>
          <button onClick={() => setShowSearch(!showSearch)} style={{ ...neu(showSearch), border:`1px solid ${showSearch?COLORS.purple:COLORS.border}`, padding:"8px 14px", fontSize:12, fontWeight:600, fontFamily:"inherit", borderRadius:10 }}>+ New</button>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10, background:COLORS.card, borderRadius:12, padding:"10px 14px", boxShadow:`inset 2px 2px 6px #06060c` }}>
          <Icons.Search />
          <input value={search} onChange={e=>{ setSearch(e.target.value); if(showSearch) searchUsers(e.target.value); }} placeholder={showSearch ? "Find users..." : "Search chats"} style={{ background:"none", border:"none", outline:"none", color:COLORS.text, fontFamily:"inherit", fontSize:14, flex:1 }} />
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"0 12px" }}>
        {showSearch ? (
          allUsers.map(u => (
            <div key={u.id} onClick={() => openOrCreate(u)} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 10px", borderRadius:14, cursor:"pointer", marginBottom:2 }}
              onMouseEnter={e=>e.currentTarget.style.background=COLORS.card} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{ position:"relative" }}>
                <Avatar name={u.username} size={46} pic={u.avatar_url} />
                {u.is_online && <div style={{ position:"absolute", bottom:1, right:1, width:10, height:10, borderRadius:"50%", background:COLORS.success, border:`2px solid ${COLORS.bg}` }} />}
              </div>
              <div>
                <div style={{ fontWeight:600, fontSize:15 }}>@{u.username}</div>
                <div style={{ color:COLORS.muted, fontSize:12 }}>{u.is_online ? "Online" : "Offline"}</div>
              </div>
            </div>
          ))
        ) : loading ? (
          <div style={{ textAlign:"center", color:COLORS.muted, padding:40, fontSize:14 }}>Loading...</div>
        ) : convos.length === 0 ? (
          <div style={{ textAlign:"center", color:COLORS.muted, padding:40, fontSize:14 }}>No chats yet. Tap + New to start one.</div>
        ) : (
          convos.filter(c => !search || c.other?.username?.toLowerCase().includes(search.toLowerCase())).map(c => (
            <div key={c.id} onClick={() => onOpen(c)} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 10px", borderRadius:14, cursor:"pointer", marginBottom:2 }}
              onMouseEnter={e=>e.currentTarget.style.background=COLORS.card} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{ position:"relative" }}>
                <Avatar name={c.other?.username} size={46} pic={c.other?.avatar_url} />
                {c.other?.is_online && <div style={{ position:"absolute", bottom:1, right:1, width:10, height:10, borderRadius:"50%", background:COLORS.success, border:`2px solid ${COLORS.bg}` }} />}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ fontWeight:600, fontSize:15 }}>@{c.other?.username}</span>
                  <span style={{ color:COLORS.muted, fontSize:11 }}>{fmtTime(c.lastMsg?.created_at)}</span>
                </div>
                <span style={{ color:COLORS.muted, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"block" }}>{fmtLast(c.lastMsg)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── CHAT WINDOW ─────────────────────────────────────────────────────────────
function ChatWindow({ chat, currentUser, onBack }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(false);
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef(null);
  const timerRef = useRef(null);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const imgRef = useRef(null);
  const vidRef = useRef(null);
  const [otherProfile, setOtherProfile] = useState(chat.other || null);

  useEffect(() => {
    if (!otherProfile) {
      sb.from("profiles").select("*").eq("id", chat.other?.id).single().then(({data}) => data && setOtherProfile(data));
    }
  }, []);

  const loadMessages = useCallback(async () => {
    const { data } = await sb.from("messages").select("*").eq("conversation_id", chat.id).order("created_at", { ascending: true });
    setMessages(data || []);
  }, [chat.id]);

  useEffect(() => {
    loadMessages();
    const sub = sb.channel(`chat:${chat.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${chat.id}` }, payload => {
        setMessages(p => [...p, payload.new]);
      }).subscribe();
    return () => sb.removeChannel(sub);
  }, [chat.id, loadMessages]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!msg.trim()) return;
    const content = msg; setMsg("");
    await sb.from("messages").insert({ conversation_id: chat.id, sender_id: currentUser.id, content, type: "text" });
  };

  const uploadMedia = async (file, type) => {
    const isPhoto = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const limit = isPhoto ? LIMITS.dm_photo : LIMITS.dm_video;
    if (file.size > limit) { alert(`File too large. Max ${isPhoto?"10MB":"200MB"} for DMs.`); return; }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${currentUser.id}/${Date.now()}.${ext}`;
    const { data, error } = await sb.storage.from("Hive-media public").upload(path, file, { contentType: file.type });
    if (error) { alert("Upload failed: " + error.message); setUploading(false); return; }
    const { data: { publicUrl } } = sb.storage.from("Hive-media public").getPublicUrl(path);
    await sb.from("messages").insert({ conversation_id: chat.id, sender_id: currentUser.id, type: isPhoto ? "image" : "video", media_url: publicUrl });
    setUploading(false);
  };

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRef.current = mr; chunksRef.current = [];
      mr.ondataavailable = e => chunksRef.current.push(e.data);
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach(t => t.stop());
        setUploading(true);
        const path = `${currentUser.id}/${Date.now()}.webm`;
        const { error } = await sb.storage.from("Hive-media public").upload(path, blob, { contentType: "audio/webm" });
        if (!error) {
          const { data: { publicUrl } } = sb.storage.from("Hive-media public").getPublicUrl(path);
          await sb.from("messages").insert({ conversation_id: chat.id, sender_id: currentUser.id, type: "voice", media_url: publicUrl });
        }
        setUploading(false);
      };
      mr.start();
      setRecording(true); setRecordSecs(0);
      timerRef.current = setInterval(() => setRecordSecs(s => s + 1), 1000);
    } catch { alert("Microphone access denied"); }
  };

  const stopRec = () => {
    clearInterval(timerRef.current);
    mediaRef.current?.stop();
    setRecording(false); setRecordSecs(0);
  };

  const fmtTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const isMe = (m) => m.sender_id === currentUser.id;

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", borderBottom:`1px solid ${COLORS.border}`, flexShrink:0 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex" }}><Icons.Back /></button>
        <div style={{ position:"relative" }}>
          <Avatar name={otherProfile?.username} size={36} pic={otherProfile?.avatar_url} />
          {otherProfile?.is_online && <div style={{ position:"absolute", bottom:0, right:0, width:9, height:9, borderRadius:"50%", background:COLORS.success, border:`2px solid ${COLORS.bg}` }} />}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:600, fontSize:15 }}>@{otherProfile?.username}</div>
          <div style={{ display:"flex", alignItems:"center", gap:4 }}><Icons.Lock /><span style={{ color:COLORS.success, fontSize:11 }}>End-to-end encrypted</span></div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"14px 14px 8px", display:"flex", flexDirection:"column", gap:8 }}>
        {messages.map(m => (
          <div key={m.id} style={{ display:"flex", justifyContent:isMe(m)?"flex-end":"flex-start" }}>
            <div style={{ maxWidth:"72%", background:isMe(m)?COLORS.purple:COLORS.card, borderRadius:isMe(m)?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"10px 14px", boxShadow:isMe(m)?`0 0 16px ${COLORS.purple}33`:`2px 2px 8px #05050a` }}>
              {m.type === "voice" && <VoiceNote audioUrl={m.media_url} from={isMe(m)?"me":"them"} />}
              {m.type === "image" && <img src={m.media_url} style={{ maxWidth:200, borderRadius:10, display:"block" }} alt="img" />}
              {m.type === "video" && <video src={m.media_url} controls style={{ maxWidth:200, borderRadius:10, display:"block" }} />}
              {m.type === "text" && <p style={{ margin:0, fontSize:14, lineHeight:1.5 }}>{m.content}</p>}
              <span style={{ fontSize:10, color:isMe(m)?"rgba(255,255,255,0.55)":COLORS.muted, float:"right", marginTop:4, marginLeft:8 }}>{fmtTime(m.created_at)}</span>
            </div>
          </div>
        ))}
        {uploading && <div style={{ textAlign:"center", color:COLORS.muted, fontSize:12 }}>Uploading...</div>}
        <div ref={bottomRef} />
      </div>

      <input ref={imgRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => e.target.files[0] && uploadMedia(e.target.files[0], "image")} />
      <input ref={vidRef} type="file" accept="video/*" style={{ display:"none" }} onChange={e => e.target.files[0] && uploadMedia(e.target.files[0], "video")} />

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
            <button onClick={() => imgRef.current?.click()} style={{ background:"none", border:"none", cursor:"pointer", padding:4, display:"flex" }}><Icons.Image /></button>
            <button onClick={() => vidRef.current?.click()} style={{ background:"none", border:"none", cursor:"pointer", padding:4, display:"flex" }}><Icons.Video /></button>
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

// ─── STATUS ──────────────────────────────────────────────────────────────────
function ReelsTab({ currentUser }) {
  const [statuses, setStatuses] = useState([]);
  const [active, setActive] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await sb.from("status_posts").select("*, profiles(username,avatar_url)").gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false });
      setStatuses(data || []);
    };
    load();
  }, []);

  const uploadStatus = async (file) => {
    const isPhoto = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const limit = isPhoto ? LIMITS.status_photo : LIMITS.status_video;
    if (file.size > limit) { alert(`Too large. Status limit: ${isPhoto?"5MB":"20MB"}`); return; }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${currentUser.id}/${Date.now()}.${ext}`;
    const { error } = await sb.storage.from("Hive-status public").upload(path, file, { contentType: file.type });
    if (error) { alert("Upload failed: " + error.message); setUploading(false); return; }
    const { data: { publicUrl } } = sb.storage.from("Hive-status public").getPublicUrl(path);
    await sb.from("status_posts").insert({ user_id: currentUser.id, media_url: publicUrl, type: isPhoto ? "image" : "video" });
    setUploading(false);
    // reload
    const { data } = await sb.from("status_posts").select("*, profiles(username,avatar_url)").gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false });
    setStatuses(data || []); setActive(0);
  };

  const r = statuses[active];

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:"20px 20px 12px", flexShrink:0 }}>
        <h2 style={{ margin:0, fontSize:22, fontWeight:700 }}>Status</h2>
      </div>
      {statuses.length > 0 && r ? (
        <div style={{ flex:1, margin:"0 16px 12px", borderRadius:20, background:COLORS.card, display:"flex", flexDirection:"column", justifyContent:"space-between", overflow:"hidden", boxShadow:`0 8px 32px #00000066`, position:"relative" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, zIndex:2, padding:12, display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ display:"flex", gap:4 }}>
              {statuses.map((_,i) => (
                <div key={i} onClick={() => setActive(i)} style={{ flex:1, height:3, borderRadius:2, background:i<=active?"#fff":"rgba(255,255,255,0.3)", cursor:"pointer" }} />
              ))}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <Avatar name={r.profiles?.username} size={32} pic={r.profiles?.avatar_url} />
              <div style={{ fontWeight:600, fontSize:13 }}>@{r.profiles?.username}</div>
            </div>
          </div>
          {r.type === "video"
            ? <video src={r.media_url} autoPlay loop muted style={{ width:"100%", height:"100%", objectFit:"cover", position:"absolute", inset:0 }} />
            : <img src={r.media_url} style={{ width:"100%", height:"100%", objectFit:"cover", position:"absolute", inset:0 }} alt="status" />
          }
        </div>
      ) : (
        <div style={{ flex:1, margin:"0 16px 12px", borderRadius:20, background:COLORS.card, display:"flex", alignItems:"center", justifyContent:"center", color:COLORS.muted, fontSize:14 }}>No status updates yet</div>
      )}
      <div style={{ padding:"0 16px 12px", flexShrink:0 }}>
        <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display:"none" }} onChange={e => e.target.files[0] && uploadStatus(e.target.files[0])} />
        <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ ...neu(), border:`1px solid ${COLORS.border}`, padding:"12px 18px", fontFamily:"inherit", fontSize:14, borderRadius:12, display:"flex", alignItems:"center", gap:8 }}>
          <Icons.Plus /><span>{uploading ? "Uploading..." : "New Status"}</span>
        </button>
      </div>
    </div>
  );
}

// ─── CHANNELS (kept as mock for now) ─────────────────────────────────────────
const mockChannels = [
  { id: 1, name: "LUMINAR Updates", handle: "@luminar", members: "12.4K", verified: true },
  { id: 2, name: "Tech Kenya", handle: "@techke", members: "8.1K", verified: false },
  { id: 3, name: "Nairobi Devs", handle: "@nbi_devs", members: "3.2K", verified: false },
];

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

// ─── PROFILE ─────────────────────────────────────────────────────────────────
function ProfileTab({ currentUser, profile, setProfile, onLogout }) {
  const [uploading, setUploading] = useState(false);
  const [showBot, setShowBot] = useState(false);
  const [botName, setBotName] = useState("");
  const [botLinked, setBotLinked] = useState(false);
  const fileRef = useRef(null);

  const uploadAvatar = async (file) => {
    if (file.size > LIMITS.dm_photo) { alert("Max 10MB"); return; }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${currentUser.id}/avatar.${ext}`;
    const { error } = await sb.storage.from("hive-avatars").upload(path, file, { contentType: file.type, upsert: true });
    if (error) { alert("Upload failed"); setUploading(false); return; }
    const { data: { publicUrl } } = sb.storage.from("hive-avatars").getPublicUrl(path);
    const url = publicUrl + "?t=" + Date.now();
    await sb.from("profiles").update({ avatar_url: url }).eq("id", currentUser.id);
    setProfile(p => ({ ...p, avatar_url: url }));
    setUploading(false);
  };

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"20px 20px", overflowY:"auto" }}>
      <h2 style={{ margin:"0 0 18px", fontSize:22, fontWeight:700 }}>Profile</h2>
      <div style={{ ...neu(), padding:20, borderRadius:18, marginBottom:12, textAlign:"center" }}>
        <div onClick={() => fileRef.current?.click()} style={{ position:"relative", width:72, height:72, margin:"0 auto 12px", cursor:"pointer" }}>
          {profile?.avatar_url
            ? <img src={profile.avatar_url} style={{ width:72, height:72, borderRadius:"50%", objectFit:"cover" }} />
            : <div style={{ width:72, height:72, borderRadius:"50%", background:`linear-gradient(135deg, ${COLORS.purple}, ${COLORS.gold})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:700 }}>{(profile?.username||"Z")[0].toUpperCase()}</div>
          }
          <div style={{ position:"absolute", bottom:0, right:0, background:COLORS.purple, borderRadius:"50%", width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center" }}>
            {uploading ? <div style={{ width:10,height:10,border:`2px solid #fff`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.6s linear infinite" }} /> : <Icons.Edit />}
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={e=>{ const f=e.target.files[0]; if(f) uploadAvatar(f); }} style={{ display:"none" }} />
        <div style={{ fontWeight:700, fontSize:17 }}>@{profile?.username}</div>
        <div style={{ color:COLORS.muted, fontSize:13, marginTop:3 }}>{currentUser.email}</div>
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

      <div onClick={onLogout} style={{ ...neu(), padding:"14px 16px", borderRadius:14, marginBottom:10, display:"flex", alignItems:"center", gap:14, cursor:"pointer", border:`1px solid ${COLORS.danger}33` }}>
        <Icons.Logout />
        <div style={{ fontWeight:600, fontSize:14, color:COLORS.danger }}>Sign Out</div>
      </div>

      <div style={{ marginTop:"auto", textAlign:"center", paddingTop:16 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginBottom:6 }}>
          <Icons.Lock />
          <span style={{ color:COLORS.success, fontSize:12 }}>Zero-knowledge architecture</span>
        </div>
        <span style={{ color:COLORS.muted, fontSize:11 }}>LUMINAR_inc · All rights reserved</span>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
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

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function HiveApp() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("chats");
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    sb.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); loadProfile(session.user.id); }
      else setLoading(false);
    });

    const { data: { subscription } } = sb.auth.onAuthStateChange((_e, session) => {
      if (session?.user) { setUser(session.user); loadProfile(session.user.id); }
      else { setUser(null); setProfile(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (uid) => {
    const { data } = await sb.from("profiles").select("*").eq("id", uid).single();
    setProfile(data);
    // Mark online
    await sb.from("profiles").update({ is_online: true, last_seen: new Date().toISOString() }).eq("id", uid);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    const handleOff = () => sb.from("profiles").update({ is_online: false, last_seen: new Date().toISOString() }).eq("id", user.id);
    window.addEventListener("beforeunload", handleOff);
    return () => { handleOff(); window.removeEventListener("beforeunload", handleOff); };
  }, [user]);

  const handleLogout = async () => {
    if (user) await sb.from("profiles").update({ is_online: false }).eq("id", user.id);
    await sb.auth.signOut();
  };

  if (loading) return (
    <div style={{ minHeight:"100vh", background:COLORS.bg, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <Icons.Logo />
      <div style={{ color:COLORS.muted, fontSize:14, fontFamily:"'DM Sans',sans-serif" }}>Loading Hive...</div>
    </div>
  );

  if (!user) return (
    <div style={{ minHeight:"100vh", background:COLORS.bg, color:COLORS.text, fontFamily:"'DM Sans', sans-serif", display:"flex", flexDirection:"column", maxWidth:430, margin:"0 auto" }}>
      <AuthScreen onAuth={(u) => { setUser(u); loadProfile(u.id); }} />
    </div>
  );

  return (
    <div style={{ height:"100vh", background:COLORS.bg, color:COLORS.text, fontFamily:"'DM Sans', sans-serif", display:"flex", flexDirection:"column", maxWidth:430, margin:"0 auto", overflow:"hidden" }}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {activeChat
          ? <ChatWindow chat={activeChat} currentUser={user} onBack={() => setActiveChat(null)} />
          : <>
              {tab==="chats" && <ChatList currentUser={user} profile={profile} onOpen={setActiveChat} />}
              {tab==="reels" && <ReelsTab currentUser={user} />}
              {tab==="channels" && <ChannelsTab />}
              {tab==="profile" && <ProfileTab currentUser={user} profile={profile} setProfile={setProfile} onLogout={handleLogout} />}
            </>
        }
      </div>
      {!activeChat && <BottomNav tab={tab} setTab={setTab} />}
    </div>
  );
}
