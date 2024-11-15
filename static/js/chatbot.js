//다시 시작 버튼
document.getElementById("reload").addEventListener("click", function () {
  location.reload();
});

const inputField = document.getElementById("message");
const sendButton = document.getElementById("sendButton");
const sendButton2 = document.getElementById("sendButton2");

inputField.addEventListener("input", function () {
  if (inputField.value.trim()) {
    sendButton.disabled = false;
    sendButton.style.color = "#7353ea";
    sendButton2.disabled = false;
    sendButton2.style.color = "#7353ea";
  } else {
    sendButton.disabled = true;
    sendButton.style.color = "#ccc";
    sendButton2.disabled = true;
    sendButton2.style.color = "#ccc";
  }
});

inputField.addEventListener("focus", function () {
  inputField.placeholder = "메시지를 입력해주세요";
});

//모르는 개념이 있어요 선택
document.getElementById("conceptBtn").addEventListener("click", function () {
  var message = "모르는 개념이 있어요";
  document.getElementById("conceptBtn").remove();
  document.getElementById("questionBtn").remove();
  appendMessage(message);
  document.getElementById("message").disabled = false;
  document.querySelector("#userInput button").style.color = "#000";
});

//모르는 개념이 있어요 클릭시 응답 메시지
function appendMessage(message) {
  var chatBox = document.getElementById("chatBox");

  if (message) {
    var userMessage = document.createElement("div");
    userMessage.classList.add("userMessage");
    userMessage.textContent = message;
    chatBox.appendChild(userMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  var botMessage = document.createElement("div");
  botMessage.classList.add("chatbotMessage");

  var botImage = document.createElement("img");
  botImage.src = "/static/img/Avatar.png";
  botImage.alt = "버리 이미지";
  botMessage.appendChild(botImage);

  var botText = document.createElement("div");
  botText.innerHTML = `<p>개념에 대해 알려드릴게요.<br />궁금한 내용을 질문해주세요.</p>`;
  botMessage.appendChild(botText);

  inputField.placeholder = "메시지를 입력해주세요";
  chatBox.appendChild(botMessage);

  chatBox.scrollTop = chatBox.scrollHeight;
}

//모르는 개념이 있어요 채팅 api
function sendMessage() {
  var messageInput = document.getElementById("message");
  var message = messageInput.value;
  if (!message.trim()) return;

  var chatBox = document.getElementById("chatBox");
  var userMessage = document.createElement("div");
  userMessage.classList.add("userMessage");
  userMessage.textContent = message;
  chatBox.appendChild(userMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  messageInput.value = "";
  messageInput.disabled = true;
  document.getElementById("sendButton").style.color = "#ccc";

  const loadingElement = document.createElement("div");
  loadingElement.classList.add("loadingMessage");
  loadingElement.id = "loading";

  const loadingContainer = document.createElement("div");
  loadingContainer.classList.add("loading");

  const img = document.createElement("img");
  img.src = "/static/img/Avatar.png";
  img.alt = "버리 이미지";

  const textContainer = document.createElement("div");
  const snippet = document.createElement("div");
  snippet.classList.add("snippet");
  snippet.setAttribute("data-title", "dot-typing");

  const stage = document.createElement("div");
  stage.classList.add("stage");

  const dotTyping = document.createElement("div");
  dotTyping.classList.add("dot-typing");
  stage.appendChild(dotTyping);
  snippet.appendChild(stage);

  const loadingText = document.createElement("div");
  loadingText.classList.add("loadingText");
  const p = document.createElement("p");
  p.innerHTML = "답변을 생성하고 있어요.<br>잠시만 기다려주세요.";
  loadingText.appendChild(p);

  textContainer.appendChild(snippet);
  textContainer.appendChild(loadingText);

  loadingContainer.appendChild(img);
  loadingContainer.appendChild(textContainer);

  loadingElement.appendChild(loadingContainer);

  chatBox.appendChild(loadingElement);

  chatBox.scrollTop = chatBox.scrollHeight;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/chat", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      messageInput.disabled = false;
      messageInput.focus();
      document.getElementById("sendButton").style.color = "#000";
      loadingElement.remove();

      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        var botMessage = document.createElement("div");
        botMessage.classList.add("chatbotMessage");
        var botImage = document.createElement("img");
        botImage.src = "/static/img/Avatar.png";
        botImage.alt = "버리 이미지";
        botMessage.appendChild(botImage);

        var botText = document.createElement("div");
        botText.innerHTML = response.message;
        botMessage.appendChild(botText);

        MathJax.Hub.Queue(["Typeset", MathJax.Hub, botText]);

        chatBox.appendChild(botMessage);

        chatBox.scrollTop = chatBox.scrollHeight;
      } else {
        alert("Error: " + xhr.status);
      }
    }
  };
  xhr.send(JSON.stringify({ message: message }));
}

//모르는 문제가 있어요 선택
document.getElementById("questionBtn").addEventListener("click", function () {
  var message = "모르는 문제가 있어요";
  document.getElementById("conceptBtn").remove();
  document.getElementById("questionBtn").remove();
  appendMessageQA(message);
});

//모르는 문제가 있어요 클릭시 응답 메시지
function appendMessageQA(message) {
  var chatBox = document.getElementById("chatBox");

  if (message) {
    var userMessage = document.createElement("div");
    userMessage.classList.add("userMessage");
    userMessage.textContent = message;
    chatBox.appendChild(userMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  var botMessage = document.createElement("div");
  botMessage.classList.add("chatbotMessage");

  var botImage = document.createElement("img");
  botImage.src = "/static/img/Avatar.png";
  botImage.alt = "버리 이미지";
  botMessage.appendChild(botImage);

  var botText = document.createElement("div");
  botText.innerHTML = `<p>도움이 필요한 하나의 문제를 올려주세요.<br> 여러 개의 문제를 업로드 시 도움을 드리기 어려워요.</p>`;

  var fileLabel = document.createElement("label");
  fileLabel.textContent = "파일 업로드";

  var newFileInput = document.createElement("input");
  newFileInput.type = "file";
  newFileInput.accept = "image/*";
  newFileInput.style.display = "none";

  newFileInput.addEventListener("change", handleFileUpload);
  fileLabel.appendChild(newFileInput);
  botText.appendChild(fileLabel);

  botMessage.appendChild(botText);
  chatBox.appendChild(botMessage);
  chatBox.scrollTop = chatBox.scrollHeight;
}

//모르는 문제가 있어요 - 파일 업로드
function handleFileUpload(event) {
  var chatBox = document.getElementById("chatBox");
  var file = event.target.files[0];

  if (file) {
    const imageFileUrl = URL.createObjectURL(file);
    console.log(imageFileUrl);

    var userMessage = document.createElement("div");
    userMessage.classList.add("userMessage");
    userMessage.style.background = "#fff";

    var fileImage = document.createElement("img");
    fileImage.src = URL.createObjectURL(file);
    fileImage.alt = "업로드 이미지";
    fileImage.style.maxWidth = "200px";
    fileImage.style.border = "1px solid #ccc";
    fileImage.style.borderRadius = "16px";

    fileImage.addEventListener("click", function () {
      openModal(fileImage.src);
    });

    userMessage.appendChild(fileImage);
    chatBox.appendChild(userMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    appendOptions(file);
    chatBox.scrollTop = chatBox.scrollHeight;

    
  }
}



//모르는 문제가 있어요 - 이미지 로드 후 옵션 선택
function appendOptions(file) {
  var chatBox = document.getElementById("chatBox");

  var botMessage = document.createElement("div");
  botMessage.classList.add("chatbotMessage");

  var botImage = document.createElement("img");
  botImage.src = "/static/img/Avatar.png";
  botImage.alt = "버리 이미지";
  botMessage.appendChild(botImage);

  chatBox.scrollTop = chatBox.scrollHeight;

  var botText = document.createElement("div");
  botText.innerHTML = `<p>무엇이 궁금한가요?</p>
        <div>
          <button class="optionBtn" data-option="문제 의도를 모르겠어요">문제 의도를 모르겠어요</button>
          <button class="optionBtn" data-option="문제 풀이에서 도움이 필요해요">문제 풀이에서 도움이 필요해요</button>
          <button class="optionBtn" data-option="문제를 변경할래요">문제를 변경할래요</button>
        </div>`;

  botMessage.appendChild(botText);
  chatBox.appendChild(botMessage);
  setTimeout(() => {
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 50);

  const optionButtons = botMessage.querySelectorAll(".optionBtn");
  optionButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedOption = e.target.getAttribute("data-option");
      const stage = e.target.getAttribute("data-stage");
      console.log("User selected:", selectedOption);

      if (selectedOption === "문제 의도를 모르겠어요") {
        intensionQuestion(file);
      } else if (selectedOption === "문제 풀이에서 도움이 필요해요") {
        handlesolutions(file);
      } else if (selectedOption === "문제를 변경할래요") {
        appendMessageQA("문제 변경할래요");
      }
    });
  });
}


//모르는 문제가 있어요 - 문제 의도를 모르겠어요 
function intensionQuestion(file) {
  var chatBox = document.getElementById("chatBox");

  var userMessage = document.createElement("div");
  userMessage.classList.add("userMessage");
  userMessage.textContent = "문제 의도를 모르겠어요";
  chatBox.appendChild(userMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const loadingElement = document.createElement("div");
  loadingElement.classList.add("loadingMessage");
  loadingElement.id = "loading";

  const loadingContainer = document.createElement("div");
  loadingContainer.classList.add("loading");

  const img = document.createElement("img");
  img.src = "/static/img/Avatar.png";
  img.alt = "버리 이미지";

  const textContainer = document.createElement("div");
  const snippet = document.createElement("div");
  snippet.classList.add("snippet");
  snippet.setAttribute("data-title", "dot-typing");

  const stage = document.createElement("div");
  stage.classList.add("stage");

  const dotTyping = document.createElement("div");
  dotTyping.classList.add("dot-typing");
  stage.appendChild(dotTyping);
  snippet.appendChild(stage);

  const loadingText = document.createElement("div");
  loadingText.classList.add("loadingText");
  const p = document.createElement("p");
  p.innerHTML = "답변을 생성하고 있어요.<br>잠시만 기다려주세요.";
  loadingText.appendChild(p);

  textContainer.appendChild(snippet);
  textContainer.appendChild(loadingText);

  loadingContainer.appendChild(img);
  loadingContainer.appendChild(textContainer);

  loadingElement.appendChild(loadingContainer);
  chatBox.appendChild(loadingElement);
  chatBox.scrollTop = chatBox.scrollHeight; 
  //[추가] 문제 의도를 모르겠어요 api 구현 필요
  const formData = new FormData();
  formData.append("message", "문제 의도를 모르겠어요");
  formData.append("file", file);

  fetch("/intention", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      loadingElement.remove();

      const solution = data.response;

      const botMessage = document.createElement("div");
      botMessage.classList.add("chatbotMessage");

      const botImage = document.createElement("img");
      botImage.src = "/static/img/Avatar.png";
      botImage.alt = "버리 이미지";
      botMessage.appendChild(botImage);

      const messageContainer = document.createElement("div");

      const messageText = document.createElement("p");
      messageText.innerHTML = solution + "<br>더 궁금한 내용이 있나요?";
      messageContainer.appendChild(messageText);

      MathJax.Hub.Queue(["Typeset", MathJax.Hub, messageText]);

      const buttonContainer = document.createElement("div");
      buttonContainer.innerHTML = `
        <button class="optionBtn" data-option="풀이에 필요한 개념 설명이 필요해요">풀이에 필요한 개념 설명이 필요해요</button>
        <button class="optionBtn" data-option="문제 풀이에서 도움이 필요해요">문제 풀이에서 도움이 필요해요</button>
        <button class="optionBtn" data-option="다른 문제도 도와주세요">다른 문제도 도와주세요</button>
      `;

      messageContainer.appendChild(buttonContainer);

      botMessage.appendChild(messageContainer);

      chatBox.appendChild(botMessage);
      chatBox.scrollTop = chatBox.scrollHeight;

      const optionButtons = botMessage.querySelectorAll(".optionBtn");
      optionButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          const selectedOption = e.target.getAttribute("data-option");
          const stage = e.target.getAttribute("data-stage");
          console.log("User selected:", selectedOption);

          if (selectedOption === "풀이에 필요한 개념 설명이 필요해요") {
            conceptQuestion(file, solution);
          } else if (selectedOption === "문제 풀이에서 도움이 필요해요") {
            handlesolutions(file);
          } else if (selectedOption === "다른 문제도 도와주세요") {
            appendMessageQA("다른 문제도 도와주세요");
          }
        });
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//모르는 문제가 있어요 - 풀이에 필요한 개념 설명이 필요해요
function conceptQuestion(file, solution) {
  var chatBox = document.getElementById("chatBox");

  var userMessage = document.createElement("div");
  userMessage.classList.add("userMessage");
  userMessage.textContent = "풀이에 필요한 개념 설명이 필요해요";
  chatBox.appendChild(userMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const loadingElement = document.createElement("div");
  loadingElement.classList.add("loadingMessage");
  loadingElement.id = "loading";

  const loadingContainer = document.createElement("div");
  loadingContainer.classList.add("loading");

  const img = document.createElement("img");
  img.src = "/static/img/Avatar.png";
  img.alt = "버리 이미지";

  const textContainer = document.createElement("div");
  const snippet = document.createElement("div");
  snippet.classList.add("snippet");
  snippet.setAttribute("data-title", "dot-typing");

  const stage = document.createElement("div");
  stage.classList.add("stage");

  const dotTyping = document.createElement("div");
  dotTyping.classList.add("dot-typing");
  stage.appendChild(dotTyping);
  snippet.appendChild(stage);

  const loadingText = document.createElement("div");
  loadingText.classList.add("loadingText");
  const p = document.createElement("p");
  p.innerHTML = "답변을 생성하고 있어요.<br>잠시만 기다려주세요.";
  loadingText.appendChild(p);

  textContainer.appendChild(snippet);
  textContainer.appendChild(loadingText);

  loadingContainer.appendChild(img);
  loadingContainer.appendChild(textContainer);

  loadingElement.appendChild(loadingContainer);
  chatBox.appendChild(loadingElement);
  chatBox.scrollTop = chatBox.scrollHeight;

  const formData = new FormData();
  formData.append("message", "풀이에 필요한 개념 설명이 필요해요");
  formData.append("file", file);
  formData.append("previous_answer", solution);

  fetch("/question_concept", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      loadingElement.remove();

      const solution = data.response;

      const botMessage = document.createElement("div");
      botMessage.classList.add("chatbotMessage");

      const botImage = document.createElement("img");
      botImage.src = "/static/img/Avatar.png";
      botImage.alt = "버리 이미지";
      botMessage.appendChild(botImage);

      const messageContainer = document.createElement("div");

      const messageText = document.createElement("p");
      messageText.innerHTML = solution + "<br>더 궁금한 내용이 있나요?";
      messageContainer.appendChild(messageText);

      MathJax.Hub.Queue(["Typeset", MathJax.Hub, messageText]);

      const buttonContainer = document.createElement("div");
      buttonContainer.innerHTML = `
        <button class="optionBtn" data-option="질문이 있어요">질문이 있어요</button>
        <button class="optionBtn" data-option="문제 풀이에서 도움이 필요해요">문제 풀이에서 도움이 필요해요</button>
        <button class="optionBtn" data-option="다른 문제도 도와주세요">다른 문제도 도와주세요</button>
      `;

      messageContainer.appendChild(buttonContainer);

      botMessage.appendChild(messageContainer);

      chatBox.appendChild(botMessage);
      chatBox.scrollTop = chatBox.scrollHeight;

      const optionButtons = botMessage.querySelectorAll(".optionBtn");
      optionButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          const selectedOption = e.target.getAttribute("data-option");
          const stage = e.target.getAttribute("data-stage");
          console.log("User selected:", selectedOption);

          if (selectedOption === "질문이 있어요") {
            qaFirst(file, solution);
          } else if (selectedOption === "문제 풀이에서 도움이 필요해요") {
            handlesolutions(file);
          } else if (selectedOption === "다른 문제도 도와주세요") {
            appendMessageQA("다른 문제도 도와주세요");
          }
        });
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//모르는 문제가 있어요 - 질문이 있어요
function qaFirst(file, solution) {
  var chatBox = document.getElementById("chatBox");

  var userMessage = document.createElement("div");
  userMessage.classList.add("userMessage");
  userMessage.textContent = "질문이 있어요";
  chatBox.appendChild(userMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  var botMessage = document.createElement("div");
  botMessage.classList.add("chatbotMessage");

  var botImage = document.createElement("img");
  botImage.src = "/static/img/Avatar.png";
  botImage.alt = "버리 이미지";
  botMessage.appendChild(botImage);

  var botText = document.createElement("div");
  botText.innerHTML = `<p>무엇이 궁금한가요?</p>`;
  botMessage.appendChild(botText);

  chatBox.appendChild(botMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  document.getElementById("message").disabled = false;
  document.getElementById("sendButton2").style.color = "#000";

  document.getElementById("sendButton").style.display = "none";
  document.getElementById("sendButton2").style.display = "block";

  document.getElementById("sendButton2").onclick = () => qa(file, solution);
}

function qa(file, solution) {
  var messageInput = document.getElementById("message");
  var message = messageInput.value;
  if (!message.trim()) return;

  console.log("====qa 들어왔나요?");

  var chatBox = document.getElementById("chatBox");
  var userMessage = document.createElement("div");
  userMessage.classList.add("userMessage");
  userMessage.textContent = message;
  chatBox.appendChild(userMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  messageInput.value = "";
  messageInput.disabled = true;
  document.getElementById("sendButton").style.color = "#ccc";

  const loadingElement = document.createElement("div");
  loadingElement.classList.add("loadingMessage");
  loadingElement.id = "loading";

  const loadingContainer = document.createElement("div");
  loadingContainer.classList.add("loading");

  const img = document.createElement("img");
  img.src = "/static/img/Avatar.png";
  img.alt = "버리 이미지";

  const textContainer = document.createElement("div");
  const snippet = document.createElement("div");
  snippet.classList.add("snippet");
  snippet.setAttribute("data-title", "dot-typing");

  const stage = document.createElement("div");
  stage.classList.add("stage");

  const dotTyping = document.createElement("div");
  dotTyping.classList.add("dot-typing");
  stage.appendChild(dotTyping);
  snippet.appendChild(stage);

  const loadingText = document.createElement("div");
  loadingText.classList.add("loadingText");
  const p = document.createElement("p");
  p.innerHTML = "답변을 생성하고 있어요.<br>잠시만 기다려주세요.";
  loadingText.appendChild(p);

  textContainer.appendChild(snippet);
  textContainer.appendChild(loadingText);

  loadingContainer.appendChild(img);
  loadingContainer.appendChild(textContainer);

  loadingElement.appendChild(loadingContainer);

  chatBox.appendChild(loadingElement);

  chatBox.scrollTop = chatBox.scrollHeight;

  console.log(file);
  console.log(message);
  console.log(solution);

  const formData = new FormData();
  formData.append("message", message);
  formData.append("file", file);
  formData.append("previous_answer", solution);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/chatImage", true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      messageInput.disabled = false;
      messageInput.focus();
      document.getElementById("sendButton").style.color = "#000";
      loadingElement.remove();

      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        console.log("Response content:", response.response);
        var botMessage = document.createElement("div");
        botMessage.classList.add("chatbotMessage");
        var botImage = document.createElement("img");
        botImage.src = "/static/img/Avatar.png";
        botImage.alt = "버리 이미지";
        botMessage.appendChild(botImage);

        var botText = document.createElement("div");
        botText.innerHTML = response.response;
        botMessage.appendChild(botText);
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, botText]);

        chatBox.appendChild(botMessage);

        chatBox.scrollTop = chatBox.scrollHeight;
      } else {
        alert("Error: " + xhr.status);
      }
    }
  };

  xhr.send(formData);
}

//모르는 문제가 있어요 - 문제 풀이에서 도움이 필요해요
function handlesolutions(file) {
  const chatBox = document.getElementById("chatBox");

  var userMessage = document.createElement("div");
  userMessage.classList.add("userMessage");
  userMessage.textContent = "문제 풀이에서 도움이 필요해요";
  chatBox.appendChild(userMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const loadingElement = document.createElement("div");
  loadingElement.classList.add("loadingMessage");
  loadingElement.id = "loading";

  const loadingContainer = document.createElement("div");
  loadingContainer.classList.add("loading");

  const img = document.createElement("img");
  img.src = "/static/img/Avatar.png";
  img.alt = "버리 이미지";

  const textContainer = document.createElement("div");
  const snippet = document.createElement("div");
  snippet.classList.add("snippet");
  snippet.setAttribute("data-title", "dot-typing");

  const stageDiv = document.createElement("div");
  stageDiv.classList.add("stage");

  const dotTyping = document.createElement("div");
  dotTyping.classList.add("dot-typing");
  stageDiv.appendChild(dotTyping);
  snippet.appendChild(stageDiv);

  const loadingText = document.createElement("div");
  loadingText.classList.add("loadingText");
  const p = document.createElement("p");
  p.innerHTML = "답변을 생성하고 있어요.<br>잠시만 기다려주세요.";
  loadingText.appendChild(p);

  textContainer.appendChild(snippet);
  textContainer.appendChild(loadingText);

  loadingContainer.appendChild(img);
  loadingContainer.appendChild(textContainer);

  loadingElement.appendChild(loadingContainer);
  chatBox.appendChild(loadingElement);
  chatBox.scrollTop = chatBox.scrollHeight;

  const formData = new FormData();
  formData.append("file", file);

  fetch("/problem", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      loadingElement.remove();

      console.log(data);
      console.log(data["response_content"]);

      const jsonData = data["response_content"];

      const botMessage = document.createElement("div");
      botMessage.classList.add("chatbotMessage");

      const botImage = document.createElement("img");
      botImage.src = "/static/img/Avatar.png";
      botImage.alt = "버리 이미지";
      botMessage.appendChild(botImage);

      const messageContainer = document.createElement("div");

      const messageText = document.createElement("p");
      messageText.innerHTML =
        "문제 풀이를 도와드릴게요. <br> 원하는 풀이 방식을 선택해 주세요.";
      messageContainer.appendChild(messageText);

      const buttonContainer = document.createElement("div");
      buttonContainer.innerHTML = `
        <button class="optionBtn" data-option="문제 풀이 전략이 궁금해요">문제 풀이 전략이 궁금해요</button>
        <button class="optionBtn" data-option="문제에 맞춘 구체적인 풀이가 필요해요">문제에 맞춘 구체적인 풀이가 필요해요</button>
      `;

      messageContainer.appendChild(buttonContainer);
      botMessage.appendChild(messageContainer);
      chatBox.appendChild(botMessage);
      chatBox.scrollTop = chatBox.scrollHeight;

      const optionButtons = botMessage.querySelectorAll(".optionBtn");
      optionButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          const selectedOption = e.target.getAttribute("data-option");
          console.log("User selected:", selectedOption);

          if (selectedOption === "문제 풀이 전략이 궁금해요") {
            //문제풀이 + 전략
            handleStrategySolution(file, jsonData);
          } else if (
            selectedOption === "문제에 맞춘 구체적인 풀이가 필요해요"
          ) {
            //풀이
            handleStepwiseSolution(file, jsonData);
          }
        });
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });

}

//모르는 문제가 있어요 - 문제 풀이 전략이 궁금해요
function handleStrategySolution(file, json) {
  var chatBox = document.getElementById("chatBox");

  var userMessage = document.createElement("div");
  userMessage.classList.add("userMessage");
  userMessage.textContent = "문제 풀이 전략이 궁금해요";
  chatBox.appendChild(userMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const botMessage = document.createElement("div");
  botMessage.classList.add("chatbotMessage");

  const botImage = document.createElement("img");
  botImage.src = "/static/img/Avatar.png";
  botImage.alt = "버리 이미지";
  botMessage.appendChild(botImage);

  const jsonData = JSON.parse(json);
  console.log(jsonData["strategy1"]);
  const messageContainer = document.createElement("div");
  const strategy1 = jsonData["strategy1"];
  const messageText = document.createElement("p");
  messageText.innerHTML =
    "문제 풀이 전략을 3단계로 나눠 알려 드릴게요.<br>" +
    strategy1 +
    "<br>더 궁금한 내용이 있나요?";

  messageContainer.appendChild(messageText);

  MathJax.Hub.Queue(["Typeset", MathJax.Hub, messageText]);

  const buttonContainer = document.createElement("div");
  buttonContainer.innerHTML = `
        <button class="optionBtn" data-option="다음 전략(2/3)">다음 전략(2/3)</button>
        <button class="optionBtn" data-option="문제에 맞춘 구체적인 풀이가 필요해요">문제에 맞춘 구체적인 풀이가 필요해요</button>
        <button class="optionBtn" data-option="다른 문제도 도와주세요">다른 문제도 도와주세요</button>
        `;

  messageContainer.appendChild(buttonContainer);

  botMessage.appendChild(messageContainer);

  chatBox.appendChild(botMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const optionButtons = botMessage.querySelectorAll(".optionBtn");
  optionButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedOption = e.target.getAttribute("data-option");
      console.log("User selected:", selectedOption);

      if (selectedOption === "다음 전략(2/3)") {
        fetchNextStrategy(file, json);
      } else if (selectedOption === "문제에 맞춘 구체적인 풀이가 필요해요") {
        handleAnswerStrategy(file, json);
      } else if (selectedOption === "다른 문제도 도와주세요") {
        appendMessageQA("다른 문제도 도와주세요");
      }
    });
  });
}

//모르는 문제가 있어요 - 문제 풀이 전략이 궁금해요 2단계
function fetchNextStrategy(file, json) {
  var chatBox = document.getElementById("chatBox");

  var userMessage = document.createElement("div");
  userMessage.classList.add("userMessage");
  userMessage.textContent = "다음 전략(2/3)";
  chatBox.appendChild(userMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const botMessage = document.createElement("div");
  botMessage.classList.add("chatbotMessage");

  const botImage = document.createElement("img");
  botImage.src = "/static/img/Avatar.png";
  botImage.alt = "버리 이미지";
  botMessage.appendChild(botImage);

  const jsonData = JSON.parse(json);
  console.log(jsonData["strategy2"]);
  const messageContainer = document.createElement("div");
  const strategy2 = jsonData["strategy2"];
  const messageText = document.createElement("p");
  messageText.innerHTML =
    "다음 전략을 알려 드릴게요.<br>" +
    strategy2 +
    "<br>더 궁금한 내용이 있나요?";

  messageContainer.appendChild(messageText);

  MathJax.Hub.Queue(["Typeset", MathJax.Hub, messageText]);

  const buttonContainer = document.createElement("div");
  buttonContainer.innerHTML = `
        <button class="optionBtn" data-option="다음 전략(3/3)">다음 전략(3/3)</button>
        <button class="optionBtn" data-option="문제에 맞춘 구체적인 풀이가 필요해요">문제에 맞춘 구체적인 풀이가 필요해요</button>
        <button class="optionBtn" data-option="다른 문제도 도와주세요">다른 문제도 도와주세요</button>
        `;

  messageContainer.appendChild(buttonContainer);

  botMessage.appendChild(messageContainer);

  chatBox.appendChild(botMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const optionButtons = botMessage.querySelectorAll(".optionBtn");
  optionButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedOption = e.target.getAttribute("data-option");
      console.log("User selected:", selectedOption);

      if (selectedOption === "다음 전략(3/3)") {
        fetchFinalStrategy(file, json);
      } else if (selectedOption === "문제에 맞춘 구체적인 풀이가 필요해요") {
        handleAnswerStrategy2(file, json);
      } else if (selectedOption === "다른 문제도 도와주세요") {
        appendMessageQA("다른 문제도 도와주세요");
      }
    });
  });
}

//모르는 문제가 있어요 - 문제 풀이 전략이 궁금해요 3단계
function fetchFinalStrategy(file, json) {
  var chatBox = document.getElementById("chatBox");

  var userMessage = document.createElement("div");
  userMessage.classList.add("userMessage");
  userMessage.textContent = "다음 전략(3/3)";
  chatBox.appendChild(userMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const botMessage = document.createElement("div");
  botMessage.classList.add("chatbotMessage");

  const botImage = document.createElement("img");
  botImage.src = "/static/img/Avatar.png";
  botImage.alt = "버리 이미지";
  botMessage.appendChild(botImage);

  const jsonData = JSON.parse(json);
  console.log(jsonData["strategy3"]);
  const messageContainer = document.createElement("div");
  const strategy3 = jsonData["strategy3"];
  const messageText = document.createElement("p");
  messageText.innerHTML =
    "다음 전략을 알려 드릴게요.<br>" +
    strategy3 +
    "<br>더 궁금한 내용이 있나요?";

  messageContainer.appendChild(messageText);

  MathJax.Hub.Queue(["Typeset", MathJax.Hub, messageText]);

  const buttonContainer = document.createElement("div");
  buttonContainer.innerHTML = `
        <button class="optionBtn" data-option="정답확인">정답확인</button>
        <button class="optionBtn" data-option="문제에 맞춘 구체적인 풀이가 필요해요">문제에 맞춘 구체적인 풀이가 필요해요</button>
        <button class="optionBtn" data-option="다른 문제도 도와주세요">다른 문제도 도와주세요</button>
        `;

  messageContainer.appendChild(buttonContainer);

  botMessage.appendChild(messageContainer);

  chatBox.appendChild(botMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const optionButtons = botMessage.querySelectorAll(".optionBtn");
  optionButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedOption = e.target.getAttribute("data-option");
      console.log("User selected:", selectedOption);

      if (selectedOption === "정답확인") {
        handleAnswer(file, json);
      } else if (selectedOption === "문제에 맞춘 구체적인 풀이가 필요해요") {
        handleAnswerStrategy3(file, json);
      } else if (selectedOption === "다른 문제도 도와주세요") {
        appendMessageQA("다른 문제도 도와주세요");
      }
    });
  });
}

//정답 확인
function handleAnswer(file, json) {
  var chatBox = document.getElementById("chatBox");

  var userMessage = document.createElement("div");
  userMessage.classList.add("userMessage");
  userMessage.textContent = "정답확인";
  chatBox.appendChild(userMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const botMessage = document.createElement("div");
  botMessage.classList.add("chatbotMessage");

  const botImage = document.createElement("img");
  botImage.src = "/static/img/Avatar.png";
  botImage.alt = "버리 이미지";
  botMessage.appendChild(botImage);

  const jsonData = JSON.parse(json);
  console.log(jsonData["answer"]);
  const messageContainer = document.createElement("div");
  const answer = jsonData["answer"];
  const messageText = document.createElement("p");
  messageText.innerHTML =
    "정답을 알려 드릴게요.<br>" + answer + "<br>더 궁금한 내용이 있나요?";

  messageContainer.appendChild(messageText);

  MathJax.Hub.Queue(["Typeset", MathJax.Hub, messageText]);

  const buttonContainer = document.createElement("div");
  buttonContainer.innerHTML = `
        <button class="optionBtn" data-option="문제에 맞춘 구체적인 풀이가 필요해요">문제에 맞춘 구체적인 풀이가 필요해요</button>
        <button class="optionBtn" data-option="다른 문제도 도와주세요">다른 문제도 도와주세요</button>
        `;

  messageContainer.appendChild(buttonContainer);

  botMessage.appendChild(messageContainer);

  chatBox.appendChild(botMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const optionButtons = botMessage.querySelectorAll(".optionBtn");
  optionButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedOption = e.target.getAttribute("data-option");
      console.log("User selected:", selectedOption);

      if (selectedOption === "문제에 맞춘 구체적인 풀이가 필요해요") {
        fetchFinalSolution(file, json);
      } else if (selectedOption === "다른 문제도 도와주세요") {
        appendMessageQA("다른 문제도 도와주세요");
      }
    });
  });
}

//전략이 맞춘 풀이 (1단계)
function handleAnswerStrategy(file, json) {
  var chatBox = document.getElementById("chatBox");

  var userMessage = document.createElement("div");
  userMessage.classList.add("userMessage");
  userMessage.textContent = "문제에 맞춘 구체적인 풀이가 필요해요";
  chatBox.appendChild(userMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const botMessage = document.createElement("div");
  botMessage.classList.add("chatbotMessage");

  const botImage = document.createElement("img");
  botImage.src = "/static/img/Avatar.png";
  botImage.alt = "버리 이미지";
  botMessage.appendChild(botImage);

  const jsonData = JSON.parse(json);
  console.log(jsonData["step1"]);
  const messageContainer = document.createElement("div");
  const step1 = jsonData["step1"];
  const messageText = document.createElement("p");
  messageText.innerHTML =
    "다음 전략을 알려 드릴게요.<br>" + step1 + "<br>더 궁금한 내용이 있나요?";

  messageContainer.appendChild(messageText);

  MathJax.Hub.Queue(["Typeset", MathJax.Hub, messageText]);

  const buttonContainer = document.createElement("div");
  buttonContainer.innerHTML = `
        <button class="optionBtn" data-option="다음 전략(2/3)">다음 전략(2/3)</button>
        <button class="optionBtn" data-option="질문이 있어요">질문이 있어요</button>
        <button class="optionBtn" data-option="풀이에 사용한 개념이 궁금해요">풀이에 사용한 개념이 궁금해요</button>
        <button class="optionBtn" data-option="다른 문제도 도와주세요">다른 문제도 도와주세요</button>
        `;

  messageContainer.appendChild(buttonContainer);

  botMessage.appendChild(messageContainer);

  chatBox.appendChild(botMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const optionButtons = botMessage.querySelectorAll(".optionBtn");
  optionButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedOption = e.target.getAttribute("data-option");
      console.log("User selected:", selectedOption);

      if (selectedOption === "다음 전략(2/3)") {
        fetchNextStrategy(file, json);
      } else if (selectedOption === "질문이 있어요") {
        //[추가]
        qaFirst(file, step1);
      } else if (selectedOption === "풀이에 사용한 개념이 궁금해요") {
        //[추가]
        conceptQuestion(file, step1);
      } else if (selectedOption === "다른 문제도 도와주세요") {
        appendMessageQA("다른 문제도 도와주세요");
      }
    });
  });
}

//전략이 맞춘 풀이 (2단계)
function handleAnswerStrategy2(file, json) {
  var chatBox = document.getElementById("chatBox");

  var userMessage = document.createElement("div");
  userMessage.classList.add("userMessage");
  userMessage.textContent = "문제에 맞춘 구체적인 풀이가 필요해요";
  chatBox.appendChild(userMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const botMessage = document.createElement("div");
  botMessage.classList.add("chatbotMessage");

  const botImage = document.createElement("img");
  botImage.src = "/static/img/Avatar.png";
  botImage.alt = "버리 이미지";
  botMessage.appendChild(botImage);

  const jsonData = JSON.parse(json);
  console.log(jsonData["step2"]);
  const messageContainer = document.createElement("div");
  const step2 = jsonData["step2"];
  const messageText = document.createElement("p");
  messageText.innerHTML =
    "다음 전략을 알려 드릴게요.<br>" + step2 + "<br>더 궁금한 내용이 있나요?";

  messageContainer.appendChild(messageText);

  MathJax.Hub.Queue(["Typeset", MathJax.Hub, messageText]);

  const buttonContainer = document.createElement("div");
  buttonContainer.innerHTML = `
        <button class="optionBtn" data-option="다음 전략(3/3)">다음 전략(3/3)</button>
        <button class="optionBtn" data-option="질문이 있어요">질문이 있어요</button>
        <button class="optionBtn" data-option="풀이에 사용한 개념이 궁금해요">풀이에 사용한 개념이 궁금해요</button>
        <button class="optionBtn" data-option="다른 문제도 도와주세요">다른 문제도 도와주세요</button>
        `;

  messageContainer.appendChild(buttonContainer);

  botMessage.appendChild(messageContainer);

  chatBox.appendChild(botMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const optionButtons = botMessage.querySelectorAll(".optionBtn");
  optionButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedOption = e.target.getAttribute("data-option");
      console.log("User selected:", selectedOption);

      if (selectedOption === "다음 전략(3/3)") {
        fetchFinalStrategy(file, json);
      } else if (selectedOption === "질문이 있어요") {
        //[추가]
        qaFirst(file, step2);
      } else if (selectedOption === "풀이에 사용한 개념이 궁금해요") {
        //[추가]
        conceptQuestion(file, step2);
      } else if (selectedOption === "다른 문제도 도와주세요") {
        appendMessageQA("다른 문제도 도와주세요");
      }
    });
  });
}

//전략이 맞춘 풀이 (3단계)
function handleAnswerStrategy3(file, json) {
  var chatBox = document.getElementById("chatBox");

  var userMessage = document.createElement("div");
  userMessage.classList.add("userMessage");
  userMessage.textContent = "문제에 맞춘 구체적인 풀이가 필요해요";
  chatBox.appendChild(userMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const botMessage = document.createElement("div");
  botMessage.classList.add("chatbotMessage");

  const botImage = document.createElement("img");
  botImage.src = "/static/img/Avatar.png";
  botImage.alt = "버리 이미지";
  botMessage.appendChild(botImage);

  const jsonData = JSON.parse(json);
  console.log(jsonData["step3"]);
  const messageContainer = document.createElement("div");
  const step3 = jsonData["step3"];
  const messageText = document.createElement("p");
  messageText.innerHTML =
    "다음 전략을 알려 드릴게요.<br>" + step3 + "<br>더 궁금한 내용이 있나요?";

  messageContainer.appendChild(messageText);

  MathJax.Hub.Queue(["Typeset", MathJax.Hub, messageText]);

  const buttonContainer = document.createElement("div");
  buttonContainer.innerHTML = `
        <button class="optionBtn" data-option="정답확인">정답확인</button>
        <button class="optionBtn" data-option="질문이 있어요">질문이 있어요</button>
        <button class="optionBtn" data-option="풀이에 사용한 개념이 궁금해요">풀이에 사용한 개념이 궁금해요</button>
        <button class="optionBtn" data-option="다른 문제도 도와주세요">다른 문제도 도와주세요</button>
        `;

  messageContainer.appendChild(buttonContainer);

  botMessage.appendChild(messageContainer);

  chatBox.appendChild(botMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const optionButtons = botMessage.querySelectorAll(".optionBtn");
  optionButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedOption = e.target.getAttribute("data-option");
      console.log("User selected:", selectedOption);

      if (selectedOption === "정답확인") {
        handleAnswer(file, json);
      } else if (selectedOption === "질문이 있어요") {
        //[추가]
        qaFirst(file, step3);
      } else if (selectedOption === "풀이에 사용한 개념이 궁금해요") {
        conceptQuestion(file, step3);
      } else if (selectedOption === "다른 문제도 도와주세요") {
        appendMessageQA("다른 문제도 도와주세요");
      }
    });
  });
}

//모르는 문제가 있어요 - 문제에 맞춘 구체적인 풀이가 필요해요
function handleStepwiseSolution(file, json) {
  var chatBox = document.getElementById("chatBox");

  var userMessage = document.createElement("div");
  userMessage.classList.add("userMessage");
  userMessage.textContent = "문제에 맞춘 구체적인 풀이가 필요해요";
  chatBox.appendChild(userMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const botMessage = document.createElement("div");
  botMessage.classList.add("chatbotMessage");

  const botImage = document.createElement("img");
  botImage.src = "/static/img/Avatar.png";
  botImage.alt = "버리 이미지";
  botMessage.appendChild(botImage);

  const jsonData = JSON.parse(json);
  console.log(jsonData["step1"]);
  const messageContainer = document.createElement("div");
  const step1 = jsonData["step1"];
  const messageText = document.createElement("p");
  messageText.innerHTML =
    "문제에 맞춘 구체적인 풀이를 3단계로 나누어 알려 드릴게요.<br>" +
    step1 +
    "<br>더 궁금한 내용이 있나요?";

  messageContainer.appendChild(messageText);

  MathJax.Hub.Queue(["Typeset", MathJax.Hub, messageText]);

  const buttonContainer = document.createElement("div");
  buttonContainer.innerHTML = `
        <button class="optionBtn" data-option="다음 풀이(2/3)">다음 풀이(2/3)</button>
        <button class="optionBtn" data-option="질문이 있어요">질문이 있어요</button>
        <button class="optionBtn" data-option="풀이에 사용된 개념이 궁금해요">풀이에 사용된 개념이 궁금해요</button>
        <button class="optionBtn" data-option="다른 문제도 도와주세요">다른 문제도 도와주세요</button>
        `;

  messageContainer.appendChild(buttonContainer);

  botMessage.appendChild(messageContainer);

  chatBox.appendChild(botMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const optionButtons = botMessage.querySelectorAll(".optionBtn");
  optionButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedOption = e.target.getAttribute("data-option");
      console.log("User selected:", selectedOption);

      if (selectedOption === "다음 풀이(2/3)") {
        fetchNextSolution(file, json);
      } else if (selectedOption === "질문이 있어요") {
        qaFirst(file, step1);
      } else if (selectedOption === "풀이에 사용된 개념이 궁금해요") {
        conceptQuestion(file, step1);
      } else if (selectedOption === "다른 문제도 도와주세요") {
        appendMessageQA("다른 문제도 도와주세요");
      }
    });
  });
}

//모르는 문제가 있어요 - 문제에 맞춘 구체적인 풀이가 필요해요 2단계 api 처리
function fetchNextSolution(file, json) {
  var chatBox = document.getElementById("chatBox");

  var userMessage = document.createElement("div");
  userMessage.classList.add("userMessage");
  userMessage.textContent = "다음 풀이(2/3)";
  chatBox.appendChild(userMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const botMessage = document.createElement("div");
  botMessage.classList.add("chatbotMessage");

  const botImage = document.createElement("img");
  botImage.src = "/static/img/Avatar.png";
  botImage.alt = "버리 이미지";
  botMessage.appendChild(botImage);

  const jsonData = JSON.parse(json);
  console.log(jsonData["step2"]);
  const messageContainer = document.createElement("div");
  const step2 = jsonData["step2"];
  const messageText = document.createElement("p");
  messageText.innerHTML =
    "다음 풀이를 알려 드릴게요.<br>" + step2 + "<br>더 궁금한 내용이 있나요?";

  messageContainer.appendChild(messageText);

  MathJax.Hub.Queue(["Typeset", MathJax.Hub, messageText]);

  const buttonContainer = document.createElement("div");
  buttonContainer.innerHTML = `
        <button class="optionBtn" data-option="다음 풀이(3/3)">다음 풀이(3/3)</button>
        <button class="optionBtn" data-option="질문이 있어요">질문이 있어요</button>
        <button class="optionBtn" data-option="풀이에 사용된 개념이 궁금해요">풀이에 사용된 개념이 궁금해요</button>
        <button class="optionBtn" data-option="다른 문제도 도와주세요">다른 문제도 도와주세요</button>
        `;

  messageContainer.appendChild(buttonContainer);

  botMessage.appendChild(messageContainer);

  chatBox.appendChild(botMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const optionButtons = botMessage.querySelectorAll(".optionBtn");
  optionButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedOption = e.target.getAttribute("data-option");
      console.log("User selected:", selectedOption);

      if (selectedOption === "다음 풀이(3/3)") {
        fetchFinalSolution(file, json);
      } else if (selectedOption === "질문이 있어요") {
        qaFirst(file, step2);
      } else if (selectedOption === "풀이에 사용된 개념이 궁금해요") {
        conceptQuestion(file, step2);
      } else if (selectedOption === "다른 문제도 도와주세요") {
        appendMessageQA("다른 문제도 도와주세요");
      }
    });
  });
}

//모르는 문제가 있어요 - 문제에 맞춘 구체적인 풀이가 필요해요 3단계 api 처리
function fetchFinalSolution(file, json) {
  var chatBox = document.getElementById("chatBox");

  var userMessage = document.createElement("div");
  userMessage.classList.add("userMessage");
  userMessage.textContent = "다음 풀이(3/3)";
  chatBox.appendChild(userMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const botMessage = document.createElement("div");
  botMessage.classList.add("chatbotMessage");

  const botImage = document.createElement("img");
  botImage.src = "/static/img/Avatar.png";
  botImage.alt = "버리 이미지";
  botMessage.appendChild(botImage);

  const jsonData = JSON.parse(json);
  console.log(jsonData["step3"]);
  const messageContainer = document.createElement("div");
  const step3 = jsonData["step3"];
  const messageText = document.createElement("p");
  messageText.innerHTML =
    "다음 풀이를 알려 드릴게요.<br>" + step3 + "<br>더 궁금한 내용이 있나요?";

  messageContainer.appendChild(messageText);

  MathJax.Hub.Queue(["Typeset", MathJax.Hub, messageText]);

  const buttonContainer = document.createElement("div");
  buttonContainer.innerHTML = `
        <button class="optionBtn" data-option="정답확인">정답확인</button>
        <button class="optionBtn" data-option="질문이 있어요">질문이 있어요</button>
        <button class="optionBtn" data-option="풀이에 사용된 개념이 궁금해요">풀이에 사용된 개념이 궁금해요</button>
        <button class="optionBtn" data-option="다른 문제도 도와주세요">다른 문제도 도와주세요</button>
        `;

  messageContainer.appendChild(buttonContainer);

  botMessage.appendChild(messageContainer);

  chatBox.appendChild(botMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const optionButtons = botMessage.querySelectorAll(".optionBtn");
  optionButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedOption = e.target.getAttribute("data-option");
      console.log("User selected:", selectedOption);

      if (selectedOption === "정답확인") {
        handleAnswer2(file, json);
      } else if (selectedOption === "질문이 있어요") {
        qaFirst(file, step3);
      } else if (selectedOption === "풀이에 사용된 개념이 궁금해요") {
        conceptQuestion(file, step3);
      } else if (selectedOption === "다른 문제도 도와주세요") {
        appendMessageQA("다른 문제도 도와주세요");
      }
    });
  });
}

//정답 확인2
function handleAnswer2(file, json) {
  var chatBox = document.getElementById("chatBox");

  var userMessage = document.createElement("div");
  userMessage.classList.add("userMessage");
  userMessage.textContent = "정답확인";
  chatBox.appendChild(userMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const botMessage = document.createElement("div");
  botMessage.classList.add("chatbotMessage");

  const botImage = document.createElement("img");
  botImage.src = "/static/img/Avatar.png";
  botImage.alt = "버리 이미지";
  botMessage.appendChild(botImage);

  const jsonData = JSON.parse(json);
  console.log(jsonData["answer"]);
  const messageContainer = document.createElement("div");
  const answer = jsonData["answer"];
  const messageText = document.createElement("p");
  messageText.innerHTML = "정답을 알려 드릴게요.<br>" + answer;

  messageContainer.appendChild(messageText);

  MathJax.Hub.Queue(["Typeset", MathJax.Hub, messageText]);

  const buttonContainer = document.createElement("div");
  buttonContainer.innerHTML = `
        <button class="optionBtn" data-option="질문이 있어요">질문이 있어요</button>
        <button class="optionBtn" data-option="다른 문제도 도와주세요">다른 문제도 도와주세요</button>
        `;

  messageContainer.appendChild(buttonContainer);

  botMessage.appendChild(messageContainer);

  chatBox.appendChild(botMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const optionButtons = botMessage.querySelectorAll(".optionBtn");
  optionButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedOption = e.target.getAttribute("data-option");
      console.log("User selected:", selectedOption);

      if (selectedOption === "질문이 있어요") {
        qaFirst(file, answer);
      } else if (selectedOption === "다른 문제도 도와주세요") {
        appendMessageQA("다른 문제도 도와주세요");
      }
    });
  });
}

//메시지 전송 엔터 기능
document
  .getElementById("message")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();

      if (document.getElementById("sendButton2").style.display === "block") {
        document.getElementById("sendButton2").click();
      } else {
        sendMessage();
      }
    }
  });

//텍스트 박스 높이 설정
function adjustHeight(textarea) {
  textarea.style.height = 20;
  const maxHeight = 50;
  textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
}

//모달 제어
function openModal(imageSrc) {
  var modal = document.getElementById("imageModal");
  var modalImage = document.getElementById("modalImage");

  modalImage.src = imageSrc;
  modal.style.display = "block";
}

document.getElementById("closeModal").addEventListener("click", function () {
  var modal = document.getElementById("imageModal");
  modal.style.display = "none";
});

window.onclick = function (event) {
  var modal = document.getElementById("imageModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
