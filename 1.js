console.log("Hello World");

let index = 0;

let audioElement = new Audio("songs/1.mp3");

let masterplay = document.getElementById("masterplay");
let myprogressbar = document.getElementById("myprogressbar");
let movebackward = document.getElementById("movebackward");
let moveforward = document.getElementById("moveforward");
let gif = document.getElementById("gif");

let songitems = Array.from(document.getElementsByClassName("songitem"));

let songs = [
  {
    songname: "Salame Ishq",
    filepath: "songs/1.mp3",
    coverpath: "covers/1.jpg",
  },
  { songname: "Tum Hi Ho", filepath: "songs/2.mp3", coverpath: "covers/2.jpg" },
  {
    songname: "Channa Mereya",
    filepath: "songs/3.mp3",
    coverpath: "covers/3.jpg",
  },
  { songname: "Kesariya", filepath: "songs/4.mp3", coverpath: "covers/4.jpg" },
  { songname: "Bekhayali", filepath: "songs/5.mp3", coverpath: "covers/5.jpg" },
  {
    songname: "Raataan Lambiyan",
    filepath: "songs/6.mp3",
    coverpath: "covers/6.jpg",
  },
  {
    songname: "Tera Ban Jaunga",
    filepath: "songs/7.mp3",
    coverpath: "covers/7.jpg",
  },
  { songname: "Hawayein", filepath: "songs/8.mp3", coverpath: "covers/8.jpg" },
  { songname: "Shayad", filepath: "songs/9.mp3", coverpath: "covers/9.jpg" },
  {
    songname: "Agar Tum Saath Ho",
    filepath: "songs/10.mp3",
    coverpath: "covers/10.jpg",
  },
];

// Play a selected song
function playSong(songIndex) {
  index = songIndex;

  audioElement.src = songs[index].filepath;
  audioElement.currentTime = 0;

  audioElement
    .play()
    .then(() => {
      masterplay.classList.remove("fa-circle-play");
      masterplay.classList.add("fa-pause");

      gif.style.opacity = 1;
      makeallplay();

      const currentIcon = document.getElementById(index);

      if (currentIcon) {
        currentIcon.classList.remove("fa-circle-play");
        currentIcon.classList.add("fa-pause");
      }
    })
    .catch((error) => {
      console.log("Unable to play audio:", error);
    });
}

// Update the master play button and selected song icon
function updatePlayIcons(isPlaying) {
  masterplay.classList.toggle("fa-pause", isPlaying);
  masterplay.classList.toggle("fa-circle-play", !isPlaying);

  gif.style.opacity = isPlaying ? 1 : 0;

  makeallplay();

  if (isPlaying) {
    const currentIcon = document.getElementById(index);

    if (currentIcon) {
      currentIcon.classList.remove("fa-circle-play");
      currentIcon.classList.add("fa-pause");
    }
  }
}

// Master play/pause button
masterplay.addEventListener("click", () => {
  if (audioElement.paused) {
    audioElement
      .play()
      .then(() => updatePlayIcons(true))
      .catch((error) => console.log("Playback failed:", error));
  } else {
    audioElement.pause();
    updatePlayIcons(false);
  }
});

// Update progress bar as the song plays
audioElement.addEventListener("timeupdate", () => {
  if (audioElement.duration && Number.isFinite(audioElement.duration)) {
    const progress = (audioElement.currentTime / audioElement.duration) * 100;

    myprogressbar.value = progress;
  }
});

// Seek to a position using the progress bar
myprogressbar.addEventListener("input", () => {
  if (audioElement.duration && Number.isFinite(audioElement.duration)) {
    audioElement.currentTime =
      (myprogressbar.value / 100) * audioElement.duration;
  }
});

// Move backward by 10 seconds
movebackward.addEventListener("click", () => {
  audioElement.currentTime = Math.max(0, audioElement.currentTime - 10);
});

// Move forward by 10 seconds
moveforward.addEventListener("click", () => {
  if (Number.isFinite(audioElement.duration)) {
    audioElement.currentTime = Math.min(
      audioElement.duration,
      audioElement.currentTime + 10,
    );
  }
});

// Reset all individual song icons to play
function makeallplay() {
  Array.from(document.getElementsByClassName("songitemplay")).forEach(
    (element) => {
      element.classList.remove("fa-pause");
      element.classList.add("fa-circle-play");
    },
  );
}

// Set song names and cover images
songitems.forEach((element, i) => {
  if (songs[i]) {
    const img = element.getElementsByTagName("img")[0];
    const name = element.getElementsByClassName("songname")[0];

    if (img) {
      img.src = songs[i].coverpath;
      img.alt = songs[i].songname;
    }

    if (name) {
      name.innerText = songs[i].songname;
    }
  }
});

// Individual song play/pause buttons
Array.from(document.getElementsByClassName("songitemplay")).forEach(
  (element, i) => {
    element.addEventListener("click", () => {
      // Pause if the currently playing song is clicked
      if (index === i && !audioElement.paused) {
        audioElement.pause();
        updatePlayIcons(false);
      } else {
        playSong(i);
      }
    });
  },
);

// Previous song button
document.getElementById("previous").addEventListener("click", () => {
  index = (index - 1 + songs.length) % songs.length;
  playSong(index);
});

// Next song button
document.getElementById("next").addEventListener("click", () => {
  index = (index + 1) % songs.length;
  playSong(index);
});

// AUTOMATICALLY PLAY NEXT SONG WHEN CURRENT SONG ENDS
audioElement.addEventListener("ended", () => {
  index = (index + 1) % songs.length;
  playSong(index);
});

// Keep icons and GIF synchronized if audio is paused or played elsewhere
audioElement.addEventListener("play", () => {
  updatePlayIcons(true);
});

audioElement.addEventListener("pause", () => {
  updatePlayIcons(false);
});
