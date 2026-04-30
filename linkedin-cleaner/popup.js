const toggle = document.getElementById('enabledToggle');
const badge = document.getElementById('statusBadge');

// Load saved state
chrome.storage.local.get(['enabled'], (result) => {
  const enabled = result.enabled !== false; // default ON
  toggle.checked = enabled;
  updateBadge(enabled);
});

toggle.addEventListener('change', () => {
  const enabled = toggle.checked;
  chrome.storage.local.set({ enabled });
  updateBadge(enabled);

  // Enable/disable declarativeNetRequest rule set
  chrome.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: enabled ? ['linkedin_image_rules'] : [],
    disableRulesetIds: enabled ? [] : ['linkedin_image_rules'],
  });
});

function updateBadge(enabled) {
  badge.textContent = enabled ? 'ACTIVE' : 'PAUSED';
  badge.className = 'status-badge ' + (enabled ? 'active' : 'paused');
  badge.style.background = enabled ? '#d4edda' : '#f8d7da';
  badge.style.color = enabled ? '#1a6630' : '#721c24';
}
