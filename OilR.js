const users = [
  {role:'operator', username:'operator', password:'operator1'},
  {role:'manager', username:'manager', password:'manager1'},
  {role:'admin', username:'admin', password:'admin1'}
];

function login(){
  const role = document.getElementById('login-role').value;
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const errorDiv = document.getElementById('login-error');

  const user = users.find(u => u.role===role && u.username===username && u.password===password);
  if(user){
    document.getElementById('login-page').style.display='none';
    document.getElementById('main-content').style.display='block';
    updateRole(role);
    errorDiv.textContent='';
  } else {
    errorDiv.textContent='Invalid credentials. Please try again.';
  }
}

function logout(){
  document.getElementById('main-content').style.display='none';
  document.getElementById('login-page').style.display='flex';
  document.getElementById('login-username').value='';
  document.getElementById('login-password').value='';
  document.getElementById('login-role').value='';
  document.getElementById('login-error').textContent='';
}

function updateRole(role){
  const roleContent = document.querySelectorAll('.role-content');
  roleContent.forEach(sec=>sec.style.display=sec.dataset.role===role?'grid':'none');
}

let productionData = [12000,12500,12300,12600,12750,12400,12550];
let inventoryData = [200,500,2000];

const ctxProd = document.getElementById('productionChart').getContext('2d');
const productionChart = new Chart(ctxProd,{
  type:'line',
  data:{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],datasets:[{label:'Production (barrels/day)',data:productionData,backgroundColor:'rgba(0,36,68,0.2)',borderColor:'rgba(0,36,68,1)',borderWidth:2,tension:0.3}]},
  options:{animation:{duration:1000}}
});

const ctxInv = document.getElementById('inventoryChart').getContext('2d');
const inventoryChart = new Chart(ctxInv,{
  type:'bar',
  data:{labels:['Crude Oil','Chemicals','Finished Fuel'],datasets:[{label:'Inventory Level (units)',data:inventoryData,backgroundColor:['rgba(255,77,77,0.6)','rgba(255,204,0,0.6)','rgba(76,175,80,0.6)'],borderColor:['rgba(255,77,77,1)','rgba(255,204,0,1)','rgba(76,175,80,1)'],borderWidth:1}]},
  options:{animation:{duration:1000}}
});

function logAction(msg){
  const logEl = document.getElementById('audit-log');
  logEl.textContent += msg+'\n';
}

function updateEfficiencyBar(){
  const target = 13000;
  const current = parseInt(document.getElementById('production-value').textContent);
  let percent = Math.round((current/target)*100);
  percent = percent>100?100:percent;
  const bar = document.getElementById('efficiency-bar');
  bar.style.width = percent+'%';
  bar.textContent = percent+'%';
}

function updateStock(type){
  let stockEl, inputEl, index;
  if(type==='crude'){ stockEl=document.getElementById('stock-crude'); inputEl=document.getElementById('input-crude'); index=0; }
  else if(type==='chemicals'){ stockEl=document.getElementById('stock-chemicals'); inputEl=document.getElementById('input-chemicals'); index=1; }
  else if(type==='finished'){ stockEl=document.getElementById('stock-finished'); inputEl=document.getElementById('input-finished'); index=2; }

  const input = parseInt(inputEl.value);
  if(!isNaN(input)){
    let current = parseInt(stockEl.textContent);
    let newStock = current + input;
    stockEl.textContent = newStock;
    stockEl.className='stock '+(newStock<500?'low':newStock<1500?'medium':'high');
    inventoryData[index] = newStock;
    inventoryChart.update();
    logAction(`Operator updated ${type} stock to ${newStock}`);
    inputEl.value='';
  }
}

function updateProduction(){
  const input = parseInt(document.getElementById('production-input').value);
  if(!isNaN(input)){
    productionData[productionData.length-1] = input;
    document.getElementById('production-value').textContent = input;
    productionChart.update();
    logAction('Operator updated production to '+input);
    updateEfficiencyBar();
  }
}

let supplierOrders = [{id:'101', quantity:300},{id:'102', quantity:500},{id:'103', quantity:700}];
let orderHistory = [];

function renderOrders(){
  const ordersDiv = document.getElementById('supplier-orders');
  ordersDiv.innerHTML='';
  supplierOrders.forEach(order=>{
    const orderEl = document.createElement('p');
    orderEl.classList.add('fadeIn');
    orderEl.innerHTML = `Order #${order.id} - ${order.quantity} units <button onclick="approveOrder('${order.id}')">Approve</button>`;
    ordersDiv.appendChild(orderEl);
  });

  const historyDiv = document.getElementById('order-history');
  historyDiv.innerHTML='';
  orderHistory.forEach(o=>{
    const hEl = document.createElement('p');
    hEl.textContent = `Order #${o.id} - ${o.quantity} units (Approved)`;
    historyDiv.appendChild(hEl);
  });
}

function approveOrder(orderId){
  const index = supplierOrders.findIndex(o=>o.id===orderId);
  if(index!==-1){
    const order = supplierOrders[index];
    inventoryData[2] += order.quantity;
    document.getElementById('stock-finished').textContent = inventoryData[2];
    document.getElementById('stock-finished').className='stock '+(inventoryData[2]<500?'low':inventoryData[2]<1500?'medium':'high');
    inventoryChart.update();
    logAction(`Manager approved order ${orderId} (+${order.quantity} units)`);

    const orderEl = document.querySelector(`#supplier-orders p:nth-child(${index+1})`);
    orderEl.classList.add('slideOut');
    setTimeout(()=>{
      orderHistory.push(order);
      supplierOrders.splice(index,1);
      renderOrders();
    },500);

    alert(`Order #${orderId} approved! Inventory updated.`);
  }
}

function addUser(){alert('User Added!'); logAction('Admin added a user');}
function deleteUser(){alert('User Deleted!'); logAction('Admin deleted a user');}
function downloadReport(){ alert('Report downloaded!'); logAction('Report downloaded');}

updateEfficiencyBar();
renderOrders();
