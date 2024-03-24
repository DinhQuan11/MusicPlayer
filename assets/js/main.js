const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const container = $(".container");
const title = $(".title");
const singer = $(".singer");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const shuffle = $(".btn-shuffle");
const backward = $(".btn-backward");
const forward = $(".btn-forward");
const repeat = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isShuffle: false,
  isRepeat: false,
  songs: [
    {
      name: "Chúng Ta Của Tương Lai",
      singer: "Sơn Tùng M-TP",
      path: "./assets/music/song1.mp3",
      image: "./assets/imgs/song1.png",
    },
    {
      name: "Drag Me Down",
      singer: "One Direction",
      path: "./assets/music/song2.mp3",
      image: "./assets/imgs/song2.png",
    },
    {
      name: "Dusk Till Dawn",
      singer: "ZAYN, Sia",
      path: "./assets/music/song3.mp3",
      image: "./assets/imgs/song3.png",
    },
    {
      name: "Mercy",
      singer: "Shawn Mendes",
      path: "./assets/music/song4.mp3",
      image: "./assets/imgs/song4.png",
    },
    {
      name: "Shivers",
      singer: "Ed Sheeran",
      path: "./assets/music/song5.mp3",
      image: "./assets/imgs/song5.png",
    },
    {
      name: "Watermelon Sugar",
      singer: "Harry Styles",
      path: "./assets/music/song6.mp3",
      image: "./assets/imgs/song6.png",
    },
    {
      name: "When I Was Your Man",
      singer: "Bruno Mars",
      path: "./assets/music/song7.mp3",
      image: "./assets/imgs/song7.png",
    },
    {
      name: "Anh Đếch Cần Gì Ngoài Em",
      singer: "Đen, Thành Đồng, Vũ.",
      path: "./assets/music/song8.mp3",
      image: "./assets/imgs/song8.png",
    },
    {
      name: "Cheating on You",
      singer: "Charlie Puth",
      path: "./assets/music/song9.mp3",
      image: "./assets/imgs/song9.png",
    },
    {
      name: "Confirmation",
      singer: "Justin Bieber",
      path: "./assets/music/song10.mp3",
      image: "./assets/imgs/song10.png",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${
          index === this.currentIndex ? "active" : ""
        }" data-index = "${index}">
        <div
            class="thumb"
            style="
            background-image: url('${song.image}');
            "
        ></div>
        <div class="body">
            <h3 class="body-title">${song.name}</h3>
            <p class="body-singer">${song.singer}</p>
        </div>
        <div class="option">
            <i class="fa-solid fa-ellipsis"></i>
        </div>
        </div>
      `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;

    const cdWidth = cd.offsetWidth;

    // Xử lý thu phóng CD
    document.onscroll = function () {
      const scrollTop = window.scrollY; // document.documentElement.scrollTop
      const newCdWidth = cdWidth - scrollTop;

      if (newCdWidth > 0) {
        cd.style.width = newCdWidth + "px";
        cd.style.opacity = newCdWidth / cdWidth;
      } else {
        cd.style.width = 0;
      }
    };

    // Xử lý click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi song được play
    audio.onplaying = function () {
      _this.isPlaying = true;
      container.classList.add("playing");
    };

    // Khi song được pause
    audio.onpause = function () {
      _this.isPlaying = false;
      container.classList.remove("playing");
    };

    // Xử lý cho nút tua chạy
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 1000
        );
        progress.value = progressPercent;
      }
    };

    // Xử lý tua bài hát
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 1000) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Xử lý bật tắt shuffle
    shuffle.onclick = function () {
      _this.isShuffle = !_this.isShuffle;
      shuffle.classList.toggle("active", _this.isShuffle);
    };

    // Xử lý next song
    forward.onclick = function () {
      if (_this.isShuffle) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
    };

    // Xử lý previous song
    backward.onclick = function () {
      if (_this.isShuffle) {
        _this.randomSong();
      } else {
        _this.previousSong();
      }
      audio.play();
      _this.render();
    };

    // Xử lý bật tắt repeat
    repeat.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeat.classList.toggle("active", _this.isRepeat);
    };

    // Xử lý khi end song
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        forward.click();
      }
    };

    // Lắng nghe hành vi click vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".option")) {
        // Xử lý khi click vào song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
        // Xử lý khi click vào option
      }
    };
  },
  loadCurrentSong: function () {
    title.textContent = this.currentSong.name;
    singer.textContent = this.currentSong.singer;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  randomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  previousSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  start: function () {
    // Định nghĩa các thuộc tính cho object
    this.defineProperties();

    // Lắng nghe và xử lý các sự kiện (DOM event)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên bào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Render playlíst
    this.render();
  },
};

app.start();
