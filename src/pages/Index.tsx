import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/5094cf99-2172-42bb-b8d1-3dc41e02829d/files/2febaeb5-009a-4d26-a6fb-577c02edca4d.jpg";
const TEAM_IMAGE = "https://cdn.poehali.dev/projects/5094cf99-2172-42bb-b8d1-3dc41e02829d/files/3c6daaf5-3487-4374-8549-2ec9cad2aded.jpg";

function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function useCountUp(target: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCard({ value, suffix, label, start }: { value: number; suffix: string; label: string; start: boolean }) {
  const count = useCountUp(value, 1800, start);
  return (
    <div className="text-center">
      <div className="text-5xl font-display font-bold text-[hsl(var(--gold))]">
        {count}{suffix}
      </div>
      <div className="mt-2 text-sm text-blue-200 font-body">{label}</div>
    </div>
  );
}

const navItems = [
  { label: "Главная", href: "#hero" },
  { label: "О нас", href: "#about" },
  { label: "Услуги", href: "#services" },
  { label: "Калькулятор", href: "#calculator" },
  { label: "Отзывы", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Контакты", href: "#contacts" },
];

const services = [
  {
    icon: "Search",
    title: "Аудит пенсионных расчётов",
    desc: "Детальная проверка начисленной пенсии на соответствие нормам закона. Выявляем ошибки и недоплаты.",
    price: "от 3 500 ₽",
  },
  {
    icon: "FileText",
    title: "Оспаривание расчётов",
    desc: "Подготовка документов и представление интересов клиента в ПФР и судебных инстанциях.",
    price: "от 8 000 ₽",
  },
  {
    icon: "TrendingUp",
    title: "Стратегия выхода на пенсию",
    desc: "Индивидуальный план для максимизации пенсионных выплат с учётом стажа и заработка.",
    price: "от 5 000 ₽",
  },
  {
    icon: "Shield",
    title: "Защита пенсионных прав",
    desc: "Юридическое сопровождение при спорах с Социальным фондом России. Полный контроль процесса.",
    price: "от 12 000 ₽",
  },
  {
    icon: "BookOpen",
    title: "Консультация специалиста",
    desc: "Персональная консультация по вопросам пенсионного законодательства и вашей ситуации.",
    price: "от 1 500 ₽",
  },
  {
    icon: "Award",
    title: "Проверка льготного стажа",
    desc: "Анализ права на досрочную пенсию по профессии, вредности или особым условиям труда.",
    price: "от 4 000 ₽",
  },
];

const reviews = [
  {
    name: "Галина Петровна М.",
    age: "67 лет",
    text: "После аудита обнаружили недоплату за 3 года — 87 000 рублей. Всё вернули через суд. Специалисты работают чётко и профессионально.",
    stars: 5,
    result: "+87 000 ₽",
  },
  {
    name: "Виктор Иванович С.",
    age: "62 года",
    text: "Помогли правильно учесть льготный стаж, который СФР отказывался признавать. Пенсия увеличилась на 4 200 рублей в месяц.",
    stars: 5,
    result: "+4 200 ₽/мес",
  },
  {
    name: "Тамара Алексеевна Б.",
    age: "59 лет",
    text: "Составили стратегию выхода на пенсию. Оказалось, мне выгоднее уйти на год позже — прибавка составит 18% к пенсии. Очень благодарна!",
    stars: 5,
    result: "+18% к пенсии",
  },
];

const faqItems = [
  {
    q: "Как понять, правильно ли мне начислили пенсию?",
    a: "Самостоятельно проверить сложно — расчёт зависит от десятков факторов: стажа, ИПК, периодов льгот. Наши специалисты проводят полный аудит за 3–5 рабочих дней.",
  },
  {
    q: "Можно ли вернуть недоплаченную пенсию?",
    a: "Да. Если выявлена ошибка, возможен пересчёт и доплата за весь период — через административную процедуру или суд. Срок исковой давности — 3 года, но при ошибке ПФР возможен перерасчёт за всё время.",
  },
  {
    q: "Что такое льготный стаж и зачем его проверять?",
    a: "Льготный стаж даёт право на досрочную пенсию или повышенный коэффициент. Часто работодатели неправильно оформляли записи, из-за чего СФР отказывает в льготах — это можно оспорить.",
  },
  {
    q: "Сколько времени занимает аудит?",
    a: "Базовый аудит расчётов — 3–5 рабочих дней. При необходимости судебного оспаривания срок зависит от суда, обычно 3–6 месяцев.",
  },
  {
    q: "Нужно ли приезжать лично?",
    a: "Нет. Работаем удалённо по всей России. Документы принимаем в электронном виде, консультации проводим по телефону или видеосвязи.",
  },
];

export default function Index() {
  useScrollAnimation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [calc, setCalc] = useState({ age: 60, salary: 50000, years: 30 });
  const pension = Math.round(
    (calc.salary * 0.22 * calc.years * (1 + (calc.age - 60) * 0.036)) / 12
  );
  const pensionFormatted = Math.max(pension, 8000).toLocaleString("ru-RU");

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen font-body bg-[hsl(var(--background))]">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--navy))]/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Icon name="Scale" size={22} className="text-[hsl(var(--gold))]" />
            <span className="font-display text-xl font-semibold text-white">
              Пенсион<span className="text-[hsl(var(--gold))]">Аудит</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="text-sm text-blue-100 hover:text-[hsl(var(--gold))] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollTo("#contacts")}
            className="hidden lg:block px-5 py-2 bg-[hsl(var(--gold))] text-[hsl(var(--navy))] text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Бесплатная консультация
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-white"
          >
            <Icon name={mobileOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden bg-[hsl(var(--navy))] border-t border-white/10 px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="block w-full text-left text-blue-100 hover:text-[hsl(var(--gold))] py-2 text-sm transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("#contacts")}
              className="w-full py-2 bg-[hsl(var(--gold))] text-[hsl(var(--navy))] text-sm font-semibold rounded-lg"
            >
              Бесплатная консультация
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--navy))]/95 via-[hsl(var(--navy))]/80 to-[hsl(var(--navy))]/30" />

        <div className="relative container mx-auto px-4 pt-24 pb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--gold))]/15 border border-[hsl(var(--gold))]/30 rounded-full mb-6 animate-fade-in">
              <Icon name="Shield" size={14} className="text-[hsl(var(--gold))]" />
              <span className="text-[hsl(var(--gold))] text-xs font-semibold tracking-wider uppercase">
                Профессиональный аудит пенсии
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in delay-100">
              Получите <span className="text-[hsl(var(--gold))]">каждый</span> заработанный рубль
            </h1>

            <p className="text-lg text-blue-100 mb-10 leading-relaxed animate-fade-in delay-200">
              Проверяем правильность расчёта пенсии, выявляем ошибки СФР и помогаем получить недоплаченные средства. Работаем по всей России.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-300">
              <button
                onClick={() => scrollTo("#contacts")}
                className="px-8 py-4 bg-[hsl(var(--gold))] text-[hsl(var(--navy))] font-bold rounded-xl hover:opacity-90 transition-all hover:scale-105 text-base"
              >
                Проверить мою пенсию
              </button>
              <button
                onClick={() => scrollTo("#calculator")}
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:border-[hsl(var(--gold))] hover:text-[hsl(var(--gold))] transition-all text-base"
              >
                Калькулятор пенсии
              </button>
            </div>

            <div className="mt-12 flex items-center gap-6 animate-fade-in delay-400">
              <div className="flex -space-x-2">
                {["👩‍💼","👨‍💼","👩‍⚕️","👴"].map((e, i) => (
                  <div key={i} className="w-9 h-9 rounded-full bg-[hsl(var(--navy-light))] border-2 border-[hsl(var(--gold))] flex items-center justify-center text-sm">
                    {e}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 text-[hsl(var(--gold))] text-sm">★★★★★</div>
                <p className="text-blue-200 text-xs mt-0.5">2 400+ успешных дел</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div ref={statsRef} className="bg-[hsl(var(--navy))] py-14">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard value={2400} suffix="+" label="клиентов получили перерасчёт" start={statsVisible} />
          <StatCard value={15} suffix=" лет" label="опыт в пенсионном праве" start={statsVisible} />
          <StatCard value={94} suffix="%" label="выигранных дел в суде" start={statsVisible} />
          <StatCard value={120} suffix=" млн" label="рублей возвращено клиентам" start={statsVisible} />
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="animate-on-scroll">
              <p className="text-xs font-semibold tracking-widest text-[hsl(var(--gold))] uppercase mb-3">О компании</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-[hsl(var(--navy))] leading-tight mb-6 gold-line">
                15 лет защищаем пенсионные права граждан
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                Мы — команда юристов и экономистов, специализирующихся исключительно на пенсионном праве. За годы работы мы провели аудит более 2 400 пенсионных дел и вернули клиентам свыше 120 миллионов рублей.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Ошибки в расчётах допускает каждый третий сотрудник СФР. Часто это не злой умысел, а сложность законодательства — но платит за это пенсионер. Мы знаем, как это исправить.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "Users", text: "Опытная команда из 18 специалистов" },
                  { icon: "MapPin", text: "Работаем по всей России" },
                  { icon: "Clock", text: "Результат за 3–5 рабочих дней" },
                  { icon: "Lock", text: "Полная конфиденциальность" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[hsl(var(--gold))]/15 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name={icon} size={16} className="text-[hsl(var(--gold))]" />
                    </div>
                    <p className="text-sm text-gray-700">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-on-scroll relative">
              <img
                src={TEAM_IMAGE}
                alt="Команда специалистов"
                className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
              />
              <div className="absolute -bottom-6 -left-6 bg-[hsl(var(--navy))] text-white rounded-2xl p-5 shadow-xl">
                <div className="font-display text-3xl font-bold text-[hsl(var(--gold))]">120 млн ₽</div>
                <div className="text-xs text-blue-200 mt-1">возвращено клиентам</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 bg-[hsl(var(--cream))]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <p className="text-xs font-semibold tracking-widest text-[hsl(var(--gold))] uppercase mb-3">Что мы делаем</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[hsl(var(--navy))] mb-4 gold-line-center">
              Наши услуги
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto mt-6">
              Комплексная защита ваших пенсионных прав — от аудита до победы в суде
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div
                key={s.title}
                className="animate-on-scroll bg-white rounded-2xl p-7 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group border border-gray-100"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 bg-[hsl(var(--navy))]/8 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[hsl(var(--gold))]/15 transition-colors">
                  <Icon name={s.icon} size={22} className="text-[hsl(var(--navy))] group-hover:text-[hsl(var(--gold))] transition-colors" />
                </div>
                <h3 className="font-display text-xl font-bold text-[hsl(var(--navy))] mb-3">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{s.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(var(--gold))] font-bold text-sm">{s.price}</span>
                  <button className="text-xs text-[hsl(var(--navy))] border border-[hsl(var(--navy))]/20 px-3 py-1.5 rounded-lg hover:bg-[hsl(var(--navy))] hover:text-white transition-all">
                    Подробнее
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" className="py-24 bg-[hsl(var(--navy))]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14 animate-on-scroll">
            <p className="text-xs font-semibold tracking-widest text-[hsl(var(--gold))] uppercase mb-3">Онлайн-инструмент</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Калькулятор пенсии
            </h2>
            <p className="text-blue-200 max-w-md mx-auto">
              Оцените примерный размер пенсии. Для точного расчёта — запишитесь на аудит.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white/8 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/15 animate-on-scroll">
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              {[
                {
                  label: "Возраст выхода на пенсию",
                  key: "age",
                  min: 55, max: 75, step: 1,
                  display: `${calc.age} лет`,
                },
                {
                  label: "Средняя зарплата (₽/мес)",
                  key: "salary",
                  min: 15000, max: 300000, step: 5000,
                  display: `${calc.salary.toLocaleString("ru-RU")} ₽`,
                },
                {
                  label: "Стаж (лет)",
                  key: "years",
                  min: 5, max: 45, step: 1,
                  display: `${calc.years} лет`,
                },
              ].map(({ label, key, min, max, step, display }) => (
                <div key={key}>
                  <label className="text-blue-200 text-sm block mb-2">{label}</label>
                  <div className="text-2xl font-display font-bold text-white mb-3">{display}</div>
                  <input
                    type="range"
                    min={min} max={max} step={step}
                    value={calc[key as keyof typeof calc]}
                    onChange={(e) => setCalc({ ...calc, [key]: Number(e.target.value) })}
                    className="w-full accent-[hsl(var(--gold))] cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-blue-300 mt-1">
                    <span>{min}</span><span>{max}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[hsl(var(--gold))]/15 border border-[hsl(var(--gold))]/30 rounded-2xl p-8 text-center">
              <p className="text-blue-200 text-sm mb-2">Ориентировочный размер пенсии</p>
              <div className="font-display text-6xl font-bold text-[hsl(var(--gold))] mb-2">
                {pensionFormatted} ₽
              </div>
              <p className="text-blue-300 text-xs mb-6">в месяц (предварительная оценка)</p>
              <button
                onClick={() => scrollTo("#contacts")}
                className="px-8 py-3 bg-[hsl(var(--gold))] text-[hsl(var(--navy))] font-bold rounded-xl hover:opacity-90 transition-all"
              >
                Получить точный расчёт бесплатно
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <p className="text-xs font-semibold tracking-widest text-[hsl(var(--gold))] uppercase mb-3">Истории успеха</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[hsl(var(--navy))] gold-line-center">
              Отзывы клиентов
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div
                key={r.name}
                className="animate-on-scroll bg-[hsl(var(--cream))] rounded-2xl p-8 border border-gray-100 relative"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="absolute top-6 right-6 bg-[hsl(var(--gold))]/15 border border-[hsl(var(--gold))]/30 rounded-xl px-3 py-1">
                  <span className="text-[hsl(var(--gold))] font-bold text-sm">{r.result}</span>
                </div>
                <div className="flex gap-0.5 text-[hsl(var(--gold))] text-base mb-4">
                  {"★".repeat(r.stars)}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 text-sm italic">"{r.text}"</p>
                <div>
                  <div className="font-semibold text-[hsl(var(--navy))] text-sm">{r.name}</div>
                  <div className="text-gray-400 text-xs">{r.age}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-[hsl(var(--cream))]">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16 animate-on-scroll">
            <p className="text-xs font-semibold tracking-widest text-[hsl(var(--gold))] uppercase mb-3">FAQ</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[hsl(var(--navy))] gold-line-center">
              Вопросы и ответы
            </h2>
          </div>

          <div className="space-y-3 animate-on-scroll">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-[hsl(var(--navy))] text-sm pr-4">{item.q}</span>
                  <Icon
                    name={openFaq === i ? "ChevronUp" : "ChevronDown"}
                    size={18}
                    className="text-[hsl(var(--gold))] flex-shrink-0"
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 bg-[hsl(var(--navy))]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14 animate-on-scroll">
              <p className="text-xs font-semibold tracking-widest text-[hsl(var(--gold))] uppercase mb-3">Связаться с нами</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                Бесплатная консультация
              </h2>
              <p className="text-blue-200">
                Оставьте заявку — перезвоним в течение 30 минут
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 animate-on-scroll">
              <div className="space-y-6">
                {[
                  { icon: "Phone", title: "Телефон", lines: ["+7 (800) 000-00-00", "Бесплатно по России"] },
                  { icon: "Mail", title: "Email", lines: ["info@pensionaudit.ru"] },
                  { icon: "Clock", title: "Режим работы", lines: ["Пн–Пт: 9:00–19:00", "Сб: 10:00–16:00"] },
                  { icon: "MapPin", title: "Адрес офиса", lines: ["Москва, ул. Тверская, 15", "Работаем и удалённо"] },
                ].map(({ icon, title, lines }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[hsl(var(--gold))]/15 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon name={icon} size={18} className="text-[hsl(var(--gold))]" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">{title}</div>
                      {lines.map((l, li) => (
                        <div key={li} className={`text-sm mt-0.5 ${li === 0 ? "text-blue-200" : "text-blue-300"}`}>{l}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl p-8">
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="text-blue-200 text-xs mb-1.5 block">Ваше имя</label>
                    <input
                      type="text"
                      placeholder="Иван Иванович"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-300 text-sm focus:outline-none focus:border-[hsl(var(--gold))] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-blue-200 text-xs mb-1.5 block">Телефон</label>
                    <input
                      type="tel"
                      placeholder="+7 (___) ___-__-__"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-300 text-sm focus:outline-none focus:border-[hsl(var(--gold))] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-blue-200 text-xs mb-1.5 block">Ваш вопрос (необязательно)</label>
                    <textarea
                      rows={3}
                      placeholder="Опишите вашу ситуацию..."
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-300 text-sm focus:outline-none focus:border-[hsl(var(--gold))] transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-[hsl(var(--gold))] text-[hsl(var(--navy))] font-bold rounded-xl hover:opacity-90 transition-all hover:scale-[1.02] text-base"
                  >
                    Записаться на консультацию
                  </button>
                  <p className="text-blue-300 text-xs text-center">
                    Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[hsl(var(--navy))]/90 border-t border-white/10 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Icon name="Scale" size={18} className="text-[hsl(var(--gold))]" />
            <span className="font-display text-lg text-white">
              Пенсион<span className="text-[hsl(var(--gold))]">Аудит</span>
            </span>
          </div>
          <p className="text-blue-300 text-xs text-center">
            © 2024 ПенсионАудит. Все права защищены. Не является офертой.
          </p>
          <div className="flex gap-4 text-xs text-blue-300">
            <a href="#" className="hover:text-[hsl(var(--gold))] transition-colors">Конфиденциальность</a>
            <a href="#" className="hover:text-[hsl(var(--gold))] transition-colors">Оферта</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
