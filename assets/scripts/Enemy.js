cc.Class({
    extends: cc.Component,

    properties: {
        enemyAnimationClip: [cc.AnimationClip],

        explosionAnimationClip: [cc.AnimationClip],
        explosionPrefab: cc.Prefab,
        
        itemsPrefab: [cc.Prefab],
    },

    initializeExplosionPool() {
        this.explosionPool = new cc.NodePool();
        const explosionAmount = 10;
        
        for (let i = 0; i < explosionAmount; i++) {
            const explosion = cc.instantiate(this.explosionPrefab);
            this.explosionPool.put(explosion);
        }
    },

    initializePowerItemPool() {
        this.powerItemPool = new cc.NodePool();
        const powerItemAmount = 10;
        
        for (let i = 0; i < powerItemAmount; i++) {
            const powerItem = cc.instantiate(this.speedUpItemPrefab);
            this.powerItemPool.put(powerItem);
        }
    },

    createPowerItem() {
        //
        this.isCreatingItem = true;
        //
        const playerNode = cc.find("Canvas")._children[2];
        const playerNodeFile = playerNode.getComponent("Player");
        //
        const canvasNode = cc.find("Canvas");
        //
        if (!playerNodeFile.existedTypeOfItems[playerNodeFile.existedTypeOfItems.length - 1]) {
            const randomChoosingTimeToRenderItem = Math.floor(Math.random() * 1000);

            // if (randomChoosingTimeToRenderItem % 3 === 0 && randomChoosingTimeToRenderItem % 9 === 0) {
            // if (randomChoosingTimeToRenderItem % 7 === 0 && randomChoosingTimeToRenderItem % 4 === 0) {
            if (randomChoosingTimeToRenderItem % 7 === 0) {
                // should random from list of prefabs
                let randomIndexInItemsArray = Math.floor(Math.random() * this.itemsPrefab.length);

                //
                if (!playerNodeFile.existedTypeOfItems[randomIndexInItemsArray]) {
                    // 
                    let powerItem = cc.instantiate(this.itemsPrefab[randomIndexInItemsArray]);

                    // rotate circle around item
                    const rotateAction = cc.repeatForever(cc.rotateBy(1, 360));
                    powerItem.children[1].runAction(rotateAction);
                    // 
                    powerItem.setPosition(this.node.position.x, this.node.position.y);
                    canvasNode.addChild(powerItem);
                    // 
                    const duration = (canvasNode.height - this.node.position.y) / 120;
                    const moveAction = cc.sequence(
                        cc.moveBy(
                            duration,
                            cc.v2(0, -(canvasNode.height - this.node.position.y)),
                        ),
                        cc.callFunc(() => {
                            // this.powerItemPool.put(powerItem);
                            powerItem.destroy();
                        })
                    );
                    powerItem.runAction(moveAction);
                }
            }
        }
        //
        this.isCreatingItem = false;
    },

    effectExplosion(isDead) {
        // hieu ung no
        let explosion = null;
        if (this.explosionPool.size() > 0) {
            explosion = this.explosionPool.get();
        } else {
            explosion = cc.instantiate(this.explosionPrefab);
        }
        // 
        let indexChoosingHowToExplode = 0;
        if (isDead) {
            indexChoosingHowToExplode = 1;
        }
        // 
        const animationExplosion = explosion.getComponent(cc.Animation);
        const clipExplosion = this.explosionAnimationClip[indexChoosingHowToExplode];
        animationExplosion.addClip(clipExplosion, clipExplosion.name);
        animationExplosion.play(clipExplosion.name);
        explosion.setPosition(this.node.position.x, this.node.position.y);
        // 
        cc.find("Canvas").addChild(explosion);
        // 
        setTimeout(() => {
            this.explosionPool.put(explosion);
        }, clipExplosion._duration * 1000 + 10);
    },

    collideAndEnemyDead(other, self) {
        // 
        this.createPowerItem();
        // 
        const currentLevel = cc.find("Canvas").getComponent("MainScene").level;
        const currentNode = cc.find("Levels")._children[currentLevel - 1];
        const currentNodeFile = currentNode.getComponent(`Level ${currentLevel}`);
        const enemyPool = currentNodeFile.enemyPool;
        
        enemyPool.put(self.node);

        currentNodeFile.killedEnemyCount = enemyPool.size();

        cc.find("Levels").getComponent("Levels").checkForChangingLevel(
            currentLevel,
            currentNodeFile
        );
    },

    onCollisionEnter(other, self) {
        if (cc.find("Canvas").getComponent("MainScene").gameOver == false) {
            // 
            if (
                other.node.name === 'bullet' 
                || other.node.name === 'circle around bullet'
            ) {
                // 
                this.eachEnemyHitCount++;

                // số viên đạn va vào quái mà có thể giết quái - enemy
                if (this.eachEnemyHitCount < cc.find("Levels").getComponent("Levels").howManyBulletsCanKillEnemy) {
                    // 
                    this.effectExplosion(false);
                } 
                else {
                    // 
                    this.eachEnemyHitCount = 0;
                    // 
                    this.effectExplosion(true);
                    // 
                    this.collideAndEnemyDead(other, self);
                }
            }
            // 
            if (other.node.name === 'player') {
                // 
                this.effectExplosion(true);
                // 
                this.collideAndEnemyDead(other, self);
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;

        // // Enabled draw collider
        // manager.enabledDebugDraw = true;
        // // Enabled draw collider bounding box
        // manager.enabledDrawBoundingBox = true;

        //
        // this.initializePowerItemPool();
        this.initializeExplosionPool();
        //
        this.killedEnemyTotal = 0;
        
        // đếm số lần quái va chạm với đạn
        this.eachEnemyHitCount = 0;
        //
        this.isCreatingItem = false;
        
        // khoảng thời gian cooldown giữa các lần kiểm tra vị trí của con quái cuối cùng
        this.checkCooldown = 1;
        this.checkCooldownCount = 0;
    },

    start() {
        // console.log(cc.find("Canvas")._children[2].getComponent("Player"))
        // console.log(cc.find("Canvas")._children[2].getComponent("Player").collideEnemy)
        // // console.log(cc.find("Canvas")._children[2].getComponent("Player").node.width)
        // // console.log(cc.find("Canvas")._children[2].getComponent("Player").node.height)
    },

    // check(dt) {
    //     //
    //     this.checkCooldownCount += dt;
        
    //     if (
    //         this.checkCooldownCount >= this.checkCooldown
    //     ) {
    //         this.checkCooldownCount = 0;
    //         if (
    //             this.node.x + this.node.width / 2 < cc.find("Canvas")._children[2].getComponent("Player").node.x - cc.find("Canvas")._children[2].getComponent("Player").node.width / 2
    //             || this.node.y + this.node.height / 2 < cc.find("Canvas")._children[2].getComponent("Player").node.y - cc.find("Canvas")._children[2].getComponent("Player").node.height / 2
    //             || this.node.x - this.node.width / 2 > cc.find("Canvas")._children[2].getComponent("Player").node.x + cc.find("Canvas")._children[2].getComponent("Player").node.width / 2
    //             || this.node.y - this.node.height / 2 > cc.find("Canvas")._children[2].getComponent("Player").node.y + cc.find("Canvas")._children[2].getComponent("Player").node.height / 2
    //         ) {
    //             cc.find("Canvas")._children[2].getComponent("Player").collideEnemy = false;
    //             console.log("khong")
    //         }
    //         else {
    //             cc.find("Canvas")._children[2].getComponent("Player").collideEnemy = true;
    //             console.log("dang va cham")
    //         }
    //     }
    // },

    update (dt) {
        // // 
        // this.check(dt);
    },
});
