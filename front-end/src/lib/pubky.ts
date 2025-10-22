import { Pubky, Keypair, PublicKey, Session, PubkyError } from "@synonymdev/pubky";

// Default homeserver from Pubky docs
const DEFAULT_HOMESERVER = "ufibwbmed6jeq9k4p583go95wofakh9fwpp4k734trq79pd9u1uy";

export interface UserProfile {
  name: string;
  avatar: string | null;
}

export interface CreateUserResult {
  keypair: Keypair;
  publicKey: string;
  seedPhrase: string[];
  session: Session;
}

export interface PubkyErrorInfo {
  type: 'network' | 'auth' | 'timeout' | 'invite' | 'unknown';
  message: string;
  retryable: boolean;
}

export class PubkyService {
  private pubky: Pubky;
  private homeserver: PublicKey;
  // Keep last created credentials in-memory for same-session flows (not persisted)
  private lastKeypair: Keypair | null = null;
  private lastSession: Session | null = null;

  constructor() {
    this.pubky = new Pubky();
    this.homeserver = PublicKey.from(DEFAULT_HOMESERVER);
  }

  /**
   * Create a new user with keypair, signup to homeserver, and publish profile
   */
  async createUser(profile: UserProfile): Promise<CreateUserResult> {
    try {
      console.log('Starting user creation for profile:', profile.name);
      
      // 1. Generate random keypair
      const keypair = Keypair.random();
      const publicKey = keypair.publicKey.z32();
      console.log('Generated keypair with public key:', publicKey);
      
      // 2. Derive seed phrase from secret key
      const seedPhrase = this.deriveSeedPhrase(keypair.secretKey());
      console.log('Generated seed phrase:', seedPhrase.slice(0, 3), '...');
      
      // 3. Fetch invite code from backend
      console.log('Fetching invite code...');
      const inviteCode = await this.fetchInviteCode();
      console.log('Received invite code:', inviteCode);
      
      // 4. Create signer and signup to homeserver with invite code
      console.log('Creating signer and signing up to homeserver...');
      const signer = this.pubky.signer(keypair);
      const session = await signer.signup(this.homeserver, inviteCode);
      console.log('Successfully signed up to homeserver');
      
      // 5. Publish profile to user's storage
      console.log('Publishing profile to storage...');
      await this.publishProfile(session, profile);
      console.log('Profile published successfully');
      
      // Cache credentials in-memory for follow-up steps in the signup flow
      this.lastKeypair = keypair;
      this.lastSession = session;

      return {
        keypair,
        publicKey,
        seedPhrase,
        session
      };
    } catch (error) {
      console.error('Error in createUser:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Create recovery file for keypair backup
   */
  createRecoveryFile(keypair: Keypair, passphrase: string): Uint8Array {
    return keypair.createRecoveryFile(passphrase);
  }

  /**
   * Accessors for last created credentials in this session (non-persistent)
   */
  getLastKeypair(): Keypair | null {
    return this.lastKeypair;
  }

  getLastSession(): Session | null {
    return this.lastSession;
  }

  /**
   * Restore keypair from recovery file
   */
  static restoreFromRecoveryFile(recoveryFile: Uint8Array, passphrase: string): Keypair {
    return Keypair.fromRecoveryFile(recoveryFile, passphrase);
  }

  /**
   * Fetch invite code from backend API
   */
  private async fetchInviteCode(): Promise<string> {
    try {
      const response = await fetch('/api/invite', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch invite code: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.inviteCode) {
        throw new Error('Invalid response from invite API');
      }

      return data.inviteCode;
    } catch (error) {
      console.error('Error fetching invite code:', error);
      throw new Error('Failed to fetch invite code from server');
    }
  }

  /**
   * Publish user profile to Pubky storage
   */
  private async publishProfile(session: Session, profile: UserProfile): Promise<void> {
    const profileData = {
      name: profile.name,
      avatar: profile.avatar,
      createdAt: new Date().toISOString(),
      version: "1.0"
    };

    await session.storage.putJson("/pub/pubky.app/profile.json", profileData);
  }

  /**
   * Retrieve user profile from Pubky storage
   */
  async getProfile(session: Session): Promise<UserProfile | null> {
    try {
      const profileData = await session.storage.getJson("/pub/pubky.app/profile.json");
      if (profileData && typeof profileData === 'object' && 'name' in profileData) {
        return {
          name: profileData.name as string,
          avatar: profileData.avatar as string | null || null
        };
      }
      return null;
    } catch (error) {
      console.error('Error retrieving profile from storage:', error);
      return null;
    }
  }

  /**
   * Derive BIP39 seed phrase from secret key
   * Note: This is a simplified implementation. In production, you'd want to use
   * a proper BIP39 library for mnemonic generation.
   */
  private deriveSeedPhrase(secretKey: Uint8Array): string[] {
    // This is a simplified approach - in production, use a proper BIP39 library
    // For now, we'll create a deterministic but not BIP39-compliant seed phrase
    const words = [
      "abandon", "ability", "able", "about", "above", "absent",
      "absorb", "abstract", "absurd", "abuse", "access", "accident",
      "account", "accuse", "achieve", "acid", "acoustic", "acquire",
      "across", "act", "action", "actor", "actress", "actual",
      "adapt", "add", "addict", "address", "adjust", "admit",
      "adult", "advance", "advice", "aerobic", "affair", "afford",
      "afraid", "again", "age", "agent", "agree", "ahead",
      "aim", "air", "airport", "aisle", "alarm", "album",
      "alcohol", "alert", "alien", "all", "alley", "allow",
      "almost", "alone", "alpha", "already", "also", "alter",
      "always", "amateur", "amazing", "among", "amount", "amused",
      "analyst", "anchor", "ancient", "anger", "angle", "angry",
      "animal", "ankle", "announce", "annual", "another", "answer",
      "antenna", "antique", "anxiety", "any", "apart", "apology",
      "appear", "apple", "approve", "april", "arch", "arctic",
      "area", "arena", "argue", "arm", "armed", "armor",
      "army", "around", "arrange", "arrest", "arrive", "arrow",
      "art", "artefact", "artist", "artwork", "ask", "aspect",
      "assault", "asset", "assist", "assume", "asthma", "athlete",
      "atom", "attack", "attend", "attitude", "attract", "auction",
      "audit", "august", "aunt", "author", "auto", "autumn",
      "average", "avocado", "avoid", "awake", "aware", "away",
      "awesome", "awful", "awkward", "axis", "baby", "bachelor",
      "bacon", "badge", "bag", "balance", "balcony", "ball",
      "bamboo", "banana", "banner", "bar", "barely", "bargain",
      "barrel", "base", "basic", "basket", "battle", "beach",
      "bean", "beauty", "because", "become", "beef", "before",
      "begin", "behave", "behind", "believe", "below", "belt",
      "bench", "benefit", "best", "betray", "better", "between",
      "beyond", "bicycle", "bid", "bike", "bind", "biology",
      "bird", "birth", "bitter", "black", "blade", "blame",
      "blanket", "blast", "bleak", "bless", "blind", "blood",
      "blossom", "blow", "blue", "blur", "blush", "board",
      "boat", "body", "boil", "bomb", "bone", "bonus",
      "book", "boost", "border", "boring", "borrow", "boss",
      "bottom", "bounce", "box", "boy", "bracket", "brain",
      "brand", "brass", "brave", "bread", "breeze", "brick",
      "bridge", "brief", "bright", "bring", "brisk", "broccoli",
      "broken", "bronze", "broom", "brother", "brown", "brush",
      "bubble", "buddy", "budget", "buffalo", "build", "bulb",
      "bulk", "bullet", "bundle", "bunker", "burden", "burger",
      "burst", "bus", "business", "busy", "butter", "buyer",
      "buzz", "cabbage", "cabin", "cable", "cactus", "cage",
      "cake", "call", "calm", "camera", "camp", "can",
      "canal", "cancel", "candy", "cannon", "canoe", "canvas",
      "canyon", "capable", "capital", "captain", "car", "carbon",
      "card", "cargo", "carpet", "carry", "cart", "case",
      "cash", "casino", "cast", "casual", "cat", "catalog",
      "catch", "category", "cattle", "caught", "cause", "caution",
      "cave", "ceiling", "celery", "cement", "census", "century",
      "cereal", "certain", "chair", "chalk", "champion", "change",
      "chaos", "chapel", "chapter", "charge", "chase", "cheap",
      "check", "cheese", "chef", "cherry", "chest", "chicken",
      "chief", "child", "chimney", "choice", "choose", "chronic",
      "chuckle", "chunk", "churn", "cigar", "cinnamon", "circle",
      "citizen", "city", "civil", "claim", "clamp", "clarify",
      "claw", "clay", "clean", "clerk", "clever", "click",
      "client", "cliff", "climb", "cling", "clinic", "clip",
      "clock", "clog", "close", "cloth", "cloud", "clown",
      "club", "clump", "cluster", "clutch", "coach", "coast",
      "coconut", "code", "coffee", "coil", "coin", "collect",
      "color", "column", "come", "comfort", "comic", "common",
      "company", "concert", "conduct", "confirm", "congress", "connect",
      "consider", "control", "convince", "cook", "cool", "copper",
      "copy", "coral", "core", "corn", "correct", "cost",
      "cotton", "couch", "country", "couple", "course", "cousin",
      "cover", "coyote", "crack", "cradle", "craft", "cram",
      "crane", "crash", "crater", "crawl", "crazy", "cream",
      "credit", "creek", "crew", "cricket", "crime", "crisp",
      "critic", "crop", "cross", "crouch", "crowd", "crucial",
      "cruel", "cruise", "crumble", "crunch", "crush", "cry",
      "crystal", "cube", "culture", "cup", "cupboard", "curious",
      "current", "curtain", "curve", "cushion", "custom", "cute",
      "cycle", "dad", "damage", "dance", "danger", "daring",
      "dash", "daughter", "dawn", "day", "deal", "debate",
      "debris", "decade", "december", "decide", "decline", "decorate",
      "decrease", "deer", "defense", "define", "defy", "degree",
      "delay", "deliver", "demand", "demise", "denial", "dentist",
      "deny", "depart", "depend", "deposit", "depth", "deputy",
      "derive", "describe", "desert", "design", "desk", "despair",
      "destroy", "detail", "detect", "develop", "device", "devote",
      "diagram", "dial", "diamond", "diary", "dice", "diesel",
      "diet", "differ", "digital", "dignity", "dilemma", "dinner",
      "dinosaur", "direct", "dirt", "disagree", "discover", "disease",
      "dish", "dismiss", "disorder", "display", "distance", "divert",
      "divide", "divorce", "dizzy", "doctor", "document", "dodge",
      "dog", "doll", "dolphin", "domain", "donate", "donkey",
      "donor", "door", "dose", "double", "dove", "draft",
      "dragon", "drama", "drastic", "draw", "dream", "dress",
      "drift", "drill", "drink", "drip", "drive", "drop",
      "drum", "dry", "duck", "dumb", "dune", "during",
      "dusk", "dust", "dutch", "duty", "dwarf", "dynamic",
      "eager", "eagle", "early", "earn", "earth", "easily",
      "east", "easy", "echo", "ecology", "economy", "edge",
      "edit", "educate", "effort", "egg", "eight", "either",
      "elbow", "elder", "electric", "elegant", "element", "elephant",
      "elevator", "elite", "else", "embark", "embody", "embrace",
      "emerge", "emotion", "employ", "empower", "empty", "enable",
      "enact", "end", "endless", "endorse", "enemy", "energy",
      "enforce", "engage", "engine", "enjoy", "enlist", "enough",
      "enrich", "enroll", "ensure", "enter", "entire", "entry",
      "envelope", "episode", "equal", "equip", "era", "erase",
      "erode", "erosion", "err", "errand", "error", "erupt",
      "escape", "essay", "essence", "estate", "eternal", "ethics",
      "evidence", "evil", "evoke", "evolve", "exact", "example",
      "excess", "exchange", "excite", "exclude", "excuse", "execute",
      "exercise", "exhaust", "exhibit", "exile", "exist", "exit",
      "exotic", "expand", "expect", "expire", "explain", "expose",
      "express", "extend", "extra", "eye", "eyebrow", "fabric",
      "face", "faculty", "fade", "faint", "faith", "fall",
      "false", "fame", "family", "famous", "fan", "fancy",
      "fantasy", "farm", "fashion", "fat", "fatal", "father",
      "fatigue", "fault", "favorite", "feature", "february", "federal",
      "fee", "feed", "feel", "female", "fence", "festival",
      "fetch", "fever", "few", "fiber", "fiction", "field",
      "figure", "file", "film", "filter", "final", "find",
      "fine", "finger", "finish", "fire", "firm", "first",
      "fiscal", "fish", "fitness", "fix", "flag", "flame",
      "flash", "flat", "flavor", "flee", "flight", "flip",
      "float", "flock", "floor", "flower", "fluid", "flush",
      "fly", "foam", "focus", "fog", "foil", "fold",
      "follow", "food", "foot", "force", "forest", "forget",
      "fork", "fortune", "forum", "forward", "fossil", "foster",
      "found", "fox", "fragile", "frame", "frequent", "fresh",
      "friend", "fringe", "frog", "front", "frost", "frown",
      "frozen", "fruit", "fuel", "fun", "funny", "furnace",
      "fury", "future", "gadget", "gain", "galaxy", "gallery",
      "game", "gap", "garage", "garbage", "garden", "garlic",
      "garment", "gas", "gasp", "gate", "gather", "gauge",
      "gaze", "general", "genius", "genre", "gentle", "genuine",
      "gesture", "ghost", "giant", "gift", "giggle", "ginger",
      "giraffe", "girl", "give", "glad", "glance", "glare",
      "glass", "glide", "glimpse", "globe", "gloom", "glory",
      "glove", "glow", "glue", "goat", "god", "gold",
      "good", "goose", "gorilla", "gospel", "gossip", "govern",
      "gown", "grab", "grace", "grain", "grant", "grape",
      "grass", "gravity", "great", "green", "grid", "grief",
      "grit", "grocery", "group", "grow", "grunt", "guard",
      "guess", "guide", "guilt", "guitar", "gun", "gym",
      "habit", "hair", "half", "hammer", "hamster", "hand",
      "happy", "harbor", "hard", "harsh", "harvest", "hash",
      "hat", "have", "hawk", "hazard", "head", "health",
      "heart", "heavy", "hedgehog", "height", "hello", "helmet",
      "help", "hen", "hero", "hidden", "high", "hill",
      "hint", "hip", "hire", "history", "hobby", "hockey",
      "hold", "hole", "holiday", "hollow", "home", "honey",
      "hood", "hope", "horn", "horror", "horse", "hospital",
      "host", "hotel", "hour", "hover", "hub", "huge",
      "human", "humble", "humor", "hundred", "hungry", "hunt",
      "hurdle", "hurry", "hurt", "husband", "hybrid", "ice",
      "icon", "idea", "identify", "idle", "ignore", "ill",
      "illegal", "illness", "image", "imitate", "immense", "immune",
      "impact", "impose", "improve", "impulse", "inch", "include",
      "income", "increase", "index", "indicate", "indoor", "industry",
      "infant", "inflict", "inform", "inhale", "inherit", "initial",
      "inject", "injury", "inmate", "inner", "innocent", "input",
      "inquiry", "insane", "insect", "inside", "inspire", "install",
      "intact", "interest", "into", "invest", "invite", "involve",
      "iron", "island", "isolate", "issue", "item", "ivory",
      "jacket", "jaguar", "jar", "jazz", "jealous", "jeans",
      "jelly", "jewel", "job", "join", "joke", "journey",
      "joy", "judge", "juice", "jump", "jungle", "junior",
      "junk", "just", "kangaroo", "keen", "keep", "ketchup",
      "key", "kick", "kid", "kidney", "kind", "kingdom",
      "kiss", "kit", "kitchen", "kite", "kitten", "kiwi",
      "knee", "knife", "knock", "know", "lab", "label",
      "labor", "ladder", "lady", "lake", "lamp", "land",
      "landscape", "lane", "language", "laptop", "large", "later",
      "latin", "laugh", "laundry", "lava", "law", "lawn",
      "lawsuit", "layer", "lazy", "leader", "leaf", "learn",
      "leave", "lecture", "left", "leg", "legal", "legend",
      "leisure", "lemon", "lend", "length", "lens", "leopard",
      "lesson", "letter", "level", "liar", "liberty", "library",
      "license", "life", "lift", "light", "like", "limb",
      "limit", "link", "lion", "liquid", "list", "little",
      "live", "lizard", "load", "loan", "lobster", "local",
      "lock", "logic", "lonely", "long", "loop", "lottery",
      "loud", "lounge", "love", "loyal", "lucky", "luggage",
      "lumber", "lunar", "lunch", "lung", "lure", "luxury",
      "lyrics", "machine", "mad", "magic", "magnet", "maid",
      "mail", "main", "major", "make", "mammal", "man",
      "manage", "mandate", "mango", "mansion", "manual", "maple",
      "marble", "march", "margin", "marine", "market", "marriage",
      "mask", "mass", "master", "match", "material", "math",
      "matrix", "matter", "maximum", "maze", "meadow", "mean",
      "measure", "meat", "mechanic", "medal", "media", "melody",
      "melt", "member", "memory", "mention", "menu", "mercy",
      "merge", "merit", "merry", "mesh", "message", "metal",
      "method", "middle", "midnight", "milk", "million", "mimic",
      "mind", "minimum", "minor", "minute", "miracle", "mirror",
      "misery", "miss", "mistake", "mix", "mixed", "mixture",
      "mobile", "model", "modify", "mom", "moment", "monitor",
      "monkey", "monster", "month", "moon", "moral", "more",
      "morning", "mosquito", "mother", "motion", "motor", "mountain",
      "mouse", "move", "movie", "much", "muffin", "mule",
      "multiply", "muscle", "museum", "mushroom", "music", "must",
      "mutual", "myself", "mystery", "myth", "naive", "name",
      "napkin", "narrow", "nasty", "nation", "nature", "near",
      "neck", "need", "negative", "neglect", "neither", "nephew",
      "nerve", "nest", "net", "network", "neutral", "never",
      "news", "next", "nice", "night", "noble", "noise",
      "nominee", "noodle", "normal", "north", "nose", "notable",
      "note", "nothing", "notice", "novel", "now", "nuclear",
      "number", "nurse", "nut", "oak", "obey", "object",
      "oblige", "obscure", "observe", "obtain", "obvious", "occur",
      "ocean", "october", "odor", "off", "offer", "office",
      "often", "oil", "okay", "old", "olive", "olympic",
      "omit", "once", "one", "onion", "online", "only",
      "open", "opera", "opinion", "oppose", "option", "orange",
      "orbit", "orchard", "order", "ordinary", "organ", "orient",
      "original", "orphan", "ostrich", "other", "outdoor", "outer",
      "output", "outside", "outstanding", "oval", "oven", "over",
      "own", "owner", "oxygen", "oyster", "ozone", "pact",
      "paddle", "page", "pair", "palace", "palm", "panda",
      "panel", "panic", "panther", "paper", "parade", "parent",
      "park", "parrot", "party", "pass", "patch", "path",
      "patient", "patrol", "pattern", "pause", "pave", "payment",
      "peace", "peanut", "pear", "peasant", "pelican", "pen",
      "penalty", "pencil", "people", "pepper", "perfect", "permit",
      "person", "pet", "phone", "photo", "phrase", "physical",
      "piano", "picnic", "picture", "piece", "pig", "pigeon",
      "pill", "pilot", "pink", "pioneer", "pipe", "pistol",
      "pitch", "pizza", "place", "plague", "plain", "plan",
      "planet", "plastic", "plate", "play", "please", "pledge",
      "pluck", "plug", "plunge", "poem", "poet", "point",
      "polar", "pole", "police", "pond", "pony", "pool",
      "poor", "pop", "popcorn", "population", "porch", "port",
      "portion", "portrait", "pose", "position", "possible", "post",
      "potato", "pottery", "poverty", "powder", "power", "practice",
      "praise", "predict", "prefer", "prepare", "present", "pretty",
      "prevent", "price", "pride", "primary", "print", "priority",
      "prison", "private", "prize", "problem", "process", "produce",
      "profit", "program", "project", "promote", "proof", "property",
      "prosper", "protect", "proud", "provide", "public", "pudding",
      "pull", "pulp", "pulse", "pumpkin", "punch", "pupil",
      "puppy", "purchase", "purple", "purpose", "purse", "push",
      "put", "puzzle", "pyramid", "quality", "quantum", "quarter",
      "question", "quick", "quit", "quiz", "quote", "rabbit",
      "raccoon", "race", "rack", "radar", "radio", "rail",
      "rain", "raise", "rally", "ramp", "ranch", "random",
      "range", "rapid", "rare", "rate", "rather", "raven",
      "raw", "razor", "ready", "real", "reason", "rebel",
      "rebuild", "recall", "receive", "recipe", "record", "recover",
      "recycle", "reduce", "reflect", "reform", "refuse", "region",
      "regret", "regular", "reject", "relax", "release", "relief",
      "rely", "remain", "remember", "remind", "remove", "render",
      "renew", "rent", "reopen", "repair", "repeat", "replace",
      "reply", "report", "require", "rescue", "resemble", "resist",
      "resource", "response", "result", "retire", "retreat", "return",
      "reunion", "reveal", "review", "reward", "rhythm", "rib",
      "ribbon", "rice", "rich", "ride", "ridge", "rifle",
      "right", "rigid", "ring", "riot", "ripple", "risk",
      "ritual", "rival", "river", "road", "roast", "robot",
      "robust", "rocket", "romance", "roof", "rookie", "room",
      "rose", "rotate", "rough", "round", "route", "row",
      "royal", "rubber", "rude", "rug", "rule", "run",
      "runway", "rural", "sad", "saddle", "sadness", "safe",
      "sail", "salad", "salary", "sale", "salon", "salt",
      "salute", "same", "sample", "sand", "satisfy", "satoshi",
      "sauce", "sausage", "save", "say", "scale", "scan",
      "scare", "scatter", "scene", "scheme", "school", "science",
      "scissors", "scorpion", "scout", "scrap", "screen", "script",
      "scrub", "sea", "search", "season", "seat", "second",
      "secret", "section", "security", "seed", "seek", "segment",
      "select", "sell", "seminar", "senior", "sense", "sentence",
      "series", "service", "session", "settle", "setup", "seven",
      "shadow", "shaft", "shallow", "share", "shed", "shell",
      "sheriff", "shield", "shift", "shine", "ship", "shiver",
      "shock", "shoe", "shoot", "shop", "shore", "short",
      "shoulder", "shove", "shrimp", "shrug", "shuffle", "shy",
      "sibling", "sick", "side", "siege", "sight", "sign",
      "silent", "silk", "silly", "silver", "similar", "simple",
      "since", "sing", "siren", "sister", "situate", "six",
      "size", "skate", "sketch", "ski", "skill", "skin",
      "skirt", "skull", "skunk", "sky", "slab", "slack",
      "slam", "slang", "slap", "slash", "slate", "slave",
      "sleep", "sleet", "sleeve", "slice", "slide", "slight",
      "slim", "sling", "slip", "slit", "slob", "slope",
      "slot", "slow", "sludge", "slug", "slum", "slump",
      "slung", "slur", "slush", "sly", "smack", "small",
      "smart", "smash", "smell", "smile", "smirk", "smog",
      "smoke", "smooth", "smug", "snack", "snap", "snare",
      "snarl", "snatch", "sneak", "sneer", "sniff", "snore",
      "snort", "snout", "snow", "snub", "snuff", "snug",
      "soak", "soap", "soar", "sob", "sock", "soda",
      "sofa", "soft", "soggy", "soil", "solar", "sold",
      "sole", "solid", "solve", "some", "son", "song",
      "soon", "soot", "sore", "sorrow", "sorry", "sort",
      "soul", "sound", "soup", "sour", "south", "sow",
      "soy", "space", "spare", "spark", "sparse", "spasm",
      "spat", "spawn", "speak", "spear", "speck", "speed",
      "spell", "spend", "spent", "spew", "spill", "spin",
      "spine", "spirit", "spit", "splash", "split", "spoil",
      "spoke", "sponge", "spoon", "sport", "spot", "spout",
      "spray", "spread", "spring", "sprout", "spruce", "spur",
      "spy", "squad", "squat", "squaw", "squid", "squint",
      "squirm", "squirt", "squish", "stab", "stack", "staff",
      "stage", "stain", "stair", "stake", "stale", "stalk",
      "stall", "stamp", "stand", "stank", "staple", "star",
      "stare", "stark", "start", "stash", "state", "stays",
      "stead", "steak", "steal", "steam", "steel", "steep",
      "steer", "stems", "step", "stew", "stick", "stiff",
      "still", "stilt", "sting", "stink", "stint", "stir",
      "stock", "stole", "stomp", "stone", "stood", "stool",
      "stoop", "stop", "store", "stork", "storm", "story",
      "stout", "stove", "stow", "strap", "straw", "stray",
      "strep", "strew", "strip", "strop", "strum", "strut",
      "stuck", "stud", "stuff", "stump", "stung", "stunk",
      "stunt", "sturt", "style", "such", "suck", "sudden",
      "suffer", "sugar", "suit", "sulk", "surf", "surge",
      "surly", "sushi", "swab", "swag", "swam", "swamp",
      "swan", "swap", "swarm", "swash", "swat", "sway",
      "swear", "sweat", "sweep", "sweet", "swell", "swept",
      "swift", "swill", "swim", "swing", "swipe", "swirl",
      "swish", "swiss", "swoon", "swoop", "sword", "swore",
      "sworn", "swung", "swung", "sylph", "synod", "syrup",
      "tab", "tack", "tact", "tad", "tag", "tail",
      "take", "tale", "talk", "tall", "tame", "tan",
      "tank", "tap", "tar", "tart", "task", "taste",
      "tattoo", "taught", "taunt", "taut", "tax", "tea",
      "teach", "teal", "team", "tear", "tease", "teat",
      "ted", "tee", "teem", "teen", "teeth", "tell",
      "temp", "tend", "tense", "tent", "term", "tern",
      "test", "text", "than", "thank", "that", "thaw",
      "the", "thee", "them", "then", "there", "these",
      "they", "thick", "thief", "thigh", "thin", "thing",
      "think", "third", "this", "thong", "thorn", "those",
      "thou", "though", "thought", "thousand", "thread", "three",
      "threw", "throb", "throw", "thrum", "thud", "thug",
      "thumb", "thump", "thus", "thwart", "thy", "thyme",
      "tiara", "tibia", "tick", "tide", "tidy", "tie",
      "tier", "tiff", "tiger", "tight", "tile", "till",
      "tilt", "time", "tin", "tine", "ting", "tint",
      "tiny", "tip", "tire", "tired", "tissue", "titan",
      "title", "toad", "toast", "today", "toe", "tofu",
      "toga", "toil", "token", "told", "toll", "tomb",
      "tome", "tone", "tong", "tonic", "tool", "toon",
      "toot", "top", "tope", "tore", "torn", "toss",
      "tot", "tote", "touch", "tough", "tour", "tout",
      "tow", "towel", "tower", "town", "toy", "trace",
      "track", "tract", "trade", "trail", "train", "trait",
      "tram", "trap", "trash", "tray", "tread", "treat",
      "tree", "trek", "tremor", "trench", "trend", "trial",
      "tribe", "trick", "tried", "tries", "trill", "trim",
      "trio", "trip", "trite", "troll", "troop", "trot",
      "trouble", "trough", "trousers", "trout", "truce", "truck",
      "true", "truly", "trump", "trunk", "trust", "truth",
      "try", "tub", "tube", "tuck", "tug", "tulip",
      "tumble", "tuna", "tune", "tunic", "turf", "turn",
      "turtle", "tusk", "tutor", "twig", "twin", "twist",
      "twit", "two", "type", "typo", "ugly", "ulcer",
      "ultra", "umbrella", "umpire", "uncle", "under", "undo",
      "unfair", "unfit", "unfold", "unify", "union", "unique",
      "unit", "unity", "universe", "unkind", "unknown", "unlike",
      "unrest", "until", "unusual", "unveil", "unwind", "unwise",
      "unzip", "up", "update", "upgrade", "uphold", "upon",
      "upper", "upright", "uproar", "upset", "urban", "urge",
      "urgent", "usage", "use", "used", "user", "usual",
      "usurp", "utter", "vacant", "vacuum", "vague", "vain",
      "valet", "valid", "valley", "value", "valve", "vamp",
      "van", "vane", "vapor", "vary", "vase", "vast",
      "vat", "vault", "veal", "veil", "vein", "velvet",
      "venom", "vent", "verb", "verge", "verse", "versus",
      "very", "vessel", "vest", "vet", "vex", "via",
      "vial", "vibe", "vice", "video", "view", "vigil",
      "vile", "villa", "vine", "vinyl", "viola", "violin",
      "viper", "viral", "virus", "visa", "visit", "visor",
      "vista", "vital", "vivid", "vixen", "vocal", "vodka",
      "vogue", "voice", "void", "volcano", "volley", "volt",
      "volume", "vomit", "vote", "vouch", "vow", "vowel",
      "wade", "waffle", "wage", "wail", "wait", "wake",
      "walk", "wall", "wallet", "wallow", "walnut", "waltz",
      "wand", "wane", "want", "war", "ward", "ware",
      "warm", "warn", "warp", "wart", "wash", "wasp",
      "waste", "watch", "water", "wave", "wax", "way",
      "weak", "wealth", "weapon", "wear", "weary", "weasel",
      "weather", "weave", "web", "wed", "wedge", "weed",
      "week", "weep", "weigh", "weight", "weird", "welcome",
      "well", "west", "wet", "whale", "wharf", "wheat",
      "wheel", "whelp", "when", "where", "whet", "which",
      "while", "whim", "whip", "whir", "whisk", "whisper",
      "whistle", "white", "who", "whole", "whom", "whoop",
      "whose", "why", "wick", "wide", "wife", "wig",
      "wild", "will", "wilt", "wily", "wimp", "win",
      "wind", "window", "wine", "wing", "wink", "winner",
      "winter", "wipe", "wire", "wiry", "wise", "wish",
      "wisp", "wit", "witch", "with", "wither", "witness",
      "witty", "wizard", "wobble", "woe", "wolf", "woman",
      "womb", "women", "won", "wonder", "wont", "woo",
      "wood", "wool", "woozy", "word", "work", "world",
      "worm", "worn", "worry", "worse", "worst", "worth",
      "would", "wound", "woven", "wow", "wrap", "wreck",
      "wrest", "wring", "wrist", "write", "writhe", "wrong",
      "wrote", "wrought", "wrung", "wry", "yak", "yam",
      "yard", "yarn", "yawn", "year", "yeast", "yell",
      "yellow", "yelp", "yes", "yesterday", "yet", "yield",
      "yoga", "yoke", "yolk", "you", "young", "your",
      "youth", "yowl", "yuck", "yule", "yummy", "zap",
      "zebra", "zero", "zest", "zig", "zinc", "zip",
      "zit", "zoo", "zoom", "zoot", "zulu", "zap"
    ];

    // Create a deterministic seed phrase from the secret key
    const seedPhrase: string[] = [];
    const secretKeyHex = Array.from(secretKey).map(b => b.toString(16).padStart(2, '0')).join('');
    
    for (let i = 0; i < 12; i++) {
      const start = (i * 4) % secretKeyHex.length;
      const end = start + 4;
      const chunk = secretKeyHex.slice(start, end);
      const index = parseInt(chunk, 16) % words.length;
      seedPhrase.push(words[index]);
    }
    
    return seedPhrase;
  }

  /**
   * Handle and categorize Pubky errors
   */
  private handleError(error: unknown): PubkyErrorInfo {
    // Handle invite code fetch errors
    if (error instanceof Error && error.message.includes('invite code')) {
      return {
        type: 'invite',
        message: 'Failed to get signup invitation. Please try again.',
        retryable: true
      };
    }

    if (error instanceof Error && 'name' in error) {
      const pubkyError = error as PubkyError;
      console.log('pubkyError',pubkyError);
      
      switch (pubkyError.name) {
        case 'RequestError':
          return {
            type: 'network',
            message: 'Connection failed. Please check your internet connection and try again.',
            retryable: true
          };
        case 'AuthenticationError':
          return {
            type: 'auth',
            message: 'Signup failed. Please try again.',
            retryable: true
          };
        case 'PkarrError':
          return {
            type: 'network',
            message: 'Network error. Please try again.',
            retryable: true
          };
        case 'InvalidInput':
          return {
            type: 'unknown',
            message: 'Invalid input provided.',
            retryable: false
          };
        case 'InternalError':
          return {
            type: 'unknown',
            message: 'An internal error occurred. Please try again.',
            retryable: true
          };
        default:
          return {
            type: 'unknown',
            message: 'An unexpected error occurred. Please try again.',
            retryable: true
          };
      }
    }
    
    return {
      type: 'unknown',
      message: 'An unexpected error occurred. Please try again.',
      retryable: true
    };
  }
}

// Export singleton instance
export const pubkyService = new PubkyService();
