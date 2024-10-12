import os from 'os';
import fs from 'fs';

import {UP_OP, CD_OP, LS_OP, CAT_OP} from './constants.js';

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
        } else if(stringData === LS_OP){
          const dirContent = [];

          fs.readdir(process.cwd(), (err, files) => {
            
             for(const item of files){
              let itemType = undefined;
              if(fs.lstatSync(item).isDirectory()){
                itemType = 'directory';
              } else if(fs.lstatSync(item).isFile()){
                itemType = 'file';
              }
              const newItem = {Name: item, Type: itemType}
              dirContent.push(newItem);
             }
             
             dirContent.sort((a, b) => {
               if(a.Type < b.Type) return -1;
               if(a.Type > b.Type) return 1;
               if(a.Type = b.Type) return 0;
             });
            console.table(dirContent);
            printWorkingDir();
            
        }); 
        } else if(stringData.startsWith(CAT_OP)){
            const path = stringData.split(CAT_OP)[1].trim();
            const readStream = fs.createReadStream(path);
            readStream.on('data', (data) => console.log(data.toString()));
            
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
 














