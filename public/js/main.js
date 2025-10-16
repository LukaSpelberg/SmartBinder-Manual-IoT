document.addEventListener('DOMContentLoaded', ()=>{
  const modal = document.getElementById('recent-modal');
  if(modal){
    const close = modal.querySelector('.close');
    close.addEventListener('click', ()=> modal.remove());
    // auto-hide after 8s
    setTimeout(()=>{ if(document.body.contains(modal)) modal.remove() },8000);
  }

  // simple toggle for showcase
  const showcaseToggle = document.getElementById('showcase-toggle');
  const timeSelect = document.getElementById('showcase-time');
  if(showcaseToggle){
    showcaseToggle.addEventListener('click', ()=>{
      showcaseToggle.classList.toggle('on');
      const on = showcaseToggle.classList.contains('on');
      showcaseToggle.setAttribute('aria-pressed', on);
      if(timeSelect) timeSelect.disabled = !on;
    });
  }

  // wire range inputs
  document.querySelectorAll('input[type=range]').forEach(r=>{
    // wrap to enable absolute value placement
    const wrap = document.createElement('div'); wrap.className='range-wrap';
    r.parentNode.insertBefore(wrap, r);
    wrap.appendChild(r);
    const val = document.createElement('div'); val.className='range-value'; val.textContent = r.value; wrap.appendChild(val);

    const update = ()=>{
      val.textContent = r.value;
      // position based on percentage
      const pct = (r.value - (parseFloat(r.min)||0)) / ((parseFloat(r.max)||100) - (parseFloat(r.min)||0));
      const trackWidth = r.clientWidth || 200;
      const x = pct * trackWidth;
      val.style.left = x + 'px';
    };
    r.addEventListener('input', update);
    window.addEventListener('resize', update);
    update();
  });

  // color pickers on lights
  document.querySelectorAll('.light-circle input[type=color]').forEach(inp=>{
    inp.addEventListener('input', (e)=>{
      const circ = inp.closest('.light-circle');
      circ.style.background = e.target.value;
    });
    // also allow clicking the circle to open the picker by forwarding click to the input
    const circle = inp.closest('.light-circle');
    if(circle){
      circle.addEventListener('click', ()=> inp.click());
    }
  });

  // initialize time select options if present
  if(timeSelect){
    timeSelect.innerHTML = '';
    const autoOpt = document.createElement('option'); autoOpt.value='auto'; autoOpt.textContent='Automatic'; timeSelect.appendChild(autoOpt);
    for(let h=1; h<=24; h++){
      const opt = document.createElement('option'); opt.value = String(h).padStart(2,'0')+':00'; opt.textContent = String(h).padStart(2,'0')+':00'; timeSelect.appendChild(opt);
    }
    // disabled unless showcase on
    if(showcaseToggle) timeSelect.disabled = !showcaseToggle.classList.contains('on');
  }

  // update filter image when selection changes (collection page)
  const filterSelect = document.getElementById('filter-select');
  const filterImg = document.getElementById('filter-img');
  if(filterSelect && filterImg){
    const updateImg = ()=>{
      const sel = filterSelect.selectedOptions[0];
      const src = sel.getAttribute('data-img');
      if(src) filterImg.src = src;
    };
    filterSelect.addEventListener('change', updateImg);
    updateImg();
  }

  // client-side filtering of card grid by energy
  const cardGrid = document.getElementById('card-grid');
  if(cardGrid && filterSelect){
    const cards = Array.from(cardGrid.querySelectorAll('.card'));
    const applyFilter = ()=>{
      const val = filterSelect.value || 'all';
      cards.forEach(card=>{
        const e = (card.getAttribute('data-energy')||'').toLowerCase();
        if(val === 'all' || e === val) card.style.display = '';
        else card.style.display = 'none';
      });
    };
    filterSelect.addEventListener('change', applyFilter);
    applyFilter();
  }

  // ensure time select visible on mobile when focused
  if(timeSelect){
    timeSelect.addEventListener('focus', ()=>{
      setTimeout(()=>{
        timeSelect.scrollIntoView({behavior:'smooth',block:'center'});
      },100);
    });
  }
});
