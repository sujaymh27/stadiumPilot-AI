/**
 * stadiumKnowledge.ts
 * Comprehensive local knowledge base built from the actual backend data:
 * - graph.json  (gates, sections, concourses, elevators)
 * - sections.json (level/zone/accessibility)
 * - amenities.json (food, restrooms, medical, security, merchandise)
 * - parking.json (lots, gates, capacity)
 * - transport.json (rail, bus, rideshare)
 *
 * This is the offline fallback — answers are derived from the same data
 * the backend tools use, so they are consistent with Gemini responses.
 */

export interface KnowledgeEntry {
  readonly category: string;
  readonly keywords: readonly string[];
  readonly answer: string;
}

export const STADIUM_KNOWLEDGE: readonly KnowledgeEntry[] = [

  // ─── GATES ────────────────────────────────────────────────────────────────
  {
    category: 'gate-general',
    keywords: ['gate', 'gates', 'entrance', 'enter', 'entry', 'entrace', 'enterance'],
    answer:
      'MetLife Stadium has six gates. Gate A (south, main entrance) and Gate E (south-east) are near the south parking plaza. Gate B is on the east side. Gate C is on the north side. Gate D is on the west side. Gate F is on the south-west — stairs only. All gates except Gate F have accessible ramps and elevators. Gates open 2.5 hours before kickoff.',
  },
  {
    category: 'gate-a',
    keywords: ['gate a', 'gate-a', 'gatea'],
    answer:
      'Gate A is the main south entrance, located at the south plaza. It connects to the South Concourse (Level 0), which gives access to Sections 100 and 101. Elevator 1 is directly accessible from Gate A for Level 1 and Level 2 access. Guest Services and First Aid Station A are both near Gate A.',
  },
  {
    category: 'gate-b',
    keywords: ['gate b', 'gate-b', 'gateb'],
    answer:
      'Gate B is on the east side of the stadium, connecting to the East Concourse (Level 0). It provides access to Section 110. Elevator 2 is available for upper level access. The nearest parking lot is Lot E1.',
  },
  {
    category: 'gate-c',
    keywords: ['gate c', 'gate-c', 'gatec'],
    answer:
      'Gate C is the north entrance, connecting to the North Concourse (Level 0) and Section 120. Elevator 3 is nearby. The Champions Shop North merchandise store is accessible from this concourse.',
  },
  {
    category: 'gate-d',
    keywords: ['gate d', 'gate-d', 'gated'],
    answer:
      'Gate D is the west entrance, connecting to the West Concourse (Level 0) and Section 130. Elevator 4 provides access to upper levels. Lot W2 is the nearest parking, with a MetLife Stadium rail shuttle stop.',
  },
  {
    category: 'gate-e',
    keywords: ['gate e', 'gate-e', 'gatee'],
    answer:
      'Gate E is on the south-east side, connecting to the SE Concourse (Level 0). It is a fully accessible entrance and is closest to south-east parking areas.',
  },
  {
    category: 'gate-f',
    keywords: ['gate f', 'gate-f', 'gatef'],
    answer:
      'Gate F is on the south-west side. It connects to the SW Concourse but is stairs only — it is not accessible for wheelchair users. Use Gates A, B, C, D, or E for accessible entry.',
  },

  // ─── SECTIONS – LEVEL 0 (Lower Bowl) ──────────────────────────────────────
  {
    category: 'section-100',
    keywords: ['section 100', 'sec 100', 'sec-100', '100'],
    answer:
      'Section 100 is on Level 0 (lower bowl), south side. Enter through Gate A into the South Concourse, then follow signs to Section 100. It is accessible. Restroom Block A and First Aid Station A are in this area.',
  },
  {
    category: 'section-101',
    keywords: ['section 101', 'sec 101', 'sec-101', '101'],
    answer:
      'Section 101 is on Level 0 (lower bowl), south side. Enter through Gate A into the South Concourse. Blue Plate Grill (hot dogs, burgers, nachos) and Champions Shop South are both located near Section 101.',
  },
  {
    category: 'section-110',
    keywords: ['section 110', 'sec 110', 'sec-110', '110'],
    answer:
      'Section 110 is on Level 0 (lower bowl), east side. Enter through Gate B into the East Concourse. East Side Cantina (tacos, burritos) and Restroom Block B are near Section 110.',
  },
  {
    category: 'section-120',
    keywords: ['section 120', 'sec 120', 'sec-120', '120'],
    answer:
      'Section 120 is on Level 0 (lower bowl), north side. Enter through Gate C into the North Concourse. First Aid Station C and Champions Shop North are accessible from this area.',
  },
  {
    category: 'section-130',
    keywords: ['section 130', 'sec 130', 'sec-130', '130'],
    answer:
      'Section 130 is on Level 0 (lower bowl), west side. Enter through Gate D into the West Concourse. Elevator 4 is nearby for access to club and upper levels.',
  },

  // ─── SECTIONS – LEVEL 1 (Club Level) ──────────────────────────────────────
  {
    category: 'section-200',
    keywords: ['section 200', 'sec 200', 'sec-200', '200', 'club south'],
    answer:
      'Section 200 is on Level 1 (club level), south side. From Gate A, take Elevator 1 from the South Concourse to Level 1, then follow signs to the South Club Concourse and Section 200.',
  },
  {
    category: 'section-210',
    keywords: ['section 210', 'sec 210', 'sec-210', '210', 'club east'],
    answer:
      'Section 210 is on Level 1 (club level), east side. From Gate B, take Elevator 2 from the East Concourse to Level 1, then follow signs to the East Club Concourse and Section 210.',
  },
  {
    category: 'section-220',
    keywords: ['section 220', 'sec 220', 'sec-220', '220', 'club north'],
    answer:
      'Section 220 is on Level 1 (club level), north side. From Gate C, take Elevator 3 from the North Concourse to Level 1. North Club Bistro (sandwiches, salads) is located near Section 220.',
  },
  {
    category: 'section-230',
    keywords: ['section 230', 'sec 230', 'sec-230', '230', 'club west'],
    answer:
      'Section 230 is on Level 1 (club level), west side. From Gate D, take Elevator 4 from the West Concourse to Level 1, then follow signs to the West Club Concourse and Section 230.',
  },

  // ─── SECTIONS – LEVEL 2 (Upper Deck) ──────────────────────────────────────
  {
    category: 'section-300',
    keywords: ['section 300', 'sec 300', 'sec-300', '300', 'upper south'],
    answer:
      'Section 300 is on Level 2 (upper deck), south side. It is accessible. From Gate A, take Elevator 1 to Level 2, then walk to the South Upper Concourse. Upper Deck Snack Bar is near Section 300.',
  },
  {
    category: 'section-310',
    keywords: ['section 310', 'sec 310', 'sec-310', '310', 'upper east'],
    answer:
      'Section 310 is on Level 2 (upper deck), east side. Note: Section 310 is not wheelchair accessible. From Gate B, take Elevator 2 to Level 2, then follow signs to the East Upper Concourse.',
  },
  {
    category: 'section-320',
    keywords: ['section 320', 'sec 320', 'sec-320', '320', 'upper north'],
    answer:
      'Section 320 is on Level 2 (upper deck), north side. It is accessible. From Gate C, take Elevator 3 to Level 2. Restroom Block C (upper level, accessible stall) is near Section 320.',
  },
  {
    category: 'section-330',
    keywords: ['section 330', 'sec 330', 'sec-330', '330', 'upper west'],
    answer:
      'Section 330 is on Level 2 (upper deck), west side. It is accessible. From Gate D, take Elevator 4 to Level 2, then follow signs to the West Upper Concourse and Section 330.',
  },

  // ─── ROUTING – HOW TO GET BETWEEN POINTS ──────────────────────────────────
  {
    category: 'route-general',
    keywords: [
      'how do i get', 'navigate', 'directions', 'route', 'path', 'way to',
      'find my way', 'go to', 'get to', 'walk to', 'from gate', 'from section',
    ],
    answer:
      'I can help with directions. The stadium has three levels connected by four elevators. Level 0 is the lower bowl (Sections 100–130). Level 1 is the club level (Sections 200–230). Level 2 is the upper deck (Sections 300–330). All gates connect to the Level 0 concourse ring. Elevators 1–4 serve all levels from the South, East, North, and West concourses respectively. Try asking "How do I get from Gate A to Section 300?" for a specific route.',
  },
  {
    category: 'route-gate-a-to-upper',
    keywords: ['gate a to section 3', 'gate a to upper', 'gate a to level 2'],
    answer:
      'From Gate A: enter through the south entrance → proceed to South Concourse (Level 0) → take Elevator 1 → ride to Level 2 → follow signs to South Upper Concourse → reach Section 300. Estimated walk time: 6–8 minutes.',
  },
  {
    category: 'route-gate-a-to-club',
    keywords: ['gate a to section 2', 'gate a to club', 'gate a to level 1'],
    answer:
      'From Gate A: enter through the south entrance → proceed to South Concourse (Level 0) → take Elevator 1 → ride to Level 1 → follow signs to South Club Concourse → reach Section 200. Estimated walk time: 4–5 minutes.',
  },

  // ─── ELEVATORS ────────────────────────────────────────────────────────────
  {
    category: 'elevators',
    keywords: ['elevator', 'elevators', 'lift', 'lifts', 'elevetor', 'accessibl'],
    answer:
      'There are four elevators serving all three levels. Elevator 1 is near the South Concourse (Gate A side). Elevator 2 is near the East Concourse (Gate B side). Elevator 3 is near the North Concourse (Gate C side). Elevator 4 is near the West Concourse (Gate D side). All elevators are accessible and operate throughout the event.',
  },

  // ─── PARKING ──────────────────────────────────────────────────────────────
  {
    category: 'parking-general',
    keywords: ['parking', 'park', 'lot', 'car', 'vehicle', 'parkin', 'cars', 'drive'],
    answer:
      'Three main parking areas serve MetLife Stadium. Lot S3 (south, 4,000 spaces) is the main lot closest to Gate A — best for south-side sections. Lot E1 (east, 2,500 spaces) is closest to Gate B — best for east-side sections. Lot W2 (west, 3,000 spaces) is closest to Gate D with a MetLife Rail shuttle stop. All lots have accessible spaces. Pre-purchase parking online to guarantee availability.',
  },
  {
    category: 'parking-lot-s3',
    keywords: ['lot s3', 's3', 'south lot', 'south parking', 'lot s'],
    answer:
      'Lot S3 is the main south parking area with 4,000 spaces including 120 accessible spaces. It is the closest lot to Gate A (main south entrance). Ideal for Section 100, 101, and south-side seating.',
  },
  {
    category: 'parking-lot-e1',
    keywords: ['lot e1', 'e1', 'east lot', 'east parking', 'lot e'],
    answer:
      'Lot E1 is on the east side with 2,500 spaces including 80 accessible spaces. It is the closest lot to Gate B. Ideal for Section 110 and east-side seating.',
  },
  {
    category: 'parking-lot-w2',
    keywords: ['lot w2', 'w2', 'west lot', 'west parking', 'lot w'],
    answer:
      'Lot W2 is on the west side with 3,000 spaces including 100 accessible spaces. It is the closest lot to Gate D and has a MetLife Stadium rail shuttle stop connecting to the NJ Transit rail station.',
  },

  // ─── FOOD & BEVERAGES ─────────────────────────────────────────────────────
  {
    category: 'food-general',
    keywords: [
      'food', 'eat', 'eating', 'restaurant', 'snack', 'snacks', 'drink',
      'drinks', 'coffee', 'beer', 'beverage', 'beverages', 'concession',
      'concessions', 'hungry', 'meal', 'fod', 'eats', 'bite',
    ],
    answer:
      'There are four food outlets at MetLife Stadium. Blue Plate Grill (Level 0, near Section 101) serves hot dogs, burgers, and nachos — opens 2 hours before kickoff. East Side Cantina (Level 0, near Section 110) serves tacos, burritos, and soft drinks. North Club Bistro (Level 1, near Section 220) offers club-level dining with sandwiches and salads. Upper Deck Snack Bar (Level 2, near Section 300) serves snacks, drinks, and pretzels. Alcohol service ends at the start of the fourth quarter.',
  },
  {
    category: 'food-blue-plate',
    keywords: ['blue plate', 'blue plate grill', 'burgers', 'hot dogs', 'nachos'],
    answer:
      'Blue Plate Grill is located on Level 0 near Section 101. Menu: hot dogs, burgers, and nachos. Opens 2 hours before kickoff. It is wheelchair accessible.',
  },
  {
    category: 'food-east-cantina',
    keywords: ['east side cantina', 'cantina', 'tacos', 'burritos', 'east food'],
    answer:
      'East Side Cantina is on Level 0 near Section 110 (East Concourse). Menu: tacos, burritos, and soft drinks. Opens 2 hours before kickoff. Accessible.',
  },
  {
    category: 'food-north-bistro',
    keywords: ['north club bistro', 'bistro', 'club dining', 'north food', 'sandwiches', 'salads'],
    answer:
      'North Club Bistro is on Level 1 (club level) near Section 220. Menu: sandwiches and salads. Opens 90 minutes before kickoff. Club level access requires a ticket for Level 1 seating.',
  },
  {
    category: 'food-upper-deck',
    keywords: ['upper deck snack', 'snack bar', 'upper food', 'level 2 food', 'pretzels'],
    answer:
      'Upper Deck Snack Bar is on Level 2 (upper deck) near Section 300. Menu: snacks, drinks, and pretzels. Opens 1 hour before kickoff.',
  },

  // ─── RESTROOMS ─────────────────────────────────────────────────────────────
  {
    category: 'restrooms',
    keywords: [
      'restroom', 'restrooms', 'toilet', 'toilets', 'washroom', 'washrooms',
      'bathroom', 'bathrooms', 'wc', 'loo', 'resroom', 'tiolet', 'tolet',
    ],
    answer:
      'Three restroom blocks are available. Restroom Block A (Level 0, near Section 100) is gender-neutral with accessible stalls — open all day. Restroom Block B (Level 0, near Section 110) has separate men and women facilities — open all day. Restroom Block C (Level 2, near Section 320) is on the upper level with an accessible stall — open all day.',
  },
  {
    category: 'restroom-a',
    keywords: ['restroom block a', 'restroom near 100', 'restroom south', 'gender neutral'],
    answer:
      'Restroom Block A is on Level 0 near Section 100, on the South Concourse. It is gender-neutral with accessible stalls, open all day.',
  },
  {
    category: 'restroom-b',
    keywords: ['restroom block b', 'restroom near 110', 'restroom east'],
    answer:
      'Restroom Block B is on Level 0 near Section 110, on the East Concourse. It has separate men and women facilities and is accessible. Open all day.',
  },
  {
    category: 'restroom-c',
    keywords: ['restroom block c', 'restroom upper', 'restroom level 2', 'restroom near 320'],
    answer:
      'Restroom Block C is on Level 2 near Section 320, on the North Upper Concourse. It includes an accessible stall. Open all day.',
  },

  // ─── MEDICAL ───────────────────────────────────────────────────────────────
  {
    category: 'medical',
    keywords: [
      'medical', 'first aid', 'first-aid', 'doctor', 'nurse', 'injury',
      'hurt', 'sick', 'ambulance', 'health', 'medic', 'emt', 'aed',
      'defibrillator', 'emergancy', 'aid station',
    ],
    answer:
      'Two First Aid Stations are open during events. First Aid Station A is on Level 0 near Section 100 (South Concourse), staffed by EMTs with an AED available. First Aid Station C is on Level 0 near Section 120 (North Concourse), with AED and wheelchair assistance. For emergencies, notify the nearest security officer immediately.',
  },

  // ─── SECURITY ──────────────────────────────────────────────────────────────
  {
    category: 'security',
    keywords: [
      'security', 'police', 'officer', 'safety', 'safe', 'guard',
      'incident', 'report', 'secuirty', 'safty', 'checkpoint',
    ],
    answer:
      'Security Checkpoint A is at Gate A (south entrance). Security Checkpoint B is at Gate B (east entrance) with a dedicated accessible screening lane. All bags over 14"×14"×6" are prohibited. Security officers are stationed throughout all concourse levels. Report any concerns to the nearest officer or to Guest Services near Gate A.',
  },

  // ─── MERCHANDISE ───────────────────────────────────────────────────────────
  {
    category: 'merchandise',
    keywords: [
      'merchandise', 'shop', 'store', 'jersey', 'shirt', 'souvenir',
      'gift', 'buy', 'merch', 'fan shop', 'merchandize', 'marchandise', 'champions shop',
    ],
    answer:
      'Champions Shop South is on Level 0 near Section 101, selling official jerseys, souvenirs, and merchandise. Opens 3 hours before kickoff. Champions Shop North is on Level 0 near Section 120 (North Concourse). Both shops are accessible.',
  },

  // ─── ACCESSIBILITY ─────────────────────────────────────────────────────────
  {
    category: 'accessibility',
    keywords: [
      'wheelchair', 'accessible', 'accessibility', 'disabled', 'disability',
      'lift', 'elevator', 'ramp', 'mobility', 'acessibility', 'wheelcair',
      'ada', 'handicap', 'impaired',
    ],
    answer:
      'MetLife Stadium is fully ADA accessible. Accessible gates: A, B, C, D, E (Gate F is stairs only). Four elevators connect all three levels — use the gate nearest your section. Accessible sections on every level. Section 310 on Level 2 is the only non-accessible section. Accessible parking is in all three lots. First Aid Station C near Gate C has wheelchair assistance. Accessible restrooms are in all three restroom blocks.',
  },

  // ─── TRANSPORT ─────────────────────────────────────────────────────────────
  {
    category: 'transport',
    keywords: [
      'bus', 'train', 'rail', 'taxi', 'shuttle', 'transport', 'transportation',
      'nj transit', 'penn station', 'rideshare', 'uber', 'lyft', 'subway',
      'metro', 'tranport', 'public transport',
    ],
    answer:
      'NJ Transit Meadowlands Rail Line runs direct from Penn Station NYC to the stadium. Trains run every 20 minutes pre-match and post-match. Journey time: approximately 20 minutes. Bus routes 351 and 352 serve the stadium from Port Authority Bus Terminal. Rideshare pickup and drop-off is designated near the east side of the stadium. A MetLife Stadium rail shuttle runs from Lot W2 to the NJ Transit station.',
  },

  // ─── LOST AND FOUND ────────────────────────────────────────────────────────
  {
    category: 'lost-and-found',
    keywords: [
      'lost', 'lost and found', 'found', 'missing', 'wallet', 'phone',
      'bag', 'purse', 'keys', 'item', 'belongings', 'loost', 'lost item',
    ],
    answer:
      'Lost and Found is at the Guest Services desk near Gate A (Level 0). During the event, report lost items to any Guest Services representative. After the event, call the stadium guest services line during business hours. Security Checkpoint A staff can also assist.',
  },

  // ─── EMERGENCY / EXIT ──────────────────────────────────────────────────────
  {
    category: 'emergency',
    keywords: [
      'emergency', 'fire', 'evacuation', 'evacuate', 'exit', 'exits',
      'emergency exit', 'alarm', 'danger', 'emergancy', 'emegency', 'evacuatin',
    ],
    answer:
      'Emergency exits are marked with illuminated signs on every level and concourse. In an emergency, follow instructions from security staff and stadium PA announcements. Do not use elevators during fire evacuation. Assembly points are in the parking lot sectors outside each gate. For medical emergencies, go to First Aid Station A (near Section 100) or First Aid Station C (near Section 120).',
  },

  // ─── WIFI ──────────────────────────────────────────────────────────────────
  {
    category: 'wifi',
    keywords: ['wifi', 'wi-fi', 'wi fi', 'internet', 'network', 'connect', 'hotspot', 'wif'],
    answer:
      'Free Wi-Fi is available throughout the stadium. Connect to "MetLife_Stadium_WiFi" — no password required. Coverage spans all concourse levels and seating areas.',
  },

  // ─── CHARGING ──────────────────────────────────────────────────────────────
  {
    category: 'charging',
    keywords: ['charging', 'charger', 'charge', 'phone charging', 'battery', 'power', 'plug', 'usb'],
    answer:
      'Free phone charging stations are on Level 0 near Gates B and D, and on Level 1 near Section 210. USB-A and USB-C ports are available. Portable charging kiosks are also near both food courts.',
  },

  // ─── MATCH TIMING ──────────────────────────────────────────────────────────
  {
    category: 'timing',
    keywords: [
      'timing', 'time', 'kickoff', 'kick-off', 'schedule', 'start', 'halftime',
      'when', 'match time', 'game time', 'half time',
    ],
    answer:
      'Gates open 2.5 hours before kickoff. Pre-match entertainment begins 90 minutes before kickoff. Halftime is approximately 15 minutes. Full-time is approximately 2 hours from kickoff. Post-match transport services begin at the final whistle.',
  },

  // ─── FAN ZONE ──────────────────────────────────────────────────────────────
  {
    category: 'fan-zone',
    keywords: [
      'fan zone', 'fanzone', 'fan area', 'entertainment', 'pre-match', 'prematch', 'activities',
    ],
    answer:
      'The Fan Zone is in Lot 17 (East Plaza), open 3 hours before kickoff. Features live music, interactive games, merchandise, and food vendors. Free entry with a valid match ticket. Closes 30 minutes after kickoff.',
  },

  // ─── TICKETS / ENTRY ───────────────────────────────────────────────────────
  {
    category: 'tickets',
    keywords: [
      'ticket', 'tickets', 'scan', 'barcode', 'digital ticket', 'mobile ticket',
      'paper ticket', 'entry', 'validate', 'validation',
    ],
    answer:
      'Both digital and printed tickets are accepted. Have your ticket ready in your mobile wallet for fastest scanning. Tickets are single-use. If you have issues, visit the Ticket Services desk near Gate A.',
  },

  // ─── STADIUM RULES ─────────────────────────────────────────────────────────
  {
    category: 'rules',
    keywords: [
      'rules', 'policy', 'policies', 'allowed', 'prohibited', 'banned',
      'bring', 'can i bring', 'what can i', 'regulations', 'rulse',
    ],
    answer:
      'Permitted items: single-compartment bags up to 14"×14"×6", clear bags, personal cameras (no detachable lens), factory-sealed water bottles. Prohibited items: outside food, large bags, professional cameras, laser pointers, drones, alcohol, weapons, and flags on rigid poles. Full policy is available at Guest Services near Gate A.',
  },

  // ─── WATER / BOTTLES ───────────────────────────────────────────────────────
  {
    category: 'water-bottles',
    keywords: ['water', 'water bottle', 'bottle', 'sealed', 'factory sealed'],
    answer:
      'Factory-sealed plastic water bottles (up to 500ml) are permitted at entry. Opened bottles and glass containers are not allowed. Water is also available for purchase at all concession stands.',
  },

  // ─── SMOKING ───────────────────────────────────────────────────────────────
  {
    category: 'smoking',
    keywords: ['smoke', 'smoking', 'cigarette', 'vape', 'vaping', 'tobacco'],
    answer:
      'Smoking and vaping are prohibited inside MetLife Stadium, including all seating areas, concourses, and covered areas. Designated smoking areas are located in the outer parking lot areas outside the gates.',
  },

  // ─── CAMERAS ───────────────────────────────────────────────────────────────
  {
    category: 'cameras',
    keywords: ['camera', 'cameras', 'photo', 'photography', 'lens', 'professional camera'],
    answer:
      'Personal cameras are permitted. Professional cameras with detachable lenses (lenses longer than 6 inches) are not allowed. Video recording for personal use is permitted. Commercial recording requires prior approval.',
  },

  // ─── FAMILY / CHILDREN ─────────────────────────────────────────────────────
  {
    category: 'family',
    keywords: [
      'family', 'children', 'child', 'kid', 'kids', 'baby', 'stroller',
      'family seating', 'family area',
    ],
    answer:
      'Family seating is available on Level 0 in the south and north sections. Strollers are permitted but must be stored under seats during the match. Family restrooms are available near Gate A and Gate C. Children under 2 years of age seated on a parent\'s lap do not require a ticket.',
  },

  // ─── VIP / CLUB ────────────────────────────────────────────────────────────
  {
    category: 'vip',
    keywords: ['vip', 'club', 'premium', 'lounge', 'club level', 'vip access'],
    answer:
      'Club level access (Level 1, Sections 200–230) requires a ticket for club or suite seating. North Club Bistro offers club-level dining. Club level is fully accessible via Elevators 1–4 from any gate.',
  },
] as const;

/**
 * Professional fallback when no entry matches.
 */
export const UNKNOWN_ANSWER =
  'Thank you for your question. Specific information on this topic is not currently available in the stadium guide. For assistance, please visit the Guest Services desk near Gate A, or ask any stadium staff member on the concourse. They will be happy to help.';
