addLayer("a", {
    name: "antimatter", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#00FFF6",
    requires: new Decimal(1e45), // Can be a function that takes requirement increases into account
    resource: "antimatter", // Name of prestige currency
    baseResource: "matter", // Name of resource prestige is based on
    baseAmount() {return player.m.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        return exponent = 0.1
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('d', 34)) mult = mult.times(1e3)
        mult = mult.times(buyableEffect('a', 11))
        mult = mult.times(buyableEffect('a', 12))
        mult = mult.times(buyableEffect('a', 21))
        mult = mult.times(buyableEffect('a', 22))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    effect() {
        if(hasUpgrade('f', 31)) effect = player.a.best.add(1).pow(5)
        else effect = player.a.best.add(1).pow(1.5)
        let softcappedEffect =  softcap (effect, new Decimal(1e6), 0.5)
        return softcap (softcappedEffect, new Decimal(1e9), 0.1)
    },
    effectDescription() { return 'Multiplying your every currency gain by ' + format (tmp.a.effect) + "x" },
    layerShown() {return hasUpgrade ('m', 25) || hasMilestone ('a', 1)},
    row: 3, // Row the layer is in on the tree (0 is the first row)
    displayRow: 2,
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
                unlocked: () => hasUpgrade ('f', 33),
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
        {key: "a", description: "a: gain antimatter", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "Another time.",
            description: "Increase antimatter milestone 4 effect to 100%.",
            cost: new Decimal(10),
        },
        12: {
            title: "Matter one but more powerful.",
            description: "Increase point gain based on antimatter upgrade count.",
            effect() {
                return new Decimal.add(1, player.a.upgrades.length/50)
            },
            effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id)) },
            cost: new Decimal(25),
        },
        13: {
            title: "Why is this layer like formulars?",
            description: "^2 first 4 matter buyables effect.",
            cost: new Decimal(150),
        },
        14: {
            title: "Why do you start boosting formular gain this late?",
            description: "Boost formular gain formula.",
            cost: new Decimal(5000),
        },
        15: {
            title: "New upgrades! Yay!",
            description: "Unlock new dob upgrades. Again.",
            cost: new Decimal(100000),
        },
        21: {
            title: "Bar?",
            description: "Unlock new minigame layer.",
            unlocked() {
                return hasUpgrade('f', 33)
            },
            cost: new Decimal(2e167),
        },
    },
    milestones: {
        1: {
            requirementDescription: "1 antimatter(1)",
            effectDescription: 'Keep dob milestones and matter buyables are free.',
            done() { return player[this.layer].points.gte(1) },
        },
        2: {
            requirementDescription: "2 antimatter(2)",
            effectDescription: 'Keep matter milestones.',
            done() { return player[this.layer].points.gte(2) },
        },
        3: {
            requirementDescription: "3 antimatter(3)",
            effectDescription: 'Keep dob upgrades.',
            done() { return player[this.layer].points.gte(3) },
        },
        4: {
            requirementDescription: "5 antimatter(4)",
            effectDescription: 'Gain 10% matter from reset per second.',
            done() { return player[this.layer].points.gte(5) },
        },
        5: {
            requirementDescription: "7 antimatter(5)",
            effectDescription: 'Keep matter buyables and formular upgrades.',
            done() { return player[this.layer].points.gte(7) },
        },
        6: {
            requirementDescription: "10 antimatter(6)",
            effectDescription: 'Keep matter upgrades.',
            done() { return player[this.layer].points.gte(10) },
        },
    },
    buyables: {
        11: {
            cost(x) { 
                let base = new Decimal (2e27)
                let grow = new Decimal(1e3).pow(x).pow(1.2)
                cost = base*grow
                return cost
            },
            title: 'Dematerialize points',
            display() {
                return "Nerf point gain and boost antimatter gain" + '.<br>Amount: ' +
                format(getBuyableAmount(this.layer, this.id)) + '.<br>Currently: x' +
                format(this.effect()) + '.<br>Costs: ' + 
                format(this.cost()) + ' matter.'
            },
            effect() {
                return new Decimal(100).pow(getBuyableAmount(this.layer, this.id))
            },

            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit() {
                return 10
            }
        },
        12: {
            cost(x) { 
                let base = new Decimal (1e29)
                let grow = new Decimal(1e4).pow(x).pow(1.2)
                cost = base*grow
                return cost
            },
            title: 'Dematerialize dob points',
            display() {
                return "Nerf dob point gain and boost antimatter gain" + '.<br>Amount: ' +
                format(getBuyableAmount(this.layer, this.id)) + '.<br>Currently: x' +
                format(this.effect()) + '.<br>Costs: ' + 
                format(this.cost()) + ' matter.'
            },
            effect() {
                return new Decimal(1e3).pow(getBuyableAmount(this.layer, this.id))
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit() {
                return 10
            }
        },
        13: {
            cost(x) { 
                let base = 2e27
                let grow = new Decimal(1e2).pow(x).pow(1.1)
                cost = base*grow
                return cost
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
                player[this.layer].points = player[this.layer].points.sub(this.cost())
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
                let base = new Decimal (2e70)
                let grow = new Decimal(1e5).pow(x).pow(1.1)
                cost = base*grow
                return cost
            },
            title: 'Dematerialize matter',
            display() {
                return "Nerf matter gain and boost antimatter gain" + '.<br>Amount: ' +
                format(getBuyableAmount(this.layer, this.id)) + '.<br>Currently: x' +
                format(this.effect()) + '.<br>Costs: ' + 
                format(this.cost()) + ' matter.'
            },
            effect() {
                return new Decimal(1e4).pow(getBuyableAmount(this.layer, this.id))
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit() {
                return 10
            }
        },
        22: {
            cost(x) { 
                let base = new Decimal(1e85)
                let grow = new Decimal(1e6).pow(x).pow(1.1)
                cost = base*grow
                return cost
            },
            title: 'Dematerialize formulars',
            display() {
                return "Nerf formular gain and boost antimatter gain" + '.<br>Amount: ' +
                format(getBuyableAmount(this.layer, this.id)) + '.<br>Currently: x' +
                format(this.effect()) + '.<br>Costs: ' + 
                format(this.cost()) + ' matter.'
            },
            effect() {
                return new Decimal(1e5).pow(getBuyableAmount(this.layer, this.id))
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit() {
                return 10
            }
        },
        23: {
            cost(x) { 
                let base = 2e27
                let grow = new Decimal(1e2).pow(x).pow(1.1)
                cost = base*grow
                return cost
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
                player[this.layer].points = player[this.layer].points.sub(this.cost())
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
                let base = 2e27
                let grow = new Decimal(1e2).pow(x).pow(1.1)
                cost = base*grow
                return cost
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
                player[this.layer].points = player[this.layer].points.sub(this.cost())
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
                let base = 2e27
                let grow = new Decimal(1e2).pow(x).pow(1.1)
                cost = base*grow
                return cost
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
                player[this.layer].points = player[this.layer].points.sub(this.cost())
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
                let base = 2e27
                let grow = new Decimal(1e2).pow(x).pow(1.1)
                cost = base*grow
                return cost
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
                player[this.layer].points = player[this.layer].points.sub(this.cost())
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

