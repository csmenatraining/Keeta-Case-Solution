
    
        document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('caseSolutionForm');
            const showResultBtn = document.getElementById('showResultBtn');
            const createNewTicketBtn = document.getElementById('createNewTicketBtn');
            const copyResultBtn = document.getElementById('copyResultBtn');
            const resultContent = document.getElementById('resultContent');
            const userRequestContent = document.getElementById('userRequestContent'); 
            const copyUserRequestBtn = document.getElementById('copyUserRequestBtn'); 
            const copyToast = document.getElementById('copyToast');
            const alertToast = document.getElementById('alertToast'); // هذا التوست لم يعد يُستخدم لتنبيه الوقت

            const warningModal = document.getElementById('warningModal');
            const closeWarningModalBtn = document.getElementById('closeWarningModalBtn');

            const welcomeModal = document.getElementById('welcomeModal');
            const startTimerBtn = document.getElementById('startTimerBtn');
            const holdTimeInput = document.getElementById('holdTimeInput');

            // Get the new button for opening the timer modal
            const openTimerModalBtn = document.getElementById('openTimerModalBtn');

            const timerDisplay = document.getElementById('timerDisplay');
            const introScreen = document.getElementById('intro-screen');
            const introLogo = document.querySelector('.intro-logo-spin');
            const loadingBar = document.querySelector('.loading-bar');
            const persistentLogoContainer = document.getElementById('persistent-logo-container');
            const mainContent = document.querySelector('.main-content'); 
            const footer = document.querySelector('.footer'); 

            // تعريف عناصر النافذة المنبثقة الجديدة لتنبيه انتهاء الوقت
            const timerAlertModal = document.getElementById('timerAlertModal');
            const closeTimerAlertModalBtn = document.getElementById('closeTimerAlertModalBtn');


            let timerInterval;
            let timeRemaining;

            // تهيئة الصوت وتحميله مسبقًا عند بدء تشغيل الصفحة
            const alertSound = new Audio('https://www.soundjay.com/buttons/beep-07.mp3'); 
            
            // محاولة تشغيل الصوت بصمت عند تحميل الصفحة ليتفاعل المتصفح معه
            // هذا يعالج مشكلة سياسة التشغيل التلقائي في المتصفحات
            function initializeAudio() {
                alertSound.volume = 0; // اجعل الصوت صامتاً في البداية
                alertSound.play().then(() => {
                    alertSound.pause(); // أوقف التشغيل فوراً
                    alertSound.currentTime = 0; // أعده إلى البداية
                    alertSound.volume = 1; // أعد مستوى الصوت إلى كامل
                }).catch(e => {
                    console.error("Audio initialization failed:", e);
                    // يمكنك هنا عرض رسالة للمستخدم تطلب منه النقر لتمكين الصوت إذا فشلت التهيئة
                });
            }

            initializeAudio(); // استدعاء الدالة عند تحميل DOM

            // Particles.js initialization
            particlesJS('particles-js', {
                "particles": {
                    "number": {
                        "value": 80,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": ["#00bcd4", "#9c27b0", "#ffffff"]
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 5
                        },
                    },
                    "opacity": {
                        "value": 0.5,
                        "random": false,
                        "anim": {
                            "enable": false,
                            "speed": 1,
                            "opacity_min": 0.1,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 10,
                        "random": true,
                        "anim": {
                            "enable": false,
                            "speed": 1,
                            "size_min": 0.1,
                            "sync": false
                        }
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 150,
                        "color": "#2e3b4a",
                        "opacity": 0.4,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 6,
                        "direction": "none",
                        "random": false,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": false,
                            "rotateX": 600,
                            "rotateY": 1200
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "grab"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "push"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 140,
                            "line_linked": {
                                "opacity": 1
                            }
                        },
                        "bubble": {
                            "distance": 400,
                            "size": 40,
                            "duration": 2,
                            "opacity": 8,
                            "speed": 3
                        },
                        "repulse": {
                            "distance": 200,
                            "duration": 0.4
                        },
                        "push": {
                            "particles_nb": 4
                        },
                        "remove": {
                            "particles_nb": 2
                        }
                    }
                },
                "retina_detect": true
            });

            function formatTime(seconds) {
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
            }

            function startTimer(durationInMinutes) {
                timeRemaining = durationInMinutes * 60;
                if (timeRemaining <= 0) {
                    console.error("Timer duration must be positive.");
                    return;
                }

                timerDisplay.classList.add('active');
                timerDisplay.textContent = formatTime(timeRemaining);

                if (timerInterval) {
                    clearInterval(timerInterval);
                }

                timerInterval = setInterval(() => {
                    timeRemaining--;
                    timerDisplay.textContent = formatTime(timeRemaining);

                    if (timeRemaining <= 0) {
                        clearInterval(timerInterval);
                        timerInterval = null; // تأكد من تصفير الفاصل الزمني عند الانتهاء
                        timerDisplay.classList.remove('active');
                        
                        // هنا يتم استدعاء النافذة المنبثقة بدلاً من التوست
                        showModal(timerAlertModal); 
                        
                        // Play the alert sound
                        alertSound.play().catch(e => {
                            console.error("Audio play failed:", e);
                        });
                    }
                }, 1000);
            }

            function stopTimer() {
                if (timerInterval) {
                    clearInterval(timerInterval);
                    timerInterval = null; // تأكد من تصفير الفاصل الزمني عند الإيقاف
                }
                timerDisplay.classList.remove('active');
            }

            function generateResult() {
                const formData = new FormData(form);
                let resultHtml = '<ul>'; 
                let userRequestValue = ''; 

                let allFieldsFilled = true;
                const requiredFields = Array.from(form.querySelectorAll('[required]'));
                for (const field of requiredFields) {
                    if (field.tagName === 'SELECT' && field.value === "") {
                        allFieldsFilled = false;
                        break;
                    }
                    if (field.tagName === 'INPUT' && field.value.trim() === "") {
                        allFieldsFilled = false;
                        break;
                    }
                }

                if (!allFieldsFilled) {
                    resultContent.innerHTML = '<p>الرجاء تعبئة النموذج والنقر على "إظهار النتيجة" لرؤية التفاصيل.</p>';
                    userRequestContent.innerHTML = '<p>سيظهر طلب العميل هنا.</p>'; 
                    return;
                }

                for (const [key, value] of formData.entries()) {
                    let formattedValue = value || 'N/A';
                    if (key === 'riskLabel') {
                        // تطبيق التلوين على كلمات "Red" و "Purple" في Risk Label
                        formattedValue = formattedValue.replace(/Red/g, '<span class="red-highlight">Red</span>');
                        formattedValue = formattedValue.replace(/Purple/g, '<span class="purple-highlight">Purple</span>');
                    }
                    
                    if (key === 'userRequest') {
                        userRequestValue = formattedValue; 
                    } else {
                        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                        resultHtml += `<li><strong>${formattedKey}:</strong> ${formattedValue}</li>`;
                    }
                }
                resultHtml += '</ul>';

                resultContent.innerHTML = resultHtml;

                userRequestContent.innerHTML = `<ul><li><strong>User Request:</strong> ${userRequestValue}</li></ul>`;
                if (userRequestValue.includes('NON SPECIFIC REQUEST')) {
                    userRequestContent.innerHTML = `<ul><li><strong>User Request:</strong> <span class="red-highlight">${userRequestValue}</span></li></ul>`;
                }
            }

            function showToast(toastElement, duration = 3000) {
                toastElement.classList.add("show");
                if (toastElement.timeoutId) {
                    clearTimeout(toastElement.timeoutId);
                }
                toastElement.timeoutId = setTimeout(function(){ 
                    toastElement.classList.remove("show"); 
                    toastElement.timeoutId = null;
                }, duration);
            }

            async function copyResultToClipboard() {
                const textToCopy = resultContent.innerText;
                try {
                    await navigator.clipboard.writeText(textToCopy);
                    showToast(copyToast);
                } catch (err) {
                    console.error('Failed to copy: ', err);
                    alert('Failed to copy result to clipboard. Please copy manually.');
                }
            }

            // Updated function to copy User Request content without the "User Request:" label
            async function copyUserRequestToClipboard() {
                const userRequestListItem = userRequestContent.querySelector('li');
                let textToCopy = '';

                if (userRequestListItem) {
                    const highlightedSpan = userRequestListItem.querySelector('.red-highlight');
                    if (highlightedSpan) {
                        textToCopy = highlightedSpan.innerText;
                    } else {
                        textToCopy = userRequestListItem.innerText.replace('User Request: ', '').trim();
                    }
                }
                
                try {
                    await navigator.clipboard.writeText(textToCopy);
                    showToast(copyToast); 
                } catch (err) {
                    console.error('Failed to copy User Request: ', err);
                    alert('Failed to copy User Request to clipboard. Please copy manually.');
                }
            }

            function showModal(modalElement) {
                modalElement.classList.add('show-modal');
                // لمنع التمرير (scrolling) في الخلفية عند فتح المودال
                document.body.style.overflow = 'hidden'; 
            }

            function hideModal(modalElement) {
                modalElement.classList.remove('show-modal');
                // لإعادة التمرير في الخلفية بعد إغلاق المودال
                document.body.style.overflow = ''; 
            }

            // --- Intro Logic ---
            function initializeIntro() {
                mainContent.classList.add('hidden');
                persistentLogoContainer.classList.add('hidden');
                footer.classList.add('hidden');
                document.body.style.overflow = 'hidden'; 

                const introAnimationDuration = 1500; 
                const introFadeOutDuration = 1000; 
                const totalIntroDuration = introAnimationDuration + introFadeOutDuration;

                setTimeout(() => {
                    introScreen.classList.add('fade-out');
                    
                    introScreen.addEventListener('transitionend', function handleTransitionEnd() {
                        introScreen.remove(); 
                        
                        persistentLogoContainer.classList.remove('hidden');
                        persistentLogoContainer.classList.add('show-block');
                        
                        mainContent.classList.remove('hidden');
                        mainContent.classList.add('show-block');
                        
                        footer.classList.remove('hidden');
                        footer.classList.add('show-block');
                        
                        document.body.style.overflow = ''; 
                        introScreen.removeEventListener('transitionend', handleTransitionEnd);
                    }, { once: true });
                }, introAnimationDuration);
            }

            initializeIntro();

            // --- End Intro Logic ---

            holdTimeInput.addEventListener('input', () => {
                const minutes = parseInt(holdTimeInput.value);
                startTimerBtn.disabled = !(minutes > 0);
            });

            startTimerBtn.addEventListener('click', () => {
                const duration = parseInt(holdTimeInput.value);
                if (duration > 0) {
                    hideModal(welcomeModal);
                    startTimer(duration);
                    // هنا لا داعي لتعيين overflow لأن hideModal ستقوم بذلك
                } else {
                    alert("Please enter a valid time (minutes > 0).");
                }
            });

            openTimerModalBtn.addEventListener('click', () => {
                showModal(welcomeModal);
            });


            showResultBtn.addEventListener('click', () => {
                if (form.checkValidity()) {
                    generateResult();
                } else {
                    showModal(warningModal);
                }
            });

            closeWarningModalBtn.addEventListener('click', () => {
                hideModal(warningModal);
            });

            warningModal.addEventListener('click', (event) => {
                if (event.target === warningModal) {
                    hideModal(warningModal);
                }
            });
            
            createNewTicketBtn.addEventListener('click', () => {
                form.reset();
                document.getElementById('problemDescription').value = ''; 
                resultContent.innerHTML = '<p>الرجاء تعبئة النموذج والنقر على "إظهار النتيجة" لرؤية التفاصيل.</p>';
                userRequestContent.innerHTML = '<p>سيظهر طلب المستخدم هنا.</p>'; 
                
                stopTimer(); // يوقف أي مؤقت حالي
                
                holdTimeInput.value = '3'; // يعيد قيمة الإدخال إلى 3 دقائق افتراضية
                startTimerBtn.disabled = false; // يفعل زر "Start" في نافذة المؤقت إذا تم فتحها يدويًا
                // تم إزالة استدعاء showModal(welcomeModal) و document.body.style.overflow = 'hidden'; هنا
            });

            copyResultBtn.addEventListener('click', copyResultToClipboard);
            copyUserRequestBtn.addEventListener('click', copyUserRequestToClipboard); 

            // معالجات أحداث لنافذة تنبيه المؤقت الجديدة
            closeTimerAlertModalBtn.addEventListener('click', () => {
                hideModal(timerAlertModal);
            });

            timerAlertModal.addEventListener('click', (event) => {
                if (event.target === timerAlertModal) {
                    hideModal(timerAlertModal);
                }
            });

            generateResult(); 
        });
    
