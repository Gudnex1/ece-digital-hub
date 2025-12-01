import { useState } from 'react';
import { ChevronDown, ChevronUp, Award, BookOpen, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Research = () => {
  const [expandedArea, setExpandedArea] = useState<number | null>(null);

  const researchAreas = [
    {
      title: 'Artificial Intelligence & Machine Learning',
      description: 'Developing advanced AI algorithms for computer vision, natural language processing, and predictive analytics.',
      projects: [
        'Deep Learning for Medical Image Analysis',
        'Reinforcement Learning for Autonomous Systems',
        'Neural Architecture Search Optimization',
      ],
    },
    {
      title: 'Internet of Things (IoT)',
      description: 'Creating smart, connected systems for healthcare, agriculture, and smart cities.',
      projects: [
        'Smart Home Automation Systems',
        'Agricultural IoT for Precision Farming',
        'Industrial IoT for Predictive Maintenance',
      ],
    },
    {
      title: 'VLSI Design & Nanoelectronics',
      description: 'Research in low-power circuit design, memory systems, and next-generation computing.',
      projects: [
        'Low-Power SRAM Design',
        'Neuromorphic Computing Chips',
        'Quantum Dot Cellular Automata',
      ],
    },
    {
      title: 'Wireless Communications',
      description: 'Advancing 5G/6G technologies, software-defined radio, and cognitive networks.',
      projects: [
        'Millimeter Wave Communication Systems',
        'Massive MIMO Technology',
        'Energy-Efficient Wireless Protocols',
      ],
    },
    {
      title: 'Embedded Systems & Robotics',
      description: 'Developing intelligent robots, autonomous vehicles, and real-time control systems.',
      projects: [
        'Autonomous Navigation for Mobile Robots',
        'Drone-based Surveillance Systems',
        'Real-Time Operating Systems for Critical Applications',
      ],
    },
    {
      title: 'Cybersecurity',
      description: 'Research in cryptography, network security, and secure hardware design.',
      projects: [
        'Hardware Security Modules',
        'Blockchain for Secure Transactions',
        'AI-based Intrusion Detection Systems',
      ],
    },
  ];

  const achievements = [
    {
      icon: Award,
      title: '50+ Research Papers',
      description: 'Published in top-tier international journals and conferences',
    },
    {
      icon: BookOpen,
      title: '15 Patents Filed',
      description: 'Innovative solutions in electronics and computing',
    },
    {
      icon: Users,
      title: '30+ Industry Collaborations',
      description: 'Partnerships with leading technology companies',
    },
  ];

  const toggleArea = (index: number) => {
    setExpandedArea(expandedArea === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-300 dark:bg-gradient-to-r dark:from-gray-600 dark:to-slate-800 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Research & Innovation
            </h1>
            <p className="text-lg text-white">
              Pushing the boundaries of technology through cutting-edge research
              and transformative innovations that address real-world challenges.
            </p>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {achievements.map((achievement, index) => (
              <Card key={index} className="border-border text-center">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <achievement.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-16 md:py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Research Areas
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse research domains and ongoing projects
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {researchAreas.map((area, index) => (
              <Card key={index} className="border-border overflow-hidden">
                <CardContent className="p-0">
                  <Button
                    variant="ghost"
                    className="w-full p-6 h-auto justify-between hover:bg-muted/50"
                    onClick={() => toggleArea(index)}
                  >
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {area.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {area.description}
                      </p>
                    </div>
                    {expandedArea === index ? (
                      <ChevronUp className="h-5 w-5 text-primary ml-4" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-primary ml-4" />
                    )}
                  </Button>

                  {expandedArea === index && (
                    <div className="px-6 pb-6 animate-fade-in">
                      <div className="bg-muted/50 rounded-lg p-4 mt-2">
                        <p className="text-sm font-medium text-foreground mb-3">
                          Current Projects:
                        </p>
                        <ul className="space-y-2">
                          {area.projects.map((project, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <span className="text-primary mt-1">•</span>
                              <span>{project}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <Card className="border-border bg-card max-w-3xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Interested in Collaborating?
              </h2>
              <p className="text-muted-foreground mb-6">
                We welcome partnerships with industry, academic institutions,
                and research organizations. Contact us to explore collaboration
                opportunities.
              </p>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Get in Touch
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Research;
