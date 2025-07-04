class Monster extends Phaser.Scene {
    constructor() {
        super("monsterScene");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings

        //Create constants for the monster location
        this.bodyX = 300;
        this.bodyY = 350;

        //arms locations
        this.rightArmX = this.bodyX + 90;
        this.rightArmY = this.bodyY + 20;

        this.leftArmX = this.bodyX - 90;
        this.leftArmY = this.bodyY + 20;

        //the legs location
        this.rightLegX = this.bodyX + 80;
        this.rightLegY = this.bodyY + 140;

        this.leftLegX = this.bodyX - 80;
        this.leftLegY = this.bodyY + 140;

        //Face:

        //the mouth location
        this.mouthX = this.bodyX;
        this.mouthY = this.bodyY + 20;

        //the eyes
        this.eyeX = this.bodyX;
        this.eyeY = this.bodyY - 50;

        //the ears
        this.earRightX = this.bodyX + 60;
        this.earRightY = this.bodyY - 90;

        this.earLeftX = this.bodyX - 60;
        this.earLeftY = this.bodyY - 90;

        //defniantion for the "A" and "D" keys for movement

        this.aKey = null;
        this.dKey = null;
        
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        // Assets from Kenny Assets pack "Monster Builder Pack"
        // https://kenney.nl/assets/monster-builder-pack
        this.load.setPath("./assets/");

        // Load sprite atlas
        this.load.atlasXML("monsterParts", "spritesheet_default.png", "spritesheet_default.xml");
        
        // update instruction text
        document.getElementById('description').innerHTML = '<h2>Monster.js<br>S - smile // F - show fangs<br>A - move left // D - move right</h2>'
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability

        // Create the main body sprite
        //
        // this.add.sprite(x,y, "{atlas key name}", "{name of sprite within atlas}")
        //
        // look in spritesheet_default.xml for the individual sprite names
        // You can also download the asset pack and look in the PNG/default folder.
        //body_redF.png -> red long body with furr
        my.sprite.body = this.add.sprite(this.bodyX, this.bodyY, "monsterParts", "body_darkF.png");

        //the arms
        my.sprite.rightArm = this.add.sprite(this.rightArmX, this.rightArmY, "monsterParts", "arm_whiteE.png");
        my.sprite.leftArm = this.add.sprite(this.leftArmX, this.leftArmY, "monsterParts", "arm_whiteE.png");
        my.sprite.leftArm.flipX = true;

        //the legs
        my.sprite.rightLeg = this.add.sprite(this.rightLegX, this.rightLegY, "monsterParts", "leg_whiteE.png");
        my.sprite.leftLeg = this.add.sprite(this.leftLegX, this.leftLegY, "monsterParts", "leg_whiteE.png");
        my.sprite.leftLeg.flipX = true;

        //the fang mouth
        my.sprite.mouthFang = this.add.sprite(this.mouthX, this.mouthY, "monsterParts", "mouthJ.png");

        //sad closed mouth
        my.sprite.mouthSad = this.add.sprite(this.mouthX, this.mouthY, "monsterParts", "mouth_closed_sad.png");
        my.sprite.mouthSad.visible = false;

        //the eyes
        my.sprite.eye = this.add.sprite(this.eyeX, this.eyeY, "monsterParts", "eye_cute_light.png");

        //ears
        my.sprite.earRight = this.add.sprite(this.earRightX, this.earRightY, "monsterParts", "detail_white_ear.png");
        my.sprite.earLeft = this.add.sprite(this.earLeftX, this.earLeftY, "monsterParts", "detail_white_ear.png");
        my.sprite.earLeft.flipX = true;

        //Event input: fang to sad face - event inputs keeps the change
        let sadKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        let fangKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        sadKey.on('down', (key, event) => {
            my.sprite.mouthSad.visible = true;
            my.sprite.mouthFang.visible = false;
        });

        fangKey.on('down', (key, event) => {
            my.sprite.mouthSad.visible = false;
            my.sprite.mouthFang.visible = true;
        });

        //keyboard polling:
        //setting the "A" and "D" keys
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        
    }

    update() {
        let my = this.my;    // create an alias to this.my for readability

        let speed = 3;

        //updateing the postion of each sprite when "A" key is down
        //moving to the left
        if(this.aKey.isDown){
            //we go through each of the "my.sprite" calls - each one has a sprite with an 'x' axes that can be changed
            for( let curr in my.sprite){
                my.sprite[curr].x -= speed;
            }
        }

        //update for the "D" key press
        //each sprite move to the right
        if(this.dKey.isDown){
            for( let curr in my.sprite){
                my.sprite[curr].x += speed;
            }
        }

       
    }

}