cc.Class({
    extends: cc.Component,

    properties: {
        emptyImagePlayer: {
            default: null,
            type: cc.Node
        },

        bulletPrefabs: [cc.Prefab],

        // bulletPrefab: {
        //     default: null,
        //     type: cc.Prefab
        // },
        bulletAudio: {
            default: null,
            type: cc.AudioClip
        },

        playerAnimationClip: [cc.AnimationClip],

        explosionAnimationClip: [cc.AnimationClip],
        explosionPrefab: cc.Prefab,
    },

    initializeBulletPool() {
        // 
        this.bulletPool = new cc.NodePool();
        this.circleBulletPool = new cc.NodePool();
        // 
        const bulletCount = 10;

        for (let i = 0; i < bulletCount; i++) {
            const bullet = cc.instantiate(this.bulletPrefabs[0]);
            // đưa đạn vào node pool
            this.bulletPool.put(bullet);
        }

        for (let i = 0; i < bulletCount; i++) {
            const circleBullet = cc.instantiate(this.bulletPrefabs[1]);
            // đưa đạn vào node pool
            this.circleBulletPool.put(circleBullet);
        }
    },

    onCollisionEnter(other, self) {
        if (other.node.name === 'enemy') {
            // console.log("va vao enemy");

            // stop game or reduce HP
            // this.gameOver = true;
            // this.collideEnemy = true;
        }
    },

    onMouseDown(event) {
        // bắt đầu chơi
        if (cc.find("Canvas").getComponent("MainScene").level == 1 && !this.isStartGame) {
            this.isStartGame = true;
        }

        // Lấy vị trí chuột trong không gian world
        const mousePos = event.getLocation();

        // Chuyển đổi vị trí chuột thành vị trí trong không gian local của khẩu súng
        const localPos = this.node.parent.convertToNodeSpaceAR(mousePos);

        // Di chuyển khẩu súng tới vị trí chuột
        this.node.position = localPos;

        // người chơi đang click
        this.isClickingMouse = true;

        // this.schedule(this.shoot, this.shootCooldown);
    },

    onMouseUp(event) {
        // người chơi khong còn click
        this.isClickingMouse = false;

        // this.unschedule(this.shoot);
    },

    onMouseMove(event) {
        // Lấy vị trí chuột trong không gian world
        const mousePos = event.getLocation();

        // Chuyển đổi vị trí chuột thành vị trí trong không gian local của khẩu súng
        const localPos = this.node.parent.convertToNodeSpaceAR(mousePos);

        // Di chuyển khẩu súng tới vị trí chuột
        this.node.position = localPos;
    },

    registerMouseEvents() {
        cc.find("Canvas").on(cc.Node.EventType.TOUCH_START, this.onMouseDown, this);
        cc.find("Canvas").on(cc.Node.EventType.TOUCH_END, this.onMouseUp, this);
        cc.find("Canvas").on(cc.Node.EventType.TOUCH_MOVE, this.onMouseMove, this);
    },

    un_registerMouseEvents() {
        cc.find("Canvas").off(cc.Node.EventType.TOUCH_START, this.onMouseDown, this);
        cc.find("Canvas").off(cc.Node.EventType.TOUCH_END, this.onMouseUp, this);
        cc.find("Canvas").off(cc.Node.EventType.TOUCH_MOVE, this.onMouseMove, this);
    },

    shoot() {
        if (!this.isClickingMouse || this.gameOver) {
            return;
        }
        // 
        const bulletSound = cc.audioEngine.playEffect(this.bulletAudio, false);
        cc.audioEngine.setVolume(bulletSound, 0.2);
        // 
        // change amount of bullets here
        this.initializeGun();
    },

    initializeGun() {
        if (!this.upgradeGun[0]) {
            this.normalGun();
        }
        else {
            if (!this.upgradeGun[1]) {
                this.updatedGunWithNormalSpaceship();
            }
            else {
                this.updatedGunWithSuperSpaceship();
            }
        }
    },

    updatedGunWithSuperSpaceship() {
        // 
        for (let i = 0; i < 2; i++) {
            // declare
            let circleBullet = null;

            // choose type bullet
            var type = 'circle'

            if (this.circleBulletPool.size() > 0) {
                circleBullet = this.circleBulletPool.get();
            } else {
                circleBullet = cc.instantiate(this.bulletPrefabs[1]);
            }

            // thêm đạn vào mainscene
            this.node.parent.addChild(circleBullet);

            // change pos for each bullet
            var newPosition;
            if (i == 0) { newPosition = cc.v2(this.node.position.x - 20, this.node.position.y + 45); }
            if (i == 1) { newPosition = cc.v2(this.node.position.x + 20, this.node.position.y + 45); }
            // 
            var circleBulletScale = 0.25
            circleBullet.setScale(cc.v2(circleBulletScale, circleBulletScale));
            circleBullet.setPosition(newPosition);

            cc.tween(circleBullet)
                .to(0, { scale: circleBulletScale } )
                .to(1, { scale: 1.4 } )
                .start();

            // lấy kích thước màn hình
            const screenSize = cc.winSize;

            // tính toán thời gian di chuyển của đạn để đạt tới đỉnh màn hình
            const duration = screenSize.height / this.bulletMovingSpeed;

            // 
            const moveAction = cc.sequence(
                cc.moveBy(duration, cc.v2(0, screenSize.height)),
                cc.callFunc(() => {
                    this.circleBulletPool.put(circleBullet);
                })
            );
            circleBullet.runAction(moveAction);
        }

        for (let i = 0; i < 7; i++) {
            // declare
            let bullet = null;

            // choose type bullet
            var type = 'circle'

            if (this.bulletPool.size() > 0) {
                bullet = this.bulletPool.get();
            } else {
                bullet = cc.instantiate(this.bulletPrefabs[0]);
            }

            // thêm đạn vào mainscene
            this.node.parent.addChild(bullet);

            // change pos for each bullet
            var newPosition = cc.v2(this.node.position.x, this.node.position.y + 55);
            // if (i == 0) { newPosition = cc.v2(this.node.position.x - 25 + i * 8, this.node.position.y + 55); }
            if (i == 0 || i == 1 || i == 2) { newPosition = cc.v2(this.node.position.x - 20 + i * 5, this.node.position.y + 55); }
            // if (i == 3) { newPosition = cc.v2(this.node.position.x, this.node.position.y + 55); }
            if (i == 4 || i == 5 || i == 6) { newPosition = cc.v2(this.node.position.x - 5 + (i - 1) * 5, this.node.position.y + 55); }
            // if (i == 6) { newPosition = cc.v2(this.node.position.x - 15 + (i - 1) * 8, this.node.position.y + 55); }
            // 
            var bulletScale = 0.9
            bullet.setScale(cc.v2(bulletScale, bulletScale));
            bullet.setPosition(newPosition);

            cc.tween(bullet)
                .to(0, { scale: bulletScale } )
                .to(1, { scale: 1.5 } )
                .start();

            // if (i == 0 || i == 1 || i == 2) {
            //     cc.tween(bullet)
            //         .to(0, { position: cc.v2(this.node.position.x , this.node.position.y + 55) } )
            //         .to(0, { position: cc.v2(this.node.position.x - 20 + i * 5, this.node.position.y + 55) } )
            //         .start();
            // }
            // if (i == 4 || i == 5 || i == 6) {
            //     cc.tween(bullet)
            //         .to(0, { position: cc.v2(this.node.position.x, this.node.position.y + 55) } )
            //         .to(0, { position: cc.v2(this.node.position.x - 5 + (i - 1) * 5, this.node.position.y + 55) } )
            //         .start();
            // }

            // lấy kích thước màn hình
            const screenSize = cc.winSize;

            // tính toán thời gian di chuyển của đạn để đạt tới đỉnh màn hình
            const duration = screenSize.height / this.bulletMovingSpeed;
            // const duration = this.bulletMovingSpeed;

            // tạo action di chuyển cho đạn
            const moveAction = cc.sequence(
                cc.moveBy(duration, cc.v2(0, screenSize.height)),
                cc.callFunc(() => {
                    // thu lại đạn cho vào trong node pool
                    this.bulletPool.put(bullet);
                })
            );
            bullet.runAction(moveAction);
        }
    },

    updatedGunWithNormalSpaceship() {
        // 
        for (let i = 0; i < 7; i++) {
            // declare
            let bullet = null;

            // choose type bullet
            var type = 'circle'

            if (this.bulletPool.size() > 0) {
                bullet = this.bulletPool.get();
            } else {
                bullet = cc.instantiate(this.bulletPrefabs[0]);
            }

            // change pos for each bullet
            var newPosition = cc.v2(this.node.position.x - 25 + i * 8, this.node.position.y + 50);
            if (i == 1 || i == 2) { newPosition = cc.v2(this.node.position.x - 20 + i * 5, this.node.position.y + 55); }
            if (i == 3) { newPosition = cc.v2(this.node.position.x, this.node.position.y + 50); }
            if (i == 4 || i == 5) { newPosition = cc.v2(this.node.position.x - 5 + (i - 1) * 5, this.node.position.y + 55); }
            if (i == 6) { newPosition = cc.v2(this.node.position.x - 15 + (i - 1) * 8, this.node.position.y + 50); }
            // 
            bullet.setPosition(newPosition);

            // thêm đạn vào mainscene
            this.node.parent.addChild(bullet);

            // lấy kích thước màn hình
            const screenSize = cc.winSize;

            // tính toán thời gian di chuyển của đạn để đạt tới đỉnh màn hình
            const duration = screenSize.height / this.bulletMovingSpeed;
            // const duration = this.bulletMovingSpeed;

            // tạo action di chuyển cho đạn
            const moveAction = cc.sequence(
                cc.moveBy(duration, cc.v2(0, screenSize.height)),
                cc.callFunc(() => {
                    // thu lại đạn cho vào trong node pool
                    this.bulletPool.put(bullet);
                })
            );

            // 
            bullet.runAction(moveAction);
        }
    },

    normalGun() {
        //
        for (let i = 0; i < 4; i++) {
            // declare
            let bullet = null;

            // choose type bullet
            var type = 'circle'

            if (this.bulletPool.size() > 0) {
                bullet = this.bulletPool.get();
            } else {
                bullet = cc.instantiate(this.bulletPrefabs[0]);
            }

            // change pos for each bullet
            var newPosition = cc.v2(this.node.position.x - 15 + i * 5, this.node.position.y + 55);
            if (i == 2)
                newPosition = cc.v2(this.node.position.x - 40 + i * 25, this.node.position.y + 55);
            else if (i == 3)
                newPosition = cc.v2(this.node.position.x - 40 + (i - 1) * 25 + 5, this.node.position.y + 55);
            // 
            bullet.setPosition(newPosition);

            // thêm đạn vào mainscene
            this.node.parent.addChild(bullet);

            // lấy kích thước màn hình
            const screenSize = cc.winSize;

            // tính toán thời gian di chuyển của đạn để đạt tới đỉnh màn hình
            const duration = screenSize.height / this.bulletMovingSpeed;

            // tạo action di chuyển cho đạn
            const moveAction = cc.sequence(
                cc.moveBy(duration, cc.v2(0, screenSize.height)),
                cc.callFunc(() => {
                    // thu lại đạn cho vào trong node pool
                    this.bulletPool.put(bullet);
                })
            );

            // 
            bullet.runAction(moveAction);
        }
    },

    createAnimationForPlayer(type) {
        const animation = this.node.getComponent(cc.Animation);

        if (animation.getClips().length > 0) {
            for (var i = 0; i < animation.getClips().length; i++) {
                animation.removeClip(animation.getClips()[i], true);
            }
        }

        var indexChoosingTypeOfPlayer = 0;
        if (type == 'super') {
            indexChoosingTypeOfPlayer = 1;

            cc.tween(this.node)
                // .to(this.oldScaleX, { scale: 1 })
                // .to(1, { scale: this.oldScaleX })
                .to(0, { scale: this.oldScaleX })
                .to(0.8, { scale: 1.3 })
                .to(1, { scale: this.oldScaleX })
                .start();
        }

        const animationClip = this.playerAnimationClip[indexChoosingTypeOfPlayer];
        animation.addClip(animationClip, animationClip.name);
        animation.play(animationClip.name);
    },

    initializePlayerPos(posX, posY) {
        // 
        this.node.setPosition(cc.v2(posX, posY - 500));

        cc.tween(this.node)
            .to(1, { position: cc.v2(posX, posY), easing: 'cubicOut' })
            .start();
    },

    initializeExplosionPool() {
        this.explosionPool = new cc.NodePool();
        const explosionAmount = 10;
        for (let i = 0; i < explosionAmount; i++) {
            const explosion = cc.instantiate(this.explosionPrefab);
            this.explosionPool.put(explosion);
        }
    },

    initializePlayer() {
        // // type of power
        // // bonus bullet -> increase number of bullet
        // // shield -> protect blood's player for a while (no need right now)
        // // speedup -> decrease this.shootCooldown
        //
        this.existedTypeOfItems = [
            false, // 0 shield
            false, // 1 bonus bullet
            false, // 2 speed up
            false, // 3 change spaceship
        ]
        // 
        this.node.setScale(cc.v2(0.5, 0.5));
        this.oldScaleX = this.node.scaleX;
        // 
        this.posX = 0;
        this.posY = -(Math.ceil(cc.winSize.height * 1 / 3) - 50);
        // 
        this.createAnimationForPlayer('normal');
        //
        this.initializePlayerPos(this.posX, this.posY);
        // 
        this.initializeBulletPool();
        // 
        this.initializeExplosionPool();
        // 
        this.isStartGame = false;
        this.gameOver = false;
        this.isClickingMouse = false;
        this.isDisappearTextIntro = false;
        // 
        // bool  update or not
        // bool  spaceship is normal or super
        this.upgradeGun = [false, false];
        // 
        this.canShoot = true;
        this.collideEnemy = false;
        // this.collideEnemyDelayTime = 500;
        // this.collideEnemyDelayTimeCount = 0;
        //
        this.playerSpeed = 100;

        // tốc độ di chuyển của đạn
        this.bulletMovingSpeed = 500;

        // khoảng thời gian cooldown giữa các lần bắn
        this.shootCooldown = 0.2;
        this.shootCooldownCount = 0;

        // boolean - player have owned magnet item yet
        // this.ownMagnetItem = true;
    },

    onLoad() {
        // 
        this.initializePlayer();
    },

    start() {
    },

    update(dt) {
        // test area
        // setTimeout(() => {
        //     this.upgradeGun[0] = true
        // }, 5000);

        // setTimeout(() => {
        //     this.createAnimationForPlayer('super');
        //     this.upgradeGun[1] = true
        // }, 5000);

        // setTimeout(() => {
        //     this.createAnimationForPlayer('normal');
        //     this.upgradeGun[0] = false
        //     this.upgradeGun[1] = false
        // }, 5000);




        // shoot cooldown
        if (this.isClickingMouse) {
            this.shootCooldownCount += dt;
            
            if (this.shootCooldownCount >= this.shootCooldown) {
                this.shoot();
                this.shootCooldownCount = 0;
            }
        }

        // register mouse event
        if (this.node.y == this.posY && !this.isDisappearTextIntro) {
            this.isDisappearTextIntro = true;
            this.registerMouseEvents();
        }

        // non show text drag to move
        if (
            this.isStartGame 
            && this.isDisappearTextIntro
            && cc.find("Canvas").getComponent("MainScene").textDragToMove.active == true
        ) {
            cc.find("Canvas").getComponent("MainScene").textDragToMove.active = false;
        }

        // when game is over
        if (cc.find("Canvas").getComponent("MainScene").gameOver == true) {
            // 
            this.gameOver = true;
            // 
            this.un_registerMouseEvents();
        }

        // when player collides enemies
        if (this.collideEnemy == true) {
            //
            // lose blood blinks
            cc.find("Canvas").getComponent("MainScene").loseBloodBG.active = true;
            setTimeout(() => {
                cc.find("Canvas").getComponent("MainScene").loseBloodBG.active = false;
            }, 2000);

            // //
            // // player blinks
            // //
            // if (this.collideEnemyDelayTimeCount < this.collideEnemyDelayTime) this.collideEnemyDelayTimeCount += dt;
            // console.log(this.collideEnemyDelayTimeCount * 1000);
            // // if ()
            // var oldWidth = this.node.width;
            // var oldHeight = this.node.height;

            // const animationClip = this.playerAnimationClip[1];
            // const animation = this.node.getComponent(cc.Animation);

            // animation.removeClip(animation.getClips()[0], true);
            // this.node.width = 0;
            // this.node.height = 0;
            // setTimeout(() => {
            //     animation.addClip(animationClip, animationClip.name);
            //     animation.play(animationClip.name);

            //     this.collideEnemyDelayTimeCount += dt;
            //     console.log(this.collideEnemyDelayTimeCount * 1000);
            // }, 100);

            // setTimeout(() => {
            //     this.collideEnemyDelayTimeCount += dt;
            //     console.log(this.collideEnemyDelayTimeCount * 1000);

            //     animation.removeClip(animation.getClips()[0], true);
            //     this.node.width = 0;
            //     this.node.height = 0;
            // }, 300);
            // setTimeout(() => {
            //     animation.addClip(animationClip, animationClip.name);
            //     animation.play(animationClip.name);
            // }, 400);

            //
            // set back the moment player does not collide enemies
            this.collideEnemy = false;
            // console.log('het va cham doi');
        }
    },
});
