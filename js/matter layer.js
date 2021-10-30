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
    exponent: 0.2, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    effect() {
        return player.m.best.add(1).pow(1.5)
    },
    effectDescription() { return 'Multiplying your dob point gain by ' + format(tmp.m.effect) + "x" },
    layerShown(){return hasMilestone('d', 3) || hasMilestone('m', 1)},  
    row: '1', // Row the layer is in on the tree (0 is the first row)
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
    upgrades: {
        11: {
            title: "It will help you get back faster, I promise.",
            description: "Gain 100% of dob points per reset per second.",
            cost: new Decimal(10),
        },
        12: {
            title: "not yet implemented.",
            description: "not yet implemented.",
            cost: new Decimal(20),
        },
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
})

