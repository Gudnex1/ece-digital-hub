import { Mail, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';

const Lecturers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const lecturers = [
    {
      name: 'Dr. Shoewu',
      role: 'Professor & Department Head',
      specialization: 'VLSI Design & Microelectronics',
      email: '',
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Associate Professor',
      specialization: 'Artificial Intelligence & Machine Learning',
      email: 'm.chen@university.edu',
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Assistant Professor',
      specialization: 'Embedded Systems & IoT',
      email: 'e.rodriguez@university.edu',
    },
    {
      name: 'Dr. James Anderson',
      role: 'Professor',
      specialization: 'Digital Signal Processing',
      email: 'j.anderson@university.edu',
    },
    {
      name: 'Dr. Priya Sharma',
      role: 'Associate Professor',
      specialization: 'Computer Architecture & Networks',
      email: 'p.sharma@university.edu',
    },
    {
      name: 'Dr. David Williams',
      role: 'Assistant Professor',
      specialization: 'Robotics & Control Systems',
      email: 'd.williams@university.edu',
    },
    {
      name: 'Dr. Lisa Thompson',
      role: 'Senior Lecturer',
      specialization: 'Power Electronics & Renewable Energy',
      email: 'l.thompson@university.edu',
    },
    {
      name: 'Dr. Ahmed Hassan',
      role: 'Lecturer',
      specialization: 'Wireless Communications',
      email: 'a.hassan@university.edu',
    },
    {
      name: 'Dr. Maria Garcia',
      role: 'Assistant Professor',
      specialization: 'Cybersecurity & Cryptography',
      email: 'm.garcia@university.edu',
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-300 dark:bg-gradient-to-r dark:from-gray-600 dark:to-slate-800 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Our Faculty
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Meet our distinguished faculty members who are leaders in their
              fields, combining academic excellence with industry experience.
            </p>
          </div>
        </div>
      </section>

      {/* Lecturers Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 9 }).map((_, index) => (
                <Card key={index} className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-3" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              lecturers.map((lecturer, index) => (
                <Card
                  key={index}
                  className="border-border hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {lecturer.name}
                        </h3>
                        <p className="text-sm text-primary font-medium mb-2">
                          {lecturer.role}
                        </p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                              Specialization
                            </p>
                            <p className="text-sm text-foreground">
                              {lecturer.specialization}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 pt-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={`mailto:${lecturer.email}`}
                              className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                              {lecturer.email}
                            </a>
                          </div>
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

      <Footer />
    </div>
  );
};

export default Lecturers;
