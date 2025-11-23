// ========================
// HTML要素を取得
// ========================
const titleScreen = document.getElementById("title-screen");
const gameScreen = document.getElementById("game-screen");

const startBtn = document.getElementById("start-btn");
const micBtn = document.getElementById("mic-btn");

const playerHandText = document.getElementById("player-hand");
const enemyHandText = document.getElementById("enemy-hand");
const resultText = document.getElementById("result");
const listeningStatus = document.getElementById("listening-status");

// カウント用の要素
const countWinText = document.getElementById("count-win");
const countLoseText = document.getElementById("count-lose");
const countDrawText = document.getElementById("count-draw");
const countTotalText = document.getElementById("count-total");

// ========================
// 画面切替
// ========================
startBtn.addEventListener("click", () => {
    titleScreen.classList.remove("active");
    gameScreen.classList.add("active");
});

// ========================
// じゃんけんロジック
// ========================
const hands = ["グー", "チョキ", "パー"];

function getEnemyHand() {
    return hands[Math.floor(Math.random() * 3)];
}

function judge(player, enemy) {
    if (player === enemy) return "draw";

    if (
        (player === "グー" && enemy === "チョキ") ||
        (player === "チョキ" && enemy === "パー") ||
        (player === "パー" && enemy === "グー")
    ) {
        return "win";
    }
    return "lose";
}

// ========================
// カウント（勝ち/負け/あいこ/合計）
// ========================
let countWin = 0;
let countLose = 0;
let countDraw = 0;
let countTotal = 0;

// ========================
// 音声認識
// ========================
const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = "ja-JP";

// マイク開始
micBtn.addEventListener("click", () => {
    listeningStatus.style.display = "inline-block";
    recognition.start();
});

// 音声認識されたら呼ばれる
recognition.onresult = (event) => {
    // 認識中表示を消す
    listeningStatus.style.display = "none";

    // 音声→テキスト
    const text = event.results[0][0].transcript;

    // テキスト→手に変換
    const playerHand = toHand(text);
    playerHandText.textContent = playerHand;

    // 敵の手
    const enemy = getEnemyHand();
    enemyHandText.textContent = enemy;

    // 判定
    const result = judge(playerHand, enemy);

    // 結果バッジの見た目をリセット
    resultText.className = "result-badge";

    // 勝敗に応じて結果テキスト & カウント加算
    if (result === "win") {
        resultText.textContent = "勝ち！";
        resultText.classList.add("result-win");
        countWin++;
    } else if (result === "lose") {
        resultText.textContent = "負け…";
        resultText.classList.add("result-lose");
        countLose++;
    } else {
        resultText.textContent = "あいこ";
        resultText.classList.add("result-draw");
        countDraw++;
    }

    // 総プレイ数も＋1
    countTotal++;

    // 画面に反映
    countWinText.textContent = countWin;
    countLoseText.textContent = countLose;
    countDrawText.textContent = countDraw;
    countTotalText.textContent = countTotal;
};

// 音声文字→手に変換
function toHand(text) {
    if (text.includes("グー") || text.includes("ぐー")) return "グー";
    if (text.includes("チョキ") || text.includes("ちょき")) return "チョキ";
    if (text.includes("パー") || text.includes("ぱー")) return "パー";
    return "グー";
}
