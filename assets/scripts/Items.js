cc.Class({
    extends: cc.Component,

    properties: {
    },

    shieldItem(other, self, playerNode, playerNodeFile) {
        // console.log('shield')

        playerNodeFile.existedTypeOfItems[0] = true;
        
        // console.log('selfPos:', selfPos)
        // console.log('otherPos:', otherPos)
        // console.log('otherPos.sub(selfPos):', otherPos.sub(selfPos))

        // console.log('self.radius:', self.radius);
        // console.log('self.node.getComponent(cc.CircleCollider).radius:', self.node.getComponent(cc.CircleCollider).radius);
        // // console.log(self)
        // // console.log(self.node)
        // console.log('distance:', distance)

        self.node.destroy();
    },

    bonusBulletItem(other, self, playerNode, playerNodeFile) {
        // console.log('bonus bullet')
        
        // should check type of spaceship's player
        // if normal then choose normal ship with more powerful gun
        // if super then choose super ones with the most powerful gun
        // use player 'this.upgradeGun'

        playerNodeFile.existedTypeOfItems[1] = true;

        if (playerNodeFile.upgradeGun[0] == false && playerNodeFile.upgradeGun[1] == false) {
            // console.log('normal ship with upgrade gun')
            playerNodeFile.upgradeGun[0] = true;
        }

        self.node.destroy();
    },

    speedUpItem(other, self, playerNode, playerNodeFile) {
        // console.log('speed up')

        playerNodeFile.shootCooldown = parseFloat(playerNodeFile.shootCooldown.toFixed(2));
        
        if (playerNodeFile.shootCooldown > 0.1) {
            playerNodeFile.shootCooldown = parseFloat((playerNodeFile.shootCooldown - 0.05).toFixed(2));
        }
        else {
            playerNodeFile.existedTypeOfItems[2] = true;
        }

        self.node.destroy();
    },

    changeSpaceshipItem(other, self, playerNode, playerNodeFile) {
        // console.log('change spaceship')

        playerNodeFile.existedTypeOfItems[3] = true;

        if (playerNodeFile.upgradeGun[1] == false) {
            playerNodeFile.createAnimationForPlayer('super');

            playerNodeFile.upgradeGun[0] = true;
            playerNodeFile.upgradeGun[1] = true;

            playerNodeFile.shootCooldown = parseFloat(0.09);
        }
            
        self.node.destroy();
    },

    onCollisionEnter(other, self) {
        //
        const playerNode = cc.find("Canvas")._children[2];
        const playerNodeFile = playerNode.getComponent("Player");
        //
        if (other.node.name == "player") {
            // 
            // lấy vị trí hiện tại của other
            let otherPos = other.node.position;
            otherPos = new cc.v2(otherPos.x, otherPos.y + 60);
            //
            const selfPos = self.node.position;

            // tính khoảng cách giữa other và self
            const distance = otherPos.sub(selfPos).mag();

            // tính thời gian dựa trên khoảng cách và vận tốc 
            const speed = 400;
            const duration = distance / speed;
            //
            const moveAction = cc.sequence(
                cc.moveTo(duration, otherPos),
                cc.callFunc(() => {
                    
                    if (self.node.name == 'shield') {
                        this.shieldItem(other, self, playerNode, playerNodeFile);
                    }
                    else if (self.node.name == 'bonus bullet') {
                        this.bonusBulletItem(other, self, playerNode, playerNodeFile);
                    }
                    else if (self.node.name == 'speed up') {
                        this.speedUpItem(other, self, playerNode, playerNodeFile);
                    }
                    else if (self.node.name == 'change spaceship') {
                        this.changeSpaceshipItem(other, self, playerNode, playerNodeFile);
                    }

                    self.node.destroy();
                })
            );
            self.node.runAction(moveAction);

        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },

    start() {
    },

    update (dt) {
        // when switch to new level
        if (cc.find("Canvas")._children[2].getComponent("Player").isEndLevel) {
            this.node.destroy();
        }
    },
});
