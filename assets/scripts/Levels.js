cc.Class({
    extends: cc.Component,

    properties: {
        enemyPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    initializeEnemyPool() {
        this.enemyPool = new cc.NodePool();
        const enemyPoolCount = 10;
        for (let i = 0; i < enemyPoolCount; i++) {
            const enemyInstance = cc.instantiate(this.enemyPrefab);
            this.enemyPool.put(enemyInstance);
        }
    },

    whenPassLevel() {
        // 
        this.isPassLevel = true;
        // 
        // player
        const playerNode = cc.find("Canvas")._children[2];

        // set pos
        cc.tween(playerNode)
            .to(1, { position: cc.v2(playerNode.getComponent("Player").posX, playerNode.getComponent("Player").posY), easing: 'cubicOut' })
            .start();

        // stop click/hold mouse event
        playerNode.getComponent("Player").isClickingMouse = false;
        
        cc.find("Canvas").off(cc.Node.EventType.TOUCH_START, playerNode.getComponent("Player").onMouseDown, playerNode.getComponent("Player"));
        cc.find("Canvas").off(cc.Node.EventType.TOUCH_END, playerNode.getComponent("Player").onMouseUp, playerNode.getComponent("Player"));
        cc.find("Canvas").off(cc.Node.EventType.TOUCH_MOVE, playerNode.getComponent("Player").onMouseMove, playerNode.getComponent("Player"));
    },

    prepareForNewLevel() {
        // 
        this.isPassLevel = false;
        // 
        // player
        const playerNode = cc.find("Canvas")._children[2];

        // turn on event
        cc.find("Canvas").on(cc.Node.EventType.TOUCH_START, playerNode.getComponent("Player").onMouseDown, playerNode.getComponent("Player"));
        cc.find("Canvas").on(cc.Node.EventType.TOUCH_END, playerNode.getComponent("Player").onMouseUp, playerNode.getComponent("Player"));
        cc.find("Canvas").on(cc.Node.EventType.TOUCH_MOVE, playerNode.getComponent("Player").onMouseMove, playerNode.getComponent("Player"));
    },

    checkForChangingLevel(currentLevel, currentNodeFile) {

        if (
            currentNodeFile.killedEnemyCount === currentNodeFile.killedEnemyTotal
            // last enemies pass edge of screen
            // need a boolean variable
        ) {
            //
            this.whenPassLevel();
            //
            console.log(`xong level ${currentLevel}`);
            currentLevel += 1;
            cc.find("Canvas").getComponent("MainScene").level += 1;
            //
            if (currentLevel < 3) {
                setTimeout(() => {
                    //
                    this.prepareForNewLevel();
                    //
                    this.moveToLevel(currentLevel, cc.find("Levels")._children[currentLevel - 1].getComponent(`Level ${currentLevel}`));
                    //
                    cc.find("Canvas").getComponent("MainScene").gameOver = false;
                }, 3000);
            }
            else {
                cc.find("Canvas").getComponent("MainScene").gameOver = true;
            }
        }
    },

    level_1(currentNodeFile) {
        for (let i = 1; i <= currentNodeFile.killedEnemyTotal; i++) {
            let enemy = null;

            if (this.enemyPool.size() > 0) {
                enemy = this.enemyPool.get();
            } else {
                enemy = cc.instantiate(this.enemyPrefab);
            }

            var index = 0;
            var x = currentNodeFile.node.position.x;
            var y = currentNodeFile.node.position.y;
            var angle = 0;

            if (i == 1) {
                index = 9;
            }
            else if (i < 10) {
                index = 4;

                if (i >= 6) {
                    x = x - 105 + 30 * i;
                    y = y + 215 - 20 * i;
                }
                else {
                    x = x + -15 - 30 * i;
                    y = y + 135 - 20 * i;
                }
            }
            else if (i < 16) {
                index = 5;

                if (i >= 13) {
                    x = x + 355 - 20 * i;
                    y = y + 300 - 20 * i;
                }
                else {
                    x = x - 295 + 20 * i;
                    y = y + 240 - 20 * i;
                }
            }
            else if (i < 24) {
                index = 2;

                if (i >= 20) {
                    angle = 2.55 + i / 9;
                    x = x + 200 * Math.cos(angle) + 7;
                    y = y + 160 + 200 * Math.sin(angle);

                }
                else {
                    angle = 2.55 + i / 9;
                    x = x + 200 * Math.cos(angle) - 7;
                    y = y + 160 + 200 * Math.sin(angle);
                }
            }
            else if (i < 32) {
                index = 6;

                if (i >= 28) {
                    angle = 2.55 + i / 9 - 8 / 9;
                    x = x + 250 * Math.cos(angle) + 50;
                    y = y + 137 + 200 * Math.sin(angle);
                }
                else {
                    angle = 2.55 + i / 9 - 8 / 9;
                    x = x + 200 * Math.cos(angle) - 50;
                    y = y + 137 + 200 * Math.sin(angle);
                }
            }
            else if (i < 40) {
                index = 3;

                angle = 2.55 + i / 9 - 16 / 9;
                x = x + 175 * Math.cos(angle);
                y = y + 30 + 200 * Math.sin(angle);
            }

            // lấy một animation clip theo index từ danh sách enemyAnimationClip
            const animationClip = enemy.getComponent("Enemy").enemyAnimationClip[index];
            const animation = enemy.getComponent(cc.Animation);

            // console.log(enemy.getComponent("Enemy").enemyAnimationClip[0])

            // set clip cho animation clip của prefab enemy
            animation.addClip(animationClip, animationClip.name);
            animation.play(animationClip.name);

            enemy.setPosition(x, y + 200);

            // thêm prefab enemy vào scene
            cc.find("Canvas").addChild(enemy);
        }
    },

    level_2(currentNodeFile) {
        const screenHeight = cc.winSize.height;

        for (let i = 0; i < currentNodeFile.typeOfEnemy; i++) {
            var index = i;

            for (let j = 1; j <= currentNodeFile.rowTotal; j++) {
                var y = screenHeight / 2 + 20 * ((i - 1) * currentNodeFile.rowTotal + j - 1);

                for (let k = 1; k <= currentNodeFile.colTotal; k++) {
                    if (this.enemyPool.size() > 0) {
                        enemy = this.enemyPool.get();
                    } else {
                        enemy = cc.instantiate(this.enemyPrefab);
                    }

                    // var x = (k - 2) * 30 - 60;
                    var x = (k - 2) * 10;

                    if (i == currentNodeFile.typeOfEnemy - 1) {
                        enemy.setScale(0.25);

                        // x = (k - 3) * 35 - 60;
                        x = (k - 3) * 35 + 30;
                    }

                    const animation = enemy.getComponent(cc.Animation);
                    const animationClip = enemy.getComponent("Enemy").enemyAnimationClip[index];
                    animation.addClip(animationClip, animationClip.name);
                    animation.play(animationClip.name);

                    // animation.speed = 0.08;

                    enemy.setPosition(x, y);
                    // enemy.angle = 0;

                    cc.find("Canvas").addChild(enemy);

                    // vận tốc
                    const speed = currentNodeFile.enemySpeed;
                    const duration = (y + 10) / speed;

                    const moveAction = cc.sequence(
                        cc.moveTo(duration, cc.v2(x, -y - 500)),
                        cc.callFunc(() => {
                            // this.enemyPool.put(enemy);
                        })
                    );

                    enemy.runAction(moveAction);
                }

                if (i === 10) {
                    break;
                }
            }
        }
    },

    moveToLevel(currentLevel, currentNodeFile) {

        // console.log(currentNodeFile);
        // console.log(currentNodeFile.killedEnemyTotal);

        if (currentLevel == 1) {
            this.level_1(currentNodeFile);
        }
        else if (currentLevel == 2) {
        // if (currentLevel == 1) {
            this.level_2(currentNodeFile);
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 
        this.initializeEnemyPool();
        // 
        this.isPassLevel = false;
    },

    start () {
        // 
        this.moveToLevel(
            cc.find("Canvas").getComponent("MainScene").level,
            cc.find("Levels")._children[0].getComponent(`Level 1`)
        );
    },
});