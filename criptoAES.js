var password = [];
function $(id){
   return document.getElementById(id);
}
function expandPass(){
   return new Promise((resolve, reject) => {
      $('pass').value.split('').forEach(element => {
         password.push(element.charCodeAt(0));
      });
      const rawKey = new Uint8Array(password);
      window.crypto.subtle.importKey('raw', rawKey, 'AES-GCM', true, ['encrypt', 'decrypt']).then(key => {
         resolve(key);
      });
   });
}
function download(data, name){
   const file = new Blob([data], {type: "application/octet-stream"});
   const a = document.createElement('a');
   const url = URL.createObjectURL(file);
   a.href = url;
   a.download = name;
   document.body.appendChild(a);
   a.click();
   setTimeout(function(){
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
   },0);
}
function encrypt(key){
      let iv = window.crypto.getRandomValues(new Uint8Array(12));
      window.crypto.subtle.encrypt(
         {name: "AES-GCM", iv: iv},
         key,
         new TextEncoder().encode($('text').value)
      ).then(buffer => {
         var encryptedWIV = new Uint8Array(buffer.byteLength + iv.length);
         const encrypted = new Uint8Array(buffer);
         encryptedWIV.set(encrypted);
         encryptedWIV.set(iv, encrypted.length);
         download(encryptedWIV, $('fileName').value);
      }).catch(error => {
         alert('Senha ou nome de arquivo incompatível.');
      });
}
function $(id){
   return document.getElementById(id);
}
function decrypt(key){
   var reader = new FileReader();
   reader.readAsArrayBuffer(new Blob([$('file').files[0]]));
   reader.onload = function(){
      var arrayBuffer = reader.result;
      var encrypted = new Uint8Array(arrayBuffer);
      window.crypto.subtle.decrypt(
         {
            name: "AES-GCM",
            iv: encrypted.slice(encrypted.length - 12)
         },
         key,
         encrypted.slice(0, encrypted.length - 12)
      ).then(decrypted => {
         $('text').value = new TextDecoder().decode(decrypted);
      }).catch(error => {
         alert('Arquivo corrompido ou senha incorreta.');
      });
   }
}
