class Page {
    constructor(
        public name: string,
        public href: string, 
        public descriptor: string,
        public icon: string, 
        public displayCurrencies: string[]
    ) {}
}

export const pages: Page[] = []
pages.push(new Page(
    'ChromatiCalc',
    '/chromaticalc',
    'Calculate the best way to get your desired socket colours.',
    'Chromatic Orb',
    ["Chromatic Orb", "Jeweller's Orb", "Vaal Orb", "Tainted Chromatic Orb", "Omen of Blanching", "sacred-lifeforce", "wild-lifeforce"]
))
pages.push(new Page(
    'SocketCalc',
    '/socketcalc',
    'Find the cheapest way to 6-socket or 6-link an item.',
    'Orb of Fusing',
    ["Jeweller's Orb", "Orb of Fusing", "Vaal Orb", "Tainted Jeweller's Orb", "Tainted Orb of Fusing"]
))
pages.push(new Page(
    'ConflictCalc',
    '/conflictcalc',
    'Calculate the cheapest way to elevate eldritch implicits.',
    'Orb of Conflict',
    ["Orb of Conflict", "Lesser Eldritch Ichor", "Greater Eldritch Ichor", "Grand Eldritch Ichor", "Exceptional Eldritch Ichor", "Lesser Eldritch Ember", "Greater Eldritch Ember", "Grand Eldritch Ember", "Exceptional Eldritch Ember"]
))
// pages.push(new Page(
//     'CooldownCalc',
//     '/cooldowncalc',
//     'Learn how cooldown breakpoints work, and calculate them for any build (including Cast on Crit and Wardloop).',
//     'Cast on Critical Strike Support',
//     []
// ))
// pages.push(new Page(
//     'AdornedCalc',
//     '/adornedcalc',
//     'Find the most efficient Adorned jewel for your build and budget.',
//     'The Adorned',
//     []
// ))
// pages.push(new Page(
//     'UnveilCalc',
//     '/unveilcalc',
//     'Understand how unveiling modifiers works, and find the best mods to block for all items.',
//     'Albino Rhoa Feather',
//     []
// ))

