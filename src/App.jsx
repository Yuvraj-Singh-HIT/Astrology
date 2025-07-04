// App.jsx
import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const zodiacSigns = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

const translations = {
  en: {
    title: '🖐️Virtual Palm Reader',
    subtitle: 'AI-powered reader!',
    enterName: 'Enter Your Name',
    selectSign: 'Select Zodiac Sign',
    startCamera: '📷 Start Camera',
    stopCamera: '📴 Stop Camera',
    startDetect: '🔍 Start Detection',
    stopDetect: '⏹️ Stop Detection',
    resultsTitle: '🔮 Your Prediction:',
    switch: 'বাংলা',
    footer: 'Made with love and devotion ❤️ 2025',
  },
  bn: {
    title: '🖐️ভার্চুয়াল তালু পাঠক',
    subtitle: 'এআই ভিত্তিক তালু ও জ্যোতিষ পাঠক!',
    enterName: 'আপনার নাম লিখুন',
    selectSign: 'রাশি চিহ্ন নির্বাচন করুন',
    startCamera: '📷 ক্যামেরা চালু করুন',
    stopCamera: '📴 ক্যামেরা বন্ধ করুন',
    startDetect: '🔍 শনাক্তকরণ শুরু করুন',
    stopDetect: '⏹️ বন্ধ করুন',
    resultsTitle: '🔮 আপনার ভবিষ্যদ্বাণী:',
    switch: 'English',
    footer:
      'ফুলের শঙ্গে প্রজাপতি, চাঁদের শঙ্গে তারা — এই ওয়েবসাইট বানানো হয়েছে ভালোবাসা আর ভক্তি দ্বারা ❤️.২০২৫',
  },
};

const readingOptions = {
  health: [
    'You are energetic today.',
    'Take care of your sleep.',
    'Your mind is at peace.',
  ],
  love: [
    'Someone admires you.',
    'You’ll meet someone new.',
    'Love is in the air.',
  ],
  career: [
    'A new opportunity is near.',
    'Patience brings success.',
    'Teamwork helps.',
  ],
  education: [
    'Study focus is strong.',
    'Great time to learn.',
    'Creative thinking today.',
  ],
};

const readingOptionsBn = {
  health: ['আজ আপনি অনেক এনার্জেটিক।', 'ঘুমের যত্ন নিন।', 'আপনার মন শান্ত।'],
  love: [
    'কারো মন পড়ে আছে আপনার উপর।',
    'নতুন কাউকে চিনবেন।',
    'ভালোবাসা ঘিরে রয়েছে।',
  ],
  career: ['নতুন সুযোগ আসছে।', 'ধৈর্য ফল দেবে।', 'টিমওয়ার্কে সফলতা।'],
  education: [
    'পড়াশোনায় মনোযোগ ভালো।',
    'নতুন কিছু শিখুন।',
    'সৃজনশীল ভাবনা কাজ করবে।',
  ],
};

const App = () => {
  const [lang, setLang] = useState('en');
  const t = translations[lang];

  const [name, setName] = useState('');
  const [sign, setSign] = useState('');
  const [result, setResult] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const generateIndex = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const getPrediction = () => {
    const base = name.toLowerCase() + sign;
    const idx = generateIndex(base);
    const pool = lang === 'en' ? readingOptions : readingOptionsBn;
    const pick = (arr) => arr[idx % arr.length];
    setResult({
      love: pick(pool.love),
      career: pick(pool.career),
      education: pick(pool.education),
      health: pick(pool.health),
    });
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setHasPermission(true);
      }
    } catch (err) {
      alert('Camera access denied or not available.');
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setHasPermission(false);
      setIsDetecting(false);
    }
  };

  const detectPalm = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);
    const mock = Math.random() > 0.3;

    if (mock) {
      const x = Math.random() * (canvas.width - 150);
      const y = Math.random() * (canvas.height - 150);
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, 150, 150);
      ctx.fillStyle = '#00ff00';
      ctx.fillText('Palm Detected', x, y - 10);
      getPrediction();
    } else {
      setResult(null);
    }
  };

  useEffect(() => {
    let interval;
    if (isDetecting && hasPermission) {
      interval = setInterval(detectPalm, 1500);
    }
    return () => clearInterval(interval);
  }, [isDetecting, hasPermission]);

  return (
    <div className="main">
      <div className="stars"></div>
      <div className="card">
        <div className="top-bar">
          <button
            className="lang-btn"
            onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
          >
            {t.switch}
          </button>
        </div>
        <h1 className="title">{t.title}</h1>
        <p className="subtitle">{t.subtitle}</p>

        <div className="form-section">
          <input
            className="text-input"
            placeholder={t.enterName}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            className="select-input"
            value={sign}
            onChange={(e) => setSign(e.target.value)}
          >
            <option value="">{t.selectSign}</option>
            {zodiacSigns.map((z, i) => (
              <option key={i} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>

        <div className="video-wrap">
          <video ref={videoRef} autoPlay muted className="video" />
          <canvas ref={canvasRef} className="canvas" />
        </div>

        <div className="btn-wrap">
          {!hasPermission ? (
            <button className="btn" onClick={startCamera}>
              {t.startCamera}
            </button>
          ) : (
            <>
              <button
                className="btn"
                onClick={() => setIsDetecting(!isDetecting)}
              >
                {isDetecting ? t.stopDetect : t.startDetect}
              </button>
              <button className="btn" onClick={stopCamera}>
                {t.stopCamera}
              </button>
            </>
          )}
        </div>

        {result && (
          <div className="result-box">
            <h3>{t.resultsTitle}</h3>
            <ul>
              <li>💖 Love: {result.love}</li>
              <li>💼 Career: {result.career}</li>
              <li>📚 Education: {result.education}</li>
              <li>🩺 Health: {result.health}</li>
            </ul>
          </div>
        )}

        <p className="footer">{t.footer}</p>
      </div>
    </div>
  );
};

export default App;
