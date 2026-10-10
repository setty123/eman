# EnerMAN: five directions for main2

These are standalone, interactive design previews. The existing React website is unchanged while a direction is being chosen. All previews use text and code-drawn geometry, with no photographic images, no live operational dashboard, and no simulated enquiry submission.

Open `/design-directions/index.html` on the local development server or production preview. The five tabs change the layout, colors, typefaces, and scroll behavior. Each direction has a direct URL using `?direction=signal`, `nocturne`, `kiln`, `cobalt`, or `current`.

## 01. Signal Grid — recommended

- **Identity:** precise, optimistic, credible energy technology.
- **Palette:** porcelain `#F4F6F0`, forest `#143F35`, volt `#D2F56A`, mist `#E5EADF`.
- **Typography:** Space Grotesk headings, DM Sans body.
- **Layout:** asymmetric type-and-system hero, dark product band, sticky process explanation, bright final contact section.
- **Motion:** connection paths move with scroll; an engineering process line progresses beside three chapters; sections reveal gently.
- **Structure:** Home, Solutions, Company, Contact.

## 02. Nocturne

- **Identity:** immersive, technical, expressive.
- **Palette:** midnight `#0D1524`, ice `#EEF3F3`, cyan `#7AE0E8`, blue-black `#162438`.
- **Typography:** Syne headings, Plus Jakarta Sans body.
- **Layout:** wide typography and orbital geometry, overlapping product chapters, restrained company section.
- **Motion:** orbital rotation and drawing respond to scroll; Monitor, Control, and Forecast panels stack.
- **Structure:** Home, Platform, Company, Contact.

## 03. Kiln Editorial

- **Identity:** human, considered, warm.
- **Palette:** cream `#F7F0E4`, plum `#342437`, terracotta `#B44E35`, apricot `#FFD3A8`.
- **Typography:** DM Serif Display headings, Outfit body.
- **Layout:** uneven editorial columns, unboxed product index, numbered vertical chapters.
- **Motion:** a simple geometric sunrise moves as the page scrolls; chapter numerals shift subtly; text reveals.
- **Structure:** Home, Solutions, Contact. Company, leadership, awards, and selected insights are sections within Home.

## 04. Cobalt Index

- **Identity:** functional, clear, structured.
- **Palette:** paper `#F7F8FB`, graphite `#1C2333`, cobalt `#315DFF`, amber `#FFC852`.
- **Typography:** Bricolage Grotesque headings, Inter body.
- **Layout:** a section index, a three-stage system module, expanding product groups, a company panel.
- **Motion:** a connection strip grows with scroll; modules reveal; product groups expand through native accordions.
- **Structure:** Home, Solutions, Company, Contact.

## 05. Quiet Current

- **Identity:** calm, minimal, refined.
- **Palette:** ivory `#F9F8F2`, teal `#075E57`, lilac `#DDD9F7`, soft sage `#E9EEE5`.
- **Typography:** Fraunces headings, DM Sans body.
- **Layout:** an airy serif hero, one flowing line, unboxed solution rows, a rounded contact section.
- **Motion:** the line draws with scroll; subsequent sections transition softly.
- **Structure:** Home, Solutions, Contact. Company information lives in Home.

## Route consolidation after selection

The eventual implementation should keep three or four main navigation pages, plus a small legal page. Product detail content should become accessible sections, accordions, or panels within Solutions. Leadership, engineering capabilities, awards, team information, articles, and news should be consolidated into their chosen parent page without losing substantive content.

Existing public routes should redirect to their relevant parent page and section so old links continue to work. Route consolidation is proposed here; the existing 27 routes have not yet been changed.

## Motion and accessibility

The prototypes use native scrolling, IntersectionObserver reveals, CSS sticky chapters, and requestAnimationFrame updates only after scroll or resize events. Motion defaults to the system's `prefers-reduced-motion` setting. The review switch lets a visitor explicitly opt into motion for previewing, without changing their system settings. On small screens, content stacks and sticky product panels become ordinary sections.

Fonts are self-hosted in the preview directory. `scripts/prepare-design-fonts.mjs` retrieves Latin font files from Google's font service; the existing application dependencies are unchanged.
