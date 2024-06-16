const loginForm = document.getElementById("login");
const courseIDDiv = document.getElementById("courseIDDiv");
const answerSheet = document.getElementById("answerSheet");

let i = 1;
let _token = "";
let isLogin = false;

document.addEventListener("keydown", (e) => {
  if (e.code === "Home" && isLogin) {
    clearAnswer();
    courseIDDiv.classList.remove("isHidden");
  }
});

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  fetch("https://s.moon.vn/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      username: username,
      password: password,
      rememberMe: true,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(function (res) {
    if (res.status != 200) {
      alert("Tên đăng nhập hoặc mật khẩu không chính xác");
    } else {
      loginForm.classList.add("isHidden");
      courseIDDiv.classList.remove("isHidden");
      res.json().then(function (e) {
        _token = e["token"];
        isLogin = true;
      });
    }
  });
});

const courseIDform = document.getElementById("courseIDForm");
const courseID = document.getElementById("courseID");

courseIDform.addEventListener("submit", function (e) {
  i = 1;
  e.preventDefault();

  fetch(
    `https://courseapi.moon.vn/api/Course/TestingEnglish/${courseID.value}/4`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${_token}`,
        referer: "https://beta.moon.vn/",
      },
    }
  ).then(function (res) {
    if (res.status != 200) {
      alert("Không hợp lệ");
    } else
      res.json().then(function (data) {
        clearAnswer();
        // renderWriting(e);
        data.forEach((e) => {
          renderListening_Writing(e);
          e["testingList"].forEach((e) => {
            renderAnswer(e);
          });
        });
        courseIDDiv.classList.add("isHidden");
      });
  });

  getData(`https://courseapi.moon.vn/api/Course/Testing/${courseID.value}/1`);
  
  fetch(
    `https://courseapi.moon.vn/api/Course/TestingEnglish/${courseID.value}/1`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${_token}`,
        referer: "https://beta.moon.vn/",
      },
    }
  ).then(function (res) {
    if (res.status != 200) {
      alert("Không hợp lệ");
    } else
      res.json().then(function (data) {
        clearAnswer();
        // renderWriting(e);
        data.forEach((e) => {
          renderListening_Writing(e);
          e["testingList"].forEach((e) => {
            renderAnswer(e);
          });
        });
        courseIDDiv.classList.add("isHidden");
      });
  });
});

function clearAnswer() {
  answerSheet.innerHTML = "";
}

function getData(url) {
  let data = "";
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${_token}`,
      referer: "https://beta.moon.vn/",
    },
  }).then(function (res) {
    if (res.status != 200) {
      alert("Không hợp lệ");
    } else
      res.json().then(function (data) {
        // clearAnswer();

        data.forEach((e) => {
          renderAnswer(e);
        });
        courseIDDiv.classList.add("isHidden");
      });
  });
}

function renderWriting(e) {
  const detail = `
  <div class="box">
      
  </div>    
  `;

  answerSheet.innerHTML += detail;
}

function renderListening_Writing(e) {
  const detail = `
  <div class="box">
    <div class="solution">${e["content"]}</div>
  </div>    
  <div class="box">
     <div class="solution">${e["answer"]}</div>   
  </div>    
  `;

  answerSheet.innerHTML += detail;
}

function renderAnswer(e) {
  const detail = `
  <div class="box">
    <div class="qna">
      <p class="question"><strong>${i}.</strong> ${e["questionText"]}</p>
      <p class="selection"><strong><span style="color: blue;">A.</span></strong> ${e["a"]}</p>
      <p class="selection"><strong><span style="color: blue;">B.</span></strong> ${e["b"]}</p>
      <p class="selection"><strong><span style="color: blue;">C.</span></strong> ${e["c"]}</p>
      <p class="selection"><strong><span style="color: blue;">D.</span></strong> ${e["d"]}</p>
      <p class="answer">Đáp án: <strong style="color: blue; font-weight: bold;">${e["key"]}</strong></p>
    </div>
    <div class="solution">${e["answer"]}</div>
  </div>    
  `;
  answerSheet.innerHTML += detail;
  i++;
}
