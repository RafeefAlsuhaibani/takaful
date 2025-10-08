import { mockStats } from '../data/home';
import Container from './Container';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-brand-600 to-brand-500 text-white animate-slideUp">
      <Container className="py-20">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            منصة تكافل وأثر
          </h1>
          <p className="text-lg md:text-xl text-brand-100 mb-8 max-w-3xl mx-auto">
            حيث يلتقي العطاء بالأثر — انضم إلى مجتمع من المتكافلين واصنع أثرًا يدوم
          </p>
          <button className="bg-brand-600 hover:bg-brand-700 focus-visible:ring-2 ring-brand-600 ring-offset-2 transition-all duration-200 ease-out active:scale-95 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer select-none">
            اعرف أكثر
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockStats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg hover:scale-[1.02] transition-transform duration-300 ease-out animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-brand-100 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
