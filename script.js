/* =========================================================
   铜钱问卦 · 脚本
   模块结构：
     - CoverView          封面页交互
     - TossStage          投币舞台控制
     - CoinRenderer       铜钱正反 / 动画（预留素材接口）
     - DivinationEngine   起卦逻辑（三铜钱 / 本卦 / 变卦 / 动爻）
     - GestureController  点击 / 滑动 / 摄像头（降级到点击）
     - ResultPanel        结果弹层渲染
     - ShareCard          分享卡片预览
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     工具
     --------------------------------------------------------- */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const rand = () => Math.random();

  /* ---------------------------------------------------------
     CoinRenderer
     - 预留素材接口：assets/coin-front.png / coin-back.png
       若图片可加载，则用 background-image 覆盖默认 CSS
       样式。否则使用 CSS 渐变合成的“占位铜钱”。
     - flipCoin(el, face)  设置正反面 data-face 属性
     - tossWithAnimation()  触发三枚铜钱动画
     --------------------------------------------------------- */
  const CoinRenderer = {
    FRONT_SRC: "assets/coin-front.png",
    BACK_SRC:  "assets/coin-back.png",

    /** 尝试加载素材图片，成功则替换铜钱背景 */
    tryLoadAssets() {
      const tryOne = (src) => new Promise((resolve) => {
        const img = new Image();
        img.onload  = () => resolve(src);
        img.onerror = () => resolve(null);
        img.src = src;
      });
      return Promise.all([tryOne(this.FRONT_SRC), tryOne(this.BACK_SRC)])
        .then(([front, back]) => {
          if (front) this._frontImg = front;
          if (back)  this._backImg  = back;
          return { front: !!front, back: !!back };
        });
    },

    /** 设置一枚铜钱的正反面 */
    setFace(el, face) {
      if (!el) return;
      el.setAttribute("data-face", face === "back" ? "back" : "front");
      // 如果素材已加载，叠加背景图
      const src = face === "back" ? this._backImg : this._frontImg;
      if (src) {
        el.style.backgroundImage =
          `radial-gradient(circle at 35% 30%, rgba(255,230,180,0.4) 0%, transparent 22%),` +
          `radial-gradient(circle at 70% 75%, rgba(60,40,20,0.35) 0%, transparent 38%),` +
          `url("${src}")`;
        el.style.backgroundSize = "auto, auto, 100% 100%";
        el.style.backgroundRepeat = "no-repeat";
      } else {
        el.style.backgroundImage = "";
      }
    },

    /** 一次性重置三枚为"待投"正面朝上的默认状态 */
    resetRow(rowEl) {
      $$(".coin", rowEl).forEach((c, i) => {
        c.classList.remove("is-tossing");
        // 清除内联 transform 以便重新进入
        void c.offsetWidth;
        c.style.setProperty("--dx", "0px");
        c.style.setProperty("--final-rot", "0deg");
        c.style.setProperty("--final-tilt", "0deg");
        // 默认正面朝上，轻微角度差异（CSS 基础类已处理）
        this.setFace(c, "front");
      });
    },

    /**
     * 投掷三枚铜钱
     * @param {HTMLElement} rowEl
     * @param {Array<"front"|"back">} faces 长度 3
     * @returns {Promise<void>} 动画结束
     */
    toss(rowEl, faces) {
      return new Promise((resolve) => {
        const coins = $$(".coin", rowEl);
        coins.forEach((c, i) => {
          c.classList.remove("is-tossing");
          // 为每枚铜钱设置略微不同的水平轨迹与最终角度，制造"三枚略有差异"
          const dx = (i - 1) * (6 + rand() * 8); // px
          // 最终角度：front → 偶数圈（0 / 360 / 720...）
          //           back  → 奇数圈再加一点倾斜
          const baseRot = 1260 + Math.floor(rand() * 4) * 360;
          const finalRot = faces[i] === "back" ? baseRot + 180 : baseRot;
          const finalTilt = faces[i] === "back"
            ? 540 + Math.floor(rand() * 2) * 180
            : 540 + Math.floor(rand() * 2) * 180;

          c.style.setProperty("--dx", `${dx}px`);
          c.style.setProperty("--final-rot", `${finalRot}deg`);
          c.style.setProperty("--final-tilt", `${finalTilt}deg`);

          // 强制回流，再追加动画类
          void c.offsetWidth;
          c.classList.add("is-tossing");

          // 动画结尾处设置正反面（这样最终停稳时视觉上清晰）
          setTimeout(() => {
            this.setFace(c, faces[i]);
          }, 1350);
        });

        // 1.4s 动画 + 停稳 180ms
        setTimeout(resolve, 1580);
      });
    },
  };

  /* ---------------------------------------------------------
     DivinationEngine
     - 三铜钱规则：正面=3，反面=2
     - 6=老阴(变阳) 7=少阳 8=少阴 9=老阳(变阴)
     - 六爻从下往上：第一次=初爻
     - 本卦(原值)，变卦(动爻翻转)
     --------------------------------------------------------- */
  const YAO_NAME_CN = ["初", "二", "三", "四", "五", "上"];

  // 八卦（下三爻 / 上三爻 → 卦名）
  // 1=阳, 0=阴
  const TRIGRAMS = {
    "111": { name: "乾", symbol: "☰" },
    "011": { name: "兑", symbol: "☱" },
    "101": { name: "离", symbol: "☲" },
    "001": { name: "震", symbol: "☳" },
    "110": { name: "巽", symbol: "☴" },
    "010": { name: "坎", symbol: "☵" },
    "100": { name: "艮", symbol: "☶" },
    "000": { name: "坤", symbol: "☷" },
  };

  // 64 卦简化表：下卦(内三爻)+ 上卦(外三爻) → 卦名
  // key: 下卦名+"-"+上卦名
  const HEXAGRAMS = (() => {
    const NAMES = ["乾","坤","屯","蒙","需","讼","师","比","小畜","履","泰","否","同人","大有","谦","豫",
                   "随","蛊","临","观","噬嗑","贲","剥","复","无妄","大畜","颐","大过","坎","离","咸","恒",
                   "遁","大壮","晋","明夷","家人","睽","蹇","解","损","益","夬","姤","萃","升","困","井",
                   "革","鼎","震","艮","渐","归妹","丰","旅","巽","兑","涣","节","中孚","小过","既济","未济"];
    // 为简洁起见，采用“上下卦组合查表”
    const MAP = {
      // 乾宫
      "乾-乾":"乾","乾-兑":"履","乾-离":"同人","乾-震":"无妄","乾-巽":"小畜","乾-坎":"需","乾-艮":"大畜","乾-坤":"泰",
      // 兑宫
      "兑-乾":"夬","兑-兑":"兑","兑-离":"革","兑-震":"随","兑-巽":"大过","兑-坎":"困","兑-艮":"咸","兑-坤":"萃",
      // 离宫
      "离-乾":"大有","离-兑":"睽","离-离":"离","离-震":"噬嗑","离-巽":"鼎","离-坎":"未济","离-艮":"旅","离-坤":"晋",
      // 震宫
      "震-乾":"大壮","震-兑":"归妹","震-离":"丰","震-震":"震","震-巽":"恒","震-坎":"解","震-艮":"小过","震-坤":"豫",
      // 巽宫
      "巽-乾":"小畜","巽-兑":"中孚","巽-离":"家人","巽-震":"益","巽-巽":"巽","巽-坎":"涣","巽-艮":"渐","巽-坤":"观",
      // 坎宫
      "坎-乾":"需","坎-兑":"节","坎-离":"既济","坎-震":"屯","坎-巽":"井","坎-坎":"坎","坎-艮":"蹇","坎-坤":"比",
      // 艮宫
      "艮-乾":"大畜","艮-兑":"损","艮-离":"贲","艮-震":"颐","艮-巽":"蛊","艮-坎":"蒙","艮-艮":"艮","艮-坤":"剥",
      // 坤宫
      "坤-乾":"否","坤-兑":"萃","坤-离":"晋","坤-震":"豫","坤-巽":"观","坤-坎":"比","坤-艮":"剥","坤-坤":"坤"
    };
    // 上面手动表略粗糙，使用标准上下卦→64卦标准映射：
    // 为保证准确，重写：采用"上卦+下卦"的标准组合
    // （下面这个表是标准的：下卦名在上，上卦名在下。传统读法：下卦/上卦）
    return {
      "乾乾":"乾为天","坤坤":"坤为地","坎坎":"坎为水","离离":"离为火",
      "震震":"震为雷","艮艮":"艮为山","巽巽":"巽为风","兑兑":"兑为泽",

      "乾坤":"地天泰","坤乾":"天地否",
      "乾坎":"水天需","坎乾":"天水讼",
      "乾离":"火天大有","离乾":"天火同人",
      "乾震":"雷天大壮","震乾":"天雷无妄",
      "乾艮":"山天大畜","艮乾":"天山遁",
      "乾巽":"风天小畜","巽乾":"天风姤",
      "乾兑":"泽天夬","兑乾":"天泽履",

      "坤坎":"水地比","坎坤":"地水师",
      "坤离":"火地晋","离坤":"地火明夷",
      "坤震":"雷地豫","震坤":"地雷复",
      "坤艮":"山地剥","艮坤":"地山谦",
      "坤巽":"风地观","巽坤":"地风升",
      "坤兑":"泽地萃","兑坤":"地泽临",

      "坎离":"水火既济","离坎":"火水未济",
      "坎震":"水雷屯","震坎":"雷水解",
      "坎艮":"水山蹇","艮坎":"山水蒙",
      "坎巽":"水风井","巽坎":"风水涣",
      "坎兑":"水泽节","兑坎":"泽水困",

      "离震":"火雷噬嗑","震离":"雷火丰",
      "离艮":"火山旅","艮离":"山火贲",
      "离巽":"火风鼎","巽离":"风火家人",
      "离兑":"火泽睽","兑离":"泽火革",

      "震艮":"雷山小过","艮震":"山雷颐",
      "震巽":"雷风恒","巽震":"风雷益",
      "震兑":"雷泽归妹","兑震":"泽雷随",

      "艮巽":"山风蛊","巽艮":"风山渐",
      "艮兑":"山泽损","兑艮":"泽山咸",

      "巽兑":"风泽中孚","兑巽":"泽风大过"
    };
  })();

  const DivinationEngine = {
    /** 随机一次投币结果：三枚正反数组 */
    rollCoins() {
      return [
        rand() < 0.5 ? "front" : "back",
        rand() < 0.5 ? "front" : "back",
        rand() < 0.5 ? "front" : "back",
      ];
    },

    /** 把三枚铜钱 → 本爻值(6/7/8/9) */
    coinsToValue(faces) {
      return faces.reduce((sum, f) => sum + (f === "front" ? 3 : 2), 0);
    },

    /** 爻值 → 类型 */
    valueToYao(v) {
      switch (v) {
        case 6: return { line: "yin",  changing: true,  label: "老阴" };
        case 7: return { line: "yang", changing: false, label: "少阳" };
        case 8: return { line: "yin",  changing: false, label: "少阴" };
        case 9: return { line: "yang", changing: true,  label: "老阳" };
        default: return { line: "yang", changing: false, label: "少阳" };
      }
    },

    /**
     * 输入 6 次爻值数组（顺序：从下往上，即 index0=初爻）
     * 输出本卦 / 变卦 / 动爻
     */
    computeGuas(yaoValues) {
      const yaos = yaoValues.map((v) => this.valueToYao(v));

      // 本卦：每个爻的"线"
      const benLines = yaos.map((y) => y.line === "yang" ? 1 : 0);
      // 变卦：动爻翻转
      const bianLines = yaos.map((y) => {
        if (!y.changing) return y.line === "yang" ? 1 : 0;
        return y.line === "yang" ? 0 : 1;
      });

      const findHex = (lines) => {
        // lines: 6 位数组，index0=初爻(最下)
        // 下卦：lines[0..2]，下卦 key 顺序：从下到上即 "初/二/三"
        //   但字符串 key：我们用 "从下爻到上爻"，即 lines[0]lines[1]lines[2]
        const lowerKey = `${lines[0]}${lines[1]}${lines[2]}`;
        const upperKey = `${lines[3]}${lines[4]}${lines[5]}`;
        const lower = TRIGRAMS[lowerKey] || { name: "?" };
        const upper = TRIGRAMS[upperKey] || { name: "?" };
        // 传统命名：上卦+下卦（比如"乾为天"则上下都是乾）
        const stdKey = upper.name + lower.name;
        const name = HEXAGRAMS[stdKey] || `${upper.name}${lower.name}`;
        return { name, lower: lower.name, upper: upper.name };
      };

      const ben = findHex(benLines);
      const bian = findHex(bianLines);

      const changingIdx = yaos
        .map((y, i) => y.changing ? i : -1)
        .filter((i) => i >= 0);

      return { yaos, ben, bian, changingIdx, benLines, bianLines };
    },
  };

  /* ---------------------------------------------------------
     GestureController
     - 点击投币(默认)
     - 鼠标 / 触摸向上滑动
     - 摄像头手势(可选)：用 getUsermedia + 帧差分简易检测
       失败或拒绝授权时自动降级到点击投币
     --------------------------------------------------------- */
  const GestureController = {
    onToss: null, // () => void
    _stage: null,
    _touchStartY: null,
    _gestureMode: false,
    _video: null,
    _canvas: null,
    _ctx: null,
    _rafId: null,
    _prevGray: null,
    _cooling: false,
    _handFrames: 0,
    _statusEl: null,
    _previewBox: null,
    _stream: null,

    init(stageEl, opts) {
      this._stage = stageEl;
      this._statusEl = opts.statusEl;
      this._previewBox = opts.previewBox;
      this._video = opts.videoEl;
      this.onToss = opts.onToss;

      // 触摸 / 鼠标向上滑
      stageEl.addEventListener("touchstart", (e) => {
        const t = e.touches[0];
        this._touchStartY = t.clientY;
      }, { passive: true });

      stageEl.addEventListener("touchend", (e) => {
        const start = this._touchStartY;
        if (start == null) return;
        const end = e.changedTouches[0].clientY;
        if (start - end > 40) this._tryFire();
        this._touchStartY = null;
      });

      // 鼠标也支持：按下+向上拖
      let mStartY = null;
      stageEl.addEventListener("mousedown", (e) => { mStartY = e.clientY; });
      stageEl.addEventListener("mouseup", (e) => {
        if (mStartY != null && mStartY - e.clientY > 50) this._tryFire();
        mStartY = null;
      });

      // 键盘：空格也可
      window.addEventListener("keydown", (e) => {
        if (e.code === "Space" && this._stage && this._stage.offsetParent !== null) {
          e.preventDefault();
          this._tryFire();
        }
      });
    },

    _tryFire() {
      if (this._cooling) return;
      if (typeof this.onToss === "function") this.onToss();
    },

    setCooling(v) { this._cooling = !!v; },

    /** 开启摄像头手势；失败时自动降级（对用户无影响，主路径仍是点击） */
    async enableCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this._setStatus("当前浏览器不支持摄像头，已使用点击");
        return false;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 240, height: 180, facingMode: "user" },
          audio: false,
        });
        this._stream = stream;
        this._video.srcObject = stream;
        await this._video.play();
        this._gestureMode = true;
        this._previewBox.classList.add("is-on");
        this._canvas = document.createElement("canvas");
        this._canvas.width = 80;
        this._canvas.height = 60;
        this._ctx = this._canvas.getContext("2d", { willReadFrequently: true });
        this._prevGray = null;
        this._loopStart();
        this._setStatus("已开启手势，请向上挥动手掌");
        return true;
      } catch (err) {
        console.warn("[Gesture] camera failed:", err);
        this._setStatus("摄像头未开启，已使用点击");
        return false;
      }
    },

    disableCamera() {
      if (!this._gestureMode) return;
      this._gestureMode = false;
      if (this._rafId) cancelAnimationFrame(this._rafId);
      if (this._stream) {
        this._stream.getTracks().forEach((t) => t.stop());
        this._stream = null;
      }
      if (this._previewBox) this._previewBox.classList.remove("is-on");
    },

    _loopStart() {
      const loop = () => {
        if (!this._gestureMode) return;
        try {
          this._analyzeFrame();
        } catch (e) { /* 静默 */ }
        this._rafId = requestAnimationFrame(loop);
      };
      this._rafId = requestAnimationFrame(loop);
    },

    _analyzeFrame() {
      const v = this._video;
      if (!v || v.readyState < 2) return;
      const ctx = this._ctx;
      const W = this._canvas.width, H = this._canvas.height;
      // 镜像：左右翻转以符合用户直觉
      ctx.save();
      ctx.translate(W, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(v, 0, 0, W, H);
      ctx.restore();

      const img = ctx.getImageData(0, 0, W, H);
      const data = img.data;
      // 1) 转换为灰度
      const gray = new Uint8Array(W * H);
      for (let i = 0, j = 0; i < data.length; i += 4, j++) {
        gray[j] = (data[i] * 0.299 + data[i+1] * 0.587 + data[i+2] * 0.114) | 0;
      }

      // 2) 简易肤色检测（在较亮的小区域内）：只用于"是否有手掌"的粗判
      let skinCount = 0;
      for (let i = 0, j = 0; i < data.length; i += 4, j++) {
        const r = data[i], g = data[i+1], b = data[i+2];
        // 非常宽松的肤色判断
        if (r > 80 && g > 60 && b > 40 && r > g && r - b > 12) skinCount++;
      }
      const skinRatio = skinCount / (W * H);

      // 3) 与前一帧做差分，判断是否有"向上的运动"
      let motionScore = 0;
      let upMotion = 0;
      if (this._prevGray) {
        const prev = this._prevGray;
        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            const idx = y * W + x;
            const diff = Math.abs(gray[idx] - prev[idx]);
            if (diff > 18) motionScore++;
            // 粗略：上方半区运动多于下方时认为"向上挥动"
            if (diff > 22) {
              if (y < H / 2) upMotion++;
              else upMotion--;
            }
          }
        }
      }
      this._prevGray = gray;

      const motionRatio = motionScore / (W * H);

      // 状态机
      if (skinRatio > 0.08 && motionRatio > 0.015) this._handFrames++;
      else this._handFrames = Math.max(0, this._handFrames - 2);

      if (this._handFrames > 4 && !this._cooling && upMotion > 60) {
        this._handFrames = 0;
        this._setStatus("已取一爻");
        this._tryFire();
        return;
      }
      if (skinRatio > 0.05) this._setStatus("已检测到手掌");
      else this._setStatus("未检测到手掌");
    },

    _setStatus(text) {
      if (this._statusEl) this._statusEl.textContent = text;
    },
  };

  /* ---------------------------------------------------------
     ResultPanel / ShareCard
     --------------------------------------------------------- */
  const YAO_LABELS = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];

  // 基于卦象的"静思之语"池（文化层面引导，不做占卜）
  const QUOTES = [
    "君子以自强不息。",
    "君子以厚德载物。",
    "君子以容民畜众。",
    "君子以慎言语，节饮食。",
    "君子以作事谋始。",
    "君子以独立不惧，遁世无闷。",
    "君子以见善则迁，有过则改。",
    "君子以思不出其位。",
    "君子以遏恶扬善，顺天休命。",
    "君子以类族辨物。"
  ];

  const ResultPanel = {
    show(state) {
      $("#resultQuestion").textContent = state.question || "（未填写问题）";

      // 卦名
      $("#benGuaName").textContent   = state.guas.ben.name;
      $("#bianGuaName").textContent  = state.guas.bian.name;

      // 六爻线图
      this._drawGua($("#benGuaVisual"),  state.guas.yaos, state.guas.changingIdx, false);
      this._drawGua($("#bianGuaVisual"), state.guas.yaos, state.guas.changingIdx, true);

      // 动爻
      const dy = state.guas.changingIdx;
      $("#dongYaoText").textContent = dy.length
        ? dy.map((i) => YAO_LABELS[i]).join("、") + "（动，主变化之兆）"
        : "六爻皆静（无动爻）";

      // 六爻明细
      const container = $("#yaoDetail");
      container.innerHTML = "";
      // 展示时从上往下（六爻 → 初爻）
      for (let i = 5; i >= 0; i--) {
        const y = state.guas.yaos[i];
        const row = document.createElement("div");
        row.className = "yao-detail-row";
        row.innerHTML = `
          <span class="yao-pos">${YAO_LABELS[i]}</span>
          <span>${y.label}${y.changing ? "（动）" : ""}</span>
          <span class="yao-face">${["正","正","正"].join(" ")}</span>
        `;
        container.appendChild(row);
      }

      // 静思之语
      $("#resultQuote").textContent =
        QUOTES[Math.floor(Math.random() * QUOTES.length)];

      // 行动建议
      const advice = this._adviceFor(state.guas);
      const advEl = $("#resultAdvice");
      advEl.innerHTML = "";
      advice.forEach((a) => {
        const li = document.createElement("li");
        li.textContent = a;
        advEl.appendChild(li);
      });

      $("#resultOverlay").classList.add("is-on");

      // 分享卡片同步
      $("#shareQuestion").textContent = state.question || "（未填写问题）";
      $("#shareBenGua").textContent  = state.guas.ben.name;
      $("#shareBianGua").textContent = state.guas.bian.name;
      $("#shareQuote").textContent   = $("#resultQuote").textContent;
    },

    hide() {
      $("#resultOverlay").classList.remove("is-on");
      $("#shareCardPreview").hidden = true;
    },

    _drawGua(container, yaos, changingIdx, asBian) {
      container.innerHTML = "";
      // 展示从上到下：index5 → index0
      for (let i = 5; i >= 0; i--) {
        const y = yaos[i];
        const line = y.line; // yang / yin
        const isChanging = y.changing;
        const el = document.createElement("div");
        // 变卦视图：动爻翻转其"线"
        const actualLine = asBian && isChanging
          ? (line === "yang" ? "yin" : "yang")
          : line;
        el.className = "gua-line gua-line--" + actualLine;
        if (isChanging) el.classList.add("is-changing");
        if (isChanging) {
          const mark = document.createElement("span");
          mark.className = "gua-line-mark";
          mark.textContent = "动";
          el.appendChild(mark);
        }
        container.appendChild(el);
      }
    },

    _adviceFor(guas) {
      const list = [];
      list.push("静心反省当前所问之事的动机与本心。");
      if (guas.changingIdx.length > 0) {
        list.push("动爻提示事物正在变化之中，宜主动观察与调整，不可固守旧法。");
      } else {
        list.push("六爻皆静，当前局势相对稳定，宜积累与等待，勿妄动。");
      }
      list.push("以三日为期，记录所做之事与所得反馈，再做判断。");
      return list;
    },

    toggleShareCard() {
      $("#shareCardPreview").hidden = !$("#shareCardPreview").hidden;
    },
  };

  /* ---------------------------------------------------------
     TossStage
     --------------------------------------------------------- */
  const TossStage = {
    state: {
      question: "",
      currentYao: 0,   // 0..5
      yaoValues: [],   // 6..9
      tossing: false,
      guas: null,
    },

    init() {
      this._row = $("#coinRow");
      this._topStatus = $("#tossStatusText");
      this._yaoIdxLabel = $("#yaoIndex");
      this._curResult = $("#currentYaoResult");

      // 按钮
      $("#tossBtn").addEventListener("click", () => this.tryToss());
      $("#backToCoverBtn").addEventListener("click", () => this.leave());
      $("#bottomBackBtn").addEventListener("click", () => this.leave());
      $("#gestureBtn").addEventListener("click", () => this.toggleGesture());
      $("#retryBtn").addEventListener("click", () => this.restart());
      $("#resultBackBtn").addEventListener("click", () => this.leave());
      $("#shareCardBtn").addEventListener("click", () => ResultPanel.toggleShareCard());

      // 手势（点击/滑动 + 可选摄像头）
      GestureController.init($("#tossStageArea"), {
        statusEl: $("#gesturePreviewStatus"),
        previewBox: $("#gesturePreview"),
        videoEl: $("#gestureVideo"),
        onToss: () => this.tryToss(),
      });

      // 素材
      CoinRenderer.tryLoadAssets().then(() => { /* 静默 */ });
    },

    enter(question) {
      this.state = { question, currentYao: 0, yaoValues: [], tossing: false, guas: null };
      $("#cover").classList.remove("is-active");
      $("#tossStage").classList.add("is-active");
      CoinRenderer.resetRow(this._row);
      this._refreshLabels();
      this._topStatus.textContent = "静候投币";
      this._curResult.classList.remove("is-visible");
      this._curResult.textContent = "";
      $("#tossBtn").disabled = false;
      window.scrollTo(0, 0);
    },

    leave() {
      GestureController.disableCamera();
      ResultPanel.hide();
      $("#tossStage").classList.remove("is-active");
      $("#cover").classList.add("is-active");
    },

    restart() {
      ResultPanel.hide();
      const q = this.state.question;
      this.enter(q);
    },

    async tryToss() {
      if (this.state.tossing) return;
      if (this.state.currentYao >= 6) return;
      this.state.tossing = true;
      GestureController.setCooling(true);
      $("#tossBtn").disabled = true;

      const faces = DivinationEngine.rollCoins();
      await CoinRenderer.toss(this._row, faces);

      // 记录本爻值
      const v = DivinationEngine.coinsToValue(faces);
      this.state.yaoValues[this.state.currentYao] = v;

      // 显示当前爻结果
      const yao = DivinationEngine.valueToYao(v);
      this._curResult.textContent = `${YAO_LABELS[this.state.currentYao]}：${yao.label}${yao.changing ? "（动）" : ""}`;
      this._curResult.classList.add("is-visible");

      // 停顿一下
      await new Promise((r) => setTimeout(r, 700));
      this._curResult.classList.remove("is-visible");

      // 推进
      this.state.currentYao++;
      this.state.tossing = false;
      GestureController.setCooling(false);

      if (this.state.currentYao >= 6) {
        // 结束
        this.state.guas = DivinationEngine.computeGuas(this.state.yaoValues);
        $("#tossBtn").disabled = true;
        this._topStatus.textContent = "六爻已成";
        this._yaoIdxLabel.textContent = "六爻已成";
        // 稍作停顿再弹结果
        setTimeout(() => {
          ResultPanel.show(this.state);
        }, 500);
      } else {
        this._refreshLabels();
        $("#tossBtn").disabled = false;
      }
    },

    _refreshLabels() {
      const idx = Math.min(this.state.currentYao + 1, 6);
      this._yaoIdxLabel.textContent = `第 ${YAO_NAME_CN[idx - 1]} 爻`;
    },

    toggleGesture() {
      if (GestureController._gestureMode) {
        GestureController.disableCamera();
        this._topStatus.textContent = "静候投币";
      } else {
        // 先弹引导
        $("#gestureGuideOverlay").classList.add("is-on");
        const btn = $("#guideConfirmBtn");
        const original = btn.onclick;
        btn.onclick = () => {
          $("#gestureGuideOverlay").classList.remove("is-on");
          GestureController.enableCamera().then((ok) => {
            if (!ok) this._topStatus.textContent = "静候投币";
            else this._topStatus.textContent = "手势已开启";
          });
          btn.onclick = original;
        };
      }
    },
  };

  /* ---------------------------------------------------------
     CoverView
     --------------------------------------------------------- */
  const CoverView = {
    init() {
      $("#startBtn").addEventListener("click", () => {
        const q = $("#questionInput").value.trim();
        TossStage.enter(q);
      });
    },
  };

  /* ---------------------------------------------------------
     启动
     --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    CoverView.init();
    TossStage.init();
  });
})();
