"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  isSupabaseConfigured,
  loadVehicles,
  saveRecommendationSession,
  submitBuyerEnquiry,
} from "./supabase";
import { marketVehicles, type MarketVehicle } from "./marketVehicles";

type Answers = {
  budget: number;
  city: string;
  passengers: number;
  dailyKm: number;
  longestTrip: number;
  homeCharging: string;
  highway: string;
  roads: string;
  accessibility: string;
  priority: string;
};

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  variant: string;
  price: number;
  battery: number;
  range: number;
  rangeStandard: string;
  seats: number;
  clearance: number | null;
  dc: number | null;
  serviceCities: string[];
  serviceCount: number;
  qa: "Incomplete" | "Needs review";
  evidence: number;
  imageUrl?: string | null;
  sourceUrl?: string | null;
  sourceLabel?: string | null;
  verifiedAt?: string | null;
  bodyType?: string | null;
};

type Match = Vehicle & {
  score: number;
  eligible: boolean;
  reasons: string[];
  cautions: string[];
};

const vehicles: Vehicle[] = [
  {
    id: "tiago",
    brand: "Tata",
    model: "Tiago.ev",
    variant: "LR XT",
    price: 2749000,
    battery: 24,
    range: 291,
    rangeStandard: "MIDC",
    seats: 5,
    clearance: null,
    dc: null,
    serviceCities: ["Biratnagar", "Kathmandu Valley", "Pokhara", "Bharatpur", "Butwal"],
    serviceCount: 21,
    qa: "Incomplete",
    evidence: 5,
    sourceUrl: "https://cars.tatamotors.com.np/utility-vehicles/tiago-ev/price.php",
    sourceLabel: "Tata Motors Nepal",
    verifiedAt: "2026-07-27",
  },
  {
    id: "dolphin",
    brand: "BYD",
    model: "Dolphin",
    variant: "44.9 kWh",
    price: 4115000,
    battery: 44.9,
    range: 340,
    rangeStandard: "WLTP",
    seats: 5,
    clearance: null,
    dc: 60,
    serviceCities: ["Biratnagar", "Kathmandu Valley", "Pokhara", "Bharatpur", "Butwal"],
    serviceCount: 10,
    qa: "Incomplete",
    evidence: 5,
    sourceUrl: "https://cimex.com.np/price-list",
    sourceLabel: "Cimex / BYD Nepal",
    verifiedAt: "2026-07-27",
  },
  {
    id: "windsor",
    brand: "MG",
    model: "Windsor EV",
    variant: "Excite",
    price: 3975000,
    battery: 38,
    range: 331,
    rangeStandard: "ARAI",
    seats: 5,
    clearance: null,
    dc: 50,
    serviceCities: ["Kathmandu Valley"],
    serviceCount: 1,
    qa: "Incomplete",
    evidence: 5,
    imageUrl: "https://mgmotor.com.np/images/cars/windsor/pearlWhite.webp",
    sourceUrl: "https://mgmotor.com.np/cars/windsor",
    sourceLabel: "MG Motor Nepal",
    verifiedAt: "2026-07-27",
  },
  {
    id: "comet",
    brand: "MG",
    model: "Comet EV",
    variant: "Executive",
    price: 1875000,
    battery: 17.3,
    range: 230,
    rangeStandard: "ARAI",
    seats: 4,
    clearance: null,
    dc: null,
    serviceCities: ["Kathmandu Valley"],
    serviceCount: 1,
    qa: "Incomplete",
    evidence: 5,
    imageUrl: "https://mgmotor.com.np/images/cars/comet/candyWhite.webp",
    sourceUrl: "https://mgmotor.com.np/cars/comet",
    sourceLabel: "MG Motor Nepal",
    verifiedAt: "2026-07-27",
  },
  {
    id: "atto",
    brand: "BYD",
    model: "ATTO 3",
    variant: "Advance",
    price: 6199000,
    battery: 49.9,
    range: 340,
    rangeStandard: "WLTP",
    seats: 5,
    clearance: 185,
    dc: null,
    serviceCities: ["Biratnagar", "Kathmandu Valley", "Pokhara", "Bharatpur", "Butwal"],
    serviceCount: 10,
    qa: "Needs review",
    evidence: 5,
    sourceUrl: "https://cimex.com.np/price-list",
    sourceLabel: "Cimex / BYD Nepal",
    verifiedAt: "2026-07-27",
  },
];

const initialAnswers: Answers = {
  budget: 4500000,
  city: "Biratnagar",
  passengers: 5,
  dailyKm: 30,
  longestTrip: 180,
  homeCharging: "Yes",
  highway: "Monthly",
  roads: "Mostly paved",
  accessibility: "Standard",
  priority: "After-sales confidence",
};

const steps = [
  { label: "Your needs", range: "Questions 1–3" },
  { label: "Your driving", range: "Questions 4–7" },
  { label: "Your priorities", range: "Questions 8–10" },
];

function LogoMark() {
  return (
    <span className="logo-mark" aria-hidden="true">
      <span className="route route-a" />
      <span className="route route-b" />
      <span className="route-dot route-dot-start" />
      <span className="route-dot route-dot-end" />
    </span>
  );
}

function Icon({ name }: { name: "arrow" | "check" | "shield" | "clock" | "pin" | "bolt" | "alert" }) {
  const paths = {
    arrow: <><path d="M5 12h13" /><path d="m13 6 6 6-6 6" /></>,
    check: <path d="m5 12.5 4.2 4.2L19 7" />,
    shield: <><path d="M12 2.5 20 5.6v5.8c0 4.8-3.3 7.9-8 9.2-4.7-1.3-8-4.4-8-9.2V5.6L12 2.5Z" /><path d="m8.3 11.9 2.5 2.5 5.1-5.6" /></>,
    clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5v5l3.3 2" /></>,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.2" /></>,
    bolt: <path d="m13.5 2-8 11h6l-1 9 8-12h-6l1-8Z" />,
    alert: <><path d="M12 3 2.8 20h18.4L12 3Z" /><path d="M12 9v5M12 17.2v.1" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function Choice({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="choice-grid">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`choice-card ${value === option ? "selected" : ""}`}
          onClick={() => onChange(option)}
          aria-pressed={value === option}
        >
          <span className="choice-indicator">{value === option && <Icon name="check" />}</span>
          {option}
        </button>
      ))}
    </div>
  );
}

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);

const localVehicleImages: Record<string, string> = {
  "tata-punch-ev": "/vehicles/tata-punch.webp",
  "mg-comet-executive": "/vehicles/mg-comet.webp",
  "mg-windsor-excite": "/vehicles/mg-windsor.webp",
  "leapmotor-t03": "/vehicles/leapmotor-t03.jpg",
  "leapmotor-b10": "/vehicles/leapmotor-b10.png",
  "leapmotor-c10": "/vehicles/leapmotor-c10.jpg",
  "omoda-e5-pro": "/vehicles/omoda-e5.png",
  "jaecoo-j5": "/vehicles/jaecoo-j5.png",
  "jaecoo-j6t": "/vehicles/jaecoo-j6t.png",
};

function VehicleVisual({ vehicle }: { vehicle: Vehicle }) {
  const imageUrl = localVehicleImages[vehicle.id] || vehicle.imageUrl;
  return (
    <>
      <div className="vehicle-placeholder"><LogoMark /><span>{vehicle.brand}</span></div>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`${vehicle.brand} ${vehicle.model}`}
          loading="lazy"
          onError={(event) => { event.currentTarget.style.display = "none"; }}
        />
      )}
    </>
  );
}

function MarketVehicleVisual({ vehicle }: { vehicle: MarketVehicle }) {
  return (
    <>
      <div className="vehicle-placeholder"><span>{vehicle.brand.slice(0, 2).toUpperCase()}</span><small>{vehicle.brand}</small></div>
      {vehicle.image && (
        <img src={vehicle.image} alt={`${vehicle.brand} ${vehicle.model}`} loading="lazy"
          onError={(event) => { event.currentTarget.style.display = "none"; }} />
      )}
    </>
  );
}

function calculateMatches(answers: Answers, vehicleData: Vehicle[]): Match[] {
  const rangeTarget = answers.longestTrip * 1.3;
  const clearanceTarget = answers.roads === "Mostly paved" ? 150 : answers.roads === "Mixed roads" ? 170 : 190;

  return vehicleData
    .map((vehicle) => {
      const overBudget = vehicle.price > answers.budget;
      const insufficientSeats = vehicle.seats < answers.passengers;
      const reasons: string[] = [];
      const cautions: string[] = [];

      const budgetScore = overBudget
        ? 0
        : Math.min(20, 10 + (10 * (answers.budget - vehicle.price)) / answers.budget);
      const tripScore = Math.min(15, (vehicle.range / rangeTarget) * 15);
      const roadScore =
        answers.roads === "Mostly paved"
          ? 15
          : vehicle.clearance
            ? Math.min(15, (vehicle.clearance / clearanceTarget) * 15)
            : 0;
      const familyScore = insufficientSeats ? 0 : 10;
      const chargingScore =
        answers.homeCharging === "Yes"
          ? 10
          : vehicle.dc
            ? Math.min(10, (vehicle.dc / 50) * 10)
            : 0;
      const localService = vehicle.serviceCities.includes(answers.city);
      const serviceScore = localService ? 10 : Math.min(5, (vehicle.serviceCount / 10) * 5);

      const priorityScores: Record<string, number> = {
        "Lowest purchase price": budgetScore / 2,
        "Range & highway": tripScore / 1.5,
        "Road suitability": roadScore / 1.5,
        "After-sales confidence": serviceScore,
        "Evidence confidence": vehicle.evidence,
      };

      if (!overBudget) reasons.push(`Fits within your Rs ${money(answers.budget)} budget`);
      if (vehicle.range >= rangeTarget) reasons.push(`${vehicle.range} km claimed range covers your trip target`);
      if (localService) reasons.push(`Published service presence includes ${answers.city}`);
      if (vehicle.dc && answers.highway !== "Rarely") reasons.push(`${vehicle.dc} kW DC charging supports longer trips`);
      if (vehicle.seats >= answers.passengers) reasons.push(`Seats your regular group of ${answers.passengers}`);

      if (overBudget) cautions.push(`Rs ${money(vehicle.price - answers.budget)} above your maximum budget`);
      if (insufficientSeats) cautions.push(`Only ${vehicle.seats} seats for ${answers.passengers} regular passengers`);
      if (vehicle.clearance === null && answers.roads !== "Mostly paved") cautions.push("Nepal-market ground clearance still needs official confirmation");
      if (!localService) cautions.push(`No published service location found in ${answers.city}`);
      if (!vehicle.dc && answers.highway === "Weekly") cautions.push("DC fast-charging specification is not confirmed");
      cautions.push("Vehicle record is not yet independently verified for production use");

      const eligible = !overBudget && !insufficientSeats;
      const score = eligible
        ? budgetScore + tripScore + roadScore + familyScore + chargingScore + serviceScore + vehicle.evidence + priorityScores[answers.priority]
        : 0;

      return { ...vehicle, score: Math.round(score), eligible, reasons, cautions };
    })
    .sort((a, b) => b.score - a.score);
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers);
  const [showResults, setShowResults] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [leadError, setLeadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [vehicleData, setVehicleData] = useState<Vehicle[]>(vehicles);
  const [catalogMode, setCatalogMode] = useState<"live" | "pilot">("pilot");
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogBrand, setCatalogBrand] = useState("All brands");
  const matcherRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const matches = useMemo(() => calculateMatches(answers, vehicleData), [answers, vehicleData]);
  const shortlist = matches.filter((item) => item.eligible).slice(0, 3);
  const catalogBrands = useMemo(
    () => ["All brands", ...Array.from(new Set(marketVehicles.map((item) => item.brand))).sort()],
    [],
  );
  const catalogVehicles = useMemo(() => {
    const query = catalogSearch.trim().toLowerCase();
    return marketVehicles.filter((item) =>
      (catalogBrand === "All brands" || item.brand === catalogBrand) &&
      (!query || `${item.brand} ${item.model} ${item.variants || ""}`.toLowerCase().includes(query)),
    );
  }, [catalogBrand, catalogSearch]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    loadVehicles<Vehicle>()
      .then((records) => {
        if (records.length) {
          setVehicleData(records);
          setCatalogMode("live");
        }
      })
      .catch(() => setCatalogMode("pilot"));
  }, []);

  const update = <K extends keyof Answers>(key: K, value: Answers[K]) =>
    setAnswers((current) => ({ ...current, [key]: value }));

  const scrollToMatcher = () => matcherRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const next = () => {
    if (step < 2) {
      setStep((current) => current + 1);
      matcherRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setShowResults(true);
      void saveRecommendationSession({
        answers,
        result_vehicle_ids: shortlist.map((item) => item.id),
      });
      window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    }
  };

  const sendEnquiry = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setLeadError("");
    const data = new FormData(event.currentTarget);

    try {
      await submitBuyerEnquiry({
        name: String(data.get("name") || "").trim(),
        phone: String(data.get("phone") || "").trim(),
        purchase_timing: String(data.get("purchase_timing") || ""),
        city: answers.city,
        selected_vehicle: selectedVehicle,
        answers,
        status: "new",
      });
      setLeadSent(true);
    } catch {
      setLeadError("We could not save your request. Please check the connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const editAnswers = () => {
    setShowResults(false);
    setStep(0);
    window.setTimeout(scrollToMatcher, 50);
  };

  return (
    <main>
      <div className="market-bar">
        <span>नेपालको EV बजार, स्पष्ट रूपमा</span>
        <div><b>{marketVehicles.length}+</b> models tracked <i /> Updated July 2026</div>
      </div>
      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="#" aria-label="EV Gadi home">
            <LogoMark />
            <span>EV Gadi</span>
          </a>
          <nav aria-label="Primary navigation">
            <a href="#ev-catalogue">EV catalogue</a>
            <a href="#how-it-works">How it works</a>
            <a href="#data-standard">Our standard</a>
          </nav>
          <button className="header-cta" type="button" onClick={scrollToMatcher}>Find my EV</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="shell hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><Icon name="bolt" /> Nepal&apos;s independent EV buying guide</div>
            <h1>Your next EV, chosen with confidence.</h1>
            <p className="hero-lead">
              Explore every major electric car available in Nepal, compare what matters,
              and get a shortlist shaped around your budget, roads and daily life.
            </p>
            <div className="hero-actions">
              <button className="primary-cta" type="button" onClick={scrollToMatcher}>
                <span>Find my best EV</span>
                <span className="button-icon"><Icon name="arrow" /></span>
              </button>
              <span className="time-note"><Icon name="clock" /> About 2 minutes</span>
            </div>
            <div className="trust-row">
              <div><Icon name="shield" /><span>Independent guidance</span></div>
              <div><Icon name="check" /><span>Current Nepal prices</span></div>
              <div><Icon name="pin" /><span>Local road reality</span></div>
            </div>
            <div className="nepal-cities" aria-label="Initial Nepal coverage">
              काठमाडौं · विराटनगर · पोखरा · भरतपुर · बुटवल
            </div>
          </div>

          <div className="decision-preview product-preview" aria-label="EV Gadi market overview">
            <div className="preview-top">
              <span>EV GADI / MARKET PULSE</span>
              <span className="preview-badge">LIVE</span>
            </div>
            <div className="editorial-number">{marketVehicles.length}+</div>
            <p className="editorial-caption">electric passenger models tracked across Nepal</p>
            <div className="preview-card featured">
              <span className="rank">01</span>
              <div><small>Starting from</small><strong>Rs 16.49 lakh</strong></div>
              <span className="score">2026</span>
            </div>
            <div className="preview-card">
              <span className="preview-icon"><Icon name="check" /></span>
              <div><strong>One clean catalogue</strong><small>Prices, variants and segments</small></div>
            </div>
            <div className="preview-card warning">
              <span className="preview-icon"><Icon name="shield" /></span>
              <div><strong>Decision-first matching</strong><small>Built around your real usage</small></div>
            </div>
            <p>No paid ranking · transparent sources · made for Nepal</p>
          </div>
        </div>
      </section>

      <section className="catalogue-section" id="ev-catalogue">
        <div className="shell">
          <div className="catalogue-heading">
            <div>
              <p className="section-kicker">Explore electric cars</p>
              <h2>The Nepal EV market, in one place.</h2>
            </div>
            <p>Browse current passenger EVs by brand and price. Shortlist first; verify the final offer with the authorised distributor.</p>
          </div>
          <div className="catalogue-tools">
            <input
              aria-label="Search EVs"
              placeholder="Search brand or model"
              value={catalogSearch}
              onChange={(event) => setCatalogSearch(event.target.value)}
            />
            <select aria-label="Filter by brand" value={catalogBrand} onChange={(event) => setCatalogBrand(event.target.value)}>
              {catalogBrands.map((brand) => <option key={brand}>{brand}</option>)}
            </select>
            <span>{catalogVehicles.length} vehicle{catalogVehicles.length === 1 ? "" : "s"}</span>
          </div>
          <div className="catalogue-grid">
            {catalogVehicles.map((vehicle) => (
              <article className="catalogue-card" key={vehicle.id}>
                <div className="vehicle-photo">
                  <MarketVehicleVisual vehicle={vehicle} />
                  <span>{vehicle.segment}</span>
                </div>
                <div className="catalogue-card-body">
                  <p>{vehicle.brand}</p>
                  <h3>{vehicle.model}</h3>
                  <small>{vehicle.variants || `${vehicle.segment} · Nepal market`}</small>
                  <strong>Rs {(vehicle.price / 100000).toFixed(2)} lakh</strong>
                  <div className="catalogue-specs">
                    <span><b>{vehicle.segment}</b> segment</span>
                    <span><b>Electric</b> powertrain</span>
                    <span><b>Nepal</b> market</span>
                  </div>
                  <div className="source-line">
                    <span>Indicative starting price</span>
                    <button type="button" onClick={scrollToMatcher}>Check my fit →</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="catalogue-note">Scope: currently listed electric passenger cars, SUVs, MPVs and pickups in Nepal. Zero-price upcoming models, commercial vehicles, two-wheelers and discontinued listings are excluded.</p>
        </div>
      </section>

      <section className="matcher-section" ref={matcherRef}>
        <div className="shell matcher-shell">
          <div className="matcher-intro">
            <p className="section-kicker">Find my EV</p>
            <h2>Ten answers. A shortlist you can understand.</h2>
            <p>We use hard limits before preferences. An unaffordable or impractical vehicle cannot buy its way to the top.</p>
            <div className="profile-facts">
              <span><Icon name="shield" /> {vehicleData.length} tracked Nepal-market variants</span>
              <span><Icon name="bolt" /> Results update instantly</span>
            </div>
          </div>

          <section className="match-card" aria-labelledby="question-title">
            <div className="stepper" aria-label={`Step ${step + 1} of 3`}>
              {steps.map((item, index) => (
                <div className={index <= step ? "active" : ""} key={item.label}>
                  <span>{index < step ? <Icon name="check" /> : index + 1}</span>
                  <small>{item.label}</small>
                </div>
              ))}
            </div>

            <div className="card-heading">
              <p>{steps[step].range}</p>
              <h2 id="question-title">{steps[step].label}</h2>
            </div>

            {step === 0 && (
              <div className="form-step">
                <div className="field-group">
                  <label htmlFor="budget">1. Maximum vehicle budget</label>
                  <div className="budget-input">
                    <span>Rs</span>
                    <input id="budget" type="number" min="1000000" step="100000" value={answers.budget}
                      onChange={(event) => update("budget", Number(event.target.value))} />
                  </div>
                  <p className="field-helper">Currently Rs {money(answers.budget)} — the vehicle price ceiling, not EMI.</p>
                </div>
                <div className="field-group">
                  <label htmlFor="city">2. Main city</label>
                  <select id="city" value={answers.city} onChange={(event) => update("city", event.target.value)}>
                    {["Biratnagar", "Kathmandu Valley", "Pokhara", "Bharatpur", "Butwal", "Other city"].map((city) => <option key={city}>{city}</option>)}
                  </select>
                </div>
                <div className="field-group">
                  <span className="field-label">3. Regular passengers</span>
                  <div className="number-options">
                    {[2, 4, 5, 7].map((count) => (
                      <button type="button" className={answers.passengers === count ? "selected" : ""} key={count}
                        onClick={() => update("passengers", count)}>{count === 7 ? "7+" : count}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="form-step">
                <div className="two-field-grid">
                  <div className="field-group">
                    <label htmlFor="daily">4. Daily travel</label>
                    <div className="unit-input"><input id="daily" type="number" min="1" value={answers.dailyKm}
                      onChange={(event) => update("dailyKm", Number(event.target.value))} /><span>km</span></div>
                  </div>
                  <div className="field-group">
                    <label htmlFor="trip">5. Longest normal one-way trip</label>
                    <div className="unit-input"><input id="trip" type="number" min="1" value={answers.longestTrip}
                      onChange={(event) => update("longestTrip", Number(event.target.value))} /><span>km</span></div>
                  </div>
                </div>
                <div className="field-group">
                  <span className="field-label">6. Reliable home charging?</span>
                  <Choice options={["Yes", "No", "Unsure"]} value={answers.homeCharging} onChange={(value) => update("homeCharging", value)} />
                </div>
                <div className="field-group">
                  <span className="field-label">7. Highway use</span>
                  <Choice options={["Rarely", "Monthly", "Weekly"]} value={answers.highway} onChange={(value) => update("highway", value)} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form-step">
                <div className="field-group">
                  <span className="field-label">8. Typical roads</span>
                  <Choice options={["Mostly paved", "Mixed roads", "Rough roads"]} value={answers.roads} onChange={(value) => update("roads", value)} />
                </div>
                <div className="field-group">
                  <span className="field-label">9. Entry and accessibility</span>
                  <Choice options={["Standard", "Easy entry preferred", "Essential"]} value={answers.accessibility} onChange={(value) => update("accessibility", value)} />
                </div>
                <div className="field-group">
                  <label htmlFor="priority">10. Most important decision factor</label>
                  <select id="priority" value={answers.priority} onChange={(event) => update("priority", event.target.value)}>
                    {["After-sales confidence", "Lowest purchase price", "Range & highway", "Road suitability", "Evidence confidence"].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </div>
              </div>
            )}

            <div className="form-actions">
              {step > 0 && <button className="secondary-button" type="button" onClick={() => setStep((current) => current - 1)}>Back</button>}
              <button className="continue-button" type="button" onClick={next}>
                {step === 2 ? "See my research shortlist" : "Continue"} <Icon name="arrow" />
              </button>
            </div>
            <p className="card-note"><Icon name="shield" /> No contact details required to see results.</p>
          </section>
        </div>
      </section>

      {showResults && (
        <section className="results-section" ref={resultsRef}>
          <div className="shell">
            <div className="results-heading">
              <div>
                <p className="section-kicker">Your research shortlist</p>
                <h2>Strongest current fits for your profile</h2>
              </div>
              <button className="edit-button" type="button" onClick={editAnswers}>Edit my answers</button>
            </div>

            <div className="research-notice">
              <Icon name="alert" />
              <div>
                <strong>Research preview—not a purchase recommendation</strong>
                <span>These records contain unresolved official-data gaps. Scores help test the matching logic; they cannot override missing evidence.</span>
              </div>
            </div>

            {shortlist.length ? (
              <div className="result-grid">
                {shortlist.map((vehicle, index) => (
                  <article className={`vehicle-result ${index === 0 ? "best" : ""}`} key={vehicle.id}>
                    <div className="result-head">
                      <div>
                        <span className="result-label">{index === 0 ? "Best current fit" : index === 1 ? "Strong alternative" : "Practical alternative"}</span>
                        <h3>{vehicle.brand} {vehicle.model}</h3>
                        <p>{vehicle.variant}</p>
                      </div>
                      <div className="match-score"><strong>{vehicle.score}</strong><span>/100</span></div>
                    </div>
                    <div className="spec-strip">
                      <div><span>Price</span><strong>Rs {(vehicle.price / 100000).toFixed(1)} lakh</strong></div>
                      <div><span>Claimed range</span><strong>{vehicle.range} km</strong><small>{vehicle.rangeStandard}</small></div>
                      <div><span>Battery</span><strong>{vehicle.battery} kWh</strong></div>
                    </div>
                    <div className="reason-block">
                      <h4>Why it fits</h4>
                      <ul>{vehicle.reasons.slice(0, 3).map((reason) => <li key={reason}><Icon name="check" />{reason}</li>)}</ul>
                    </div>
                    <div className="caution-block">
                      <h4>Check before deciding</h4>
                      <ul>{vehicle.cautions.slice(0, 2).map((warning) => <li key={warning}><Icon name="alert" />{warning}</li>)}</ul>
                    </div>
                    <button className="offer-button" type="button" onClick={() => { setSelectedVehicle(`${vehicle.brand} ${vehicle.model}`); setLeadOpen(true); setLeadSent(false); }}>
                      I’m interested in this EV <Icon name="arrow" />
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="no-match">
                <h3>No pilot vehicle passes your hard limits.</h3>
                <p>That is a valid result. Increase the budget or change passenger requirements to test another profile.</p>
                <button className="secondary-button" type="button" onClick={editAnswers}>Change answers</button>
              </div>
            )}

            <div className="excluded-row">
              <strong>Filtered out by hard limits</strong>
              {matches.filter((item) => !item.eligible).map((vehicle) => (
                <span key={vehicle.id}>{vehicle.brand} {vehicle.model} · {vehicle.cautions[0]}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="process-section" id="how-it-works">
        <div className="shell">
          <div className="section-heading">
            <p>How it works</p>
            <h2>Filter first. Rank second. Explain everything.</h2>
            <span>The system respects practical constraints before personal preference affects the order.</span>
          </div>
          <div className="process-grid">
            <article><span>01</span><h3>Understand your life</h3><p>Budget, location, family, travel, roads and charging—not a technical quiz.</p></article>
            <article><span>02</span><h3>Remove wrong fits</h3><p>Over-budget vehicles and insufficient seating are removed before scoring.</p></article>
            <article><span>03</span><h3>Show the reasoning</h3><p>Every result includes fit reasons, cautions and facts that still require verification.</p></article>
          </div>
        </div>
      </section>

      <section className="principles-section" id="data-standard">
        <div className="shell principles-grid">
          <div><p className="section-kicker">Our data standard</p><h2>Unknown should stay unknown.</h2></div>
          <div className="principle-list">
            <article><span>Official Nepal sources first</span><p>Prices, specifications, warranties and service locations retain a source and checked date.</p></article>
            <article><span>No invented completeness</span><p>Missing clearance or warranty information becomes a visible caution—not a guessed number.</p></article>
            <article><span>No paid recommendation rank</span><p>Dealer participation cannot quietly move a vehicle higher in the results.</p></article>
          </div>
        </div>
      </section>

      <section className="pilot-section" id="pilot-data">
        <div className="shell pilot-panel">
          <div>
            <p className="section-kicker">{catalogMode === "live" ? "Connected catalog" : "Current pilot"}</p>
            <h2>{catalogMode === "live" ? `${vehicleData.length} database vehicles.` : "Five vehicles. One honest limitation."}</h2>
          </div>
          <p>{catalogMode === "live"
            ? "Only active records are loaded. Continue attaching official sources and verification dates before treating results as purchase guidance."
            : "Tiago.ev, Dolphin, Windsor EV, Comet EV and ATTO 3 are included to test the experience. None is yet released as independently verified."}</p>
        </div>
      </section>

      <footer>
        <div className="shell footer-inner">
          <a className="brand footer-brand" href="#"><LogoMark /><span>EV Gadi</span></a>
          <p>Independent EV buying assistance for Nepal.</p>
          <span>{isSupabaseConfigured ? "Database connected · Enquiries active" : "Research prototype · Database setup ready"}</span>
        </div>
      </footer>

      {leadOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setLeadOpen(false)}>
          <section className="lead-modal" role="dialog" aria-modal="true" aria-labelledby="lead-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setLeadOpen(false)} aria-label="Close">×</button>
            {!leadSent ? (
              <>
                <p className="section-kicker">{isSupabaseConfigured ? "Secure dealer enquiry" : "Dealer-interest demo"}</p>
                <h2 id="lead-title">Interested in {selectedVehicle}?</h2>
                <p>{isSupabaseConfigured
                  ? "Submit your interest securely. Your request will enter the enquiry dashboard for follow-up."
                  : "Preview the quotation-request flow. Add Supabase configuration to activate secure storage."}</p>
                <form onSubmit={sendEnquiry}>
                  <label>Name<input required name="name" autoComplete="name" placeholder="Your name" /></label>
                  <label>Phone or WhatsApp<input required name="phone" autoComplete="tel" type="tel" pattern="[0-9+ -]{7,15}" placeholder="98XXXXXXXX" /></label>
                  <label>Purchase timing<select name="purchase_timing" defaultValue="1–3 months"><option>Within 30 days</option><option>1–3 months</option><option>3–6 months</option><option>Just researching</option></select></label>
                  <label className="consent-line"><input required type="checkbox" /> I agree that EV Gadi may use these details to respond to this enquiry.</label>
                  {leadError && <p className="form-error" role="alert">{leadError}</p>}
                  <button className="continue-button" disabled={submitting} type="submit">
                    {submitting ? "Saving request…" : isSupabaseConfigured ? "Submit my enquiry" : "Preview my request"} <Icon name="arrow" />
                  </button>
                </form>
              </>
            ) : (
              <div className="lead-success">
                <span><Icon name="check" /></span>
                <h2>{isSupabaseConfigured ? "Enquiry received." : "Request flow complete."}</h2>
                <p>{isSupabaseConfigured
                  ? "Your request has been saved securely for follow-up."
                  : "Nothing was transmitted. Connect Supabase to activate secure enquiry storage."}</p>
                <button className="secondary-button" type="button" onClick={() => setLeadOpen(false)}>Close</button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
