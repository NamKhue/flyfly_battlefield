cc.Class({
    extends: cc.Component,

    properties: {
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

    effectExplosion() {
        // hieu ung no
        let explosion = null;
        if (cc.find("Canvas")._children[2].getComponent("Player").explosionPool.size() > 0) {
            explosion = cc.find("Canvas")._children[2].getComponent("Player").explosionPool.get();
        } else {
            explosion = cc.instantiate(cc.find("Canvas")._children[2].getComponent("Player").explosionPrefab);
        }
        // 
        let indexChoosingHowToExplode = 1;
        
        // 
        const animationExplosion = explosion.getComponent(cc.Animation);
        const clipExplosion = cc.find("Canvas")._children[2].getComponent("Player").explosionAnimationClip[indexChoosingHowToExplode];
        animationExplosion.addClip(clipExplosion, clipExplosion.name);
        animationExplosion.play(clipExplosion.name);
        explosion.setPosition(this.node.position.x, this.node.position.y);
        // 
        cc.find("Canvas").addChild(explosion);
        // 
        setTimeout(() => {
            cc.find("Canvas")._children[2].getComponent("Player").explosionPool.put(explosion);
        }, clipExplosion._duration * 1000 + 10);
    },

    onCollisionEnter(other, self) {
        // 
        if (other.node.name === 'enemy') {
            // return bullet to node pool
            self.node.destroy();
        }
        // 
        if (other.node.name === 'boss') {
            // return bullet to node pool
            self.node.destroy();
            
            this.effectExplosion();
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

        // when pass the top edge of screen
        if (this.node.y > cc.winSize.height) {
            this.node.destroy();
        }
    },
});
