const FileDetail = require('./fileDetail');
const fs = require('fs');
const util = require('util');
const videoshow = require('videoshow');
const { create } = require('domain');

const readdir = util.promisify(fs.readdir);
let fileList = null;

// (async () => {
//     getJpgFilenames(`${__dirname}/img`).then((result) => {
//         fileList = result;
        
//         // Get more data for the files

//         // Actually create the video
//         //createVideo([...result]);
//     }).then(() => {
//         fileList.forEach((val, i) => {
//             try {
//                 val.initialize()
//                     .then((result) => {
//                         fileList.set(i, result);
//                         console.log(val);
//                     });                
//             } catch (error) {
//                 console.log(`error initializing... ${error}`);
//             }
//         });

//         return fileList;
//     }).then((val) => {
//         console.log(val);
//     });
//     // console.log(`jpgFiles: ${jpgFiles.size}`);
    
    
// })();

(async () => {
    getJpgFilenames(`${__dirname}/img`)
        // .then(async (fileList) => {
        //     // Get more data for the files
        //     for (let [fileKey, fileValue] of fileList){
        //         try {
        //             let newFileValue = await fileValue.initialize();
        //             await fileList.set(fileKey, newFileValue);                
        //         } catch (error) {
        //             console.log(`error initializing... ${error}`);
        //         }
        //     }
        //     return fileList;
        // })
        .then(async (fileMap) => {
            // Get more data for the files
            for (let [fileKey, fileValue] of fileMap){
                try {
                    let newFileValue = await fileValue.initialize();
                    await fileMap.set(fileKey, newFileValue);                
                } catch (error) {
                    console.log(`error initializing... ${error}`);
                }
            }
            return Array.from(fileMap.values());
        })
        .then((fileList) => {
            // Get a list of the filesizes
            let smallImaages = [];
            console.log(`v len is ${fileList.length}`)
            fileList.forEach((v) => {
                // if (v._exif.exif.ExifImageHeight === 2048 && v._exif.exif.ExifImageWidth == 1536){
                //     smallImaages.push(v._jpgPath);
                // }
                // console.log(v);
                // console.log(`${v._filename}\t${v._exif.exif.ExifImageWidth}x${v._exif.exif.ExifImageHeight}\t${v._exif.image.Orientation}`)
            });

            // console.log(smallImaages);
            // createVideo(smallImaages);
            
            // console.log(`in the Then()... about to create the video of ${val.size} images`);
            // Actually create the video
            //createVideo([...result]);
            jpgFilePaths = [];
            for (let [k, v] of val.entries()){
                // console.log(`i is ${k}, v is ${v._jpgPath}`);
                jpgFilePaths.push(v._jpgPath);
                // console.log(v);
            }
            // createVideo(jpgFilePaths.slice(0, 10));
        });
    
    
})();




async function getJpgFilenames(imgPath){
    var fileMap = new Map();

    try {
        // use the promisify'd version of fs.readdir so we can wait for everything
        var files = await readdir(imgPath);
        var imgDir = `${__dirname}/img`;
        for(let file of files){
            const splitName = file.split('.');
            const extension = splitName[1];
            if (!fileMap.has(splitName[0])){
                fileDetail = new FileDetail(imgDir, splitName[0], [extension]);
                fileMap.set(splitName[0], fileDetail);
            } else {
                var fileDetail = fileMap.get(splitName[0]);
                fileDetail.addExtension(extension);
                fileMap.set(splitName[0], fileDetail);
            }
        }
        
    } catch (error) {
        console.log(error);
    }
    return fileMap;
}

function createVideo(images){
    console.log(`about to build movie from ${images.length} pics`);
    var videoOptions = {
        fps: 25,
        loop: 2, // seconds
        transition: false,
        //transitionDuration: 1, // seconds
        videoBitrate: 1024,
        videoCodec: 'libx264',
        size: '1536x2048',
        audioBitrate: '128k',
        audioChannels: 2,
        format: 'mov',
        pixelFormat: 'yuv420p'
      }
      
      videoshow(images.slice(0, 10), videoOptions)
        //.audio('song.mp3')
        .save('video.mov')
        .on('start', function (command) {
          console.log('ffmpeg process started:', command)
        })
        .on('error', function (err, stdout, stderr) {
          console.error('Error:', err)
          console.error('ffmpeg stderr:', stderr)
        })
        .on('end', function (output) {
          console.error('Video created in:', output)
        })
}