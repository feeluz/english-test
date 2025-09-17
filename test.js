document.addEventListener('DOMContentLoaded', function init() {
  const questionsA = [
    { q: "1) She ____ to school every day.", opts:["go","goes","going","gone"], a:1 },
    { q: "2) Choose the correct article: I saw ____ elephant.", opts:["a","an","the","no article"], a:1 },
    { q: "3) We ____ dinner when the phone rang.", opts:["have","are having","had","were having"], a:3 },
    { q: "4) Which word is a synonym of 'happy'?", opts:["sad","angry","joyful","tired"], a:2 },
    { q: "5) If I ____ you, I would study more.", opts:["am","were","was","be"], a:1 },
    { q: "6) What is the past tense of 'go'?", opts:["goed","gone","went","going"], a:2 },
    { q: "7) Select the correct sentence.", opts:["He don't like pizza.","He doesn't likes pizza.","He doesn't like pizza.","He not like pizza."], a:2 },
    { q: "8) Which word is a noun?", opts:["run","blue","quickly","apple"], a:3 },
    { q: "9) Choose the correct preposition: I'm interested ____ art.", opts:["at","of","in","on"], a:2 },
    { q: "10) Which is the correct spelling?", opts:["definately","definitely","definetly","definetely"], a:1 },
    { q: "11) She has lived here ____ 2010.", opts:["for","since","from","at"], a:1 },
    { q: "12) Complete: They ____ watching TV when I arrived.", opts:["are","was","were","be"], a:2 },
    { q: "13) The opposite of 'difficult' is ____.", opts:["easy","hard","bad","simple"], a:0 },
    { q: "14) 'I have been to London' is in the ____ tense.", opts:["past simple","present perfect","present simple","future"], a:1 },
    { q: "15) Which is a correct question?", opts:["You like coffee?","Do you like coffee?","Like you coffee?","Do like you coffee?"], a:1 },
    { q: "16) Which word doesn't belong?", opts:["book","table","chair","fast"], a:3 },
    { q: "17) Choose the correct option: She sings ____ than her sister.", opts:["good","better","best","well"], a:1 },
    { q: "18) 'Children' is the ____ of 'child'.", opts:["plural","singular","adjective","verb"], a:0 },
    { q: "19) Find the mistake: 'He can to swim.'", opts:["He","can","to","swim"], a:2 },
    { q: "20) Reading: 'John works from Monday to Friday and rests on the weekend.' — When does John NOT work?", opts:["Monday","Friday","Saturday","Thursday"], a:2 },
  ];

  const questionsB = [
    { q: "L1) What did you hear?", prompt: "I have been waiting for two hours.",
      opts: ["I have been waiting for two hours.","I have been working for two hours.","I had been waiting for two hours.","I have been waiting for two days."], a:0 },
    { q: "L2) What did you hear?", prompt: "She bought three apples at the market.",
      opts: ["She brought three apples to the market.","She bought three apples at the market.","She bought free apples at the market.","She bought three apples in the supermarket."], a:1 },
    { q: "L3) Choose the correct number you hear:", prompt: "The meeting starts at quarter past seven.",
      opts: ["7:15","7:45","7:05","7:50"], a:0 },
    { q: "L4) Which sentence matches?", prompt: "They're going to travel to Canada next month.",
      opts: ["They go to Canada every month.","They traveled to Canada last month.","They're going to travel to Canada next month.","They can travel to Canada this month."], a:2 },
    { q: "L5) Pick the word you heard:", prompt: "The weather is quite unpredictable today.",
      opts: ["unpredictable","unacceptable","unbelievable","unavailable"], a:0 }
  ];

  const quizA = document.getElementById("quizA");
  const quizB = document.getElementById("quizB");

  function renderMCQ(blockEl, list, namePrefix, withListeningControls=false) {
    list.forEach((item, i) => {
      const id = `${namePrefix}${i}`;
      const div = document.createElement("div");
      div.className = "card";
      const head = document.createElement("p");
      head.className = "qhead";
      head.textContent = item.q;
      div.appendChild(head);

      if (withListeningControls && item.prompt) {
        const controls = document.createElement("div");
        controls.className = "controls";

        const play = document.createElement("button");
        play.type = "button"; play.className = "btn secondary"; play.textContent = "▶ Play";
        play.addEventListener("click", () => speak(item.prompt));

        const repeat = document.createElement("button");
        repeat.type = "button"; repeat.className = "btn secondary"; repeat.textContent = "↺ Play twice";
        repeat.addEventListener("click", async () => { await speak(item.prompt); setTimeout(()=>speak(item.prompt), 400); });

        const showTxt = document.createElement("button");
        showTxt.type = "button"; showTxt.className = "btn secondary"; showTxt.textContent = "📝 Show transcript";
        const transcript = document.createElement("div");
        transcript.className = "transcript";
        transcript.textContent = item.prompt;
        showTxt.addEventListener("click", () => {
          transcript.style.display = transcript.style.display === "block" ? "none" : "block";
        });

        controls.appendChild(play); controls.appendChild(repeat); controls.appendChild(showTxt);
        div.appendChild(controls);
        div.appendChild(transcript);
        const tip = document.createElement("div");
        tip.className = "inline-note";
        tip.textContent = "If audio doesn't play, use the transcript.";
        div.appendChild(tip);
      }

      const opts = document.createElement("div"); opts.className = "opts";
      item.opts.forEach((opt, j) => {
        const rid = `${id}_opt${j}`;
        const label = document.createElement("label");
        label.setAttribute("for", rid);
        label.innerHTML = `<input id="${rid}" type="radio" name="${id}" value="${j}"> ${opt}`;
        opts.appendChild(label);
      });

      div.appendChild(opts);
      blockEl.appendChild(div);
    });
  }

  renderMCQ(quizA, questionsA, "Aq");
  renderMCQ(quizB, questionsB, "Bq", true);

  function levelFromPercent(pct){
    if (pct <= 35) return "Beginner";
    if (pct <= 65) return "Intermediate";
    if (pct <= 85) return "Upper Intermediate";
    return "Advanced";
  }

  document.getElementById("submitBtn").addEventListener("click", () => {
    const scoreA = questionsA.reduce((acc, _, i) => {
      const sel = document.querySelector(`input[name="Aq${i}"]:checked`);
      return acc + (sel && +sel.value === questionsA[i].a ? 1 : 0);
    }, 0);

    const scoreB = questionsB.reduce((acc, _, i) => {
      const sel = document.querySelector(`input[name="Bq${i}"]:checked`);
      return acc + (sel && +sel.value === questionsB[i].a ? 1 : 0);
    }, 0);

    const total = questionsA.length + questionsB.length;
    const score = scoreA + scoreB;
    const pct = Math.round((score / total) * 100);
    const level = levelFromPercent(pct);
    const name = (document.getElementById("studentName").value || "Student").trim();

    const badge = (scoreB === questionsB.length) ? ' <span class="pill" title="All listening answers correct">Perfect Listening</span>' : '';
    document.getElementById("result").innerHTML =
      `${name ? name + ', ' : ''}Your score: ${score}/${total} (${pct}%) → Level: ${level}${badge}`;

    window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
    document.getElementById("result").textContent = "";
    document.getElementById("studentName").value = "";
    window.scrollTo({top: 0, behavior: "smooth"});
  });
  document.getElementById("printBtn").addEventListener("click", () => window.print());

  const voiceSelect = document.getElementById("voiceSelect");
  const rate = document.getElementById("rate");
  const volume = document.getElementById("volume");
  const ttsStatus = document.getElementById("ttsStatus");
  const synth = window.speechSynthesis;

  function ttsAvailable() {
    return !!(window.speechSynthesis && window.SpeechSynthesisUtterance);
  }

  function populateVoices() {
    if (!ttsAvailable()) {
      voiceSelect.innerHTML = "<option>Speech not supported</option>";
      voiceSelect.disabled = true;
      const testBtn = document.getElementById("testVoice");
      if (testBtn) testBtn.disabled = true;
      ttsStatus.textContent = " (Speech not supported; use transcripts)";
      return;
    }
    const voices = synth.getVoices().filter(v => /^en(-|$)/i.test(v.lang) || /English/i.test(v.name));
    voiceSelect.innerHTML = "";
    if (voices.length === 0) {
      const opt = document.createElement("option");
      opt.textContent = "No English voices yet (try reloading)";
      opt.value = "";
      voiceSelect.appendChild(opt);
      ttsStatus.textContent = " (No voices loaded; transcripts available)";
    } else {
      voices.forEach((v) => {
        const opt = document.createElement("option");
        opt.value = v.name;
        opt.textContent = `${v.name} — ${v.lang}`;
        voiceSelect.appendChild(opt);
      });
      const idx = voices.findIndex(v => /US|GB/i.test(v.lang));
      voiceSelect.value = voices[Math.max(idx, 0)].name;
      ttsStatus.textContent = "";
    }
  }
  populateVoices();
  if (typeof speechSynthesis !== "undefined") {
    speechSynthesis.onvoiceschanged = populateVoices;
  }

  function getSelectedVoice() {
    const name = voiceSelect.value;
    return (synth.getVoices && synth.getVoices().find(v => v.name === name)) || null;
  }

  async function speak(text) {
    if (!ttsAvailable()) { alert("Speech not supported in this browser. Use the transcript."); return; }
    try {
      synth.cancel();
      return new Promise(resolve => {
        const u = new SpeechSynthesisUtterance(text);
        const v = getSelectedVoice();
        if (v) u.voice = v;
        u.rate = parseFloat(rate.value || "1");
        u.volume = parseFloat(volume.value || "1");
        u.onend = resolve;
        u.onerror = () => { ttsStatus.textContent = " (Playback error; use transcript)"; resolve(); };
        synth.speak(u);
      });
    } catch {
      ttsStatus.textContent = " (Playback blocked; use transcript)";
    }
  }

  document.getElementById("testVoice").addEventListener("click", () => {
    speak("This is a sample. Please adjust the voice, rate, and volume if you like.");
  });
});
