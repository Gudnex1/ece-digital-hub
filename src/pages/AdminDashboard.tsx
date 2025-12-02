import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Trash2, Plus, Upload } from 'lucide-react';

interface Lecturer {
  id: string;
  full_name: string;
  title: string | null;
  specialization: string | null;
  designation: string | null;
  office: string | null;
  qualifications: string | null;
  bio: string | null;
  email: string;
  phone: string | null;
  profile_image_url: string | null;
}

interface ResearchArea {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  projects: string[];
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [researchAreas, setResearchAreas] = useState<ResearchArea[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [newLecturer, setNewLecturer] = useState({
    full_name: '',
    title: '',
    specialization: '',
    designation: '',
    office: '',
    qualifications: '',
    bio: '',
    email: '',
    phone: '',
    profile_image_url: '',
  });

  const [newResearchArea, setNewResearchArea] = useState({
    title: '',
    description: '',
    icon: '',
    projects: '',
  });

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      navigate('/auth');
      return;
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin');

    if (error) {
      console.error('Error checking admin role:', error);
      toast.error('Could not verify access. Please try again.');
      navigate('/');
      return;
    }

    if (!data || data.length === 0) {
      toast.error('Access denied');
      navigate('/');
      return;
    }

    setIsAdmin(true);
    setIsLoading(false);
    loadData();
  };

  const loadData = async () => {
    const [lecturersRes, researchRes] = await Promise.all([
      supabase.from('lecturers').select('*').order('full_name'),
      supabase.from('research_areas').select('*').order('title'),
    ]);

    if (lecturersRes.data) setLecturers(lecturersRes.data);
    if (researchRes.data) setResearchAreas(researchRes.data);
  };

  const handleImageUpload = async (file: File, lecturerId?: string) => {
    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('lecturer-profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('lecturer-profiles')
        .getPublicUrl(filePath);

      if (lecturerId) {
        await supabase
          .from('lecturers')
          .update({ profile_image_url: publicUrl })
          .eq('id', lecturerId);
        loadData();
      } else {
        setNewLecturer({ ...newLecturer, profile_image_url: publicUrl });
      }

      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddLecturer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase.from('lecturers').insert([{
        ...newLecturer,
        user_id: session.user.id,
      }]);

      if (error) throw error;

      toast.success('Lecturer added successfully');
      setNewLecturer({
        full_name: '',
        title: '',
        specialization: '',
        designation: '',
        office: '',
        qualifications: '',
        bio: '',
        email: '',
        phone: '',
        profile_image_url: '',
      });
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add lecturer');
    }
  };

  const handleDeleteLecturer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lecturer?')) return;

    try {
      const { error } = await supabase.from('lecturers').delete().eq('id', id);
      if (error) throw error;
      toast.success('Lecturer deleted successfully');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete lecturer');
    }
  };

  const handleAddResearchArea = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projects = newResearchArea.projects
        .split('\n')
        .filter(p => p.trim())
        .map(p => p.trim());

      const { error } = await supabase.from('research_areas').insert([{
        title: newResearchArea.title,
        description: newResearchArea.description,
        icon: newResearchArea.icon || null,
        projects,
      }]);

      if (error) throw error;

      toast.success('Research area added successfully');
      setNewResearchArea({ title: '', description: '', icon: '', projects: '' });
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add research area');
    }
  };

  const handleDeleteResearchArea = async (id: string) => {
    if (!confirm('Are you sure you want to delete this research area?')) return;

    try {
      const { error } = await supabase.from('research_areas').delete().eq('id', id);
      if (error) throw error;
      toast.success('Research area deleted successfully');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete research area');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">Manage lecturers, research areas, and content</p>
          </div>

          <Tabs defaultValue="lecturers" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12">
              <TabsTrigger value="lecturers" className="text-base">Lecturers</TabsTrigger>
              <TabsTrigger value="research" className="text-base">Research Areas</TabsTrigger>
            </TabsList>

            <TabsContent value="lecturers" className="space-y-8">
              <Card className="border-primary/20 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Add New Lecturer</CardTitle>
                      <CardDescription className="text-base">Fill in the details to add a new lecturer profile</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddLecturer} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name *</Label>
                        <Input
                          id="full_name"
                          value={newLecturer.full_name}
                          onChange={(e) => setNewLecturer({ ...newLecturer, full_name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newLecturer.email}
                          onChange={(e) => setNewLecturer({ ...newLecturer, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Title (e.g., Dr., Prof.)</Label>
                        <Input
                          id="title"
                          value={newLecturer.title}
                          onChange={(e) => setNewLecturer({ ...newLecturer, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="designation">Designation</Label>
                        <Input
                          id="designation"
                          placeholder="e.g., Senior Lecturer, Associate Professor"
                          value={newLecturer.designation}
                          onChange={(e) => setNewLecturer({ ...newLecturer, designation: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input
                          id="specialization"
                          value={newLecturer.specialization}
                          onChange={(e) => setNewLecturer({ ...newLecturer, specialization: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="office">Office</Label>
                        <Input
                          id="office"
                          value={newLecturer.office}
                          onChange={(e) => setNewLecturer({ ...newLecturer, office: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={newLecturer.phone}
                          onChange={(e) => setNewLecturer({ ...newLecturer, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile_image">Profile Image</Label>
                        <Input
                          id="profile_image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                          disabled={uploadingImage}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="qualifications">Qualifications</Label>
                      <Textarea
                        id="qualifications"
                        placeholder="List qualifications (e.g., Ph.D. in Computer Engineering, B.Sc. in Electronics)"
                        value={newLecturer.qualifications}
                        onChange={(e) => setNewLecturer({ ...newLecturer, qualifications: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Brief biography"
                        value={newLecturer.bio}
                        onChange={(e) => setNewLecturer({ ...newLecturer, bio: e.target.value })}
                        rows={4}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lecturer
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-primary/20 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50">
                  <CardTitle className="text-2xl">Existing Lecturers ({lecturers.length})</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {lecturers.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-lg">No lecturers added yet</p>
                      <p className="text-sm">Add your first lecturer using the form above</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {lecturers.map((lecturer) => (
                        <div key={lecturer.id} className="group relative p-5 border-2 border-border hover:border-primary/50 rounded-xl transition-all duration-300 hover:shadow-md bg-card">
                          <div className="flex items-start gap-4">
                            {lecturer.profile_image_url ? (
                              <img 
                                src={lecturer.profile_image_url} 
                                alt={lecturer.full_name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                                <span className="text-2xl font-bold text-primary">
                                  {lecturer.full_name.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg truncate">
                                {lecturer.title ? `${lecturer.title} ${lecturer.full_name}` : lecturer.full_name}
                              </h3>
                              <p className="text-sm text-muted-foreground truncate">{lecturer.email}</p>
                              {lecturer.designation && (
                                <p className="text-sm text-primary font-medium mt-1">{lecturer.designation}</p>
                              )}
                              {lecturer.specialization && (
                                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{lecturer.specialization}</p>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDeleteLecturer(lecturer.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="research" className="space-y-8">
              <Card className="border-primary/20 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Add Research Area</CardTitle>
                      <CardDescription className="text-base">Add a new research area with projects</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddResearchArea} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="research_title">Title *</Label>
                      <Input
                        id="research_title"
                        value={newResearchArea.title}
                        onChange={(e) => setNewResearchArea({ ...newResearchArea, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="research_description">Description *</Label>
                      <Textarea
                        id="research_description"
                        value={newResearchArea.description}
                        onChange={(e) => setNewResearchArea({ ...newResearchArea, description: e.target.value })}
                        required
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="research_projects">Projects (one per line)</Label>
                      <Textarea
                        id="research_projects"
                        placeholder="Project 1&#10;Project 2&#10;Project 3"
                        value={newResearchArea.projects}
                        onChange={(e) => setNewResearchArea({ ...newResearchArea, projects: e.target.value })}
                        rows={5}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Research Area
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-primary/20 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50">
                  <CardTitle className="text-2xl">Existing Research Areas ({researchAreas.length})</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {researchAreas.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-lg">No research areas added yet</p>
                      <p className="text-sm">Add your first research area using the form above</p>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {researchAreas.map((area) => (
                        <div key={area.id} className="group relative p-6 border-2 border-border hover:border-primary/50 rounded-xl transition-all duration-300 hover:shadow-md bg-card">
                          <div className="mb-3">
                            <h3 className="font-bold text-lg mb-2 text-foreground">{area.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                              {area.description}
                            </p>
                          </div>
                          {area.projects && area.projects.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-border/50">
                              <div className="flex items-center gap-2 text-xs font-medium text-primary">
                                <div className="p-1 bg-primary/10 rounded">
                                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                {area.projects.length} {area.projects.length === 1 ? 'project' : 'projects'}
                              </div>
                            </div>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDeleteResearchArea(area.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
