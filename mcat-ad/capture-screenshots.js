const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = path.join(__dirname, 'node_modules/.remotion/chrome-headless-shell/mac-arm64/chrome-headless-shell-mac-arm64/chrome-headless-shell');
const OUT_DIR = path.join(__dirname, 'public');
const BASE_URL = 'http://localhost:8888/mcat-dashboard.html';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 900 },
  });

  const page = await browser.newPage();

  // First load to get localStorage access
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(1000);

  // Inject demo data using the CORRECT individual mcat-* localStorage keys
  await page.evaluate(() => {
    // Bypass onboarding wizard
    localStorage.setItem('mcat-onboarded', '1');

    // User profile
    localStorage.setItem('mcat-user-name', 'Alex');
    localStorage.setItem('mcat-date', '2026-06-15');
    localStorage.setItem('mcat-target', '520');
    localStorage.setItem('mcat-study-phase', 'content');
    localStorage.setItem('mcat-daily-goal', '6');

    // XP and streak
    localStorage.setItem('mcat-xp', '1450');
    localStorage.setItem('mcat-streak', '7');
    localStorage.setItem('mcat-last-study', '2026-02-11');

    // Full-length test scores
    localStorage.setItem('mcat-tests', JSON.stringify([
      { date: '2026-02-10', test: 'AAMC FL 1', cp: 128, cars: 126, bb: 129, ps: 127 },
      { date: '2026-01-28', test: 'Blueprint FL 1', cp: 125, cars: 124, bb: 126, ps: 125 },
    ]));

    // Study sessions (7 days of data)
    localStorage.setItem('mcat-logs', JSON.stringify([
      { date: '2026-02-11', category: 'Content Review', hours: 2.5, section: 'bb', notes: 'Amino acids & protein structure', topics: ['Amino Acid Classification', 'Protein Structure'] },
      { date: '2026-02-10', category: 'Content Review', hours: 3, section: 'cp', notes: 'Thermodynamics review', topics: ['Thermodynamics', 'Enthalpy'] },
      { date: '2026-02-09', category: 'Practice Problems', hours: 2, section: 'cars', notes: 'CARS passages 1-5', topics: [] },
      { date: '2026-02-08', category: 'Content Review', hours: 4, section: 'ps', notes: 'Social psychology & sociology', topics: ['Social Psychology', 'Sociology'] },
      { date: '2026-02-07', category: 'Content Review', hours: 3.5, section: 'bb', notes: 'Enzyme kinetics', topics: ['Enzyme Kinetics', 'Michaelis-Menten'] },
      { date: '2026-02-06', category: 'Practice Problems', hours: 2, section: 'cp', notes: 'Optics and light', topics: ['Optics'] },
      { date: '2026-02-05', category: 'Content Review', hours: 3, section: 'bb', notes: 'DNA replication & transcription', topics: ['DNA Replication'] },
    ]));

    // Journal entries
    localStorage.setItem('mcat-journal', JSON.stringify([
      { date: '2026-02-11', text: 'First week done! Got through amino acid classifications and protein structure today. Feeling good about B/B section but need to focus more on CARS timing.' },
      { date: '2026-02-09', text: 'CARS is tough - need to work on passage mapping strategy. Did 5 passages today averaging 11 min each, want to get under 10.' },
      { date: '2026-02-07', text: 'Enzyme kinetics finally clicking. Michaelis-Menten makes sense now. Vmax and Km concepts are solid.' },
    ]));

    // Mastery data (section progress)
    localStorage.setItem('mcat-mastery', JSON.stringify({
      'bb': { studied: 12, total: 48 },
      'cp': { studied: 8, total: 42 },
      'ps': { studied: 6, total: 38 },
      'cars': { studied: 5, total: 30 },
    }));

    // Achievements
    localStorage.setItem('mcat-achievements', JSON.stringify({
      'first-session': { unlocked: true, date: '2026-02-05' },
      'week-streak': { unlocked: true, date: '2026-02-11' },
      'first-fl': { unlocked: true, date: '2026-01-28' },
      'score-510': { unlocked: true, date: '2026-02-10' },
      'journal-start': { unlocked: true, date: '2026-02-07' },
    }));

    // Pomodoro settings
    localStorage.setItem('mcat-pomo-min', '25');
    localStorage.setItem('mcat-pomo-break', '5');
    localStorage.setItem('mcat-pomo-long-break', '15');
    localStorage.setItem('mcat-pomo-sessions', '4');
    localStorage.setItem('mcat-timer-sound', 'true');

    // Resources
    localStorage.setItem('mcat-resources', JSON.stringify(null));
    localStorage.setItem('mcat-myResources', JSON.stringify([]));
  });

  // Reload to render with data
  await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await sleep(4000);

  // Check for and dismiss cinema overlay
  const hasCinema = await page.evaluate(() => {
    const cinema = document.querySelector('#cinemaOverlay, [class*="cinema"]');
    return !!cinema;
  });

  if (hasCinema) {
    console.log('Cinema overlay detected, clicking to dismiss...');
    await page.click('body');
    await sleep(6000); // Wait for cinema animation to finish
  }

  // Force-remove any remaining overlays
  await page.evaluate(() => {
    const selectors = [
      '#cinemaOverlay', '#onboardingOverlay', '.cinema-overlay', '.overlay',
      '[class*="cinema"]', '[class*="wizard"]', '[class*="onboard"]',
      '[class*="intro"]', '#particles'
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });
    // Remove any fixed/absolute overlays with high z-index
    document.querySelectorAll('div').forEach(el => {
      const style = getComputedStyle(el);
      if ((style.position === 'fixed' || style.position === 'absolute') &&
          parseInt(style.zIndex) > 50 && el.offsetWidth > 500 && el.offsetHeight > 500) {
        el.remove();
      }
    });
  });
  await sleep(500);

  // Verify nav items are visible
  const navCount = await page.evaluate(() => document.querySelectorAll('.nav-item').length);
  console.log(`Found ${navCount} nav-items`);

  if (navCount === 0) {
    console.error('ERROR: No nav items found! Dashboard may not have loaded correctly.');
    await page.screenshot({ path: path.join(OUT_DIR, 'debug.png'), type: 'png' });
    await browser.close();
    process.exit(1);
  }

  // Capture Dashboard
  console.log('Capturing Dashboard...');
  await page.screenshot({ path: path.join(OUT_DIR, 'dashboard.png'), type: 'png' });

  // Scroll down for bottom of dashboard
  await page.evaluate(() => window.scrollBy(0, 600));
  await sleep(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'dashboard-bottom.png'), type: 'png' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(300);

  // Tab screenshots
  const tabMapping = {
    'Study Log': 'study-log',
    'Score': 'scores',
    'Journal': 'journal',
    'Content': 'content',
    'Study Guide': 'study-guide',
    'Resources': 'resources',
    'Timer': 'timer',
    'Achievements': 'achievements',
  };

  for (const [label, filename] of Object.entries(tabMapping)) {
    const clicked = await page.evaluate((label) => {
      const items = document.querySelectorAll('.nav-item');
      for (const item of items) {
        if (item.textContent.toLowerCase().includes(label.toLowerCase())) {
          item.click();
          return true;
        }
      }
      return false;
    }, label);

    if (clicked) {
      await sleep(1000);
      await page.evaluate(() => window.scrollTo(0, 0));
      await sleep(300);
      console.log(`Captured ${label}`);
      await page.screenshot({ path: path.join(OUT_DIR, `${filename}.png`), type: 'png' });
    } else {
      console.log(`SKIP ${label} (not found)`);
    }
  }

  // Back to dashboard
  await page.evaluate(() => {
    const items = document.querySelectorAll('.nav-item');
    for (const item of items) {
      if (item.textContent.toLowerCase().includes('dashboard')) { item.click(); return; }
    }
  });
  await sleep(500);

  console.log('\nScreenshots saved:');
  fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.png')).forEach(f => {
    const s = fs.statSync(path.join(OUT_DIR, f));
    console.log(`  ${f} (${(s.size/1024).toFixed(0)}KB)`);
  });

  await browser.close();
  console.log('\nDone!');
})();
