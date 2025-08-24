let songs = [
  { title: "Bahon mein chale Aao", artist: "Lata Mangeshkar", file: "/songs/baahon-men-chale-aao-4k-lata-mangeshkar-romantic-song-sanjeev-kumar-jaya-bachchan-anamika-128-ytshorts.savetube.me.mp3", image: "/images/cover page10.jpg", favorite: false },
  { title: "Tu Shayar Hai", artist: "Alka Yagnik", file: "songs/alka-yagnik-tu-shayar-hain-main-teri-shayari-4k-video-madhuri-dixit-nadeem-shravan-songs-128-ytshorts.savetube.me.mp3", image: "/images/cover page 9.jpg", favorite: false },
  { title: "Ye Mere Humsafar", artist: "Alka Yagnik", file: "songs/aye-mere-humsafar-full-song-qayamat-se-qayamat-tak-udit-n-alka-y-aamir-khan-juhi-chawla-128-ytshorts.savetube.me.mp3", image: "/images/cover page8.jpg", favorite: false },
  { title: "Chori Chori", artist: "Alka Yagnik", file: "songs/chori-chori-chupke-se-lucky-no-time-for-love-salman-khan-sneha-ulaal-adnan-sami-128-ytshorts.savetube.me.mp3", image: "/images/cover page7.jpg", favorite: false },
  { title: "Dekha Ek Khawab", artist: "Lata Mangeshkar", file: "songs/dekha-ek-khawab-lyrics-silsila-kishore-kumar-and-lata-mangeshkar-lyrical-music-128-ytshorts.savetube.me.mp3", image: "/images/cover page6.jpg", favorite: false },
  { title: "Dekhne Walo Ne", artist: "Udit Narayan", file: "songs/dekhne-vaalon-ne-kyaa-kyaa-dekhne-waalon-ne-chori-chori-chupke-chupke-udit-narayan-alka-yagnik-128-ytshorts.savetube.me.mp3", image: "/images/cover page5.jpg", favorite: false },
  { title: "Jadu Teri Nazar", artist: "Udit Narayan", file: "songs/jaadu-teri-nazar-song-darr-shah-rukh-khan-juhi-chawla-udit-narayan-shiv-hari-anand-bakshi-128-ytshorts.savetube.me.mp3", image: "/images/cover page 4.jpg", favorite: false },
  { title: "jawani Janeman", artist: "Aasha Bhosale", file: "songs/jawani-janeman-lyrical-asha-bhosle-amitabh-bachan-smita-patil-namak-halaal-128-ytshorts.savetube.me.mp3", image: "/images/cover page 3.jpg", favorite: false },
  { title: "Maar Daala", artist: "Kavita Krishnamurthy", file: "songs/maar-daala-from-devdas-128-ytshorts.savetube.me.mp3", image: "/images/Cover page 2.jpg", favorite: false },
  { title: "Tip tip barsa", artist: "Alka Yagnik", file: "songs/tip-tip-barsa-paani-4k-akshay-kumar-raveena-tandon-mohra-1994-udit-narayan-superhit-song-128-ytshorts.savetube.me.mp3", image: "/images/Cover page 1.jpg", favorite: false }
];

let currentIndex = 0;
let audio = new Audio();
let recentlyPlayed = JSON.parse(localStorage.getItem('recentlyPlayed')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

const albumArt = document.getElementById('album-art');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const seekBar = document.getElementById('seek-bar');
const volumeBar = document.getElementById('volume-bar');
const currentTimeEl = document.getElementById('current-time');
const totalDurationEl = document.getElementById('total-duration');
const playlistEl = document.getElementById('playlist').querySelector('ul');
const recentlyPlayedEl = document.getElementById('recently-played').querySelector('ul');
const favoritesEl = document.getElementById('favorites').querySelector('ul');
const searchBar = document.getElementById('search-bar');
const voiceSearchBtn = document.getElementById('voice-search');

let isShuffle = false;
let isRepeat = false;

// Initialize
displayPlaylist(songs);
loadSong(currentIndex);
displayRecentlyPlayed();
displayFavorites();

// Load song
function loadSong(index) {
  const song = songs[index];
  audio.src = song.file;
  albumArt.src = song.image;
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  updateRecentlyPlayed(song);
  updatePlaylistHighlight(); // highlight current song in playlist
}

function updatePlaylistHighlight() {
  const listItems = playlistEl.querySelectorAll('li');
  listItems.forEach((li, idx) => {
    if(idx === currentIndex) li.classList.add('active');
    else li.classList.remove('active');
  });
}


// Play / Pause
playBtn.addEventListener('click', () => {
  if(audio.paused) {
    audio.play();
    playBtn.textContent = '❚❚';
    albumArt.classList.add('playing');
  } else {
    audio.pause();
    playBtn.textContent = '▶';
    albumArt.classList.remove('playing');
  }
});

// Next / Previous
// Next Button
nextBtn.addEventListener('click', () => {
  if(songs.length === 0) return;
  currentIndex = (currentIndex + 1) % songs.length; // wrap around
  loadSong(currentIndex);
  audio.play().catch(err => console.error("Audio play failed:", err));
});

// Previous Button
prevBtn.addEventListener('click', () => {
  if(songs.length === 0) return;
  currentIndex = (currentIndex - 1 + songs.length) % songs.length; // wrap around safely
  loadSong(currentIndex);
  audio.play().catch(err => console.error("Audio play failed:", err));
});



// Shuffle & Repeat
shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleBtn.style.color = isShuffle ? '#1db954' : '#fff';
});

repeatBtn.addEventListener('click', () => {
  isRepeat = !isRepeat;
  repeatBtn.style.color = isRepeat ? '#1db954' : '#fff';
});

// Update Seek Bar
audio.addEventListener('timeupdate', () => {
  seekBar.value = (audio.currentTime / audio.duration) * 100 || 0;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  totalDurationEl.textContent = formatTime(audio.duration);
});

seekBar.addEventListener('input', () => {
  audio.currentTime = (seekBar.value / 100) * audio.duration;
});

// Volume control
volumeBar.addEventListener('input', () => {
  audio.volume = volumeBar.value;
});

// Playlist display
function displayPlaylist(songsArray) {
  const ul = playlistEl; // already points to <ul>
  ul.innerHTML = '';     // clear current list

  songsArray.forEach((song, index) => {
    const li = document.createElement('li');

    li.innerHTML = `
      <span>${song.title} - ${song.artist}</span>
      <button class="favorite-btn ${song.favorite ? 'active' : ''}">❤</button>
    `;

    // Click on song to play
    li.addEventListener('click', (e) => {
      if (e.target.classList.contains('favorite-btn')) {
        toggleFavorite(index, e.target);
        return; // don't play song when clicking heart
      }
      currentIndex = index;
      loadSong(index);
      audio.play();
    });

    ul.appendChild(li);
  });

  highlightCurrentSong();
}


// Recently played
function updateRecentlyPlayed(song) {
  recentlyPlayed = recentlyPlayed.filter(s => s.title !== song.title);
  recentlyPlayed.unshift(song);
  if(recentlyPlayed.length > 10) recentlyPlayed.pop();
  localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
  displayRecentlyPlayed();
}

function displayRecentlyPlayed() {
  recentlyPlayedEl.innerHTML = '';
  recentlyPlayed.forEach(song => {
    const li = document.createElement('li');
    li.textContent = `${song.title} - ${song.artist}`;
    recentlyPlayedEl.appendChild(li);
  });
}

// Favorites
function toggleFavorite(index, btnEl) {
  songs[index].favorite = !songs[index].favorite;
  favorites = songs.filter(s => s.favorite);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  displayFavorites();
  btnEl.classList.toggle('active');
}

function displayFavorites() {
  favoritesEl.innerHTML = '';
  favorites.forEach(song => {
    const li = document.createElement('li');
    li.textContent = `${song.title} - ${song.artist}`;
    favoritesEl.appendChild(li);
  });
}

// Search
searchBar.addEventListener('input', () => {
  const term = searchBar.value.toLowerCase();
  const filtered = songs.filter(s => s.title.toLowerCase().includes(term));
  displayPlaylist(filtered);
});

// Voice Search
voiceSearchBtn.addEventListener('click', () => {
  // Use browser-supported SpeechRecognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("⚠️ Your browser does not support voice recognition. Please use Google Chrome.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  // Button feedback
  voiceSearchBtn.textContent = "🎙️ Listening...";
  voiceSearchBtn.disabled = true;

  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log("🎤 Heard:", transcript);
    searchBar.value = transcript;
    searchBar.dispatchEvent(new Event('input')); // trigger search
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    alert("❌ Voice recognition failed: " + event.error);
  };

  recognition.onend = () => {
    // Reset mic button
    voiceSearchBtn.textContent = "🎤";
    voiceSearchBtn.disabled = false;
  };
});



// Format time
function formatTime(time) {
  if(!time) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// Auto play next song
audio.addEventListener('ended', playNextSong);

function playNextSong() {
  if(isRepeat){
    loadSong(currentIndex);
    audio.play();
    return;
  }
  if(isShuffle){
    currentIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentIndex = (currentIndex + 1) % songs.length;
  }
  loadSong(currentIndex);
  audio.play();
}

// Highlight current song in playlist
function highlightCurrentSong(){
  const lis = playlistEl.querySelectorAll('li');
  lis.forEach((li, i)=>{
    li.classList.toggle('active', i===currentIndex);
  });
}
