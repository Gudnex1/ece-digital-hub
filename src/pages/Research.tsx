import { useState, useEffect } from 'react';
import { Award, BookOpen, Users, Sparkles, ArrowRight, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

interface ResearchArea {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  projects: string[];
}

const Research = () => {
  const [selectedArea, setSelectedArea] = useState<ResearchArea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [researchAreas, setResearchAreas] = useState<ResearchArea[]>([]);
  const contactEmail = 'lateef.akinyemi@lasu.edu.ng';

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

  useEffect(() => {
    loadResearchAreas();
  }, []);

  const loadResearchAreas = async () => {
    try {
      const { data, error } = await supabase
        .from('research_areas')
        .select('*')
        .order('title');

      if (error) throw error;

      setResearchAreas(data || []);
    } catch (error) {
      console.error('Error loading research areas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.25),transparent_50%),radial-gradient(circle_at_80%_60%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(hsl(var(--primary))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary))_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="container relative mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur mb-6">
              <Sparkles className="h-3.5 w-3.5 text-white" />
              <span className="text-xs font-medium tracking-wide text-white/90 uppercase">
                Department of ECE — Research
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-5 tracking-tight leading-tight">
              Research &amp; Innovation
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
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
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="border-border text-center">
                    <CardContent className="p-6">
                      <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                      <Skeleton className="h-6 w-2/3 mx-auto mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-4/5 mx-auto" />
                    </CardContent>
                  </Card>
                ))
              : achievements.map((achievement, index) => (
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
      <section className="py-16 md:py-24 bg-muted/40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-3">
              Explore
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Research Areas
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our research domains and click any area to explore
              current projects in depth.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="border-border">
                  <CardContent className="p-6">
                    <Skeleton className="h-10 w-10 rounded-lg mb-4" />
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                </Card>
              ))
            ) : researchAreas.length === 0 ? (
              <div className="text-center py-12 col-span-full">
                <p className="text-muted-foreground">
                  No research areas available yet.
                </p>
              </div>
            ) : (
              researchAreas.map((area) => (
                <button
                  key={area.id}
                  onClick={() => setSelectedArea(area)}
                  className="group text-left"
                >
                  <Card className="h-full border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                    <CardContent className="p-6 pr-6">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-5 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 break-words">
                        {area.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 break-words">
                        {area.description}
                      </p>
                      <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-primary">
                        <span>View details</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </button>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Research area detail dialog */}
      <Dialog
        open={!!selectedArea}
        onOpenChange={(open) => !open && setSelectedArea(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedArea && (
            <>
              <DialogHeader className="pr-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                  <BookOpen className="h-6 w-6" />
                </div>
                <DialogTitle className="text-2xl md:text-3xl font-bold break-words">
                  {selectedArea.title}
                </DialogTitle>
                <DialogDescription className="text-base leading-relaxed break-words whitespace-pre-line">
                  {selectedArea.description}
                </DialogDescription>
              </DialogHeader>

              {selectedArea.projects && selectedArea.projects.length > 0 && (
                <div className="mt-4 pr-2">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground mb-3">
                    Current Projects
                  </h4>
                  <ul className="space-y-2.5">
                    {selectedArea.projects.map((project, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-3 pr-4"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span className="text-sm text-foreground break-words">
                          {project}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Call to Action */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-card max-w-4xl mx-auto p-8 md:p-14 text-center">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
                Interested in Collaborating?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                We welcome partnerships with industry, academic institutions,
                and research organizations. Reach out to explore collaboration
                opportunities.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <a
                  href={`mailto:${contactEmail}?subject=Research%20Collaboration%20Inquiry`}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Get in Touch
                </a>
              </Button>
              {/* <p className="mt-4 text-sm text-muted-foreground break-all">
                {contactEmail}
              </p> */}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Research;
