import { Lightbulb, Users, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useState, useEffect } from 'react';
const Home = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const heroSlides = [
    '/carousel/slide1.jpg',
    '/carousel/slide2.jpg',
    '/carousel/slide3.jpg'
  ];

  const features = [{
    icon: Lightbulb,
    title: 'Innovation & Research',
    description: 'Cutting-edge research in AI, IoT, embedded systems, and digital electronics.'
  }, {
    icon: Users,
    title: 'Expert Faculty',
    description: 'Learn from industry professionals and renowned academics with extensive experience.'
  }, {
    icon: Award,
    title: 'Industry Recognition',
    description: 'Our graduates are highly sought after by leading technology companies worldwide.'
  }, {
    icon: TrendingUp,
    title: 'Career Growth',
    description: '95% placement rate with competitive packages in top tech companies.'
  }];
  return <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section with Carousel */}
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          className="w-full h-full"
        >
          <CarouselContent className="h-full">
            {heroSlides.map((imagePath, index) => (
              <CarouselItem key={index} className="h-full">
                <img 
                  src={imagePath} 
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        {/* Dot Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                current === index 
                  ? 'bg-white w-8' 
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              About Our Department
            </h2>
            <p className="text-lg text-muted-foreground">
              The Department of Electronics and Computer Engineering is committed to excellence in 
              education, research, and innovation. We prepare students for successful careers in the 
              rapidly evolving fields of electronics and computer engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  To be a globally recognized center of excellence in electronics and computer engineering 
                  education and research, producing innovative engineers who drive technological advancement 
                  and contribute to society's progress.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To provide world-class education that combines theoretical knowledge with practical skills, 
                  foster cutting-edge research, and maintain strong industry partnerships to ensure our 
                  graduates are well-prepared for global challenges.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Career Prospects */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Career Prospects
            </h2>
            <p className="text-lg text-muted-foreground">
              Our graduates pursue diverse and rewarding careers across multiple sectors
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-border">
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-3">Technology Sector</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Software Engineer</li>
                  <li>• Hardware Engineer</li>
                  <li>• Systems Architect</li>
                  <li>• Embedded Systems Developer</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-3">Research & Academia</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Research Scientist</li>
                  <li>• PhD Programs</li>
                  <li>• University Faculty</li>
                  <li>• R&D Engineer</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-3">Specialized Fields</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• IoT Specialist</li>
                  <li>• VLSI Design Engineer</li>
                  <li>• Network Engineer</li>
                  <li>• AI/ML Engineer</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Home;