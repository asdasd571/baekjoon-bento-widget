# 🚀 Solved.ac High-End Profile Stats

📊 Display your solved.ac stats beautifully and dynamically in your GitHub README.
알고리즘 문제 풀이 사이트인 백준 온라인 저지(BOJ)의 통계를 제공하는 solved.ac의 공개 API를 기반으로, GitHub README용 하이엔드 동적 SVG 통계 카드를 생성하는 프로젝트입니다.

Inspired by [github-readme-stats](https://github.com/anuraghazra/github-readme-stats), powered by the [solved.ac API](https://solved.ac/).


![Preview](https://baekjoon-widget.vercel.app/api?name=skrrms063312&theme=ocean&lang=java)<br>
*(💡 위 이미지는 예시입니다. 배포 후 자신의 Vercel 도메인으로 주소를 변경해주세요!)*

---

## 📌 About This Project

`solvedac-high-end-stats` is a dynamic GitHub README card generator that fetches real-time data from solved.ac and renders it as an aesthetic SVG image. 
기존의 평범한 뱃지를 넘어, **Glassmorphism(유리 질감)**과 **Neon Glow(네온 발광)** 효과를 적용하여 개발자의 알고리즘 성취도를 한층 더 돋보이게 만듭니다.

### ✨ Key Features
* **🔥 Dynamic Progress Bar**: 다음 티어까지 남은 레이팅(Rating) 진행도를 원형 게이지로 직관적으로 보여줍니다.
* **🏷️ Language Badge**: 가장 많이 푼 주력 언어를 빛나는 캡슐 뱃지로 표시합니다. (수동 설정)
* **📏 Responsive Layout**: 닉네임이나 티어 이름이 길어져도 UI가 깨지지 않는 방어 로직(반응형 폰트 리사이징) 적용.
* **🕸️ Difficulty Radar Chart**: 해결한 문제들의 티어별(B, S, G, P, D, R) 비중을 분석하여, 사용자의 주력 난이도를 육각형 레이더 차트로 직관적으로 표시합니다.
---

## 🛠 Usage

Add this to your GitHub README:
Replace `{username}` with your solved.ac (BOJ) handle(ID).
아래와 같이 작성하며, `{username}`에 자신의 solved.ac 핸들(아이디)을 입력하여 사용하세요.

```md
[![My solved.ac stats](https://baekjoon-widget.vercel.app/api?name={username})](https://solved.ac/profile/{username})
```

### 🎛️ Parameters (옵션 설정)
URL 뒤에 `&`를 붙여서 다양한 커스텀 옵션을 조합할 수 있습니다.

| Parameter | Description | Default | Example |
| :--- | :--- | :--- | :--- |
| `name` | (Required) Your solved.ac handle | `-` | `name=skrrms063312` |
| `theme` | Color theme of the card | `midnight-neon` | `theme=dark` |
| `lang` | Manual override for main language | Unknown | `lang=java` |

* **Theme Options**: `midnight-neon`, `midnight`, `ocean`, `forest`, `sunset`, `dark`

#### 💡 Examples

**1. Using the 'dark' theme:**
```md
[![My solved.ac stats](https://baekjoon-widget.vercel.app/api?name={username}&theme=dark)](https://solved.ac/profile/{username})
```

**2. Forcing the main language to 'Java':**
```md
[![My solved.ac stats](https://baekjoon-widget.vercel.app/api?name={username}&lang=java)](https://solved.ac/profile/{username})
```

---

## 🚀 Deploy Your Own

본인만의 서버에 직접 배포하여 자유롭게 커스텀하고 싶다면 아래 단계를 따라주세요.

1. **Fork** this repository.
2. **Deploy to Vercel** (or any serverless platform you prefer).
3. Use your own endpoint in your README!

---

## 🧑‍💻 Development

이 프로젝트는 Vercel Serverless Functions(Node.js) 환경으로 구성되어 있습니다. Vercel CLI를 통해 로컬에서 쉽게 테스트할 수 있습니다.

```bash
# 1. Vercel CLI가 없다면 전역으로 설치합니다.
npm i -g vercel

# 2. 로컬 개발 서버를 실행합니다. (포트 4000번 지정)
vercel dev -p 4000
```

브라우저를 열고 `http://localhost:4000/api?name=your_id`에 접속하여 결과를 확인하세요.
`api/index.js` 파일을 수정하여 SVG 생성 로직을 자유롭게 편집할 수 있습니다. 코드를 수정하면 새로고침 시 즉시 반영됩니다.

---

## 📄 License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)**.

- **자유로운 사용 및 수정 가능**: 누구나 이 코드를 자유롭게 포크(Fork)하여 사용하고 수정할 수 있습니다.
- **상업적 이용 불가**: 이 프로젝트의 코드나 생성된 이미지를 영리 목적으로 사용할 수 없습니다.
- **저작자 표시**: 코드를 재배포하거나 수정할 경우 원본 출처를 명시해야 합니다.

자세한 내용은 [CC BY-NC 4.0 License](https://creativecommons.org/licenses/by-nc/4.0/deed.ko) 페이지를 참고해 주세요.
