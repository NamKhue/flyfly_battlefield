cc.Class({
    extends: cc.Component,

    properties: {
    },

    generateLevel() {
        // const boss = cc.find("Canvas")._children[3];

        this.node.setScale(.5);

        const screenHeight = cc.winSize.height;
        this.node.setPosition(0, screenHeight * 1 / 3);
        this.originalPosition = this.node.position; // Lưu vị trí ban đầu của boss

        const spine = this.node.getComponent(sp.Skeleton);

        spine.setAnimation(0, 'idle_offset', false);
        spine.setCompleteListener((trackEntry, loopCount) => {
            if (trackEntry.animation.name === 'idle_offset') {
                this.moveDown();
            } else if (trackEntry.animation.name === 'Attack 1_offset') {
                this.moveUp();
            } else if (trackEntry.animation.name === 'Attack 2_offset') {
                this.moveUp();
            }
        });
    },

    moveDown() {
        const moveDownAction = cc.moveBy(0.1, cc.v2(0, -40)); // Di chuyển xuống một đoạn

        const combinedAction = cc.sequence(
            moveDownAction,
            cc.callFunc(() => {
                const spine = this.node.getComponent(sp.Skeleton);
                if (this.index === 1) {
                    spine.setAnimation(0, 'Attack 1_offset', false); // Thực hiện animation 1
                    this.index = 2;
                } else {
                    spine.setAnimation(0, 'Attack 2_offset', false); // Thực hiện animation 2
                    this.index = 1;
                }
            })
        );

        this.node.runAction(combinedAction);
    },

    moveUp() {
        const moveUpAction = cc.moveTo(0.1, this.originalPosition); // Di chuyển trở lại vị trí ban đầu

        const combinedAction = cc.sequence(
            moveUpAction,
            cc.callFunc(() => {
                const spine = this.node.getComponent(sp.Skeleton);
                spine.setAnimation(0, 'idle_offset', false); // Thực hiện animation idle_offset

            }),

        );

        this.node.runAction(combinedAction);
    },

    onCollisionEnter(other, self) {
        if (other.node.name == 'player' || other.node.name == 'bullet') {
            // turn to color red
            console.log('boss va cham voi dan duoc hoac nguoi choi')
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    start () {

    },

    // update (dt) {},
});
