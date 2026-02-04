# Google Scholar Batch Search

A lightweight **Tampermonkey userscript** for **batch searching a list of paper titles or DOIs in Google Scholar**, one paper at a time, using a fast, queue-based, human-in-the-loop workflow.

This tool is designed for researchers who rely on Google Scholar but want a more efficient way to work through **long lists of papers** without violating Scholar’s interaction constraints.

---

## Motivation

Google Scholar does not provide:

- an official API for searching papers,
- bulk search tools for lists of references,
- or safe bulk-save functionality for libraries.

Attempts to fully automate these actions are brittle, unreliable, or risk account restrictions.

**Google Scholar Batch Search** takes a pragmatic approach:

> Automate the *navigation and repetition*, not the final user actions.

You stay in control of each result and save decision, while the script handles sequencing, searching, and workflow efficiency.

---

## Key features

### 📋 Batch paper queue
- Paste **one paper title or DOI per line**
- Papers are processed **sequentially**
- Clear display of:
  - **Current** paper
  - **Next** paper (preview)

### 🔎 Smart DOI handling
- Accepts DOI URLs such as:
https://doi.org/10.1177/27324745251404039

- Automatically extracts the DOI and searches Google Scholar using:
doi:10.1177/27324745251404039

- Falls back to standard title search when no DOI is detected

### ⭐ Assisted Scholar interaction
- Automatically navigates to the Scholar search page for each paper
- Visually highlights the ⭐ **Save** button
- Leaves final decisions (saving, labeling) to the user

### 🖱️ Draggable floating panel
- Panel can be dragged anywhere on the screen
- Position is remembered across page reloads

### ⌨️ Keyboard-first workflow
All actions are available via buttons **and** keyboard shortcuts:

| Action        | Button | Key |
|--------------|--------|-----|
| Begin queue  | Begin  | **B** |
| Clear queue  | Clear  | **C** |
| Save paper   | Save   | **S** |
| Next paper   | Next   | **N** |

### 💾 Session persistence
- Paper queue is stored in `localStorage`
- Navigation between Scholar pages does not reset progress

---

## Installation

1. Install **Tampermonkey** (Chrome, Edge, Firefox, Brave)
2. Create a new userscript
3. Paste the contents of:
google-scholar-batch-search.user.js

4. Save and enable the script
5. Open:
https://scholar.google.com


---

## Basic usage

1. Open Google Scholar
2. Paste a list of paper titles or DOI links (one per line)
3. Click **Begin**
4. For each paper:
- Review the Scholar results
- Click **Save (S)** if desired
- Click **Next (N)** to continue

---

## Who this tool is for

- Researchers managing long reference lists
- Systematic reviewers performing manual screening
- Users who want speed without breaking Google Scholar
- Anyone searching dozens or hundreds of papers sequentially

---

## License

MIT License  
You are free to use, modify, and distribute this project.

---

## Disclaimer

This project is **not affiliated with Google**.

Google Scholar’s interface and behavior may change at any time.  
Use responsibly and avoid excessive automated interactions.
