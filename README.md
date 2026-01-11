# 🚀 Dev-Share | 極簡雲端代碼分享平台

Dev-Share 是一個專為開發者打造的即時代碼分享工具。整合了高效的編輯體驗、雲端儲存與權限控管，讓代碼分享變得簡單而專業。


## ✨ 核心功能

* **專業編輯體驗**：採用 **Monaco Editor** (VS Code 核心)，支援代碼高亮、自動補全。
* **雲端同步 (Cloud Sync)**：整合 **Firebase Firestore**，一鍵上傳並生成永久分享連結。
* **智能語言偵測**：自動識別 Java, JavaScript, Python, Typescript, C++, C#, Go, Rust 等多種現代語言。
* **等級與額度系統**：
    * **Guest (訪客)**：可儲存 5 篇，單篇上限 500 字。
    * **Member (登入用戶)**：可儲存 30 篇，單篇上限 5,000 字。
    * **Premium (高級會員)**：可儲存 100 篇，單篇上限 100,000 字。
* **極致 UI/UX**：具備 Glassmorphism 玻璃質感、流暢的頁面轉場動畫及 Toast 通知系統。


## 🛠 技術工具

* **Framework**: [React](https://reactjs.org/)
* **Bundler**: [Vite](https://vitejs.dev/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Database & Auth**: [Firebase](https://firebase.google.com/)
* **Animation**: [Framer Motion](https://www.framer.com/motion/)
* **Editor**: [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)


## 🔐 安全機制

本專案在安全架構上做了嚴謹的配置：
* **後端規則驗證**：透過 Firebase Security Rules 在伺服器端強制執行字數與權限檢查，防止惡意繞過前端限制。
* **API 網域鎖定**：API Key 已設定網域限制，僅允許來自指定的 GitHub Pages 網域呼叫。
* **環境變數注入**：所有敏感金鑰透過 GitHub Actions Secrets 動態注入，確保原始碼安全。
* **連結生成**：使用`base58 + CRC32`生成一個可自我檢查的ID。


## 🚀 快速開始

### 本地開發環境
1. 克隆專案：
    ```bash
    git clone https://github.com/alan1455/Dev-Share.git
    ```
2. 安裝依賴：
    ```bash
    npm install
    ```
3. 設定環境變數： 在根目錄建立 `.env` 並填入你的 Firebase 配置 (變數需以 VITE_ 開頭)。
    ```env
    VITE_FIREBASE_API_KEY=
    VITE_FIREBASE_AUTH_DOMAIN=
    VITE_FIREBASE_PROJECT_ID=
    VITE_FIREBASE_STORAGE_BUCKET=
    VITE_FIREBASE_MESSAGING_SENDER_ID=
    VITE_FIREBASE_APP_ID=
    VITE_FIREBASE_MEASUREMENT_ID=
    ```
4. 啟動開發伺服器：
    ```bash
    npm run dev
    ```


## 📄 授權

本專案採用 [MIT License]()。


---
Developed with ❤️ by [Alan1455](https://github.com/Alan1455/)

