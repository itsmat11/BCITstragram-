/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: October 15 2023 
 * Author: Mattias Leung 
 *
 */

const fs = require("fs");
const PNG = require("pngjs").PNG;
const path = require("path");
const AdmZip = require("adm-zip");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    try {
      const zip = new AdmZip(pathIn);
      zip.extractAllToAsync(pathOut, true, error => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};


/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return fs.promises.readdir(dir)
    .then((files) => {
      const promises = files.map((file) => {
        const filePath = path.join(dir, file);
        return fs.promises.stat(filePath)
          .then((stats) => (stats.isFile() ? filePath : null));
      });

      return Promise.all(promises);
    })
    .then((filePaths) => {
      const validFilePaths = filePaths.filter((filePath) => filePath !== null);
      return validFilePaths;
    });
};



/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(pathIn);
    const png = new PNG();

    readStream
      .pipe(png)
      .on('parsed', function () {
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            const idx = (this.width * y + x) << 2;
            const grayscale = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
            this.data[idx] = grayscale;
            this.data[idx + 1] = grayscale;
            this.data[idx + 2] = grayscale;
          }

          const writeStream = fs.createWriteStream(pathOut);
          this.pack().pipe(writeStream)
            .on('finish', resolve)
            .on('error', reject);
        }
      })
      .on('error', reject);
  });
};


module.exports = {
  unzip,
  readDir,
  grayScale,
};
