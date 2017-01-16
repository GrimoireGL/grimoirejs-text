import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import Vector3 from "grimoirejs-math/ref/Vector3";
import TransformComponent from "grimoirejs-fundamental/ref/Components/TransformComponent";
import Attribute from "grimoirejs/ref/Node/Attribute";
export default class TextComponent extends Component {

    public static componentName: string = "TextComponent";

    public static attributes: { [key: string]: IAttributeDeclaration } = {
        text: {
            default: "Hello Grimoire!",
            converter: "String"
        },
        textureSize: {
            default: 256,
            converter: "Number"
        }, font: {
            default: "Arial",
            converter: "String"
        },
        fontSize: {
            default: 30,
            converter: "Number"
        }
    };
    private _text: string;
    private lastText: string;
    private _font: string;
    private _fontSize: number;
    public $awake(): void {
        this.__bindAttributes();
        this.draw(this._text);
        this.lastText = this._text;
    }
    public $update(): void {

        if (this._text !== this.lastText) {
            this.draw(this._text);
            this.lastText = this._text;
        }
    }
    private normalize(x: number, y: number): string {
        const r = Math.pow(10, Math.max(String(x).length, String(y).length) - 1);
        return x / r + "," + y / r;
    }
    private draw(text: string) {
        const canvas = document.createElement("canvas");
        var ctx = canvas.getContext('2d');
        canvas.width = this.getAttribute("textureSize");
        canvas.height = canvas.width;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        ctx.font = this._fontSize + "px " + this._font;
        ctx.fillStyle = 'rgb(255, 255, 255)';


        ctx.fillText(text, canvas.width / 2, 0);
        var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = pixels.data;
        var textHeight = 0;
        var currentRow = -1;
        for (var i = 0, len = data.length; i < len; i += 4) {
            var r = data[i], g = data[i + 1], b = data[i + 2], alpha = data[i + 3];
            if (alpha > 0) {
                var row = Math.floor((i / 4) / canvas.width);
                if (row > currentRow) {
                    currentRow = row;
                    textHeight++;
                }
            }
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText(text, canvas.width / 2, (canvas.height - textHeight) / 2);
        this.node.setAttribute("texture", canvas, false);
    }
}
