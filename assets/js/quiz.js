/**
 * QUIZ.JS - INTERACTIVE MINI QUIZ SECTION 9 "NẾP TÓC - NẾP RIÊNG?"
 * Tái hiện 100% bản thiết kế gốc (Quizz.png & Kết quả quizz.png)
 * 5 câu hỏi thực tế, tiến độ thật, hiển thị kết quả trực tiếp tại Section 9.
 */

const QUIZ_QUESTIONS = [
  {
    id: 1,
    title: "Q1: Mái tóc của bạn thường gặp tình trạng nào nhất?",
    options: [
      { key: "A", text: "A. Dễ bết dầu, nhất là phần chân tóc." },
      { key: "B", text: "B. Khô, dễ rối hoặc thiếu độ mềm mại." },
      { key: "C", text: "C. Tương đối ổn định, ít gặp vấn đề." }
    ]
  },
  {
    id: 2,
    title: "Q2: Sau một ngày dài, mái tóc thường khiến bạn bận tâm điều gì?",
    options: [
      { key: "A", text: "A. Chân tóc bắt đầu bết, mất độ bồng bềnh." },
      { key: "B", text: "B. Tóc xơ, rối và khó vào nếp." },
      { key: "C", text: "C. Không có vấn đề gì đáng kể." }
    ]
  },
  {
    id: 3,
    title: "Q3: Bạn thường gội đầu với tần suất như thế nào?",
    options: [
      { key: "A", text: "A. Hằng ngày hoặc cách một ngày." },
      { key: "B", text: "B. Khoảng 2-3 lần/tuần." },
      { key: "C", text: "C. Tùy lịch sinh hoạt và tình trạng tóc." }
    ]
  },
  {
    id: 4,
    title: "Q4: Khi chọn dầu gội, yếu tố nào khiến bạn chú ý đầu tiên?",
    options: [
      { key: "A", text: "A. Cảm giác sạch thoáng, dễ chịu sau gội." },
      { key: "B", text: "B. Tóc mềm mại, dễ chải và ít rối." },
      { key: "C", text: "C. Thành phần, mùi hương và mức giá phù hợp." }
    ]
  },
  {
    id: 5,
    title: "Q5: Nếu thử dầu gội bồ kết Thorakao, bạn tò mò nhất về điều gì?",
    options: [
      { key: "A", text: "A. Khả năng làm sạch và cảm giác da đầu." },
      { key: "B", text: "B. Cảm giác tóc sau khi gội." },
      { key: "C", text: "C. Mùi hương bồ kết và trải nghiệm so với dầu gội thường dùng." }
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
  initQuizSection();
});

function initQuizSection() {
  currentQuestionIndex = 0;
  userAnswers = [];
  renderCurrentQuestion();
}

function renderCurrentQuestion() {
  const q = QUIZ_QUESTIONS[currentQuestionIndex];
  if (!q) return;

  const qView = document.getElementById('quizQuestionView');
  const rView = document.getElementById('quizResultView');
  if (qView) qView.style.display = 'block';
  if (rView) rView.style.display = 'none';

  // Cập nhật thanh tiến độ %
  const total = QUIZ_QUESTIONS.length;
  const currentNum = currentQuestionIndex + 1;
  const percent = Math.round((currentNum / total) * 100);

  const fillEl = document.getElementById('quizProgressFill');
  if (fillEl) {
    fillEl.style.setProperty('width', percent + '%', 'important');
  }

  // Cập nhật tiêu đề câu hỏi
  const titleEl = document.getElementById('quizQuestionTitle');
  if (titleEl) {
    titleEl.textContent = q.title;
  }

  // Cập nhật danh sách đáp án A, B, C
  const optionsContainer = document.getElementById('quizOptionsList');
  if (optionsContainer) {
    optionsContainer.innerHTML = '';
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-opt-btn';
      if (userAnswers[currentQuestionIndex] === opt.key) {
        btn.classList.add('selected');
      }
      btn.textContent = opt.text;
      btn.onclick = () => selectQuizOption(opt.key, btn);
      optionsContainer.appendChild(btn);
    });
  }

  // Nút quay lại câu trước
  const navRow = document.getElementById('quizNavRow');
  if (navRow) {
    navRow.style.display = currentQuestionIndex > 0 ? 'flex' : 'none';
  }
}

function selectQuizOption(key, btnElement) {
  const allBtns = document.querySelectorAll('.quiz-opt-btn');
  allBtns.forEach(b => b.classList.remove('selected'));
  if (btnElement) btnElement.classList.add('selected');

  userAnswers[currentQuestionIndex] = key;

  // Chuyển mượt sang câu tiếp theo sau 240ms
  setTimeout(() => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      currentQuestionIndex++;
      renderCurrentQuestion();
    } else {
      showQuizResult();
    }
  }, 240);
}

function prevQuizQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderCurrentQuestion();
  }
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

  // Phân định hòa: Ưu tiên đáp án của câu 1 (mối bận tâm cốt lõi)
  const q1 = answers[0];
  if (winners.includes(q1)) return q1;
  return winners[0];
}

function showQuizResult() {
  const winningKey = calculateQuizResult(userAnswers);
  const res = QUIZ_RESULTS[winningKey] || QUIZ_RESULTS.A;

  const qView = document.getElementById('quizQuestionView');
  const rView = document.getElementById('quizResultView');
  if (qView) qView.style.display = 'none';
  if (rView) rView.style.display = 'block';

  // Điền thông tin kết quả chính xác
  const pillEl = document.getElementById('quizResultPill');
  const traitEl = document.getElementById('quizResTrait');
  const adviceEl = document.getElementById('quizResAdvice');
  const exploreEl = document.getElementById('quizResExplore');
  const ctaEl = document.getElementById('quizResCta');

  if (pillEl) pillEl.textContent = res.title;
  if (traitEl) traitEl.textContent = res.trait;
  if (adviceEl) adviceEl.textContent = res.advice;
  if (exploreEl) exploreEl.textContent = res.explore;

  if (ctaEl) {
    ctaEl.textContent = res.ctaText;
    ctaEl.href = res.ctaLink;
  }

  // Cuộn nhẹ để kết quả hiển thị trọn vẹn trong tầm mắt
  const section = document.getElementById('comp-mvqu69vk') || document.getElementById('quizSectionContainer');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function restartQuiz() {
  currentQuestionIndex = 0;
  userAnswers = [];
  renderCurrentQuestion();
}

function openQuizModal() {
  const section = document.getElementById('comp-mvqu69vk') || document.getElementById('quizz');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  restartQuiz();
}

function closeQuizModal() {
  // Modal placeholder for backwards compatibility
}

// Global functions
window.initQuizSection = initQuizSection;
window.selectQuizOption = selectQuizOption;
window.prevQuizQuestion = prevQuizQuestion;
window.restartQuiz = restartQuiz;
window.openQuizModal = openQuizModal;
window.closeQuizModal = closeQuizModal;
