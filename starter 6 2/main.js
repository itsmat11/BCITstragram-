const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description: This program will read a zip file containing png images, convert them to grayscale, and save them to a new directory called grayscaled
 *
 * Created Date: October 15, 2023
 * Author: Mattias Leung 
 *
 *  Was not able to use unzipper because of corrupted images, using AdmZip instead
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");
const path = require("path");

IOhandler.unzip(zipFilePath, pathUnzipped)
  .then(() => IOhandler.readDir(pathUnzipped))
  .then((imagePaths) => {
    const promise = imagePaths.map((pathIn) => {
      const pathout = path.join(pathProcessed, path.basename(pathIn));
      return IOhandler.grayScale(pathIn, pathout);
    });
    return Promise.all(promise);
  })
  .then(() => console.log("DONE"))
  .catch((error) => console.error(error));


