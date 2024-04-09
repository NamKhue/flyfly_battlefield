cc.Class({
    extends: cc.Component,

    properties: {
        backGr_1: cc.Node,
        backGr_2: cc.Node,

        loseBloodBG: cc.Node,
        textDragToMove: cc.Node,

        backGr_fake: cc.Node,
        btn_click_to_play: cc.Node,

        level_text: [cc.Node],

        mainAudio: {
            default: null,
            type: cc.AudioClip
        },
    },

    makeResponsive() {
        let canvas = this.node.getComponent(cc.Canvas);
        let deviceResolution = cc.view.getFrameSize();
        
        // calculte design ratio
        let desiredRatio = canvas.designResolution.width / canvas.designResolution.height;
        // calculte device ratio
        let deviceRatio = deviceResolution.width / deviceResolution.height;
    
        if (deviceRatio >= desiredRatio) {
            canvas.fitHeight = true;
            canvas.fitWidth = false;
        } else if (deviceRatio < desiredRatio) {
            canvas.fitHeight = false;
            canvas.fitWidth = true;
        }
    },

    moveBackground(dt) {
        // 
        if (!this.isGameOver) {
            let distance = this.backGrSpeed * dt;

            // di chuyển cả 2 backgr
            this.backGr_1.y -= distance;
            this.backGr_2.y -= distance;

            // nếu backGr_1 chạm đáy màn hình
            if (this.backGr_1.y <= -this.backGr_1.height) {
                this.backGr_1.y = this.backGr_2.y + this.backGr_2.height;
            }

            // nếu backGr_2 chạm đáy màn hình
            if (this.backGr_2.y <= -this.backGr_2.height) {
                this.backGr_2.y = this.backGr_1.y + this.backGr_1.height;
            }
        }
    },

    prepareBackGround() {
        // size thiết bị hiện tại
        let screenSize = cc.winSize;

        // size backgr
        let backgroundSize = this.backGr_1.getContentSize();

        // tính toán giá trị lặp
        let repeatX = Math.ceil(screenSize.width / backgroundSize.width);
        let repeatY = Math.ceil(screenSize.height / backgroundSize.height);
        
        // show backgr
        this.backGr_1.active = true;
        this.backGr_2.active = true;

        // đặt giá trị scale cho backgr
        this.backGr_1.setScale(repeatX, repeatY);
        this.backGr_2.setScale(repeatX, repeatY);

        // set vị trí ban đầu của cả 2 backgr
        this.backGr_1.setPosition(cc.v2(0, 0));
        this.backGr_2.setPosition(cc.v2(0, this.backGr_1.height));
    },

    onClickToPlay() {
        //
        // this.introGame();
        this.whenStartGame();
        //
        this.prepareBackGround();
        this.schedule(this.moveBackground, 0);
        // 
        cc.find("Canvas")._children[2].getComponent("Player").isClickToPlay = true;
    },

    whenStartGame() {
        //
        this.backGr_fake.active = false;
        this.btn_click_to_play.active = false;
    },

    introGame() {
        // 
        console.log(`bat dau level ${this.level}`)
        // 
        this.loseBloodBG.active = false;
        this.backGr_1.active = false;
        this.backGr_2.active = false;

        for (let i = 0; i < this.level_text.length; i++) {
            this.level_text[i].active = false;
        }
        // set text for notifying about current level
        this.level_text[this.level - 1].active = true;
        // 
        this.backGr_fake.setPosition(cc.v2(0, 0));
        this.backGr_fake.active = true;
        this.backGr_fake.on(cc.Node.EventType.TOUCH_START, this.onClickToPlay, this)
        // 
        let posX = 0;
        let posY = -(Math.ceil(cc.winSize.height * 1 / 3) + 50);
        // 
        this.btn_click_to_play.setPosition(cc.v2(posX, posY));
        this.btn_click_to_play.active = true;
        this.btn_click_to_play.on(cc.Node.EventType.TOUCH_START, this.onClickToPlay, this)
    },

    whenGameOver() {
        // 
        this.level_text[3].setPosition(cc.v2(0, 0));
        this.level_text[3].active = true;
    },

    onLoad() {
        // 
        this.makeResponsive();
        // muzic
        const playingGameSound = cc.audioEngine.playEffect(this.mainAudio, false);
        cc.audioEngine.setVolume(playingGameSound, 0.4);
        //
        this.isGameOver = false;
        this.isStartGame = false;
        // 
        // tốc độ di chuyển của background
        this.backGrSpeed = 50;
        // 
        this.level = 1;
        this.levelTotal = 3;
    },

    start() {
        //
        this.introGame();
    },

    update(dt) {
        //
        if (this.isGameOver) {
            this.whenGameOver();
        }
        // //
        // if (cc.find("Levels").getComponent("Levels").isPassLevel) {
        //     this.introGame();
        // }
    },
});
