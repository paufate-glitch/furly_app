import muffinImg   from "./assets/Muffin.jpg";
import peachImg    from "./assets/Peach.jpg";
import richieImg   from "./assets/Richie.jpg";
import rupertImg   from "./assets/Rupert.jpg";
import ashImg      from "./assets/Ash(cat).jpg";
import caramelImg  from "./assets/Caramel.jpg";
import esenarImg   from "./assets/Esenar.jpg";
import gloriaImg   from "./assets/Gloria(cat).jpg";
import gloryImg    from "./assets/Glory.jpg";
import lallyImg    from "./assets/Lally.jpg";
import lilyImg     from "./assets/Lily.jpg";
import luckyImg    from "./assets/Lucky(cat).png";
import minaImg     from "./assets/Mina.jpg";

import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
//  PET PHOTO RENDERER — handles both image paths and emojis
// ─────────────────────────────────────────────────────────────
function PetPhoto({ photo, name, size = 60, style = {} }) {
  const isEmoji = typeof photo === "string" && [...photo].length <= 2;
  if (isEmoji) {
    return <span style={{ fontSize: size, ...style }}>{photo}</span>;
  }
  return (
    <img
      src={photo}
      alt={name}
      style={{
        width: size,
        height: size,
        objectFit: "cover",
        borderRadius: 12,
        display: "block",
        ...style,
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
//  COLOR PALETTE & STYLE CONSTANTS
// ─────────────────────────────────────────────────────────────
const C = {
  cream:"#FFF8F0",peach:"#FFE8D6",pink:"#FFCDD8",softPink:"#FFB3C6",
  lavender:"#E8D5F5",mint:"#C8F0E0",sand:"#F5E6D0",
  brown:"#8B6355",darkBrown:"#5C3D2E",text:"#3D2314",muted:"#8B6B5A",
  white:"#FFFFFF",accent:"#FF8FAB",accentDk:"#E05478",
  teal:"#5BBFA0",tealLight:"#A8E6D4",yellow:"#FFD166",
  shadow:"rgba(139,99,85,0.13)",orange:"#FF9A5C",
  adminBg:"#1A1A2E",adminCard:"#16213E",adminAccent:"#0F3460",
  adminRed:"#E94560",adminText:"#E0E0E0",adminMuted:"#8892b0",
  adminTeal:"#00B4D8",adminGreen:"#06D6A0",adminYellow:"#FFD166",
};

const S = {
  card:{ background:C.white,borderRadius:20,padding:20,boxShadow:`0 4px 20px ${C.shadow}`,border:`1.5px solid ${C.peach}` },
  btn:(v="primary")=>({
    background:v==="primary"?C.accent:v==="teal"?C.teal:v==="danger"?"#FFB3B3":v==="orange"?C.orange:C.white,
    border:v==="secondary"?`1.5px solid ${C.softPink}`:v==="danger"?"1.5px solid #FF8080":"none",
    borderRadius:20,padding:"10px 22px",cursor:"pointer",fontSize:14,fontWeight:600,
    color:v==="primary"||v==="teal"||v==="orange"?C.white:v==="danger"?"#C0392B":C.accentDk,
    transition:"all 0.2s",display:"inline-flex",alignItems:"center",gap:6,fontFamily:"Georgia, serif",
  }),
  input:{ width:"100%",padding:"10px 14px",borderRadius:12,border:`1.5px solid ${C.peach}`,background:C.cream,fontSize:14,color:C.text,outline:"none",boxSizing:"border-box",fontFamily:"Georgia, serif" },
  tag:(col=C.pink)=>({ background:col,borderRadius:12,padding:"3px 10px",fontSize:11,fontWeight:600,color:C.darkBrown,display:"inline-block" }),
  badge:(col)=>({ background:col,borderRadius:10,padding:"4px 10px",fontSize:11,fontWeight:700,color:C.darkBrown }),
  adminCard:{ background:C.adminCard,borderRadius:12,padding:20,border:"1px solid rgba(255,255,255,0.06)" },
  adminInput:{ width:"100%",padding:"10px 14px",borderRadius:8,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.05)",fontSize:13,color:C.adminText,outline:"none",fontFamily:"'Courier New', monospace",boxSizing:"border-box" },
  adminBtn:(v="primary")=>({
    background:v==="primary"?C.adminRed:v==="green"?C.adminGreen:v==="orange"?"rgba(255,154,92,0.85)":"transparent",
    border:v==="teal"?`1px solid ${C.adminTeal}`:v==="danger"?`1px solid ${C.adminRed}`:"none",
    borderRadius:8,padding:"9px 16px",cursor:"pointer",fontSize:12,fontWeight:600,
    color:v==="primary"?C.white:v==="teal"?C.adminTeal:v==="green"?"#0a2e24":v==="danger"?C.adminRed:v==="orange"?C.white:C.adminText,
    fontFamily:"'Courier New', monospace",letterSpacing:"0.5px",transition:"all 0.2s",
  }),
};

const Badge = ({ count }) => count > 0 ? (
  <span style={{
    position: "absolute", top: -4, right: -4,
    background: C.accentDk, color: C.white,
    borderRadius: "50%", minWidth: 17, height: 17,
    fontSize: 10, fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "0 4px", lineHeight: 1, border: `2px solid ${C.white}`,
  }}>{count > 9 ? "9+" : count}</span>
) : null;

const PawIcon = ({ size=20, color=C.accent }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <ellipse cx="12" cy="17" rx="5" ry="4"/>
    <ellipse cx="7" cy="12" rx="2.5" ry="3"/>
    <ellipse cx="17" cy="12" rx="2.5" ry="3"/>
    <ellipse cx="9" cy="8" rx="2" ry="2.5"/>
    <ellipse cx="15" cy="8" rx="2" ry="2.5"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

// ─────────────────────────────────────────────────────────────
//  LOCALSTORAGE SYNC ENGINE
// ─────────────────────────────────────────────────────────────
const LS_KEYS = {
  users:"furly_users",
  pets:"furly_pets",
  donations:"furly_donations",
  adoptions:"furly_adoptions",
  furfeed:"furly_furfeed",
  chat:"furly_chat",
  followers:"furly_followers",
  activeUsers:"furly_active_users",
  notifications: "furly_notifications",
};

function lsGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

let notifData = lsGet("furly_notifications", []);
const notifStore = {
  get list() { return notifData; },
  add(userId, type, message, tab) {
    notifData = [{ id: Date.now(), userId, type, message, tab, read: false, time: new Date().toISOString() }, ...notifData];
    lsSet("furly_notifications", notifData);
  },
  markRead(userId, tab) {
    notifData = notifData.map(n => n.userId === userId && n.tab === tab ? { ...n, read: true } : n);
    lsSet("furly_notifications", notifData);
  },
  countUnread(userId, tab) {
    return notifData.filter(n => n.userId === userId && n.tab === tab && !n.read).length;
  },
  reload() { notifData = lsGet("furly_notifications", []); },
};

// ─────────────────────────────────────────────────────────────
//  PET MATCH LOGIC
// ─────────────────────────────────────────────────────────────
function getWhyMatch(pet, answers) {
  const vals = Object.values(answers || {});
  if (!pet) return "A wonderful match!";
  if (pet.name === "Rupert") return "Rupert's calm senior energy is a perfect fit for your lifestyle!";
  if (pet.name === "Glory")  return "Glory's loyalty and quiet strength match beautifully with your heart.";
  if (pet.name === "Esenar") return "Esenar's resilient spirit pairs well with an experienced, loving owner.";
  if (pet.name === "Muffin") return vals.includes("Less than 2 hours") ? "Muffin loves having someone home — perfect for you!" : "Muffin's gentle nature will thrive in your care.";
  if (pet.name === "Lally")  return "Lally is steady and affectionate — a great match for a calm home.";
  if (pet.name === "Mina")   return "Mina's sweet disposition suits someone patient and nurturing.";
  if (pet.name === "Caramel") return vals.includes("High/Active") ? "Caramel's puppy energy matches your active lifestyle perfectly!" : "Caramel will fill your home with joy and playful energy!";
  if (pet.name === "Peach")  return "Peach is young and adaptable — she'll grow with you beautifully.";
  if (pet.name === "Lily")   return "Lily's curious spirit is a great match for an attentive owner.";
  if (pet.name === "Richie") return "Richie is young and energetic — perfect for someone ready for adventure!";
  if (pet.name === "Ash")    return "Ash's independent yet warm personality suits your lifestyle perfectly.";
  if (pet.name === "Gloria") return vals.includes("Low/Relaxed") ? "Gloria loves quiet spaces — just like you!" : "Gloria's gentle feline grace will bring calm to your home.";
  if (pet.name === "Lucky")  return "Lucky is a resilient little survivor who deserves all the love you can give!";
  return `${pet.name} is a wonderful match for your lifestyle and personality!`;
}

function getMatchScore(pet, answers) {
  if (!pet) return 70;
  let score = 50;
  const vals = Object.values(answers || {});

  if (pet.species === "dog" && vals.includes("Dog 🐕")) score += 18;
  if (pet.species === "cat" && vals.includes("Cat 🐱")) score += 18;
  if (vals.includes("Open to either 🐾")) score += 6;

  const isEnergetic = pet.personalities?.some(p =>
    ["Energetic","Playful","Brave","Curious"].includes(p));
  const isCalm = pet.personalities?.some(p =>
    ["Calm","Gentle","Quiet","Affectionate"].includes(p));
  if (vals.includes("High/Active") && isEnergetic) score += 12;
  if (vals.includes("Low/Relaxed") && isCalm) score += 12;
  if (vals.includes("Moderate") && !isEnergetic && !isCalm) score += 6;

  const isPuppy = pet.age?.includes("months") || pet.age?.includes("young") || pet.age?.toLowerCase().includes("young");
  const isSenior = pet.age?.includes("5+") || pet.age?.includes("6+") || pet.name === "Rupert" || pet.name === "Glory" || pet.name === "Esenar";
  if (vals.includes("Senior") && isSenior) score += 10;
  if (vals.includes("Puppy/Young") && isPuppy) score += 10;

  if (vals.includes("Yes, young children (under 10)") && pet.personalities?.includes("Good with kids")) score += 10;
  if (vals.includes("Yes, young children (under 10)") && pet.personalities?.includes("Gentle")) score += 5;
  if (vals.includes("Yes, young children (under 10)") && pet.personalities?.includes("Resilient")) score -= 4;

  if (vals.includes("Yes, mixed") && pet.personalities?.includes("Friendly")) score += 6;
  if (vals.includes("No other pets") && pet.personalities?.includes("Independent")) score += 5;

  if (vals.includes("Apartment (small)") && pet.species === "cat") score += 8;
  if (vals.includes("Apartment (small)") && isEnergetic) score -= 6;
  if (vals.includes("House") && isEnergetic) score += 5;
  if (vals.includes("Farm/large property") && isEnergetic) score += 8;

  if (vals.includes("8+ hours") && pet.personalities?.includes("Independent")) score += 7;
  if (vals.includes("8+ hours") && pet.personalities?.includes("Needs constant attention")) score -= 8;
  if (vals.includes("Less than 2 hours") && isCalm) score += 5;

  if (vals.includes("No experience") && (isCalm || pet.personalities?.includes("Friendly"))) score += 7;
  if (vals.includes("No experience") && pet.personalities?.includes("Independent")) score -= 5;
  if (vals.includes("Experienced") && pet.personalities?.includes("Resilient")) score += 6;
  if (vals.includes("Professional") && pet.personalities?.includes("Brave")) score += 6;

  if (pet.healthStatus === "Vaccinated") score += 4;
  if (pet.healthStatus === "Under treatment") score -= 3;

  if (vals.includes("Prefer quiet") && pet.species === "cat") score += 5;
  if (vals.includes("Very sensitive") && pet.species === "cat") score += 4;

  if (vals.includes("Yes, large yard") && pet.species === "dog") score += 6;
  if (vals.includes("No outdoor area") && pet.species === "cat") score += 5;

  const personalityHash = (pet.personalities || []).join("").length % 7;
  score += personalityHash;

  return Math.min(Math.max(score, 55), 99);
}

// ─────────────────────────────────────────────────────────────
//  DEFAULT DATA — 13 REAL PETS FROM DELGADO RESCUE
// ─────────────────────────────────────────────────────────────
const DEFAULT_PETS = [
  {
    id:1, name:"Rupert", species:"dog", age:"5 years+", gender:"Male", breed:"Aspin",
    personalities:["Loyal","Calm","Senior"], healthStatus:"Vaccinated",
    photo: rupertImg, color:"#E8D5F5",
    description:"Rupert has been with us since 2018 and greets every visitor with a wagging tail. This gentle senior boy is looking for a quiet forever home where he can enjoy his golden years."
  },
  {
    id:2, name:"Glory", species:"dog", age:"5 years+", gender:"Female", breed:"Aspin",
    personalities:["Gentle","Loyal","Quiet"], healthStatus:"Vaccinated",
    photo: gloryImg, color:"#C8F0E0",
    description:"Glory is a sweet, sleek girl rescued in 2018. She's calm and devoted, preferring a peaceful home where she can be close to her person all day long."
  },
  {
    id:3, name:"Esenar", species:"dog", age:"6 years+", gender:"Female", breed:"Aspin",
    personalities:["Resilient","Brave","Independent"], healthStatus:"Vaccinated",
    photo: esenarImg, color:"#FFE8D6",
    description:"Esenar is a striking, athletic girl rescued in 2022. She carries herself with quiet confidence and bonds deeply with patient, experienced owners."
  },
  {
    id:4, name:"Muffin", species:"dog", age:"3 years", gender:"Female", breed:"Aspin",
    personalities:["Friendly","Calm","Affectionate"], healthStatus:"Vaccinated",
    photo: muffinImg, color:"#FFD166",
    description:"Muffin was rescued in 2020 and has blossomed into a warm, loving companion. She enjoys being near people and is great with a calm, stable household."
  },
  {
    id:5, name:"Lally", species:"dog", age:"4 years+", gender:"Female", breed:"Aspin",
    personalities:["Gentle","Good with kids","Calm"], healthStatus:"Vaccinated",
    photo: lallyImg, color:"#A8E6D4",
    description:"Lally is a steady, sweet-natured girl rescued in 2021. She gets along well with people of all ages and would thrive in a loving family environment."
  },
  {
    id:6, name:"Mina", species:"dog", age:"3 years", gender:"Female", breed:"Aspin",
    personalities:["Gentle","Shy","Affectionate"], healthStatus:"Under treatment",
    photo: minaImg, color:"#FFB3C6",
    description:"Mina is a soft-hearted girl rescued in 2020. She's a little shy at first but opens up beautifully to patient and nurturing owners who give her time."
  },
  {
    id:7, name:"Caramel", species:"dog", age:"5 months", gender:"Female", breed:"Aspin",
    personalities:["Playful","Energetic","Curious"], healthStatus:"Vaccinated",
    photo: caramelImg, color:"#FFD166",
    description:"Caramel is a vaccinated, dewormed puppy bursting with energy and personality. She loves to explore and play, and will grow into a wonderful companion."
  },
  {
    id:8, name:"Peach", species:"dog", age:"Young adult", gender:"Female", breed:"Aspin",
    personalities:["Gentle","Curious","Adaptable"], healthStatus:"Vaccinated",
    photo: peachImg, color:"#FFE8D6",
    description:"Peach is a young girl rescued in 2023 with a calm, sweet demeanor. She's still learning about the world and will blossom with patient, consistent love."
  },
  {
    id:9, name:"Lily", species:"dog", age:"Young adult", gender:"Female", breed:"Aspin",
    personalities:["Curious","Playful","Gentle"], healthStatus:"Vaccinated",
    photo: lilyImg, color:"#E8D5F5",
    description:"Lily is a young girl rescued in 2023 who loves exploring her surroundings with bright, curious eyes. She'll thrive with an attentive owner who enjoys an active bond."
  },
  {
    id:10, name:"Richie", species:"dog", age:"10 months", gender:"Male", breed:"Aspin",
    personalities:["Playful","Energetic","Brave"], healthStatus:"Vaccinated",
    photo: richieImg, color:"#C8F0E0",
    description:"Richie is a lively young boy rescued in 2022. Full of spunk and personality, he's ready for an active owner who'll help him channel all his puppy energy."
  },
  {
    id:11, name:"Ash", species:"cat", age:"2 years", gender:"Female", breed:"Domestic Shorthair",
    personalities:["Independent","Curious","Calm"], healthStatus:"Vaccinated",
    photo: ashImg, color:"#E8D5F5",
    description:"Ash is a sleek, grey tabby with striking green eyes. She's independent but affectionate on her own terms — the perfect cat for someone who appreciates feline grace."
  },
  {
    id:12, name:"Gloria", species:"cat", age:"3 years", gender:"Female", breed:"Domestic Shorthair",
    personalities:["Calm","Affectionate","Senior-friendly"], healthStatus:"Vaccinated",
    photo: gloriaImg, color:"#FFD166",
    description:"Gloria is a beautiful tabby and white cat with a relaxed, easygoing personality. She loves lounging in warm spots and being gently stroked by the people she trusts."
  },
  {
    id:13, name:"Lucky", species:"cat", age:"Young adult", gender:"Male", breed:"Domestic Shorthair",
    personalities:["Resilient","Playful","Brave"], healthStatus:"Under treatment",
    photo: luckyImg, color:"#A8E6D4",
    description:"Lucky was rescued in March 2025 and is still settling in. Despite a tough start, this little survivor is full of spirit and curiosity, and deserves every bit of love."
  },
];

const DEFAULT_DONATIONS = [
  { id:1,donor:"Anonymous",amount:500,method:"GCash",time:"2026-06-02T10:00:00",type:"monetary" },
  { id:2,donor:"Maria S.",amount:250,method:"Maya",time:"2026-06-02T08:00:00",type:"monetary" },
  { id:3,donor:"Carlos T.",amount:0,method:"Drop-off",time:"2026-06-01T14:00:00",type:"in-kind",note:"Dog food & supplies" },
  { id:4,donor:"Anonymous",amount:1000,method:"Bank Transfer",time:"2026-05-30T09:00:00",type:"monetary" },
];

const DEFAULT_ADOPTIONS = [
  { id:1,applicant:"Juan dela Cruz",userId:"juan_dc",pet:"Rupert 🐕",petId:1,status:"Pending",date:"Jun 1",notes:"",threadId:1,formData:{purpose:"I want to give Rupert a loving retirement home.",living:"Own house with yard",household:"2 adults",experience:"Previously had pets"} },
  { id:2,applicant:"Ana Reyes",userId:"ana_r",pet:"Gloria 🐈",petId:12,status:"Pending",date:"Jun 1",notes:"",threadId:2,formData:{purpose:"I've always loved cats and have a calm apartment.",living:"Own apartment",household:"1 adult",experience:"Experienced"} },
  { id:3,applicant:"Carlo Mendoza",userId:"carlo_m",pet:"Caramel 🐕",petId:7,status:"Approved",date:"May 30",notes:"Interview scheduled",threadId:null,formData:{} },
  { id:4,applicant:"Sofia Garcia",userId:"sofia_g",pet:"Mina 🐶",petId:6,status:"Rejected",date:"May 28",notes:"Living space too small",rejectionReason:"Your current living space is unfortunately too small for Mina's needs during her recovery.",threadId:null,formData:{} },
];

const DEFAULT_FURFEED = [
  { id:1,author:"Delgado Animal Day Care & Rescue Center",authorId:"shelter",type:"shelter",postStatus:"approved",content:"Meet Rupert — rescued in 2018, he's one of our longest residents. This gentle senior boy is still waiting for his forever home. Could it be yours? 🐕❤️",likes:87,reactions:{},userReaction:null,comments:[{id:1,author:"Maria Santos",avatar:"👩",text:"Rupert looks so sweet!",time:"1h ago",reactions:{"❤️":3},userReaction:null}],time:"2026-06-02T08:00:00",tags:["adoption","iloilo"],media:[],liked:false },
  { id:2,author:"Maria Santos",authorId:"maria_s",type:"user",postStatus:"approved",avatar:"👩",content:"Just visited Delgado shelter today and my heart is so full! Please consider giving one of these babies a home! 🐶💕",likes:64,reactions:{},userReaction:null,comments:[],time:"2026-06-02T05:00:00",tags:["adopt","rescue"],media:[],liked:false },
  { id:3,author:"Delgado Animal Day Care & Rescue Center",authorId:"shelter",type:"shelter",postStatus:"approved",content:"🏆 ADOPTION SUCCESS! Caramel has found her forever home! Thank you for choosing adoption! 🐾",likes:156,reactions:{},userReaction:null,comments:[],time:"2026-06-01T12:00:00",tags:["adopted","success","caramel"],media:[],liked:false },
  { id:4,author:"Delgado Animal Day Care & Rescue Center",authorId:"shelter",type:"shelter",postStatus:"approved",content:"💝 HUGE THANK YOU to our amazing volunteers and donors this month! Your support keeps 13 furry lives safe and fed. Together we are making a difference! 🐾",likes:201,reactions:{},userReaction:null,comments:[],time:"2026-05-31T10:00:00",tags:["thankyou","volunteers","donors"],media:[],liked:false },
  { id:5,author:"Delgado Animal Day Care & Rescue Center",authorId:"shelter",type:"shelter",postStatus:"approved",content:"URGENT: We need dog food donations, cleaning supplies, and monetary support. We currently have 13 animals in our care. Every peso and every kilo counts! 🙏",likes:120,reactions:{},userReaction:null,comments:[],time:"2026-05-30T08:00:00",tags:["urgent","donations"],media:[],liked:false },
];

const DEFAULT_CHAT = [
  { id:1, userId:"juan_dc", userName:"Juan dela Cruz", userAvatar:"👨", petName:"Rupert", petPhoto:"🐕", status:"Pending", lastSeen:"2d ago",
    messages:[
      { from:"system", text:"Adoption inquiry for Rupert submitted.", time:"2d ago" },
      { from:"shelter", text:"Hi! We received your inquiry about Rupert 🐾 We'll review shortly!", time:"2d ago" },
      { from:"user", text:"Thank you so much! I'm really excited.", time:"1d ago" },
      { from:"shelter", text:"Wonderful! Could you visit the shelter this weekend?", time:"1d ago" },
    ]},
  { id:2, userId:"ana_r", userName:"Ana Reyes", userAvatar:"👩", petName:"Gloria", petPhoto:"🐈", status:"Pending", lastSeen:"1d ago",
    messages:[
      { from:"system", text:"Adoption inquiry for Gloria submitted.", time:"1d ago" },
      { from:"shelter", text:"Hi Ana! Thanks for your interest in Gloria 🐾", time:"1d ago" },
    ]},
];

const DEFAULT_USERS = [
  { username:"juan_dc", password:"password123", name:"Juan dela Cruz", email:"juan@furly.app", avatar:"👨", isFollower:true },
  { username:"ana_r", password:"password123", name:"Ana Reyes", email:"ana@furly.app", avatar:"👩", isFollower:true },
  { username:"maria_s", password:"password123", name:"Maria Santos", email:"maria@furly.app", avatar:"👩", isFollower:true },
  { username:"carlo_m", password:"password123", name:"Carlo Mendoza", email:"carlo@furly.app", avatar:"🧑", isFollower:false },
];

const SAMPLE_FRIENDS = [
  { username:"juan_dc", name:"Juan dela Cruz", avatar:"👨", online:true },
  { username:"ana_r", name:"Ana Reyes", avatar:"👩", online:true },
  { username:"maria_s", name:"Maria Santos", avatar:"👩", online:false },
  { username:"carlo_m", name:"Carlo Mendoza", avatar:"🧑", online:true },
];

const ADMIN_CREDS = { username:"admin", password:"admin123" };
const SHELTER_INFO = {
  name:"Delgado Animal Day Care & Rescue Center",
  address:"Brgy. Tungay, Santa Barbara, Iloilo",
  contact:"facebook.com/DelgadoAnimalDayCareRescueCenter",
  mission:"Because every furry animal deserves a home.",
  hours:"By appointment — contact via Facebook",
  founded:"2018",
};

const SHELTER_HISTORY = `The Delgado Animal Day Care & Rescue Center was founded by four passionate professionals and pet lovers whose primary goal was to rescue abandoned, injured, and neglected dogs — providing veterinary care, rehabilitation, and eventually finding suitable adopters for them. The shelter focuses exclusively on stray and abandoned animals; it does not accept animals that already have owners.

The founders are not veterinarians — the shelter was established purely through their shared passion for animal welfare. Operations are sustained through their voluntary monthly contributions, and the shelter receives no government funding.

Over time, the shelter developed a small administrative structure. The founders are based in different locations including Roxas and Oton, while a dedicated caretaker manages the shelter site and communicates with them through a group chat. Administrative decisions, adoption coordination, and record management are primarily handled by one of the founders, while the caretaker oversees daily operations.

Initially, records were maintained manually through notebooks and Messenger conversations. As operations grew, adoption and donation information began to be tracked digitally — likely using spreadsheet software on a laptop for easier retrieval.

Today, the shelter continues to operate through a combination of founder contributions, public donations, volunteers, and partnerships with local rescue groups such as Team Rescue Iloilo (TRI) and Furry Friends Second Chance.`;

const TIMELINE = [
  { year:"Founded", event:"Established by 4 professionals/pet lovers to rescue and rehome abandoned dogs. Operated without government funding, relying on founders' monthly contributions." },
  { year:"2018", event:"Current caretaker joined the shelter. Facilities were still basic — bamboo fences and tarpaulin structures. First long-term residents Rupert and Glory were rescued this year." },
  { year:"2020–21", event:"Muffin and Mina rescued in 2020; Lally in 2021. Shelter grew steadily through community support and social media awareness." },
  { year:"2022–23", event:"Esenar, Richie, Peach, and Lily rescued. Digital record-keeping introduced for adoptions and donations." },
  { year:"2025", event:"Lucky rescued in March 2025. Shelter currently cares for 13 animals across dogs and cats, with active adoption drives ongoing." },
];

const ACHIEVEMENTS = [
  { emoji:"🏆", title:"200+ Successful Adoptions", desc:"Over 200 animals have found their forever homes through Delgado Rescue since founding." },
  { emoji:"💝", title:"Community Support", desc:"Sustained entirely by public donations and 4 founders' monthly contributions — zero government funding." },
  { emoji:"🤝", title:"TRI Partnership", desc:"Official partner of Team Rescue Iloilo and Furry Friends Second Chance for wider rescue network." },
  { emoji:"🐾", title:"13 Animals in Care", desc:"Currently caring for 10 dogs and 3 cats with full-time caretaker on site 24/7." },
  { emoji:"📱", title:"4,700+ Followers", desc:"Active Facebook community spreading awareness for animal rescue in Iloilo." },
  { emoji:"🏥", title:"Veterinary Access", desc:"Regular vet partnerships ensure all rescued animals receive proper medical care." },
];

// ─────────────────────────────────────────────────────────────
//  CROSS-TAB STORE FACTORY
// ─────────────────────────────────────────────────────────────
function makeStore(lsKey, defaultData) {
  return {
    _data: lsGet(lsKey, defaultData),
    listeners: [],
    get data() { return this._data; },
    set data(v) { this._data = v; lsSet(lsKey, v); },
    subscribe(fn) { this.listeners.push(fn); },
    unsubscribe(fn) { this.listeners = this.listeners.filter(f => f !== fn); },
    notify() { this.listeners.forEach(fn => fn([...this._data])); },
    reload() { this._data = lsGet(lsKey, defaultData); this.notify(); },
  };
}

const userStore = makeStore(LS_KEYS.users, DEFAULT_USERS);
const petStore = makeStore(LS_KEYS.pets, DEFAULT_PETS);
const donationStore = makeStore(LS_KEYS.donations, DEFAULT_DONATIONS);
const adoptionStore = makeStore(LS_KEYS.adoptions, DEFAULT_ADOPTIONS);
const furfeedStore = makeStore(LS_KEYS.furfeed, DEFAULT_FURFEED);
const chatStore = makeStore(LS_KEYS.chat, DEFAULT_CHAT);

let followersData = lsGet(LS_KEYS.followers, { count: 7356, list: [] });
const followerStore = {
  get count() { return followersData.count; },
  get list() { return followersData.list; },
  toggle(username) {
    const idx = followersData.list.indexOf(username);
    if (idx >= 0) { followersData.list.splice(idx, 1); followersData.count = Math.max(0, followersData.count - 1); }
    else { followersData.list.push(username); followersData.count++; }
    lsSet(LS_KEYS.followers, followersData);
    return followersData.list.includes(username);
  },
  isFollowing(username) { return followersData.list.includes(username); },
  reload() { followersData = lsGet(LS_KEYS.followers, { count: 7356, list: [] }); },
};

let activeUsersData = lsGet(LS_KEYS.activeUsers, []);
const activeUserStore = {
  get list() { return activeUsersData; },
  setActive(username) {
    if (!activeUsersData.includes(username)) { activeUsersData.push(username); lsSet(LS_KEYS.activeUsers, activeUsersData); }
  },
  setInactive(username) {
    activeUsersData = activeUsersData.filter(u => u !== username); lsSet(LS_KEYS.activeUsers, activeUsersData);
  },
  reload() { activeUsersData = lsGet(LS_KEYS.activeUsers, []); },
  getActiveFollowers() {
    const fl = followerStore.list;
    return activeUsersData.filter(u => fl.includes(u)).length;
  },
};

function petStoreAdd(pet) { petStore.data = [...petStore.data, { ...pet, id: Date.now() }]; petStore.notify(); }
function petStoreUpdate(id, data) { petStore.data = petStore.data.map(p => p.id === id ? { ...p, ...data } : p); petStore.notify(); }
function petStoreRemove(id) { petStore.data = petStore.data.filter(p => p.id !== id); petStore.notify(); }

function donationStoreAdd(rec) { donationStore.data = [{ ...rec, id: Date.now(), time: new Date().toISOString() }, ...donationStore.data]; donationStore.notify(); }
function donationStoreTotal() { return donationStore.data.filter(r => r.type === "monetary").reduce((s, r) => s + r.amount, 0); }

function adoptionStoreAdd(req) { adoptionStore.data = [{ ...req, id: Date.now(), date: new Date().toLocaleDateString("en-PH", { month: "short", day: "numeric" }) }, ...adoptionStore.data]; adoptionStore.notify(); }
function adoptionStoreUpdate(id, data) { adoptionStore.data = adoptionStore.data.map(r => r.id === id ? { ...r, ...data } : r); adoptionStore.notify(); }

function furfeedStoreAdd(post) { furfeedStore.data = [{ ...post, id: Date.now(), time: new Date().toISOString(), likes: 0, reactions: {}, userReaction: null, comments: [], liked: false }, ...furfeedStore.data]; furfeedStore.notify(); }
function furfeedStoreUpdate(id, data) { furfeedStore.data = furfeedStore.data.map(p => p.id === id ? { ...p, ...data } : p); furfeedStore.notify(); }
function furfeedStoreRemove(id) { furfeedStore.data = furfeedStore.data.filter(p => p.id !== id); furfeedStore.notify(); }

function chatStoreAdd(thread) { chatStore.data = [...chatStore.data, thread]; chatStore.notify(); }
function chatStoreAddMessage(threadId, msg) {
  chatStore.data = chatStore.data.map(t => t.id === threadId ? { ...t, messages: [...t.messages, msg] } : t);
  chatStore.notify();
}
function chatStoreUpdateStatus(threadId, status) {
  chatStore.data = chatStore.data.map(t => t.id === threadId ? { ...t, status } : t);
  chatStore.notify();
}
function chatStoreGetThread(threadId) { return chatStore.data.find(t => t.id === threadId); }

function userStoreAdd(user) { userStore.data = [...userStore.data, user]; userStore.notify(); }
function userStoreFind(username) { return userStore.data.find(u => u.username === username); }
function userStoreValidate(username, password) {
  const u = userStore.data.find(u => u.username === username);
  if (!u) return { error: "not_found" };
  if (u.password !== password) return { error: "wrong_password" };
  return { user: u };
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === LS_KEYS.pets) { petStore.reload(); }
    if (e.key === LS_KEYS.donations) { donationStore.reload(); }
    if (e.key === LS_KEYS.adoptions) { adoptionStore.reload(); }
    if (e.key === LS_KEYS.furfeed) { furfeedStore.reload(); }
    if (e.key === LS_KEYS.chat) { chatStore.reload(); }
    if (e.key === LS_KEYS.users) { userStore.reload(); }
    if (e.key === LS_KEYS.followers) { followerStore.reload(); }
    if (e.key === LS_KEYS.activeUsers) { activeUserStore.reload(); }
    if (e.key === "furly_notifications") { notifStore.reload(); }
  });
}

// ─────────────────────────────────────────────────────────────
//  SURVEY SECTIONS
// ─────────────────────────────────────────────────────────────
const SURVEY_SECTIONS = [
  { id:"species", title:"What type of pet are you looking for?", questions:[{ id:"q_species", q:"Are you looking to adopt a dog or a cat?", type:"single", opts:["Dog 🐕","Cat 🐱","Open to either 🐾"] }]},
  { id:"lifestyle", title:"Section 1: Lifestyle of the Adopter", questions:[
    { id:"q1", q:"How would you describe your daily energy levels?", type:"single", opts:["Low/Relaxed","Moderate","High/Active"] },
    { id:"q2", q:"How many hours on average will the pet be left home alone?", type:"single", opts:["Less than 2 hours","2–4 hours","4–8 hours","8+ hours"] },
    { id:"q3", q:"How much time for daily exercise or play?", type:"single", opts:["Less than 30 minutes","30 minutes to 1 hour","1–2 hours","More than 2 hours"] },
    { id:"q4", q:"Do you have previous experience owning this pet?", type:"single", opts:["No experience","Some experience","Experienced","Professional"] },
    { id:"q5", q:"How do you prefer to spend your weekends?", type:"single", opts:["Hiking/outdoor adventures","Relaxing at home","Mix of both","Social activities/events"] },
  ]},
  { id:"characteristics", title:"Section 2: Desired Pet Characteristics", questions:[
    { id:"q6", q:"What is your preferred energy level for a companion?", type:"single", opts:["Calm","Playful","Intense"] },
    { id:"q7", q:"Independent or needs constant attention?", type:"single", opts:["Very independent","Somewhat independent","Balanced","Needs constant attention"] },
    { id:"q8", q:"How do you feel about a vocal pet?", type:"single", opts:["Completely fine","Okay with moderate","Prefer quiet","Not okay"] },
    { id:"q9", q:"Is friendliness with strangers a priority?", type:"single", opts:["Yes, very important","Somewhat important","Not important","Prefer protective"] },
  ]},
  { id:"environment", title:"Section 3: Adopter's Environment", questions:[
    { id:"q10", q:"What type of housing do you reside in?", type:"single", opts:["Apartment (small)","Apartment (large)","House","Farm/large property"] },
    { id:"q11", q:"Do you have a securely fenced outdoor area?", type:"single", opts:["Yes, large yard","Yes, small yard","No outdoor area","Communal space"] },
    { id:"q12", q:"Are there children or elderly in your home?", type:"single", opts:["Yes, young children (under 10)","Yes, older children","Yes, elderly","No"] },
    { id:"q13", q:"Are there other pets in the household?", type:"single", opts:["No other pets","Yes, dogs","Yes, cats","Yes, mixed"] },
    { id:"q14", q:"How sensitive is your environment to noise?", type:"single", opts:["Very sensitive","Somewhat sensitive","Not sensitive at all"] },
  ]},
  { id:"commitment", title:"The Commitment Survey", questions:[
    { id:"q15", q:"What specific steps will you take to help a new pet transition in the first 30 days?", type:"text", placeholder:"Describe your 30-day transition plan…" },
    { id:"q16", q:"If your pet develops a behavioral issue, how do you plan to handle it?", type:"text", placeholder:"Describe how you would handle behavioral issues…" },
    { id:"q17", q:"What is your primary reason for wanting to adopt a pet right now?", type:"single", opts:["Companionship","Protection/Security","To give an animal a better life","Other"] },
    { id:"q17_other", q:"If 'Other', please specify:", type:"text_optional", placeholder:"Please specify your reason…", showIf:(answers)=>answers["q18"]==="Other" },
  ]},
];

const REACTIONS = ["❤️","😂","😮","😢","😡","👏"];

// ─────────────────────────────────────────────────────────────
//  FORGOT PASSWORD
// ─────────────────────────────────────────────────────────────
function ForgotPasswordScreen({ onBack }) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSend = async () => {
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email address."); return; }
    setLoading(true); await new Promise(r => setTimeout(r, 1000)); setLoading(false); setStep("sent");
  };
  if (step === "sent") return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(135deg,${C.cream},${C.peach},${C.pink})`, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ maxWidth:420, width:"100%", ...S.card, padding:36, textAlign:"center" }}>
        <div style={{ fontSize:56, marginBottom:12 }}>📬</div>
        <h2 style={{ color:C.teal, margin:"0 0 8px", fontFamily:"Georgia,serif" }}>Email Sent!</h2>
        <p style={{ color:C.muted, fontSize:13, lineHeight:1.7, marginBottom:20 }}>A recovery link has been sent to <strong>{email}</strong>.</p>
        <button style={{ ...S.btn("teal"), width:"100%", justifyContent:"center" }} onClick={onBack}>✓ Done — Back to Login</button>
      </div>
    </div>
  );
  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(135deg,${C.cream},${C.peach},${C.pink})`, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ maxWidth:420, width:"100%", ...S.card, padding:32 }}>
        <div style={{ textAlign:"center", marginBottom:24 }}><div style={{ fontSize:52, marginBottom:12 }}>🔑</div><h2 style={{ color:C.accentDk, margin:"0 0 8px", fontFamily:"Georgia,serif" }}>Forgot Password?</h2></div>
        <input style={{ ...S.input, marginBottom:12 }} placeholder="Enter your email address *" value={email} onChange={e=>{setEmail(e.target.value);setError("");}} type="email"/>
        {error && <p style={{ color:C.accentDk, fontSize:13, fontWeight:600, margin:"0 0 10px" }}>⚠️ {error}</p>}
        <button style={{ ...S.btn("primary"), width:"100%", justifyContent:"center", opacity:loading?0.7:1 }} onClick={handleSend} disabled={loading}>{loading?"Sending…":"📧 Send Recovery Email"}</button>
        <button style={{ ...S.btn("secondary"), width:"100%", justifyContent:"center", marginTop:10 }} onClick={onBack}>← Back to Login</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  AUTH SCREEN
// ─────────────────────────────────────────────────────────────
function AuthScreen({ onLoginUser, onLoginAdmin }) {
  const [role, setRole] = useState("user");
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", birthday:"", gender:"", username:"", password:"" });
  const [adminForm, setAdminForm] = useState({ username:"", password:"" });
  const [error, setError] = useState("");
  const [adminError, setAdminError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [showAdminForgot, setShowAdminForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);

  const setF = k => e => setForm(prev=>({...prev,[k]:e.target.value}));
  const setAF = k => e => setAdminForm(prev=>({...prev,[k]:e.target.value}));
  const clearErrors = () => { setError(""); setAdminError(""); };

  const handleUserSubmit = async () => {
    if (!form.username || !form.password) { setError("Please fill in all required fields."); return; }
    setLoading(true); setError("");
    await new Promise(r=>setTimeout(r,800)); setLoading(false);
    if (mode === "login") {
      const result = userStoreValidate(form.username, form.password);
      if (result.error === "not_found") { setError("User not found. Please check your username or create a new account."); return; }
      if (result.error === "wrong_password") { setError("Invalid username or password. Please try again."); setShowForgot(true); return; }
      activeUserStore.setActive(form.username);
      onLoginUser(result.user);
    } else {
      if (!form.name) { setError("Please enter your full name."); return; }
      const exists = userStoreFind(form.username);
      if (exists) { setError("This username is already taken. Please choose another."); return; }
      const newUser = { username:form.username, password:form.password, name:form.name, email:form.email||`${form.username}@furly.app`, birthday:form.birthday, gender:form.gender, avatar:"🐾", isFollower:false };
      userStoreAdd(newUser);
      activeUserStore.setActive(form.username);
      onLoginUser(newUser);
    }
  };

  const handleGoogle = async () => {
    setGLoading(true); await new Promise(r=>setTimeout(r,1200)); setGLoading(false);
    const u = { name:"Google User", username:"google_user", email:"user@gmail.com", avatar:"🐾", isFollower:false };
    if (!userStoreFind("google_user")) userStoreAdd({ ...u, password:"google_oauth" });
    activeUserStore.setActive("google_user");
    onLoginUser(u);
  };

  const handleAdminSubmit = async () => {
    if (!adminForm.username || !adminForm.password) { setAdminError("Please enter your admin credentials."); return; }
    setLoading(true); setAdminError(""); await new Promise(r=>setTimeout(r,800)); setLoading(false);
    if (adminForm.username !== ADMIN_CREDS.username || adminForm.password !== ADMIN_CREDS.password) { setAdminError("Invalid admin credentials. Access denied."); setShowAdminForgot(true); return; }
    onLoginAdmin({ name:"Shelter Admin", username:"admin" });
  };

  if (showForgot) return <ForgotPasswordScreen onBack={()=>{setShowForgot(false);clearErrors();}}/>;
  if (showAdminForgot) return <ForgotPasswordScreen onBack={()=>{setShowAdminForgot(false);clearErrors();}}/>;

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(135deg,${C.cream} 0%,${C.peach} 50%,${C.pink} 100%)`, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ maxWidth:420, width:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:72, height:72, borderRadius:"50%", background:`linear-gradient(135deg,${C.softPink},${C.accent})`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px", boxShadow:`0 8px 24px ${C.shadow}` }}>
            <PawIcon size={36} color={C.white}/>
          </div>
          <h1 style={{ fontSize:34, fontWeight:700, color:C.accentDk, margin:0, letterSpacing:"-1px", fontFamily:"Georgia,serif" }}>Furly</h1>
          <p style={{ color:C.muted, margin:"6px 0 0", fontSize:14 }}>Pet Adoption Companion · Delgado Rescue</p>
        </div>
        <div style={{ ...S.card, padding:28 }}>
          <div style={{ display:"flex", gap:8, marginBottom:20 }}>
            {[["user","🙋 User"],["admin","🔒 Admin"]].map(([r,label])=>(
              <button key={r} onClick={()=>{setRole(r);clearErrors();}} style={{ flex:1, padding:"10px", borderRadius:12, border:`1.5px solid ${role===r?C.accent:C.peach}`, background:role===r?C.pink:C.white, cursor:"pointer", fontSize:13, fontWeight:600, color:role===r?C.accentDk:C.muted, fontFamily:"Georgia,serif" }}>{label}</button>
            ))}
          </div>
          {role==="user" && (
            <>
              <div style={{ display:"flex", background:C.cream, borderRadius:14, padding:4, marginBottom:20, gap:4 }}>
                {["login","register"].map(m=>(
                  <button key={m} onClick={()=>{setMode(m);clearErrors();}} style={{ flex:1, padding:"9px 0", borderRadius:10, border:"none", cursor:"pointer", fontWeight:600, fontSize:14, background:mode===m?C.white:"transparent", color:mode===m?C.accentDk:C.muted, fontFamily:"Georgia,serif" }}>{m==="login"?"Log In":"Sign Up"}</button>
                ))}
              </div>
              {mode==="register" && (
                <>
                  <input style={{ ...S.input, marginBottom:12 }} placeholder="Full name *" value={form.name} onChange={setF("name")}/>
                  <input style={{ ...S.input, marginBottom:12 }} placeholder="Email" value={form.email} onChange={setF("email")} type="email"/>
                  <input style={{ ...S.input, marginBottom:12 }} placeholder="Birthday (MM/DD/YYYY)" value={form.birthday} onChange={setF("birthday")}/>
                  <select style={{ ...S.input, marginBottom:12 }} value={form.gender} onChange={setF("gender")}>
                    <option value="">Select gender</option>
                    <option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option>
                  </select>
                </>
              )}
              <input style={{ ...S.input, marginBottom:12 }} placeholder="Username *" value={form.username} onChange={setF("username")}/>
              <input type="password" style={{ ...S.input, marginBottom:error?6:12 }} placeholder="Password *" value={form.password} onChange={e=>{setF("password")(e);setError("");setShowForgot(false);}}/>
              {error && (
                <div style={{ background:"#FFE8ED", border:`1.5px solid ${C.softPink}`, borderRadius:10, padding:"10px 14px", marginBottom:10 }}>
                  <p style={{ fontSize:13, color:C.accentDk, fontWeight:600, margin:"0 0 4px" }}>⚠️ {error}</p>
                  {error.includes("not found") && (
                    <div style={{ display:"flex", gap:8, marginTop:8 }}>
                      <button onClick={()=>setMode("register")} style={{ ...S.btn("primary"), padding:"6px 12px", fontSize:12 }}>Create Account</button>
                      <button onClick={()=>setShowForgot(true)} style={{ ...S.btn("secondary"), padding:"6px 12px", fontSize:12 }}>Forgot Password?</button>
                    </div>
                  )}
                  {error.includes("Invalid username") && (
                    <div style={{ marginTop:8 }}>
                      <button onClick={()=>setShowForgot(true)} style={{ ...S.btn("secondary"), padding:"6px 12px", fontSize:12 }}>Reset Password</button>
                    </div>
                  )}
                </div>
              )}
              {showForgot && !error.includes("not found") && <div style={{ textAlign:"right", marginBottom:12 }}><button onClick={()=>setShowForgot(true)} style={{ background:"none", border:"none", color:C.accentDk, fontSize:13, cursor:"pointer", textDecoration:"underline", fontFamily:"Georgia,serif", padding:0 }}>Forgot password?</button></div>}
              <button style={{ ...S.btn("primary"), width:"100%", justifyContent:"center", padding:"13px 22px", fontSize:15, borderRadius:14, opacity:loading?0.7:1 }} onClick={handleUserSubmit} disabled={loading}>
                {loading?"Loading…":mode==="login"?"🐾 Log In":"🐾 Create Account"}
              </button>
              <div style={{ display:"flex", alignItems:"center", gap:8, margin:"16px 0" }}>
                <div style={{ flex:1, height:1, background:C.peach }}/><span style={{ fontSize:12, color:C.muted }}>or</span><div style={{ flex:1, height:1, background:C.peach }}/>
              </div>
              <button onClick={handleGoogle} disabled={gLoading} style={{ background:C.white, border:`1.5px solid ${C.peach}`, borderRadius:12, padding:"10px 20px", cursor:"pointer", fontSize:13, color:C.muted, width:"100%", fontFamily:"Georgia,serif", display:"flex", alignItems:"center", justifyContent:"center", gap:8, opacity:gLoading?0.7:1 }}>
                <GoogleIcon/>{gLoading?"Connecting…":"Continue with Google"}
              </button>
            </>
          )}
          {role==="admin" && (
            <>
              <div style={{ background:`linear-gradient(135deg,${C.adminBg},${C.adminAccent})`, borderRadius:14, padding:16, marginBottom:20, textAlign:"center" }}>
                <div style={{ fontSize:28, marginBottom:6 }}>🔒</div>
                <p style={{ color:"#E0E0E0", fontSize:13, fontFamily:"'Courier New',monospace", letterSpacing:1, margin:"0 0 4px" }}>ADMIN PORTAL</p>
                <p style={{ color:C.adminMuted, fontSize:11, fontFamily:"'Courier New',monospace", margin:0 }}>Authorized personnel only</p>
              </div>
              <input style={{ ...S.input, marginBottom:12, fontFamily:"'Courier New',monospace" }} placeholder="Admin username *" value={adminForm.username} onChange={setAF("username")}/>
              <input type="password" style={{ ...S.input, marginBottom:adminError?6:12, fontFamily:"'Courier New',monospace" }} placeholder="Admin password *" value={adminForm.password} onChange={e=>{setAF("password")(e);setAdminError("");setShowAdminForgot(false);}}/>
              {adminError && <div style={{ background:"#FFE8ED", border:`1.5px solid ${C.softPink}`, borderRadius:10, padding:"10px 14px", marginBottom:10, fontSize:13, color:C.accentDk, fontWeight:600 }}>⚠️ {adminError}</div>}
              <button style={{ ...S.btn("primary"), width:"100%", justifyContent:"center", padding:"13px 22px", fontSize:15, borderRadius:14, background:C.adminRed, opacity:loading?0.7:1 }} onClick={handleAdminSubmit} disabled={loading}>
                {loading?"Verifying…":"🔓 Admin Login"}
              </button>
              <p style={{ textAlign:"center", fontSize:11, color:C.muted, marginTop:12 }}>Demo admin: <strong>admin</strong> / <strong>admin123</strong></p>
              {showAdminForgot && <div style={{ textAlign:"center", marginTop:8 }}><button onClick={()=>setShowAdminForgot(true)} style={{ background:"none", border:"none", color:C.accentDk, fontSize:13, cursor:"pointer", textDecoration:"underline", fontFamily:"Georgia,serif" }}>Forgot password?</button></div>}
            </>
          )}
        </div>
        <p style={{ textAlign:"center", fontSize:11, color:C.muted, marginTop:12 }}>Demo users: <strong>chnela</strong> / <strong>chnela123</strong></p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  COMMENT SECTION
// ─────────────────────────────────────────────────────────────
function CommentSection({ postId, comments, onUpdateComments }) {
  const [text, setText] = useState("");
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const addComment = () => {
    if (!text.trim()) return;
    onUpdateComments(postId, [...comments, { id:Date.now(), author:"You", avatar:"🐾", text, time:"Just now", reactions:{}, userReaction:null }]);
    setText("");
  };
  const reactToComment = (commentId, emoji) => {
    const updated = comments.map(c => {
      if (c.id!==commentId) return c;
      const prev=c.userReaction; const nr={...c.reactions};
      if(prev){nr[prev]=Math.max(0,(nr[prev]||1)-1);if(nr[prev]===0)delete nr[prev];}
      if(prev!==emoji)nr[emoji]=(nr[emoji]||0)+1;
      return {...c,reactions:nr,userReaction:prev===emoji?null:emoji};
    });
    onUpdateComments(postId, updated); setShowReactionPicker(null);
  };
  return (
    <div style={{ borderTop:`1px solid ${C.peach}`, paddingTop:12, marginTop:8 }}>
      {comments.map(c=>(
        <div key={c.id} style={{ display:"flex", gap:8, marginBottom:10, alignItems:"flex-start" }}>
          <div style={{ width:30,height:30,borderRadius:"50%",background:C.peach,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0 }}>{c.avatar}</div>
          <div style={{ flex:1,background:C.cream,borderRadius:14,padding:"8px 12px" }}>
            <p style={{ margin:"0 0 2px",fontWeight:600,fontSize:12,color:C.darkBrown }}>{c.author}</p>
            <p style={{ margin:"0 0 6px",fontSize:13,color:C.text,lineHeight:1.5 }}>{c.text}</p>
            <div style={{ display:"flex",alignItems:"center",gap:6 }}>
              <span style={{ fontSize:10,color:C.muted }}>{c.time}</span>
              {Object.entries(c.reactions).filter(([,v])=>v>0).map(([e,n])=>(
                <span key={e} style={{ fontSize:11,background:C.peach,borderRadius:10,padding:"1px 6px" }}>{e} {n}</span>
              ))}
              <div style={{ position:"relative" }}>
                <button onClick={()=>setShowReactionPicker(showReactionPicker===c.id?null:c.id)} style={{ background:"none",border:`1px solid ${C.peach}`,borderRadius:10,padding:"2px 8px",cursor:"pointer",fontSize:11,color:C.muted,fontFamily:"Georgia,serif" }}>{c.userReaction||"React"}</button>
                {showReactionPicker===c.id&&(
                  <div style={{ position:"absolute",bottom:"calc(100% + 4px)",left:0,background:C.white,border:`1.5px solid ${C.peach}`,borderRadius:12,padding:"6px 8px",display:"flex",gap:4,zIndex:100,boxShadow:`0 4px 16px ${C.shadow}` }}>
                    {REACTIONS.map(e=><button key={e} onClick={()=>reactToComment(c.id,e)} style={{ background:c.userReaction===e?C.peach:"none",border:"none",cursor:"pointer",fontSize:18,borderRadius:8,padding:2 }}>{e}</button>)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      <div style={{ display:"flex",gap:8,alignItems:"center" }}>
        <div style={{ width:30,height:30,borderRadius:"50%",background:C.peach,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0 }}>🐾</div>
        <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addComment()} placeholder="Write a comment…" style={{ ...S.input,borderRadius:20,padding:"8px 14px",flex:1 }}/>
        <button onClick={addComment} style={{ ...S.btn("primary"),padding:"8px 14px",fontSize:12,borderRadius:16 }}>Post</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  FURFEED (USER)
// ─────────────────────────────────────────────────────────────
function FurFeed({ user }) {
  const [posts, setPosts] = useState(furfeedStore.data.filter(p => p.postStatus === "approved"));
  const [allPosts, setAllPosts] = useState([...furfeedStore.data]);
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [openComments, setOpenComments] = useState({});
  const [reactionPicker, setReactionPicker] = useState(null);
  const fileRef = useRef(null);
  const [notifs, setNotifs] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [shareModal, setShareModal] = useState(null);

  useEffect(() => {
    const unread = notifStore.list.filter(n => n.userId === user.username && !n.read && n.tab === "furfeed");
    setNotifs(unread);
  }, []);

  useEffect(() => {
    const handler = (data) => {
      setAllPosts([...data]);
      setPosts(data.filter(p => p.postStatus === "approved"));
    };
    furfeedStore.subscribe(handler);
    return () => furfeedStore.unsubscribe(handler);
  }, []);

  const reactToPost = (postId, emoji) => {
    const updated = allPosts.map(post => {
      if (post.id !== postId) return post;
      const prev = post.userReaction; const nr = { ...(post.reactions || {}) };
      if (prev) { nr[prev]=Math.max(0,(nr[prev]||1)-1); if(nr[prev]===0)delete nr[prev]; }
      if (prev !== emoji) nr[emoji] = (nr[emoji]||0)+1;
      return { ...post, reactions:nr, userReaction:prev===emoji?null:emoji, liked:emoji==="❤️"&&prev!==emoji };
    });
    furfeedStore.data = updated; furfeedStore.notify();
    setReactionPicker(null);
  };

  const handleMediaChange = e => {
    const files = Array.from(e.target.files);
    setMediaFiles(prev=>[...prev,...files.map(f=>({url:URL.createObjectURL(f),type:f.type.startsWith("video")?"video":"image",name:f.name}))]);
  };

  const submitPost = () => {
    if (!newPost.trim() && mediaFiles.length===0) return;
    if (editingPost) {
      furfeedStoreUpdate(editingPost.id, { content: newPost, media: mediaFiles, postStatus: "pending_review" });
      notifStore.add("admin", "pending_post", `${user.name} edited a post — pending re-review`, "furfeed");
    } else {
      furfeedStoreAdd({ author:user.name, authorId:user.username, type:"user", postStatus:"pending_review", avatar:"🐾", content:newPost, tags:[], media:mediaFiles });
      notifStore.add("admin", "pending_post", `New post from ${user.name} pending review`, "furfeed");
    }
    setNewPost(""); setMediaFiles([]); setShowCreate(false); setEditingPost(null);
  };

  const updateComments = (postId, updatedComments) => {
    furfeedStoreUpdate(postId, { comments: updatedComments });
  };

  const fmt = (iso) => { const d=new Date(iso); return isNaN(d)?iso:d.toLocaleDateString("en-PH",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}); };

  const myPendingPosts = allPosts.filter(p => p.authorId === user.username && p.postStatus === "pending_review");
  const myRejectedPosts = allPosts.filter(p => p.authorId === user.username && p.postStatus === "rejected");
  const displayPosts = [...myPendingPosts, ...posts];

  return (
    <div style={{ maxWidth:640, margin:"0 auto", padding:"20px 16px 100px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
        <div style={{ width:42,height:42,borderRadius:"50%",background:`linear-gradient(135deg,${C.softPink},${C.accent})`,display:"flex",alignItems:"center",justifyContent:"center" }}><PawIcon size={22} color={C.white}/></div>
        <div><h2 style={{ margin:0,fontSize:18,color:C.accentDk,fontFamily:"Georgia,serif" }}>FurFeed</h2><p style={{ margin:0,fontSize:12,color:C.muted }}>Stories from the Delgado community</p></div>
      </div>

      {myRejectedPosts.length > 0 && (
        <div style={{ background:"#FFF0F0", border:`1.5px solid #FFB3B3`, borderRadius:14, padding:14, marginBottom:16 }}>
          <p style={{ margin:0, fontSize:13, color:"#C0392B", fontWeight:600 }}>⚠️ {myRejectedPosts.length} of your post(s) were not approved by the shelter admin.</p>
        </div>
      )}

      {notifs.length > 0 && (
        <div style={{ background: C.mint, border: `1.5px solid ${C.teal}`, borderRadius: 14, padding: "12px 16px", marginBottom: 16 }}>
          {notifs.map(n => (
            <p key={n.id} style={{ margin: "0 0 4px", fontSize: 13, color: C.darkBrown, fontWeight: 600 }}>
              {n.type === "post_approved" ? "✅" : "❌"} {n.message}
            </p>
          ))}
        </div>
      )}

      {showCreate ? (
        <div style={{ ...S.card, marginBottom:20, padding:20 }}>
          <p style={{ margin:"0 0 12px", fontWeight:600, fontSize:14 }}>📝 Share a fur story</p>
          <div style={{ background:"#FFF8E8", border:`1.5px solid ${C.yellow}`, borderRadius:10, padding:"8px 12px", marginBottom:12, fontSize:12, color:C.darkBrown }}>
            ℹ️ Your post will be reviewed by the shelter admin before appearing publicly.
          </div>
          <textarea value={newPost} onChange={e=>setNewPost(e.target.value)} placeholder="What's on your mind?" style={{ ...S.input,minHeight:80,resize:"vertical",marginBottom:12 }}/>
          {mediaFiles.length>0&&(
            <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:12 }}>
              {mediaFiles.map((f,i)=>(
                <div key={i} style={{ position:"relative",borderRadius:12,overflow:"hidden",border:`2px solid ${C.softPink}`,width:90,height:90 }}>
                  {f.type==="image"?<img src={f.url} alt="media" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>:<video src={f.url} style={{ width:"100%",height:"100%",objectFit:"cover" }}/>}
                  <button onClick={()=>setMediaFiles(prev=>prev.filter((_,idx)=>idx!==i))} style={{ position:"absolute",top:2,right:2,background:"rgba(0,0,0,0.6)",border:"none",color:"white",borderRadius:"50%",width:18,height:18,cursor:"pointer",fontSize:11 }}>✕</button>
                </div>
              ))}
            </div>
          )}
          <div style={{ display:"flex",gap:8,alignItems:"center",justifyContent:"space-between" }}>
            <div><input ref={fileRef} type="file" accept="image/*,video/*" multiple onChange={handleMediaChange} style={{ display:"none" }}/><button style={{ ...S.btn("secondary"),padding:"8px 14px",fontSize:13 }} onClick={()=>fileRef.current?.click()}>📷 Photo/Video</button></div>
            <div style={{ display:"flex",gap:8 }}>
              <button style={S.btn("secondary")} onClick={()=>{setShowCreate(false);setMediaFiles([]);setNewPost("");setEditingPost(null);}}>Cancel</button>
              <button style={S.btn("primary")} onClick={submitPost}>{editingPost ? "Update Post 🐾" : "Submit for Review 🐾"}</button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ ...S.card,marginBottom:20,display:"flex",alignItems:"center",gap:12,cursor:"text",padding:"14px 20px" }} onClick={()=>setShowCreate(true)}>
          <div style={{ width:36,height:36,borderRadius:"50%",background:C.peach,display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${C.softPink}` }}>🐾</div>
          <span style={{ color:C.muted,fontSize:14 }}>Share a fur story with the community… 🐾</span>
        </div>
      )}

      {displayPosts.length === 0 && (
        <div style={{ ...S.card, textAlign:"center", padding:40 }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🐾</div>
          <h3 style={{ color:C.accentDk, margin:"0 0 8px", fontFamily:"Georgia,serif" }}>No posts yet</h3>
          <p style={{ color:C.muted, fontSize:14 }}>There's no more new posts. Refresh the page or check back later!</p>
        </div>
      )}

      {displayPosts.map(post=>(
        <div key={post.id} style={{ ...S.card, marginBottom:16, opacity:post.postStatus==="pending_review"?0.85:1, border:post.postStatus==="pending_review"?`1.5px solid ${C.yellow}`:undefined }}>
          {post.postStatus === "pending_review" && (
            <div style={{ background:"#FFF8E8", borderRadius:10, padding:"6px 12px", marginBottom:10, fontSize:12, color:C.darkBrown, fontWeight:600 }}>
              ⏳ Pending admin review — only visible to you
              {post.authorId === user.username && (
                <button onClick={()=>{setEditingPost(post);setNewPost(post.content);setMediaFiles(post.media||[]);setShowCreate(true);}} style={{ ...S.btn("secondary"), padding:"5px 12px", fontSize:12 }}>✏️ Edit</button>
              )}
            </div>
          )}
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
            <div style={{ width:40,height:40,borderRadius:"50%",background:post.type==="shelter"?C.tealLight:C.peach,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,border:`2px solid ${post.type==="shelter"?C.teal:C.softPink}` }}>
              {post.type==="shelter"?<PawIcon size={20} color={C.teal}/>:(post.avatar||"🐾")}
            </div>
            <div>
              <p style={{ margin:0,fontWeight:600,fontSize:14 }}>{post.author}</p>
              <p style={{ margin:0,fontSize:11,color:C.muted }}>{fmt(post.time)} {post.type==="shelter"&&<span style={S.badge(C.tealLight)}>🏠 Shelter</span>}</p>
            </div>
          </div>
          <p style={{ margin:"0 0 10px",lineHeight:1.6,fontSize:14 }}>{post.content}</p>
          {post.media&&post.media.length>0&&(
            <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:12 }}>
              {post.media.map((f,i)=>f.type==="image"
                ?<img key={i} src={f.url} alt="media" style={{ width:post.media.length===1?"100%":"calc(50% - 4px)",maxHeight:300,objectFit:"cover",borderRadius:12 }}/>
                :<video key={i} src={f.url} controls style={{ width:"100%",borderRadius:12,maxHeight:300 }}/>
              )}
            </div>
          )}
          {post.tags&&post.tags.length>0&&(
            <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:12 }}>
              {post.tags.map(t=><span key={t} style={S.tag(C.lavender)}>#{t}</span>)}
            </div>
          )}
          {post.reactions&&Object.keys(post.reactions).length>0&&(
            <div style={{ display:"flex",gap:4,marginBottom:8 }}>
              {Object.entries(post.reactions).filter(([,v])=>v>0).map(([e,n])=>(
                <span key={e} style={{ fontSize:11,background:C.peach,borderRadius:10,padding:"2px 8px" }}>{e} {n}</span>
              ))}
            </div>
          )}

          <div style={{ display:"flex",gap:8,borderTop:`1px solid ${C.peach}`,paddingTop:10,flexWrap:"wrap" }}>
            {post.postStatus === "approved" && (
              <>
                <div style={{ position:"relative" }}>
                  <button onClick={()=>setReactionPicker(reactionPicker===post.id?null:post.id)} style={{ ...S.btn(post.userReaction?"primary":"secondary"),padding:"7px 14px",fontSize:13,borderRadius:16 }}>{post.userReaction||(post.liked?"🩷":"🤍")} {post.likes}</button>
                  {reactionPicker===post.id&&(
                    <div style={{ position:"absolute",bottom:"calc(100% + 6px)",left:0,background:C.white,border:`1.5px solid ${C.peach}`,borderRadius:14,padding:"8px 10px",display:"flex",gap:6,zIndex:100,boxShadow:`0 4px 20px ${C.shadow}` }}>
                      {REACTIONS.map(e=><button key={e} onClick={()=>reactToPost(post.id,e)} style={{ background:post.userReaction===e?C.peach:"none",border:"none",cursor:"pointer",fontSize:20,borderRadius:8,padding:4 }}>{e}</button>)}
                    </div>
                  )}
                </div>
                <button onClick={()=>setOpenComments(prev=>({...prev,[post.id]:!prev[post.id]}))} style={{ ...S.btn("secondary"),padding:"7px 14px",fontSize:13,borderRadius:16 }}>💬 {(post.comments||[]).length}</button>
                <button onClick={() => setShareModal(post)} style={{ ...S.btn("secondary"), padding:"7px 14px", fontSize:13, borderRadius:16 }}>↗ Share</button>
              </>
            )}
            {post.authorId === user.username && (
              <div style={{ marginLeft:"auto",display:"flex",gap:6 }}>
                {(post.postStatus === "approved" || post.postStatus === "pending_review") && (
                  <button onClick={()=>{ setEditingPost(post); setNewPost(post.content); setMediaFiles(post.media||[]); setShowCreate(true); window.scrollTo({top:0,behavior:"smooth"}); }} style={{ ...S.btn("secondary"),padding:"6px 12px",fontSize:12,borderRadius:14 }}>✏️ Edit</button>
                )}
                <button onClick={()=>{ furfeedStoreRemove(post.id); }} style={{ ...S.btn("danger"),padding:"6px 12px",fontSize:12,borderRadius:14 }}>🗑️</button>
              </div>
            )}
          </div>
          {openComments[post.id]&&<div style={{ marginTop:12 }}><CommentSection postId={post.id} comments={post.comments||[]} onUpdateComments={updateComments}/></div>}
        </div>
      ))}

      {shareModal && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.45)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:500, padding:20,
        }} onClick={() => setShareModal(null)}>
          <div style={{ ...S.card, maxWidth:500, width:"100%", padding:24 }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <p style={{ margin:0, fontWeight:700, fontSize:15, color:C.darkBrown }}>🔁 Share to FurFeed</p>
              <button onClick={() => setShareModal(null)}
                style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:C.muted }}>✕</button>
            </div>
            <div style={{ background:C.cream, borderRadius:14, padding:14, marginBottom:14, border:`1.5px solid ${C.peach}` }}>
              <p style={{ margin:"0 0 6px", fontSize:12, color:C.muted, fontWeight:600 }}>{shareModal.author}</p>
              <p style={{ margin:0, fontSize:13, color:C.text, lineHeight:1.6 }}>
                {shareModal.content.length > 140 ? shareModal.content.slice(0, 140) + "…" : shareModal.content}
              </p>
            </div>
            <textarea
              id="share-caption"
              placeholder="Add a caption… (optional)"
              style={{ ...S.input, minHeight:72, resize:"vertical", marginBottom:14 }}
            />
            <div style={{ background:"#FFF8E8", border:`1.5px solid ${C.yellow}`, borderRadius:10, padding:"8px 12px", marginBottom:14, fontSize:12, color:C.darkBrown }}>
              ℹ️ Your shared post will be reviewed by the shelter admin before appearing publicly.
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <button style={S.btn("secondary")} onClick={() => setShareModal(null)}>Cancel</button>
              <button style={S.btn("primary")} onClick={() => {
                const caption = document.getElementById("share-caption")?.value?.trim();
                const body = caption
                  ? `${caption}\n\n🔁 Shared from ${shareModal.author}:\n"${shareModal.content.slice(0, 120)}${shareModal.content.length > 120 ? "…" : ""}"`
                  : `🔁 Shared from ${shareModal.author}:\n"${shareModal.content.slice(0, 160)}${shareModal.content.length > 160 ? "…" : ""}"`;
                furfeedStoreAdd({
                  author: user.name,
                  authorId: user.username,
                  type: "user",
                  postStatus: "pending_review",
                  avatar: "🐾",
                  content: body,
                  tags: shareModal.tags || [],
                  media: [],
                });
                notifStore.add("admin", "pending_post", `${user.name} shared a post — pending review`, "furfeed");
                setShareModal(null);
              }}>Share to FurFeed 🐾</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  COMPATIBILITY SURVEY
// ─────────────────────────────────────────────────────────────
function SurveyScreen({ onNavigate }) {
  const [sectionIdx, setSectionIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [phase, setPhase] = useState("survey");
  const [commitChecks, setCommitChecks] = useState({ c1:false,c2:false,c3:false });
  const [pets] = useState([...petStore.data]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [hoveredPet, setHoveredPet] = useState(null);

  const currentSection = SURVEY_SECTIONS[sectionIdx];
  const filteredSectionQs = currentSection.questions.filter(q=>!q.showIf||q.showIf(answers));
  const currentQ = filteredSectionQs[questionIdx];
  const totalSections = SURVEY_SECTIONS.length;
  const speciesValue = answers["q_species"];

  const compatible = (() => {
    const filtered = pets.filter(p => {
      if (speciesValue==="Dog 🐕") return p.species==="dog";
      if (speciesValue==="Cat 🐱") return p.species==="cat";
      return true;
    });
    const scored = (filtered.length>0?filtered:pets).map(p=>({ ...p, score:getMatchScore(p,answers) }));
    return scored.sort((a,b)=>b.score-a.score).slice(0,3);
  })();

  const allQuestions = SURVEY_SECTIONS.flatMap(s=>s.questions.filter(q=>!q.showIf||q.showIf(answers)));
  const answeredCount = allQuestions.filter(q=>answers[q.id]&&answers[q.id].toString().trim()!=="").length;
  const progress = Math.round((answeredCount/allQuestions.length)*100);
  const allCommitChecked = commitChecks.c1&&commitChecks.c2&&commitChecks.c3;

  const goNext = () => {
    if (currentQ?.type!=="text_optional"&&(!answers[currentQ?.id]||answers[currentQ?.id].toString().trim()==="")) return;
    if (questionIdx+1<filteredSectionQs.length) setQuestionIdx(questionIdx+1);
    else if (sectionIdx+1<totalSections) { setSectionIdx(sectionIdx+1); setQuestionIdx(0); }
    else setPhase("results");
  };
  const goPrev = () => {
    if (questionIdx>0) setQuestionIdx(questionIdx-1);
    else if (sectionIdx>0) { const ps=sectionIdx-1; const pqs=SURVEY_SECTIONS[ps].questions.filter(q=>!q.showIf||q.showIf(answers)); setSectionIdx(ps); setQuestionIdx(pqs.length-1); }
  };

  if (phase==="commitment_verify") return (
    <div style={{ maxWidth:520, margin:"0 auto", padding:"20px 16px 100px" }}>
      <div style={{ ...S.card, padding:28 }}>
        <div style={{ fontSize:48, textAlign:"center", marginBottom:12 }}>🤝</div>
        <h2 style={{ textAlign:"center", margin:"0 0 6px", color:C.accentDk, fontFamily:"Georgia,serif" }}>Adopter's Commitment Verification</h2>
        <p style={{ textAlign:"center", color:C.muted, fontSize:13, marginBottom:20 }}>Please read and check all boxes to proceed</p>
        {[{key:"c1",text:"I understand that some pets may take months to fully adjust and I am committed to the process."},{key:"c2",text:"I am prepared for the financial responsibilities of veterinary care, nutrition, and emergency costs."},{key:"c3",text:"I commit to seeking professional training before considering a return due to lifestyle mismatches."}].map(({key,text})=>(
          <label key={key} style={{ display:"flex",alignItems:"flex-start",gap:12,marginBottom:16,cursor:"pointer",background:commitChecks[key]?C.mint:C.cream,borderRadius:14,padding:14,border:`1.5px solid ${commitChecks[key]?C.teal:C.peach}` }}>
            <input type="checkbox" checked={commitChecks[key]} onChange={e=>setCommitChecks(prev=>({...prev,[key]:e.target.checked}))} style={{ marginTop:2,accentColor:C.teal,width:18,height:18,flexShrink:0 }}/>
            <span style={{ fontSize:14,color:C.text,lineHeight:1.6 }}>{text}</span>
          </label>
        ))}
        <button style={{ ...S.btn(allCommitChecked?"teal":"secondary"),width:"100%",justifyContent:"center",fontSize:15,marginTop:8,opacity:allCommitChecked?1:0.5 }} disabled={!allCommitChecked} onClick={()=>setPhase("unblur")}>🔓 Reveal My Matches</button>
        <button style={{ ...S.btn("secondary"),width:"100%",justifyContent:"center",marginTop:10 }} onClick={()=>setPhase("results")}>← Go Back</button>
        <button style={{ ...S.btn("danger"),width:"100%",justifyContent:"center",marginTop:10 }} onClick={()=>onNavigate("furfeed")}>✕ Skip — Back to Feed</button>
        <p style={{ textAlign:"center", color:C.muted, fontSize:12, marginTop:8 }}>Skipping will hide your compatible pet profiles.</p>
      </div>
    </div>
  );

  if (phase==="unblur") {
    const pet = selectedPet || compatible[0];
    return (
      <div style={{ maxWidth:560, margin:"0 auto", padding:"20px 16px 100px" }}>
        <div style={{ ...S.card, padding:28, textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:8 }}>🎉</div>
          <h2 style={{ margin:"0 0 6px", color:C.accentDk, fontFamily:"Georgia,serif" }}>Meet Your Best Match!</h2>
          <div style={{ ...S.card, marginBottom:20, padding:0, overflow:"hidden", border:`2.5px solid ${C.accent}` }}>
            <div style={{ background:C.cream, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px 0", minHeight:120 }}>
              <PetPhoto photo={pet.photo} name={pet.name} size={100} style={{ borderRadius:16 }}/>
            </div>
            <div style={{ padding:20, textAlign:"left" }}>
              <h3 style={{ margin:"0 0 4px", fontSize:22, color:C.darkBrown, fontFamily:"Georgia,serif" }}>{pet.name}</h3>
              <p style={{ margin:"0 0 4px", fontSize:13, color:C.muted }}>{pet.gender} · {pet.age} · {pet.breed}</p>
              <span style={{ ...S.badge(C.mint), fontSize:12, display:"inline-block", marginBottom:10 }}>✅ {pet.healthStatus}</span>
              <p style={{ fontSize:14, lineHeight:1.7, color:C.text, marginBottom:12 }}>{pet.description}</p>
              <div style={{ background:C.cream, borderRadius:12, padding:12, fontSize:13, color:C.accentDk, fontWeight:600 }}>💡 {getWhyMatch(pet, answers)}</div>
              <div style={{ marginTop:8, textAlign:"center" }}>
                <span style={{ fontSize:22, fontWeight:700, color:C.accent }}>{pet.score || getMatchScore(pet, answers)}%</span>
                <span style={{ fontSize:12, color:C.muted }}> compatibility match</span>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button style={{ ...S.btn("primary"), flex:1, justifyContent:"center" }} onClick={()=>onNavigate("adopt", pet)}>🐾 Proceed to Adoption</button>
          </div>
        </div>
      </div>
    );
  }

  if (phase==="results") return (
    <div style={{ maxWidth:700, margin:"0 auto", padding:"20px 16px 100px" }}>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:48, marginBottom:8 }}>🎉</div>
        <h2 style={{ margin:"0 0 8px", color:C.accentDk, fontFamily:"Georgia,serif" }}>Your Compatible Matches!</h2>
        <p style={{ color:C.muted, fontSize:14 }}>Hover over a card to see why you match · Select one to proceed</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:20 }}>
        {compatible.map((pet, i) => (
          <div key={pet.id}
            onMouseEnter={()=>setHoveredPet(pet.id)}
            onMouseLeave={()=>setHoveredPet(null)}
            onClick={()=>setSelectedPet(selectedPet?.id===pet.id?null:pet)}
            style={{ ...S.card, padding:0, overflow:"hidden", cursor:"pointer", position:"relative",
              border: selectedPet?.id===pet.id ? `2.5px solid ${C.accent}` : i===0 ? `2px solid ${C.softPink}` : `1.5px solid ${C.peach}`,
              transform: hoveredPet===pet.id||selectedPet?.id===pet.id ? "translateY(-4px)" : "none",
              transition:"all 0.25s", boxShadow: hoveredPet===pet.id ? `0 12px 32px ${C.shadow}` : undefined,
            }}>
            {i===0 && <div style={{ position:"absolute", top:8, left:8, zIndex:2, background:C.accent, color:C.white, borderRadius:10, padding:"2px 8px", fontSize:10, fontWeight:700 }}>⭐ Best Match</div>}
            {selectedPet?.id===pet.id && <div style={{ position:"absolute", top:8, right:8, zIndex:2, background:C.teal, color:C.white, borderRadius:10, padding:"2px 8px", fontSize:10, fontWeight:700 }}>✓ Selected</div>}
            <div style={{ background:pet.color, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px 0", minHeight:100, filter:"blur(6px)", transition:"filter 0.3s", userSelect:"none" }}>
              <PetPhoto photo={pet.photo} name={pet.name} size={80} style={{ borderRadius:12 }}/>
            </div>
            <div style={{ padding:14 }}>
              <p style={{ margin:"0 0 2px", fontWeight:700, fontSize:15, color:C.darkBrown }}>{pet.name}</p>
              <p style={{ margin:"0 0 6px", fontSize:11, color:C.muted }}>{pet.species==="cat"?"🐱 Cat":"🐕 Dog"}</p>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
                <div style={{ height:6, flex:1, background:C.peach, borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${pet.score}%`, background:`linear-gradient(90deg,${C.accent},${C.accentDk})`, borderRadius:3 }}/>
                </div>
                <span style={{ fontSize:13, fontWeight:700, color:C.accent, flexShrink:0 }}>{pet.score}%</span>
              </div>
              {(hoveredPet===pet.id||selectedPet?.id===pet.id) && (
                <div style={{ background:C.cream, borderRadius:10, padding:10, fontSize:12, color:C.accentDk, lineHeight:1.5, marginTop:6, borderTop:`1px solid ${C.peach}` }}>
                  💡 {getWhyMatch(pet, answers)}
                </div>
              )}
              {hoveredPet!==pet.id && selectedPet?.id!==pet.id && (
                <p style={{ fontSize:11, color:C.muted, fontStyle:"italic", margin:0 }}>Hover to reveal why you match</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <button style={{ ...S.btn("secondary"), flex:1, justifyContent:"center" }} onClick={()=>{setPhase("survey");setSectionIdx(0);setQuestionIdx(0);setAnswers({});setSelectedPet(null);}}>← Retake Survey</button>
        <button style={{ ...S.btn("primary"), flex:1, justifyContent:"center", opacity:selectedPet?1:0.6 }} disabled={!selectedPet} onClick={()=>setPhase("commitment_verify")}>
          {selectedPet ? `🐾 Adopt ${selectedPet.name}` : "Select a pet first"}
        </button>
      </div>
      {!selectedPet && <p style={{ textAlign:"center", color:C.muted, fontSize:12, marginTop:8 }}>Click a card to select which pet you'd like to adopt</p>}
    </div>
  );

  return (
    <div style={{ maxWidth:560, margin:"0 auto", padding:"20px 16px 100px" }}>
      <div style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
          <span style={{ fontSize:12, color:C.muted }}>Section {sectionIdx+1} of {totalSections}</span>
          <span style={{ fontSize:12, fontWeight:600, color:C.accent }}>{progress}% complete</span>
        </div>
        <div style={{ height:6, background:C.peach, borderRadius:3, overflow:"hidden", marginBottom:10 }}>
          <div style={{ height:"100%", width:`${progress}%`, background:`linear-gradient(90deg,${C.accent},${C.accentDk})`, borderRadius:3, transition:"width 0.4s" }}/>
        </div>
        <div style={{ background:C.lavender, borderRadius:12, padding:"8px 14px" }}>
          <p style={{ margin:0, fontWeight:700, fontSize:13, color:C.darkBrown }}>{currentSection.title}</p>
        </div>
      </div>
      {currentQ && (
        <div style={{ ...S.card, padding:28 }}>
          <p style={{ margin:"0 0 6px", fontSize:11, color:C.muted, fontWeight:600 }}>Question {questionIdx+1} of {filteredSectionQs.length}</p>
          <h3 style={{ margin:"0 0 20px", fontSize:17, color:C.darkBrown, lineHeight:1.5, fontFamily:"Georgia,serif" }}>{currentQ.q}</h3>
          {currentQ.type==="single" && (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {currentQ.opts.map(opt=>(
                <button key={opt} onClick={()=>setAnswers(prev=>({...prev,[currentQ.id]:opt}))} style={{ background:answers[currentQ.id]===opt?C.pink:C.cream, border:`2px solid ${answers[currentQ.id]===opt?C.accent:C.peach}`, borderRadius:14, padding:"14px 18px", cursor:"pointer", textAlign:"left", fontSize:14, color:C.text, fontFamily:"Georgia,serif", fontWeight:answers[currentQ.id]===opt?600:400 }}>
                  {answers[currentQ.id]===opt?"✓ ":""}{opt}
                </button>
              ))}
            </div>
          )}
          {(currentQ.type==="text"||currentQ.type==="text_optional") && (
            <textarea value={answers[currentQ.id]||""} onChange={e=>setAnswers(prev=>({...prev,[currentQ.id]:e.target.value}))} placeholder={currentQ.placeholder} style={{ ...S.input, minHeight:100, resize:"vertical" }}/>
          )}
        </div>
      )}
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:16, gap:10 }}>
        <button style={{ ...S.btn("secondary"), fontSize:13, opacity:(sectionIdx===0&&questionIdx===0)?0.4:1 }} disabled={sectionIdx===0&&questionIdx===0} onClick={goPrev}>← Previous</button>
        <button style={{ ...S.btn("primary"), fontSize:13 }} onClick={goNext} disabled={currentQ?.type!=="text_optional"&&(!answers[currentQ?.id]||answers[currentQ?.id].toString().trim()==="")}>
          {sectionIdx===totalSections-1&&questionIdx===filteredSectionQs.length-1?"See My Matches 🎉":"Next →"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  ADOPTION FORM
// ─────────────────────────────────────────────────────────────
function AdoptionForm({ targetPet, user, onNavigate }) {
  const [form, setForm] = useState({ purpose:"", living:"", household:"", experience:"", agreed:false });
  const [submitted, setSubmitted] = useState(false);
  const set = k => e => setForm(prev=>({...prev,[k]:e.target.value}));

  const handleSubmit = () => {
    const existingThread = chatStore.data.find(t => t.userId === user.username);
    const threadId = existingThread ? existingThread.id : Date.now();

    const req = { applicant:user.name, userId:user.username, pet:`${targetPet?.name||"Pet"} 🐾`, petId:targetPet?.id, status:"Pending", notes:"", threadId, formData:form };
    adoptionStoreAdd(req);

    if (existingThread) {
      chatStoreAddMessage(existingThread.id, { from:"system", text:`📋 New adoption inquiry submitted for ${targetPet?.name||"Pet"}.`, time:"Just now" });
      chatStoreAddMessage(existingThread.id, { from:"shelter", text:`Hi ${user.name}! We received your adoption inquiry for ${targetPet?.name||"your chosen pet"} 🐾 We'll review your application and get back to you shortly!`, time:"Just now" });
      chatStoreAddMessage(existingThread.id, { from:"system", text:`📋 Adoption Form Summary:\nPurpose: ${form.purpose}\nLiving: ${form.living}\nHousehold: ${form.household}\nExperience: ${form.experience}`, time:"Just now", isFormSummary:true });
      chatStore.data = chatStore.data.map(t => t.id === existingThread.id ? { ...t, petName: targetPet?.name||"Pet", status:"Pending" } : t);
      chatStore.notify();
    } else {
      const thread = {
        id:threadId, userId:user.username, userName:user.name, userAvatar:"🐾",
        petName:targetPet?.name||"Pet", petPhoto:"🐾", status:"Pending", lastSeen:"Just now",
        messages:[
          { from:"system", text:`Adoption inquiry for ${targetPet?.name||"Pet"} submitted.`, time:"Just now" },
          { from:"shelter", text:`Hi ${user.name}! We received your adoption inquiry for ${targetPet?.name||"your chosen pet"} 🐾 We'll review your application and get back to you shortly!`, time:"Just now" },
          { from:"system", text:`📋 Adoption Form Summary:\nPurpose: ${form.purpose}\nLiving: ${form.living}\nHousehold: ${form.household}\nExperience: ${form.experience}`, time:"Just now", isFormSummary:true },
        ]
      };
      chatStoreAdd(thread);
    }

    setSubmitted(true);
  };

  if (submitted) return (
    <div style={{ maxWidth:520, margin:"60px auto", padding:"0 16px 100px", textAlign:"center" }}>
      <div style={{ ...S.card, padding:40 }}>
        <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
        <h2 style={{ color:C.accentDk, margin:"0 0 12px", fontFamily:"Georgia,serif" }}>Request Submitted!</h2>
        <p style={{ color:C.muted, lineHeight:1.7, marginBottom:24, fontSize:14 }}>Your adoption inquiry for <strong>{targetPet?.name||"your fur friend"}</strong> has been sent to Delgado Rescue! Check your chat for updates.</p>
        <div style={{ display:"flex", gap:10 }}>
          <button style={{ ...S.btn("primary"), flex:1, justifyContent:"center" }} onClick={()=>onNavigate("chat")}>View Chat 💬</button>
          <button style={{ ...S.btn("secondary"), flex:1, justifyContent:"center" }} onClick={()=>onNavigate("furfeed")}>Back to Feed</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:560, margin:"0 auto", padding:"20px 16px 100px" }}>
      {targetPet && (
        <div style={{ ...S.card, display:"flex", alignItems:"center", gap:14, marginBottom:20, padding:16 }}>
          <div style={{ background:targetPet.color, borderRadius:14, width:52, height:52, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
            <PetPhoto photo={targetPet.photo} name={targetPet.name} size={52} style={{ borderRadius:14 }}/>
          </div>
          <div><p style={{ margin:0, fontWeight:700, fontSize:15 }}>Adopting {targetPet.name}</p><p style={{ margin:0, fontSize:13, color:C.muted }}>Delgado Animal Day Care & Rescue Center</p></div>
        </div>
      )}
      <div style={{ ...S.card, padding:24 }}>
        <h2 style={{ margin:"0 0 20px", fontSize:18, color:C.accentDk, fontFamily:"Georgia,serif" }}>🐾 Adoption Inquiry Form</h2>
        <div style={{ marginBottom:16 }}>
          <label style={{ display:"block", fontWeight:600, fontSize:13, marginBottom:6, color:C.muted }}>Why do you want to adopt?</label>
          <textarea value={form.purpose} onChange={set("purpose")} placeholder="Tell us about yourself and your intention to adopt…" style={{ ...S.input, minHeight:72, resize:"vertical" }}/>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ display:"block", fontWeight:600, fontSize:13, marginBottom:6, color:C.muted }}>Living situation</label>
          <select value={form.living} onChange={set("living")} style={S.input}>
            <option value="">Select…</option>
            <option>Own apartment</option><option>Renting apartment</option><option>Own house with yard</option><option>Renting house</option><option>With family</option>
          </select>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ display:"block", fontWeight:600, fontSize:13, marginBottom:6, color:C.muted }}>Household members</label>
          <input value={form.household} onChange={set("household")} placeholder="e.g., 2 adults, 1 child (age 8)" style={S.input}/>
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={{ display:"block", fontWeight:600, fontSize:13, marginBottom:6, color:C.muted }}>Experience with pets</label>
          <select value={form.experience} onChange={set("experience")} style={S.input}>
            <option value="">Select…</option>
            <option>First-time owner</option><option>Previously had pets</option><option>Currently have other pets</option><option>Professional experience</option>
          </select>
        </div>
        <label style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:20, cursor:"pointer" }}>
          <input type="checkbox" checked={form.agreed} onChange={e=>setForm(prev=>({...prev,agreed:e.target.checked}))} style={{ marginTop:3, accentColor:C.accent }}/>
          <span style={{ fontSize:13, color:C.text }}>I agree to the shelter's adoption terms and commit to providing a loving forever home 🐾</span>
        </label>
        <button style={{ ...S.btn("primary"), width:"100%", justifyContent:"center", opacity:form.agreed?1:0.5 }} disabled={!form.agreed} onClick={handleSubmit}>
          Submit Adoption Inquiry 🐾
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  SHELTER PROFILE
// ─────────────────────────────────────────────────────────────
function SheltersScreen({ user }) {
  const [donateFlow, setDonateFlow] = useState(null);
  const [monForm, setMonForm] = useState({ name:"", amount:"", method:"GCash", cardNumber:"", cardExpiry:"", cardCVC:"" });
  // FIX: renamed from dropForm to dropForm (was accidentally referenced as dropFlow in original)
  const [dropForm, setDropForm] = useState({ name:"", date:"" });
  const [donated, setDonated] = useState(false);
  const [chatSent, setChatSent] = useState(false);
  const [followed, setFollowed] = useState(followerStore.isFollowing(user?.username||""));
  const [followerCount, setFollowerCount] = useState(followerStore.count);
  const [activeTab, setActiveTab] = useState("about");
  const [petsData] = useState([...petStore.data]);

  const handleFollow = () => {
    const nowFollowing = followerStore.toggle(user?.username||"");
    setFollowed(nowFollowing);
    setFollowerCount(followerStore.count);
  };

  if (donated) return (
    <div style={{ maxWidth:480, margin:"60px auto", padding:"0 16px 100px", textAlign:"center" }}>
      <div style={{ ...S.card, padding:36 }}>
        <div style={{ fontSize:64, marginBottom:12 }}>💝</div>
        <h2 style={{ color:C.teal, margin:"0 0 10px", fontFamily:"Georgia,serif" }}>Thank You for Your Kindness!</h2>
        <p style={{ color:C.muted, lineHeight:1.8, marginBottom:8, fontSize:14 }}>{monForm.name?`Dear ${monForm.name},`:"Dear kind soul,"}<br/>Your donation of <strong>₱{monForm.amount}</strong> has been received.<br/><br/>Your donation has been successfully sent to Delgado Day Care and Animal Shelter. Thank you for your support!</p>
        <button style={{ ...S.btn("primary"), justifyContent:"center" }} onClick={()=>{setDonated(false);setDonateFlow(null);setMonForm({name:"",amount:"",method:"GCash",cardNumber:"",cardExpiry:"",cardCVC:""});}}>Back to Shelter</button>
      </div>
    </div>
  );

  if (chatSent) return (
    <div style={{ maxWidth:480, margin:"60px auto", padding:"0 16px 100px", textAlign:"center" }}>
      <div style={{ ...S.card, padding:36 }}>
        <div style={{ fontSize:56, marginBottom:12 }}>💬</div>
        <h2 style={{ color:C.accentDk, margin:"0 0 10px", fontFamily:"Georgia,serif" }}>Request Sent!</h2>
        <p style={{ color:C.muted, lineHeight:1.7, marginBottom:24, fontSize:14 }}>Your drop-off request for <strong>{dropForm.date}</strong> has been sent to Delgado Rescue. 🐾</p>
        <button style={{ ...S.btn("primary"), justifyContent:"center" }} onClick={()=>{setChatSent(false);setDonateFlow(null);}}>Back to Shelter</button>
      </div>
    </div>
  );

  if (donateFlow==="monetary") return (
    <div style={{ maxWidth:480, margin:"0 auto", padding:"20px 16px 100px" }}>
      <button onClick={()=>setDonateFlow("choose")} style={{ ...S.btn("secondary"), marginBottom:16, fontSize:13 }}>← Back</button>
      <div style={{ ...S.card, padding:24 }}>
        <h2 style={{ margin:"0 0 6px", fontSize:18, color:C.accentDk, fontFamily:"Georgia,serif" }}>💰 Monetary Donation</h2>
        <p style={{ margin:"0 0 20px", color:C.muted, fontSize:13 }}>All donations go directly to animal care at Delgado Rescue.</p>
        <label style={{ display:"block", fontWeight:600, fontSize:13, marginBottom:6, color:C.muted }}>Your name (optional)</label>
        <input value={monForm.name} onChange={e=>setMonForm(prev=>({...prev,name:e.target.value}))} placeholder="Leave blank to donate anonymously" style={{ ...S.input, marginBottom:16 }}/>
        <label style={{ display:"block", fontWeight:600, fontSize:13, marginBottom:6, color:C.muted }}>Donation amount</label>
        <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
          {["50","100","250","500","1000"].map(a=>(
            <button key={a} onClick={()=>setMonForm(prev=>({...prev,amount:a}))} style={{ ...S.btn(monForm.amount===a?"primary":"secondary"), padding:"8px 14px", fontSize:13 }}>₱{a}</button>
          ))}
        </div>
        <input value={monForm.amount} onChange={e=>setMonForm(prev=>({...prev,amount:e.target.value}))} placeholder="Or enter custom amount (₱)" style={{ ...S.input, marginBottom:16 }}/>
        <label style={{ display:"block", fontWeight:600, fontSize:13, marginBottom:6, color:C.muted }}>Payment method</label>
        <select value={monForm.method} onChange={e=>setMonForm(prev=>({...prev,method:e.target.value}))} style={{ ...S.input, marginBottom:16 }}>
          <option>GCash</option><option>Maya (PayMaya)</option><option>GoTyme</option><option>ShopeePay</option><option>SeaMoney</option><option>Bank Transfer</option><option>Debit/Credit Card</option>
        </select>
        {monForm.method==="Debit/Credit Card" && (
          <div style={{ background:C.cream, borderRadius:14, padding:16, marginBottom:16, border:`1.5px solid ${C.peach}` }}>
            <p style={{ margin:"0 0 10px", fontWeight:600, fontSize:13, color:C.darkBrown }}>💳 Card Information</p>
            <input value={monForm.cardNumber} onChange={e=>setMonForm(prev=>({...prev,cardNumber:e.target.value}))} placeholder="Card number" style={{ ...S.input, marginBottom:10 }} maxLength={19}/>
            <div style={{ display:"flex", gap:10 }}>
              <input value={monForm.cardExpiry} onChange={e=>setMonForm(prev=>({...prev,cardExpiry:e.target.value}))} placeholder="MM/YY" style={{ ...S.input, flex:1 }} maxLength={5}/>
              <input value={monForm.cardCVC} onChange={e=>setMonForm(prev=>({...prev,cardCVC:e.target.value}))} placeholder="CVC" style={{ ...S.input, flex:1 }} maxLength={4}/>
            </div>
          </div>
        )}
        <button style={{ ...S.btn("teal"), width:"100%", justifyContent:"center", opacity:monForm.amount?1:0.5 }} disabled={!monForm.amount} onClick={()=>{ donationStoreAdd({ donor:monForm.name||"Anonymous", amount:parseInt(monForm.amount)||0, method:monForm.method, type:"monetary" }); setDonated(true); }}>
          💝 Submit Donation
        </button>
      </div>
    </div>
  );

  if (donateFlow==="dropoff") return (
    <div style={{ maxWidth:480, margin:"0 auto", padding:"20px 16px 100px" }}>
      <button onClick={()=>setDonateFlow("choose")} style={{ ...S.btn("secondary"), marginBottom:16, fontSize:13 }}>← Back</button>
      <div style={{ ...S.card, padding:24 }}>
        <h2 style={{ margin:"0 0 6px", fontSize:18, color:C.accentDk, fontFamily:"Georgia,serif" }}>📦 Drop Off Supplies</h2>
        <p style={{ margin:"0 0 20px", color:C.muted, fontSize:13 }}>We accept dog/cat food, cleaning supplies, medicine, bedding, and toys.</p>
        <label style={{ display:"block", fontWeight:600, fontSize:13, marginBottom:6, color:C.muted }}>Your name (optional)</label>
        <input value={dropForm.name} onChange={e=>setDropForm(prev=>({...prev,name:e.target.value}))} placeholder="Leave blank to drop off anonymously" style={{ ...S.input, marginBottom:16 }}/>
        <label style={{ display:"block", fontWeight:600, fontSize:13, marginBottom:6, color:C.muted }}>Preferred drop-off date</label>
        <input type="date" value={dropForm.date} onChange={e=>setDropForm(prev=>({...prev,date:e.target.value}))} style={{ ...S.input, marginBottom:20 }} min={new Date().toISOString().split("T")[0]}/>
        {/* FIX: was `!dropFlow.date` (undefined) — corrected to `!dropForm.date` */}
        <button style={{ ...S.btn("primary"), width:"100%", justifyContent:"center", opacity:dropForm.date?1:0.5 }} disabled={!dropForm.date} onClick={()=>setChatSent(true)}>💬 Confirm Drop-Off Request</button>
      </div>
    </div>
  );

  if (donateFlow==="choose") return (
    <div style={{ maxWidth:480, margin:"40px auto", padding:"0 16px 100px", textAlign:"center" }}>
      <button onClick={()=>setDonateFlow(null)} style={{ ...S.btn("secondary"), marginBottom:20, fontSize:13 }}>← Back</button>
      <div style={{ ...S.card, padding:32 }}>
        <div style={{ fontSize:48, marginBottom:12 }}>💝</div>
        <h2 style={{ margin:"0 0 8px", color:C.accentDk, fontFamily:"Georgia,serif" }}>How would you like to help?</h2>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <button onClick={()=>setDonateFlow("monetary")} style={{ ...S.card, border:`2px solid ${C.teal}`, padding:20, cursor:"pointer", display:"flex", alignItems:"center", gap:16, background:C.white, textAlign:"left" }}>
            <div style={{ fontSize:40 }}>💰</div>
            <div><p style={{ margin:"0 0 4px", fontWeight:700, fontSize:15, color:C.darkBrown }}>Monetary Donation</p><p style={{ margin:0, fontSize:13, color:C.muted }}>GCash, Maya, GoTyme, or card</p></div>
          </button>
          <button onClick={()=>setDonateFlow("dropoff")} style={{ ...S.card, border:`2px solid ${C.accent}`, padding:20, cursor:"pointer", display:"flex", alignItems:"center", gap:16, background:C.white, textAlign:"left" }}>
            <div style={{ fontSize:40 }}>📦</div>
            <div><p style={{ margin:"0 0 4px", fontWeight:700, fontSize:15, color:C.darkBrown }}>Drop Off Supplies</p><p style={{ margin:0, fontSize:13, color:C.muted }}>Food, medicine, cleaning supplies, toys</p></div>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:680, margin:"0 auto", padding:"0 16px 100px" }}>
      <div style={{ background:`linear-gradient(135deg,${C.accentDk},${C.accent})`, borderRadius:"0 0 28px 28px", padding:"28px 24px 24px", marginBottom:20, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, right:0, opacity:0.12, fontSize:160, lineHeight:1 }}>🐾</div>
        <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(255,255,255,0.25)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}><PawIcon size={34} color={C.white}/></div>
        <h2 style={{ margin:"0 0 4px", color:C.white, fontSize:18, fontFamily:"Georgia,serif" }}>Delgado Animal Day Care &amp; Rescue Center</h2>
        <p style={{ margin:"0 0 10px", color:"rgba(255,255,255,0.85)", fontSize:12 }}>📍 Brgy. Tungay, Santa Barbara, Iloilo</p>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {[`🐾 ${petsData.length} animals in care`,`❤️ Est. ${SHELTER_INFO.founded}`,`${followerCount.toLocaleString()} followers`].map(t=>(
            <span key={t} style={{ background:"rgba(255,255,255,0.2)", borderRadius:10, padding:"3px 10px", fontSize:11, color:C.white, fontWeight:600 }}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", background:C.cream, borderRadius:14, padding:4, marginBottom:20, gap:4 }}>
        {[["about","🏠 About"],["history","📜 History"],["achievements","🏆 Achievements"]].map(([id,label])=>(
          <button key={id} onClick={()=>setActiveTab(id)} style={{ flex:1, padding:"9px 0", borderRadius:10, border:"none", cursor:"pointer", fontWeight:600, fontSize:13, background:activeTab===id?C.white:"transparent", color:activeTab===id?C.accentDk:C.muted, boxShadow:activeTab===id?`0 2px 8px ${C.shadow}`:"none", fontFamily:"Georgia,serif" }}>{label}</button>
        ))}
      </div>
      {activeTab==="about" && (
        <>
          <div style={{ ...S.card, marginBottom:16, padding:20, background:`linear-gradient(135deg,${C.cream},${C.peach})` }}>
            <p style={{ margin:0, fontSize:15, fontStyle:"italic", color:C.darkBrown, lineHeight:1.7, textAlign:"center" }}>"{SHELTER_INFO.mission}"</p>
          </div>
          <div style={{ ...S.card, marginBottom:16, padding:20 }}>
            <h3 style={{ margin:"0 0 14px", fontSize:15, color:C.accentDk, fontFamily:"Georgia,serif" }}>📋 Shelter Information</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[["📍 Address","Brgy. Tungay, Santa Barbara, Iloilo"],["🌐 Facebook","Delgado Animal Day Care & Rescue Center"],["🕐 Visits","By appointment — message on Facebook"],["🐾 Animals in Care",`${petsData.length} animals`],["👥 Run By","4 volunteer founders"],["🏥 Partners","TRI & Furry Friends Second Chance"]].map(([label,val])=>(
                <div key={label} style={{ background:C.cream, borderRadius:12, padding:12 }}>
                  <p style={{ margin:"0 0 3px", fontSize:11, color:C.muted, fontWeight:600 }}>{label}</p>
                  <p style={{ margin:0, fontSize:13, color:C.text }}>{val}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", gap:12, marginBottom:12 }}>
            <button style={{ ...S.btn("primary"), flex:1, justifyContent:"center", padding:"14px 22px", fontSize:15 }} onClick={()=>setDonateFlow("choose")}>💝 Do You Want To Donate?</button>
            <button style={{ ...S.btn(followed?"teal":"secondary"), flex:1, justifyContent:"center", padding:"14px 22px", fontSize:15 }} onClick={handleFollow}>{followed?"✓ Following":"🔔 Follow"}</button>
          </div>
        </>
      )}
      {activeTab==="history" && (
        <>
          <div style={{ ...S.card, marginBottom:16, padding:24 }}>
            <h3 style={{ margin:"0 0 16px", fontSize:16, color:C.accentDk, fontFamily:"Georgia,serif" }}>📜 History of the Shelter Administration</h3>
            {SHELTER_HISTORY.split("\n\n").map((para,i)=>(
              <p key={i} style={{ margin:"0 0 14px", fontSize:14, color:C.text, lineHeight:1.8 }}>{para}</p>
            ))}
          </div>
          <div style={{ ...S.card, padding:24 }}>
            <h3 style={{ margin:"0 0 16px", fontSize:16, color:C.accentDk, fontFamily:"Georgia,serif" }}>🗓️ Timeline</h3>
            {TIMELINE.map((item,i)=>(
              <div key={i} style={{ display:"flex", gap:16, marginBottom:i<TIMELINE.length-1?16:0 }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                  <div style={{ width:44, height:44, borderRadius:"50%", background:C.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:C.white }}>{item.year}</div>
                  {i<TIMELINE.length-1&&<div style={{ width:2, flex:1, background:C.peach, marginTop:4 }}/>}
                </div>
                <div style={{ background:C.cream, borderRadius:14, padding:14, flex:1 }}>
                  <p style={{ margin:0, fontSize:13, color:C.text, lineHeight:1.7 }}>{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {activeTab==="achievements" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {ACHIEVEMENTS.map((a,i)=>(
            <div key={i} style={{ ...S.card, padding:20 }}>
              <div style={{ fontSize:36, marginBottom:8 }}>{a.emoji}</div>
              <p style={{ margin:"0 0 6px", fontWeight:700, fontSize:14, color:C.darkBrown }}>{a.title}</p>
              <p style={{ margin:0, fontSize:12, color:C.muted, lineHeight:1.6 }}>{a.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  USER CHAT
// ─────────────────────────────────────────────────────────────
function ChatScreen({ user, navigateToThreadId }) {
  const [threads, setThreads] = useState([...chatStore.data]);
  const [activeId, setActiveId] = useState(null);
  const [activeType, setActiveType] = useState("shelter");
  const [activeFriend, setActiveFriend] = useState(null);
  const [msg, setMsg] = useState("");
  const [friendMessages, setFriendMessages] = useState({});
  const bottomRef = useRef(null);

  const deleteThread = (threadId) => {
    chatStore.data = chatStore.data.map(t =>
      t.id === threadId
        ? { ...t, messages: [{ from:"system", text:"Conversation cleared.", time:"Now" }] }
        : t
    );
    chatStore.notify();
  };

  useEffect(() => {
    const handler = (data) => setThreads([...data]);
    chatStore.subscribe(handler);
    return () => chatStore.unsubscribe(handler);
  }, []);

  useEffect(() => {
    if (navigateToThreadId) setActiveId(navigateToThreadId);
    else if (threads.length > 0 && !activeId) setActiveId(threads[0].id);
  }, [threads, navigateToThreadId]);

  const myThreads = threads.filter(t => t.userId === user.username);
  const active = myThreads.find(t => t.id === activeId) || myThreads[0];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [active?.messages?.length, activeType, activeFriend]);

  const send = () => {
    if (!msg.trim()) return;
    if (activeType === "shelter" && active) {
      chatStoreAddMessage(active.id, { from:"user", text:msg, time:new Date().toLocaleTimeString("en-PH",{hour:"2-digit",minute:"2-digit"}) });
      setMsg("");
      setTimeout(() => {
        chatStoreAddMessage(active.id, { from:"shelter", text:"Thank you for your message! We'll get back to you shortly 🐾", time:new Date().toLocaleTimeString("en-PH",{hour:"2-digit",minute:"2-digit"}) });
      }, 1500);
    } else if (activeType === "friend" && activeFriend) {
      const key = activeFriend.username;
      const newMsg = { from:"me", text:msg, time:new Date().toLocaleTimeString("en-PH",{hour:"2-digit",minute:"2-digit"}) };
      setFriendMessages(prev => ({ ...prev, [key]: [...(prev[key]||[]), newMsg] }));
      setMsg("");
      setTimeout(() => {
        const reply = { from:"friend", text:`Hey! Thanks for reaching out 🐾 (This is a demo chat with ${activeFriend.name})`, time:new Date().toLocaleTimeString("en-PH",{hour:"2-digit",minute:"2-digit"}) };
        setFriendMessages(prev => ({ ...prev, [key]: [...(prev[key]||[]), reply] }));
      }, 1200);
    }
  };

  const statusColor = (s) => s==="Approved"?C.mint:s==="Rejected"?"#FFB3B3":C.yellow;

  return (
    <div style={{ maxWidth:780, margin:"0 auto", padding:"20px 16px 100px", display:"flex", gap:0, minHeight:"calc(100vh - 140px)" }}>
      <div style={{ width:220, flexShrink:0, marginRight:16 }}>
        <p style={{ margin:"0 0 8px", fontWeight:700, fontSize:13, color:C.accentDk }}>🏠 Shelter</p>
        {myThreads.length === 0 && <p style={{ fontSize:12, color:C.muted, marginBottom:12 }}>No adoption chats yet.</p>}
        {myThreads.map(t=>(
          <div key={t.id} style={{ ...S.card, marginBottom:8, padding:12, border:(activeId===t.id&&activeType==="shelter")?`2px solid ${C.accent}`:undefined, position:"relative" }}>
            <div onClick={()=>{setActiveId(t.id);setActiveType("shelter");setActiveFriend(null);}} style={{ cursor:"pointer" }}>
              <p style={{ margin:"0 0 2px", fontWeight:600, fontSize:12 }}>Delgado Rescue</p>
              <p style={{ margin:"0 0 4px", fontSize:11, color:C.muted }}>Re: {t.petName} {t.petPhoto}</p>
              <span style={{ ...S.badge(statusColor(t.status)), fontSize:10 }}>{t.status}</span>
            </div>
            <button onClick={e=>{e.stopPropagation();deleteThread(t.id);}} style={{ position:"absolute", top:8, right:8, background:"none", border:"none", cursor:"pointer", fontSize:13, color:C.muted, padding:2 }} title="Delete conversation">🗑️</button>
          </div>
        ))}
        <p style={{ margin:"16px 0 8px", fontWeight:700, fontSize:13, color:C.accentDk }}>👥 Friends</p>
        {SAMPLE_FRIENDS.filter(f => f.username !== user.username).map(f=>(
          <div key={f.username} onClick={()=>{setActiveFriend(f);setActiveType("friend");setActiveId(null);}} style={{ ...S.card, cursor:"pointer", marginBottom:8, padding:12, border:(activeType==="friend"&&activeFriend?.username===f.username)?`2px solid ${C.teal}`:undefined, display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ position:"relative" }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:C.peach, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{f.avatar}</div>
              <div style={{ position:"absolute", bottom:0, right:0, width:10, height:10, borderRadius:"50%", background:f.online?"#06D6A0":"#ccc", border:"2px solid white" }}/>
            </div>
            <div>
              <p style={{ margin:"0 0 1px", fontWeight:600, fontSize:12, color:C.darkBrown }}>{f.name}</p>
              <p style={{ margin:0, fontSize:10, color:f.online?C.teal:C.muted }}>{f.online?"Online":"Offline"}</p>
            </div>
          </div>
        ))}
      </div>

      {activeType === "shelter" && active ? (
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
          <div style={{ ...S.card, padding:"12px 16px", borderRadius:"20px 20px 0 0", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:C.tealLight, display:"flex", alignItems:"center", justifyContent:"center" }}><PawIcon size={18} color={C.teal}/></div>
            <div>
              <p style={{ margin:0, fontWeight:700, fontSize:14 }}>Delgado Animal Day Care &amp; Rescue Center</p>
              <p style={{ margin:0, fontSize:12, color:C.muted }}>Re: {active.petName} {active.petPhoto}</p>
            </div>
            <span style={{ ...S.badge(statusColor(active.status)), marginLeft:"auto" }}>{active.status}</span>
          </div>
          <div style={{ flex:1, background:C.white, overflowY:"auto", padding:16, border:`1.5px solid ${C.peach}`, borderTop:"none", borderBottom:"none", maxHeight:420 }}>
            {active.messages.map((m,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:m.from==="user"?"flex-end":"flex-start", marginBottom:12 }}>
                {m.from!=="user" && <div style={{ width:30, height:30, borderRadius:"50%", background:C.tealLight, display:"flex", alignItems:"center", justifyContent:"center", marginRight:8, flexShrink:0 }}>{m.from==="system"?"🤖":<PawIcon size={14} color={C.teal}/>}</div>}
                <div style={{ maxWidth:"75%", background:m.from==="user"?C.accent:m.from==="system"?C.lavender:m.isInterviewCard?"#E8F8F0":m.isFormSummary?"#F0F8FF":C.cream, color:m.from==="user"?C.white:C.text, borderRadius:m.from==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"10px 14px", fontSize:13, lineHeight:1.5, border:m.isInterviewCard?`1.5px solid ${C.teal}`:m.isFormSummary?`1.5px solid #A8D8FF`:undefined }}>
                  {m.isInterviewCard ? (
                    <div>
                      <p style={{ margin:"0 0 8px", fontWeight:700, color:C.teal, fontSize:13 }}>📅 Interview Scheduled!</p>
                      <p style={{ margin:"0 0 4px", fontSize:12 }}><strong>Date:</strong> {m.interviewData?.date}</p>
                      <p style={{ margin:"0 0 4px", fontSize:12 }}><strong>Time:</strong> {m.interviewData?.time}</p>
                      <p style={{ margin:"0 0 4px", fontSize:12 }}><strong>Location:</strong> {m.interviewData?.location}</p>
                      <p style={{ margin:"0 0 4px", fontSize:12 }}><strong>Interviewer:</strong> {m.interviewData?.interviewer}</p>
                      {m.interviewData?.requirements && <p style={{ margin:"0 0 0", fontSize:12 }}><strong>Requirements:</strong> {m.interviewData?.requirements}</p>}
                    </div>
                  ) : m.isFormSummary ? (
                    <div>
                      <p style={{ margin:"0 0 6px", fontWeight:600, fontSize:12, color:"#2980B9" }}>📋 Your Adoption Form</p>
                      {m.text.split("\n").slice(1).map((line,li)=><p key={li} style={{ margin:"0 0 2px", fontSize:12 }}>{line}</p>)}
                    </div>
                  ) : (
                    <span style={{ whiteSpace:"pre-wrap" }}>{m.text}</span>
                  )}
                  <div style={{ fontSize:10, marginTop:4, opacity:0.7 }}>{m.time}</div>
                </div>
              </div>
            ))}
            <div ref={bottomRef}/>
          </div>
          <div style={{ background:C.white, border:`1.5px solid ${C.peach}`, borderTop:"none", borderRadius:"0 0 20px 20px", padding:12, display:"flex", gap:8 }}>
            <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Type a message…" style={{ ...S.input, flex:1, borderRadius:20, padding:"10px 16px" }}/>
            <button onClick={send} style={{ ...S.btn("primary"), borderRadius:20, padding:"10px 18px" }}>Send</button>
          </div>
        </div>
      ) : activeType === "friend" && activeFriend ? (
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
          <div style={{ ...S.card, padding:"12px 16px", borderRadius:"20px 20px 0 0", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ position:"relative" }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:C.peach, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{activeFriend.avatar}</div>
              <div style={{ position:"absolute", bottom:0, right:0, width:10, height:10, borderRadius:"50%", background:activeFriend.online?"#06D6A0":"#ccc", border:"2px solid white" }}/>
            </div>
            <div>
              <p style={{ margin:0, fontWeight:700, fontSize:14 }}>{activeFriend.name}</p>
              <p style={{ margin:0, fontSize:12, color:activeFriend.online?C.teal:C.muted }}>{activeFriend.online?"Online":"Offline"}</p>
            </div>
          </div>
          <div style={{ flex:1, background:C.white, overflowY:"auto", padding:16, border:`1.5px solid ${C.peach}`, borderTop:"none", borderBottom:"none", maxHeight:420 }}>
            {(friendMessages[activeFriend.username]||[]).length === 0 && (
              <div style={{ textAlign:"center", padding:40, color:C.muted }}>
                <div style={{ fontSize:36, marginBottom:8 }}>👋</div>
                <p style={{ fontSize:14 }}>Say hi to {activeFriend.name}!</p>
              </div>
            )}
            {(friendMessages[activeFriend.username]||[]).map((m,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:m.from==="me"?"flex-end":"flex-start", marginBottom:12 }}>
                {m.from==="friend" && <div style={{ width:30, height:30, borderRadius:"50%", background:C.peach, display:"flex", alignItems:"center", justifyContent:"center", marginRight:8, fontSize:14 }}>{activeFriend.avatar}</div>}
                <div style={{ maxWidth:"70%", background:m.from==="me"?C.accent:C.cream, color:m.from==="me"?C.white:C.text, borderRadius:m.from==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"10px 14px", fontSize:13, lineHeight:1.5 }}>
                  {m.text}<div style={{ fontSize:10, marginTop:4, opacity:0.7 }}>{m.time}</div>
                </div>
              </div>
            ))}
            <div ref={bottomRef}/>
          </div>
          <div style={{ background:C.white, border:`1.5px solid ${C.peach}`, borderTop:"none", borderRadius:"0 0 20px 20px", padding:12, display:"flex", gap:8 }}>
            <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={`Message ${activeFriend.name}…`} style={{ ...S.input, flex:1, borderRadius:20, padding:"10px 16px" }}/>
            <button onClick={send} style={{ ...S.btn("primary"), borderRadius:20, padding:"10px 18px" }}>Send</button>
          </div>
        </div>
      ) : (
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
          <div style={{ fontSize:48 }}>💬</div>
          <p style={{ color:C.muted, fontSize:14 }}>Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  PROFILE
// ─────────────────────────────────────────────────────────────
function ProfileScreen({ user, onLogout }) {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ name:user.name, bio:"Pet lover 🐾 Looking to adopt!", phone:"" });
  const [requests, setRequests] = useState([...adoptionStore.data]);

  useEffect(() => {
    const handler = (data) => setRequests([...data]);
    adoptionStore.subscribe(handler);
    return () => adoptionStore.unsubscribe(handler);
  }, []);

  const myRequests = requests.filter(r => r.userId === user.username);
  const statusColor = (s) => s==="Approved"?C.mint:s==="Rejected"?"#FFB3B3":C.yellow;

  return (
    <div style={{ maxWidth:560, margin:"0 auto", padding:"20px 16px 100px" }}>
      <div style={{ ...S.card, textAlign:"center", padding:28, marginBottom:20 }}>
        <div style={{ width:80, height:80, borderRadius:"50%", background:`linear-gradient(135deg,${C.pink},${C.accent})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 12px", border:`3px solid ${C.softPink}` }}>🐾</div>
        {editing ? (
          <>
            <input value={profile.name} onChange={e=>setProfile(prev=>({...prev,name:e.target.value}))} style={{ ...S.input, textAlign:"center", marginBottom:10, fontSize:18, fontWeight:700 }}/>
            <textarea value={profile.bio} onChange={e=>setProfile(prev=>({...prev,bio:e.target.value}))} style={{ ...S.input, textAlign:"center", marginBottom:10, resize:"none" }}/>
            <input value={profile.phone} onChange={e=>setProfile(prev=>({...prev,phone:e.target.value}))} placeholder="Contact number" style={{ ...S.input, marginBottom:14, textAlign:"center" }}/>
            <button style={S.btn("primary")} onClick={()=>setEditing(false)}>Save Changes ✓</button>
          </>
        ) : (
          <>
            <h2 style={{ margin:"0 0 4px", fontSize:22, color:C.darkBrown, fontFamily:"Georgia,serif" }}>{profile.name}</h2>
            <p style={{ margin:"0 0 4px", fontSize:13, color:C.muted }}>@{user.username}</p>
            {user.email && <p style={{ margin:"0 0 4px", fontSize:13, color:C.muted }}>{user.email}</p>}
            <p style={{ margin:"0 0 16px", fontSize:14, color:C.text, fontStyle:"italic" }}>{profile.bio}</p>
            <button style={S.btn("secondary")} onClick={()=>setEditing(true)}>✏️ Edit Profile</button>
          </>
        )}
      </div>
      {myRequests.length > 0 && (
        <div style={{ ...S.card, marginBottom:20, padding:20 }}>
          <p style={{ margin:"0 0 14px", fontWeight:700, fontSize:15 }}>My Adoption Activity</p>
          {myRequests.map(r=>(
            <div key={r.id} style={{ background:C.cream, borderRadius:14, padding:16, display:"flex", gap:12, alignItems:"flex-start", marginBottom:10 }}>
              <div style={{ fontSize:28 }}>🐾</div>
              <div style={{ flex:1 }}>
                <p style={{ margin:"0 0 2px", fontWeight:600, fontSize:14 }}>{r.pet} — Delgado Rescue</p>
                <p style={{ margin:"0 0 4px", fontSize:12, color:C.muted }}>Submitted {r.date}</p>
                {r.status === "Rejected" && r.rejectionReason && (
                  <p style={{ margin:"4px 0 0", fontSize:12, color:"#C0392B", background:"#FFE8ED", borderRadius:8, padding:"4px 8px" }}>Reason: {r.rejectionReason}</p>
                )}
              </div>
              <span style={{ ...S.badge(statusColor(r.status)), marginLeft:"auto", flexShrink:0 }}>{r.status}</span>
            </div>
          ))}
        </div>
      )}
      <button onClick={onLogout} style={{ ...S.btn("danger"), width:"100%", justifyContent:"center" }}>🚪 Sign Out</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────
function AdminDashboard({ admin, onLogout }) {
  const [activeTab, setActiveTab] = useState("resources");
  const [resourceSub, setResourceSub] = useState("pets");
  const [furfeedSub, setFurfeedSub] = useState("review");
  const [pets, setPets] = useState([...petStore.data]);
  const [donations, setDonations] = useState([...donationStore.data]);
  const [requests, setRequests] = useState([...adoptionStore.data]);
  const [furfeedPosts, setFurfeedPosts] = useState([...furfeedStore.data]);
  const [threads, setThreads] = useState([...chatStore.data]);
  const [activeChatId, setActiveChatId] = useState(chatStore.data[0]?.id);
  const [adminMsg, setAdminMsg] = useState("");
  const adminChatBottomRef = useRef(null);

  const [petModal, setPetModal] = useState(null);
  const [donationFilter, setDonationFilter] = useState({ search:"", type:"all", sortBy:"time" });
  const [feedFilter, setFeedFilter] = useState({ search:"", author:"all" });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [editPostContent, setEditPostContent] = useState("");
  const [editPostMedia, setEditPostMedia] = useState([]);
  const editFileRef = useRef(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostVisibility, setNewPostVisibility] = useState("Public (Everyone)");
  const [newPostMedia, setNewPostMedia] = useState([]);
  const [postPhase, setPostPhase] = useState("create");
  const createFileRef = useRef(null);
  const [shelterForm, setShelterForm] = useState({ name:SHELTER_INFO.name, contact:SHELTER_INFO.contact, saved:false });
  const [reviewModal, setReviewModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [interviewData, setInterviewData] = useState({ date:"", time:"", location:"Delgado Animal Day Care & Rescue Center, Brgy. Tungay, Santa Barbara, Iloilo", interviewer:"Shelter Admin", requirements:"Valid ID, Proof of residence, Photos of your home" });

  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => forceUpdate(n => n + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    petStore.subscribe(setPets);
    donationStore.subscribe(setDonations);
    adoptionStore.subscribe(setRequests);
    furfeedStore.subscribe(setFurfeedPosts);
    chatStore.subscribe(setThreads);
    return () => {
      petStore.unsubscribe(setPets);
      donationStore.unsubscribe(setDonations);
      adoptionStore.unsubscribe(setRequests);
      furfeedStore.unsubscribe(setFurfeedPosts);
      chatStore.unsubscribe(setThreads);
    };
  }, []);

  useEffect(() => { adminChatBottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [threads, activeChatId]);

  const totalRaised = donations.filter(d=>d.type==="monetary").reduce((s,d)=>s+d.amount,0);
  followerStore.reload(); activeUserStore.reload();
  const actualFollowerCount = followerStore.count;

  const pendingUserPosts = furfeedPosts.filter(p => p.type === "user" && p.postStatus === "pending_review");

  const tabStyle = (id) => ({
    flex:1, padding:"10px", borderRadius:8, border:"none", cursor:"pointer", fontSize:12, fontWeight:600,
    background:activeTab===id?C.adminRed:"transparent", color:activeTab===id?C.white:C.adminMuted,
    fontFamily:"'Courier New', monospace", letterSpacing:"0.5px", transition:"all 0.2s",
    position:"relative",
  });

  const subTabStyle = (id, current) => ({
    padding:"8px 14px", borderRadius:"8px 8px 0 0", border:"none", cursor:"pointer", fontSize:11,
    background:current===id?"rgba(255,255,255,0.06)":"transparent",
    color:current===id?C.adminText:C.adminMuted, fontFamily:"'Courier New', monospace",
    borderBottom:current===id?`2px solid ${C.adminTeal}`:"2px solid transparent",
  });

  const statusBadge = (status) => {
    const map = { Pending:{ bg:"rgba(255,209,102,0.15)", color:C.adminYellow }, Approved:{ bg:"rgba(6,214,160,0.15)", color:C.adminGreen }, Rejected:{ bg:"rgba(233,69,96,0.15)", color:C.adminRed } };
    const s = map[status]||map.Pending;
    return <span style={{ fontSize:10, background:s.bg, color:s.color, padding:"3px 10px", borderRadius:4, fontWeight:600 }}>{status}</span>;
  };

  const filteredDonations = donations.filter(d => {
    const matchSearch = !donationFilter.search || d.donor.toLowerCase().includes(donationFilter.search.toLowerCase()) || String(d.amount).includes(donationFilter.search);
    const matchType = donationFilter.type==="all" || d.type===donationFilter.type;
    return matchSearch && matchType;
  }).sort((a,b) => donationFilter.sortBy==="amount" ? b.amount-a.amount : new Date(b.time)-new Date(a.time));

  const filteredFeed = furfeedPosts.filter(p => {
    const matchSearch = !feedFilter.search || p.content.toLowerCase().includes(feedFilter.search.toLowerCase()) || p.author.toLowerCase().includes(feedFilter.search.toLowerCase());
    const matchAuthor = feedFilter.author==="all" || (feedFilter.author==="shelter"?p.type==="shelter":p.type==="user");
    return matchSearch && matchAuthor;
  }).sort((a,b) => new Date(b.time)-new Date(a.time));

  const activeChat = threads.find(t=>t.id===activeChatId)||threads[0];

  const deleteAdminThread = (threadId) => {
    chatStore.data = chatStore.data.map(t =>
      t.id === threadId
        ? { ...t, messages: [{ from:"system", text:"Conversation cleared by admin.", time:"Now" }] }
        : t
    );
    chatStore.notify();
  };

  const sendAdminMsg = () => {
    if (!adminMsg.trim() || !activeChat) return;
    chatStoreAddMessage(activeChat.id, { from:"shelter", text:adminMsg, time:new Date().toLocaleTimeString("en-PH",{hour:"2-digit",minute:"2-digit"}) });
    setAdminMsg("");
  };

  const approvePost = (id) => {
    const post = furfeedPosts.find(p => p.id === id);
    furfeedStoreUpdate(id, { postStatus: "approved" });
    if (post?.authorId) {
      notifStore.add(post.authorId, "post_approved", `Your post has been approved and is now live on FurFeed! 🎉`, "furfeed");
    }
  };

  const rejectPost = (id) => {
    const post = furfeedPosts.find(p => p.id === id);
    furfeedStoreUpdate(id, { postStatus: "rejected" });
    if (post?.authorId) {
      notifStore.add(post.authorId, "post_rejected", `Your post was not approved by the shelter admin.`, "furfeed");
    }
  };

  const handleApproveAdoption = (r) => {
    adoptionStoreUpdate(r.id, { status:"Approved" });
    if (r.threadId) {
      notifStore.add(r.userId, "adoption_approved", `Your adoption request for ${r.pet} has been approved! 🎉`, "chat");
      chatStoreUpdateStatus(r.threadId, "Approved");
      chatStoreAddMessage(r.threadId, { from:"system", text:`✅ Your adoption request for ${r.pet} has been approved! The shelter admin will schedule an on-site interview shortly.`, time:"now" });
    }
    setReviewModal({ ...reviewModal, mode:"schedule", request:r });
  };

  const handleRejectAdoption = (r) => {
    if (!rejectReason.trim()) return;
    adoptionStoreUpdate(r.id, { status:"Rejected", rejectionReason:rejectReason });
    if (r.threadId) {
      notifStore.add(r.userId, "adoption_rejected", `Your adoption request for ${r.pet} was declined.`, "chat");
      chatStoreUpdateStatus(r.threadId, "Rejected");
      chatStoreAddMessage(r.threadId, { from:"system", text:`❌ Your adoption request for ${r.pet} has been declined.\n\nReason: ${rejectReason}\n\nThank you for your interest in adoption. Please consider other pets at our shelter!`, time:"now" });
    }
    setReviewModal(null);
    setRejectReason("");
  };

  const handleScheduleInterview = (r) => {
    if (!interviewData.date || !interviewData.time) return;
    if (r.threadId) {
      chatStoreAddMessage(r.threadId, { from:"shelter", text:"Interview scheduled", time:"now", isInterviewCard:true, interviewData });
    }
    setReviewModal(null);
    setInterviewData({ date:"", time:"", location:"Delgado Animal Day Care & Rescue Center, Brgy. Tungay, Santa Barbara, Iloilo", interviewer:"Shelter Admin", requirements:"Valid ID, Proof of residence, Photos of your home" });
  };

  const fmt = (iso) => { const d=new Date(iso); return isNaN(d)?iso:d.toLocaleDateString("en-PH",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}); };

  return (
    <div style={{ minHeight:"100vh", background:C.adminBg, color:C.adminText, fontFamily:"'Courier New', monospace" }}>
      <div style={{ background:C.adminCard, borderBottom:"1px solid rgba(233,69,96,0.25)", padding:"12px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:200 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <PawIcon size={22} color={C.adminRed}/>
          <span style={{ fontSize:16, fontWeight:700, color:C.adminRed, letterSpacing:2 }}>FURLY</span>
          <span style={{ background:C.adminRed, color:C.white, fontSize:10, padding:"2px 8px", borderRadius:4, letterSpacing:1 }}>ADMIN</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:11, color:C.adminMuted }}>Welcome, {admin.name}</span>
          <button onClick={onLogout} style={{ ...S.adminBtn("teal"), fontSize:11, padding:"6px 14px" }}>LOGOUT</button>
        </div>
      </div>

      <div style={{ padding:"24px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:24 }}>
          {[
            { label:"PETS IN CARE", val:pets.length, color:C.adminRed },
            { label:"RAISED (₱)", val:totalRaised.toLocaleString(), color:C.adminGreen },
            { label:"PENDING REQUESTS", val:requests.filter(r=>r.status==="Pending").length, color:C.adminYellow },
            { label:"ACTIVE CHATS", val:threads.length, color:C.adminTeal },
            { label:"FOLLOWERS", val:actualFollowerCount.toLocaleString(), color:"#A78BFA" },
          ].map(s=>(
            <div key={s.label} style={{ background:"rgba(255,255,255,0.04)", borderRadius:12, padding:16, border:"1px solid rgba(255,255,255,0.06)", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:700, color:s.color }}>{s.val}</div>
              <div style={{ fontSize:9, color:C.adminMuted, letterSpacing:2, marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {pendingUserPosts.length > 0 && (
          <div style={{ background:"rgba(255,209,102,0.1)", border:`1px solid ${C.adminYellow}`, borderRadius:10, padding:"10px 16px", marginBottom:16, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:12, color:C.adminYellow }}>⚠️ {pendingUserPosts.length} user post(s) pending review</span>
            <button style={{ ...S.adminBtn("teal"), fontSize:10, padding:"4px 10px" }} onClick={()=>{setActiveTab("furfeed");setFurfeedSub("review");}}>Review Now</button>
          </div>
        )}

        <div style={{ display:"flex", gap:4, marginBottom:24, background:"rgba(0,0,0,0.2)", borderRadius:10, padding:4 }}>
          {[
            ["resources", "RESOURCES", 0],
            ["furfeed", "FURFEED", pendingUserPosts.length],
            ["adoption", "ADOPTION", requests.filter(r => r.status === "Pending").length],
            ["chat", "CHAT", 0],
          ].map(([id, label, count]) => (
            <button key={id} style={{ ...tabStyle(id), position:"relative" }} onClick={() => {
              setActiveTab(id);
              notifStore.markRead("admin", id);
            }}>
              {label}
              {count > 0 && (
                <span style={{
                  position:"absolute", top:4, right:4,
                  background:C.adminYellow, color:C.adminBg,
                  borderRadius:"50%", minWidth:16, height:16,
                  fontSize:9, fontWeight:700,
                  display:"inline-flex", alignItems:"center", justifyContent:"center",
                }}>{count > 9 ? "9+" : count}</span>
              )}
            </button>
          ))}
        </div>

        {activeTab==="resources" && (
          <div>
            <div style={{ display:"flex", gap:2, marginBottom:20, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              {[["pets","🐕 Pet Profiles"],["donations","💰 Donations"],["shelter","🏠 Shelter Profile"]].map(([id,label])=>(
                <button key={id} style={subTabStyle(id,resourceSub)} onClick={()=>setResourceSub(id)}>{label}</button>
              ))}
            </div>
            {resourceSub==="pets" && (
              <div style={{ ...S.adminCard }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <p style={{ fontSize:10, letterSpacing:2, color:C.adminMuted, margin:0 }}>PET PROFILES ({pets.length} in care)</p>
                  <button style={{ ...S.adminBtn("primary"), fontSize:11 }} onClick={()=>setPetModal({mode:"add",data:{name:"",species:"dog",age:"",gender:"Male",breed:"Aspin",personalities:"",healthStatus:"Vaccinated",photo:"🐾",color:"#FFD166",description:""}})}>+ ADD PET</button>
                </div>
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                    <thead><tr>{["Photo","Name","Species","Age","Health","Actions"].map(h=><th key={h} style={{ textAlign:"left",padding:"8px 12px",color:C.adminMuted,fontSize:10,letterSpacing:2,borderBottom:"1px solid rgba(255,255,255,0.06)" }}>{h}</th>)}</tr></thead>
                    <tbody>
                      {pets.map(p=>(
                        <tr key={p.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                          <td style={{ padding:12 }}>
                            <div style={{ width:40,height:40,borderRadius:8,overflow:"hidden",background:p.color,display:"flex",alignItems:"center",justifyContent:"center" }}>
                              <PetPhoto photo={p.photo} name={p.name} size={40} style={{ borderRadius:8 }}/>
                            </div>
                          </td>
                          <td style={{ padding:12,fontWeight:600 }}>{p.name}</td>
                          <td style={{ padding:12,color:C.adminMuted,textTransform:"capitalize" }}>{p.species}</td>
                          <td style={{ padding:12,color:C.adminMuted }}>{p.age}</td>
                          <td style={{ padding:12 }}><span style={{ fontSize:10,background:p.healthStatus==="Vaccinated"?"rgba(6,214,160,0.15)":p.healthStatus?.includes("treatment")?"rgba(255,209,102,0.15)":"rgba(233,69,96,0.15)",color:p.healthStatus==="Vaccinated"?C.adminGreen:p.healthStatus?.includes("treatment")?C.adminYellow:C.adminRed,padding:"3px 8px",borderRadius:4 }}>{p.healthStatus}</span></td>
                          <td style={{ padding:12 }}>
                            <div style={{ display:"flex",gap:6 }}>
                              <button style={{ ...S.adminBtn("teal"),fontSize:10,padding:"4px 10px" }} onClick={()=>setPetModal({mode:"edit",data:{...p,personalities:(p.personalities||[]).join(",")}})}>EDIT</button>
                              <button style={{ ...S.adminBtn("danger"),fontSize:10,padding:"4px 10px" }} onClick={()=>setDeleteConfirm({id:p.id,type:"pet"})}>REMOVE</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {resourceSub==="donations" && (
              <div style={{ ...S.adminCard }}>
                <p style={{ fontSize:10,letterSpacing:2,color:C.adminMuted,marginBottom:16 }}>DONATION RECORDS</p>
                <div style={{ display:"flex",gap:8,marginBottom:16,flexWrap:"wrap" }}>
                  <input placeholder="Search donor or amount…" value={donationFilter.search} onChange={e=>setDonationFilter(prev=>({...prev,search:e.target.value}))} style={{ ...S.adminInput,flex:2,minWidth:160 }}/>
                  <select value={donationFilter.type} onChange={e=>setDonationFilter(prev=>({...prev,type:e.target.value}))} style={{ ...S.adminInput,flex:1 }}>
                    <option value="all">All Types</option><option value="monetary">Monetary</option><option value="in-kind">In-Kind</option>
                  </select>
                  <select value={donationFilter.sortBy} onChange={e=>setDonationFilter(prev=>({...prev,sortBy:e.target.value}))} style={{ ...S.adminInput,flex:1 }}>
                    <option value="time">Sort by Date</option><option value="amount">Sort by Amount</option>
                  </select>
                </div>
                <div style={{ marginBottom:12,background:"rgba(6,214,160,0.1)",borderRadius:8,padding:"10px 14px",display:"flex",justifyContent:"space-between" }}>
                  <span style={{ fontSize:11,color:C.adminMuted }}>Total raised (monetary)</span>
                  <span style={{ fontSize:14,fontWeight:700,color:C.adminGreen }}>₱{totalRaised.toLocaleString()}</span>
                </div>
                {filteredDonations.length === 0 && <p style={{ textAlign:"center",color:C.adminMuted,padding:20,fontSize:12 }}>No donation records found.</p>}
                <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
                  <thead><tr>{["Donor","Amount","Method","Type","Date"].map(h=><th key={h} style={{ textAlign:"left",padding:"8px 12px",color:C.adminMuted,fontSize:10,letterSpacing:2,borderBottom:"1px solid rgba(255,255,255,0.06)" }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {filteredDonations.map(d=>(
                      <tr key={d.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding:12 }}>{d.donor}</td>
                        <td style={{ padding:12,color:d.type==="monetary"?C.adminGreen:C.adminTeal,fontWeight:600 }}>{d.type==="monetary"?`₱${d.amount.toLocaleString()}`:d.note||"Supplies"}</td>
                        <td style={{ padding:12,color:C.adminMuted }}>{d.method}</td>
                        <td style={{ padding:12 }}><span style={{ fontSize:10,background:"rgba(255,255,255,0.06)",padding:"2px 8px",borderRadius:4 }}>{d.type}</span></td>
                        <td style={{ padding:12,color:C.adminMuted }}>{fmt(d.time)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {resourceSub==="shelter" && (
              <div>
                <div style={{ background:`linear-gradient(135deg,${C.accentDk},${C.accent})`,borderRadius:16,padding:"24px",marginBottom:16,position:"relative",overflow:"hidden" }}>
                  <div style={{ position:"absolute",top:0,right:0,opacity:0.12,fontSize:120,lineHeight:1 }}>🐾</div>
                  <div style={{ width:56,height:56,borderRadius:"50%",background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10 }}><PawIcon size={30} color={C.white}/></div>
                  <h3 style={{ margin:"0 0 4px",color:C.white,fontSize:16,fontFamily:"Georgia,serif" }}>{shelterForm.name}</h3>
                  <p style={{ margin:"0 0 8px",color:"rgba(255,255,255,0.8)",fontSize:12 }}>📍 Brgy. Tungay, Santa Barbara, Iloilo</p>
                  <p style={{ margin:"0 0 8px",color:"rgba(255,255,255,0.8)",fontSize:12 }}>🌐 {shelterForm.contact}</p>
                  <p style={{ margin:0,color:"rgba(255,255,255,0.9)",fontSize:13,fontStyle:"italic" }}>"{SHELTER_INFO.mission}"</p>
                  <p style={{ margin:"8px 0 0",color:"rgba(255,255,255,0.8)",fontSize:12 }}>👥 {actualFollowerCount.toLocaleString()} followers</p>
                </div>
                <div style={{ ...S.adminCard,marginBottom:16 }}>
                  <p style={{ fontSize:10,letterSpacing:2,color:C.adminMuted,marginBottom:12 }}>SHELTER HISTORY</p>
                  {SHELTER_HISTORY.split("\n\n").map((para,i)=><p key={i} style={{ margin:"0 0 12px",fontSize:12,color:C.adminMuted,lineHeight:1.8 }}>{para}</p>)}
                  <div style={{ marginTop:12 }}>
                    <p style={{ fontSize:10,letterSpacing:2,color:C.adminMuted,marginBottom:10 }}>TIMELINE</p>
                    {TIMELINE.map((item,i)=>(
                      <div key={i} style={{ display:"flex",gap:12,marginBottom:12,alignItems:"flex-start" }}>
                        <span style={{ background:C.adminRed,color:C.white,padding:"4px 8px",borderRadius:6,fontSize:10,fontWeight:700,flexShrink:0 }}>{item.year}</span>
                        <p style={{ margin:0,fontSize:12,color:C.adminMuted,lineHeight:1.6 }}>{item.event}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ ...S.adminCard,maxWidth:560 }}>
                  <p style={{ fontSize:10,letterSpacing:2,color:C.adminMuted,marginBottom:16 }}>UPDATE SHELTER PROFILE</p>
                  {[["Shelter Name","name"],["Facebook / Contact","contact"]].map(([label,key])=>(
                    <div key={key} style={{ marginBottom:14 }}>
                      <label style={{ fontSize:10,color:C.adminMuted,letterSpacing:1,display:"block",marginBottom:6 }}>{label.toUpperCase()}</label>
                      <input style={S.adminInput} value={shelterForm[key]} onChange={e=>setShelterForm(prev=>({...prev,[key]:e.target.value,saved:false}))}/>
                    </div>
                  ))}
                  <button style={{ ...S.adminBtn("primary"),marginTop:4 }} onClick={()=>setShelterForm(prev=>({...prev,saved:true}))}>{shelterForm.saved?"✓ Saved!":"SAVE CHANGES"}</button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab==="furfeed" && (
          <div>
            <div style={{ display:"flex",gap:2,marginBottom:20,borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              {[["review",`📋 Review Posts${pendingUserPosts.length>0?` (${pendingUserPosts.length})`:""}`],["all","📰 All Posts"],["create","📝 Create Post"]].map(([id,label])=>(
                <button key={id} style={subTabStyle(id,furfeedSub)} onClick={()=>{setFurfeedSub(id);setPostPhase("create");}}>{label}</button>
              ))}
            </div>

            {furfeedSub==="review" && (
              <div style={{ ...S.adminCard }}>
                <p style={{ fontSize:10,letterSpacing:2,color:C.adminMuted,marginBottom:16 }}>USER POSTS PENDING REVIEW</p>
                {pendingUserPosts.length === 0 && (
                  <div style={{ textAlign:"center",padding:32,color:C.adminMuted }}>
                    <div style={{ fontSize:32,marginBottom:8 }}>✅</div>
                    <p style={{ fontSize:12 }}>No posts pending review. All caught up!</p>
                  </div>
                )}
                {pendingUserPosts.map(p=>(
                  <div key={p.id} style={{ background:"rgba(255,255,255,0.04)",borderRadius:10,padding:16,marginBottom:12,border:"1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                          <div style={{ width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>🐾</div>
                          <div>
                            <p style={{ margin:0,fontWeight:600,fontSize:12,color:C.adminText }}>{p.author}</p>
                            <p style={{ margin:0,fontSize:10,color:C.adminMuted }}>{fmt(p.time)}</p>
                          </div>
                        </div>
                        <p style={{ margin:"0 0 8px",fontSize:13,color:C.adminText,lineHeight:1.6 }}>{p.content}</p>
                      </div>
                      <div style={{ display:"flex",flexDirection:"column",gap:6,flexShrink:0 }}>
                        <button style={{ ...S.adminBtn("green"),fontSize:11,padding:"6px 12px" }} onClick={()=>approvePost(p.id)}>✓ APPROVE</button>
                        <button style={{ ...S.adminBtn("danger"),fontSize:11,padding:"6px 12px" }} onClick={()=>rejectPost(p.id)}>✗ REJECT</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {furfeedSub==="all" && (
              <div style={{ ...S.adminCard }}>
                <p style={{ fontSize:10,letterSpacing:2,color:C.adminMuted,marginBottom:16 }}>ALL POSTS</p>
                <div style={{ display:"flex",gap:8,marginBottom:16,flexWrap:"wrap" }}>
                  <input placeholder="Search content or author…" value={feedFilter.search} onChange={e=>setFeedFilter(prev=>({...prev,search:e.target.value}))} style={{ ...S.adminInput,flex:2,minWidth:160 }}/>
                  <select value={feedFilter.author} onChange={e=>setFeedFilter(prev=>({...prev,author:e.target.value}))} style={{ ...S.adminInput,flex:1 }}>
                    <option value="all">All Authors</option><option value="shelter">Shelter</option><option value="user">Users</option>
                  </select>
                </div>
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
                    <thead><tr>{["Author","Content","Type","Status","Date","Actions"].map(h=><th key={h} style={{ textAlign:"left",padding:"8px 12px",color:C.adminMuted,fontSize:10,letterSpacing:2,borderBottom:"1px solid rgba(255,255,255,0.06)" }}>{h}</th>)}</tr></thead>
                    <tbody>
                      {filteredFeed.map(p=>(
                        <tr key={p.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                          <td style={{ padding:12,fontWeight:600,minWidth:120 }}>{p.author}</td>
                          <td style={{ padding:12,color:C.adminMuted,maxWidth:200 }}><span style={{ display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.content}</span></td>
                          <td style={{ padding:12 }}>
                            {p.type==="shelter"?<span style={{ fontSize:10,background:"rgba(0,180,216,0.15)",color:C.adminTeal,padding:"3px 8px",borderRadius:4 }}>Shelter</span>:<span style={{ fontSize:10,background:"rgba(255,209,102,0.15)",color:C.adminYellow,padding:"3px 8px",borderRadius:4 }}>User</span>}
                          </td>
                          <td style={{ padding:12 }}>
                            {p.postStatus==="approved"?<span style={{ fontSize:10,background:"rgba(6,214,160,0.15)",color:C.adminGreen,padding:"3px 8px",borderRadius:4 }}>Approved</span>:p.postStatus==="pending_review"?<span style={{ fontSize:10,background:"rgba(255,209,102,0.15)",color:C.adminYellow,padding:"3px 8px",borderRadius:4 }}>Pending</span>:<span style={{ fontSize:10,background:"rgba(233,69,96,0.15)",color:C.adminRed,padding:"3px 8px",borderRadius:4 }}>Rejected</span>}
                          </td>
                          <td style={{ padding:12,color:C.adminMuted,fontSize:11 }}>{fmt(p.time)}</td>
                          <td style={{ padding:12 }}>
                            <div style={{ display:"flex",gap:6 }}>
                              {p.type==="user"&&p.postStatus==="pending_review"&&<button style={{ ...S.adminBtn("green"),fontSize:10,padding:"4px 8px" }} onClick={()=>approvePost(p.id)}>APPROVE</button>}
                              {p.type==="shelter"&&<button style={{ ...S.adminBtn("teal"),fontSize:10,padding:"4px 8px" }} onClick={()=>{setEditPost(p);setEditPostContent(p.content);setEditPostMedia(p.media||[]);}}>EDIT</button>}
                              <button style={{ ...S.adminBtn("danger"),fontSize:10,padding:"4px 8px" }} onClick={()=>setDeleteConfirm({id:p.id,type:"post"})}>DELETE</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {furfeedSub==="create" && (
              <div style={{ ...S.adminCard,maxWidth:640 }}>
                <p style={{ fontSize:10,letterSpacing:2,color:C.adminMuted,marginBottom:16 }}>CREATE SHELTER POST</p>
                {postPhase==="done"?(
                  <div style={{ textAlign:"center",padding:24 }}>
                    <div style={{ fontSize:40,marginBottom:12 }}>✅</div>
                    <p style={{ color:C.adminGreen,fontWeight:600,marginBottom:16 }}>Post published successfully!</p>
                    <div style={{ display:"flex",gap:8,justifyContent:"center" }}>
                      <button style={{ ...S.adminBtn("primary") }} onClick={()=>{setPostPhase("create");setNewPostContent("");setNewPostMedia([]);}}>Create Another</button>
                      <button style={{ ...S.adminBtn("teal") }} onClick={()=>{setFurfeedSub("all");setPostPhase("create");setNewPostContent("");setNewPostMedia([]);}}>View All Posts</button>
                    </div>
                  </div>
                ):postPhase==="preview"?(
                  <div>
                    <p style={{ fontSize:11,color:C.adminMuted,marginBottom:12 }}>PREVIEW</p>
                    <div style={{ background:"rgba(255,255,255,0.04)",borderRadius:12,padding:16,marginBottom:16,border:"1px solid rgba(255,255,255,0.08)" }}>
                      <p style={{ margin:"0 0 10px",fontSize:13,color:C.adminText,lineHeight:1.7,whiteSpace:"pre-wrap" }}>{newPostContent}</p>
                      <p style={{ margin:0,fontSize:11,color:C.adminMuted }}>Visibility: {newPostVisibility}</p>
                    </div>
                    <div style={{ display:"flex",gap:8 }}>
                      <button style={{ ...S.adminBtn("teal") }} onClick={()=>setPostPhase("create")}>← Edit</button>
                      <button style={{ ...S.adminBtn("primary") }} onClick={()=>{ furfeedStoreAdd({ author:"Delgado Animal Day Care & Rescue Center",authorId:"shelter",type:"shelter",postStatus:"approved",content:newPostContent,tags:[],media:newPostMedia }); setPostPhase("done"); }}>PUBLISH</button>
                    </div>
                  </div>
                ):(
                  <>
                    <label style={{ fontSize:10,color:C.adminMuted,letterSpacing:1,display:"block",marginBottom:6 }}>CONTENT</label>
                    <textarea value={newPostContent} onChange={e=>setNewPostContent(e.target.value)} rows={5} placeholder="Write your shelter announcement…" style={{ ...S.adminInput,resize:"vertical",marginBottom:14 }}/>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:10 }}>
                      {newPostMedia.map((f,i)=>(
                        <div key={i} style={{ position:"relative",borderRadius:8,overflow:"hidden",border:"1px solid rgba(255,255,255,0.1)",width:80,height:80 }}>
                          {f.type==="image"?<img src={f.url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>:<video src={f.url} style={{ width:"100%",height:"100%",objectFit:"cover" }}/>}
                          <button onClick={()=>setNewPostMedia(prev=>prev.filter((_,idx)=>idx!==i))} style={{ position:"absolute",top:2,right:2,background:"rgba(0,0,0,0.7)",border:"none",color:"white",borderRadius:"50%",width:16,height:16,cursor:"pointer",fontSize:10 }}>✕</button>
                        </div>
                      ))}
                      <div>
                        <input ref={createFileRef} type="file" accept="image/*,video/*" multiple onChange={e=>{ const files=Array.from(e.target.files); setNewPostMedia(prev=>[...prev,...files.map(f=>({url:URL.createObjectURL(f),type:f.type.startsWith("video")?"video":"image",name:f.name}))]); }} style={{ display:"none" }}/>
                        <button style={{ ...S.adminBtn("teal"),fontSize:11 }} onClick={()=>createFileRef.current?.click()}>📷 Media</button>
                      </div>
                    </div>
                    <select value={newPostVisibility} onChange={e=>setNewPostVisibility(e.target.value)} style={{ ...S.adminInput,marginBottom:16 }}>
                      <option>Public (Everyone)</option><option>Followers Only</option>
                    </select>
                    <div style={{ display:"flex",gap:8 }}>
                      <button style={{ ...S.adminBtn("teal"),opacity:newPostContent.trim()?1:0.5 }} disabled={!newPostContent.trim()} onClick={()=>setPostPhase("preview")}>PREVIEW</button>
                      <button style={{ ...S.adminBtn("primary"),opacity:newPostContent.trim()?1:0.5 }} disabled={!newPostContent.trim()} onClick={()=>{ furfeedStoreAdd({ author:"Delgado Animal Day Care & Rescue Center",authorId:"shelter",type:"shelter",postStatus:"approved",content:newPostContent,tags:[],media:newPostMedia }); setPostPhase("done"); }}>PUBLISH NOW</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab==="adoption" && (
          <div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20 }}>
              {[{label:"PENDING",val:requests.filter(r=>r.status==="Pending").length,color:C.adminYellow},{label:"APPROVED",val:requests.filter(r=>r.status==="Approved").length,color:C.adminGreen},{label:"REJECTED",val:requests.filter(r=>r.status==="Rejected").length,color:C.adminRed}].map(s=>(
                <div key={s.label} style={{ background:"rgba(255,255,255,0.04)",borderRadius:12,padding:16,border:"1px solid rgba(255,255,255,0.06)",textAlign:"center" }}>
                  <div style={{ fontSize:26,fontWeight:700,color:s.color }}>{s.val}</div>
                  <div style={{ fontSize:9,color:C.adminMuted,letterSpacing:2,marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ ...S.adminCard }}>
              <p style={{ fontSize:10,letterSpacing:2,color:C.adminMuted,marginBottom:16 }}>ADOPTION REQUESTS</p>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
                  <thead><tr>{["Applicant","Pet","Status","Date","Actions"].map(h=><th key={h} style={{ textAlign:"left",padding:"8px 12px",color:C.adminMuted,fontSize:10,letterSpacing:2,borderBottom:"1px solid rgba(255,255,255,0.06)" }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {requests.map(r=>(
                      <tr key={r.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding:12,fontWeight:600 }}>{r.applicant}</td>
                        <td style={{ padding:12 }}>{r.pet}</td>
                        <td style={{ padding:12 }}>{statusBadge(r.status)}</td>
                        <td style={{ padding:12,color:C.adminMuted }}>{r.date}</td>
                        <td style={{ padding:12 }}>
                          <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                            <button style={{ ...S.adminBtn("teal"),fontSize:10,padding:"4px 10px" }} onClick={()=>setReviewModal({request:r,mode:"view"})}>REVIEW</button>
                            {r.status==="Pending"&&(
                              <>
                                <button style={{ ...S.adminBtn("green"),fontSize:10,padding:"4px 10px" }} onClick={()=>setReviewModal({request:r,mode:"approve"})}>APPROVE</button>
                                <button style={{ ...S.adminBtn("danger"),fontSize:10,padding:"4px 10px" }} onClick={()=>setReviewModal({request:r,mode:"reject"})}>REJECT</button>
                              </>
                            )}
                            {r.threadId&&<button style={{ ...S.adminBtn(),fontSize:10,padding:"4px 10px",border:`1px solid ${C.adminTeal}`,color:C.adminTeal }} onClick={()=>{ setActiveChatId(r.threadId); setActiveTab("chat"); }}>CHAT</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab==="chat" && (
          <div style={{ display:"flex",gap:16,minHeight:500 }}>
            <div style={{ width:220,flexShrink:0 }}>
              <p style={{ margin:"0 0 12px",fontSize:10,letterSpacing:2,color:C.adminMuted }}>CONVERSATIONS ({threads.length})</p>
              {threads.length===0&&<p style={{ fontSize:12,color:C.adminMuted }}>No conversations yet.</p>}
              {threads.map(t=>(
                <div key={t.id} style={{ ...S.adminCard,marginBottom:8,padding:12,border:activeChatId===t.id?`1px solid ${C.adminTeal}`:"1px solid rgba(255,255,255,0.06)", position:"relative" }}>
                  <div onClick={()=>setActiveChatId(t.id)} style={{ cursor:"pointer" }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start", paddingRight:20 }}>
                      <span style={{ fontSize:20 }}>{t.userAvatar}</span>
                      <span style={{ fontSize:9,background:t.status==="Pending"?"rgba(255,209,102,0.15)":t.status==="Approved"?"rgba(6,214,160,0.15)":"rgba(233,69,96,0.15)",color:t.status==="Pending"?C.adminYellow:t.status==="Approved"?C.adminGreen:C.adminRed,padding:"2px 6px",borderRadius:4,fontWeight:600 }}>{t.status}</span>
                    </div>
                    <p style={{ margin:"6px 0 2px",fontWeight:600,fontSize:12,color:C.adminText }}>{t.userName}</p>
                    <p style={{ margin:0,fontSize:11,color:C.adminMuted }}>Re: {t.petName} {t.petPhoto}</p>
                  </div>
                  <button onClick={e=>{e.stopPropagation();deleteAdminThread(t.id);}} style={{ position:"absolute",top:6,right:6,background:"none",border:"none",cursor:"pointer",fontSize:12,color:C.adminRed,padding:2 }} title="Delete">✕</button>
                </div>
              ))}
            </div>
            {activeChat ? (
              <div style={{ flex:1,display:"flex",flexDirection:"column",minWidth:0 }}>
                <div style={{ ...S.adminCard,borderRadius:"12px 12px 0 0",padding:"12px 16px",display:"flex",alignItems:"center",gap:10 }}>
                  <span style={{ fontSize:24 }}>{activeChat.userAvatar}</span>
                  <div>
                    <p style={{ margin:0,fontWeight:600,fontSize:14,color:C.adminText }}>{activeChat.userName}</p>
                    <p style={{ margin:0,fontSize:11,color:C.adminMuted }}>Re: {activeChat.petName} {activeChat.petPhoto}</p>
                  </div>
                  <span style={{ marginLeft:"auto",fontSize:10,background:activeChat.status==="Pending"?"rgba(255,209,102,0.15)":activeChat.status==="Approved"?"rgba(6,214,160,0.15)":"rgba(233,69,96,0.15)",color:activeChat.status==="Pending"?C.adminYellow:activeChat.status==="Approved"?C.adminGreen:C.adminRed,padding:"4px 10px",borderRadius:4,fontWeight:600 }}>{activeChat.status}</span>
                </div>
                <div style={{ flex:1,background:"rgba(255,255,255,0.02)",overflowY:"auto",padding:16,border:"1px solid rgba(255,255,255,0.06)",borderTop:"none",borderBottom:"none",maxHeight:360 }}>
                  {activeChat.messages.map((m,i)=>(
                    <div key={i} style={{ display:"flex",justifyContent:m.from==="shelter"?"flex-end":"flex-start",marginBottom:10 }}>
                      {m.from!=="shelter"&&<div style={{ width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",marginRight:8,fontSize:14,flexShrink:0 }}>{m.from==="system"?"🤖":activeChat.userAvatar}</div>}
                      <div style={{ maxWidth:"75%",background:m.from==="shelter"?C.adminRed:m.from==="system"?"rgba(255,255,255,0.06)":"rgba(255,255,255,0.08)",color:C.adminText,borderRadius:m.from==="shelter"?"12px 12px 4px 12px":"12px 12px 12px 4px",padding:"8px 12px",fontSize:12,lineHeight:1.5 }}>
                        {m.isInterviewCard?(
                          <div>
                            <p style={{ margin:"0 0 6px",fontWeight:700,color:C.adminGreen,fontSize:12 }}>📅 Interview Scheduled</p>
                            <p style={{ margin:"0 0 3px",fontSize:11 }}>Date: {m.interviewData?.date}</p>
                            <p style={{ margin:"0 0 3px",fontSize:11 }}>Time: {m.interviewData?.time}</p>
                            <p style={{ margin:"0 0 3px",fontSize:11 }}>Location: {m.interviewData?.location}</p>
                            <p style={{ margin:"0 0 3px",fontSize:11 }}>Interviewer: {m.interviewData?.interviewer}</p>
                            {m.interviewData?.requirements&&<p style={{ margin:0,fontSize:11 }}>Requirements: {m.interviewData?.requirements}</p>}
                          </div>
                        ):m.isFormSummary?(
                          <div>
                            <p style={{ margin:"0 0 6px",fontWeight:700,fontSize:11,color:C.adminTeal }}>📋 Adoption Form</p>
                            {m.text.split("\n").slice(1).map((line,li)=><p key={li} style={{ margin:"0 0 2px",fontSize:11 }}>{line}</p>)}
                          </div>
                        ):<span style={{ whiteSpace:"pre-wrap" }}>{m.text}</span>}
                        <div style={{ fontSize:9,marginTop:3,opacity:0.5 }}>{m.time}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={adminChatBottomRef}/>
                </div>
                <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderTop:"none",borderRadius:"0 0 12px 12px",padding:10,display:"flex",gap:8 }}>
                  <input value={adminMsg} onChange={e=>setAdminMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendAdminMsg()} placeholder="Reply as shelter admin…" style={{ ...S.adminInput,flex:1,borderRadius:8 }}/>
                  <button onClick={sendAdminMsg} style={{ ...S.adminBtn("primary"),padding:"8px 16px" }}>SEND</button>
                </div>
              </div>
            ):(
              <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:C.adminMuted,fontSize:13 }}>Select a conversation</div>
            )}
          </div>
        )}
      </div>

      {petModal&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:16 }}>
          <div style={{ ...S.adminCard,maxWidth:500,width:"100%",maxHeight:"85vh",overflowY:"auto" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
              <p style={{ margin:0,fontSize:12,letterSpacing:2,color:C.adminMuted }}>{petModal.mode==="add"?"ADD PET":"EDIT PET"}</p>
              <button onClick={()=>setPetModal(null)} style={{ background:"none",border:"none",color:C.adminMuted,cursor:"pointer",fontSize:16 }}>✕</button>
            </div>
            {[["Name","name"],["Species (dog/cat)","species"],["Age","age"],["Gender","gender"],["Breed","breed"],["Personalities (comma-separated)","personalities"],["Health Status","healthStatus"],["Emoji or image path","photo"],["Background Color (hex)","color"]].map(([label,key])=>(
              <div key={key} style={{ marginBottom:12 }}>
                <label style={{ fontSize:10,color:C.adminMuted,letterSpacing:1,display:"block",marginBottom:4 }}>{label.toUpperCase()}</label>
                <input style={S.adminInput} value={typeof petModal.data[key]==="string"?petModal.data[key]:""} onChange={e=>setPetModal(prev=>({...prev,data:{...prev.data,[key]:e.target.value}}))}/>
              </div>
            ))}
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:10,color:C.adminMuted,letterSpacing:1,display:"block",marginBottom:4 }}>DESCRIPTION</label>
              <textarea style={{ ...S.adminInput,resize:"vertical",minHeight:80 }} value={petModal.data.description||""} onChange={e=>setPetModal(prev=>({...prev,data:{...prev.data,description:e.target.value}}))}/>
            </div>
            <div style={{ display:"flex",gap:8 }}>
              <button style={{ ...S.adminBtn() }} onClick={()=>setPetModal(null)}>CANCEL</button>
              <button style={{ ...S.adminBtn("primary") }} onClick={()=>{
                const d=petModal.data;
                const petData={ ...d, personalities:d.personalities?d.personalities.split(",").map(s=>s.trim()):[] };
                if(petModal.mode==="add") petStoreAdd(petData);
                else petStoreUpdate(d.id,petData);
                setPetModal(null);
              }}>{petModal.mode==="add"?"ADD PET":"SAVE"}</button>
            </div>
          </div>
        </div>
      )}

      {reviewModal&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:16 }}>
          <div style={{ ...S.adminCard,maxWidth:560,width:"100%",maxHeight:"85vh",overflowY:"auto" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
              <p style={{ margin:0,fontSize:12,letterSpacing:2,color:C.adminMuted }}>
                {reviewModal.mode==="view"?"ADOPTION REVIEW":reviewModal.mode==="approve"?"APPROVE ADOPTION":reviewModal.mode==="reject"?"REJECT ADOPTION":"SCHEDULE INTERVIEW"}
              </p>
              <button onClick={()=>setReviewModal(null)} style={{ background:"none",border:"none",color:C.adminMuted,cursor:"pointer",fontSize:16 }}>✕</button>
            </div>
            <div style={{ background:"rgba(255,255,255,0.04)",borderRadius:8,padding:12,marginBottom:16 }}>
              <p style={{ margin:"0 0 10px",fontSize:11,color:C.adminMuted,letterSpacing:1 }}>APPLICANT & PET</p>
              <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:10 }}>
                {(() => {
                  const petData = pets.find(p => p.id === reviewModal.request.petId);
                  return petData ? (
                    <div style={{ width:72, height:72, borderRadius:10, overflow:"hidden", background:petData.color||"#FFD166", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <PetPhoto photo={petData.photo} name={petData.name} size={72} style={{ borderRadius:10, objectFit:"cover" }}/>
                    </div>
                  ) : <div style={{ width:72, height:72, borderRadius:10, background:"rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>🐾</div>;
                })()}
                <div>
                  <p style={{ margin:"0 0 2px",fontSize:14,fontWeight:600,color:C.adminText }}>{reviewModal.request.applicant}</p>
                  <p style={{ margin:"0 0 2px",fontSize:12,color:C.adminMuted }}>Applying for: {reviewModal.request.pet}</p>
                  <p style={{ margin:0,fontSize:11,color:C.adminMuted }}>Submitted: {reviewModal.request.date}</p>
                </div>
              </div>
            </div>
            {reviewModal.request.formData && Object.keys(reviewModal.request.formData).length > 0 && (
              <div style={{ background:"rgba(255,255,255,0.04)",borderRadius:8,padding:12,marginBottom:16 }}>
                <p style={{ margin:"0 0 10px",fontSize:11,color:C.adminMuted,letterSpacing:1 }}>ADOPTION FORM</p>
                {[["Purpose",reviewModal.request.formData.purpose],["Living Situation",reviewModal.request.formData.living],["Household Members",reviewModal.request.formData.household],["Pet Experience",reviewModal.request.formData.experience]].map(([label,val])=>val&&(
                  <div key={label} style={{ marginBottom:8 }}>
                    <p style={{ margin:"0 0 2px",fontSize:10,color:C.adminMuted }}>{label.toUpperCase()}</p>
                    <p style={{ margin:0,fontSize:12,color:C.adminText }}>{val}</p>
                  </div>
                ))}
              </div>
            )}
            {reviewModal.mode==="view" && (
              <div style={{ display:"flex",gap:8 }}>
                <button style={{ ...S.adminBtn() }} onClick={()=>setReviewModal(null)}>CLOSE</button>
                {reviewModal.request.status==="Pending"&&(
                  <>
                    <button style={{ ...S.adminBtn("green") }} onClick={()=>setReviewModal({...reviewModal,mode:"approve"})}>APPROVE</button>
                    <button style={{ ...S.adminBtn("danger") }} onClick={()=>setReviewModal({...reviewModal,mode:"reject"})}>REJECT</button>
                  </>
                )}
              </div>
            )}
            {reviewModal.mode==="approve" && (
              <div>
                <p style={{ fontSize:12,color:C.adminGreen,marginBottom:16 }}>✅ This will approve the adoption and notify the user via chat.</p>
                <div style={{ display:"flex",gap:8 }}>
                  <button style={{ ...S.adminBtn() }} onClick={()=>setReviewModal(null)}>CANCEL</button>
                  <button style={{ ...S.adminBtn("green") }} onClick={()=>handleApproveAdoption(reviewModal.request)}>CONFIRM APPROVAL</button>
                </div>
              </div>
            )}
            {reviewModal.mode==="schedule" && (
              <div>
                <p style={{ fontSize:11,color:C.adminMuted,marginBottom:12,letterSpacing:1 }}>SCHEDULE ON-SITE INTERVIEW</p>
                {[["Interview Date","date","date"],["Interview Time","time","time"],["Location","location","text"],["Interviewer","interviewer","text"],["Requirements","requirements","text"]].map(([label,key,type])=>(
                  <div key={key} style={{ marginBottom:12 }}>
                    <label style={{ fontSize:10,color:C.adminMuted,letterSpacing:1,display:"block",marginBottom:4 }}>{label.toUpperCase()}</label>
                    <input type={type} style={S.adminInput} value={interviewData[key]} onChange={e=>setInterviewData(prev=>({...prev,[key]:e.target.value}))}/>
                  </div>
                ))}
                <div style={{ display:"flex",gap:8,marginTop:4 }}>
                  <button style={{ ...S.adminBtn() }} onClick={()=>setReviewModal(null)}>SKIP FOR NOW</button>
                  <button style={{ ...S.adminBtn("primary"),opacity:interviewData.date&&interviewData.time?1:0.5 }} disabled={!interviewData.date||!interviewData.time} onClick={()=>handleScheduleInterview(reviewModal.request)}>📅 SEND INTERVIEW SCHEDULE</button>
                </div>
              </div>
            )}
            {reviewModal.mode==="reject" && (
              <div>
                <p style={{ fontSize:11,color:C.adminMuted,marginBottom:8,letterSpacing:1 }}>REJECTION REASON (required)</p>
                <textarea value={rejectReason} onChange={e=>setRejectReason(e.target.value)} placeholder="Provide a reason for rejection to be sent to the applicant…" style={{ ...S.adminInput,resize:"vertical",minHeight:80,marginBottom:14 }}/>
                <div style={{ display:"flex",gap:8 }}>
                  <button style={{ ...S.adminBtn() }} onClick={()=>{setReviewModal(null);setRejectReason("");}}>CANCEL</button>
                  <button style={{ ...S.adminBtn("danger"),opacity:rejectReason.trim()?1:0.5 }} disabled={!rejectReason.trim()} onClick={()=>handleRejectAdoption(reviewModal.request)}>CONFIRM REJECTION</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {editPost&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:16 }}>
          <div style={{ ...S.adminCard,maxWidth:560,width:"100%",maxHeight:"80vh",overflowY:"auto" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
              <p style={{ margin:0,fontSize:12,letterSpacing:2,color:C.adminMuted }}>EDIT POST</p>
              <button onClick={()=>setEditPost(null)} style={{ background:"none",border:"none",color:C.adminMuted,cursor:"pointer",fontSize:16 }}>✕</button>
            </div>
            <textarea value={editPostContent} onChange={e=>setEditPostContent(e.target.value)} rows={5} style={{ ...S.adminInput,resize:"vertical",marginBottom:14 }}/>
            <div style={{ display:"flex",gap:8 }}>
              <button style={{ ...S.adminBtn() }} onClick={()=>setEditPost(null)}>CANCEL</button>
              <button style={{ ...S.adminBtn("primary") }} onClick={()=>{ furfeedStoreUpdate(editPost.id,{content:editPostContent,media:editPostMedia}); setEditPost(null); }}>SAVE</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:600,padding:16 }}>
          <div style={{ ...S.adminCard,maxWidth:400,width:"100%",textAlign:"center",padding:32 }}>
            <div style={{ fontSize:40,marginBottom:12 }}>⚠️</div>
            <p style={{ fontSize:14,color:C.adminText,marginBottom:8 }}>Delete this {deleteConfirm.type}?</p>
            <p style={{ fontSize:12,color:C.adminMuted,marginBottom:20 }}>This action cannot be undone.</p>
            <div style={{ display:"flex",gap:8,justifyContent:"center" }}>
              <button style={{ ...S.adminBtn() }} onClick={()=>setDeleteConfirm(null)}>CANCEL</button>
              <button style={{ ...S.adminBtn("primary") }} onClick={()=>{ if(deleteConfirm.type==="pet")petStoreRemove(deleteConfirm.id); else furfeedStoreRemove(deleteConfirm.id); setDeleteConfirm(null); }}>DELETE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────────────────────────
export default function FurlyApp() {
  const [appState, setAppState] = useState("auth");
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [tab, setTab] = useState("furfeed");
  const [adoptTarget, setAdoptTarget] = useState(null);
  const [chatThreadId, setChatThreadId] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => forceUpdate(n => n + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  const navigate = (screen, data) => {
    if (screen === "adopt") { setAdoptTarget(data); setTab("adopt"); }
    else if (screen === "chat") {
      if (data) setChatThreadId(data);
      setTab("chat");
      if (user) notifStore.markRead(user.username, "chat");
    } else {
      setTab(screen);
      if (user) notifStore.markRead(user.username, screen);
    }
  };

  const handleLoginUser = (u) => { setUser(u); setAppState("user"); };
  const handleLoginAdmin = (a) => { setAdmin(a); setAppState("admin"); };
  const handleLogout = () => {
    if (user) activeUserStore.setInactive(user.username);
    setUser(null); setAdmin(null); setAppState("auth"); setTab("furfeed");
  };

  if (appState==="auth") return <AuthScreen onLoginUser={handleLoginUser} onLoginAdmin={handleLoginAdmin}/>;
  if (appState==="admin") return <AdminDashboard admin={admin} onLogout={handleLogout}/>;

  const NAV = [
    { id:"furfeed", label:"FurFeed", icon:"🐾" },
    { id:"survey", label:"Survey", icon:"📋" },
    { id:"shelters", label:"Shelters", icon:"🏠" },
    { id:"chat", label:"Chat", icon:"💬" },
  ];
  const activeNavTab = (id) => tab===id || (id==="survey"&&tab==="adopt");

  return (
    <div style={{ minHeight:"100vh", background:C.cream, fontFamily:"Georgia, serif", color:C.text }}>
      <header style={{ background:C.white, borderBottom:`2px solid ${C.peach}`, padding:"10px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:200 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:20, fontWeight:700, color:C.accentDk, fontFamily:"Georgia,serif" }}>
          <PawIcon size={20} color={C.accent}/> Furly
        </div>
        <div style={{ position:"relative" }}>
          <div onClick={()=>setShowUserMenu(m=>!m)} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", padding:"6px 10px", borderRadius:20, background:showUserMenu?C.peach:"transparent" }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg,${C.pink},${C.accent})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, border:`2px solid ${C.softPink}` }}>🐾</div>
            <span style={{ fontSize:13, fontWeight:600, color:C.darkBrown, maxWidth:110, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user?.name}</span>
            <span style={{ fontSize:10, color:C.muted }}>{showUserMenu?"▲":"▼"}</span>
          </div>
          {showUserMenu && (
            <div style={{ position:"absolute", top:"calc(100% + 6px)", right:0, background:C.white, borderRadius:16, boxShadow:`0 8px 32px ${C.shadow}`, border:`1.5px solid ${C.peach}`, minWidth:190, zIndex:300, overflow:"hidden" }}>
              <div style={{ padding:"14px 16px", borderBottom:`1px solid ${C.peach}`, background:C.cream }}>
                <p style={{ margin:"0 0 2px", fontWeight:700, fontSize:14, color:C.darkBrown }}>{user?.name}</p>
                <p style={{ margin:0, fontSize:12, color:C.muted }}>@{user?.username}</p>
              </div>
              <button onClick={()=>{ setTab("profile"); setShowUserMenu(false); }} style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"12px 16px", border:"none", background:"transparent", cursor:"pointer", fontSize:14, color:C.text, fontFamily:"Georgia,serif" }}>✏️ View / Edit Profile</button>
              <button onClick={handleLogout} style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"12px 16px", border:"none", background:"transparent", cursor:"pointer", fontSize:14, color:"#C0392B", fontFamily:"Georgia,serif", borderTop:`1px solid ${C.peach}` }}>🚪 Sign Out</button>
            </div>
          )}
        </div>
      </header>

      <main onClick={()=>showUserMenu&&setShowUserMenu(false)} style={{ paddingBottom:80 }}>
        {tab==="furfeed" && <FurFeed user={user}/>}
        {tab==="survey" && <SurveyScreen onNavigate={navigate}/>}
        {tab==="adopt" && <AdoptionForm targetPet={adoptTarget} user={user} onNavigate={navigate}/>}
        {tab==="shelters" && <SheltersScreen user={user}/>}
        {tab==="chat" && <ChatScreen user={user} navigateToThreadId={chatThreadId}/>}
        {tab==="profile" && <ProfileScreen user={user} onLogout={handleLogout}/>}
      </main>

      <nav style={{ position:"fixed", bottom:0, left:0, right:0, background:C.white, borderTop:`2px solid ${C.peach}`, display:"flex", justifyContent:"space-around", alignItems:"center", padding:"6px 0 8px", zIndex:200, boxShadow:`0 -4px 20px ${C.shadow}` }}>
        {NAV.map(n => {
          const unread = user ? notifStore.countUnread(user.username, n.id) : 0;
          return (
            <button key={n.id} onClick={() => navigate(n.id)} style={{
              display:"flex", flexDirection:"column", alignItems:"center", gap:2,
              background:"none", border:"none", cursor:"pointer",
              padding:"4px 10px", borderRadius:12,
              color: activeNavTab(n.id) ? C.accentDk : C.muted,
            }}>
              <div style={{ position:"relative", display:"inline-flex" }}>
                <span style={{ fontSize:22 }}>{n.icon}</span>
                <Badge count={unread} />
              </div>
              <span style={{ fontSize:11, fontWeight: activeNavTab(n.id) ? 700 : 400, fontFamily:"Georgia,serif" }}>
                {n.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}