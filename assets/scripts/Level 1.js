cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.killedEnemyTotal = 39;
        this.killedEnemyCount = 0;
        
        this.enemyPool = cc.find("Levels").getComponent("Levels").enemyPool;
    },

    start() {
    },
});
