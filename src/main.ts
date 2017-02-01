import gr from 'grimoirejs';
import MaterialFactory from "grimoirejs-fundamental/ref/Material/MaterialFactory";
import TextComponent from './TextComponent';
import matText from "raw!./text.sort";
export default () => {
    gr.register(async () => {
        MaterialFactory.addSORTMaterial("text", matText);
        gr.registerComponent("Text", TextComponent);
        gr.registerNode("text", ["Text"], {
            color: "black",
            material:"new(text)"
        }, "mesh");
    });
};
