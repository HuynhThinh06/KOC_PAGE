/**
 * QUIZ.JS - LOGIC MINI QUIZ "NẾP TÓC - NẾP RIÊNG?"
 * Chuẩn 5 câu hỏi, thanh tiến độ thật và phân loại 3 nhóm nếp tóc.
 */

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Mái tóc của bạn thường gặp tình trạng nào nhất?",
    options: [
      { key: "A", text: "Dễ bết dầu, nhất là phần chân tóc." },
      { key: "B", text: "Khô, dễ rối hoặc thiếu độ mềm mại." },
      { key: "C", text: "Tương đối ổn định, ít gặp vấn đề." }
    ]
  },
  {
    id: 2,
    question: "Sau một ngày dài, mái tóc thường khiến bạn bận tâm điều gì?",
    options: [
      { key: "A", text: "Chân tóc bắt đầu bết, mất độ bồng bềnh." },
      { key: "B", text: "Tóc xơ, rối và khó vào nếp." },
      { key: "C", text: "Không có vấn đề gì đáng kể." }
    ]
  },
  {
    id: 3,
    question: "Bạn thường gội đầu với tần suất như thế nào?",
    options: [
      { key: "A", text: "Hằng ngày hoặc cách một ngày." },
      { key: "B", text: "Khoảng 2-3 lần/tuần." },
      { key: "C", text: "Tùy lịch sinh hoạt và tình trạng tóc." }
    ]
  },
  {
    id: 4,
    question: "Khi chọn dầu gội, yếu tố nào khiến bạn chú ý đầu tiên?",
    options: [
      { key: "A", text: "Cảm giác sạch thoáng, dễ chịu sau gội." },
      { key: "B", text: "Tóc mềm mại, dễ chải và ít rối." },
      { key: "C", text: "Thành phần, mùi hương và mức giá phù hợp." }
    ]
  },
  {
    id: 5,
    question: "Nếu thử dầu gội bồ kết Thorakao, bạn tò mò nhất về điều gì?",
    options: [
      { key: "A", text: "Khả năng làm sạch và cảm giác da đầu." },
      { key: "B", text: "Cảm giác tóc sau khi gội." },
      { key: "C", text: "Mùi hương bồ kết và trải nghiệm so với dầu gội thường dùng." }
    ]
  }
];

const QUIZ_RESULTS = {
  A: {
    badge: "Kết quả A",
    title: "Nếp tóc thích thoáng nhẹ",
    trait: "Bạn thường quan tâm đến tình trạng tóc nhanh bết và mong muốn duy trì cảm giác sạch thoáng, dễ chịu sau mỗi lần gội.",
    advice: "Ưu tiên làm sạch da đầu nhẹ nhàng, lựa chọn tần suất gội phù hợp với mức độ tiết dầu và hạn chế sử dụng quá nhiều sản phẩm dưỡng ở chân tóc.",
    explore: "Hãy tìm hiểu dầu gội bồ kết Thorakao và tham khảo trải nghiệm của các KOC về khả năng làm sạch, cảm giác da đầu sau gội để cân nhắc mức độ phù hợp với bản thân.",
    ctaText: "Khám phá trải nghiệm gội sạch cùng Thorakao",
    ctaLink: "product.html"
  },
  B: {
    badge: "Kết quả B",
    title: "Nếp tóc cần nâng niu",
    trait: "Mái tóc có xu hướng khô, dễ rối hoặc thiếu độ mềm mại. Vì vậy, bạn thường chú ý đến cảm giác tóc sau khi gội và nhu cầu chăm sóc thân tóc.",
    advice: "Hạn chế tác động nhiệt thường xuyên, tránh chà xát mạnh khi gội và kết hợp dầu xả phù hợp để hỗ trợ chăm sóc phần thân và ngọn tóc.",
    explore: "Khi tìm hiểu dầu gội bồ kết Thorakao, hãy chú ý đến những đánh giá của KOC về độ mềm, cảm giác khô hoặc rít sau gội để có thêm thông tin trước khi trải nghiệm.",
    ctaText: "Tìm hiểu cách chăm tóc cùng Thorakao",
    ctaLink: "product.html"
  },
  C: {
    badge: "Kết quả C",
    title: "Nếp tóc theo gu riêng",
    trait: "Bạn ít gặp vấn đề nổi bật về tóc và thường lựa chọn sản phẩm dựa trên sở thích, mùi hương, thành phần, sự tiện lợi và mức giá phù hợp.",
    advice: "Duy trì thói quen chăm sóc tóc phù hợp với bản thân, đồng thời tìm hiểu thông tin và trải nghiệm thực tế trước khi lựa chọn sản phẩm mới.",
    explore: "Nếu tò mò về món dầu gội mẹ từng dùng, hãy khám phá mùi hương bồ kết, kết cấu và cảm nhận của các KOC để xem Thorakao có phù hợp với phong cách chăm sóc tóc của bạn không.",
    ctaText: "Khám phá nếp tóc cùng Thorakao",
    ctaLink: "product.html"
  }
};

let currentQuestionIndex = 0;
let userAnswers = [];

document.addEventListener('DOMContentLoaded', () => {
  initQuiz();
});

function initQuiz() {
  currentQuestionIndex = 0;
  userAnswers = [];

  const startBtn = document.getElementById('btn-start-quiz');
  const closeBtn = document.getElementById('quiz-close-btn');
  const prevBtn = document.getElementById('quiz-btn-prev');

  if (startBtn) {
    startBtn.onclick = () => {
      document.getElementById('quiz-launch-card').style.display = 'none';
      document.getElementById('quiz-active-card').style.display = 'block';
      currentQuestionIndex = 0;
      userAnswers = [];
      renderQuestion();
    };
  }

  if (closeBtn) {
    closeBtn.onclick = () => {
      document.getElementById('quiz-active-card').style.display = 'none';
      document.getElementById('quiz-launch-card').style.display = 'block';
    };
  }

  if (prevBtn) {
    prevBtn.onclick = () => {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
      }
    };
  }
}

function renderQuestion() {
  const q = QUIZ_QUESTIONS[currentQuestionIndex];
  if (!q) return;

  // Cập nhật số câu & thanh tiến độ
  const stepText = document.getElementById('quiz-step-text');
  const progressBar = document.getElementById('quiz-progress-bar');
  const prevBtn = document.getElementById('quiz-btn-prev');

  const progressPercent = Math.round(((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100);
  if (stepText) stepText.innerText = `Câu ${currentQuestionIndex + 1} / ${QUIZ_QUESTIONS.length} (${progressPercent}%)`;
  if (progressBar) progressBar.style.width = `${progressPercent}%`;
  if (prevBtn) prevBtn.style.display = currentQuestionIndex > 0 ? 'inline-block' : 'none';

  // Tiêu đề câu hỏi
  const titleEl = document.getElementById('quiz-question-text') || document.getElementById('quiz-question-title');
  if (titleEl) titleEl.innerText = `${q.id}. ${q.question}`;

  // Danh sách đáp án
  const optionsEl = document.getElementById('quiz-options-container') || document.getElementById('quiz-options-list');
  if (optionsEl) {
    optionsEl.innerHTML = '';
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.type = 'button';
      if (userAnswers[currentQuestionIndex] === opt.key) {
        btn.classList.add('selected');
      }
      btn.innerHTML = `
        <span class="quiz-option-key">${opt.key}</span>
        <span class="quiz-option-desc">${opt.text}</span>
      `;
      btn.onclick = () => selectQuizOption(opt.key, btn);
      optionsEl.appendChild(btn);
    });
  }
}

function selectQuizOption(key, btnElement) {
  const allBtns = document.querySelectorAll('.quiz-option-btn');
  allBtns.forEach(b => b.classList.remove('selected'));
  btnElement.classList.add('selected');

  userAnswers[currentQuestionIndex] = key;

  setTimeout(() => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      currentQuestionIndex++;
      renderQuestion();
    } else {
      showQuizResult();
    }
  }, 280);
}

function calculateQuizResult(answers) {
  const counts = { A: 0, B: 0, C: 0 };
  answers.forEach(ans => {
    if (counts[ans] !== undefined) counts[ans]++;
  });

  const maxVal = Math.max(counts.A, counts.B, counts.C);
  const winners = Object.keys(counts).filter(k => counts[k] === maxVal);

  if (winners.length === 1) {
    return winners[0];
  }

  // Phân định hòa: Ưu tiên đáp án của câu 1 (mối bận tâm cốt lõi của người dùng)
  const q1Answer = answers[0];
  if (winners.includes(q1Answer)) {
    return q1Answer;
  }
  return winners[0];
}

function showQuizResult() {
  const winningKey = calculateQuizResult(userAnswers);
  const res = QUIZ_RESULTS[winningKey];

  const activeCard = document.getElementById('quiz-active-card');
  const resultCard = document.getElementById('quiz-result-card');

  if (activeCard) activeCard.style.display = 'none';
  if (resultCard) {
    resultCard.style.display = 'block';
    resultCard.innerHTML = `
      <div class="quiz-res-header">
        <span class="quiz-res-tag">${res.badge}</span>
        <h3 class="quiz-res-title">${res.title}</h3>
      </div>
      <div class="quiz-res-section">
        <h5>🌿 Nếp tóc của bạn:</h5>
        <p>${res.trait}</p>
      </div>
      <div class="quiz-res-section">
        <h5>💡 Gợi ý chăm sóc:</h5>
        <p>${res.advice}</p>
      </div>
      <div class="quiz-res-section">
        <h5>✨ Khám phá cùng Thorakao:</h5>
        <p>${res.explore}</p>
      </div>
      <div class="quiz-res-cta-row">
        <a href="${res.ctaLink}" class="btn-res-cta">${res.ctaText} &rarr;</a>
        <button type="button" class="btn-res-restart" onclick="restartQuiz()">Làm lại trắc nghiệm</button>
      </div>
    `;

    // Smooth scroll to view result
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function restartQuiz() {
  const launchCard = document.getElementById('quiz-launch-card');
  const activeCard = document.getElementById('quiz-active-card');
  const resultCard = document.getElementById('quiz-result-card');

  if (resultCard) resultCard.style.display = 'none';
  if (launchCard) launchCard.style.display = 'block';
  if (activeCard) activeCard.style.display = 'none';

  currentQuestionIndex = 0;
  userAnswers = [];
}
