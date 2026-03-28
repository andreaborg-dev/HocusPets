// FIREBASE IMPORTS
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyD3SOqBAtc664iu-5N-opr0LbHTXk0rOzc",
  authDomain: "hocus-pets.firebaseapp.com",
  projectId: "hocus-pets",
  storageBucket: "hocus-pets.firebasestorage.app",
  messagingSenderId: "665368562293",
  appId: "1:665368562293:web:f9e330a2f991ad0c8a463c",
  measurementId: "G-EQB95DJ7KR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// EMAILJS
emailjs.init("166hcYD_eEyhQSA-t");

// SERVICES
const services = [
  ["Pet Sitting","€20 - €30"],
  ["Pet Walking","€10 - €20"],
  ["Food Delivery","€5 - €15"],
  ["Transportation","€15 - €25"],
  ["Playtime","€10 - €18"],
  ["Exotic Pets","€25 - €40"]
];

const sDiv = document.getElementById("services");

services.forEach(s=>{
  sDiv.innerHTML += `
  <div class="card fade">
    <h2>${s[0]}</h2>
    <p>${s[1]}</p>
    <button onclick="bookService('${s[0]}')">Book</button>
  </div>
  `;
});

// TEAM
const team = [
  {
    name:"Andrea Borg",
    role:"Co-Founder",
    desc:"Passionate about animals and technology, bringing magical care to pets."
  },
  {
    name:"Selena Formosa",
    role:"Co-Founder",
    desc:"Dedicated to caring for animals with love and professionalism."
  }
];

const tDiv = document.getElementById("team");

team.forEach(m=>{
  tDiv.innerHTML += `
  <div class="member fade">
    <h2>${m.name}</h2>
    <h3>${m.role}</h3>
    <p>${m.desc}</p>
  </div>
  `;
});

// SCROLL
window.scrollToServices = ()=>{
  const section = document.getElementById("services");
  const offset = document.querySelector("nav").offsetHeight;

  window.scrollTo({
    top: section.offsetTop - offset,
    behavior:"smooth"
  });
};

window.scrollTopPage = ()=>{
  window.scrollTo({top:0,behavior:"smooth"});
};

function scrollToContact(){
  const section = document.getElementById("contact");
  const offset = document.querySelector("nav").offsetHeight;

  window.scrollTo({
    top: section.offsetTop - offset,
    behavior:"smooth"
  });
}

// MODALS
const loginModal = document.getElementById("loginModal");
const changePasswordModal = document.getElementById("changePasswordModal");
const overlay = document.getElementById("overlay");

window.openLogin = ()=>{
  loginModal.style.display = "block";
  overlay.style.display = "block";
};

window.closeLogin = ()=>{
  loginModal.style.display = "none";
  overlay.style.display = "none";
};

window.openChangePassword = ()=>{
  changePasswordModal.style.display = "block";
  overlay.style.display = "block";
};

window.closeChangePassword = ()=>{
  changePasswordModal.style.display = "none";
  overlay.style.display = "none";
};

// SHOW LOGIN AFTER 2 SECONDS
setTimeout(()=>{
  if(!auth.currentUser){
    openLogin();
  }
},2000);

// LOGIN
document.getElementById("loginBtn").onclick = async ()=>{

  const email = document.getElementById("authEmail").value;
  const pass = document.getElementById("authPassword").value;

  try{
    await signInWithEmailAndPassword(auth,email,pass);
    alert("Logged in!");
    closeLogin();
  }catch(err){
    alert(err.message);
  }
};

// SIGNUP
document.getElementById("signupBtn").onclick = async ()=>{

  const email = document.getElementById("authEmail").value;
  const pass = document.getElementById("authPassword").value;
  const confirm = document.getElementById("authConfirmPassword").value;

  if(pass !== confirm){
    alert("Passwords do not match");
    return;
  }

  try{
    await createUserWithEmailAndPassword(auth,email,pass);
    alert("Account created!");
    closeLogin();
  }catch(err){
    alert(err.message);
  }
};

// LOGOUT
document.getElementById("logoutBtn").onclick = ()=>{
  signOut(auth);
};

// CHANGE PASSWORD BUTTON
document.getElementById("changePasswordBtn").onclick = ()=>{
  openChangePassword();
};

// SEND RESET EMAIL
document.getElementById("sendResetBtn").onclick = async ()=>{

  const email = document.getElementById("resetEmail").value;

  if(!email){
    alert("Enter email");
    return;
  }

  try{
    await sendPasswordResetEmail(auth,email,{
      url:"http://127.0.0.1:5500/reset.html"
    });

    alert("Reset email sent");
    closeChangePassword();
  }catch(err){
    alert(err.message);
  }
};

// USER UI
const navBtn = document.getElementById("navAuthBtn");
const userEmail = document.getElementById("userEmail");
const contactEmail = document.getElementById("contactEmail");

// AUTH STATE
onAuthStateChanged(auth,(user)=>{

  if(user){

    navBtn.textContent = user.email;
    userEmail.textContent = user.email;

    contactEmail.value = user.email;
    contactEmail.readOnly = true;

    closeLogin();

  }else{

    navBtn.textContent = "Login";
    contactEmail.value = "";
    contactEmail.readOnly = false;

    navBtn.onclick = openLogin;
  }
});

// BOOK SERVICE
window.bookService = (service)=>{

  if(!auth.currentUser){
    openLogin();
    alert("Please login to book");
    return;
  }

  document.getElementById("serviceSelect").value = service;
  scrollToContact();
};

// EMAILJS CONTACT
document.getElementById("contact-form")
.addEventListener("submit", function(e){

  e.preventDefault();

  if(!auth.currentUser){
    alert("Please login first");
    openLogin();
    return;
  }

  document.getElementById("time").value =
    new Date().toLocaleString();

  emailjs.sendForm(
    "service_bzchcep",
    "template_pc70ul6",
    this
  )
  .then(()=>{
    alert("Message sent successfully ✨");
    this.reset();
    contactEmail.value = auth.currentUser.email;
  })
  .catch(()=>{
    alert("Failed to send ❌");
  });

});

// FADE ANIMATION
window.addEventListener("scroll", ()=>{

  document.querySelectorAll(".fade").forEach(el=>{

    const top = el.getBoundingClientRect().top;

    if(top < window.innerHeight - 100){
      el.classList.add("show");
    }

  });

});