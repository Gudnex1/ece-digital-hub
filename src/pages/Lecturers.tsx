import { GraduationCap, BookOpen, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';

interface Lecturer {
  id: string;
  full_name: string;
  title: string | null;
  specialization: string | null;
  designation: string | null;
  qualifications: string | null;
  office: string | null;
  bio: string | null;
  profile_image_url: string | null;
  category: string | null;
  address?: string | null;
  email?: string | null;
  research_interests?: string | null;
  postgraduate_supervision?: string | null;
  google_scholar_url?: string | null;
  researchgate_url?: string | null;
}

type CategoryKey = 'permanent' | 'adjunct' | 'admin' | 'technical';

const CATEGORY_META: Record<CategoryKey, { label: string; description: string }> = {
  permanent: {
    label: 'Permanent Staff',
    description: 'Full-time academic staff of the department.',
  },
  adjunct: {
    label: 'Adjunct Staff',
    description: 'Visiting and part-time academic staff.',
  },
  admin: {
    label: 'Administrative Staff',
    description: 'Non-teaching administrative personnel.',
  },
  technical: {
    label: 'Technical Staff',
    description: 'Laboratory and technical support staff.',
  },
};

function categorize(l: Lecturer): CategoryKey {
  const c = (l.category ?? '').toLowerCase();
  if (c === 'permanent' || c === 'adjunct' || c === 'admin' || c === 'technical') return c;
  // Fallback for legacy rows without a category set
  const s = `${l.designation ?? ''} ${l.title ?? ''}`.toLowerCase();
  if (/(technician|technologist|technical)/.test(s)) return 'technical';
  if (/(admin|secretar|clerk|officer|registrar|account)/.test(s)) return 'admin';
  if (/(adjunct|visiting|part[- ]time|sabbatical)/.test(s)) return 'adjunct';
  return 'permanent';
}

const Lecturers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [selected, setSelected] = useState<Lecturer | null>(null);
  const [bioExpanded, setBioExpanded] = useState(false);

  useEffect(() => {
    setBioExpanded(false);
  }, [selected]);

  useEffect(() => {
    loadLecturers();
  }, []);

  const loadLecturers = async () => {
    try {
      const {
        data,
        error
      } = await supabase
        .from('lecturers')
        .select('id, full_name, title, specialization, designation, qualifications, office, bio, profile_image_url, category, address, email, research_interests, postgraduate_supervision, google_scholar_url, researchgate_url')
        .order('full_name');
      if (error) throw error;
      setLecturers((data || []) as unknown as Lecturer[]);
    } catch (error) {
      console.error('Error loading lecturers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const grouped: Record<CategoryKey, Lecturer[]> = {
    permanent: [], adjunct: [], admin: [], technical: [],
  };
  lecturers.forEach(l => grouped[categorize(l)].push(l));

  const academicCount = grouped.permanent.length + grouped.adjunct.length;
  const nonTeachingCount = grouped.admin.length + grouped.technical.length;

  const renderGrid = (items: Lecturer[]) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6 space-y-4">
              <Skeleton className="h-24 w-24 rounded-full mx-auto" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-3 w-1/2 mx-auto" />
            </CardContent></Card>
          ))}
        </div>
      );
    }
    if (items.length === 0) {
      return (
        <div className="text-center py-16 text-muted-foreground">
          No members in this category yet.
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map(lecturer => (
          <Card
            key={lecturer.id}
            onClick={() => setSelected(lecturer)}
            className="group cursor-pointer overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/60"
          >
            <CardContent className="p-4 flex items-center gap-4 text-left">
              {lecturer.profile_image_url ? (
                <img
                  src={lecturer.profile_image_url}
                  alt={lecturer.full_name}
                  className="h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 object-cover rounded-md bg-muted"
                />
              ) : (
                <div className="h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 rounded-md bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-foreground leading-tight line-clamp-2">
                  {lecturer.title ? `${lecturer.title} ${lecturer.full_name}` : lecturer.full_name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {lecturer.designation || lecturer.specialization || 'Department of ECE'}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return <div className="min-h-screen flex flex-col">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-300 dark:bg-gradient-to-r dark:from-gray-600 dark:to-slate-800 py-16 md:py-20 ">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4 text-white">
              Our Department
            </h1>
            <p className="text-lg text-primary-foreground/90 text-white">
              Meet the academic and non-teaching staff powering the Department of
              Electronics and Computer Engineering.
            </p>
          </div>
        </div>
      </section>

      {/* Faculty Sections */}
      <section className="py-12 md:py-16 flex-1">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="academic" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-10">
              <TabsTrigger value="academic">
                Academic Staff <Badge variant="secondary" className="ml-2">{academicCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="non-teaching">
                Non-Teaching <Badge variant="secondary" className="ml-2">{nonTeachingCount}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="academic" className="space-y-12">
              <Accordion type="multiple" className="space-y-4">
                {(['permanent', 'adjunct'] as CategoryKey[]).map(key => (
                  <AccordionItem key={key} value={key} className="border border-border/60 rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="text-left">
                        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                          {CATEGORY_META[key].label}
                          <Badge variant="secondary">{grouped[key].length}</Badge>
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1 font-normal">{CATEGORY_META[key].description}</p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6">
                      {renderGrid(grouped[key])}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="non-teaching" className="space-y-12">
              <Accordion type="multiple" className="space-y-4">
                {(['admin', 'technical'] as CategoryKey[]).map(key => (
                  <AccordionItem key={key} value={key} className="border border-border/60 rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="text-left">
                        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                          {CATEGORY_META[key].label}
                          <Badge variant="secondary">{grouped[key].length}</Badge>
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1 font-normal">{CATEGORY_META[key].description}</p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6">
                      {renderGrid(grouped[key])}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Profile Modal */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          {selected && (
            <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
              {/* Left column */}
              <aside className="bg-muted/40 p-6 md:p-8 space-y-5 border-b md:border-b-0 md:border-r border-border/60">
                {selected.profile_image_url ? (
                  <img
                    src={selected.profile_image_url}
                    alt={selected.full_name}
                    className="w-32 h-32 mx-auto md:w-full md:h-auto md:mx-0 md:aspect-square rounded-md object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 mx-auto md:w-full md:h-auto md:mx-0 md:aspect-square rounded-md bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-16 w-16 text-primary" />
                  </div>
                )}

                {selected.google_scholar_url && (
                  <a
                    href={selected.google_scholar_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    <GraduationCap className="h-4 w-4 flex-shrink-0" />
                    <span>Google Scholar Profile</span>
                  </a>
                )}
                {selected.researchgate_url && (
                  <a
                    href={selected.researchgate_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    <BookOpen className="h-4 w-4 flex-shrink-0" />
                    <span>ResearchGate Profile</span>
                  </a>
                )}

                <div className="space-y-4 text-sm">
                  {selected.email && (
                    <div>
                      <p className="font-semibold text-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email
                      </p>
                      <a
                        href={`mailto:${selected.email}`}
                        className="text-primary hover:underline break-all"
                      >
                        {selected.email}
                      </a>
                    </div>
                  )}
                  {selected.address && (
                    <div>
                      <p className="font-semibold text-foreground">Address</p>
                      <p className="text-muted-foreground whitespace-pre-line">{selected.address}</p>
                    </div>
                  )}
                </div>
              </aside>

              {/* Right column */}
              <div className="p-6 md:p-10">
                <DialogTitle className="text-3xl md:text-4xl font-bold leading-tight">
                  {selected.title ? `${selected.title} ${selected.full_name}` : selected.full_name}
                </DialogTitle>
                <div className="mt-3 h-1 w-16 bg-foreground/80 rounded-full" />

                {selected.designation && (
                  <p className="mt-6 text-base text-foreground">{selected.designation}</p>
                )}
                {selected.qualifications && (
                  <p className="mt-3 text-sm text-muted-foreground whitespace-pre-line">
                    {selected.qualifications}
                  </p>
                )}

                {selected.research_interests && (
                  <section className="mt-8">
                    <h3 className="text-base font-semibold text-foreground mb-2">Research Interests</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {selected.research_interests.split('\n').filter(Boolean).map((line, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span>{line.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {selected.postgraduate_supervision && (
                  <section className="mt-8">
                    <h3 className="text-base font-semibold text-foreground mb-2">Postgraduate Supervision</h3>
                    <div className="space-y-2 text-sm text-muted-foreground whitespace-pre-line">
                      {selected.postgraduate_supervision}
                    </div>
                  </section>
                )}

                {selected.specialization && (
                  <section className="mt-8">
                    <h3 className="text-base font-semibold text-foreground mb-2">Specialization</h3>
                    <p className="text-sm text-muted-foreground">{selected.specialization}</p>
                  </section>
                )}

                {selected.bio && (
                  <section className="mt-8">
                    <h3 className="text-base font-semibold text-foreground mb-2">Biography</h3>
                    <p
                      className={`text-sm text-muted-foreground leading-relaxed whitespace-pre-line ${
                        !bioExpanded && selected.bio.length > 320 ? 'line-clamp-4' : ''
                      }`}
                    >
                      {selected.bio}
                    </p>
                    {selected.bio.length > 320 && (
                      <Button
                        variant="link"
                        size="sm"
                        className="px-0 mt-1 h-auto"
                        onClick={() => setBioExpanded(v => !v)}
                      >
                        {bioExpanded ? 'Show less' : 'Read more'}
                      </Button>
                    )}
                  </section>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>;
};
export default Lecturers;