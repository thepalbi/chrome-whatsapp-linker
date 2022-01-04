let color = '#3aa757';
const contextMenuId = "send-whatsapp-message";

// service_workers work asynchronously, and are terminated / launches as needed, since they are event driven
// use the callback below to configure everything needed
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);

  chrome.contextMenus.create({
    id: contextMenuId,
    title: "Send WhatsApp message",
    contexts: ["selection"],
  });
});

function createWhatsAppLink(number) {
  // https://wa.me/1XXXXXXXXXX
  return `https://wa.me/${number}`;
}

function createMsg({ type, msg }) {
  return {
    type: type,
    msg: msg
  };
}

function handleClickContextMenuItemClick({ selectionText }, tabId) {
  // Clean selection text from spaces and hyphens
  const cleanedSelection = selectionText.replaceAll(" ", "").replaceAll("-", "");
  // Check if it's a valid phone number
  if (!(/^\+[1-9]{1}[0-9]{3,14}$/.test(cleanedSelection))) {
    chrome.tabs.sendMessage(tabId, {
      type: "error",
      msg: "selected text is not valid phone number",
      details: cleanedSelection
    });
    return;
  }

  // Remove the + character
  const phone = cleanedSelection.substring(1);

  // Create new tab to whatsapp link
  chrome.tabs.create({
    url: createWhatsAppLink(phone)
  });

}

chrome.contextMenus.onClicked.addListener(({ selectionText, menuItemId }, tab) => {
  if (menuItemId === contextMenuId) {
    handleClickContextMenuItemClick({ selectionText }, tab.id);
    return;
  }

  console.log("unhandled context menu item");
});