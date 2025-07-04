import {tool} from "langchain/tools";
import {monsterScene} from "../../src/Scenes/Monster.js";

export class BodyTool {
    constructor(sceneGetter) {
        this.sceneGetter = sceneGetter;
        this.name = "body_selector";
        this.description = "Selects a body sprite fpr the monster";
        this.bodyTypes = [];
        this.initialized = false;
    }

    initialize() {
        const scene = this.sceneGetter();
        const cache = scene.textures.get('monsterParts')?.source[0]?.data;

        if(!cache){
            console.warn("Atlad data not found. 'monsterParts' could not be loaded.");
            return;
        }

        const spriteelements = cache.getElementsByTageName("SubTextture");
        for (let i = 0; i < spriteelements.length; i++){
            const name = spriteelements[i].getAttribute("name");
            if(name && name.startsWith("body_")) {
                this.bodyTypes.push(name);
            }
        }

        this.initialized = true;
    }

    async call(input) {
        const scene = this.sceneGetter();

        if (!this.initialized) {
            this.initialize();
        }

        if(!scene || !scene.my || !scene.my.sprite || !scene.textures.exists("monsterParts")) {
            return "Monster scene not property initialized.";
        }

        const query = input.trim().toLowerCase();
        const matched = this.bodyTypes.find(name => name.toLowerCase().includes(query));

        if(matched) {
            scene.my.sprite.body.setTexture("monsterParts", matched);
            return `Applied body type "${matched}" to the monster.`
        } else {
            return `No matching body type found for "${input}". Available: ${this.bodyTypes.join(", ")}`;
        }
    }
}