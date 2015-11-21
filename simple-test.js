//var s = 't' + '\\' + 'n';
var s = 't\n';
console.log("-------------");
console.log('unreplaced:', s);
console.log('char 0:', s.charCodeAt(0));
console.log('char 1:',s.charCodeAt(1));
console.log('char 2:',s.charCodeAt(2));
console.log("-------------");

var replaced = s.replace('\n', '\\n');
var replaced = s.replace('\u000A', '<br>');
//var replaced = s.replace('\\' + 'n', 'l');
//var replaced = s.replace('\n', 'l');
//var replaced = s.replace(/[\n]/, 'l');
//var replaced = s.replace(String.fromCharCode(10), 'l');
console.log("-------------");
console.log('replaced:', replaced);
console.log('char 0:', replaced.charCodeAt(0));
console.log('char 1:',replaced.charCodeAt(1));
console.log('char 2:',replaced.charCodeAt(2));
console.log("-------------");


