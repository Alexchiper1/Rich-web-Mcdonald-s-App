"use client";

export function logout() {
  // future-proof: clear anything you might add later
  localStorage.clear();
  sessionStorage.clear();

  // force full reload so state resets
  window.location.href = "/";
}
