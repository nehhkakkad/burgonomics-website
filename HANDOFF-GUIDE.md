# Burgonomics — Full Handoff Guide (AnyDesk)

> **Goal:** site lives in **their** Vercel account, domain is **their** GoDaddy,
> code/`git` repo stays **yours**. No GitHub account on their side — ever.
> You drive their laptop over AnyDesk; they only need to be present for the card payment.

---

## 0. Before you connect

On **your** machine:

- [ ] Repo pushed and clean — `git status` shows nothing to commit
- [ ] `deploy-vercel.ps1` exists in the project folder
- [ ] This guide open on **your** screen (you'll be reading it while controlling theirs)

Have them ready with:

| # | Thing | Why |
|---|-------|-----|
| 1 | Their **GoDaddy login** (email + password) | DNS changes |
| 2 | An **email** they want for Vercel | account owner |
| 3 | A **card** for Vercel Pro — $20/mo | billing, they must approve |
| 4 | The **exact domain name** | which domain to attach |
| 5 | Their laptop, AnyDesk open | you drive it |

> **Passwords:** let *them* type passwords and card details. You do everything else.

> **AnyDesk tip:** turn on clipboard sync (Settings → Clipboard) so you can copy the
> Vercel token on their laptop and paste it on yours. If it doesn't sync, just read
> it off their screen and type it into your `.vercel-token` file.

---

## 1. Vercel account — on their laptop

1. Go to **vercel.com** → **Sign up**
2. Choose **"Continue with Email"** / email+password
   - ⚠️ **Do NOT pick GitHub, GitLab, or Bitbucket.** They don't have GitHub and mustn't create one.
3. Sign up with their email → confirm via the emailed link
4. If asked to "Create a team" or "personal account" — either is fine, personal is simplest

**Free vs Pro:** the account starts on Hobby (free). Hobby is *non-commercial use only*
per Vercel's terms. This is a business site, so **step 3 upgrades it.** Don't skip —
it's their account and their liability.

---

## 2. Upgrade to Pro — on their laptop

1. Avatar (top-right) → **Settings** → **Billing**
2. Select **Pro** → **Upgrade**
3. Enter card → confirm **$20/mo**
4. **They approve this out loud** before you submit

---

## 3. Grab two values — on their laptop

### a) Team slug

Avatar → **Settings** → **General** → *Team slug*

**Easier way:** look at the address bar in the Vercel dashboard — it reads
`vercel.com/<their-slug>/...`. Whatever follows `vercel.com/` **is** the slug.
For a personal account it's their username.

Write it down. You need it for step 5.

### b) Deploy token

Avatar → **Settings** → **Access Tokens** (also reachable at `vercel.com/account/tokens`)

1. **Create Token**
2. Name it `burgonomics-deploy`
3. Expiry → **No expiration**
   - ⚠️ If you pick the default (90 days), deploys silently break in 3 months.
4. Copy it immediately — **the token is shown only once**

> This token is a password. It never goes in chat, never gets committed, never
> gets shared. It lives in one file: `.vercel-token` (already git-ignored).

---

## 4. Attach the domain in Vercel — on their laptop

1. Avatar → **Settings** → **Domains** → **Add** → type their domain → **Add**
   - Or: create the project first (step 5) and add the domain from
     Project → Settings → Domains. Either order works; doing it here means the
     project inherits it.
2. Vercel asks how to configure apex + www → **take Vercel's recommended option**
   (usually apex redirects to `www`, or vice versa — don't hand-pick)
3. Vercel then shows **the DNS records to create** — a yellow **Pending** state
   is normal right now. Leave that page open.

If it offers **nameservers** instead of A/CNAME, you can use those too (switch the
domain's nameservers to Vercel's) — but records are simpler and keep DNS at GoDaddy.

---

## 5. First deploy — **on YOUR machine**

Now leave their laptop. On yours, in the project folder:

### a) Put their token in the file

Create a file named `.vercel-token` (no extension) in the project root and paste
the token in — nothing else, no quotes, no newline needed.

```
C:\Users\DELL\Desktop\BURGONOMICS WEBSITE\burgonomics final ebsite - Copy\.vercel-token
```

Already git-ignored — verify with `git check-ignore .vercel-token`.

### b) Set their slug in the script

Open `deploy-vercel.ps1`, line 21:

```powershell
$Team = "THEIR-TEAM-SLUG"     # <- change this
$Project = "burgonomics-website"
```

### c) Run it

```powershell
.\deploy-vercel.ps1
```

What it does, in order — and it **stops before deploying** if any step fails:

1. `npm run lint` — warnings allowed, errors abort
2. `npm run build` — failure aborts
3. `vercel link --yes --scope <slug> --project burgonomics-website --token <token>`
   → **creates the project in their account** if it doesn't exist yet (verified with CLI 59.3.0)
4. `vercel deploy --prod --yes --token <token> --scope <slug> --project burgonomics-website`

**Their account has no Vercel GitHub App installed**, so it won't try to connect a
repo — it uploads your local files. (Mine *did* try, because my account has the app.
Yours won't behave that way.)

---

## 6. GoDaddy DNS — on their laptop

> ⚠️ **Check who actually manages DNS first.** If their nameservers point at
> Hostinger (`ns1.dns-parking.com`, `ns1.hostinger.com`, etc.), DNS records must be
> added **in Hostinger hPanel → DNS Zone**, not GoDaddy. GoDaddy → domain → DNS page
> shows the nameservers. Match the records to wherever nameservers point.

In GoDaddy: **My Products → your domain → DNS → Management**

### a) Clear conflicts first (this is what breaks it)

- [ ] Existing **A record on `@`** → **Edit** it to Vercel's IP (don't add a 2nd one)
- [ ] Existing **CNAME on `www`** → **Edit** it to Vercel's value
- [ ] Any **Forwarding** configured → **remove it**, forwarding overrides DNS
- [ ] CNAME on `@` → delete it (illegal with Vercel's A record)

### b) Set the values Vercel showed you

Standard Vercel records:

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

**Use whatever Vercel's page actually displays** — treat that as the source of truth.

### c) Save, then refresh the Vercel Domains page

The yellow *Pending* should start clearing.

**Only one place manages DNS.** Don't set Hostinger nameservers *and* Vercel records.

---

## 7. Verify — 5 min to 48h

Wait 5–10 minutes, then check on **their** browser:

- [ ] Domain loads over **`https://`** with a padlock (Vercel issues the cert automatically)
- [ ] `BURGONOMICS` logo renders in the **chunky blocky** font (MonstroSolid)
- [ ] Nav works: MENU, LOCATIONS, FRANCHISE, ABOUT US
- [ ] **Hard-refresh `Ctrl+Shift+R`** then load `/menu` **directly by URL** —
      must load, not 404 (proves `vercel.json` SPA rewrite is live)
- [ ] `yourdomain.com/fonts/MonstroSolid.woff2` → returns the font, not 404

DNS is usually minutes, sometimes hours. **Worst case 48h.** If still dead after
that, something's wrong — come back with the URL and the GoDaddy record screenshot.

---

## 8. Cleanup — on YOUR machine

Only after their site is confirmed live:

```powershell
vercel project ls --scope safe-sponsor-ai
vercel project remove burgonomics-website --scope safe-sponsor-ai
```
(you'll be prompted `y/N` — pipe it: `'y' | vercel project remove ...`)

**Why:** your `SafeSponsor-AI` team still has the project connected to **your GitHub**
with auto-deploy. Leaving it means every push deploys twice, and you're hosting a
commercial site on a free non-commercial tier. Delete it.

- Keep the GitHub repo — that's the source of truth and stays yours.
- `.vercel/project.json` is git-ignored now; your local link will point at *their*
  project after step 5. That's correct.

---

## 9. Future updates (the whole point)

```powershell
.\deploy-vercel.ps1
```

That's it. Lint → build → deploy to their account. No GitHub, no zip, no File Manager.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Missing .vercel-token` | no token file | create `.vercel-token` with their token |
| `Link failed - check the team slug` | wrong slug | use the URL-bar method in step 3a |
| `Deploy failed` | token expired/revoked | new token from their Access Tokens |
| `403 Cannot create tokens for this app` | trying `vercel tokens add` from CLI | tokens are dashboard-only — create in browser |
| Site loads, `/menu` 404s | `vercel.json` rewrite missing | confirm `vercel.json` is at repo root, redeploy |
| Logo in plain font | font didn't load | check `/fonts/MonstroSolid.woff2` returns 200; hard-refresh |
| Domain still pending | DNS conflict / wrong zone | conflicting A record, or nameservers are at Hostinger |
| Domain parked / wrong page | GoDaddy forwarding still on | remove forwarding in GoDaddy DNS |
| Deploy twice per push | old SafeSponsor-AI project still linked | run step 8 cleanup |

---

## Security checklist — before you close AnyDesk

- [ ] `.vercel-token` created on **your** machine only (not on theirs)
- [ ] Token has **No expiration** but is stored only in the git-ignored file
- [ ] They know the token exists, where it lives, and how to **revoke it**
      (Vercel → Settings → Access Tokens → Delete) — that's their kill switch
- [ ] Their GoDaddy password changed if you typed it on their keyboard and it was visible
- [ ] No `.vercel-token` or password left in any shared clipboard/chat
- [ ] Vercel account email is **theirs** — they can log in without you
