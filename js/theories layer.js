addLayer("f", {
    name: "formulars", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#AC06E5",
    requires: new Decimal(150), // Can be a function that takes requirement increases into account
    resource: "formular", // Name of prestige currency
    baseResource: "dob points", // Name of resource prestige is based on
    baseAmount() {return player.d.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    effect() {
        if (hasUpgrade('f', 12))
        return player[this.layer].points.add(1).pow(2)
        return player[this.layer].points.add(1)
    },
    effectDescription() { return 'Multiplying your point gain by ' + format(tmp.f.effect) + "x" },
    layerShown(){return hasUpgrade('d', 15)},   
    row: 0, // Row the layer is in on the tree (0 is the first row)
    microtabs: {
        stuff: {
            "Upgrades": {
                content: [
                    ["blank", "15px"],
                    "upgrades",
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
        {key: "f", description: "f: gain formulars", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "Simple formula change.",
            description: "Square the first dob milestone effect.",
            cost: new Decimal(3),
        },
        12: {
            title: "Simple formula change(2).",
            description: "Square theorem effect.",
            cost: new Decimal(4),
        },
        13: {
            title: "Simple formula change(3).",
            description: "^4 the first dob upgrade effect.",
            cost: new Decimal(5),
        },
    }
})

