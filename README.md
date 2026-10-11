# Lung Function Tracker (installable web app)

Enter a person's age, height and spirometry results (FEV₁, FVC, optional FEF₂₅₋₇₅) to get GLI predicted values, LLN, z-scores, percentiles and % predicted, and track each person's results over time.

This is a Progressive Web App (PWA): a website that installs onto a phone, tablet or computer like an app. Once installed it has its own icon, opens in its own window and works offline.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app, including the GLI coefficient and spline tables |
| `manifest.webmanifest` | App name, icons and colors used when it's installed |
| `sw.js` | Service worker that caches the app so it works offline |
| `icons/` | App icons (standard, maskable for Android, Apple touch icon) |

## 1. Install it

Open the address, then:

- **iPhone / iPad (Safari):** tap **Share** → **Add to Home Screen**.
- **Android (Chrome):** tap **Install app** in the sidebar, or use the ⋮ menu → **Install app**.
- **Mac / Windows (Chrome or Edge):** click **Install app** in the sidebar, or the install icon at the right of the address bar.
- **Mac (Safari 17+):** **File → Add to Dock**.

## 2. Where the data is stored

- Everything stays **on the device** in the app's own browser storage. Nothing is sent to a server, and the host only serves the app's files.
- Each device and browser keeps its own records; they don't sync. On iPhone, the installed app's storage is separate from Safari's.
- Deleting the app, or clearing the site's data in browser settings, erases the records. **Use "Back up data" regularly.** It saves a `.json` file that "Restore from backup" can load on the same or another device. Restoring merges records by ID, so nothing is duplicated.
- "Export tests (CSV)" gives one row per test with the measured value, predicted value, LLN, % predicted and z-score for each measure, ready for R, SPSS or Excel.

*Research use:* because data never leaves the device, each device holds its own identifiable health data. If participants will use their own devices, or you need central collection, check the storage, backup and transfer plan with your IRB. Moving the data to a server would need a backend with authentication, which this version doesn't have.

## Reference equations and method

- **GLI Global 2022** (default; race-neutral): Bowerman C, et al. *Am J Respir Crit Care Med* 2023;207(6):768-774. FEV₁, FVC, FEV₁/FVC.
- **GLI-2012**: Quanjer PH, et al. *Eur Respir J* 2012;40(6):1324-1343. FEV₁, FVC, FEV₁/FVC, FEF₂₅₋₇₅; five ethnic groups.
- LMS method: M = exp(a₀ + a₁·ln(height) + a₂·ln(age) [+ ethnicity terms] + Mspline), S and L likewise. LLN = M·(1 − 1.645·L·S)^(1/L); z = ((measured/M)^L − 1)/(L·S); % predicted = 100·measured/M. Spline values are linearly interpolated between the published 0.25-year age steps. Valid ages: 3–95 years.
- Coefficient and spline tables were taken from the MIT-licensed `pyspiro` package (Pott H, et al.). The app's outputs match `pyspiro` exactly at the ages tested.
- Interpretation follows the ATS/ERS 2022 technical standard: normal if z ≥ −1.645. FEV₁ severity is mild (−1.65 to −2.5), moderate (−2.5 to −4) or severe (< −4). An FEV₁/FVC below the LLN indicates obstruction; a low FVC or FEV₁ with a preserved ratio may suggest restriction, to be confirmed with lung volumes.

This app is for research and self-tracking. It is not a medical device and does not give a diagnosis.

**Acknowledgment:** App code, GLI equation implementation and documentation were developed with assistance from Claude (Anthropic). The author reviewed and validated the calculations.
