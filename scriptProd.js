document.addEventListener("DOMContentLoaded", () => { 
  let url = window.location.href;
  let isRerunExecuted = false;
  let numberOfEditedValue = 0;
  let stop = false;

  function resetEditStorage() {
    numberOfEditedValue = 0;
    localStorage.setItem('edited_element', "");
  }

  function scriptSmallLoop() {
    let count = 0; 
    const intervalId = setInterval(() => {
      runScript();
      count++; 
      if (count >= 5) {
        clearInterval(intervalId);
      }
    }, 3000);
  }

  if (url.includes('#edit') && !isRerunExecuted) {
    scriptSmallLoop();
    isRerunExecuted = true;
  }

  function resetBeforeSave() {
    const editedElements = localStorage.getItem('edited_element') || "";
    const editPattern = /(\d+):::(\w+)___(.*?)---/g;
    let match;

    while ((match = editPattern.exec(editedElements)) !== null) {
      const [_, editNumber, editType, editValue] = match;
      const element = document.querySelector(`.editNumber${editNumber}`);
      if (element) {
        switch (editType) {
          case 'backgroundColor':
            element.style.backgroundColor = editValue;
            break;
          case 'borderColor':
            element.style.borderColor = editValue;
            break;
          case 'boxShadow':
            element.style.boxShadow = editValue;
            break;
          default:
            console.warn(`Unknown edit type: ${editType}`);
        }
        element.classList.remove(`editNumber${editNumber}`);
      }
    }
    resetEditStorage();
  }

  function runScript() {
    try {
      const key = `If you see this, please press "Ctrl" + "F5"`;
      const paragraphs = document.querySelectorAll('p');
      const warnElement = document.querySelector('.warning');
      let warningMessage = null;

      let oldR = 225;
      let oldG = 243;
      let oldB = 255;
      let newG = 111;
      let newB = 119;
      let newBorderG = 128;
      let newBorderB = 128;
      let oldTitleR = 240;
      let oldTitleG = 250;
      let oldTitleB = 255;

      const isDarkMode = localStorage.getItem('darkMode') === 'false';

      const themeLabel = document.querySelectorAll('label');
      const warning = document.querySelector('.warning');
      const userInfo = document.querySelector('.userInfo');
        
      themeLabel.forEach(label => {   
        if (label.textContent.includes('Theme')) {
          if (label.parentNode.parentNode.lastElementChild.textContent === 'Dark Mode') {
            localStorage.setItem('darkMode', true);

            if (userInfo) {
              const userBG = window.getComputedStyle(userInfo);
              const CSbg = userBG.backgroundColor;
              if (warning) {    
                if (CSbg == 'rgba(0, 0, 0, 0.2)') {
                  warning.style.display = 'none';
                }
              }
            }
          } else if (label.parentNode.parentNode.lastElementChild.textContent === 'Light Mode') {
            localStorage.setItem('darkMode', false);

            if (userInfo) {
              const userBG = window.getComputedStyle(userInfo);
              const CSbg = userBG.backgroundColor;
              if (warning) {
                if (CSbg == 'rgb(245, 245, 245)') {
                  warning.style.display = 'none';
                }
              }
            }
          } else if (label.parentNode.parentNode.lastElementChild.textContent === '') {
            localStorage.setItem('darkMode', false);

            if (userInfo) {
              const userBG = window.getComputedStyle(userInfo);
              const CSbg = userBG.backgroundColor;
              if (warning) {
                if (CSbg == 'rgb(245, 245, 245)') {
                  warning.style.display = 'none';
                }
              }
            }
          }
        } 
      });

      if (localStorage.getItem('darkMode') == undefined) {
        localStorage.setItem('darkMode', false);

        const body = document.querySelector('body');
        const computedStyleBody = window.getComputedStyle(body);
        const backgroundColor = computedStyleBody.backgroundColor;

        if (backgroundColor === "rgb(47, 50, 59)") {
          localStorage.setItem('darkMode', true);
        }
      }

      let darkMode = (localStorage.getItem('darkMode') === "true");
      darkMode = !isDarkMode;

      paragraphs.forEach(paragraph => {
        if (paragraph.textContent.includes(`${key}`)) {
          warningMessage = paragraph;
        }
      });

      if (warningMessage && warningMessage.parentNode != warnElement) {
        warningMessage.parentNode.parentNode.remove();
      }

      const title = document.querySelectorAll('h2');

      title.forEach(t => { 
        if (t.innerHTML == '&nbsp;') {
          t.remove();
        }
      });

      let divs = document.querySelectorAll('div');
      const SRbox = document.querySelector('.jumbotron');

      let colorsModified = false; 

      function getCurrentURL() {
        return window.location.href;
      }

      setInterval(() => {
        let newUrl = getCurrentURL();
        if (newUrl !== url && newUrl.includes('#edit')) {
          url = newUrl;
          scriptSmallLoop();
        }
      }, 1000);

      while (!colorsModified) {
        colorsModified = true;
        divs.forEach(div => {
          const computedStyle = window.getComputedStyle(div);
          const backgroundColor = computedStyle.backgroundColor;

          if (div.classList.contains('jumbotron') && !darkMode) {
            return;
          }

          if (
            (backgroundColor === "rgb(222, 222, 222)" ||
            backgroundColor === "rgb(250, 253, 255)" ||
            backgroundColor === "rgb(255, 255, 255)" ||
            backgroundColor === "rgb(253, 253, 253)" ||
            backgroundColor === "rgb(250, 255, 253)" ||
            backgroundColor === "rgb(250, 250, 250)" ||
            backgroundColor === "rgb(220, 242, 244)") &&
            darkMode
          ) {
            numberOfEditedValue++;
            div.classList.add(`editNumber${numberOfEditedValue}`);
            localStorage.setItem('edited_element', (localStorage.getItem('edited_element') || "") + `${numberOfEditedValue}:::backgroundColor___` + div.style.backgroundColor + "---");
            div.style.backgroundColor = "";
          } 

          if (div.style.backgroundColor === "rgb(70, 162, 164)") {
            numberOfEditedValue++;
            div.classList.add(`editNumber${numberOfEditedValue}`);
            localStorage.setItem('edited_element', (localStorage.getItem('edited_element') || "") + `${numberOfEditedValue}:::backgroundColor___` + div.style.backgroundColor + "---");
            div.style.backgroundColor = "#00000033";
          }

          if (SRbox && darkMode && !stop) {
            numberOfEditedValue++;
            SRbox.classList.add(`editNumber${numberOfEditedValue}`);
            localStorage.setItem('edited_element', (localStorage.getItem('edited_element') || "") + `${numberOfEditedValue}:::backgroundColor___` + SRbox.style.backgroundColor + "---");
            SRbox.style.backgroundColor = "";
            stop = true;
          }

          if (backgroundColor === `rgb(${oldR}, ${oldG}, ${oldB})` && darkMode) {
            numberOfEditedValue++;
            div.classList.add(`editNumber${numberOfEditedValue}`);
            localStorage.setItem('edited_element', (localStorage.getItem('edited_element') || "") + `${numberOfEditedValue}:::borderColor___` + div.style.backgroundColor + "---");
            div.style.backgroundColor = `rgb(0, ${newG}, ${newB})`;
            div.style.borderColor = `rgb(0, ${newBorderG}, ${newBorderB})`;

            oldR -= 3;
            oldG -= 3;
            oldB -= 3;
            newG -= 3;
            newB -= 3;
            newBorderG -= 3;
            newBorderB -= 3;
            colorsModified = false;
          }

          if (backgroundColor === `rgb(${oldTitleR}, ${oldTitleG}, ${oldTitleB})` && darkMode) {
            numberOfEditedValue++;
            div.classList.add(`editNumber${numberOfEditedValue}`);
            localStorage.setItem('edited_element', (localStorage.getItem('edited_element') || "") + `${numberOfEditedValue}:::backgroundColor___` + div.style.backgroundColor + "---");
            div.style.backgroundColor = "";

            oldTitleR -= 3;
            oldTitleG -= 3;
            oldTitleB -= 3;
            colorsModified = false; 
          }
        });
        divs = document.querySelectorAll('div');
      }

      const tds = document.querySelectorAll('td');
      const feature = document.querySelector('.teams_feature');
      const whiteBorder = document.querySelectorAll('.white_border');

      tds.forEach(td => {
        const computedStyle = window.getComputedStyle(td);
        const borderColor = computedStyle.borderColor;
        const backgroundColor = computedStyle.backgroundColor;

        if (borderColor === "rgb(255, 255, 255)" && !feature && !whiteBorder) {
          numberOfEditedValue++;
          td.classList.add(`editNumber${numberOfEditedValue}`);
          localStorage.setItem('edited_element', (localStorage.getItem('edited_element') || "") + `${numberOfEditedValue}:::borderColor___` + td.style.borderColor + "---");
          td.style.borderColor = "";
        }
        if ((backgroundColor === "rgb(250, 250, 250)" || 
            backgroundColor === "rgb(255, 255, 255)" || 
            backgroundColor === "rgb(253, 253, 253)" ||
            backgroundColor === "rgb(245, 245, 245)") && 
            darkMode) {
          numberOfEditedValue++;
          td.classList.add(`editNumber${numberOfEditedValue}`);
          localStorage.setItem('edited_element', (localStorage.getItem('edited_element') || "") + `${numberOfEditedValue}:::backgroundColor___` + td.style.backgroundColor + "---");    
          td.style.backgroundColor = "#00000033";
        }
        if (backgroundColor === "rgba(0, 0, 0, 0.2)" && !darkMode) {
          numberOfEditedValue++;
          td.classList.add(`editNumber${numberOfEditedValue}`);
          localStorage.setItem('edited_element', (localStorage.getItem('edited_element') || "") + `${numberOfEditedValue}:::backgroundColor___` + td.style.backgroundColor + "---");  
          td.style.backgroundColor = "#00000010";
        }

        const notreNomEtPrenomQuandOnDerouleLeBurgerMenuEnWhiteMode = document.querySelector('#tmUser');
        const userComputedStyle = window.getComputedStyle(notreNomEtPrenomQuandOnDerouleLeBurgerMenuEnWhiteMode);
        const color = userComputedStyle.color;

        if (!darkMode && color.color === "rgb(0, 0, 0)") {
          notreNomEtPrenomQuandOnDerouleLeBurgerMenuEnWhiteMode.style.color = "#fff";
        }
      });

      const boxs = document.querySelectorAll('.box');
      
      boxs.forEach (box => { 
        if (boxs && box.style.boxShadow === "lightgrey 5px 5px 5px" && darkMode) {
          numberOfEditedValue++;
          box.classList.add(`editNumber${numberOfEditedValue}`);
          localStorage.setItem('edited_element', (localStorage.getItem('edited_element') || "") + `${numberOfEditedValue}:::boxShadow___` + box.style.boxShadow + "---");
          box.style.boxShadow = "#7f9be1 5px 5px 5px";
        }
      });
      
      let blink = false;
      
      if (url.includes('blink=true')) {
        blink = true;
      }
      
      const html = document.querySelector('html');
      const userAttribute = html.getAttribute('data-xwiki-user-reference');
      
      const userName = userAttribute.replace(/^xwiki:XWiki./, '');
      
      const button = document.querySelector('#redirect');
      
      const darkThemeBox = document.querySelectorAll('label');
      
      function redirectToUserPage() {
        location.href = `https://xwiki.maia-space.com/bin/view/XWiki/${userName}?blink=true`;
      }
      window.redirectToUserPage = redirectToUserPage;
      
      if (button) {
        button.setAttribute('onClick', 'redirectToUserPage()');
      }
      
      darkThemeBox.forEach(label => {
        if (label.innerHTML.includes('Theme') && blink) {
          label.parentNode.parentNode.classList.add('alerts-border');
        }
      });
      
      const tables = document.querySelectorAll('table');
      
      if (url.includes('Main/Teams/')) {
        tables.forEach(table => {
          if (tables) {
            table.style.border = "none";
          }
        });
      }

      console.log("Matthieu's script: Run without error. 🐼");
    } catch (error) {
      console.error("Matthieu's script: Aïe aïe aïe ", error);
    }
  }

  window.addEventListener('beforeunload', resetEditStorage);

  const editButton = document.querySelector('#tmEdit');
  const observer = new MutationObserver(() => {
    ['Save & View', 'Save', 'Cancel'].forEach(action => {
      const button = document.querySelector(`input[value="${action}"]`);
      if (button) {
        button.addEventListener('click', () => {
          if (action !== 'Cancel') resetBeforeSave();
          resetEditStorage()
          if (action === 'Save & View') scriptSmallLoop();
        });
      }
    });
  });

  window.addEventListener('beforeunload', resetEditStorage)

  observer.observe(document.body, { childList: true, subtree: true });

  if (editButton) {
    editButton.addEventListener('click', () => {
      isRerunExecuted = false;
      resetEditStorage();
    });
  }

  runScript();
});
