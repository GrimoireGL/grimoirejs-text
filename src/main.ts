import gr from 'grimoirejs';
import MaterialFactory from "grimoirejs-fundamental/ref/Material/MaterialFactory";
import TextComponent from './TextComponent';
import textBackMaterial from "raw-loader!./text_back.sort";
import textMaterial from "raw-loader!./text.sort";
export default () => {
    gr.register(async () => {
        MaterialFactory.addSORTMaterial("text", textMaterial);
        MaterialFactory.addSORTMaterial("text-back", textBackMaterial);
        gr.registerComponent("Text", TextComponent);
        gr.registerNode("text", ["Text"], {
            color: "black",
            material: "new(text)"
        }, "mesh", ['scale']);
    });
};
