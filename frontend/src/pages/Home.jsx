import { motion } from "framer-motion";

import { Link } from "react-router-dom";

import {
  FaArrowRight,
  FaGem,
  FaShieldAlt,
  FaStore,
  FaTruck,
} from "react-icons/fa";

import { SectionLabel } from "../components/ui/badge";

import CountUp from "../components/CountUp";

import usePageMeta from "../hooks/usePageMeta";

/* ===================================================== */
/* ============== ENTRANCE ANIMATION VARIANTS ========== */
/* ===================================================== */

const easeOut = [0.16, 1, 0.3, 1];

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const viewport = {
  once: true,
  amount: 0.15,
  margin: "-60px",
};

/* ===================================================== */
/* ==================== FEATURE DATA =================== */
/* ===================================================== */

const FEATURES = [
  {
    icon: FaGem,
    title: "Premium Quality",
    text: "Every product is listed and shipped directly by its own merchant — quality straight from the source.",
  },
  {
    icon: FaTruck,
    title: "Fast Delivery",
    text: "Secure and reliable shipping across India.",
  },
  {
    icon: FaShieldAlt,
    title: "Trusted Marketplace",
    text: "Loved by thousands of shoppers buying from independent stores nationwide.",
  },
];

/* ===================================================== */
/* ===================== STATS DATA ==================== */
/* ===================================================== */

const STATS = [
  { value: 5000, suffix: "+", label: "Happy Customers" },
  { value: 200, suffix: "+", label: "Products Listed" },
  { value: 50, suffix: "+", label: "Partner Stores" },
  { value: 4.9, decimals: 1, label: "Average Rating" },
];

/* ===================================================== */
/* ================== MARQUEE DATA ===================== */
/* ===================================================== */

const MARQUEE = [
  "Fashion",
  "Electronics",
  "Home & Living",
  "Handcrafted",
  "Accessories",
  "Beauty & Care",
  "Toys & Games",
  "Books",
];

const Home = () => {

  usePageMeta(
    "Vendora — Marketplace of Independent Stores",
    "Discover products from independent merchants across every category. Shop directly from trusted stores on Vendora."
  );

  return (

    <div className="min-h-screen bg-background">

      {/* ===================================================== */}
      {/* ==================== HERO SECTION =================== */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden">

        {/* ambient radial glow */}

        <div className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-accent/5 blur-[150px]" />

        <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-36 grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">

          {/* LEFT CONTENT */}

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
          >

            <motion.div variants={fadeInUp}>

              <SectionLabel>

                Curated Marketplace

              </SectionLabel>

            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="mt-8 text-[2.75rem] md:text-6xl lg:text-[5.25rem] font-display leading-[1.05] tracking-[-0.02em] text-foreground"
            >

              Shop Everything From{" "}

              <span className="gradient-text">

                Independent Stores

              </span>

            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed"
            >

              Discover handcrafted goods,
              fashion, electronics, and home
              essentials — curated from
              independent merchants across
              every category.

            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >

              <Link
                to="/stores"
                className="gradient-bg text-white h-14 px-8 inline-flex items-center justify-center gap-2 rounded-xl text-base font-medium shadow-sm hover:shadow-accent hover:-translate-y-0.5 hover:brightness-110 transition-all duration-200 group active:scale-[0.98]"
              >

                Shop Now

                <FaArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />

              </Link>

              <Link
                to="/stores"
                className="h-14 px-8 inline-flex items-center justify-center rounded-xl text-base font-medium border border-border bg-transparent text-foreground hover:border-accent/30 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98]"
              >

                Explore Stores

              </Link>

            </motion.div>

          </motion.div>

          {/* RIGHT HERO GRAPHIC */}

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: easeOut }}
            className="relative hidden lg:block h-[560px]"
          >

            {/* rotating dashed ring */}

            <div className="absolute -inset-10 animate-spin-slow">

              <div className="h-full w-full rounded-full border-2 border-dashed border-accent/20" />

            </div>

            {/* main image card */}

            <div className="gradient-border absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[520px] rounded-[2.5rem] p-[2px] shadow-accent-lg">

              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop"
                alt="Independent store"
                className="h-full w-full rounded-[calc(2.5rem-2px)] object-cover"
              />

            </div>

            {/* floating stat card */}

            <div className="absolute top-6 -left-4 bg-card border border-border rounded-2xl p-5 shadow-lg animate-float">

              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">

                Happy Customers

              </p>

              <p className="mt-1 font-display text-3xl gradient-text">

                5000+

              </p>

            </div>

            {/* floating product card */}

            <div className="absolute bottom-10 -right-2 bg-card border border-border rounded-2xl p-5 shadow-lg animate-float [animation-delay:1.2s]">

              <div className="flex items-center gap-3">

                <div className="gradient-bg h-11 w-11 rounded-xl flex items-center justify-center">

                  <FaGem className="text-white" />

                </div>

                <div>

                  <p className="text-sm font-semibold text-foreground">

                    Trending Now

                  </p>

                  <p className="text-xs text-muted-foreground">

                    From ₹499

                  </p>

                </div>

              </div>

            </div>

            {/* corner accent block */}

            <div className="absolute top-16 right-8 h-16 w-16 rounded-2xl gradient-bg shadow-accent-lg" />

            {/* dot grid */}

            <div className="absolute -bottom-6 left-8 grid grid-cols-3 gap-3">

              {[...Array(9)].map((_, i) => (

                <div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-accent/30"
                />

              ))}

            </div>

          </motion.div>

        </div>

      </section>

      {/* ===================================================== */}
      {/* ==================== MARQUEE STRIP ================== */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden border-y border-border bg-muted/50 py-6">

        <div className="flex w-max animate-marquee gap-12 hover:[animation-play-state:paused]">

          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-12 whitespace-nowrap font-display text-2xl text-muted-foreground/70"
            >

              {item}

              <span className="h-2 w-2 rounded-full gradient-bg opacity-60" />

            </span>
          ))}

        </div>

      </section>

      {/* ===================================================== */}
      {/* ================= FEATURE SECTION =================== */}
      {/* ===================================================== */}

      <section className="max-w-6xl mx-auto px-6 py-28">

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="text-center"
        >

          <motion.div
            variants={fadeInUp}
            className="flex justify-center"
          >

            <SectionLabel>

              Why Vendora

            </SectionLabel>

          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="mt-6 text-4xl md:text-5xl font-display leading-[1.15] text-foreground"
          >

            Crafted For{" "}

            <span className="gradient-text">

              Every Shopper

            </span>

          </motion.h2>

        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-16 grid md:grid-cols-3 gap-6"
        >

          {FEATURES.map((feature) => (

            <motion.div
              key={feature.title}
              variants={fadeInUp}
              className="group relative bg-card border border-border rounded-2xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >

              <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

              <div className="relative">

                <div className="gradient-bg h-14 w-14 rounded-2xl flex items-center justify-center shadow-accent mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">

                  <feature.icon
                    className="text-white"
                    size={24}
                  />

                </div>

                <h3 className="text-xl font-semibold tracking-[-0.01em] text-foreground">

                  {feature.title}

                </h3>

                <p className="mt-3 text-muted-foreground leading-relaxed">

                  {feature.text}

                </p>

              </div>

            </motion.div>

          ))}

        </motion.div>

      </section>

      {/* ===================================================== */}
      {/* ================== STATS (INVERTED) ================= */}
      {/* ===================================================== */}

      <section className="relative bg-foreground text-background">

        {/* textures */}

        <div className="absolute inset-0 dot-pattern" />

        <div className="pointer-events-none absolute -top-40 left-1/4 h-[400px] w-[400px] rounded-full bg-accent/20 blur-[150px]" />

        <div className="relative max-w-6xl mx-auto px-6 py-28">

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-2 lg:grid-cols-4 gap-y-14"
          >

            {STATS.map((stat, i) => (

              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className={`text-center lg:text-left ${
                  i > 0
                    ? "lg:border-l lg:border-white/10"
                    : ""
                }`}
              >

                <p className="font-display text-5xl md:text-6xl gradient-text">

                  <CountUp
                    value={stat.value}
                    decimals={stat.decimals || 0}
                    suffix={stat.suffix || ""}
                  />

                </p>

                <p className="mt-3 font-mono text-xs uppercase tracking-[0.15em] text-white/60">

                  {stat.label}

                </p>

              </motion.div>

            ))}

          </motion.div>

        </div>

      </section>

      {/* ===================================================== */}
      {/* ==================== CTA SECTION ==================== */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden max-w-6xl mx-auto px-6 py-28">

        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[150px]" />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="relative bg-card border border-border rounded-[2.5rem] p-12 md:p-20 shadow-xl text-center overflow-hidden"
        >

          <motion.div
            variants={fadeInUp}
            className="flex justify-center"
          >

            <SectionLabel>

              Shop Smarter

            </SectionLabel>

          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="mt-8 text-4xl md:text-6xl font-display leading-[1.1] text-foreground"
          >

            Thousands Of Stores.{" "}

            <span className="gradient-text">

              One Marketplace.

            </span>

          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed"
          >

            Everything you love — fashion,
            electronics, home essentials and
            more — from independent stores
            you can trust, all in one place.

          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-10"
          >

            <Link
              to="/stores"
              className="gradient-bg text-white h-14 px-10 inline-flex items-center justify-center gap-2 rounded-xl text-base font-medium shadow-sm hover:shadow-accent hover:-translate-y-0.5 hover:brightness-110 transition-all duration-200 group active:scale-[0.98]"
            >

              <FaStore className="text-white" />

              Explore Stores

              <FaArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />

            </Link>

          </motion.div>

        </motion.div>

      </section>

    </div>
  );
};

export default Home;
