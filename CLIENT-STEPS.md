# Your website — 4 short steps

Hi! Four small things on your side, about 10 minutes total.
I'll handle the rest. Nothing here needs any technical knowledge.

---

## Step 1 — Create your Vercel account (2 min)

1. On your computer, go to **vercel.com**
2. Click **Sign Up**
3. Choose **"Continue with Email"** — *not* Google, *not* GitHub
4. Enter your email and a password, then click the confirmation link in your inbox

Use your own email — this account belongs to you, and only you.

---

## Step 2 — Upgrade to Pro (2 min)

1. Click your picture in the top-right corner
2. **Settings** → **Billing**
3. Choose **Pro** ($20 per month) and enter your card

Your website is for a business, and the free plan is only for personal/hobby use,
so this step keeps everything above board.

---

## Step 3 — Create a deployment key (2 min)

This key is what lets me upload updates to your site for you.

1. Go to **vercel.com/account/tokens**
2. Click **Create Token**
3. Name it: `burgonomics-deploy`
4. **Expiration: choose "No Expiration"**
5. Click **Create**, then **copy the key** — it only appears once

**Then send me two things:**

- The key you just copied
- Your **team name (slug)** — it's the word right after `vercel.com/` in your
  browser address bar, or under Settings → General

> **About that key:** it only lets me publish updates. It can't change your billing,
> your domain, or your password. You can switch it off at any time from that same
> page (just click Delete) and the website will keep working — you'd just need to
> send me a new key next time you want an update.

---

## Step 4 — Point your domain at the website (5 min)

Once I've uploaded the site, Vercel will show you two specific settings to copy
across. Here's exactly where to put them in GoDaddy:

1. Sign in at **godaddy.com**
2. Click your name, top-right → **My Products**
3. Next to your domain, click **DNS** (or "Manage DNS")
4. You'll see a table of settings. **At the top it says "Nameservers" —
   tell me what it says before you change anything**
5. Find the row where Type is **A** and Name is **@**
   → click the pencil icon → change the Value to **76.76.21.21**
   → if there's no such row, click **Add** and create one
6. Find the row where Type is **CNAME** and Name is **www**
   → change the Value to **cname.vercel-dns.com**
   → if there's no such row, click **Add** and create one
7. If you see anything labelled **Forwarding**, delete it — it overrides everything
8. Click **Save**
9. Take a screenshot and send it to me so I can check it's right

> If the values shown on your Vercel page differ from the ones above, **use Vercel's**.
> They're the official ones for your account.

---

## That's it

After that I'll check everything is working. The site will be live on your own
domain, and the account and domain stay firmly in your name.

If anything on screen doesn't match what's written here, just send me a screenshot
and I'll tell you what to click.
