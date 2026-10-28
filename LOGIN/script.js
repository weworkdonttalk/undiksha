/**
 * NUSAVA - Interactive Scripts (Vanilla ES6+)
 * Handles DOM manipulation, password visibility toggle, validation,
 * smooth 60fps parallax micro-interactions, and idle states.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. Element References
  // =========================================================================
  const passwordInput = document.getElementById('passwordInput');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const eyeOpenSvg = document.getElementById('eyeOpenSvg');
  const eyeSlashSvg = document.getElementById('eyeSlashSvg');

  const emailInput = document.getElementById('emailInput');
  const emailHelper = document.getElementById('emailHelper');
  const loginForm = document.getElementById('loginForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const btnSpinner = document.getElementById('btnSpinner');

  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  const registerLink = document.getElementById('registerLink');
  const formToast = document.getElementById('formToast');
  const toastMessage = document.getElementById('toastMessage');

  const wayangWrapper = document.querySelector('.wayang-parallax-wrapper');
  const cloudLayer = document.querySelector('.cloud-parallax-layer');

  // =========================================================================
  // 2. Password Visibility Toggle
  // =========================================================================
  if (togglePasswordBtn && passwordInput && eyeOpenSvg && eyeSlashSvg) {
    togglePasswordBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isPassword = passwordInput.getAttribute('type') === 'password';

      if (isPassword) {
        passwordInput.setAttribute('type', 'text');
        eyeOpenSvg.style.display = 'none';
        eyeSlashSvg.style.display = 'block';
        togglePasswordBtn.setAttribute('aria-label', 'Sembunyikan password');
        togglePasswordBtn.setAttribute('title', 'Sembunyikan password');
      } else {
        passwordInput.setAttribute('type', 'password');
        eyeOpenSvg.style.display = 'block';
        eyeSlashSvg.style.display = 'none';
        togglePasswordBtn.setAttribute('aria-label', 'Tampilkan password');
        togglePasswordBtn.setAttribute('title', 'Tampilkan password');
      }

      passwordInput.focus();
    });
  }

  // =========================================================================
  // 3. Smooth Mouse Parallax (Blends with CSS Idle Animations)
  // =========================================================================
  if (wayangWrapper && window.innerWidth >= 1024) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    // Listen for mouse movement across desktop viewport
    window.addEventListener('mousemove', (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // Smooth return to center when mouse leaves window
    document.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });

    // 60fps RequestAnimationFrame damping loop (LERP)
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const updateParallax = () => {
      if (window.innerWidth >= 1024) {
        currentX = lerp(currentX, targetX, 0.05);
        currentY = lerp(currentY, targetY, 0.05);

        // Multi-layered depth displacement:
        // Wayang puppet (Foreground layer - subtle 3D tilt & translation)
        const wayangX = currentX * 16;
        const wayangY = currentY * 10;
        const tiltX = -currentY * 3.0;
        const tiltY = currentX * 3.0;

        wayangWrapper.style.transform = `translate3d(${wayangX}px, ${wayangY}px, 0) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

        // Cloud ornament layer (Background depth layer - gentle drift)
        if (cloudLayer) {
          const cloudX = currentX * 8;
          const cloudY = currentY * 5;
          cloudLayer.style.transform = `translate3d(${cloudX}px, ${cloudY}px, 0)`;
        }
      }

      requestAnimationFrame(updateParallax);
    };

    requestAnimationFrame(updateParallax);
  }

  // =========================================================================
  // 4. Form Validation & Interactive Feedback
  // =========================================================================
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (showError = true) => {
    if (!emailInput) return true;
    const val = emailInput.value.trim();
    if (!val) {
      if (showError) markInputState(emailInput, false, 'Alamat email wajib diisi.');
      return false;
    }
    const isValid = emailRegex.test(val);
    if (!isValid) {
      if (showError) markInputState(emailInput, false, 'Format email tidak valid (contoh: user@gmail.com).');
      return false;
    }
    markInputState(emailInput, true, 'Format email example@gmail.com');
    return true;
  };

  const validatePassword = (showError = true) => {
    if (!passwordInput) return true;
    const val = passwordInput.value;
    if (!val) {
      if (showError) markInputState(passwordInput, false, 'Password wajib diisi.');
      return false;
    }
    if (val.length < 6) {
      if (showError) markInputState(passwordInput, false, 'Password minimal 6 karakter.');
      return false;
    }
    markInputState(passwordInput, true);
    return true;
  };

  const markInputState = (input, isValid, helperMsg = '') => {
    if (isValid) {
      input.classList.remove('is-invalid');
      if (input === emailInput && emailHelper) {
        emailHelper.textContent = helperMsg || 'Format email example@gmail.com';
        emailHelper.style.color = 'var(--color-text-sub)';
      }
    } else {
      input.classList.add('is-invalid');
      if (input === emailInput && emailHelper) {
        emailHelper.textContent = helperMsg;
        emailHelper.style.color = 'var(--color-error)';
      }
    }
  };

  // Realtime validation listeners
  if (emailInput) {
    emailInput.addEventListener('blur', () => validateEmail(true));
    emailInput.addEventListener('input', () => {
      if (emailInput.classList.contains('is-invalid')) {
        validateEmail(false);
      }
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('blur', () => validatePassword(true));
    passwordInput.addEventListener('input', () => {
      if (passwordInput.classList.contains('is-invalid')) {
        validatePassword(false);
      }
    });
  }

  // =========================================================================
  // 5. Form Submission Handling
  // =========================================================================
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isEmailValid = validateEmail(true);
      const isPasswordValid = validatePassword(true);

      if (!isEmailValid || !isPasswordValid) {
        showToast('Mohon lengkapi formulir dengan data yang valid.');
        return;
      }

      // Enter loading state
      setLoadingState(true);

      setTimeout(() => {
        setLoadingState(false);
        showToast(`Selamat datang kembali di NUSAVA!`);
      }, 1200);
    });
  }

  const setLoadingState = (isLoading) => {
    if (!submitBtn) return;
    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.9';
      submitBtn.style.cursor = 'wait';
      if (btnText) btnText.textContent = 'Memproses...';
      if (btnSpinner) btnSpinner.style.display = 'inline-block';
    } else {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.style.cursor = 'pointer';
      if (btnText) btnText.textContent = 'Masuk';
      if (btnSpinner) btnSpinner.style.display = 'none';
    }
  };

  // =========================================================================
  // 6. Toast Notification Helper
  // =========================================================================
  let toastTimeout = null;

  const showToast = (message) => {
    if (!formToast || !toastMessage) return;

    toastMessage.textContent = message;
    formToast.classList.add('is-visible');

    if (toastTimeout) clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
      formToast.classList.remove('is-visible');
    }, 3500);
  };

  // =========================================================================
  // 7. Interactive Secondary Links
  // =========================================================================
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Tautan pemulihan password akan dikirim ke email terdaftar.');
    });
  }

  if (registerLink) {
    registerLink.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Pendaftaran akun baru NUSAVA akan segera dibuka.');
    });
  }
});
