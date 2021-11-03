addLayer("d", {
    name: "dob", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#E55B06",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "dob points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        if (hasUpgrade('d', 21)) return exponent = 0.3
        return exponent = 0.5
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.times(tmp.m.effect)
        mult = mult.times(tmp.a.effect)
        if (hasUpgrade('d', 13)) mult = mult.times(upgradeEffect('d', 13))
        if (hasUpgrade('d', 15)) mult = mult.times(upgradeEffect('d', 15))
        if (hasMilestone('d', 2)) mult = mult.times(player.d.milestones.length)
        mult = mult.times(buyableEffect('m', 12))
        if (hasUpgrade('d', 32)) mult = mult.times(1e10)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    microtabs: {
        stuff: {
            "Upgrades": {
                content: [
                    ["blank", "15px"],
                    "upgrades",
                ]
            },
            "Milestones": {
                unlocked: () => hasUpgrade('d', 13) || hasMilestone ('a', 1),
                content: [
                    ["blank", "15px"],
                    "milestones",
                ]
            },
        },
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        ["blank", "25px"],
        ["microtabs", "stuff"],
        ["blank", "35px"],
    ],
    hotkeys: [
        {key: "d", description: "D: Reset for dob points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    automate() {
        if (hasMilestone('m', 5)) return
        if (hasMilestone('m', 2)) {
            buyUpgrade('d', 11)
            buyUpgrade('d', 12)
            buyUpgrade('d', 13)
            buyUpgrade('d', 14)
            buyUpgrade('d', 15)
        }
    },
    passiveGeneration() {
        if (hasUpgrade("f", 22)) return 10
        if (hasUpgrade("m", 11)) return 1
        if (hasMilestone("m", 2)) return 0.1
        return 0
    },
    doReset(resettingLayer){
        if (tmp[resettingLayer].row === this.row) return
        let keep = []
        if (resettingLayer == "m" && hasMilestone('m', 5)) keep.push('milestones')
        if (resettingLayer == "m" && hasMilestone('m', 5)) keep.push('upgrades')
        if (resettingLayer == "a" && hasMilestone('a', 1)) keep.push('milestones')
        if (resettingLayer == "a" && hasMilestone('a', 3)) keep.push('upgrades')
        layerDataReset(this.layer, keep)
        if (resettingLayer == "m" && hasUpgrade('m', 12)) addPoints('d', 1e6)
    },
    upgrades: {
        11: {
            title: "You need to start somewhere.",
            description: "Double your point gain.",
            cost: new Decimal(1),
        },
        12: {
            title: "Seriously? I've seen this in every other mod.",
            description: "Increase point gain based on dob points.",
            cost: new Decimal(2),
            effect() {
                return player[this.layer].points.add(2).pow(0.2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        13: {
            title: "It's boring. Do you have anything unique?",
            description: "Points boost your dob point gain.",
            cost: new Decimal(3),
            effect() {
                return player.points.add(1).pow(0.15)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        14: {
            title: "Still boring.",
            description: "Point gain increases based on points.",
            cost: new Decimal(30),
            effect() {
                return player.points.add(1).pow(0.20)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        15: {
            title: "New layers???",
            description: "Increase dob point gain based on dob points and unlock new layer.",
            cost: new Decimal(100),
            effect() {
                return player[this.layer].points.add(1).pow(0.07)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        21: {
            title: "I need to stop you, just a bit.",
            description: "Increase point gain but nerf dob point gain formula.",
            unlocked() {
                return hasUpgrade('m', 15)
            },
            cost: new Decimal(1e19),
        },
        22: {
            title: "Softcaps are appearing.",
            description: "Multiply point gain by 10.",
            unlocked() {
                return hasUpgrade('d', 21)
            },
            cost: new Decimal(1e21),
        },
        23: {
            title: "Why are these upgrades so boring? You'll get it in a minute",
            description: "Multiply point gain by 20.",
            unlocked() {
                return hasUpgrade('d', 21)
            },
            cost: new Decimal(1e22),
        },
        24: {
            title: "Ok the last boring upgrade.",
            description: "Multiply point gain by 30.",
            unlocked() {
                return hasUpgrade('d', 21)
            },
            cost: new Decimal(3e23),
        },
        25: {
            title: "Buyables??.",
            description: "Unlock matter buyables.",
            unlocked() {
                return hasUpgrade('d', 21)
            },
            cost: new Decimal(1e25),
        },
        31: {
            title: "I need to push you, just a bit.",
            description: "Increase point gain by 1e10.",
            unlocked() {
                return hasUpgrade('a', 15)
            },
            cost: new Decimal(1e106),
        },
        32: {
            title: "And push you more.",
            description: "Multiply dob point gain by 1e10.",
            unlocked() {
                return hasUpgrade('a', 15)
            },
            cost: new Decimal(1e122),
        },
        33: {
            title: "Pushes are quite big(not that one).",
            description: "Multiply matter gain by 1e10.",
            unlocked() {
                return hasUpgrade('a', 15)
            },
            cost: new Decimal(1e144),
        },
        34: {
            title: "Ok the last boring upgrade(yeah again).",
            description: "Multiply antimatter gain by 1000.",
            unlocked() {
                return hasUpgrade('a', 15)
            },
            cost: new Decimal(1e148),
        },
        35: {
            title: "And another row of upgrades.",
            description: "Unlock new formular upgrades.",
            unlocked() {
                return hasUpgrade('a', 15)
            },
            cost: new Decimal(1e150),
        },
    },
    milestones: {
        1: {
            requirementDescription: "7 Dob Points(1)",
            effectDescription: 'Multiply point gain by the number of upgrades.',
            done() { return player[this.layer].points.gte(7) },
        },
        2: {
            requirementDescription: "500.000 Dob Points(2)",
            effectDescription: 'Multiply dob point gain by the number of milestones.',
            done() { return player[this.layer].points.gte(500000) },
        },
        3: {
            requirementDescription: "2.000.000 Dob Points(3)",
            effectDescription: 'Unlock new layer.',
            done() { return player[this.layer].points.gte(2e6) },
        }
    }
})

