import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import floralCorner from "@/assets/floral-corner.png.asset.json";
import lanterns from "@/assets/lanterns.png.asset.json";
import { Button } from "@/components/ui/button";
import { invitation } from "@/lib/invitation-config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Saleha Weds Owesh | Nikah Invitation" },
      {
        name: "description",
        content: "You are warmly invited to the Nikah ceremony of Saleha and Owesh on 20 November 2026.",
      },
      { property: "og:title", content: "Saleha Weds Owesh | Nikah Invitation" },
      {
        property: "og:description",
        content: "Join us for the Nikah ceremony of Saleha and Owesh on 20 November 2026.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(): TimeLeft | null {
  const distance = new Date(invitation.countdownTarget).getTime() - Date.now();
  if (distance <= 0) return null;
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };
}

function Ornament() {
  return (
    <div className="ornament" aria-hidden="true">
      <span />
      <b>◆</b>
      <span />
    </div>
  );
}

function FloralCorners({ subtle = false }: { subtle?: boolean }) {
  return (
    <>
      <img
        src={floralCorner.url}
        alt=""
        width={1024}
        height={1024}
        className={`floral-corner floral-corner-top ${subtle ? "floral-subtle" : ""}`}
      />
      <img
        src={floralCorner.url}
        alt=""
        loading="lazy"
        width={1024}
        height={1024}
        className={`floral-corner floral-corner-bottom ${subtle ? "floral-subtle" : ""}`}
      />
    </>
  );
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!timeLeft) return <p className="today-message">Today is the day! ❤️</p>;
  const units = [
    ["DAYS", timeLeft.days],
    ["HOURS", timeLeft.hours],
    ["MINUTES", timeLeft.minutes],
    ["SECONDS", timeLeft.seconds],
  ] as const;

  return (
    <div className="countdown-grid">
      {units.map(([label, value]) => (
        <div className="countdown-unit" key={label}>
          <strong>{String(value).padStart(2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function Index() {
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const petals = useMemo(() => Array.from({ length: 11 }, (_, index) => index), []);
  const mapUrl = `https://www.google.com/maps?q=${invitation.mapCenter.latitude},${invitation.mapCenter.longitude}&z=16&output=embed`;

  const openInvitation = () => {
    setOpening(true);
    window.setTimeout(() => {
      setOpened(true);
      window.setTimeout(() => document.getElementById("invitation")?.scrollIntoView({ behavior: "smooth" }), 100);
    }, 950);
  };

  return (
    <main className={`invitation-site ${opening ? "is-opening" : ""} ${opened ? "is-open" : ""}`}>
      <section className="opening-screen" aria-label="Wedding invitation cover">
        <div className="envelope-stage">
          <div className="envelope-title">
            <p>In the name of ‘ALLAH’</p>
            <span>the most beneficent and the most merciful</span>
          </div>
          <div className="envelope" aria-label="Sealed wedding invitation envelope">
            <div className="envelope-paper">
              <span>Wedding Invitation</span>
              <strong>Saleha <i>&amp;</i> Owesh</strong>
              <small>20 · 11 · 2026</small>
            </div>
            <div className="envelope-back" />
            <div className="envelope-left" />
            <div className="envelope-right" />
            <div className="envelope-bottom" />
            <div className="envelope-flap" />
            <div className="envelope-emboss emboss-left" aria-hidden="true">❦</div>
            <div className="envelope-emboss emboss-right" aria-hidden="true">❦</div>
            <Button
              variant="seal"
              size="seal"
              onClick={openInvitation}
              disabled={opening}
              aria-label="Open invitation"
              className="wax-seal"
            >
              S<span>&amp;</span>O
            </Button>
          </div>
          <p className="tap-instruction">Open Invitation <Sparkles aria-hidden="true" /></p>
        </div>
      </section>

      <section id="invitation" className="invitation-wrap" aria-hidden={!opened}>
        {opened && (
          <div className="petals" aria-hidden="true">
            {petals.map((petal) => <i key={petal} className={`petal petal-${petal + 1}`} />)}
          </div>
        )}
        <article className="invitation-card">
          <FloralCorners />
          <img className="card-lanterns" src={lanterns.url} alt="" loading="lazy" width={1024} height={1024} />

          <header className="invitation-header reveal-section">
            <p className="blessing">In the name of ‘ALLAH’<br /><small>the most beneficent and the most merciful</small></p>
            <p className="request"><strong>{invitation.host}</strong><br />requests the honour of your presence at the<br />Nikah ceremony of his Granddaughter</p>
          </header>

          <section className="names reveal-section" aria-label="Bride and groom">
            <h1>{invitation.bride}</h1>
            <p>( D/o. {invitation.brideParent} )</p>
            <span className="weds-seal">Weds</span>
            <h1>{invitation.groom}</h1>
            <p>( S/o. {invitation.groomParent} )</p>
            <h2>✿ In Sha Allah Nikah ✿</h2>
          </section>

          <section className="date-block reveal-section" aria-label="Wedding date">
            <p className="day">{invitation.day}</p>
            <div className="date-row">
              <span>NOVEMBER</span><strong>20<sup>TH</sup></strong><span>2026</span>
            </div>
            <p className="hijri">({invitation.hijriDate})</p>
            <Ornament />
            <p><b>Nikah :</b> {invitation.nikah}</p>
            <p><b>Dinner :</b> {invitation.dinner}</p>
          </section>

          <section className="venue reveal-section">
            <h2>✿ Venue ✿</h2>
            <div className="venue-box">
              <h3>{invitation.venue}</h3>
              <address>{invitation.address.map((line) => <span key={line}>{line}</span>)}</address>
              <Button variant="invitation" size="invitation" asChild>
                <a href={invitation.googleMapsUrl} target="_blank" rel="noreferrer">
                  Open in Google Maps <MapPin aria-hidden="true" />
                </a>
              </Button>
              <div className="map-frame">
                <iframe title={`Map to ${invitation.venue}`} src={mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </div>
          </section>

          <section className="countdown reveal-section">
            <Ornament />
            <h2>Counting down to the Nikah</h2>
            <Countdown />
          </section>

          <footer className="final-message reveal-section">
            <p className="script-line">Awaiting the pleasure of your presence</p>
            <p>{invitation.hosts.map((host) => <span key={host}>{host}</span>)}</p>
            <Ornament />
            <strong>Your presence will be a blessing</strong>
          </footer>
        </article>
      </section>
    </main>
  );
}
