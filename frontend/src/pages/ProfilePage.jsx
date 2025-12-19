import React, { useState } from 'react';
import { Camera, Mail, Phone, MapPin, Calendar, Shield, Bell, CreditCard } from 'lucide-react';
import { NavLink } from 'react-router';

function ProfilePage({ onNavigate }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <button onClick={() => onNavigate('home')} className="hover:text-[#99582A]">
          Home
        </button>
        <span>/</span>
        <NavLink to={'/account'}>
          <button onClick={() => onNavigate('account')} className="hover:text-[#99582A]">
            Account
          </button>
        </NavLink>
        <span>/</span>
        <span className="text-[#2C2C2C]">Profile</span>
      </div>

      <h1 className="mb-8 text-[#2C2C2C]">My Profile</h1>

      {/* Profile Header */}
      <div className="p-8 border border-gray-200 rounded-lg shadow-sm bg-white mb-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-[#FFE6A7] flex items-center justify-center">
                <span className="text-3xl text-[#99582A]">JD</span>
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#99582A] text-white rounded-full flex items-center justify-center hover:bg-[#99582A]/90 transition-colors">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">JPG or PNG, max 2MB</p>
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="mb-1 text-[#2C2C2C]">John Doe</h2>
                <p className="text-muted-foreground">Premium Member</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded ${isEditing ? 'border border-gray-300' : 'bg-[#99582A] text-white hover:bg-[#99582A]/90'}`}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-[#99582A]" />
                <span className="text-[#2C2C2C]">john.doe@example.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-[#99582A]" />
                <span className="text-[#2C2C2C]">(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-[#99582A]" />
                <span className="text-[#2C2C2C]">New York, NY</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-[#99582A]" />
                <span className="text-[#2C2C2C]">Member since Jan 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-6 text-center bg-[#FFE6A7] border border-gray-200 rounded-lg">
          <div className="mb-2 text-[#99582A]">23</div>
          <p className="text-sm text-[#2C2C2C]">Total Orders</p>
        </div>
        <div className="p-6 text-center bg-[#FFE6A7] border border-gray-200 rounded-lg">
          <div className="mb-2 text-[#99582A]">$2,458</div>
          <p className="text-sm text-[#2C2C2C]">Total Spent</p>
        </div>
        <div className="p-6 text-center bg-[#FFE6A7] border border-gray-200 rounded-lg">
          <div className="mb-2 text-[#99582A]">8</div>
          <p className="text-sm text-[#2C2C2C]">Wishlist Items</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="p-8 border border-gray-200 rounded-lg shadow-sm bg-white mb-6">
        <h3 className="mb-6 text-[#2C2C2C]">Personal Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-[#2C2C2C]">First Name</label>
              <input
                type="text"
                defaultValue="John"
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-gray-200 rounded ${!isEditing ? 'bg-[#F0F0F0] text-gray-400' : 'bg-gray-50 text-gray-900'}`}
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#2C2C2C]">Last Name</label>
              <input
                type="text"
                defaultValue="Doe"
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-gray-200 rounded ${!isEditing ? 'bg-[#F0F0F0] text-gray-400' : 'bg-gray-50 text-gray-900'}`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 text-[#2C2C2C]">Email Address</label>
            <input
              type="email"
              defaultValue="john.doe@example.com"
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-200 rounded ${!isEditing ? 'bg-[#F0F0F0] text-gray-400' : 'bg-gray-50 text-gray-900'}`}
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-[#2C2C2C]">Phone Number</label>
            <input
              type="tel"
              defaultValue="(555) 123-4567"
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-200 rounded ${!isEditing ? 'bg-[#F0F0F0] text-gray-400' : 'bg-gray-50 text-gray-900'}`}
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-[#2C2C2C]">Date of Birth</label>
            <input
              type="date"
              defaultValue="1990-01-15"
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-200 rounded ${!isEditing ? 'bg-[#F0F0F0] text-gray-400' : 'bg-gray-50 text-gray-900'}`}
            />
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4">
              <button className="px-4 py-2 bg-[#99582A] text-white rounded hover:bg-[#99582A]/90">
                Save Changes
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Security Settings */}
      <div className="p-8 border border-gray-200 rounded-lg shadow-sm bg-white mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-[#99582A]" />
          <h3 className="text-[#2C2C2C]">Security Settings</h3>
        </div>

        <div className="space-y-6">
          <div className="border-t border-gray-200 pt-6">
            <h4 className="mb-4 text-[#2C2C2C]">Two-Factor Authentication</h4>
            <div className="flex items-center justify-between p-4 bg-[#F0F0F0] rounded-lg">
              <div>
                <p className="text-[#2C2C2C] mb-1">Enable 2FA</p>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#99582A]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="p-8 border border-gray-200 rounded-lg shadow-sm bg-white mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-[#99582A]" />
          <h3 className="text-[#2C2C2C]">Notification Preferences</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#F0F0F0] rounded-lg">
            <div>
              <p className="text-[#2C2C2C] mb-1">Order Updates</p>
              <p className="text-sm text-muted-foreground">
                Get notified about order status changes
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#99582A]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#F0F0F0] rounded-lg">
            <div>
              <p className="text-[#2C2C2C] mb-1">Promotional Emails</p>
              <p className="text-sm text-muted-foreground">
                Receive news about sales and special offers
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#99582A]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#F0F0F0] rounded-lg">
            <div>
              <p className="text-[#2C2C2C] mb-1">Product Recommendations</p>
              <p className="text-sm text-muted-foreground">
                Get personalized product suggestions
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#99582A]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#F0F0F0] rounded-lg">
            <div>
              <p className="text-[#2C2C2C] mb-1">Newsletter</p>
              <p className="text-sm text-muted-foreground">
                Weekly digest of new arrivals and trends
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#99582A]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="p-8 border border-gray-200 rounded-lg shadow-sm bg-white mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-[#99582A]" />
            <h3 className="text-[#2C2C2C]">Saved Payment Methods</h3>
          </div>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Add Card</button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-[#99582A] rounded flex items-center justify-center text-white text-xs">
                VISA
              </div>
              <div>
                <p className="text-[#2C2C2C]">•••• •••• •••• 3456</p>
                <p className="text-sm text-muted-foreground">Expires 12/26</p>
              </div>
            </div>
            <button className="px-3 py-1 hover:bg-gray-50 rounded text-sm">Remove</button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-[#99582A] rounded flex items-center justify-center text-white text-xs">
                MC
              </div>
              <div>
                <p className="text-[#2C2C2C]">•••• •••• •••• 7890</p>
                <p className="text-sm text-muted-foreground">Expires 08/25</p>
              </div>
            </div>
            <button className="px-3 py-1 hover:bg-gray-50 rounded text-sm">Remove</button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-8 border border-red-300 rounded-lg bg-white">
        <h3 className="mb-4 text-red-600">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete Account</button>
      </div>
    </div>
  );
}

export default ProfilePage;