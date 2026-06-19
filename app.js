document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // Synth Audio Engine (Web Audio API)
  // -------------------------------------------------------------
  let audioCtx = null;
  let isSoundEnabled = localStorage.getItem('sound_enabled') !== 'false';
  let selectedPart = null;

  // Update Sound Button UI on start
  const soundToggle = document.getElementById('sound-toggle');
  const soundIcon = soundToggle ? soundToggle.querySelector('i') : null;
  if (soundToggle && soundIcon) {
    if (!isSoundEnabled) {
      soundIcon.className = 'fa-solid fa-volume-xmark';
      soundToggle.classList.add('muted');
    }
  }

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      localStorage.setItem('sound_enabled', isSoundEnabled);
      if (isSoundEnabled) {
        if (soundIcon) soundIcon.className = 'fa-solid fa-volume-high';
        soundToggle.classList.remove('muted');
        initAudio();
        playClick();
      } else {
        if (soundIcon) soundIcon.className = 'fa-solid fa-volume-xmark';
        soundToggle.classList.add('muted');
      }
    });
  }

  function initAudio() {
    if (!audioCtx && isSoundEnabled) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playSynthSound(freq, type, duration, volume = 0.1) {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      gain.gain.setValueAtTime(volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Fail silently
    }
  }

  function playClick() {
    playSynthSound(800, 'sine', 0.08, 0.05);
  }

  function playSuccessSound() {
    if (!isSoundEnabled) return;
    playSynthSound(523.25, 'triangle', 0.2, 0.08); // C5
    setTimeout(() => playSynthSound(659.25, 'triangle', 0.2, 0.08), 80); // E5
    setTimeout(() => playSynthSound(783.99, 'triangle', 0.35, 0.08), 160); // G5
  }

  // -------------------------------------------------------------
  // Navigation Tabs Switching
  // -------------------------------------------------------------
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.content-section');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      playClick();
      const targetTab = item.getAttribute('data-tab');

      navItems.forEach(i => i.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      item.classList.add('active');
      const activeSection = document.getElementById(targetTab);
      if (activeSection) {
        activeSection.classList.add('active');
      }

      // Initializations for widgets
      if (targetTab === 'overview') {
        if (typeof generateStudyPlanCalendar === 'function') generateStudyPlanCalendar();
      }
      if (targetTab === 'networks') {
        initSubnetGame();
        if (typeof loadNetworkScenario === 'function') loadNetworkScenario();
        if (typeof calculateVLSM === 'function') calculateVLSM();
      }
      if (targetTab === 'linux') {
        initTerminal();
      }
      if (targetTab === 'windows') {
        initPowerShell();
        if (typeof renderADTree === 'function') renderADTree();
      }
      if (targetTab === 'cloud') {
        if (typeof initCloudCanvas === 'function') initCloudCanvas();
        if (typeof calculateCloudPlanner === 'function') calculateCloudPlanner();
      }
      if (targetTab === 'tools') {
        if (typeof loadAutomationScript === 'function') loadAutomationScript();
      }
      if (targetTab === 'sre') {
        if (typeof initSreSimulator === 'function') initSreSimulator();
      }
      if (targetTab === 'zerotrust') {
        if (typeof initZtSimulator === 'function') initZtSimulator();
      }
    });
  });

  // -------------------------------------------------------------
  // Theme Toggle Logic
  // -------------------------------------------------------------
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    if (themeIcon) {
      themeIcon.className = 'fa-solid fa-moon';
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      playClick();
      document.body.classList.toggle('light-theme');
      
      if (document.body.classList.contains('light-theme')) {
        localStorage.setItem('theme', 'light');
        if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
      } else {
        localStorage.setItem('theme', 'dark');
        if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
      }
    });
  }

  // -------------------------------------------------------------
  // Checklist State Management & LocalStorage
  // -------------------------------------------------------------
  const checklistItems = document.querySelectorAll('.checklist-item');
  
  checklistItems.forEach(item => {
    const checkbox = item.querySelector('.checklist-checkbox');
    const itemId = checkbox.getAttribute('id');
    const savedState = localStorage.getItem(itemId);

    if (savedState === 'true') {
      checkbox.checked = true;
      item.classList.add('completed');
    }

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        item.classList.add('completed');
        localStorage.setItem(itemId, 'true');
        playSuccessSound();
        showFloatingNotification('تم إكمال المهمة بنجاح! 🚀');
      } else {
        item.classList.remove('completed');
        localStorage.removeItem(itemId);
        playClick();
      }
      updateGlobalProgress();
      if (typeof checkExamUnlocks === 'function') checkExamUnlocks();
    });
  });

  function updateGlobalProgress() {
    const totalCheckboxes = document.querySelectorAll('.checklist-checkbox').length;
    const checkedCheckboxes = document.querySelectorAll('.checklist-checkbox:checked').length;
    
    const percentage = totalCheckboxes > 0 ? Math.round((checkedCheckboxes / totalCheckboxes) * 100) : 0;
    
    const progressFill = document.querySelector('.progress-bar-fill');
    const progressPercentText = document.querySelector('.progress-percentage');
    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (progressPercentText) progressPercentText.textContent = `${percentage}%`;

    // Dynamic RPG Level & XP System
    let totalXp = checkedCheckboxes * 10;
    for (let p = 0; p <= 10; p++) {
      if (localStorage.getItem(`exam-phase-${p}-passed`) === 'true') {
        totalXp += (p === 0 ? 100 : 50);
      }
    }

    // Update IT Basics Badge Status
    const badgeItb = document.getElementById('badge-status-itb');
    if (badgeItb) {
      if (localStorage.getItem('exam-phase-0-passed') === 'true') {
        badgeItb.innerHTML = '🏆 مكتسبة (A+ Basics)';
        badgeItb.style.color = 'var(--success)';
      } else {
        badgeItb.innerHTML = '🔐 مقفلة (أكمل المهام)';
        badgeItb.style.color = 'var(--text-muted)';
      }
    }
    const gameXp = parseInt(localStorage.getItem('custom_game_xp') || '0');
    totalXp += gameXp;

    let level = 1;
    let xpNeeded = 100;
    let tempXp = totalXp;
    while (tempXp >= xpNeeded) {
      tempXp -= xpNeeded;
      level++;
      xpNeeded = level * 100;
    }

    const levelEl = document.getElementById('profile-level');
    const xpCurrentEl = document.getElementById('profile-xp-current');
    const xpNextEl = document.getElementById('profile-xp-next');
    const xpFillEl = document.getElementById('profile-xp-fill');

    if (levelEl) levelEl.textContent = level;
    if (xpCurrentEl) xpCurrentEl.textContent = tempXp;
    if (xpNextEl) xpNextEl.textContent = xpNeeded;
    if (xpFillEl) xpFillEl.style.width = `${(tempXp / xpNeeded) * 100}%`;

    // Dynamic Rank Title Calculation based on Passed Exams
    const profileRank = document.getElementById('profile-rank');
    if (profileRank) {
      const exam10Passed = localStorage.getItem('exam-phase-10-passed') === 'true';
      const exam9Passed = localStorage.getItem('exam-phase-9-passed') === 'true';
      const exam8Passed = localStorage.getItem('exam-phase-8-passed') === 'true';
      const exam7Passed = localStorage.getItem('exam-phase-7-passed') === 'true';
      const exam6Passed = localStorage.getItem('exam-phase-6-passed') === 'true';
      const exam5Passed = localStorage.getItem('exam-phase-5-passed') === 'true';
      const exam4Passed = localStorage.getItem('exam-phase-4-passed') === 'true';
      const exam3Passed = localStorage.getItem('exam-phase-3-passed') === 'true';
      const exam2Passed = localStorage.getItem('exam-phase-2-passed') === 'true';
      const exam1Passed = localStorage.getItem('exam-phase-1-passed') === 'true';

      if (exam10Passed) {
        profileRank.textContent = 'نينجا الأنظمة السحابية والأمن الصِفري (IT Ninja 👑🔥)';
        profileRank.style.color = 'var(--danger)';
        profileRank.style.background = 'rgba(239, 68, 68, 0.08)';
      } else if (exam9Passed) {
        profileRank.textContent = 'مهندس موثوقية وجودة الأنظمة (SRE Specialist) 📊';
        profileRank.style.color = 'var(--accent-secondary)';
        profileRank.style.background = 'rgba(6, 182, 212, 0.08)';
      } else if (exam8Passed) {
        profileRank.textContent = 'مطور البنية التحتية كأكواد (GitOps Engineer) 🔄';
        profileRank.style.color = 'var(--accent-purple)';
        profileRank.style.background = 'rgba(168, 85, 247, 0.08)';
      } else if (exam7Passed) {
        profileRank.textContent = 'خبير حاويات وتوزيع خدمات (Kubernetes Guru) 🐳';
        profileRank.style.color = 'var(--success)';
        profileRank.style.background = 'rgba(16, 185, 129, 0.08)';
      } else if (exam6Passed) {
        profileRank.textContent = 'محلل أمن سيبراني وأنظمة (Cyber Security Analyst) 🛡️';
        profileRank.style.color = 'var(--danger)';
        profileRank.style.background = 'rgba(239, 68, 68, 0.08)';
      } else if (exam5Passed) {
        profileRank.textContent = 'أخصائي حوسبة سحابية وأتمتة (Cloud & Automation Specialist) 🚀';
        profileRank.style.color = 'var(--success)';
        profileRank.style.background = 'rgba(16, 185, 129, 0.08)';
      } else if (exam4Passed) {
        profileRank.textContent = 'مهندس سحابة وافتراضية معتمد ☁️';
        profileRank.style.color = 'var(--accent-primary)';
        profileRank.style.background = 'rgba(99, 102, 241, 0.08)';
      } else if (exam3Passed) {
        profileRank.textContent = 'مهندس أنظمة ودليل نشط (AD DS) 🛡️';
        profileRank.style.color = 'var(--accent-purple)';
        profileRank.style.background = 'rgba(168, 85, 247, 0.08)';
      } else if (exam2Passed) {
        profileRank.textContent = 'مسؤول سيرفرات لينكس محترف 🐧';
        profileRank.style.color = 'var(--accent-secondary)';
        profileRank.style.background = 'rgba(6, 182, 212, 0.08)';
      } else if (exam1Passed) {
        profileRank.textContent = 'مساعد شبكات ومعماري بنية تحتية ⚡';
        profileRank.style.color = 'var(--warning)';
        profileRank.style.background = 'rgba(245, 158, 11, 0.08)';
      } else {
        // Fallback to percentage if no exams passed
        if (percentage <= 20) {
          profileRank.textContent = 'مبتدئ شبكات ⚡';
          profileRank.style.color = 'var(--accent-primary)';
          profileRank.style.background = 'rgba(99, 102, 241, 0.08)';
        } else if (percentage <= 50) {
          profileRank.textContent = 'مسؤول أنظمة مبتدئ 🛠️';
          profileRank.style.color = 'var(--accent-secondary)';
          profileRank.style.background = 'rgba(6, 182, 212, 0.08)';
        } else if (percentage <= 80) {
          profileRank.textContent = 'مهندس أنظمة محترف 🛡️';
          profileRank.style.color = 'var(--accent-purple)';
          profileRank.style.background = 'rgba(168, 85, 247, 0.08)';
        } else {
          profileRank.textContent = 'خبير DevOps وبنية تحتية 👑';
          profileRank.style.color = 'var(--success)';
          profileRank.style.background = 'rgba(16, 185, 129, 0.08)';
        }
      }
    }

    const totalTasksText = document.getElementById('stat-total-tasks');
    const completedTasksText = document.getElementById('stat-completed-tasks');
    const remainingTasksText = document.getElementById('stat-remaining-tasks');
    const globalPercentText = document.getElementById('stat-global-percent');

    if (totalTasksText) totalTasksText.textContent = totalCheckboxes;
    if (completedTasksText) completedTasksText.textContent = checkedCheckboxes;
    if (remainingTasksText) remainingTasksText.textContent = totalCheckboxes - checkedCheckboxes;
    if (globalPercentText) globalPercentText.textContent = `${percentage}%`;
    
    // Update visual roadmap progress
    if (typeof updateRoadmap === 'function') {
      updateRoadmap();
    }
  }

  function showFloatingNotification(message) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '20px';
    notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    notification.style.color = 'white';
    notification.style.padding = '0.85rem 1.75rem';
    notification.style.borderRadius = '10px';
    notification.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.4)';
    notification.style.zIndex = '999';
    notification.style.fontWeight = '700';
    notification.style.direction = 'rtl';
    notification.style.animation = 'fadeInUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), fadeOutDown 0.3s 2.7s ease-in forwards';
    notification.textContent = message;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  updateGlobalProgress();

  // -------------------------------------------------------------
  // Dynamic Study Flashcards Tool (Overview Component)
  // -------------------------------------------------------------
  const flashcardElement = document.getElementById('study-card');
  const flashcardFront = document.getElementById('card-front-text');
  const flashcardBack = document.getElementById('card-back-text');
  const flashcardLabel = document.getElementById('card-label-text');
  const nextCardBtn = document.getElementById('next-card-btn');
  const switcherBtns = document.querySelectorAll('.flashcard-type-btn');

  let currentCategory = 'ports';
  let cardIndex = 0;

  const cardDecks = {
    ports: [
      { f: 'DNS (Domain Name System)', b: 'Port 53 (UDP/TCP)', l: 'أرقام المنافذ الشهيرة' },
      { f: 'SSH (Secure Shell)', b: 'Port 22 (TCP)', l: 'أرقام المنافذ الشهيرة' },
      { f: 'DHCP Server', b: 'Port 67 (UDP)', l: 'أرقام المنافذ الشهيرة' },
      { f: 'HTTPS (Secure Web)', b: 'Port 443 (TCP)', l: 'أرقام المنافذ الشهيرة' },
      { f: 'RDP (Remote Desktop Protocol)', b: 'Port 3389 (TCP)', l: 'أرقام المنافذ الشهيرة' },
      { f: 'HTTP (Plain Web)', b: 'Port 80 (TCP)', l: 'أرقام المنافذ الشهيرة' }
    ],
    osi: [
      { f: 'الطبقة 1: Physical Layer', b: 'مسؤولة عن الإشارات الكهربية وكوابل النحاس/الألياف الضوئية.', l: 'طبقات OSI السبعة' },
      { f: 'الطبقة 2: Data Link Layer', b: 'تتعامل مع عناوين الـ MAC Address ومفاتيح الشبكة (Switches).', l: 'طبقات OSI السبعة' },
      { f: 'الطبقة 3: Network Layer', b: 'تتعامل مع عناوين الـ IP Address والراوترات (Routing).', l: 'طبقات OSI السبعة' },
      { f: 'الطبقة 4: Transport Layer', b: 'تتحكم بنقل البيانات وتتضمن بروتوكولات TCP و UDP.', l: 'طبقات OSI السبعة' },
      { f: 'الطبقة 7: Application Layer', b: 'الطبقة التي يتفاعل معها المستخدم (HTTP, DNS, FTP).', l: 'طبقات OSI السبعة' }
    ],
    commands: [
      { f: 'لعرض تفاصيل كارت الشبكة في لينكس', b: 'ip a  أو  ifconfig', l: 'أوامر لينكس الهامة' },
      { f: 'لقراءة محتوى ملف نصي بسرعة', b: 'cat <filename>', l: 'أوامر لينكس الهامة' },
      { f: 'لتعديل صلاحيات الوصول لملف', b: 'chmod <permissions> <filename>', l: 'أوامر لينكس الهامة' },
      { f: 'لمعرفة المسار الحالي للمجلد النشط', b: 'pwd (print working directory)', l: 'أوامر لينكس الهامة' },
      { f: 'لإدارة وتشغيل الخدمات بالسيرفر', b: 'systemctl start <service_name>', l: 'أوامر لينكس الهامة' }
    ]
  };

  if (flashcardElement) {
    flashcardElement.addEventListener('click', () => {
      playClick();
      flashcardElement.classList.toggle('is-flipped');
    });
  }

  if (nextCardBtn) {
    nextCardBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playClick();
      
      // Flip back to front before changing contents
      flashcardElement.classList.remove('is-flipped');
      
      setTimeout(() => {
        const deck = cardDecks[currentCategory];
        cardIndex = (cardIndex + 1) % deck.length;
        loadFlashcard(currentCategory, cardIndex);
      }, 150);
    });
  }

  switcherBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      playClick();

      switcherBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentCategory = btn.getAttribute('data-type');
      cardIndex = 0;

      flashcardElement.classList.remove('is-flipped');
      setTimeout(() => {
        loadFlashcard(currentCategory, cardIndex);
      }, 150);
    });
  });

  function loadFlashcard(cat, idx) {
    const cardData = cardDecks[cat][idx];
    if (flashcardFront && flashcardBack && flashcardLabel) {
      flashcardFront.textContent = cardData.f;
      flashcardBack.textContent = cardData.b;
      flashcardLabel.textContent = cardData.l;
    }
  }

  // Load first card on startup
  loadFlashcard('ports', 0);

  // -------------------------------------------------------------
  // Subnetting Engine Upgrade (Difficulty Modes)
  // -------------------------------------------------------------
  let currentQuestion = {};
  let currentDifficulty = 'medium';

  const diffButtons = document.querySelectorAll('.difficulty-btn');
  diffButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      playClick();
      diffButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDifficulty = btn.getAttribute('data-level');
      generateSubnetQuestion();
    });
  });

  function initSubnetGame() {
    const questionText = document.getElementById('subnet-question');
    if (!questionText || questionText.textContent !== 'تحميل السؤال...') return; 
    generateSubnetQuestion();
  }

  window.generateSubnetQuestion = function() {
    let cidrs = [24, 25, 26, 27, 28, 29, 30]; // default medium
    
    if (currentDifficulty === 'easy') {
      cidrs = [24];
    } else if (currentDifficulty === 'hard') {
      cidrs = [29, 30];
    }

    const octet1 = 192;
    const octet2 = 168;
    const octet3 = Math.floor(Math.random() * 254) + 1;
    
    const cidr = cidrs[Math.floor(Math.random() * cidrs.length)];
    const subnetSize = Math.pow(2, 32 - cidr);
    const randomHostOffset = Math.floor(Math.random() * 254);
    const ipAddress = `${octet1}.${octet2}.${octet3}.${randomHostOffset}`;

    // Math calculations
    const networkOctet = Math.floor(randomHostOffset / subnetSize) * subnetSize;
    const broadcastOctet = networkOctet + subnetSize - 1;
    
    const networkAddress = `${octet1}.${octet2}.${octet3}.${networkOctet}`;
    const broadcastAddress = `${octet1}.${octet2}.${octet3}.${broadcastOctet}`;
    const usableHosts = subnetSize - 2;

    const subnetMasks = {
      24: '255.255.255.0',
      25: '255.255.255.128',
      26: '255.255.255.192',
      27: '255.255.255.224',
      28: '255.255.255.240',
      29: '255.255.255.248',
      30: '255.255.255.252'
    };

    const questionContainer = document.getElementById('subnet-question');
    const resultBox = document.getElementById('subnet-result');
    
    if (resultBox) {
      resultBox.style.display = 'none';
    }

    document.getElementById('ans-net').value = '';
    document.getElementById('ans-hosts').value = '';
    document.getElementById('ans-mask').value = '';

    currentQuestion = {
      ip: ipAddress,
      cidr: cidr,
      correctNet: networkAddress,
      correctHosts: usableHosts,
      correctMask: subnetMasks[cidr]
    };

    questionContainer.textContent = `[مستوى: ${currentDifficulty.toUpperCase()}] ما هو الـ Network Address، عدد الأجهزة Usable Hosts، والـ Subnet Mask للعنوان ${ipAddress}/${cidr}؟`;
  };

  window.checkSubnetAnswer = function() {
    const ansNet = document.getElementById('ans-net').value.trim();
    const ansHosts = document.getElementById('ans-hosts').value.trim();
    const ansMask = document.getElementById('ans-mask').value.trim();
    const resultBox = document.getElementById('subnet-result');

    const netCorrect = (ansNet === currentQuestion.correctNet);
    const hostsCorrect = (parseInt(ansHosts) === currentQuestion.correctHosts);
    const maskCorrect = (ansMask === currentQuestion.correctMask);

    if (netCorrect && hostsCorrect && maskCorrect) {
      playSuccessSound();
      resultBox.className = 'result-box correct';
      resultBox.innerHTML = `🎉 ممتاز! إجابة صحيحة.<br>
        • Network Address: ${currentQuestion.correctNet}<br>
        • Usable Hosts: ${currentQuestion.correctHosts}<br>
        • Subnet Mask: ${currentQuestion.correctMask}`;
    } else {
      playSynthSound(250, 'sawtooth', 0.25, 0.05); // Error sound
      resultBox.className = 'result-box wrong';
      resultBox.innerHTML = `❌ الإجابة غير دقيقة. تأكد من الحسابات:<br>
        • عنوان الشبكة الصحيح: ${currentQuestion.correctNet}<br>
        • عدد الأجهزة الصحيح: ${currentQuestion.correctHosts}<br>
        • قناع الشبكة الصحيح: ${currentQuestion.correctMask}`;
    }
    resultBox.style.display = 'block';
  };

  // -------------------------------------------------------------
  // Bash Terminal Simulator Logic
  // -------------------------------------------------------------
  let terminalInitialized = false;

  function initTerminal() {
    if (terminalInitialized) return;
    
    const terminalInput = document.getElementById('term-input');
    const terminalBody = document.getElementById('term-body');

    if (!terminalInput || !terminalBody) return;

    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const command = terminalInput.value.trim();
        executeTerminalCommand(command);
        terminalInput.value = '';
      }
    });

    terminalInitialized = true;
  }

  function executeTerminalCommand(cmd) {
    playClick();
    const body = document.getElementById('term-body');
    if (!body) return;

    const userLine = document.createElement('div');
    userLine.className = 'terminal-line';
    userLine.innerHTML = `<span class="terminal-prompt">it_ninja@local-server:~$</span> ${escapeHTML(cmd)}`;
    body.appendChild(userLine);

    const outputLine = document.createElement('div');
    outputLine.className = 'terminal-line';

    const normalizedCmd = cmd.toLowerCase().trim();
    const parts = normalizedCmd.split(' ');
    const primaryCmd = parts[0];

    switch (primaryCmd) {
      case 'help':
        outputLine.innerHTML = `المساعد الفوري لأوامر لينكس البسيطة:<br>
          - <b>ls</b> : سرد الملفات الحالية (جرب ls -l أو ls -la).<br>
          - <b>whoami</b> : معرفة مستخدم الجلسة.<br>
          - <b>cat &lt;filename&gt;</b> : قراءة ملف (e.g., cat nginx.conf).<br>
          - <b>ping google.com</b> : اختبار اتصال الشبكة (جرب ping -c 3 google.com).<br>
          - <b>ip a</b> / <b>ifconfig</b> : عرض بطاقات الشبكة وعناوين الـ IP.<br>
          - <b>chmod 644 &lt;file&gt;</b> : تعديل الصلاحيات لملف.<br>
          - <b>systemctl status nginx</b> : فحص حالة الخدمات النشطة (جرب systemctl restart nginx).<br>
          - <b>clear</b> : مسح الشاشة.`;
        break;
      case 'clear':
        body.innerHTML = '';
        return;
      case 'whoami':
        outputLine.textContent = 'it_ninja';
        break;
      case 'ls':
        const showAll = parts.includes('-a') || parts.includes('-la') || parts.includes('-al');
        const showLong = parts.includes('-l') || parts.includes('-la') || parts.includes('-al');
        
        if (showLong) {
          let listHtml = "total 20<br>";
          if (showAll) {
            listHtml += "drwxr-xr-x  3 it_ninja  it_ninja  4096 Jun 16 12:00 .<br>";
            listHtml += "drwxr-xr-x 10 root      root      4096 Jun 16 11:30 ..<br>";
          }
          listHtml += `drwxr-xr-x  2 it_ninja  it_ninja  4096 Jun 16 12:00 <span style="color:#38bdf8;font-weight:bold;">configs/</span><br>
-rw-r--r--  1 it_ninja  it_ninja   132 Jun 16 12:00 banner.txt<br>
-rw-r--r--  1 it_ninja  it_ninja   164 Jun 16 12:00 hosts<br>
-rw-r--r--  1 it_ninja  it_ninja   152 Jun 16 12:00 nginx.conf<br>
-rw-r--r--  1 it_ninja  it_ninja    92 Jun 16 12:00 sshd_config`;
          outputLine.innerHTML = listHtml;
        } else {
          outputLine.innerHTML = `<span style="color:#a855f7;font-weight:bold;">configs/</span>   nginx.conf   hosts   sshd_config   banner.txt`;
        }
        break;
      case 'ip':
        const ipSub = parts[1];
        if (ipSub === 'a' || ipSub === 'addr' || ipSub === 'address') {
          outputLine.innerHTML = `<pre style="font-family:inherit; color:#10b981;">
1: lo: &lt;LOOPBACK,UP,LOWER_UP&gt; mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
2: eth0: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 00:0c:29:ab:cd:ef brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.55/24 brd 192.168.1.255 scope global dynamic eth0
       valid_lft 86320sec preferred_lft 86320sec</pre>`;
        } else {
          outputLine.innerHTML = `Usage: ip [link|addr|route] (Try: ip a)`;
        }
        break;
      case 'ifconfig':
        outputLine.innerHTML = `<pre style="font-family:inherit; color:#10b981;">
eth0: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500
        inet 192.168.1.55  netmask 255.255.255.0  broadcast 192.168.1.255
        ether 00:0c:29:ab:cd:ef  txqueuelen 1000  (Ethernet)
        RX packets 104523  bytes 125432098 (125.4 MB)
        TX packets 85432  bytes 9874523 (9.8 MB)

lo: flags=73&lt;UP,LOOPBACK,RUNNING&gt;  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1000  (Local Loopback)</pre>`;
        break;
      case 'chmod':
        const fileTarget = parts[2] || parts[1];
        const permission = parts[2] ? parts[1] : '644';
        if (!fileTarget) {
          outputLine.style.color = '#ef4444';
          outputLine.textContent = 'chmod: missing operand. Usage: chmod <mode> <file>';
        } else {
          outputLine.style.color = '#10b981';
          outputLine.textContent = `mode of '${fileTarget}' changed to ${permission}`;
        }
        break;
      case 'systemctl':
        const action = parts[1];
        const service = parts[2];
        if (action === 'status' && service === 'nginx') {
          outputLine.innerHTML = `<pre style="font-family:inherit; color:#10b981;">
● nginx.service - A high performance web server and a reverse proxy server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
   Active: active (running) since Tue 2026-06-16 12:00:00 UTC; 4h ago
     Docs: man:nginx(8)
 Main PID: 1204 (nginx)
    Tasks: 2 (limit: 1153)
   Memory: 8.5M
   CGroup: /system.slice/nginx.service
           ├─1204 nginx: master process /usr/sbin/nginx -g daemon on;
           └─1205 nginx: worker process</pre>`;
        } else if (action && service) {
          outputLine.style.color = '#10b981';
          outputLine.textContent = `Service ${service} ${action}ed successfully.`;
        } else {
          outputLine.style.color = '#ef4444';
          outputLine.textContent = 'systemctl: missing arguments. Try: systemctl status nginx';
        }
        break;
      case 'cat':
        const file = parts[1];
        if (!file) {
          outputLine.style.color = '#ef4444';
          outputLine.textContent = 'Error: please specify a filename. Try: cat nginx.conf';
        } else if (file === 'nginx.conf') {
          outputLine.innerHTML = `server {<br>
          &nbsp;&nbsp;listen 80;<br>
          &nbsp;&nbsp;server_name it-roadmap.local;<br>
          &nbsp;&nbsp;location / {<br>
          &nbsp;&nbsp;&nbsp;&nbsp;root /var/www/html;<br>
          &nbsp;&nbsp;&nbsp;&nbsp;index index.html;<br>
          &nbsp;&nbsp;}<br>
          }`;
        } else if (file === 'hosts') {
          outputLine.innerHTML = `127.0.0.1   localhost<br>
          192.168.1.10   active-directory.local domain-controller<br>
          192.168.1.15   linux-webserver.local nginx-srv`;
        } else if (file === 'sshd_config') {
          outputLine.innerHTML = `Port 22<br>
          PermitRootLogin no<br>
          PasswordAuthentication no<br>
          PubkeyAuthentication yes`;
        } else if (file === 'banner.txt') {
          outputLine.innerHTML = `***************************************************<br>
          * Welcome to the IT Systems & Networks Terminal  *<br>
          * Keep learning, practicing, and hacking!        *<br>
          ***************************************************`;
        } else {
          outputLine.style.color = '#ef4444';
          outputLine.textContent = `cat: ${file}: No such file or directory`;
        }
        break;
      case 'ping':
        const pingTarget = parts[1];
        if (!pingTarget) {
          outputLine.style.color = '#ef4444';
          outputLine.textContent = 'ping: missing host';
          body.appendChild(outputLine);
        } else {
          let count = 4;
          const cIndex = parts.indexOf('-c');
          if (cIndex !== -1 && parts[cIndex + 1]) {
            count = parseInt(parts[cIndex + 1]) || 4;
          }
          
          let lineIdx = 0;
          const pingHost = parts.find(p => p !== 'ping' && p !== '-c' && p !== count.toString() && !p.startsWith('-'));
          
          if (!pingHost) {
            outputLine.style.color = '#ef4444';
            outputLine.textContent = 'ping: missing host';
            body.appendChild(outputLine);
            return;
          }

          const headerLine = document.createElement('div');
          headerLine.className = 'terminal-line';
          headerLine.innerHTML = `PING ${escapeHTML(pingHost)} (142.250.190.46) 56(84) bytes of data.`;
          body.appendChild(headerLine);
          body.scrollTop = body.scrollHeight;
          
          function printPingLine() {
            if (lineIdx < count) {
              const packetLine = document.createElement('div');
              packetLine.className = 'terminal-line';
              packetLine.innerHTML = `64 bytes from 142.250.190.46: icmp_seq=${lineIdx+1} ttl=115 time=${(10 + Math.random()*5).toFixed(1)} ms`;
              body.appendChild(packetLine);
              playSynthSound(400, 'sine', 0.05, 0.01);
              body.scrollTop = body.scrollHeight;
              lineIdx++;
              setTimeout(printPingLine, 500);
            } else {
              const footerLine = document.createElement('div');
              footerLine.className = 'terminal-line';
              footerLine.innerHTML = `--- ${escapeHTML(pingHost)} ping statistics ---<br>${count} packets transmitted, ${count} received, 0% packet loss, time ${(count*500).toFixed(0)}ms`;
              body.appendChild(footerLine);
              body.scrollTop = body.scrollHeight;
            }
          }
          
          setTimeout(printPingLine, 500);
          return;
        }
        break;
      case 'echo':
        const echoContent = cmd.substring(5).trim();
        if (echoContent.includes('>>')) {
          const redirectParts = echoContent.split('>>');
          const fileToRedirect = redirectParts[1].trim();
          const contentToRedirect = redirectParts[0].trim().replace(/['"]/g, '');
          outputLine.style.color = '#10b981';
          outputLine.textContent = `appended: "${contentToRedirect}" to ${fileToRedirect}`;
        } else {
          outputLine.textContent = echoContent.replace(/['"]/g, '');
        }
        break;
      case '':
        return;
      default:
        outputLine.style.color = '#ef4444';
        outputLine.textContent = `bash: ${escapeHTML(cmd)}: command not found. Type 'help'.`;
    }

    body.appendChild(outputLine);
    body.scrollTop = body.scrollHeight;

    // Check trouble-ticket solver verification hook
    if (typeof checkTicketCompletion === 'function') {
      checkTicketCompletion(cmd, outputLine);
    }
  }

  // -------------------------------------------------------------
  // Windows PowerShell Simulator Logic
  // -------------------------------------------------------------
  let psInitialized = false;

  function initPowerShell() {
    if (psInitialized) return;
    
    const psInput = document.getElementById('ps-input');
    const psBody = document.getElementById('ps-body');

    if (!psInput || !psBody) return;

    psInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const command = psInput.value.trim();
        executePowerShellCommand(command);
        psInput.value = '';
      }
    });

    psInitialized = true;
  }

  function executePowerShellCommand(cmd) {
    playClick();
    const body = document.getElementById('ps-body');
    if (!body) return;

    const userLine = document.createElement('div');
    userLine.className = 'terminal-line';
    userLine.innerHTML = `<span class="terminal-prompt">PS C:\\Users\\Administrator&gt;</span> ${escapeHTML(cmd)}`;
    body.appendChild(userLine);

    const outputLine = document.createElement('div');
    outputLine.className = 'terminal-line';

    const cleanCmd = cmd.trim();
    const cleanCmdLower = cleanCmd.toLowerCase();
    
    // Commandlet Parsers
    if (cleanCmdLower === 'help') {
      outputLine.innerHTML = `PowerShell Active Directory Commandlets Reference:<br>
        - <b>Get-Service</b> : Lists critical identity services.<br>
        - <b>Get-ADUser</b> : Displays list of Active Directory users.<br>
        - <b>New-ADUser -Name "Sami"</b> : Creates a new user in the directory.<br>
        - <b>New-ADOU -Name "Sales"</b> : Creates a Organizational Unit.<br>
        - <b>New-ADComputer -Name "PC-Sales-01"</b> : Adds a computer to the AD.<br>
        - <b>Get-Process</b> : Displays standard server resource processes.<br>
        - <b>Test-NetConnection</b> / <b>tnc</b> : Tests network connectivity to a host/port.<br>
        - <b>Clear-Host / cls</b> : Clears the blue window.`;
    } else if (cleanCmdLower === 'clear-host' || cleanCmdLower === 'cls') {
      body.innerHTML = '';
      return;
    } else if (cleanCmdLower === 'get-service') {
      outputLine.innerHTML = `<pre style="font-family:inherit;">
Status   Name               DisplayName
------   ----               -----------
Running  ADWS               Active Directory Web Services
Running  NTDS               Active Directory Domain Services
Running  DNS                DNS Server
Stopped  IISADMIN           IIS Admin Service
Stopped  W3SVC              World Wide Web Publishing Service</pre>`;
    } else if (cleanCmdLower.startsWith('test-netconnection') || cleanCmdLower.startsWith('tnc')) {
      const matchComp = cleanCmd.match(/-computername\s+([^\s]+)/i);
      const matchPort = cleanCmd.match(/-port\s+(\d+)/i);
      const target = matchComp ? matchComp[1] : '192.168.1.10';
      const port = matchPort ? matchPort[1] : '80';
      outputLine.innerHTML = `<pre style="font-family:inherit;">
ComputerName     : ${escapeHTML(target)}
RemoteAddress    : ${escapeHTML(target)}
RemotePort       : ${escapeHTML(port)}
InterfaceAlias   : Ethernet0
SourceAddress    : 192.168.1.55
TcpTestSucceeded : True</pre>`;
    } else if (cleanCmdLower === 'get-aduser' || cleanCmdLower.startsWith('get-aduser')) {
      // List all users in tree recursively
      let userList = [];
      function findUsers(node) {
        if (node.type === 'user') {
          userList.push({ name: node.name, dn: `CN=${node.name},CN=Users,DC=corp,DC=local` });
        }
        if (node.children) {
          node.children.forEach(findUsers);
        }
      }
      findUsers(adTreeData);
      
      let res = "<pre style='font-family:inherit;'>";
      userList.forEach(u => {
        res += `DistinguishedName : ${u.dn}\nEnabled           : True\nName              : ${u.name}\nUserPrincipalName : ${u.name.toLowerCase().replace(/\s+/g, '')}@corp.local\n\n`;
      });
      res += "</pre>";
      outputLine.innerHTML = res;
    } else if (cleanCmdLower.startsWith('new-aduser')) {
      const match = cleanCmd.match(/new-aduser\s+(?:-name\s+)?["']?([^"']+)["']?/i);
      if (match) {
        const newUserName = match[1];
        // add to Users OU
        const usersOu = adTreeData.children.find(c => c.name === 'Users');
        if (usersOu) {
          usersOu.children.push({ name: newUserName, type: 'user' });
          renderADTree();
          
          // Highlight the added node
          setTimeout(() => {
            const addedNodes = document.querySelectorAll('.ad-node-added');
            addedNodes.forEach(n => n.classList.remove('ad-node-added'));
          }, 1000);

          outputLine.innerHTML = `<span style="color:#22c55e;">User '${newUserName}' created successfully in OU=Users,DC=corp,DC=local.</span>`;
          playSuccessSound();
        } else {
          outputLine.innerHTML = `<span style="color:#ef4444;">Error: OU=Users not found in Domain Controller.</span>`;
        }
      } else {
        outputLine.innerHTML = `<span style="color:#eedc82;">Usage: New-ADUser -Name "UserName"</span>`;
      }
    } else if (cleanCmdLower.startsWith('new-adou')) {
      const match = cleanCmd.match(/new-adou\s+(?:-name\s+)?["']?([^"']+)["']?/i);
      if (match) {
        const ouName = match[1];
        adTreeData.children.push({ name: ouName, type: 'ou', expanded: true, children: [] });
        renderADTree();
        outputLine.innerHTML = `<span style="color:#22c55e;">Organizational Unit '${ouName}' created successfully in DC=corp,DC=local.</span>`;
        playSuccessSound();
      } else {
        outputLine.innerHTML = `<span style="color:#eedc82;">Usage: New-ADOU -Name "OUName"</span>`;
      }
    } else if (cleanCmdLower.startsWith('new-adcomputer')) {
      const match = cleanCmd.match(/new-adcomputer\s+(?:-name\s+)?["']?([^"']+)["']?/i);
      if (match) {
        const compName = match[1];
        const compOu = adTreeData.children.find(c => c.name === 'Computers') || adTreeData;
        compOu.children.push({ name: compName, type: 'computer' });
        renderADTree();
        outputLine.innerHTML = `<span style="color:#22c55e;">Computer Object '${compName}' added successfully to domain.</span>`;
        playSuccessSound();
      } else {
        outputLine.innerHTML = `<span style="color:#eedc82;">Usage: New-ADComputer -Name "ComputerName"</span>`;
      }
    } else if (cleanCmdLower === 'get-process') {
      outputLine.innerHTML = `<pre style="font-family:inherit;">
Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  ProcessName
-------  ------    -----      -----     ------     --  -----------
    384      24    45800      52100       1.24   1245  lsass
    215      18    21500      32000       0.56   2108  dns
    842      45    98500     110200       4.12    984  svchost</pre>`;
    } else if (cleanCmdLower !== '') {
      outputLine.style.color = '#eedc82';
      outputLine.innerHTML = `Get-Command : The term '${escapeHTML(cleanCmd)}' is not recognized as the name of a cmdlet, function, script file, or operable program. Type 'help' to see list of valid cmdlets.`;
    }

    body.appendChild(outputLine);
    body.scrollTop = body.scrollHeight;
  }

  // -------------------------------------------------------------
  // Interactive Home Lab Network Topology Diagram Logic
  // -------------------------------------------------------------
  const nodes = document.querySelectorAll('.network-node');
  
  nodes.forEach(node => {
    node.addEventListener('click', () => {
      playClick();
      node.classList.toggle('active');
      
      const nodeName = node.getAttribute('data-node');
      
      // Update related traffic lines state
      updateNetworkLines();
    });
  });

  function updateNetworkLines() {
    const isInternetActive = document.querySelector('.network-node[data-node="internet"]').classList.contains('active');
    const isFirewallActive = document.querySelector('.network-node[data-node="firewall"]').classList.contains('active');
    const isRouterActive = document.querySelector('.network-node[data-node="router"]').classList.contains('active');
    const isDCActive = document.querySelector('.network-node[data-node="dc"]').classList.contains('active');
    const isWebActive = document.querySelector('.network-node[data-node="webserver"]').classList.contains('active');

    // Lines definitions
    const lineNetFw = document.getElementById('line-net-fw');
    const lineFwRt = document.getElementById('line-fw-rt');
    const lineRtDc = document.getElementById('line-rt-dc');
    const lineRtWeb = document.getElementById('line-rt-web');

    // Internet to Firewall Traffic
    if (isInternetActive && isFirewallActive) {
      lineNetFw.classList.add('active');
    } else {
      lineNetFw.classList.remove('active');
    }

    // Firewall to Router Traffic
    if (isFirewallActive && isRouterActive) {
      lineFwRt.classList.add('active');
    } else {
      lineFwRt.classList.remove('active');
    }

    // Router to Active Directory Controller
    if (isRouterActive && isDCActive) {
      lineRtDc.classList.add('active-dc');
    } else {
      lineRtDc.classList.remove('active-dc');
    }

    // Router to Linux WebServer
    if (isRouterActive && isWebActive) {
      lineRtWeb.classList.add('active');
    } else {
      lineRtWeb.classList.remove('active');
    }
  }

  // -------------------------------------------------------------
  // Interactive Firewall Simulator Game (Phase 6 Component)
  // -------------------------------------------------------------
  window.testFirewallRules = function() {
    playClick();
    const port80 = document.getElementById('fw-port-80').value;
    const port22 = document.getElementById('fw-port-22').value;
    const port3389 = document.getElementById('fw-port-3389').value;
    const resultBox = document.getElementById('fw-result');

    if (!resultBox) return;

    if (port80 === 'allow' && port22 === 'block' && port3389 === 'block') {
      playSuccessSound();
      resultBox.className = 'result-box correct';
      resultBox.innerHTML = `🎉 <b>أحسنت صنعاً وبرافو عليك!</b> لقد قمت بتهيئة جدار الحماية بشكل آمن تماماً.<br>
        • خادم الويب (Port 80) متاح للزوار والعملاء.<br>
        • المنافذ الخطرة والتحكم عن بعد (SSH & RDP) تم حجبها بالكامل لحماية النظام من هجمات الاختراق.<br>
        سيرفر الشركة الآن في أمان تام! 🛡️`;
    } else if (port80 === 'block') {
      playSynthSound(250, 'sawtooth', 0.25, 0.05); // Error sound
      resultBox.className = 'result-box wrong';
      resultBox.innerHTML = `🚨 <b>تعطل الخدمة!</b> لقد قمت بحظر منفذ الويب (Port 80).<br>
        • الزوار الآن لا يمكنهم تصفح موقع الشركة والمبيعات متوقفة.<br>
        السيرفر آمن تماماً ولكنه غير مفيد لأحد! قم بالسماح (ALLOW) لمنفذ الويب أولاً.`;
    } else {
      playSynthSound(180, 'sawtooth', 0.4, 0.08); // Hacker intrusion alarm sound!
      resultBox.className = 'result-box wrong';
      resultBox.innerHTML = `🚨 <b>خطر اختراق شديد!</b> لقد تركت منفذ SSH (22) أو منفذ RDP (3389) مفتوحاً للعامة.<br>
        • تمكن المخترقون من شن هجوم تخميني (Brute-Force) ونجحوا في دخول السيرفر وتشفير جميع البيانات بطلب فدية!<br>
        قم بحظر (BLOCK) منافذ التحكم عن بعد من الوصول المفتوح فوراً لحماية أصول الشركة!`;
    }
    resultBox.style.display = 'block';
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // -------------------------------------------------------------
  // 1. Daily IT Quiz Engine
  // -------------------------------------------------------------
  window.answerQuiz = function(btn, explanation) {
    const options = document.querySelectorAll('.quiz-option-btn');
    const explanationBox = document.getElementById('quiz-explanation');
    
    if (!explanationBox || explanationBox.classList.contains('active')) return;
    
    const isCorrect = btn.getAttribute('data-correct') === 'true';
    
    // Add classes and lock other buttons
    options.forEach(opt => {
      opt.disabled = true;
      const optCorrect = opt.getAttribute('data-correct') === 'true';
      const icon = opt.querySelector('i');
      if (optCorrect) {
        opt.classList.add('correct-ans');
        if (icon) icon.className = 'fa-solid fa-circle-check';
      } else if (opt === btn) {
        opt.classList.add('wrong-ans');
        if (icon) icon.className = 'fa-solid fa-circle-xmark';
      }
    });
    
    if (isCorrect) {
      playSuccessSound();
      showFloatingNotification('إجابة صحيحة! بطل كالعادة 🏆');
    } else {
      playSynthSound(220, 'sawtooth', 0.25, 0.05); // Error buzzer
      showFloatingNotification('محاولة جيدة، اقرأ التفسير لتتعلم أكثر 📚');
    }
    
    explanationBox.innerHTML = `<strong>${isCorrect ? '✅ رائع! إجابة صحيحة:' : '❌ للأسف، إجابة غير دقيقة:'}</strong><br>${explanation}`;
    explanationBox.classList.add('active');
    explanationBox.style.display = 'block';
    
    // Persist answered state for today
    localStorage.setItem('daily_quiz_answered', isCorrect ? 'correct' : 'wrong');
    localStorage.setItem('daily_quiz_date', new Date().toDateString());
  };

  function checkDailyQuizState() {
    const answered = localStorage.getItem('daily_quiz_answered');
    const date = localStorage.getItem('daily_quiz_date');
    
    if (answered && date === new Date().toDateString()) {
      const options = document.querySelectorAll('.quiz-option-btn');
      const explanationBox = document.getElementById('quiz-explanation');
      
      options.forEach(opt => {
        opt.disabled = true;
        const optCorrect = opt.getAttribute('data-correct') === 'true';
        const icon = opt.querySelector('i');
        if (optCorrect) {
          opt.classList.add('correct-ans');
          if (icon) icon.className = 'fa-solid fa-circle-check';
        }
      });
      
      if (explanationBox) {
        explanationBox.innerHTML = `<strong>${answered === 'correct' ? '✅ لقد أجبت على تحدي اليوم بنجاح:' : '❌ لقد شاركت في سؤال اليوم بالفعل:'}</strong><br>TCP هو بروتوكول اتصال موثوق (Connection-Oriented) يضمن وصول البيانات وترتيبها وخلوها من الأخطاء عبر تقنيات إعادة الإرسال والتحقق.`;
        explanationBox.classList.add('active');
        explanationBox.style.display = 'block';
      }
    }
  }

  // -------------------------------------------------------------
  // 2. Comprehensive Ports Database & Search Engine
  // -------------------------------------------------------------
  const portDatabase = [
    { port: "20/21", service: "FTP", proto: "TCP", secure: false, cat: "نقل الملفات", desc: "بروتوكول نقل الملفات التقليدي. يرسل البيانات وكلمات المرور بنص واضح (Cleartext) وغير مشفر، مما يجعله عرضة للتصنت وسرقة البيانات بسهولة.", cmd: "ftp <ip_address>" },
    { port: "22", service: "SSH / SFTP", proto: "TCP", secure: true, cat: "التحكم الآمن", desc: "بروتوكول التحكم الآمن عن بعد ونقل الملفات المشفرة. يُشفر كامل البيانات وجلسات العمل لحمايتها من المتسللين وهجمات الوسطاء.", cmd: "ssh user@server-ip" },
    { port: "23", service: "Telnet", proto: "TCP", secure: false, cat: "التحكم عن بعد", desc: "أداة تحكم نصية قديمة جداً. ترسل بيانات المرور بنصوص واضحة غير مشفرة. يُنصح بحظرها واستبدالها بـ SSH فوراً بالخوادم.", cmd: "telnet <ip_address>" },
    { port: "25", service: "SMTP", proto: "TCP", secure: false, cat: "البريد الإلكتروني", desc: "بروتوكول نقل البريد البسيط. يستخدم لإرسال رسائل البريد الإلكتروني بين الخوادم دون تشفير افتراضي.", cmd: "sendmail -vt" },
    { port: "53", service: "DNS", proto: "UDP/TCP", secure: true, cat: "خدمات الأسماء", desc: "نظام أسماء النطاقات. يترجم أسماء المواقع (مثل google.com) إلى عناوين IP. يعمل غالباً عبر UDP لتسريع الاستجابة للعملاء.", cmd: "nslookup google.com" },
    { port: "67/68", service: "DHCP", proto: "UDP", secure: true, cat: "توزيع العناوين", desc: "بروتوكول التهيئة الديناميكية للمضيفين. يقوم بتوزيع عناوين الـ IP والإعدادات التلقائية (DNS, Gateway) على الأجهزة في الشبكة.", cmd: "ipconfig /renew" },
    { port: "80", service: "HTTP", proto: "TCP", secure: false, cat: "تصفح الويب", desc: "بروتوكول نقل النص الفائق لتصفح الإنترنت. غير مشفر ويعرض بيانات تسجيل دخول المستخدمين للسرقة. يجب استبداله بـ HTTPS.", cmd: "curl http://example.com" },
    { port: "110", service: "POP3", proto: "TCP", secure: false, cat: "البريد الإلكتروني", desc: "بروتوكول استلام البريد الإلكتروني. يقوم بتحميل الرسائل وجلبها من السيرفر إلى جهاز المستخدم دون تشفير تلقائي.", cmd: "telnet pop.server.com 110" },
    { port: "123", service: "NTP", proto: "UDP", secure: true, cat: "مزامنة الوقت", desc: "بروتوكول وقت الشبكة. يضمن مزامنة الساعة والتوقيت بدقة متناهية بين جميع السيرفرات والأجهزة في الشبكة لمنع مشاكل المصادقة.", cmd: "w32tm /query /status" },
    { port: "143", service: "IMAP", proto: "TCP", secure: false, cat: "البريد الإلكتروني", desc: "بروتوكول الوصول لرسائل البريد الإلكتروني. يسمح بقراءة وتصفح البريد مباشرة على السيرفر دون الحاجة لتحميله بالكامل محلياً.", cmd: "openssl s_client -connect imap.mail.com:143" },
    { port: "389", service: "LDAP", proto: "TCP/UDP", secure: false, cat: "الدليل والتعريف", desc: "بروتوكول الوصول للدليل الخفيف. يُسخدم للاستعلام والتحقق من الهويات في الدليل النشط Active Directory بشكل مباشر وغير مشفر.", cmd: "Get-ADUser -Filter *" },
    { port: "443", service: "HTTPS", proto: "TCP", secure: true, cat: "تصفح الويب", desc: "بروتوكول الويب الآمن. يشفر جميع البيانات المتبادلة بين المتصفح والسيرفر باستخدام شهادات SSL/TLS لحماية السرية الكاملة.", cmd: "curl https://google.com" },
    { port: "445", service: "SMB / CIFS", proto: "TCP", secure: true, cat: "مشاركة الملفات", desc: "بروتوكول مشاركة الملفات والطابعات في بيئة ويندوز. تستخدمه شبكات Active Directory لنقل السياسات ومشاركة المجلدات والأصول.", cmd: "net use Z: \\\\server\\share" },
    { port: "636", service: "LDAPS", proto: "TCP", secure: true, cat: "الدليل والتعريف", desc: "نسخة LDAP الآمنة والمشفرة بالكامل باستخدام SSL/TLS لحماية بيانات تسجيل دخول الموظفين وعمليات الاستعلام في Active Directory.", cmd: "Resolve-DnsName -Name ldap.local" },
    { port: "993", service: "IMAPS", proto: "TCP", secure: true, cat: "البريد الإلكتروني", desc: "بروتوكول IMAP المشفر والآمن لاستلام وقراءة رسائل البريد الإلكتروني بحماية تشفير SSL/TLS كاملة.", cmd: "openssl s_client -crlf -connect imap.gmail.com:993" },
    { port: "995", service: "POP3S", proto: "TCP", secure: true, cat: "البريد الإلكتروني", desc: "بروتوكول POP3 المشفر والآمن لجلب الرسائل محلياً بطبقة حماية تشفير SSL/TLS آمنة ومحمية.", cmd: "openssl s_client -connect pop.gmail.com:995" },
    { port: "1433", service: "Microsoft SQL", proto: "TCP", secure: true, cat: "قواعد البيانات", desc: "المنفذ الافتراضي لخادم قواعد بيانات Microsoft SQL Server الشهير لإدارة وتنظيم الجداول والبيانات والتعامل مع التطبيقات.", cmd: "sqlcmd -S server_ip" },
    { port: "3306", service: "MySQL", proto: "TCP", secure: true, cat: "قواعد البيانات", desc: "المنفذ الافتراضي لقواعد بيانات MySQL مفتوحة المصدر، المستخدمة بكثافة في مواقع وتطبيقات الويب ولينكس لإدارة وتخزين البيانات.", cmd: "mysql -u root -p -h ip" },
    { port: "3389", service: "RDP", proto: "TCP/UDP", secure: true, cat: "التحكم عن بعد", desc: "بروتوكول سطح المكتب البعيد من مايكروسوفت. يتيح واجهة رسومية كاملة للتحكم في خوادم ويندوز البعيدة وإدارة بيئة العمل.", cmd: "mstsc /v:<ip_address>" },
    { port: "5985/5986", service: "WinRM", proto: "TCP", secure: true, cat: "التحكم والأنظمة", desc: "إدارة ويندوز عن بعد. يتيح تشغيل أوامر PowerShell البعيدة (5985 لـ HTTP العادي، و 5986 لـ HTTPS المشفر).", cmd: "Enter-PSSession -ComputerName srv" }
  ];

  window.filterPorts = function() {
    const query = document.getElementById('port-search-input').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('ports-results');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    
    const filtered = portDatabase.filter(item => {
      return item.port.toLowerCase().includes(query) ||
             item.service.toLowerCase().includes(query) ||
             item.cat.toLowerCase().includes(query) ||
             item.desc.toLowerCase().includes(query) ||
             (item.secure ? 'secure safe آمن مشفر' : 'vulnerable cleartext غير آمن مكشوف').toLowerCase().includes(query);
    });
    
    if (filtered.length === 0) {
      resultsContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 2.5rem; color: var(--warning); margin-bottom: 1rem;"></i>
          <p>لم نجد أي منافذ تطابق بحثك. جرب البحث عن منافذ أخرى مثل 22 أو 443.</p>
        </div>
      `;
      return;
    }
    
    filtered.forEach((item, index) => {
      const card = document.createElement('div');
      const delayClass = `delay-${(index % 5) + 1}`;
      card.className = `port-item-card animate-card ${delayClass}`;
      
      const secureBadge = item.secure 
        ? `<span class="port-badge secure"><i class="fa-solid fa-shield-halved"></i> آمن (Secure)</span>`
        : `<span class="port-badge vulnerable"><i class="fa-solid fa-triangle-exclamation"></i> غير آمن (Cleartext)</span>`;
         
      card.innerHTML = `
        <div class="port-card-header">
          <div class="port-number">${item.port}</div>
          <div class="port-service">${item.service}</div>
        </div>
        <div style="font-size:0.85rem; color:var(--accent-secondary); margin-bottom:0.5rem; font-weight:700;">
          <i class="fa-solid fa-folder-open"></i> ${item.cat} | <span style="font-family:monospace; background:rgba(255,255,255,0.05); padding:2px 6px; border-radius:4px;">${item.proto}</span>
        </div>
        <p class="port-desc">${item.desc}</p>
        <div class="port-cmd-box">
          <div class="port-cmd-title">مثال أمر للاستخدام:</div>
          <code class="port-cmd-text">${escapeHTML(item.cmd)}</code>
        </div>
        <div style="margin-top:0.75rem; display:flex; justify-content:space-between; align-items:center;">
          ${secureBadge}
        </div>
      `;
      resultsContainer.appendChild(card);
    });
  };

  // -------------------------------------------------------------
  // 3. Home Lab IP Address Planner & Conflict Checker
  // -------------------------------------------------------------
  window.verifyIPPlanning = function() {
    playClick();
    const ipRouter = document.getElementById('ip-router').value.trim();
    const ipWin = document.getElementById('ip-win').value.trim();
    const ipLinux = document.getElementById('ip-linux').value.trim();
    const ipDhcpStart = document.getElementById('ip-dhcp-start').value.trim();
    const ipDhcpEnd = document.getElementById('ip-dhcp-end').value.trim();
    const resultBox = document.getElementById('ip-result');
    
    if (!resultBox) return;
    
    // IP validation Regex
    const ipPattern = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    const inputs = [
      { name: "عنوان الراوتر (Router IP)", val: ipRouter },
      { name: "خادم ويندوز (Windows Server IP)", val: ipWin },
      { name: "خادم لينكس (Linux Server IP)", val: ipLinux },
      { name: "بداية نطاق DHCP (Scope Start)", val: ipDhcpStart },
      { name: "نهاية نطاق DHCP (Scope End)", val: ipDhcpEnd }
    ];
    
    let invalidInputs = [];
    inputs.forEach(inp => {
      if (!ipPattern.test(inp.val)) {
        invalidInputs.push(inp.name);
      }
    });
    
    if (invalidInputs.length > 0) {
      playSynthSound(220, 'sawtooth', 0.25, 0.05); // Error sound
      resultBox.className = 'result-box wrong';
      resultBox.style.display = 'block';
      resultBox.innerHTML = `⚠️ <b>خطأ في إدخال العناوين!</b><br>
        العناوين التالية غير صالحة ولا تتبع التنسيق الصحيح للـ IPv4 (مثال: 192.168.1.1):<br>
        • ` + invalidInputs.join('<br>• ');
      return;
    }
    
    const ipToLong = (ip) => {
      return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
    };
    
    const cidr = parseInt(document.getElementById('ip-cidr')?.value || '24');
    const maskLong = (~(Math.pow(2, 32 - cidr) - 1)) >>> 0;
    const maskText = [
      (maskLong >>> 24) & 255,
      (maskLong >>> 16) & 255,
      (maskLong >>> 8) & 255,
      maskLong & 255
    ].join('.');
    
    const getNetworkAddress = (ipLong, maskLong) => (ipLong & maskLong) >>> 0;
    
    const routerLong = ipToLong(ipRouter);
    const winLong = ipToLong(ipWin);
    const linuxLong = ipToLong(ipLinux);
    const startLong = ipToLong(ipDhcpStart);
    const endLong = ipToLong(ipDhcpEnd);
    
    const routerNet = getNetworkAddress(routerLong, maskLong);
    const winNet = getNetworkAddress(winLong, maskLong);
    const linuxNet = getNetworkAddress(linuxLong, maskLong);
    const startNet = getNetworkAddress(startLong, maskLong);
    const endNet = getNetworkAddress(endLong, maskLong);
    
    let subnetConflicts = [];
    if (routerNet !== winNet) subnetConflicts.push("خادم ويندوز يقع في شبكة فرعية مختلفة عن الراوتر.");
    if (routerNet !== linuxNet) subnetConflicts.push("خادم لينكس يقع في شبكة فرعية مختلفة عن الراوتر.");
    if (routerNet !== startNet) subnetConflicts.push("بداية نطاق DHCP تقع في شبكة فرعية مختلفة عن الراوتر.");
    if (routerNet !== endNet) subnetConflicts.push("نهاية نطاق DHCP تقع في شبكة فرعية مختلفة عن الراوتر.");
    
    if (subnetConflicts.length > 0) {
      playSynthSound(220, 'sawtooth', 0.25, 0.05); // Error sound
      resultBox.className = 'result-box wrong';
      resultBox.style.display = 'block';
      resultBox.innerHTML = `🚨 <b>تحذير: تعارض في الشبكة الفرعية (Subnet Mismatch)!</b><br>
        لتتمكن الأجهزة من الاتصال ببعضها دون توجيه وسيط، يجب أن تقع في نفس الـ Subnet (مثال أن تبدأ بـ ${[
          (routerNet >>> 24) & 255,
          (routerNet >>> 16) & 255,
          (routerNet >>> 8) & 255,
          routerNet & 255
        ].join('.')}/${cidr}):<br>
        • ` + subnetConflicts.join('<br>• ');
      return;
    }
    
    if (startLong >= endLong) {
      playSynthSound(220, 'sawtooth', 0.25, 0.05); // Error sound
      resultBox.className = 'result-box wrong';
      resultBox.style.display = 'block';
      resultBox.innerHTML = `🚨 <b>خطأ في نطاق DHCP!</b><br>
        بداية نطاق الـ DHCP يجب أن تكون أصغر من نهاية النطاق.`;
      return;
    }
    
    // Duplicate Static IP Checker & Dynamic Overlaps
    let conflicts = [];
    if (ipRouter === ipWin) conflicts.push(`الراوتر وخادم ويندوز يحملان نفس عنوان الـ IP الساكن (${ipRouter}).`);
    if (ipRouter === ipLinux) conflicts.push(`الراوتر وخادم لينكس يحملان نفس عنوان الـ IP الساكن (${ipRouter}).`);
    if (ipWin === ipLinux) conflicts.push(`خادم ويندوز وخادم لينكس يحملان نفس عنوان الـ IP الساكن (${ipWin}).`);
    
    const isInDhcp = (ipLong) => ipLong >= startLong && ipLong <= endLong;
    
    if (isInDhcp(routerLong)) conflicts.push(`عنوان الراوتر الساكن (${ipRouter}) يقع داخل نطاق توزيع الـ DHCP [${ipDhcpStart} - ${ipDhcpEnd}]. خطر توزع العنوان تلقائياً لجهاز آخر وحدوث انقطاع للشبكة!`);
    if (isInDhcp(winLong)) conflicts.push(`عنوان خادم ويندوز (${ipWin}) يقع داخل نطاق الـ DHCP [${ipDhcpStart} - ${ipDhcpEnd}]. سيؤدي هذا لتصادم الـ IP (IP Conflict) عند محاولة موظف الاتصال بالشبكة!`);
    if (isInDhcp(linuxLong)) conflicts.push(`عنوان خادم لينكس (${ipLinux}) يقع داخل نطاق الـ DHCP [${ipDhcpStart} - ${ipDhcpEnd}]. خطر تصادم العناوين وتوقف موقع الويب!`);
    
    if (conflicts.length > 0) {
      playSynthSound(180, 'sawtooth', 0.4, 0.08); // warning alarm
      resultBox.className = 'result-box wrong';
      resultBox.style.display = 'block';
      resultBox.innerHTML = `🚨 <b>اكتشاف تداخل وتصادم في عناوين المعمل!</b><br>
        تم العثور على أخطاء في التخطيط ستؤدي إلى مشاكل عدم اتصال (IP Conflicts):<br>
        • ` + conflicts.join('<br>• ') + `<br><br><b>💡 نصيحة مهندس:</b> قم بحجز نطاق معزول للعناوين الساكنة (Static IPs) للأجهزة الرئيسية والراوتر، وتأكد من أن نطاق الـ DHCP يبدأ خارجها تماماً لمنع أي تعارض!`;
    } else {
      playSuccessSound();
      resultBox.className = 'result-box correct';
      resultBox.style.display = 'block';
      resultBox.innerHTML = `🎉 <b>توزيع العناوين مثالي وآمن 100%!</b><br>
        • جميع الأجهزة الرئيسية تقع خارج نطاق توزيع الـ DHCP، مما يضمن ثبات عناوين السيرفرات والراوتر.<br>
        • تقع الأجهزة في نفس الشبكة الفرعية (${[
          (routerNet >>> 24) & 255,
          (routerNet >>> 16) & 255,
          (routerNet >>> 8) & 255,
          routerNet & 255
        ].join('.')}/${cidr}) وقناعها ${maskText}.<br>
        • تم عزل العناوين الساكنة بالكامل عن النطاق الديناميكي [${ipDhcpStart} - ${ipDhcpEnd}].<br>
        معملك جاهز الآن للتشغيل بأعلى درجات الاستقرار والموثوقية! 🖥️🌐`;
    }
  };

  // -------------------------------------------------------------
  // 4. Premium: Disaster Recovery Backup RTO/RPO Simulator
  // -------------------------------------------------------------
  window.calculateDRSimulator = function() {
    const sizeTB = parseFloat(document.getElementById('dr-data-size').value) || 10;
    const speedMbps = parseFloat(document.getElementById('dr-bandwidth').value) || 1000;
    const schedule = document.getElementById('dr-schedule').value;
    const downtimeCost = parseFloat(document.getElementById('dr-downtime-cost').value) || 500;
    
    // Calculate Backup Duration
    const sizeBits = sizeTB * 1024 * 1024 * 1024 * 1024 * 8;
    const speedBps = speedMbps * 1000 * 1000;
    const durationSeconds = sizeBits / speedBps;
    const durationHours = durationSeconds / 3600;
    
    const hourVal = Math.floor(durationHours);
    const minVal = Math.round((durationHours - hourVal) * 60);
    
    const windowTimeText = `${hourVal} ساعة و ${minVal} دقيقة`;
    document.getElementById('dr-backup-window-time').textContent = windowTimeText;
    
    // Progress Bar for Backup Window
    const progressPercent = Math.min((durationHours / 24) * 100, 100);
    const progressBar = document.getElementById('dr-backup-window-progress');
    const statusLabel = document.getElementById('dr-backup-window-status');
    
    if (progressBar) progressBar.style.width = `${progressPercent}%`;
    
    if (durationHours > 24) {
      if (progressBar) progressBar.style.background = 'var(--danger)';
      statusLabel.innerHTML = `<span style="color:var(--danger); font-weight:700;"><i class="fa-solid fa-triangle-exclamation"></i> اختناق شديد! النافذة تتخطى 24 ساعة.</span>`;
    } else if (durationHours > 8) {
      if (progressBar) progressBar.style.background = 'var(--warning)';
      statusLabel.innerHTML = `<span style="color:var(--warning); font-weight:700;"><i class="fa-solid fa-clock"></i> مدة طويلة نسبياً؛ قد تؤثر على أداء الشبكة نهاراً.</span>`;
    } else {
      if (progressBar) progressBar.style.background = 'var(--success)';
      statusLabel.innerHTML = `<span style="color:var(--success); font-weight:700;"><i class="fa-solid fa-circle-check"></i> نافذة نسخ آمنة وسريعة للشبكة.</span>`;
    }
    
    // RPO Calculation (Recovery Point Objective - Max Data Loss)
    let rpoText = "";
    let rpoDesc = "";
    if (schedule === 'weekly') {
      rpoText = "إلى 7 أيام 🚨";
      rpoDesc = "خسارة بيانات تصل لـ أسبوع كامل للموظفين عند توقف النظام.";
    } else if (schedule === 'daily') {
      rpoText = "إلى 24 ساعة ⚠️";
      rpoDesc = "أقصى خسارة بيانات متوقعة: يوم عمل كامل.";
    } else {
      rpoText = "إلى ساعة واحدة 🛡️";
      rpoDesc = "بيانات الشركة محمية تقريباً طوال الوقت ضد الفقد المفاجئ.";
    }
    document.getElementById('dr-rpo-value').textContent = rpoText;
    document.getElementById('dr-rpo-desc').textContent = rpoDesc;
    
    // RTO Calculation (Recovery Time Objective - Restore Speed)
    const restoreHours = durationHours * 1.3; // 30% overhead
    const restHourVal = Math.floor(restoreHours);
    const restMinVal = Math.round((restoreHours - restHourVal) * 60);
    
    const rtoText = `${restHourVal} ساعة و ${restMinVal} دقيقة`;
    document.getElementById('dr-rto-value').textContent = rtoText;
    
    // Financial Losses
    const totalLoss = Math.round(restoreHours * downtimeCost);
    document.getElementById('dr-loss-value').textContent = `خسارة مالية مقدرة: $${totalLoss.toLocaleString()}`;
    
    // Compliance and rating card
    const complianceCard = document.getElementById('dr-compliance-card');
    if (complianceCard) {
      if (schedule === 'weekly' || durationHours > 24) {
        complianceCard.className = 'result-box wrong';
        complianceCard.innerHTML = `⚠️ <b>مخاطر عالية في خطة استمرارية الأعمال!</b><br>
          • سرعة الشبكة منخفضة مقارنة بحجم البيانات، مما يعيق النسخ الكامل بنجاح.<br>
          • الـ RPO مرتفع جداً؛ خطر فقدان أسبوع كامل من المبيعات وملفات الموظفين الحيوية.<br>
          <b>💡 اقتراح مهندس:</b> قم بترقية كروت الشبكة بالمعمل لـ 10Gbps أو انقل السرفرات لنطاق الحوسبة السحابية (Cloud) لتنفيذ النسخ اللحظي Snapshot.`;
      } else if (durationHours > 8) {
        complianceCard.className = 'result-box wrong';
        complianceCard.style.borderColor = 'var(--warning)';
        complianceCard.innerHTML = `⚠️ <b>الخطة متوسطة الأمان وتحتاج للتحسين:</b><br>
          • الخطة آمنة لحماية ملفات الشركة الأساسية يومياً.<br>
          • نافذة النسخ الطويلة (.${hourVal} ساعة) تتطلب جدولة النسخ متأخراً بعد منتصف الليل لتجنب إبطاء شبكة الشركة.<br>
          • الخسارة المالية المتوقعة ($${totalLoss.toLocaleString()}) متوسطة ولكنها مقبولة لبعض الشركات الناشئة.`;
      } else {
        complianceCard.className = 'result-box correct';
        complianceCard.innerHTML = `🎉 <b>خطة تعافي وكوارث مثالية ومتطابقة مع المعايير العالمية!</b><br>
          • نافذة النسخ قصيرة جداً وممتازة (${windowTimeText}) بفضل الباندويدث العالي.<br>
          • التزام تام بـ RTO قصير جداً وخسائر مالية شبه منعدمة للشركة عند تعطل الأنظمة.<br>
          • معملك يتبع المعايير القياسية العالمية لإدارة النسخ الاحتياطي وحفظ بيانات المؤسسة!`;
      }
    }
  };

  // -------------------------------------------------------------
  // 5. Premium: Active Directory Group Policy (GPO) Sandbox
  // -------------------------------------------------------------
  window.updateGPOSandbox = function() {
    const gpoComplexity = document.getElementById('gpo-pass-complexity').checked;
    const gpoCP = document.getElementById('gpo-restrict-cp').checked;
    const gpoUSB = document.getElementById('gpo-block-usb').checked;
    const gpoLock = document.getElementById('gpo-screen-lock').checked;
    
    let score = 35; // baseline insecure Active Directory
    if (gpoComplexity) score += 20;
    if (gpoCP) score += 15;
    if (gpoUSB) score += 20;
    if (gpoLock) score += 10;
    
    const scoreEl = document.getElementById('gpo-health-score');
    const statusEl = document.getElementById('gpo-health-status');
    
    scoreEl.textContent = `${score}%`;
    
    if (score < 50) {
      scoreEl.style.color = 'var(--danger)';
      statusEl.innerHTML = `بيئة معرضة للاختراق ⚠️`;
      statusEl.style.color = 'var(--danger)';
    } else if (score < 80) {
      scoreEl.style.color = 'var(--warning)';
      statusEl.innerHTML = `بيئة متوسطة الحماية 🛡️`;
      statusEl.style.color = 'var(--warning)';
    } else {
      scoreEl.style.color = 'var(--success)';
      statusEl.innerHTML = `بيئة فائقة الأمان ومحمية بالكامل 👑`;
      statusEl.style.color = 'var(--success)';
    }
    
    // Generate PowerShell snippet
    let codeSnippet = `# PowerShell Active Directory GPO Setup\n`;
    codeSnippet += `# لتطبيق السياسات المفعلة بالأعلى:\n\n`;
    
    let policiesCount = 0;
    if (gpoComplexity) {
      codeSnippet += `# 1. Enforce Password Complexity\n`;
      codeSnippet += `Set-ADDefaultDomainPasswordPolicy -Identity "it-roadmap.local" -ComplexityEnabled $true -MinPasswordLength 8 -PasswordHistoryCount 24\n\n`;
      policiesCount++;
    }
    if (gpoCP) {
      codeSnippet += `# 2. Restrict Control Panel Access via Registry Policy GPO\n`;
      codeSnippet += `Set-GPRegistryValue -Name "Restrict_Control_Panel" -Key "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer" -ValueName "NoControlPanel" -Type DWord -Value 1\n\n`;
      policiesCount++;
    }
    if (gpoUSB) {
      codeSnippet += `# 3. Disable USB Storage Removable Media GPO\n`;
      codeSnippet += `Set-GPRegistryValue -Name "Disable_USB_Storage" -Key "HKLM\\Software\\Policies\\Microsoft\\Windows\\RemovableStorageDevices\\{53f5630d-b6bf-11d0-94f2-00a0c91efb8b}" -ValueName "Deny_Read" -Type DWord -Value 1\n`;
      codeSnippet += `Set-GPRegistryValue -Name "Disable_USB_Storage" -Key "HKLM\\Software\\Policies\\Microsoft\\Windows\\RemovableStorageDevices\\{53f5630d-b6bf-11d0-94f2-00a0c91efb8b}" -ValueName "Deny_Write" -Type DWord -Value 1\n\n`;
      policiesCount++;
    }
    if (gpoLock) {
      codeSnippet += `# 4. Enforce Screen Saver Lock Timeout GPO\n`;
      codeSnippet += `Set-GPRegistryValue -Name "Screen_Saver_Lock" -Key "HKCU\\Control Panel\\Desktop" -ValueName "ScreenSaveActive" -Type String -Value "1"\n`;
      codeSnippet += `Set-GPRegistryValue -Name "Screen_Saver_Lock" -Key "HKCU\\Control Panel\\Desktop" -ValueName "ScreenSaverIsSecure" -Type String -Value "1"\n`;
      codeSnippet += `Set-GPRegistryValue -Name "Screen_Saver_Lock" -Key "HKCU\\Control Panel\\Desktop" -ValueName "ScreenSaveTimeOut" -Type String -Value "600"\n\n`;
      policiesCount++;
    }
    
    if (policiesCount === 0) {
      codeSnippet = `# قم بتفعيل بعض السياسات بالأعلى لتوليد كود التفعيل التلقائي!`;
    } else {
      codeSnippet += `# لتحديث وإجبار تطبيق السياسات على أجهزة الموظفين فوراً:\n`;
      codeSnippet += `gpupdate /force`;
    }
    
    document.getElementById('gpo-powershell-code').textContent = codeSnippet;
  };
  // -------------------------------------------------------------
  // VLSM Calculator & IP Tools
  // -------------------------------------------------------------
  function ipToLong(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
  }

  function longToIp(long) {
    return [
      (long >>> 24) & 255,
      (long >>> 16) & 255,
      (long >>> 8) & 255,
      long & 255
    ].join('.');
  }

  function cidrToMask(cidr) {
    const maskLong = (~(Math.pow(2, 32 - cidr) - 1)) >>> 0;
    return longToIp(maskLong);
  }

  window.addVLSMRow = function() {
    playClick();
    const container = document.getElementById('vlsm-departments');
    if (!container) return;
    
    const row = document.createElement('div');
    row.className = 'vlsm-row';
    row.style.display = 'flex';
    row.style.gap = '0.75rem';
    row.style.marginBottom = '0.75rem';
    row.style.alignItems = 'center';
    
    row.innerHTML = `
      <input type="text" class="game-input vlsm-dept-name" placeholder="اسم القسم" style="flex-grow:2;">
      <input type="number" class="game-input vlsm-dept-hosts" min="1" max="1000" placeholder="عدد الأجهزة" style="flex-grow:1;">
      <button class="btn btn-secondary" onclick="this.parentElement.remove(); playClick();" style="padding:0.65rem 0.85rem; background:rgba(239, 68, 68, 0.08); border-color:rgba(239, 68, 68, 0.15); color:var(--danger);" title="حذف">×</button>
    `;
    container.appendChild(row);
  };

  window.calculateVLSM = function() {
    playClick();
    const baseInput = document.getElementById('vlsm-base');
    const tableBody = document.getElementById('vlsm-table-results');
    const visualMap = document.getElementById('vlsm-visual-map');
    
    if (!baseInput || !tableBody || !visualMap) return;
    
    const baseVal = baseInput.value.trim();
    const parts = baseVal.split('/');
    if (parts.length !== 2) {
      alert('الرجاء إدخال عنوان الشبكة الرئيسي بالتنسيق الصحيح، مثلاً: 192.168.1.0/24');
      return;
    }
    
    const baseIp = parts[0];
    const baseCidr = parseInt(parts[1]) || 24;
    
    const ipPattern = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipPattern.test(baseIp) || baseCidr < 1 || baseCidr > 32) {
      alert('الرجاء إدخال عنوان IP وقناع CIDR صحيحين.');
      return;
    }
    
    const baseLong = ipToLong(baseIp);
    const baseSize = Math.pow(2, 32 - baseCidr);
    
    // Parse departments
    const deptRows = document.querySelectorAll('.vlsm-row');
    const departments = [];
    
    deptRows.forEach(row => {
      const nameInput = row.querySelector('.vlsm-dept-name');
      const hostsInput = row.querySelector('.vlsm-dept-hosts');
      if (nameInput && hostsInput) {
        const name = nameInput.value.trim() || 'قسم غير مسمى';
        const hosts = parseInt(hostsInput.value) || 0;
        if (hosts > 0) {
          departments.push({ name, hosts });
        }
      }
    });
    
    if (departments.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted);">يرجى إضافة قسم واحد على الأقل وإدخل عدد الأجهزة المطلوبة.</td></tr>`;
      visualMap.innerHTML = '';
      return;
    }
    
    // Sort departments descending by requested hosts (critical VLSM rule)
    departments.sort((a, b) => b.hosts - a.hosts);
    
    let currentOffset = 0;
    let hasOverflow = false;
    const allocatedSubnets = [];
    
    for (let i = 0; i < departments.length; i++) {
      const dept = departments[i];
      const neededHosts = dept.hosts;
      const totalNeeded = neededHosts + 2; // +2 for Network and Broadcast
      
      // Find block size (next power of 2)
      let blockSize = 4;
      while (blockSize < totalNeeded) {
        blockSize *= 2;
      }
      
      const cidr = 32 - Math.log2(blockSize);
      
      if (currentOffset + blockSize > baseSize) {
        hasOverflow = true;
        break;
      }
      
      const subnetLong = baseLong + currentOffset;
      const subnetIp = longToIp(subnetLong);
      const usableStart = longToIp(subnetLong + 1);
      const usableEnd = longToIp(subnetLong + blockSize - 2);
      const broadcastIp = longToIp(subnetLong + blockSize - 1);
      const mask = cidrToMask(cidr);
      
      allocatedSubnets.push({
        name: dept.name,
        hosts: neededHosts,
        subnetIp,
        cidr,
        usableRange: `${usableStart} - ${usableEnd}`,
        broadcastIp,
        mask,
        blockSize,
        offset: currentOffset
      });
      
      currentOffset += blockSize;
    }
    
    if (hasOverflow) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--danger); font-weight:700;">🚨 خطأ: حجم الإدارات المطلوبة يتجاوز المساحة المتاحة في الشبكة الرئيسية! قم بتوسيع نطاق الشبكة (مثلاً استخدام /22) أو تقليل الأجهزة.</td></tr>`;
      visualMap.innerHTML = `<div class="vlsm-block" style="width:100%; background:var(--danger); cursor:default;" data-tooltip="Network Space Exhausted!">مساحة الشبكة غير كافية! 🚨</div>`;
      playSynthSound(220, 'sawtooth', 0.25, 0.05); // Error sound
      return;
    }
    
    playSuccessSound();
    
    // Render Table Rows
    let tableHtml = "";
    allocatedSubnets.forEach(sub => {
      tableHtml += `
        <tr>
          <td style="text-align:right; font-weight:700;">${sub.name}</td>
          <td>${sub.hosts}</td>
          <td>${sub.subnetIp}</td>
          <td>/${sub.cidr}</td>
          <td>${sub.usableRange}</td>
          <td>${sub.broadcastIp}</td>
          <td>${sub.mask}</td>
        </tr>
      `;
    });
    tableBody.innerHTML = tableHtml;
    
    // Render Visual Map
    let mapHtml = "";
    allocatedSubnets.forEach((sub, idx) => {
      const widthPercent = (sub.blockSize / baseSize) * 100;
      const hueValue = (idx * 360 / allocatedSubnets.length) % 360;
      const bg = `hsla(${hueValue}, 70%, 45%, 0.7)`;
      
      mapHtml += `
        <div class="vlsm-block vlsm-block-used" style="width:${widthPercent}%; background:${bg};" 
             data-tooltip="${sub.name}: ${sub.subnetIp}/${sub.cidr} (${sub.usableRange})">
          ${sub.name.split(' ')[0]} (/${sub.cidr})
        </div>
      `;
    });
    
    if (currentOffset < baseSize) {
      const freeSize = baseSize - currentOffset;
      const widthPercent = (freeSize / baseSize) * 100;
      const freeStart = longToIp(baseLong + currentOffset);
      const freeEnd = longToIp(baseLong + baseSize - 1);
      
      mapHtml += `
        <div class="vlsm-block vlsm-block-free" style="width:${widthPercent}%;" 
             data-tooltip="مساحة حرة غير مستغلة: ${freeStart} - ${freeEnd}">
          Free (/${32 - Math.log2(freeSize)})
        </div>
      `;
    }
    visualMap.innerHTML = mapHtml;
  };

  // -------------------------------------------------------------
  // Network Outage Troubleshooting Simulator Logic
  // -------------------------------------------------------------
  let currentNetScenario = 'dns';
  let netScenarioRepaired = false;

  window.loadNetworkScenario = function() {
    const scenarioSelect = document.getElementById('net-sim-scenario');
    if (!scenarioSelect) return;
    
    currentNetScenario = scenarioSelect.value;
    netScenarioRepaired = false;
    
    // Clear terminal
    const term = document.getElementById('net-sim-term');
    if (term) {
      term.innerHTML = `<div>[SYSTEM]: Outage simulator terminal loaded for Ticket 10${currentNetScenario === 'dns' ? '1' : currentNetScenario === 'firewall' ? '2' : '3'}.</div>`;
      term.innerHTML += `<div>Type 'help' to see diagnostic command list.</div>`;
    }
    
    // Clear result
    const resultBox = document.getElementById('net-sim-result');
    if (resultBox) {
      resultBox.style.display = 'none';
      resultBox.innerHTML = '';
    }
    
    // Reset repair selector
    const repairSelect = document.getElementById('net-sim-repair-action');
    if (repairSelect) {
      repairSelect.value = 'none';
    }
    
    updateNetSimNodes();
  };

  function updateNetSimNodes() {
    const clientNode = document.getElementById('node-client');
    const routerNode = document.getElementById('node-router');
    const dnsNode = document.getElementById('node-dns');
    const webNode = document.getElementById('node-web');
    
    if (!clientNode || !routerNode || !dnsNode || !webNode) return;
    
    // Reset all to success (green)
    clientNode.className = 'fa-solid fa-desktop';
    clientNode.style.color = 'var(--success)';
    
    routerNode.className = 'fa-solid fa-route';
    routerNode.style.color = 'var(--success)';
    
    dnsNode.className = 'fa-solid fa-server';
    dnsNode.style.color = 'var(--success)';
    
    webNode.className = 'fa-solid fa-globe';
    webNode.style.color = 'var(--success)';
    
    if (netScenarioRepaired) return; // All green if repaired
    
    if (currentNetScenario === 'dns') {
      dnsNode.style.color = 'var(--warning)';
    } else if (currentNetScenario === 'firewall') {
      webNode.style.color = 'var(--danger)';
    } else if (currentNetScenario === 'gateway') {
      routerNode.style.color = 'var(--danger)';
    }
  }

  window.handleSimCliKey = function(e) {
    if (e.key === 'Enter') {
      const input = document.getElementById('net-sim-input');
      if (input) {
        const cmd = input.value.trim();
        runSimCli(cmd);
        input.value = '';
      }
    }
  };

  window.runSimCli = function(cmd) {
    playClick();
    const term = document.getElementById('net-sim-term');
    if (!term) return;
    
    const cmdLine = document.createElement('div');
    cmdLine.style.marginTop = '0.5rem';
    cmdLine.innerHTML = `<span style="color:#ef4444; font-weight:700;">client:~$</span> ${escapeHTML(cmd)}`;
    term.appendChild(cmdLine);
    
    const output = document.createElement('div');
    output.style.color = '#38bdf8';
    
    const normalized = cmd.toLowerCase().trim();
    const parts = normalized.split(' ');
    const primary = parts[0];
    
    if (primary === 'help') {
      output.innerHTML = `Available diagnostic commands:<br>
        - <b>ipconfig</b> : Show current IP configuration on client.<br>
        - <b>ping &lt;ip&gt;</b> : Test target connection (e.g. ping 8.8.8.8).<br>
        - <b>nslookup &lt;domain&gt;</b> : Resolve domain name (e.g. nslookup google.com).<br>
        - <b>telnet &lt;ip&gt; &lt;port&gt;</b> : Verify open TCP port (e.g. telnet 192.168.1.15 80).<br>
        - <b>clear</b> : Clear terminal screen.`;
    } else if (primary === 'clear') {
      term.innerHTML = '';
      return;
    } else if (primary === 'ipconfig') {
      if (netScenarioRepaired) {
        output.innerHTML = `Windows IP Configuration<br><br>
          Ethernet adapter Local Area Connection:<br>
          &nbsp;&nbsp;IPv4 Address. . . . . . . . . . . : 192.168.1.55<br>
          &nbsp;&nbsp;Subnet Mask . . . . . . . . . . : 255.255.255.0<br>
          &nbsp;&nbsp;Default Gateway . . . . . . . . : 192.168.1.1<br>
          &nbsp;&nbsp;DNS Servers . . . . . . . . . . : 192.168.1.10`;
      } else {
        if (currentNetScenario === 'dns') {
          output.innerHTML = `Windows IP Configuration<br><br>
            Ethernet adapter Local Area Connection:<br>
            &nbsp;&nbsp;IPv4 Address. . . . . . . . . . . : 192.168.1.55<br>
            &nbsp;&nbsp;Subnet Mask . . . . . . . . . . : 255.255.255.0<br>
            &nbsp;&nbsp;Default Gateway . . . . . . . . : 192.168.1.1<br>
            &nbsp;&nbsp;DNS Servers . . . . . . . . . . : 8.8.8.8 <span style="color:var(--warning); font-weight:700;">(Conflicts: Public resolver can't see local web.corp!)</span>`;
        } else if (currentNetScenario === 'gateway') {
          output.innerHTML = `Windows IP Configuration<br><br>
            Ethernet adapter Local Area Connection:<br>
            &nbsp;&nbsp;IPv4 Address. . . . . . . . . . . : 192.168.1.55<br>
            &nbsp;&nbsp;Subnet Mask . . . . . . . . . . : 255.255.255.0<br>
            &nbsp;&nbsp;Default Gateway . . . . . . . . : 192.168.1.254 <span style="color:var(--danger); font-weight:700;">(Invalid Gateway, local router is .1!)</span><br>
            &nbsp;&nbsp;DNS Servers . . . . . . . . . . : 192.168.1.10`;
        } else {
          // firewall
          output.innerHTML = `Windows IP Configuration<br><br>
            Ethernet adapter Local Area Connection:<br>
            &nbsp;&nbsp;IPv4 Address. . . . . . . . . . . : 192.168.1.55<br>
            &nbsp;&nbsp;Subnet Mask . . . . . . . . . . : 255.255.255.0<br>
            &nbsp;&nbsp;Default Gateway . . . . . . . . : 192.168.1.1<br>
            &nbsp;&nbsp;DNS Servers . . . . . . . . . . : 192.168.1.10`;
        }
      }
    } else if (primary === 'ping') {
      const dest = parts[1];
      if (!dest) {
        output.style.color = 'var(--danger)';
        output.textContent = 'ping: missing destination address.';
      } else {
        if (netScenarioRepaired) {
          output.innerHTML = `Pinging ${escapeHTML(dest)} with 32 bytes of data:<br>
            Reply from ${escapeHTML(dest)}: bytes=32 time=1.4ms TTL=64<br>
            Reply from ${escapeHTML(dest)}: bytes=32 time=1.7ms TTL=64<br>
            Ping statistics for ${escapeHTML(dest)}:<br>
            &nbsp;&nbsp;Packets: Sent = 2, Received = 2, Lost = 0 (0% loss)`;
        } else {
          if (currentNetScenario === 'gateway') {
            if (dest === '192.168.1.10' || dest === '192.168.1.15' || dest === '192.168.1.1') {
              output.innerHTML = `Pinging ${escapeHTML(dest)} with 32 bytes of data:<br>
                Reply from ${escapeHTML(dest)}: bytes=32 time=2.3ms TTL=64<br>
                Packets: Sent = 2, Received = 2, Lost = 0 (0% loss)`;
            } else {
              output.innerHTML = `Pinging ${escapeHTML(dest)} with 32 bytes of data:<br>
                Request timed out.<br>
                Request timed out.<br>
                Packets: Sent = 2, Received = 0, Lost = 2 (100% loss)`;
            }
          } else {
            // DNS or Firewall scenario, local routing works
            output.innerHTML = `Pinging ${escapeHTML(dest)} with 32 bytes of data:<br>
              Reply from ${escapeHTML(dest)}: bytes=32 time=1.3ms TTL=64<br>
              Packets: Sent = 2, Received = 2, Lost = 0 (0% loss)`;
          }
        }
      }
    } else if (primary === 'nslookup') {
      const domain = parts[1];
      if (!domain) {
        output.style.color = 'var(--danger)';
        output.textContent = 'nslookup: missing domain name.';
      } else {
        if (netScenarioRepaired) {
          output.innerHTML = `Server:&nbsp;&nbsp;domain-controller.local<br>
            Address:&nbsp;&nbsp;192.168.1.10<br><br>
            Name:&nbsp;&nbsp;&nbsp;&nbsp;${escapeHTML(domain)}<br>
            Address:&nbsp;&nbsp;${domain.includes('web.corp') ? '192.168.1.15' : '142.250.190.46'}`;
        } else {
          if (currentNetScenario === 'dns') {
            if (domain.includes('web.corp') || domain.includes('intranet.local')) {
              output.innerHTML = `Server:&nbsp;&nbsp;google-public-dnsa.google.com<br>
                Address:&nbsp;&nbsp;8.8.8.8<br><br>
                *** google-public-dnsa.google.com can't find ${escapeHTML(domain)}: Non-existent domain`;
            } else {
              output.innerHTML = `Server:&nbsp;&nbsp;google-public-dnsa.google.com<br>
                Address:&nbsp;&nbsp;8.8.8.8<br><br>
                Name:&nbsp;&nbsp;&nbsp;&nbsp;${escapeHTML(domain)}<br>
                Address:&nbsp;&nbsp;142.250.190.46`;
            }
          } else if (currentNetScenario === 'gateway') {
            output.innerHTML = `Server:&nbsp;&nbsp;Unknown<br>
              Address:&nbsp;&nbsp;192.168.1.10<br><br>
              *** DNS request timed out. timeout was 2 seconds.`;
          } else {
            // Firewall scenario
            output.innerHTML = `Server:&nbsp;&nbsp;domain-controller.local<br>
              Address:&nbsp;&nbsp;192.168.1.10<br><br>
              Name:&nbsp;&nbsp;&nbsp;&nbsp;${escapeHTML(domain)}<br>
              Address:&nbsp;&nbsp;${domain.includes('web.corp') ? '192.168.1.15' : '142.250.190.46'}`;
          }
        }
      }
    } else if (primary === 'telnet') {
      const ip = parts[1];
      const port = parts[2];
      if (!ip || !port) {
        output.style.color = 'var(--danger)';
        output.textContent = 'Usage: telnet <ip_address> <port>';
      } else {
        if (netScenarioRepaired) {
          output.innerHTML = `Connecting to ${escapeHTML(ip)}...<br>
            Connected to ${escapeHTML(ip)}.<br>
            Escape character is '^]'.`;
        } else {
          if (currentNetScenario === 'firewall' && ip === '192.168.1.15' && port === '80') {
            output.innerHTML = `Connecting to 192.168.1.15...<br>
              <span style="color:var(--danger);">telnet: Unable to connect to remote host: Connection timed out</span>`;
          } else if (currentNetScenario === 'gateway' && ip !== '192.168.1.10' && ip !== '192.168.1.15' && ip !== '192.168.1.1') {
            output.innerHTML = `Connecting to ${escapeHTML(ip)}...<br>
              <span style="color:var(--danger);">telnet: network is unreachable.</span>`;
          } else {
            output.innerHTML = `Connecting to ${escapeHTML(ip)}...<br>
              Connected to ${escapeHTML(ip)}.<br>
              Escape character is '^]'.`;
          }
        }
      }
    } else if (cmd === '') {
      return;
    } else {
      output.style.color = 'var(--danger)';
      output.textContent = `cli: ${escapeHTML(primary)}: command not found. Type 'help' for assistance.`;
    }
    
    term.appendChild(output);
    term.scrollTop = term.scrollHeight;
  };

  window.applyNetworkRepair = function() {
    playClick();
    const repairSelect = document.getElementById('net-sim-repair-action');
    const resultBox = document.getElementById('net-sim-result');
    if (!repairSelect || !resultBox) return;
    
    const repairAction = repairSelect.value;
    let success = false;
    let message = "";
    
    if (currentNetScenario === 'dns' && repairAction === 'dns_fix') {
      success = true;
      message = `🎉 <b>تم حل المشكلة بنجاح!</b> لقد قمت بتحديث كارت الشبكة للموظف ليوجه استفسارات الـ DNS لخادم الدومين المحلي (192.168.1.10).<br>
        الآن يمكن لجميع موظفي الفرع فتح موقع الويب الداخلي بالاسم (web.corp) وسحب بياناتهم كالعادة! تم إغلاق تذكرة العطل بنجاح. 🛡️`;
    } else if (currentNetScenario === 'firewall' && repairAction === 'fw_fix') {
      success = true;
      message = `🎉 <b>تم حل المشكلة بنجاح!</b> قمت بالسماح بمنفذ HTTP (80) في جدار حماية خادم الويب (Windows Firewall).<br>
        الآن خادم الويب يستقبل طلبات المتصفح ويعمل بصورة طبيعية دون إعاقة للأداء! تم إغلاق تذكرة العطل بنجاح. 🛡️`;
    } else if (currentNetScenario === 'gateway' && repairAction === 'gateway_fix') {
      success = true;
      message = `🎉 <b>تم حل المشكلة بنجاح!</b> قمت بتعديل البوابة الافتراضية (Default Gateway) لتشير للراوتر الصحيح (192.168.1.1).<br>
        عادت حركة البيانات للشبكة الخارجية والإنترنت يتدفق بسلاسة في فرع الشركة الآن! تم إغلاق تذكرة العطل بنجاح. 🛡️`;
    } else {
      message = `❌ <b>إجراء إصلاح خاطئ!</b> لم يتم حل المشكلة وما زال العطل قائماً بالفرع.<br>
        استمر في استخدام الأوامر التشخيصية بالطرفية (مثل ping, nslookup, telnet) لمعرفة السبب الحقيقي للعطل وتطبيق الحل الملائم!`;
    }
    
    if (success) {
      playSuccessSound();
      netScenarioRepaired = true;
      resultBox.className = 'result-box correct';
      showFloatingNotification('تم حل بلاغ العطل بنجاح! 💻🌐');
    } else {
      playSynthSound(250, 'sawtooth', 0.25, 0.05); // Error sound
      resultBox.className = 'result-box wrong';
    }
    
    resultBox.innerHTML = message;
    resultBox.style.display = 'block';
    updateNetSimNodes();
  };

  // -------------------------------------------------------------
  // Cloud Infrastructure & Cost Planner Logic
  // -------------------------------------------------------------
  window.calculateCloudPlanner = function() {
    const providerSelect = document.getElementById('cloud-provider');
    const vmsInput = document.getElementById('cloud-vms');
    const storageInput = document.getElementById('cloud-storage');
    const bandwidthInput = document.getElementById('cloud-bandwidth');
    const haInput = document.getElementById('cloud-ha');
    
    if (!providerSelect || !vmsInput || !storageInput || !bandwidthInput || !haInput) return;
    
    const provider = providerSelect.value;
    const vms = parseInt(vmsInput.value) || 1;
    const storage = parseFloat(storageInput.value) || 100;
    const bandwidth = parseFloat(bandwidthInput.value) || 50;
    const ha = haInput.checked;
    
    // Cloud rates
    const vmRate = (provider === 'aws') ? 22 : 20; // $22/VM on AWS, $20/VM on Azure
    const storageRate = 0.10; // $0.10 per GB
    const transferRate = 0.08; // $0.08 per GB
    
    let cloudCompute = vms * vmRate;
    let cloudStorage = storage * storageRate;
    let cloudTransfer = bandwidth * transferRate;
    
    if (ha) {
      cloudCompute *= 2;
      cloudStorage *= 2;
    }
    
    const totalCloud = cloudCompute + cloudStorage + cloudTransfer;
    
    // Local cost (hardware + maintenance + electricity over 3 years)
    const serversNeeded = Math.ceil(vms / 10);
    const serverUpfront = serversNeeded * 3000;
    const monthlyServer = serverUpfront / 36;
    const monthlyLocalPower = serversNeeded * 45;
    const monthlyLocalMaint = 50;
    
    const totalLocal = monthlyServer + monthlyLocalPower + monthlyLocalMaint + (storage * 0.02);
    
    const diff = totalLocal - totalCloud;
    
    // Update costs
    const cloudCostEl = document.getElementById('cloud-monthly-cost');
    const localCostEl = document.getElementById('cloud-local-cost');
    const savingValueEl = document.getElementById('cloud-saving-value');
    const savingStatusEl = document.getElementById('cloud-saving-status');
    
    if (cloudCostEl) cloudCostEl.textContent = `$${totalCloud.toFixed(2)}`;
    if (localCostEl) localCostEl.textContent = `$${totalLocal.toFixed(2)}`;
    
    if (savingValueEl && savingStatusEl) {
      if (diff >= 0) {
        savingValueEl.textContent = `وفر: +$${diff.toFixed(2)}`;
        savingValueEl.style.color = 'var(--success)';
        savingStatusEl.textContent = 'الحوسبة السحابية أكثر اقتصاداً في بنيتك التحتية الحالية.';
        savingStatusEl.style.color = 'var(--success)';
      } else {
        savingValueEl.textContent = `زيادة: -$${Math.abs(diff).toFixed(2)}`;
        savingValueEl.style.color = 'var(--danger)';
        savingStatusEl.textContent = 'تجاوز تكلفة السحابة لمصاريف الخوادم المادية المحلية.';
        savingStatusEl.style.color = 'var(--danger)';
      }
    }
    
    // Solutions Architect warnings
    const advisorBox = document.getElementById('cloud-advisor-box');
    if (!advisorBox) return;
    
    let advisorHtml = "";
    
    if (!ha) {
      advisorHtml += `
        <div style="background:rgba(239, 68, 68, 0.08); border:1px solid var(--danger); padding:1rem; border-radius:8px; margin-bottom:0.75rem;">
          <div style="color:var(--danger); font-weight:800; display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem;">
            <i class="fa-solid fa-triangle-exclamation"></i> تحذير هندسي: تم تعطيل ميزة التوافر العالي (HA OFF)
          </div>
          <div style="color:var(--text-muted); font-size:0.8rem; line-height:1.5;">
            تعتمد بيئة العمل على خادم سحابي وحيد (Single Point of Failure). في حال حدوث أي خلل في منطقة التوفر (Availability Zone)، ستتعطل خدمات الشركة بالكامل. ينصح مهندس الحلول (Solutions Architect) بتفعيل خيار <b>High Availability</b> فوراً لتوزيع الجهد وتفادي انقطاع الأعمال.
          </div>
        </div>
      `;
    } else {
      advisorHtml += `
        <div style="background:rgba(16, 185, 129, 0.08); border:1px solid var(--success); padding:1rem; border-radius:8px; margin-bottom:0.75rem;">
          <div style="color:var(--success); font-weight:800; display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem;">
            <i class="fa-solid fa-circle-check"></i> توصية معمارية: توافر البنية التحتية ممتاز (HA Active)
          </div>
          <div style="color:var(--text-muted); font-size:0.8rem; line-height:1.5;">
            خوادمك الافتراضية موزعة عبر مناطق متعددة (Multi-AZ Deployment)، مما يضمن نسبة توافر وعمل تبلغ 99.99%. في حال تعطل أحد السيرفرات، سيوجه النظام المرور تلقائياً للسيرفر الرديف دون أي تأثر للمستخدم النهائي!
          </div>
        </div>
      `;
    }
    
    if (totalCloud > 250) {
      advisorHtml += `
        <div style="background:rgba(245, 158, 11, 0.08); border:1px solid var(--warning); padding:1rem; border-radius:8px;">
          <div style="color:var(--warning); font-weight:800; display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem;">
            <i class="fa-solid fa-lightbulb"></i> نصيحة مستشار التكاليف (Cloud Cost Optimization):
          </div>
          <div style="color:var(--text-muted); font-size:0.8rem; line-height:1.5;">
            نظراً لأن تكلفتك السحابية الشهرية تجاوزت الـ $250، نوصي مهندس الأنظمة بالاعتماد على خيار <b>الخوادم الهجينة (Hybrid Cloud)</b>: احتفظ بالسيرفرات الثابتة والملفات الأرشيفية الكبيرة في معملك المنزلي (On-Premises Homelab) واستعن بالسحابة فقط للخدمات الخارجية الحيوية وتأمين النسخ الاحتياطية لتوفير أكثر من 40% من المصاريف!
          </div>
        </div>
      `;
    } else {
      advisorHtml += `
        <div style="background:rgba(6, 182, 212, 0.08); border:1px solid var(--accent-secondary); padding:1rem; border-radius:8px;">
          <div style="color:var(--accent-secondary); font-weight:800; display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem;">
            <i class="fa-solid fa-circle-info"></i> موازنة ميزانية البنية التحتية:
          </div>
          <div style="color:var(--text-muted); font-size:0.8rem; line-height:1.5;">
            بنيتك السحابية تقع في نطاق التكلفة الاقتصادية الممتازة. يعتبر تشغيل السحابة في هذا النطاق أفضل بكثير من شراء خادم محلي لما يوفره من نفقات تبريد وصيانة مادية وتأمين مستمر للكهرباء.
          </div>
        </div>
      `;
    }
    
    advisorBox.innerHTML = advisorHtml;
  };

  // -------------------------------------------------------------
  // Systems Automation Scripting Hub Logic
  // -------------------------------------------------------------
  window.loadAutomationScript = function() {
    const scenarioSelect = document.getElementById('script-scenario');
    const termTitle = document.getElementById('script-terminal-title');
    const codeBody = document.getElementById('script-code-body');
    
    if (!scenarioSelect || !codeBody) return;
    
    const scenario = scenarioSelect.value;
    let title = "backup_script.sh";
    let html = "";
    
    if (scenario === 'backup_bash') {
      title = "backup_script.sh";
      html = `
<span class="code-comment"># !/bin/bash</span>
<span class="code-comment"># سكربت نسخ احتياطي للمجلدات وضغطها تلقائياً</span>
<span class="code-explain-span" data-title="المتغيرات (Variables)" data-explain="نعرف مسار مجلد النسخ الاحتياطي النهائي حيث سيتم حفظ الأرشيف المضغوط.">BACKUP_DIR="/var/backups"</span>
<span class="code-explain-span" data-title="مجلد المصدر (Source)" data-explain="هذا هو مجلد سيرفر الويب Nginx/Apache الذي يحتوي على جميع ملفات ومواقع الشركة.">SOURCE_DIR="/var/www/html"</span>
<span class="code-explain-span" data-title="توليد التاريخ (Timestamp)" data-explain="ننشئ ختماً زمنياً دقيقاً باليوم والساعة والدقيقة لإضافته لاسم الملف لتفادي الكتابة فوق النسخ القديمة.">TIMESTAMP=$(date +%F_%H-%M-%S)</span>

<span class="code-comment"># ضغط وأرشفة الملفات</span>
<span class="code-explain-span" data-title="أمر الضغط (Tar Compression)" data-explain="الأمر tar مع المعاملات -czf ينشئ ملفاً مضغوطاً بهيئة tar.gz يحتوي على جميع الملفات من مجلد المصدر.">tar -czf "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" "$SOURCE_DIR"</span>
      `;
    } else if (scenario === 'disk_bash') {
      title = "disk_monitor.sh";
      html = `
<span class="code-comment"># !/bin/bash</span>
<span class="code-comment"># سكربت مراقبة سعة القرص وتنبيهات البريد</span>
<span class="code-explain-span" data-title="الحد الأقصى (Disk Limit)" data-explain="نحدد العتبة أو الحد الأقصى المسموح به لملء الهارد ديسك وهو 90%، وإذا تجاوزه السيرفر يتم إرسال تحذير فوراً.">THRESHOLD=90</span>

<span class="code-explain-span" data-title="حساب المساحة (Disk Usage)" data-explain="أمر df -h يفحص مساحة القرص، ونستخدم grep و awk لاستخلاص النسبة المئوية للجهاز الرئيسي فقط.">USAGE=$(df -h / | grep '/' | awk '{print $5}' | cut -d'%' -f1)</span>

<span class="code-explain-span" data-title="الشرط البرمجي (If Condition)" data-explain="نقارن مساحة الاستهلاك الحالية مع الحد التحذيري الأقصى لمعرفة هل اقترب القرص من الامتلاء.">if [ "$USAGE" -gt "$THRESHOLD" ]; then</span>
  <span class="code-explain-span" data-title="إرسال التنبيه (Email Alert)" data-explain="أمر mail يرسل رسالة تحذيرية طارئة لمهندس الشبكات المسؤول ليفحص السيرفر ويحذف الملفات المؤقتة.">echo "Warning: Disk is $USAGE% full!" | mail -s "Disk Alert" admin@corp.com</span>
<span class="code-explain-span" data-title="نهاية الشرط" data-explain="نغلق الجملة الشرطية fi في برمجة لغة Bash.">fi</span>
      `;
    } else if (scenario === 'ad_ps') {
      title = "CreateADUsers.ps1";
      html = `
<span class="code-comment"># PowerShell Script</span>
<span class="code-comment"># أتمتة إنشاء موظفي الشركة في الدليل النشط</span>
<span class="code-explain-span" data-title="استيراد البيانات (Import CSV)" data-explain="أمر Import-Csv يقرأ ملف إكسل CSV يحتوي على قوائم الموظفين الجدد (الاسم، الإدارة، اللقب).">$CurrentUsers = Import-Csv -Path "C:\\new_employees.csv"</span>

<span class="code-explain-span" data-title="حلقة التكرار (Foreach Loop)" data-explain="نمر حلقة تكرارية على كل موظف موجود في الملف لإنشاء حسابه بشكل منفصل وتلقائي.">foreach ($User in $CurrentUsers) {</span>
  <span class="code-explain-span" data-title="توليد كلمة المرور" data-explain="نحول كلمة مرور عشوائية افتراضية لنوع نص آمن مشفر (Secure String) متطابق مع متطلبات أمان ويندوز.">  $SecurePass = ConvertTo-SecureString "TempPass123!" -AsPlainText -Force</span>
  
  <span class="code-explain-span" data-title="إنشاء الحساب (New-ADUser)" data-explain="أمر New-ADUser ينشئ حساب المستخدم في Active Directory مع تخصيص الاسم وكلمة المرور وتفعيل الحساب.">  New-ADUser -Name $User.Name -UserPrincipalName "$($User.Username)@corp.com" -AccountPassword $SecurePass -Enabled $true</span>
<span class="code-explain-span" data-title="نهاية الحلقة" data-explain="نغلق القوس التكراري foreach بعد معالجة جميع الموظفين بملف CSV.">}</span>
      `;
    } else if (scenario === 'service_ps') {
      title = "ServiceWatchdog.ps1";
      html = `
<span class="code-comment"># PowerShell Service Watchdog</span>
<span class="code-explain-span" data-title="اسم الخدمة (Service Name)" data-explain="نحدد اسم الخدمة المراد مراقبتها، وهنا نراقب خدمة خادم الويب IIS (W3SVC).">$ServiceName = "W3SVC"</span>

<span class="code-explain-span" data-title="حالة الخدمة (Get-Service)" data-explain="أمر Get-Service يجلب الحالة اللحظية للخدمة (هل هي تعمل أم متوقفة).">$Service = Get-Service -Name $ServiceName</span>

<span class="code-explain-span" data-title="الشرط المنطقي" data-explain="نفحص هل حالة الخدمة الحالية ليست قيد التشغيل (Running).">if ($Service.Status -ne "Running") {</span>
  <span class="code-explain-span" data-title="إعادة تشغيل (Start-Service)" data-explain="إذا كانت الخدمة متوقفة لأي سبب، يقوم أمر Start-Service بإعادة إطلاق الخدمة فوراً تلقائياً دون تدخل بشري!">  Start-Service -Name $ServiceName</span>
  <span class="code-explain-span" data-title="توثيق الحدث (Event Log)" data-explain="أمر Write-EventLog يكتب حدثاً في لوحة الأحداث بويندوز ليوثق متى توقفت الخدمة ومتى تم إصلاحها تلقائياً.">  Write-EventLog -LogName Application -Source "ServiceWatchdog" -EventID 101 -Message "IIS Web Service stopped and was auto-restarted."</span>
<span class="code-explain-span" data-title="نهاية الشرط" data-explain="نغلق الجملة الشرطية في لغة PowerShell.">}</span>
      `;
    }
    
    if (termTitle) termTitle.innerHTML = `<i class="fa-solid fa-code"></i> ${title}`;
    codeBody.innerHTML = html;
    
    // Attach event listeners
    const spans = codeBody.querySelectorAll('.code-explain-span');
    spans.forEach(span => {
      span.addEventListener('mouseenter', () => {
        const eTitle = document.getElementById('explainer-title');
        const eBody = document.getElementById('explainer-body');
        if (eTitle && eBody) {
          eTitle.textContent = span.getAttribute('data-title');
          eBody.textContent = span.getAttribute('data-explain');
        }
      });
      
      span.addEventListener('mouseleave', () => {
        const eTitle = document.getElementById('explainer-title');
        const eBody = document.getElementById('explainer-body');
        if (eTitle && eBody) {
          eTitle.textContent = "شرح الأكواد والسطور";
          eBody.textContent = "مرر الماوس فوق أي جزء ملوّن من الكود البرمجي على اليسار لرؤية وظيفة السطر بالتفصيل ومبدأ عمله البرمجي.";
        }
      });
    });
  };

  // -------------------------------------------------------------
  // Promotional Exams System (Milestone Quizzes)
  // -------------------------------------------------------------
  const examQuestions = {
    0: [
      { q: "ما هو المكون الأساسي للكمبيوتر الذي يعتبر عقل الجهاز ويقوم بمعالجة العمليات الحسابية والمنطقية؟", o: ["الذاكرة العشوائية (RAM)", "وحدة المعالجة المركزية (CPU)", "القرص الصلب (SSD)", "اللوحة الأم (Motherboard)"], a: 1, e: "وحدة المعالجة المركزية CPU هي عقل الكمبيوتر والمسؤولة عن معالجة كافة الأوامر والعمليات البرمجية." },
      { q: "أي نوع من وسائط التخزين يعتبر الأسرع في قراءة وكتابة البيانات للأنظمة الحديثة؟", o: ["HDD", "SSD (SATA)", "NVMe SSD", "Floppy Disk"], a: 2, e: "أقراص NVMe SSD هي الأحدث والأسرع وتتصل مباشرة بممرات PCIe باللوحة الأم لتوفير سرعات هائلة." },
      { q: "أي منفذ يُستخدم لتوصيل كابل الإنترنت السلكي بجهاز الكمبيوتر؟", o: ["USB-C", "HDMI", "RJ-45 (Ethernet)", "VGA"], a: 2, e: "منفذ RJ-45 هو المنفذ القياسي لتوصيل كوابل الشبكة المحلية السلكية (Ethernet)." },
      { q: "وظيفة الذاكرة العشوائية (RAM) في جهاز الكمبيوتر هي:", o: ["حفظ الملفات بشكل دائم بعد إيقاف التشغيل", "تخزين البيانات والبرامج المفتوحة مؤقتاً لتسهيل وصول المعالج إليها", "توزيع الطاقة لمكونات الجهاز", "معالجة الرسوميات والألعاب ثلاثية الأبعاد"], a: 1, e: "الذاكرة العشوائية RAM هي ذاكرة تخزين مؤقتة وسريعة تفقد محتوياتها بمجرد إغلاق الجهاز وتساعد المعالج في عمله." },
      { q: "أي نظام تشغيل يعتبر مفتوح المصدر ويُستخدم على نطاق واسع في السيرفرات والبنى التحتية؟", o: ["Windows 11", "macOS", "Linux", "iOS"], a: 2, e: "نظام لينكس Linux هو نظام تشغيل مفتوح المصدر وآمن للغاية، ويعتبر الخيار الأول للسيرفرات وقواعد البيانات." }
    ],
    1: [
      { q: "ما هو البروتوكول الذي يقوم بتحويل عناوين الـ IP إلى أسماء نطاقات؟", o: ["DHCP", "DNS", "NAT", "OSPF"], a: 1, e: "DNS يقوم بترجمة الأسماء (مثل google.com) إلى عناوين IP ليسهل على الأجهزة التخاطب بها." },
      { q: "شبكة عنوانها 192.168.1.0/26، ما هو عنوان الـ Broadcast لها؟", o: ["192.168.1.31", "192.168.1.63", "192.168.1.127", "192.168.1.255"], a: 1, e: "/26 تعني حجم شبكة يبلغ 64 عنواناً. العناوين تبدأ من .0 وتنتهي بـ .63، وآخر عنوان هو الـ Broadcast." },
      { q: "أي طبقة في نموذج OSI مسؤولة عن التوجيه (Routing) وعنونة الـ IP؟", o: ["Physical Layer", "Data Link Layer", "Network Layer", "Transport Layer"], a: 2, e: "الـ Network Layer (الطبقة الثالثة) هي المسؤولة عن عنونة الأجهزة وتوجيه الحزم بين الشبكات." },
      { q: "ما هو المنفذ الافتراضي للاتصال الآمن بنظام لينكس عن بعد عبر SSH؟", o: ["Port 80", "Port 22", "Port 443", "Port 3389"], a: 1, e: "منفذ 22 هو المنفذ القياسي لبروتوكول SSH المخصص للتحكم المشفر عن بعد بأنظمة لينكس." },
      { q: "برنامج Wireshark يستخدم بشكل أساسي في:", o: ["أرشفة الملفات", "تحليل واستكشاف أخطاء حزم البيانات (Packet Analysis)", "تجميع السيرفرات الوهمية", "إنشاء جدران حماية"], a: 1, e: "Wireshark هو أقوى محلل شبكات يقوم بالتقاط حركة المرور وفحص حزم البيانات لفهم المشاكل وحلها." }
    ],
    2: [
      { q: "أي أمر تستخدمه لتغيير صلاحيات الملف في لينكس؟", o: ["chown", "chmod", "systemctl", "mkdir"], a: 1, e: "الأمر chmod (Change Mode) يستخدم لتعديل صلاحيات القراءة والكتابة والتنفيذ للمستخدمين." },
      { q: "كيف تشاهد حالة خدمة خادم الويب Nginx في نظام لينكس؟", o: ["systemctl status nginx", "service start nginx", "apt install nginx", "ps -ef nginx"], a: 0, e: "systemctl status nginx يعرض الحالة الحالية للخدمة هل تعمل أم متوقفة مع عرض السجلات الأخيرة." },
      { q: "ما هو الأمر الذي يسمح لك بالاتصال بسيرفر عن بعد بأمان كامل وتشغيل الأوامر؟", o: ["telnet", "ssh", "ftp", "ping"], a: 1, e: "ssh (Secure Shell) ينشئ نفقاً مشفراً للاتصال بالسيرفر والتحكم به عن بعد بأمان تام." },
      { q: "أي مجلد يحتوي على جميع ملفات التكوين والإعدادات للنظام والخدمات في لينكس؟", o: ["/var", "/bin", "/etc", "/home"], a: 2, e: "المجلد /etc هو مستودع ملفات الإعدادات والـ configuration لجميع البرامج والخدمات في النظام." },
      { q: "كيف يمكنك معرفة مسار المجلد الحالي الذي تقف عليه الآن في الـ Terminal؟", o: ["ls", "pwd", "cd", "whoami"], a: 1, e: "الأمر pwd (Print Working Directory) يطبع لك المسار الكامل للمجلد الحالي الذي تتواجد فيه." }
    ],
    3: [
      { q: "ما هي الخدمة المسؤولة عن إدارة هويات المستخدمين والصلاحيات مركزياً في بيئة ويندوز؟", o: ["DNS Services", "Active Directory Domain Services (AD DS)", "Group Policy Objects", "DHCP Server"], a: 1, e: "AD DS هو العمود الفقري لإدارة الهويات والأمان والتحكم في الموظفين والأجهزة مركزياً بالشركات." },
      { q: "لتطبيق وتحديث سياسات المجموعة (GPOs) فوراً على أجهزة الموظفين نستخدم الأمر:", o: ["gpupdate /force", "ipconfig /renew", "Get-Service", "Set-GPRegistryValue"], a: 0, e: "gpupdate /force يجبر نظام ويندوز على الاتصال بـ Domain Controller وسحب وتطبيق السياسات الجديدة فوراً." },
      { q: "سياسة المجموعة (GPO) التي تمنع موظفي الشركة من استخدام الفلاشات تقع تحت قسم:", o: ["Windows Settings", "Administrative Templates", "Software Settings", "Control Panel Settings"], a: 1, e: "القوالب الإدارية (Administrative Templates) تحتوي على سياسات النظام وحظر العتاد الخارجي مثل الـ USB." },
      { q: "ما هو الأمر البرمجي في PowerShell لإنشاء حساب مستخدم جديد في الـ AD؟", o: ["New-User", "New-ADUser", "Import-Csv", "Set-ADUser"], a: 1, e: "الأمر New-ADUser هو الـ Cmdlet الرسمي في PowerShell لإنشاء حساب مستخدم جديد في الدليل النشط." },
      { q: "لربط لابتوب موظف بالدومين الداخلي بنجاح، يجب تعديل كارت الشبكة وتحديد الـ DNS ليكون:", o: ["8.8.8.8", "عنوان الراوتر الافتراضي", "عنوان خادم الدومين (Domain Controller IP)", "1.1.1.1"], a: 2, e: "يجب توجيه الـ DNS لخادم الدومين الداخلي حصراً ليتعرف الجهاز على اسم النطاق ويفك تشفيره." }
    ],
    4: [
      { q: "ما هو نظام التشغيل مفتوح المصدر (Hypervisor Type-1) المستخدم لإدارة السيرفرات الوهمية محلياً بكفاءة؟", o: ["VirtualBox", "Proxmox VE", "VMware Player", "Docker"], a: 1, e: "Proxmox VE هو نظام تشغيل خارق يثبت على العتاد المادي مباشرة (Bare-metal) لإدارة السيرفرات الافتراضية باحترافية." },
      { q: "في الحوسبة السحابية، ماذا تعني ميزة 'High Availability'؟", o: ["سرعة نقل البيانات", "توزيع الموارد عبر مناطق توافر متعددة لضمان استمرارية الخدمة", "تشفير الملفات", "حساب الفواتير الشهرية"], a: 1, e: "التوافر العالي (HA) يضمن توزيع خوادمك في أماكن جغرافية متعددة لتعويض أي توقف مفاجئ في مراكز البيانات." },
      { q: "ما هي الخدمة السحابية في AWS المقابلة للـ Virtual Machines؟", o: ["S3", "EC2", "RDS", "VPC"], a: 1, e: "EC2 (Elastic Compute Cloud) هي الخدمة المخصصة لإنشاء وإطلاق خوادم افتراضية وهمية بالسحابة." },
      { q: "ما هي أفضل ممارسة لتأمين البيانات السحابية ضد الكوارث والفقد المفاجئ؟", o: ["تكرار الخوادم محلياً", "النسخ الاحتياطي الجغرافي الموزع (Geo-Redundancy)", "إغلاق الفايروال", "تقليل مساحة الهارد ديسك"], a: 1, e: "حفظ النسخ الاحتياطية في منطقة جغرافية أو سحابة أخرى يضمن استعادة البيانات حتى في حالات الحرائق أو تعطل الشبكات." },
      { q: "ما هو الفارق المالي الأساسي عند الانتقال للسحابة مقارنة بشراء سيرفر محلي؟", o: ["دفع تكلفة أقل للكهرباء فقط", "تحويل التكلفة الرأسمالية (CapEx) إلى تكلفة تشغيلية مرنة (OpEx)", "انعدام التكاليف تماماً", "زيادة تكاليف الصيانة"], a: 1, e: "السحابة تلغي مصاريف العتاد الضخمة مقدماً (CapEx) وتجعل الدفع على قدر الاستخدام الفعلي شهرياً كفاتورة تشغيلية (OpEx)." }
    ],
    5: [
      { q: "ما هي فئة الخدمات السحابية التي توفر للمستخدمين بنية تحتية افتراضية كاملة (مثل السيرفرات والشبكات ووحدات التخزين) عبر الإنترنت؟", o: ["البرمجيات كخدمة (SaaS)", "البنية التحتية كخدمة (IaaS)", "المنصة كخدمة (PaaS)", "الشبكة كخدمة (NaaS)"], a: 1, e: "البنية التحتية كخدمة (IaaS - Infrastructure as a Service) توفر خوادم افتراضية وشبكات كاملة وتمنح العميل التحكم الكامل بنظام التشغيل والعتاد الافتراضي." },
      { q: "أي من الخدمات التالية يعتبر مثالاً لـ (SaaS - Software as a Service) حيث يتم تقديم التطبيق جاهزاً بالكامل للمستخدم؟", o: ["Microsoft 365 / Gmail", "Amazon EC2", "Azure App Services", "Google Cloud Storage"], a: 0, e: "البرمجيات كخدمة (SaaS) مثل Gmail و Microsoft 365 تقدم تطبيقات ويب جاهزة للاستخدام النهائي مباشرة بدون الحاجة لإدارة السيرفرات أو الأكواد." },
      { q: "ما هي الشهادة التأسيسية الأكثر شهرة في سحابة أمازون (AWS) والمناسبة للمبتدئين لبدء فهم الخدمات والأسعار والأمان السحابي؟", o: ["AWS Solutions Architect Professional", "AWS Certified Cloud Practitioner", "Microsoft Azure Fundamentals", "CompTIA Cloud+"], a: 1, e: "شهادة AWS Certified Cloud Practitioner هي المستوى التأسيسي للتعرف على مفاهيم السحابة وأسس AWS والأسعار والأمن." },
      { q: "في لغة Python، أي من الأوامر التالية يُسخدم لطباعة نص أو قيمة متغير على شاشة الكونسول؟", o: ["echo()", "console.log()", "print()", "system.out.println()"], a: 2, e: "الدالة print() في بايثون هي الدالة القياسية لطباعة النصوص والمخرجات على شاشة الكونسول." },
      { q: "أي من اللغات أو الأدوات التالية تعتبر بيئة سطر أوامر ولغة سكربتات قوية مدمجة في ويندوز لأتمتة المهام وإدارة سيرفرات Active Directory؟", o: ["PowerShell", "Bash CLI", "Python", "JavaScript"], a: 0, e: "الـ PowerShell هو الأداة القياسية الأقوى من مايكروسوفت لأتمتة وإدارة أنظمة ويندوز وخوادم الدليل النشط Active Directory." }
    ],
    6: [
      { q: "ما هي قاعدة النسخ الاحتياطي الذهبية لحماية بيانات السيرفرات ضد الفقد التام؟", o: ["القاعدة 3-2-1", "القاعدة 50% رامات", "تأمين كلمات المرور", "سياسات الـ GPO"], a: 0, e: "قاعدة 3-2-1 تعني: 3 نسخ من البيانات، على وسيطين مختلفين، مع نسخة واحدة في مكان خارجي (Cloud)." },
      { q: "أي منفذ يجب حظره فوراً ببيئات العمل لمنع هجمات الاختراق والتحكم المباشر بويندوز سيرفر؟", o: ["Port 80", "Port 443", "Port 3389 (RDP)", "Port 53"], a: 2, e: "منفذ RDP 3389 هو المنفذ الذي يتم استهدافه بشدة من المخترقين للدخول لواجهة الويندوز، لذا ينصح بحظره أو تأمينه بـ VPN." },
      { q: "أي نظام جدار حماية (Firewall) مفتوح المصدر يفضل استخدامه بالمعامل والمؤسسات؟", o: ["Nginx", "PfSense", "VirtualBox", "Active Directory"], a: 1, e: "PfSense هو نظام خارق ومرن جداً لتوفير الحماية المتقدمة وجدران الحماية وتوجيه البيانات بالشبكات الداعمة." },
      { q: "أداة Uptime-Kuma تستخدم in:", o: ["حساب تقسيم الشبكات", "مراقبة توفر وسلامة السيرفرات وإرسال التنبيهات فوراً عند السقوط", "تشغيل لغات البرمجة", "تأمين مفاتيح التشفير"], a: 1, e: "Uptime-Kuma مراقبة السيرفرات والمواقع على مدار الساعة وإرسال تنبيهات لمهندس الشبكات عند حدوث عطل." },
      { q: "مبدأ 'Least Privilege' في الأمان السيبراني للأنظمة يعني:", o: ["منع جميع الموظفين من الدخول", "إعطاء المستخدمين الحد الأدنى فقط من الصلاحيات الكافية لأداء عملهم", "تأمين السيرفر بكلمة مرور قصيرة", "تفعيل الفايروال فقط بالليل"], a: 1, e: "مبدأ الصلاحيات الأقل يمنع أي موظف من الوصول لبيانات أو تغيير إعدادات لا تعنيه، مما يقلل خطورة الهجمات الداخلية." }
    ],
    7: [
      { q: "ما هو أصغر كائن (Object) قابل للنشر والتشغيل في Kubernetes ويحتوي على حاوية واحدة أو أكثر؟", o: ["Pod", "Service", "Deployment", "Ingress"], a: 0, e: "Pod هو اللبنة الأساسية وأصغر كائن تشغيل في Kubernetes ويحتوي على الحاوية الحقيقية." },
      { q: "أي كائن في Kubernetes يُسخدم لتوفير عنوان IP ثابت وتوزيع مرور البيانات بين عدة Pods؟", o: ["Service", "Pod", "ConfigMap", "Ingress"], a: 0, e: "Service يوفر عنواناً ثابتاً وموازنة أحمال داخلية لتوجيه الطلبات لـ Pods متطابقة." },
      { q: "لتوجيه حركة البيانات من خارج كلستر Kubernetes إلى الخدمات الداخلية بناءً على اسم النطاق (Domain Name)، نستخدم:", o: ["Ingress", "NodePort", "kube-proxy", "Namespace"], a: 0, e: "Ingress Router هو المسؤول عن إدارة الدخول الخارجي وتوجيه المسارات والأسماء للخدمات الداخلية." },
      { q: "ما هي الأداة الشهيرة (Package Manager) المستخدمة لتعبئة وتثبيت التطبيقات وإدارتها داخل كلستر Kubernetes بسهولة؟", o: ["Helm", "Kubectl", "Docker Compose", "Ansible"], a: 0, e: "Helm هو مدير الحزم القياسي لـ Kubernetes ويسمح بتثبيت تطبيقات معقدة بضغطة زر." },
      { q: "أي أمر تستخدمه لعرض كافة الـ Pods النشطة في الـ Namespace الحالي؟", o: ["kubectl get pods", "kubectl run pods", "kubectl show pods", "kubeadm get pods"], a: 0, e: "الأمر kubectl get pods هو الأمر الأساسي لعرض قائمة وحالة الكبسولات النشطة." }
    ],
    8: [
      { q: "ما هو الملف المخصص في Ansible لكتابة الخطوات والمهمات البرمجية لتثبيت البرامج وإعداد السيرفرات؟", o: ["Ansible Playbook", "Inventory File", "Ansible Config", "main.tf"], a: 0, e: "Playbook هو الملف المكتوب بصيغة YAML ويحتوي على جميع الخطوات والمهمات المطلوب أتمتتها." },
      { q: "أداة Terraform تقوم بحفظ وتتبع الموارد التي تم إنشاؤها سحابياً في ملف خاص يُسمى:", o: ["State File (.tfstate)", "Variables File", "Inventory File", "Dockerfile"], a: 0, e: "ملف الحالة tfstate هو ذاكرة Terraform لتتبع الموارد ومقارنتها بالواقع لتطبيق التعديلات بدقة." },
      { q: "أي من الأدوات التالية تعتبر خياراً رائداً لتطبيق منهجية الـ GitOps ومزامنة إعدادات Kubernetes تلقائياً مع GitHub؟", o: ["ArgoCD", "Ansible", "Jenkins", "Docker"], a: 0, e: "ArgoCD يراقب مستودع Git ويقوم بمزامنة وتحديث كلستر Kubernetes تلقائياً دون تدخل يدوي." },
      { q: "في Terraform، أي أمر يقوم بتحليل الأكواد ومقارنتها بالبنية التحتية الفعلية وعرض التغييرات التي سيتم إجراؤها قبل تطبيقها؟", o: ["terraform plan", "terraform apply", "terraform init", "terraform validate"], a: 0, e: "الأمر terraform plan يعرض لك خطة العمل والتغييرات بالتفصيل قبل تنفيذها فعلياً على السحابة." },
      { q: "نظام الـ GitOps يعتمد بشكل أساسي على جعل مستودع الأكواد (Git Repository) هو:", o: ["المصدر الوحيد للحقيقة (Single Source of Truth) للبنية التحتية", "مخزن ملفات النسخ الاحتياطي", "سيرفر توزيع عناوين IP", "جدار حماية سحابي"], a: 0, e: "في GitOps، يعتبر مستودع Git هو المصدر الوحيد والنهائي لشكل وإعدادات البنية التحتية الحالية." }
    ],
    9: [
      { q: "ماذا يعني مصطلح SLO (Service Level Objective) في هندسة الموثوقية (SRE)؟", o: ["هدف مستوى الخدمة المستهدف (مثل نسبة عمل 99.9%)", "مؤشر الأداء اللحظي الفعلي", "اتفاقية تعويض العميل مالياً", "سجل أخطاء السيرفر"], a: 0, e: "SLO هو الهدف الداخلي الذي يسعى مهندسو الأنظمة لتحقيقه (مثل نسبة خلو من الأعطال تبلغ 99.9%)." },
      { q: "أداة Prometheus تقوم بجمع مقاييس السيرفرات بشكل أساسي عبر آلية:", o: ["السحب (Pull Mechanism)", "الدفع (Push Mechanism)", "قواعد البيانات المشفرة", "الرسائل القصيرة"], a: 0, e: "Prometheus يعتمد على سحب المقاييس (Scraping/Pull) بانتظام من السيرفرات المستهدفة عبر بروتوكول HTTP." },
      { q: "ما هي الأداة المفضلة لبناء لوحات تحكم رسومية (Dashboards) متطورة لعرض مقاييس السيرفرات والشبكة حياً؟", o: ["Grafana", "Prometheus", "Uptime Kuma", "Nginx"], a: 0, e: "Grafana هي الأداة الأقوى عالمياً لبناء لوحات مراقبة رسومية وتفاعلية ومذهلة للبيانات." },
      { q: "في SRE، ماذا يسمى هامش الخطأ أو النسبة المسموح بها لتوقف الخدمة دون الإخلال بـ SLO؟", o: ["ميزانية الخطأ (Error Budget)", "مؤشر الفشل (SLI)", "زمن الاستجابة المقبول", "تكلفة التعطل"], a: 0, e: "ميزانية الخطأ (Error Budget) هي النسبة المتاحة للتوقف المسموح به (مثال: 0.1% من الوقت شهرياً) لتجربة ميزات جديدة." },
      { q: "أداة Prometheus Node Exporter تُستخدم في سيرفرات لينكس لـ:", o: ["جمع مقاييس العتاد ونظام التشغيل (مثل استهلاك المعالج والرامات)", "حظر الهجمات", "تشفير قواعد البيانات", "مزامنة التوقيت"], a: 0, e: "Node Exporter عبارة عن وكيل خفيف يُثبت بالخادم ليقوم بتصدير مقاييس العتاد مثل المعالج والرام والشبكة لـ Prometheus." }
    ],
    10: [
      { q: "ما هو المبدأ الأساسي الذي تقوم عليه معمارية الأمن الصِفري (Zero Trust Security)؟", o: ["لا تثق بأي أحد أبداً وتحقق دائماً (Never Trust, Always Verify)", "ثق بالأجهزة الداخلية فقط", "اعتمد على جدار الحماية المحيطي التقليدي", "تفعيل الفلاشات"], a: 0, e: "الـ Zero Trust تلغي الثقة التلقائية بالأجهزة داخل الشبكة وتتطلب التحقق الدائم من الهوية والترخيص لكل اتصال." },
      { q: "أي من البروتوكولات التالية يعتبر خياراً حديثاً وفائق السرعة والأمان لربط الموظفين بالـ VPN المشفر؟", o: ["WireGuard", "PPTP", "L2TP", "OpenSSL"], a: 0, e: "WireGuard هو أحدث وأسرع بروتوكول VPN مشفر ويعمل بكفاءة هائلة مقارنة بالبروتوكولات القديمة." },
      { q: "أداة Let's Encrypt توفر لمديري الأنظمة والشبكات ميزة توليد شهادات SSL/TLS:", o: ["مجاناً وتلقائياً بالكامل", "بتكلفة سنوية مرتفعة", "للويندوز سيرفر فقط", "غير مشفرة"], a: 0, e: "Let's Encrypt هي سلطة شهادات عالمية مجانية وغير ربحية ومؤتمتة بالكامل لتأمين خوادم الويب." },
      { q: "للحصول على شهادة SSL من Let's Encrypt عبر تحدي الـ DNS، يجب إضافة سجل من نوع:", o: ["TXT Record", "A Record", "CNAME Record", "MX Record"], a: 0, e: "يطلب Let's Encrypt إضافة سجل DNS TXT يحتوي على كود التحدي لإثبات ملكيتك وإدارتك للنطاق بنجاح." },
      { q: "ما هي وظيفة جدار حماية تطبيقات الويب (WAF - Web Application Firewall)؟", o: ["فحص وحماية حركة مرور الويب (HTTP/S) ضد الثغرات وهجمات الاختراق وحجب الخدمة", "توزيع عناوين IP للأجهزة", "تشفير الهارد ديسك", "إدارة الدليل النشط"], a: 0, e: "WAF يقوم بفحص الطلبات الواردة للموقع وحظر المحاولات الخبيثة مثل SQL Injection وهجمات DDoS." }
    ]
  };

  const userExamState = {
    0: { currentQ: 0, score: 0, answers: [] },
    1: { currentQ: 0, score: 0, answers: [] },
    2: { currentQ: 0, score: 0, answers: [] },
    3: { currentQ: 0, score: 0, answers: [] },
    4: { currentQ: 0, score: 0, answers: [] },
    5: { currentQ: 0, score: 0, answers: [] },
    6: { currentQ: 0, score: 0, answers: [] },
    7: { currentQ: 0, score: 0, answers: [] },
    8: { currentQ: 0, score: 0, answers: [] },
    9: { currentQ: 0, score: 0, answers: [] },
    10: { currentQ: 0, score: 0, answers: [] }
  };

  function checkExamUnlocks() {
    const prefixes = { 
      0: 'itb-task', 1: 'net-task', 2: 'lin-task', 3: 'win-task', 4: 'cld-task', 5: 'dev-task', 6: 'sec-task',
      7: 'k8s-task', 8: 'git-task', 9: 'sre-task', 10: 'zt-task'
    };
    
    for (let p = 0; p <= 10; p++) {
      const prefix = prefixes[p];
      const checkedBox = document.querySelectorAll(`.checklist-checkbox[id^="${prefix}"]:checked`);
      
      const examStatus = document.getElementById(`exam-status-${p}`);
      const startBtn = document.getElementById(`start-exam-btn-${p}`);
      
      if (!examStatus) continue;
      
      // Check if already passed
      const isPassed = localStorage.getItem(`exam-phase-${p}-passed`) === 'true';
      if (isPassed) {
        examStatus.innerHTML = `<span class="exam-badge passed" style="background:rgba(16,185,129,0.08); border-color:rgba(16,185,129,0.15); color:var(--success); padding:0.4rem 0.8rem; border-radius:6px; font-weight:700;"><i class="fa-solid fa-circle-check"></i> تم اجتياز الاختبار وتخطي المرحلة بنجاح! 🏆</span>`;
        if (startBtn) startBtn.style.display = 'none';
        continue;
      }
      
      const required = (p === 6 || p === 8 || p === 9 || p === 10) ? 2 : 3;
      if (checkedBox.length >= required) {
        examStatus.innerHTML = `<span class="exam-badge unlocked" style="background:rgba(245,158,11,0.08); border-color:rgba(245,158,11,0.15); color:var(--warning); padding:0.4rem 0.8rem; border-radius:6px; font-weight:700;"><i class="fa-solid fa-lock-open"></i> الاختبار مفتوح وجاهز للبدء 🔓</span>`;
        if (startBtn) startBtn.style.display = 'block';
      } else {
        examStatus.innerHTML = `<span class="exam-badge locked" style="background:rgba(255,255,255,0.02); border-color:var(--border-color); color:var(--text-muted); padding:0.4rem 0.8rem; border-radius:6px;"><i class="fa-solid fa-lock"></i> مغلق (أكمل ${required} مهام دراسية على الأقل لفتح الاختبار - المنجز حالياً: ${checkedBox.length})</span>`;
        if (startBtn) startBtn.style.display = 'none';
      }
    }
  }

  window.startExam = function(phaseNum) {
    playClick();
    const qArea = document.getElementById(`exam-question-area-${phaseNum}`);
    const startBtn = document.getElementById(`start-exam-btn-${phaseNum}`);
    const statusBox = document.getElementById(`exam-status-${phaseNum}`);
    
    if (!qArea || !startBtn || !statusBox) return;
    
    userExamState[phaseNum] = { currentQ: 0, score: 0, answers: [] };
    
    startBtn.style.display = 'none';
    statusBox.style.display = 'none';
    qArea.style.display = 'block';
    
    renderExamQuestion(phaseNum);
  };

  function renderExamQuestion(phaseNum) {
    const qArea = document.getElementById(`exam-question-area-${phaseNum}`);
    if (!qArea) return;
    
    const state = userExamState[phaseNum];
    const questions = examQuestions[phaseNum];
    const qIdx = state.currentQ;
    
    if (qIdx >= questions.length) {
      finishExam(phaseNum);
      return;
    }
    
    const qData = questions[qIdx];
    
    let html = `
      <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color); padding:1rem; border-radius:10px; margin-bottom:1.25rem;">
        <span style="font-size:0.75rem; color:var(--accent-secondary); font-weight:800; display:block; margin-bottom:0.25rem; text-align:right; direction:rtl;">سؤال ${qIdx + 1} من ${questions.length}</span>
        <h4 style="font-size:0.95rem; font-weight:700; color:white; line-height:1.6; text-align:right; direction:rtl;">${qData.q}</h4>
      </div>
      <div class="quiz-options-grid" style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1.25rem;">
    `;
    
    qData.o.forEach((opt, optIdx) => {
      html += `
        <button class="quiz-option-btn exam-opt-btn" onclick="submitExamAnswer(${phaseNum}, ${qIdx}, ${optIdx})" style="width:100%; display:flex; justify-content:space-between; align-items:center; text-align:right; direction:rtl; padding:0.75rem 1rem;">
          <span>${opt}</span>
          <i class="fa-regular fa-circle" style="margin-right:auto; margin-left:0;"></i>
        </button>
      `;
    });
    
    html += `</div>`;
    
    qArea.innerHTML = html;
  }

  window.submitExamAnswer = function(phaseNum, qIdx, optIdx) {
    const qData = examQuestions[phaseNum][qIdx];
    const isCorrect = optIdx === qData.a;
    
    playClick();
    
    const btns = document.querySelectorAll(`#exam-question-area-${phaseNum} .exam-opt-btn`);
    btns.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === qData.a) {
        btn.style.borderColor = 'var(--success)';
        btn.style.background = 'rgba(16, 185, 129, 0.08)';
        btn.querySelector('i').className = 'fa-solid fa-circle-check';
        btn.querySelector('i').style.color = 'var(--success)';
      } else if (idx === optIdx) {
        btn.style.borderColor = 'var(--danger)';
        btn.style.background = 'rgba(239, 68, 68, 0.08)';
        btn.querySelector('i').className = 'fa-solid fa-circle-xmark';
        btn.querySelector('i').style.color = 'var(--danger)';
      }
    });
    
    const state = userExamState[phaseNum];
    state.answers.push(optIdx);
    if (isCorrect) {
      state.score++;
    }
    
    const qArea = document.getElementById(`exam-question-area-${phaseNum}`);
    const explBox = document.createElement('div');
    explBox.style.background = isCorrect ? 'rgba(16, 185, 129, 0.03)' : 'rgba(239, 68, 68, 0.03)';
    explBox.style.border = `1px dashed ${isCorrect ? 'var(--success)' : 'var(--warning)'}`;
    explBox.style.padding = '0.85rem';
    explBox.style.borderRadius = '8px';
    explBox.style.marginBottom = '1.25rem';
    explBox.style.fontSize = '0.8rem';
    explBox.style.lineHeight = '1.6';
    explBox.style.textAlign = 'right';
    explBox.style.direction = 'rtl';
    explBox.innerHTML = `
      <b style="color:${isCorrect ? 'var(--success)' : 'var(--warning)'};"><i class="fa-solid ${isCorrect ? 'fa-circle-check' : 'fa-lightbulb'}"></i> ${isCorrect ? 'إجابة صحيحة!' : 'تفسير الإجابة الصحيحة:'}</b><br>
      ${qData.e}
    `;
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-primary';
    nextBtn.style.width = '100%';
    nextBtn.textContent = (qIdx === examQuestions[phaseNum].length - 1) ? 'مشاهدة نتيجة الاختبار 🏆' : 'السؤال التالي ➡️';
    nextBtn.onclick = function() {
      state.currentQ++;
      renderExamQuestion(phaseNum);
    };
    
    qArea.appendChild(explBox);
    qArea.appendChild(nextBtn);
  };

  function finishExam(phaseNum) {
    const qArea = document.getElementById(`exam-question-area-${phaseNum}`);
    const startBtn = document.getElementById(`start-exam-btn-${phaseNum}`);
    const statusBox = document.getElementById(`exam-status-${phaseNum}`);
    
    if (!qArea || !startBtn || !statusBox) return;
    
    const state = userExamState[phaseNum];
    const totalQ = examQuestions[phaseNum].length;
    const score = state.score;
    const percent = Math.round((score / totalQ) * 100);
    const passed = percent >= 80;
    
    let html = "";
    
    if (passed) {
      playSuccessSound();
      triggerConfetti();
      localStorage.setItem(`exam-phase-${phaseNum}-passed`, 'true');
      if (phaseNum === 0) {
        const t4 = document.getElementById('itb-task-4');
        if (t4 && !t4.checked) {
          t4.checked = true;
          const item = t4.closest('.checklist-item');
          if (item) item.classList.add('completed');
          localStorage.setItem('itb-task-4', 'true');
        }
      }
      showFloatingNotification('تهانينا الحارة! لقد نجحت في الاختبار وحصلت على ترقية! 🎉👑');
      
      html = `
        <div style="text-align:center; padding:1.5rem; background:rgba(16, 185, 129, 0.05); border:1px solid var(--success); border-radius:12px; direction:rtl;">
          <i class="fa-solid fa-trophy" style="font-size:3rem; color:var(--warning); margin-bottom:1rem;"></i>
          <h3 style="color:var(--success); font-weight:900; font-size:1.3rem;">تهانينا الحارة! لقد اجتزت الاختبار بنجاح 👑</h3>
          <p style="font-size:2rem; font-weight:900; color:white; margin:1rem 0;">النتيجة: ${score} من ${totalQ} (${percent}%)</p>
          <p style="color:var(--text-muted); font-size:0.85rem; line-height:1.6; margin-bottom:1.5rem;">
            لقد أثبتّ جدارتك وتطبيقك العملي بالشكل المطلوب. تم فتح المرحلة التالية رسمياً وتحديث رتبتك المهنية في المنصة!
          </p>
          <button class="btn btn-secondary" onclick="closeExamCard(${phaseNum})" style="width:100%;">العودة للمنصة 🔄</button>
        </div>
      `;
    } else {
      playSynthSound(250, 'sawtooth', 0.25, 0.05);
      html = `
        <div style="text-align:center; padding:1.5rem; background:rgba(239, 68, 68, 0.05); border:1px solid var(--danger); border-radius:12px; direction:rtl;">
          <i class="fa-solid fa-triangle-exclamation" style="font-size:3rem; color:var(--danger); margin-bottom:1rem;"></i>
          <h3 style="color:var(--danger); font-weight:800; font-size:1.2rem;">لم تجتز الاختبار هذه المرة ⚠️</h3>
          <p style="font-size:2rem; font-weight:900; color:white; margin:1rem 0;">النتيجة: ${score} من ${totalQ} (${percent}%)</p>
          <p style="color:var(--text-muted); font-size:0.85rem; line-height:1.6; margin-bottom:1.5rem;">
            النجاح يتطلب الحصول على 80% على الأقل (4 أسئلة صحيحة). ننصحك بمراجعة المصادر والكورسات والتدرب أكثر على المعامل العملية والمحاكيات ثم المحاولة مجدداً!
          </p>
          <button class="btn btn-primary" onclick="startExam(${phaseNum})" style="width:100%; background:var(--danger); border:none;">إعادة المحاولة الآن 🔄</button>
        </div>
      `;
    }
    
    qArea.innerHTML = html;
    updateGlobalProgress();
  }
  
  window.closeExamCard = function(phaseNum) {
    const qArea = document.getElementById(`exam-question-area-${phaseNum}`);
    const startBtn = document.getElementById(`start-exam-btn-${phaseNum}`);
    const statusBox = document.getElementById(`exam-status-${phaseNum}`);
    
    if (qArea && startBtn && statusBox) {
      qArea.style.display = 'none';
      statusBox.style.display = 'block';
      checkExamUnlocks();
    }
  };

  function triggerConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#a855f7', '#06b6d4'];
    
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 4,
        d: Math.random() * canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.07 + 0.02,
        tiltAngle: 0
      });
    }
    
    let animationId;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, index) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.tilt = Math.sin(p.tiltAngle - index / 3) * 15;
        
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });
      
      update();
    }
    
    function update() {
      let remaining = 0;
      particles.forEach(p => {
        if (p.y <= canvas.height) {
          remaining++;
        }
      });
      
      if (remaining > 0) {
        animationId = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(animationId);
        canvas.remove();
      }
    }
    
    draw();
  }

  // -------------------------------------------------------------
  // Interactive HomeLab Hardware & VM Architect Logic
  // -------------------------------------------------------------
  // Initialize custom VMs array
  window.customVMs = window.customVMs || [];

  window.calculateHomeLabHW = function() {
    const hwRamInput = document.getElementById('hl-hw-ram');
    const hwCoresInput = document.getElementById('hl-hw-cores');
    const hwStorageInput = document.getElementById('hl-hw-storage');
    const hypervisorSelect = document.getElementById('hl-hypervisor');
    const raidSelect = document.getElementById('hl-raid');
    
    if (!hwRamInput || !hwCoresInput || !hwStorageInput) return;
    
    const hwRam = parseInt(hwRamInput.value) || 16;
    const hwCores = parseInt(hwCoresInput.value) || 8;
    const singleDiskRawStorage = parseInt(hwStorageInput.value) || 512;
    const hypervisor = hypervisorSelect ? hypervisorSelect.value : 'proxmox';
    const raid = raidSelect ? raidSelect.value : 'none';

    // Calculate Usable Storage based on RAID (assuming 3 identical disks)
    let usableStorage = singleDiskRawStorage;
    let rawStorageTotal = singleDiskRawStorage;
    if (raid !== 'none') {
      rawStorageTotal = singleDiskRawStorage * 3;
      if (raid === 'raid0') usableStorage = singleDiskRawStorage * 3;
      else if (raid === 'raid1') usableStorage = singleDiskRawStorage;
      else if (raid === 'raid5') usableStorage = singleDiskRawStorage * 2;
    }

    // Hypervisor Overhead
    const hypervisorOverhead = {
      proxmox: { ram: 1.5, cores: 1, storage: 10 },
      esxi: { ram: 3.0, cores: 2, storage: 20 },
      virtualbox: { ram: 1.0, cores: 1, storage: 5 },
      hyperv: { ram: 2.0, cores: 1, storage: 10 }
    };
    
    const hOverhead = hypervisorOverhead[hypervisor] || { ram: 0, cores: 0, storage: 0 };
    
    const vmSpecs = {
      ad: { ram: 4, cores: 2, storage: 60 },
      web: { ram: 1, cores: 1, storage: 20 },
      pfsense: { ram: 1, cores: 1, storage: 10 },
      docker: { ram: 2, cores: 2, storage: 40 },
      monitor: { ram: 2, cores: 1, storage: 30 },
      hass: { ram: 2, cores: 2, storage: 32 },
      truenas: { ram: 8, cores: 2, storage: 120 }
    };
    
    let totalRamReq = hOverhead.ram;
    let totalCoresReq = hOverhead.cores;
    let totalStorageReq = hOverhead.storage;
    
    Object.keys(vmSpecs).forEach(key => {
      const checkbox = document.getElementById(`hl-vm-${key}`);
      const isChecked = checkbox && checkbox.checked;
      
      if (isChecked) {
        totalRamReq += vmSpecs[key].ram;
        totalCoresReq += vmSpecs[key].cores;
        totalStorageReq += vmSpecs[key].storage;
      }
      
      // Update dynamic topology active states
      const topoNode = document.getElementById(`topo-node-${key}`);
      const topoLink = document.getElementById(`topo-link-${key}`);
      if (topoNode) {
        if (isChecked) topoNode.classList.add('active');
        else topoNode.classList.remove('active');
      }
      if (topoLink) {
        if (isChecked) topoLink.classList.add('active');
        else topoLink.classList.remove('active');
      }
    });

    // Add Custom VMs requirements
    window.customVMs.forEach(vm => {
      totalRamReq += vm.ram;
      totalCoresReq += vm.cores;
      totalStorageReq += vm.storage;
    });
    
    const ramReqEl = document.getElementById('hl-total-ram-req');
    const coresReqEl = document.getElementById('hl-total-cores-req');
    const hwStatusEl = document.getElementById('hl-hw-status');
    
    const ramPercentBar = document.getElementById('hl-ram-percent-bar');
    const coresPercentBar = document.getElementById('hl-cores-percent-bar');
    const hwAdvice = document.getElementById('hl-hw-advice');
    const complianceBox = document.getElementById('hl-hw-compliance');
    
    if (ramReqEl) ramReqEl.textContent = `${totalRamReq.toFixed(1)} GB`;
    if (coresReqEl) coresReqEl.textContent = `${totalCoresReq} Cores`;
    
    const ramPercent = Math.round((totalRamReq / hwRam) * 100);
    const coresPercent = Math.round((totalCoresReq / hwCores) * 100);
    const storagePercent = Math.round((totalStorageReq / usableStorage) * 100);
    
    if (ramPercentBar) ramPercentBar.textContent = `مستغلة: ${ramPercent}% من أصل ${hwRam}GB`;
    if (coresPercentBar) coresPercentBar.textContent = `مستغلة: ${coresPercent}% من أصل ${hwCores} Cores`;
    
    let statusClass = "correct";
    let statusText = "مستقر وممتاز ✅";
    let adviceText = "العتاد المادي كافٍ لتشغيل معملك المنزلي بسلام.";
    let advisoryHtml = "";
    
    if (ramPercent > 100 || coresPercent > 100 || storagePercent > 100) {
      statusClass = "wrong";
      statusText = "حمل زائد ⚠️";
      adviceText = "لقد تجاوزت حدود موارد العتاد المادي المتاحة!";
      
      let reasons = [];
      if (ramPercent > 100) reasons.push(`الرامات المطلوبة (${totalRamReq.toFixed(1)}GB) تتجاوز المتاح (${hwRam}GB)`);
      if (coresPercent > 100) reasons.push(`الأنوية المطلوبة (${totalCoresReq}) تتجاوز المتاح (${hwCores})`);
      if (storagePercent > 100) reasons.push(`التخزين المطلوب (${totalStorageReq}GB) يتجاوز مساحة RAID الفعلية المتاحة (${usableStorage}GB)`);

      advisoryHtml = `
        <div style="background:rgba(239, 68, 68, 0.08); border:1px solid var(--danger); padding:1rem; border-radius:8px; margin-bottom:0.75rem; direction:rtl; text-align:right;">
          <div style="color:var(--danger); font-weight:800; display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem;">
            <i class="fa-solid fa-triangle-exclamation"></i> تحذير: عتاد المعمل يتجاوز الحدود المادية (Overprovisioning)
          </div>
          <div style="color:var(--text-muted); font-size:0.8rem; line-height:1.5;">
            تتجاوز متمتطلبات السيرفرات الوهمية النشطة نسبة 100% من عتاد جهازك الفعلي (رامات: ${ramPercent}%، معالج: ${coresPercent}%، تخزين: ${storagePercent}%). سيؤدي هذا لبطء شديد في حاسوبك الحقيقي أو فشل إقلاع السيرفرات.
            <br><b>التفاصيل:</b><br>• ${reasons.join('<br>• ')}
            <br><b style="color:white; display:block; margin-top:0.5rem;">💡 الحلول المقترحة:</b>
            <ul style="margin-top:0.25rem; padding-right:1rem; list-style-type:arabic-indic;">
              <li>قم بإيقاف السيرفرات الكبيرة مؤقتاً مثل (TrueNAS / Windows Server) عند عدم الحاجة.</li>
              <li>قم بترقية عتاد جهازك الفعلي أو تقليل الموارد المخصصة لكل VM.</li>
              <li>إذا كان هناك عجز في التخزين، فكر في تغيير نظام الـ RAID إلى RAID 0 أو إيقاف الـ RAID لزيادة المساحة المتاحة.</li>
            </ul>
          </div>
        </div>
      `;
    } else if (ramPercent > 80 || coresPercent > 80 || storagePercent > 80) {
      statusClass = "warning";
      statusText = "استهلاك مرتفع ⚠️";
      adviceText = "العتاد مستهلك بنسبة كبيرة جداً، كن حذراً عند إنشاء خوادم جديدة.";
      
      advisoryHtml = `
        <div style="background:rgba(245, 158, 11, 0.08); border:1px solid var(--warning); padding:1rem; border-radius:8px; margin-bottom:0.75rem; direction:rtl; text-align:right;">
          <div style="color:var(--warning); font-weight:800; display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem;">
            <i class="fa-solid fa-lightbulb"></i> تنبيه: استهلاك عالي لموارد السيرفر الداخلي
          </div>
          <div style="color:var(--text-muted); font-size:0.8rem; line-height:1.5;">
            الموارد المتبقية ضئيلة جداً (أقل من 20% رامات أو تخزين حرة). يوصى بعدم تثبيت خدمات إضافية، وتخصيص رامات أقل لكل VM.
          </div>
        </div>
      `;
    } else {
      advisoryHtml = `
        <div style="background:rgba(16, 185, 129, 0.08); border:1px solid var(--success); padding:1rem; border-radius:8px; margin-bottom:0.75rem; direction:rtl; text-align:right;">
          <div style="color:var(--success); font-weight:800; display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem;">
            <i class="fa-solid fa-circle-check"></i> عتاد متزن ومستقر بالكامل
          </div>
          <div style="color:var(--text-muted); font-size:0.8rem; line-height:1.5;">
            جميع السيرفرات الوهمية النشطة تعمل في النطاق الآمن. راماتك الحرة تبلغ ${100 - ramPercent}% والأنوية الحرة ${100 - coresPercent}% والمساحة المتاحة ${usableStorage - totalStorageReq}GB (${100 - storagePercent}% حرة).
          </div>
        </div>
      `;
    }
    
    // Add RAID & Hypervisor details to advisory box
    let raidText = raid === 'none' ? 'بدون RAID' : raid.toUpperCase();
    advisoryHtml += `
      <div style="margin-top:0.75rem; padding:0.75rem; background:rgba(255,255,255,0.02); border:1px solid var(--border-color); border-radius:8px; font-size:0.78rem; color:var(--text-muted); direction:rtl; text-align:right;">
        🛡️ <b>تفاصيل البنية التحتية:</b><br>
        • نظام الـ Hypervisor المختار: <b style="color:white;">${hypervisor.toUpperCase()}</b> (يستهلك ${hOverhead.ram}GB RAM و ${hOverhead.storage}GB تخزين كملفات نظام).<br>
        • مصفوفة التخزين: <b style="color:white;">${raidText}</b> (سعة التخزين الخام الإجمالية للأقراص الثلاثة: ${rawStorageTotal}GB SSD/HDD، المساحة الفعلية المتاحة للاستخدام: <b style="color:var(--success);">${usableStorage}GB</b>).
      </div>
    `;

    if (hwRam >= 32 && hwCores >= 8) {
      advisoryHtml += `
        <div style="background:rgba(6, 182, 212, 0.08); border:1px solid var(--accent-secondary); padding:1rem; border-radius:8px; margin-top:0.75rem; direction:rtl; text-align:right;">
          <div style="color:var(--accent-secondary); font-weight:800; display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem;">
            <i class="fa-solid fa-graduation-cap"></i> التوصية المعمارية لنظام معملك: Proxmox VE 🖥️
          </div>
          <div style="color:var(--text-muted); font-size:0.8rem; line-height:1.5;">
            بما أن عتادك الحقيقي ممتاز (رامات 32GB+ ونواة معالج 8+)، التوصية المعمارية الذهبية هي استخدام **Proxmox VE (Type-1 Hypervisor)** كأنظمة تشغيل أساسية تثبت على العتاد المادي مباشرة لتوفير سرعة خارقة ومحاكاة حقيقية.
          </div>
        </div>
      `;
    } else {
      advisoryHtml += `
        <div style="background:rgba(168, 85, 247, 0.08); border:1px solid var(--accent-purple); padding:1rem; border-radius:8px; margin-top:0.75rem; direction:rtl; text-align:right;">
          <div style="color:var(--accent-purple); font-weight:800; display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem;">
            <i class="fa-solid fa-graduation-cap"></i> التوصية المعمارية لنظام معملك: VirtualBox 💻
          </div>
          <div style="color:var(--text-muted); font-size:0.8rem; line-height:1.5;">
            نظراً لأن عتادك الحالي يقع في النطاق الاقتصادي (رامات أقل من 32GB)، يوصى بشدة باستخدام برنامج **VirtualBox (Type-2 Hypervisor)** لتشغيل خوادمك الافتراضية داخل الويندوز مباشرة لتجنب استهلاك كامل موارد لابتوبك الأساسي.
          </div>
        </div>
      `;
    }
    
    if (hwStatusEl) {
      hwStatusEl.textContent = statusText;
      if (statusClass === 'correct') {
        hwStatusEl.style.color = 'var(--success)';
      } else if (statusClass === 'wrong') {
        hwStatusEl.style.color = 'var(--danger)';
      } else {
        hwStatusEl.style.color = 'var(--warning)';
      }
    }
    if (hwAdvice) hwAdvice.textContent = adviceText;
    if (complianceBox) complianceBox.innerHTML = advisoryHtml;
  };

  // -------------------------------------------------------------
  // IT Interview Prep Simulator Logic
  // -------------------------------------------------------------
  const interviewQuestions = {
    net: [
      {
        q: "ما الذي يحدث بالتفصيل عند كتابة google.com في متصفحك والضغط على Enter؟",
        d: "هذا السؤال يكشف مدى إدراكك لتكامل الشبكات، وهو الأشهر في المقابلات.",
        a: "1. **DNS Lookup:** يبدأ المتصفح بالبحث عن عنوان الـ IP لموقع google.com في الـ Cache المحلي، ثم ملف hosts، ثم يرسل للـ Local DNS Resolver.<br>2. **TCP 3-Way Handshake:** بعد جلب الـ IP، يتم إنشاء اتصال TCP بين جهازك وسيرفر جوجل (SYN -> SYN-ACK -> ACK).<br>3. **HTTP/HTTPS Request:** يقوم المتصفح بطلب صفحة الويب عبر بروتوكول TLS المشفر.<br>4. **Response & Rendering:** يرسل خادم جوجل الصفحة بصيغة HTML/CSS/JS، ليقوم المتصفح برسمها وعرضها لك بصرياً."
      },
      {
        q: "ما هو الفرق بين بروتوكولي النقل TCP و UDP ومتى تستخدمهما؟",
        d: "مقارنة كلاسيكية بين ركائز نقل البيانات في الشبكة.",
        a: "**TCP (Reliable & Connection-Oriented):** يضمن وصول البيانات وترتيبها وخلوها من الأخطاء عبر تقنيات التدفق والتحقق وإعادة الإرسال. يستخدم في: تصفح الويب (HTTP)، نقل الملفات (FTP)، والبريد الإلكتروني (SMTP).<br>**UDP (Fast & Connectionless):** لا يضمن الترتيب أو الوصول ولكنه يقدم سرعة خارقة وأقل استهلاك للموارد. يستخدم في: بث الفيديو المباشر، الألعاب الأونلاين، واستعلامات الـ DNS."
      },
      {
        q: "شرح آلية عمل بروتوكول DHCP وتوزيع الـ IPs (DORA Process)؟",
        d: "فحص فهمك للخدمات التلقائية الأساسية في الشبكات المحلية.",
        a: "العملية تتم عبر 4 خطوات برمجية:<br>1. **Discover (Broadcast):** يبحث الجهاز الجديد في الشبكة عن أي خادم DHCP متاح.<br>2. **Offer (Unicast/Broadcast):** يقترح خادم DHCP عنوان IP غير مستغل مع قناع الشبكة والبوابة الافتراضية.<br>3. **Request (Broadcast):** يطلب الجهاز حجز هذا العنوان المقترح رسمياً.<br>4. **Acknowledge (Unicast/Broadcast):** يؤكد الخادم الحجز ويسجل الماك أدرس للجهاز في قاعدة بياناته وتفعيل وقت الإيجار (Lease Time)."
      }
    ],
    linux: [
      {
        q: "ما هو الفرق الجوهري بين Soft Link و Hard Link في أنظمة لينكس؟",
        d: "سؤال أساسي في بنية ملفات نظام تشغيل لينكس ومفهوم الـ Inode.",
        a: "**Soft Link (Symlink):** هو عبارة عن ملف اختصار (Shortcut) يحتوي على مسار الملف الأصلي فقط. إذا حُذف الملف الأصلي، يصبح الـ Soft Link تالفاً (Broken Link).<br>**Hard Link:** هو إشارة مباشرة لنفس مساحة التخزين والـ Inode للملف الأصلي. إذا حُذف الملف الأصلي، يظل الـ Hard Link محتفظاً بالبيانات ويعمل بشكل كامل كنسخة مستقلة تماماً."
      },
      {
        q: "كيف يعمل نظام صلاحيات لينكس المكون من 3 أرقام (مثال: chmod 755) وما هي الـ Sticky Bit؟",
        d: "فحص فهمك لأمان الملفات والحماية في بيئات اللينكس.",
        a: "الأرقام الثلاثة تمثل: (المالك Owner -> المجموعة Group -> الآخرين Others).<br>حيث: **Read (4)**، **Write (2)**، **Execute (1)**.<br>القيمة **7** تعني (4+2+1) صلاحيات كاملة. القيمة **5** تعني (4+1) قراءة وتشغيل فقط. إذن 755 تمنح المالك صلاحية كاملة والبقية قراءة وتشغيل.<br>**Sticky Bit (t):** هي صلاحية خاصة توضع على المجلدات المشتركة (مثل /tmp) تمنع أي مستخدم من حذف أو تعديل ملفات مستخدم آخر حتى لو كان يمتلك صلاحية كتابة كاملة على المجلد."
      },
      {
        q: "ما هو الـ systemd وكيف تنشئ خدمة خلفية مخصصة (Custom Service)؟",
        d: "فحص قدرتك على كتابة وإدارة الخدمات على خوادم لينكس الإنتاجية.",
        a: "**systemd:** هو النظام الأساسي لإدارة وإقلاع الخدمات في التوزيعات الحديثة.<br>لإنشاء خدمة مخصصة، ننشئ ملفاً بالامتداد `.service` في المسار `/etc/systemd/system/myapp.service` يحتوي على:<br>1. **[Unit]:** وصف الخدمة.<br>2. **[Service]:** أمر تشغيل السكربت (ExecStart) والمستخدم المسؤول ومبدأ إعادة التشغيل التلقائي عند الفشل (Restart=always).<br>3. **[Install]:** لتفعيل التشغيل التلقائي مع إقلاع السيرفر.<br>ثم نفعل الخدمة بأمر `systemctl enable --now myapp`."
      }
    ],
    win: [
      {
        q: "ما هي أدوار الـ FSMO الخمسة في الـ Active Directory وما الذي يحدث عند توقف أحدها؟",
        d: "أهم ركيزة لإدارة الدومين المركزي لشبكات ويندوز سيرفر.",
        a: "أدوار الـ Flexible Single Master Operation هي:<br>1. **Schema Master:** إدارة تعديل وتحديث هيكل قاعدة بيانات الدليل النشط.<br>2. **Domain Naming Master:** التحكم في إضافة أو حذف الدومينات الفرعية.<br>3. **PDC Emulator:** مزامنة الوقت، وإدارة تغيير كلمات المرور وتأمينها فوراً.<br>4. **RID Master:** توليد معرفات الأمان الفريدة (SIDs) لجميع الحسابات الجديدة.<br>5. **Infrastructure Master:** تحديث المراجع والعلاقات بين الكائنات عبر الدومينات المتعددة.<br>توقف الـ PDC يؤدي فوراً لمشاكل دخول الموظفين، بينما بقية الأدوار يمكن تحمل انقطاعها لفترات أطول أو نقلها (Seize) يدوياً."
      },
      {
        q: "شرح ترتيب تطبيق سياسات الـ Group Policy (GPO) وآلية حل التعارضات؟",
        d: "سؤال أساسي في هيكلة وحل مشاكل تطبيق السياسات الأمنية للموظفين.",
        a: "الترتيب القياسي للتطبيق هو **LSDOU**:<br>1. **Local:** سياسات الجهاز المحلي أولاً.<br>2. **Site:** السياسات المرتبطة بالموقع الجغرافي.<br>3. **Domain:** السياسات المرتبطة بالدومين بالكامل.<br>4. **OU (Organizational Unit):** السياسات المرتبطة بالوحدة التنظيمية التي ينتمي إليها الحساب.<br>في حال وجود تعارض، **آخر سياسة يتم تطبيقها هي التي تفوز وتلغي ما قبلها** (أي الـ OU تلغي الـ Domain). إلا في حال تم تفعيل خيار **Enforced** على مستوى الدومين فيفرض سياسته فوق الجميع."
      },
      {
        q: "ما الفرق بين Primary Zone و Secondary Zone و Stub Zone في DNS ويندوز سيرفر؟",
        d: "فحص عمق فهمك لآليات توزيع وحل أسماء الأجهزة بالشبكة المحلية.",
        a: "**Primary Zone:** هي النسخة الأساسية لقاعدة بيانات الـ DNS وتدعم القراءة والكتابة بالكامل.<br>**Secondary Zone:** نسخة طبق الأصل للقراءة فقط تُنسخ من الـ Primary لتخفيف الضغط وتوفير استمرارية الخدمة (Zone Transfer).<br>**Stub Zone:** نسخة تحتوي فقط على السجلات المرجعية الأساسية للوصول للخادم المسؤول (NS, A, SOA) وتستخدم لتسهيل التحويل وحل الأسماء بين شركتين شريكتين بسرعة ودون استنساخ كامل السجلات."
      }
    ],
    cloud: [
      {
        q: "ما هو الفرق الجوهري في المعمارية بين Docker Containers والـ Virtual Machines؟",
        d: "فحص فهمك للتحول الحديث في تشغيل التطبيقات السحابية.",
        a: "**Virtual Machines:** تحتوي على نظام تشغيل كامل (Guest OS) يعمل فوق الـ Hypervisor والعتاد المادي. تستهلك رامات ومساحة تخزين هائلة (بالجيجابايت) وتستغرق دقائق للإقلاع.<br>**Docker Containers:** تشارك نواة نظام التشغيل الأساسي للمستضيف (Host Kernel) وتعمل كعمليات معزولة تماماً في الـ User Space. تستهلك ميجابايت قليلة جداً وتقلع في أجزاء من الثانية، مما يسمح بتشغيل مئات الحاويات على سيرفر واحد اقتصادي."
      },
      {
        q: "لماذا يعتبر ملف الـ State في Terraform (terraform.tfstate) بالغ الأهمية وكيف تحميه؟",
        d: "ركيزة أتمتة البنية التحتية كأكواد (IaC) بشكل آمن.",
        a: "ملف الـ State هو خريطة الحقيقة الوحيدة لـ Terraform؛ حيث يخزن تطابق الأكواد مع الموارد الحقيقية المنشأة على السحابة.<br>إذا ضاع أو تلعثم، لن يعرف Terraform ما تم إنشاؤه مما يؤدي لتخريب السيرفرات.<br>**سياسته الأمنية:** يوصى بشدة بعدم حفظه محلياً، بل حفظه عن بعد (Remote Backend) مثل AWS S3 أو Azure Storage، مع تفعيل خاصية **State Locking** (عبر DynamoDB) لمنع عمل مهندسين معاً وتعارض الأكواد، وتشفير الملف لاحتوائه على كلمات مرور سرية."
      },
      {
        q: "كيف يعمل خط أتمتة التطوير والتشغيل (CI/CD Pipeline) وما هي مراحله الأساسية؟",
        d: "فحص فهمك لسر ومحرك الممارسات السحابية الحديثة DevOps.",
        a: "هو مسار مؤتمت بالكامل يربط المطورين بالخوادم الحية لضمان سرعة وجودة إطلاق الميزات:<br>1. **Continuous Integration (CI):** عند رفع الكود لـ GitHub، تنطلق اختبارات آلية (Tests) لبناء الكود (Build) وفحصه أمنياً.<br>2. **Continuous Delivery (CD):** بعد النجاح، يتم توليد أرشيف أو حاوية Docker وإرسالها لمستودع الصور.<br>3. **Continuous Deployment (CD):** يتم سحب النسخة الجديدة تلقائياً ونشرها على سيرفرات Kubernetes أو خوادم الشركة الحية دون أي تدخل بشري ودون انقطاع الخدمة (Zero-Downtime)."
      }
    ]
  };

  let currentInterviewCat = 'net';
  let currentInterviewIdx = 0;

  window.switchInterviewCategory = function(cat) {
    playClick();
    currentInterviewCat = cat;
    currentInterviewIdx = 0;
    
    // Toggle active tab buttons
    const btns = document.querySelectorAll('#interview-category-selector .difficulty-btn');
    btns.forEach(btn => {
      const onclickText = btn.getAttribute('onclick');
      if (onclickText && onclickText.includes(`'${cat}'`)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    renderInterviewQuestion();
  };

  window.revealInterviewAnswer = function() {
    playClick();
    const ansBox = document.getElementById('interview-answer-box');
    if (!ansBox) return;
    
    const qData = interviewQuestions[currentInterviewCat][currentInterviewIdx];
    ansBox.innerHTML = `
      <b style="color:var(--accent-primary); display:block; margin-bottom:0.5rem; text-align: right; direction: rtl;"><i class="fa-solid fa-lightbulb"></i> الإجابة النموذجية المقترحة:</b>
      <div style="text-align: right; direction: rtl; color: var(--text-primary); line-height:1.6;">${qData.a}</div>
    `;
    ansBox.style.display = 'block';
  };

  window.nextInterviewQuestion = function() {
    playClick();
    const count = interviewQuestions[currentInterviewCat].length;
    currentInterviewIdx = (currentInterviewIdx + 1) % count;
    renderInterviewQuestion();
  };

  function renderInterviewQuestion() {
    const titleEl = document.getElementById('interview-question-title');
    const descEl = document.getElementById('interview-question-desc');
    const ansBox = document.getElementById('interview-answer-box');
    const notesBox = document.getElementById('interview-user-notes');
    
    if (!titleEl || !descEl) return;

    const qData = interviewQuestions[currentInterviewCat][currentInterviewIdx];
    titleEl.textContent = `السؤال: ${qData.q}`;
    descEl.textContent = qData.d;
    
    if (ansBox) {
      ansBox.style.display = 'none';
      ansBox.innerHTML = '';
    }
    if (notesBox) {
      notesBox.value = '';
    }
  }

  // -------------------------------------------------------------
  // Quick Cheat Sheets Explorer Logic
  // -------------------------------------------------------------
  const cheatCommands = [
    // Cisco IOS
    { cmd: "enable", cat: "cisco", desc: "الدخول إلى وضع المستخدم المميز (Privileged EXEC Mode) لتنفيذ أوامر العرض والاختبار." },
    { cmd: "configure terminal", cat: "cisco", desc: "الدخول إلى وضع الإعداد العام للراوتر أو السويتش (Global Configuration Mode) لتعديل البرمجيات." },
    { cmd: "interface vlan 10", cat: "cisco", desc: "الدخول لإعداد كارت الشبكة الافتراضي رقم 10 وتعيين عنوان الـ IP الخاص به كـ Gateway للقسم." },
    { cmd: "switchport mode trunk", cat: "cisco", desc: "تفعيل منفذ السويتش ليكون منفذ Trunk يسمح بمرور حزم عدة شبكات VLANs مختلفة عبر كابل فيزيائي واحد." },
    { cmd: "show ip interface brief", cat: "cisco", desc: "أهم أمر لفحص الحالة التشغيلية واللحظية لجميع كروت السويتش أو الراوتر دفعة واحدة." },
    { cmd: "show running-config", cat: "cisco", desc: "عرض كامل إعدادات السيرفر والشبكة النشطة والمحفوظة حالياً في الـ RAM لمعاينتها وحلها." },
    
    // Linux OS
    { cmd: "systemctl restart nginx", cat: "linux", desc: "إعادة تشغيل خدمة خادم الويب Nginx فوراً لتطبيق تعديلات ملفات الإعداد الجديدة." },
    { cmd: "chmod 755 script.sh", cat: "linux", desc: "تخصيص صلاحيات الملف ليكون قابلاً للتنفيذ من المالك وقابلاً للقراءة والتشغيل فقط من البقية." },
    { cmd: "df -h", cat: "linux", desc: "فحص مساحات الأقراص الصلبة وجميع المجلدات المتصلة بالسيرفر بشكل مقروء وسهل (Human Readable)." },
    { cmd: "ip a", cat: "linux", desc: "عرض تفاصيل كروت الشبكة الحالية، الماك أدرس، وعناوين الـ IP المتصلة بسيرفر لينكس." },
    { cmd: "journalctl -u nginx -f", cat: "linux", desc: "تتبع سجلات الأخطاء لخدمة Nginx بشكل حي ولحظي لتشخيص وحل المشاكل الإنتاجية الطارئة." },
    { cmd: "tail -f /var/log/syslog", cat: "linux", desc: "فحص ذيل سجل أحداث النظام العام وقراءة وتتبع العمليات الخلفية لحظة بلحظة." },
    
    // PowerShell
    { cmd: "Get-Service -Name W3SVC", cat: "powershell", desc: "جلب الحالة اللحظية لخدمة خادم الويب IIS بويندوز للتأكد هل هي تعمل أم متوقفة." },
    { cmd: "New-ADUser -Name \"Ali\" -Enabled $true", cat: "powershell", desc: "أمر إنشاء حساب مستخدم موظف جديد في Active Directory وتفعيله فوراً." },
    { cmd: "Get-EventLog -LogName Application -Newest 10", cat: "powershell", desc: "جلب آخر 10 أحداث مسجلة في سجل التطبيقات لمراقبة أخطاء البرامج والخدمات بويندوز سيرفر." },
    { cmd: "Test-NetConnection -ComputerName google.com -Port 443", cat: "powershell", desc: "أمر الفحص الذهبي للتحقق من الاتصال بسيرفر معين عبر منفذ محدد لكشف جدران الحماية المغلقة." },
    { cmd: "Restart-Service -Name \"Spooler\"", cat: "powershell", desc: "أمر إعادة تشغيل خدمة الطابعات المركزية بويندوز فوراً لحل مشاكل تجمد عمليات الطباعة." }
  ];

  let currentCheatCat = 'all';

  window.switchCheatCategory = function(cat) {
    playClick();
    currentCheatCat = cat;
    
    // Toggle active buttons
    const btns = document.querySelectorAll('#cheat-category-selector .difficulty-btn');
    btns.forEach(btn => {
      const onclickText = btn.getAttribute('onclick');
      if (onclickText && onclickText.includes(`'${cat}'`)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    filterCheatSheets();
  };

  window.filterCheatSheets = function() {
    const searchVal = (document.getElementById('cheat-search-input')?.value || '').toLowerCase();
    const tbody = document.getElementById('cheat-sheet-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const filtered = cheatCommands.filter(item => {
      const matchCat = (currentCheatCat === 'all' || item.cat === currentCheatCat);
      const matchSearch = item.cmd.toLowerCase().includes(searchVal) || item.desc.toLowerCase().includes(searchVal);
      return matchCat && matchSearch;
    });
    
    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="3" style="text-align:center; color:var(--text-muted); padding:1.5rem;">لا توجد أوامر تطابق بحثك حالياً! 🔍</td>
        </tr>
      `;
      return;
    }
    
    filtered.forEach(item => {
      const tr = document.createElement('tr');
      
      const badgeText = item.cat === 'cisco' ? 'Cisco IOS' : item.cat === 'linux' ? 'Linux OS' : 'PowerShell';
      const badgeClass = item.cat === 'cisco' ? 'tool-badge-local' : item.cat === 'linux' ? 'tool-badge-web' : 'tool-badge-local';
      
      tr.innerHTML = `
        <td style="font-weight:700;"><span class="cheat-command-code">${item.cmd}</span></td>
        <td><span class="tool-badge ${badgeClass}" style="font-size:0.7rem; font-family:var(--font-english); font-weight:800;">${badgeText}</span></td>
        <td style="direction:rtl; text-align:right; font-weight:600; color:var(--text-muted); line-height:1.5;">${item.desc}</td>
      `;
      tbody.appendChild(tr);
    });
  };

  // -------------------------------------------------------------
  // IT Certifications Track Logic
  // -------------------------------------------------------------
  window.incrementCert = function(id, amount) {
    playClick();
    const key = `cert_progress_${id}`;
    let val = parseInt(localStorage.getItem(key) || '0');
    val = Math.min(val + amount, 100);
    localStorage.setItem(key, val.toString());
    updateCertUI(id);
    
    if (val === 100) {
      playSuccessSound();
      if (typeof triggerConfetti === 'function') triggerConfetti();
    }
  };

  window.resetCert = function(id) {
    playClick();
    const key = `cert_progress_${id}`;
    localStorage.setItem(key, '0');
    updateCertUI(id);
  };

  function updateCertUI(id) {
    const key = `cert_progress_${id}`;
    const val = parseInt(localStorage.getItem(key) || '0');
    
    const fillEl = document.getElementById(`cert-progress-${id}`);
    const textEl = document.getElementById(`cert-text-${id}`);
    
    if (fillEl) fillEl.style.width = `${val}%`;
    if (textEl) textEl.textContent = `التقدم الحالي: ${val}%`;
  }

  function initializeCerts() {
    ['ccna', 'rhcsa', 'az104', 'sec'].forEach(id => {
      updateCertUI(id);
    });
  }

  // -------------------------------------------------------------
  // Export Custom Plan to Printable PDF
  // -------------------------------------------------------------
  window.exportToPDF = function() {
    playClick();
    const oldTitle = document.title;
    document.title = "خريطة طريق مهندس الأنظمة والشبكات الاحترافية - المهندس عبدالرحمن نمر";
    window.print();
    document.title = oldTitle;
  };

  // -------------------------------------------------------------
  // 6. Global Startup Initializations
  // -------------------------------------------------------------
  checkDailyQuizState();
  filterPorts();
  checkExamUnlocks();
  
  // Advanced Roadmap Tools Initializations
  renderInterviewQuestion();
  filterCheatSheets();
  initializeCerts();
  
  if (document.getElementById('hl-hw-ram')) {
    calculateHomeLabHW();
  }
  if (document.getElementById('dr-data-size')) {
    calculateDRSimulator();
  }
  if (document.getElementById('gpo-pass-complexity')) {
    updateGPOSandbox();
  }
  if (document.getElementById('vlsm-base')) {
    calculateVLSM();
  }
  if (document.getElementById('net-sim-scenario')) {
    loadNetworkScenario();
  }
  if (document.getElementById('cloud-provider')) {
    calculateCloudPlanner();
  }
  if (document.getElementById('script-scenario')) {
    loadAutomationScript();
  }

  // ==========================================================================
  // Active Directory Explorer Tree Implementation
  // ==========================================================================
  let adTreeData = {
    name: "corp.local",
    type: "domain",
    expanded: true,
    children: [
      {
        name: "Users",
        type: "ou",
        expanded: true,
        children: [
          { name: "Administrator", type: "user" },
          { name: "Guest", type: "user" }
        ]
      },
      {
        name: "Computers",
        type: "ou",
        expanded: true,
        children: [
          { name: "DC-01", type: "computer" }
        ]
      }
    ]
  };

  window.renderADTree = function() {
    const rootContainer = document.getElementById('ad-tree-root');
    if (!rootContainer) return;
    rootContainer.innerHTML = '';
    
    function createNodeEl(node) {
      const nodeDiv = document.createElement('div');
      nodeDiv.className = 'ad-tree-node';
      
      const itemDiv = document.createElement('div');
      itemDiv.className = 'ad-tree-item';
      
      if (node.isNew) {
        itemDiv.classList.add('ad-node-added');
        node.isNew = false;
      }
      
      const hasChildren = node.children && node.children.length > 0;
      
      if (hasChildren || node.type === 'ou' || node.type === 'domain') {
        const toggle = document.createElement('i');
        toggle.className = 'ad-node-toggle fa-solid fa-caret-left';
        if (node.expanded) {
          toggle.classList.add('open');
        }
        itemDiv.appendChild(toggle);
        
        itemDiv.addEventListener('click', (e) => {
          e.stopPropagation();
          node.expanded = !node.expanded;
          renderADTree();
        });
      } else {
        const placeholder = document.createElement('span');
        placeholder.style.width = '12px';
        placeholder.style.display = 'inline-block';
        itemDiv.appendChild(placeholder);
      }
      
      const icon = document.createElement('i');
      let iconClass = 'fa-solid ';
      if (node.type === 'domain') iconClass += 'fa-server domain';
      else if (node.type === 'ou') iconClass += 'fa-folder ou';
      else if (node.type === 'user') iconClass += 'fa-user user';
      else if (node.type === 'group') iconClass += 'fa-users group';
      else if (node.type === 'computer') iconClass += 'fa-desktop computer';
      icon.className = `ad-node-icon ${iconClass}`;
      itemDiv.appendChild(icon);
      
      const nameSpan = document.createElement('span');
      nameSpan.className = 'ad-node-name';
      nameSpan.textContent = node.name;
      itemDiv.appendChild(nameSpan);
      
      nodeDiv.appendChild(itemDiv);
      
      if (hasChildren && node.expanded) {
        const childrenDiv = document.createElement('div');
        childrenDiv.className = 'ad-node-children';
        node.children.forEach(child => {
          childrenDiv.appendChild(createNodeEl(child));
        });
        nodeDiv.appendChild(childrenDiv);
      }
      
      return nodeDiv;
    }
    
    rootContainer.appendChild(createNodeEl(adTreeData));
  };

  // ==========================================================================
  // Cloud Architecture Interactive Canvas Implementation
  // ==========================================================================
  let isCloudCanvasInit = false;
  let cloudNodes = [];
  let cloudConnections = [];
  let cloudConnectMode = false;
  let connectSourceNodeId = null;

  window.initCloudCanvas = function() {
    if (isCloudCanvasInit) return;
    const paletteItems = document.querySelectorAll('.palette-item');
    const canvas = document.getElementById('cloud-canvas');
    if (!canvas) return;

    paletteItems.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        const type = item.getAttribute('data-type');
        e.dataTransfer.setData('text/plain', type);
      });
    });

    canvas.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    canvas.addEventListener('drop', (e) => {
      e.preventDefault();
      const type = e.dataTransfer.getData('text/plain');
      if (!type) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - 55;
      const y = e.clientY - rect.top - 25;
      
      addCloudNode(type, x, y);
    });

    isCloudCanvasInit = true;
  };

  function addCloudNode(type, x, y) {
    const canvas = document.getElementById('cloud-canvas');
    const emptyState = document.getElementById('canvas-empty-state');
    if (!canvas) return;

    if (emptyState) emptyState.style.display = 'none';

    const nodeId = 'node-' + Date.now();
    let label = '';
    let icon = '';
    let subLabel = '';
    
    if (type === 'internet') {
      label = 'الإنترنت العام';
      icon = 'fa-globe';
      subLabel = 'مدخل حركة المرور';
    } else if (type === 'gateway') {
      label = 'App Gateway';
      icon = 'fa-door-open';
      subLabel = 'حماية وتوجيه الويب';
    } else if (type === 'lb') {
      label = 'Load Balancer';
      icon = 'fa-network-wired';
      subLabel = 'موازن الأحمال';
    } else if (type === 'vm') {
      label = 'VM Server';
      icon = 'fa-server';
      subLabel = 'تشغيل التطبيق';
    } else if (type === 'db') {
      label = 'Database SQL';
      icon = 'fa-database';
      subLabel = 'حفظ البيانات';
    }

    const nodeObj = { id: nodeId, type, x, y, label };
    cloudNodes.push(nodeObj);

    const nodeEl = document.createElement('div');
    nodeEl.className = 'cloud-node';
    nodeEl.id = nodeId;
    nodeEl.setAttribute('data-id', nodeId);
    nodeEl.setAttribute('data-type', type);
    nodeEl.style.left = x + 'px';
    nodeEl.style.top = y + 'px';

    nodeEl.innerHTML = `
      <i class="cloud-node-icon fa-solid ${icon}"></i>
      <span class="cloud-node-label">${label}</span>
      <span class="cloud-node-sub">${subLabel}</span>
      <span class="cloud-node-delete" onclick="deleteCloudNode('${nodeId}', event)">&times;</span>
    `;

    nodeEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (cloudConnectMode) {
        if (connectSourceNodeId === null) {
          connectSourceNodeId = nodeId;
          nodeEl.classList.add('connecting-source');
        } else {
          if (connectSourceNodeId !== nodeId) {
            const exists = cloudConnections.some(c => 
              (c.from === connectSourceNodeId && c.to === nodeId) || 
              (c.from === nodeId && c.to === connectSourceNodeId)
            );
            if (!exists) {
              cloudConnections.push({ from: connectSourceNodeId, to: nodeId });
              playSuccessSound();
            }
          }
          const prevSrc = document.getElementById(connectSourceNodeId);
          if (prevSrc) prevSrc.classList.remove('connecting-source');
          connectSourceNodeId = null;
          drawCloudConnections();
          auditCloudSecurity();
        }
      } else {
        document.querySelectorAll('.cloud-node').forEach(n => {
          if (n.id !== nodeId) n.classList.remove('selected');
        });
        nodeEl.classList.toggle('selected');
      }
    });

    enableDragElement(nodeEl, nodeObj);
    canvas.appendChild(nodeEl);
    
    drawCloudConnections();
    auditCloudSecurity();
  }

  window.deleteCloudNode = function(id, event) {
    if (event) event.stopPropagation();
    
    const nodeEl = document.getElementById(id);
    if (nodeEl) nodeEl.remove();

    cloudNodes = cloudNodes.filter(n => n.id !== id);
    cloudConnections = cloudConnections.filter(c => c.from !== id && c.to !== id);

    if (connectSourceNodeId === id) {
      connectSourceNodeId = null;
    }

    const canvas = document.getElementById('cloud-canvas');
    const emptyState = document.getElementById('canvas-empty-state');
    if (canvas && cloudNodes.length === 0 && emptyState) {
      emptyState.style.display = 'block';
    }

    playClick();
    drawCloudConnections();
    auditCloudSecurity();
  };

  window.clearCloudCanvas = function() {
    playClick();
    cloudNodes = [];
    cloudConnections = [];
    connectSourceNodeId = null;
    
    const nodes = document.querySelectorAll('.cloud-node');
    nodes.forEach(n => n.remove());

    const emptyState = document.getElementById('canvas-empty-state');
    if (emptyState) emptyState.style.display = 'block';

    drawCloudConnections();
    auditCloudSecurity();
  };

  window.toggleCloudConnectMode = function() {
    playClick();
    cloudConnectMode = !cloudConnectMode;
    
    const btn = document.getElementById('cloud-connect-toggle');
    if (btn) {
      if (cloudConnectMode) {
        btn.innerHTML = '<i class="fa-solid fa-link"></i> وضع التوصيل: مفتوح';
        btn.style.background = 'linear-gradient(135deg, var(--success), var(--accent-secondary))';
        showFloatingNotification('اضغط على العقدة الأولى ثم العقدة الثانية لتوصيلهما!');
      } else {
        btn.innerHTML = '<i class="fa-solid fa-link"></i> وضع التوصيل: مغلق';
        btn.style.background = 'linear-gradient(135deg, var(--warning), var(--accent-secondary))';
        if (connectSourceNodeId) {
          const prevSrc = document.getElementById(connectSourceNodeId);
          if (prevSrc) prevSrc.classList.remove('connecting-source');
          connectSourceNodeId = null;
        }
      }
    }
  };

  function drawCloudConnections() {
    const svg = document.getElementById('cloud-canvas-svg');
    if (!svg) return;
    svg.innerHTML = '';

    cloudConnections.forEach(conn => {
      const fromNode = cloudNodes.find(n => n.id === conn.from);
      const toNode = cloudNodes.find(n => n.id === conn.to);
      if (!fromNode || !toNode) return;

      const fromEl = document.getElementById(conn.from);
      const toEl = document.getElementById(conn.to);
      if (!fromEl || !toEl) return;

      const fromWidth = fromEl.offsetWidth || 110;
      const fromHeight = fromEl.offsetHeight || 50;
      const toWidth = toEl.offsetWidth || 110;
      const toHeight = toEl.offsetHeight || 50;

      const x1 = fromNode.x + fromWidth / 2;
      const y1 = fromNode.y + fromHeight / 2;
      const x2 = toNode.x + toWidth / 2;
      const y2 = toNode.y + toHeight / 2;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      
      const dx = x2 - x1;
      const dy = y2 - y1;
      const cx1 = x1 + dx * 0.25;
      const cy1 = y1 + dy * 0.1;
      const cx2 = x1 + dx * 0.75;
      const cy2 = y2 - dy * 0.1;

      path.setAttribute('d', `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`);
      
      let isSec = true;
      if ((fromNode.type === 'internet' && toNode.type === 'db') || (fromNode.type === 'db' && toNode.type === 'internet')) {
        isSec = false;
      }
      
      path.setAttribute('class', `connection-flow ${isSec ? 'secure' : 'insecure'}`);
      path.setAttribute('stroke', isSec ? 'var(--success)' : 'var(--danger)');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('fill', 'none');

      svg.appendChild(path);
    });
  }

  function auditCloudSecurity() {
    const scoreEl = document.getElementById('canvas-security-score');
    const statusEl = document.getElementById('canvas-security-status');
    const advisorEl = document.getElementById('canvas-advisor-box');
    const nodeCountEl = document.getElementById('canvas-node-count');
    const monthlyCostEl = document.getElementById('canvas-monthly-cost');

    if (!scoreEl || !statusEl || !advisorEl || !nodeCountEl || !monthlyCostEl) return;

    nodeCountEl.textContent = `${cloudNodes.length} عقد`;

    let baseCost = 0;
    cloudNodes.forEach(node => {
      if (node.type === 'gateway') baseCost += 40;
      else if (node.type === 'lb') baseCost += 25;
      else if (node.type === 'vm') baseCost += 15;
      else if (node.type === 'db') baseCost += 30;
    });

    const isHaChecked = document.getElementById('cloud-ha')?.checked || false;
    let finalCost = baseCost;
    if (isHaChecked && baseCost > 0) {
      finalCost = baseCost * 1.5; 
    }
    monthlyCostEl.textContent = `$${finalCost.toFixed(2)}`;

    let score = 100;
    let warnings = [];
    let recommendation = '';

    if (cloudNodes.length === 0) {
      scoreEl.textContent = '100%';
      scoreEl.style.color = 'var(--success)';
      statusEl.textContent = 'مساحة عمل فارغة';
      statusEl.style.color = 'var(--text-muted)';
      advisorEl.innerHTML = `💡 <b>مستشار المعمارية السحابية:</b> قم بتصميم معمارية بسيطة (مثال: ربط شبكة الإنترنت بموازن أحمال، ومن موازن الأحمال إلى سيرفر الويب، ومن سيرفر الويب إلى قاعدة البيانات) لتشغيل تقيية التكلفة والأمان.`;
      return;
    }

    const dbNodes = cloudNodes.filter(n => n.type === 'db');
    const internetNodes = cloudNodes.filter(n => n.type === 'internet');
    const vmNodes = cloudNodes.filter(n => n.type === 'vm');
    const lbNodes = cloudNodes.filter(n => n.type === 'lb');
    const gwNodes = cloudNodes.filter(n => n.type === 'gateway');

    function isConnected(id1, id2) {
      return cloudConnections.some(c => 
        (c.from === id1 && c.to === id2) || 
        (c.from === id2 && c.to === id1)
      );
    }

    function hasPath(fromType, toType) {
      const visited = new Set();
      let found = false;
      
      function dfs(nodeId) {
        if (visited.has(nodeId)) return;
        visited.add(nodeId);
        
        const node = cloudNodes.find(n => n.id === nodeId);
        if (node && node.type === toType) {
          found = true;
          return;
        }
        
        cloudConnections.forEach(c => {
          if (c.from === nodeId) dfs(c.to);
          if (c.to === nodeId) dfs(c.from);
        });
      }
      
      cloudNodes.filter(n => n.type === fromType).forEach(startNode => {
        dfs(startNode.id);
      });
      
      return found;
    }

    let directInternetDB = false;
    dbNodes.forEach(db => {
      internetNodes.forEach(intNode => {
        if (isConnected(db.id, intNode.id)) {
          directInternetDB = true;
        }
      });
    });

    if (directInternetDB) {
      score -= 50;
      warnings.push('🔴 <b>خطورة أمنية قصوى:</b> تم ربط قاعدة البيانات مباشرة بالإنترنت! هذا يعرض بياناتك الحساسة للسرقة وهجمات الاختراق المباشرة.');
    }

    let internetToDbPath = hasPath('internet', 'db');
    if (internetToDbPath && !directInternetDB) {
      dbNodes.forEach(db => {
        cloudConnections.forEach(c => {
          let otherId = c.from === db.id ? c.to : (c.to === db.id ? c.from : null);
          if (otherId) {
            const other = cloudNodes.find(n => n.id === otherId);
            if (other && other.type !== 'vm') {
              score -= 15;
              warnings.push(`⚠️ <b>تنبيه أمني:</b> قاعدة البيانات متصلة بـ (${other.label}) مباشرة. الممارسة الصحيحة هي وضع قاعدة البيانات في شبكة داخلية معزولة (Private Subnet) وربطها فقط بسيرفر التطبيقات (VM).`);
            }
          }
        });
      });
    }

    dbNodes.forEach(db => {
      const isConn = cloudConnections.some(c => c.from === db.id || c.to === db.id);
      if (!isConn) {
        score -= 5;
        warnings.push(`ℹ️ <b>تنبيه تكوين:</b> قاعدة البيانات معزولة ولا توجد أي روابط اتصال تؤدي إليها.`);
      }
    });

    let vmDirectInternet = false;
    vmNodes.forEach(vm => {
      internetNodes.forEach(intNode => {
        if (isConnected(vm.id, intNode.id)) {
          vmDirectInternet = true;
        }
      });
    });

    if (vmDirectInternet) {
      score -= 20;
      warnings.push('⚠️ <b>ثغرة تصميم:</b> سيرفر التطبيقات (VM) متصل مباشرة بالإنترنت دون وجود موازن أحمال (Load Balancer) أو بوابة تطبيقات (Application Gateway). هذا يجعله عرضة لهجمات الحرمان من الخدمة (DDoS).');
    }

    vmNodes.forEach(vm => {
      const isConn = cloudConnections.some(c => c.from === vm.id || c.to === vm.id);
      if (!isConn) {
        score -= 5;
        warnings.push(`ℹ️ <b>تنبيه تكوين:</b> السيرفر الافتراضي (${vm.label}) ليس له أي روابط اتصال.`);
      }
    });

    gwNodes.forEach(gw => {
      const isConnToInternet = internetNodes.some(intNode => isConnected(gw.id, intNode.id));
      if (!isConnToInternet && cloudNodes.some(n => n.type === 'internet')) {
        warnings.push('ℹ️ <b>تنبيه تصميم:</b> بوابة التطبيقات (App Gateway) غير موصولة بالإنترنت لتلقي الطلبات.');
      }
    });

    score = Math.max(0, Math.min(100, score));
    scoreEl.textContent = `${score}%`;
    
    if (score >= 90) {
      scoreEl.style.color = 'var(--success)';
      statusEl.textContent = 'بنية سحابية آمنة وممتازة';
      statusEl.style.color = 'var(--success)';
    } else if (score >= 70) {
      scoreEl.style.color = 'var(--warning)';
      statusEl.textContent = 'بنية مقبولة مع بعض الثغرات';
      statusEl.style.color = 'var(--warning)';
    } else {
      scoreEl.style.color = 'var(--danger)';
      statusEl.textContent = 'بنية غير آمنة! خطورة عالية';
      statusEl.style.color = 'var(--danger)';
    }

    if (warnings.length > 0) {
      recommendation = `<div style="display:flex; flex-direction:column; gap:0.5rem;">` + 
        warnings.map(w => `<div>${w}</div>`).join('') + 
        `</div>`;
    } else {
      recommendation = `🎉 <b>تهانينا!</b> معماريتك السحابية تطابق أفضل معايير التصميم والأمان (Well-Architected Framework). التكلفة الشهرية المحسوبة تبدو ممتازة لمتطلبات المشروع الحالي.`;
    }

    advisorEl.innerHTML = recommendation;
  }

  function enableDragElement(el, obj) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    el.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      if (e.target.classList.contains('cloud-node-delete')) return;
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      
      let newTop = el.offsetTop - pos2;
      let newLeft = el.offsetLeft - pos1;
      
      const canvas = document.getElementById('cloud-canvas');
      if (canvas) {
        newTop = Math.max(0, Math.min(newTop, canvas.offsetHeight - el.offsetHeight));
        newLeft = Math.max(0, Math.min(newLeft, canvas.offsetWidth - el.offsetWidth));
      }
      
      el.style.top = newTop + "px";
      el.style.left = newLeft + "px";
      
      obj.x = newLeft;
      obj.y = newTop;
      
      drawCloudConnections();
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
      auditCloudSecurity();
    }
  }

  // Hook HA checkbox changes to refresh calculations
  const haCheckbox = document.getElementById('cloud-ha');
  if (haCheckbox) {
    haCheckbox.addEventListener('change', () => {
      auditCloudSecurity();
    });
  }

  // ==========================================================================
  // CI/CD Pipeline Simulator Implementation
  // ==========================================================================
  let pipelineRunning = false;

  function writePipelineConsole(msg, type='info') {
    const consoleEl = document.getElementById('pipeline-console');
    if (!consoleEl) return;
    const line = document.createElement('div');
    if (type === 'error') line.style.color = '#ef4444';
    else if (type === 'success') line.style.color = '#10b981';
    else if (type === 'warn') line.style.color = '#f59e0b';
    else line.style.color = '#38bdf8';
    line.textContent = msg;
    consoleEl.appendChild(line);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }

  window.loadPipelineTemplate = function(type) {
    playClick();
    const editor = document.getElementById('pipeline-code-editor');
    if (!editor) return;
    
    if (type === 'docker') {
      editor.value = `FROM ubuntu:22.04\nRUN apt-get update && apt-get install -y nginx\nCOPY ./app /var/www/html\nEXPOSE 80\nCMD ["nginx", "-g", "daemon off;"]`;
    } else if (type === 'tf') {
      editor.value = `provider "aws" {\n  region = "us-east-1"\n}\n\nresource "aws_instance" "web_server" {\n  ami           = "ami-0c55b159cbfafe1f0"\n  instance_type = "t2.micro"\n\n  tags = {\n    Name = "Corp-Web-Production"\n  }\n}`;
    }
  };

  window.runDevOpsPipeline = function() {
    if (pipelineRunning) return;
    playClick();
    
    const editor = document.getElementById('pipeline-code-editor');
    const consoleEl = document.getElementById('pipeline-console');
    if (!editor || !consoleEl) return;
    
    const code = editor.value.trim();
    consoleEl.innerHTML = '';
    
    if (!code) {
      writePipelineConsole("[SYSTEM ERROR]: Editor is empty. Cannot start pipeline execution.", "error");
      return;
    }

    pipelineRunning = true;
    writePipelineConsole("[SYSTEM]: Initializing DevOps agent pipeline...", "info");

    const steps = ['lint', 'build', 'test', 'deploy'];
    steps.forEach(s => {
      const el = document.getElementById(`step-${s}`);
      if (el) el.className = 'pipeline-step-node';
    });
    const progLine = document.getElementById('pipeline-progress-line');
    if (progLine) progLine.style.width = '0%';

    setTimeout(() => {
      // 1. LINT CODE
      const el = document.getElementById('step-lint');
      if (el) el.classList.add('active-step');
      if (progLine) progLine.style.width = '12.5%';
      writePipelineConsole("[STAGE 1]: Running syntax and security linter (tflint / dockerfile_lint)...", "info");
      
      setTimeout(() => {
        let isDocker = code.toLowerCase().includes('from');
        let isTf = code.toLowerCase().includes('resource') || code.toLowerCase().includes('provider');
        let lintPassed = true;
        let errorMsg = '';

        if (!isDocker && !isTf) {
          lintPassed = false;
          errorMsg = "[LINT ERROR]: Invalid syntax. Code does not match standard Dockerfile keys or Terraform resource blocks.";
        } else if (isDocker) {
          if (!code.toLowerCase().includes('expose') && !code.toLowerCase().includes('cmd')) {
            lintPassed = false;
            errorMsg = "[LINT WARNING]: Dockerfile lacks EXPOSE or CMD directives. Container might exit immediately.";
          }
        } else if (isTf) {
          const openBraces = (code.match(/\{/g) || []).length;
          const closeBraces = (code.match(/\}/g) || []).length;
          if (openBraces !== closeBraces) {
            lintPassed = false;
            errorMsg = `[LINT ERROR]: Mismatched curly braces in Terraform config (Found {:${openBraces}, }:${closeBraces}).`;
          }
        }

        if (!lintPassed) {
          if (el) {
            el.classList.remove('active-step');
            el.classList.add('fail-step');
          }
          writePipelineConsole(errorMsg, "error");
          writePipelineConsole("[PIPELINE RUN FAILED] ❌", "error");
          pipelineRunning = false;
          return;
        }

        if (el) {
          el.classList.remove('active-step');
          el.classList.add('success-step');
        }
        if (progLine) progLine.style.width = '25%';
        writePipelineConsole("[STAGE 1 SUCCESS]: Code syntax check passed cleanly.", "success");

        // 2. BUILD IMAGE
        setTimeout(() => {
          const buildEl = document.getElementById('step-build');
          if (buildEl) buildEl.classList.add('active-step');
          if (progLine) progLine.style.width = '37.5%';
          writePipelineConsole("[STAGE 2]: Starting build job...", "info");
          
          if (isDocker) {
            writePipelineConsole("Sending build context to Docker daemon... 2.05MB", "info");
            writePipelineConsole("Step 1/5 : FROM ubuntu:22.04 -> Pulling from library/ubuntu", "info");
            writePipelineConsole("Step 2/5 : RUN apt-get update && apt-get install -y nginx -> Executing command", "info");
          } else {
            writePipelineConsole("Initializing Terraform provider plugins... aws v5.0.0", "info");
            writePipelineConsole("Terraform state storage initialized in backend S3.", "info");
          }

          setTimeout(() => {
            if (buildEl) {
              buildEl.classList.remove('active-step');
              buildEl.classList.add('success-step');
            }
            if (progLine) progLine.style.width = '50%';
            writePipelineConsole(isDocker ? "[STAGE 2 SUCCESS]: Docker image built successfully: sha256:4a85ef9e" : "[STAGE 2 SUCCESS]: Terraform workspace initialised successfully.", "success");

            // 3. INTEGRATION TESTS
            setTimeout(() => {
              const testEl = document.getElementById('step-test');
              if (testEl) testEl.classList.add('active-step');
              if (progLine) progLine.style.width = '62.5%';
              writePipelineConsole("[STAGE 3]: Running automated validation & security audits (Trivy / TFSec)...", "info");

              if (isDocker) {
                writePipelineConsole("Scanning image for vulnerabilities (Trivy)...", "info");
                writePipelineConsole("Found 0 critical, 2 medium vulnerabilities. Vulnerability threshold check passed.", "info");
              } else {
                writePipelineConsole("Executing TFSec compliance rules checking...", "info");
                writePipelineConsole("Checking for hardcoded credentials -> Passed", "info");
                writePipelineConsole("Checking if SSH is open to 0.0.0.0/0 -> Passed", "info");
              }

              setTimeout(() => {
                if (testEl) {
                  testEl.classList.remove('active-step');
                  testEl.classList.add('success-step');
                }
                if (progLine) progLine.style.width = '75%';
                writePipelineConsole("[STAGE 3 SUCCESS]: All security compliance & linting policies passed.", "success");

                // 4. DEPLOY
                setTimeout(() => {
                  const deployEl = document.getElementById('step-deploy');
                  if (deployEl) deployEl.classList.add('active-step');
                  if (progLine) progLine.style.width = '87.5%';
                  writePipelineConsole("[STAGE 4]: Syncing state with cluster / cloud provider...", "info");

                  if (isDocker) {
                    writePipelineConsole("Pushing image to Docker Hub (corp/production-web:latest)...", "info");
                    writePipelineConsole("Pushed layers to registry. Kubernetes rollout started.", "info");
                  } else {
                    writePipelineConsole("Terraform applying changes: aws_instance.web_server will be created.", "info");
                    writePipelineConsole("aws_instance.web_server: Creating...", "info");
                  }

                  setTimeout(() => {
                    if (deployEl) {
                      deployEl.classList.remove('active-step');
                      deployEl.classList.add('success-step');
                    }
                    if (progLine) progLine.style.width = '100%';
                    
                    if (isDocker) {
                      writePipelineConsole("[STAGE 4 SUCCESS]: Deployment rollout complete! Services updated globally.", "success");
                    } else {
                      writePipelineConsole("[STAGE 4 SUCCESS]: Terraform Apply complete! Resources: 1 added, 0 changed, 0 destroyed.", "success");
                    }
                    
                    writePipelineConsole("[PIPELINE RUN SUCCESS] 🎉 الخطوات مكتملة بنجاح!", "success");
                    playSuccessSound();
                    if (typeof triggerConfetti === 'function') triggerConfetti();
                    pipelineRunning = false;
                  }, 2000);

                }, 1500);

              }, 1500);

            }, 1500);

          }, 2000);

        }, 1500);

      }, 1500);

    }, 1000);
  };

  // ==========================================================================
  // SRE Grafana / Prometheus Observability Simulator Implementation
  // ==========================================================================
  let currentSreLoad = 'medium';
  let sreCfActive = false;
  let cpuHistory = [22, 25, 20, 24, 22, 23, 21, 25, 22, 24];
  let connHistory = [120, 130, 110, 125, 120, 115, 122, 130, 125, 121];
  let sreInterval = null;

  window.initSreSimulator = function() {
    if (sreInterval) clearInterval(sreInterval);
    
    sreInterval = setInterval(() => {
      let cpuVal = 20;
      let connVal = 120;
      let errVal = 0.0;
      
      const statusPill = document.getElementById('sre-status-pill');
      const cpuMetric = document.getElementById('sre-cpu-metric');
      const connMetric = document.getElementById('sre-conn-metric');
      const errorMetric = document.getElementById('sre-error-metric');
      const advisor = document.getElementById('sre-advisor-box');
      const cfBtn = document.getElementById('sre-cloudflare-btn');
      
      if (currentSreLoad === 'low') {
        cpuVal = Math.floor(Math.random() * 5) + 3; 
        connVal = Math.floor(Math.random() * 25) + 10; 
        errVal = 0.0;
        
        if (statusPill) {
          statusPill.textContent = 'Healthy (Idle)';
          statusPill.style.color = 'var(--success)';
          statusPill.style.background = 'rgba(16,185,129,0.1)';
        }
        if (advisor) {
          advisor.innerHTML = "💡 <b>مراقب موثوقية السيرفر:</b> النظام في حالة خمول (Idle). استهلاك الموارد منخفض جداً والخدمة مستقرة.";
        }
        if (cfBtn) cfBtn.style.display = 'none';
      } 
      else if (currentSreLoad === 'medium') {
        cpuVal = Math.floor(Math.random() * 15) + 15; 
        connVal = Math.floor(Math.random() * 150) + 100; 
        errVal = (Math.random() * 0.2).toFixed(1);
        
        if (statusPill) {
          statusPill.textContent = 'Healthy';
          statusPill.style.color = 'var(--success)';
          statusPill.style.background = 'rgba(16,185,129,0.1)';
        }
        if (advisor) {
          advisor.innerHTML = "💡 <b>مراقب موثوقية السيرفر:</b> مستوى حركة مرور طبيعي (Normal). السيرفر يستجيب بسرعة ممتازة وجميع مؤشرات الأداء سليمة.";
        }
        if (cfBtn) cfBtn.style.display = 'none';
      } 
      else if (currentSreLoad === 'ddos') {
        if (sreCfActive) {
          cpuVal = Math.floor(Math.random() * 8) + 10; 
          connVal = Math.floor(Math.random() * 70) + 80; 
          errVal = 0.0;
          
          if (statusPill) {
            statusPill.textContent = 'Protected';
            statusPill.style.color = 'var(--success)';
            statusPill.style.background = 'rgba(16,185,129,0.1)';
          }
          if (advisor) {
            advisor.innerHTML = "🛡️ <b>جدار الحماية نشط (Cloudflare WAF):</b> تم تصفية وحظر كافة الاتصالات الخبيثة (Bad Packets) بنجاح. استهلاك المعالج عاد للوضع الطبيعي والخدمة مستقرة بالكامل الآن!";
          }
        } else {
          cpuVal = Math.floor(Math.random() * 6) + 95; 
          connVal = Math.floor(Math.random() * 1990) + 8000; 
          errVal = (Math.random() * 35 + 45).toFixed(1); 
          
          if (statusPill) {
            statusPill.textContent = 'DDoS Attack (CRITICAL)';
            statusPill.style.color = 'var(--danger)';
            statusPill.style.background = 'rgba(239,68,68,0.1)';
          }
          if (advisor) {
            advisor.innerHTML = "🚨 <b>تنبيه حرج جداً (CRITICAL):</b> السيرفر يتعرض لهجوم حجب خدمة عنيف (DDoS)! استهلاك المعالج بلغ 100%، وهناك آلاف الطلبات الوهمية تسبب سقوط الخدمة للعملاء الحقيقيين. <b>سارع بتفعيل جدار الحماية Cloudflare WAF!</b>";
          }
          if (cfBtn) cfBtn.style.display = 'block';
        }
      }
      
      if (cpuMetric) cpuMetric.textContent = `${cpuVal}%`;
      if (connMetric) connMetric.textContent = `${connVal} req/s`;
      if (errorMetric) {
        errorMetric.textContent = `${errVal}%`;
        errorMetric.style.color = parseFloat(errVal) > 5.0 ? 'var(--danger)' : 'var(--success)';
      }
      
      drawSreChart(cpuVal, connVal);
      
    }, 1500);
  };

  window.generateSreLoad = function(level) {
    playClick();
    currentSreLoad = level;
    
    const buttons = document.querySelectorAll('[onclick^="generateSreLoad"]');
    buttons.forEach(btn => {
      const clickAttr = btn.getAttribute('onclick');
      if (clickAttr && clickAttr.includes(`'${level}'`)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (level !== 'ddos') {
      sreCfActive = false;
      const cfBtn = document.getElementById('sre-cloudflare-btn');
      if (cfBtn) {
        cfBtn.style.display = 'none';
        cfBtn.innerHTML = '<i class="fa-solid fa-shield-halved"></i> تفعيل حماية Cloudflare WAF';
        cfBtn.style.background = 'linear-gradient(135deg, var(--success), var(--accent-secondary))';
      }
    }
  };

  window.toggleSreCloudflare = function() {
    playClick();
    sreCfActive = !sreCfActive;
    
    const cfBtn = document.getElementById('sre-cloudflare-btn');
    if (cfBtn) {
      if (sreCfActive) {
        cfBtn.innerHTML = '<i class="fa-solid fa-shield-halved"></i> إيقاف حماية Cloudflare WAF';
        cfBtn.style.background = 'linear-gradient(135deg, var(--danger), var(--accent-purple))';
        playSuccessSound();
        if (typeof triggerConfetti === 'function') triggerConfetti();
      } else {
        cfBtn.innerHTML = '<i class="fa-solid fa-shield-halved"></i> تفعيل حماية Cloudflare WAF';
        cfBtn.style.background = 'linear-gradient(135deg, var(--success), var(--accent-secondary))';
      }
    }
  };

  function drawSreChart(cpuVal, connVal) {
    cpuHistory.push(100 - (cpuVal * 0.8 + 10)); 
    cpuHistory.shift();
    
    let connPercent = Math.min(100, (connVal / 10000) * 100);
    if (currentSreLoad !== 'ddos') {
      connPercent = Math.min(100, (connVal / 300) * 100);
    }
    connHistory.push(100 - (connPercent * 0.7 + 15));
    connHistory.shift();

    const cpuPath = document.getElementById('sre-cpu-path');
    const connPath = document.getElementById('sre-conn-path');
    if (!cpuPath || !connPath) return;

    let cpuD = `M 0 ${cpuHistory[0]}`;
    let connD = `M 0 ${connHistory[0]}`;
    for (let i = 1; i < 10; i++) {
      const x = i * 55;
      cpuD += ` L ${x} ${cpuHistory[i]}`;
      connD += ` L ${x} ${connHistory[i]}`;
    }
    cpuPath.setAttribute('d', cpuD);
    connPath.setAttribute('d', connD);
  }

  // ==========================================================================
  // Zero Trust Security / Certbot DNS TXT Challenge Simulator
  // ==========================================================================
  let ztChallengeKey = '';
  let ztChallengeGenerated = false;

  window.initZtSimulator = function() {
    const term = document.getElementById('zt-terminal');
    const input = document.getElementById('zt-term-input');
    const dnsInput = document.getElementById('zt-dns-value');
    const advisor = document.getElementById('zt-advisor-box');
    
    if (term) term.innerHTML = '<div>[SYSTEM]: Certbot SSL sandbox loaded. Run command to request certificate...</div>';
    if (input) input.value = '';
    if (dnsInput) dnsInput.value = '';
    if (advisor) {
      advisor.innerHTML = '🔒 <b>مستشار أمن النطاقات:</b> خادم الويب غير مؤمن حالياً ويتصفح باتصال HTTP مكشوف. قم بإنشاء شهادة تشفير SSL لحمايته.';
    }
    
    ztChallengeKey = '';
    ztChallengeGenerated = false;
  };

  window.handleZtTermKey = function(event) {
    if (event.key === 'Enter') {
      const input = document.getElementById('zt-term-input');
      const term = document.getElementById('zt-terminal');
      if (!input || !term) return;

      const cmd = input.value.trim();
      input.value = '';

      playClick();

      const echoDiv = document.createElement('div');
      echoDiv.innerHTML = `<span style="color:#ef4444;">root@client:~#</span> ${escapeHTML(cmd)}`;
      term.appendChild(echoDiv);

      const responseDiv = document.createElement('div');
      
      const cleanCmd = cmd.toLowerCase();
      if (cleanCmd === 'certbot certonly --manual -d corp.local' || cmd === 'certbot certonly --manual -d corp.local') {
        ztChallengeKey = 'acme_txt_challenge_' + Math.random().toString(36).substring(2, 10);
        ztChallengeGenerated = true;
        
        responseDiv.innerHTML = `
          Saving debug log to /var/log/letsencrypt/letsencrypt.log<br>
          Requesting a certificate for corp.local...<br>
          Performing the following challenges:<br>
          dns-01 challenge for corp.local<br><br>
          - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -<br>
          Please deploy a DNS TXT record under the name:<br>
          <span style="color:var(--accent-secondary); font-weight:700;">_acme-challenge.corp.local</span><br>
          with the following value:<br>
          <span style="color:#eedc82; font-weight:700; font-size:0.85rem;">${ztChallengeKey}</span><br><br>
          Press Verify & Authorize in the DNS panel when deployed...<br>
          - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        `;
        
        const advisor = document.getElementById('zt-advisor-box');
        if (advisor) {
          advisor.innerHTML = `💡 <b>مستشار أمن النطاقات:</b> تم توليد مفتاح التحدي بنجاح. يرجى نسخه وإدخاله في حقل سجل الـ DNS بالجانب الأيسر لتأكيده.`;
        }
      } 
      else if (cleanCmd === 'clear') {
        term.innerHTML = '';
        return;
      } 
      else if (cleanCmd === 'help') {
        responseDiv.innerHTML = `
          Available commands:<br>
          - <b>certbot certonly --manual -d corp.local</b> : Initiates manual DNS challenge certification.<br>
          - <b>clear</b> : Clears the terminal screen.<br>
          - <b>help</b> : Shows this help message.
        `;
      } 
      else if (cmd !== '') {
        responseDiv.innerHTML = `<span style="color:#ef4444;">bash: ${escapeHTML(cmd)}: command not found. Type 'help' for guidance.</span>`;
      }

      term.appendChild(responseDiv);
      term.scrollTop = term.scrollHeight;
    }
  };

  window.verifyZtCertificate = function() {
    playClick();
    
    const dnsInput = document.getElementById('zt-dns-value');
    const term = document.getElementById('zt-terminal');
    const advisor = document.getElementById('zt-advisor-box');
    
    if (!dnsInput || !term || !advisor) return;

    const val = dnsInput.value.trim();

    if (!ztChallengeGenerated) {
      advisor.innerHTML = `⚠️ <b>تنبيه أمني:</b> الرجاء كتابة الأمر وتشغيله في الطرفية أولاً لتوليد قيمة تحدي Let's Encrypt!`;
      return;
    }

    if (!val) {
      advisor.innerHTML = `⚠️ <b>تنبيه أمني:</b> يرجى إدخال قيمة التحدي في حقل سجل الـ DNS باليسار.`;
      return;
    }

    const logDiv = document.createElement('div');
    logDiv.style.marginTop = '10px';

    if (val === ztChallengeKey) {
      logDiv.innerHTML = `
        <span style="color:var(--success);">Waiting for verification...</span><br>
        <span style="color:var(--success);">Cleaning up challenges...</span><br>
        <span style="color:var(--success);">Congratulations! Your certificate and chain have been saved at:</span><br>
        /etc/letsencrypt/live/corp.local/fullchain.pem<br>
        Your key file has been saved at:<br>
        /etc/letsencrypt/live/corp.local/privkey.pem<br>
        Certificate expiration date: 2026-09-14 (90 days)<br>
        <span style="color:var(--success);">[SUCCESS]: SSL Certificate successfully generated and configured!</span>
      `;
      term.appendChild(logDiv);
      term.scrollTop = term.scrollHeight;
      
      advisor.innerHTML = `🎉 <b>مستشار أمن النطاقات:</b> تم التحقق من ملكية النطاق وتوليد شهادة SSL/TLS بنجاح! السيرفر الآن يستخدم اتصالات HTTPS المشفرة والآمنة بالكامل.`;
      
      playSuccessSound();
      if (typeof triggerConfetti === 'function') triggerConfetti();
    } else {
      logDiv.innerHTML = `
        <span style="color:var(--danger);">Waiting for verification...</span><br>
        <span style="color:var(--danger);">[ERROR]: Challenge failed for domain corp.local. TXT record value did not match.</span>
      `;
      term.appendChild(logDiv);
      term.scrollTop = term.scrollHeight;
      
      advisor.innerHTML = `❌ <b>مستشار أمن النطاقات:</b> فشل التحقق! القيمة المدخلة في الـ DNS لا تطابق مفتاح التحدي الذي ولده Certbot. يرجى التحقق وإعادة المحاولة.`;
    }
  };

  // ==========================================================================
  // Smart Study Planner Implementation
  // ==========================================================================
  window.generateStudyPlanCalendar = function() {
    const hoursInput = document.getElementById('study-hours-input');
    const grid = document.getElementById('planner-calendar-grid');
    const totalWeeksEl = document.getElementById('study-total-weeks');
    
    if (!hoursInput || !grid || !totalWeeksEl) return;
    
    const hoursPerWeek = Math.max(2, Math.min(60, parseInt(hoursInput.value) || 10));
    
    const phasesInfo = [
      { num: 1, title: "المرحلة الثانية: أساسيات وتكوين الشبكات", hours: 80, prefix: "net-task" },
      { num: 2, title: "المرحلة الثالثة (أ): إدارة خوادم لينكس", hours: 60, prefix: "lin-task" },
      { num: 3, title: "المرحلة الثالثة (ب): خوادم ويندوز والـ Active Directory", hours: 70, prefix: "win-task" },
      { num: 4, title: "المرحلة الثالثة (ج): الافتراضية والخدمات والشبكات", hours: 60, prefix: "cld-task" },
      { num: 5, title: "المرحلة الرابعة: الأمن السيبراني (Cyber Security)", hours: 70, prefix: "sec-task" },
      { num: 6, title: "المرحلة الخامسة: التخصص والتقدم", hours: 80, prefix: "dev-task" },
      { num: 7, title: "المرحلة السادسة: إدارة وتشغيل الحاويات (K8s)", hours: 80, prefix: "k8s-task" },
      { num: 8, title: "المرحلة السابعة: البنية التحتية ككود والـ GitOps", hours: 70, prefix: "git-task" },
      { num: 9, title: "المرحلة الثامنة: هندسة الموثوقية والمراقبة (SRE)", hours: 60, prefix: "sre-task" },
      { num: 10, title: "المرحلة التاسعة: الشبكات المتقدمة والأمن الصِفري", hours: 60, prefix: "zt-task" }
    ];

    grid.innerHTML = '';
    let totalWeeks = 0;
    let currentDate = new Date();
    
    let currentPhaseSelected = false;

    phasesInfo.forEach((phase) => {
      const weeksNeeded = phase.hours / hoursPerWeek;
      totalWeeks += weeksNeeded;
      
      const startDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() + (weeksNeeded * 7));
      const endDate = new Date(currentDate);

      const checkboxes = document.querySelectorAll(`.checklist-checkbox[id^="${phase.prefix}"]`);
      const checked = document.querySelectorAll(`.checklist-checkbox[id^="${phase.prefix}"]:checked`);
      
      const isCompleted = checkboxes.length > 0 && checkboxes.length === checked.length;
      let blockClass = 'calendar-phase-block';
      
      if (isCompleted) {
        blockClass += ' completed-phase';
      } else if (!currentPhaseSelected) {
        blockClass += ' current-phase';
        currentPhaseSelected = true;
      }
      
      const formatDate = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
      };

      const phaseBlock = document.createElement('div');
      phaseBlock.className = blockClass;
      phaseBlock.innerHTML = `
        <div class="calendar-phase-header">
          <span class="calendar-phase-title">${phase.title}</span>
          <span class="calendar-phase-hours">${phase.hours} ساعة</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.5rem;">
          <span class="calendar-phase-weeks">${weeksNeeded.toFixed(1)} أسبوع</span>
          <span class="calendar-phase-dates">${formatDate(startDate)} ⬅️ ${formatDate(endDate)}</span>
        </div>
      `;
      grid.appendChild(phaseBlock);
    });

    totalWeeksEl.textContent = `${Math.round(totalWeeks)} أسبوع (${(totalWeeks / 4.345).toFixed(1)} شهر)`;
  };

  // ==========================================================================
  // Kubernetes Visual Pod/Service Deployer Sandbox Implementation
  // ==========================================================================
  let k8sPodsCount = 0;

  function checkK8sClusterState() {
    const status = document.getElementById('k8s-status-box');
    const svc = document.getElementById('k8s-service-node');
    const ing = document.getElementById('k8s-ingress-node');
    if (!status) return;

    const hasService = svc && svc.style.display === 'flex';
    const hasIngress = ing && ing.style.display === 'flex';

    if (k8sPodsCount === 0) {
      if (svc) svc.style.display = 'none';
      if (ing) ing.style.display = 'none';
      status.innerHTML = `💡 <b>مراقب خدمات Kubernetes:</b> الكلستر فارغ الآن. قم بنشر الكبسولة (Pod) أولاً لبدء المحاكاة.`;
    } else if (hasIngress) {
      status.innerHTML = `🚀 <b>مراقب خدمات Kubernetes:</b> الكلستر نشط بالكامل! الـ Ingress يوجه المرور لـ nginx-service (30080) والتي توزع الحمل على ${k8sPodsCount} من الكبسولات (Pods) النشطة. الرابط: <a href="http://app.corp.local" target="_blank" style="color:var(--accent-secondary); font-weight:700; text-decoration:underline;">http://app.corp.local</a>`;
    } else if (hasService) {
      status.innerHTML = `⚙️ <b>مراقب خدمات Kubernetes:</b> الخدمة nginx-service نشطة (NodePort 30080) وتوزع حمل البيانات على ${k8sPodsCount} كبسولات (Pods) بنجاح!`;
    } else {
      status.innerHTML = `✅ <b>مراقب خدمات Kubernetes:</b> الكلستر يحتوي على ${k8sPodsCount} كبسولة (Pod) نشطة. الخطوة التالية: Expose Service لتوجيه البيانات.`;
    }
  }

  window.deployK8sPod = function() {
    const list = document.getElementById('k8s-pods-list');
    const empty = document.getElementById('k8s-empty-pods');
    const status = document.getElementById('k8s-status-box');
    
    if (!list || !status) return;

    if (k8sPodsCount >= 6) {
      status.innerHTML = `🚨 <b>تنبيه الكلستر:</b> لا يمكن نشر أكثر من 6 كبسولات (Pods) في المعمل المحلي لضمان عدم نفاد موارد الخادم!`;
      return;
    }

    if (empty) empty.style.display = 'none';

    k8sPodsCount++;
    const podId = Date.now();

    const pod = document.createElement('div');
    pod.className = 'k8s-pod-item';
    pod.id = `k8s-pod-${podId}`;
    pod.style.display = 'flex';
    pod.style.alignItems = 'center';
    pod.style.gap = '0.4rem';
    pod.style.background = 'rgba(16, 185, 129, 0.08)';
    pod.style.border = '1px solid var(--success)';
    pod.style.padding = '0.4rem 0.8rem';
    pod.style.borderRadius = '6px';
    pod.style.fontFamily = 'var(--font-english)';
    pod.style.fontSize = '0.75rem';
    pod.style.boxShadow = '0 0 8px rgba(16, 185, 129, 0.2)';
    pod.style.animation = 'zoomIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    pod.innerHTML = `
      <i class="fa-solid fa-cube" style="color:var(--success); font-size:0.8rem;"></i>
      <span>nginx-pod-${k8sPodsCount}</span>
      <span style="color:var(--success); font-weight:bold; font-size:0.65rem;">Running</span>
      <span onclick="deleteK8sPod('${podId}', event)" style="color:var(--danger); cursor:pointer; margin-left:4px; font-weight:bold; font-size:0.85rem;">&times;</span>
    `;

    list.appendChild(pod);

    status.innerHTML = `✅ <b>مراقب خدمات Kubernetes:</b> تم نشر الكبسولة nginx-pod-${k8sPodsCount} بنجاح! الحالة: Running. الـ IP الافتراضي: 10.244.1.${k8sPodsCount + 2}.`;
    
    playSuccessSound();
    checkK8sClusterState();
  };

  window.deleteK8sPod = function(podId, event) {
    if (event) event.stopPropagation();
    
    const podEl = document.getElementById(`k8s-pod-${podId}`);
    if (podEl) podEl.remove();

    k8sPodsCount = Math.max(0, k8sPodsCount - 1);
    
    const list = document.getElementById('k8s-pods-list');
    const empty = document.getElementById('k8s-empty-pods');
    const status = document.getElementById('k8s-status-box');
    
    if (k8sPodsCount === 0) {
      if (empty) empty.style.display = 'block';
      
      const svc = document.getElementById('k8s-service-node');
      const ing = document.getElementById('k8s-ingress-node');
      if (svc) svc.style.display = 'none';
      if (ing) ing.style.display = 'none';
      
      if (status) {
        status.innerHTML = `💡 <b>مراقب خدمات Kubernetes:</b> الكلستر فارغ الآن. قم بنشر الكبسولة (Pod) أولاً لبدء المحاكاة.`;
      }
    } else {
      if (status) {
        status.innerHTML = `🗑️ <b>مراقب خدمات Kubernetes:</b> تم حذف كائن الـ Pod. العدد المتبقي بالكلستر: ${k8sPodsCount}.`;
      }
      checkK8sClusterState();
    }
    
    playClick();
  };

  window.deployK8sService = function() {
    const status = document.getElementById('k8s-status-box');
    const svc = document.getElementById('k8s-service-node');
    
    if (!status || !svc) return;

    if (k8sPodsCount === 0) {
      status.innerHTML = `⚠️ <b>تنبيه كائنات K8s:</b> لا يمكن إعداد خدمة موازنة الحمل (Service) بدون وجود كبسولات (Pods) نشطة في الكلستر! يرجى نشر Pod أولاً.`;
      return;
    }

    svc.style.display = 'flex';
    status.innerHTML = `⚙️ <b>مراقب خدمات Kubernetes:</b> تم إطلاق خدمة nginx-service من نوع NodePort. المنفذ الخارجي المفتوح: 30080. تقوم الخدمة الآن بتوزيع حمل البيانات على ${k8sPodsCount} كبسولات (Pods) بنجاح!`;
    
    playSuccessSound();
    checkK8sClusterState();
  };

  window.deployK8sIngress = function() {
    const status = document.getElementById('k8s-status-box');
    const svc = document.getElementById('k8s-service-node');
    const ing = document.getElementById('k8s-ingress-node');
    
    if (!status || !svc || !ing) return;

    if (svc.style.display !== 'flex') {
      status.innerHTML = `⚠️ <b>تنبيه كائنات K8s:</b> يجب إعداد الخدمة (Service) وتحديد المنافذ الداخلية أولاً قبل إعداد الـ Ingress Router!`;
      return;
    }

    ing.style.display = 'flex';
    status.innerHTML = `🚀 <b>مراقب خدمات Kubernetes:</b> تم إعداد الـ Ingress بنجاح! الآن يمكن الوصول للتطبيق خارجياً عبر الرابط الآمن: <a href="http://app.corp.local" target="_blank" style="color:var(--accent-secondary); font-weight:700; text-decoration:underline;">http://app.corp.local</a> ➡️ nginx-service (Port 80).`;
    
    playSuccessSound();
    if (typeof triggerConfetti === 'function') triggerConfetti();
  };

  window.clearK8sCluster = function() {
    playClick();
    
    k8sPodsCount = 0;
    
    const list = document.getElementById('k8s-pods-list');
    const empty = document.getElementById('k8s-empty-pods');
    const status = document.getElementById('k8s-status-box');
    const svc = document.getElementById('k8s-service-node');
    const ing = document.getElementById('k8s-ingress-node');
    
    if (list) {
      list.innerHTML = '';
      if (empty) {
        empty.style.display = 'block';
        list.appendChild(empty);
      }
    }
    
    if (svc) svc.style.display = 'none';
    if (ing) ing.style.display = 'none';
    
    if (status) {
      status.innerHTML = `💡 <b>مراقب خدمات Kubernetes:</b> تم مسح وتفريغ جميع كائنات الكلستر بنجاح.`;
    }
  };

  // -------------------------------------------------------------
  // IP Binary Masking Simulator Logic
  // -------------------------------------------------------------
  window.simulateIPMasking = function() {
    playClick();
    const ipVal = document.getElementById('mask-sim-ip').value.trim();
    const cidrVal = parseInt(document.getElementById('mask-sim-cidr').value);
    const visualBox = document.getElementById('mask-sim-visual');
    if (!visualBox) return;

    // Validate IP
    const ipPattern = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipPattern.test(ipVal)) {
      playSynthSound(220, 'sawtooth', 0.25, 0.05); // Error sound
      visualBox.style.display = 'block';
      visualBox.style.borderColor = 'var(--danger)';
      visualBox.innerHTML = `<span style="color:var(--danger); font-weight:700;">⚠️ خطأ: يرجى إدخال عنوان IPv4 صالح (مثل: 192.168.1.55).</span>`;
      return;
    }

    visualBox.style.borderColor = 'var(--accent-secondary)';
    visualBox.style.display = 'block';

    const octets = ipVal.split('.').map(Number);
    const ipLong = octets.reduce((acc, octet) => (acc << 8) + octet, 0) >>> 0;

    const maskLong = (~(Math.pow(2, 32 - cidrVal) - 1)) >>> 0;
    const netLong = (ipLong & maskLong) >>> 0;

    const netOctets = [
      (netLong >>> 24) & 255,
      (netLong >>> 16) & 255,
      (netLong >>> 8) & 255,
      netLong & 255
    ];

    const maskOctets = [
      (maskLong >>> 24) & 255,
      (maskLong >>> 16) & 255,
      (maskLong >>> 8) & 255,
      maskLong & 255
    ];

    const toBinStr = (num) => num.toString(2).padStart(8, '0');

    const ipBin = octets.map(toBinStr);
    const maskBin = maskOctets.map(toBinStr);
    const netBin = netOctets.map(toBinStr);

    let html = '';
    html += `<div class="ip-sim-container" style="display:flex; flex-direction:column; gap:1rem; text-align:right; direction:rtl;">`;
    
    html += `<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:0.5rem;">`;
    html += `<span style="font-weight:700; color:var(--text-color);">🔍 محاكاة حساب عنوان الشبكة لـ: <span style="font-family:monospace; color:var(--accent-secondary);">${ipVal}/${cidrVal}</span></span>`;
    html += `<span style="font-size:0.75rem; color:var(--text-muted);">حساب ثنائي بت-بت (Bitwise AND)</span>`;
    html += `</div>`;

    html += `<div class="ip-sim-grid-wrapper" style="direction:ltr; text-align:left; overflow-x:auto; padding:0.5rem 0;">`;
    html += `<table class="ip-sim-table" style="width:100%; border-collapse:collapse; font-family:var(--font-mono); min-width:600px;">`;
    
    html += `<thead><tr style="border-bottom:1px solid rgba(255,255,255,0.05); font-size:0.7rem; color:var(--text-muted);">`;
    html += `<th style="padding:4px; text-align:right; width:120px;">النوع (Type)</th>`;
    for (let o = 0; o < 4; o++) {
      html += `<th colspan="8" style="padding:4px; text-align:center; border-left:1px dashed rgba(255,255,255,0.1); border-right:1px dashed rgba(255,255,255,0.1);">`;
      html += `القسم ${o+1} (${octets[o]} ➜ Binary)`;
      html += `</th>`;
    }
    html += `</tr></thead><tbody>`;

    const renderBitRow = (label, decimalVal, binaryOctets, rowType) => {
      let rHtml = `<tr style="border-bottom:1px dashed rgba(255,255,255,0.03);">`;
      rHtml += `<td style="padding:8px 4px; font-weight:700; color:var(--text-color); font-size:0.8rem; text-align:right; direction:rtl;">${label}: <span style="color:var(--accent-primary); font-family:var(--font-mono);">${decimalVal}</span></td>`;
      
      let bitCounter = 0;
      for (let o = 0; o < 4; o++) {
        const borderStyle = o > 0 ? 'border-left: 2px solid rgba(255,255,255,0.15);' : '';
        rHtml += `<td colspan="8" style="padding:6px 2px; text-align:center; ${borderStyle}">`;
        rHtml += `<div style="display:flex; justify-content:center; gap:2px;">`;
        
        for (let b = 0; b < 8; b++) {
          const bitChar = binaryOctets[o][b];
          const absoluteBitIndex = bitCounter;
          bitCounter++;

          let bg = 'rgba(255,255,255,0.03)';
          let color = 'var(--text-muted)';
          let border = '1px solid rgba(255,255,255,0.1)';

          const isNetworkBit = absoluteBitIndex < cidrVal;

          if (rowType === 'ip') {
            bg = isNetworkBit ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)';
            color = isNetworkBit ? 'var(--accent-primary)' : '#64748b';
            border = isNetworkBit ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255,255,255,0.05)';
          } else if (rowType === 'mask') {
            bg = isNetworkBit ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.02)';
            color = isNetworkBit ? 'var(--accent-secondary)' : '#64748b';
            border = isNetworkBit ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid rgba(255,255,255,0.05)';
          } else if (rowType === 'net') {
            bg = isNetworkBit ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.05)';
            color = isNetworkBit ? 'var(--success)' : '#ef4444';
            border = isNetworkBit ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.2)';
          }

          let borderRight = '';
          if (absoluteBitIndex === cidrVal - 1) {
            borderRight = 'border-right: 2px solid var(--danger);';
          }

          rHtml += `<div style="width:20px; height:24px; display:flex; justify-content:center; align-items:center; border-radius:4px; font-weight:bold; font-size:0.8rem; background:${bg}; color:${color}; border:${border}; ${borderRight}" title="Bit ${absoluteBitIndex+1}: ${isNetworkBit ? 'Network' : 'Host'} Portion">${bitChar}</div>`;
        }
        
        rHtml += `</div></td>`;
      }
      rHtml += `</tr>`;
      return rHtml;
    };

    html += renderBitRow('العنوان IP Address', ipVal, ipBin, 'ip');
    html += renderBitRow('القناع Subnet Mask', maskOctets.join('.'), maskBin, 'mask');

    html += `<tr style="font-size:0.7rem; color:var(--text-muted);"><td style="padding:4px; text-align:right; font-weight:bold;">العملية المنطقية</td>`;
    for(let o=0; o<4; o++) {
      html += `<td colspan="8" style="padding:4px; text-align:center; ${o>0 ? 'border-left: 2px solid rgba(255,255,255,0.05);' : ''}"><i class="fa-solid fa-arrow-down-long"></i> AND Operation <i class="fa-solid fa-arrow-down-long"></i></td>`;
    }
    html += `</tr>`;

    html += renderBitRow('عنوان الشبكة الناتج', netOctets.join('.'), netBin, 'net');
    html += `</tbody></table></div>`;

    html += `<div style="margin-top:0.75rem; font-size:0.82rem; line-height:1.6; background:rgba(255,255,255,0.01); border:1px solid var(--border-color); padding:0.75rem; border-radius:8px; text-align:right; direction:rtl;">`;
    html += `💡 <b>شرح مبسط:</b><br>`;
    html += `1. الخط الأحمر العمودي يمثل <b>حد قناع الشبكة (Subnet Boundary)</b> عند البت رقم ${cidrVal}.<br>`;
    html += `2. جميع البتات على يسار الخط الأحمر تسمى <b>قسم الشبكة (Network Portion)</b> وتظل كما هي لأن عملية الـ AND مع الرقم 1 تعطي نفس القيمة.<br>`;
    html += `3. جميع البتات على يمين الخط الأحمر تسمى <b>قسم الأجهزة (Host Portion)</b> وتتغير كلها إلى أصفار (0) لأن قناع الشبكة يحتوي على أصفار هناك.<br>`;
    html += `4. عندما تتحول بتات الأجهزة كلها لأصفار، فإننا نحصل على <b>عنوان الشبكة الفرعية الرئيسي (Network Address)</b> وهو: <span style="font-family:var(--font-mono); color:var(--success); font-weight:bold;">${netOctets.join('.')}</span>.`;
    html += `</div>`;
    html += `</div>`;

    visualBox.innerHTML = html;
    playSuccessSound();
  };

  // -------------------------------------------------------------
  // Visual DNS Resolver & Query Simulator Logic
  // -------------------------------------------------------------
  window.simulateDNSLookup = function() {
    playClick();
    const domainInput = document.getElementById('dns-sim-domain');
    const typeSelect = document.getElementById('dns-sim-type');
    const outputBox = document.getElementById('dns-sim-output');
    if (!domainInput || !typeSelect || !outputBox) return;

    const domain = domainInput.value.trim().toLowerCase();
    const recordType = typeSelect.value;

    if (!domain) {
      playSynthSound(220, 'sawtooth', 0.25, 0.05);
      outputBox.style.display = 'block';
      outputBox.style.borderColor = 'var(--danger)';
      outputBox.innerHTML = `<span style="color:var(--danger); font-weight:700;">⚠️ خطأ: يرجى إدخال اسم النطاق المراد الاستعلام عنه.</span>`;
      return;
    }

    outputBox.style.borderColor = 'var(--accent-primary)';
    outputBox.style.display = 'block';
    outputBox.innerHTML = `<div style="text-align:center; padding:1.5rem; color:var(--text-muted);">
      <i class="fa-solid fa-spinner fa-spin" style="font-size:2rem; color:var(--accent-primary); margin-bottom:0.5rem;"></i>
      <div>جاري بدء استعلام الـ DNS وتتبع المسار...</div>
    </div>`;

    // DNS record database
    const dnsDb = {
      'it_ninja.local': {
        A: '192.168.1.15',
        CNAME: 'لا يوجد (نطاق رئيسي مباشر)',
        MX: '10 mail.it_ninja.local (Pri: 10)',
        TXT: 'it-ninja-verification-token=99281a8c3d'
      },
      'corp.local': {
        A: '192.168.1.10',
        CNAME: 'لا يوجد (نطاق رئيسي مباشر)',
        MX: '5 mail.corp.local (Pri: 5)',
        TXT: 'active-directory-domain-controller-key'
      },
      'google.com': {
        A: '142.250.190.46',
        CNAME: 'لا يوجد (نطاق رئيسي مباشر)',
        MX: '10 smtp.google.com (Pri: 10)',
        TXT: 'v=spf1 include:_spf.google.com ~all'
      },
      'github.com': {
        A: '140.82.121.4',
        CNAME: 'لا يوجد (نطاق رئيسي مباشر)',
        MX: '10 mail-backend.github.com (Pri: 10)',
        TXT: 'v=spf1 ip4:192.30.252.0/22 ~all'
      }
    };

    const getRecordValue = (dom, type) => {
      if (dnsDb[dom] && dnsDb[dom][type]) return dnsDb[dom][type];
      const hash = Math.abs(dom.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0));
      if (type === 'A') return `198.51.100.${(hash % 254) + 1}`;
      if (type === 'CNAME') return `alias.${dom}`;
      if (type === 'MX') return `10 mail.${dom} (Pri: 10)`;
      return `verification-hash-code=${hash}`;
    };

    const finalAnswer = getRecordValue(domain, recordType);

    setTimeout(() => {
      let steps = [];
      const hostsMatch = (domain === 'localhost' || domain === 'it_ninja.local' || domain === 'corp.local');

      steps.push({
        title: 'الخطوة 1: فحص كاش الجهاز المحلي وملف الـ Hosts',
        desc: hostsMatch 
          ? `تم العثور على تطابق محلي في ملف Hosts لنظام التشغيل! تم اختصار عملية الاستعلام بالكامل.` 
          : `لم يتم العثور على تطابق في كاش المتصفح أو ملف الـ Hosts المحلي. جاري توجيه الطلب للشبكة.`,
        status: 'success',
        badge: hostsMatch ? 'LOCAL MATCH 🖥️' : 'PASS ➡️'
      });

      if (hostsMatch) {
        renderDnsSteps(steps, finalAnswer, domain, recordType);
        return;
      }

      steps.push({
        title: 'الخطوة 2: الاستعلام من خادم الـ DNS المحلي (Local Resolver)',
        desc: `إرسال استعلام recursive إلى خادم الـ DNS للشبكة المحلي (IP: 192.168.1.10). لم يجد الخادم السجل في الكاش الخاص به وجاري الاستعلام التكراري (Iterative) للإنترنت.`,
        status: 'success',
        badge: 'QUERYING local-dns'
      });

      steps.push({
        title: 'الخطوة 3: الاستعلام من خوادم أسماء الجذر (Root Nameservers ".") ',
        desc: `طلب المساعدة من خادم الجذر العالمي. أجاب الخادم: "لا أعرف عنوان هذا النطاق، ولكن اذهب واسأل خادم الـ TLD المسؤول عن النطاقات التي تنتهي بـ [.${domain.split('.').pop()}]."`,
        status: 'success',
        badge: 'Root Nameserver'
      });

      const tld = '.' + domain.split('.').pop();
      steps.push({
        title: `الخطوة 4: الاستعلام من خادم النطاق العلوي (${tld} TLD Nameserver)`,
        desc: `طلب الخدمة من خادم أسماء ${tld}. أجاب الخادم: "لا أعرف عنوان الآي بي بدقة، ولكن اذهب واسأل خادم الأسماء المعتمد (Authoritative DNS) لهذا النطاق."`,
        status: 'success',
        badge: `${tld} TLD Server`
      });

      steps.push({
        title: `الخطوة 5: الاستعلام من خادم الأسماء المعتمد (Authoritative DNS)`,
        desc: `سؤال الخادم المالك الرسمي لسجلات هذا النطاق. أجاب الخادم فوراً: "نعم، السجل المطلوب [${recordType}] للنطاق [${domain}] موجود لدي وعنوانه كما يلي..."`,
        status: 'success',
        badge: 'Authoritative DNS'
      });

      renderDnsSteps(steps, finalAnswer, domain, recordType);
    }, 1200);

    function renderDnsSteps(steps, answer, dom, type) {
      let html = `<div style="display:flex; flex-direction:column; gap:1.25rem;">`;
      
      html += `<div style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.75rem; display:flex; justify-content:space-between; align-items:center;">`;
      html += `<span style="font-weight:800; font-size:1rem; color:var(--accent-secondary);"><i class="fa-solid fa-route"></i> مسار تتبع استعلام الـ DNS للنطاق: <span style="font-family:var(--font-mono);">${dom}</span></span>`;
      html += `<span class="tool-badge-local" style="font-family:var(--font-mono); font-size:0.75rem;">Type: ${type}</span>`;
      html += `</div>`;

      html += `<div class="dns-timeline" style="position:relative; padding-right:1.5rem; display:flex; flex-direction:column; gap:1.25rem;">`;
      html += `<div style="position:absolute; top:8px; bottom:8px; right:6px; width:2px; background:linear-gradient(to bottom, var(--accent-primary), var(--accent-secondary)); opacity:0.3;"></div>`;

      steps.forEach((step, idx) => {
        html += `<div class="dns-timeline-node" style="position:relative; animation:fadeInLeft 0.3s ${idx * 0.15}s ease-out forwards; opacity:0;">`;
        html += `<div style="position:absolute; top:4px; right:-1.95rem; width:12px; height:12px; border-radius:50%; background:var(--accent-secondary); border:3px solid var(--bg-secondary); box-shadow:0 0 8px var(--accent-secondary-glow);"></div>`;
        
        html += `<div style="background:rgba(255,255,255,0.015); border:1px solid var(--border-color); padding:0.85rem; border-radius:8px;">`;
        html += `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem; flex-wrap:wrap; gap:0.25rem;">`;
        html += `<span style="font-weight:700; font-size:0.85rem; color:var(--text-primary);">${step.title}</span>`;
        html += `<span style="font-size:0.65rem; background:rgba(255,255,255,0.05); padding:2px 6px; border-radius:4px; font-family:var(--font-mono); font-weight:700; color:var(--accent-primary);">${step.badge}</span>`;
        html += `</div>`;
        html += `<p style="font-size:0.8rem; color:var(--text-muted); line-height:1.5;">${step.desc}</p>`;
        html += `</div>`;
        html += `</div>`;
      });

      html += `</div>`;

      html += `<div style="margin-top:0.5rem; background:rgba(16,185,129,0.05); border:1px solid var(--success); padding:1rem; border-radius:10px; text-align:right;">`;
      html += `<div style="font-size:0.8rem; color:var(--text-muted); font-weight:700; margin-bottom:0.25rem;"><i class="fa-solid fa-circle-check" style="color:var(--success);"></i> سجل الإجابة النهائي المسترجع (DNS Record Answer):</div>`;
      html += `<div style="font-family:var(--font-mono); font-size:1.1rem; font-weight:bold; color:var(--success); word-break:break-all; direction:ltr; text-align:left;">`;
      html += `${dom} &nbsp;&nbsp; IN &nbsp;&nbsp; ${type} &nbsp;&nbsp; <b>${answer}</b>`;
      html += `</div>`;
      html += `</div>`;

      html += `</div>`;
      
      outputBox.innerHTML = html;
      playSuccessSound();
    }
  };

  // -------------------------------------------------------------
  // SSH Keygen & Connection Simulator Logic
  // -------------------------------------------------------------
  let generatedPrivateKey = '';
  let generatedPublicKey = '';
  let isSshKeyDeployed = false;

  window.generateSSHKeys = function() {
    playClick();
    
    const randomHex = () => Math.random().toString(16).substring(2, 14).toUpperCase();
    const keyHash = randomHex() + randomHex() + randomHex();
    
    generatedPrivateKey = `-----BEGIN RSA PRIVATE KEY-----\nMIIEogIBAAKCAQEAzKq9X${keyHash}lKq9\nd8hK9Y7zK2d8Z9X2lKq9d8hK9Y7zK2d8\nZ9X2lKq9d8hK9Y7zK2d8Z9X2lKq9d8hK\n${keyHash.toLowerCase()}d8Z9X2lKq9d8hK9Y7z\n-----END RSA PRIVATE KEY-----`;
    
    generatedPublicKey = `ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDzKq9X${keyHash}lKq9d8K9Y7zK2d8Z9X2lKq9d8hK9Y7zK2d8Z9X2lKq9d8hK9Y7zK2d8Z9X2lKq9d8hK9Y7zK2d8Z9X2l it_ninja@client-pc`;

    const privKeyText = document.getElementById('ssh-private-key');
    const pubKeyText = document.getElementById('ssh-public-key');
    
    if (privKeyText && pubKeyText) {
      privKeyText.value = generatedPrivateKey;
      pubKeyText.value = generatedPublicKey;
    }

    const deployBtn = document.getElementById('ssh-deploy-btn');
    if (deployBtn) {
      deployBtn.disabled = false;
    }

    const deployStatus = document.getElementById('ssh-deploy-status');
    if (deployStatus) {
      deployStatus.style.display = 'none';
    }

    const connectBtn = document.getElementById('ssh-connect-btn');
    if (connectBtn) {
      connectBtn.disabled = true;
    }

    const handshakeBox = document.getElementById('ssh-handshake-visual');
    if (handshakeBox) {
      handshakeBox.style.display = 'none';
    }

    playSuccessSound();
  };

  window.deploySSHPublicKey = function() {
    playClick();
    const statusBox = document.getElementById('ssh-deploy-status');
    if (!statusBox) return;

    statusBox.style.display = 'block';
    statusBox.style.color = 'var(--accent-secondary)';
    statusBox.innerHTML = `⏳ جاري الاتصال بالخادم البعيد ونشر المفتاح...`;

    setTimeout(() => {
      isSshKeyDeployed = true;
      statusBox.style.color = 'var(--success)';
      statusBox.innerHTML = `✔️ تم نشر المفتاح العام وإضافته بنجاح إلى ملف authorized_keys على السيرفر 192.168.1.15!`;
      
      const connectBtn = document.getElementById('ssh-connect-btn');
      if (connectBtn) {
        connectBtn.disabled = false;
      }
      playSuccessSound();
    }, 1500);
  };

  window.connectViaSSHKey = function() {
    playClick();
    const handshakeBox = document.getElementById('ssh-handshake-visual');
    if (!handshakeBox) return;

    handshakeBox.style.display = 'block';
    handshakeBox.innerHTML = '';

    const logs = [
      { t: "OpenSSH_8.9p1, OpenSSL 3.0.2 15 Mar 2022", c: "#94a3b8" },
      { t: "debug1: Connecting to 192.168.1.15 [192.168.1.15] port 22...", c: "#38bdf8" },
      { t: "debug1: Connection established.", c: "#10b981" },
      { t: "debug1: identity file /home/it_ninja/.ssh/id_rsa type 0", c: "#94a3b8" },
      { t: "debug1: Local version string SSH-2.0-OpenSSH_8.9p1", c: "#94a3b8" },
      { t: "debug1: Remote version string SSH-2.0-OpenSSH_8.4p1 Debian-5", c: "#94a3b8" },
      { t: "debug1: SSH2_MSG_KEXINIT sent", c: "#a855f7" },
      { t: "debug1: SSH2_MSG_KEXINIT received", c: "#a855f7" },
      { t: "debug1: kex: algorithm: curve25519-sha256", c: "#94a3b8" },
      { t: "debug1: Host '192.168.1.15' is known and matches the ECDSA host key.", c: "#10b981" },
      { t: "debug1: SSH2_MSG_SERVICE_ACCEPT received", c: "#94a3b8" },
      { t: "debug1: Authentications that can continue: publickey,password", c: "#e2e8f0" },
      { t: "debug1: Next authentication method: publickey", c: "#e2e8f0" },
      { t: "debug1: Offering public key: /home/it_ninja/.ssh/id_rsa RSA SHA256:...", c: "#38bdf8" },
      { t: "debug1: Server accepts key. Sending signature...", c: "#10b981" },
      { t: "debug1: Authentication successful (publickey).", c: "#22c55e" },
      { t: "debug1: Channel 0: new [client-session]", c: "#94a3b8" },
      { t: "debug1: Entering interactive session.", c: "#10b981" },
      { t: "--------------------------------------------------------", c: "#475569" },
      { t: "Welcome to Ubuntu 22.04 LTS (GNU/Linux 5.15.0-72-generic)\n\n * Documentation:  https://help.ubuntu.com\n * Support:        https://ubuntu.com/pro\n\nLast login: Tue Jun 16 12:45:02 2026 from 192.168.1.55\n\nit_ninja@linux-webserver:~$ ", c: "#22c55e" }
    ];

    let currentLog = 0;
    
    function printNextLog() {
      if (currentLog < logs.length) {
        const log = logs[currentLog];
        const line = document.createElement('div');
        line.style.color = log.c;
        line.style.whiteSpace = 'pre-wrap';
        line.style.marginBottom = '4px';
        line.textContent = log.t;
        handshakeBox.appendChild(line);
        handshakeBox.scrollTop = handshakeBox.scrollHeight;
        
        currentLog++;
        setTimeout(printNextLog, 120);
      } else {
        playSuccessSound();
        if (typeof triggerConfetti === 'function') triggerConfetti();
      }
    }

    printNextLog();
  };

  // -------------------------------------------------------------
  // Custom VMs & Infrastructure spec calculator upgrades (RAID & Custom VMs)
  // -------------------------------------------------------------
  window.customVMs = [];
  
  window.addCustomVM = function() {
    playClick();
    const nameInput = document.getElementById('hl-custom-name');
    const ramInput = document.getElementById('hl-custom-ram');
    const coresInput = document.getElementById('hl-custom-cores');
    const storageInput = document.getElementById('hl-custom-storage');

    if (!nameInput || !ramInput || !coresInput || !storageInput) return;

    const name = nameInput.value.trim() || "خادم مخصص";
    const ram = parseFloat(ramInput.value) || 2;
    const cores = parseInt(coresInput.value) || 1;
    const storage = parseInt(storageInput.value) || 20;

    window.customVMs.push({ name, ram, cores, storage });

    nameInput.value = '';
    
    renderCustomVMsList();
    calculateHomeLabHW();
  };

  window.removeCustomVM = function(index) {
    playClick();
    window.customVMs.splice(index, 1);
    renderCustomVMsList();
    calculateHomeLabHW();
  };

  function renderCustomVMsList() {
    const container = document.getElementById('hl-custom-vms-list');
    if (!container) return;
    container.innerHTML = '';
    window.customVMs.forEach((vm, index) => {
      const badge = document.createElement('div');
      badge.className = 'custom-vm-badge';
      badge.innerHTML = `
        <span>${escapeHTML(vm.name)} (${vm.ram}GB, ${vm.cores} Cores, ${vm.storage}GB)</span>
        <button class="custom-vm-remove-btn" onclick="removeCustomVM(${index})" title="حذف">×</button>
      `;
      container.appendChild(badge);
    });
  }

  // -------------------------------------------------------------
  // Command Quick Finder Database & Helper Logic
  // -------------------------------------------------------------
  const commandsDB = [
    {
      os: "linux",
      cat: "files",
      name: "ls -la",
      desc: "عرض جميع الملفات والمجلدات الحالية بالتفصيل بما فيها الملفات المخفية.",
      syntax: "ls [options] [path]",
      example: "ls -la /var/log"
    },
    {
      os: "linux",
      cat: "files",
      name: "chmod 755",
      desc: "تعديل صلاحيات الملف ليكون قابلاً للقراءة والكتابة والتنفيذ للمالك والقراءة والتنفيذ للبقية.",
      syntax: "chmod <permissions> <filename>",
      example: "chmod 755 script.sh"
    },
    {
      os: "linux",
      cat: "files",
      name: "chown root:root",
      desc: "تغيير مالك ومجموعة الملف أو المجلد إلى المستخدم root.",
      syntax: "chown [owner]:[group] <filename>",
      example: "chown root:www-data config.conf"
    },
    {
      os: "linux",
      cat: "network",
      name: "ip a",
      desc: "عرض جميع كروت الشبكة وعناوين الـ IP المرتبطة بها.",
      syntax: "ip addr show",
      example: "ip a"
    },
    {
      os: "linux",
      cat: "network",
      name: "ping -c 4",
      desc: "اختبار الاتصال مع خادم معين عن طريق إرسال 4 حزم بيانات فقط.",
      syntax: "ping -c <count> <host>",
      example: "ping -c 4 8.8.8.8"
    },
    {
      os: "linux",
      cat: "network",
      name: "netstat -tulnp",
      desc: "عرض جميع المنافذ المفتوحة والخدمات التي تستمع إليها حالياً.",
      syntax: "netstat [options]",
      example: "netstat -tulnp"
    },
    {
      os: "linux",
      cat: "network",
      name: "dig",
      desc: "الاستعلام عن سجلات الـ DNS لنطاق معين بشكل تفصيلي.",
      syntax: "dig <domain> [type]",
      example: "dig google.com A"
    },
    {
      os: "linux",
      cat: "system",
      name: "systemctl status",
      desc: "التحقق من حالة خدمة معينة (نشطة أو متوقفة) في النظام.",
      syntax: "systemctl status <service>",
      example: "systemctl status nginx"
    },
    {
      os: "linux",
      cat: "system",
      name: "systemctl restart",
      desc: "إعادة تشغيل خدمة معينة فوراً لتطبيق التعديلات الجديدة.",
      syntax: "systemctl restart <service>",
      example: "systemctl restart sshd"
    },
    {
      os: "linux",
      cat: "system",
      name: "df -h",
      desc: "عرض مساحات الأقراص المتصلة وحجم الاستهلاك والمساحة الحرة بصيغة مقروءة.",
      syntax: "df -h",
      example: "df -h"
    },
    {
      os: "linux",
      cat: "system",
      name: "journalctl -u -n 50",
      desc: "عرض آخر 50 سطر من سجلات الأحداث (Logs) لخدمة محددة.",
      syntax: "journalctl -u <service> -n <lines>",
      example: "journalctl -u nginx -n 50"
    },
    {
      os: "linux",
      cat: "security",
      name: "ufw status",
      desc: "التحقق من حالة جدار الحماية البسيط UFW وقواعده الحالية.",
      syntax: "ufw status verbose",
      example: "ufw status"
    },
    {
      os: "linux",
      cat: "security",
      name: "iptables -L -n -v",
      desc: "سرد جميع قواعد جدار الحماية iptables بشكل تفصيلي ورقمي.",
      syntax: "iptables -L",
      example: "iptables -L -n -v"
    },
    {
      os: "powershell",
      cat: "files",
      name: "Get-ChildItem",
      desc: "سرد الملفات والمجلدات في المسار الحالي (مكافئ لـ ls أو dir).",
      syntax: "Get-ChildItem -Path [path] [-Recurse]",
      example: "Get-ChildItem -Path C:\\configs"
    },
    {
      os: "powershell",
      cat: "files",
      name: "Copy-Item",
      desc: "نسخ ملف أو مجلد إلى مسار آخر.",
      syntax: "Copy-Item -Path <source> -Destination <dest>",
      example: "Copy-Item -Path .\\web.config -Destination C:\\inetpub\\"
    },
    {
      os: "powershell",
      cat: "network",
      name: "Get-NetIPAddress",
      desc: "عرض تفاصيل عناوين الـ IP لجميع كروت الشبكة في الويندوز.",
      syntax: "Get-NetIPAddress [-InterfaceAlias <alias>]",
      example: "Get-NetIPAddress -InterfaceAlias 'Ethernet'"
    },
    {
      os: "powershell",
      cat: "network",
      name: "Test-NetConnection",
      desc: "فحص الاتصال مع خادم وفحص ما إذا كان هناك منفذ معين مفتوحاً (مكافئ لـ telnet).",
      syntax: "Test-NetConnection -ComputerName <host> -Port <port>",
      example: "Test-NetConnection -ComputerName 192.168.1.15 -Port 22"
    },
    {
      os: "powershell",
      cat: "network",
      name: "Resolve-DnsName",
      desc: "الاستعلام عن خوادم الـ DNS لاسم دومين معين (مكافئ لـ nslookup).",
      syntax: "Resolve-DnsName -Name <domain>",
      example: "Resolve-DnsName -Name google.com"
    },
    {
      os: "powershell",
      cat: "system",
      name: "Get-Service",
      desc: "عرض جميع الخدمات المثبتة في نظام ويندوز وحالتها الحالية.",
      syntax: "Get-Service [-Name <name>]",
      example: "Get-Service -Name 'wuauserv'"
    },
    {
      os: "powershell",
      cat: "system",
      name: "Start-Service / Stop-Service",
      desc: "تشغيل أو إيقاف خدمة معينة في الويندوز.",
      syntax: "Start-Service -Name <name>",
      example: "Start-Service -Name 'wuauserv'"
    },
    {
      os: "powershell",
      cat: "system",
      name: "Get-Process",
      desc: "سرد العمليات النشطة حالياً في الويندوز ومعدل استهلاكها للموارد.",
      syntax: "Get-Process",
      example: "Get-Process | Sort-Object CPU -Descending"
    },
    {
      os: "powershell",
      cat: "security",
      name: "Get-NetFirewallRule",
      desc: "عرض جميع قواعد جدار حماية ويندوز (Windows Firewall).",
      syntax: "Get-NetFirewallRule -DisplayName <rule>",
      example: "Get-NetFirewallRule -DisplayName 'HTTP*'"
    }
  ];

  let currentFilterOS = 'all';
  let currentFilterCat = 'all';

  window.filterCommandsByOS = function(os) {
    playClick();
    currentFilterOS = os;
    document.querySelectorAll('.cmd-filter-os').forEach(btn => {
      if (btn.getAttribute('data-os') === os) btn.classList.add('active');
      else btn.classList.remove('active');
    });
    renderCommands();
  };

  window.filterCommandsByCat = function(cat) {
    playClick();
    currentFilterCat = cat;
    document.querySelectorAll('.cmd-filter-cat').forEach(btn => {
      if (btn.getAttribute('data-cat') === cat) btn.classList.add('active');
      else btn.classList.remove('active');
    });
    renderCommands();
  };

  window.searchCommands = function() {
    renderCommands();
  };

  window.copyToClipboard = function(text, btn) {
    playClick();
    navigator.clipboard.writeText(text).then(() => {
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> تم النسخ!';
      btn.style.background = 'var(--success)';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.color = '';
      }, 1500);
    });
  };

  window.renderCommands = function() {
    const grid = document.getElementById('commands-results-grid');
    if (!grid) return;

    const query = (document.getElementById('cmd-search-input')?.value || '').toLowerCase().trim();

    const filtered = commandsDB.filter(cmd => {
      const matchOS = currentFilterOS === 'all' || cmd.os === currentFilterOS;
      const matchCat = currentFilterCat === 'all' || cmd.cat === currentFilterCat;
      const matchQuery = !query || 
                         cmd.name.toLowerCase().includes(query) || 
                         cmd.desc.toLowerCase().includes(query) || 
                         cmd.syntax.toLowerCase().includes(query) ||
                         cmd.example.toLowerCase().includes(query);
      return matchOS && matchCat && matchQuery;
    });

    grid.innerHTML = '';
    if (filtered.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:var(--text-muted); padding:2rem;">لا توجد نتائج تطابق شروط البحث.</div>';
      return;
    }

    filtered.forEach(cmd => {
      const card = document.createElement('div');
      card.className = `cmd-card ${cmd.os}`;
      card.innerHTML = `
        <div>
          <div class="cmd-card-header">
            <span class="cmd-name">${escapeHTML(cmd.name)}</span>
            <span class="cmd-badge ${cmd.os}">${cmd.os}</span>
          </div>
          <p class="cmd-desc">${escapeHTML(cmd.desc)}</p>
          <div class="cmd-syntax-box">${escapeHTML(cmd.syntax)}</div>
        </div>
        <div class="cmd-example-box">
          <span style="overflow-x:auto; white-space:nowrap; padding-right:0.25rem;">${escapeHTML(cmd.example)}</span>
          <button class="cmd-copy-btn" onclick="copyToClipboard('${cmd.example.replace(/'/g, "\\'")}', this)"><i class="fa-solid fa-copy"></i> نسخ</button>
        </div>
      `;
      grid.appendChild(card);
    });
  };

  // -------------------------------------------------------------
  // Subnetting Speed Challenge Timer, Logic & Score
  // -------------------------------------------------------------
  let subnetGameTimer = null;
  let subnetGameTimeLeft = 60;
  let subnetGameScore = 0;
  let subnetGameStreak = 1;
  let subnetGameCorrectIndex = 0;

  window.startSubnetSpeedChallenge = function() {
    playClick();
    if (subnetGameTimer) clearInterval(subnetGameTimer);

    subnetGameTimeLeft = 60;
    subnetGameScore = 0;
    subnetGameStreak = 1;

    document.getElementById('subnet-game-timer').textContent = '60s';
    document.getElementById('subnet-game-score').textContent = '0';
    document.getElementById('subnet-game-streak').textContent = 'x1';
    
    const highscore = parseInt(localStorage.getItem('it_ninja_subnet_highscore') || '0');
    document.getElementById('subnet-game-highscore').textContent = highscore;

    document.getElementById('subnet-game-start-screen').style.display = 'none';
    document.getElementById('subnet-game-end-screen').style.display = 'none';
    document.getElementById('subnet-game-play-screen').style.display = 'block';
    document.getElementById('subnet-game-feedback').style.display = 'none';

    subnetGameTimer = setInterval(() => {
      subnetGameTimeLeft--;
      document.getElementById('subnet-game-timer').textContent = `${subnetGameTimeLeft}s`;
      if (subnetGameTimeLeft <= 10) {
        document.getElementById('subnet-game-timer').style.color = 'var(--danger)';
        playSynthSound(440, 'sine', 0.1, 0.02); // Ticking sound
      } else {
        document.getElementById('subnet-game-timer').style.color = '';
      }

      if (subnetGameTimeLeft <= 0) {
        endSubnetSpeedChallenge();
      }
    }, 1000);

    generateSpeedQuestion();
  };

  function generateSpeedQuestion() {
    const questionEl = document.getElementById('subnet-game-question');
    const optionBtns = document.querySelectorAll('.subnet-opt-btn');
    if (!questionEl || optionBtns.length < 4) return;

    // Remove choice highlights
    optionBtns.forEach(btn => {
      btn.className = 'btn btn-secondary subnet-opt-btn';
      btn.disabled = false;
    });

    // Generate randomized IP
    const o1 = Math.floor(Math.random() * 223) + 1; // 1-223 (avoid Class D/E)
    let o2, o3;
    if (o1 < 128) { // Class A
      o2 = 0; o3 = 0;
    } else if (o1 < 192) { // Class B
      o2 = Math.floor(Math.random() * 256); o3 = 0;
    } else { // Class C
      o2 = Math.floor(Math.random() * 256); o3 = Math.floor(Math.random() * 256);
    }
    const o4 = Math.floor(Math.random() * 254) + 1;
    const ipStr = `${o1}.${o2}.${o3}.${o4}`;

    // Random CIDR
    const cidrs = [16, 18, 20, 22, 24, 25, 26, 27, 28, 29, 30];
    const cidr = cidrs[Math.floor(Math.random() * cidrs.length)];

    // Bitwise helper calculations
    const ipToLong = (ip) => ip.split('.').reduce((acc, oct) => (acc << 8) + parseInt(oct), 0) >>> 0;
    const longToIp = (l) => [ (l >>> 24) & 255, (l >>> 16) & 255, (l >>> 8) & 255, l & 255 ].join('.');
    
    const ipLong = ipToLong(ipStr);
    const maskLong = (~(Math.pow(2, 32 - cidr) - 1)) >>> 0;
    const netLong = (ipLong & maskLong) >>> 0;
    const size = Math.pow(2, 32 - cidr);
    const broadLong = (netLong + size - 1) >>> 0;
    const usable = size > 2 ? size - 2 : 0;

    const maskText = [ (maskLong >>> 24) & 255, (maskLong >>> 16) & 255, (maskLong >>> 8) & 255, maskLong & 255 ].join('.');

    // Type of question
    const qType = Math.floor(Math.random() * 4);
    let questionText = "";
    let correctAnswer = "";
    let wrongAnswers = [];

    if (qType === 0) {
      questionText = `ما هو عنوان الشبكة (Network Address) للجهاز <b>${ipStr}/${cidr}</b>؟`;
      correctAnswer = longToIp(netLong);
      
      wrongAnswers = [
        longToIp(netLong + size),
        longToIp((netLong - size) >>> 0),
        longToIp(netLong + 1),
      ];
    } else if (qType === 1) {
      questionText = `ما هو عنوان البث (Broadcast Address) للشبكة <b>${ipStr}/${cidr}</b>؟`;
      correctAnswer = longToIp(broadLong);
      
      wrongAnswers = [
        longToIp(broadLong + 1),
        longToIp(broadLong - 1),
        longToIp(netLong),
      ];
    } else if (qType === 2) {
      questionText = `ما هو قناع الشبكة (Subnet Mask) للبادئة <b>/${cidr}</b>؟`;
      correctAnswer = maskText;
      
      wrongAnswers = [
        cidr === 24 ? "255.255.255.240" : "255.255.255.0",
        cidr === 30 ? "255.255.255.248" : "255.255.255.252",
        "255.255.0.0"
      ];
    } else {
      questionText = `كم عدد الأجهزة المتاحة (Usable Hosts) في القناع <b>/${cidr}</b>؟`;
      correctAnswer = usable.toString();
      
      wrongAnswers = [
        (usable + 2).toString(),
        (usable - 2).toString(),
        (usable + 10).toString()
      ];
    }

    // Shuffle options
    const options = [correctAnswer, ...wrongAnswers];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    subnetGameCorrectIndex = options.indexOf(correctAnswer);

    questionEl.innerHTML = questionText;
    optionBtns.forEach((btn, idx) => {
      btn.textContent = options[idx];
    });
  }

  window.submitSubnetGameAnswer = function(index) {
    if (subnetGameTimeLeft <= 0) return;

    const optionBtns = document.querySelectorAll('.subnet-opt-btn');
    const feedback = document.getElementById('subnet-game-feedback');

    optionBtns.forEach(btn => btn.disabled = true);

    if (index === subnetGameCorrectIndex) {
      playSuccessSound();
      optionBtns[index].classList.add('correct-choice');
      
      const points = 100 * subnetGameStreak;
      subnetGameScore += points;
      document.getElementById('subnet-game-score').textContent = subnetGameScore;
      
      if (subnetGameStreak < 5) subnetGameStreak++;
      document.getElementById('subnet-game-streak').textContent = `x${subnetGameStreak}`;

      feedback.className = 'result-box correct';
      feedback.style.display = 'block';
      feedback.textContent = `إجابة صحيحة! +${points} نقطة`;
    } else {
      playSynthSound(150, 'sawtooth', 0.3, 0.05);
      optionBtns[index].classList.add('wrong-choice');
      optionBtns[subnetGameCorrectIndex].classList.add('correct-choice');
      
      subnetGameStreak = 1;
      document.getElementById('subnet-game-streak').textContent = `x1`;

      feedback.className = 'result-box wrong';
      feedback.style.display = 'block';
      feedback.textContent = `إجابة خاطئة! الإجابة الصحيحة هي: ${optionBtns[subnetGameCorrectIndex].textContent}`;
    }

    setTimeout(() => {
      feedback.style.display = 'none';
      if (subnetGameTimeLeft > 0) {
        generateSpeedQuestion();
      }
    }, 1500);
  };

  function endSubnetSpeedChallenge() {
    if (subnetGameTimer) clearInterval(subnetGameTimer);
    subnetGameTimer = null;

    playSuccessSound();
    document.getElementById('subnet-game-play-screen').style.display = 'none';
    document.getElementById('subnet-game-end-screen').style.display = 'block';
    document.getElementById('subnet-game-final-score').textContent = subnetGameScore;

    const xpGained = Math.floor(subnetGameScore / 10);
    document.getElementById('subnet-game-xp-gained').textContent = `${xpGained} XP`;

    // Award XP
    window.addXP(xpGained);

    // Save Highscore
    const oldHighscore = parseInt(localStorage.getItem('it_ninja_subnet_highscore') || '0');
    if (subnetGameScore > oldHighscore) {
      localStorage.setItem('it_ninja_subnet_highscore', subnetGameScore.toString());
      document.getElementById('subnet-game-highscore').textContent = subnetGameScore;
    }
    
    if (typeof triggerConfetti === 'function') triggerConfetti();
  }

  // -------------------------------------------------------------
  // HTTP & TCP Handshake Timeline Visualizer
  // -------------------------------------------------------------
  window.runHttpHandshakeSim = function() {
    playClick();
    const method = document.getElementById('http-sim-method').value;
    const url = document.getElementById('http-sim-url').value.trim() || 'https://api.itninja.local/v1/data';
    const statusCode = document.getElementById('http-sim-status-code').value;

    const container = document.getElementById('handshake-flows');
    const reqHeadersBox = document.getElementById('http-sim-req-headers');
    const resHeadersBox = document.getElementById('http-sim-res-headers');

    if (!container || !reqHeadersBox || !resHeadersBox) return;

    container.innerHTML = '';
    reqHeadersBox.textContent = '-- بانتظار إرسال طلب HTTP --';
    resHeadersBox.textContent = '-- بانتظار الاستجابة --';

    const steps = [
      { type: 'syn', label: 'SYN (Seq=0, CTL=SYN)', from: 'left', to: 'right', top: 30 },
      { type: 'synack', label: 'SYN-ACK (Seq=0, Ack=1, CTL=SYN,ACK)', from: 'right', to: 'left', top: 70 },
      { type: 'ack', label: 'ACK (Seq=1, Ack=1, CTL=ACK)', from: 'left', to: 'right', top: 110 },
      { type: 'http-req', label: `${method} Request Headers`, from: 'left', to: 'right', top: 150 },
      { type: 'http-res', label: `HTTP/1.1 ${statusCode} Response`, from: 'right', to: 'left', top: 200 }
    ];

    let currentStep = 0;

    function executeNextStep() {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        
        drawHandshakeLine(step);

        if (step.type.startsWith('http')) {
          playSynthSound(587.33, 'sine', 0.2, 0.05);
        } else {
          playSynthSound(349.23, 'sine', 0.15, 0.05);
        }

        if (step.type === 'http-req') {
          const parsedUrl = new URL(url.startsWith('http') ? url : 'http://' + url);
          const rawRequest = `${method} ${parsedUrl.pathname}${parsedUrl.search} HTTP/1.1\r\n` +
            `Host: ${parsedUrl.hostname}\r\n` +
            `User-Agent: IT-Ninja-Simulator/v2.5\r\n` +
            `Accept: application/json\r\n` +
            `Content-Type: application/json\r\n` +
            `Authorization: Bearer token123_ninja_secret\r\n` +
            (method === 'POST' || method === 'PUT' ? `Content-Length: 32\r\n\r\n{ "status": "active", "xp": 1500 }` : `\r\n`);
          reqHeadersBox.textContent = rawRequest;
        }

        if (step.type === 'http-res') {
          let statusText = 'OK';
          let body = '{ "message": "Success" }';
          if (statusCode === '201') { statusText = 'Created'; body = '{ "id": 105, "created": true }'; }
          else if (statusCode === '301') { statusText = 'Moved Permanently'; body = ''; }
          else if (statusCode === '401') { statusText = 'Unauthorized'; body = '{ "error": "Invalid token" }'; }
          else if (statusCode === '404') { statusText = 'Not Found'; body = '{ "error": "Endpoint not found" }'; }
          else if (statusCode === '500') { statusText = 'Internal Server Error'; body = '{ "error": "Database offline" }'; }

          const rawResponse = `HTTP/1.1 ${statusCode} ${statusText}\r\n` +
            `Date: ${new Date().toUTCString()}\r\n` +
            `Server: Nginx/1.22.1 (Ubuntu)\r\n` +
            `Content-Type: application/json\r\n` +
            `Content-Length: ${body.length}\r\n` +
            `Connection: close\r\n\r\n` + body;
          resHeadersBox.textContent = rawResponse;

          if (statusCode === '200' || statusCode === '201') {
            playSuccessSound();
            if (typeof triggerConfetti === 'function') triggerConfetti();
          } else {
            playSynthSound(150, 'sawtooth', 0.4, 0.08);
          }
        }

        currentStep++;
        setTimeout(executeNextStep, 1500);
      }
    }

    function drawHandshakeLine(step) {
      const isLeftToRight = step.from === 'left';
      
      const line = document.createElement('div');
      line.className = 'handshake-vis-line';
      line.style.top = `${step.top}px`;
      
      if (isLeftToRight) {
        line.style.left = '20%';
        line.style.width = '0%';
      } else {
        line.style.right = '20%';
        line.style.width = '0%';
      }

      container.appendChild(line);

      const dot = document.createElement('div');
      dot.className = 'handshake-packet-dot';
      dot.style.top = `${step.top - 4}px`;
      
      if (isLeftToRight) {
        dot.style.left = '20%';
      } else {
        dot.style.right = '20%';
      }
      container.appendChild(dot);

      const label = document.createElement('div');
      label.className = `handshake-label ${step.type}`;
      label.style.top = `${step.top - 8}px`;
      label.style.left = '50%';
      label.innerHTML = step.label;
      label.style.opacity = '0';
      container.appendChild(label);

      let startTime = null;
      const duration = 1000;

      function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        line.style.width = `${progress * 60}%`;

        if (isLeftToRight) {
          dot.style.left = `${20 + progress * 60}%`;
        } else {
          dot.style.right = `${20 + progress * 60}%`;
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          label.style.opacity = '1';
          dot.remove();
        }
      }

      requestAnimationFrame(animate);
    }

    executeNextStep();
  };

  // -------------------------------------------------------------
  // Progress Export & Import Logic (JSON Backup)
  // -------------------------------------------------------------
  window.addXP = function(amount) {
    const current = parseInt(localStorage.getItem('custom_game_xp') || '0');
    localStorage.setItem('custom_game_xp', (current + amount).toString());
    updateGlobalProgress();
  };

  window.exportStudyProgress = function() {
    playClick();
    
    const checkboxStates = {};
    document.querySelectorAll('.checklist-checkbox').forEach(cb => {
      checkboxStates[cb.id] = cb.checked;
    });

    const certProgress = {};
    document.querySelectorAll('[id^="cert-progress-"]').forEach(el => {
      const id = el.id.replace('cert-progress-', '');
      certProgress[id] = localStorage.getItem(`cert_progress_${id}`) || '0';
    });

    const stats = {
      custom_game_xp: parseInt(localStorage.getItem('custom_game_xp') || '0'),
      subnet_highscore: parseInt(localStorage.getItem('it_ninja_subnet_highscore') || '0'),
      theme: localStorage.getItem('theme') || 'dark',
      sound: localStorage.getItem('sound_enabled') || 'true',
      savedAt: new Date().toISOString()
    };

    const backupData = {
      checkboxes: checkboxStates,
      certProgress: certProgress,
      stats: stats
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `it_ninja_progress_backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    playSuccessSound();
    alert("تم تصدير وحفظ تقدم دراستك بنجاح! احتفظ بملف JSON المستخرج.");
  };

  window.triggerProgressImport = function() {
    playClick();
    const fileInput = document.getElementById('progress-import-file');
    if (fileInput) fileInput.click();
  };

  window.importStudyProgress = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const backupData = JSON.parse(e.target.result);
        if (!backupData.checkboxes || !backupData.stats) {
          throw new Error("ملف النسخة الاحتياطية غير صالح.");
        }

        // Restore checkboxes
        Object.keys(backupData.checkboxes).forEach(id => {
          if (backupData.checkboxes[id]) {
            localStorage.setItem(id, 'true');
          } else {
            localStorage.removeItem(id);
          }
        });

        // Restore stats
        if (backupData.stats.custom_game_xp !== undefined) {
          localStorage.setItem('custom_game_xp', backupData.stats.custom_game_xp.toString());
        }
        if (backupData.stats.subnet_highscore !== undefined) {
          localStorage.setItem('it_ninja_subnet_highscore', backupData.stats.subnet_highscore.toString());
        }
        if (backupData.stats.theme !== undefined) {
          localStorage.setItem('theme', backupData.stats.theme);
        }
        if (backupData.stats.sound !== undefined) {
          localStorage.setItem('sound_enabled', backupData.stats.sound);
        }

        // Restore certs
        if (backupData.certProgress) {
          Object.keys(backupData.certProgress).forEach(id => {
            localStorage.setItem(`cert_progress_${id}`, backupData.certProgress[id]);
          });
        }

        playSuccessSound();
        alert("تم استعادة التقدم بنجاح! سيتم إعادة تحميل الصفحة لتطبيق التحديثات.");
        window.location.reload();
      } catch (err) {
        playSynthSound(150, 'sawtooth', 0.3, 0.05);
        alert("خطأ: تعذر استيراد الملف. تأكد من أنه ملف نسخ احتياطي صحيح بصيغة JSON.");
      }
    };
    reader.readAsText(file);
  };

  // =============================================================
  // Phase 4: SysAdmin Tickets, Study Notebook, & Advanced Visualizers
  // =============================================================
  
  // 1. Trouble-Ticket Solver State & Logic
  let activeTicketId = null;
  const troubleTickets = {
    1: {
      id: 1,
      title: "موقع الويب معطل (403 Forbidden)",
      desc: "أبلغ العملاء أنهم عند محاولة زيارة موقع الويب `it-roadmap.local` يتلقون خطأ `403 Forbidden`. تشير التقارير إلى أن ملف الصفحة الرئيسية `index.html` في المسار `/var/www/html/index.html` تم تعديل صلاحياته بالخطأ مما منع خادم الويب من قراءته. استخدم الطرفية (CLI) لتصحيح صلاحيات الملف ليصبح قابلاً للقراءة للجميع (مثلاً chmod 644).",
      solved: false,
      xp: 100
    },
    2: {
      id: 2,
      title: "فشل اتصال SSH عن بعد",
      desc: "فشل المهندسون في الاتصال بالسيرفر عن بعد عبر سطر الأوامر (SSH). عند فحص الاتصال يظهر خطأ `Connection refused` على المنفذ 22. يبدو أن خدمة sshd متوقفة. استخدم الطرفية لتشغيل الخدمة (systemctl start sshd) والتحقق من حالتها.",
      solved: false,
      xp: 100
    },
    3: {
      id: 3,
      title: "ربط خادم الويب بملف Hosts المحلي",
      desc: "أضف اسماً مستعاراً لخادم الويب في الشبكة المحلية. نريد ربط عنوان الـ IP `192.168.1.15` باسم النطاق `linux-webserver.local` داخل ملف الإعدادات المحلي `/etc/hosts` حتى يستطيع العملاء تصفح السيرفر عبر الاسم بدلاً من الرقم. قم بتشغيل الأمر المناسب لإضافة السطر `192.168.1.15 linux-webserver.local` للملف hosts. (مثال: echo \"192.168.1.15 linux-webserver.local\" >> /etc/hosts).",
      solved: false,
      xp: 100
    }
  };

  function loadTicketsState() {
    Object.keys(troubleTickets).forEach(id => {
      const saved = localStorage.getItem(`trouble_ticket_${id}_solved`);
      if (saved === 'true') {
        troubleTickets[id].solved = true;
        const statusBadge = document.getElementById(`ticket-status-badge-${id}`);
        const card = document.getElementById(`ticket-card-${id}`);
        if (statusBadge) {
          statusBadge.textContent = "مكتملة ✅";
          statusBadge.style.background = "rgba(16, 185, 129, 0.15)";
          statusBadge.style.color = "var(--success)";
        }
        if (card) {
          card.style.borderColor = "rgba(16, 185, 129, 0.25)";
          card.style.background = "rgba(16, 185, 129, 0.03)";
        }
      }
    });
  }

  window.selectTicket = function(id) {
    playClick();
    activeTicketId = id;
    const ticket = troubleTickets[id];
    
    // Highlight selected card
    Object.keys(troubleTickets).forEach(tId => {
      const card = document.getElementById(`ticket-card-${tId}`);
      if (card) {
        if (parseInt(tId) === id) {
          card.style.background = "rgba(168, 85, 247, 0.08)";
          card.style.borderColor = "var(--accent-purple)";
        } else {
          card.style.background = "rgba(255,255,255,0.02)";
          card.style.borderColor = troubleTickets[tId].solved ? "rgba(16, 185, 129, 0.25)" : "var(--border-color)";
        }
      }
    });

    const panel = document.getElementById('active-ticket-panel');
    const title = document.getElementById('active-ticket-title');
    const desc = document.getElementById('active-ticket-desc');
    const xpSpan = document.getElementById('active-ticket-xp');

    if (panel && title && desc && xpSpan) {
      panel.style.display = "block";
      title.textContent = `تذكرة نشطة: ${ticket.title}`;
      desc.textContent = ticket.desc;
      xpSpan.textContent = `${ticket.xp} XP 🏆`;
    }

    // Scroll to terminal
    const termCard = document.querySelector('.terminal-box');
    if (termCard) {
      termCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const termInput = document.getElementById('term-input');
      if (termInput) termInput.focus();
    }
  };

  function checkTicketCompletion(cmd, outputLine) {
    if (!activeTicketId) return;
    const ticket = troubleTickets[activeTicketId];
    if (ticket.solved) return;

    let isCorrect = false;
    const normalized = cmd.toLowerCase().trim();

    if (activeTicketId === 1) {
      if (normalized.includes('chmod') && (normalized.includes('index.html') || normalized.includes('nginx.conf') || normalized.includes('configs') || normalized.includes('/var/www/html/'))) {
        isCorrect = true;
      }
    } else if (activeTicketId === 2) {
      if (normalized.includes('systemctl') && (normalized.includes('start') || normalized.includes('restart')) && (normalized.includes('sshd') || normalized.includes('ssh'))) {
        isCorrect = true;
      }
    } else if (activeTicketId === 3) {
      if ((normalized.includes('echo') && normalized.includes('192.168.1.15') && normalized.includes('linux-webserver.local') && normalized.includes('hosts')) || (normalized.includes('hosts') && normalized.includes('192.168.1.15'))) {
        isCorrect = true;
      }
    }

    if (isCorrect) {
      ticket.solved = true;
      localStorage.setItem(`trouble_ticket_${activeTicketId}_solved`, 'true');
      
      // Award XP
      addXP(ticket.xp);
      playSuccessSound();

      // Update UI
      const statusBadge = document.getElementById(`ticket-status-badge-${activeTicketId}`);
      const card = document.getElementById(`ticket-card-${activeTicketId}`);
      if (statusBadge) {
        statusBadge.textContent = "مكتملة ✅";
        statusBadge.style.background = "rgba(16, 185, 129, 0.15)";
        statusBadge.style.color = "var(--success)";
      }
      if (card) {
        card.style.borderColor = "rgba(16, 185, 129, 0.25)";
        card.style.background = "rgba(16, 185, 129, 0.03)";
      }

      // Print in terminal
      setTimeout(() => {
        const body = document.getElementById('term-body');
        if (body) {
          const successLine = document.createElement('div');
          successLine.className = 'terminal-line';
          successLine.style.color = '#10b981';
          successLine.style.fontWeight = 'bold';
          successLine.innerHTML = `[SUCCESS] Ticket solved! You gained +100 XP. Great job SysAdmin Ninja! ⚔️🔥`;
          body.appendChild(successLine);
          body.scrollTop = body.scrollHeight;
        }
      }, 500);

      // Reset active ticket
      activeTicketId = null;
      const panel = document.getElementById('active-ticket-panel');
      if (panel) {
        panel.style.display = "none";
      }
    }
  }

  // 2. IT Study Notebook Logic
  function renderMarkdown(text) {
    if (!text) return '<p style="color:var(--text-muted); text-align:center; padding:2rem 0;">اكتب شيئاً في المحرر لرؤية النتيجة هنا...</p>';
    
    let html = escapeHTML(text);

    // Replace headers
    html = html.replace(/^#\s+(.+)$/gm, '<h1 style="font-size: 1.5rem; font-weight: 800; margin-top: 1rem; margin-bottom: 0.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.25rem; color: var(--accent-primary);">$1</h1>');
    html = html.replace(/^##\s+(.+)$/gm, '<h2 style="font-size: 1.25rem; font-weight: 700; margin-top: 0.85rem; margin-bottom: 0.45rem; color: var(--accent-secondary);">$1</h2>');
    html = html.replace(/^###\s+(.+)$/gm, '<h3 style="font-size: 1.1rem; font-weight: 700; margin-top: 0.75rem; margin-bottom: 0.35rem; color: var(--text-primary);">$1</h3>');

    // Bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Code blocks
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); padding: 0.5rem 0.75rem; border-radius: 6px; font-family: var(--font-mono); font-size: 0.8rem; direction: ltr; text-align: left; overflow-x: auto; margin: 0.75rem 0;"><code>$2</code></pre>');

    // Inline code
    html = html.replace(/`(.*?)`/g, '<code style="background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-secondary); direction: ltr; display: inline-block;">$1</code>');

    // Bullet points
    html = html.replace(/^\-\s+(.+)$/gm, '<li style="margin-right: 1rem; list-style-type: disc;">$1</li>');

    // Paragraph breaks
    html = html.replace(/\n\n/g, '<br>');

    return html;
  }

  const notebookEditor = document.getElementById('notebook-editor');
  const notebookPreview = document.getElementById('notebook-preview');
  const notebookStatus = document.getElementById('notebook-save-status');

  if (notebookEditor && notebookPreview) {
    const savedNotes = localStorage.getItem('it_ninja_notes');
    if (savedNotes) {
      notebookEditor.value = savedNotes;
      notebookPreview.innerHTML = renderMarkdown(savedNotes);
    } else {
      notebookPreview.innerHTML = renderMarkdown(notebookEditor.placeholder);
    }

    let saveTimeout = null;
    notebookEditor.addEventListener('input', () => {
      const text = notebookEditor.value;
      notebookPreview.innerHTML = renderMarkdown(text);
      
      if (notebookStatus) {
        notebookStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ تلقائياً...';
        notebookStatus.style.color = 'var(--warning)';
      }

      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        localStorage.setItem('it_ninja_notes', text);
        if (notebookStatus) {
          notebookStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> تم الحفظ تلقائياً';
          notebookStatus.style.color = 'var(--success)';
        }
      }, 1000);
    });
  }

  window.clearNotebook = function() {
    if (confirm('هل أنت متأكد من مسح جميع الملاحظات؟')) {
      if (notebookEditor && notebookPreview) {
        notebookEditor.value = '';
        notebookPreview.innerHTML = renderMarkdown('');
        localStorage.removeItem('it_ninja_notes');
        playClick();
      }
    }
  };

  window.exportNotebook = function() {
    const text = notebookEditor ? notebookEditor.value : '';
    if (!text) {
      alert('المفكرة فارغة حالياً!');
      return;
    }
    playClick();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'it_ninja_notes.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 3. Visual TraceRoute & TTL Simulator Logic
  let trIsRunning = false;
  window.startTracerouteSim = function() {
    if (trIsRunning) return;
    trIsRunning = true;
    playClick();

    const targetInput = document.getElementById('tr-target');
    const ttlSelect = document.getElementById('tr-ttl-start');
    const startBtn = document.getElementById('tr-start-btn');
    const consoleBox = document.getElementById('tr-console');
    const explText = document.getElementById('tr-explanation-text');
    const statHop = document.getElementById('tr-stat-hop');
    const statTtl = document.getElementById('tr-stat-ttl');
    const packetDot = document.getElementById('tr-packet-dot');

    if (!targetInput || !startBtn || !consoleBox || !explText || !statHop || !statTtl || !packetDot) {
      trIsRunning = false;
      return;
    }

    const target = targetInput.value.trim() || "8.8.8.8";
    const startTtl = parseInt(ttlSelect.value) || 64;

    startBtn.disabled = true;
    startBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التتبع...';
    
    const targetIpNodeLabel = document.getElementById('tr-node-target-ip');
    const targetNameNodeLabel = document.getElementById('tr-node-target-name');
    if (targetIpNodeLabel) targetIpNodeLabel.textContent = target;
    if (targetNameNodeLabel) targetNameNodeLabel.textContent = target.includes('.') && isNaN(target.split('.')[0]) ? target : "Target";

    consoleBox.textContent = `traceroute to ${target} (142.250.190.46), 30 hops max, 60 byte packets\n`;
    
    const hops = [
      { num: 1, ip: "192.168.1.1", name: "localrouter.local", latency: "1.05 ms", desc: "القفزة 1: تم إرسال الحزمة بـ TTL=1. استلمها الراوتر المحلي، خفّض TTL لـ 0، ثم رد برسالة خطأ ICMP Time Exceeded (Type 11) لمعرفة الـ IP الخاص به." },
      { num: 2, ip: "10.0.0.1", name: "isp-gateway.net", latency: "4.23 ms", desc: "القفزة 2: تم إرسال الحزمة بـ TTL=2. مرت عبر الراوتر الأول (TTL=1) ووصلت لبوابة المزود ISP (TTL=0)، والذي رد بدوره برسالة ICMP Time Exceeded." },
      { num: 3, ip: "72.14.23.109", name: "edge-router.google.com", latency: "11.85 ms", desc: "القفزة 3: تم إرسال الحزمة بـ TTL=3. مرت بالقفزة الأولى والثانية ووصلت لراوتر الحافة الدولي (TTL=0)، وقام بالرد بنفس رسالة ICMP." },
      { num: 4, ip: "142.250.190.46", name: "destination-server.net", latency: "15.42 ms", desc: "القفزة الأخيرة: تم إرسال الحزمة بـ TTL=4. ووصلت للهدف النهائي بنجاح. رد السيرفر برسالة ICMP Echo Reply (Type 0) للإشارة لاكتمال الاتصال والتتبع!" }
    ];

    let currentHopIndex = 0;

    function runNextHop() {
      if (currentHopIndex >= hops.length) {
        consoleBox.textContent += `\nTrace complete. Target reached in ${hops.length} hops.`;
        explText.innerHTML = `<b>اكتمال التتبع!</b> تم رسم مسار البيانات بالكامل للوصول للهدف. لاحظ كيف تم تحديد هوية كل راوتر في المسار خطوة بخطوة عبر إرسال حزم TTL منخفضة تدريجياً.`;
        startBtn.disabled = false;
        startBtn.innerHTML = '<i class="fa-solid fa-play"></i> بدء التتبع 🚀';
        trIsRunning = false;
        playSuccessSound();
        addXP(20);
        return;
      }

      const hop = hops[currentHopIndex];
      statHop.textContent = hop.num;
      statTtl.textContent = startTtl - hop.num;

      const fromNode = document.getElementById(`tr-node-${currentHopIndex}`);
      const toNode = document.getElementById(`tr-node-${currentHopIndex + 1}`);

      if (fromNode && toNode) {
        fromNode.style.opacity = "1";
        toNode.style.opacity = "1";
        if (currentHopIndex > 0) {
          const prevNode = document.getElementById(`tr-node-${currentHopIndex - 1}`);
          if (prevNode) prevNode.style.opacity = "0.7";
        }

        const fromRect = fromNode.getBoundingClientRect();
        const toRect = toNode.getBoundingClientRect();
        const areaRect = document.querySelector('.tr-animation-area').getBoundingClientRect();

        const fromX = fromRect.left - areaRect.left + fromRect.width / 2;
        const fromY = fromRect.top - areaRect.top + fromRect.height / 2;
        const toX = toRect.left - areaRect.left + toRect.width / 2;
        const toY = toRect.top - areaRect.top + toRect.height / 2;

        packetDot.style.display = "block";
        packetDot.style.left = `${fromX}px`;
        packetDot.style.top = `${fromY}px`;

        playSynthSound(440 + currentHopIndex * 100, 'sine', 0.1, 0.05);

        let steps = 25;
        let step = 0;
        let deltaX = (toX - fromX) / steps;
        let deltaY = (toY - fromY) / steps;

        function animatePacket() {
          if (step <= steps) {
            packetDot.style.left = `${fromX + deltaX * step}px`;
            packetDot.style.top = `${fromY + deltaY * step}px`;
            step++;
            requestAnimationFrame(animatePacket);
          } else {
            packetDot.style.display = "none";
            
            consoleBox.textContent += ` ${hop.num}  ${hop.name} (${hop.ip})  ${hop.latency}  ${hop.latency}  ${hop.latency}\n`;
            consoleBox.scrollTop = consoleBox.scrollHeight;

            explText.innerHTML = `<b>${hop.name}</b><br>${hop.desc}`;

            currentHopIndex++;
            setTimeout(runNextHop, 1200);
          }
        }
        
        requestAnimationFrame(animatePacket);
      } else {
        consoleBox.textContent += ` ${hop.num}  ${hop.name} (${hop.ip})  ${hop.latency}\n`;
        currentHopIndex++;
        setTimeout(runNextHop, 1000);
      }
    }

    for (let i = 1; i <= 4; i++) {
      const node = document.getElementById(`tr-node-${i}`);
      if (node) node.style.opacity = "0.4";
    }

    setTimeout(runNextHop, 500);
  };

  // 4. SSL/TLS Let's Encrypt Certbot & TLS Handshake Simulator Logic
  let certbotIsRunning = false;
  window.runCertbotSim = function() {
    if (certbotIsRunning) return;
    certbotIsRunning = true;
    playClick();

    const certbotConsole = document.getElementById('certbot-console');
    const runBtn = document.getElementById('btn-certbot-run');
    if (!certbotConsole || !runBtn) {
      certbotIsRunning = false;
      return;
    }

    runBtn.disabled = true;
    runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري توليد الشهادة...';
    certbotConsole.innerHTML = "";
    
    const lines = [
      { text: "root@local-server:~# certbot certonly --standalone -d it-roadmap.local", delay: 200, color: "#f8fafc" },
      { text: "Saving debug log to /var/log/letsencrypt/letsencrypt.log", delay: 800 },
      { text: "Plugins selected: Authenticator standalone, Installer none", delay: 1200 },
      { text: "Requesting a certificate for it-roadmap.local", delay: 1800 },
      { text: "Performing the following challenges:", delay: 2200 },
      { text: "  http-01 challenge for it-roadmap.local", delay: 2500 },
      { text: "Waiting for verification...", delay: 3000, color: "#f59e0b" },
      { text: "Cleaning up challenges", delay: 4000 },
      { text: "Subscribe to the EFF mailing list (yes/no): y", delay: 4500, color: "#f8fafc" },
      { text: "IMPORTANT NOTES:", delay: 5200, color: "#10b981" },
      { text: " - Congratulations! Your certificate and chain have been saved at:", delay: 5500, color: "#10b981" },
      { text: "   /etc/letsencrypt/live/it-roadmap.local/fullchain.pem", delay: 5700, color: "#10b981" },
      { text: "   Your key file has been saved at:", delay: 5900, color: "#10b981" },
      { text: "   /etc/letsencrypt/live/it-roadmap.local/privkey.pem", delay: 6100, color: "#10b981" },
      { text: " - Your certificate will expire on 2026-09-17.", delay: 6400, color: "#10b981" },
      { text: " - If you like Certbot, please consider supporting our work!", delay: 6700, color: "#10b981" }
    ];

    let lineIdx = 0;
    function printNextCertbotLine() {
      if (lineIdx >= lines.length) {
        runBtn.disabled = false;
        runBtn.innerHTML = '<i class="fa-solid fa-shield-halved"></i> تشغيل Certbot 🛡️';
        certbotIsRunning = false;
        
        addXP(30);
        playSuccessSound();
        animateTlsHandshake();
        return;
      }

      const l = lines[lineIdx];
      setTimeout(() => {
        const div = document.createElement('div');
        if (l.color) div.style.color = l.color;
        div.textContent = l.text;
        certbotConsole.appendChild(div);
        certbotConsole.scrollTop = certbotConsole.scrollHeight;
        
        playSynthSound(300 + lineIdx * 40, 'sine', 0.05, 0.02);

        lineIdx++;
        printNextCertbotLine();
      }, lineIdx === 0 ? 0 : l.delay - lines[lineIdx - 1].delay);
    }

    printNextCertbotLine();
  };

  window.resetCertbotSim = function() {
    playClick();
    const certbotConsole = document.getElementById('certbot-console');
    const lockIcon = document.getElementById('tls-status-lock');
    const lockText = document.getElementById('tls-status-text');

    if (certbotConsole) {
      certbotConsole.innerHTML = `<div># Let's Encrypt certificate automation helper.</div>
<div># Click 'Run Certbot' below to verify domain ownership and install the SSL certificate.</div>`;
    }

    if (lockIcon && lockText) {
      lockIcon.style.color = "var(--text-dark)";
      lockText.textContent = "HTTP (غير آمن)";
      lockText.style.color = "var(--text-muted)";
    }

    for (let i = 1; i <= 4; i++) {
      const stepEl = document.getElementById(`tls-step-${i}`);
      if (stepEl) {
        stepEl.style.opacity = "0.3";
        stepEl.style.fontWeight = "normal";
        stepEl.style.color = "inherit";
      }
    }
  };

  function animateTlsHandshake() {
    const lockIcon = document.getElementById('tls-status-lock');
    const lockText = document.getElementById('tls-status-text');

    const steps = [
      { id: 1, text: "1. Client Hello: Sent TLS Cipher suites.", freq: 523 },
      { id: 2, text: "2. Server Hello: Returned public certificate.", freq: 587 },
      { id: 3, text: "3. Key Exchange: Pre-master secret sent.", freq: 659 },
      { id: 4, text: "4. Finished & Encrypted: Secure session established!", freq: 698 }
    ];

    let stepIdx = 0;
    function runNextTlsStep() {
      if (stepIdx >= steps.length) {
        if (lockIcon && lockText) {
          lockIcon.style.color = "var(--success)";
          lockText.textContent = "HTTPS (اتصال آمن 🔒)";
          lockText.style.color = "var(--success)";
          
          playSynthSound(880, 'sine', 0.3, 0.05);
          setTimeout(() => playSynthSound(1046, 'sine', 0.4, 0.05), 150);
        }
        return;
      }

      const step = steps[stepIdx];
      const stepEl = document.getElementById(`tls-step-${step.id}`);
      if (stepEl) {
        stepEl.style.opacity = "1";
        stepEl.style.fontWeight = "bold";
        stepEl.style.color = "var(--success)";
        playSynthSound(step.freq, 'triangle', 0.15, 0.05);
      }

      stepIdx++;
      setTimeout(runNextTlsStep, 1500);
    }

    for (let i = 1; i <= 4; i++) {
      const stepEl = document.getElementById(`tls-step-${i}`);
      if (stepEl) {
        stepEl.style.opacity = "0.3";
        stepEl.style.fontWeight = "normal";
        stepEl.style.color = "inherit";
      }
    }

    setTimeout(runNextTlsStep, 500);
  }

  // Load initial ticket states
  loadTicketsState();

  // 5. Visual Dynamic Roadmap Update Logic
  function updateRoadmap() {
    const phases = [
      { id: 0, prefix: 'itb', name: 'أساسيات الـ IT (A+)', tab: 'itbasics', label: 'المرحلة الأولى' },
      { id: 1, prefix: 'net', name: 'الشبكات (CCNA)', tab: 'networks', label: 'المرحلة الثانية' },
      { id: 2, prefix: 'lin', name: 'خوادم لينكس (CLI)', tab: 'linux', label: 'المرحلة الثالثة (أ)' },
      { id: 3, prefix: 'win', name: 'ويندوز سيرفر والـ Active Directory', tab: 'windows', label: 'المرحلة الثالثة (ب)' },
      { id: 4, prefix: 'cld', name: 'الافتراضية والخدمات والشبكات', tab: 'cloud', label: 'المرحلة الثالثة (ج)' },
      { id: 6, prefix: 'sec', name: 'الأمن السيبراني (Cyber Security)', tab: 'security', label: 'المرحلة الرابعة' },
      { id: 5, prefix: 'dev', name: 'التخصص والتقدم', tab: 'devops', label: 'المرحلة الخامسة' },
      { id: 7, prefix: 'k8s', name: 'إدارة الحاويات (Kubernetes)', tab: 'kubernetes', label: 'المرحلة السادسة' },
      { id: 8, prefix: 'git', name: 'الـ GitOps والـ IaC', tab: 'gitops', label: 'المرحلة السابعة' },
      { id: 9, prefix: 'sre', name: 'هندسة الموثوقية والمراقبة (SRE)', tab: 'sre', label: 'المرحلة الثامنة' },
      { id: 10, prefix: 'zt', name: 'الشبكات المتقدمة والأمن الصِفري', tab: 'zerotrust', label: 'المرحلة التاسعة' }
    ];

    let lastCompletedIndex = -1;
    let activePhaseSet = false;
    let completedCount = 0;

    phases.forEach((phase, index) => {
      const nodeEl = document.getElementById(`roadmap-node-${phase.id}`);
      if (!nodeEl) return;

      const totalTasks = document.querySelectorAll(`[id^="${phase.prefix}-task-"]`).length;
      const completedTasks = document.querySelectorAll(`[id^="${phase.prefix}-task-"]:checked`).length;
      const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      const badge = nodeEl.querySelector('.node-progress-badge');
      if (badge) {
        badge.textContent = `${progressPercent}%`;
      }

      const examPassed = localStorage.getItem(`exam-phase-${phase.id}-passed`) === 'true';

      nodeEl.classList.remove('completed', 'active-phase', 'locked-phase');

      if (progressPercent === 100 && examPassed) {
        nodeEl.classList.add('completed');
        lastCompletedIndex = index;
        completedCount++;
      } else if (!activePhaseSet) {
        nodeEl.classList.add('active-phase');
        activePhaseSet = true;
        
        const activeNameSpan = document.getElementById('roadmap-active-phase-name');
        if (activeNameSpan) {
          activeNameSpan.textContent = `${phase.name} (${phase.label || ('المرحلة ' + phase.id)})`;
        }
      } else {
        nodeEl.classList.add('locked-phase');
      }
    });

    const progressLine = document.getElementById('roadmap-line-progress');
    if (progressLine) {
      let percent = 0;
      if (completedCount >= phases.length) {
        percent = 100;
      } else if (completedCount > 0) {
        percent = (completedCount / phases.length) * 100;
      }
      progressLine.style.width = `calc(${percent}% - 2%)`;
      if (completedCount === 0) progressLine.style.width = '0%';
    }
  }

  window.switchTab = function(tabId) {
    playClick();
    const navItem = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
    if (navItem) {
      navItem.click();
      
      const activeSection = document.getElementById(tabId);
      if (activeSection) {
        activeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // -------------------------------------------------------------
  // Phase 0: PC Assembly Matcher Visual Game Logic
  // -------------------------------------------------------------
  function getPartName(type) {
    const names = {
      cpu: 'المعالج المركزي (CPU)',
      ram: 'ذاكرة الوصول العشوائي (RAM)',
      ssd: 'قرص التخزين السريع (SSD)',
      gpu: 'كارت الشاشة (GPU)',
      psu: 'مزود الطاقة (PSU)'
    };
    return names[type] || type;
  }

  function updateGameMessage(text, type) {
    const msgEl = document.getElementById('pc-game-msg');
    if (!msgEl) return;
    
    let icon = 'fa-info-circle';
    let color = 'var(--accent-primary)';
    if (type === 'success') {
      icon = 'fa-circle-check';
      color = 'var(--success)';
    } else if (type === 'warning') {
      icon = 'fa-circle-exclamation';
      color = 'var(--warning)';
    } else if (type === 'danger') {
      icon = 'fa-triangle-exclamation';
      color = 'var(--danger)';
    }
    
    msgEl.innerHTML = `<i class="fa-solid ${icon}" style="color: ${color}"></i> ${text}`;
  }

  window.selectHardwarePart = function(partType) {
    playClick();
    
    const partCard = document.querySelector(`.part-card[data-part="${partType}"]`);
    if (partCard && partCard.classList.contains('connected')) return;
    
    document.querySelectorAll('.part-card').forEach(card => card.classList.remove('selected'));
    
    if (partCard) {
      partCard.classList.add('selected');
      selectedPart = partType;
      
      document.querySelectorAll('.hw-slot').forEach(slot => slot.classList.remove('slot-active'));
      const targetSlot = document.getElementById(`slot-${partType}`);
      if (targetSlot) {
        targetSlot.classList.add('slot-active');
      }
      
      updateGameMessage(`تم تحديد ${getPartName(partType)}. الآن اضغط على منفذه الصحيح في اللوحة الأم.`, 'info');
    }
  };

  window.connectHardwarePart = function(slotType) {
    if (!selectedPart) {
      playSynthSound(150, 'square', 0.1, 0.05);
      updateGameMessage('الرجاء اختيار قطعة من صندوق المكونات أولاً!', 'warning');
      return;
    }
    
    if (selectedPart === slotType) {
      playSuccessSound();
      
      const partCard = document.querySelector(`.part-card[data-part="${selectedPart}"]`);
      const slotEl = document.getElementById(`slot-${slotType}`);
      
      if (partCard) partCard.classList.add('connected');
      if (slotEl) {
        slotEl.classList.add('connected');
        slotEl.classList.remove('slot-active');
      }
      
      updateGameMessage(`تم تركيب ${getPartName(selectedPart)} في منفذه الصحيح بنجاح! 🎉`, 'success');
      selectedPart = null;
      
      checkGameCompletion();
    } else {
      playSynthSound(150, 'sawtooth', 0.2, 0.1);
      updateGameMessage('عذراً، هذا ليس المنفذ الصحيح لهذه القطعة. حاول مجدداً!', 'danger');
    }
  };

  function checkGameCompletion() {
    const totalParts = 5;
    const connectedParts = document.querySelectorAll('.part-card.connected').length;
    
    if (connectedParts === totalParts) {
      playSuccessSound();
      triggerConfetti();
      
      const task3 = document.getElementById('itb-task-3');
      if (task3 && !task3.checked) {
        task3.checked = true;
        const checklistItem = task3.closest('.checklist-item');
        if (checklistItem) checklistItem.classList.add('completed');
        localStorage.setItem('itb-task-3', 'true');
        updateGlobalProgress();
        showFloatingNotification('محاكي التجميع اكتمل! تم تسجيل المهمة وحصلت على +10 XP! 🛠️🎉');
      }
      
      updateGameMessage('تهانينا! لقد قمت بتجميع كافة مكونات الحاسوب بنجاح! 🖥️✨', 'success');
    }
  }

  function initPCGame() {
    const task3Passed = localStorage.getItem('itb-task-3') === 'true';
    if (task3Passed) {
      document.querySelectorAll('.part-card').forEach(card => card.classList.add('connected'));
      document.querySelectorAll('.hw-slot').forEach(slot => {
        slot.classList.add('connected');
        slot.classList.remove('slot-active');
      });
      updateGameMessage('لقد قمت بتجميع الحاسوب بنجاح مسبقاً! 🖥️✨', 'success');
    }
  }

  window.startPhaseExam = function(phaseNum) {
    window.startExam(phaseNum);
  };

  // Run initial roadmap update
  updateRoadmap();

  // Initialize PC Game state
  initPCGame();

  // Generate initial study planner on load
  generateStudyPlanCalendar();
  
  // Render commands finder on load
  if (typeof renderCommands === 'function') renderCommands();
});
