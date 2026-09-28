import { useEffect, useState } from 'react';
import { Menu, Save, Mail, Phone, MapPin, Calendar, Edit2, LogOut } from 'lucide-react';
import Sidebar from './sidebar.jsx';
import '../App.css';
import '../styles/profile.css';
import { apiRequest } from '../api.js';

const Profile = ({
  onNavigate,
  currentPage
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@school.com',
    phone: '09123456789',
    position: 'Administrator',
    department: 'Management',
    joinDate: '2024-01-15',
    location: 'Riverside High School, Philippines',
    bio: 'Dedicated education administrator managing class attendance and student records.',
    avatar: '👤'
  });
  const [editData, setEditData] = useState(profileData);
  useEffect(() => {
    apiRequest('profile').then(({ profile }) => {
      if (!profile) return;
      const [firstName, ...lastNameParts] = profile.name.split(' ');
      const loaded = { firstName, lastName: lastNameParts.join(' '), email: profile.email, phone: profile.phone, position: profile.position, department: profile.department, location: profile.location, bio: profile.bio, joinDate: profile.created_at?.slice(0, 10) || '2024-01-15', avatar: '👤' };
      setProfileData(loaded); setEditData(loaded);
    }).catch((error) => alert(error.message));
  }, []);
  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profileData);
  };
  const handleCancel = () => {
    setIsEditing(false);
  };
  const handleChange = (field, value) => {
    setEditData({
      ...editData,
      [field]: value
    });
    console.log(`${field} updated to:`, value);
  };
  const handleSave = async () => {
    try { const result = await apiRequest('profile', { method: 'PUT', body: editData }); setProfileData(editData); setIsEditing(false); alert(result.message); }
    catch (error) { alert(error.message); }
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    alert('You have been logged out.');
    onNavigate('login');
  };
  const handleNavigate = page => {
    setIsSidebarOpen(false);
    onNavigate(page);
  };

  return <div className="dashboard-container">
      <Sidebar onNavigate={handleNavigate} currentPage={currentPage} isOpen={isSidebarOpen} />
      {isSidebarOpen && <button className="sidebar-backdrop" aria-label="Close navigation menu" onClick={() => setIsSidebarOpen(false)} />}

      <main className="main-content">
        <header className="dashboard-header">
          <button className="menu-button" type="button" aria-label="Open navigation menu" aria-expanded={isSidebarOpen} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu size={24} />
          </button>
          <h1>MY PROFILE</h1>
        </header>

        <div className="profile-style-1">
          {/* Profile Header Section */}
          <div className="profile-style-2">
            <div className="profile-style-3">
              <div className="profile-style-4">
                {profileData.avatar}
              </div>
              <div className="profile-style-5">
                <h2 className="profile-style-6">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <p className="profile-style-7">
                  {profileData.position} • {profileData.department}
                </p>
                <p className="profile-style-8">
                  📍 {profileData.location}
                </p>
                <p className="profile-style-9">
                  {profileData.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="profile-style-10">
            {!isEditing && <>
                <button onClick={handleEdit} className="profile-style-11">
                  <Edit2 size={18} />
                  Edit Profile
                </button>
                <button onClick={handleLogout} className="profile-style-12">
                  <LogOut size={18} />
                  Logout
                </button>
              </>}
          </div>

          {/* Profile Content */}
          {!isEditing ?
        // View Mode
        <div className="profile-style-13">
              {/* Contact Information */}
              <div className="profile-style-14">
                <h3 className="profile-style-15">
                  📞 Contact Information
                </h3>
                <div className="profile-style-16">
                  <div>
                    <label className="profile-style-17">
                      Email
                    </label>
                    <p className="profile-style-18">
                      <Mail size={16} className="profile-style-19" />
                      {profileData.email}
                    </p>
                  </div>
                  <div>
                    <label className="profile-style-20">
                      Phone
                    </label>
                    <p className="profile-style-21">
                      <Phone size={16} className="profile-style-22" />
                      {profileData.phone}
                    </p>
                  </div>
                  <div>
                    <label className="profile-style-23">
                      Location
                    </label>
                    <p className="profile-style-24">
                      <MapPin size={16} className="profile-style-25" />
                      {profileData.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="profile-style-26">
                <h3 className="profile-style-27">
                  💼 Professional Information
                </h3>
                <div className="profile-style-28">
                  <div>
                    <label className="profile-style-29">
                      Position
                    </label>
                    <p className="profile-style-30">
                      {profileData.position}
                    </p>
                  </div>
                  <div>
                    <label className="profile-style-31">
                      Department
                    </label>
                    <p className="profile-style-32">
                      {profileData.department}
                    </p>
                  </div>
                  <div>
                    <label className="profile-style-33">
                      Join Date
                    </label>
                    <p className="profile-style-34">
                      <Calendar size={16} className="profile-style-35" />
                      {new Date(profileData.joinDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                    </p>
                  </div>
                </div>
              </div>
            </div> :
        // Edit Mode
        <div className="profile-style-36">
              <h3 className="profile-style-37">Edit Profile</h3>
              
              <div className="profile-style-38">
                <div>
                  <label className="profile-style-39">
                    First Name
                  </label>
                  <input type="text" value={editData.firstName} onChange={e => handleChange('firstName', e.target.value)} className="profile-style-40" />
                </div>
                <div>
                  <label className="profile-style-41">
                    Last Name
                  </label>
                  <input type="text" value={editData.lastName} onChange={e => handleChange('lastName', e.target.value)} className="profile-style-42" />
                </div>
              </div>

              <div className="profile-style-43">
                <div>
                  <label className="profile-style-44">
                    Email
                  </label>
                  <input type="email" value={editData.email} onChange={e => handleChange('email', e.target.value)} className="profile-style-45" />
                </div>
                <div>
                  <label className="profile-style-46">
                    Phone
                  </label>
                  <input type="tel" value={editData.phone} onChange={e => handleChange('phone', e.target.value)} className="profile-style-47" />
                </div>
              </div>

              <div className="profile-style-48">
                <div>
                  <label className="profile-style-49">
                    Position
                  </label>
                  <input type="text" value={editData.position} onChange={e => handleChange('position', e.target.value)} className="profile-style-50" />
                </div>
                <div>
                  <label className="profile-style-51">
                    Department
                  </label>
                  <input type="text" value={editData.department} onChange={e => handleChange('department', e.target.value)} className="profile-style-52" />
                </div>
              </div>

              <div className="profile-style-53">
                <label className="profile-style-54">
                  Bio
                </label>
                <textarea value={editData.bio} onChange={e => handleChange('bio', e.target.value)} className="profile-style-55" />
              </div>

              <div className="profile-style-56">
                <button onClick={handleSave} className="profile-style-57">
                  <Save size={18} />
                  Save Changes
                </button>
                <button onClick={handleCancel} className="profile-style-58">
                  Cancel
                </button>
              </div>
            </div>}
        </div>
      </main>
    </div>;
};
export default Profile;
