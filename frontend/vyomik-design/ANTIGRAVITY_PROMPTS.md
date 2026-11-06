# VYOMIK redesign: prompts for Antigravity

## How to use
1. Put the whole `vyomik-design` folder inside your existing website project (e.g. `/design-reference/`).
2. Open the project in Antigravity.
3. Paste the **MASTER PROMPT** once, then paste one **PAGE PROMPT** at a time.

---

## MASTER PROMPT (paste first)

I'm redesigning my existing website. The new design is already built as standalone HTML files in `/design-reference/`:

- `1-coming-soon.html`
- `2-new-arrivals.html`
- `3-sign-up.html`
- `4-sign-in.html`
- `5-home.html`
- `assets/` = the real product / clothing photos

Rules:
1. Treat these HTML files as the **pixel-perfect source of truth**. Copy the layout, spacing, colours (black `#050505`, red `#e10600`, white), fonts (Montserrat + Anton), borders, gradients, icons, hover-ready buttons and text **exactly**. Do not "improve", simplify or re-interpret anything.
2. Keep my existing website's logic, routes, backend, auth and data. Only replace the UI/markup/CSS. Wire the new UI to the existing functionality.
3. Everything that isn't a photo (logo, icons, buttons, stripes, tag, cards, countdown) is made with HTML/CSS/SVG in code. Don't replace them with images.
4. Clothing / product photos: use the files in `design-reference/assets/` (`rack-tees.png`, `hero-rack.png`, `oversized-basic-tee.png`, `vyomik-logo-tee.png`, `essential-hoodie.png`). Wherever a product or clothing image is needed, load it from there or from my real product data. Keep the same size and position as in the HTML.
5. The designs are authored on a fixed **1920×1080 (16:9) laptop canvas** and scaled to fit. In the real site, convert to a responsive layout: it must look identical at 1920×1080 and 1366×768, and stay clean on tablet and mobile.
6. Convert the repeated parts (navbar, logo, buttons, product card, input field) into reusable components.
7. When done, open each page in the browser, compare it side by side with the matching file in `/design-reference/`, and fix every visible difference before reporting back.

---

## PAGE PROMPTS (one at a time)

### 1. Coming Soon
Rebuild my coming-soon page from `design-reference/1-coming-soon.html`, exactly the same. Keep the live countdown (days/hours/minutes/seconds) and set the target to my real launch date. Make the "Notify me when we go live" email form save to my existing email/waitlist backend. Social icons link to my real accounts. Use `assets/rack-tees.png` for the clothes rack on the left.

### 2. New Arrivals
Rebuild my new-arrivals / featured-collection section from `design-reference/2-new-arrivals.html`, exactly the same. Each card: NEW badge, wishlist heart, product image, name, fabric | fit line, sale price + struck-through price, colour swatches, ADD TO CART button. Load the cards from my real product data instead of the 3 hard-coded ones. Fallback images: `assets/oversized-basic-tee.png`, `assets/vyomik-logo-tee.png`, `assets/essential-hoodie.png`.

### 3. Sign Up
Rebuild my sign-up page from `design-reference/3-sign-up.html`, exactly the same. Connect Full Name / Email / Password / Confirm Password, the eye toggles, the Terms checkbox, CREATE ACCOUNT and "Continue with Google" to my existing auth. Keep validation, and show errors in the same red/white style. "SIGN IN" links to the sign-in page.

### 4. Sign In
Rebuild my sign-in page from `design-reference/4-sign-in.html`, exactly the same. Connect Email / Password, eye toggle, Remember me, Forgot Password?, SIGN IN and "Continue with Google" to my existing auth. "CREATE ACCOUNT" links to the sign-up page.

### 5. Home
Rebuild my home page from `design-reference/5-home.html`, exactly the same: navbar (Collections dropdown, Our Story, Contact, search, account, Bag count), hero "THE COMPLETE EDIT" with Shop Collection / Explore All buttons, the filter chips (ALL COLLECTIONS, PLAIN TEES, WORDMARK TEES, OVERSIZED HOODIES) and the NEW ARRIVALS row with FIRST DROP badges. Use `assets/hero-rack.png` for the hero image. Product cards come from my real data; chips filter the products. Bag count reads from my real cart.

---

## If something looks off
"Open `design-reference/<file>.html` and my page in the browser at 1920×1080, screenshot both, and fix every difference in spacing, font size, colour and alignment until they match."
