/* ============================================================
   PANEL ADMIN · Joe Peña
   Configuracion completa de las 12 tarjetas + fondo + layout
============================================================ */
var SB=null, SESSION=null;
var TEXTS={}, STYLE={}, IMAGES={};

/* ---------- DEFAULTS DE DISEÑO ---------- */
var DEF={
  // fondo global
  bgColor:"#060606", bgAlpha:72, bgBlur:0, bgImg:1,
  pageW:1420, pagePad:16, cardGap:16,
  // acento (antes glow amarillo, ahora configurable de verdad)
  acc:"#8b9dff", accGlow:20,
  // tipografia global
  fTitle:"Poppins", sTitle:42, cTitle:"#ffffff",
  fCard:"Poppins",  sCard:16,  cCard:"#ffffff",
  fSub:"Inter",     sSub:12,   cSub:"#8a8d86",
  fBody:"Inter",    sBody:13.5,cBody:"#a8aaa4"
};
// glass por tarjeta 1..12: color, alpha(transparencia), blur, contraste, sombra, radio, alineacion
var CARDS=[1,2,3,4,5,6,7,8,9,10,11,12];
CARDS.forEach(function(n){
  DEF["c"+n+"_color"]="#0e0e0e";
  DEF["c"+n+"_alpha"]=88;
  DEF["c"+n+"_blur"]=18;
  DEF["c"+n+"_con"]=104;
  DEF["c"+n+"_shadow"]=42;
  DEF["c"+n+"_radius"]=22;
  DEF["c"+n+"_align"]="left";
});

var FONTS=["Poppins","Inter","Playfair Display","Montserrat","Sora","Space Grotesk","DM Sans","Manrope","Outfit","Bricolage Grotesque"];

/* ---------- DEFINICION DE LAS 12 TARJETAS ---------- */
/* cada tarjeta: nombre, descripcion, campos de texto, si lleva iconos/botones/imagenes */
var SCHEMA=[
  {n:1,name:"Perfil",desc:"Avatar, nombre y rol",
   texts:[["name","Nombre",""],["role","Rol / especialidad",""]],
   img:[["ava","Foto de perfil","600x600 · cuadrada"]]},

  {n:2,name:"Herramientas",desc:"8 iconos de tecnologías",
   texts:[["tl_shopify","Tool 1"],["tl_react","Tool 2"],["tl_supabase","Tool 3"],["tl_vercel","Tool 4"],["tl_github","Tool 5"],["tl_figma","Tool 6"],["tl_vscode","Tool 7"],["tl_photoshop","Tool 8"]],
   icons:true},

  {n:3,name:"CTA lateral",desc:"Tarjeta de llamado a la acción",
   texts:[["ctaH","Título CTA"],["ctaP","Texto CTA"]],
   btn:[["side_cta","Texto del botón"]]},

  {n:4,name:"Barra superior",desc:"Navegación + botón",
   texts:[],
   btn:[["topbar_cta","Texto del botón"]]},

  {n:5,name:"Hero",desc:"Título principal, foto grande, stats y botones",
   texts:[["h1","Título principal"],["hp","Subtítulo"],
          ["st1n","Stat 1 número"],["st1l","Stat 1 texto"],["st2n","Stat 2 número"],["st2l","Stat 2 texto"],
          ["st3n","Stat 3 número"],["st3l","Stat 3 texto"],["st4n","Stat 4 número"],["st4l","Stat 4 texto"]],
   btn:[["hero_primary","Botón 1"],["hero_secondary","Botón 2"]],
   img:[["hero","Foto principal","1200x1500 · vertical, sujeto a la derecha"]]},

  {n:6,name:"Especialidades",desc:"5 barras de habilidad",
   texts:[["sk1n","Skill 1"],["sk1p","%"],["sk2n","Skill 2"],["sk2p","%"],["sk3n","Skill 3"],["sk3p","%"],["sk4n","Skill 4"],["sk4p","%"],["sk5n","Skill 5"],["sk5p","%"]]},

  {n:7,name:"Actividad reciente",desc:"4 items con icono",
   texts:[["ac1t","Item 1 título"],["ac1s","Item 1 subtítulo"],["ac2t","Item 2 título"],["ac2s","Item 2 subtítulo"],["ac3t","Item 3 título"],["ac3s","Item 3 subtítulo"],["ac4t","Item 4 título"],["ac4s","Item 4 subtítulo"]],
   icons:true},

  {n:8,name:"Proyectos",desc:"5 tarjetas con foto",
   texts:[["pj1c","Proy 1 categoría"],["pj1n","Proy 1 nombre"],["pj2c","Proy 2 categoría"],["pj2n","Proy 2 nombre"],["pj3c","Proy 3 categoría"],["pj3n","Proy 3 nombre"],["pj4c","Proy 4 categoría"],["pj4n","Proy 4 nombre"],["pj5c","Proy 5 categoría"],["pj5n","Proy 5 nombre"]],
   img:[["pj1","Foto proyecto 1","800x1000"],["pj2","Foto proyecto 2","800x1000"],["pj3","Foto proyecto 3","800x1000"],["pj4","Foto proyecto 4","800x1000"],["pj5","Foto proyecto 5","800x1000"]]},

  {n:9,name:"Servicios",desc:"5 iconos con texto",
   texts:[["sv1","Servicio 1"],["sv2","Servicio 2"],["sv3","Servicio 3"],["sv4","Servicio 4"],["sv5","Servicio 5"]],
   icons:true},

  {n:10,name:"Testimonio",desc:"Foto del cliente + cita",
   texts:[["tst","Cita del testimonio"],["tstN","Nombre"],["tstR","Cargo / empresa"]],
   img:[["tst","Foto del cliente","300x300 · cuadrada"]]},

  {n:11,name:"Contacto",desc:"Mail, teléfono, ubicación, web, redes",
   texts:[["mail","Correo"],["tel","Teléfono"],["loc","Ubicación"],["web","Sitio web"]],
   links:[["li","LinkedIn URL"],["gh","GitHub URL"],["wa","WhatsApp URL"],["ig","Instagram URL"]]},

  {n:12,name:"Legal y Copyright",desc:"Texto legal del pie de página",
   texts:[["mkLegT","Título legal"],["mkLegS","Subtítulo"],["mkLegB","Texto legal completo"]]}
];

/* ---------- HELPERS ---------- */
function $(id){return document.getElementById(id)}
function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
function toast(msg,type){var t=$("toast");t.textContent=msg;t.className="toast show"+(type?" "+type:"");clearTimeout(t.__t);t.__t=setTimeout(function(){t.className="toast"},2600)}
function gv(k){return STYLE[k]!==undefined?STYLE[k]:DEF[k]}

/* ---------- RENDER DE UNA TARJETA ---------- */
function fontOptions(sel){return FONTS.map(function(f){return '<option value="'+f+'"'+(f===sel?' selected':'')+'>'+f+'</option>'}).join("")}

function glassGroup(n){
  var g=el("div","group");
  g.appendChild(el("div","group-t","Tarjeta glassmorphica "+n));
  var grid=el("div","grid");
  grid.appendChild(colorField("Color de tarjeta","c"+n+"_color"));
  grid.appendChild(sliderField("Transparencia","c"+n+"_alpha",0,100,"%"));
  grid.appendChild(sliderField("Blur (desenfoque)","c"+n+"_blur",0,40,"px"));
  grid.appendChild(sliderField("Contraste","c"+n+"_con",80,140,"%"));
  grid.appendChild(sliderField("Sombra","c"+n+"_shadow",0,100,""));
  grid.appendChild(sliderField("Radio de esquina","c"+n+"_radius",0,40,"px"));
  grid.appendChild(alignField("Alineación","c"+n+"_align"));
  g.appendChild(grid);
  return g;
}

function colorField(label,key){
  var f=el("div","field");
  f.appendChild(el("label",null,label));
  var row=el("div","row-color");
  var col=el("input");col.type="color";col.value=gv(key);
  var txt=el("input");txt.type="text";txt.value=gv(key);
  col.oninput=function(){txt.value=col.value;STYLE[key]=col.value;applyPreview()};
  txt.oninput=function(){if(/^#[0-9a-f]{6}$/i.test(txt.value)){col.value=txt.value;STYLE[key]=txt.value;applyPreview()}};
  row.appendChild(col);row.appendChild(txt);f.appendChild(row);
  return f;
}
function sliderField(label,key,min,max,unit){
  var f=el("div","field");
  f.appendChild(el("label",null,label));
  var row=el("div","row-slider");
  var r=el("input");r.type="range";r.min=min;r.max=max;r.step=(max-min>50?1:.5);r.value=gv(key);
  var v=el("span","val",gv(key)+unit);
  r.oninput=function(){STYLE[key]=parseFloat(r.value);v.textContent=r.value+unit;applyPreview()};
  row.appendChild(r);row.appendChild(v);f.appendChild(row);
  return f;
}
function alignField(label,key){
  var f=el("div","field");
  f.appendChild(el("label",null,label));
  var seg=el("div","seg");
  [["left","Izq"],["center","Centro"],["right","Der"]].forEach(function(o){
    var b=el("button",gv(key)===o[0]?"on":"",o[1]);
    b.onclick=function(){STYLE[key]=o[0];seg.querySelectorAll("button").forEach(function(x){x.className=""});b.className="on";applyPreview()};
    seg.appendChild(b);
  });
  f.appendChild(seg);return f;
}
function textField(key,label,multi){
  var f=el("div","field");
  f.appendChild(el("label",null,label||key));
  var i=multi?el("textarea"):el("input");
  if(!multi)i.type="text";
  i.value=TEXTS[key]||"";
  i.oninput=function(){TEXTS[key]=i.value};
  f.appendChild(i);
  return f;
}
function imgField(slot,label,dims){
  var f=el("div","field");
  f.appendChild(el("label",null,label));
  if(dims)f.appendChild(el("span","hint",dims));
  var drop=el("div","imgdrop"+(IMAGES[slot]?" has":""));
  drop.innerHTML=IMAGES[slot]?'<img src="'+IMAGES[slot]+'">':'<div class="ph"><b>Subir imagen</b>clic o arrastra aquí</div>';
  var inp=el("input");inp.type="file";inp.accept="image/*";inp.style.display="none";
  drop.onclick=function(){inp.click()};
  inp.onchange=function(){if(inp.files[0])readImg(inp.files[0],slot,drop)};
  drop.ondragover=function(e){e.preventDefault();drop.style.borderColor="var(--acc)"};
  drop.ondragleave=function(){drop.style.borderColor=""};
  drop.ondrop=function(e){e.preventDefault();drop.style.borderColor="";if(e.dataTransfer.files[0])readImg(e.dataTransfer.files[0],slot,drop)};
  f.appendChild(drop);f.appendChild(inp);
  if(IMAGES[slot]){
    var row=el("div","imgrow");
    var del=el("button","btn ghost","Quitar");
    del.onclick=function(){delete IMAGES[slot];drop.className="imgdrop";drop.innerHTML='<div class="ph"><b>Subir imagen</b>clic o arrastra aquí</div>';row.remove()};
    row.appendChild(del);f.appendChild(row);
  }
  return f;
}
function readImg(file,slot,drop){
  var max=1400,r=new FileReader();
  r.onload=function(){
    var img=new Image();
    img.onload=function(){
      var w=img.width,h=img.height;
      if(w>max||h>max){var s=max/Math.max(w,h);w=Math.round(w*s);h=Math.round(h*s)}
      var c=el("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(img,0,0,w,h);
      var url=c.toDataURL("image/jpeg",.88);
      IMAGES[slot]=url;
      drop.className="imgdrop has";drop.innerHTML='<img src="'+url+'">';
      toast("Imagen lista · guarda para subirla","ok");
    };
    img.src=r.result;
  };
  r.readAsDataURL(file);
}

/* ---------- CONSTRUIR UNA TARJETA COMPLETA ---------- */
function buildCard(def){
  var card=el("div","card");card.id="card"+def.n;
  var head=el("div","card-h");
  head.innerHTML='<div class="card-num">'+def.n+'</div><div style="flex:1"><div class="card-t">'+def.name+'</div><div class="card-desc">'+def.desc+'</div></div><div class="card-chevron">▼</div>';
  head.onclick=function(){card.classList.toggle("collapsed")};
  card.appendChild(head);
  var body=el("div","card-b");

  // TEXTOS
  if(def.texts&&def.texts.length){
    var gt=el("div","group");
    gt.appendChild(el("div","group-t","Textos"));
    var grid=el("div","grid");
    def.texts.forEach(function(t){
      var multi=(t[0]==="hp"||t[0]==="ctaP"||t[0]==="tst"||t[0]==="mkLegB"||t[0]==="h1");
      grid.appendChild(textField(t[0],t[1],multi));
    });
    gt.appendChild(grid);body.appendChild(gt);
  }

  // BOTONES
  if(def.btn){
    var gb=el("div","group");
    gb.appendChild(el("div","group-t","Botones"));
    var grid=el("div","grid");
    def.btn.forEach(function(b){
      var f=el("div","field");f.appendChild(el("label",null,b[1]));
      var i=el("input");i.type="text";i.value=(BTNLABELS[b[0]]||"");
      i.oninput=function(){BTNLABELS[b[0]]=i.value};
      f.appendChild(i);grid.appendChild(f);
    });
    gb.appendChild(grid);body.appendChild(gb);
  }

  // REDES (tarjeta 11)
  if(def.links){
    var gl=el("div","group");
    gl.appendChild(el("div","group-t","Redes sociales (URL de tu perfil)"));
    var grid=el("div","grid");
    def.links.forEach(function(l){
      var f=el("div","field");f.appendChild(el("label",null,l[1]));
      var i=el("input");i.type="url";i.value=(LINKS[l[0]]||"");i.placeholder="https://...";
      i.oninput=function(){LINKS[l[0]]=i.value};
      f.appendChild(i);grid.appendChild(f);
    });
    gl.appendChild(grid);body.appendChild(gl);
  }

  // IMAGENES
  if(def.img){
    var gi=el("div","group");
    gi.appendChild(el("div","group-t",def.img.length>1?"Imágenes ("+def.img.length+")":"Imagen"));
    var grid=el("div",def.img.length>1?"multi-img":"grid");
    def.img.forEach(function(im){grid.appendChild(imgField(im[0],im[1],im[2]))});
    gi.appendChild(grid);body.appendChild(gi);
  }

  // ICONOS (nota informativa: los iconos son SVG fijos del sitio)
  if(def.icons){
    var gic=el("div","group");
    gic.appendChild(el("div","group-t","Iconos"));
    gic.appendChild(el("div","preview","Los iconos de esta sección son SVG integrados en el sitio (Shopify, React, etc.). Los textos de arriba son las etiquetas. Puedes ajustar el estilo de la tarjeta abajo."));
    body.appendChild(gic);
  }

  // GLASSMORPHISM (siempre, para las 12)
  body.appendChild(glassGroup(def.n));

  card.appendChild(body);
  return card;
}

/* estado extra */
var BTNLABELS={}, LINKS={};

/* ---------- CONFIG GLOBAL (fondo + tipografia + layout) ---------- */
function buildGlobal(){
  var card=el("div","card");card.id="cardGlobal";
  var head=el("div","card-h");
  head.innerHTML='<div class="card-num" style="background:var(--warn)">G</div><div style="flex:1"><div class="card-t">Configuración global</div><div class="card-desc">Fondo, tipografía, acento, ancho y espaciado</div></div><div class="card-chevron">▼</div>';
  head.onclick=function(){card.classList.toggle("collapsed")};
  card.appendChild(head);
  var body=el("div","card-b");

  // Fondo
  var g1=el("div","group");g1.appendChild(el("div","group-t","Fondo de página"));
  var gr1=el("div","grid");
  gr1.appendChild(colorField("Color de fondo","bgColor"));
  gr1.appendChild(sliderField("Opacidad del velo","bgAlpha",0,100,"%"));
  gr1.appendChild(sliderField("Blur del fondo","bgBlur",0,40,"px"));
  gr1.appendChild(imgField("bg","Foto de fondo","1920x1080 · horizontal"));
  g1.appendChild(gr1);body.appendChild(g1);

  // Acento (reemplaza el glow amarillo)
  var g2=el("div","group");g2.appendChild(el("div","group-t","Color de acento"));
  var gr2=el("div","grid");
  gr2.appendChild(colorField("Color de acento","acc"));
  gr2.appendChild(sliderField("Intensidad de brillo","accGlow",0,60,""));
  g2.appendChild(gr2);body.appendChild(g2);

  // Tipografia
  var g3=el("div","group");g3.appendChild(el("div","group-t","Tipografía"));
  var gr3=el("div","grid");
  [["Título",["fTitle","sTitle","cTitle"]],["Tarjetas",["fCard","sCard","cCard"]],["Subtítulos",["fSub","sSub","cSub"]],["Cuerpo",["fBody","sBody","cBody"]]].forEach(function(t){
    var f=el("div","field");f.appendChild(el("label",null,t[0]+" · fuente"));
    var sel=el("select");sel.innerHTML=fontOptions(gv(t[1][0]));
    sel.onchange=function(){STYLE[t[1][0]]=sel.value;applyPreview()};
    f.appendChild(sel);gr3.appendChild(f);
    gr3.appendChild(sliderField(t[0]+" · tamaño",t[1][1],9,64,"px"));
    gr3.appendChild(colorField(t[0]+" · color",t[1][2]));
  });
  g3.appendChild(gr3);body.appendChild(g3);

  // Layout
  var g4=el("div","group");g4.appendChild(el("div","group-t","Ancho y espaciado"));
  var gr4=el("div","grid");
  gr4.appendChild(sliderField("Ancho de página","pageW",1000,1800,"px"));
  gr4.appendChild(sliderField("Margen exterior","pagePad",0,60,"px"));
  gr4.appendChild(sliderField("Separación entre tarjetas","cardGap",6,40,"px"));
  g4.appendChild(gr4);body.appendChild(g4);

  card.appendChild(body);
  return card;
}

/* ---------- TABS DE NAVEGACION ---------- */
function buildTabs(){
  var t=$("tabs");
  var gt=el("div","tab","Global");gt.onclick=function(){$("cardGlobal").scrollIntoView({behavior:"smooth"});setActive(gt)};
  t.appendChild(gt);
  SCHEMA.forEach(function(def){
    var tab=el("div","tab",def.n+". "+def.name);
    tab.onclick=function(){$("card"+def.n).scrollIntoView({behavior:"smooth"});setActive(tab)};
    t.appendChild(tab);
  });
}
function setActive(tab){document.querySelectorAll(".tab").forEach(function(x){x.classList.remove("active")});tab.classList.add("active")}

/* ---------- PREVIEW (aplica acento al panel para ver el color) ---------- */
function applyPreview(){
  document.documentElement.style.setProperty("--acc",gv("acc"));
}

/* ---------- SUPABASE ---------- */
function initSB(){
  var cfg=window.APP_CONFIG||{};
  if(!cfg.SUPABASE_URL||!cfg.SUPABASE_ANON_KEY||cfg.SUPABASE_URL.indexOf("TU_")===0){
    setCloud("Sin conexión (revisa config.js)","err");return;
  }
  try{
    SB=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
  }catch(e){setCloud("Error al conectar","err");return}
  // auto-login
  if(cfg.EDITOR_EMAIL&&cfg.EDITOR_PASSWORD){
    SB.auth.signInWithPassword({email:cfg.EDITOR_EMAIL,password:cfg.EDITOR_PASSWORD}).then(function(r){
      if(r.error){setCloud("Conectado (solo lectura)","err")}
      else{SESSION=r.data.session;setCloud("Editor conectado","ok")}
      cloudPull();
    });
  }else{setCloud("Sin credenciales de editor","err");cloudPull()}
}
function setCloud(txt,type){var c=$("cloud");c.textContent=txt;c.className="status"+(type?" "+type:"")}

function cloudPull(){
  if(!SB)return;
  SB.from("site_settings").select("style,texts").eq("id","default").maybeSingle().then(function(r){
    if(r.data){
      if(r.data.style)STYLE=Object.assign({},r.data.style);
      if(r.data.texts){
        TEXTS=Object.assign({},r.data.texts);
        // separar links y btnlabels si vinieran embebidos
        ["li","gh","wa","ig"].forEach(function(k){if(TEXTS["link_"+k]){LINKS[k]=TEXTS["link_"+k]}});
      }
    }
    renderAll();
  });
  SB.from("site_buttons").select("key,label").then(function(r){
    if(r.data)r.data.forEach(function(b){BTNLABELS[b.key]=b.label});
  });
  SB.from("site_images").select("slot,url").then(function(r){
    if(r.data){r.data.forEach(function(i){IMAGES[i.slot]=i.url});renderAll()}
  });
  // links guardados en localStorage tambien
  try{var l=JSON.parse(localStorage.getItem("jp-links-v1")||"{}");Object.assign(LINKS,l)}catch(e){}
}

/* ---------- GUARDAR TODO ---------- */
function saveAll(){
  if(!SB){toast("Sin conexión a Supabase","err");return}
  if(!SESSION){
    var cfg=window.APP_CONFIG||{};
    if(cfg.EDITOR_EMAIL&&cfg.EDITOR_PASSWORD){
      toast("Conectando...");
      SB.auth.signInWithPassword({email:cfg.EDITOR_EMAIL,password:cfg.EDITOR_PASSWORD}).then(function(r){
        if(r.error){toast("No se pudo autenticar: "+r.error.message,"err")}
        else{SESSION=r.data.session;setCloud("Editor conectado","ok");saveAll()}
      });
    }else toast("Faltan credenciales de editor","err");
    return;
  }
  toast("Guardando...");
  // guardar links dentro de texts para persistencia
  var textsOut=Object.assign({},TEXTS);
  Object.keys(LINKS).forEach(function(k){textsOut["link_"+k]=LINKS[k]});

  // 1. settings (style + texts)
  var p1=SB.from("site_settings").upsert({id:"default",style:STYLE,texts:textsOut,updated_at:new Date().toISOString()});
  // 2. botones
  var btnRows=Object.keys(BTNLABELS).map(function(k){return{key:k,label:BTNLABELS[k],updated_at:new Date().toISOString()}});
  var p2=btnRows.length?SB.from("site_buttons").upsert(btnRows,{onConflict:"key"}):Promise.resolve({});
  // 3. imagenes: subir las que son dataURL
  var slots=Object.keys(IMAGES).filter(function(k){return IMAGES[k]&&IMAGES[k].indexOf("data:")===0});

  Promise.all([p1,p2]).then(function(res){
    if(res[0]&&res[0].error)throw res[0].error;
    if(slots.length===0){finishSave(0,0);return null}
    return uploadImages(slots);
  }).then(function(r){
    if(r)finishSave(r.ok,r.fail);
  }).catch(function(e){toast("Error: "+(e.message||e),"err")});
  // guardar links en localStorage tambien
  localStorage.setItem("jp-links-v1",JSON.stringify(LINKS));
}
function uploadImages(slots){
  var ok=0,fail=0;
  return slots.reduce(function(chain,slot){
    return chain.then(function(){
      return fetch(IMAGES[slot]).then(function(r){return r.blob()}).then(function(blob){
        var path="site/"+slot+"-"+Date.now()+".jpg";
        return SB.storage.from("media").upload(path,blob,{contentType:"image/jpeg",upsert:true}).then(function(u){
          if(u.error)throw u.error;
          var pub=SB.storage.from("media").getPublicUrl(path).data.publicUrl;
          IMAGES[slot]=pub;
          return SB.from("site_images").upsert({slot:slot,url:pub,storage_path:path,updated_at:new Date().toISOString()},{onConflict:"slot"});
        });
      }).then(function(){ok++}).catch(function(){fail++});
    });
  },Promise.resolve()).then(function(){return{ok:ok,fail:fail}});
}
function finishSave(ok,fail){
  var msg="Guardado en la nube";
  if(ok)msg+=" · "+ok+" imagen(es) subida(s)";
  if(fail)msg+=" · "+fail+" fallaron";
  toast(msg,fail?"err":"ok");
  $("saveInfo").textContent="Último guardado: "+new Date().toLocaleTimeString();
}

/* ---------- RESET ---------- */
function resetStyle(){
  STYLE={};
  renderAll();
  applyPreview();
  toast("Diseño restaurado (guarda para aplicar)","ok");
}

/* ---------- RENDER GENERAL ---------- */
function renderAll(){
  var c=$("cards");c.innerHTML="";
  c.appendChild(buildGlobal());
  SCHEMA.forEach(function(def){c.appendChild(buildCard(def))});
}

/* ---------- ARRANQUE ---------- */
buildTabs();
renderAll();
applyPreview();
initSB();
$("saveBtn").onclick=saveAll;
$("saveTop").onclick=saveAll;
$("resetBtn").onclick=resetStyle;
console.log("[JP admin] listo · admin-v1");
