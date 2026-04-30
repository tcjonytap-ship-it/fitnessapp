"use client";

import { useState } from "react";

type Tab = "bmi" | "tdee" | "macros" | "bodyfat" | "orm" | "heartrate" | "ibw" | "water";

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
    green:  "bg-emerald-50 border-emerald-200 text-emerald-800",
    blue:   "bg-blue-50 border-blue-200 text-blue-800",
    orange: "bg-orange-50 border-orange-200 text-orange-800",
    red:    "bg-red-50 border-red-200 text-red-800",
    purple: "bg-purple-50 border-purple-200 text-purple-800",
  };
  return (
    <div className={`border rounded-2xl p-5 ${styles[color] ?? styles.green}`}>
      <div className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">{label}</div>
      <div className="text-3xl font-extrabold tracking-tight">
        {value}{unit && <span className="text-base font-semibold opacity-60 ml-1.5">{unit}</span>}
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
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        step={step}
        className="border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm transition"
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
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition appearance-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function CalcButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg mt-2 cursor-pointer text-sm tracking-wide"
    >
      Calculate
    </button>
  );
}

function Empty() {
  return (
    <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-3">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl">📊</div>
      <p className="text-sm">Fill in the fields and press Calculate</p>
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
    if (bmi < 18.5)             { category = "Underweight"; color = "blue"; }
    else if (bmi >= 25 && bmi < 30) { category = "Overweight"; color = "orange"; }
    else if (bmi >= 30)         { category = "Obese"; color = "red"; }
    setRes({ bmi: Math.round(bmi * 10) / 10, category, color });
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Dropdown label="Unit System" value={unit} onChange={setUnit} options={[
          { value: "metric",   label: "Metric (kg, cm)" },
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
          <div className="space-y-3">
            <ResultCard label="Your BMI" value={res.bmi} color={res.color} />
            <ResultCard label="Category" value={res.category} color={res.color} />
            <div className="bg-slate-50 rounded-2xl p-4 space-y-2 mt-2">
              {[
                { label: "Underweight", range: "< 18.5" },
                { label: "Normal weight", range: "18.5 – 24.9" },
                { label: "Overweight", range: "25 – 29.9" },
                { label: "Obese", range: "≥ 30" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-xs text-slate-500">
                  <span>{row.label}</span><span className="font-semibold">{row.range}</span>
                </div>
              ))}
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
          { value: "metric",   label: "Metric (kg, cm)" },
          { value: "imperial", label: "Imperial (lbs, inches)" },
        ]} />
        <Dropdown label="Gender" value={gender} onChange={setGender} options={[
          { value: "male", label: "Male" }, { value: "female", label: "Female" },
        ]} />
        <Field label="Age" value={age} onChange={setAge} min={10} max={100} />
        <Field label={unit === "metric" ? "Weight (kg)" : "Weight (lbs)"} value={weight} onChange={setWeight} min={1} />
        <Field label={unit === "metric" ? "Height (cm)" : "Height (inches)"} value={height} onChange={setHeight} min={50} />
        <Dropdown label="Activity Level" value={activity} onChange={setActivity} options={[
          { value: "1.2",   label: "Sedentary — desk job, no exercise" },
          { value: "1.375", label: "Lightly active — 1–3 days/week" },
          { value: "1.55",  label: "Moderately active — 3–5 days/week" },
          { value: "1.725", label: "Very active — 6–7 days/week" },
          { value: "1.9",   label: "Extremely active — physical job + exercise" },
        ]} />
        <CalcButton onClick={calc} />
      </div>
      <div>
        {res ? (
          <div className="space-y-3">
            <ResultCard label="BMR" value={res.bmr} unit="kcal / day" color="blue" />
            <ResultCard label="TDEE" value={res.tdee} unit="kcal / day" color="green" />
            <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
              {[
                { label: "Weight Loss (−500 kcal)", val: res.tdee - 500, color: "text-blue-600" },
                { label: "Maintain",                val: res.tdee,       color: "text-emerald-600" },
                { label: "Weight Gain (+500 kcal)", val: res.tdee + 500, color: "text-orange-600" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">{row.label}</span>
                  <span className={`font-bold ${row.color}`}>{row.val} kcal</span>
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
    if (goal === "cut")  kcal -= 500;
    if (goal === "bulk") kcal += 500;
    const [p, c, f] = splits[diet];
    setRes({
      kcal:    Math.round(kcal),
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
            <ResultCard label="Adjusted Calories" value={res.kcal} unit="kcal / day" color="blue" />
            <ResultCard label="Protein"            value={res.protein} unit="g / day"   color="green" />
            <ResultCard label="Carbohydrates"      value={res.carbs}   unit="g / day"   color="orange" />
            <ResultCard label="Fat"                value={res.fat}     unit="g / day"   color="purple" />
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
      if (bf < 6)       { category = "Essential Fat"; color = "blue"; }
      else if (bf < 14) { category = "Athletic";      color = "green"; }
      else if (bf < 18) { category = "Fitness";       color = "green"; }
      else if (bf < 25) { category = "Average";       color = "orange"; }
      else              { category = "Obese";         color = "red"; }
    } else {
      if (bf < 14)      { category = "Essential Fat"; color = "blue"; }
      else if (bf < 21) { category = "Athletic";      color = "green"; }
      else if (bf < 25) { category = "Fitness";       color = "green"; }
      else if (bf < 32) { category = "Average";       color = "orange"; }
      else              { category = "Obese";         color = "red"; }
    }
    setRes({ bf, lean, category, color });
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <p className="text-xs text-slate-400 bg-slate-50 rounded-xl px-4 py-2.5 font-medium">
          US Navy method — all measurements in centimeters
        </p>
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
            <div className="bg-slate-50 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-400 tracking-wider">
                    <th className="text-left px-4 py-3 font-semibold">%</th>
                    <th className="text-right px-4 py-3 font-semibold">Weight</th>
                    <th className="text-right px-4 py-3 font-semibold">Reps</th>
                  </tr>
                </thead>
                <tbody>
                  {res.rows.map(({ pct, w, repRange }) => (
                    <tr key={pct} className="border-b border-slate-100 last:border-0 hover:bg-slate-100 transition-colors">
                      <td className="px-4 py-2.5 font-semibold text-slate-700">{pct}%</td>
                      <td className="px-4 py-2.5 text-right font-bold text-emerald-700">{w}</td>
                      <td className="px-4 py-2.5 text-right text-slate-400 text-xs">{repRange}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
      { name: "Zone 1 — Warm Up",   ...zone(0.50, 0.60), style: "bg-sky-50 border border-sky-200 text-sky-800",          desc: "Very light · recovery" },
      { name: "Zone 2 — Fat Burn",  ...zone(0.60, 0.70), style: "bg-emerald-50 border border-emerald-200 text-emerald-800", desc: "Light · base endurance" },
      { name: "Zone 3 — Aerobic",   ...zone(0.70, 0.80), style: "bg-yellow-50 border border-yellow-200 text-yellow-800",  desc: "Moderate · improve fitness" },
      { name: "Zone 4 — Anaerobic", ...zone(0.80, 0.90), style: "bg-orange-50 border border-orange-200 text-orange-800",  desc: "Hard · increase performance" },
      { name: "Zone 5 — Maximum",   ...zone(0.90, 1.00), style: "bg-red-50 border border-red-200 text-red-800",           desc: "Maximum · short bursts" },
    ];
    setRes({ mhr, zones });
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Field label="Age" value={age} onChange={setAge} min={10} max={100} />
        <Field label="Resting Heart Rate (bpm) — optional" value={rhr} onChange={setRhr} min={30} max={100} />
        <p className="text-xs text-slate-400 bg-slate-50 rounded-xl px-4 py-2.5 font-medium">
          Adding resting HR enables the more accurate Karvonen formula
        </p>
        <CalcButton onClick={calc} />
      </div>
      <div>
        {res ? (
          <div className="space-y-3">
            <ResultCard label="Max Heart Rate" value={res.mhr} unit="bpm" color="red" />
            <div className="space-y-2">
              {res.zones.map((z) => (
                <div key={z.name} className={`rounded-2xl px-4 py-3 ${z.style}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-sm">{z.name}</div>
                      <div className="text-xs opacity-60 mt-0.5">{z.desc}</div>
                    </div>
                    <div className="text-sm font-extrabold whitespace-nowrap">{z.min}–{z.max} bpm</div>
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
      setRes({ devine: r(50.0 + 2.3 * over60), robinson: r(52.0 + 1.9 * over60), miller: r(56.2 + 1.41 * over60), hamwi: r(48.0 + 2.7 * over60) });
    } else {
      setRes({ devine: r(45.5 + 2.3 * over60), robinson: r(49.0 + 1.7 * over60), miller: r(53.1 + 1.36 * over60), hamwi: r(45.5 + 2.2 * over60) });
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
            <ResultCard label="Devine Formula"   value={res.devine}   unit="kg" color="green" />
            <ResultCard label="Robinson Formula" value={res.robinson} unit="kg" color="blue" />
            <ResultCard label="Miller Formula"   value={res.miller}   unit="kg" color="purple" />
            <ResultCard label="Hamwi Formula"    value={res.hamwi}    unit="kg" color="orange" />
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
          { value: "kg",  label: "Kilograms (kg)" },
          { value: "lbs", label: "Pounds (lbs)" },
        ]} />
        <Field label={`Body Weight (${unit})`} value={weight} onChange={setWeight} min={20} max={300} />
        <Dropdown label="Activity Level" value={activity} onChange={setActivity} options={[
          { value: "sedentary",  label: "Sedentary" },
          { value: "moderate",   label: "Moderately Active" },
          { value: "active",     label: "Active (3–5x / week)" },
          { value: "veryactive", label: "Very Active (6–7x / week)" },
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
            <ResultCard label="Daily Water Intake"    value={res.liters} unit="liters"  color="blue" />
            <ResultCard label="In Fluid Ounces"       value={res.oz}     unit="fl oz"   color="blue" />
            <ResultCard label="Glasses (250 ml each)" value={res.glasses} unit="glasses" color="green" />
          </div>
        ) : <Empty />}
      </div>
    </div>
  );
}

// ── Config ────────────────────────────────────────────────────────────────────

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

const CALCS: Record<Tab, { title: string; description: string; emoji: string; Component: React.FC }> = {
  bmi:       { title: "BMI Calculator",        description: "Body Mass Index based on height and weight.",                      emoji: "⚖️",  Component: BMICalc },
  tdee:      { title: "TDEE Calculator",       description: "Total Daily Energy Expenditure — Mifflin-St Jeor formula.",        emoji: "🔥",  Component: TDEECalc },
  macros:    { title: "Macro Calculator",      description: "Daily protein, carb, and fat targets for your goal.",              emoji: "🍽️",  Component: MacrosCalc },
  bodyfat:   { title: "Body Fat %",            description: "Estimate body fat percentage using the US Navy method.",           emoji: "📏",  Component: BodyFatCalc },
  orm:       { title: "One Rep Max (1RM)",      description: "Estimate your max lift with a full percentage table.",             emoji: "🏋️",  Component: ORMCalc },
  heartrate: { title: "Heart Rate Zones",      description: "Training zones based on age — plus optional Karvonen formula.",    emoji: "❤️",  Component: HeartRateCalc },
  ibw:       { title: "Ideal Body Weight",     description: "Healthy weight targets via four established medical formulas.",    emoji: "🎯",  Component: IBWCalc },
  water:     { title: "Daily Water Intake",    description: "Recommended hydration based on body weight and lifestyle.",        emoji: "💧",  Component: WaterCalc },
};

const STATS = [
  { value: "8", label: "Calculators" },
  { value: "100%", label: "Free" },
  { value: "0", label: "Sign-ups needed" },
  { value: "Instant", label: "Results" },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const [active, setActive] = useState<Tab>("bmi");
  const { title, description, emoji, Component } = CALCS[active];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-emerald-950 text-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">Science-based · Free · Instant</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight mb-4">
              Your Complete<br />
              <span className="text-emerald-400">Fitness Calculator</span> Suite
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              BMI, TDEE, Macros, Body Fat, 1 Rep Max, Heart Rate Zones, Ideal Weight, and Water Intake — all in one place. No account required.
            </p>
            <div className="flex flex-wrap gap-3">
              {STATS.map((s) => (
                <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-3 min-w-[90px] text-center">
                  <div className="text-2xl font-extrabold text-white">{s.value}</div>
                  <div className="text-emerald-300 text-xs font-medium mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Tab bar */}
        <div className="flex overflow-x-auto gap-2 pb-3 scrollbar-hide -mx-1 px-1 mb-6">
          {TABS.map(({ id, emoji: tabEmoji, label }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                active === id
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 shadow-sm"
              }`}
            >
              <span className="text-base">{tabEmoji}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Calculator card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className="border-b border-slate-100 px-8 py-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl shrink-0">
              {emoji}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 leading-tight">{title}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{description}</p>
            </div>
          </div>
          <div className="px-8 py-8">
            <Component />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 text-sm text-amber-800 text-center">
          Results are for informational purposes only and do not constitute medical advice. Consult a healthcare professional for personal guidance.
        </div>
      </div>
    </>
  );
}
