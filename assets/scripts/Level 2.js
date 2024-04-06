cc.Class({
    extends: cc.Component,

    properties: {
        // enemyPrefab: {
        //     default: null,
        //     type: cc.Prefab,
        // },
    },

    // moveToLevel(currentLevel) {

    //     const screenHeight = cc.winSize.height;

    //     for (let i = 0; i < this.typeOfEnemy; i++) {
    //         var index = i;

    //         for (let j = 1; j <= this.rowTotal; j++) {
    //             var y = screenHeight / 2 + 20 * ((i - 1) * this.rowTotal + j - 1);

    //             for (let k = 1; k <= this.colTotal; k++) {
    //                 if (this.enemyPool.size() > 0) {
    //                     enemy = this.enemyPool.get();
    //                 } else {
    //                     enemy = cc.instantiate(this.enemyPrefab);
    //                 }

    //                 const animation = enemy.getComponent(cc.Animation);

    //                 var x = (k - 2) * 30 - 65;

    //                 if (i == this.typeOfEnemy - 1) {
    //                     enemy.setScale(0.25);

    //                     x = (k - 3) * 35 - 45;
    //                 }

    //                 const animationClip = enemy.getComponent("Enemy").enemyAnimationClip[index];
    //                 animation.addClip(animationClip, animationClip.name);
    //                 animation.play(animationClip.name);

    //                 // animation.speed = 0.08;

    //                 enemy.setPosition(x, y);
    //                 // enemy.angle = 0;

    //                 cc.find("Canvas").addChild(enemy);

    //                 // vận tốc
    //                 // const speed = 30;
    //                 const speed = 40;
    //                 // const speed = 50;
    //                 // const speed = 100;
    //                 const duration = (y + 10) / speed;

    //                 const moveAction = cc.sequence(
    //                     cc.moveTo(duration, cc.v2(x, -y - 10)),
    //                     cc.callFunc(() => {})
    //                 );

    //                 enemy.runAction(moveAction);
    //             }

    //             if (i === 10) {
    //                 break;
    //             }
    //         }
    //     }
    // },

    // // LIFE-CYCLE CALLBACKS:

    // onLoad() {
    //     this.rowTotal = 3;
    //     this.colTotal = 2;
    //     this.typeOfEnemy = 10;

    //     this.killedEnemyTotal = this.rowTotal * this.colTotal * this.typeOfEnemy;
    //     this.killedEnemyCount = 0;

    //     const levelsNode = cc.find("Levels");
    //     const level_1_Node = levelsNode._children[0];
    //     this.enemyPool = level_1_Node.getComponent(`Level 1`).enemyPool;

    //     console.log(this.enemyPool.size());
    // },
    
    // ================================================================================================================
    
    onLoad() {
        // this.rowTotal = 3;
        // this.colTotal = 4;
        // this.typeOfEnemy = 10;
        
        this.rowTotal = 4;
        this.colTotal = 5;
        this.typeOfEnemy = 10;

        this.killedEnemyTotal = this.rowTotal * this.colTotal * this.typeOfEnemy;
        this.killedEnemyCount = 0;

        this.enemySpeed = 25;

        this.enemyPool = cc.find("Levels").getComponent("Levels").enemyPool;
    },

    start() {},

});