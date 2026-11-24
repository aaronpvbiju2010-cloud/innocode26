// LoopYard – app.js
// Load listings (saved ones, or the demo set) and render them as cards.

// ---------- 1. Constants ----------

const STORAGE_KEY = 'loopyard.listings';

const CATEGORY_LABELS = {
  wood: 'Wood',
  mdf: 'MDF',
  acrylic: 'Acrylic',
  plastic: 'Plastic',
  fabric: 'Fabric',
  crates: 'Crates'
};

const listingsEl = document.getElementById('listings');

// ---------- 2. Loading ----------

function loadListings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
  } catch (err) {
    // Storage is blocked (private mode, strict settings) or the saved
    // text is not valid JSON. Fall through to the demo data.
  }

  if (typeof DEMO_LISTINGS !== 'undefined' && Array.isArray(DEMO_LISTINGS)) {
    // Copy each object so later edits (e.g. a claim lowering kgLeft)
    // never change the original demo data.
    return DEMO_LISTINGS.map(listing => ({ ...listing }));
  }

  return [];
}

// ---------- 3. Small display helpers ----------

// Show a dash for missing values, and add a unit suffix when present.
function show(value, suffix = '') {
  if (value === undefined || value === null || value === '') return '—';
  return `${value}${suffix}`;
}

// "2026-12-01" -> "1 Dec 2026". Built from the parts so the date
// never shifts by a day because of time zones.
function formatDate(isoDate) {
  const [y, m, d] = String(isoDate || '').split('-').map(Number);
  if (!y || !m || !d) return show(isoDate);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// ---------- 4. Building one card ----------

function createCard(listing) {
  const item = document.createElement('li');
  const card = document.createElement('article');
  card.className = 'listing-card';

  // Title: category and factory
  const title = document.createElement('h3');
  const category = CATEGORY_LABELS[listing.category] || show(listing.category);
  title.textContent = `${category} · ${show(listing.factory)}`;

  // Status badge (class is cleaned so only safe characters reach it)
  const status = String(listing.status || 'available').toLowerCase();
  const badge = document.createElement('p');
  badge.className = 'status status-' + status.replace(/[^a-z0-9-]/g, '');
  badge.textContent = 'Status: ' + status.charAt(0).toUpperCase() + status.slice(1);

  // Description
  const description = document.createElement('p');
  description.textContent = show(listing.description);

  // Details as label/value pairs
  const details = document.createElement('dl');
  const rows = [
    ['Area', show(listing.area)],
    ['Piece size', show(listing.pieceSize)],
    ['Weight left', show(listing.kgLeft ?? listing.kg, ' kg')],
    ['Price', show(listing.price)],
    ['Collect by', formatDate(listing.deadline)],
    ['Vehicle', show(listing.vehicle)]
  ];
  for (const [label, value] of rows) {
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = value;
    details.append(dt, dd);
  }

  card.append(title, badge, description, details);
  item.append(card);
  return item;
}

// ---------- 5. Rendering the list ----------

function renderListings(items) {
  listingsEl.replaceChildren();

  if (items.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'hint';
    empty.textContent = 'No materials listed yet.';
    listingsEl.append(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const listing of items) {
    fragment.append(createCard(listing));
  }
  listingsEl.append(fragment);
}

// ---------- 6. Start ----------

let listings = loadListings();
renderListings(listings);