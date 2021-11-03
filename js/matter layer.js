addLayer("m", {
    name: "matter", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FF0000",
    requires: new Decimal(5e6), // Can be a function that takes requirement increases into account
    resource: "matter", // Name of prestige currency
    baseResource: "dob points", // Name of resource prestige is based on
    baseAmount() {return player.d.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        if (hasUpgrade('f', 23)) return exponent = 0.5
        return exponent = 0.2
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.times(tmp.a.effect)
        if (hasUpgrade ('m', 14)) mult = mult.times (upgradeEffect ('m', 14))
        if (hasUpgrade ('m', 21)) mult = mult.times (100)
        if (hasUpgrade ('m', 22)) mult = mult.times (100)
        if (hasUpgrade ('m', 23)) mult = mult.times (upgradeEffect ('m', 23))
        if (hasUpgrade ('m', 24)) mult = mult.times (upgradeEffect ('m', 24))
        mult = mult.times(buyableEffect('m', 21))
        if (hasUpgrade('d', 33)) mult = mult.times(1e10)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    effect() {
        if (hasUpgrade ('f', 21))
        effect = player.m.best.add(1).pow(2)
        else effect = player.m.best.add(1).pow(1.5)
        let softcappedEffect =  softcap (effect, new Decimal(1e6), 0.5)
        return softcap (softcappedEffect, new Decimal(1e9), 0.1)
    },
    effectDescription() { return 'Multiplying your dob point gain by ' + format (tmp.m.effect) + "x" },
    layerShown() {return hasMilestone ('d', 3) || hasMilestone ('m', 1) || hasMilestone ('a', 1)},
    passiveGeneration() {
        if (hasMilestone("a", 3)) return 0.1
        if (hasUpgrade("a", 11)) return 1
        return 0
    },  
    row: 1, // Row the layer is in on the tree (0 is the first row)
    microtabs: {
        stuff: {
            "Upgrades": {
                content: [
                    ["blank", "15px"],
                    "upgrades",
                ]
            },
            "Milestones": {
                content: [
                    ["blank", "15px"],
                    "milestones"
                ]
            },
            "Buyables": {
                unlocked: () => hasUpgrade ('d', 25) || hasMilestone ('a', 1),
                content: [
                    ["blank", "15px"],
                    "buyables",
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
        {key: "m", description: "m: gain matter", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer){
        if (tmp[resettingLayer].row === this.row && !tmp('a')) return
        let keep = []
        if (resettingLayer == "a" && hasMilestone('a', 2)) keep.push('milestones')
        if (resettingLayer == "a" && hasMilestone('a', 5)) keep.push('buyables')
        if (resettingLayer == "a" && hasMilestone('a', 6)) keep.push('upgrades')
        layerDataReset(this.layer, keep)
    },
    upgrades: {
        11: {
            title: "It will help you get back faster, I promise.",
            description: "Gain 100% of dob points per reset per second.",
            cost: new Decimal(10),
        },
        12: {
            title: "And even faster.",
            description: "Start every matter reset with 1e6 dob points.",
            cost: new Decimal(20),
        },
        13: {
            title: "Now you need to wait a bit.",
            description: "Point gain ^(1+matter upgrade amount/100) and unlock new formular upgrades.",
            effect() {
                return new Decimal.add(1, player.m.upgrades.length/100)
            },
            effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id)) },
            cost: new Decimal(25),
        },
        14: {
            title: "Another boost, but now its flat.",
            description: "Multiply matter gain based on amount of matter.",
            effect() {
                if(hasUpgrade('f', 32 )) return player[this.layer].points.add(1).pow(0.3)
                return player[this.layer].points.add(1).pow(0.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
            cost: new Decimal(150),
        },
        15: {
            title: "New upgrades, old layers.",
            description: "Unlock new upgrades in dob layer.",
            cost: new Decimal(1500),
        },
        21: {
            title: "It will help you get all buyables maxed, I promise(1).",
            description: "Gain 100x more matter.",
            cost: new Decimal(1e25),
            unlocked() {
                return hasUpgrade('f', 23)
            },
        },
        22: {
            title: "It will help you get all buyables maxed, I promise(2).",
            description: "Gain 100x more matter(2).",
            cost: new Decimal(5e27),
            unlocked() {
                return hasUpgrade('f', 23)
            },
        },
        23: {
            title: "It will help you get all buyables maxed, I promise(lol another time).",
            description: "Gain more matter based on points.",
            cost: new Decimal(3e31),
            effect() {
                if(hasUpgrade('f', 33 )) return player.points.add(1).pow(0.3)
                return player.points.add(1).pow(0.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {
                return hasUpgrade('f', 23)
            },
        },
        24: {
            title: "It will help you get all buyables maxed, I promise(sorry, its the last time).",
            description: "Gain more matter based on formulars and decrease matter materialize buyable cost.",
            cost: new Decimal(5e40),
            effect() {
                return player.f.points.add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {
                return hasUpgrade('f', 23)
            },
        },
        25: {
            title: "Lets end this boring layer.",
            description: "Unlock new antimatter layer.",
            cost: new Decimal(1e44),
            unlocked() {
                return (hasUpgrade('m', 24))
            },
        }
    },
    milestones: {
        1: {
            requirementDescription: "1 matter(1)",
            effectDescription: 'Buy max formulars.',
            done() { return player[this.layer].points.gte(1) },
        },
        2: {
            requirementDescription: "3 matter(2)",
            effectDescription: 'Autobuy the first row of dob upgrades and passively gain 10% of dob points per reset per second.',
            done() { return player[this.layer].points.gte(3) },
        },
        3: {
            requirementDescription: "5 matter(3)",
            effectDescription: 'Autobuy formulars.',
            done() { return player[this.layer].points.gte(5) },
        },
        4: {
            requirementDescription: "7 matter(4)",
            effectDescription: 'Autobuy the first row of formural upgrades.',
            done() { return player[this.layer].points.gte(7) },
        },
        5: {
            requirementDescription: "9 matter(5)",
            effectDescription: 'Keep dob milestones, upgrades and formular upgrades on matter resets.',
            done() { return player[this.layer].points.gte(9) },
        },
    },
    buyables: {
        11: {
            cost(x) { 
                return new Decimal(1e5).pow(1.1).pow(x).pow(0.5).add(1e5).times(x).add(1e5)
            },
            title: 'Materialize points',
            display() {
                return "Boost point gain" + '.<br>Amount: ' +
                format(getBuyableAmount(this.layer, this.id)) + '.<br>Currently: x' +
                format(this.effect()) + '.<br>Costs: ' + 
                format(this.cost()) + ' matter.'
            },
            effect() {
                if(hasUpgrade('a', 13)) return new Decimal(10).pow(getBuyableAmount(this.layer, this.id)).pow(2)
                return new Decimal(10).pow(getBuyableAmount(this.layer, this.id))
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if(!hasMilestone('a',1)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit() {
                return 10
            }
        },
        12: {
            cost(x) { 
                return new Decimal(1.5e5).pow(1.5).pow(x).pow(0.5).add(1.5e5).times(x).add(1.5e5)
            },
            title: 'Materialize dob points',
            display() {
                return "Boost dob point gain" + '.<br>Amount: ' +
                format(getBuyableAmount(this.layer, this.id)) + '.<br>Currently: x' +
                format(this.effect()) + '.<br>Costs: ' + 
                format(this.cost()) + ' matter.'
            },
            effect() {
                if(hasUpgrade('a', 13)) new Decimal(5).pow(getBuyableAmount(this.layer, this.id)).pow(2)
                return new Decimal(5).pow(getBuyableAmount(this.layer, this.id))
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if(!hasMilestone('a',1)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit() {
                return 10
            }
        },
        13: {
            cost(x) { 
                return new Decimal(1e5).mul(x) 
            },
            title: 'Materialize points',
            display() {
                return "Boost point gain" + '.<br>Amount: ' +
                format(getBuyableAmount(this.layer, this.id)) + '.<br>Currently: x' +
                format(this.effect()) + '.<br>Costs: ' + 
                format(this.cost()) + ' matter.'
            },
            effect() {
                return new Decimal(10).pow(getBuyableAmount(this.layer, this.id))
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if(!hasMilestone('a',1)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit() {
                return 10
            },
            unlocked() {
                return false
            },
        },
        21: {
            cost(x) { 
                if (hasUpgrade('m', 24)) return new Decimal(5e5).pow(2).pow(x).pow(0.5).add(5e5).times(x).add(5e5).divide(1e12)
                return new Decimal(5e5).pow(2).pow(x).pow(0.5).add(5e5).times(x).add(5e5)
            },
            title: 'Materialize matter',
            display() {
                return "Boost matter gain" + '.<br>Amount: ' +
                format(getBuyableAmount(this.layer, this.id)) + '.<br>Currently: x' +
                format(this.effect()) + '.<br>Costs: ' + 
                format(this.cost()) + ' matter.'
            },
            effect() {
                if(hasUpgrade('a', 13)) return new Decimal(2.5).pow(getBuyableAmount(this.layer, this.id))
                return new Decimal(2.5).pow(getBuyableAmount(this.layer, this.id))
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if(!hasMilestone('a',1)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit() {
                return 10
            }
        },
        22: {
            cost(x) { 
                return new Decimal(1e6).pow(1.1).times(x).add(1e6)
            },
            title: 'Materialize formulars',
            display() {
                return "Boost formular gain" + '.<br>Amount: ' +
                format(getBuyableAmount(this.layer, this.id)) + '.<br>Currently: x' +
                format(this.effect()) + '.<br>Costs: ' + 
                format(this.cost()) + ' matter.'
            },
            effect() {
                if(hasUpgrade('a', 13)) return new Decimal(2).pow(-getBuyableAmount(this.layer, this.id))
                return new Decimal(2).pow(-getBuyableAmount(this.layer, this.id))
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if(!hasMilestone('a',1)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit() {
                return 10
            }
        },
        23: {
            cost(x) { 
                return new Decimal(1e5).mul(x) 
            },
            title: 'Materialize points',
            display() {
                return "Boost point gain" + '.<br>Amount: ' +
                format(getBuyableAmount(this.layer, this.id)) + '.<br>Currently: x' +
                format(this.effect()) + '.<br>Costs: ' + 
                format(this.cost()) + ' matter.'
            },
            effect() {
                return new Decimal(10).pow(getBuyableAmount(this.layer, this.id))
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if(!hasMilestone('a',1)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit() {
                return 10
            },
            unlocked() {
                return false
            },
        },
        31: {
            cost(x) { 
                return new Decimal(1e5).mul(x) 
            },
            title: 'Materialize points',
            display() {
                return "Boost point gain" + '.<br>Amount: ' +
                format(getBuyableAmount(this.layer, this.id)) + '.<br>Currently: x' +
                format(this.effect()) + '.<br>Costs: ' + 
                format(this.cost()) + ' matter.'
            },
            effect() {
                return new Decimal(10).pow(getBuyableAmount(this.layer, this.id))
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if(!hasMilestone('a',1)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit() {
                return 10
            },
            unlocked() {
                return false
            },
        },
        32: {
            cost(x) { 
                return new Decimal(1e5).mul(x) 
            },
            title: 'Materialize points',
            display() {
                return "Boost point gain" + '.<br>Amount: ' +
                format(getBuyableAmount(this.layer, this.id)) + '.<br>Currently: x' +
                format(this.effect()) + '.<br>Costs: ' + 
                format(this.cost()) + ' matter.'
            },
            effect() {
                return new Decimal(10).pow(getBuyableAmount(this.layer, this.id))
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if(!hasMilestone('a',1)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit() {
                return 10
            },
            unlocked() {
                return false
            },
        },
        33: {
            cost(x) { 
                return new Decimal(1e5).mul(x) 
            },
            title: 'Materialize points',
            display() {
                return "Boost point gain" + '.<br>Amount: ' +
                format(getBuyableAmount(this.layer, this.id)) + '.<br>Currently: x' +
                format(this.effect()) + '.<br>Costs: ' + 
                format(this.cost()) + ' matter.'
            },
            effect() {
                return new Decimal(10).pow(getBuyableAmount(this.layer, this.id))
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if(!hasMilestone('a',1)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit() {
                return 10
            },
            unlocked() {
                return false
            },
        },
    }
})

