const fs = require('fs');
const videoshow = require('videoshow');


const FileDetail = require('./fileDetail');

const imgPath = `${__dirname}/img`;
let fileMap = new Map();
const fileArr = [];

const jpgFileSet = await getJpgFilenames();
console.log("jpgFileSet");
console.log(jpgFileSet.size());

async function getJpgFilenames(){
    var fileSet = new Set();
    var files;

    fs.readdir(imgPath, (err, f) => {
        files = f;
        for(let file of files){
            const splitName = file.split('.');
            const extension = splitName[1];
            // console.log(`${extension.toLowerCase()}  && ${!fileSet.has(splitName[0])}`)
            if (extension.toLowerCase() === 'jpg' && !fileSet.has(`${imgPath}/${splitName[0]}.jpg`)){
                fileSet.add(`${imgPath}/${splitName[0]}.jpg`);
            }
        }
        return files;
    });
}







// async function parseImages(){
//     if (fs.readdir(imgPath, (err, files) => {
//         if (err){
//             console.log(`error looking for images in\n${imgPath}:\n${err}`);
//         }

//         files.forEach((val, i) => {
//             const splitName = val.split('.');
//             const extension = splitName[1];

//             if (!fileMap.has(splitName[0])){
//                 fileMap.set(splitName[0], [extension]);
//             } else {
//                 fileMap.set(splitName[0], [...fileMap.get(splitName[0]), extension]);
//             }

//         })

//         // fileMap.forEach((extensions, filename) => {
//         //     var fileDetail = new FileDetail(`${__dirname}/img`, filename, extensions) 

//         //     fileDetail.initialize(() => {
//         //         fileArr.push(fileDetail);
//         //         console.log(`${fileDetail._filename}: ${fileDetail._exif.DateTimeOriginal} is ${fileDetail._days} days`);
//         //     });  
//         // });
        
//         fileArr = await populateFileDetails(fileMap);
//         console.log(fileArr.length);
//         return fileArr;
//     }));
// }

// async function populateFileDetails(fileMap){
//     var arr = [];
//     fileMap.forEach((extensions, filename) => {
//         var fileDetail = new FileDetail(`${__dirname}/img`, filename, extensions) 

//         fileDetail.initialize(() => {
//             arr.push(fileDetail);
//             console.log(`${fileDetail._filename}: ${fileDetail._exif.DateTimeOriginal} is ${fileDetail._days} days`);
//         });  
//     });

//     return arr;


// }
// function printarray(arr){
    
    
//     arr.forEach((val) => {
//         console.log(val);
//     })
// }




// function combineClips(clips){

//     // videoConcat({
//     //     silent: true, // optional. if set to false, gives detailed output on console
//     //     overwrite: false // optional. by default, if file already exists, ffmpeg will ask for overwriting in console and that pause the process. if set to true, it will force overwriting. if set to false it will prevent overwriting.
//     // })
//     // .clips(...clips, { "fileName": }
        
//     //     [
//     //     {
//     //     "fileName": "FILENAME"
//     //     },
//     //     {
//     //     "fileName": "FILENAME"
//     //     },
//     //     {
//     //     "fileName": "FILENAME"
//     //     }
//     //     ])
//     // .output("myfilename") //optional absolute file name for output file
//     // .concat()
//     // .then((outputFileName) => {
//     //     console.log(`${outputFileName} created...`);
//     // });

// }