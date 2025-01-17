chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'summarize') {
    (async () => {
      try {
        let ln = chrome.i18n.getUILanguage();
        const response = await fetch('http://localhost:5000/summarize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: request.text, lang: ln }),
        });

        const data = await response.json();
        console.log(data.headerText, " ht")
        chrome.tabs.sendMessage(sender.tab.id, { action: 'displaySummary', summary: data.summary, headerText: data.headerText }, response => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          }
        });
      } catch (error) {
        console.error('Error:', error);
        chrome.tabs.sendMessage(sender.tab.id, { action: 'displaySummary', summary: 'An error occurred while summarizing the text => '+ error }, response => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          }
        });
      }
    })();
    return true; // Indicates that the response will be sent asynchronously
  }
});
