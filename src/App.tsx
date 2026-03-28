import { useState } from 'react';
import bgImage from './background.png';

type FormState = 'idle' | 'submitting' | 'success';

function App() {
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || formState !== 'idle') return;

    setFormState('submitting');

    try {
      await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': import.meta.env.VITE_BREVO_API_KEY,
        },
        body: JSON.stringify({
          email,
          listIds: [Number(import.meta.env.VITE_BREVO_LIST_ID)],
          updateEnabled: true,
        }),
      });
    } catch {
      // Silently fail — show success anyway to avoid frustrating the user
    }

    setTimeout(() => setFormState('success'), 420);
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden">
      {/* Background image with subtle Ken-Burns on hover */}
      <div
        className="absolute inset-0 bg-cover transition-transform duration-[1200ms] ease-out"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: '47% center',
          transform: isHovered ? 'scale(1.02)' : 'scale(1.01)',
        }}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.50) 50%, rgba(0,0,0,0.80) 100%)',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 md:px-12 pb-20 sm:pb-0">
        <div className="text-center w-full max-w-2xl flex flex-col items-center">

          {/* Monogram */}
          <p
            className="text-[#B5BDAC] tracking-[0.45em] font-light mb-5 text-base md:text-lg"
            style={{ fontFamily: "'GFS Didot', serif" }}
          >
            É.
          </p>

          {/* Wordmark */}
          <h1
            className="text-[3.4rem] sm:text-7xl md:text-[6.5rem] lg:text-[8rem] text-white tracking-[0.35em] md:tracking-[0.45em] font-normal leading-none"
            style={{ fontFamily: "'GFS Didot', serif" }}
          >
            ÉCLORA
          </h1>

          {/* Thin divider */}
          <div className="mt-7 mb-7 w-10 border-t border-[#B5BDAC]/70" />

          {/* Tagline */}
          <p
            className="text-[#FCF8F0] tracking-[0.18em] text-xs sm:text-sm font-light uppercase mb-5"
            style={{ fontFamily: "'GFS Didot', serif" }}
          >
            Notre boutique ouvre bientôt
          </p>

          {/* Description */}
          <p
            className="text-white/80 text-sm max-w-xs sm:max-w-sm mx-auto leading-[2] tracking-wide mb-9 px-2"
            style={{ fontFamily: "'GFS Didot', serif" }}
          >
            Inscrivez-vous pour être informé du lancement et découvrir nos
            nouveautés en avant-première.
          </p>

          {/* Form area — fixed height to avoid layout shift */}
          <div className="w-full max-w-sm mx-auto" style={{ minHeight: '56px' }}>

            {/* IDLE / SUBMITTING: form fades out */}
            {(formState === 'idle' || formState === 'submitting') && (
              <form
                onSubmit={handleSubmit}
                className={formState === 'submitting' ? 'animate-form-out' : ''}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:border-b sm:border-white/40 sm:focus-within:border-[#B5BDAC] transition-colors duration-500">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Adresse e-mail"
                    required
                    disabled={formState === 'submitting'}
                    className="flex-1 bg-white/90 sm:bg-transparent text-black sm:text-white
                               placeholder-black/50 sm:placeholder-white/35
                               py-3 px-4 sm:px-1
                               border-b border-white/40 sm:border-0
                               focus:outline-none focus:border-[#B5BDAC] sm:focus:border-0
                               text-xs tracking-[0.15em] transition-colors duration-300"
                    style={{ fontFamily: "'GFS Didot', serif" }}
                  />
                  <button
                    type="submit"
                    disabled={formState === 'submitting'}
                    className={[
                      'text-xs tracking-[0.25em] uppercase py-3 px-4 sm:pl-6 sm:pr-0',
                      'whitespace-nowrap text-left sm:text-right transition-all duration-300',
                      // Desktop: always sage, hover white
                      'sm:bg-transparent sm:text-[#B5BDAC] sm:hover:text-white',
                      // Mobile: highlight when email looks valid
                      email.includes('@') && email.includes('.')
                        ? 'bg-[#B5BDAC] text-black sm:bg-transparent sm:text-[#B5BDAC]'
                        : 'bg-white/10 text-[#B5BDAC]/60 sm:bg-transparent',
                    ].join(' ')}
                    style={{ fontFamily: "'GFS Didot', serif" }}
                  >
                    S'inscrire →
                  </button>
                </div>
              </form>
            )}

            {/* SUCCESS: confirmation fades in */}
            {formState === 'success' && (
              <div className="flex flex-col items-center gap-3 py-2">
                {/* Line grows first */}
                <div
                  className="animate-line-grow border-t border-[#B5BDAC]"
                  style={{ height: '1px' }}
                />
                {/* Title slides up */}
                <p
                  className="animate-success-in text-[#B5BDAC] text-xs uppercase"
                  style={{ fontFamily: "'GFS Didot', serif" }}
                >
                  Merci de votre inscription
                </p>
                {/* Subtitle, slightly delayed */}
                <p
                  className="animate-success-in text-white/80 text-xs tracking-[0.12em] text-center leading-relaxed"
                  style={{
                    fontFamily: "'GFS Didot', serif",
                    animationDelay: '200ms',
                    animationFillMode: 'both',
                    opacity: 0,
                  }}
                >
                  Vous serez parmi les premiers à découvrir Éclora.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 px-8 md:px-12 flex items-center justify-between z-10">
        <span
          className="text-white/30 text-[10px] tracking-[0.2em] uppercase"
          style={{ fontFamily: "'GFS Didot', serif" }}
        >
          © 2026 Éclora
        </span>
        <a
          href="https://www.instagram.com/eclora.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/30 hover:text-[#B5BDAC] transition-colors duration-300 text-[10px] tracking-[0.15em] uppercase"
          style={{ fontFamily: "'GFS Didot', serif" }}
        >
          Instagram
        </a>
      </div>
    </div>
  );
}

export default App;
