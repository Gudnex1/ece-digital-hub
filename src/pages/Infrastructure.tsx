import { Cpu, Microscope, Monitor, Wifi, Database, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';

const Infrastructure = () => {
  const [isLoading, setIsLoading] = useState(true);
  const facilities = [
    {
      icon: Cpu,
      title: 'VLSI Design Laboratory',
      description: 'State-of-the-art facilities for integrated circuit design and testing with industry-standard EDA tools including Cadence, Synopsys, and Mentor Graphics.',
      equipment: [
        'Cadence Virtuoso Design Suite',
        'Synopsys Design Compiler',
        'IC Testing Equipment',
        '50+ Workstations',
      ],
    },
    {
      icon: Monitor,
      title: 'Computer Architecture Lab',
      description: 'Advanced computing facilities for studying processor design, memory systems, and parallel computing architectures.',
      equipment: [
        'High-Performance Servers',
        'FPGA Development Boards',
        'ARM Development Kits',
        'Simulation Software',
      ],
    },
    {
      icon: Microscope,
      title: 'Embedded Systems Laboratory',
      description: 'Comprehensive lab for hands-on experience with microcontrollers, sensors, and real-time operating systems.',
      equipment: [
        'Arduino & Raspberry Pi Boards',
        'ESP32 Development Kits',
        'Sensor Modules',
        'Oscilloscopes & Logic Analyzers',
      ],
    },
    {
      icon: Wifi,
      title: 'Wireless Communication Lab',
      description: 'Cutting-edge facilities for studying wireless protocols, RF design, and communication systems.',
      equipment: [
        'Spectrum Analyzers',
        'Network Analyzers',
        'Software Defined Radios',
        'Antenna Testing Setup',
      ],
    },
    {
      icon: Database,
      title: 'IoT & Cloud Computing Lab',
      description: 'Modern infrastructure for Internet of Things development and cloud-based applications.',
      equipment: [
        'Cloud Platform Access (AWS, Azure)',
        'IoT Gateway Devices',
        'Edge Computing Hardware',
        'Big Data Tools',
      ],
    },
    {
      icon: Zap,
      title: 'Power Electronics Laboratory',
      description: 'Specialized equipment for studying power conversion, motor drives, and renewable energy systems.',
      equipment: [
        'Power Supply Units',
        'Motor Drive Systems',
        'Solar Panel Testing Setup',
        'Power Quality Analyzers',
      ],
    },
  ];

  const generalFacilities = [
    'High-speed Internet Connectivity (1 Gbps)',
    'Climate-controlled Laboratory Environments',
    'Latest Software Licenses & Tools',
    'Collaborative Project Spaces',
    'Research & Development Center',
    '24/7 Laboratory Access for Research Students',
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Page Header */}
      <section className="bg-hero-gradient py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Infrastructure & Facilities
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Our department is equipped with world-class laboratories and cutting-edge equipment 
              to provide hands-on experience and foster innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Laboratories Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Specialized Laboratories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our state-of-the-art labs provide students with practical
              experience using industry-standard tools and equipment
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {facilities.map((facility, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <facility.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {facility.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {facility.description}
                      </p>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm font-medium text-foreground mb-2">
                          Key Equipment:
                        </p>
                        <ul className="space-y-1">
                          {facility.equipment.map((item, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* General Facilities */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                General Facilities
              </h2>
              <p className="text-lg text-muted-foreground">
                Additional infrastructure supporting academic excellence
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {generalFacilities.map((facility, index) => (
                <Card key={index} className="border-border">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <p className="text-foreground">{facility}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Infrastructure;
