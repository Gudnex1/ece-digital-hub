import { Mail, Phone, MapPin, GraduationCap } from 'lucide-react';
const Footer = () => {
<<<<<<< HEAD
  return (
    <footer className="bg-gray-800 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
=======
  return <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12 text-white bg-[#3f3e3e]">
>>>>>>> 238ebaf5ea88ae48f95fd7f3c1e72c5eb0396b20
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-hero-gradient p-2 rounded-lg">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold text-white">ECE Department</h3>
            </div>
<<<<<<< HEAD
            <p className="text-sm text-slate-400">
=======
            <p className="text-sm text-primary-foreground">
>>>>>>> 238ebaf5ea88ae48f95fd7f3c1e72c5eb0396b20
              Shaping the future of electronics and computer engineering through excellence in education, research, and innovation.
            </p>
          </div>

          {/* Contact Information */}
          <div>
<<<<<<< HEAD
            <h3 className="text-lg font-bold text-white mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-white mt-0.5" />
                <p className="text-sm text-slate-400">
                  Department of Electronics & Computer Engineering
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-white" />
                <p className="text-sm text-slate-400">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-white" />
                <p className="text-sm text-slate-400">ece@university.edu</p>
=======
            <h3 className="text-lg font-bold mb-4 text-white">Contact Us</h3>
            <div className="space-y-3 text-white">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <p className="text-sm text-primary-foreground">
                  Department of Electronics & Computer Engineering<br />
                  University Campus
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <p className="text-sm text-primary-foreground">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <p className="text-sm text-primary-foreground">ece@university.edu</p>
>>>>>>> 238ebaf5ea88ae48f95fd7f3c1e72c5eb0396b20
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
<<<<<<< HEAD
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
=======
            <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
>>>>>>> 238ebaf5ea88ae48f95fd7f3c1e72c5eb0396b20
            <div className="space-y-2">
              <a href="/" className="block text-sm text-slate-400 hover:text-white transition-colors">
                Home
              </a>
              <a href="/lecturers" className="block text-sm text-slate-400 hover:text-white transition-colors">
                Faculty
              </a>
              <a href="/programs" className="block text-sm text-slate-400 hover:text-white transition-colors">
                Academic Programs
              </a>
              <a href="/research" className="block text-sm text-slate-400 hover:text-white transition-colors">
                Research & Publications
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Department of Electronics & Computer Engineering. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;