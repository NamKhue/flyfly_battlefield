cc.Class({
    extends: cc.Component,

    properties: {
    },

    onCollisionEnter(other, self) {
        // 
        if (other.node.name === 'enemy') {
            // return bullet to node pool
            self.node.destroy();
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },

    start() {
    },

    update (dt) {
        // when switch to new level
        if (cc.find("Levels").getComponent("Levels").isPassLevel) {
            this.node.destroy();
        }

        // when pass the top edge of screen
        if (this.node.y > cc.winSize.height) {
            this.node.destroy();
        }
    },
});
