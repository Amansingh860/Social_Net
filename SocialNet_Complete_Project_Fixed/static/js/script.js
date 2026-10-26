document.addEventListener("DOMContentLoaded",()=>{
  const root=document.documentElement;
  const savedTheme=localStorage.getItem("socialnet-theme")||"dark";
  root.dataset.theme=savedTheme;
  const qs=s=>document.querySelector(s), qsa=s=>document.querySelectorAll(s);
  const openModal=id=>{const el=qs(id);if(el)el.classList.add("open")};
  const setPointerVars=(el,e)=>{const r=el.getBoundingClientRect();el.style.setProperty("--mx",`${e.clientX-r.left}px`);el.style.setProperty("--my",`${e.clientY-r.top}px`)};
  const animateButtons=()=>qsa(".btn,.create-post-btn,.auth-secondary-cta,.auth-nav-cta,.icon-btn,.composer-trigger,.filter-btn,.text-btn,.post-actions button").forEach(el=>{el.addEventListener("pointermove",e=>setPointerVars(el,e));el.addEventListener("pointerdown",()=>{el.classList.add("is-pressing");setTimeout(()=>el.classList.remove("is-pressing"),180)});});
  animateButtons();
  const closeModals=()=>qsa(".modal-backdrop.open").forEach(x=>x.classList.remove("open"));
  qsa("[data-action='close-modal']").forEach(b=>b.addEventListener("click",closeModals));
  qsa(".modal-backdrop").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("open")}));
  qsa("[data-action='toggle-sidebar']").forEach(b=>b.addEventListener("click",()=>qs("#sidebar")?.classList.toggle("open")));
  const allNavPanel=qs("#allNavPanel");
  const setAllNav=(open)=>{if(!allNavPanel)return;allNavPanel.classList.toggle("open",open);qsa("[data-action='toggle-all-nav']").forEach(b=>b.setAttribute("aria-expanded",String(open)));};
  qsa("[data-action='toggle-all-nav']").forEach(b=>b.addEventListener("click",(e)=>{e.stopPropagation();setAllNav(!allNavPanel?.classList.contains("open"))}));
  document.addEventListener("click",e=>{if(allNavPanel?.classList.contains("open")&&!allNavPanel.contains(e.target)&&!e.target.closest("[data-action='toggle-all-nav']"))setAllNav(false)});
  qsa(".all-nav-panel .nav-morph").forEach(item=>item.addEventListener("click",()=>{item.classList.add("nav-pulse");setTimeout(()=>item.classList.remove("nav-pulse"),420)}));
  qsa("[data-action='toggle-theme']").forEach(b=>b.addEventListener("click",()=>{
    root.dataset.theme=root.dataset.theme==="dark"?"light":"dark";
    localStorage.setItem("socialnet-theme",root.dataset.theme);
  }));
  qsa("[data-action='close-toast']").forEach(b=>b.addEventListener("click",()=>b.parentElement.remove()));
  qsa("[data-action='toggle-password']").forEach(b=>b.addEventListener("click",()=>{const input=b.previousElementSibling;if(!input)return;const next=input.type==="password"?"text":"password";input.type=next;b.textContent=next==="text"?"◍":"◉";b.setAttribute("aria-label",next==="text"?"Hide password":"Show password")}));
  setTimeout(()=>qsa(".toast").forEach(x=>{x.style.opacity="0";x.style.transform="translateY(-6px)";setTimeout(()=>x.remove(),250)}),4500);

  qsa("[data-action='open-post-modal']").forEach(b=>b.addEventListener("click",()=>openModal("#postModal")));
  qsa("[data-action='open-story']").forEach(b=>b.addEventListener("click",()=>{
    const name=b.dataset.storyName||"Your story";
    const target=qs("#storyName"); if(target) target.textContent=name+"’s story";
    openModal("#storyModal");
  }));
  qsa("[data-action='groups-info']").forEach(b=>b.addEventListener("click",()=>openModal("#groupsModal")));
  qsa("[data-action='scroll-photo']").forEach(b=>b.addEventListener("click",()=>document.querySelector("#photoForm")?.scrollIntoView({behavior:"smooth",block:"center"})));

  qsa("[data-action='like']").forEach(b=>b.addEventListener("click",()=>{
    b.classList.toggle("liked");
    b.innerHTML=b.classList.contains("liked")?"♥ <span>Liked</span>":"♡ <span>Like</span>";
    b.animate([{transform:"scale(.86)"},{transform:"scale(1.14)"},{transform:"scale(1)"}],{duration:320,easing:"cubic-bezier(.2,.8,.2,1)"});
    const stats=b.closest(".post-card")?.querySelector(".post-stats span");
    if(stats) stats.textContent=b.classList.contains("liked")?"♥ 1 like":"♡ 0 likes";
  }));
  qsa("[data-action='save']").forEach(b=>b.addEventListener("click",()=>{
    b.classList.toggle("saved"); b.innerHTML=b.classList.contains("saved")?"▣ <span>Saved</span>":"▱ <span>Save</span>";
    toast(b.classList.contains("saved")?"Post saved":"Removed from saved");
  }));
  qsa("[data-action='comment']").forEach(b=>b.addEventListener("click",()=>toast("Comments are ready for the post API.")));
  qsa("[data-action='share']").forEach(b=>b.addEventListener("click",async()=>{
    try{await navigator.clipboard.writeText(location.href);toast("Post link copied");}catch{toast("Share link: "+location.href)}
  }));
  qsa("[data-action='share-profile']").forEach(b=>b.addEventListener("click",async()=>{
    try{await navigator.clipboard.writeText(location.href);toast("Profile link copied");}catch{toast("Profile link ready to share")}
  }));
  function toast(message){
    let wrap=qs(".toast-wrap"); if(!wrap){wrap=document.createElement("div");wrap.className="toast-wrap";document.body.appendChild(wrap)}
    const el=document.createElement("div");el.className="toast success";el.innerHTML=`<span>✓</span>${message}<button>×</button>`;
    el.querySelector("button").onclick=()=>el.remove();wrap.appendChild(el);setTimeout(()=>{el.style.opacity="0";setTimeout(()=>el.remove(),250)},2800);
  }

  // Reference-inspired morphing pill animation. The active pill glides across the dock and changes label/color.
  const motionLabels=["Connect","Discover","Chat","Open","Save"];
  const motionDocks=[...qsa("[data-motion-dock]")];
  motionDocks.forEach(dock=>{let index=3;const items=[...dock.querySelectorAll(".dock-item")];if(items.length<2)return;const tick=()=>{items.forEach((item,i)=>item.classList.toggle("active",i===index));items.forEach((item,i)=>{const small=item.querySelector("small");if(small&&i===index)small.textContent=motionLabels[index]||"Open"});index=(index+1)%items.length};setInterval(tick,1050)});

  // Premium login entrance: show the editorial transition, then let Flask complete the real POST.
  const loginForm=qs("#loginForm");
  const loginTransition=qs("#loginTransition");
  if(loginForm&&loginTransition){
    loginForm.addEventListener("submit",e=>{
      if(loginForm.dataset.submitting==="1")return;
      e.preventDefault();
      loginForm.dataset.submitting="1";
      const submit=loginForm.querySelector(".login-submit");
      submit?.classList.add("is-loading");
      const label=submit?.querySelector(".cta-label"); if(label)label.textContent="Entering your space…";
      sessionStorage.setItem("socialnet-just-logged-in","1");
      loginTransition.classList.add("open");
      setTimeout(()=>loginForm.submit(),1150);
    });
  }

  // Reference-inspired morphing navigation: hovered items expand into colorful pills.
  qsa(".nav-morph").forEach(item=>{
    item.addEventListener("pointermove",e=>{
      const r=item.getBoundingClientRect();
      item.style.setProperty("--mx",`${Math.max(0,Math.min(r.width,e.clientX-r.left))}px`);
      item.style.setProperty("--my",`${Math.max(0,Math.min(r.height,e.clientY-r.top))}px`);
    });
    item.addEventListener("click",()=>{
      item.classList.add("nav-pulse");
      setTimeout(()=>item.classList.remove("nav-pulse"),420);
    });
  });

  // One-time post-login reveal on the dashboard/app shell.
  const entry=qs("#pageEntry");
  if(entry&&sessionStorage.getItem("socialnet-just-logged-in")==="1"){
    sessionStorage.removeItem("socialnet-just-logged-in");
    entry.classList.add("open");
    setTimeout(()=>entry.classList.remove("open"),1350);
  }

  const messages=qs("#messages"); if(messages)messages.scrollTop=messages.scrollHeight;
  qsa("form[data-confirm]").forEach(form=>form.addEventListener("submit",e=>{
    const message=form.getAttribute("data-confirm")||"Are you sure?";
    if(!window.confirm(message))e.preventDefault();
  }));

  const adminSearch=qs("#adminSearch");
  if(adminSearch)adminSearch.addEventListener("input",()=>qsa("#usersTable tbody tr").forEach(row=>row.style.display=row.innerText.toLowerCase().includes(adminSearch.value.toLowerCase())?"":"none"));

  const searchInput=qs("#globalSearch");
  document.addEventListener("keydown",e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();searchInput?.focus()}
    if(e.key==="Escape"){closeModals();qs("#sidebar")?.classList.remove("open")}
  });
});
