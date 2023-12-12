var  password = [];
var key;
function decrypt(encrypted){
   return new Promise((resolve, reject) => {
      window.crypto.subtle.decrypt(
         {
            name: "AES-GCM",
            iv: encrypted.slice(encrypted.length - 12)
         },
         key,
         encrypted.slice(0, encrypted.length - 12)
      ).then(decrypted => {
         resolve(new TextDecoder().decode(decrypted));
      }).catch(error => {
         reject(error);
      });
   });
}
function maskOfPass(){
   if($('pass').value.length == 32){
      $('send').removeAttribute('disabled');
      $('send').classList.remove('off');
      $('send').classList.add('on');
   }else{
      $('send').setAttribute('disabled', '');
      $('send').classList.remove('on');
      $('send').classList.add('off');
   }
}
function addToBody(...node){
   for(var i = 0; i < node.length; i++){
      document.body.appendChild(node[i]);
   }
}
function showLogin(){
   var div = tag('div', 'container');
   var h2 = tag('h1', null, '🔐');
   var input = tag('input', 'pass');
   input.setAttribute('oninput', 'maskOfPass()');
   input.setAttribute('type', 'password');
   input.setAttribute('minlength', '32');
   input.setAttribute('maxlength', '32');
   var bt = tag('button', 'send', 'Entrar', 'bt off');
   bt.setAttribute('onclick', 'login()');
   bt.setAttribute('disabled', '');
   div.appendChild(h2);
   div.appendChild(input);
   div.appendChild(bt);
   addToBody(div);
}
function $(id){
   return document.getElementById(id);
}
function login(){
   sessionStorage.setItem('pass', $('pass').value);
   window.location.reload(false);
}
// tagname, id, innerHTML, classes
function tag(...t){
   let n = document.createElement(t[0]);
   if(t.length >= 2 && t[1] != null){
      n.setAttribute('id', t[1]);
   }
   if(t.length >= 3 && t[2] != null){
      n.innerHTML = t[2];
   }
   if(t.length >= 4 && t[3] != null){
      n.setAttribute('class', t[3]);
   }
   return n;
}
function getFunctions(){
   return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'arraybuffer';
      xhr.open('GET', 'functions.js', true);
      xhr.onreadystatechange = function() {
         if(xhr.readyState == 4 && xhr.status == 200){
            decrypt(new Uint8Array(xhr.response)).then(decrypted => {
               resolve(decrypted);
            }).catch(error => {
               reject(error);
            });
         }
      }
      xhr.send();
   });
}
function getSessionStorage(){
   var regs = sessionStorage.getItem('regs');
   if(regs === null){
      alert('SessionStorage vazio.');
   }else{
      $('data').value += regs;
   }
}
function showData(){
   var h2 = logo();
   var text = tag('textarea', 'data', null, 'code');
   var bt1 = tag('button', null, 'SessionStorage', 'bti on');
   var bt2 = tag('button', null, 'Salvar', 'bti on');
   bt1.setAttribute('onclick', 'getSessionStorage()');
   bt2.onclick  = function(){
      newToken().then(token => {
         modifyData(new TextEncoder().encode($('data').value), token).then(output => {
            alert(output);
         });
      });
   }
   var div = tag('div', 'container');
   div.appendChild(h2);
   div.appendChild(text);
   div.appendChild(bt1);
   div.appendChild(bt2);
   addToBody(div);
}
function encrypt(encoded){
   return new Promise((resolve, reject) => {
      let iv = window.crypto.getRandomValues(new Uint8Array(12));
      window.crypto.subtle.encrypt(
         {name: "AES-GCM", iv: iv},
         key,
         encoded
      ).then(buffer => {
         var encryptedWIV = new Uint8Array(buffer.byteLength + iv.length);
         const encrypted = new Uint8Array(buffer);
         encryptedWIV.set(encrypted);
         encryptedWIV.set(iv, encrypted.length);
         resolve(encryptedWIV);
      }).catch(error => {
         reject(error);
      });
   });
}
function print(){
   let cssRuleList = [...document.styleSheets[0].cssRules].filter(rule => ['.code', 'input', '.on', '.bti'].includes(rule.selectorText));
   for(let cssRule of cssRuleList){
      cssRule.style.setProperty('display', 'none');
   }
}
function toCurrencyBRL(value){
   return new Intl.NumberFormat('pt-BR',
      {
         style: 'currency',
         currency: 'BRL'
      }).format(value);
}
window.addEventListener('DOMContentLoaded', (event) => {
   if(!sessionStorage.getItem('pass')){
      showLogin();
   }else{
      sessionStorage.getItem('pass').split('').forEach(element => {
         password.push(element.charCodeAt(0));
      });
      window.crypto.subtle.importKey('raw', new Uint8Array(password), 'AES-GCM', true, ['encrypt', 'decrypt']).then(pass => {
         key = pass;
         getFunctions().then(plain => {
            (0, eval)(plain);
            document.title = 'Bem vindo';
            newToken().then(token => {
               getData(token).then(plain => {
                  let script = window.location.pathname.split("/").pop();
                  if(script == 'index.html'){
                     (0, eval)(plain);
                     showIndex();
                  }
                  if(script == 'insert.html'){
                     showData();
                     $('data').value = plain;
                  }
                  if(script == 'form.html'){
                     fillBody();
                  }
               });
            });
         }).catch(() => {
            alert('Senha incorreta.');
            password = [];
            sessionStorage.removeItem('pass');
            window.location.reload(false);
         });
      });
   }
});