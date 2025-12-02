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

    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    if (data?.role !== 'admin') {
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

          <Tabs defaultValue="lecturers" className="space-y-6">
            <TabsList>
              <TabsTrigger value="lecturers">Lecturers</TabsTrigger>
              <TabsTrigger value="research">Research Areas</TabsTrigger>
            </TabsList>

            <TabsContent value="lecturers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Lecturer</CardTitle>
                  <CardDescription>Fill in the details to add a new lecturer profile</CardDescription>
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

              <Card>
                <CardHeader>
                  <CardTitle>Existing Lecturers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lecturers.map((lecturer) => (
                      <div key={lecturer.id} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {lecturer.title ? `${lecturer.title} ${lecturer.full_name}` : lecturer.full_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{lecturer.email}</p>
                          {lecturer.designation && (
                            <p className="text-sm text-muted-foreground">{lecturer.designation}</p>
                          )}
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteLecturer(lecturer.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="research" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add Research Area</CardTitle>
                  <CardDescription>Add a new research area with projects</CardDescription>
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

              <Card>
                <CardHeader>
                  <CardTitle>Existing Research Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {researchAreas.map((area) => (
                      <div key={area.id} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold">{area.title}</h3>
                          <p className="text-sm text-muted-foreground">{area.description}</p>
                          {area.projects.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-2">
                              {area.projects.length} projects
                            </p>
                          )}
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteResearchArea(area.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
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
