import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import Vector3 from "grimoirejs-math/ref/Vector3";
import TransformComponent from "grimoirejs-fundamental/ref/Components/TransformComponent";
import Attribute from "grimoirejs/ref/Node/Attribute";
import gr from "grimoirejs"
export default class TextComponent extends Component {

    public static componentName: string = "TextComponent";

    public static attributes: { [key: string]: IAttributeDeclaration } = {
        text: {
            default: "Hello Grimoire!",
            converter: "String"
        },
        font: {
            default: "",
            converter: "String"
        },
        stroke: {
            default: false,
            converter: "Boolean"
        }
    };
    private text: string;
    private lastText: string;
    private font: string;
    private stroke: boolean;
    private textureSize: number;
    private transform: TransformComponent;
    private scale: Vector3;
    public $mount(): void {
        this.__bindAttributes();
        this.draw(this.text);
        this.lastText = this.text;
    }
    public $update(): void {
        if (this.text !== this.lastText) {
            this.draw(this.text);
            this.lastText = this.text;
        }
    }
    private measure(font: string): number[] {
        const canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = font;
        canvas.width = 256;
        canvas.height = 256;
        ctx.fillText("a", 0, 0);
        var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = pixels.data;
        var textHeight = 0;
        var textWidth = 0;
        var currentRow = -1;
        var currentCulumn = -1;
        var firstRow;
        var firstCulumn;
        for (var i = 0, len = data.length; i < len; i += 4) {
            const alpha = data[i + 3];
            if (alpha > 0) {
                const row = Math.floor((i / 4) / canvas.width) + 1;
                const culumn = (i / 4) % canvas.width + 1;
                if (currentRow == -1) {
                    firstRow = row - 1;
                }
                if (currentCulumn == -1) {
                    firstCulumn = culumn - 1;
                } else {
                    firstCulumn = Math.min(firstCulumn, culumn - 1);
                }
                if (row > currentRow) {
                    currentRow = row;
                    textHeight = row;
                }
                if (culumn > currentCulumn) {
                    currentCulumn = culumn;
                    textWidth = culumn;
                }
            }
        }
        textHeight = textHeight - firstRow;
        textWidth = textWidth - firstCulumn;

        return [textWidth, textHeight];
    }
    private draw(text: string) {
        this.transform = this.node.getComponent("Transform") as TransformComponent;
        this.scale = this.transform.localScale;
        const canvas = document.createElement("canvas");
        var ctx = canvas.getContext('2d');
        canvas.width = this.textureSize;
        canvas.height = this.textureSize;
        ctx.textBaseline = 'top';
        ctx.font = this.font;
        console.log()
        // ctx.fillStyle = 'rgb(255, 255, 255)';
        // ctx.strokeStyle = 'rgb(255, 255, 255)';
        const length = this.measure(this.font);
        const textLength = this.text.length;
        const d = Math.ceil(Math.pow(textLength, 0.5));
        canvas.width = Math.max(length[0], length[1]) * d;
        canvas.height = canvas.width;
        const body = document.getElementsByTagName("body")[0];
        body.appendChild(canvas);
        for (let i = 0; i < textLength; i+=d) {
            ctx.fillText(this.text, length[1] * i, 0);
        }
    }
}
