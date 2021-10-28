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
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('d', 13)) mult = mult.times(upgradeEffect('d', 13))
        if (hasUpgrade('d', 15)) mult = mult.times(upgradeEffect('d', 15))
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
                unlocked: () => hasUpgrade('d', 13),
                content: [
                    ["blank", "15px"],
                    "milestones"
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
    },
    milestones: {
        1: {
            requirementDescription: "7 Dob Points",
            effectDescription: 'Multiply point gain by the number of upgrades.',
            done() { return player[this.layer].points.gte(7) },
        },
        }
    
})

