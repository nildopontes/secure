function addToBody(...node){
   for(var i = 0; i < node.length; i++){
      document.body.appendChild(node[i]);
   }
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
   if(!verified){
      showLogin();
   }else{
      getData('index');
      showIndex();
   }
});
