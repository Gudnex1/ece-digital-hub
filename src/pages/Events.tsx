import { useState, useMemo } from 'react';
import { Calendar, MapPin, Clock, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type EventType = 'seminar' | 'workshop' | 'conference' | 'announcement';

interface Event {
  id: number;
  title: string;
  type: EventType;
  date: string;
  time: string;
  location: string;
  description: string;
  speaker?: string;
}

const Events = () => {
  const [selectedFilter, setSelectedFilter] = useState<EventType | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');

  const events: Event[] = [
    {
      id: 1,
      title: 'AI in Embedded Systems',
      type: 'seminar',
      date: '2025-12-15',
      time: '2:00 PM - 4:00 PM',
      location: 'ECE Auditorium',
      description: 'Explore the integration of artificial intelligence in embedded systems and IoT devices.',
      speaker: 'Dr. Sarah Johnson, MIT',
    },
    {
      id: 2,
      title: 'PCB Design Workshop',
      type: 'workshop',
      date: '2025-12-20',
      time: '10:00 AM - 3:00 PM',
      location: 'Electronics Lab 2',
      description: 'Hands-on workshop on advanced PCB design techniques using industry-standard tools.',
      speaker: 'Prof. Michael Chen',
    },
    {
      id: 3,
      title: 'IEEE International Conference on Robotics',
      type: 'conference',
      date: '2026-01-10',
      time: '9:00 AM - 5:00 PM',
      location: 'Main Campus Convention Center',
      description: 'Annual conference featuring cutting-edge research in robotics and automation.',
    },
    {
      id: 4,
      title: 'New Lab Equipment Arrival',
      type: 'announcement',
      date: '2025-11-25',
      time: 'All Day',
      location: 'Department Office',
      description: 'State-of-the-art oscilloscopes and signal analyzers have been installed in Lab 3.',
    },
    {
      id: 5,
      title: '5G Networks and Beyond',
      type: 'seminar',
      date: '2026-01-05',
      time: '3:00 PM - 5:00 PM',
      location: 'ECE Auditorium',
      description: 'Understanding the architecture and applications of next-generation wireless networks.',
      speaker: 'Dr. Emily Rodriguez',
    },
    {
      id: 6,
      title: 'FPGA Programming Bootcamp',
      type: 'workshop',
      date: '2026-01-15',
      time: '9:00 AM - 4:00 PM',
      location: 'Digital Systems Lab',
      description: 'Intensive training on FPGA programming using VHDL and Verilog.',
      speaker: 'Prof. David Kim',
    },
    {
      id: 7,
      title: 'Exam Schedule Released',
      type: 'announcement',
      date: '2025-11-20',
      time: 'All Day',
      location: 'Online Portal',
      description: 'Final examination schedule for Fall 2025 semester has been published.',
    },
    {
      id: 8,
      title: 'International Symposium on Computer Vision',
      type: 'conference',
      date: '2026-02-20',
      time: '8:00 AM - 6:00 PM',
      location: 'City Conference Hall',
      description: 'Leading researchers present their work on machine learning and computer vision.',
    },
  ];

  const filteredEvents = useMemo(() => {
    let filtered = events;
    
    // Filter by event type
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(event => event.type === selectedFilter);
    }
    
    // Filter by date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dateFilter === 'upcoming') {
      filtered = filtered.filter(event => new Date(event.date) >= today);
    } else if (dateFilter === 'past') {
      filtered = filtered.filter(event => new Date(event.date) < today);
    }
    
    // Sort by date
    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedFilter, dateFilter]);

  const getEventTypeBadge = (type: EventType) => {
    const variants: Record<EventType, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      seminar: { variant: 'default', label: 'Seminar' },
      workshop: { variant: 'secondary', label: 'Workshop' },
      conference: { variant: 'outline', label: 'Conference' },
      announcement: { variant: 'destructive', label: 'Announcement' },
    };
    
    return variants[type];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-hero-gradient text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Events & News
          </h1>
          <p className="text-xl text-primary-foreground/90 animate-fade-in max-w-2xl">
            Stay updated with our latest seminars, workshops, conferences, and department announcements.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-[73px] z-40 bg-background/95 backdrop-blur-sm border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Event Type:</span>
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('all')}
              >
                All
              </Button>
              <Button
                variant={selectedFilter === 'seminar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('seminar')}
              >
                Seminars
              </Button>
              <Button
                variant={selectedFilter === 'workshop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('workshop')}
              >
                Workshops
              </Button>
              <Button
                variant={selectedFilter === 'conference' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('conference')}
              >
                Conferences
              </Button>
              <Button
                variant={selectedFilter === 'announcement' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('announcement')}
              >
                Announcements
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Date:</span>
              <Button
                variant={dateFilter === 'upcoming' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDateFilter('upcoming')}
              >
                Upcoming
              </Button>
              <Button
                variant={dateFilter === 'past' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDateFilter('past')}
              >
                Past
              </Button>
              <Button
                variant={dateFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDateFilter('all')}
              >
                All
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12 flex-grow">
        <div className="container mx-auto px-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No events found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => {
                const badgeInfo = getEventTypeBadge(event.type);
                return (
                  <Card 
                    key={event.id} 
                    className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant={badgeInfo.variant}>{badgeInfo.label}</Badge>
                      </div>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription className="space-y-2 pt-2">
                        <div className="flex items-center gap-2 text-foreground">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-sm">{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-sm">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="text-sm">{event.location}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                      {event.speaker && (
                        <p className="text-sm font-medium text-primary">
                          Speaker: {event.speaker}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;
