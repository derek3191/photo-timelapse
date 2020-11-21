const fs = require('fs');
const util = require('util');
const ExifImage = require('exif').ExifImage;
// const exif = require('./exifExtension');

class FileDetail{
    constructor(path, filename, extensions){
        this._filename = filename || null;
        this._extensions = extensions || null;
        this._path = path;
        this._jpgPath = extensions.includes('JPG') ? `${this._path}/${this._filename}.JPG` : null;
        this._movPath = extensions.includes('mov') ? `${this._path}/${this._filename}.mov` : null;
    }

    
    initialize(){
        //(result => {
            // this._exif = result;
            
            // this._month = this.getMonth()
            
            // this._days = this.getDays();
            // });
            return new Promise((resolve, reject) => {
                try {
                    this.exifPromise(this._jpgPath)
                        .then((result) => {
                            // console.log(result);
                            this._exif = result;
                            resolve(this);
                        })
                        .catch((error) => {
                            console.log(error);
                            reject(error)
                        });
                } catch (error) {
                    reject(error);
                }
            });
    }

    exifPromise(path){
        return new Promise((resolve, reject) => {
            try {
                new ExifImage({ image: path }, (err, data) => {
                    if (err){
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }
    
        
    addExtension(extension){
        this._extensions.push(extension);
        if (this._jpgPath === null && this._extensions.includes('JPG')){
            this._jpgPath = `${this._path}/${this._filename}.JPG`;
        } 
        if (this._movPath === null && this._extensions.includes('mov')){
            this._movPath = `${this._path}/${this._filename}.mov`;
        }
    }

    getMonth(){
        // const startingMonth = 10;
        // const startingYear = 2019;

        // let pictureDateSegments = this._exif.DateTimeOriginal.split(' ')[0].split(':');
        // let pictureMonth = pictureDateSegments[1];
        // let pictureYear = pictureDateSegments[0];
        // let picture
        var pictureDateSegments = this._exif.DateTimeOriginal.split(' ')[0].split(':');
        var pictureDate = new Date(`${pictureDateSegments[1]}/${pictureDateSegments[2]}/${pictureDateSegments[0]}`);

        var newDate = new Date(pictureDate.setMonth(pictureDate.getMonth()+1));
        //console.log(`${this._exif.DateTimeOriginal}|${pictureDate} +1month = ${newDate}`)

    }

    getDays(){
        var birthdate = new Date("10/25/2019"); 
        var pictureDateSegments = this._exif.DateTimeOriginal.split(' ')[0].split(':');
        var pictureDate = new Date(`${pictureDateSegments[1]}/${pictureDateSegments[2]}/${pictureDateSegments[0]}`);

        var diffInTime = pictureDate.getTime() - birthdate.getTime();         
        var diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24)); 
        
        return diffInDays;
    }

    printFileDetail(){
        var noDate = "no date";
        var noMonth = "no month";
        var noDays = "no days";

        return `${this.filename}.${this.extensions[0]}\t${this.date ?? noDate}\t${this.month ?? noMonth}\t${this.days ?? noDays}`;
    }
}

module.exports = FileDetail;