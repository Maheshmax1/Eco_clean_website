import React, { useState } from 'react';
import Card from '../../components/Card/Card';

const About = () => {
  const [activeProject, setActiveProject] = useState('beach');

  const comparisons = {
    beach: {
      title: 'Marina Beach Cleanup Project',
      before: '/assets/beach.withplatic (1).png',
      after: '/assets/beach.withplatic (2).png',
      desc: 'Cleared over 500kg of microplastics, wrappers, and discarded nets from the sandy shoreline, protecting marine turtles and restoring coastal beauty.',
    },
    park: {
      title: 'Adyar City Park Restoration',
      before: '/assets/park_polluted_real.png',
      after: '/assets/park_clean_real.png',
      desc: 'Cleaned up illegal litter dump sites, repainted benches, weeded walkways, and planted indigenous saplings for a fresh, safe neighborhood playground.',
    },
    river: {
      title: 'Cooum River Bank Drive',
      before: '/assets/river_polluted (1).png',
      after: '/assets/river_clean.png',
      desc: 'Tackled floating trash build-up and bank plastic accumulation, educating neighboring slums on sustainable refuse disposal methods.',
    },
  };

  const coreValues = [
    { title: '🌱 Positivity', desc: 'We believe in optimism as the seed for change. By fostering a hopeful outlook, we motivate others to act responsibly for a better planet.' },
    { title: '🤝 Integrity', desc: 'We operate with absolute transparency, honesty, and accountability in our campaigns, donations, and volunteer reports.' },
    { title: '❤️ Kindness', desc: 'Treating our communities, fellow volunteers, and the environment with empathy, compassion, and gentle care.' },
    { title: '🎯 Focus', desc: 'Dedication to tangible progress. We do not just discuss ecological theories — we gather and clean up trash with our hands.' },
    { title: '🌿 Unity', desc: 'Working collaboratively across municipal divisions, educational systems, and local groups to maximize clean-up impacts.' },
    { title: '📈 Growth', desc: 'Constant learning, adapting recycling methods, and refining waste management campaigns for larger ecological ripples.' }
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. HERO SECTION */}
        <section className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full">
            Our Work
          </span>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mt-3 mb-4">
            The World is like a Canvas 🌍
          </h1>
          <p className="text-slate-600 leading-relaxed">
            See the visual impact of our community drives. Toggle between the tabs below to view the incredible transformation our volunteers make on polluted shorelines, rivers, and parks.
          </p>
        </section>

        {/* 2. BEFORE/AFTER PROJECT COMPARISONS */}
        <section className="mb-24">
          {/* Tab headers */}
          <div className="flex justify-center gap-2 mb-8 bg-slate-200/60 p-1.5 rounded-xl w-fit mx-auto border border-slate-200">
            {Object.keys(comparisons).map((key) => (
              <button
                key={key}
                onClick={() => setActiveProject(key)}
                className={`px-5 py-2 text-sm font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                  activeProject === key
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {key} Drive
              </button>
            ))}
          </div>

          {/* Grid display */}
          <Card className="p-6 md:p-8 bg-white border border-slate-100 animate-fade-in shadow-lg">
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {comparisons[activeProject].title}
            </h3>
            <p className="text-slate-500 text-sm mb-6 max-w-2xl leading-relaxed">
              {comparisons[activeProject].desc}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Before Column */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold tracking-wider text-danger uppercase bg-red-50 border border-red-100 rounded px-2.5 py-1 w-max">
                  🚨 Polluted state (Before)
                </span>
                <div className="rounded-xl overflow-hidden shadow-inner border border-slate-100 h-80 relative group bg-slate-900">
                  <img
                    src={comparisons[activeProject].before}
                    alt={`${activeProject} Before`}
                    className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-102"
                  />
                </div>
              </div>

              {/* After Column */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold tracking-wider text-primary-600 uppercase bg-primary-50 border border-primary-100 rounded px-2.5 py-1 w-max">
                  🌿 Restored state (After)
                </span>
                <div className="rounded-xl overflow-hidden shadow-inner border border-slate-100 h-80 relative group bg-slate-950">
                  <img
                    src={comparisons[activeProject].after}
                    alt={`${activeProject} After`}
                    className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-102"
                  />
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* 3. MISSION, VISION & CORE VALUES */}
        <section className="mb-20" id="mission">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full">
              Our Compass
            </span>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mt-3">
              Mission, Vision & Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Mission Card */}
            <Card className="p-8 bg-white border border-slate-100 shadow-premium flex flex-col gap-4">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                🌱 Our Mission
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Our mission is to empower individuals, communities, and governments to build sustainable waste management systems through education, collaboration, and immediate action. We aim to transform awareness into responsibility and responsibility into results — promoting green practices that reduce pollution and encourage recycling.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm">
                We collaborate globally with local organisations, volunteers, and eco-activists to implement impactful programs. Through clean-up drives, waste segregation education, and recycling initiatives, we foster collective responsibility for environmental sustainability.
              </p>
            </Card>

            {/* Vision Card */}
            <Card className="p-8 bg-white border border-slate-100 shadow-premium flex flex-col gap-4">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                🌍 Our Vision
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Our vision is a waste-free, eco-conscious planet where humans and nature thrive in harmony. We envision cities without landfills, oceans without plastic, and communities that reuse, recycle, and respect the natural balance.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm">
                By 2030, EcoClean aims to inspire over 10 million people worldwide to take sustainable actions daily — creating a global ripple effect that restores the Earth's natural beauty and balance.
              </p>
            </Card>
          </div>

          {/* Core Values Grid */}
          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-premium">
            <h3 className="text-2xl font-bold text-slate-800 mb-8 border-b border-slate-100 pb-3 text-center">
              🌿 Our Core Values
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.map((val, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-100 transition-all duration-200 flex flex-col gap-2">
                  <h4 className="font-bold text-slate-800 text-base">{val.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;
