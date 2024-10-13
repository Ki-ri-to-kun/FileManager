import os from 'os';
import fs from 'fs';

import {OPERATION} from './constants.js';

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
        } else if(stringData === OPERATION.UP){
            process.cwd() !== os.homedir() && process.chdir("..");
            printWorkingDir();
        } else if(stringData.startsWith(OPERATION.CD)){
            const path = stringData.split(OPERATION.CD)[1].trim();
            process.chdir(path);
            printWorkingDir();
        } else if(stringData === OPERATION.LS){
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
        } else if(stringData.startsWith(OPERATION.CAT)){
            const path = stringData.split(OPERATION.CAT)[1].trim();
            const readStream = fs.createReadStream(path);
            readStream.on('data', (data) => {
                console.log(data.toString());
                printWorkingDir();
            });
            
        } else if(stringData.startsWith(OPERATION.ADD)){
            const path = stringData.split(OPERATION.ADD)[1].trim();
            const readStream = fs.createReadStream(path);
            fs.openSync(path, 'a');
            printWorkingDir();
            
        } else if(stringData.startsWith(OPERATION.RN)){
            const commandParts = stringData.split(OPERATION.RN)[1];
            const oldFileName  = commandParts.split(' ')[0].trim();
            const newFileName  = commandParts.split(' ')[1].trim();
            
            fs.rename(oldFileName, newFileName, (err) => err && console.log(err));
            printWorkingDir();
        }
        else {
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
 














