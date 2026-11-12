/**
 * BIRTHDAY CONFIGURATION FILE
 * BEST FRIEND: G. Sivadhathri
 * FROM: Sai
 * 
 * All text, roasts, statistics, timeline milestones, complaints, letter content,
 * and photo paths are managed here.
 */

export const birthdayConfig = {
  friendName: "G. Sivadhathri",
  friendNickname: "Dhathri",
  sisterName: "G. Sivadhathri",
  sisterNickname: "Dhathri",
  brotherName: "Sai",
  senderName: "Sai",
  birthdayDate: "2026-09-22", // Easily adjustable

  // Section 5: Opening Sequence Messages
  openingMessages: [
    { text: "Hey.", delay: 1000 },
    { text: "Yes, you.", delay: 1200 },
    { text: "Don't skip.", delay: 1200 },
    { text: "I actually made something for you.", delay: 1500 },
    { text: "Before you get emotional...", delay: 1600 },
    { text: "...remember who made this for you.", delay: 1800 },
    { text: "Ready?", delay: 1000 }
  ],
  openingButtonText: "Unfortunately, yes.",

  // Section 6: Fake System Check
  diagnostics: {
    title: "Personal Diagnostic Utility v4.2",
    subtitle: "Apple Silicon Architecture • Protocol v9.0",
    checks: [
      { id: "identity", label: "Identity Verification", result: "G. Sivadhathri Detected", status: "pass" },
      { id: "birthday", label: "Birthday Confirmation", result: "Validated (Another Year Wiser... Theoretically)", status: "pass" },
      { id: "drama", label: "Real-time Drama Analysis", result: "97.4% (Elevated)", status: "warning" },
      { id: "tolerance", label: "Patience Buffer", result: "Critical (18% Remaining)", status: "warning" },
      { id: "attitude", label: "Attitude Sensors", result: "Off the charts", status: "fail" }
    ],
    warningTitle: "CRITICAL SYSTEM ADVISORY",
    warningMessage: "Attitude levels are significantly above recommended operating limits. System instability may occur.",
    buttonText: "Ignore warning and continue",
    buttonSnark: "Obviously. We have been doing that for years."
  },

  // Section 7: Cinematic Intro
  intro: {
    heroImage: "/photos/hero/davani_saree_portrait.jpg",
    lines: [
      "Once upon a time...",
      "There was a girl.",
      "Sweet.",
      "Innocent.",
      "Quiet.",
      "...",
      "Yeah...",
      "We don't know what happened either."
    ]
  },

  // Section 8: The Official Complaint Department
  complaints: [
    {
      id: "CASE #001",
      crimeCode: "FELONY-SNACK-HEIST",
      title: "Borrowing My Things & Forgetting to Return Them",
      description: "Chargers, oversized hoodies, snacks, and personal items systematically borrowed with zero return timeline.",
      status: "Still under active investigation",
      threatLevel: "High Threat",
      evidenceImage: "/photos/complaints/davani_desk_red.jpg",
      objectPosition: "center 25%",
      wheelObjectPosition: "center 22%",
      wheelCaption: "Pure happiness, no explanation needed.",
      evidenceCaption: "Subject comfortably occupying headquarters with unapproved devices.",
      defenseExcuse: "\"I was only borrowing your hoodie because it looked comfortable!\"",
      prosecutionStatement: "Subject operates an unlicensed loan syndicate. 4 chargers currently missing.",
      sisterDefense: "\"I was only borrowing your hoodie because it looked comfortable!\"",
      brotherIndictment: "Subject operates an unlicensed loan syndicate. 4 chargers currently missing.",
      penalty: "Sentence: Must return at least 1 functional fast-charging USB-C cable.",
      stamp: "100% GUILTY"
    },
    {
      id: "CASE #002",
      crimeCode: "PSYCHOLOGICAL-WARFARE",
      title: "Starting Arguments & Somehow Making ME Apologize",
      description: "Utilizes advanced psychological tactics until I find myself apologizing for something from three months ago.",
      status: "Unresolved / Masterclass in gaslighting",
      threatLevel: "Severe Hazard",
      evidenceImage: "/photos/montage/davani_cheeky_pose.png",
      objectPosition: "center 22%",
      wheelObjectPosition: "center 22%",
      wheelCaption: "Caught in a good moment, as always.",
      evidenceCaption: "Pre-argument lethal expression detected at 20 paces.",
      defenseExcuse: "\"You gave me an attitude in a dream I had three weeks ago and never apologized!\"",
      prosecutionStatement: "Can turn a simple decision about where to eat into a 45-minute philosophical debate.",
      sisterDefense: "\"You gave me an attitude in a dream I had three weeks ago and never apologized!\"",
      brotherIndictment: "Can turn a simple decision about where to eat into a 45-minute philosophical debate.",
      penalty: "Sentence: Must verbally admit that Sai was right at least once in 2026.",
      stamp: "GASLIGHTING PRO"
    },
    {
      id: "CASE #003",
      crimeCode: "CLOUD-STORAGE-MASSACRE",
      title: "Taking 47 Photos Before Accepting One",
      description: "Rejects 46 flawless angles because 'my eyebrow is 2% asymmetrical' while eating up 14.8 GB of phone storage.",
      status: "Storage Damage: Catastrophic",
      threatLevel: "Critical Threat",
      evidenceImage: "/photos/complaints/davani_outdoor_purple.jpg",
      objectPosition: "center 20%",
      wheelObjectPosition: "center 20%",
      wheelCaption: "That smile never needs a filter.",
      evidenceCaption: "Exhibit A: Shot #47 officially approved after extensive deliberation.",
      defenseExcuse: "\"The lighting in the first 46 was totally unflattering! Stand lower and tilt up!\"",
      prosecutionStatement: "Has turned Sai into an unpaid, personal photographer on every outing.",
      sisterDefense: "\"The lighting in the first 46 was totally unflattering! Stand lower and tilt up!\"",
      brotherIndictment: "Has turned Sai into an unpaid, personal photographer on every outing.",
      penalty: "Sentence: 1-year ban on asking 'Take one candid picture of me looking away.'",
      stamp: "ZERO REMORSE"
    },
    {
      id: "CASE #004",
      crimeCode: "UNSOLICITED-DIETARY-THEFT",
      title: "Eating Food Immediately After Saying 'I Don't Want Anything'",
      description: "Claims to not be hungry when ordering. Proceeds to consume 68% of my French fries the millisecond they hit the table.",
      status: "Verdict: Indisputable Guilt",
      threatLevel: "Permanent Hazard",
      evidenceImage: "/photos/complaints/davani_cafe_white.jpg",
      objectPosition: "center 25%",
      wheelObjectPosition: "center 25%",
      wheelCaption: "Festive mode: always on.",
      evidenceCaption: "Subject scoping the table for unattended sustenance.",
      defenseExcuse: "\"I said I didn't want my OWN order. That never meant I wouldn't sample yours!\"",
      prosecutionStatement: "The French Fry Tax is enforced with ruthless precision. No fry is ever truly safe.",
      sisterDefense: "\"I said I didn't want my OWN order. That never meant I wouldn't sample yours!\"",
      brotherIndictment: "The French Fry Tax is enforced with ruthless precision. No fry is ever truly safe.",
      penalty: "Sentence: Must buy Sai 2 large McDonald's fries with zero confiscation.",
      stamp: "FRIES NEVER RETURNED"
    },
    {
      id: "CASE #005",
      crimeCode: "UNAUTHORIZED-BLACKMAIL-ARCHIVE",
      title: "Maintaining a Classified Vault of My Embarrassing Photos",
      description: "Silently captures awkward candid photos and videos, ready to deploy the second an argument doesn't go her way.",
      status: "Threat Level: Permanent Lever",
      threatLevel: "Defcon 1",
      evidenceImage: "/photos/complaints/davani_green_kurti_phone.png",
      objectPosition: "center 28%",
      wheelObjectPosition: "center 30%",
      wheelCaption: "The friend everyone is lucky to have.",
      evidenceCaption: "Subject clutching phone with zero remorse, ready to deploy embarrassing material.",
      defenseExcuse: "\"It's not blackmail, it's friendship leverage and historical documentation!\"",
      prosecutionStatement: "Possesses enough awkward video clips of Sai to ruin his reputation across three continents.",
      sisterDefense: "\"It's not blackmail, it's friendship leverage and historical documentation!\"",
      prosecutionStatement: "Possesses enough awkward video clips of Sai to ruin his reputation across three continents.",
      sisterDefense: "\"It's not blackmail, it's friendship leverage and historical documentation!\"",
      brotherIndictment: "Possesses enough awkward video clips of Sai to ruin his reputation across three continents.",
      penalty: "Sentence: Must permanently delete at least 3 embarrassing candid videos immediately.",
      stamp: "CHIEF BLACKMAILER"
    }
  ],

  // Section 9: Statistics & Review
  statistics: [
    { label: "Daily Drama Level", value: 97, color: "bg-[#C4738B]" },
    { label: "Daily Patience Level", value: 18, color: "bg-[#D9A066]" },
    { label: "Ability to Win Arguments Without Logic", value: 100, color: "bg-[#C5A059]" },
    { label: "Food & Snack Theft Accuracy", value: 94, color: "bg-[#E08D79]" },
    { label: "Secretly Caring Deep Down", value: 100, color: "bg-[#8FA89B]" },
    { label: "Chance of Admitting Any of This", value: 3, color: "bg-[#9E829C]" }
  ],
  rating: {
    score: 5,
    verdict: "Best friend of the year.",
    subtext: "Even with the dramatic attitude, wouldn't trade our friendship for anything."
  },

  // Section 10: Roast Mode
  roasts: [
    {
      badge: "ROAST #01",
      title: "CEO of Unnecessary Arguments",
      punchline: "Could start a legitimate debate with a GPS navigation system and make the GPS take a detour.",
      photo: "/photos/funny/side_eye_attitude.jpg"
    },
    {
      badge: "ROAST #02",
      title: "Professional Food Thief",
      punchline: "'I just want one bite' — proceeds to leave only the plate and an empty napkin.",
      photo: "/photos/memories/cafe_candid.jpg"
    },
    {
      badge: "ROAST #03",
      title: "Chief of Unofficial Intelligence",
      punchline: "Knows every piece of gossip before it happens and keeps a mental dossier on all my bad decisions.",
      photo: "/photos/funny/phone_thief.jpg"
    },
    {
      badge: "ROAST #04",
      title: "Sixth Sense for Her Belongings",
      punchline: "Can detect me breathing within a 10-meter radius of her charger while she is in a completely different room.",
      photo: "/photos/funny/dramatic_pout.jpg"
    },
    {
      badge: "ROAST #05",
      title: "The Emotional Paradox",
      punchline: "Claims she gets tired of my nonsense, yet calls me 8 times in an hour the second she has tea to spill.",
      photo: "/photos/hero/hero_duo.jpg"
    }
  ],

  // Section 11: Childhood / Memory Timeline
  timeline: [
    {
      year: "Day One",
      tag: "Quiet Beginnings",
      title: "Before all the chaos started",
      description: "Dressed in silk and flowers, smiling politely for the camera. Back before we became close friends, nobody could have predicted the non-stop laughter and memories we'd make together.",
      photo: "/photos/memories/timeline_childhood.jpg",
      objectPosition: "center 10%"
    },
    {
      year: "Best Friends",
      tag: "Unbreakable Bond",
      title: "Teammates against the world",
      description: "From study stress and exam panics to beach trips, late-night talks, and laughing at inside jokes that nobody else understands.",
      photo: "/photos/memories/beach_duo.jpg",
      objectPosition: "center 15%"
    },
    {
      year: "True Loyalty",
      tag: "In Our Corner",
      title: "Always looking out for each other",
      description: "We argue over silly little things, but whenever life gets tough or either of us needs backup, we stand side by side without hesitation.",
      photo: "/photos/memories/sky_trio.jpg",
      objectPosition: "center 38%"
    },
    {
      year: "Today & Beyond",
      tag: "Lifelong Friends",
      title: "The wonderful person you are",
      description: "Smarter, stronger, more radiant every day — and still the one friend who knows how to roast me and inspire me at the exact same time.",
      photo: "/photos/memories/finger_heart.jpg",
      objectPosition: "center 22%"
    }
  ],

  // Section 12: Interactive Film Strip
  filmStrip: [
    {
      photo: "/photos/filmstrip/davani_saree_palm_side.jpg",
      note: "Grace in motion • Kerala saree perfection.",
      rotation: "-2.5deg",
      objectPosition: "center 28%"
    },
    {
      photo: "/photos/filmstrip/davani_saree_palm_front.jpg",
      note: "That 1000-watt smile that brightens the whole room.",
      rotation: "3deg",
      objectPosition: "center 25%"
    },
    {
      photo: "/photos/filmstrip/davani_saree_closeup.jpg",
      note: "Undeniably radiant • Angle officially approved.",
      rotation: "-1.5deg",
      objectPosition: "center 25%"
    },
    {
      photo: "/photos/filmstrip/davani_saree_palm_radiant.jpg",
      note: "Pure traditional elegance under the palms.",
      rotation: "2deg",
      objectPosition: "center 35%"
    },
    {
      photo: "/photos/filmstrip/davani_silver_saree.jpg",
      note: "Classic royal glow • Queen of the day.",
      rotation: "-3deg",
      objectPosition: "center 25%"
    }
  ],

  // Section 13: Things I Will Never Say Out Loud
  unspokenTruths: [
    { text: "You annoy me.", pause: 800 },
    { text: "You steal my stuff.", pause: 800 },
    { text: "You argue over absolutely nothing.", pause: 800 },
    { text: "You somehow always have a complaint.", pause: 1200 },
    { text: "...", pause: 1000 },
    { text: "But...", pause: 1200 },
    { text: "You are also one of the very few people I know will always be there.", pause: 1500 },
    { text: "And I hope you know...", pause: 1200 },
    { text: "I will always, without hesitation, be there for you too.", pause: 2000 }
  ],

  // Section 14: Personal Letter
  letter: {
    envelopePrompt: "One thing left.",
    openButton: "Open Letter",
    date: "Special Edition • Birthday Archive",
    salutation: "Dear Dhathri,",
    paragraphs: [
      "Happy Birthday! 🎂",
      "Who would have thought a random Free Fire match would turn into a real friendship? We started as teammates, but somewhere between the games, the teasing, and the arguments over silly things, you became someone who really mattered to me.",
      "I still remember how easy it was with you. We could laugh about nothing, roast each other, and then be there for each other when it counted. Not many people make friendship feel that natural, and I’m grateful that you did.",
      "You trusted me with your time, your stories, and your real self, and I never took that lightly. That trust is one of the things I value most about our friendship. I’m grateful for it, and I hope it still means something to you too.",
      "We haven’t talked much lately, and I won’t pretend I haven’t noticed. Life gets busy and people drift, and I understand that. But I didn’t want your birthday to pass without telling you that I still think of you, and I still care how you’re doing.",
      "You are one of the kindest and most hardworking people I know. I’ve watched you chase your goals and handle challenges with a smile, and I’m genuinely proud of you. I hope you never lose that.",
      "On your special day, I hope you get everything you’ve been wishing for: happiness, peace of mind, success, and people who make you feel valued. You deserve all of it, and more.",
      "There’s no pressure to reply to this. I just wanted you to know that you’re appreciated. And if you ever feel like talking, or want to jump into a match like old times, I’d be happy to hear from you.",
      "Happy Birthday, Dhathri! Have an amazing year. ✨"
    ],
    signoff: "Your friend,",
    signature: "Sai"
  },

  // Section 15: Cinematic Photo Montage
  montage: [
    { photo: "/photos/montage/davani_cheeky_pose.png", caption: "Effortless charm and a smile that lights up every moment.", objectPosition: "center 60%" },
    { photo: "/photos/montage/davani_candid_selfie.png", caption: "Naturally radiant, full of spark, and unapologetically herself.", objectPosition: "center 45%" },
    { photo: "/photos/montage/davani_lehenga_garden.jpg", caption: "Blooming with grace, outshining every flower behind her.", objectPosition: "center 25%" },
    { photo: "/photos/montage/davani_rooftop_evening.jpg", caption: "Golden hour glow, calm presence, and timeless elegance.", objectPosition: "center 20%" },
    { photo: "/photos/montage/davani_green_portrait.png", caption: "Grace in simplicity — effortless elegance in every detail.", objectPosition: "center 25%" },
    { photo: "/photos/montage/dhathri_classroom_smile.jpg", caption: "Even on busy college days, her smile makes everything lighter.", objectPosition: "center 35%" },
    { photo: "/photos/montage/dhathri_floral_top.jpg", caption: "Fresh energy, effortless style, and pure positivity.", objectPosition: "center 20%" },
    { photo: "/photos/montage/dhathri_temple_steps.jpg", caption: "Grounded, kind-hearted, and carrying peace wherever she goes.", objectPosition: "center 70%" }
  ],
  montageCloser: "Wouldn't trade our friendship for anything.",
  montageJoke: "...mostly.",

  // Section 16: Final Birthday Celebration
  finale: {
    badge: "THE OFFICIAL CELEBRATION",
    title: "HAPPY BIRTHDAY",
    name: "G. SIVADHATHRI",
    quotes: [
      "Another year older.",
      "Still dramatic.",
      "Still unstoppable.",
      "And still the best friend anyone could ask for."
    ],
    wishes: "May your year be as bright, loud, and unstoppable as you are. Keep shining! ✨"
  },

  // Section 17: Secret "DO NOT CLICK" Button
  secretButton: {
    initialText: "DO NOT CLICK",
    states: [
      { text: "Seriously?", sub: "You were told not to click." },
      { text: "I literally said don't.", sub: "Why do you never listen to me?" },
      { text: "This is exactly why we argue.", sub: "One more click and you'll regret it." },
      { text: "Fine.", sub: "You win." }
    ],
    finaleMessage: "BEST FRIENDS FOR LIFE 🌟",
    finaleSub: "Happy Birthday, Dhathri. The truest and most irreplaceable friend.",
    finalePhoto: "/photos/finale/dhathri_cheeky_smile.jpg",
    objectPosition: "center 20%"
  },

  // Section 18: Full Gallery
  gallery: [
    { 
      id: "gal-1",
      src: "/photos/filmstrip/davani_saree_palm_side.jpg", 
      caption: "Grace in motion • Traditional Kerala kasavu perfection", 
      tag: "Tradition", 
      objectPosition: "center 28%",
      sticker: "KERALA GRACE 🌿",
      featured: true
    },
    { 
      id: "gal-2",
      src: "/photos/filmstrip/davani_saree_palm_front.jpg", 
      caption: "That 1000-watt smile that brightens any room", 
      tag: "Radiant", 
      objectPosition: "center 25%",
      sticker: "1000W SMILE ✨" 
    },
    { 
      id: "gal-3",
      src: "/photos/filmstrip/davani_saree_closeup.jpg", 
      caption: "Stunning close-up with effortless golden hour glow", 
      tag: "Portrait", 
      objectPosition: "center 25%",
      sticker: "GOLDEN HOUR 💛" 
    },
    { 
      id: "gal-4",
      src: "/photos/filmstrip/davani_silver_saree.jpg", 
      caption: "Classic royal elegance in silver designer saree", 
      tag: "Royalty", 
      objectPosition: "center 25%",
      sticker: "ROYAL QUEEN 👑",
      featured: true
    },
    { 
      id: "gal-5",
      src: "/photos/montage/davani_lehenga_garden.jpg", 
      caption: "Blooming like a flower in yellow & maroon lehenga", 
      tag: "Festive", 
      objectPosition: "center 25%",
      sticker: "BLOOMING 🌺" 
    },
    { 
      id: "gal-6",
      src: "/photos/montage/davani_rooftop_evening.jpg", 
      caption: "Rooftop evening vibes against palms & sunset skies", 
      tag: "Vibes", 
      objectPosition: "center 20%",
      sticker: "SUNSET GLOW 🌅" 
    },
    { 
      id: "gal-7",
      src: "/photos/complaints/davani_bathukamma_saree.jpg", 
      caption: "Carrying the colorful Bathukamma flower stack with poise", 
      tag: "Tradition", 
      objectPosition: "center 20%",
      sticker: "BATHUKAMMA 🌸" 
    },
    { 
      id: "gal-8",
      src: "/photos/complaints/davani_green_kurti_phone.png", 
      caption: "Sage green kurti & sweet moments at the table", 
      tag: "Moments", 
      objectPosition: "center 28%",
      sticker: "SWEET & SERENE 🍵" 
    },
    { 
      id: "gal-9",
      src: "/photos/complaints/davani_cafe_white.jpg", 
      caption: "White floral top & cafe laughter in the sunshine", 
      tag: "Candid", 
      objectPosition: "center 25%",
      sticker: "CAFE CHILL ☕",
      featured: true
    },
    { 
      id: "gal-10",
      src: "/photos/montage/davani_cheeky_pose.png", 
      caption: "Playful cheeky mood • Always full of fun and energy", 
      tag: "Fun", 
      objectPosition: "center 25%",
      sticker: "CHEEKY QUEEN 😉" 
    },
    { 
      id: "gal-11",
      src: "/photos/montage/davani_candid_selfie.png", 
      caption: "Soft flower filter candid selfie • Pure cuteness", 
      tag: "Selfie", 
      objectPosition: "center 45%",
      sticker: "YOU CAN 🌸" 
    },
    { 
      id: "gal-12",
      src: "/photos/complaints/davani_saree_gold_red.png", 
      caption: "Golden temple saree elegance with SRM pride", 
      tag: "Tradition", 
      objectPosition: "32% 20%",
      sticker: "TIMELESS BEAUTY 🪷" 
    },
    { 
      id: "gal-13",
      src: "/photos/complaints/davani_pink_tshirt.png", 
      caption: "Good Vibes t-shirt & dramatic hair toss pose", 
      tag: "Fun", 
      objectPosition: "center 56%",
      sticker: "GOOD VIBES ONLY 💖" 
    },
    { 
      id: "gal-14",
      src: "/photos/complaints/davani_desk_red.jpg", 
      caption: "Cross-legged at the desk with mischievous confidence", 
      tag: "Daily", 
      objectPosition: "center 28%",
      sticker: "BOSS ENERGY 💼" 
    },
    { 
      id: "gal-15",
      src: "/photos/complaints/davani_smile_pink.jpg", 
      caption: "Outdoor sunshine portrait in pink knit top", 
      tag: "Portrait", 
      objectPosition: "center 35%",
      sticker: "PURE SUNSHINE ☀️" 
    },
    { 
      id: "gal-16",
      src: "/photos/complaints/davani_outdoor_purple.jpg", 
      caption: "Purple kurti photoshoot by the garden fence", 
      tag: "Portrait", 
      objectPosition: "center 20%",
      sticker: "MODEL POSE 💜" 
    },
    { 
      id: "gal-17",
      src: "/photos/filmstrip/davani_saree_palm_radiant.jpg", 
      caption: "Traditional grace framed by tropical palm leaves", 
      tag: "Tradition", 
      objectPosition: "center 35%",
      sticker: "TROPICAL VIBES 🌴" 
    },
    { 
      id: "gal-18",
      src: "/photos/complaints/davani_saree_portrait.jpg", 
      caption: "Peace sign in teal saree • Regal & cute all in one", 
      tag: "Royalty", 
      objectPosition: "center 25%",
      sticker: "FOREVER QUEEN ✌️" 
    }
  ],

  // Section 19: The Beautiful & Gorgeous Chapter
  gorgeousTribute: {
    badge: "✦ THE UNDENIABLE TRUTH • EFFORTLESSLY GORGEOUS ✦",
    title: "Simply Beautiful • Forever Gorgeous",
    subtitle: "Behind all the roasts, stolen hoodies, and petty arguments... here is the real truth.",
    friendNote: "I tease you almost every day and complain about your drama, but at the end of the day, there's no denying the facts: You are radiant, elegant, and an incredible best friend with unmatched grace.",
    brotherNote: "I tease you almost every day and complain about your drama, but at the end of the day, there's no denying the facts: You are radiant, elegant, and an incredible best friend with unmatched grace.",
    cards: [
      {
        id: "fiery-gold-grace",
        title: "The Royal Splendor",
        tag: "REGAL MAJESTY",
        subtitle: "Golden silk & fiery radiance",
        photo: "/photos/gorgeous/dhathri_fiery_gold_saree.jpg",
        objectPosition: "center 18%",
        caption: "Draped in resplendent golden silk against a dramatic crimson canvas — absolute queen energy that commands the room with effortless poise.",
        stats: { aura: "Regal 👑", elegance: "100%", radiance: "Infinite ✨" }
      },
      {
        id: "ceremonial-elegance",
        title: "Ceremonial Grace",
        tag: "TRADITIONAL PERFECTION",
        subtitle: "Heritage, beauty & timeless charm",
        photo: "/photos/gorgeous/dhathri_ceremony_pink_saree.jpg",
        objectPosition: "center 22%",
        caption: "Pink and royal blue silk with temple gold adornments and award-winning poise. Pure traditional perfection at its absolute finest.",
        stats: { poise: "Flawless 💎", tradition: "Pure Gold", charm: "10/10 🌸" }
      },
      {
        id: "garden-blossom",
        title: "Golden Hour Bloom",
        tag: "GARDEN RADIANCE",
        subtitle: "Brighter than a thousand blooms",
        photo: "/photos/gorgeous/dhathri_yellow_festive_garden.jpg",
        objectPosition: "center 20%",
        caption: "Festive yellow, vibrant florals, and a smile so warm and genuine it makes the entire garden fade into the background.",
        stats: { vibe: "Pure Sunshine ☀️", warmth: "1000/10", energy: "Unstoppable 💫" }
      },
      {
        id: "courtyard-chic",
        title: "Modern Courtyard Chic",
        tag: "VOGUE EDITORIAL",
        subtitle: "Effortlessly stylish & photogenic",
        photo: "/photos/gorgeous/dhathri_floral_courtyard_chic.jpg",
        objectPosition: "center 22%",
        caption: "Floral elegance paired with effortless denim and natural confidence. Proof that you look like a magazine cover even on an ordinary afternoon.",
        stats: { aesthetic: "Vogue Ready 💅", style: "Iconic", photogenic: "1000% 📸" }
      },
      {
        id: "campus-starlight",
        title: "Sweet Campus Starlight",
        tag: "EFFORTLESS CHARM",
        subtitle: "The 1000-watt candid smile",
        photo: "/photos/gorgeous/dhathri_campus_candid_smile.png",
        objectPosition: "center 32%",
        caption: "Mid-lecture candid with that unmistakable resting smile and sparkling eyes. Bringing unmatched warmth and energy into every single space.",
        stats: { cuteness: "Maximum 💖", charm: "Deadly", glow: "Priceless ✨" }
      }
    ],
    compliments: [
      "You bring effortless elegance to every single room you walk into.",
      "Your smile is genuinely contagious — it can turn around anyone's worst day in seconds.",
      "Traditional silk or modern casuals, you carry every single look with unmatched grace and poise.",
      "You have an extraordinary eye for aesthetics, style, and natural beauty.",
      "Behind all our daily banter, you have the kindest, most generous and loyal heart.",
      "You make being smart, ambitious, and fiercely stylish look completely effortless.",
      "You're not just gorgeous on the outside; your loyalty, warmth, and inner glow are what make you truly stunning.",
      "Official Verdict: The most radiant, wonderful, and irreplaceable best friend in the entire world. Always. ✨"
    ],
    radarScore: [
      { label: "Natural Grace & Elegance", value: "100%", desc: "Effortless, natural, and timeless" },
      { label: "Radiant Smile Factor", value: "∞ / 10", desc: "Lights up the whole room" },
      { label: "Photogenic Power", value: "1000%", desc: "Vogue ready in every lighting" },
      { label: "Inner Beauty & Heart", value: "Priceless", desc: "Loyal, caring, and irreplaceable" }
    ]
  },

  // Background Audio (Disabled)
  audio: null
};
