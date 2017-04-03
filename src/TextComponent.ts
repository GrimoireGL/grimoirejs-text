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
            default: "20px 'ＭＳ Ｐゴシック'",
            converter: "String"
        },
        stroke: {
            default: false,
            converter: "Boolean"
        },
        size: {
            default: 1,
            converter: "Number"
        },
        back: {
            default: false,
            converter: "Boolean"
        },
        offsetX: {
            default: 0,
            converter: "Number"
        }
    };
    private text: string;
    private font: string;
    private size: number;
    private stroke: boolean;
    private back: boolean;
    private offsetX: number;
    private transform: TransformComponent;
    private scale: Vector3;
    public $awake(): void {
        this.__bindAttributes();
        //TODO  Material:Disable(CULL_FACE)
        // if (!this.back) {
        //     this.node.setAttribute("material", "new(text)");
        // }
    }
    public $mount(): void {
        this._draw(this.text);
        this.getAttributeRaw('text').watch((attr) => {
            this._draw(this.text);
        });
    }
    private _measure(font: string, text: string): number[] {
        const canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = font;
        // const body = document.getElementsByTagName("body")[0];
        // body.appendChild(canvas);
        Array.prototype.forEach.call(text, (s) => {
            ctx.fillText(s + ".", 0, 0);
        });
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
        return [textWidth, textHeight];
    }
    private _fixTextureSize(size: number): number {
        let i = 1;
        while (size > Math.pow(2, i)) {
            i++;
        }
        return Math.pow(2, i);
    }
    private _draw(text: string) {
        this.transform = this.node.getComponent("Transform") as TransformComponent;
        this.scale = this.transform.scale;
        const canvas = document.createElement("canvas");
        const length = this._measure(this.font, this.text);
        const textLength = this.text.length;
        canvas.width = this._fixTextureSize(length[0] * textLength);
        canvas.height = canvas.width;
        var ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = this.font;
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.strokeStyle = 'rgb(255, 255, 255)';
        const magnification = {
            x: canvas.width / (length[0] * textLength),
            y: canvas.height / length[1]
        }
        // ctx.lineWidth = 10;
        // ctx.rect(0, 0, canvas.width, canvas.height);
        // ctx.stroke();
        ctx.scale(magnification.x, magnification.y);
        if (this.stroke === true) {
            ctx.strokeText(this.text, this.offsetX, 0);
        } else {
            ctx.fillText(this.text, this.offsetX, 0);
        }
        // const body = document.getElementsByTagName("body")[0];
        // body.appendChild(canvas);
        const texture = canvas.toDataURL();
        this.node.setAttribute("texture", texture);
        const localSize = this.size * canvas.width / 100;
        this.node.setAttribute("scale", [localSize / magnification.x, localSize / magnification.y, 0.1], true);
    }
}
