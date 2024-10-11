import os from 'os';

import {UP_OP, CD_OP} from './constants.js';

// 1. Hello
const args = process.argv.slice(2);
let userName = 'anonymous';

if(args){
  userName = args.filter(item => item.startsWith('--username'))[0]?.split('=')[1] || 'anonymous';
}
const capitalizedName = userName[0].toUpperCase() + userName.slice(1);

console.log(`Welcome to the File Manager, ${capitalizedName}!`);

process.chdir(os.homedir());

printWorkingDir();


// 2. Bye
const byeUser = () => {
  console.log(`Thank you for using File Manager, ${capitalizedName}, goodbye!`);
  process.exit();
};

    
  process.stdin.on('error', error => console.log('Operation failed'));
  
  process.stdin.on('data', data => {
      const stringData = data.toString().trim();
        if(stringData === '.exit'){
          byeUser();
        } else if(stringData === UP_OP){
            process.cwd() !== os.homedir() && process.chdir("..");
            printWorkingDir();
        } else if(stringData.startsWith(CD_OP)){
            const path = stringData.split(CD_OP)[1].trim();
            process.chdir(path);
            printWorkingDir();
        } else if(stringData === 'command3'){
            console.log('executing command3'); 
        } else if(stringData === 'command4'){
            console.log('executing command4'); 
        } else {
          showInvalidMessage();
        }
      
      });

  process.on('SIGINT', byeUser);

// 3. Working directory
function printWorkingDir(){
  console.log('You are currently in ' + process.cwd()); 
  console.log('Enter your command: ');
};

function showInvalidMessage(){
  console.log("Invalid input");
}
 














