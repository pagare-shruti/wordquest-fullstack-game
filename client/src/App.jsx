import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'

const WORDS = [
  { word: 'ORBIT', hint: 'A path followed by a planet or satellite.' },
  { word: 'QUEST', hint: 'An adventurous search or journey.' },
  { word: 'PIXEL', hint: 'A tiny dot of color on a screen.' },
  { word: 'DREAM', hint: 'A story your mind tells while you sleep.' },
]

const MAX_ATTEMPTS = 6
const ROW_LENGTH = 5

function Icon({ name, size = 20 }) {
  const paths = {
    spark: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" /></>,
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
    play: <><path d="m8 5 12 7-12 7V5Z" /></>,
    trophy: <><path d="M8 21h8m-4-4v4M7 4h10v6a5 5 0 0 1-10 0V4Z" /><path d="M7 6H4v2a4 4 0 0 0 4 4m9-6h3v2a4 4 0 0 1-4 4" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
    bulb: <><path d="M9 18h6m-5 3h4m-2-18a7 7 0 0 0-4 12.7c.5.4 1 1 1 1.8h6c0-.8.5-1.4 1-1.8A7 7 0 0 0 12 3Z" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
    chart: <><path d="M4 19V5m0 14h17M8 15l4-4 3 2 5-6" /></>,
    back: <><path d="m15 18-6-6 6-6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    crown: <><path d="m3 8 5 4 4-7 4 7 5-4-2 12H5L3 8Z" /></>,
    bolt: <path d="m13 2-3 9h7l-6 11 2-9H6l7-11Z" />,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.5 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.5-3" /></>,
  }

  return (
    <svg
      aria-hidden="true"
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] || paths.spark}
    </svg>
  )
}

function Brand({ compact = false }) {
  return (
    <a className={`brand ${compact ? 'brand-compact' : ''}`} href="#home" aria-label="WordQuest home">
      <span className="brand-mark"><Icon name="spark" size={21} /></span>
      <span>word<span className="brand-accent">quest</span></span>
    </a>
  )
}

function TopBar({ page, onNavigate }) {
  const items = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'game', label: 'Play', icon: 'play' },
    { id: 'leaderboard', label: 'Leaderboard', icon: 'trophy' },
  ]

  return (
    <header className="topbar">
      <Brand />
      <nav className="main-nav" aria-label="Main navigation">
        {items.map((item) => (
          <button
            className={`nav-link ${page === item.id ? 'active' : ''}`}
            key={item.id}
            onClick={() => onNavigate(item.id)}
            type="button"
          >
            <Icon name={item.icon} size={17} />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="profile-chip">
        <div className="avatar">S</div>
        <span>Word Seeker</span>
        <span className="online-dot" />
      </div>
    </header>
  )
}

function SectionHeading({ eyebrow, title, action, onAction }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2>{title}</h2>
      </div>
      {action && (
        <button className="text-button" onClick={onAction} type="button">
          {action}<Icon name="arrow" size={16} />
        </button>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, note, tone }) {
  return (
    <article className={`stat-card ${tone}`}>
      <div className="stat-top">
        <span className="stat-icon"><Icon name={icon} size={19} /></span>
        <span className="stat-note">{note}</span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </article>
  )
}

function HowToPlay() {
  const steps = [
    { number: '01', title: 'Find the word', text: 'A mystery 5-letter word is waiting for you.' },
    { number: '02', title: 'Make a guess', text: 'Type a word and see how close you are.' },
    { number: '03', title: 'Crack the code', text: 'Use the clues to solve it in 6 tries.' },
  ]
  return (
    <section className="how-card">
      <SectionHeading eyebrow="THE QUICK GUIDE" title="How to play" />
      <div className="steps-grid">
        {steps.map((step) => (
          <article className="step-card" key={step.number}>
            <span className="step-number">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function MiniLeaderboard({ onViewAll }) {
  const players = [
    { rank: '01', name: 'LexiLuna', initials: 'LL', score: '2,840', tone: 'gold' },
    { rank: '02', name: 'WordSmith', initials: 'WS', score: '2,510', tone: 'silver' },
    { rank: '03', name: 'you', initials: 'S', score: '1,920', tone: 'bronze', current: true },
  ]

  return (
    <section className="leader-card">
      <SectionHeading eyebrow="THIS WEEK" title="Top players" action="View all" onAction={onViewAll} />
      <div className="mini-players">
        {players.map((player) => (
          <div className={`mini-player ${player.current ? 'current-player' : ''}`} key={player.rank}>
            <span className={`rank ${player.tone}`}>{player.rank}</span>
            <span className={`player-avatar avatar-${player.tone}`}>{player.initials}</span>
            <span className="player-name">{player.name}</span>
            <strong>{player.score}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}

function HomePage({ onStart, onLeaderboard, bestScore, gamesPlayed }) {
  return (
    <main className="page-content home-page" id="home">
      <section className="welcome-banner">
        <div className="welcome-copy">
          <div className="welcome-tag"><span className="tag-dot" /> YOUR DAILY WORD CHALLENGE</div>
          <h1>Words are your<br /><span>superpower.</span></h1>
          <p>Think fast, find the word, and keep your streak alive. Your next great guess starts here.</p>
          <button className="primary-button" onClick={onStart} type="button">
            <Icon name="play" size={18} /> Start playing <Icon name="arrow" size={17} />
          </button>
          <div className="banner-footnote"><span className="avatar-stack"><i>W</i><i>Q</i><i>+</i></span> Join 12,400+ word explorers</div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <span className="floating-star star-a">✦</span>
          <span className="floating-star star-b">✧</span>
          <span className="floating-star star-c">✦</span>
          <div className="hero-tile tile-purple">W</div>
          <div className="hero-tile tile-lavender">O</div>
          <div className="hero-tile tile-pink">R</div>
          <div className="hero-tile tile-yellow">D</div>
          <div className="hero-tile tile-dark">?</div>
          <div className="hero-orb"><Icon name="spark" size={26} /></div>
          <div className="floating-label label-top"><Icon name="bolt" size={15} /> DAILY STREAK</div>
          <div className="floating-label label-bottom"><span className="mini-green-dot" /> YOU&apos;RE ON FIRE!</div>
        </div>
      </section>

      <section className="stats-section">
        <SectionHeading eyebrow="YOUR PROGRESS" title="A little word magic" />
        <div className="stats-grid">
          <StatCard icon="trophy" label="Best score" value={bestScore.toLocaleString()} note="Personal best" tone="stat-violet" />
          <StatCard icon="target" label="Games played" value={gamesPlayed} note="Keep it up" tone="stat-blue" />
          <StatCard icon="bolt" label="Win streak" value="4 days" note="On a roll" tone="stat-gold" />
          <StatCard icon="chart" label="Win rate" value="82%" note="Top 18%" tone="stat-green" />
        </div>
      </section>

      <div className="lower-grid">
        <HowToPlay />
        <MiniLeaderboard onViewAll={onLeaderboard} />
      </div>
    </main>
  )
}

function GuessRow({ guess, solution, active }) {
  return (
    <div className={`guess-row ${active ? 'active-row' : ''}`} aria-label={guess ? `Guess: ${guess}` : active ? 'Current guess' : 'Empty guess'}>
      {Array.from({ length: ROW_LENGTH }, (_, index) => {
        const letter = guess[index] || ''
        let state = ''
        if (guess && solution) {
          if (solution[index] === letter) state = 'correct'
          else if (solution.includes(letter)) state = 'present'
          else state = 'absent'
        }
        return <span className={`letter-tile ${state} ${letter ? 'has-letter' : ''}`} key={index}>{letter}</span>
      })}
    </div>
  )
}

function GameKeyboard({ onKey, submittedGuesses, solution }) {
  const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']
  const stateForLetter = (letter) => {
    const submitted = submittedGuesses.map((guess) => guess.includes(letter))
    if (!submitted.some(Boolean)) return ''
    if (solution.includes(letter)) return 'key-correct'
    return 'key-absent'
  }
  return (
    <div className="keyboard" aria-label="On-screen keyboard">
      {rows.map((row, rowIndex) => (
        <div className="keyboard-row" key={row}>
          {rowIndex === 2 && <button className="key key-wide" onClick={() => onKey('ENTER')} type="button">Enter</button>}
          {row.split('').map((letter) => (
            <button className={`key ${stateForLetter(letter)}`} key={letter} onClick={() => onKey(letter)} type="button">{letter}</button>
          ))}
          {rowIndex === 2 && <button className="key key-wide" onClick={() => onKey('BACKSPACE')} type="button">⌫</button>}
        </div>
      ))}
    </div>
  )
}

function GamePage({ solution, guesses, currentGuess, attemptsLeft, time, score, hintVisible, message, onKey, onToggleHint, onExit }) {
  const rows = [...guesses, currentGuess, ...Array.from({ length: Math.max(0, MAX_ATTEMPTS - guesses.length - 1) }, () => '')]
  const minutes = Math.floor(time / 60).toString().padStart(2, '0')
  const seconds = (time % 60).toString().padStart(2, '0')

  return (
    <main className="page-content game-page">
      <div className="game-topline">
        <button className="back-button" onClick={onExit} type="button"><Icon name="back" size={18} /> Back to home</button>
        <div className="round-badge"><span /> DAILY CHALLENGE <span className="badge-divider">/</span> NORMAL</div>
      </div>
      <div className="game-layout">
        <section className="game-main-card">
          <div className="game-heading">
            <div className="eyebrow">THE WORD IS OUT THERE</div>
            <h1>Guess the word<span>.</span></h1>
            <p>Find the hidden 5-letter word. You&apos;ve got this!</p>
          </div>
          <div className="game-meta">
            <div className="meta-item"><span className="meta-icon"><Icon name="clock" size={17} /></span><span className="meta-label">TIME</span><strong>{minutes}:{seconds}</strong></div>
            <div className="meta-item"><span className="meta-icon meta-icon-purple"><Icon name="bolt" size={17} /></span><span className="meta-label">SCORE</span><strong>{score.toLocaleString()}</strong></div>
            <div className="meta-item"><span className="meta-icon meta-icon-green"><Icon name="target" size={17} /></span><span className="meta-label">TRIES LEFT</span><strong>{attemptsLeft}<small> / {MAX_ATTEMPTS}</small></strong></div>
          </div>
          <div className="board-wrap">
            <div className="guess-board">
              {rows.map((guess, index) => (
                <GuessRow key={`${index}-${guess}`} guess={guess} solution={index < guesses.length ? solution : ''} active={index === guesses.length} />
              ))}
            </div>
          </div>
          <p className={`game-message ${message ? 'visible' : ''}`} role="status">{message || ' '}</p>
          <GameKeyboard onKey={onKey} submittedGuesses={guesses} solution={solution} />
          <div className="submit-area">
            <button className="primary-button submit-button" onClick={() => onKey('ENTER')} type="button">
              Submit guess <Icon name="arrow" size={17} />
            </button>
            <span>Press <kbd>ENTER</kbd> to submit</span>
          </div>
        </section>
        <aside className="game-side">
          <section className="side-card attempts-card">
            <div className="side-card-title"><span className="side-icon"><Icon name="target" size={19} /></span><h2>Your attempts</h2></div>
            <div className="attempt-count"><strong>{attemptsLeft}</strong><span>of {MAX_ATTEMPTS} guesses remaining</span></div>
            <div className="attempt-track">{Array.from({ length: MAX_ATTEMPTS }, (_, i) => <span className={i < attemptsLeft ? 'remaining' : 'used'} key={i} />)}</div>
            <p>Every guess brings you closer to the answer.</p>
          </section>
          <section className={`side-card hint-card ${hintVisible ? 'hint-open' : ''}`}>
            <div className="hint-heading"><span className="hint-icon"><Icon name="bulb" size={20} /></span><span className="hint-label">NEED A NUDGE?</span></div>
            <h2>A little hint</h2>
            <p>{hintVisible ? WORDS.find((item) => item.word === solution)?.hint : 'Stuck? A tiny clue might spark the right idea.'}</p>
            <button className="hint-button" onClick={onToggleHint} type="button">
              {hintVisible ? 'Hide hint' : 'Reveal a hint'} <Icon name={hintVisible ? 'close' : 'spark'} size={15} />
            </button>
          </section>
          <section className="side-card tip-card">
            <span className="tip-mark">“</span>
            <p>Start with words that have lots of different letters. It&apos;s all about narrowing it down!</p>
            <span className="tip-caption">A WORDQUEST TIP</span>
          </section>
        </aside>
      </div>
    </main>
  )
}

function ResultsPage({ won, solution, score, time, onPlayAgain, onHome }) {
  return (
    <main className="page-content result-page">
      <section className={`result-card ${won ? 'result-win' : 'result-loss'}`}>
        <div className="result-sparkle sparkle-one">✦</div>
        <div className="result-sparkle sparkle-two">✧</div>
        <div className="result-icon">{won ? <Icon name="trophy" size={29} /> : <Icon name="refresh" size={29} />}</div>
        <div className="eyebrow">{won ? 'YOU CRACKED IT' : 'BETTER LUCK NEXT TIME'}</div>
        <h1>{won ? 'Brilliant work!' : 'Game over.'}</h1>
        <p className="result-copy">{won ? 'Another word conquered. Your streak is looking good!' : 'That one was a tricky little word. Ready for another round?'}</p>
        <div className="answer-reveal"><span>THE WORD WAS</span><strong>{solution}</strong></div>
        <div className="result-stats">
          <div><span>FINAL SCORE</span><strong><Icon name="bolt" size={17} /> {score.toLocaleString()}</strong></div>
          <div><span>TIME PLAYED</span><strong><Icon name="clock" size={17} /> {Math.floor(time / 60).toString().padStart(2, '0')}:{(time % 60).toString().padStart(2, '0')}</strong></div>
        </div>
        <button className="primary-button replay-button" onClick={onPlayAgain} type="button"><Icon name="refresh" size={18} /> Play again</button>
        <button className="text-button home-text-button" onClick={onHome} type="button">Back to home <Icon name="arrow" size={16} /></button>
      </section>
    </main>
  )
}

function LeaderboardPage({ onPlay }) {
  const players = [
    { rank: '01', name: 'LexiLuna', tag: 'Word wizard', avatar: 'LL', score: '2,840', streak: '12', tone: 'gold' },
    { rank: '02', name: 'WordSmith', tag: 'Letter legend', avatar: 'WS', score: '2,510', streak: '8', tone: 'silver' },
    { rank: '03', name: 'PixelPusher', tag: 'Quick thinker', avatar: 'PP', score: '2,240', streak: '7', tone: 'bronze' },
    { rank: '04', name: 'you', tag: 'Word seeker', avatar: 'S', score: '1,920', streak: '4', tone: 'you', current: true },
    { rank: '05', name: 'VowelVibes', tag: 'Daily player', avatar: 'VV', score: '1,760', streak: '3', tone: 'plain' },
  ]
  return (
    <main className="page-content leaderboard-page">
      <div className="leaderboard-intro">
        <div className="eyebrow">THE WORDS ARE SPOKEN</div>
        <h1>Hall of <span>fame.</span></h1>
        <p>Every great guess deserves a place on the board.</p>
      </div>
      <section className="leaderboard-panel">
        <div className="leaderboard-panel-head">
          <div><span className="panel-kicker">WEEKLY RANKINGS</span><h2>Top word explorers</h2></div>
          <span className="period-pill"><span /> This week</span>
        </div>
        <div className="leaderboard-columns"><span>RANK</span><span>PLAYER</span><span>STREAK</span><span>HIGH SCORE</span></div>
        <div className="leaderboard-list">
          {players.map((player) => (
            <article className={`leaderboard-row ${player.current ? 'leaderboard-you' : ''}`} key={player.rank}>
              <span className={`rank large-rank ${player.tone}`}>{player.rank}</span>
              <span className={`player-avatar leaderboard-avatar avatar-${player.tone}`}>{player.avatar}</span>
              <span className="leaderboard-player-name"><strong>{player.name}</strong><small>{player.tag}</small></span>
              <span className="streak-cell"><Icon name="bolt" size={15} /> {player.streak} days</span>
              <strong className="leader-score">{player.score}</strong>
            </article>
          ))}
        </div>
        <div className="leaderboard-footer"><span>Your next guess could move you up.</span><button className="text-button" onClick={onPlay} type="button">Play a round <Icon name="arrow" size={16} /></button></div>
      </section>
    </main>
  )
}

function App() {
  const [page, setPage] = useState('home')
  const [solution, setSolution] = useState('ORBIT')
  const [guesses, setGuesses] = useState([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [time, setTime] = useState(0)
  const [hintVisible, setHintVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [roundResult, setRoundResult] = useState(null)
  const [bestScore, setBestScore] = useState(1920)
  const [gamesPlayed, setGamesPlayed] = useState(24)

  const attemptsLeft = MAX_ATTEMPTS - guesses.length
  const score = useMemo(() => Math.max(0, 1000 - guesses.length * 100 - Math.floor(time / 5) * 5), [guesses.length, time])

  useEffect(() => {
    if (page !== 'game') return undefined
    const timerId = window.setInterval(() => setTime((current) => current + 1), 1000)
    return () => window.clearInterval(timerId)
  }, [page])

  const startGame = useCallback(() => {
    const nextWord = WORDS[Math.floor(Math.random() * WORDS.length)].word
    setSolution(nextWord)
    setGuesses([])
    setCurrentGuess('')
    setTime(0)
    setHintVisible(false)
    setMessage('')
    setRoundResult(null)
    setPage('game')
  }, [])

  const finishGame = useCallback((won, finalScore) => {
    setRoundResult({ won, score: finalScore })
    setGamesPlayed((played) => played + 1)
    if (won) setBestScore((best) => Math.max(best, finalScore))
    setPage('result')
  }, [])

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== ROW_LENGTH) {
      setMessage('Add 5 letters to make a guess.')
      return
    }

    const nextGuesses = [...guesses, currentGuess]
    const nextScore = Math.max(0, 1000 - nextGuesses.length * 100 - Math.floor(time / 5) * 5)
    setGuesses(nextGuesses)
    setCurrentGuess('')
    setMessage('')
    if (currentGuess === solution) {
      finishGame(true, nextScore)
    } else if (nextGuesses.length === MAX_ATTEMPTS) {
      finishGame(false, 0)
    }
  }, [currentGuess, finishGame, guesses, solution, time])

  const handleKey = useCallback((key) => {
    if (key === 'ENTER') {
      submitGuess()
      return
    }
    if (key === 'BACKSPACE') {
      setCurrentGuess((guess) => guess.slice(0, -1))
      setMessage('')
      return
    }
    if (/^[A-Z]$/.test(key) && currentGuess.length < ROW_LENGTH) {
      setCurrentGuess((guess) => `${guess}${key}`)
      setMessage('')
    }
  }, [currentGuess.length, submitGuess])

  useEffect(() => {
    if (page !== 'game') return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Enter') handleKey('ENTER')
      else if (event.key === 'Backspace') handleKey('BACKSPACE')
      else if (/^[a-zA-Z]$/.test(event.key)) handleKey(event.key.toUpperCase())
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleKey, page])

  const navigate = (nextPage) => {
    if (nextPage === 'game') {
      startGame()
      return
    }
    setPage(nextPage)
  }

  return (
    <div className="app-shell">
      <TopBar page={page === 'result' ? 'game' : page} onNavigate={navigate} />
      {page === 'home' && <HomePage onStart={startGame} onLeaderboard={() => setPage('leaderboard')} bestScore={bestScore} gamesPlayed={gamesPlayed} />}
      {page === 'game' && (
        <GamePage
          solution={solution}
          guesses={guesses}
          currentGuess={currentGuess}
          attemptsLeft={attemptsLeft}
          time={time}
          score={score}
          hintVisible={hintVisible}
          message={message}
          onKey={handleKey}
          onToggleHint={() => setHintVisible((visible) => !visible)}
          onExit={() => setPage('home')}
        />
      )}
      {page === 'result' && roundResult && (
        <ResultsPage
          won={roundResult.won}
          solution={solution}
          score={roundResult.score}
          time={time}
          onPlayAgain={startGame}
          onHome={() => setPage('home')}
        />
      )}
      {page === 'leaderboard' && <LeaderboardPage onPlay={startGame} />}
      <footer className="site-footer">
        <Brand compact />
        <span>Made for curious minds <span className="footer-heart">♥</span></span>
        <span className="footer-version">WORDQUEST · DAILY PUZZLE</span>
      </footer>
    </div>
  )
}

export default App
