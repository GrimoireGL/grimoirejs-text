  import TextComponent from "./TextComponent";

var __VERSION__ = "0.0.0-development";
var __NAME__ = "grimoirejs-text";

import __MAIN__ from "./main";

var __EXPOSE__ = {
  "TextComponent": TextComponent
};

let __BASE__ = __MAIN__();

Object.assign(__EXPOSE__,{
    __VERSION__:__VERSION__,
    __NAME__:__NAME__
});
Object.assign(__BASE__|| {},__EXPOSE__);

window["GrimoireJS"].lib.text = __EXPOSE__;

export default __BASE__;
