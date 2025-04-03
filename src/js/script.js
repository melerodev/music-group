// Funciones de utilidad
function formatTime(time) {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
}

document.addEventListener("DOMContentLoaded", () => {
  // Menú móvil
  const menuToggle = document.getElementById("menu-toggle")
  const mobileMenu = document.getElementById("mobile-menu")
  const navbar = document.getElementById("navbar")

  menuToggle.addEventListener("click", function () {
    this.classList.toggle("active")
    mobileMenu.classList.toggle("active")
  })
  

  document.getElementById("current-year").textContent = new Date().getFullYear()

  // Navegación con scroll
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link, .scroll-down, .footer a[href^="#"]')

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        // Cerrar menú móvil si está abierto
        menuToggle.classList.remove("active")
        mobileMenu.classList.remove("active")

        // Scroll suave
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        })
      }
    })
  })

  // Cambiar estilo de navbar al hacer scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // Inicializar carrusel de discografía
  initDiscographyCarousel()

  // Inicializar reproductor de audio
  initAudioPlayer()
})

function initDiscographyCarousel() {
  const carouselTrack = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  let currentIndex = 0;
  const slides = document.querySelectorAll(".album-slide");
  const totalSlides = slides.length;

  function updateCarousel() {
    const slideWidth = slides[0].clientWidth;
    carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }

  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);

  window.addEventListener("resize", updateCarousel);
}

function initAudioPlayer() {
  // DOM Elements
  const audioPlayer = document.getElementById("audio-player");
  const playBtn = document.getElementById("play-btn");
  const prevBtn = document.getElementById("prev-track-btn");
  const nextBtn = document.getElementById("next-track-btn");
  const volumeSlider = document.getElementById("volume-slider");
  const muteBtn = document.getElementById("mute-btn");
  const progressBar = document.getElementById("progress");
  const progressContainer = document.getElementById("progress-bar");
  const currentTimeEl = document.getElementById("current-time");
  const durationEl = document.getElementById("duration");
  const trackItems = document.querySelectorAll(".track-item");
  
  // Track data - Replace with actual paths to your audio files
  const tracks = [
    {
      title: "Livin' on a Prayer",
      album: "Slippery When Wet",
      duration: "4:09",
      src: "assets/audio/livin_on_a_prayer.mp3" 
    },
    {
      title: "It's My Life",
      album: "Crush",
      duration: "3:44",
      src: "assets/audio/its_my_life.mp3"
    },
    {
      title: "Bed of Roses",
      album: "Keep the Faith",
      duration: "6:34",
      src: "assets/audio/bed_of_roses.mp3"
    },
    {
      title: "Always",
      album: "Cross Road",
      duration: "5:53",
      src: "assets/audio/always.mp3"
    },
    {
      title: "Runaway",
      album: "Bon Jovi",
      duration: "3:50",
      src: "assets/audio/runaway.mp3"
    }
  ];
  
  // State
  let currentTrackIndex = 0;
  let isPlaying = false;
  let previousVolume = 0.7;
  
  // Initialize
  function init() {
    // Set initial volume
    audioPlayer.volume = volumeSlider.value;
    
    // Load first track
    loadTrack(currentTrackIndex);
    
    // Add event listeners
    setupEventListeners();
  }
  
  // Load track
  function loadTrack(index) {
    // Update current track index
    currentTrackIndex = index;
    
    // Set audio source
    audioPlayer.src = tracks[index].src;
    
    // Update active track in UI
    updateActiveTrack();
    
    // Reset progress
    resetProgress();
    
    // If was playing before track change, play the new track
    if (isPlaying) {
      playAudio();
    }
  }
  
  // Play/Pause toggle
  function togglePlay() {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }
  
  // Play audio
  function playAudio() {
    audioPlayer.play().catch(error => {
      console.error("Error playing audio:", error);
      // Fallback for browsers that require user interaction
      if (error.name === "NotAllowedError") {
        console.log("Please interact with the page to enable audio playback");
      }
    });
    
    isPlaying = true;
    updatePlayButton();
  }
  
  // Pause audio
  function pauseAudio() {
    audioPlayer.pause();
    isPlaying = false;
    updatePlayButton();
  }
  
  // Next track
  function nextTrack() {
    const newIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(newIndex);
  }
  
  // Previous track
  function prevTrack() {
    const newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(newIndex);
  }
  
  // Update play button UI
  function updatePlayButton() {
    const playIcon = playBtn.querySelector(".play-icon");
    const pauseIcon = playBtn.querySelector(".pause-icon");
    
    if (isPlaying) {
      playIcon.classList.add("hidden");
      pauseIcon.classList.remove("hidden");
    } else {
      playIcon.classList.remove("hidden");
      pauseIcon.classList.add("hidden");
    }
  }
  
  // Update active track in UI
  function updateActiveTrack() {
    trackItems.forEach((item, index) => {
      if (index === currentTrackIndex) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }
  
  // Update progress bar
  function updateProgress() {
    if (audioPlayer.duration) {
      const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      progressBar.style.width = `${progressPercent}%`;
      
      // Update time displays
      currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
      durationEl.textContent = formatTime(audioPlayer.duration);
    }
  }
  
  // Reset progress
  function resetProgress() {
    progressBar.style.width = "0%";
    currentTimeEl.textContent = "0:00";
    
    // Set duration from track data if available
    const durationStr = tracks[currentTrackIndex].duration;
    durationEl.textContent = durationStr;
  }
  
  // Set progress when user clicks on progress bar
  function setProgress(e) {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    
    if (duration) {
      audioPlayer.currentTime = (clickX / width) * duration;
    }
  }
  
  // Toggle mute
  function toggleMute() {
    if (audioPlayer.volume > 0) {
      previousVolume = audioPlayer.volume;
      audioPlayer.volume = 0;
      volumeSlider.value = 0;
      muteBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M23 9L17 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M17 9L23 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      `;
    } else {
      audioPlayer.volume = previousVolume;
      volumeSlider.value = previousVolume;
      muteBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 22 12C22 14.6522 20.9464 17.1957 19.0711 19.0711" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      `;
    }
  }
  
  // Set up all event listeners
  function setupEventListeners() {
    // Play/Pause button
    playBtn.addEventListener("click", togglePlay);
    
    // Next/Previous buttons
    nextBtn.addEventListener("click", nextTrack);
    prevBtn.addEventListener("click", prevTrack);
    
    // Volume slider
    volumeSlider.addEventListener("input", () => {
      audioPlayer.volume = volumeSlider.value;
      
      // Update mute button if volume is changed
      if (audioPlayer.volume > 0) {
        muteBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 22 12C22 14.6522 20.9464 17.1957 19.0711 19.0711" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        `;
      } else {
        muteBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M23 9L17 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M17 9L23 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        `;
      }
    });
    
    // Mute button
    muteBtn.addEventListener("click", toggleMute);
    
    // Progress bar
    progressContainer.addEventListener("click", setProgress);
    
    // Audio events
    audioPlayer.addEventListener("timeupdate", updateProgress);
    audioPlayer.addEventListener("ended", nextTrack);
    
    // Track selection
    trackItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        if (index !== currentTrackIndex) {
          loadTrack(index);
          playAudio();
        } else {
          togglePlay();
        }
      });
    });
    
    // Keyboard controls
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowRight") {
        nextTrack();
      } else if (e.code === "ArrowLeft") {
        prevTrack();
      }
    });
  }
  
  // Initialize the player
  init();
}