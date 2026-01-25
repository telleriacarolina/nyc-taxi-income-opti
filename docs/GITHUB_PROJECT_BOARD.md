# GitHub Project Board Setup

## Project Name: NYC TAXI Income Optimizer - Phase 1 MVP

## Board Structure

### Option 1: GitHub Projects (Beta) - Recommended

**Setup Instructions:**

1. Go to your repository → Projects tab
2. Click "New project"
3. Select "Board" layout
4. Name: "Phase 1: MVP (Weeks 1-4)"

**Board Columns:**

```
📋 Backlog → 🔜 Ready → 🏗️ In Progress → 👀 Review → ✅ Done
```

---

### Column Definitions

#### 📋 Backlog
- **Purpose**: All planned tickets not yet started
- **Tickets**: All Phase 1 tickets (#001-#022)
- **Rules**: 
  - Tickets are ordered by priority
  - Dependencies clearly marked
  - Estimates included

#### 🔜 Ready
- **Purpose**: Tickets ready to be worked on (all dependencies met)
- **Move here when**: 
  - All prerequisite tickets completed
  - Acceptance criteria clear
  - No blockers
- **Limit**: 3-5 tickets max

#### 🏗️ In Progress
- **Purpose**: Actively being developed
- **Move here when**: Developer starts work
- **Rules**:
  - Only 1-2 tickets per developer
  - Branch created
  - Status updated daily
- **Limit**: 2 tickets max per developer

#### 👀 Review
- **Purpose**: Code complete, awaiting review/testing
- **Move here when**: 
  - PR opened
  - All acceptance criteria met
  - Self-tested
- **Rules**:
  - PR linked
  - Tests passing
  - Ready for review

#### ✅ Done
- **Purpose**: Completed and merged
- **Move here when**:
  - PR merged
  - Feature deployed
  - Acceptance criteria verified
- **Archive**: Weekly

---

## Field Configuration

### Custom Fields to Add:

1. **Priority**
   - Type: Single select
   - Options: CRITICAL, HIGH, MEDIUM, LOW
   - Color coded: Red, Orange, Yellow, Gray

2. **Effort (Hours)**
   - Type: Number
   - Range: 1-16 hours
   - Used for sprint planning

3. **Phase**
   - Type: Single select
   - Options: Phase 1, Phase 2, Phase 3, Phase 4, Phase 5
   - For long-term roadmap

4. **Week**
   - Type: Single select
   - Options: Week 1, Week 2, Week 3, Week 4
   - For Phase 1 sprint planning

5. **Dependencies**
   - Type: Text
   - Format: "#001, #002" (ticket numbers)
   - Blocked by other tickets

6. **Assignee**
   - Type: Person
   - Default GitHub assignee field

7. **Labels**
   - Type: Multiple select
   - Options: design-system, component, feature, bug, documentation

---

## Automation Rules

### Auto-move Rules (if using GitHub Projects Beta):

1. **To In Progress**
   - Trigger: Issue assigned to someone
   - Action: Move to "In Progress"

2. **To Review**
   - Trigger: PR opened and linked to issue
   - Action: Move to "Review"

3. **To Done**
   - Trigger: PR merged
   - Action: Move to "Done"

4. **Add to Project**
   - Trigger: Issue created with label "phase-1"
   - Action: Add to project in "Backlog"

---

## Issue Template

Create `.github/ISSUE_TEMPLATE/phase-1-ticket.md`:

\`\`\`markdown
---
name: Phase 1 Ticket
about: Implementation ticket for Phase 1 MVP
title: '[#XXX] '
labels: phase-1
assignees: ''
---

## Ticket #XXX: [Title]

**Priority**: [CRITICAL|HIGH|MEDIUM|LOW]
**Effort**: [X hours]
**Week**: [1-4]
**Dependencies**: [#YYY, #ZZZ]

## User Story
As a [user type], I want [goal] so that [benefit].

## Tasks
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Technical Notes
[Implementation details, code snippets, architecture decisions]

## Files to Create/Modify
- \`path/to/file.tsx\`
- \`path/to/another.tsx\`

## Testing Checklist
- [ ] Unit tests pass
- [ ] Manual testing complete
- [ ] Mobile responsive
- [ ] Accessibility checked
- [ ] No console errors

## Definition of Done
- [ ] Code complete and self-reviewed
- [ ] PR opened and reviewed
- [ ] Tests passing
- [ ] Merged to main
- [ ] Feature deployed
- [ ] Acceptance criteria verified
\`\`\`

---

## Creating Issues from Tickets

### Quick Creation Script:

Use GitHub CLI to bulk create issues:

\`\`\`bash
# Install GitHub CLI if not already installed
# brew install gh (macOS)
# or download from https://cli.github.com/

# Authenticate
gh auth login

# Create issues for Week 1
gh issue create --title "[#001] Project Setup & Design System" --label "phase-1,week-1,critical" --body-file docs/tickets/001.md
gh issue create --title "[#002] Core UI Components Setup" --label "phase-1,week-1,critical" --body-file docs/tickets/002.md
gh issue create --title "[#003] Main App Layout with Tabbed Navigation" --label "phase-1,week-1,critical" --body-file docs/tickets/003.md
gh issue create --title "[#004] State Management Setup (KV Storage)" --label "phase-1,week-1,critical" --body-file docs/tickets/004.md
gh issue create --title "[#005] Error Boundary & Fallback UI" --label "phase-1,week-1,high" --body-file docs/tickets/005.md

# Continue for all 22 tickets...
\`\`\`

---

## Manual Setup (Alternative)

If you prefer manual setup:

### 1. Create Labels

Go to: `https://github.com/[username]/[repo]/labels`

Create these labels:

| Label | Color | Description |
|-------|-------|-------------|
| phase-1 | #0052CC | Phase 1 MVP ticket |
| week-1 | #DFE1E6 | Week 1 Sprint |
| week-2 | #DFE1E6 | Week 2 Sprint |
| week-3 | #DFE1E6 | Week 3 Sprint |
| week-4 | #DFE1E6 | Week 4 Sprint |
| critical | #DE350B | Critical priority |
| high | #FF8B00 | High priority |
| medium | #FFAB00 | Medium priority |
| low | #00875A | Low priority |
| design-system | #6554C0 | Design system work |
| component | #00B8D9 | UI component |
| feature | #36B37E | New feature |
| bug | #DE350B | Bug fix |
| documentation | #5E6C84 | Documentation |

### 2. Create Milestones

Go to: `https://github.com/[username]/[repo]/milestones`

Create:
- **Week 1: Foundation** (Due: Feb 1, 2026)
- **Week 2: License Tracking** (Due: Feb 8, 2026)
- **Week 3: Earnings Tracking** (Due: Feb 15, 2026)
- **Week 4: Platform Info & Polish** (Due: Feb 21, 2026)

### 3. Create Issues Manually

For each ticket in `docs/PHASE_1_TICKETS.md`:

1. Click "New Issue"
2. Copy ticket content
3. Add labels (phase-1, week-X, priority)
4. Assign milestone
5. Add to project
6. Set priority field
7. Set effort field

---

## Sprint Planning View

### Week 1 Board (Jan 25 - Feb 1)

\`\`\`
Backlog          Ready              In Progress        Review             Done
--------         --------           -----------        --------           ----
#006-#022        #001 (8h) ⭐       [empty]           [empty]            [empty]
                 #002 (6h) ⭐
                 #003 (8h) ⭐
                 #004 (4h) ⭐
                 #005 (3h)
                 
                 Total: 29 hours
                 Capacity: 40 hours/week
\`\`\`

⭐ = Critical priority

---

## Tracking Progress

### Daily Standup Template

**What did I complete yesterday?**
- [List completed tickets]

**What will I work on today?**
- [List current ticket]

**Any blockers?**
- [List dependencies or issues]

### Weekly Review Template

**Week X Retrospective**

**Completed:**
- ✅ #001: Project Setup (8h est / 6h actual)
- ✅ #002: Core Components (6h est / 8h actual)
- [ ] #003: Navigation (in progress)

**Velocity:** 14h / 29h planned (48%)

**Blockers Resolved:**
- Font loading issue
- Tailwind config conflict

**Carry Over to Next Week:**
- #003: Navigation (60% complete)

**Insights:**
- Underestimated component setup time
- Design system changes require more testing
- Need to parallelize independent tasks

---

## Integration with VS Code

### GitHub Pull Requests Extension

1. Install: "GitHub Pull Requests and Issues"
2. View project board in VS Code sidebar
3. Create issues from VS Code
4. Track progress without leaving editor

### Project Queries

Save these searches:

\`\`\`
# Your current tickets
is:issue assignee:@me is:open project:"Phase 1"

# This week's sprint
is:issue is:open label:week-1 project:"Phase 1"

# Blocked tickets
is:issue is:open label:blocked project:"Phase 1"

# Ready to work
is:issue is:open label:ready project:"Phase 1"
\`\`\`

---

## Success Metrics Dashboard

Track in project README or wiki:

### Phase 1 Progress

| Week | Planned | Completed | Velocity | Status |
|------|---------|-----------|----------|--------|
| 1    | 29h     | --        | --       | 🏗️ Active |
| 2    | 28h     | --        | --       | 📋 Planned |
| 3    | 26h     | --        | --       | 📋 Planned |
| 4    | 29h     | --        | --       | 📋 Planned |

**Total Effort**: 112 hours
**Target Completion**: February 21, 2026

---

## Quick Start Commands

### Create all Phase 1 issues:

\`\`\`bash
# Create a script: scripts/create-phase1-issues.sh

#!/bin/bash

# Week 1 tickets
gh issue create --title "#001: Project Setup & Design System" \\
  --body "$(cat docs/tickets/001.md)" \\
  --label "phase-1,week-1,critical" \\
  --milestone "Week 1: Foundation"

# Repeat for all 22 tickets...
\`\`\`

### Update ticket status:

\`\`\`bash
# Move to in progress
gh issue edit 123 --add-label "status:in-progress"

# Move to review
gh pr create --title "#001: Design System" --body "Fixes #123"

# Close and move to done
gh pr merge 456
\`\`\`

---

## Next Steps

1. ✅ Choose board structure (Projects Beta recommended)
2. ✅ Create project in GitHub
3. ✅ Set up custom fields
4. ✅ Create labels and milestones
5. ✅ Create issues from Phase 1 tickets
6. ✅ Assign Week 1 tickets to Ready column
7. ✅ Start with ticket #001
8. ✅ Update board daily
9. ✅ Review progress weekly

---

## Resources

- [GitHub Projects Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [GitHub CLI Manual](https://cli.github.com/manual/)
- [Project Board Best Practices](https://github.blog/2021-06-23-introducing-new-github-issues/)
