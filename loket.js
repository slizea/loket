const ticketItems = document.querySelectorAll(".ticket-item");
const antri = document.getElementById("join-btn");
const dapettiket = document.querySelector('input[name="firstname"]');
const dapettiket2 = document.querySelector(
  'input[for="firstname"][name^="firstname"]'
);
const detekcapca = document.querySelector(".g-recaptcha");
const invitationCodeInput = document.getElementById("invitation-code");
const turnstileCaptcha = document.getElementById("turnstile-captcha");
const webhook = "https://discord.com/api/webhooks/1290892932450091061/Br5awc6BHWDstMwNw_Zlwqz3RPwY0yk0Z0rIP96EN1Jkzd8g--RbQShfBd9K5158GSWX";

if (dapettiket || dapettiket2) {
  const xpath = "/html/body/section[3]/div[2]/div/div[2]/div/div[2]/div[4]/div[1]/div/div/p[1]";
  const result = document.evaluate(
    xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
  ).singleNodeValue;

  const namatiket = result ? result.textContent.trim() : null;

  if (dcid !== "") {
    sendWebhook(`WOII <@${dcid}>\n${nama} DAPET ${jumlahtiket} TIKET ${namatiket}\n${document.title}`);
  } else {
    sendWebhook(`WOII <@286504381434560513>\n${nama} DAPET ${jumlahtiket} TIKET ${namatiket}\n${document.title}`);
  }
}

if (turnstileCaptcha) {
  if (antri) {
    let attempts = 0;
    const maxAttempts = 100;

    const checkInterval = setInterval(() => {
      attempts++;
      const responcf = document.querySelector(
        'input[name="cf-turnstile-response"]'
      );

      if (responcf) {
        const value = responcf.value;
        if (value) {
          clearInterval(checkInterval);
          if (antri) {
            antri.click();
          } else {
            console.error("Button not found.");
          }
        } else {
          if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            if (antri) {
              antri.click();
            } else {
              console.error("Button not found.");
            }
          }
        }
      } else {
        console.error("Input element not found.");
      }
    }, 50);
  }
} else if (detekcapca) {
  if (autocapca == "y") {
    if (antri) {
      let attempts = 0;
      const maxAttempts = 1000;

      const checkInterval = setInterval(() => {
        attempts++;
        const respongcapca = document.querySelector(".captcha-solver-info");

        if (respongcapca) {
          const value = respongcapca.textContent;
          if (value === "Captcha solved!") {
            clearInterval(checkInterval);
            if (antri) {
              antri.click();
            } else {
              console.error("Button not found.");
            }
          } else {
            if (attempts >= maxAttempts) {
              clearInterval(checkInterval);
            }
          }
        } else {
          //console.error('respon capca blm ada');
        }
      }, 50);
    }
  }
} else if (antri) {
  antri.click();
  setTimeout(() => {
    const closeButton = document.querySelector(".toast-action");
    if (closeButton) {
      closeButton.click();
    }
  }, 800);
}

function beliTiket(ticketName) {
  const tiket = Array.from(ticketItems).find((item) => {
    const tiketTitle = item.querySelector("h6").textContent.trim();
    return tiketTitle === ticketName;
  });

  if (tiket) {
    const selectBox = tiket.querySelector(".ticket-types");
    selectBox.value = jumlahtiket;

    if (invitationCodeInput) {
      invitationCodeInput.value = invitkode;
      const applyinvitkode = document.getElementById("invitation-button");
      applyinvitkode.click();
      setTimeout(() => {
        const buyButton = document.getElementById("buy_ticket");
        buyButton.click();

        const anc = document.getElementById("btn-agree-tnc");
        if (anc) {
          anc.click();
        }
      }, 750);
      return;
    }

    const buyButton = document.getElementById("buy_ticket");
    buyButton.click();

    const anc = document.getElementById("btn-agree-tnc");
    if (anc) {
      anc.click();
    }
  }
}

if (ticketItems.length > 0) {
  let soldOutOrFullBookedCount = 0;
  let allSoldOutCount = 0;

  const tiketReadyFound = [...ticketItems].some((item) => {
    const tiketTitle = item.querySelector("h6").textContent.trim();
    const addTicketElement = item.querySelector(".add-ticket");

    const isHabisDipesan = addTicketElement
      ? addTicketElement.textContent.trim() === "Habis dipesan" ||
        addTicketElement.textContent.trim() === "Fullbooked"
      : false;

    const isSoldOut = addTicketElement
      ? addTicketElement.textContent.trim() === "Sold Out" ||
        addTicketElement.textContent.trim() === "Habis Terjual"
      : false;

    const isReady = !isHabisDipesan && !isSoldOut && !addTicketElement;

    if (
      modebelitiket === "1" &&
      tiketTitle.toLowerCase().includes(ticketCategory.toLowerCase())
    ) {
      if (isSoldOut) {
        alert(`${tiketTitle} Sold Out`);
        return true;
      }

      if (!isHabisDipesan) {
        setTimeout(() => {
          beliTiket(tiketTitle);
        }, 1);
        return true;
      } else {
        setTimeout(() => {
          location.reload();
        }, delay);
        return true;
      }
    }

    if (modebelitiket === "2" && isReady) {
      setTimeout(() => {
        beliTiket(tiketTitle);
      }, 1);
      return true;
    }

    if (isHabisDipesan || isSoldOut) {
      soldOutOrFullBookedCount++;
    }

    if (isSoldOut) {
      allSoldOutCount++;
    }

    return false;
  });

  if (!tiketReadyFound && modebelitiket === "2") {
    if (soldOutOrFullBookedCount === ticketItems.length) {
      if (allSoldOutCount === ticketItems.length) {
        alert("Bubar, Semua Soldout");
      } else {
        setTimeout(() => {
          location.reload();
        }, delay);
      }
    }
  }
}

function sendWebhook(message) {
  const url = atob(webhook);
  fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: message })
  });
}