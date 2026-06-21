import React from 'react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();

  const servicesList = [
    {
      icon: '🧹',
      title: 'Clean-up Drives',
      desc: 'We organize community clean-up drives targeting local beaches, public city parks, and river banks to gather plastic waste, segregating materials and recycling whenever possible.',
      details: ['Supplies provided (gloves, bags)', 'Experienced drive captains', 'Visual before/after comparisons', 'Weekend schedule availability']
    },
    {
      icon: '🎓',
      title: 'Educational Workshops',
      desc: 'Our experts host interactive waste segregation, home composting, and circular economics workshops for local schools, apartment associations, and corporate offices.',
      details: ['Zero-waste living strategies', 'Composting systems setup', 'Recycling separation charts', 'Interactive Q&A panels']
    },
    {
      icon: '📢',
      title: 'Awareness Campaigns',
      desc: 'We run public rallies, street plays, and visual banners to educate local neighborhoods on the ecological impact of microplastics, illegal garbage dumping, and littering laws.',
      details: ['Bilingual resource pamphlets', 'Partnership with municipal councils', 'Volunteer rally coordination', 'Social media engagement kit']
    }
  ];

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <section className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full">
            Our Offerings
          </span>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mt-3 mb-4">
            Environmental Services
          </h1>
          <p className="text-slate-600 leading-relaxed">
            EcoClean drives tangible change. Explore our cleaning drives, educational resources, and awareness initiatives designed to make our habitats green, healthy, and trash-free.
          </p>
        </section>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {servicesList.map((svc, idx) => (
            <Card key={idx} className="p-8 bg-white border border-slate-100 shadow-premium flex flex-col gap-5">
              <div className="h-14 w-14 rounded-2xl bg-primary-50 text-slate-850 flex items-center justify-center text-3xl shadow-sm border border-primary-100 select-none">
                {svc.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 leading-snug">{svc.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{svc.desc}</p>
              </div>

              <ul className="space-y-2.5 border-t border-slate-50 pt-5 text-xs text-slate-600">
                {svc.details.map((detail, dIdx) => (
                  <li key={dIdx} className="flex items-center gap-2">
                    <span className="text-primary-500 font-bold">✓</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card hoverEffect={false} className="p-8 md:p-12 bg-gradient-to-r from-primary-700 to-primary-900 text-white border-none shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left space-y-2">
            <h3 className="text-2xl font-bold tracking-tight">Ready to join the green movement?</h3>
            <p className="text-sm text-primary-100 leading-relaxed">
              Sign up as a volunteer today. You will receive notifications about upcoming beach, river, and park cleanup campaigns. Let's make Chennai beautiful together!
            </p>
          </div>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/register')}
            className="bg-white hover:bg-slate-50 text-primary-900 border-none px-6"
          >
            Become a Volunteer
          </Button>
        </Card>

      </div>
    </div>
  );
};

export default Services;
