const FileDetail = require('./fileDetail');
const fs = require('fs');
const util = require('util');
const videoshow = require('videoshow');
const sharp = require('sharp');

const readdir = util.promisify(fs.readdir);
const copyFile = util.promisify(fs.copyFile);

(async () => {
    getJpgFilenames(`${__dirname}/img`)
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

            // Return it as an array since we aren't looking for files anymore
            // no need to have the key value pair
            return Array.from(fileMap.values());
        })
        .then(async (fileList) => {
            // Get a list of the filesizes
            var minDimensions = (getFileSizes(fileList))[0];
            var minWidth = parseInt(minDimensions.split('x')[0]);
            var minHeight = parseInt(minDimensions.split('x')[1]);

            const tmpFileDir = `${__dirname}/tmp`;

            for(let file of fileList) {
                let isMinSize = file._exif.exif.ExifImageWidth === minWidth && file._exif.exif.ExifImageHeight === minHeight;
                
                if (!isMinSize){
                    var tmpFilePath = `${tmpFileDir}/${file._filename}.JPG`;
                        
                    await sharp(file._jpgPath)
                        .resize(minWidth, minHeight)
                        .withMetadata()
                        .toFile(tmpFilePath);
                        
                    console.log(`copying ${tmpFilePath} to ${file._jpgPath}`);
                    
                    await copyFile(tmpFilePath, file._jpgPath);
                    
                }
            };

            
            return {
                fileList: fileList,
                minWidth: minWidth,
                minHeight: minHeight
            }
        })
        .then((result) => {
            console.log(`result mW, mH: ${result.minWidth}, ${result.minHeight}`);
            console.log(`result fileList len ${result.fileList.length}`);

            // sort the files 
            result.fileList.sort(compareFileDates)
            
            createVideo(result.fileList.map(x => x._jpgPath), result.width, result.height);
        })
})();

function compareFileDates(a, b) {
    if (a._exif.exif.DateTimeOriginal < b._exif.exif.DateTimeOriginal){
        return -1;
    }
    if (a._exif.exif.DateTimeOriginal > b._exif.exif.DateTimeOriginal){
        return 1;
    }
    return 0;
}

function getFileSizes(fileList){
    let dimensionSet = new Set();
    fileList.forEach((file) => {
        try {
            const key = `${file._exif.exif.ExifImageWidth}x${file._exif.exif.ExifImageHeight}`;
            if (!dimensionSet.has(key)){
                dimensionSet.add(key);
            }
        } catch (error) {
            // console.log(`${file._filename} cannot be getting the file size`)
        }
    });
    return [...dimensionSet].sort();
//    console.log(dimensionSet);
}

async function getJpgFilenames(imgPath){
    var fileMap = new Map();

    try {
        // use the promisify'd version of fs.readdir so we can wait for everything
        var files = await readdir(imgPath);
        var imgDir = `${__dirname}/img`;

        for(let file of files){
            const splitName = file.split('.');
            const extension = splitName[1];
            if (extension.toLowerCase() === 'jpg' || extension.toLowerCase() === 'mov'){
                if (!fileMap.has(splitName[0])){                
                    fileDetail = new FileDetail(imgDir, splitName[0], [extension]);
                    fileMap.set(splitName[0], fileDetail);
                } else {
                    // console.log(`updating  ${file}`);
                    var fileDetail = fileMap.get(splitName[0]);
                    fileDetail.addExtension(extension);
                    fileMap.set(splitName[0], fileDetail);
                }
            }
        }
        
    } catch (error) {
        console.log(error);
    }

    return fileMap;
}

function createVideo(images, width, height){
    var videoOptions = {
        //fps: 25,
        fps: 25,
        loop: '00.500', //loop duration in seconds or as a '[[hh:]mm:]ss[.xxx]' string
        transition: false,
        videoBitrate: 1024,
        videoCodec: 'libx264',
        audioBitrate: '128k',
        audioChannels: 2,
        format: 'mov',
        pixelFormat: 'yuv420p'
    }
    
      videoshow(images, videoOptions)
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