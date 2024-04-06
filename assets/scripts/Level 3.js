cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:
    
    onLoad() {
        // this.rowTotal = 3;
        // this.colTotal = 4;
        // this.typeOfEnemy = 10;
        
        this.rowTotal = 7;
        this.colTotal = 5;
        this.typeOfEnemy = 10;

        this.killedEnemyTotal = this.rowTotal * this.colTotal * this.typeOfEnemy;
        this.killedEnemyCount = 0;

        this.enemySpeed = 30;

        this.enemyPool = cc.find("Levels").getComponent("Levels").enemyPool;
    },

    start() {},

});