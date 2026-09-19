const levels = [
 {q:"Warm-up 😎<br>What number comes next?<br><b>2, 4, 6, 8, ?</b>",a:["9","10","12","14"],ok:1},
 {q:"Read carefully 👀<br>Click the button that says <b>DO NOT CLICK</b>.",a:["CLICK ME","DO NOT CLICK","SAFE","EXIT"],ok:1},
 {q:"Classic trap 🪤<br>How many months have at least 28 days?",a:["1","2","11","12"],ok:3},
 {q:"Spot the difference 🍎<br>Which item is different?",a:["APPLE","APPLE","APP1E","APPLE"],ok:2},
 {q:"Reverse psychology 🔄<br><b>Do NOT choose the green-looking answer.</b>",a:["Red","Green-looking","Blue","Nothing"],ok:0},
 {q:"Memory test 🧠<br>Remember this number: <b>7319</b>. Click Continue.",a:["Continue"],ok:0, memory:true},
 {q:"What number did you see in the previous level?",a:["7319","7391","7139","7913"],ok:0},
 {q:"Think differently 🤔<br>If you have 3 apples and take away 2, how many do you have?",a:["1","2","3","5"],ok:1},
 {q:"The game is getting suspicious 😈<br>Choose the answer that is NOT wrong.",a:["A","B","C","D"],ok:0},
 {q:"Which word is spelled incorrectly?",a:["WRONG","CORRECT","INCORRECT","SPELLING"],ok:0},
 {q:"Don't overthink it 😂<br>Click the largest number.",a:["7","70","700","7000"],ok:3},
 {q:"Now the rule changes 🔀<br>Choose the <b>wrong</b> answer.",a:["A","B","C","D"],ok:0},
 {q:"Pattern time: 1, 1, 2, 3, 5, ?",a:["6","7","8","9"],ok:2},
 {q:"Confusion level 🌀<br>Which option is different from the other three?",a:["YES","YES","NO","YES"],ok:2},
 {q:"A clock shows 3:00. What is the angle between the hands?",a:["30°","60°","90°","180°"],ok:2},
 {q:"You are told: <b>Do exactly the opposite of this instruction.</b><br>Which action is safest?",a:["Follow it","Ignore it","Do opposite","None"],ok:1},
 {q:"Tiny detail 🔎<br>Which word contains a number?",a:["LEVEL","ONE","BRAIN","GLITCH"],ok:1},
 {q:"The answer is hidden in this sentence: <b>Choose the second option.</b>",a:["First","Second","Third","Fourth"],ok:1},
 {q:"Almost there 😵<br>If yesterday was tomorrow, today would be Friday. What day is today?",a:["Wednesday","Thursday","Friday","Saturday"],ok:0},
 {q:"FINAL GLITCH 🤯<br>Which button should you press to finish the game?",a:["Finish","Do Not Press","Press Me","There is no correct button"],ok:3}
];

let level=0,score=0,lives=3,locked=false;
const $=id=>document.getElementById(id);
function render(){
  $("level").textContent=level+1;$("score").textContent=score;$("lives").textContent=lives;
  $("progressBar").style.width=((level+1)/levels.length*100)+"%";
  const x=levels[level];
  $("game").innerHTML=`<div class="question">${x.q}</div><div class="answers" id="answers"></div><div id="message" class="message"></div>`;
  x.a.forEach((text,i)=>{const b=document.createElement("button");b.className="answer";b.innerHTML=text;b.addEventListener("click",()=>answer(i));$("answers").appendChild(b)});
}
function answer(i){
  if(locked)return;
  const x=levels[level],m=$("message");
  if(i===x.ok){
    locked=true;score+=100;m.className="message good";m.textContent="✅ Correct! +100 points";
    if(level<levels.length-1){setTimeout(()=>{level++;locked=false;render()},700)}
    else finish();
  }else{
    lives--;score=Math.max(0,score-25);$("lives").textContent=lives;$("score").textContent=score;
    m.className="message bad";m.textContent="❌ Wrong! The game is laughing at you. -25";
    $("game").classList.remove("shake");void $("game").offsetWidth;$("game").classList.add("shake");
    if(lives<=0){locked=true;m.innerHTML=`💀 Game Over! Final score: ${score}<br><button class="answer" onclick="restart()">Restart</button>`}
  }
}
function finish(){
  $("game").innerHTML=`<div class="question">🏆 YOU BEAT BRAIN GLITCH!<br><br>Final score: <b>${score}</b></div><p class="hint">Save your score below to join the online leaderboard.</p>`;
}
function restart(){level=0;score=0;lives=3;locked=false;render()}
$("saveForm").addEventListener("submit",async e=>{
 e.preventDefault();const username=$("username").value.trim();if(!username)return;
 $("saveMsg").textContent="Saving...";
 try{const r=await fetch("php/save_score.php",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,score})});const d=await r.json();$("saveMsg").textContent=d.message||"Saved";}catch(e){$("saveMsg").textContent="PHP server not running. Start XAMPP/Apache first."}
});
$("leaderboardBtn").addEventListener("click",async()=>{
 const box=$("leaderboard");box.innerHTML="<p>Loading...</p>";
 try{const r=await fetch("php/leaderboard.php");const d=await r.json();box.innerHTML='<div class="board">'+d.map((x,i)=>`<div class="row"><span>#${i+1} ${escapeHtml(x.username)}</span><b>${x.score}</b></div>`).join("")+"</div>"}catch(e){box.innerHTML="<p class='tiny'>Start PHP/Apache to view the leaderboard.</p>"}
});
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
render();
