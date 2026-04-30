"use client";

import { useState } from "react";

type Tab = "bmi" | "tdee" | "macros" | "bodyfat" | "orm" | "heartrate" | "ibw" | "water";

function AdSlot() {
  return (
    <div className="w-full my-6 flex items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded-lg h-20 text-gray-400 text-sm select-none">
      Advertisement — Google AdSense
    </div>
  );
}

function ResultCard({
  label,
  value,
  unit,
  color = "green",
}: {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
}) {
  const styles: Record<string, string> = {
    green: "bg-green-50 border-green-200 text-green-800",
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    orange: "bg-orange-50 border-orange-200 text-orange-800",
    red: "bg-red-50 border-red-200 text-red-800",
    purple: "bg-purple-50 border-purple-200 text-purple-800",
  };
  return (
    <div className={`border rounded-xl p-4 ${styles[color] ?? styles.green}`}>
      <div className="text-xs font-semibold uppercase tracking-wide opacity-60">{label}</div>
      <div className="text-2xl font-bold mt-1">
        {value} <span className="text-sm font-normal opacity-70">{unit}</span>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        step={step}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      />
    </div>
  );
}

function Dropdown({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CalcButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-3 rounded-xl transition-colors mt-2 cursor-pointer"
    >
      Calculate
    </button>
  );
}

function Empty() {
  return (
    <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
      Fill in the fields and press Calculate
    </div>
  );
}

// ── BMI ───────────────────────────────────────────────────────────────────────

function BMICalc() {
  const [unit, setUnit] = useState("metric");
  const [weight, setWeight] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [res, setRes] = useState<{ bmi: number; category: string; color: string } | null>(null);

  function calc() {
    let kg = parseFloat(weight);
    let m: number;
    if (unit === "metric") {
      m = parseFloat(heightCm) / 100;
    } else {
      kg *= 0.453592;
      m = ((parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0)) * 0.0254;
    }
    if (!kg || !m) return;
    const bmi = kg / (m * m);
    let category = "Normal weight", color = "green";
    if (bmi < 18.5) { category = "Underweight"; color = "blue"; }
    else if (bmi >= 25 && bmi < 30) { category = "Overweight"; color = "orange"; }
    else if (bmi >= 30) { category = "Obese"; color = "red"; }
    setRes({ bmi: Math.round(bmi * 10) / 10, category, color });
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Dropdown label="Unit System" value={unit} onChange={setUnit} options={[
          { value: "metric", label: "Metric (kg, cm)" },
          { value: "imperial", label: "Imperial (lbs, ft/in)" },
        ]} />
        <Field label={unit === "metric" ? "Weight (kg)" : "Weight (lbs)"} value={weight} onChange={setWeight} min={1} />
        {unit === "metric"
          ? <Field label="Height (cm)" value={heightCm} onChange={setHeightCm} min={50} max={300} />
          : <div className="grid grid-cols-2 gap-3">
              <Field label="Feet" value={heightFt} onChange={setHeightFt} min={1} max={9} />
              <Field label="Inches" value={heightIn} onChange={setHeightIn} min={0} max={11} />
            </div>
        }
        <CalcButton onClick={calc} />
      </div>
      <div>
        {res ? (
          <div className="space-y-4">
            <ResultCard label="Your BMI" value={res.bmi} color={res.color} />
            <ResultCard label="Category" value={res.category} color={res.color} />
            <div className="text-xs text-gray-500 space-y-1 mt-2">
              <div className="flex justify-between"><span>Underweight</span><span>&lt; 18.5</span></div>
              <div className="flex justify-between"><span>Normal weight</span><span>18.5 – 24.9</span></div>
              <div className="flex justify-between"><span>Overweight</span><span>25 – 29.9</span></div>
              <div className="flex justify-between"><span>Obese</span><span>≥ 30</span></div>
            </div>
          </div>
        ) : <Empty />}
      </div>
    </div>
  );
}

// ── TDEE ──────────────────────────────────────────────────────────────────────

function TDEECalc() {
  const [unit, setUnit] = useState("metric");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState("1.375");
  const [res, setRes] = useState<{ bmr: number; tdee: number } | null>(null);

  function calc() {
    let w = parseFloat(weight), h = parseFloat(height);
    const a = parseFloat(age);
    if (unit === "imperial") { w *= 0.453592; h *= 2.54; }
    if (!w || !h || !a) return;
    const bmr = gender === "male"
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;
    setRes({ bmr: Math.round(bmr), tdee: Math.round(bmr * parseFloat(activity)) });
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Dropdown label="Unit System" value={unit} onChange={setUnit} options={[
          { value: "metric", label: "Metric (kg, cm)" },
          { value: "imperial", label: "Imperial (lbs, inches)" },
        ]} />
        <Dropdown label="Gender" value={gender} onChange={setGender} options={[
          { value: "male", label: "Male" }, { value: "female", label: "Female" },
        ]} />
        <Field label="Age" value={age} onChange={setAge} min={10} max={100} />
        <Field label={unit === "metric" ? "Weight (kg)" : "Weight (lbs)"} value={weight} onChange={setWeight} min={1} />
        <Field label={unit === "metric" ? "Height (cm)" : "Height (inches)"} value={height} onChange={setHeight} min={50} />
        <Dropdown label="Activity Level" value={activity} onChange={setActivity} options={[
          { value: "1.2", label: "Sedentary — desk job, no exercise" },
          { value: "1.375", label: "Lightly active — 1–3 days/week" },
          { value: "1.55", label: "Moderately active — 3–5 days/week" },
          { value: "1.725", label: "Very active — 6–7 days/week" },
          { value: "1.9", label: "Extremely active — physical job + exercise" },
        ]} />
        <CalcButton onClick={calc} />
      </div>
      <div>
        {res ? (
          <div className="space-y-4">
            <ResultCard label="BMR (Basal Metabolic Rate)" value={res.bmr} unit="kcal/day" color="blue" />
            <ResultCard label="TDEE (Total Daily Energy)" value={res.tdee} unit="kcal/day" color="green" />
            <div className="space-y-2 text-sm">
              {[
                { label: "Weight Loss (−500 kcal)", val: res.tdee - 500 },
                { label: "Maintain", val: res.tdee },
                { label: "Weight Gain (+500 kcal)", val: res.tdee + 500 },
              ].map((row) => (
                <div key={row.label} className="flex justify-between px-3 py-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">{row.label}</span>
                  <span className="font-semibold">{row.val} kcal</span>
                </div>
              ))}
            </div>
          </div>
        ) : <Empty />}
      </div>
    </div>
  );
}

// ── Macros ────────────────────────────────────────────────────────────────────

function MacrosCalc() {
  const [calories, setCalories] = useState("");
  const [goal, setGoal] = useState("maintain");
  const [diet, setDiet] = useState("balanced");
  const [res, setRes] = useState<{ kcal: number; protein: number; carbs: number; fat: number } | null>(null);

  const splits: Record<string, [number, number, number]> = {
    balanced: [0.30, 0.40, 0.30],
    lowcarb:  [0.40, 0.20, 0.40],
    highprot: [0.45, 0.35, 0.20],
    keto:     [0.25, 0.05, 0.70],
  };

  function calc() {
    let kcal = parseFloat(calories);
    if (!kcal) return;
    if (goal === "cut") kcal -= 500;
    if (goal === "bulk") kcal += 500;
    const [p, c, f] = splits[diet];
    setRes({
      kcal: Math.round(kcal),
      protein: Math.round((kcal * p) / 4),
      carbs:   Math.round((kcal * c) / 4),
      fat:     Math.round((kcal * f) / 9),
    });
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Field label="Daily Calorie Intake (kcal)" value={calories} onChange={setCalories} min={500} max={10000} />
        <Dropdown label="Goal" value={goal} onChange={setGoal} options={[
          { value: "cut",      label: "Lose Weight (−500 kcal deficit)" },
          { value: "maintain", label: "Maintain Weight" },
          { value: "bulk",     label: "Gain Muscle (+500 kcal surplus)" },
        ]} />
        <Dropdown label="Diet Style" value={diet} onChange={setDiet} options={[
          { value: "balanced", label: "Balanced (30 / 40 / 30)" },
          { value: "lowcarb",  label: "Low Carb (40 / 20 / 40)" },
          { value: "highprot", label: "High Protein (45 / 35 / 20)" },
          { value: "keto",     label: "Keto (25 / 5 / 70)" },
        ]} />
        <CalcButton onClick={calc} />
      </div>
      <div>
        {res ? (
          <div className="space-y-3">
            <ResultCard label="Adjusted Calories" value={res.kcal} unit="kcal/day" color="blue" />
            <ResultCard label="Protein" value={res.protein} unit="g / day" color="green" />
            <ResultCard label="Carbohydrates" value={res.carbs} unit="g / day" color="orange" />
            <ResultCard label="Fat" value={res.fat} unit="g / day" color="purple" />
          </div>
        ) : <Empty />}
      </div>
    </div>
  );
}

// ── Body Fat ──────────────────────────────────────────────────────────────────

function BodyFatCalc() {
  const [gender, setGender] = useState("male");
  const [heightCm, setHeightCm] = useState("");
  const [neck, setNeck] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [res, setRes] = useState<{ bf: number; lean: number; category: string; color: string } | null>(null);

  function calc() {
    const h = parseFloat(heightCm), n = parseFloat(neck), w = parseFloat(waist), hi = parseFloat(hip);
    if (!h || !n || !w) return;
    let bf: number;
    if (gender === "male") {
      bf = 86.01 * Math.log10(w - n) - 70.041 * Math.log10(h) + 36.76;
    } else {
      if (!hi) return;
      bf = 163.205 * Math.log10(w + hi - n) - 97.684 * Math.log10(h) - 78.387;
    }
    bf = Math.round(bf * 10) / 10;
    const lean = Math.round((100 - bf) * 10) / 10;
    let category = "Fitness", color = "green";
    if (gender === "male") {
      if (bf < 6)        { category = "Essential Fat"; color = "blue"; }
      else if (bf < 14)  { category = "Athletic";      color = "green"; }
      else if (bf < 18)  { category = "Fitness";       color = "green"; }
      else if (bf < 25)  { category = "Average";       color = "orange"; }
      else               { category = "Obese";         color = "red"; }
    } else {
      if (bf < 14)       { category = "Essential Fat"; color = "blue"; }
      else if (bf < 21)  { category = "Athletic";      color = "green"; }
      else if (bf < 25)  { category = "Fitness";       color = "green"; }
      else if (bf < 32)  { category = "Average";       color = "orange"; }
      else               { category = "Obese";         color = "red"; }
    }
    setRes({ bf, lean, category, color });
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <p className="text-xs text-gray-500">US Navy method. All measurements in centimeters.</p>
        <Dropdown label="Gender" value={gender} onChange={setGender} options={[
          { value: "male", label: "Male" }, { value: "female", label: "Female" },
        ]} />
        <Field label="Height (cm)" value={heightCm} onChange={setHeightCm} min={100} max={250} />
        <Field label="Neck circumference (cm)" value={neck} onChange={setNeck} min={20} max={70} />
        <Field label="Waist circumference (cm)" value={waist} onChange={setWaist} min={40} max={200} />
        {gender === "female" && (
          <Field label="Hip circumference (cm)" value={hip} onChange={setHip} min={50} max={200} />
        )}
        <CalcButton onClick={calc} />
      </div>
      <div>
        {res ? (
          <div className="space-y-3">
            <ResultCard label="Body Fat" value={res.bf} unit="%" color={res.color} />
            <ResultCard label="Lean Mass" value={res.lean} unit="%" color="green" />
            <ResultCard label="Category" value={res.category} color={res.color} />
          </div>
        ) : <Empty />}
      </div>
    </div>
  );
}

// ── One Rep Max ───────────────────────────────────────────────────────────────

function ORMCalc() {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [res, setRes] = useState<{ orm: number; rows: { pct: number; w: number; repRange: string }[] } | null>(null);

  function calc() {
    const w = parseFloat(weight), r = parseInt(reps);
    if (!w || !r || r < 1) return;
    const orm = r === 1 ? w : w * (1 + r / 30);
    const rows = [100, 95, 90, 85, 80, 75, 70, 65, 60].map((pct) => ({
      pct,
      w: Math.round((orm * pct) / 100),
      repRange: pct >= 100 ? "1" : pct >= 95 ? "2" : pct >= 90 ? "3" : pct >= 85 ? "4–5" : pct >= 80 ? "6" : pct >= 75 ? "8" : pct >= 70 ? "10–12" : "12+",
    }));
    setRes({ orm: Math.round(orm), rows });
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Field label="Weight Lifted (kg or lbs)" value={weight} onChange={setWeight} min={1} />
        <Field label="Reps Performed" value={reps} onChange={setReps} min={1} max={30} />
        <CalcButton onClick={calc} />
      </div>
      <div>
        {res ? (
          <div className="space-y-4">
            <ResultCard label="Estimated 1 Rep Max" value={res.orm} unit="kg / lbs" color="green" />
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b text-xs uppercase">
                  <th className="text-left py-2">%</th>
                  <th className="text-right py-2">Weight</th>
                  <th className="text-right py-2">Reps</th>
                </tr>
              </thead>
              <tbody>
                {res.rows.map(({ pct, w, repRange }) => (
                  <tr key={pct} className="border-b border-gray-100">
                    <td className="py-1.5 font-medium">{pct}%</td>
                    <td className="py-1.5 text-right font-semibold">{w}</td>
                    <td className="py-1.5 text-right text-gray-500">{repRange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <Empty />}
      </div>
    </div>
  );
}

// ── Heart Rate ────────────────────────────────────────────────────────────────

function HeartRateCalc() {
  const [age, setAge] = useState("");
  const [rhr, setRhr] = useState("");
  const [res, setRes] = useState<{ mhr: number; zones: { name: string; min: number; max: number; style: string; desc: string }[] } | null>(null);

  function calc() {
    const a = parseInt(age), r = parseInt(rhr || "0");
    if (!a) return;
    const mhr = 220 - a;
    const hrr = r > 0 ? mhr - r : null;
    function zone(lo: number, hi: number) {
      if (hrr !== null) return { min: Math.round(hrr * lo + r), max: Math.round(hrr * hi + r) };
      return { min: Math.round(mhr * lo), max: Math.round(mhr * hi) };
    }
    const zones = [
      { name: "Zone 1 — Warm Up",    ...zone(0.50, 0.60), style: "bg-sky-100 text-sky-800",      desc: "Very light • recovery" },
      { name: "Zone 2 — Fat Burn",   ...zone(0.60, 0.70), style: "bg-green-100 text-green-800",  desc: "Light • base endurance" },
      { name: "Zone 3 — Aerobic",    ...zone(0.70, 0.80), style: "bg-yellow-100 text-yellow-800",desc: "Moderate • improve fitness" },
      { name: "Zone 4 — Anaerobic",  ...zone(0.80, 0.90), style: "bg-orange-100 text-orange-800",desc: "Hard • increase performance" },
      { name: "Zone 5 — Maximum",    ...zone(0.90, 1.00), style: "bg-red-100 text-red-800",      desc: "Maximum • short bursts" },
    ];
    setRes({ mhr, zones });
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Field label="Age" value={age} onChange={setAge} min={10} max={100} />
        <Field label="Resting Heart Rate (bpm) — optional" value={rhr} onChange={setRhr} min={30} max={100} />
        <p className="text-xs text-gray-500">
          Providing resting HR enables the more accurate Karvonen formula.
        </p>
        <CalcButton onClick={calc} />
      </div>
      <div>
        {res ? (
          <div className="space-y-3">
            <ResultCard label="Max Heart Rate" value={res.mhr} unit="bpm" color="red" />
            <div className="space-y-2">
              {res.zones.map((z) => (
                <div key={z.name} className={`rounded-xl px-4 py-3 ${z.style}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-sm">{z.name}</div>
                      <div className="text-xs opacity-70">{z.desc}</div>
                    </div>
                    <div className="text-sm font-bold whitespace-nowrap">{z.min}–{z.max} bpm</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : <Empty />}
      </div>
    </div>
  );
}

// ── Ideal Body Weight ─────────────────────────────────────────────────────────

function IBWCalc() {
  const [gender, setGender] = useState("male");
  const [heightCm, setHeightCm] = useState("");
  const [res, setRes] = useState<{ devine: number; robinson: number; miller: number; hamwi: number } | null>(null);

  function calc() {
    const h = parseFloat(heightCm);
    if (!h) return;
    const over60 = Math.max(0, h / 2.54 - 60);
    const r = (v: number) => Math.round(v * 10) / 10;
    if (gender === "male") {
      setRes({
        devine:   r(50.0 + 2.3  * over60),
        robinson: r(52.0 + 1.9  * over60),
        miller:   r(56.2 + 1.41 * over60),
        hamwi:    r(48.0 + 2.7  * over60),
      });
    } else {
      setRes({
        devine:   r(45.5 + 2.3  * over60),
        robinson: r(49.0 + 1.7  * over60),
        miller:   r(53.1 + 1.36 * over60),
        hamwi:    r(45.5 + 2.2  * over60),
      });
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Dropdown label="Gender" value={gender} onChange={setGender} options={[
          { value: "male", label: "Male" }, { value: "female", label: "Female" },
        ]} />
        <Field label="Height (cm)" value={heightCm} onChange={setHeightCm} min={100} max={250} />
        <CalcButton onClick={calc} />
      </div>
      <div>
        {res ? (
          <div className="space-y-3">
            <ResultCard label="Devine Formula" value={res.devine} unit="kg" color="green" />
            <ResultCard label="Robinson Formula" value={res.robinson} unit="kg" color="blue" />
            <ResultCard label="Miller Formula" value={res.miller} unit="kg" color="purple" />
            <ResultCard label="Hamwi Formula" value={res.hamwi} unit="kg" color="orange" />
          </div>
        ) : <Empty />}
      </div>
    </div>
  );
}

// ── Water Intake ──────────────────────────────────────────────────────────────

function WaterCalc() {
  const [unit, setUnit] = useState("kg");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("moderate");
  const [climate, setClimate] = useState("normal");
  const [res, setRes] = useState<{ liters: number; oz: number; glasses: number } | null>(null);

  function calc() {
    let w = parseFloat(weight);
    if (!w) return;
    if (unit === "lbs") w *= 0.453592;
    let ml = w * 35;
    if (activity === "active")     ml += 500;
    if (activity === "veryactive") ml += 1000;
    if (climate === "hot")         ml += 500;
    const liters = Math.round((ml / 1000) * 10) / 10;
    setRes({ liters, oz: Math.round(liters * 33.814), glasses: Math.round(liters * 4) });
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Dropdown label="Weight Unit" value={unit} onChange={setUnit} options={[
          { value: "kg", label: "Kilograms (kg)" },
          { value: "lbs", label: "Pounds (lbs)" },
        ]} />
        <Field label={`Body Weight (${unit})`} value={weight} onChange={setWeight} min={20} max={300} />
        <Dropdown label="Activity Level" value={activity} onChange={setActivity} options={[
          { value: "sedentary",   label: "Sedentary" },
          { value: "moderate",    label: "Moderately Active" },
          { value: "active",      label: "Active (3–5x / week)" },
          { value: "veryactive",  label: "Very Active (6–7x / week)" },
        ]} />
        <Dropdown label="Climate" value={climate} onChange={setClimate} options={[
          { value: "normal", label: "Temperate / Normal" },
          { value: "hot",    label: "Hot / Humid" },
        ]} />
        <CalcButton onClick={calc} />
      </div>
      <div>
        {res ? (
          <div className="space-y-3">
            <ResultCard label="Daily Water Intake" value={res.liters} unit="liters" color="blue" />
            <ResultCard label="In Fluid Ounces" value={res.oz} unit="fl oz" color="blue" />
            <ResultCard label="Glasses (250 ml each)" value={res.glasses} unit="glasses" color="green" />
          </div>
        ) : <Empty />}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

const TABS: { id: Tab; emoji: string; label: string }[] = [
  { id: "bmi",       emoji: "⚖️",  label: "BMI" },
  { id: "tdee",      emoji: "🔥",  label: "TDEE" },
  { id: "macros",    emoji: "🍽️",  label: "Macros" },
  { id: "bodyfat",   emoji: "📏",  label: "Body Fat" },
  { id: "orm",       emoji: "🏋️",  label: "1 Rep Max" },
  { id: "heartrate", emoji: "❤️",  label: "Heart Rate" },
  { id: "ibw",       emoji: "🎯",  label: "Ideal Weight" },
  { id: "water",     emoji: "💧",  label: "Water" },
];

const CALCS: Record<Tab, { title: string; description: string; Component: React.FC }> = {
  bmi:       { title: "BMI Calculator",          description: "Body Mass Index based on height and weight.",                   Component: BMICalc },
  tdee:      { title: "TDEE Calculator",         description: "Total Daily Energy Expenditure — Mifflin-St Jeor formula.",     Component: TDEECalc },
  macros:    { title: "Macro Calculator",        description: "Daily protein, carb, and fat targets for your goal.",           Component: MacrosCalc },
  bodyfat:   { title: "Body Fat % Calculator",   description: "Estimate body fat percentage using the US Navy method.",        Component: BodyFatCalc },
  orm:       { title: "One Rep Max (1RM)",        description: "Estimate your maximum lift with an Epley percentage table.",    Component: ORMCalc },
  heartrate: { title: "Heart Rate Zones",        description: "Training heart rate zones based on age (+ optional resting HR).", Component: HeartRateCalc },
  ibw:       { title: "Ideal Body Weight",       description: "Healthy weight targets using four medical formulas.",            Component: IBWCalc },
  water:     { title: "Daily Water Intake",      description: "Recommended hydration based on body weight and lifestyle.",     Component: WaterCalc },
};

const AFFILIATE = [
  { name: "Protein Powder",    icon: "🥤", tag: "Best Seller" },
  { name: "Fitness Tracker",   icon: "⌚", tag: "Top Rated"   },
  { name: "Resistance Bands",  icon: "🪢", tag: "Budget Pick" },
  { name: "Yoga Mat",          icon: "🧘", tag: "Editor's Pick" },
];

export default function Home() {
  const [active, setActive] = useState<Tab>("bmi");
  const { title, description, Component } = CALCS[active];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-emerald-700 text-white py-5 px-4 shadow-md">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight">💪 FitCalc</h1>
          <p className="text-emerald-200 text-sm mt-0.5">Free fitness calculators — all in one place</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4">
        {/* Top Ad */}
        <AdSlot />

        {/* Tab Bar */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-1 px-1">
          {TABS.map(({ id, emoji, label }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                active === id
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-emerald-50 border border-gray-200"
              }`}
            >
              <span>{emoji}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-4">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 mt-1 mb-6">{description}</p>
          <Component />
        </div>

        {/* Mid Ad */}
        <AdSlot />

        {/* Affiliate Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Recommended Products
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {AFFILIATE.map(({ name, icon, tag }) => (
              <a
                key={name}
                href="#"
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-center"
              >
                <span className="text-3xl">{icon}</span>
                <span className="text-sm font-medium text-gray-800">{name}</span>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{tag}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Ad */}
        <AdSlot />
      </div>

      <footer className="border-t border-gray-200 py-6 text-center text-xs text-gray-400 mt-4">
        <p>FitCalc — Free fitness calculators for informational purposes only.</p>
        <p className="mt-1">Not medical advice. Consult a healthcare professional for personal guidance.</p>
      </footer>
    </div>
  );
}
