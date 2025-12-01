import { GraduationCap, Clock, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';

const Programs = () => {
  const [isLoading, setIsLoading] = useState(true);
  const programs = [
    {
      title: 'BSc in Electronics and Computer Engineering',
      duration: '5 Years',
      overview: 'A comprehensive program combining electronics and computer engineering principles, preparing students for careers in integrated systems design, embedded systems, and digital electronics.',
      careers: [
        'Embedded Systems Engineer',
        'Digital Design Engineer',
        'Systems Integration Specialist',
        'Hardware-Software Co-designer',
        'IoT Solutions Architect',
      ],
    },
    {
      title: 'BSc in Computer Engineering',
      duration: '5 Years',
      overview: 'Focused on computer systems, software engineering, and digital technologies. Students gain expertise in computer architecture, operating systems, and software development.',
      careers: [
        'Software Engineer',
        'Computer Systems Architect',
        'Network Engineer',
        'Database Administrator',
        'Cloud Solutions Engineer',
      ],
    },
    {
      title: 'BSc in Electronics Engineering',
      duration: '5 Years',
      overview: 'Specializes in electronic circuits, signal processing, and communication systems. Prepares students for careers in electronics design, telecommunications, and power electronics.',
      careers: [
        'Electronics Design Engineer',
        'RF Engineer',
        'VLSI Design Engineer',
        'Telecommunications Engineer',
        'Power Electronics Specialist',
      ],
    },
  ];

  const requirements = [
    'High school diploma with strong mathematics and physics background',
    'Minimum GPA of 3.0 or equivalent',
    'English language proficiency (for international students)',
    'Entrance examination or equivalent standardized test scores',
    'Personal statement and letters of recommendation',
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 750);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-slate-900 to-gray-500 dark:bg-gradient-to-r dark:from-gray-600 dark:to-slate-800 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Degree Programs
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Choose from our specialized undergraduate programs designed to
              prepare you for successful careers in electronics and computer
              engineering.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="border-border">
                  <CardContent className="p-0">
                    <div className="grid lg:grid-cols-3 gap-0">
                      <div className="lg:col-span-3 bg-primary/5 p-6 border-b border-border">
                        <div className="flex items-start gap-4">
                          <Skeleton className="w-12 h-12 rounded-lg" />
                          <div className="flex-1">
                            <Skeleton className="h-7 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/3" />
                          </div>
                        </div>
                      </div>
                      <div className="p-6 lg:col-span-2">
                        <Skeleton className="h-6 w-1/3 mb-3" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6 mb-6" />
                        <Skeleton className="h-6 w-1/2 mb-3" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-4/5" />
                          <Skeleton className="h-4 w-5/6" />
                        </div>
                      </div>
                      <div className="bg-muted/50 p-6 border-l border-border">
                        <Skeleton className="h-5 w-2/3 mb-4" />
                        <div className="space-y-4">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-10 w-full mt-4" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              programs.map((program, index) => (
                <Card
                  key={index}
                  className="border-border hover:shadow-xl transition-all"
                >
                  <CardContent className="p-0">
                    <div className="grid lg:grid-cols-3 gap-0">
                      {/* Program Header */}
                      <div className="lg:col-span-3 bg-primary/5 p-6 border-b border-border">
                        <div className="flex items-start gap-4">
                          <div className="bg-primary/10 p-3 rounded-lg">
                            <GraduationCap className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-foreground mb-2">
                              {program.title}
                            </h3>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">{program.duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Overview */}
                      <div className="p-6 lg:col-span-2">
                        <h4 className="text-lg font-semibold text-foreground mb-3">
                          Program Overview
                        </h4>
                        <p className="text-muted-foreground mb-6">
                          {program.overview}
                        </p>

                        <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          Career Opportunities
                        </h4>
                        <ul className="space-y-2">
                          {program.careers.map((career, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">
                                {career}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Quick Info */}
                      <div className="bg-muted/50 p-6 border-l border-border">
                        <h4 className="font-semibold text-foreground mb-4">
                          Program Highlights
                        </h4>
                        <div className="space-y-4 text-sm">
                          <div>
                            <p className="text-muted-foreground mb-1">
                              Degree Type
                            </p>
                            <p className="font-medium text-foreground">
                              Bachelor of Science
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Duration</p>
                            <p className="font-medium text-foreground">
                              {program.duration} Full-Time
                            </p>
                          </div>

                          <div>
                            <p className="text-muted-foreground mb-1">Format</p>
                            <p className="font-medium text-foreground">
                              On-Campus
                            </p>
                          </div>
                          <Button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* General Requirements */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                General Admission Requirements
              </h2>
              <p className="text-lg text-muted-foreground">
                Common requirements for all degree programs
              </p>
            </div>

            <Card className="border-border">
              <CardContent className="p-8">
                <ul className="space-y-4">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="bg-primary/10 p-1 rounded-full mt-1">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-foreground">{requirement}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 p-6 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Note:</strong> Specific
                    program requirements may vary. Please contact our admissions
                    office for detailed information and application deadlines.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Programs;
