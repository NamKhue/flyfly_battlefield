cc.Class({
    extends: cc.Component,

    properties: {
        bulletPrefabs: [cc.Prefab],

        bulletAudio: {
            default: null,
            type: cc.AudioClip
        },

        playerAnimationClip: [cc.AnimationClip],

        explosionAnimationClip: [cc.AnimationClip],
        explosionPrefab: cc.Prefab,
    },

    initializeExplosionPool() {
        this.explosionPool = new cc.NodePool();
        const explosionAmount = 10;
        for (let i = 0; i < explosionAmount; i++) {
            const explosion = cc.instantiate(this.explosionPrefab);
            this.explosionPool.put(explosion);
        }
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

    onMouseDown(event) {
        // người chơi đang click
        this.isClickingMouse = true;
        //
        if (!this.isStartGame) {
            this.isStartGame = true;
        }
        //
        if (!this.isDisappearTextIntro) {
            this.isDisappearTextIntro = true;
        }
    },

    onMouseUp(event) {
        // người chơi khong còn click
        this.isClickingMouse = false;
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
    },

    registerMouseMoveEvent() {
        cc.find("Canvas").on(cc.Node.EventType.TOUCH_MOVE, this.onMouseMove, this);
    },

    un_registerMouseEvents() {
        cc.find("Canvas").off(cc.Node.EventType.TOUCH_START, this.onMouseDown, this);
        cc.find("Canvas").off(cc.Node.EventType.TOUCH_END, this.onMouseUp, this);
        cc.find("Canvas").off(cc.Node.EventType.TOUCH_MOVE, this.onMouseMove, this);
    },

    registerGun() {
        // Lấy vị trí chuột trong không gian world
        const mousePos = event.getLocation();

        // Chuyển đổi vị trí chuột thành vị trí trong không gian local của khẩu súng
        const localPos = this.node.parent.convertToNodeSpaceAR(mousePos);

        // Di chuyển khẩu súng tới vị trí chuột
        this.node.position = localPos;
    },

    shoot() {
        // 
        if (!this.isStartGame || this.isGameOver) {
            return;
        }
        // sound for shooting
        const bulletSound = cc.audioEngine.playEffect(this.bulletAudio, false);
        cc.audioEngine.setVolume(bulletSound, 0.3);
        // 
        // change amount of bullets here
        this.initializeGun();
    },

    shootWithDelayTime(dt) {
        // 
        //
        this.shootCooldownCount += dt;
        //
        if (this.shootCooldownCount >= this.shootCooldown) {
            this.shoot();
            this.shootCooldownCount = 0;
        }
    },

    initializeGun() {
        // 
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
            let type = 'circle'

            if (this.circleBulletPool.size() > 0) {
                circleBullet = this.circleBulletPool.get();
            } else {
                circleBullet = cc.instantiate(this.bulletPrefabs[1]);
            }

            // add bullet to canvas node
            this.node.parent.addChild(circleBullet);

            // change pos for each bullet
            let newPosition;
            if (i == 0) { newPosition = cc.v2(this.node.position.x - 20, this.node.position.y + 45); }
            if (i == 1) { newPosition = cc.v2(this.node.position.x + 20, this.node.position.y + 45); }
            // 
            let circleBulletScale = 0.25
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
                    // return bullet to node pool
                    this.circleBulletPool.put(circleBullet);
                })
            );
            circleBullet.runAction(moveAction);
        }

        for (let i = 0; i < 7; i++) {
            // declare
            let bullet = null;

            // choose type bullet
            let type = 'circle'

            if (this.bulletPool.size() > 0) {
                bullet = this.bulletPool.get();
            } else {
                bullet = cc.instantiate(this.bulletPrefabs[0]);
            }

            // add bullet to canvas node
            this.node.parent.addChild(bullet);

            // change pos for each bullet
            let newPosition = cc.v2(this.node.position.x, this.node.position.y + 55);
            // if (i == 0) { newPosition = cc.v2(this.node.position.x - 25 + i * 8, this.node.position.y + 55); }
            if (i == 0 || i == 1 || i == 2) { newPosition = cc.v2(this.node.position.x - 20 + i * 5, this.node.position.y + 55); }
            // if (i == 3) { newPosition = cc.v2(this.node.position.x, this.node.position.y + 55); }
            if (i == 4 || i == 5 || i == 6) { newPosition = cc.v2(this.node.position.x - 5 + (i - 1) * 5, this.node.position.y + 55); }
            // if (i == 6) { newPosition = cc.v2(this.node.position.x - 15 + (i - 1) * 8, this.node.position.y + 55); }
            // 
            let bulletScale = 0.9
            bullet.setScale(cc.v2(bulletScale, bulletScale));
            bullet.setPosition(newPosition);

            cc.tween(bullet)
                .to(0, { scale: bulletScale } )
                .to(1, { scale: 1.5 } )
                .start();

            // lấy kích thước màn hình
            const screenSize = cc.winSize;

            const duration = screenSize.height / this.bulletMovingSpeed;

            // tạo action di chuyển cho đạn
            const moveAction = cc.sequence(
                cc.moveBy(duration, cc.v2(0, screenSize.height)),
                cc.callFunc(() => {
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
            let type = 'circle'

            if (this.bulletPool.size() > 0) {
                bullet = this.bulletPool.get();
            } else {
                bullet = cc.instantiate(this.bulletPrefabs[0]);
            }

            // change pos for each bullet
            let newPosition = cc.v2(this.node.position.x - 25 + i * 8, this.node.position.y + 50);
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
                    // return bullet to node pool
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
            let type = 'circle'

            if (this.bulletPool.size() > 0) {
                bullet = this.bulletPool.get();
            } else {
                bullet = cc.instantiate(this.bulletPrefabs[0]);
            }

            // change pos for each bullet
            let newPosition = cc.v2(this.node.position.x - 15 + i * 5, this.node.position.y + 55);
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
                    // return bullet to node pool
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
            for (let i = 0; i < animation.getClips().length; i++) {
                animation.removeClip(animation.getClips()[i], true);
            }
        }

        let indexChoosingTypeOfPlayer = 0;
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

    initializePlayerPos() {
        // 
        this.node.setPosition(cc.v2(this.posX, this.posY - 500));
    },

    movingEffectIntro() {
        // 
        cc.tween(this.node)
            .to(1, { position: cc.v2(this.posX, this.posY) })
            .start();
    },

    blinkPlayerWhenCollideEnemy(dt) {
        //
        if (this.collideEnemyDelayTimeCount == 0) {
            this.canBlink = true;
            this.isBlinking = true;
        }
        this.collideEnemyDelayTimeCount += dt;
        //
        if (this.collideEnemyDelayTimeCount >= this.collideEnemyDelayTime) {
            // console.log('reset');
            //
            this.collideEnemyDelayTimeCount = 0;
            //
            this.canBlink = false;
            this.isBlinking = false;
        }
        //
        if (this.canBlink) {
            // console.log('o day nay');
            //
            this.canBlink = false;
            //
            this.node.opacity = 0;
            setTimeout(() => {
                this.node.opacity = 255;
            }, 100);
            //
            setTimeout(() => {
                this.node.opacity = 0;
                setTimeout(() => {
                    this.node.opacity = 255;
                }, 100);
            }, 200);
        }
    },

    collideEnemy(dt) {
        //
        if (this.isBlinking) {
            //
            this.collideEnemyDelayTimeCount += dt;
        }
        //
        if (this.isCollideEnemy == true) {
            // console.log('dang va cham day');

            // 
            this.blinkPlayerWhenCollideEnemy(dt);

            // lose blood blinks
            cc.find("Canvas").getComponent("MainScene").loseBloodBG.active = true;
            setTimeout(() => {
                cc.find("Canvas").getComponent("MainScene").loseBloodBG.active = false;
            }, 2000);

            //
            // set back the moment player does not collide enemies
            this.isCollideEnemy = false;
            // console.log('het va cham doi');
        }
    },

    // ===============================================================================================================

    onCollisionEnter(other, self) {
        if (other.node.name === 'enemy') {
            // console.log("va vao enemy");

            // stop game or reduce HP
            this.isCollideEnemy = true;
        }
        if (other.node.name === 'boss') {
            console.log("va vao boss");

            // stop game or reduce HP
            this.isCollideEnemy = true;
        }
    },

    onCollisionStay(other, self) {
        if (other.node.name === 'boss') {
            console.log("va vao boss");

            // stop game or reduce HP
            // this.isGameOver = true;
            this.isCollideEnemy = true;
        }
    },

    // ===============================================================================================================

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
        // default position for playing
        this.posX = 0;
        this.posY = -(Math.ceil(cc.winSize.height * 1 / 3) - 50);
        // 
        this.createAnimationForPlayer('normal');
        //
        this.initializePlayerPos();
        // 
        this.initializeBulletPool();
        // 
        this.initializeExplosionPool();
        // 
        this.isClickToPlay = false;
        this.isStartGame = false;
        this.isEndLevel = false;
        this.isGameOver = false;
        //
        this.isClickingMouse = false;
        //
        this.isInIdealPos = false;
        //
        this.isDisappearTextIntro = false;
        // 
        // bool  update or not
        // bool  spaceship is normal or super
        this.upgradeGun = [false, false];
        // 
        this.canShoot = true;
        this.isCollideEnemy = false;
        this.collideEnemyDelayTime = .8;
        this.collideEnemyDelayTimeCount = 0;
        this.canBlink = false;
        this.isBlinking = false;
        //
        this.playerSpeed = 100;

        // tốc độ di chuyển của đạn
        this.bulletMovingSpeed = 500;

        // khoảng thời gian cooldown giữa các lần bắn
        this.shootCooldown = 0.2;
        this.shootCooldownCount = 0;

        // boolean - player have owned magnet item yet
        // this.ownMagnetItem = true;

        // movingEffectIntro
        this.isDoneMovingEffectIntro = false;
    },

    onLoad() {
        // 
        this.initializePlayer();
    },

    start() {
    },

    update(dt) {
        if (this.isClickToPlay) {
            // 
            this.isStartGame = true;
            this.isClickingMouse = false;
            // 
            // movingEffectIntro'
            if (cc.find("Canvas").getComponent("MainScene").level > 1) {
                this.node.setPosition(this.posX, this.posY);
            }
            else {
                this.movingEffectIntro();
            }
            // 
            // register mouse event
            this.registerMouseEvents();
        }

        // when player is successfully set in the idealest position for playing
        if (this.node.y == this.posY && !this.isInIdealPos) {
            // 
            this.isInIdealPos = true;
            // 
            this.registerMouseMoveEvent();
        }

        // when click mouse
        if (this.isStartGame) {
            if (this.isClickingMouse) {
                // shoot cooldown
                this.shootWithDelayTime(dt);
            }
        }

        // when player collides enemies
        this.collideEnemy(dt);
    },
});
