import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";

const LecturerDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    title: "",
    specialization: "",
    email: "",
    phone: "",
    office: "",
    bio: "",
    profile_image_url: "",
  });

  useEffect(() => {
    checkAuthAndLoadProfile();
  }, []);

  const checkAuthAndLoadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please log in to access this page");
        navigate("/auth");
        return;
      }

      // Check if user is a lecturer
      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (userRoles?.role !== "lecturer") {
        toast.error("Access denied. This page is only for lecturers.");
        navigate("/");
        return;
      }

      // Load existing lecturer profile if it exists
      const { data: lecturerData } = await supabase
        .from("lecturers")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (lecturerData) {
        setProfile({
          full_name: lecturerData.full_name || "",
          title: lecturerData.title || "",
          specialization: lecturerData.specialization || "",
          email: lecturerData.email || "",
          phone: lecturerData.phone || "",
          office: lecturerData.office || "",
          bio: lecturerData.bio || "",
          profile_image_url: lecturerData.profile_image_url || "",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("lecturers")
        .upsert({
          user_id: session.user.id,
          ...profile,
        });

      if (error) throw error;

      toast.success("Profile saved successfully!");
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Lecturer Dashboard</h1>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Manage Your Profile</CardTitle>
              <CardDescription>
                Update your information to be displayed on the lecturers page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={profile.full_name}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title (e.g., Dr., Prof.)</Label>
                    <Input
                      id="title"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization *</Label>
                  <Input
                    id="specialization"
                    value={profile.specialization}
                    onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="office">Office Location</Label>
                  <Input
                    id="office"
                    value={profile.office}
                    onChange={(e) => setProfile({ ...profile, office: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                    placeholder="Brief description about yourself, research interests, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile_image_url">Profile Image URL</Label>
                  <Input
                    id="profile_image_url"
                    type="url"
                    value={profile.profile_image_url}
                    onChange={(e) => setProfile({ ...profile, profile_image_url: e.target.value })}
                    placeholder="https://example.com/your-photo.jpg"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LecturerDashboard;