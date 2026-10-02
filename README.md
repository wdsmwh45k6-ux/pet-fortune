# 우리 아이 사주 — Render test build (v2)

Static browser-only app. No AI calls, tracking, account DB, or input persistence. `dist/` is deployable to any static host. Generated backgrounds approved by the user. Text remains separately editable in `dist/content.js` and `dist/variety.js`.

## Calculation contract

- Gregorian dates, 1900-01-01 through current Asia/Seoul date; reject impossible dates. Birthday fields intentionally omit birth time and owner name.
- lunar-javascript 1.7.7 MIT, vendored unchanged. Use Solar.fromYmd(...).getLunar().getDayGanIndex(), getDayZhiIndex(), getDayInGanZhi(). Date-only civil midnight rollover, not late-zi 23:00. No invented birth hour.
- Year/month/day pillars are displayed. Editorial interpretation remains day-pillar centered; no hour pillar, full-chart strength analysis, daewoon or health/lifespan predictions. See the reviewed three-pillar calculation contract below.
- 10 stem drafts + 12 branch drafts yield 60 valid day-pillar combinations, not 120 (parity). Same day pillar repeats on a 60-day cycle. Date-seeded editorial selection varies the scenes within that temperament; it is not an additional astrological calculation. Same date/content version gives the same text.
- Ordered five-element indexes: wood, fire, earth, metal, water. Delta=(owner-pet+5)%5: 0 same, 1 pet generates owner, 2 pet controls owner, 3 owner controls pet, 4 owner generates pet. 25 ordered pairs retain 5 relation types and each now has its own relationship scene. No numeric match score.
- Adoption: user-selected alternative date; now applies the same day-pillar interpretation and result format as birth mode. Input copy explains date-based entertainment; this does not establish an actual birthday.
- All pet/personality interpretation is original entertainment prose, not scientific inference. Humor at most one paragraph, no deterministic bad luck.

## Rendering and privacy

Three independent flows: pet fortune, guardian compatibility, dog-friend compatibility. One complete 1080×1350 PNG per result. Local font and approved ink backgrounds; measured line wrapping and overflow guard. Native mobile share/save when available, PNG download otherwise. No partial saves, login, ads, analytics, payment SDK or user database. The selected pet date is visible on the pet card. Input dates are never sent to an API, stored in browser storage, or included in URLs. Hosting receives ordinary page requests.

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

## Review draft: three calendar pillars

Year and month pillars now follow solar terms converted from UTC+8 to fixed UTC+9 (KST). On a term's Korean calendar date, the new pillar applies from 00:00 as an explicit date-only simplification. No birth time is imputed. Historical Korean civil-time changes are not modeled. Transition dates are flagged; precise birth-time readings can differ. Year/month labels are displayed, while editorial personality and compatibility rules still center on day stem/branch, not full-chart strength analysis.

`node verify-pillars.cjs`: six fixed reference cases, 84 term transitions across seven sampled years, including three UTC+8/UTC+9 date rollovers. Layout tests cover 290 cards. Birth/adoption formats remain identical, so the visible input date is neutrally labeled without claiming it is a birthday. The three-pillar version was deployed before the current diversity draft.

## Review draft: reading diversity

`dist/variety.js` adds 122 authored paragraphs: 60 day-stem scenes, 12 day-branch scenes, 10 owner scenes, 25 ordered guardian element scenes and 15 unordered friend element scenes. Existing prose is retained as alternative phrasing. Date-seeded selection is editorial variation, not a new fortune calculation or a claim of greater accuracy. Year/month pillars remain calculation labels rather than personality selection inputs. Names do not influence prose; adoption/birth with the same date remain identical. Friend input order preserves the shared story and exchanges the individual portraits.

For all 365 pet dates in 2021, with guardian date 1986-04-13 and friend date 2020-04-01 held fixed, distinct full bodies (excluding names, dates and labels) increased from 55/60/10 to 363/362/355 for pet/guardian/friends. Shared sentences remain; this is not a guarantee of unique prose for all possible dates.

Run `node verify-variety.cjs` for deterministic selection, diversity and symmetry, and `node verify-variety-layout.cjs` for all 1,095 sample layouts. The latter uses the same canvas dependency as verify.cjs. See `docs/diversity-review.md` for actual draft outputs. This diversity draft has not been deployed; user text review is required first.
