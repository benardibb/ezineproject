// Ikon garis (SVG) — 24×24, mengikuti currentColor.
// Pakai: icon("drop") → string <svg>. Tambah ikon baru cukup menambah path di sini.
const P = {
  drop: '<path d="M12 3.5c-3.6 4.7-6 8-6 11a6 6 0 0 0 12 0c0-3-2.4-6.3-6-11z"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.3-4.3"/>',
  steth: '<path d="M6 3v5a4 4 0 0 0 8 0V3"/><path d="M10 12v2.5a5 5 0 0 0 10 0V13"/><circle cx="20" cy="11" r="2"/>',
  alert: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
  shield: '<path d="M12 3l7 3v5c0 5-3.4 8.5-7 10-3.6-1.5-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
  pill: '<path d="M10.6 20.4a5 5 0 0 1-7-7l6.8-6.8a5 5 0 0 1 7 7z"/><path d="M7 10l7 7"/>',
  glass: '<path d="M6 3h12l-1.6 16.2a2 2 0 0 1-2 1.8H9.6a2 2 0 0 1-2-1.8z"/><path d="M6.6 9h10.8"/>',
  leaf: '<path d="M5 20c0-9 6-15 15-15 0 9-5.5 15-14 15z"/><path d="M5 20l7.5-7.5"/>',
  person: '<circle cx="12" cy="8" r="4"/><path d="M4 21c.5-4 3.8-6 8-6s7.5 2 8 6"/>',
  bump: '<circle cx="11" cy="5.5" r="2.5"/><path d="M9 21v-6l-1-4a3 3 0 0 1 3-3h1c2.5 0 3 2 3.5 3.5 1.8.5 2.5 2 2.5 3.5s-1 2.5-3 2.5h-1v3.5"/>',
  plate: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/>',
  worm: '<path d="M3 15c2.5-4.5 4.5 1 7-3.5S14.5 9 17 6c1.2-1.5 2.6-1.4 3.5-.5"/><path d="M19.5 6.5h.01"/>',
  virus: '<circle cx="12" cy="12" r="4.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.2 2.2M16.2 16.2l2.2 2.2M5.6 18.4l2.2-2.2M16.2 7.8l2.2-2.2"/>',
  cup: '<path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5v2.5M12 3.5v2.5"/>',
  scale: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M8.5 10a3.5 3.5 0 0 1 7 0M12 10l1.5-2"/>',
  brain: '<path d="M9.5 4A3 3 0 0 0 6.5 7 3 3 0 0 0 4.5 12a3 3 0 0 0 2 5 3 3 0 0 0 3 3h.5V4zM14.5 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3H14V4z"/>',
  bolt: '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/>',
  baby: '<circle cx="12" cy="12" r="8.5"/><path d="M9 11h.01M15 11h.01M9.5 15a3.5 3.5 0 0 0 5 0M12 3.5c-1 1.5-.5 3 1 3"/>',
  fish: '<path d="M2.5 12c3-4 7-5.5 11-5.5 3.2 0 5.6 2.2 7.5 5.5-1.9 3.3-4.3 5.5-7.5 5.5-4 0-8-1.5-11-5.5z"/><path d="M2.5 12L1 9M2.5 12L1 15M16 11h.01"/>',
  egg: '<path d="M12 3c-3.5 0-6.5 6-6.5 10.5a6.5 6.5 0 0 0 13 0C18.5 9 15.5 3 12 3z"/>',
  citrus: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5.5"/><path d="M12 6.5v11M6.5 12h11M8.1 8.1l7.8 7.8M15.9 8.1l-7.8 7.8"/>',
  tea: '<path d="M4 8h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 9h1.5a2.5 2.5 0 0 1 0 5H16M3 21h14"/>',
  milk: '<path d="M9 2.5h6v3l2 3.5v11a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 20V9l2-3.5z"/><path d="M7 13c2 1 4-1 5 0s3 1 5 0"/>',
  water: '<path d="M6 3h12l-1.6 16.2a2 2 0 0 1-2 1.8H9.6a2 2 0 0 1-2-1.8z"/><path d="M6.8 11c1.7-1 3.5 1 5.2 0s3.5 1 5.2 0"/>',
  fruit: '<path d="M12 8c-4.5-2-8 1-8 5.5S7 21 9.5 21c1 0 1.7-.5 2.5-.5s1.5.5 2.5.5C17 21 20 18 20 13.5S16.5 6 12 8z"/><path d="M12 8c0-2.5 1-4 3-5"/>',
  coffee: '<path d="M5 8h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 9h1.5a2.5 2.5 0 0 1 0 5H16M9 2.5c-.8 1 .8 2 0 3M12.5 2.5c-.8 1 .8 2 0 3"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  box: '<path d="M4 8l8-4.5L20 8v8l-8 4.5L4 16z"/><path d="M4 8l8 4.5L20 8M12 12.5v8"/>',
  hand: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11M11 10V4.5a1.5 1.5 0 0 1 3 0V11M14 10.5V6a1.5 1.5 0 0 1 3 0v7c0 4.5-2.5 8-6.5 8S5 18.5 4 15.5l-1-3a1.5 1.5 0 0 1 2.8-1L8 14"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  chev: '<path d="M9 6l6 6-6 6"/>',
  play: '<path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.5-6.5a1 1 0 0 0 0-1.8L9.5 4.6A1 1 0 0 0 8 5.5z" fill="currentColor" stroke="none"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>',
  home: '<path d="M4 10.5L12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15V15H9v5.5H5.5A1.5 1.5 0 0 1 4 19z"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
  video: '<rect x="3" y="5" width="18" height="14" rx="4"/><path d="M10.5 9.5v5l4-2.5z" fill="currentColor"/>',
  quiz: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
  sparkle: '<path d="M12 3c.5 4.5 2.5 6.5 7 7-4.5.5-6.5 2.5-7 7-.5-4.5-2.5-6.5-7-7 4.5-.5 6.5-2.5 7-7z"/>',
  flip: '<path d="M4 9a8 8 0 0 1 14-3l2 2M20 4v4h-4M20 15a8 8 0 0 1-14 3l-2-2M4 20v-4h4"/>',
};

export function icon(name, cls = "") {
  return `<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || P.sparkle}</svg>`;
}

// Maskot: tetes darah "Hemo" dengan beberapa ekspresi
export function mascot(mood = "happy", size = 96) {
  const face = {
    happy: '<path d="M38 66q12 10 24 0" stroke="#1a1a1a" stroke-width="4" fill="none" stroke-linecap="round"/>',
    wow: '<ellipse cx="50" cy="68" rx="6" ry="7" fill="#1a1a1a"/>',
    meh: '<path d="M40 68h20" stroke="#1a1a1a" stroke-width="4" stroke-linecap="round"/>',
  }[mood];
  return `<svg class="mascot" width="${size}" height="${size * 1.15}" viewBox="0 0 100 115" aria-hidden="true">
    <path d="M50 4C30 32 12 52 12 72a38 38 0 0 0 76 0C88 52 70 32 50 4z" fill="#FF5847"/>
    <path d="M28 64a20 20 0 0 1 8-18" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".55"/>
    <circle cx="38" cy="56" r="4.5" fill="#1a1a1a"/><circle cx="62" cy="56" r="4.5" fill="#1a1a1a"/>
    <circle cx="31" cy="66" r="5" fill="#FF9C8F" opacity=".8"/><circle cx="69" cy="66" r="5" fill="#FF9C8F" opacity=".8"/>
    ${face}
  </svg>`;
}
