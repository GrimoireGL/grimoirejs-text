import gr from 'grimoirejs'
import TextComponent from './TextComponent'
export default () => {
  gr.register(async ()=>{
    gr.registerComponent("Text",TextComponent);
    gr.registerNode("text",["Text"],{
      color:"black"
    },"mesh");
  });
};
