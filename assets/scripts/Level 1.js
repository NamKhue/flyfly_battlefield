cc.Class({
    extends: cc.Component,

    properties: {
        // enemyPrefab: {
        //     default: null,
        //     type: cc.Prefab
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad() {
    //     this.killedEnemyTotal = 39;
    //     this.killedEnemyCount = 0;

    //     this.enemyPool = new cc.NodePool();
    //     const enemyPoolCount = 10;
    //     for (let i = 0; i < enemyPoolCount; i++) {
    //         const enemyInstance = cc.instantiate(this.enemyPrefab);
    //         this.enemyPool.put(enemyInstance);
    //     }
    // },

    // start() {
    //     for (let i = 1; i <= this.killedEnemyTotal; i++) {
    //         let enemy = null;

    //         if (this.enemyPool.size() > 0) {
    //             enemy = this.enemyPool.get();
    //         } else {
    //             enemy = cc.instantiate(this.enemyPrefab);
    //         }

    //         var index = 0;
    //         var x = this.node.position.x;
    //         var y = this.node.position.y;
    //         var angle = 0;

    //         if (i == 1) {
    //             index = 9;
    //         }
    //         else if (i < 10) {
    //             index = 4;

    //             if (i >= 6) {
    //                 x = x - 105 + 30 * i;
    //                 y = y + 215 - 20 * i;
    //             }
    //             else {
    //                 x = x + -15 - 30 * i;
    //                 y = y + 135 - 20 * i;
    //             }
    //         }
    //         else if (i < 16) {
    //             index = 5;

    //             if (i >= 13) {
    //                 x = x + 355 - 20 * i;
    //                 y = y + 300 - 20 * i;
    //             }
    //             else {
    //                 x = x - 295 + 20 * i;
    //                 y = y + 240 - 20 * i;
    //             }
    //         }
    //         else if (i < 24) {
    //             index = 2;

    //             if (i >= 20) {
    //                 angle = 2.55 + i / 9;
    //                 x = x + 200 * Math.cos(angle) + 7;
    //                 y = y + 160 + 200 * Math.sin(angle);

    //             }
    //             else {
    //                 angle = 2.55 + i / 9;
    //                 x = x + 200 * Math.cos(angle) - 7;
    //                 y = y + 160 + 200 * Math.sin(angle);
    //             }
    //         }
    //         else if (i < 32) {
    //             index = 6;

    //             if (i >= 28) {
    //                 angle = 2.55 + i / 9 - 8 / 9;
    //                 x = x + 250 * Math.cos(angle) + 50;
    //                 y = y + 137 + 200 * Math.sin(angle);
    //             }
    //             else {
    //                 angle = 2.55 + i / 9 - 8 / 9;
    //                 x = x + 200 * Math.cos(angle) - 50;
    //                 y = y + 137 + 200 * Math.sin(angle);
    //             }
    //         }
    //         else if (i < 40) {
    //             index = 3;

    //             angle = 2.55 + i / 9 - 16 / 9;
    //             x = x + 175 * Math.cos(angle);
    //             y = y + 30 + 200 * Math.sin(angle);
    //         }

    //         // lấy một animation clip theo index từ danh sách enemyAnimationClip
    //         const animationClip = enemy.getComponent("Enemy").enemyAnimationClip[index];
    //         const animation = enemy.getComponent(cc.Animation);

    //         // console.log(enemy.getComponent("Enemy").enemyAnimationClip[0])

    //         // set clip cho animation clip của prefab enemy
    //         animation.addClip(animationClip, animationClip.name);
    //         animation.play(animationClip.name);

    //         enemy.setPosition(x, y + 200);

    //         // thêm prefab enemy vào scene
    //         cc.find("Canvas").addChild(enemy);
    //     }
    // },

    // ================================================================================================================

    onLoad() {
        this.killedEnemyTotal = 39;
        this.killedEnemyCount = 0;
        
        this.enemyPool = cc.find("Levels").getComponent("Levels").enemyPool;
    },

    start() {
    },
});
