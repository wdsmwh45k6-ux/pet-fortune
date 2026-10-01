# 우리 아이 사주 — Render test build (v2)

Static browser-only app. No AI calls, tracking, account DB, or input persistence. `dist/` is deployable to any static host. Generated backgrounds approved by the user. Text remains separately editable in `dist/content.js`.

## Calculation contract

- Gregorian dates, 1900-01-01 through current Asia/Seoul date; reject impossible dates. Birthday fields intentionally omit birth time and owner name.
- lunar-javascript 1.7.7 MIT, vendored unchanged. Use Solar.fromYmd(...).getLunar().getDayGanIndex(), getDayZhiIndex(), getDayInGanZhi(). Date-only civil midnight rollover, not late-zi 23:00. No invented birth hour.
- Intentionally DAY-PILLAR ONLY. No year/month/hour interpretation, DST, place/time correction, strength analysis, daewoon or health/lifespan predictions. This avoids an undisclosed noon assumption and solar-term boundaries. Future full chart support requires separate scope and verification.
- 10 stem drafts + 12 branch drafts yield 60 valid day-pillar combinations, not 120 (parity). Same day pillar repeats on a 60-day cycle. Same date/content version gives same text; many dates share results.
- Ordered five-element indexes: wood, fire, earth, metal, water. Delta=(owner-pet+5)%5: 0 same, 1 pet generates owner, 2 pet controls owner, 3 owner controls pet, 4 owner generates pet. 25 ordered pairs collapse to 5 relation narratives, with element labels distinguishing pairs. No numeric match score.
- Adoption: user-selected alternative date; now applies the same day-pillar interpretation and result format as birth mode. Input copy explains date-based entertainment; this does not establish an actual birthday.
- All pet/personality interpretation is original entertainment prose, not scientific inference. Humor at most one paragraph, no deterministic bad luck.

## Rendering and privacy

Three independent flows: pet fortune, guardian compatibility, dog-friend compatibility. One complete 1080×1350 PNG per result. Local font and approved ink backgrounds; measured line wrapping and overflow guard. Native mobile share/save when available, PNG download otherwise. No partial saves, login, ads, analytics, payment SDK or user database. Input dates are never placed on cards, sent to an API, stored in browser storage, or included in URLs. Hosting receives ordinary page requests.

Dog-friend matching groups element combinations symmetrically into same / generating / controlling relationships. Adoption dates use the same date-based entertainment format as birthdays. Calculation explanations appear below results; implementation library names appear only on the separate license page.

## Render deployment

1. Put this project into a GitHub, GitLab or Bitbucket repository.
2. Create a **Static Site** in the confirmed Render workspace and connect that repository/branch.
3. Build command: `node scripts/configure.cjs`. Publish directory: `dist`.
4. Disable automatic deployments during testing if desired. The included `render.yaml` describes a static site, not a paid server.
5. Open all three flows on the deployed HTTPS URL and test download/share on an actual phone.

No npm install is required. Local preview: `python -m http.server 4173 --directory dist`.

Optional public configuration:

- `KAKAO_JAVASCRIPT_KEY`: Kakao Developers **JavaScript** key (never an admin key). Register the deployed URL in the app's web domains / JavaScript SDK domains as required by Kakao. Without this key, mobile native share and desktop text-copy fallback work. Dedicated Kakao sharing requires app/domain configuration and has not been live-tested.
- `SITE_URL`: final HTTPS origin for sitemap, or Render's `RENDER_EXTERNAL_URL` if present.

Build these values with `node scripts/configure.cjs`. The Kakao key is intentionally public in browser config. There are no secrets in the source package.

About, calculation guide, privacy, contact, license and three original journal articles are included. This is groundwork for future public operation, not an AdSense approval guarantee. No AdSense code, publisher ID or ads.txt is installed. Confirm contact details and operating policies before applying.

## Verification

`node verify.cjs` uses the Codex runtime canvas package (environment variable `CODEX_PRIMARY_RUNTIME_NODE_MODULES`) for development-only checks; it is not part of the Render build. Verified 290 layouts, all 100 ordered guardian pairs, 100 friend pairs and symmetry, invalid dates, and the documented day-pillar reference. Three full PNG samples were generated. Real-device downloads and Kakao app handoff still need deployed-device testing.

## Sources

https://github.com/6tail/lunar-javascript (MIT, version 1.7.7). Font: Nanum Myeongjo via Fontsource (OFL). Dependency documentation's example: 1986-05-29 = 癸酉 day. Export/test notes in verify.cjs.
