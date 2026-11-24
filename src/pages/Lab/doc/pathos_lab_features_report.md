# PATH/OS Lab — Complete Feature Report

This report covers all features currently implemented inside **PATH/OS Lab** (`/lab`), organized by workspace section, route, and supporting services.

---

## 1. Core Shell, Navigation & Global Utilities
**Source:** `src/pages/Lab/LabLayout.jsx`, `src/pages/Lab/labTheme.css`

- **Collapsible Sidebar Navigation**:
  - **Study Space**: `Overview` (`/lab`), `සූත්‍ර පුස්තකාලය` (`/lab/sutta`, with expandable Tipiṭaka Nikāya tree), `My Map` (`/lab/map`), `My Notes` (`/lab/roadmap`), `Collections` (`/lab/collections`).
  - **Life & Practice**: `Daily Routine` (`/lab/daily-routine`), `Merit Book` (`/lab/pin-potha`), `Reflection` (`/lab/reflection`), `Dedication` (`/lab/dedication`).
  - **Community**: `Explore Maps` (`/lab/explore`), `Starting Point` (`/lab/onboarding`).
  - Supports desktop collapse/expand, mobile slide-over drawer, and collapsible group sections.
- **Top Bar Mode Switcher**:
  - **THE SEEKER** (Sutta & Deep Study) → `/lab/sutta`
  - **THE WARRIOR** (Daily Routine & Habits) → `/lab/daily-routine`
  - **THE CHANGEMAKER** (Merit Book & Deeds) → `/lab/pin-potha`
- **Live Life Clock Pill**: Real-time countdown/lived-time ticker (`years : months : days : hours : minutes : seconds`) synced with `src/services/lifeClockStore.js`.
- **Global Workspace Search (`Search`)**: Searches across Tipiṭaka suttas, personal notes, Knowledge Map nodes, and private Merit Book entries in one modal.
- **Quick Create Menu (`+`)**: Shortcuts to create a Sutta Note, Map Node, Merit Book entry, Dedication, or Collection.
- **Light / Dark Theme Toggle & Cloud Hydration**: Automatic Supabase cloud sync on login for highlights, annotations, reading progress, knowledge maps, practice ecosystem, public profile, daily routine, and life clock.

---

## 2. Study Space Features

### 2.1 Overview Dashboard (`/lab`)
**Source:** `src/pages/Lab/LabHome.jsx`
- **Life Clock Widget**: Configurable Date of Birth, target lifespan, and `remaining` vs. `lived` display mode.
- **Today's Routine & Category Breakdown Donut**: Visualizes today's planned/completed category time allocation with pagination.
- **Routine History Series**: Multi-range (`7D`, `14D`, `30D`, `all`) activity overview linked to daily routine logs and Merit Book entries.

### 2.2 Sutta Library & Reader (`/lab/sutta` & `/lab/sutta/:suttaId`)
**Source:** `src/pages/SuttaStudy.jsx`, `src/services/tipitakaService.js`, `src/services/paliDictionaryService.js`
- **Tipiṭaka Browser & Search**: Hierarchical Nikāya/branch tree navigation, popular/curated sutta filters (`all`, `beginners`, `practice`, `deep`), and full search.
- **Bilingual Reader**: Parallel Pāli & Sinhala reading modes with reading progress tracking (`src/services/readingProgressStore.js`) and sutta bookmarking.
- **Interactive Pāli Dictionary**: Word-by-word Pāli tokenization and dictionary lookup (`lookupPaliWord`).
- **Segment Highlighting**: Color-coded segment highlights (`HIGHLIGHT_COLORS`) persisted via `src/services/highlightStore.js`.
- **Inline Sutta Annotations**: Create categorized notes (`reflection`, `resource`, `comparison`, `further_inquiry`, `question`) directly on sutta segments and send annotations straight to the Knowledge Map.

### 2.3 My Map — Knowledge Mapping & Path Journey (`/lab/map`)
**Source:** `src/pages/Lab/KnowledgeMap.jsx`, `src/services/knowledgeMapStore.js`
- **Visual Node-and-Edge Canvas**: Create, drag-position, connect, and delete nodes (`NODE_TYPES`) and typed relationships (`EDGE_RELATIONS`).
- **Cross-Module Integration**: Pulls sutta annotations, daily routine progress, and reflections into structured study paths (`Notice`, `Understand`, `Practice`, etc.).
- **Public Map Sharing**: Maps can be shared publicly and viewed via `/lab/maps/:mapId` (`src/pages/Lab/PublicMapView.jsx`).

### 2.4 My Notes — Personal Roadmap & Rich Editor (`/lab/roadmap`)
**Source:** `src/pages/PersonalRoadmap.jsx`, `src/services/studyRoadmapStore.js`
- **Notes & Highlights Switcher**: Browse all personal study notes and saved sutta highlights in list or grid view, grouped by category (`Dhamma Study`, `Practice & Discipline`, `Reflections & Insights`, `Summaries & Syntheses`, `Personal Journal`).
- **Rich Text Note Editor**: Formatting toolbar (bold, italic, underline, lists, quotes, links, undo/redo) and note-to-Knowledge-Map linking.
- **Markdown Export**: Export roadmap notes as Markdown (`exportRoadmapAsMarkdown`).

### 2.5 Collections (`/lab/collections`)
**Source:** `src/pages/Lab/Collections.jsx`, `src/services/collectionsStore.js`
- **Curated Study Folders**: Create custom collections with titles and descriptions, search within a collection, and organize mixed items (suttas, map nodes, and notes) in one place.

---

## 3. Life & Practice Features

### 3.1 Daily Routine (`/lab/daily-routine`)
**Source:** `src/pages/Lab/DailyRoutine.jsx`, `src/components/Lab/RoutineHistoryCharts.jsx`, `src/services/dailyRoutineStore.js`
- **Hero & Discipline Meter**: Live 24-hour clock & remaining time counter, "Next Right Action" spotlight card, daily completion percentage donut, and 7-day consistency bar strip.
- **Today's Tasks Workspace**:
  - Category filter chips + **Manage Categories** modal (create, rename, color-code, delete, restore defaults).
  - **Inline Quick-Add Bar** (`10m / 15m / 30m` presets) + **Add New Daily Task Modal** (starter presets + inline `+ New Category` creator + duration picker).
  - Per-task status (`Pending`, `Ongoing`, `Done`), live start/pause timer, `+s` session logger, edit/delete, and one-click export of completed Dhamma tasks to **Merit Book**.
- **Time Allocation Tab**:
  - 24-hour wake/practice/awake rhythm strip, **Category Split** horizontal stacked bar, Wake/Sleep time editors, and Planned vs. Completed 24-hour donut breakdown.
- **Sessions & History Tab**:
  - **Daily Category Allocation Stacked Bar Chart** (`7D` / `14D` / `30D`, `Duration` vs. `100% Mix` modes, interactive category legend highlighting, hover/click day inspector).
  - **Category Balance** horizontal bars, **30-Day Consistency Heatmap** with per-day completed task inspector, and today's session log manager.

### 3.2 Merit Book — Pin Potha (`/lab/pin-potha`)
**Source:** `src/pages/Lab/PinPotha.jsx`, `src/services/practiceEcosystemStore.js`
- **Private Merit Ledger**: Log good deeds by type (`PIN_POTHA_TYPES`), schedule (`once`, `daily`, `poya`, `range`), duration, date, and reflection.
- **Bulk Text Importer**: Parse multi-date journal blocks (`parseBulkPinPothaText`) into structured Merit Book entries.
- **Cross-Links**: View linked Dedications and Reflections per merit entry.

### 3.3 Reflection (`/lab/reflection`)
**Source:** `src/pages/Lab/ReflectionPage.jsx`
- **Self-Observation Check-in**: Track Clarity, Attention, and Balance metrics.
- **Tagged Reflection Journal**: Log observations tagged with `Mindfulness`, `Attachment`, `Distraction`, `Restlessness`, or `Clarity` (`getPathReflections` / `addPathReflection`).

### 3.4 Dedication Studio (`/lab/dedication`)
**Source:** `src/pages/Lab/DedicationStudio.jsx`
- **Dedication Creator**: Create `pattidana`, `dhamma_dana`, `community_service`, or `study_offering` dedications, optionally linked to a Merit Book entry, with `Private` or `Public` visibility.
- **Shareable Card Studio**: Live card preview with 4 selectable visual templates (`Merit Sharing`, `Private Dedication`, `Public Sharing`, `Family / Friend`), WhatsApp share, clipboard copy, modal preview, and **PNG Card Download** (`canvas` export).
- **Recent & Filterable Archive**: Category filter pills with counts, recent 3-column grid, and full paginated view.

---

## 4. Community & Onboarding Features

### 4.1 Explore Maps & Community (`/lab/explore` & `/lab/maps/:mapId`)
**Source:** `src/pages/Lab/ExploreCommunity.jsx`, `src/pages/Lab/PublicMapView.jsx`, `src/services/communityExploreStore.js`
- **Public Maps Directory**: Browse and open shared Knowledge Maps from other users.
- **Public Profiles & Public Dedications (`පුණ්‍යානුමෝදනා`)**: View community profiles and publicly shared dedications.
- **Privacy Controls**: Manage your own public profile visibility and sharing preferences.

### 4.2 Starting Point — Lab Onboarding (`/lab/onboarding`)
**Source:** `src/pages/Lab/LabOnboarding.jsx`
- **5-Step Guided Setup**: Captures personal study intentions (`whyStudy`, `nibbanaUnderstanding`, `questions`, `dailyLifeFocus`) and reading preferences (`readingMode`, UI language), with skip support.
