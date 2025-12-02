import { Mail, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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
  email: string;
  phone: string | null;
  office: string | null;
  bio: string | null;
  profile_image_url: string | null;
}
const Lecturers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  useEffect(() => {
    loadLecturers();
  }, []);
  const loadLecturers = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('lecturers').select('*').order('full_name');
      if (error) throw error;
      setLecturers(data || []);
    } catch (error) {
      console.error('Error loading lecturers:', error);
    } finally {
      setIsLoading(false);
    }
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
            {isLoading ? Array.from({
            length: 6
          }).map((_, index) => <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>) : lecturers.length === 0 ? <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No lecturers found. Lecturers can create their profiles by logging in.</p>
              </div> : lecturers.map(lecturer => <Card key={lecturer.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {lecturer.profile_image_url ? <img src={lecturer.profile_image_url} alt={lecturer.full_name} className="h-12 w-12 rounded-full object-cover" /> : <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <GraduationCap className="h-6 w-6 text-foreground" />
                          </div>}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {lecturer.title ? `${lecturer.title} ${lecturer.full_name}` : lecturer.full_name}
                        </h3>
                        {lecturer.designation && <p className="text-sm font-medium text-primary mb-2">
                            {lecturer.designation}
                          </p>}
                        {lecturer.specialization && <p className="text-sm text-muted-foreground mb-2">
                            <span className="font-medium text-secondary-foreground">Specialization:</span> {lecturer.specialization}
                          </p>}
                        {lecturer.qualifications && <p className="text-sm text-muted-foreground mb-2">
                            <span className="font-medium">Qualifications:</span> {lecturer.qualifications}
                          </p>}
                        {lecturer.office && <p className="text-sm text-muted-foreground mb-2">
                            <span className="font-medium">Office:</span> {lecturer.office}
                          </p>}
                        {lecturer.bio && <p className="text-sm text-muted-foreground mb-3">{lecturer.bio}</p>}
                        <div className="flex flex-wrap gap-3">
                          <a href={`mailto:${lecturer.email}`} className="inline-flex items-center gap-2 text-sm text-primary hover:text-foreground transition-colors">
                            <Mail className="h-4 w-4" />
                            {lecturer.email}
                          </a>
                          {lecturer.phone && <span className="text-sm text-muted-foreground">
                              <span className="font-medium">Phone:</span> {lecturer.phone}
                            </span>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Lecturers;