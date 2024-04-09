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

    displayTextNotifyForSwitchingToNewLevel(currentLevel) {
        // text noti switch to new level
        cc.find("Canvas").getComponent("MainScene").level_text[currentLevel - 1].active = true;
    },

    whenPassLevel() {
        // 
        this.isPassLevel = false;
        // 
        // player
        const playerNode = cc.find("Canvas")._children[2];
        const playerNodeFile = cc.find("Canvas")._children[2].getComponent("Player");

        // set pos
        cc.tween(playerNode)
            .to(1, { position: cc.v2(playerNodeFile.posX, playerNodeFile.posY), easing: 'cubicOut' })
            .start();

        // stop click/hold mouse event
        playerNodeFile.isClickingMouse = false;
        playerNodeFile.isStartGame = false;
        playerNodeFile.isDisappearTextIntro = false;
    },

    passLevel(currentLevel) {
        // increase level
        console.log(`xong level ${currentLevel}`);
        currentLevel += 1;
        cc.find("Canvas").getComponent("MainScene").level += 1;
        //
        this.displayTextNotifyForSwitchingToNewLevel(currentLevel);
        //
        this.whenPassLevel();
        //
        if (currentLevel <= cc.find("Canvas").getComponent("MainScene").levelTotal) {
            // sol 1
            // auto enter new level
            // setTimeout(() => {
            //     // 
            //     cc.find("Canvas")._children[2].getComponent("Player").isDisappearTextIntro = false;
            //     //
            //     this.prepareForNewLevel();
            //     //
            //     this.moveToLevel(currentLevel, cc.find("Levels")._children[currentLevel - 1].getComponent(`Level ${currentLevel}`));
            //     //
            //     cc.find("Canvas").getComponent("MainScene").gameOver = false;
            //     // 
            //     cc.find("Canvas").getComponent("MainScene").level_text[currentLevel - 1].active = false;
            // }, 3000);   
        }
        else {
            cc.find("Canvas").getComponent("MainScene").gameOver = true;
        }
    },

    checkForChangingLevel(currentLevel, currentNodeFile) {
        //
        if (
            // kill all enemies in current level
            currentNodeFile.killedEnemyCount === currentNodeFile.killedEnemyTotal
            // or when the last enemy pass edge of screen
            || this.isPassLevel
        ) {
            //
            this.passLevel(currentLevel);
        }
    },

    level_1(currentNodeFile) {
        // 
        this.howManyBulletsCanKillEnemy = 3;
        //
        for (let i = 1; i <= currentNodeFile.killedEnemyTotal; i++) {
            let enemy = null;

            if (this.enemyPool.size() > 0) {
                enemy = this.enemyPool.get();
            } else {
                enemy = cc.instantiate(this.enemyPrefab);
            }

            let index = 0;
            let timeDelay = 0;
            let x = currentNodeFile.node.position.x;
            let y = currentNodeFile.node.position.y;
            let angle = 0;

            if (i == 1) {
                index = 9;
                timeDelay = 10;
            }
            else if (i < 10) {
                index = 4;
                timeDelay = 5;

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
                timeDelay = -10;

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
                timeDelay = -5;

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
                timeDelay = 2;

                angle = 2.55 + i / 9 - 16 / 9;
                x = x + 175 * Math.cos(angle);
                y = y + 30 + 200 * Math.sin(angle);
            }

            // lấy một animation clip theo index từ danh sách enemyAnimationClip
            const animationClip = enemy.getComponent("Enemy").enemyAnimationClip[index];
            const animation = enemy.getComponent(cc.Animation);

            // set clip cho animation clip của prefab enemy
            animation.addClip(animationClip, animationClip.name);
            animation.play(animationClip.name);

            // enemy.setPosition(x, y + 200);
            enemy.setPosition(x, y + 600);

            // thêm prefab enemy vào scene
            cc.find("Canvas").addChild(enemy);

            // vận tốc
            const speed = this.enemySpeed;
            const duration = (35 + timeDelay) / speed;

            const moveAction = cc.sequence(
                cc.moveTo(duration, cc.v2(x, y + 200)),
                cc.callFunc(() => {})
            );
            enemy.runAction(moveAction);
        }
    },

    level_2(currentNodeFile) {
        // 
        this.howManyBulletsCanKillEnemy = 2;
        //
        const screenHeight = cc.winSize.height;

        for (let i = 0; i < currentNodeFile.typeOfEnemy; i++) {
            let index = i;

            for (let j = 1; j <= currentNodeFile.rowTotal; j++) {
                let y = screenHeight / 2 + 20 * ((i - 1) * currentNodeFile.rowTotal + j - 1);

                for (let k = 1; k <= currentNodeFile.colTotal; k++) {
                    if (this.enemyPool.size() > 0) {
                        enemy = this.enemyPool.get();
                    } else {
                        enemy = cc.instantiate(this.enemyPrefab);
                    }

                    let x = (k - 2) * 30 - 60;
                    // let x = (k - 2) * 10;

                    if (i == currentNodeFile.typeOfEnemy - 1) {
                        enemy.setScale(0.25);

                        x = (k - 3) * 35 - 60;
                        // x = (k - 3) * 35 + 30;
                    }

                    const animation = enemy.getComponent(cc.Animation);
                    const animationClip = enemy.getComponent("Enemy").enemyAnimationClip[index];
                    animation.addClip(animationClip, animationClip.name);
                    animation.play(animationClip.name);

                    enemy.setPosition(x, y);

                    cc.find("Canvas").addChild(enemy);

                    // vận tốc
                    const speed = this.enemySpeed;
                    const duration = (y + 10) / speed;

                    const moveAction = cc.sequence(
                        cc.moveTo(duration, cc.v2(x, -cc.winSize.height + 300)),
                        cc.callFunc(() => {
                            this.enemyPool.put(enemy);
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

    level_3(currentNodeFile) {
        // currentNodeFile.generateLevel();

        cc.find("Canvas")._children[3].getComponent("Boss").generateLevel();
    },

    moveToLevel(currentLevel, currentNodeFile) {
        // 
        if (currentLevel == 1) {
            this.level_1(currentNodeFile);
        }
        else if (currentLevel == 2) {
        // if (currentLevel == 1) {
            this.level_2(currentNodeFile);
        }
        else if (currentLevel == 3) {
        // if (currentLevel == 1) {
            this.level_3(currentNodeFile);
        }
        // 
        this.enemyTotal = currentNodeFile.killedEnemyTotal;
    },

    clickToStartGameWithNewLevel() {
        // sol 2
        // non auto enter
        // need player click mouse to start new level
        //
        let currentLevel = cc.find("Canvas").getComponent("MainScene").level;
        //
        this.moveToLevel(currentLevel, cc.find("Levels")._children[currentLevel - 1].getComponent(`Level ${currentLevel}`));
        // 
        cc.find("Canvas").getComponent("MainScene").level_text[currentLevel - 1].active = false;
    },

    nonShowLevelText() {
        let currentLevel = cc.find("Canvas").getComponent("MainScene").level;
        //
        if (
            cc.find("Canvas")._children[2].getComponent("Player").isClickingMouse 
            && cc.find("Canvas")._children[2].getComponent("Player").isStartGame 
            && cc.find("Canvas")._children[2].getComponent("Player").isDisappearTextIntro
            && cc.find("Canvas").getComponent("MainScene").level_text[currentLevel - 1].active == true
        ) {
            // 
            setTimeout(() => {}, 2000);

            // 
            cc.find("Canvas").getComponent("MainScene").level_text[currentLevel - 1].active = false;

            // clickToStartGameWithNewLevel
            this.clickToStartGameWithNewLevel();
        }
    },

    checkTheLastEnemyPassThroughBottomEdgeOfScreen(dt) {
        if (
            cc.find("Canvas")._children[2].getComponent("Player").isStartGame
        ) {
            //
            this.checkCooldownCount += dt;
            //
            if (
                // !this.isPassLevel
                this.checkCooldownCount >= this.checkCooldown
            ) {
                // 
                this.checkCooldownCount = 0;
                // 
                let index = cc.find("Canvas")._children.length - 1;
                
                if (this.enemyTotal > 0) {
                    //
                    while (cc.find("Canvas")._children[index].name != 'enemy') {
                        index--;
                    }
                    //
                    if (cc.find("Canvas")._children[index].y < -300) {
                        //
                        this.isPassLevel = true;
                        //
                        const currentLevel = cc.find("Canvas").getComponent("MainScene").level;
                        this.passLevel(currentLevel);
                    }
                }
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 
        this.initializeEnemyPool();
        //
        this.enemySpeed = 70;
        // 
        this.isPassLevel = false;
        
        // khoảng thời gian cooldown giữa các lần kiểm tra vị trí của con quái cuối cùng
        this.checkCooldown = 3;
        this.checkCooldownCount = 0;
        //
        this.howManyBulletsCanKillEnemy = 4;
    },

    start () {
        // 
        let currentLevel = cc.find("Canvas").getComponent("MainScene").level;
        // 
        this.displayTextNotifyForSwitchingToNewLevel(currentLevel);
    },

    update(dt) {
        // non show text switch level
        this.nonShowLevelText();

        // when last enemy pass through bottom edge of screen
        this.checkTheLastEnemyPassThroughBottomEdgeOfScreen(dt);
    }
});
