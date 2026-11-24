# **PATH/OS — Complete User Journey & Cross-Feature Integration Plan**

PRODUCT EXPERIENCE ARCHITECTURE · DAILY LIFE × STUDY × PRACTICE × REFLECTION × CONTRIBUTION

After reviewing the complete feature report, I see a major opportunity.

**PATH/OS already contains most of the tools required for a connected life-management experience. What it needs next is a unified system of user journeys connecting them.**

Right now, the application has:

- A **Sutta Library** for studying and understanding.
- **My Notes and My Map** for organizing and connecting understanding.
- **Daily Routine** for planning and carrying out activities.
- **Reflection** for examining actual experiences.
- **Merit Book** for recording wholesome deeds and practices.
- **Dedication** for sharing or dedicating merit.
- **Collections and Community** for organizing and sharing useful knowledge.
- **Overview and Starting Point** for orientation.

These shouldn't feel like independent tools that users must learn to coordinate manually.

They should become different ways of engaging with the **same ongoing life journey**.

## **1. The central product concept**

PATH/OS EXPERIENCE MODEL

# **Life is the centre. Tools are connected around it.**

**My Life / My Direction**

What matters to me? Where am I now?

Understand

Suttas · Notes · Map

Live

Routine · Activities

Reflect

Journal · Merit Book

**Contribute & Continue**

Merit · Dedication · Community · Tomorrow

This is not a one-way process.

A person might study first and then practise. Another might do something meaningful first and reflect on it afterward. Someone else might begin with a problem in their daily life and search for a relevant teaching.

**Every module should be able to become an entry point, and every meaningful action should have a natural next step.**

### **Fundamental change**

Instead of:

`Open Daily Routine → Add task → Complete task → Leave`

PATH/OS should support:

`Enter from anywhere → Understand context → Choose an action → Live it → Record what happened → Connect learning → Continue`

Not every journey needs all these steps. The user should be able to stop after one useful action.

## **2. Daily Routine becomes the execution layer of PATH/OS**

I would introduce a shared concept called a **Life Activity**.

A Life Activity isn't necessarily a scheduled task. It can represent an intention, a study activity, a commitment, something completed spontaneously, or something a person wants to revisit.

For example:

CONNECTED LIFE ACTIVITY

**Practise patience in conversations**

Practice

Origin: An insight from Sutta Study

Plan: Practise during daily conversations

Action: Record what was actually practised

Reflection: What happened? What was difficult?

Connection: My Map / Personal Notes

Continuation: Practise again when appropriate

The user shouldn't need to create six separate records.

Instead, PATH/OS maintains one connected activity history, while each tool presents the parts relevant to it.

This also resolves a major limitation of a conventional task manager: **not every meaningful action is predictable or measurable in minutes.**

Some activities are time-bound, such as studying for 20 minutes. Others are event-based, such as helping a family member, or ongoing intentions, such as speaking with greater care.

## **3. Four ways a user can enter the experience**

**A. Daily-life entry**

The person opens Daily Routine or Overview because they want to start, plan, organize, or review their day.

**B. Knowledge entry**

The person is reading a Sutta, writing a note, exploring a collection, or creating a map node and discovers something they want to practise.

**C. Experience entry**

Something already happened. The person opens Reflection, Merit Book, or Dedication to document, examine, or share an experience.

**D. Community entry**

The person explores someone else's map, reads shared material, or discovers a useful practice through the community.

The same connected system should support all four.

## **4. The first-time Daily Routine experience**

I would not make every new user complete a long onboarding questionnaire before they can use the app.

The existing five-step Starting Point flow can remain available for deeper personalization. But the first Daily Routine visit needs a much smaller, immediate starting experience.

### **Proposed opening component**

**My Day**

PATH/OS · BEGIN WHERE YOU ARE

Starting Point

# **Where would you like to begin?**

You don't need to have everything figured out.

I'm not sure what to do

I want to start something now

I want to plan today or tomorrow

I already did something worth recording

I want to continue something

Not sure where to begin

Choose a small activity from Study, Practice, Daily Life, or Helping Others. You can change it at any time.

Explore a starting activity&#x20;

Interactive journey selector for exploring the proposed UX; it is not connected to the PATH/OS application.

The system should distinguish between:

- **First visit:** Offer a starting activity or a simple plan.
- **Returning with a plan:** Show the next relevant action.
- **Returning without a plan:** Help begin or choose an activity.
- **Returning with unfinished work:** Offer to continue, reschedule, or discard.
- **Returning after an absence:** Offer a fresh start, not a warning about lost streaks.

This approach should work whether someone is highly disciplined, completely new to Dhamma, already experienced, busy with study or work, or using PATH/OS simply to explore and understand.

# **Part II — Connecting Daily Routine with Every Existing Tool**

## **5. The cross-feature integration matrix**

This is the most important part of the plan.

For each tool, we need to support movement **into Daily Routine** and **out of Daily Routine**.

The feature report confirms several existing data connections, but the majority of the proposed entry actions and return journeys would be new UX work.

E = already supported in some form by the report · P = proposed extension

| Tool               | Tool → Daily Routine                                            | Daily Routine → Tool                                                           |
| ------------------ | --------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Overview**       | E: Open routine data; P: act directly on a selected day         | E: Completed/planned time contributes to dashboard                             |
| **Sutta Reader**   | P: Turn a passage or annotation into a practice activity        | P: Open linked passage during a task or session                                |
| **My Map**         | P: Convert a node or understanding into an actionable intention | E: Map pulls routine progress; P: attach specific experiences to nodes         |
| **My Notes**       | P: Turn a note, question, or takeaway into a routine activity   | P: Create or update a note from a completed activity                           |
| **Collections**    | P: Create a flexible study/practice plan from selected items    | P: Save related resources as a reusable collection                             |
| **Merit Book**     | P: Repeat or schedule a previously recorded practice            | E: Export completed Dhamma tasks; P: link records without duplicating them     |
| **Reflection**     | P: Turn an observed pattern into a next-day intention           | P: Launch a contextual reflection with the activity attached                   |
| **Dedication**     | P: Plan a helpful action inspired by a dedication               | E: Link to Merit Book; P: enter the dedication flow from a completed activity  |
| **Explore Maps**   | P: Adapt a shared idea into a private action                    | P: Share a selected understanding, never private routine details automatically |
| **Starting Point** | P: Transform onboarding goals into starter routine suggestions  | P: Revisit and refine goals when routine needs change                          |
| **Global Search**  | P: Add a "Practise / Plan" action to relevant results           | P: Search for a Sutta, note or map node without leaving the activity           |
| **Quick Create**   | P: Add Task, Record Activity, or Reflection shortcuts           | P: Create another connected record without re-entering context                 |

The goal is not simply adding links between pages.

It's enabling a user to carry their **context** across pages.

For example, when someone selects "Create a practice" from a Sutta annotation, PATH/OS should preserve the Sutta ID, segment reference, selected text, and original note. The resulting routine activity should be able to return to precisely that source.

## **6. A universal interaction: "What would you like to do with this?"**

I would introduce a consistent contextual action component throughout PATH/OS.

Insight from a Sutta

Source: Sutta Library · Personal annotation

"This teaching is something I want to apply in my conversations."

Take this understanding into daily life

Practise now

Plan for later

Save intention

Connect to My Map

Concept component. The actions above illustrate the proposed integration, rather than performing changes to PATH/OS.

This interaction can be reused across Suttas, notes, map nodes, reflections, collections, and merit records. The options should adapt to the source, rather than displaying every action everywhere.

### **Shared actions across the product**

| Action               | Meaning                                     | Result                                                    |
| -------------------- | ------------------------------------------- | --------------------------------------------------------- |
| **Start now**        | Do something immediately                    | Opens a session or direct activity screen                 |
| **Plan**             | Assign it to a date or time                 | Creates a planned activity                                |
| **Save for later**   | Keep the intention without scheduling it    | Adds it to an intention inbox                             |
| **Record an action** | Capture something already done              | Creates a retrospective record                            |
| **Reflect**          | Examine an experience                       | Opens a reflection linked to context                      |
| **Connect**          | Link a source, idea or life area            | Adds an explicit relationship                             |
| **Repeat**           | Use a past activity again                   | Creates a new occurrence without duplicating the original |
| **Share / Dedicate** | Make a permitted contribution or dedication | Opens a preview and privacy confirmation                  |

## **7. Detailed end-to-end journeys**

These demonstrate how the experience should feel in practice.

### **Journey 01 — A new user who doesn't know what to do**

1. Opens `/lab/daily-routine` for the first time.
2. Sees "Where would you like to begin?" rather than eight tasks and a 0% meter.
3. Chooses "I'm not sure."
4. PATH/OS offers small starting choices: Understand, Practise, Take Care of Life, or Help Others.
5. Selects a suggested 10-minute Dhamma study activity.
6. The relevant Sutta or curated collection opens with an optional session control.
7. Afterward, the user can mark the activity complete, add a note, or simply finish.
8. PATH/OS offers "Would you like to continue with this tomorrow?"

**UX principle:** Completing one useful action is enough for a successful first visit.

### **Journey 02 — Studying something and wanting to practise it**

**Sutta Reader**

Select passage → Highlight → Add annotation

**Create an intention**

"I want to apply this teaching when I feel impatient."

**Daily Routine**

Add an event-based intention: "Notice impatience before responding."

**Reflection**

"What happened? What did I notice? How did I respond?"

**My Map + My Notes**

Connect the experience to the original teaching and any new understanding.

The crucial distinction: Sutta reading progress already exists, but automatically treating a reading session as a completed daily-life practice would be misleading. The person should choose whether that study becomes part of their routine.

### **Journey 03 — Someone does a good deed unexpectedly**

A person helps a neighbour and later opens PATH/OS.

They can enter through **Merit Book**, **Daily Routine**, or a global "Record what I did" action.

The system asks for only the relevant details: what happened, when, and whether they'd like to add a reflection.

The person then has optional next actions:

- Connect the act to a personal intention.
- Add it to their activity history.
- Repeat it as a future commitment.
- Create a Dedication.
- Keep the experience completely private.

One recorded event should be linkable to both Merit Book and Daily Routine without counting it as two independent activities.

### **Journey 04 — A difficult experience leads to a learning opportunity**

A person feels frustrated during work or study.

They open Reflection, describe the experience, and tag it as Restlessness or Distraction.

The system could offer:

**"Would you like to explore this further, or choose something to practise?"**

If the user chooses to explore, PATH/OS can link them to a relevant Sutta, existing note, or map node. If they choose to practise, they can create a small actionable intention.

Later, the next reflection can refer to the previous experience, helping the person recognize change without claiming to diagnose or evaluate their inner state.

### **Journey 05 — A person wants to contribute to society**

A user creates an intention such as "Help younger students understand mathematics."

They schedule a session through Daily Routine, record what was actually done, and optionally create a Merit Book entry.

They can then make a Dedication or add a public contribution with a carefully reviewed description.

The recipient's personal information remains private. This experience could also link to a Changemaker area in My Map, helping the user understand how their work connects with a broader purpose.

### **Journey 06 — A person returns after a long break**

They open PATH/OS after two weeks.

The interface doesn't start with a failed streak.

Instead:

## **Welcome back.**

You can continue where you stopped or begin with a new day.

**Previously, you were exploring:**

One Sutta, two unfinished activities, and a saved reflection.

**Continue**

**Start fresh**

The past remains accessible; nothing is automatically marked completed or failed.

These are examples of **cross-feature journeys**. The next section expands them into the broader set of cases the product should handle.

# **Part III — Comprehensive Use Case Inventory**

## **8. Daily-life entry scenarios**

These are cases that should work even when the person has never opened the Sutta Library, doesn't have a fixed schedule, or doesn't know what they need.

| ID  | User situation                    | PATH/OS response                                     |
| --- | --------------------------------- | ---------------------------------------------------- |
| D01 | First-time visitor                | Offer a simple Starting Point                        |
| D02 | Doesn't know what to do           | Show small, relevant starting choices                |
| D03 | Has only 5 minutes                | Offer a short activity without requiring a full plan |
| D04 | Wants a productive day            | Build a flexible plan around priorities              |
| D05 | Already planned the day           | Show the next relevant task                          |
| D06 | Has too many tasks                | Help choose priorities or reduce the plan            |
| D07 | Wants to plan tomorrow            | Open a guided tomorrow planner                       |
| D08 | Forgot to record yesterday        | Offer retrospective logging                          |
| D09 | Completed something unexpectedly  | Record the action without creating a prior task      |
| D10 | Missed a planned activity         | Keep it open, reschedule or dismiss                  |
| D11 | Wants a repeating practice        | Set daily, weekly or custom recurrence               |
| D12 | Needs to do something immediately | Start without filling out a task form                |
| D13 | Wants to practise without a timer | Allow an event-based activity                        |
| D14 | Has no fixed wake/sleep schedule  | Use flexible daily boundaries                        |
| D15 | Needs to pause an activity        | Preserve session progress                            |
| D16 | Has an interrupted session        | Resume, complete or discard the session              |
| D17 | Wants to change priorities        | Reorganize without losing history                    |
| D18 | Doesn't want to plan              | Allow direct recording and reflection                |

**Design implication:** Daily Routine needs three equally supported actions: **Plan**, **Do**, and **Record**. Planning cannot be a mandatory prerequisite for doing.

## **9. Sutta-study-first scenarios**

| ID  | User situation                         | Cross-feature journey                                |
| --- | -------------------------------------- | ---------------------------------------------------- |
| S01 | Finds an interesting passage           | Highlight → Create intention → Daily Routine         |
| S02 | Doesn't understand a Pāli word         | Dictionary → Note or question → Future study         |
| S03 | Wants to read a Sutta every morning    | Sutta → Recurring routine activity                   |
| S04 | Stops halfway through reading          | Save reading progress → Resume later                 |
| S05 | Learns something useful                | Annotation → My Map → Practical activity             |
| S06 | Wants to review a teaching weekly      | Bookmark → Plan review session                       |
| S07 | Wants to study a related concept       | Map connection → Sutta Reader                        |
| S08 | Has a question during a practice       | Routine → Search → Sutta Reader → Return to activity |
| S09 | Finishes reading but hasn't applied it | Optional "How might this apply?" reflection          |
| S10 | Wants to compare multiple Suttas       | Collection → Study plan → Notes                      |
| S11 | Wants to revisit previous highlights   | My Notes → Original passage → Practice intention     |
| S12 | Wants a study-only experience          | Continue reading without creating routine records    |

The last case is important. PATH/OS must connect tools without making users feel forced to use every tool.

## **10. My Map, Notes and Collections scenarios**

| ID  | User situation                                   | Cross-feature journey                                           |
| --- | ------------------------------------------------ | --------------------------------------------------------------- |
| K01 | Creates an understanding node                    | My Map → Optional daily application                             |
| K02 | Notices a knowledge gap                          | My Map → Sutta Search → Study plan                              |
| K03 | Wants to develop a skill or conduct              | Map Node → Repeated practice                                    |
| K04 | Reflects on an existing map node                 | Routine or Reflection → Link experience to node                 |
| K05 | Writes an important note                         | My Notes → Create intention                                     |
| K06 | Wants to organize notes around a goal            | Notes → Collection → Study sessions                             |
| K07 | Has a long-term learning project                 | Collection → Flexible multi-day plan                            |
| K08 | Repeatedly encounters the same difficulty        | Reflection history → Map connection                             |
| K09 | Wants to see how understanding influenced action | Map Node → Linked activities and reflections                    |
| K10 | Doesn't want their map to become cluttered       | Save to inbox without automatically creating nodes              |
| K11 | Revises a previous understanding                 | Update note/map connection while preserving history             |
| K12 | Wants to share an insight                        | Preview and publish selected content, excluding private records |

Here, **My Map becomes a connected understanding system**, while Daily Routine becomes one way to apply that understanding.

## **11. Reflection, Merit Book and Dedication scenarios**

| ID  | User situation                            | Cross-feature journey                             |
| --- | ----------------------------------------- | ------------------------------------------------- |
| R01 | Completes a planned practice              | Daily Routine → Optional Reflection               |
| R02 | Notices a recurring difficulty            | Reflection → Create a future intention            |
| R03 | Does something generous                   | Merit Book → Optional daily-life record           |
| R04 | Records meditation after the fact         | Merit Book → Link or create activity record       |
| R05 | Wants to repeat a meaningful action       | Merit Book → Schedule future occurrence           |
| R06 | Wants to record a Poya-related practice   | Merit Book → Optional Poya recurrence             |
| R07 | Has a previously completed Dhamma task    | Daily Routine → Existing Merit Book export        |
| R08 | Wants to offer a dedication               | Merit Book → Dedication Studio                    |
| R09 | Wants to share a dedication on WhatsApp   | Dedication → Card Preview → Privacy Check → Share |
| R10 | Wants a dedication to remain private      | Save privately without exposing content publicly  |
| R11 | Has several related deeds                 | Group or link activities under a common intention |
| R12 | Wants to reflect without logging any task | Reflection-only entry                             |
| R13 | Notices a change in conduct               | Reflection → Link to previous experience          |
| R14 | Wants to examine a difficult response     | Record situation → Response → What was learned    |
| R15 | Wants to express gratitude                | Reflection or Merit Book → Optional Dedication    |
| R16 | Wants to contribute more consistently     | Previous merit entry → Future service intention   |

One major rule: **A deed, task, reflection and dedication are not the same type of record.** They may be linked, but completing a task must not automatically claim that someone has performed a spiritually meaningful act.

## **12. Community, onboarding and global navigation scenarios**

| ID  | User situation                                      | Cross-feature journey                                           |
| --- | --------------------------------------------------- | --------------------------------------------------------------- |
| C01 | Finds a useful public map                           | Explore → Save source → Private study intention                 |
| C02 | Finds an idea they want to try                      | Public Map → Adapt to own routine                               |
| C03 | Wants to share a useful learning path               | My Map → Public sharing preview                                 |
| C04 | Wants to help someone study                         | Daily Routine → Service activity → Optional contribution record |
| C05 | Has no clear direction                              | Starting Point → Personal intention → Starter plan              |
| C06 | Changes goals over time                             | Daily Routine → Revisit Starting Point                          |
| C07 | Searches for a teaching                             | Global Search → Reader → Optional practice                      |
| C08 | Searches for an old note                            | Global Search → Note → Continue intention                       |
| C09 | Wants to record something quickly                   | Global Quick Create → Record Activity                           |
| C10 | Wants to begin a task from anywhere                 | Global action menu → Start Now                                  |
| C11 | Wants to preserve a useful resource                 | Sutta/Note/Map → Collection                                     |
| C12 | Opens Overview to review their week                 | Chart inspector → Relevant day and activity                     |
| C13 | Wants to share an experience but not their identity | Share selected content only, if supported by privacy settings   |
| C14 | Doesn't want to join community features             | Use the complete private life workspace                         |

This supports both community-oriented and entirely private use.

## **13. Important exceptional cases**

These are often overlooked in initial UX designs, but they determine whether the application becomes useful in everyday life.

| ID  | Situation                                            | Expected behavior                                                 |
| --- | ---------------------------------------------------- | ----------------------------------------------------------------- |
| X01 | User is busy with examinations or work               | Let routine priorities temporarily change                         |
| X02 | User has an irregular schedule                       | Avoid assuming fixed morning/evening blocks                       |
| X03 | User goes offline                                    | Allow locally available actions and queue synchronization         |
| X04 | User switches devices                                | Sync records without creating duplicates                          |
| X05 | User accidentally completes a task                   | Allow undo                                                        |
| X06 | User logs the same activity twice                    | Offer to link or resolve duplicates                               |
| X07 | User starts a session before midnight                | Preserve correct dates and elapsed time                           |
| X08 | User can't remember exact duration                   | Accept an approximate or unknown duration                         |
| X09 | User wants to delete a private entry                 | Handle deletion and linked-record references clearly              |
| X10 | User feels overwhelmed by metrics                    | Offer a simplified, metric-light mode                             |
| X11 | User doesn't want reminders                          | All reminders remain optional                                     |
| X12 | User changes their understanding                     | Allow revision without rewriting history                          |
| X13 | User has no measurable progress                      | Support meaningful non-numeric reflection                         |
| X14 | User opens the app after months                      | Restore context and offer a fresh start                           |
| X15 | User prefers Sinhala                                 | Keep navigation, controls and guidance understandable in Sinhala  |
| X16 | User uses only keyboard or assistive technology      | Ensure accessible actions and navigation                          |
| X17 | User has unfinished activities from several days     | Provide a manageable review, not a large overdue queue            |
| X18 | User wants an activity repeated without a fixed time | Use event-based intentions instead of scheduled timers            |
| X19 | User disagrees with a suggested action               | Explain its source and allow dismissal                            |
| X20 | User wants to pause using progress tracking          | Keep study, journaling and practice features usable independently |

This gives us **92 identified use cases** across the six groups above. They form an initial coverage inventory, not a guarantee that every possible human situation has been captured.

# **Part IV — Designing the Connected System**

## **14. The critical new component: Life Activity Inbox**

Between understanding something and committing to it, there should be a place to save intentions.

Without this, users face only two options: immediately schedule everything, or forget the idea.

I propose an **Intention Inbox**, accessible from Daily Routine and global Quick Create.

**My Intentions**

Things worth considering, without a schedule yet

**Reflect on a Sutta about right speech**

Sutta Study

Saved from a personal annotation

Do nowPlan&#x20;

**Help a student with mathematics**

Service

Saved as a personal intention

Saving an intention does not create an overdue task.

The Inbox is a proposed feature, separate from the current task list. It solves a particularly important journey:

**I understand something → I want to apply it → I'm not ready to schedule it yet.**

## **15. The Daily Routine workspace should have four practical modes**

These are not the Seeker, Warrior and Changemaker identities. They are functional views of one day.

**Now**

A focused interface showing one selected activity, quick controls and a simple way to return to its linked source.

**Plan**

Today, tomorrow, recurring activities, unscheduled intentions, and flexible day structure.

**Review**

What was actually done, what was planned, session history, time allocation and optional reflection.

**Connections**

Related Suttas, notes, map nodes, Merit Book entries, reflections and dedications.

The initial screen can automatically emphasize **Now** for someone who wants to act, or **Plan** for someone preparing tomorrow. Advanced category filters, history charts and task-management controls remain available without occupying the first screen.

## **16. Add a shared data model behind the journeys**

Your existing report mentions several stores:

`dailyRoutineStore`, `practiceEcosystemStore`, `knowledgeMapStore`, `studyRoadmapStore`, `highlightStore`, `readingProgressStore`, and others.

I would not replace all of them with one giant store.

Instead, introduce a **shared activity-and-linking layer** that preserves the existing modules.

| Proposed entity          | Purpose                                                     |
| ------------------------ | ----------------------------------------------------------- |
| `LifeActivity`           | Reusable intention or activity definition                   |
| `ActivityOccurrence`     | Specific planned or actual instance of an activity          |
| `ActivitySession`        | Timer-based or manually entered duration                    |
| `ActivitySourceLink`     | Relationship to Sutta segment, note, map node or collection |
| `ActivityReflectionLink` | Relationship to an observation or journal entry             |
| `ActivityMeritLink`      | Relationship to a Merit Book entry                          |
| `ActivityDedicationLink` | Relationship to a dedication through its relevant source    |
| `IntentionInboxItem`     | Saved intention without commitment                          |
| `SuggestedNextAction`    | Optional recommendation with provenance and dismissal state |

A task should be able to exist without a timer. A session should be able to exist without an advance plan. A reflection should be able to exist without either.

### **The essential data distinction**

**Planned**

What I intended

**Recorded**

What happened

**Reflected**

What I understood

Do not combine these into a single completion percentage.

For example, a user might plan one hour of study, record 25 minutes, and have a valuable insight. These are three distinct pieces of information.

For implementation, I would also require stable IDs, source references, user-owned privacy settings, idempotent creation to prevent duplicate cloud records, and explicit handling of timezone and retrospective entries.

# **Part V — Intelligent User Journeys**

## **17. What should make PATH/OS feel intelligent?**

Not an AI chatbot everywhere.

An intelligent experience should primarily recognize context and reduce unnecessary decisions.

I would introduce a **Next Action Resolver**, initially using explainable application rules rather than a complex AI model.

Its inputs could include:

- User-selected intentions and preferences.
- Previously saved activities.
- Available time, when the user provides it.
- Current planned activities.
- Unfinished sessions.
- Linked Sutta readings and notes.
- Explicitly recorded routine history.
- User-selected goals from Starting Point.

Its outputs should be small, optional choices.

For example:

| Context                       | Appropriate suggestion                          |
| ----------------------------- | ----------------------------------------------- |
| No activity exists            | "Would you like to choose a starting practice?" |
| Recently saved Sutta note     | "Would you like to apply this understanding?"   |
| Has unfinished reading        | "Continue your previous Sutta?"                 |
| Tomorrow has no plan          | "Choose one intention for tomorrow?"            |
| Recently completed a practice | "Would you like to reflect on it?"              |
| Recorded a good deed          | "Would you like to add this to Merit Book?"     |
| Repeatedly postpones a task   | "Would a smaller or different plan help?"       |
| Returning after an absence    | "Continue where you left off or start fresh?"   |

Every suggestion should be dismissible and should explain why it appeared.

The system must not infer someone's spiritual achievement, virtue, or mental condition from these records.

## **18. The three PATH/OS identities should shape the perspective, not restrict functionality**

| Perspective     | Primary question                                | Natural default tools               |
| --------------- | ----------------------------------------------- | ----------------------------------- |
| **Seeker**      | What do I need to understand?                   | Suttas, Notes, Map, Collections     |
| **Warrior**     | How do I bring that understanding into conduct? | Daily Routine, Sessions, Reflection |
| **Changemaker** | How can my actions benefit others?              | Merit Book, Dedication, Community   |

Someone should be able to move between these at any time.

For example, when a user starts an activity from a Sutta, the interface can retain the Sutta as context while opening a Warrior-oriented practice view. After a helpful action, it can offer Changemaker-oriented next steps without changing the person's identity setting automatically.

# **Part VI — Implementation Roadmap**

## **19. What to build first**

I would prioritize the connecting flows before redesigning every screen again.

01

**First Visit + Starting Point**

Build a lightweight first-use flow inside Daily Routine, linked with the existing `/lab/onboarding`. Allow users to start without completing the five-step setup.

Success: A new user can begin an activity without first creating a schedule or category.

02

**Universal Activity Creation**

Introduce Start Now, Plan, Save for Later, and Record What I Did. Support timer-based, event-based, recurring, and retrospective activities.

Success: Each activity can be created with only the details it actually requires.

03

**Sutta ↔ Routine ↔ Notes Connections**

Implement the first complete round trip: create a practice from a Sutta passage, execute it, reflect, and return to the source.

Success: No repeated manual copying, and linked context is preserved.

04

**Reflection + Merit Book + Dedication**

Connect recorded activities to reflection and wholesome-action records through explicit user actions.

Success: A single real-world action can link to several tools without becoming duplicate records.

05

**My Map, Collections + Long-Term Continuity**

Allow intentions and actual experiences to become evidence and context for personal understanding, study paths, and recurring practices.

Success: Users can trace connections between source material, intended action, actual experience, and reflection.

06

**Contextual Suggestions + Community Integration**

Add transparent next-action recommendations and user-controlled ways of bringing public knowledge into private practice.

Success: Suggestions reduce effort without taking control away from users or exposing private records.

## **20. What we should validate before implementation**

We can test the proposed journeys using realistic scenarios, instead of evaluating the product only by appearance or task-completion statistics.

| Test scenario                                     | Desired result                                                          |
| ------------------------------------------------- | ----------------------------------------------------------------------- |
| Someone has no plan and has never used PATH/OS    | They can start something meaningful without confusion                   |
| Someone finds a useful Sutta passage              | They can turn it into an intention and later return to the exact source |
| Someone performs an unexpected good deed          | They can record it without inventing a previously planned task          |
| Someone wants to plan only tomorrow               | They can make a simple plan without managing all existing categories    |
| Someone abandons the app for a month              | They can return without losing data or facing punitive messaging        |
| Someone wants to keep everything private          | No information becomes public without explicit permission               |
| Someone wants to track only study                 | They can use that feature independently                                 |
| Someone develops understanding over several weeks | They can find connected notes, practices and reflections again          |

### **What I would deliberately avoid**

- Ranking people by "Dhamma progress," spiritual attainment, or moral worth.
- Treating consistency streaks as the main indication of progress.
- Automatically converting time spent into Merit Book entries.
- Making users record a reflection after every task.
- Forcing all users to adopt a morning routine or a particular schedule.
- Generating religious explanations without grounding them in the selected Sutta or other identifiable source.
- Publishing personal experiences automatically.
- Treating the Life Clock's estimated remaining lifespan as a reliable prediction of actual lifespan.

# **Final Product Direction**

## **PATH/OS — A connected life experience**

A person should be able to enter from any meaningful moment in life.

Something I learned

Something I intend to do

Something I actually did

Something I observed or understood

Something I contributed

Any of these can be the starting point. None has to be a compulsory step.

The next design artifact I would create is a **PATH/OS Unified User Journey Blueprint**, with the 92 use cases mapped to concrete screens, user actions, data changes, navigation paths, and success/failure states.

Its first complete prototype should cover these three foundational journeys:

**Start from Daily Routine → Connect with another tool → Return to Daily Routine.**

**Start from Sutta / Notes / Map → Create a real-life intention → Act and reflect.**

**Start from a real-life experience → Record it → Connect it to understanding, Merit Book, or Dedication.**

Once these three loops work well, PATH/OS will begin behaving like one coherent life system rather than a collection of separate tools.