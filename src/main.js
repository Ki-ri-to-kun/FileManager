import os from 'os';
import fs from 'fs';
import zlib from 'zlib';
import {createHash} from 'node:crypto';

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
        } else if(stringData.startsWith(OPERATION.CP)){
            const commandParts = stringData.split(OPERATION.CP)[1];
            const oldFilePath  = commandParts.split(' ')[0].trim();
            const newFilePath  = commandParts.split(' ')[1].trim();
            
            fs.cp(oldFilePath, newFilePath, (err) => err && console.log(err));
            printWorkingDir();
        } else if(stringData.startsWith(OPERATION.MV)){
            const commandParts = stringData.split(OPERATION.MV)[1];
            const oldFilePath  = commandParts.split(' ')[0].trim();
            const newFilePath  = commandParts.split(' ')[1].trim();
            
            const readStream = fs.createReadStream(oldFilePath);
            const writeStream = fs.createWriteStream(newFilePath);
          
            readStream.pipe(writeStream);
          
            readStream.on('close', () => {
            fs.unlink(oldFilePath, (err) => err && console.log(err));
            printWorkingDir();
            });
        } else if(stringData.startsWith(OPERATION.RM)){
            const path = stringData.split(OPERATION.RM)[1];
            
            fs.unlink(path, (err) => err && console.log(err));
            printWorkingDir();
        } else if(stringData.startsWith(OPERATION.COMPRESS)){
            const paths = stringData.split(OPERATION.COMPRESS)[1];
            const oldFilePath  = paths.split(' ')[0].trim();
            const newFilePath  = paths.split(' ')[1].trim();
            
            const input = fs.createReadStream(oldFilePath);
            const output = fs.createWriteStream(newFilePath);
   
            const compress = zlib.createGzip();
            input.pipe(compress).pipe(output);
            
            printWorkingDir();
        } else if(stringData.startsWith(OPERATION.DECOMPRESS)){
            const paths = stringData.split(OPERATION.DECOMPRESS)[1];
            const oldFilePath  = paths.split(' ')[0].trim();
            const newFilePath  = paths.split(' ')[1].trim();
            
            const input = fs.createReadStream(oldFilePath);
            const output = fs.createWriteStream(newFilePath);
            const decompress = zlib.createUnzip();
            input.pipe(decompress).pipe(output);
            
            printWorkingDir();
        } else if(stringData.startsWith(OPERATION.HASH)){
            const path = stringData.split(OPERATION.HASH)[1];
   
            const hash = createHash('sha256');
            const readStream = fs.createReadStream(path);
              
            readStream.on('data', (data) => {
              hash.write(data);
              hash.end();
            });

            hash.on('readable', () => {
              const data = hash.read();
              if(data) {
                console.log(data.toString('hex'));
                printWorkingDir();
              }
            });
        } else if(stringData.startsWith(OPERATION.OS.BASE)){
           switch(stringData){
             case OPERATION.OS.EOL:
              console.log(JSON.stringify(os.EOL));
              break;
             case OPERATION.OS.CPUS:
              console.log(os.cpus());
              break;
             case OPERATION.OS.HOMEDIR:
              console.log(os.homedir());
              break;
             case OPERATION.OS.USERNAME:
              console.log(os.userInfo().username);
              break;
             case OPERATION.OS.ARCHITECTURE:
              console.log(process.arch);
              break;
             default:
              console.log('unknown command');
           }
            
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
 














