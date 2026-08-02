import { motion } from "framer-motion";

import { Link } from "react-router-dom";

const Home = () => {

  return (

    <div className="min-h-screen bg-gradient-to-b from-[#faf7f2] via-white to-[#f8f5f0]">

      {/* ===================================================== */}
      {/* ==================== HERO SECTION =================== */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden">

        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}

          <motion.div

            initial={{
              opacity: 0,
              x: -50,
            }}

            animate={{
              opacity: 1,
              x: 0,
            }}

            transition={{
              duration: 0.7,
            }}
          >

            <p className="uppercase tracking-[6px] text-sm text-rose-500 font-semibold mb-4">

              Luxury Collection

            </p>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">

              Elevate Your Style With
              Premium Sarees

            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-relaxed">

              Discover handcrafted elegance,
              timeless tradition, and modern
              luxury curated exclusively for
              your wardrobe.

            </p>

            <div className="flex gap-4 mt-8">

              <Link
                to="/stores"
                className="bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-900 transition shadow-lg inline-block"
              >

                Shop Now

              </Link>

              <Link
                to="/stores"
                className="border border-black px-8 py-4 rounded-xl hover:bg-black hover:text-white transition inline-block"
              >

                Explore Collection

              </Link>

            </div>

          </motion.div>

          {/* RIGHT IMAGE */}

          <motion.div

            initial={{
              opacity: 0,
              x: 50,
            }}

            animate={{
              opacity: 1,
              x: 0,
            }}

            transition={{
              duration: 0.7,
            }}

            className="relative"
          >

            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop"
              alt="Luxury Saree"
              className="rounded-3xl shadow-2xl h-[600px] w-full object-cover"
            />

            <div className="absolute -bottom-8 -left-8 bg-white shadow-xl rounded-2xl p-6">

              <p className="text-sm text-gray-500">

                Premium Quality

              </p>

              <h3 className="text-2xl font-bold">

                5000+

              </h3>

              <p className="text-gray-600">

                Happy Customers

              </p>

            </div>

          </motion.div>

        </div>

      </section>

      {/* ===================================================== */}
      {/* ================= FEATURE SECTION =================== */}
      {/* ===================================================== */}

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid md:grid-cols-3 gap-8">

          {/* FEATURE 1 */}

          <div className="bg-white p-10 rounded-3xl shadow-lg text-center">

            <h3 className="text-2xl font-bold mb-4">

              Premium Quality

            </h3>

            <p className="text-gray-600 leading-relaxed">

              Handcrafted sarees designed with
              elegance and luxury.

            </p>

          </div>

          {/* FEATURE 2 */}

          <div className="bg-white p-10 rounded-3xl shadow-lg text-center">

            <h3 className="text-2xl font-bold mb-4">

              Fast Delivery

            </h3>

            <p className="text-gray-600 leading-relaxed">

              Secure and reliable shipping
              across India.

            </p>

          </div>

          {/* FEATURE 3 */}

          <div className="bg-white p-10 rounded-3xl shadow-lg text-center">

            <h3 className="text-2xl font-bold mb-4">

              Trusted Brand

            </h3>

            <p className="text-gray-600 leading-relaxed">

              Loved by thousands of fashion
              enthusiasts nationwide.

            </p>

          </div>

        </div>

      </section>

      {/* ===================================================== */}
      {/* ==================== CTA SECTION ==================== */}
      {/* ===================================================== */}

      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="bg-black rounded-3xl text-white p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">

          <div>

            <p className="uppercase tracking-[5px] text-rose-400 font-semibold mb-4">

              Exclusive Fashion

            </p>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight">

              Redefine Traditional Elegance

            </h2>

            <p className="mt-6 text-gray-300 max-w-2xl leading-relaxed">

              Premium handcrafted sarees
              designed for modern women who
              value timeless style and luxury.

            </p>

          </div>

          <Link
            to="/stores"
            className="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition inline-block"
          >

            Explore Stores

          </Link>

        </div>

      </section>

    </div>
  );
};

export default Home;