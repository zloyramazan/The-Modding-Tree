addLayer("f", {
    name: "formulars", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    resetsNothing: true,
    color: "#AC06E5",
    requires: new Decimal(150), // Can be a function that takes requirement increases into account
    resource: "formulars", // Name of prestige currency
    baseResource: "dob points", // Name of resource prestige is based on
    baseAmount() {return player.d.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        if (hasUpgrade('a', 14)) return exponent = 1
        return exponent = 1.5
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.times(buyableEffect('m', 22))
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
    layerShown(){return hasUpgrade('d', 15) || hasMilestone('m', 1) || hasMilestone ('a', 1)},   
    row: 1, // Row the layer is in on the tree (0 is the first row)
    displayRow: 'side',
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
    canBuyMax() {
        return hasMilestone("m", 1)
    },
    autoPrestige() {
        return hasMilestone('m', 3)
    },
    automate() {
        if (hasMilestone('m', 5)) return
        if (hasMilestone('m', 4)) {
            buyUpgrade('f', 11)
            buyUpgrade('f', 12)
            buyUpgrade('f', 13)
        }
    },
    doReset(resettingLayer){
        if (tmp[resettingLayer].row === this.row) return
        let keep = []
        if (resettingLayer == "m" && hasMilestone('m', 5)) keep.push('upgrades')
        if (resettingLayer == "a" && hasMilestone('a', 5)) keep.push('upgrades')
        layerDataReset(this.layer, keep)
    },
    upgrades: {
        11: {
            title: "Simple formula change.",
            description: "Square the first dob milestone effect.",
            cost: new Decimal(3),
        },
        12: {
            title: "Simple formula change(2).",
            description: "Square formular effect.",
            cost: new Decimal(4),
        },
        13: {
            title: "Simple formula change(3).",
            description: "^4 the first dob upgrade effect.",
            cost: new Decimal(5),
        },
        21: {
            title: 'Another formula change(1)',
            description: 'Make matter effect ^2 instead of ^1.5',
            unlocked() {
               return hasUpgrade('m', 13)
            },
            cost: new Decimal(10),
        },
        22: {
            title: 'Another formula change(2)',
            description: 'Increase first matter upgrade effect to 1000%',
            unlocked() {
                return hasUpgrade('m', 13)
             },
            cost: new Decimal(11),
        },
        23: {
            title: 'Another formula change(3)',
            description: 'Change matter gain formula(+) but softcap its effect again',
            unlocked() {
                return hasUpgrade('m', 13)
            },
            cost: new Decimal(22),
        },
        31: {
            title: 'Powerful formula change(1)',
            description: 'Make antimatter effect ^5 instead of ^1.5(its softcapped already but that will help)',
            unlocked() {
               return hasUpgrade('d', 35)
            },
            cost: new Decimal(505),
        },
        32: {
            title: 'Powerful formula change(2)',
            description: 'Increase matter upgrade 4 effect(yes you need to find it)',
            unlocked() {
                return hasUpgrade('d', 35)
             },
            cost: new Decimal(530),
        },
        33: {
            title: 'Powerful formula change(3)',
            description: 'Increase matter upgrade 8 effect and unlock antimatter buyables(yay!!!)',
            unlocked() {
                return hasUpgrade('d', 35)
            },
            cost: new Decimal(571),
        },
    },
})

