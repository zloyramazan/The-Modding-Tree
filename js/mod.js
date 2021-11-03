let modInfo = {
	name: "The dob Tree",
	id: "DobMod",
	author: "dob",
	pointsName: "points",
	modFiles: ["dob layer.js", "tree.js", 'formulars layer.js', 'matter layer.js', 'antimatter layer.js'],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0.1",
	name: "The start",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0.1</h3><br>
		- Added dob layer.<br>
		- Added 3 upgrades to dob layer.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)
	let gain = new Decimal(1)
	gain = gain.times(tmp.f.effect)
	gain = gain.times(tmp.a.effect)
	if (hasUpgrade('d', 11)) gain = gain.times(2)
	if (hasUpgrade('d', 12)) gain = gain.times(upgradeEffect('d', 12))
	if (hasUpgrade('d', 14)) gain = gain.times(upgradeEffect('d', 14))
	if (hasMilestone('d', 1)) gain = gain.times(player.d.upgrades.length)
	if (hasUpgrade('f', 11)) gain = gain.times(player.d.upgrades.length)
	if (hasUpgrade('f', 13)) gain = gain.times(8)
	if (hasUpgrade('m', 13)) gain = gain.pow(upgradeEffect('m', 13))
	if (hasUpgrade('d', 21)) gain = gain.pow(1.5)
	if (hasUpgrade('d', 22)) gain = gain.times(10)
	if (hasUpgrade('d', 23)) gain = gain.times(20)
	if (hasUpgrade('d', 24)) gain = gain.times(30)
	gain = gain.times(buyableEffect('m', 11))
	if (hasUpgrade('d', 31)) gain = gain.times(1e10)
	if (hasUpgrade('a', 12)) gain = gain.pow(upgradeEffect('a', 12))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
