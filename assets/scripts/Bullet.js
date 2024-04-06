cc.Class({
    extends: cc.Component,

    properties: {
    },

    onCollisionEnter(other, self) {
        // 
        if (other.node.name === 'enemy') {
            // 
            // this.schedule(() => {
                // thu đạn về node pool
                self.node.destroy();
            // }, 0.00005);
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
    },
});
