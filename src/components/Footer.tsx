import { Mail, Phone, MapPin, GraduationCap } from 'lucide-react';
const Footer = () => {
  return (
    <footer className="bg-[#1d283a] dark:bg-gray-800 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-hero-gradient p-2 rounded-lg">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">ECE Department</h3>
            </div>
            <p className="text-sm text-gray-300">
              Shaping the future of electronics and computer engineering through
              excellence in education, research, and innovation.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-white mt-0.5" />
                <p className="text-sm text-gray-300">
                  Department of Electronics & Computer Engineering
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-white" />
                <p className="text-sm text-gray-300">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-white" />
                <p className="text-sm text-gray-300">ece@university.edu</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a
                href="/"
                className="block text-sm text-gray-300 hover:text-white transition-colors"
              >
                Home
              </a>
              <a
                href="/lecturers"
                className="block text-sm text-gray-300 hover:text-white transition-colors"
              >
                Faculty
              </a>
              <a
                href="/programs"
                className="block text-sm text-gray-300 hover:text-white transition-colors"
              >
                Academic Programs
              </a>
              <a
                href="/research"
                className="block text-sm text-gray-300 hover:text-white transition-colors"
              >
                Research & Publications
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-gray-300">
            © {new Date().getFullYear()} Department of Electronics & Computer
            Engineering. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;