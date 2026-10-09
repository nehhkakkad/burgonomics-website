# Burgonomics — Handoff Guide (phone reference)

> **Setup:** code + git repo stay **yours**. Vercel account + domain stay **theirs**.
> No GitHub on their side. **They do GoDaddy alone** — you never see those credentials.

---

## Who does what

| Task | Who |
|---|---|
| Create Vercel account (email) | Them |
| Upgrade to Pro ($20/mo, card) | Them |
| Generate deploy token + give you the slug | Them |
| Deploy the site (first + all future) | **You** |
| Add domain in Vercel dashboard | Them (you guide) |
| GoDaddy DNS records | **Them alone** |
| Verify it all works | You |

**You need from them: exactly two things — the team slug and a deploy token.** No passwords.

---

## ⚠️ Raise this before you start

The deploy token is *also* a credential — it can publish code to their site. If they
refused the GoDaddy password, they may hesitate here too. Two ways forward:

1. **Normal path** — they generate it, you store it in the git-ignored `.vercel-token`.
   They can switch it off anytime from their dashboard (Settings → Access Tokens → Delete)
   and the site keeps working. Say that out loud.
2. **If they refuse** — you can't deploy from your machine. The build would have to run
   *on their laptop* over AnyDesk, which means installing Node and putting a copy of the
   code there. Far more painful, and it gives them nothing extra in return.

A scoped, revocable deploy token is *less* access than a GoDaddy login. Worth two minutes.

---

## 1 · Before you connect

**Your machine**
- [ ] Repo pushed, `git status` clean
- [ ] `deploy-vercel.ps1` present
- [ ] `CLIENT-STEPS.md` or `.html` ready to send them

**Them**
- [ ] Email for Vercel
- [ ] Card for Pro
- [ ] The exact domain name

> Passwords and card numbers: **they type**, you drive everything else.

---

## 2 · Vercel account — their laptop

1. **vercel.com** → **Sign up**
2. **Continue with Email** — ⚠️ never GitHub / GitLab / Bitbucket
3. Sign up with their email, confirm the emailed link

Starts on Hobby (free) = *non-commercial only*. This is a business site → step 3.

## 3 · Upgrade to Pro — their laptop

1. Avatar (top-right) → **Settings** → **Billing**
2. **Pro** → **Upgrade** → card → confirm **$20/mo**
3. They approve out loud before you submit

## 4 · Get the two values — their laptop

**Team slug** — Avatar → Settings → General → *Team slug*
Shortcut: read it off the address bar — `vercel.com/<slug>/...`

**Deploy token**
1. **vercel.com/account/tokens** (or Avatar → Settings → Access Tokens)
2. **Create Token** → name `burgonomics-deploy`
3. Expiry → **No expiration** ← the 90-day default breaks deploys silently later
4. Copy it now — shown **once**

Write both down. Token never goes in chat or a shared clipboard.

---

## 5 · First deploy — YOUR machine

```powershell
# a) save their token in a file named .vercel-token (no extension), nothing else in it
# b) open deploy-vercel.ps1, line 21, set their slug:
$Team = "their-slug"
# c) run
.\deploy-vercel.ps1
```

Does: lint → build → `vercel link` (**creates their project if it doesn't exist**) →
`deploy --prod`. Aborts before deploying if lint or build fails.

Their account has no Vercel GitHub App installed → it uploads your local files,
no repo connection attempted.

---

## 6 · Domain in Vercel — their laptop

1. Avatar → Settings → **Domains** → **Add** → type their domain
2. Take Vercel's recommended apex + www
3. Vercel displays the DNS records — **Pending** is normal
4. **Leave that page open** — those values go to GoDaddy next

---

## 7 · GoDaddy DNS — THEY DO THIS ALONE

Send them **`CLIENT-STEPS.md`** or **`.html`** — written for a non-technical person.

Standard Vercel values:

| Type | Name | Value |
|---|---|---|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

**Vercel's page is the source of truth** if it differs.

Ask for a screenshot when done. You're checking:
- [ ] No duplicate A record on `@`
- [ ] No CNAME sitting on `@`
- [ ] Any **Forwarding** removed (forwarding overrides everything)
- [ ] Nameservers aren't Hostinger — if they are, records go in **Hostinger hPanel → DNS Zone**, not GoDaddy

---

## 8 · Verify — 5 min up to 48h

On their browser:
- [ ] `https://` + padlock (Vercel issues the cert automatically)
- [ ] `BURGONOMICS` in chunky blocky letters (MonstroSolid)
- [ ] MENU / LOCATIONS / FRANCHISE / ABOUT US all work
- [ ] Hard-refresh `Ctrl+Shift+R`, then load `/menu` **directly by URL** — must not 404
- [ ] `/fonts/MonstroSolid.woff2` returns 200, not 404

---

## 9 · Cleanup — YOUR machine

Only once their site is confirmed live:

```powershell
'y' | vercel project remove burgonomics-website --scope safe-sponsor-ai
```

Otherwise every push deploys twice and a commercial site sits on your free non-commercial tier.

---

## 10 · Future updates

```powershell
.\deploy-vercel.ps1
```

That's the whole flow. No GitHub, no zip, no File Manager.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Missing .vercel-token` | no token file | create `.vercel-token` with their token |
| `Link failed - check the team slug` | wrong slug | use the address-bar method in step 4 |
| `Deploy failed` | token expired / revoked | new token from their Access Tokens |
| `403 Cannot create tokens for this app` | tried minting via CLI | tokens are dashboard-only |
| Site loads but `/menu` 404s | `vercel.json` rewrite missing | confirm it's at repo root, redeploy |
| Logo in plain font | font not loading | check `/fonts/MonstroSolid.woff2` = 200; hard-refresh |
| Domain stuck *Pending* | DNS conflict / wrong zone | duplicate A record, or nameservers at Hostinger |
| Domain shows a parking page | GoDaddy forwarding still on | remove forwarding in GoDaddy DNS |
| Two deploys per push | old SafeSponsor-AI project still linked | run step 9 cleanup |

---

## Security checklist — before you close AnyDesk

- [ ] `.vercel-token` exists on **your** machine only, never theirs
- [ ] They know the token exists, where it lives, and how to **revoke it**
- [ ] Vercel account email is **theirs** — they can log in without you
- [ ] No token or password left in chat / shared clipboard
- [ ] You never typed their GoDaddy password
