import React, { useState, useRef, useEffect } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  MessageCircle,
  CircleDot,
  Users,
  Radio,
  User,
  Search,
  ArrowLeft,
  Mic,
  Camera,
  Send,
  Check,
  CheckCheck,
  Plus,
  MoreVertical,
  Reply,
  Smile,
  Cake,
  Info,
  Link2,
  BadgeCheck,
  Pencil,
  ImagePlus,
  Settings,
  Pin,
  Forward,
  Trash2,
  LogOut,
  Play,
  Pause,
} from "lucide-react";

// ---------------------------------------------------------------------------
// HIVE — wired to Supabase.
// Assumes tables: profiles, messages, groups, group_members, group_messages,
// channels, channel_followers, channel_posts, follows, status_posts.
// Storage buckets: hive-avatars, Hive-media, Hive-status.
// Column names are best-guess based on the earlier schema check — adjust
// the queries below (search "sb.from") if your actual column names differ.
// ---------------------------------------------------------------------------

const SUPABASE_URL = "https://pdyovubfflihmlqvizui.supabase.co";
const SUPABASE_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkeW92dWJmZmxpaG1scXZpenVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNTI5MzAsImV4cCI6MjA5NDYyODkzMH0.VLABoq6yj2yNqIVBZDOU1U_tCSlczED5s7oRapUrDXo";
const sb = createClient(SUPABASE_URL, SUPABASE_ANON);

const HEX_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

const fontStyle = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
@keyframes hivePulse {0%,100%{opacity:.3}50%{opacity:1}}
@keyframes hiveFadeSlide {from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
`;

const AVATAR_CHOICES = ["🐝", "🦁", "🦋", "🐺", "🦊", "🐙", "🦉", "🐳", "🌵", "🔥", "⚡", "🌙"];
const STATUS_DURATIONS = [
  { label: "1h", ms: 1 * 60 * 60 * 1000 },
  { label: "6h", ms: 6 * 60 * 60 * 1000 },
  { label: "10h", ms: 10 * 60 * 60 * 1000 },
  { label: "24h", ms: 24 * 60 * 60 * 1000 },
];

const S = {
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 10,
    padding: "10px 12px",
    color: "#F1EDE4",
    outline: "none",
    fontSize: 13.5,
    fontFamily: "'Inter', sans-serif",
  },
  label: {
    fontSize: 11,
    color: "#6B6F78",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16,
    padding: "14px 16px",
  },
};

// isImg: distinguishes an emoji avatar (string) from an uploaded photo (URL)
const isImg = (v) => typeof v === "string" && (v.startsWith("http") || v.startsWith("blob:"));

// fmtTime: always forces 12-hour + AM/PM regardless of device locale
function fmtTime(ts) {
  if (!ts) return "";
  const d = typeof ts === "string" ? new Date(ts) : ts;
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
}

function fmtLastSeen(ts) {
  if (!ts) return "offline";
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const time = fmtTime(d);
  return sameDay ? `last seen today at ${time}` : `last seen ${d.toLocaleDateString()} at ${time}`;
}

async function uploadFile(bucket, file) {
  const path = `${Date.now()}_${file.name}`;
  const { error } = await sb.storage.from(bucket).upload(path, file);
  if (error) throw error;
  const { data } = sb.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

function VoiceNote({ audioUrl, mine }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration || 0));
    audio.addEventListener("timeupdate", () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0));
    audio.addEventListener("ended", () => { setPlaying(false); setProgress(0); });
    return () => audio.pause();
  }, [audioUrl]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  const fmt = (s) => `0:${String(Math.floor(s) || 0).padStart(2, "0")}`;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 140 }}>
      <button onClick={toggle} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "inherit", display: "flex" }}>
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <div style={{ flex: 1 }}>
        <div style={{ height: 3, borderRadius: 2, background: mine ? "rgba(26,19,5,0.25)" : "rgba(255,255,255,0.15)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, width: `${progress * 100}%`, background: mine ? "#1A1305" : "#F2A93B" }} />
        </div>
      </div>
      <span style={{ fontSize: 11 }}>{fmt(duration)}</span>
    </div>
  );
}

// ---- small UI atoms -----------------------------------------------------

function HexAvatar({ emoji, size = 44, ring, dim }) {
  return (
    <div style={{ width: size, height: size, position: "relative", flexShrink: 0, filter: dim ? "grayscale(1) opacity(0.5)" : "none" }}>
      {ring && (
        <div style={{ position: "absolute", inset: -3, clipPath: HEX_CLIP, background: "linear-gradient(135deg, #F2A93B, #F0C674)" }} />
      )}
      <div
        style={{
          position: "absolute",
          inset: ring ? 3 : 0,
          clipPath: HEX_CLIP,
          background: emoji ? "linear-gradient(145deg, #23262E, #1A1C22)" : "linear-gradient(145deg, #2A2D36, #1E2026)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.45,
          overflow: "hidden",
        }}
      >
        {isImg(emoji) ? (
          <img src={emoji} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          emoji || <span style={{ fontSize: size * 0.32, color: "#6B6F78" }}>?</span>
        )}
      </div>
    </div>
  );
}

function AvatarPicker({ value, onChange, bucket }) {
  const fileRef = useRef(null);
  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile(bucket, file);
      onChange(url);
    } catch {}
    e.target.value = "";
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <HexAvatar emoji={value} size={80} ring />
      <div style={{ fontSize: 11.5, color: "#6B6F78", marginTop: 10 }}>Choose an avatar</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 8, maxWidth: 260 }}>
        {AVATAR_CHOICES.map((a) => (
          <div
            key={a}
            onClick={() => onChange(a)}
            style={{
              width: 38,
              height: 38,
              clipPath: HEX_CLIP,
              background: value === a ? "linear-gradient(135deg, #F2A93B, #D98F28)" : "rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 17,
              cursor: "pointer",
            }}
          >
            {a}
          </div>
        ))}
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={upload} />
      <div
        onClick={() => fileRef.current?.click()}
        style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 10, fontSize: 12, color: "#F2A93B", cursor: "pointer" }}
      >
        <ImagePlus size={13} />
        Upload a photo
      </div>
    </div>
  );
}

function StatusTick({ status }) {
  if (status === "sent") return <Check size={14} color="#6B6F78" />;
  if (status === "delivered") return <CheckCheck size={14} color="#6B6F78" />;
  if (status === "read") return <CheckCheck size={14} color="#F2A93B" />;
  return null;
}

function AnimatedTitle({ text }) {
  const [display, setDisplay] = useState(text);
  const [key, setKey] = useState(0);
  useEffect(() => {
    if (text !== display) {
      setDisplay(text);
      setKey((k) => k + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);
  return (
    <div
      key={key}
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 600,
        fontSize: 17,
        color: "#F1EDE4",
        flex: 1,
        animation: "hiveFadeSlide 0.28s ease",
      }}
    >
      {display}
    </div>
  );
}

function TopBar({ title, onBack, right }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "16px 18px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(20,22,27,0.7)",
        backdropFilter: "blur(12px)",
      }}
    >
      {onBack && (
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#F1EDE4", cursor: "pointer", display: "flex" }}>
          <ArrowLeft size={20} />
        </button>
      )}
      <AnimatedTitle text={title} />
      {right}
    </div>
  );
}

// MessageActionsMenu: the sizable three-dot dropdown for a single message
function MessageActionsMenu({ mine, canEdit, onReply, onPin, onForward, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const items = [
    { label: "Reply", icon: Reply, action: onReply },
    { label: "Pin", icon: Pin, action: onPin },
    { label: "Forward", icon: Forward, action: onForward },
    ...(mine && canEdit ? [{ label: "Edit", icon: Pencil, action: onEdit }] : []),
    ...(mine ? [{ label: "Delete", icon: Trash2, action: onDelete, danger: true }] : []),
  ];
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ background: "none", border: "none", color: "#5A5E68", cursor: "pointer", display: "flex", padding: 2 }}
      >
        <MoreVertical size={14} />
      </button>
      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 15 }} onClick={() => setOpen(false)} />
          <div
            style={{
              position: "absolute",
              top: 20,
              [mine ? "right" : "left"]: 0,
              background: "#23262E",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 14,
              padding: 8,
              width: 172,
              zIndex: 20,
              boxShadow: "0 14px 34px rgba(0,0,0,0.45)",
            }}
          >
            {items.map((item) => (
              <div
                key={item.label}
                onClick={() => {
                  item.action();
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  fontSize: 13.5,
                  color: item.danger ? "#E85C5C" : "#F1EDE4",
                  cursor: "pointer",
                  borderRadius: 9,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <item.icon size={14} />
                {item.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ---- auth / onboarding -----------------------------------------------------

function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [avatar, setAvatar] = useState("🐝");
  const [name, setName] = useState("");
  const [usernameErr, setUsernameErr] = useState("");
  const [checking, setChecking] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
  const codeRefs = useRef([]);

  const sendOtp = async () => {
    setSending(true);
    setErr("");
    const { error } = await sb.auth.signInWithOtp({ email });
    setSending(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setStep("verify");
  };

  const handleCodeChange = (i, val) => {
    if (val && !/^[0-9]$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && i < code.length - 1) codeRefs.current[i + 1]?.focus();
  };

  const verifyOtp = async () => {
    setErr("");
    const token = code.join("");
    if (token.length < code.length) return;
    const { data, error } = await sb.auth.verifyOtp({ email, token, type: "email" });
    if (error) {
      setErr(error.message);
      return;
    }
    const { data: existing } = await sb
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();
    if (existing) {
      onComplete(existing, true);
    } else {
      setStep("profile");
    }
  };

  const checkUsername = async (val) => {
    setName(val);
    setUsernameErr("");
    if (!val.trim()) return;
    setChecking(true);
    const { data } = await sb.from("profiles").select("id").eq("username", val.trim()).maybeSingle();
    setChecking(false);
    if (data) setUsernameErr("Already in use — try another one.");
  };

  const finishProfile = async () => {
    if (!name.trim() || usernameErr) return;
    const { data: userData } = await sb.auth.getUser();
    const user = userData.user;
    const row = {
      id: user.id,
      email,
      username: name.trim(),
      avatar_url: isImg(avatar) ? avatar : null,
      avatar_emoji: isImg(avatar) ? null : avatar,
    };
    const { data: saved, error } = await sb.from("profiles").upsert(row).select().single();
    if (error) {
      setErr(error.message);
      return;
    }
    onComplete(saved, false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "40px 26px 30px" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 30, justifyContent: "center" }}>
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            style={{
              width: 26,
              height: 4,
              borderRadius: 2,
              background: n <= { email: 1, verify: 2, profile: 3 }[step] ? "#F2A93B" : "rgba(255,255,255,0.1)",
            }}
          />
        ))}
      </div>

      {step === "email" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              clipPath: HEX_CLIP,
              background: "linear-gradient(135deg, #F2A93B, #D98F28)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            🐝
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 26, color: "#F1EDE4", marginTop: 18, letterSpacing: 1 }}>
            HIVE
          </div>
          <div style={{ fontSize: 13, color: "#8B8F98", marginTop: 4, marginBottom: 36 }}>Your private sanctuary</div>

          <div style={{ width: "100%" }}>
            <div style={S.label}>Email</div>
            <input style={{ ...S.input, marginTop: 6 }} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" />
          </div>

          {err && <div style={{ fontSize: 12, color: "#E85C5C", marginTop: 10 }}>{err}</div>}

          <button
            disabled={!email.includes("@") || sending}
            onClick={sendOtp}
            style={{
              width: "100%",
              marginTop: 16,
              background: email.includes("@") ? "#F2A93B" : "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: 12,
              padding: "13px",
              fontSize: 14.5,
              fontWeight: 600,
              color: email.includes("@") ? "#1A1305" : "#6B6F78",
              cursor: email.includes("@") ? "pointer" : "default",
            }}
          >
            {sending ? "Sending…" : "Continue with email"}
          </button>

          <div style={{ fontSize: 11, color: "#4A4D55", marginTop: 20, textAlign: "center", lineHeight: 1.5 }}>
            No phone number needed — just your email.
            <br />
            We'll send you a one-time code.
          </div>
        </div>
      )}

      {step === "verify" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 19, color: "#F1EDE4", marginTop: 20 }}>
            Check your email
          </div>
          <div style={{ fontSize: 13, color: "#8B8F98", marginTop: 6, textAlign: "center" }}>
            We sent a code to
            <br />
            <span style={{ color: "#F2A93B" }}>{email}</span>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 30 }}>
            {code.map((d, i) => (
              <input
                key={i}
                ref={(el) => (codeRefs.current[i] = el)}
                value={d}
                onChange={(e) => handleCodeChange(i, e.target.value)}
                maxLength={1}
                style={{
                  width: 38,
                  height: 50,
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: 600,
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${d ? "#F2A93B" : "rgba(255,255,255,0.09)"}`,
                  borderRadius: 12,
                  color: "#F1EDE4",
                  outline: "none",
                }}
              />
            ))}
          </div>

          {err && <div style={{ fontSize: 12, color: "#E85C5C", marginTop: 14 }}>{err}</div>}

          <button
            onClick={verifyOtp}
            style={{ width: "100%", marginTop: 20, background: "#F2A93B", border: "none", borderRadius: 12, padding: "13px", fontSize: 14.5, fontWeight: 600, color: "#1A1305", cursor: "pointer" }}
          >
            Verify
          </button>

          <div onClick={sendOtp} style={{ fontSize: 12, color: "#6B6F78", marginTop: 18, cursor: "pointer" }}>
            Didn't get it? <span style={{ color: "#F2A93B" }}>Resend code</span>
          </div>
        </div>
      )}

      {step === "profile" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 19, color: "#F1EDE4", marginTop: 10 }}>
            Set up your profile
          </div>
          <div style={{ fontSize: 13, color: "#8B8F98", marginTop: 4, marginBottom: 24 }}>You can always change this later</div>

          <AvatarPicker value={avatar} onChange={setAvatar} bucket="hive-avatars" />

          <div style={{ width: "100%", marginTop: 26 }}>
            <div style={S.label}>Username</div>
            <input
              style={{ ...S.input, marginTop: 6, borderColor: usernameErr ? "#E85C5C" : "rgba(255,255,255,0.09)" }}
              value={name}
              onChange={(e) => checkUsername(e.target.value)}
              placeholder="Pick a username"
            />
            {checking && <div style={{ fontSize: 11, color: "#6B6F78", marginTop: 4 }}>Checking availability…</div>}
            {usernameErr && <div style={{ fontSize: 11.5, color: "#E85C5C", marginTop: 4 }}>{usernameErr}</div>}
          </div>

          {err && <div style={{ fontSize: 12, color: "#E85C5C", marginTop: 10 }}>{err}</div>}

          <button
            disabled={!name.trim() || !!usernameErr}
            onClick={finishProfile}
            style={{
              width: "100%",
              marginTop: 16,
              background: name.trim() && !usernameErr ? "#F2A93B" : "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: 12,
              padding: "13px",
              fontSize: 14.5,
              fontWeight: 600,
              color: name.trim() && !usernameErr ? "#1A1305" : "#6B6F78",
              cursor: name.trim() && !usernameErr ? "pointer" : "default",
            }}
          >
            Enter HIVE
          </button>
        </div>
      )}
    </div>
  );
}

// ---- profile edit / new chat / create group / create channel / status ----

function EditProfilePage({ profile, onSave, onCancel }) {
  const [avatar, setAvatar] = useState(profile.avatar_url || profile.avatar_emoji);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio || "");
  const [birthday, setBirthday] = useState(profile.birthday || "");
  const [usernameErr, setUsernameErr] = useState("");

  const checkUsername = async (val) => {
    setUsername(val);
    setUsernameErr("");
    if (!val.trim() || val.trim() === profile.username) return;
    const { data } = await sb.from("profiles").select("id").eq("username", val.trim()).maybeSingle();
    if (data) setUsernameErr("Already in use — try another one.");
  };

  const save = async () => {
    if (usernameErr) return;
    const row = {
      username: username.trim(),
      bio,
      birthday,
      avatar_url: isImg(avatar) ? avatar : null,
      avatar_emoji: isImg(avatar) ? null : avatar,
    };
    const { data, error } = await sb.from("profiles").update(row).eq("id", profile.id).select().single();
    if (!error) onSave(data);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar
        title="Edit profile"
        onBack={onCancel}
        right={
          <button
            onClick={save}
            style={{ background: "#F2A93B", border: "none", borderRadius: 16, padding: "6px 14px", fontSize: 12.5, fontWeight: 600, color: "#1A1305", cursor: "pointer" }}
          >
            Save
          </button>
        }
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        <AvatarPicker value={avatar} onChange={setAvatar} bucket="hive-avatars" />

        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={S.label}>Username</div>
            <input style={{ ...S.input, marginTop: 6 }} value={username} onChange={(e) => checkUsername(e.target.value)} />
            {usernameErr && <div style={{ fontSize: 11.5, color: "#E85C5C", marginTop: 4 }}>{usernameErr}</div>}
          </div>
          <div>
            <div style={S.label}>Bio</div>
            <textarea style={{ ...S.input, marginTop: 6, resize: "none", height: 64 }} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <div>
            <div style={S.label}>Birthday</div>
            <input style={{ ...S.input, marginTop: 6 }} value={birthday} onChange={(e) => setBirthday(e.target.value)} placeholder="e.g. March 14" />
          </div>
        </div>
      </div>
    </div>
  );
}

function NewChatScreen({ onBack, onSelectUser, myId }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!q.trim()) {
        setResults([]);
        return;
      }
      const { data } = await sb.from("profiles").select("*").ilike("username", `%${q}%`).neq("id", myId).limit(20);
      setResults(data || []);
    }, 250);
    return () => clearTimeout(t);
  }, [q, myId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar title="New chat" onBack={onBack} />
      <div style={{ padding: "10px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "9px 12px" }}>
          <Search size={15} color="#6B6F78" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
            placeholder="Search username…"
            style={{ background: "none", border: "none", outline: "none", color: "#F1EDE4", fontSize: 13.5, fontFamily: "'Inter', sans-serif", flex: 1 }}
          />
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 10px" }}>
        {results.map((u) => (
          <div key={u.id} onClick={() => onSelectUser(u)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px", borderRadius: 14, cursor: "pointer" }}>
            <HexAvatar emoji={u.avatar_url || u.avatar_emoji} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#F1EDE4" }}>{u.username}</div>
            </div>
          </div>
        ))}
        {q.trim() && results.length === 0 && (
          <div style={{ fontSize: 13, color: "#6B6F78", textAlign: "center", marginTop: 30 }}>
            No one found — try messaging their email directly from Chats instead.
          </div>
        )}
      </div>
    </div>
  );
}

function CreateGroupScreen({ onBack, onCreate, myId }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("⚙️");
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!q.trim()) {
        setResults([]);
        return;
      }
      const { data } = await sb.from("profiles").select("*").ilike("username", `%${q}%`).neq("id", myId).limit(20);
      setResults(data || []);
    }, 250);
    return () => clearTimeout(t);
  }, [q, myId]);

  const toggle = (u) => setSelected((s) => (s.find((x) => x.id === u.id) ? s.filter((x) => x.id !== u.id) : [...s, u]));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar
        title="New group"
        onBack={onBack}
        right={
          <button
            disabled={!name.trim() || selected.length === 0}
            onClick={() => onCreate({ name: name.trim(), avatar, members: selected })}
            style={{
              background: name.trim() && selected.length ? "#F2A93B" : "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: 16,
              padding: "6px 14px",
              fontSize: 12.5,
              fontWeight: 600,
              color: name.trim() && selected.length ? "#1A1305" : "#6B6F78",
              cursor: name.trim() && selected.length ? "pointer" : "default",
            }}
          >
            Create
          </button>
        }
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "18px" }}>
        <AvatarPicker value={avatar} onChange={setAvatar} bucket="Hive-media" />

        <div style={{ marginTop: 20 }}>
          <div style={S.label}>Group name</div>
          <input style={{ ...S.input, marginTop: 6 }} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Weekend crew" />
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={S.label}>Add members ({selected.length})</div>
          <input
            style={{ ...S.input, marginTop: 6 }}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search username…"
          />
          <div style={{ marginTop: 8 }}>
            {results.map((u) => (
              <div key={u.id} onClick={() => toggle(u)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 4px", cursor: "pointer" }}>
                <HexAvatar emoji={u.avatar_url || u.avatar_emoji} size={38} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, color: "#F1EDE4", fontWeight: 600 }}>{u.username}</div>
                </div>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: `2px solid ${selected.find((x) => x.id === u.id) ? "#F2A93B" : "rgba(255,255,255,0.2)"}`,
                    background: selected.find((x) => x.id === u.id) ? "#F2A93B" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {selected.find((x) => x.id === u.id) && <Check size={12} color="#1A1305" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateChannelScreen({ onBack, onCreate }) {
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState("📣");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar
        title="New channel"
        onBack={onBack}
        right={
          <button
            disabled={!name.trim()}
            onClick={() => onCreate({ name: name.trim(), handle: handle.trim() || name.trim().toLowerCase().replace(/\s+/g, "_"), description: description.trim(), avatar })}
            style={{
              background: name.trim() ? "#F2A93B" : "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: 16,
              padding: "6px 14px",
              fontSize: 12.5,
              fontWeight: 600,
              color: name.trim() ? "#1A1305" : "#6B6F78",
              cursor: name.trim() ? "pointer" : "default",
            }}
          >
            Create
          </button>
        }
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "18px" }}>
        <AvatarPicker value={avatar} onChange={setAvatar} bucket="Hive-media" />

        <div style={{ marginTop: 20 }}>
          <div style={S.label}>Channel name</div>
          <input style={{ ...S.input, marginTop: 6 }} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. HIVE Updates" />
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={S.label}>Handle</div>
          <input style={{ ...S.input, marginTop: 6 }} value={handle} onChange={(e) => setHandle(e.target.value.replace(/\s/g, ""))} placeholder="e.g. hive_updates" />
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={S.label}>Description</div>
          <textarea style={{ ...S.input, marginTop: 6, resize: "none", height: 64 }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's this channel about?" />
        </div>
      </div>
    </div>
  );
}

function NewStatusScreen({ onBack, onPost }) {
  const [text, setText] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null); // "image" | "voice"
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(STATUS_DURATIONS[3]);
  const [posting, setPosting] = useState(false);
  const recordStart = useRef(null);
  const fileRef = useRef(null);
  const bgOptions = [
    "linear-gradient(135deg, #F2A93B, #D98F28)",
    "linear-gradient(135deg, #59D499, #2E9E6B)",
    "linear-gradient(135deg, #6C7BF2, #3D48A8)",
    "linear-gradient(135deg, #E85C5C, #A83030)",
  ];
  const [bg, setBg] = useState(bgOptions[0]);

  const pickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    setMediaType("image");
    setMediaPreview(URL.createObjectURL(file));
  };

  const beginRecord = () => {
    setRecording(true);
    recordStart.current = Date.now();
  };
  const endRecord = () => {
    if (!recording) return;
    setRecording(false);
    const secs = Math.max(1, Math.round((Date.now() - recordStart.current) / 1000));
    setMediaType("voice");
    setMediaFile({ voiceDuration: secs });
  };

  const post = async () => {
    if (!text.trim() && !mediaFile) return;
    setPosting(true);
    let mediaUrl = null;
    if (mediaType === "image" && mediaFile) {
      try {
        mediaUrl = await uploadFile("Hive-status", mediaFile);
      } catch (err) {
        console.error("Status upload failed:", err);
        alert("Status image failed to upload: " + (err.message || err));
        setPosting(false);
        return;
      }
    }
    onPost({
      text: text.trim(),
      bg,
      type: mediaType,
      mediaUrl,
      voiceDuration: mediaType === "voice" ? mediaFile.voiceDuration : null,
      durationMs: duration.ms,
    });
    setPosting(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar
        title="New status"
        onBack={onBack}
        right={
          <button
            disabled={(!text.trim() && !mediaFile) || posting}
            onClick={post}
            style={{
              background: text.trim() || mediaFile ? "#F2A93B" : "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: 16,
              padding: "6px 14px",
              fontSize: 12.5,
              fontWeight: 600,
              color: text.trim() || mediaFile ? "#1A1305" : "#6B6F78",
              cursor: text.trim() || mediaFile ? "pointer" : "default",
            }}
          >
            {posting ? "Posting…" : "Post"}
          </button>
        }
      />
      <div style={{ flex: 1, padding: "18px", display: "flex", flexDirection: "column" }}>
        <div
          style={{
            flex: 1,
            borderRadius: 20,
            background: mediaType === "image" && mediaPreview ? `url(${mediaPreview}) center/cover` : bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            textAlign: "center",
            position: "relative",
          }}
        >
          {mediaType === "voice" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(0,0,0,0.3)", padding: "10px 16px", borderRadius: 20 }}>
              <Mic size={16} color="white" />
              <span style={{ color: "white", fontSize: 13 }}>Voice note · 0:{String(mediaFile?.voiceDuration || 0).padStart(2, "0")}</span>
            </div>
          ) : (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind?"
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: 20,
                fontWeight: 600,
                fontFamily: "'Space Grotesk', sans-serif",
                textAlign: "center",
                resize: "none",
                width: "100%",
                height: "100%",
                textShadow: mediaType === "image" ? "0 1px 6px rgba(0,0,0,0.6)" : "none",
              }}
            />
          )}
        </div>

        {!mediaType && (
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16 }}>
            {bgOptions.map((b) => (
              <div key={b} onClick={() => setBg(b)} style={{ width: 30, height: 30, borderRadius: "50%", background: b, cursor: "pointer", border: bg === b ? "2px solid #F1EDE4" : "2px solid transparent" }} />
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={pickImage} />
          <button
            onClick={() => fileRef.current?.click()}
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "8px 14px", color: "#F1EDE4", fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
          >
            <ImagePlus size={14} /> Photo
          </button>
          <button
            onMouseDown={beginRecord}
            onMouseUp={endRecord}
            onMouseLeave={recording ? endRecord : undefined}
            style={{ background: recording ? "#E85C5C" : "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "8px 14px", color: recording ? "white" : "#F1EDE4", fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
          >
            <Mic size={14} /> {recording ? "Recording…" : "Hold to record"}
          </button>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ ...S.label, textAlign: "center" }}>Expires in</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
            {STATUS_DURATIONS.map((d) => (
              <div
                key={d.label}
                onClick={() => setDuration(d)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 14,
                  fontSize: 12.5,
                  cursor: "pointer",
                  background: duration.label === d.label ? "#F2A93B" : "rgba(255,255,255,0.06)",
                  color: duration.label === d.label ? "#1A1305" : "#F1EDE4",
                  fontWeight: duration.label === d.label ? 600 : 400,
                }}
              >
                {d.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- status ---------------------------------------------------------

function StatusPage({ onOpenProfile, profile, myId, onNewStatus }) {
  const [myStatuses, setMyStatuses] = useState([]);
  const [others, setOthers] = useState([]);

  const load = async () => {
    const nowIso = new Date().toISOString();
    const { data: mine } = await sb.from("status_posts").select("*").eq("user_id", myId).gt("expires_at", nowIso).order("created_at", { ascending: false });
    setMyStatuses(mine || []);
    const { data: followed } = await sb.from("follows").select("followee_id").eq("follower_id", myId);
    const ids = (followed || []).map((f) => f.followee_id);
    if (ids.length) {
      const { data: theirs } = await sb
        .from("status_posts")
        .select("*, profiles!status_posts_user_id_fkey(username, avatar_url, avatar_emoji)")
        .in("user_id", ids)
        .gt("expires_at", nowIso)
        .order("created_at", { ascending: false });
      setOthers(theirs || []);
    }
  };

  useEffect(() => {
    load();
    const channel = sb
      .channel("status_posts_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "status_posts" }, load)
      .subscribe();
    return () => sb.removeChannel(channel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar
        title="Status"
        right={
          <button onClick={onNewStatus} style={{ background: "none", border: "none", color: "#F2A93B", cursor: "pointer", display: "flex" }}>
            <Plus size={20} />
          </button>
        }
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px" }}>
        <div onClick={onNewStatus} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 4px", cursor: "pointer" }}>
          <div style={{ position: "relative" }}>
            <HexAvatar emoji={profile.avatar_url || profile.avatar_emoji} size={50} ring={myStatuses.length > 0} />
            <div style={{ position: "absolute", bottom: -2, right: -2, background: "#F2A93B", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #14161B" }}>
              <Plus size={11} color="#1A1305" />
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#F1EDE4" }}>My status</div>
            <div style={{ fontSize: 12, color: "#6B6F78" }}>
              {myStatuses.length ? `${myStatuses.length} update${myStatuses.length > 1 ? "s" : ""} · tap to add another` : "Tap to add an update"}
            </div>
          </div>
        </div>

        <div style={{ fontSize: 11.5, letterSpacing: 1, color: "#6B6F78", margin: "14px 4px 8px", textTransform: "uppercase" }}>Recent</div>
        {others.map((s) => (
          <div key={s.id} onClick={() => onOpenProfile(s.user_id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 4px", cursor: "pointer" }}>
            <HexAvatar emoji={s.profiles?.avatar_url || s.profiles?.avatar_emoji} ring />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#F1EDE4" }}>{s.profiles?.username}</div>
              <div style={{ fontSize: 12, color: "#6B6F78" }}>{fmtTime(s.created_at)}</div>
            </div>
          </div>
        ))}
        {others.length === 0 && (
          <div style={{ fontSize: 12.5, color: "#6B6F78", padding: "10px 4px" }}>
            No recent updates from people you follow.
          </div>
        )}
      </div>
    </div>
  );
}

// ---- profile ---------------------------------------------------------

function ProfilePage({ userId, isMe, onBack, onEdit, profile, myId, onSignOut }) {
  const [person, setPerson] = useState(isMe ? profile : null);
  const [known, setKnown] = useState(isMe);

  useEffect(() => {
    if (isMe) return;
    (async () => {
      const { data: p } = await sb.from("profiles").select("*").eq("id", userId).maybeSingle();
      setPerson(p);
      const { data: f } = await sb.from("follows").select("id").eq("follower_id", userId).eq("followee_id", myId).maybeSingle();
      setKnown(!!f);
    })();
  }, [userId, isMe, myId]);

  const showDetails = isMe || known;
  const p = isMe ? profile : person;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar title="Profile" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <HexAvatar emoji={p?.avatar_url || p?.avatar_emoji} size={90} ring />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: "#F1EDE4" }}>
            {showDetails ? p?.username : "Not saved"}
          </div>
          {isMe && (
            <button
              onClick={onEdit}
              style={{ background: "rgba(242,169,59,0.12)", border: "1px solid rgba(242,169,59,0.3)", borderRadius: "50%", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <Pencil size={12} color="#F2A93B" />
            </button>
          )}
        </div>
        <div style={{ fontSize: 13, color: "#6B6F78", marginTop: 2 }}>{showDetails ? `@${p?.username}` : p?.email}</div>

        {showDetails ? (
          <div style={{ ...S.card, width: "100%", marginTop: 26, textAlign: "left" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Info size={15} color="#F2A93B" style={{ marginTop: 2 }} />
              <div>
                <div style={S.label}>Bio</div>
                <div style={{ fontSize: 13.5, color: "#F1EDE4", marginTop: 2 }}>{p?.bio || "—"}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 14 }}>
              <Cake size={15} color="#F2A93B" style={{ marginTop: 2 }} />
              <div>
                <div style={S.label}>Birthday</div>
                <div style={{ fontSize: 13.5, color: "#F1EDE4", marginTop: 2 }}>{p?.birthday || "—"}</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ width: "100%", marginTop: 26, background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.12)", borderRadius: 16, padding: 18, fontSize: 13, color: "#8B8F98", lineHeight: 1.5 }}>
            You can message this email, but you won't see their username, status, or profile details until they save or follow you back.
          </div>
        )}

        {isMe && (
          <button
            onClick={onSignOut}
            style={{
              width: "100%",
              marginTop: 16,
              background: "rgba(232,92,92,0.1)",
              border: "1px solid rgba(232,92,92,0.3)",
              borderRadius: 14,
              padding: "12px",
              fontSize: 13.5,
              fontWeight: 600,
              color: "#E85C5C",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <LogOut size={15} />
            Sign out
          </button>
        )}
      </div>
    </div>
  );
}

// ---- DM chats ---------------------------------------------------------

function ChatsList({ myId, onOpen, onSendCold, onNewChat }) {
  const [chats, setChats] = useState([]);
  const [findEmail, setFindEmail] = useState("");

  const load = async () => {
    const { data } = await sb
      .from("messages")
      .select("*, sender:profiles!messages_sender_id_fkey(username, avatar_url, avatar_emoji), receiver:profiles!messages_receiver_id_fkey(username, avatar_url, avatar_emoji)")
      .or(`sender_id.eq.${myId},receiver_id.eq.${myId}`)
      .order("created_at", { ascending: false });
    const byPartner = new Map();
    for (const m of data || []) {
      const partnerId = m.sender_id === myId ? m.receiver_id : m.sender_id;
      if (!byPartner.has(partnerId)) {
        const partner = m.sender_id === myId ? m.receiver : m.sender;
        byPartner.set(partnerId, { id: partnerId, partner, lastMsg: m });
      }
    }
    setChats([...byPartner.values()]);
  };

  useEffect(() => {
    load();
    const channel = sb
      .channel("messages_list_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, load)
      .subscribe();
    return () => sb.removeChannel(channel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar
        title="Chats"
        right={
          <button onClick={onNewChat} style={{ background: "none", border: "none", color: "#F2A93B", cursor: "pointer", display: "flex" }}>
            <Plus size={20} />
          </button>
        }
      />
      <div style={{ padding: "10px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "9px 12px" }}>
          <Search size={15} color="#6B6F78" />
          <input
            value={findEmail}
            onChange={(e) => setFindEmail(e.target.value)}
            placeholder="Message any email…"
            style={{ background: "none", border: "none", outline: "none", color: "#F1EDE4", fontSize: 13.5, fontFamily: "'Inter', sans-serif", flex: 1 }}
          />
          {findEmail.includes("@") && (
            <button onClick={() => onSendCold(findEmail)} style={{ background: "#F2A93B", border: "none", borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 600, color: "#1A1305", cursor: "pointer" }}>
              Message
            </button>
          )}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 6px" }}>
        {chats.map((c) => (
          <div
            key={c.id}
            onClick={() => onOpen(c.id, c.partner)}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 10px", borderRadius: 14, cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <HexAvatar emoji={c.partner?.avatar_url || c.partner?.avatar_emoji} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14.5, color: "#F1EDE4" }}>{c.partner?.username}</span>
                <span style={{ fontSize: 11, color: "#6B6F78" }}>{fmtTime(c.lastMsg.created_at)}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                {c.lastMsg.sender_id === myId && <StatusTick status={c.lastMsg.status || "sent"} />}
                <span style={{ fontSize: 13, color: "#8B8F98", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {c.lastMsg.type === "image" ? "📷 Photo" : c.lastMsg.type === "voice" ? "🎤 Voice message" : c.lastMsg.content}
                </span>
              </div>
            </div>
          </div>
        ))}
        {chats.length === 0 && (
          <div style={{ fontSize: 12.5, color: "#6B6F78", textAlign: "center", marginTop: 30 }}>
            No chats yet — search a username or message an email above.
          </div>
        )}
      </div>
    </div>
  );
}

function ChatThread({ chatId, partner, myId, onBack, onOpenProfile, onForward, allPartners }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [reactingTo, setReactingTo] = useState(null);
  const [pinnedId, setPinnedId] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState("");
  const [forwardingMsg, setForwardingMsg] = useState(null);
  const [recording, setRecording] = useState(false);
  const recordStart = useRef(null);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);

  const load = async () => {
    const { data } = await sb
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${myId},receiver_id.eq.${chatId}),and(sender_id.eq.${chatId},receiver_id.eq.${myId})`)
      .order("created_at", { ascending: true });
    setMessages(data || []);
  };

  useEffect(() => {
    load();
    const channel = sb
      .channel(`messages_${chatId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, load)
      .subscribe();
    return () => sb.removeChannel(channel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, myId]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const send = async () => {
    if (!draft.trim()) return;
    const text = draft;
    setDraft("");
    const rt = replyTo;
    setReplyTo(null);
    const { error } = await sb.from("messages").insert({
      sender_id: myId,
      receiver_id: chatId,
      content: text,
      status: "sent",
      reply_to: rt?.id || null,
    });
    if (error) {
      console.error("Send failed:", error);
      alert("Message failed to send: " + error.message);
    }
  };

  const react = async (id, emoji) => {
    const msg = messages.find((m) => m.id === id);
    await sb.from("messages").update({ reaction: msg.reaction === emoji ? null : emoji }).eq("id", id);
    setReactingTo(null);
  };

  const startEdit = (msg) => {
    setEditingId(msg.id);
    setEditDraft(msg.content || "");
  };
  const saveEdit = async (id) => {
    await sb.from("messages").update({ content: editDraft }).eq("id", id);
    setEditingId(null);
  };
  // silent delete — no tombstone, no notice to the other person
  const deleteMsg = async (id) => {
    await sb.from("messages").delete().eq("id", id);
    if (pinnedId === id) setPinnedId(null);
  };

  const attachImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    try {
      const url = await uploadFile("Hive-media", file);
      await sb.from("messages").insert({ sender_id: myId, receiver_id: chatId, type: "image", media_url: url, status: "sent" });
    } catch (err) {
      console.error("Image send failed:", err);
      alert("Image failed to send: " + (err.message || err));
    }
  };

  const beginRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const secs = Math.max(1, Math.round((Date.now() - recordStart.current) / 1000));
        try {
          const path = `${Date.now()}_voice.webm`;
          const { error } = await sb.storage.from("Hive-media").upload(path, blob, { contentType: "audio/webm" });
          if (error) throw error;
          const { data } = sb.storage.from("Hive-media").getPublicUrl(path);
          await sb.from("messages").insert({ sender_id: myId, receiver_id: chatId, type: "voice", media_url: data.publicUrl, duration: secs, status: "sent" });
        } catch (err) {
          console.error("Voice upload failed:", err);
          alert("Voice message failed to send: " + (err.message || err));
        }
      };
      mr.start();
      recordStart.current = Date.now();
      setRecording(true);
    } catch (err) {
      console.error("Mic access failed:", err);
      alert("Couldn't access microphone: " + (err.message || err));
    }
  };
  const endRecord = () => {
    if (!recording || !mediaRef.current) return;
    setRecording(false);
    mediaRef.current.stop();
  };

  const pinnedMsg = messages.find((m) => m.id === pinnedId);
  const visibleMessages = searchQ.trim() ? messages.filter((m) => m.content?.toLowerCase().includes(searchQ.toLowerCase())) : messages;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {forwardingMsg && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(10,11,13,0.92)", zIndex: 20, display: "flex", flexDirection: "column" }}>
          <TopBar title="Forward to…" onBack={() => setForwardingMsg(null)} />
          <div style={{ flex: 1, overflowY: "auto", padding: "6px 10px" }}>
            {allPartners.filter((c) => c.id !== chatId).map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  onForward(c.id, forwardingMsg);
                  setForwardingMsg(null);
                }}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px", borderRadius: 14, cursor: "pointer" }}
              >
                <HexAvatar emoji={c.partner?.avatar_url || c.partner?.avatar_emoji} size={40} />
                <div style={{ fontSize: 14, fontWeight: 600, color: "#F1EDE4" }}>{c.partner?.username}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {searching ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={() => { setSearching(false); setSearchQ(""); }} style={{ background: "none", border: "none", color: "#F1EDE4", cursor: "pointer", display: "flex" }}>
            <ArrowLeft size={20} />
          </button>
          <input
            autoFocus
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Search in chat…"
            style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "7px 12px", color: "#F1EDE4", outline: "none", fontSize: 13.5, fontFamily: "'Inter', sans-serif" }}
          />
        </div>
      ) : (
        <TopBar
          onBack={onBack}
          title=""
          right={
            <button onClick={() => setSearching(true)} style={{ background: "none", border: "none", color: "#8B8F98", cursor: "pointer", display: "flex" }}>
              <Search size={17} />
            </button>
          }
        />
      )}
      {!searching && (
        <div style={{ position: "absolute", top: 8, left: 52, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => onOpenProfile(chatId)}>
          <HexAvatar emoji={partner?.avatar_url || partner?.avatar_emoji} size={34} ring={partner?.online} />
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15, color: "#F1EDE4" }}>{partner?.username}</div>
            <div style={{ fontSize: 11.5, color: partner?.online ? "#59D499" : "#6B6F78" }}>
              {partner?.online ? "online" : fmtLastSeen(partner?.last_seen)}
            </div>
          </div>
        </div>
      )}

      {pinnedMsg && (
        <div onClick={() => setPinnedId(null)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "rgba(242,169,59,0.08)", borderBottom: "1px solid rgba(255,255,255,0.06)", cursor: "pointer" }}>
          <Pin size={12} color="#F2A93B" />
          <span style={{ fontSize: 12.5, color: "#F1EDE4", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pinnedMsg.content || "Pinned message"}</span>
        </div>
      )}

      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: "auto", padding: `${searching ? 14 : 58}px 14px 10px`, display: "flex", flexDirection: "column", gap: 12, backgroundImage: "radial-gradient(circle at 20% 10%, rgba(242,169,59,0.04), transparent 40%)" }}
      >
        {visibleMessages.map((msg) => {
          const mine = msg.sender_id === myId;
          const repliedMsg = msg.reply_to ? messages.find((m) => m.id === msg.reply_to) : null;
          const isEditing = editingId === msg.id;
          return (
            <div key={msg.id} style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "78%", position: "relative" }} onDoubleClick={() => setReactingTo(msg.id)}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, flexDirection: mine ? "row-reverse" : "row" }}>
                <div
                  style={{
                    background: mine ? "linear-gradient(135deg, #F2A93B, #D98F28)" : "rgba(255,255,255,0.06)",
                    border: mine ? "none" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    padding: msg.type === "image" ? 4 : "8px 12px",
                    color: mine ? "#1A1305" : "#F1EDE4",
                  }}
                >
                  {repliedMsg && (
                    <div style={{ borderLeft: `2px solid ${mine ? "#8A5F0F" : "#F2A93B"}`, paddingLeft: 8, marginBottom: 5, fontSize: 12, opacity: 0.75 }}>
                      {(repliedMsg.content || "media").slice(0, 50)}
                    </div>
                  )}
                  {msg.type === "image" ? (
                    <img src={msg.media_url} alt="" style={{ maxWidth: 180, borderRadius: 12, display: "block" }} />
                  ) : msg.type === "voice" ? (
                    <VoiceNote audioUrl={msg.media_url} mine={mine} />
                  ) : isEditing ? (
                    <input
                      autoFocus
                      value={editDraft}
                      onChange={(e) => setEditDraft(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(msg.id)}
                      onBlur={() => saveEdit(msg.id)}
                      style={{ background: "rgba(0,0,0,0.15)", border: "none", outline: "none", color: mine ? "#1A1305" : "#F1EDE4", fontSize: 14, fontFamily: "'Inter', sans-serif", width: "100%" }}
                    />
                  ) : (
                    <div style={{ fontSize: 14, fontFamily: "'Inter', sans-serif" }}>{msg.content}</div>
                  )}
                  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4, marginTop: msg.type === "image" ? 2 : 3, padding: msg.type === "image" ? "0 4px 2px" : 0 }}>
                    <span style={{ fontSize: 10.5, color: mine ? "rgba(26,19,5,0.6)" : "#6B6F78" }}>{fmtTime(msg.created_at)}</span>
                    {mine && <StatusTick status={msg.status} />}
                  </div>
                </div>
                {!isEditing && (
                  <MessageActionsMenu
                    mine={mine}
                    canEdit={msg.type !== "image" && msg.type !== "voice"}
                    onReply={() => setReplyTo(msg)}
                    onPin={() => setPinnedId(pinnedId === msg.id ? null : msg.id)}
                    onForward={() => setForwardingMsg(msg)}
                    onEdit={() => startEdit(msg)}
                    onDelete={() => deleteMsg(msg.id)}
                  />
                )}
              </div>
              {msg.reaction && (
                <div style={{ position: "absolute", bottom: -10, [mine ? "left" : "right"]: 8, background: "#1A1C22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "1px 5px", fontSize: 11 }}>
                  {msg.reaction}
                </div>
              )}
              {reactingTo === msg.id && (
                <div style={{ display: "flex", gap: 6, background: "#23262E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "5px 8px", marginTop: 2, width: "fit-content" }}>
                  {["❤️", "🔥", "😂", "👍", "😮"].map((e) => (
                    <span key={e} onClick={() => react(msg.id, e)} style={{ cursor: "pointer", fontSize: 15 }}>
                      {e}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {replyTo && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 14px", background: "rgba(242,169,59,0.08)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 12, color: "#F2A93B" }}>Replying: {(replyTo.content || "media").slice(0, 40)}</div>
          <button onClick={() => setReplyTo(null)} style={{ background: "none", border: "none", color: "#8B8F98", cursor: "pointer" }}>✕</button>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(20,22,27,0.7)" }}>
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={attachImage} />
        <button onClick={() => fileInputRef.current?.click()} style={{ background: "none", border: "none", color: "#8B8F98", cursor: "pointer" }}>
          <Camera size={19} />
        </button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Message"
          style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "9px 14px", color: "#F1EDE4", outline: "none", fontSize: 13.5, fontFamily: "'Inter', sans-serif" }}
        />
        <button
          onClick={draft.trim() ? send : undefined}
          onMouseDown={!draft.trim() ? beginRecord : undefined}
          onMouseUp={!draft.trim() ? endRecord : undefined}
          onMouseLeave={!draft.trim() && recording ? endRecord : undefined}
          onTouchStart={!draft.trim() ? (e) => { e.preventDefault(); beginRecord(); } : undefined}
          onTouchEnd={!draft.trim() ? (e) => { e.preventDefault(); endRecord(); } : undefined}
          style={{ background: recording ? "#E85C5C" : "#F2A93B", border: "none", width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: recording ? "#fff" : "#1A1305" }}
        >
          {draft.trim() ? <Send size={15} /> : <Mic size={15} />}
        </button>
      </div>
    </div>
  );
}

// ---- groups ---------------------------------------------------------

function GroupsPage({ onOpen, myId, onCreate }) {
  const [groups, setGroups] = useState([]);

  const load = async () => {
    const { data } = await sb
      .from("group_members")
      .select("groups(*)")
      .eq("user_id", myId);
    setGroups((data || []).map((r) => r.groups).filter(Boolean));
  };

  useEffect(() => {
    load();
    const channel = sb.channel("groups_list_changes").on("postgres_changes", { event: "*", schema: "public", table: "group_members" }, load).subscribe();
    return () => sb.removeChannel(channel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar title="Groups" right={<Plus size={19} color="#F2A93B" style={{ cursor: "pointer" }} onClick={onCreate} />} />
      <div style={{ flex: 1, overflowY: "auto", padding: "6px 10px" }}>
        {groups.map((g) => (
          <div key={g.id} onClick={() => onOpen(g)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px", borderRadius: 14, cursor: "pointer" }}>
            <HexAvatar emoji={g.avatar_url || g.avatar_emoji} size={46} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14.5, color: "#F1EDE4" }}>{g.name}</div>
              <div style={{ fontSize: 12.5, color: "#8B8F98" }}>{g.description}</div>
            </div>
          </div>
        ))}
        <div style={{ margin: "16px 10px", padding: "12px 14px", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: 14, display: "flex", alignItems: "center", gap: 10, color: "#8B8F98", fontSize: 13 }}>
          <Link2 size={15} />
          Join a group via invite link
        </div>
      </div>
    </div>
  );
}

function GroupChatThread({ group, myId, onBack, onOpenSettings, isAdmin }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [profilesById, setProfilesById] = useState({});
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  const load = async () => {
    const { data } = await sb.from("group_messages").select("*").eq("group_id", group.id).order("created_at", { ascending: true });
    setMessages(data || []);
    const ids = [...new Set((data || []).map((m) => m.sender_id))];
    if (ids.length) {
      const { data: profs } = await sb.from("profiles").select("id, username, avatar_url, avatar_emoji").in("id", ids);
      const map = {};
      (profs || []).forEach((p) => (map[p.id] = p));
      setProfilesById(map);
    }
  };

  useEffect(() => {
    load();
    const channel = sb
      .channel(`group_messages_${group.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "group_messages", filter: `group_id=eq.${group.id}` }, load)
      .subscribe();
    return () => sb.removeChannel(channel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const send = async () => {
    if (!draft.trim()) return;
    const text = draft;
    setDraft("");
    await sb.from("group_messages").insert({ group_id: group.id, sender_id: myId, content: text });
  };

  const attachImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    try {
      const url = await uploadFile("Hive-media", file);
      await sb.from("group_messages").insert({ group_id: group.id, sender_id: myId, type: "image", media_url: url });
    } catch {}
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar
        onBack={onBack}
        title=""
        right={
          isAdmin && (
            <button onClick={onOpenSettings} style={{ background: "none", border: "none", color: "#8B8F98", cursor: "pointer", display: "flex" }}>
              <Settings size={18} />
            </button>
          )
        }
      />
      <div style={{ position: "absolute", top: 8, left: 52, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={onOpenSettings}>
        <HexAvatar emoji={group.avatar_url || group.avatar_emoji} size={34} />
        <div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15, color: "#F1EDE4" }}>{group.name}</div>
        </div>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "58px 14px 10px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((msg) => {
          const mine = msg.sender_id === myId;
          const sender = profilesById[msg.sender_id];
          return (
            <div key={msg.id} style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "78%" }}>
              {!mine && <div style={{ fontSize: 11, color: "#F2A93B", marginBottom: 2, marginLeft: 4 }}>{sender?.username || "…"}</div>}
              <div
                style={{
                  background: mine ? "linear-gradient(135deg, #F2A93B, #D98F28)" : "rgba(255,255,255,0.06)",
                  border: mine ? "none" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  padding: msg.type === "image" ? 4 : "8px 12px",
                  color: mine ? "#1A1305" : "#F1EDE4",
                }}
              >
                {msg.type === "image" ? (
                  <img src={msg.media_url} alt="" style={{ maxWidth: 180, borderRadius: 12, display: "block" }} />
                ) : (
                  <div style={{ fontSize: 14, fontFamily: "'Inter', sans-serif" }}>{msg.content}</div>
                )}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: msg.type === "image" ? 2 : 3, padding: msg.type === "image" ? "0 4px 2px" : 0 }}>
                  <span style={{ fontSize: 10.5, color: mine ? "rgba(26,19,5,0.6)" : "#6B6F78" }}>{fmtTime(msg.created_at)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(20,22,27,0.7)" }}>
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={attachImage} />
        <button onClick={() => fileInputRef.current?.click()} style={{ background: "none", border: "none", color: "#8B8F98", cursor: "pointer" }}>
          <Camera size={19} />
        </button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Message the group"
          style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "9px 14px", color: "#F1EDE4", outline: "none", fontSize: 13.5, fontFamily: "'Inter', sans-serif" }}
        />
        <button onClick={send} style={{ background: "#F2A93B", border: "none", width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#1A1305" }}>
          {draft.trim() ? <Send size={15} /> : <Mic size={15} />}
        </button>
      </div>
    </div>
  );
}

function GroupSettingsPanel({ group, onBack }) {
  const [members, setMembers] = useState([]);
  const [copied, setCopied] = useState(false);
  const inviteLink = `hive.app/join/g/${group.id}`;

  const load = async () => {
    const { data } = await sb.from("group_members").select("role, profiles(id, username)").eq("group_id", group.id);
    setMembers(data || []);
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group.id]);

  const copyLink = () => {
    try {
      navigator.clipboard?.writeText(inviteLink);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const removeMember = async (userId) => {
    await sb.from("group_members").delete().eq("group_id", group.id).eq("user_id", userId);
    load();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar title="Group settings" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <HexAvatar emoji={group.avatar_url || group.avatar_emoji} size={72} ring />
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: "#F1EDE4", marginTop: 12 }}>{group.name}</div>
          <div style={{ fontSize: 12.5, color: "#6B6F78", marginTop: 2 }}>{members.length} members</div>
          <div style={{ fontSize: 13, color: "#8B8F98", marginTop: 8, textAlign: "center" }}>{group.description}</div>
        </div>

        <div onClick={copyLink} style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10, background: "rgba(242,169,59,0.08)", border: "1px solid rgba(242,169,59,0.25)", borderRadius: 14, padding: "12px 14px", cursor: "pointer" }}>
          <Link2 size={15} color="#F2A93B" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, color: "#F1EDE4" }}>{inviteLink}</div>
            <div style={{ fontSize: 11, color: "#6B6F78" }}>{copied ? "Copied!" : "Tap to copy invite link"}</div>
          </div>
        </div>

        <div style={{ ...S.card, marginTop: 16 }}>
          <div style={{ ...S.label, marginBottom: 8 }}>Members</div>
          {members.map((m) => (
            <div key={m.profiles.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize: 13.5, color: "#F1EDE4" }}>
                {m.profiles.username} {m.role === "admin" && <span style={{ color: "#F2A93B", fontSize: 11 }}>· admin</span>}
              </span>
              {m.role !== "admin" && (
                <button onClick={() => removeMember(m.profiles.id)} style={{ background: "none", border: "none", color: "#6B6F78", fontSize: 11, cursor: "pointer" }}>
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <div style={{ ...S.card, marginTop: 16, display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ ...S.label, marginBottom: 6 }}>Admin tools</div>
          {["Mute all members", "Approve new members before joining", "Only admins can post", "Delete group"].map((label) => (
            <div key={label} style={{ padding: "9px 0", fontSize: 13.5, color: label === "Delete group" ? "#E85C5C" : "#F1EDE4", borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}>
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- channels ---------------------------------------------------------

function ChannelsPage({ onOpen, myId, onCreate }) {
  const [channels, setChannels] = useState([]);

  const load = async () => {
    const { data } = await sb.from("channel_followers").select("channels(*)").eq("user_id", myId);
    setChannels((data || []).map((r) => r.channels).filter(Boolean));
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar title="Channels" right={<Plus size={19} color="#F2A93B" style={{ cursor: "pointer" }} onClick={onCreate} />} />
      <div style={{ flex: 1, overflowY: "auto", padding: "6px 10px" }}>
        {channels.map((c) => (
          <div key={c.id} onClick={() => onOpen(c)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px", borderRadius: 14, cursor: "pointer" }}>
            <HexAvatar emoji={c.avatar_url || c.avatar_emoji} size={46} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 14.5, color: "#F1EDE4" }}>{c.name}</span>
                {c.verified && <BadgeCheck size={13} color="#F2A93B" />}
              </div>
              <div style={{ fontSize: 12.5, color: "#8B8F98", marginTop: 2 }}>{c.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChannelDetail({ channel, myId, onBack, isAdmin }) {
  const [posts, setPosts] = useState([]);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const [following, setFollowing] = useState(true);
  const inviteLink = `hive.app/c/${channel.handle || channel.id}`;

  const load = async () => {
    const { data } = await sb.from("channel_posts").select("*").eq("channel_id", channel.id).order("created_at", { ascending: false });
    setPosts(data || []);
  };
  useEffect(() => {
    load();
    const ch = sb.channel(`channel_posts_${channel.id}`).on("postgres_changes", { event: "*", schema: "public", table: "channel_posts", filter: `channel_id=eq.${channel.id}` }, load).subscribe();
    return () => sb.removeChannel(ch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel.id]);

  const copyLink = () => {
    try {
      navigator.clipboard?.writeText(inviteLink);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const post = async () => {
    if (!draft.trim()) return;
    setDraft("");
    const { error } = await sb.from("channel_posts").insert({ channel_id: channel.id, content: draft, author_id: myId });
    if (error) {
      console.error("Channel post failed:", error);
      alert("Post failed: " + error.message);
    }
  };

  const toggleFollow = async () => {
    if (following) {
      await sb.from("channel_followers").delete().eq("channel_id", channel.id).eq("user_id", myId);
    } else {
      await sb.from("channel_followers").insert({ channel_id: channel.id, user_id: myId });
    }
    setFollowing((f) => !f);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar title={channel.name} onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <HexAvatar emoji={channel.avatar_url || channel.avatar_emoji} size={72} ring />
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 12 }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: "#F1EDE4" }}>{channel.name}</span>
            {channel.verified && <BadgeCheck size={15} color="#F2A93B" />}
          </div>
          <div style={{ fontSize: 13, color: "#8B8F98", marginTop: 8, textAlign: "center" }}>{channel.description}</div>
          <button
            onClick={toggleFollow}
            style={{ marginTop: 12, background: following ? "#F2A93B" : "rgba(255,255,255,0.08)", border: "none", borderRadius: 20, padding: "7px 20px", fontSize: 13, fontWeight: 600, color: following ? "#1A1305" : "#F1EDE4", cursor: "pointer" }}
          >
            {following ? "Following" : "Follow"}
          </button>
        </div>

        <div onClick={copyLink} style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10, background: "rgba(242,169,59,0.08)", border: "1px solid rgba(242,169,59,0.25)", borderRadius: 14, padding: "12px 14px", cursor: "pointer" }}>
          <Link2 size={15} color="#F2A93B" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, color: "#F1EDE4" }}>{inviteLink}</div>
            <div style={{ fontSize: 11, color: "#6B6F78" }}>{copied ? "Copied!" : "Tap to copy channel link"}</div>
          </div>
        </div>

        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          {posts.map((p) => (
            <div key={p.id} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "12px 14px" }}>
              <div style={{ fontSize: 13.5, color: "#F1EDE4" }}>{p.content}</div>
              <div style={{ fontSize: 11, color: "#6B6F78", marginTop: 6 }}>{fmtTime(p.created_at)}</div>
            </div>
          ))}
        </div>
      </div>

      {isAdmin && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(20,22,27,0.7)" }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && post()}
            placeholder="Broadcast to channel…"
            style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "9px 14px", color: "#F1EDE4", outline: "none", fontSize: 13.5, fontFamily: "'Inter', sans-serif" }}
          />
          <button onClick={post} style={{ background: "#F2A93B", border: "none", width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#1A1305" }}>
            <Send size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

// ---- shell / nav -----------------------------------------------------

const TABS = [
  { id: "chats", label: "Chats", icon: MessageCircle },
  { id: "status", label: "Status", icon: CircleDot },
  { id: "groups", label: "Groups", icon: Users },
  { id: "channels", label: "Channels", icon: Radio },
  { id: "profile", label: "Me", icon: User },
];

export default function Hive() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("chats");
  const [openChatId, setOpenChatId] = useState(null);
  const [openPartner, setOpenPartner] = useState(null);
  const [allPartners, setAllPartners] = useState([]);
  const [viewProfileId, setViewProfileId] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const [openChannel, setOpenChannel] = useState(null);
  const [groupSettingsOpen, setGroupSettingsOpen] = useState(false);
  const [screen, setScreen] = useState(null); // "newChat" | "createGroup" | "createChannel" | "newStatus"

  useEffect(() => {
    (async () => {
      const { data } = await sb.auth.getSession();
      if (data.session) {
        const { data: p } = await sb.from("profiles").select("*").eq("id", data.session.user.id).maybeSingle();
        if (p) setProfile(p);
      }
      setLoading(false);
    })();
    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      if (!session) setProfile(null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const myId = profile?.id;

  const sendCold = async (email) => {
    const { data: p } = await sb.from("profiles").select("*").eq("email", email).maybeSingle();
    if (p) {
      setOpenChatId(p.id);
      setOpenPartner(p);
    } else {
      // no account yet — real send-to-non-user flow depends on a server
      // function to email them a join link; insert a placeholder profile-less
      // message row isn't possible without a receiver id, so this is a stub
      // until that edge function exists.
      alert(`${email} hasn't joined HIVE yet — they'll need an invite to receive this.`);
    }
  };

  const startChatWithUser = (user) => {
    setScreen(null);
    setOpenChatId(user.id);
    setOpenPartner(user);
  };

  const signOut = async () => {
    await sb.auth.signOut();
    setProfile(null);
    setTab("chats");
    setOpenChatId(null);
    setViewProfileId(null);
    setOpenGroup(null);
    setOpenChannel(null);
    setScreen(null);
  };

  const forwardMessage = async (toChatId, msg) => {
    await sb.from("messages").insert({
      sender_id: myId,
      receiver_id: toChatId,
      content: msg.content,
      type: msg.type,
      media_url: msg.media_url,
      duration: msg.duration,
      status: "sent",
    });
  };

  const createGroup = async ({ name, avatar, members }) => {
    const row = {
      name,
      avatar_url: isImg(avatar) ? avatar : null,
      avatar_emoji: isImg(avatar) ? null : avatar,
      description: `Group created by ${profile.username}.`,
      created_by: myId,
    };
    const { data: g, error } = await sb.from("groups").insert(row).select().single();
    if (error) return;
    const memberRows = [{ group_id: g.id, user_id: myId, role: "admin" }, ...members.map((u) => ({ group_id: g.id, user_id: u.id, role: "member" }))];
    await sb.from("group_members").insert(memberRows);
    setScreen(null);
    setOpenGroup(g);
  };

  const createChannel = async ({ name, handle, description, avatar }) => {
    const row = {
      name,
      handle,
      description,
      avatar_url: isImg(avatar) ? avatar : null,
      avatar_emoji: isImg(avatar) ? null : avatar,
      created_by: myId,
      verified: false,
    };
    const { data: c, error } = await sb.from("channels").insert(row).select().single();
    if (error) return;
    await sb.from("channel_followers").insert({ channel_id: c.id, user_id: myId });
    setScreen(null);
    setOpenChannel(c);
  };

  const postStatus = async ({ text, bg, type, mediaUrl, voiceDuration, durationMs }) => {
    await sb.from("status_posts").insert({
      user_id: myId,
      content: text,
      bg,
      type: type || "text",
      media_url: mediaUrl,
      duration: voiceDuration,
      expires_at: new Date(Date.now() + durationMs).toISOString(),
    });
    setScreen(null);
  };

  if (loading) {
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: "#0F1013", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{fontStyle}</style>
        <div style={{ color: "#6B6F78", fontFamily: "'Inter', sans-serif", fontSize: 13 }}>Loading…</div>
      </div>
    );
  }

  let content;
  if (!profile) {
    content = (
      <OnboardingFlow
        onComplete={(p) => {
          setProfile(p);
        }}
      />
    );
  } else if (editingProfile) {
    content = (
      <EditProfilePage
        profile={profile}
        onCancel={() => setEditingProfile(false)}
        onSave={(p) => {
          setProfile(p);
          setEditingProfile(false);
        }}
      />
    );
  } else if (screen === "newChat") {
    content = <NewChatScreen onBack={() => setScreen(null)} onSelectUser={startChatWithUser} myId={myId} />;
  } else if (screen === "createGroup") {
    content = <CreateGroupScreen onBack={() => setScreen(null)} onCreate={createGroup} myId={myId} />;
  } else if (screen === "createChannel") {
    content = <CreateChannelScreen onBack={() => setScreen(null)} onCreate={createChannel} />;
  } else if (screen === "newStatus") {
    content = <NewStatusScreen onBack={() => setScreen(null)} onPost={postStatus} />;
  } else if (viewProfileId) {
    content = (
      <ProfilePage
        userId={viewProfileId}
        isMe={viewProfileId === myId}
        onBack={() => setViewProfileId(null)}
        onEdit={() => setEditingProfile(true)}
        profile={profile}
        myId={myId}
        onSignOut={signOut}
      />
    );
  } else if (openChatId) {
    content = (
      <ChatThread
        chatId={openChatId}
        partner={openPartner}
        myId={myId}
        onBack={() => setOpenChatId(null)}
        onOpenProfile={(id) => setViewProfileId(id)}
        onForward={forwardMessage}
        allPartners={allPartners}
      />
    );
  } else if (openGroup && groupSettingsOpen) {
    content = <GroupSettingsPanel group={openGroup} onBack={() => setGroupSettingsOpen(false)} />;
  } else if (openGroup) {
    content = (
      <GroupChatThread
        group={openGroup}
        myId={myId}
        onBack={() => setOpenGroup(null)}
        onOpenSettings={() => setGroupSettingsOpen(true)}
        isAdmin={openGroup.created_by === myId || !openGroup.created_by}
      />
    );
  } else if (openChannel) {
    content = <ChannelDetail channel={openChannel} myId={myId} onBack={() => setOpenChannel(null)} isAdmin={openChannel.created_by === myId || !openChannel.created_by} />;
  } else if (tab === "chats") {
    content = (
      <ChatsList
        myId={myId}
        onOpen={(id, partner) => {
          setOpenChatId(id);
          setOpenPartner(partner);
        }}
        onSendCold={sendCold}
        onNewChat={() => setScreen("newChat")}
      />
    );
  } else if (tab === "status") {
    content = <StatusPage onOpenProfile={setViewProfileId} profile={profile} myId={myId} onNewStatus={() => setScreen("newStatus")} />;
  } else if (tab === "groups") {
    content = (
      <GroupsPage
        onOpen={(g) => {
          setOpenGroup(g);
          setGroupSettingsOpen(false);
        }}
        myId={myId}
        onCreate={() => setScreen("createGroup")}
      />
    );
  } else if (tab === "channels") {
    content = <ChannelsPage onOpen={setOpenChannel} myId={myId} onCreate={() => setScreen("createChannel")} />;
  } else if (tab === "profile") {
    content = <ProfilePage userId={myId} isMe onBack={null} onEdit={() => setEditingProfile(true)} profile={profile} myId={myId} onSignOut={signOut} />;
  }

  const showNav = !!profile && !openChatId && !viewProfileId && !openGroup && !openChannel && !editingProfile && !screen;

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#0F1013", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 0", fontFamily: "'Inter', sans-serif" }}>
      <style>{fontStyle}</style>
      <div
        style={{
          width: 380,
          height: 780,
          background: "linear-gradient(180deg, #16181D 0%, #101216 100%)",
          borderRadius: 34,
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.02)",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>{content}</div>

        {showNav && (
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "10px 6px 14px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(15,16,19,0.9)", backdropFilter: "blur(10px)" }}>
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <div key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", padding: "4px 10px" }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      clipPath: active ? HEX_CLIP : "none",
                      background: active ? "linear-gradient(135deg, #F2A93B, #D98F28)" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={16} color={active ? "#1A1305" : "#6B6F78"} strokeWidth={2.2} />
                  </div>
                  <span style={{ fontSize: 10, color: active ? "#F2A93B" : "#6B6F78", fontWeight: active ? 600 : 400 }}>{t.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
