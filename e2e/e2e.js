const fs = require('fs')
const path = require('path')

function getDirectories (srcpath) {
  return fs.readdirSync(srcpath)
    .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())
}

const dir = process.env.CIRCLE_ARTIFACTS  || "ci_images";
const dirs = getDirectories("e2e");
console.log(dirs);
const exportModule = {};
for(let key of dirs){
  exportModule[key] = (client)=>{
    client
        .url(`http://localhost:8080/e2e/${key}/index.html`)
        .waitForElementPresent(`canvas.gr-resource-loaded-canvas`,30000)
        .pause(100)
        .saveScreenshot(dir + `/${key}.png`).end();
  };
}
module.exports = exportModule;
