import { GraduationCap, Mail, MapPin, Phone, GraduationCap as GradIcon, BookOpen, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
        .select('id, full_name, title, specialization, designation, qualifications, office, bio, profile_image_url, category')
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map(lecturer => (
          <Card
            key={lecturer.id}
            onClick={() => setSelected(lecturer)}
            className="group cursor-pointer overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/60"
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                {lecturer.profile_image_url ? (
                  <img
                    src={lecturer.profile_image_url}
                    alt={lecturer.full_name}
                    className="h-28 w-28 rounded-full object-cover ring-4 ring-primary/10 group-hover:ring-primary/30 transition"
                  />
                ) : (
                  <div className="h-28 w-28 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/10">
                    <GraduationCap className="h-12 w-12 text-primary" />
                  </div>
                )}
              </div>
              <h3 className="text-base font-semibold text-foreground leading-tight">
                {lecturer.title ? `${lecturer.title} ${lecturer.full_name}` : lecturer.full_name}
              </h3>
              {lecturer.designation && (
                <p className="text-sm text-primary mt-1 font-medium">{lecturer.designation}</p>
              )}
              {lecturer.specialization && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{lecturer.specialization}</p>
              )}
              <span className="text-xs text-primary mt-4 opacity-0 group-hover:opacity-100 transition">
                View profile →
              </span>
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
              Our Faculty
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                  {selected.profile_image_url ? (
                    <img
                      src={selected.profile_image_url}
                      alt={selected.full_name}
                      className="h-28 w-28 rounded-full object-cover ring-4 ring-primary/20 flex-shrink-0"
                    />
                  ) : (
                    <div className="h-28 w-28 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-12 w-12 text-primary" />
                    </div>
                  )}
                  <div className="flex-1">
                    <DialogTitle className="text-2xl">
                      {selected.title ? `${selected.title} ${selected.full_name}` : selected.full_name}
                    </DialogTitle>
                    {selected.designation && (
                      <DialogDescription className="text-primary font-medium mt-1">
                        {selected.designation}
                      </DialogDescription>
                    )}
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-6 space-y-5">
                {selected.bio && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">Biography</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selected.bio}</p>
                  </div>
                )}
                {selected.specialization && (
                  <div className="flex gap-3">
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">Specialization</h4>
                      <p className="text-sm text-muted-foreground">{selected.specialization}</p>
                    </div>
                  </div>
                )}
                {selected.qualifications && (
                  <div className="flex gap-3">
                    <Award className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">Qualifications</h4>
                      <p className="text-sm text-muted-foreground">{selected.qualifications}</p>
                    </div>
                  </div>
                )}
                {selected.office && (
                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">Office</h4>
                      <p className="text-sm text-muted-foreground">{selected.office}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>;
};
export default Lecturers;