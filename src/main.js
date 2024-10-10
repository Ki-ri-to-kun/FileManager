
// 1. Hello
const args = process.argv.slice(2);
let userName = 'anonymous';

if(args){
  userName = args.filter(item => item.startsWith('--username'))[0]?.split('=')[1] || 'anonymous';
}
const capitalizedName = userName[0].toUpperCase() + userName.slice(1);

console.log(`Welcome to the File Manager, ${capitalizedName}!`);
printWorkingDir();


// 2. Bye
const byeUser = () => {
  console.log(`Thank you for using File Manager, ${capitalizedName}, goodbye!`);
  process.exit();
};

  process.stdin.on('data', data => data.toString() === '.exit\r\n' && byeUser());
  process.on('SIGINT', byeUser);

// 3. Working directory
function printWorkingDir(){
  console.log('You are currently in ' + import.meta.dirname);
};

















