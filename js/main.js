(function () {
  // const LIFF_ID = "2008805180-dNJmIam4";
  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzMba9G0NZqElH9_YGg9Ac3_ynJWqI7ybEImElFjGTk91VsJEptCpvMZLnxd_CTNTGHfw/exec";
  const SHARED_SECRET = "petContractSystem_chunjipet_2026";

  // 乙方指定動物醫院
  const STORE_VET = {
    name: "弘吉獸醫院",
    phone: "(02)2741-0958",
    address: "106 臺北市大安區誠安里市民大道三段238號",
  };

  const canvas = document.getElementById("sig");
  const clearBtn = document.getElementById("clear");
  const submitBtn = document.getElementById("submit");
  const msg = document.getElementById("msg");
  const agree = document.getElementById("agree");

  const ownerName = document.getElementById("ownerName");
  const ownerIdNo = document.getElementById("ownerIdNo");
  const ownerPhone = document.getElementById("ownerPhone");
  const ownerEmail = document.getElementById("ownerEmail");
  const ownerAddress = document.getElementById("ownerAddress");

  const emergencyName = document.getElementById("emergencyName");
  const emergencyPhone = document.getElementById("emergencyPhone");

  const ownerRelationWrap = document.getElementById("ownerRelationWrap");
  const ownerRelation = document.getElementById("ownerRelation");

  const petName = document.getElementById("petName");
  const petBreed = document.getElementById("petBreed");
  const petAge = document.getElementById("petAge");
  const petBirthday = document.getElementById("petBirthday");
  const petWeight = document.getElementById("petWeight");
  const signDate = document.getElementById("signDate");

  const chipNoWrap = document.getElementById("chipNoWrap");
  const chipNo = document.getElementById("chipNo");
  const chipIdentifyWrap = document.getElementById("chipIdentifyWrap");
  const chipIdentifyInfo = document.getElementById("chipIdentifyInfo");

  const allergyDetailWrap = document.getElementById("allergyDetailWrap");
  const allergyDetail = document.getElementById("allergyDetail");

  const medicalNote = document.getElementById("medicalNote");

  const ptBoxes = Array.from(document.querySelectorAll(".pt"));
  const petTemperamentNote = document.getElementById("petTemperamentNote");

  const mhNone = document.getElementById("mh_none");
  const mhBoxes = Array.from(document.querySelectorAll(".mh"));

  const otherInjury = document.getElementById("otherInjury");
  const otherWrap = document.getElementById("otherInjuryWrap");
  const otherText = document.getElementById("otherInjuryText");

  const vetDetailWrap = document.getElementById("vetDetailWrap");
  const vetPresetBox = document.getElementById("vetPresetBox");
  const vetName = document.getElementById("vetName");
  const vetPhone = document.getElementById("vetPhone");
  const vetAddress = document.getElementById("vetAddress");

  const ctx = canvas.getContext("2d");
  canvas.style.touchAction = "none";

  function resetSubmit() {
    submitBtn.disabled = false;
    submitBtn.textContent = "送出簽名";
  }
  function setError(t) {
    msg.textContent = t || "";
  }
  function setOK(t) {
    msg.textContent = t || "";
  }

  function markFieldError(inputEl) {
    if (!inputEl) return;
    inputEl.classList.remove("field-error");
    void inputEl.offsetWidth;
    inputEl.classList.add("field-error");
    inputEl.addEventListener(
      "input",
      () => {
        inputEl.classList.remove("field-error");
      },
      { once: true },
    );
  }

  function requireValue(inputEl, label) {
    if (!inputEl) {
      setError(`系統缺少欄位：${label}（請聯絡店家）`);
      resetSubmit();
      return null;
    }
    const v = (inputEl.value || "").trim();
    if (!v) {
      setError(`請填寫：${label}`);
      markFieldError(inputEl);
      inputEl.focus();
      resetSubmit();
      return null;
    }
    return v;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function parseDateString(v) {
    const m = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/.exec(v);
    if (!m) return null;
    const y = Number(m[1]);
    const mm = Number(m[2]);
    const d = Number(m[3]);
    const dt = new Date(y, mm - 1, d);
    if (
      dt.getFullYear() !== y ||
      dt.getMonth() !== mm - 1 ||
      dt.getDate() !== d
    )
      return null;
    return dt;
  }

  function isValidDateString(v) {
    return !!parseDateString(v);
  }

  function isValidWeight(v) {
    return /^\d+(\.\d+)?$/.test(v);
  }

  function todayZh() {
    const d = new Date();
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const dd = d.getDate();
    return `${y}年${m}月${dd}日`;
  }
  if (signDate) signDate.value = todayZh();

  function formatYMD(v) {
    const digits = String(v || "")
      .replace(/\D/g, "")
      .slice(0, 8);
    const y = digits.slice(0, 4);
    const m = digits.slice(4, 6);
    const d = digits.slice(6, 8);
    let out = y;
    if (m) out += "/" + m;
    if (d) out += "/" + d;
    return out;
  }

  function calcPetAgeText(birthdayStr) {
    const birth = parseDateString(birthdayStr);
    if (!birth) return "";

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const thisYearBirthday = new Date(
      today.getFullYear(),
      birth.getMonth(),
      birth.getDate(),
    );

    if (today < thisYearBirthday) {
      age--;
    }

    if (age < 0) return "";
    return `${age}歲`;
  }

  function updatePetAgeByBirthday() {
    if (!petBirthday || !petAge) return;
    const value = (petBirthday.value || "").trim();
    petAge.value = isValidDateString(value) ? calcPetAgeText(value) : "";
  }

  if (petBirthday) {
    petBirthday.addEventListener("input", (e) => {
      const start = e.target.selectionStart || 0;
      const before = e.target.value;
      e.target.value = formatYMD(e.target.value);
      if (before.length < e.target.value.length) {
        e.target.setSelectionRange(start + 1, start + 1);
      }
      updatePetAgeByBirthday();
    });

    petBirthday.addEventListener("blur", updatePetAgeByBirthday);
  }

  function getRadio(name) {
    return document.querySelector(`input[name="${name}"]:checked`)?.value || "";
  }

  function setHidden(el, hidden) {
    if (!el) return;
    el.classList.toggle("hidden", !!hidden);
  }

  function refreshOtherInjury() {
    if (!otherInjury || !otherWrap) return;
    const show = !!otherInjury.checked;
    otherWrap.style.display = show ? "block" : "none";
    if (!show && otherText) otherText.value = "";
  }
  if (otherInjury) {
    otherInjury.addEventListener("change", refreshOtherInjury);
    refreshOtherInjury();
  }

  function refreshOwnerRelation() {
    const v = getRadio("isOwnerSelf");
    const notSelf = v === "否";
    setHidden(ownerRelationWrap, !notSelf);
    if (!notSelf && ownerRelation) ownerRelation.value = "";
  }
  document
    .querySelectorAll('input[name="isOwnerSelf"]')
    .forEach((r) => r.addEventListener("change", refreshOwnerRelation));
  refreshOwnerRelation();

  function refreshChip() {
    const has = getRadio("chipHas");
    const showChipNo = has === "有";
    const showIdentify = has === "無";

    setHidden(chipNoWrap, !showChipNo);
    setHidden(chipIdentifyWrap, !showIdentify);

    if (!showChipNo && chipNo) chipNo.value = "";
    if (!showIdentify && chipIdentifyInfo) chipIdentifyInfo.value = "";
  }
  document
    .querySelectorAll('input[name="chipHas"]')
    .forEach((r) => r.addEventListener("change", refreshChip));
  refreshChip();

  function refreshAllergy() {
    const v = getRadio("foodAllergy");
    const show = v === "有";
    setHidden(allergyDetailWrap, !show);
    if (!show && allergyDetail) allergyDetail.value = "";
  }
  document
    .querySelectorAll('input[name="foodAllergy"]')
    .forEach((r) => r.addEventListener("change", refreshAllergy));
  refreshAllergy();

  function refreshVet() {
    const mode = getRadio("vetMode");
    const isStore = mode === "乙方指定";

    setHidden(vetDetailWrap, isStore);
    setHidden(vetPresetBox, !isStore);

    if (isStore) {
      if (vetName) vetName.value = STORE_VET.name;
      if (vetPhone) vetPhone.value = STORE_VET.phone;
      if (vetAddress) vetAddress.value = STORE_VET.address;
    } else {
      if (vetName) vetName.value = "";
      if (vetPhone) vetPhone.value = "";
      if (vetAddress) vetAddress.value = "";
    }
  }
  document
    .querySelectorAll('input[name="vetMode"]')
    .forEach((r) => r.addEventListener("change", refreshVet));
  refreshVet();

  function enforceMedicalExclusive() {
    if (mhNone && mhNone.checked) {
      mhBoxes.forEach((b) => (b.checked = false));
      if (otherInjury) otherInjury.checked = false;
      refreshOtherInjury();
    } else {
      const anyOther =
        mhBoxes.some((b) => b.checked) || (otherInjury && otherInjury.checked);
      if (anyOther && mhNone) mhNone.checked = false;
    }
  }
  if (mhNone) mhNone.addEventListener("change", enforceMedicalExclusive);
  mhBoxes.forEach((b) => b.addEventListener("change", enforceMedicalExclusive));
  if (otherInjury)
    otherInjury.addEventListener("change", enforceMedicalExclusive);

  function getMedicalHistory() {
    const arr = [];
    if (mhNone && mhNone.checked) arr.push(mhNone.value);
    mhBoxes.forEach((el) => {
      if (el.checked) arr.push(el.value);
    });
    if (otherInjury && otherInjury.checked) arr.push(otherInjury.value);
    return arr;
  }

  function getPetTemperament() {
    const arr = [];
    ptBoxes.forEach((el) => {
      if (el.checked) arr.push(el.value);
    });
    return arr;
  }

  function syncSize() {
    const r = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#111";
  }
  syncSize();

  let drawing = false;
  let hasStroke = false;

  function point(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function lockScroll(lock) {
    document.body.style.overflow = lock ? "hidden" : "";
    document.body.style.touchAction = lock ? "none" : "";
  }

  function down(e) {
    e.preventDefault();
    lockScroll(true);
    drawing = true;
    const p = point(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    msg.textContent = "";
  }

  function move(e) {
    if (!drawing) return;
    e.preventDefault();
    const p = point(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    hasStroke = true;
  }

  function up() {
    drawing = false;
    lockScroll(false);
  }

  canvas.addEventListener("pointerdown", down, { passive: false });
  canvas.addEventListener("pointermove", move, { passive: false });
  window.addEventListener("pointerup", up);
  window.addEventListener("pointercancel", up);

  clearBtn.onclick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasStroke = false;
    setError("已清除，請重新簽名");
    resetSubmit();
  };

  // async function initLIFF() {
  //   if (!window.liff) {
  //     throw new Error("LIFF SDK 未載入");
  //   }
  //   await liff.init({ liffId: LIFF_ID });
  //   if (!liff.isInClient()) {
  //     throw new Error("請從 LINE 聊天室開啟此連結");
  //   }
  //   if (!liff.isLoggedIn()) {
  //     liff.login();
  //     return false;
  //   }
  //   return true;
  // }

  // 懶人表單按鈕
  document.getElementById("fillDemo").addEventListener("click", () => {
    ownerName.value = "王小明";
    ownerIdNo.value = "A123456789";
    ownerPhone.value = "0912345678";

    emergencyName.value = "王媽媽";
    emergencyPhone.value = "0987654321";

    ownerEmail.value = "yuca.work@gmail.com";
    ownerAddress.value = "台北市信義區";

    petName.value = "皮卡丘";
    petBreed.value = "比熊犬";

    petBirthday.value = "2020/01/01";
    petWeight.value = "6.5";

    document.querySelector('input[name="petSex"][value="男生"]').checked = true;
  });

  submitBtn.onclick = async () => {
    msg.textContent = "";
    submitBtn.disabled = true;
    submitBtn.textContent = "謝謝您！資料上傳中...";

    if (!agree.checked) {
      setError("請先勾選同意契約內容");
      resetSubmit();
      return;
    }

    updatePetAgeByBirthday();

    const isOwnerSelf = getRadio("isOwnerSelf") || "是";
    const chipHas = getRadio("chipHas") || "有";
    const neutered = getRadio("neutered") || "有";
    const vetMode = getRadio("vetMode") || "甲方指定";
    const foodAllergy = getRadio("foodAllergy") || "無";
    const treatAllowed = getRadio("treatAllowed") || "可以";
    const petSex = getRadio("petSex") || "男生";

    const medicalHistory = getMedicalHistory();
    const medicalNoteText = (medicalNote?.value || "").trim();
    const allergyDetailText =
      foodAllergy === "有" ? requireValue(allergyDetail, "過敏內容") : "";
    const otherInjuryNote =
      otherInjury && otherInjury.checked ? (otherText?.value || "").trim() : "";

    const data = {
      ownerName: requireValue(ownerName, "甲方姓名"),
      ownerPhone: requireValue(ownerPhone, "聯絡電話"),
      emergencyName: requireValue(emergencyName, "緊急聯絡人"),
      emergencyPhone: requireValue(emergencyPhone, "緊急聯絡人電話"),
      ownerEmail: requireValue(ownerEmail, "Email（寄送附本用）"),
      ownerIdNo: requireValue(ownerIdNo, "身分證字號"),
      ownerAddress: requireValue(ownerAddress, "通訊地址"),

      isOwnerSelf,
      ownerRelation:
        isOwnerSelf === "否" ? requireValue(ownerRelation, "與飼主關係") : "",

      petName: requireValue(petName, "寵物姓名"),
      petBreed: requireValue(petBreed, "寵物品種"),
      petSex,
      petAge: requireValue(petAge, "寵物年齡"),
      petBirthday: requireValue(petBirthday, "寵物生日"),
      neutered,
      petWeight: requireValue(petWeight, "體重"),
      petTemperament: getPetTemperament(),
      petTemperamentNote: (petTemperamentNote?.value || "").trim(),
      signDate: requireValue(signDate, "簽署日期"),

      chipHas,
      chipNo: chipHas === "有" ? (chipNo.value || "").trim() : "",
      chipIdentifyInfo:
        chipHas === "無" ? (chipIdentifyInfo.value || "").trim() : "",

      foodAllergy,
      allergyDetail: allergyDetailText,

      treatAllowed,

      medicalHistory,
      medicalNote: medicalNoteText,
      otherInjuryNote,

      vetMode,
      vetName:
        vetMode === "甲方指定"
          ? requireValue(vetName, "動物醫院名稱")
          : STORE_VET.name,
      vetPhone:
        vetMode === "甲方指定"
          ? requireValue(vetPhone, "動物醫院電話")
          : STORE_VET.phone,
      vetAddress:
        vetMode === "甲方指定"
          ? requireValue(vetAddress, "動物醫院地址")
          : STORE_VET.address,
    };

    if (Object.values(data).some((v) => v === null)) {
      resetSubmit();
      return;
    }

    if (!isValidDateString(data.petBirthday)) {
      setError("寵物生日格式不正確，請輸入有效日期");
      petBirthday.focus();
      resetSubmit();
      return;
    }

    if (!isValidWeight(data.petWeight)) {
      setError("體重格式不正確，請輸入數字，例如：6.5");
      petWeight.focus();
      resetSubmit();
      return;
    }

    if (!isValidEmail(data.ownerEmail)) {
      setError("Email 格式不正確，請重新確認");
      ownerEmail.focus();
      resetSubmit();
      return;
    }

    if (!hasStroke) {
      setError("請先完成簽名");
      resetSubmit();
      return;
    }

    try {
      // const ok = await initLIFF();
      // if (!ok) {
      //   resetSubmit();
      //   return;
      // }

      const chipText =
        data.chipHas === "有"
          ? `有${data.chipNo ? "（" + data.chipNo + "）" : "（未填號碼）"}`
          : `無${data.chipIdentifyInfo ? "（辨識資訊：" + data.chipIdentifyInfo + "）" : ""}`;

      const allergyText =
        data.foodAllergy === "有" ? `有（${data.allergyDetail}）` : "無";

      const vetText =
        data.vetMode === "乙方指定"
          ? `乙方指定：${data.vetName} / ${data.vetPhone} / ${data.vetAddress}`
          : `甲方指定：${data.vetName} / ${data.vetPhone}`;

      const mhText =
        data.medicalHistory && data.medicalHistory.length
          ? data.medicalHistory.join("、")
          : "（未勾選）";

      const otherInjuryTextLine =
        otherInjury && otherInjury.checked
          ? data.otherInjuryNote
            ? `其他外傷說明：${data.otherInjuryNote}`
            : "其他外傷說明：（未填）"
          : "其他外傷說明：—";

      const noteText = data.medicalNote ? data.medicalNote : "（未填）";

      const ptText =
        data.petTemperament && data.petTemperament.length
          ? data.petTemperament.join("、")
          : "（未勾選）";

      const ptNoteText = data.petTemperamentNote
        ? data.petTemperamentNote
        : "（未填）";

      const completeNote =
        "（簽署資料與簽名已完成。\n副本已寄送至您的Email信箱。\n\n若有多隻毛孩，請為每隻毛孩分別填寫一份表單並各自送出。）";

      const textMsg = `【犬貓美容契約簽署資料】
甲方姓名：${data.ownerName}
聯絡電話：${data.ownerPhone}
緊急聯絡人：${data.emergencyName}
緊急聯絡人電話：${data.emergencyPhone}
Email：${data.ownerEmail}
身分證字號：${data.ownerIdNo}
通訊地址：${data.ownerAddress}
是否飼主本人：${data.isOwnerSelf}${data.ownerRelation ? "（關係：" + data.ownerRelation + "）" : ""}

寵物名字：${data.petName}
品種：${data.petBreed}
性別：${data.petSex}
年齡：${data.petAge}
生日：${data.petBirthday}
絕育：${data.neutered}
體重(公斤)：${data.petWeight}
寵物個性：${ptText}
個性其他應注意：${ptNoteText}
晶片：${chipText}
食物過敏：${allergyText}
零食：${data.treatAllowed}
病史：${mhText}
${otherInjuryTextLine}
病史其他應注意：${noteText}
緊急就醫：${vetText}
審閱/簽署日期：${data.signDate}

${completeNote}`;

      let profile = null;
      // try {
      //   profile = await liff.getProfile();
      // } catch (e) {}

      const contractText = (
        document.getElementById("contractText")?.innerText || ""
      ).trim();
      const signatureDataUrl = canvas.toDataURL("image/png");

      let res;
      let result = {};

      try {
        res = await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=UTF-8" },
          body: JSON.stringify({
            secret: SHARED_SECRET,
            data,
            signatureDataUrl,
            line: {
              userId: profile?.userId || "",
              displayName: profile?.displayName || "",
            },
            contractText,
          }),
        });
      } catch (e) {
        throw new Error("資料上傳失敗，請稍後再試");
      }

      try {
        result = await res.json();
      } catch (e) {
        throw new Error("伺服器回傳格式異常，請聯絡店家");
      }

      if (!res.ok || result.success !== true) {
        throw new Error(result.message || "資料送出失敗，請稍後再試");
      }

      // await liff.sendMessages([{ type: "text", text: textMsg }]);

      setOK("資料已送出！\n可以回到聊天室了！");
      submitBtn.disabled = true;
      submitBtn.textContent = "已送出";
    } catch (err) {
      setError(err.message || "送出失敗");
      resetSubmit();
    }
  };
})();
