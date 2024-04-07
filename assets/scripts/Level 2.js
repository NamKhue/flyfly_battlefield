cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:
    
    onLoad() {
        // this.rowTotal = 3;
        // this.colTotal = 4;
        // this.typeOfEnemy = 10;
        
        this.rowTotal = 3;
        this.colTotal = 7;
        this.typeOfEnemy = 10;

        this.killedEnemyTotal = this.rowTotal * this.colTotal * this.typeOfEnemy;
        this.killedEnemyCount = 0;

        this.enemyPool = cc.find("Levels").getComponent("Levels").enemyPool;
    },

    start() {},

});