window.addEventListener('DOMContentLoaded', (event) => {
   if(!localStorage.getItem('pass')){
      showLogin();
   }else{
      showData();
   }
});
function modifyData(){
   if($('data').value.length == 0) return;
   const xhr = new XMLHttpRequest();
   xhr.open('POST', 'update.php', true);
   xhr.setRequestHeader('Counter', `var mainCounter=${mainCounter+1};`);
   xhr.onreadystatechange = () => {
      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
         var response = JSON.parse(xhr.responseText);
         if(response.status != 0){
            alert(`Erro: status(${response.status})`);
         }else{
            alert(`Alteração salva: ${response.size_file} bytes escritos.`);
         }
         location.reload();
      }
   };
   xhr.send(encrypt($('data').value));
}
function getLocalStorage(){
   var regs = localStorage.getItem('regs');
   if(regs === null){
      alert('LocalStorage vazio.');
   }else{
      $('data').value += regs;
   }
}
function showData(){
   var h2 = logo();
   var text = tag('textarea', 'data', null, 'code');
   var bt1 = tag('button', null, 'LocalStorage', 'bti on');
   var bt2 = tag('button', null, 'Salvar', 'bti on');
   bt1.setAttribute('onclick', 'getLocalStorage()');
   bt2.setAttribute('onclick', 'modifyData()');
   var div = tag('div', 'container');
   div.appendChild(h2);
   div.appendChild(text);
   div.appendChild(bt1);
   div.appendChild(bt2);
   addToBody(div);
   getData('insert');
}
function encrypt(text){
   var textBytes = aesjs.utils.utf8.toBytes(text);
   var aesCtr = new aesjs.ModeOfOperation.ctr(password, new aesjs.Counter(mainCounter));
   var encryptedBytes = aesCtr.encrypt(textBytes);
   return `${aesjs.utils.hex.fromBytes(encryptedBytes)}${('000000' + mainCounter).slice(-6)}`;
}
