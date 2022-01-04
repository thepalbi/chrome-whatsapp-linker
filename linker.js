chrome.runtime.onMessage.addListener(({ type, msg, details }) => {
  if (type === "error") {
    console.error("Error in background script: ", msg);
    console.error("Details: ", details)
  }
});
