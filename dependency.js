const STORE_KEY='dependency_field_v2';
const state=JSON.parse(localStorage.getItem(STORE_KEY)||'null')||{
  goal:'',
  targetState:'',
  items:[],
  selectedId:null,
  analysedAt:null
};
let view='raw';

const $=id=>document.getElementById(id);
const el={
  goalInput:$('goalInput'),
  targetStateInput:$('targetStateInput'),
  translateBtn:$('translateBtn'),
  setGoalBtn:$('setGoalBtn'),
  exampleBtn:$('exampleBtn'),
  resetBtn:$('resetBtn'),
  itemLabel:$('itemLabel'),
  itemKind:$('itemKind'),
  itemParent:$('itemParent'),
  itemBasis:$('itemBasis'),
  itemOwner:$('itemOwner'),
  itemCounterfactual:$('itemCounterfactual'),
  addItemBtn:$('addItemBtn'),
  diagnosticQuestions:$('diagnosticQuestions'),
  goalTitle:$('goalTitle'),
  goalSummary:$('goalSummary'),
  metrics:$('metrics'),
  analyseBtn:$('analyseBtn'),
  exportBtn:$('exportBtn'),
  importInput:$('importInput'),
  inspector:$('inspector'),
  rawViewBtn:$('rawViewBtn'),
  realViewBtn:$('realViewBtn'),
  map:$('depMap'),
  mapEmpty:$('mapEmpty'),
  ledger:$('ledger'),
  readingResults:$('readingResults')
};

const tests=[
  ['Target-state test','If the target state were already true, which items would have had to become true somewhere along the way?'],
  ['Counterfactual test','Could the target state still occur if this item never happened? If yes, it is not a strict dependency.'],
  ['Pathway test','Is this a necessary truth-condition, or merely one way of satisfying a necessary condition?'],
  ['Authority test','Who says this is required, and are they naming a real dependency or a preferred route?'],
  ['Substitution test','Could a different mechanism, actor or sequence satisfy the same requirement?'],
  ['Assumption test','Has a conventional step been promoted into an unquestioned dependency?']
];

function save(){
  localStorage.setItem(STORE_KEY,JSON.stringify(state));
}

function esc(value){
  return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

function uid(){
  return crypto.randomUUID?.() || ('df_'+Math.random().toString(36).slice(2,10));
}

function suggestTargetState(text){
  const t=(text||'').trim();
  if(!t) return '';
  const lower=t.toLowerCase();
  if(/^get a job/.test(lower)) return 'I have been hired into acceptable paid work.';
  if(/^get (an? )?(.+)/.test(lower)){
    const item=t.replace(/^get\s+/i,'').replace(/[.?!]$/,'');
    return `I have ${item.charAt(0).toLowerCase()+item.slice(1)}.`;
  }
  if(/^find (.+)/i.test(lower)){
    const item=t.replace(/^find\s+/i,'').replace(/[.?!]$/,'');
    return `I have secured ${item.charAt(0).toLowerCase()+item.slice(1)}.`;
  }
  if(/^become (.+)/i.test(lower)){
    return `I am ${t.replace(/^become\s+/i,'').replace(/[.?!]$/,'')}.`;
  }
  if(/^launch (.+)/i.test(lower)){
    const item=t.replace(/^launch\s+/i,'').replace(/[.?!]$/,'');
    return `${item.charAt(0).toUpperCase()+item.slice(1)} is live and operating.`;
  }
  if(/^get (.+) approved/i.test(lower) || /approved/.test(lower)){
    const item=t.replace(/^get\s+/i,'').replace(/[.?!]$/,'');
    return `${item.charAt(0).toUpperCase()+item.slice(1)} is approved and able to proceed.`;
  }
  return `The desired outcome is true: ${t.replace(/[.?!]$/,'')}.`;
}

function setOutcome(){
  const goal=el.goalInput.value.trim();
  const target=el.targetStateInput.value.trim();
  if(!goal || !target){
    alert('Set both the ordinary-language outcome and the target state.');
    return;
  }
  state.goal=goal;
  state.targetState=target;
  if(!state.selectedId && state.items.length) state.selectedId=state.items[0].id;
  save();
  render();
}

function itemParentLabel(id){
  if(id==='target') return state.targetState || 'Target state';
  return state.items.find(x=>x.id===id)?.label || 'Target state';
}

function updateParentOptions(){
  const current=el.itemParent.value;
  el.itemParent.innerHTML=`<option value="target">Target state · ${esc((state.targetState||'set target state first').slice(0,64))}</option>`+
    state.items.map(x=>`<option value="${x.id}">${esc(x.label)}</option>`).join('');
  if([...el.itemParent.options].some(o=>o.value===current)) el.itemParent.value=current;
}

function addItem(){
  if(!state.targetState){
    alert('Set the target state first.');
    return;
  }
  const label=el.itemLabel.value.trim();
  if(!label){
    alert('Add a candidate item first.');
    return;
  }
  const item={
    id:uid(),
    label,
    kind:el.itemKind.value,
    parentId:el.itemParent.value || 'target',
    basis:el.itemBasis.value.trim(),
    owner:el.itemOwner.value.trim(),
    counterfactual:el.itemCounterfactual.value,
    notes:'',
    reading:null
  };
  state.items.push(item);
  state.selectedId=item.id;
  state.analysedAt=null;
  el.itemLabel.value='';
  el.itemBasis.value='';
  el.itemOwner.value='';
  el.itemCounterfactual.value='unknown';
  save();
  render();
}

function computeReading(item){
  if(item.counterfactual==='no'){
    return {
      bucket:'required',
      title:'Real dependency',
      reason:'Without this state, the target state cannot become true. Treat it as a required state, even if the pathway to satisfy it may vary.'
    };
  }
  if(item.counterfactual==='yes'){
    if(item.kind==='pathway'){
      return {
        bucket:'pathway',
        title:'Pathway',
        reason:'This may be a useful route, but the target state could still occur without it. Keep it as one path, not as a necessary dependency.'
      };
    }
    return {
      bucket:'assumption',
      title:'False dependency / assumption',
      reason:'This is currently being treated as required, but the target state could still occur without it. Challenge, reframe or remove it from the strict dependency chain.'
    };
  }
  if(item.counterfactual==='partial'){
    return {
      bucket:'unresolved',
      title:'Conditionally relevant',
      reason:'This matters for some pathways or versions of the target state, but not all. Narrow the target state or clarify which version matters.'
    };
  }
  if(item.kind==='pathway'){
    return {
      bucket:'pathway',
      title:'Possible pathway',
      reason:'This is currently framed as a route to the outcome rather than a truth-condition. Confirm through the counterfactual test.'
    };
  }
  return {
    bucket:'unresolved',
    title:'Inspect further',
    reason:'Not enough information yet to distinguish a true dependency from an assumption, habit or pathway.'
  };
}

function analyse(){
  state.items.forEach(item=>{item.reading=computeReading(item);});
  state.analysedAt=new Date().toISOString();
  view='real';
  save();
  render();
}

function currentBucket(item){
  if(view==='real' && item.reading) return item.reading.bucket;
  switch(item.kind){
    case 'required': return 'required';
    case 'pathway': return 'pathway';
    case 'assumption': return 'assumption';
    default: return 'unresolved';
  }
}

function renderMetrics(){
  const readings=state.items.map(i=>i.reading||computeReading(i));
  const required=readings.filter(r=>r.bucket==='required').length;
  const pathways=readings.filter(r=>r.bucket==='pathway').length;
  const assumptions=readings.filter(r=>r.bucket==='assumption').length;
  const unresolved=readings.filter(r=>r.bucket==='unresolved').length;
  el.metrics.innerHTML=[
    [state.items.length,'items in field'],
    [required,'required states'],
    [pathways,'pathways'],
    [assumptions,'assumptions to challenge'],
    [unresolved,'inspect further'],
    [state.analysedAt?'yes':'no','converted']
  ].map(([v,label])=>`<div class="metric"><b>${esc(v)}</b><span>${esc(label)}</span></div>`).join('');
}

function renderLedger(){
  if(!state.items.length){
    el.ledger.innerHTML='<p class="muted">No items mapped yet.</p>';
    return;
  }
  el.ledger.innerHTML=state.items.map(item=>{
    const reading=item.reading || computeReading(item);
    return `<article class="ledger-item ${state.selectedId===item.id?'selected':''}" data-select="${item.id}">
      <div class="ledger-top">
        <div class="ledger-title">${esc(item.label)}</div>
        <button class="small-btn" data-remove="${item.id}" type="button" aria-label="Remove item">×</button>
      </div>
      <div class="badge-row">
        <span class="badge ${esc(item.kind==='blocker'?'unresolved':item.kind)}">${esc(item.kind)}</span>
        <span class="badge ${esc(reading.bucket)}">${esc(reading.bucket)}</span>
        ${item.owner?`<span class="badge">${esc(item.owner)}</span>`:''}
      </div>
    </article>`;
  }).join('');
}

function renderReading(){
  if(!state.items.length){
    el.readingResults.innerHTML='<p class="muted">No items mapped yet.</p>';
    return;
  }
  if(!state.analysedAt){
    el.readingResults.innerHTML='<p class="muted">Convert the field after mapping the first chain.</p>';
    return;
  }
  el.readingResults.innerHTML=state.items.map(item=>{
    const reading=item.reading || computeReading(item);
    return `<article class="reading-card">
      <div class="reading-label ${esc(reading.bucket)}">${esc(reading.title)}</div>
      <div class="reading-title">${esc(item.label)}</div>
      <p>${esc(reading.reason)}</p>
    </article>`;
  }).join('');
}

function inspectorSelect(name,label,options,current){
  return `<div class="section"><h3>${esc(label)}</h3><select data-edit="${esc(name)}">${options.map(([value,text])=>`<option value="${esc(value)}" ${value===current?'selected':''}>${esc(text)}</option>`).join('')}</select></div>`;
}

function renderInspector(){
  const item=state.items.find(x=>x.id===state.selectedId);
  if(!item){
    el.inspector.innerHTML='<div class="eyebrow">Inspector</div><h2>Select a candidate</h2><p class="muted">Click a node or ledger item.</p>';
    return;
  }
  const reading=item.reading || computeReading(item);
  el.inspector.innerHTML=`
    <div class="eyebrow">Inspector</div>
    <h2>${esc(item.label)}</h2>
    <div class="badge-row">
      <span class="badge ${esc(item.kind==='blocker'?'unresolved':item.kind)}">${esc(item.kind)}</span>
      <span class="badge ${esc(reading.bucket)}">${esc(reading.bucket)}</span>
    </div>
    <div class="section"><h3>Directly enables</h3><p>${esc(itemParentLabel(item.parentId))}</p></div>
    <div class="section"><h3>Why it was included</h3><p>${esc(item.basis || 'No basis recorded yet.')}</p></div>
    <div class="section"><h3>Owner / role</h3><input data-edit="owner" value="${esc(item.owner)}" placeholder="Owner / role" /></div>
    ${inspectorSelect('kind','Current treatment',[
      ['required','Required state'],
      ['pathway','Pathway'],
      ['assumption','Assumption / inherited step'],
      ['blocker','Blocker / condition']
    ],item.kind)}
    ${inspectorSelect('counterfactual','Counterfactual test',[
      ['unknown','Not sure yet'],
      ['no','No · the target state cannot occur'],
      ['yes','Yes · the target state could still occur'],
      ['partial','Partly · some forms could still occur']
    ],item.counterfactual)}
    <div class="section"><h3>Notes</h3><textarea data-edit="notes" rows="4" placeholder="Optional notes">${esc(item.notes||'')}</textarea></div>
    <div class="section"><h3>Structural reading</h3><p><strong>${esc(reading.title)}</strong></p><p>${esc(reading.reason)}</p></div>
  `;
  el.inspector.querySelectorAll('[data-edit]').forEach(node=>{
    node.addEventListener('change',()=>{
      item[node.dataset.edit]=node.value;
      item.reading=null;
      state.analysedAt=null;
      save();
      render();
    });
  });
}

function renderQuestions(){
  el.diagnosticQuestions.innerHTML=tests.map(([title,text])=>`<div class="question-card"><b>${esc(title)}</b><span>${esc(text)}</span></div>`).join('');
}

function depthFor(item,map,memo=new Map(),trail=new Set()){
  if(memo.has(item.id)) return memo.get(item.id);
  if(trail.has(item.id)) return 1;
  const parent=item.parentId==='target'?null:map.get(item.parentId);
  if(!parent) return 1;
  const nextTrail=new Set(trail); nextTrail.add(item.id);
  const depth=1+depthFor(parent,map,memo,nextTrail);
  memo.set(item.id,Math.min(depth,7));
  return memo.get(item.id);
}

function renderMap(){
  el.map.innerHTML='';
  el.mapEmpty.style.display=state.targetState ? 'none' : 'grid';
  if(!state.targetState) return;
  const visibleItems=state.items;
  const byId=new Map(visibleItems.map(item=>[item.id,item]));
  const levels=new Map();
  visibleItems.forEach(item=>{
    const level=depthFor(item,byId);
    if(!levels.has(level)) levels.set(level,[]);
    levels.get(level).push(item);
  });
  const position=new Map([['target',{x:600,y:95}]]);
  const maxLevel=Math.max(1,...levels.keys());
  for(const [level,items] of levels.entries()){
    const y=120 + (level/(maxLevel+1))*500;
    const width=Math.min(1020,Math.max(340,items.length*220));
    const left=600-width/2;
    items.forEach((item,index)=>{
      position.set(item.id,{
        x:items.length===1 ? 600 : left + (index/(items.length-1))*width,
        y
      });
    });
  }

  const ns='http://www.w3.org/2000/svg';
  const make=(tag,attrs={})=>{
    const node=document.createElementNS(ns,tag);
    Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,v));
    return node;
  };

  visibleItems.forEach(item=>{
    const from=position.get(item.id);
    const to=position.get(item.parentId==='target'?'target':item.parentId);
    if(!from || !to) return;
    const bucket=currentBucket(item);
    el.map.appendChild(make('line',{
      x1:from.x,
      y1:from.y-40,
      x2:to.x,
      y2:to.y+42,
      class:`edge-line ${bucket}`
    }));
  });

  drawNode('target',state.targetState,'TARGET STATE','goal',position.get('target'));
  visibleItems.forEach(item=>{
    const bucket=currentBucket(item);
    drawNode(item.id,item.label,item.kind,bucket,position.get(item.id),item.reading?.title);
  });
}

function drawNode(id,label,subline,bucket,point,readingTitle=''){
  const ns='http://www.w3.org/2000/svg';
  const g=document.createElementNS(ns,'g');
  g.setAttribute('class',`node-group ${state.selectedId===id?'selected':''}`);
  const shapeClass=id==='target' ? 'goal-shape node-shape' : `${bucket}-shape node-shape`;

  if(id==='target'){
    const circle=document.createElementNS(ns,'circle');
    circle.setAttribute('cx',point.x);
    circle.setAttribute('cy',point.y);
    circle.setAttribute('r',68);
    circle.setAttribute('class',shapeClass);
    g.appendChild(circle);
  } else if(bucket==='required'){
    const rect=document.createElementNS(ns,'rect');
    rect.setAttribute('x',point.x-74);
    rect.setAttribute('y',point.y-40);
    rect.setAttribute('width',148);
    rect.setAttribute('height',80);
    rect.setAttribute('rx',14);
    rect.setAttribute('class',shapeClass);
    g.appendChild(rect);
  } else if(bucket==='pathway'){
    const diamond=document.createElementNS(ns,'polygon');
    diamond.setAttribute('points',`${point.x},${point.y-52} ${point.x+72},${point.y} ${point.x},${point.y+52} ${point.x-72},${point.y}`);
    diamond.setAttribute('class',shapeClass);
    g.appendChild(diamond);
  } else if(bucket==='assumption'){
    const tri=document.createElementNS(ns,'polygon');
    tri.setAttribute('points',`${point.x},${point.y-58} ${point.x+72},${point.y+52} ${point.x-72},${point.y+52}`);
    tri.setAttribute('class',shapeClass);
    g.appendChild(tri);
  } else {
    const ellipse=document.createElementNS(ns,'ellipse');
    ellipse.setAttribute('cx',point.x);
    ellipse.setAttribute('cy',point.y);
    ellipse.setAttribute('rx',76);
    ellipse.setAttribute('ry',44);
    ellipse.setAttribute('class',shapeClass);
    g.appendChild(ellipse);
  }

  const text=document.createElementNS(ns,'text');
  text.setAttribute('x',point.x);
  text.setAttribute('y',point.y-4);
  text.setAttribute('class','node-label');
  text.textContent=truncate(label,30);
  g.appendChild(text);

  const sub=document.createElementNS(ns,'text');
  sub.setAttribute('x',point.x);
  sub.setAttribute('y',point.y+18);
  sub.setAttribute('class','node-sub');
  sub.textContent=id==='target' ? 'Truth-condition anchor' : truncate(view==='real' ? (readingTitle || subline) : subline,30);
  g.appendChild(sub);

  if(id!=='target'){
    g.addEventListener('click',()=>{
      state.selectedId=id;
      save();
      render();
    });
  }
  el.map.appendChild(g);
}

function truncate(text,n){
  return text.length>n ? text.slice(0,n-1)+'…' : text;
}

function render(){
  el.goalInput.value=state.goal;
  el.targetStateInput.value=state.targetState;
  el.goalTitle.textContent=state.targetState || 'No target state set';
  el.goalSummary.textContent=state.goal || 'Nothing set yet.';
  updateParentOptions();
  renderMetrics();
  renderLedger();
  renderInspector();
  renderQuestions();
  renderReading();
  renderMap();
  el.rawViewBtn.classList.toggle('active',view==='raw');
  el.realViewBtn.classList.toggle('active',view==='real');
  el.realViewBtn.disabled=!state.analysedAt;
  save();
}

function loadExample(){
  state.goal='Get a job';
  state.targetState='I have been hired into acceptable paid work.';
  state.items=[];
  const add=(label,kind,parentId,basis,owner,counterfactual)=>{
    state.items.push({
      id:uid(),label,kind,parentId,basis,owner,counterfactual,notes:'',reading:null
    });
    return state.items[state.items.length-1];
  };
  const available=add('Some employer or client has suitable work available.','required','target','Without work to be offered, hiring cannot occur.','Employer market','no');
  const known=add('A decision-maker knows enough about me to consider engaging me.','required','target','A hiring decision cannot occur without sufficient information or visibility.','Employer / client','no');
  add('Acceptable terms exist and I can commence.','required','target','Hiring is incomplete without workable terms and practical commencement.','Employer + me','no');
  add('Submit an application to an advertised role.','pathway',known.id,'This is one route by which a decision-maker may learn enough to consider me.','Me','yes');
  add('A referral reaches a hiring manager.','pathway',known.id,'A referral is another route to visibility.','Network','yes');
  add('A recruiter introduces me.','pathway',known.id,'A recruiter may satisfy the visibility condition differently.','Recruiter','yes');
  add('A previous employer offers me work directly.','pathway',known.id,'Direct offers can bypass formal application steps.','Employer','yes');
  add('Apply through a job portal because that is how people normally do it.','assumption',known.id,'This is often treated as mandatory even where other routes exist.','Habit','yes');
  add('Update résumé so I can communicate fit clearly.','pathway',known.id,'A résumé is one information-carrying mechanism, not the dependency itself.','Me','yes');
  state.selectedId=available.id;
  state.analysedAt=null;
  view='raw';
  save();
  render();
}

function exportMap(){
  const payload={schema:'dependency-field/v2',exportedAt:new Date().toISOString(),...state};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download=`dependency-field-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

async function importMap(file){
  try{
    const data=JSON.parse(await file.text());
    if(typeof data.goal!=='string' || typeof data.targetState!=='string' || !Array.isArray(data.items)) throw new Error('bad');
    state.goal=data.goal;
    state.targetState=data.targetState;
    state.items=data.items;
    state.selectedId=null;
    state.analysedAt=data.analysedAt||null;
    view='raw';
    save();
    render();
  }catch(err){
    alert('Could not import this dependency map.');
  }
}

el.translateBtn.addEventListener('click',()=>{
  el.targetStateInput.value=suggestTargetState(el.goalInput.value);
});
el.setGoalBtn.addEventListener('click',setOutcome);
el.addItemBtn.addEventListener('click',addItem);
el.analyseBtn.addEventListener('click',analyse);
el.exampleBtn.addEventListener('click',loadExample);
el.resetBtn.addEventListener('click',()=>{
  if(confirm('Reset this Dependency Field?')){
    localStorage.removeItem(STORE_KEY);
    state.goal='';
    state.targetState='';
    state.items=[];
    state.selectedId=null;
    state.analysedAt=null;
    view='raw';
    render();
  }
});
el.exportBtn.addEventListener('click',exportMap);
el.importInput.addEventListener('change',e=>{
  if(e.target.files?.[0]) importMap(e.target.files[0]);
  e.target.value='';
});
el.rawViewBtn.addEventListener('click',()=>{view='raw';render();});
el.realViewBtn.addEventListener('click',()=>{if(state.analysedAt){view='real';render();}});
el.ledger.addEventListener('click',e=>{
  const remove=e.target.closest('[data-remove]');
  if(remove){
    const id=remove.dataset.remove;
    const removed=state.items.find(x=>x.id===id);
    state.items=state.items.filter(x=>x.id!==id);
    state.items.forEach(x=>{if(x.parentId===id) x.parentId=removed?.parentId||'target';});
    if(state.selectedId===id) state.selectedId=null;
    state.analysedAt=null;
    save();
    render();
    return;
  }
  const select=e.target.closest('[data-select]');
  if(select){
    state.selectedId=select.dataset.select;
    save();
    render();
  }
});

render();
