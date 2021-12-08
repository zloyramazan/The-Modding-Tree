var barValue =  1
addLayer("b", {
    name: "bar", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(1)
    }},
    resource: 'bar points',
    exponent(){
        return new Decimal(1)
    },
    color: "#4957FF",
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 'side', // Row the layer is in on the tree (0 is the first row)
    displayRow: 3,
    layerShown(){return hasUpgrade('a', 21)},
    baseResource: "current bar value", // Name of resource prestige is based on
    getResetGain(){
        let ret = 1 //let ret = player.bar.currentBarValue.times(1)
        return ret
    },
    tabFormat: [
        "main-display",
        ["blank", "25px"],
        ["microtabs", "stuff"],
        ["blank", "35px"],
    ],
    microtabs: {
        stuff: {
            "Bars": {
                content: [
                    ["blank", "15px"],
                    "bars",
                    ["blank", "15px"],
                    "clickables",
                ]
            },
            "Upgrades": {
                content: [
                    ["blank", "15px"],
                    "upgrades",
                ]
            },
        },
    },
    upgrades: {
        11: {
            title: "Ok unlock your bar.",
            description: "Unlocks the first and only bar.",
            cost: new Decimal(1),
        },
    },
    bars: {
        bar: {
                direction: RIGHT,
                width: 600,
                height: 50,
                progress(){
                        let amt = barValue,
                        return amt
                },
                display(){
                        let a = "The bar value is currently " 
                        let b = format(barValue) 
                        return a + b
                },
                unlocked(){
                        return hasUpgrade('b', 11)
                },
                fillStyle(){
                        return {
                                "background": "#66CCFF"
                        }
                },
                textStyle(){
                        return {
                                "color": "#990033"
                        }
                },
        }
},
})