/* KOLDWAVE.dz — shared site script. Runs on every page; each feature
   initializes only when its elements exist on the current page. */
(function(){
  "use strict";
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ANIM = typeof anime === 'function' && !REDUCED;
  if(ANIM) document.documentElement.classList.add('anim');

  var store = {
    get:function(k){ try{ return JSON.parse(localStorage.getItem(k)); }catch(e){ return null; } },
    set:function(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
  };
  var money = function(n){ return n.toLocaleString('en-US').replace(/,/g,' ') + ' DA'; };
  var HANG = '<svg class="pm-hang" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M12 3a2 2 0 0 0-1 3.73c.55.32.9.79.9 1.27 0 .6-.5 1.05-1.2 1.45L4 14.2c-.7.4-1.2.95-1.2 1.75C2.8 17 3.7 18 5 18h14c1.3 0 2.2-1 2.2-2.05 0-.8-.5-1.35-1.2-1.75l-6.7-3.75"/></svg>';

  var $ = function(s,c){ return (c||document).querySelector(s); };
  var $$ = function(s,c){ return [].slice.call((c||document).querySelectorAll(s)); };

  var D = window.KW || {};
  var products = D.products || [], cats = D.cats || [], badgeText = D.badgeText || {};
  var looks = D.looks || [], reviews = D.reviews || [], SHIPPING = D.SHIPPING || {};
  var wished = store.get('kw-wish') || {};
  var HAS_DZ = typeof DZ==='object' && DZ && DZ['34'];

  // ---------- Toast ----------
  var toastEl=$('#toast'), toastT;
  function toast(msg){
    if(!toastEl) return;
    $('#toastMsg').textContent=msg; toastEl.classList.add('show');
    clearTimeout(toastT); toastT=setTimeout(function(){toastEl.classList.remove('show');},2200);
  }

  // ---------- Reveal (observe() is a no-op until the IO is created below) ----------
  var io;
  function observe(el){ if(io) io.observe(el); }
  function assign(base,extra){ for(var k in extra){ if(extra.hasOwnProperty(k)) base[k]=extra[k]; } return base; }
  var ANIMS = {
    up:   { translateY:[22,0], opacity:[0,1], duration:640, easing:'easeOutCubic' },
    card: { translateY:[30,0], scale:[.96,1], opacity:[0,1], duration:560, easing:'easeOutCubic' },
    pop:  { translateY:[26,0], scale:[.94,1], opacity:[0,1], duration:620, easing:'easeOutQuart' }
  };
  function revealBatch(els){
    var groups={};
    els.forEach(function(el){ var t=ANIMS[el.dataset.anim]?el.dataset.anim:'up'; (groups[t]=groups[t]||[]).push(el); });
    Object.keys(groups).forEach(function(t){
      var list=groups[t];
      anime(assign({ targets:list, delay:anime.stagger(70),
        complete:function(){ list.forEach(function(el){ el.classList.add('in'); el.style.opacity=''; el.style.transform=''; }); }
      }, ANIMS[t]));
    });
  }
  function drawHang(){
    var path=document.querySelector('#spotMain .hang path'); if(!path||path.__drawn) return; path.__drawn=true;
    anime({targets:path, strokeDashoffset:[anime.setDashoffset,0], duration:1500, delay:250, easing:'easeInOutQuad'});
  }

  // ---------- Marquees ----------
  var announceTrack=$('#announceTrack');
  if(announceTrack){
    var aItems='<span>Free delivery across all 58 wilayas &nbsp;<b>✦</b>&nbsp; New Y2K drop is live &nbsp;<b>✦</b>&nbsp; Cash on delivery &nbsp;<b>✦</b>&nbsp; Ride the Kold Wave &nbsp;<b>✦</b>&nbsp; Limited runs, no restocks &nbsp;<b>✦</b>&nbsp;</span>';
    announceTrack.innerHTML=aItems+aItems;
  }
  var tickerTrack=$('#tickerTrack');
  if(tickerTrack){
    var dot='<svg class="dot" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.5 7L22 9.5l-6 4.4 2.3 7.1L12 16.8 5.7 21l2.3-7.1-6-4.4L9.5 9z"/></svg>';
    var tItems='<span class="chrome">KOLDWAVE</span>'+dot+'<span class="ice-text">Y2K</span>'+dot+'<span class="chrome">STREETWEAR</span>'+dot+'<span class="mag-text">DRIP</span>'+dot+'<span class="chrome">TECHWEAR</span>'+dot+'<span class="ice-text">.DZ</span>'+dot;
    tickerTrack.innerHTML=tItems+tItems;
  }

  // ---------- Cart (drawer lives on every page; state in localStorage) ----------
  var cart = store.get('kw-cart') || [];
  var drawer=$('#drawer'), scrim=$('#scrim');
  function openCart(){
    if(!drawer) return;
    drawer.classList.add('open'); scrim.classList.add('open');
    $('#openCart').setAttribute('aria-expanded','true');
    if(ANIM){ var lines=drawer.querySelectorAll('.line'); if(lines.length) anime({targets:lines, translateX:[34,0], opacity:[0,1], delay:anime.stagger(45), duration:380, easing:'easeOutCubic'}); }
    setTimeout(function(){ $('#closeCart').focus(); },80);
  }
  function closeCart(){
    if(!drawer || !drawer.classList.contains('open')) return;
    drawer.classList.remove('open'); scrim.classList.remove('open');
    $('#openCart').setAttribute('aria-expanded','false');
  }
  if(drawer){
    $('#openCart').addEventListener('click',openCart);
    $('#closeCart').addEventListener('click',closeCart);
    scrim.addEventListener('click',closeCart);
    $('#checkout').addEventListener('click',function(){
      if(!cart.length){ toast('Your bag is empty'); return; }
      window.location.href='checkout.html';
    });
  }
  function addToCart(p,size,qty,src){
    var key=p.id+'-'+size;
    var ex=cart.filter(function(x){return x.key===key;})[0];
    if(ex){ ex.qty+=qty; } else { cart.push({key:key,id:p.id,name:p.name,cat:p.cat,price:p.price,size:size,qty:qty,g1:p.g1,g2:p.g2}); }
    renderCart(); if(src) flyToCart(src); bump(); toast('Added to bag ✦ '+p.name);
  }
  function renderCart(){
    var items=$('#drawerItems');
    if(items){
      if(!cart.length){ items.innerHTML='<p class="empty">Your bag is empty — go catch the wave.</p>'; }
      else{
        items.innerHTML = cart.map(function(c){
          return '<div class="line" data-key="'+c.key+'">'+
            '<div class="lp" style="background:linear-gradient(140deg,'+c.g1+','+c.g2+')"></div>'+
            '<div class="li"><b>'+c.name+'</b><span class="lc">'+c.cat+' • '+c.size+'</span><div class="lpr mono">'+money(c.price)+'</div>'+
              '<div class="lq"><button data-a="dec">−</button><span>'+c.qty+'</span><button data-a="inc">+</button></div>'+
            '</div>'+
            '<button class="rm" aria-label="Remove"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg></button>'+
          '</div>';
        }).join('');
        items.querySelectorAll('.line').forEach(function(ln){
          var c=cart.filter(function(x){return x.key===ln.dataset.key;})[0];
          ln.querySelector('[data-a="inc"]').addEventListener('click',function(){c.qty++;renderCart();bump();});
          ln.querySelector('[data-a="dec"]').addEventListener('click',function(){c.qty--; if(c.qty<1){cart=cart.filter(function(x){return x!==c;});} renderCart();bump();});
          ln.querySelector('.rm').addEventListener('click',function(){cart=cart.filter(function(x){return x!==c;});renderCart();bump();});
        });
      }
    }
    var sub=cart.reduce(function(s,c){return s+c.price*c.qty;},0);
    var subEl=$('#subtotal'); if(subEl) subEl.textContent=money(sub);
    var count=cart.reduce(function(s,c){return s+c.qty;},0);
    var cc=$('#cartCount'); if(cc){ cc.textContent=count; cc.classList.toggle('show',count>0); }
    store.set('kw-cart',cart);
  }
  function bump(){
    var cc=$('#cartCount'); if(!cc) return;
    cc.style.transform='scale(1.35)'; setTimeout(function(){cc.style.transform=cc.classList.contains('show')?'scale(1)':'scale(0)';},160);
    if(ANIM) anime({targets:'#openCart svg', rotate:[{value:-9,duration:90},{value:8,duration:90},{value:-5,duration:80},{value:0,duration:130}], easing:'easeInOutSine'});
  }
  function flyToCart(src){
    if(!ANIM || !src || !src.getBoundingClientRect) return;
    var tgt=$('#openCart'); if(!tgt) return;
    var a=src.getBoundingClientRect(), b=tgt.getBoundingClientRect();
    var d=document.createElement('div'); d.className='fly';
    d.style.left=(a.left+a.width/2-7)+'px'; d.style.top=(a.top+a.height/2-7)+'px';
    document.body.appendChild(d);
    var dx=(b.left+b.width/2)-(a.left+a.width/2), dy=(b.top+b.height/2)-(a.top+a.height/2);
    anime({targets:d,
      translateX:[{value:dx*.42,duration:260,easing:'easeOutQuad'},{value:dx,duration:330,easing:'easeInQuad'}],
      translateY:[{value:-70,duration:260,easing:'easeOutQuad'},{value:dy,duration:330,easing:'easeInQuad'}],
      scale:[{value:1,duration:260},{value:.32,duration:330}],
      complete:function(){ if(d.parentNode) d.parentNode.removeChild(d); }
    });
  }
  renderCart();

  // ---------- Product grid (shop.html full grid + filters; index.html featured grid) ----------
  var grid=$('#grid'), filters=$('#filters');
  function cardHTML(p){
    var num = ('0'+p.id).slice(-2);
    var badge = p.badge ? '<div class="badges"><span class="badge '+p.badge+'">'+badgeText[p.badge]+'</span></div>' : '';
    var priceOld = p.old ? '<span class="old">'+money(p.old)+'</span>' : '';
    return '<article class="card rv" data-anim="card" data-cat="'+p.cat+'">'+
      '<div class="pm" style="--g1:'+p.g1+';--g2:'+p.g2+'">'+
        '<span class="pm-num anton">'+num+'</span>'+HANG+
        '<button class="wish'+(wished[p.id]?' on':'')+'" data-id="'+p.id+'" aria-pressed="'+(wished[p.id]?'true':'false')+'" aria-label="Add to wishlist"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21Z"/></svg></button>'+
        badge+
        '<span class="pm-name anton">'+p.name+'</span>'+
      '</div>'+
      '<div class="card-body">'+
        '<div class="card-cat">'+p.cat+'</div>'+
        '<div class="card-name">'+p.name+'</div>'+
        '<div class="card-foot">'+
          '<div class="price">'+priceOld+money(p.price)+'</div>'+
          '<button class="add" data-id="'+p.id+'" aria-label="Add '+p.name+' to bag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg></button>'+
        '</div>'+
      '</div>'+
    '</article>';
  }
  function renderCards(list){
    if(!grid) return;
    var limit=parseInt(grid.dataset.limit,10);
    if(limit) list=list.slice(0,limit);
    grid.innerHTML = list.length ? list.map(cardHTML).join('') : '<p class="empty" style="grid-column:1/-1;padding:40px 0">No pieces match — try another wave.</p>';
    grid.querySelectorAll('.card').forEach(function(el,i){ if(!ANIM) el.style.transitionDelay=(i*40)+'ms'; observe(el); });
    grid.querySelectorAll('.add').forEach(function(b){
      b.addEventListener('click',function(){ var p=products.filter(function(x){return x.id==b.dataset.id;})[0]; addToCart(p,'M',1,b); });
    });
    grid.querySelectorAll('.wish').forEach(function(w){
      w.addEventListener('click',function(){
        var id=w.dataset.id, on=w.classList.toggle('on');
        w.setAttribute('aria-pressed', on?'true':'false');
        if(id){ if(on){ wished[id]=1; } else { delete wished[id]; } store.set('kw-wish',wished); }
        if(ANIM) anime({targets:w.querySelector('svg'), scale:[{value:1.45,duration:150,easing:'easeOutQuad'},{value:1,duration:300,easing:'easeOutElastic(1,.5)'}]});
      });
    });
  }
  function renderGrid(cat){
    renderCards(cat==='all'||!cat ? products : products.filter(function(p){return p.cat===cat;}));
  }
  function activateChip(cat){
    if(!filters) return;
    filters.querySelectorAll('.chip').forEach(function(x){ x.classList.toggle('active', x.dataset.cat===cat); });
  }
  if(filters){
    cats.forEach(function(c,i){
      var b=document.createElement('button');
      b.className='chip'+(i===0?' active':''); b.textContent=c[1]; b.dataset.cat=c[0];
      b.addEventListener('click',function(){ activateChip(c[0]); renderGrid(c[0]); });
      filters.appendChild(b);
    });
  }
  function searchInPlace(q){
    var toks=q.toLowerCase().split(/\s+/).filter(function(t){return t;});
    var res=!toks.length ? products : products.filter(function(p){
      var hay=(p.name+' '+p.cat).toLowerCase();
      return toks.every(function(t){ return hay.indexOf(t)>-1; });
    });
    activateChip(toks.length?null:'all');
    renderCards(res);
    toast(toks.length ? res.length+' result'+(res.length===1?'':'s')+' for “'+q+'”' : 'Showing the full drop');
  }
  if(grid){
    var params=new URLSearchParams(window.location.search);
    var pCat=params.get('cat'), pQ=params.get('q');
    var validCat = pCat && cats.some(function(c){return c[0]===pCat && pCat!=='all';});
    if(filters && validCat){ activateChip(pCat); renderGrid(pCat); }
    else if(filters && pQ){ searchInPlace(pQ.trim()); }
    else renderGrid('all');
  }

  // ---------- Lookbook ----------
  var look=$('#look');
  if(look){
    look.innerHTML = looks.map(function(l){
      return '<div class="shot rv" data-anim="card" style="aspect-ratio:'+l.r+'"><div class="g" style="background:linear-gradient(140deg,'+l.g1+','+l.g2+')"></div><div class="ov"><div class="cap anton">'+l.t+'<small>'+l.s+'</small></div></div></div>';
    }).join('');
  }

  // ---------- Reviews ----------
  var reviewsEl=$('#reviews');
  if(reviewsEl){
    var star='<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.5 7 .8-5.2 4.7 1.4 6.9L12 18l-6.6 3.6 1.4-6.9L1.6 9.3l7-.8z"/></svg>';
    reviewsEl.innerHTML = reviews.map(function(r){
      return '<div class="review rv"><div class="stars">'+star+star+star+star+star+'</div><p>“'+r.t+'”</p><div class="who"><div class="av" style="--g1:'+r.g1+';--g2:'+r.g2+'">'+r.n.charAt(0)+'</div><div><b>'+r.n+'</b><span>'+r.c+'</span></div></div></div>';
    }).join('');
  }

  // ---------- Spotlight (index) ----------
  var spotSizes=$('#spotSizes');
  if(spotSizes){
    var spotSize='S', spotQty=1;
    spotSizes.querySelectorAll('.size').forEach(function(b){
      b.addEventListener('click',function(){ spotSizes.querySelectorAll('.size').forEach(function(x){x.classList.remove('active');}); b.classList.add('active'); spotSize=b.textContent; });
    });
    $('#qMinus').addEventListener('click',function(){ spotQty=Math.max(1,spotQty-1); $('#qVal').value=spotQty; });
    $('#qPlus').addEventListener('click',function(){ spotQty++; $('#qVal').value=spotQty; });
    $('#qVal').addEventListener('input',function(){ var v=parseInt(this.value)||1; spotQty=Math.max(1,v); this.value=spotQty; });
    var spotProduct=products[0];
    $('#spotAdd').addEventListener('click',function(){ addToCart(spotProduct,spotSize,spotQty,this); openCart(); });
    $('#spotBuy').addEventListener('click',function(){ addToCart(spotProduct,spotSize,spotQty,this); window.location.href='checkout.html'; });
    var thumbGrads=[["#5FE4FF","#8B7BFF"],["#22C7F5","#0B6F97"],["#8B7BFF","#FF2D8B"]];
    $('#spotThumbs').querySelectorAll('.thumb').forEach(function(t,i){
      t.addEventListener('click',function(){
        $('#spotThumbs').querySelectorAll('.thumb').forEach(function(x){x.classList.remove('active');}); t.classList.add('active');
        var m=$('#spotMain'); m.style.setProperty('--g1',thumbGrads[i][0]); m.style.setProperty('--g2',thumbGrads[i][1]);
        if(ANIM) anime({targets:'#spotMain .hang', scale:[.88,1], rotate:[-5,0], duration:460, easing:'easeOutBack'});
      });
    });
  }

  // ---------- Search overlay (all pages; results live on shop.html) ----------
  var searchOv=$('#searchOv');
  function openSearch(){ if(searchOv){ searchOv.classList.add('open'); setTimeout(function(){$('#searchInput').focus();},80); } }
  function closeSearch(){ if(searchOv) searchOv.classList.remove('open'); }
  function runSearch(q){
    q=(q||'').trim();
    if(grid && filters){
      searchInPlace(q);
      closeSearch();
      var drop=document.getElementById('drop');
      if(drop) drop.scrollIntoView({behavior:REDUCED?'auto':'smooth'});
    } else {
      window.location.href='shop.html'+(q?'?q='+encodeURIComponent(q):'');
    }
  }
  if(searchOv){
    $('#openSearch').addEventListener('click',openSearch);
    $('#closeSearch').addEventListener('click',closeSearch);
    searchOv.addEventListener('click',function(e){ if(e.target===searchOv) closeSearch(); });
    $('#searchInput').addEventListener('keydown',function(e){ if(e.key==='Enter') runSearch(this.value); });
    searchOv.querySelectorAll('.tags button').forEach(function(b){ b.addEventListener('click',function(){ $('#searchInput').value=b.textContent; runSearch(b.textContent); }); });
  }

  // ---------- Mobile menu ----------
  var mmenu=$('#mmenu');
  function closeMenu(){ if(mmenu){ mmenu.classList.remove('open'); $('#openMenu').setAttribute('aria-expanded','false'); } }
  if(mmenu){
    $('#openMenu').addEventListener('click',function(){ mmenu.classList.add('open'); this.setAttribute('aria-expanded','true'); setTimeout(function(){ $('#closeMenu').focus(); },80); });
    $('#closeMenu').addEventListener('click',closeMenu);
    mmenu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',closeMenu); });
  }
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ closeSearch(); closeCart(); closeMenu(); } });

  // ---------- Newsletter ----------
  var newsForm=$('#newsForm');
  if(newsForm) newsForm.addEventListener('submit',function(e){ e.preventDefault(); this.reset(); toast('You\'re on the list ✦ Watch your inbox'); });

  // ---------- Reveal / counters ----------
  if('IntersectionObserver' in window){
    io=new IntersectionObserver(function(entries){
      var batch=[];
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        io.unobserve(en.target);
        if(en.target.dataset.count!==undefined){ countUp(en.target); return; }
        if(ANIM){ batch.push(en.target); if(en.target.classList.contains('spot-gallery')) drawHang(); }
        else en.target.classList.add('in');
      });
      if(batch.length) revealBatch(batch);
    },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.rv').forEach(function(el){ if(ANIM && el.closest('.hero')) return; io.observe(el); });
    document.querySelectorAll('[data-count]').forEach(function(el){io.observe(el);});
  } else { document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in');}); }

  function countUp(el){
    var target=parseFloat(el.dataset.count), dec=el.dataset.decimal?parseInt(el.dataset.decimal,10):0;
    var sib=el.parentNode?el.parentNode.querySelector('[data-suffix]'):null;
    var sfx=sib?sib.dataset.suffix:'';
    function fmt(v){ return (dec ? (v/Math.pow(10,dec)).toFixed(dec) : Math.round(v)) + sfx; }
    if(ANIM){
      var obj={v:0};
      anime({targets:obj, v:target, round:1, duration:1600, easing:'easeOutExpo', update:function(){ el.textContent=fmt(obj.v); }});
      return;
    }
    var start=null, dur=1200;
    function step(ts){ if(!start)start=ts; var p=Math.min((ts-start)/dur,1); var val=target*(1-Math.pow(1-p,3));
      el.textContent=fmt(val);
      if(p<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---------- Hero entrance timeline (index) ----------
  function splitLine(line){
    var text=line.textContent, chrome=line.classList.contains('chrome');
    line.classList.remove('chrome'); line.classList.add('msk');
    line.setAttribute('aria-hidden','true');
    line.innerHTML=text.split(' ').map(function(w){
      return '<span class="wd">'+w.split('').map(function(c){
        return '<span class="ch'+(chrome?' chrome':'')+'">'+c+'</span>';
      }).join('')+'</span>';
    }).join(' ');
    return line.querySelectorAll('.ch');
  }
  var heroH1=document.querySelector('.hero h1');
  if(ANIM && heroH1){
    var chars1=splitLine(heroH1.querySelector('.l1')), chars2=splitLine(heroH1.querySelector('.l2'));
    heroH1.classList.add('in');
    anime.set(chars1,{translateY:'112%'}); anime.set(chars2,{translateY:'112%'});
    var heroFade=['.hero-copy .eyebrow','.hero-lead','.hero-cta','.hero-trust'];
    var pws=[].slice.call(document.querySelectorAll('.hero-visual .pw'));
    pws.forEach(function(el){ anime.set(el,{opacity:0}); });
    var tl=anime.timeline({easing:'easeOutCubic'});
    tl.add({targets:'.hero-copy .eyebrow', translateY:[18,0], opacity:[0,1], duration:500}, 60)
      .add({targets:chars1, translateY:['112%','0%'], duration:680, delay:anime.stagger(26), easing:'easeOutExpo'}, 140)
      .add({targets:chars2, translateY:['112%','0%'], duration:720, delay:anime.stagger(24), easing:'easeOutExpo'}, 300)
      .add({targets:'.hero-lead', translateY:[24,0], opacity:[0,1], duration:560}, 620)
      .add({targets:'.hero-cta', translateY:[24,0], opacity:[0,1], duration:560}, 720)
      .add({targets:'.hero-trust', translateY:[20,0], opacity:[0,1], duration:560}, 830)
      .add({targets:'.pww', opacity:[0,1], duration:900, easing:'easeOutQuad'}, 200)
      .add({targets:'.pw1', translateY:[54,0], opacity:[0,1], duration:700, easing:'easeOutQuart'}, 260)
      .add({targets:'.pw2', translateY:[64,0], opacity:[0,1], duration:700, easing:'easeOutQuart'}, 380)
      .add({targets:'.pwc', scale:[0,1], opacity:[0,1], duration:640, easing:'easeOutBack'}, 560)
      .add({targets:'.pws1', scale:[0,1], rotate:[-14,0], opacity:[0,1], duration:520, easing:'easeOutBack'}, 700)
      .add({targets:'.pws2', scale:[0,1], rotate:[10,0], opacity:[0,1], duration:520, easing:'easeOutBack'}, 780)
      .add({targets:'.pwd', translateX:[26,0], opacity:[0,1], duration:520}, 860);
    if(tl.finished && tl.finished.then) tl.finished.then(function(){
      heroFade.forEach(function(s){ var el=document.querySelector(s); if(el){ el.classList.add('in'); el.style.opacity=''; el.style.transform=''; } });
      pws.forEach(function(el){ el.style.opacity=''; el.style.transform=''; });
      heroH1.querySelectorAll('.ch').forEach(function(c){ c.style.transform=''; });
    });
  }

  // ---------- Countdown (index; persisted so the timer survives reloads) ----------
  if($('#cd-d')){
    var DROP_MS=(3*24*60*60*1000)+(7*60*60*1000)+(42*60*1000);
    var target=store.get('kw-drop');
    if(!target || target-new Date().getTime()<=0){ target=new Date().getTime()+DROP_MS; store.set('kw-drop',target); }
    var tick=function(){
      var d=target-new Date().getTime(); if(d<0)d=0;
      var days=Math.floor(d/86400000), hrs=Math.floor(d%86400000/3600000), min=Math.floor(d%3600000/60000), sec=Math.floor(d%60000/1000);
      var p=function(n){return ('0'+n).slice(-2);};
      var e;
      if(e=$('#cd-d'))e.textContent=p(days); if(e=$('#cd-h'))e.textContent=p(hrs); if(e=$('#cd-m'))e.textContent=p(min); if(e=$('#cd-s'))e.textContent=p(sec);
    };
    tick(); setInterval(tick,1000);
  }

  // ---------- Shipping page: wilaya rate table ----------
  var shipTable=$('#shipTable');
  if(shipTable && HAS_DZ){
    var keys=Object.keys(DZ).sort();
    var rows=keys.map(function(k){
      var s=SHIPPING[k];
      var cells = s
        ? '<td class="num">'+(s[0]!=null?money(s[0]):'<span class="na">—</span>')+'</td><td class="num">'+(s[1]!=null?money(s[1]):'<span class="na">—</span>')+'</td>'
        : '<td colspan="2" class="nolv">Not deliverable for now</td>';
      return '<tr><td class="num">'+k+'</td><td>'+DZ[k].n+'</td>'+cells+'</tr>';
    }).join('');
    shipTable.innerHTML='<div class="tbl-wrap"><table class="tbl"><thead><tr><th>#</th><th>Wilaya</th><th>Home delivery</th><th>Stop desk</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
  }

  // ---------- Track page: last order recap ----------
  var trackLast=$('#trackLast');
  if(trackLast){
    var o=store.get('kw-last-order');
    if(o) trackLast.innerHTML='<h3>Your last order</h3><p><b>'+o.ref+'</b> — '+o.items.reduce(function(s,c){return s+c.qty;},0)+' piece(s), '+money(o.total)+'<br>'
      +o.w+' — '+o.commune+' ('+(o.mode==='home'?'home delivery':'stop desk')+')<br>Status: <b class="ice-text">processing</b> — we call to confirm before shipping.</p>';
  }

  // ---------- Contact page: message form ----------
  var ctSend=$('#ctSend');
  if(ctSend) ctSend.addEventListener('click',function(){
    var msg=$('#ctMsg').value.trim();
    if(msg.length<5){ toast('Write us a few words first'); return; }
    $('#ctName').value=''; $('#ctPhone').value=''; $('#ctMsg').value='';
    toast('Message sent ✦ We\'ll get back to you');
  });

  // ---------- Checkout page — wilaya + commune + stop desk / home door ----------
  var coBox=$('#coContent');
  var shipInfo=store.get('kw-ship')||{};
  function coFormHTML(){
    return '<div class="co-grid"><form id="coForm" novalidate>'
    +'<h2 style="font-size:clamp(26px,3.5vw,40px)">Delivery <span class="ice-text">details</span></h2>'
    +'<div class="field"><label for="coName">Full name</label><input id="coName" autocomplete="name" /><span class="err" id="eName">Enter your full name</span></div>'
    +'<div class="field"><label for="coPhone">Phone</label><input id="coPhone" inputmode="tel" placeholder="05 XX XX XX XX" autocomplete="tel" /><span class="err" id="ePhone">Enter a valid mobile number (05 / 06 / 07)</span></div>'
    +'<div class="f2">'
    +'<div class="field"><label for="coW">Wilaya</label><select id="coW"></select><span class="err" id="eW">Select your wilaya</span></div>'
    +'<div class="field"><label for="coCom">Commune (baladiya)</label><select id="coCom" disabled><option value="">Select wilaya first</option></select><span class="err" id="eCom">Select your commune</span></div>'
    +'</div>'
    +'<div class="field"><label>Delivery mode</label><div class="modes">'
    +'<label class="mode" id="mDesk"><input type="radio" name="comode" value="desk" /><span class="mt">Stop desk <span class="mp" id="mDeskP">—</span></span><span class="md">Pick up at the nearest Yalidine agency</span></label>'
    +'<label class="mode" id="mHome"><input type="radio" name="comode" value="home" /><span class="mt">Home door <span class="mp" id="mHomeP">—</span></span><span class="md">Courier calls you and delivers to your door</span></label>'
    +'</div><span class="err" id="eGlobal"></span></div>'
    +'<div class="field" id="fAddr"><label for="coAddr">Address</label><textarea id="coAddr" placeholder="Street, building, landmarks…"></textarea><span class="err" id="eAddr">Enter your delivery address</span></div>'
    +'<div class="field"><label for="coNotes">Notes (optional)</label><input id="coNotes" placeholder="Anything the courier should know" /></div>'
    +'<button class="btn btn-ice btn-block" id="coPlace" type="submit">Place order — Cash on delivery</button>'
    +'</form>'
    +'<aside class="sum"><h3>Your order</h3><div class="items" id="coItems"></div><div class="sline"></div>'
    +'<div class="srow"><span>Subtotal</span><b id="coSub">0 DA</b></div>'
    +'<div class="srow"><span>Shipping — Yalidine</span><b id="coShip">—</b></div>'
    +'<div class="sline"></div><div class="stot"><span>Total (COD)</span><b id="coTotal">0 DA</b></div>'
    +'<p class="conote">Cash on delivery — check your piece, then pay. Packed within 24h in Ras El Oued, shipped with Yalidine Express (Guepex).</p>'
    +'</aside></div>';
  }
  function coMode(){ var r=document.querySelector('input[name="comode"]:checked'); return r?r.value:'desk'; }
  function buildWilayas(){
    var sel=$('#coW'), keys=Object.keys(DZ).sort();
    sel.innerHTML='<option value="">Select wilaya…</option>'+keys.map(function(k){ return '<option value="'+k+'">'+k+' — '+DZ[k].n+'</option>'; }).join('');
  }
  function buildCommunes(k,keep){
    var sel=$('#coCom');
    if(!k||!DZ[k]){ sel.innerHTML='<option value="">Select wilaya first</option>'; sel.disabled=true; return; }
    sel.disabled=false;
    sel.innerHTML='<option value="">Select commune…</option>'+DZ[k].c.map(function(c){ return '<option>'+c+'</option>'; }).join('');
    if(keep) sel.value=keep;
  }
  function setMode(m){
    var r=document.querySelector('input[name="comode"][value="'+m+'"]');
    if(r && !r.closest('.mode').classList.contains('dis')) r.checked=true;
  }
  function refreshCo(){
    var k=$('#coW').value, s=k?SHIPPING[k]:undefined;
    $('#coItems').innerHTML=cart.map(function(c){
      return '<div class="it"><div class="sw" style="background:linear-gradient(140deg,'+c.g1+','+c.g2+')"></div>'
      +'<div class="in">'+c.name+'<span>'+c.size+' × '+c.qty+'</span></div><div class="ip">'+money(c.price*c.qty)+'</div></div>';
    }).join('');
    var sub=cart.reduce(function(t,c){return t+c.price*c.qty;},0);
    $('#coSub').textContent=money(sub);
    var deskOk=!!(s&&s[1]!=null), homeOk=!!(s&&s[0]!=null);
    $('#mDesk').classList.toggle('dis', !!k && !deskOk);
    $('#mHome').classList.toggle('dis', !!k && !homeOk);
    $('#mDeskP').textContent=deskOk?money(s[1]):'—';
    $('#mHomeP').textContent=homeOk?money(s[0]):'—';
    var glob=$('#eGlobal');
    if(k && !s){ glob.textContent='Sorry — Yalidine can\'t deliver to '+DZ[k].n+' yet. DM us and we\'ll find a way.'; glob.classList.add('show'); $('#coPlace').disabled=true; }
    else { glob.classList.remove('show'); $('#coPlace').disabled=false; }
    var m=coMode();
    if(m==='desk'&&k&&!deskOk&&homeOk){ setMode('home'); m='home'; }
    if(m==='home'&&k&&!homeOk&&deskOk){ setMode('desk'); m='desk'; }
    document.querySelectorAll('.mode').forEach(function(md){ md.classList.toggle('sel', md.querySelector('input').checked); });
    $('#fAddr').style.display = m==='home' ? '' : 'none';
    var shipV = s ? (m==='home'?s[0]:s[1]) : null;
    $('#coShip').textContent = (k&&shipV!=null)?money(shipV):'—';
    $('#coTotal').textContent = money(sub+(shipV||0));
    if(ANIM) anime({targets:'#coTotal', scale:[1.12,1], duration:300, easing:'easeOutQuad'});
  }
  function coSubmit(e){
    e.preventDefault();
    document.querySelectorAll('#coForm .err').forEach(function(x){ if(x.id!=='eGlobal') x.classList.remove('show'); });
    var ok=true;
    var name=$('#coName').value.trim();
    var phone=$('#coPhone').value.replace(/[\s.\-]/g,'');
    var k=$('#coW').value, commune=$('#coCom').value, m=coMode(), addr=$('#coAddr').value.trim();
    if(name.length<3){ $('#eName').classList.add('show'); ok=false; }
    if(!/^0[567]\d{8}$/.test(phone)){ $('#ePhone').classList.add('show'); ok=false; }
    if(!k||!SHIPPING[k]){ $('#eW').classList.add('show'); ok=false; }
    if(k&&!commune){ $('#eCom').classList.add('show'); ok=false; }
    if(m==='home'&&addr.length<6){ $('#eAddr').classList.add('show'); ok=false; }
    if(!ok){
      if(ANIM) anime({targets:'#coForm', translateX:[{value:-8,duration:70},{value:8,duration:70},{value:-5,duration:60},{value:0,duration:80}], easing:'easeInOutSine'});
      return;
    }
    shipInfo={name:name,phone:phone,w:k,c:commune,mode:m,addr:addr};
    store.set('kw-ship',shipInfo);
    var sub=cart.reduce(function(t,c){return t+c.price*c.qty;},0);
    var s=SHIPPING[k], shipV=m==='home'?s[0]:s[1];
    var ref='KW-'+Date.now().toString(36).toUpperCase().slice(-6);
    store.set('kw-last-order',{ref:ref,items:cart,sub:sub,ship:shipV,total:sub+shipV,w:DZ[k].n,commune:commune,mode:m,ts:Date.now()});
    cart=[]; renderCart();
    coBox.innerHTML='<div class="ok-wrap">'
    +'<svg viewBox="0 0 52 52" fill="none" stroke="currentColor" stroke-width="2.5"><circle class="okc" cx="26" cy="26" r="23"/><path class="okp" d="M15 27l7 7 15-16"/></svg>'
    +'<h2>Order <span class="ice-text">placed</span></h2>'
    +'<p style="margin:0 auto">Keep your phone close — we call <b>'+phone+'</b> to confirm before shipping.</p>'
    +'<div class="ok-ref">'+ref+'</div>'
    +'<p style="margin:14px auto 22px">'+DZ[k].n+' — '+commune+' ('+(m==='home'?'home delivery':'stop desk')+') · Total <b>'+money(sub+shipV)+'</b> cash on delivery.</p>'
    +'<a class="btn btn-ice" href="index.html">Back to the wave</a></div>';
    if(ANIM){
      document.querySelectorAll('#coContent .okc,#coContent .okp').forEach(function(p){
        anime({targets:p, strokeDashoffset:[anime.setDashoffset,0], duration:700, delay:p.classList.contains('okp')?450:0, easing:'easeInOutQuad'});
      });
      anime({targets:'.ok-wrap', translateY:[20,0], opacity:[0,1], duration:500, easing:'easeOutCubic'});
    }
    toast('Order placed ✦ Shukran, ride the wave');
  }
  if(coBox){
    if(!cart.length){
      coBox.innerHTML='<div class="ok-wrap"><h2>Your bag is <span class="ice-text">empty</span></h2>'
      +'<p style="margin:0 auto 22px">Catch the wave first — add a piece or two, then come back to check out.</p>'
      +'<a class="btn btn-ice" href="shop.html">Shop the drop</a></div>';
    } else if(!HAS_DZ){
      coBox.innerHTML='<div class="ok-wrap"><h2>Checkout <span class="ice-text">unavailable</span></h2>'
      +'<p style="margin:0 auto 22px">The wilaya list failed to load. Refresh the page, or DM <b>@koldwave.dz</b> to order directly.</p>'
      +'<a class="btn btn-ice" href="shop.html">Back to the shop</a></div>';
    } else {
      coBox.innerHTML=coFormHTML();
      buildWilayas();
      if(shipInfo.name) $('#coName').value=shipInfo.name;
      if(shipInfo.phone) $('#coPhone').value=shipInfo.phone;
      if(shipInfo.w && DZ[shipInfo.w]){ $('#coW').value=shipInfo.w; buildCommunes(shipInfo.w, shipInfo.c); }
      if(shipInfo.addr) $('#coAddr').value=shipInfo.addr;
      setMode(shipInfo.mode||'desk');
      $('#coW').addEventListener('change',function(){ buildCommunes(this.value); refreshCo(); });
      $('#coCom').addEventListener('change',refreshCo);
      document.querySelectorAll('input[name="comode"]').forEach(function(r){ r.addEventListener('change',refreshCo); });
      $('#coForm').addEventListener('submit',coSubmit);
      refreshCo();
      if(ANIM) anime({targets:coBox, translateY:[26,0], opacity:[0,1], duration:450, easing:'easeOutCubic'});
      setTimeout(function(){ var n=$('#coName'); if(n) n.focus(); },120);
    }
  }

  // ---------- Scroll engine: progress bar, header state, hero parallax, back to top ----------
  var totop=$('#totop'), progressEl=$('#progress'), headerEl=document.querySelector('.header');
  var heroEl=document.querySelector('.hero');
  var parEls=[].slice.call(document.querySelectorAll('.hero-visual .pw'));
  var ticking=false;
  function onScroll(){
    if(ticking) return; ticking=true;
    requestAnimationFrame(function(){
      ticking=false;
      var sy=window.scrollY||window.pageYOffset||0;
      if(totop) totop.classList.toggle('show', sy>700);
      if(headerEl) headerEl.classList.toggle('scrolled', sy>24);
      if(progressEl){
        var max=document.documentElement.scrollHeight-window.innerHeight;
        progressEl.style.transform='scaleX('+(max>0?Math.min(sy/max,1):0)+')';
      }
      if(ANIM && heroEl && sy<heroEl.offsetHeight+160){
        parEls.forEach(function(el){ el.style.setProperty('--par',(sy*parseFloat(el.dataset.par||0)).toFixed(1)+'px'); });
      }
    });
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll,{passive:true});
  onScroll();
  if(totop) totop.addEventListener('click',function(){ window.scrollTo({top:0,behavior:REDUCED?'auto':'smooth'}); });
})();
