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
        },
        font: {
            default: "Arial",
            converter: "String"
        },
        fontSize: {
            default: 30,
            converter: "Number"
        },
        stroke: {
            default: false,
            converter: "Boolean"
        }
    };
    private text: string;
    private lastText: string;
    private font: string;
    private fontSize: number;
    private stroke: boolean;
    private textureSize: number;
    private transform: TransformComponent;
    private scale: Vector3;
    public $awake(): void {
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
    private normalize(x: number, y: number, scale: Vector3): string {
        const r = Math.pow(10, Math.max(String(x).length, String(y).length) - 1);
        return x / r * scale.X + "," + y / r * scale.Y;
    }
    private draw(text: string) {
        this.transform = this.node.getComponent("Transform") as TransformComponent;
        this.scale = this.transform.localScale;
        const canvas = document.createElement("canvas");
        var ctx = canvas.getContext('2d');
        // const body = document.getElementsByTagName("body")[0];
        // body.appendChild(canvas);
        canvas.width = this.textureSize;
        canvas.height = this.textureSize;
        ctx.textBaseline = 'top';
        ctx.font = this.fontSize + "px " + this.font;
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.strokeStyle = 'rgb(255, 255, 255)';

        ctx.fillText(text, 0, 0);
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
        const canvas2 = document.createElement("canvas");
        canvas2.setAttribute("width", String(textWidth));
        canvas2.setAttribute("height", String(textHeight));
        var ctx2 = canvas2.getContext('2d');
        ctx2.drawImage(canvas, firstCulumn, firstRow, canvas2.width, canvas2.height, 0, 0, canvas2.width, canvas2.height);
        const texture = canvas2.toDataURL();

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.scale(canvas.width / textWidth, canvas.height / textHeight);

        if (this.stroke == true) {
            ctx.strokeText(text, -firstCulumn, -firstRow);
        } else {
            ctx.fillText(text, -firstCulumn, -firstRow);
        }
        //
        // ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        // canvas2.width = canvas.width;
        // canvas2.height = canvas.height;
        // ctx2.transform(-1, 0, 0, 1, canvas.width, 0);
        // ctx2.drawImage(canvas, 0, 0);
        this.node.setAttribute("texture", canvas, false);
        this.node.setAttribute("scale", this.normalize(textWidth, textHeight, this.scale) + ",0");
    }
}
