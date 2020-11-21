const Exif = require('exif');
const fs = require('fs');
const ExifImage = require('exif').ExifImage;

class FileDetail{
    constructor(path, filename, extensions){
        this._filename = filename || null;
        this._extensions = extensions || null;
        this._path = path;
        this._jpgPath = extensions.includes('JPG') ? `${this._path}/${this._filename}.JPG` : null;
        this._movPath = extensions.includes('mov') ? `${this._path}/${this._filename}.mov` : null;
    }

    initialize(callback){
        this.getExifData(result => {
            this._exif = result;
    
            this._month = this.getMonth()
    
            this._days = this.getDays();
            callback();
        });
    }
    
    get filename(){
        return this._filename;
    }

    set filename(filename){
        this._filename = filename;
    }

    get extensions(){
        return this._extensions;
    }

    set extensions(extensions){
        this._extensions = extensions;
        //this._jpgPath = this.getPrefPath();
        
    }

    get path(){
        return this._path;
    }

    set path(path){
        this._path = path;
    }

    get jpgPath(){
        return this._jpgPath;
    }

    set jpgPath(jpgPath){
        this._jpgPath = jpgPath;
    }

    get month(){
        return this._month;

    }

    set month(month){
        this._month = month;

    }
    get days(){
        return this._days;
    }

    set days(days){
        this._days = days;

    }

    async getExifData(callback){
        try {
            new ExifImage({ image: this._jpgPath }, (err, data) => {
                callback(data.exif);
            });
        } catch (err){
            console.log(err);
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