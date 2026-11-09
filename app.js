let state;
try {
  state = JSON.parse(localStorage.getItem("manipalTripState") || "{}");
} catch (error) {
  console.error("Could not read saved trip data.", error);
  state = {};
}
state.actuals = state.actuals || {};
state.planned = state.planned || {};
state.meals = state.meals || {};
state.essentials = state.essentials || null;
const cfg = TRIP_CONFIG;

function save(){ localStorage.setItem("manipalTripState", JSON.stringify(state)); }
function parseTime(str){
  const m=str.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i); if(!m)return null;
  let h=+m[1], min=+(m[2]||0); if(m[3].toUpperCase()==="PM"&&h!==12)h+=12; if(m[3].toUpperCase()==="AM"&&h===12)h=0;
  return h*60+min;
}
function fmt(min){
  min=((min%1440)+1440)%1440; let h=Math.floor(min/60), m=min%60, ap=h>=12?"PM":"AM"; h=h%12||12;
  return `${h}:${String(m).padStart(2,"0")} ${ap}`;
}
function actualMinute(id){ return state.actuals[id]?.minute ?? null; }
function plannedTime(stop){ return state.planned[stop.id] || stop.time; }
function shiftBefore(day, stop){
  let shift=0;
  for(const item of day.stops){
    if(item.id===stop.id)break;
    const actual=actualMinute(item.id);
    if(actual!==null)shift=actual-parseTime(plannedTime(item));
  }
  return shift;
}
function effectiveTime(day, stop){
  return fmt(parseTime(plannedTime(stop))+shiftBefore(day,stop));
}
function allStops(){
  return cfg.days.flatMap(d=>d.stops.map(s=>({...s,dayId:d.id,dayLabel:d.label})));
}
function stopDay(stop){ return cfg.days.find(day=>day.id===stop.dayId); }
function latestReached(){
  return allStops().filter(s=>actualMinute(s.id)!==null).pop() || null;
}
function nextPending(){
  return allStops().find(s=>actualMinute(s.id)===null) || null;
}
function timeInputValue(value){
  const minutes=parseTime(value);
  return minutes===null ? "" : `${String(Math.floor(minutes/60)).padStart(2,"0")}:${String(minutes%60).padStart(2,"0")}`;
}
function renderDocs(){
  const el=document.getElementById("docList"); el.innerHTML="";
  cfg.documents.forEach(d=>{
    const wrap=document.createElement("div"); wrap.className="doc";
    const icon=document.createElement("div"); icon.className="doc-icon"; icon.textContent=d.file.toLowerCase().endsWith(".pdf")?"📕":"🖼️"; wrap.appendChild(icon);
    const info=document.createElement("div"); info.className="doc-info";
    info.innerHTML=`<b>${d.name}</b><a href="${d.file}" target="_blank" rel="noopener">Open document ↗</a>`;
    wrap.appendChild(info); el.appendChild(wrap);
  });
}
function renderDays(){
  const root=document.getElementById("days"); root.innerHTML="";
  cfg.days.forEach(day=>{
    const sec=document.createElement("section"); sec.className="day";
    sec.innerHTML=`<div class="day-head ${day.className}"><div><h2>${day.label}</h2><p>${day.subtitle}</p></div><div>${day.id==="day1"?"☕":day.id==="day2"?"🎓":"🌊"}</div></div>`;
    const tl=document.createElement("div"); tl.className="timeline";
    day.stops.forEach(s=>{
      const done=actualMinute(s.id)!==null;
      const t=effectiveTime(day,s);
      const div=document.createElement("div"); div.className="stop "+(done?"done":"");
      const mapHref=s.map || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.title)}`;
      const actual=actualMinute(s.id);
      div.innerHTML=`<div class="time-wrap"><span class="time">${t}</span><button class="edit-time" type="button" data-edit-time="${s.id}" aria-label="Edit time for ${s.title}" title="Edit planned or reached time">✎</button></div><div class="dotcol"><div class="dot"></div></div><div><div class="title">${s.title}</div><div class="sub">${s.sub||""}</div>${done?`<div class="status-line">Reached at ${fmt(actual)}</div>`:""}</div><div class="stop-actions"><a class="mini" href="${mapHref}" target="_blank" rel="noopener">📍 Maps</a><button class="mini status-btn ${done?"undo":"reach"}" data-reach="${s.id}">${done?"✓ Reached · undo":"Mark reached"}</button></div>`;
      tl.appendChild(div);
    });
    sec.appendChild(tl);
    const note=document.createElement("div"); note.className="day-note"; note.textContent=day.note; sec.appendChild(note);
    root.appendChild(sec);
  });
  document.querySelectorAll("[data-reach]").forEach(btn=>btn.onclick=()=>markReached(btn.dataset.reach));
  document.querySelectorAll("[data-edit-time]").forEach(btn=>btn.onclick=()=>editTime(btn.dataset.editTime));
}
function populateControls(){
  const ds=document.getElementById("daySelect"), cs=document.getElementById("checkpointSelect");
  ds.innerHTML=cfg.days.map(d=>`<option value="${d.id}">${d.label}</option>`).join("");
  ds.onchange=refreshControls;
  cs.onchange=updateControlButtons;
  refreshControls();
}
function refreshControls(){
  const ds=document.getElementById("daySelect"), cs=document.getElementById("checkpointSelect");
  const previous=cs.value, day=cfg.days.find(item=>item.id===ds.value);
  if(!day)return;
  cs.innerHTML=day.stops.map(s=>`<option value="${s.id}">${actualMinute(s.id)!==null?"✓ ":""}${effectiveTime(day,s)} — ${escapeHtml(s.title)}</option>`).join("");
  if(day.stops.some(s=>s.id===previous))cs.value=previous;
  updateControlButtons();
}
function updateControlButtons(){
  const id=document.getElementById("checkpointSelect").value;
  document.getElementById("reachedBtn").textContent=actualMinute(id)!==null?"↩ Set not reached":"✓ Mark reached now";
}
function markReached(id){
  const stops=allStops(), index=stops.findIndex(s=>s.id===id);
  if(index<0)return;
  if(actualMinute(id)!==null){ clearCheckpoint(id); return; }
  for(let i=0;i<index;i++){
    const stop=stops[i];
    if(actualMinute(stop.id)===null){
      const day=stopDay(stop);
      state.actuals[stop.id]={minute:parseTime(effectiveTime(day,stop)),iso:new Date().toISOString(),inferred:true};
    }
  }
  const now=new Date(), minute=now.getHours()*60+now.getMinutes();
  state.actuals[id]={minute,iso:now.toISOString()};
  save(); renderAll();
}
function clearCheckpoint(id){
  const stops=allStops(), index=stops.findIndex(s=>s.id===id);
  if(index<0)return;
  for(const stop of stops.slice(index)) delete state.actuals[stop.id];
  save(); renderAll();
}
function renderActuals(){
  const el=document.getElementById("actuals"); el.innerHTML="";
  allStops().filter(s=>actualMinute(s.id)!==null).forEach(s=>{
    const x=document.createElement("button"); x.className="actual-chip"; x.type="button"; x.textContent=`✓ ${s.title}: ${fmt(actualMinute(s.id))}`;
    x.title="Click to undo this and later checkpoints"; x.onclick=()=>clearCheckpoint(s.id); el.appendChild(x);
  });
}
function editTime(id){
  const stop=allStops().find(s=>s.id===id);
  if(!stop)return;
  const day=stopDay(stop);
  const value=actualMinute(id)!==null?fmt(actualMinute(id)):effectiveTime(day,stop);
  const input=document.createElement("input");
  input.type="time"; input.value=timeInputValue(value); input.setAttribute("aria-label",`New time for ${stop.title}`);
  const button=document.querySelector(`[data-edit-time="${id}"]`);
  button.replaceWith(input); input.focus();
  const commit=()=>{
    if(!input.value)return;
    const [hours,minutes]=input.value.split(":").map(Number), minute=hours*60+minutes;
    if(actualMinute(id)!==null) state.actuals[id]={...state.actuals[id],minute,iso:new Date().toISOString()};
    else state.planned[id]=fmt(minute-shiftBefore(day,stop));
    save(); renderAll();
  };
  input.addEventListener("change",commit,{once:true});
  input.addEventListener("blur",()=>{if(document.body.contains(input)){if(input.value)commit();else renderDays();}},{once:true});
}
function updateProgress(){
  const stops=allStops(), done=stops.filter(s=>actualMinute(s.id)!==null).length, pct=Math.round(done/stops.length*100);
  document.getElementById("progressBar").style.width=pct+"%"; document.getElementById("progressText").textContent=pct+"% complete";
  const next=nextPending(); document.getElementById("nextStop").textContent=next?next.title:"Trip complete 🎉";
  const current=latestReached(); document.getElementById("currentPlace").textContent=current?current.title:"Not set";
  document.getElementById("statusText").textContent=done?`${done}/${stops.length} checkpoints`: "Ready";
}
function getNextCoords(){ const n=nextPending(); return n ? {lat:n.lat,lng:n.lng,name:n.title,map:n.map}:null; }
function getOrigin(){
  const locationAge=state.location?.updatedAt?Date.now()-Date.parse(state.location.updatedAt):Infinity;
  if(state.location && locationAge>=0 && locationAge<2*60*60*1000)return state.location;
  const stop=latestReached();
  if(stop)return stop.lat != null && stop.lng != null
    ? {lat:stop.lat,lng:stop.lng,name:stop.title}
    : {address:stop.title,name:stop.title};
  return cfg.home || null;
}
async function routeFrom(origin,destination){
  if(!cfg.googleRoutesApiKey || cfg.googleRoutesApiKey.includes("PASTE_")) return null;
  const url="https://routes.googleapis.com/directions/v2:computeRoutes";
  const originLocation=origin.lat != null && origin.lng != null
    ? {latLng:{latitude:origin.lat,longitude:origin.lng}}
    : {address:origin.address || origin.name};
  const destinationLocation=destination.lat != null && destination.lng != null
    ? {latLng:{latitude:destination.lat,longitude:destination.lng}}
    : {address:destination.name};
  const body={origin:{location:originLocation},destination:{location:destinationLocation},travelMode:"DRIVE",routingPreference:"TRAFFIC_AWARE",computeAlternativeRoutes:false,units:"METRIC"};
  const r=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json","X-Goog-Api-Key":cfg.googleRoutesApiKey,"X-Goog-FieldMask":"routes.duration,routes.distanceMeters"},body:JSON.stringify(body)});
  if(!r.ok) throw new Error("Routes API "+r.status);
  return (await r.json()).routes?.[0]||null;
}
function formatDuration(seconds){ let m=Math.round(Number(seconds)/60); if(m<60)return `${m} min`; let h=Math.floor(m/60), mm=m%60; return mm?`${h} h ${mm} min`:`${h} h`; }
async function updateRoute(){
  const dest=getNextCoords(); if(!dest){document.getElementById("distance").textContent="—";document.getElementById("travelTime").textContent="—";return;}
  const loc=getOrigin();
  if(!loc){document.getElementById("distance").textContent="Enable location";document.getElementById("travelTime").textContent="then refresh";return;}
  if(!cfg.googleRoutesApiKey || cfg.googleRoutesApiKey.includes("PASTE_")){
    document.getElementById("distance").textContent="—";
    document.getElementById("travelTime").textContent="Use Directions";
    document.getElementById("locationHint").textContent="Your latest location or reached checkpoint is ready. Live estimates need an optional Routes API key.";
    return;
  }
  try{
    const route=await routeFrom(loc,dest);
    if(!route) throw new Error("No route");
    document.getElementById("distance").textContent=(route.distanceMeters/1000).toFixed(1)+" km";
    document.getElementById("travelTime").textContent=formatDuration(route.duration);
    document.getElementById("locationHint").textContent=`Live route to ${dest.name}. Google traffic-aware route.`;
  }catch(e){
    document.getElementById("distance").textContent="API unavailable";
    document.getElementById("travelTime").textContent="Use Directions";
    document.getElementById("locationHint").textContent="Check your Routes API key/referrer restriction, or use Directions.";
  }
}
function useLocation(){
  if(!navigator.geolocation){alert("Geolocation is not supported.");return;}
  const button=document.getElementById("locateBtn");
  button.textContent="📍 Locating…"; button.disabled=true;
  navigator.geolocation.getCurrentPosition(pos=>{
    state.location={lat:pos.coords.latitude,lng:pos.coords.longitude,updatedAt:new Date().toISOString()}; save();
    button.textContent="📍 Location updated"; button.disabled=false;
    updateRoute();
  },err=>{alert(err.code===1?"Location permission was not granted. You can still use the checkpoint and Maps links.":"Could not get your location. Check your connection and location settings.");button.textContent="📍 Use my location";button.disabled=false;},{enableHighAccuracy:true,timeout:15000,maximumAge:30000});
}
function directions(){
  const n=nextPending(); if(!n)return;
  const origin=getOrigin();
  const destination=n.lat != null && n.lng != null?`${n.lat},${n.lng}`:n.title;
  const params=new URLSearchParams({api:"1",destination,travelmode:"driving"});
  if(origin)params.set("origin",origin.lat != null && origin.lng != null?`${origin.lat},${origin.lng}`:origin.address || origin.name);
  window.open(`https://www.google.com/maps/dir/?${params.toString()}`,"_blank","noopener");
}
function renderMeals(){
  const root=document.getElementById("meals");
  cfg.days.forEach(day=>{
    if(!Array.isArray(state.meals[day.id])){
      state.meals[day.id]=day.meals.map((item,index)=>({id:`${day.id}-meal-${index}`,time:item[0],text:item[1],done:false}));
    }
  });
  root.innerHTML=cfg.days.map(day=>`<div class="meal-day"><h3>${day.label}</h3>${state.meals[day.id].map(meal=>`<div class="meal-row"><input class="meal-time" type="text" aria-label="Meal time" value="${escapeHtml(meal.time)}" data-meal-time="${meal.id}"><input class="meal-input" type="text" aria-label="Meal plan item" value="${escapeHtml(meal.text)}" data-meal-text="${meal.id}"><button class="icon-btn" type="button" data-remove-meal="${day.id}|${meal.id}" aria-label="Remove meal">×</button></div>`).join("")}<button class="add-btn" type="button" data-add-meal="${day.id}">＋ Add meal</button></div>`).join("");
  root.querySelectorAll("[data-meal-time]").forEach(input=>input.onchange=()=>updateMeal(input.dataset.mealTime,"time",input.value));
  root.querySelectorAll("[data-meal-text]").forEach(input=>input.onchange=()=>updateMeal(input.dataset.mealText,"text",input.value));
  root.querySelectorAll("[data-remove-meal]").forEach(button=>button.onclick=()=>{const [dayId,id]=button.dataset.removeMeal.split("|");state.meals[dayId]=state.meals[dayId].filter(item=>item.id!==id);save();renderMeals();});
  root.querySelectorAll("[data-add-meal]").forEach(button=>button.onclick=()=>{const dayId=button.dataset.addMeal;state.meals[dayId].push({id:`${dayId}-meal-${Date.now()}`,time:"",text:"",done:false});save();renderMeals();});
  save();
}
function updateMeal(id,key,value){
  const meal=Object.values(state.meals).flat().find(item=>item.id===id);
  if(meal){meal[key]=value;save();}
}
function escapeHtml(value){
  return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function renderEssentials(){
  if(!Array.isArray(state.essentials))state.essentials=cfg.travelEssentials.map((text,index)=>({id:`essential-${index}`,text,checked:false}));
  const root=document.getElementById("essentials");
  root.innerHTML=state.essentials.map(item=>`<div class="essential-row"><input type="checkbox" aria-label="Mark ${escapeHtml(item.text)} packed" data-essential-check="${item.id}" ${item.checked?"checked":""}><input class="essential-input" type="text" aria-label="Edit essential" value="${escapeHtml(item.text)}" data-essential-text="${item.id}"><button class="icon-btn" type="button" data-remove-essential="${item.id}" aria-label="Remove essential">×</button></div>`).join("");
  root.querySelectorAll("[data-essential-check]").forEach(input=>input.onchange=()=>{const item=state.essentials.find(entry=>entry.id===input.dataset.essentialCheck);if(item){item.checked=input.checked;save();}});
  root.querySelectorAll("[data-essential-text]").forEach(input=>input.onchange=()=>{const item=state.essentials.find(entry=>entry.id===input.dataset.essentialText);if(item){item.text=input.value;save();}});
  root.querySelectorAll("[data-remove-essential]").forEach(button=>button.onclick=()=>{state.essentials=state.essentials.filter(item=>item.id!==button.dataset.removeEssential);save();renderEssentials();});
}
function addEssential(){
  if(!Array.isArray(state.essentials))state.essentials=[];
  state.essentials.push({id:`essential-${Date.now()}`,text:"",checked:false});save();renderEssentials();
}
function tick(){ document.getElementById("clock").textContent=new Date().toLocaleString("en-IN",{weekday:"short",day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit",second:"2-digit"}); }
function renderAll(){renderDays();renderActuals();updateProgress();refreshControls();updateRoute();}
document.getElementById("locateBtn").onclick=useLocation;
document.getElementById("mapsBtn").onclick=directions;
document.getElementById("reachedBtn").onclick=()=>markReached(document.getElementById("checkpointSelect").value);
document.getElementById("clearBtn").onclick=()=>clearCheckpoint(document.getElementById("checkpointSelect").value);
document.getElementById("addEssential").onclick=addEssential;
renderDocs(); populateControls(); renderMeals(); renderEssentials(); renderAll(); tick(); setInterval(tick,1000); setInterval(updateRoute,120000);
