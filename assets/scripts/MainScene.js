cc.Class({
    extends: cc.Component,

    properties: {
        backGr_1: cc.Node,
        backGr_2: cc.Node,
        loseBloodBG: cc.Node,
        textDragToMove: cc.Node,

        mainAudio: {
            default: null,
            type: cc.AudioClip
        },
    },

    moveBackground(dt) {
        // 
        if (!this.gameOver) {
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

    setPositionForBackGround() {
        // size thiết bị hiện tại
        let screenSize = cc.winSize;

        // size backgr
        let backgroundSize = this.backGr_1.getContentSize();

        // tính toán giá trị lặp
        let repeatX = Math.ceil(screenSize.width / backgroundSize.width);
        let repeatY = Math.ceil(screenSize.height / backgroundSize.height);

        // đặt giá trị scale cho backgr
        this.backGr_1.setScale(repeatX, repeatY);
        this.backGr_2.setScale(repeatX, repeatY);

        // set vị trí ban đầu của cả 2 backgr
        this.backGr_1.setPosition(cc.v2(0, 0));
        this.backGr_2.setPosition(cc.v2(0, this.backGr_1.height));
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

    introGame() {
        // 
        let posX = 0;
        let posY = -(Math.ceil(cc.winSize.height * 1 / 3) + 50);
        // 
        cc.find("Canvas").getComponent("MainScene").loseBloodBG.active = false;
        // 
        this.textDragToMove.setPosition(cc.v2(posX, posY));
        cc.find("Canvas").getComponent("MainScene").textDragToMove.active = true;
        // 
        // cc.audioEngine.playEffect(this.mainAudio, true);
        const playingGameSound = cc.audioEngine.playEffect(this.mainAudio, false);
        cc.audioEngine.setVolume(playingGameSound, 0.5);
    },

    onLoad() {
        // 
        this.makeResponsive();
        // tốc độ di chuyển của background
        this.backGrSpeed = 50;
        //
        this.gameOver = false;
        this.level = 1;
        this.levelTotal = 2;
        //
        this.schedule(this.moveBackground, 0);
        //
        this.introGame();
    },

    start() {
        //
        this.setPositionForBackGround();
    },

    update(dt) {
        // //
        // if (this.gameOver) {
        //     const playingGameSound = cc.audioEngine.playEffect(this.mainAudio, false);
        //     cc.audioEngine.setVolume(playingGameSound, 0);
        // }
    },
});
