document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('caseSolutionForm');
    const showResultBtn = document.getElementById('showResultBtn');
    const createNewTicketBtn = document.getElementById('createNewTicketBtn');
    const copyResultBtn = document.getElementById('copyResultBtn');
    const resultContent = document.getElementById('resultContent');
    const copyToast = document.getElementById('copyToast');
    const alertToast = document.getElementById('alertToast');

    const warningModal = document.getElementById('warningModal');
    const closeWarningModalBtn = document.getElementById('closeWarningModalBtn');

    const welcomeModal = document.getElementById('welcomeModal');
    const startTimerBtn = document.getElementById('startTimerBtn');
    const holdTimeInput = document.getElementById('holdTimeInput');

    const timerDisplay = document.getElementById('timerDisplay');
    const introScreen = document.getElementById('intro-screen'); // Intro screen element
    const introLogo = document.querySelector('.intro-logo-spin'); // Logo inside intro
    const loadingBar = document.querySelector('.loading-bar'); // Loading bar inside intro
    const persistentLogoContainer = document.getElementById('persistent-logo-container'); // Persistent logo container
    const mainContent = document.querySelector('.main-content'); 
    const footer = document.querySelector('.footer'); 

    let timerInterval;
    let timeRemaining;

    
    const alertSound = new Audio('https://www.soundjay.com/buttons/beep-07.mp3'); 

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
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
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
                timerDisplay.classList.remove('active');
                showToast(alertToast, 20000);
                
                alertSound.play().catch(e => {
                    console.error("Audio play failed:", e);
                });
            }
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        timerDisplay.classList.remove('active');
    }

    function generateResult() {
        const formData = new FormData(form);
        let resultHtml = '<ul>'; 

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
            return;
        }

        for (const [key, value] of formData.entries()) {
            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            resultHtml += `<li><strong>${formattedKey}:</strong> ${value || 'N/A'}</li>`;
        }
        resultHtml += '</ul>';

        // START OF MODIFICATION: Removed or commented out the conclusion logic
        // let conclusion = ""; 
        // const riskLabel = document.getElementById('riskLabel').value;
        // const refund = document.getElementById('refund').value;
        // const compensation = document.getElementById('compensation').value;
        // const evidence = document.getElementById('evidence').value;
        // const foodPhotoMeetsStandard = document.getElementById('foodPhotoMeetsStandard').value;

        // if (riskLabel.includes("Red") || riskLabel.includes("Purple") || foodPhotoMeetsStandard === "No") {
        //     conclusion = `<p><strong>Conclusion:</strong> This case requires special attention due to ${riskLabel.includes("Red") ? '<span class="red-highlight">Red</span>' : ''}${riskLabel.includes("Purple") ? '<span class="purple-highlight">Purple</span>' : ''} risk or poor photo evidence. Customer solution: ${refund} and Compensation: ${compensation}. Further investigation might be needed.</p>`;
        // } else if (evidence === "Clear") {
        //     conclusion = `<p><strong>Conclusion:</strong> This case appears to be standard. Customer solution: ${refund} and Compensation has been proposed. Provided evidence meets required standards.</p>`;
        // } else {
        //     conclusion = `<p><strong>Conclusion:</strong> Further assessment is needed. Customer solution: ${refund} and Compensation: ${compensation}.</p>`;
        // }

        let finalContent = resultHtml; // Only include resultHtml

        // These replacements are left in case you want to apply colors to "Red" or "Purple" if they appear in other fields
        finalContent = finalContent.replace(/(?<!>)Red(?!<)/g, '<span class="red-highlight">Red</span>');
        finalContent = finalContent.replace(/(?<!>)Purple(?!<)/g, '<span class="purple-highlight">Purple</span>');

        // END OF MODIFICATION

        resultContent.innerHTML = finalContent;
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

    function showModal(modalElement) {
        modalElement.classList.add('show-modal');
    }

    function hideModal(modalElement) {
        modalElement.classList.remove('show-modal');
    }

    // --- Intro Logic ---
    function initializeIntro() {
        // Ensure main content is hidden initially
        mainContent.classList.add('hidden');
        persistentLogoContainer.classList.add('hidden');
        footer.classList.add('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling during intro

        // Start intro animations
        const introAnimationDuration = 1500; // 1.5 seconds
        const introFadeOutDuration = 1000; // 1 second (from CSS transition)
        const totalIntroDuration = introAnimationDuration + introFadeOutDuration;

        // After intro animations complete, start fade out
        setTimeout(() => {
            introScreen.classList.add('fade-out');
            
            introScreen.addEventListener('transitionend', function handleTransitionEnd() {
                introScreen.remove(); // Remove intro screen from DOM
                
                // Show main content and persistent logo
                persistentLogoContainer.classList.remove('hidden');
                persistentLogoContainer.classList.add('show-block');
                
                mainContent.classList.remove('hidden');
                mainContent.classList.add('show-block');
                
                footer.classList.remove('hidden');
                footer.classList.add('show-block');
                
                document.body.style.overflow = ''; // Allow scrolling
                showModal(welcomeModal); // Show welcome modal after intro
                introScreen.removeEventListener('transitionend', handleTransitionEnd);
            }, { once: true });
        }, introAnimationDuration);

        // Preload sound for faster playback when needed
        alertSound.volume = 0;
        alertSound.play().then(() => {
            alertSound.pause();
            alertSound.currentTime = 0;
            alertSound.volume = 1;
        }).catch(e => {
            console.error("Silent audio play failed to enable autoplay:", e);
        });
    }

    // Call initializeIntro when DOM is ready
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
            document.body.style.overflow = ''; // Re-enable scrolling after welcome modal is closed
        } else {
            alert("Please enter a valid time (minutes > 0).");
        }
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
        
        stopTimer();
        
        // Show welcome modal again to set new timer
        holdTimeInput.value = '3';
        startTimerBtn.disabled = false;
        showModal(welcomeModal);
        document.body.style.overflow = 'hidden'; // Keep body non-scrollable while welcome modal is open
    });

    copyResultBtn.addEventListener('click', copyResultToClipboard);

    generateResult();
});