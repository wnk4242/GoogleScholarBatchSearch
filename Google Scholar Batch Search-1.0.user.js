// ==UserScript==
// @name         Google Scholar Batch Search
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Batch search a list of papers by their titles or DOIs in Google Scholar
// @match        https://scholar.google.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = "gs_paper_queue";
  const POS_KEY = "gs_panel_position";

  // ---------- UI ----------
  const panel = document.createElement("div");
  panel.style = `
    position: fixed;
    top: 80px;
    right: 20px;
    width: 340px;
    background: white;
    border: 2px solid #4285f4;
    padding: 8px;
    z-index: 9999;
    font-size: 13px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  `;

  panel.innerHTML = `
    <div id="gsHeader"
      style="font-weight:bold; cursor:move; user-select:none; margin-bottom:6px;">
      Scholar Library Saver
    </div>

    <textarea id="gsInput"
      placeholder="One title or DOI per line"
      style="width:100%; height:90px;"></textarea>

    <div style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap;">
      <button id="gsBegin">Begin (B)</button>
      <button id="gsClear">Clear (C)</button>
      <button id="gsSaveBtn">Save (S)</button>
      <button id="gsNextBtn">Next (N)</button>
    </div>

    <div id="gsNow" style="margin-top:8px; font-size:12px;"></div>
    <div id="gsNext" style="margin-top:4px; font-size:11px; color:#666;"></div>
  `;

  document.body.appendChild(panel);

  // ---------- Restore position ----------
  const savedPos = JSON.parse(localStorage.getItem(POS_KEY) || "null");
  if (savedPos) {
    panel.style.top = savedPos.top;
    panel.style.left = savedPos.left;
    panel.style.right = "auto";
  }

  const header = panel.querySelector("#gsHeader");
  const nowBox = panel.querySelector("#gsNow");
  const nextBox = panel.querySelector("#gsNext");
  const input = panel.querySelector("#gsInput");

  // ---------- Drag logic ----------
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  header.addEventListener("mousedown", e => {
    isDragging = true;
    const rect = panel.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", e => {
    if (!isDragging) return;
    panel.style.left = `${e.clientX - offsetX}px`;
    panel.style.top = `${e.clientY - offsetY}px`;
    panel.style.right = "auto";
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    document.body.style.userSelect = "";
    localStorage.setItem(POS_KEY, JSON.stringify({
      top: panel.style.top,
      left: panel.style.left
    }));
  });

  // ---------- Helpers ----------
  function loadQueue() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  }

  function saveQueue(q) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(q));
  }

  function normalizeQuery(text) {
    // Match DOI URL or raw DOI
    const doiMatch = text.match(/10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i);
    if (doiMatch) {
      return `doi:${doiMatch[0]}`;
    }
    return text;
  }

  function updatePreview() {
    const q = loadQueue();
    nowBox.innerHTML = q[0]
      ? `<b>Current:</b> ${q[0]}`
      : `<b>No active paper</b>`;
    nextBox.innerHTML = q[1] ? `Next: ${q[1]}` : ``;
  }

  updatePreview();

  // ---------- Core actions ----------
  function searchCurrent() {
    const q = loadQueue();
    if (!q.length) return;

    const query = normalizeQuery(q[0]);

    window.location.href =
      "https://scholar.google.com/scholar?q=" +
      encodeURIComponent(query);
  }

  function saveCurrent() {
    const star = document.querySelector("a.gs_or_sav");
    if (star) star.click();
  }

  function advanceQueue() {
    const q = loadQueue();
    if (!q.length) return;
    q.shift();
    saveQueue(q);
    updatePreview();
    searchCurrent();
  }

  function clearQueue() {
    localStorage.removeItem(STORAGE_KEY);
    updatePreview();
  }

  function beginQueue() {
    const lines = input.value
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean);

    if (!lines.length) return;

    saveQueue(lines);
    updatePreview();
    searchCurrent();
  }

  function highlightSave() {
    const star = document.querySelector("a.gs_or_sav");
    if (star) {
      star.style.border = "3px solid red";
      star.style.background = "#fff3cd";
      star.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  // ---------- Button handlers ----------
  panel.querySelector("#gsBegin").onclick   = beginQueue;
  panel.querySelector("#gsClear").onclick   = clearQueue;
  panel.querySelector("#gsSaveBtn").onclick = saveCurrent;
  panel.querySelector("#gsNextBtn").onclick = advanceQueue;

  // ---------- Keyboard shortcuts ----------
  document.addEventListener("keydown", e => {
    if (document.activeElement === input) return;

    switch (e.key.toLowerCase()) {
      case "b": beginQueue(); break;
      case "c": clearQueue(); break;
      case "s": saveCurrent(); break;
      case "n": advanceQueue(); break;
    }
  });

  // ---------- On Scholar load ----------
  window.addEventListener("load", () => {
    setTimeout(highlightSave, 800);
    updatePreview();
  });

})();
