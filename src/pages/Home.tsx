import { ArrowRight, Lightbulb, Users, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Home = () => {
  const features = [
    {
      icon: Lightbulb,
      title: 'Innovation & Research',
      description: 'Cutting-edge research in AI, IoT, embedded systems, and digital electronics.',
    },
    {
      icon: Users,
      title: 'Expert Faculty',
      description: 'Learn from industry professionals and renowned academics with extensive experience.',
    },
    {
      icon: Award,
      title: 'Industry Recognition',
      description: 'Our graduates are highly sought after by leading technology companies worldwide.',
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: '95% placement rate with competitive packages in top tech companies.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-hero-gradient py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in">
              Department of Electronics & Computer Engineering
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 animate-fade-in">
              Pioneering the future of technology through innovative education, groundbreaking research, 
              and industry collaboration. Join us in shaping tomorrow's engineering solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
              <Link to="/programs">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto group">
                  Explore Programs
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/research">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-background/10 text-primary-foreground border-primary-foreground/30 hover:bg-background/20">
                  View Research
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
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
            {features.map((feature, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
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
    </div>
  );
};

export default Home;
