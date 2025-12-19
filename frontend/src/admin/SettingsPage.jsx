import { User, Lock, Bell, Shield, Users, Trash2, Key } from "lucide-react";
import { useState, useEffect } from "react";
import { getUserBySupabaseId, getUsers, updateUser } from "../hooks/services";
import { toast } from "sonner";
import { useAuth } from "../authResource/useAuth";

const teamMembers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@yourbrand.com",
    role: "Owner",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  },
  {
    id: 2,
    name: "Sarah Manager",
    email: "sarah.m@yourbrand.com",
    role: "Manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  },
  {
    id: 3,
    name: "John Support",
    email: "john.s@yourbrand.com",
    role: "Support",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  },
];

export function SettingsPage() {
  const { session } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!session?.user?.id) return;

      try {
        const [userData, usersData] = await Promise.all([
          getUserBySupabaseId(session.user.id),
          getUsers()
        ]);
        setCurrentUser(userData);
        setAllUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch settings data:", error);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-[#717182]">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-[#333333] text-2xl font-semibold">Settings</h1>
        <p className="text-[#717182] mt-1">
          Manage your account and admin preferences
        </p>
      </div>

      {/* Account Information */}
      <div className="border border-[#F0F0F0] rounded-lg bg-white">
        <div className="border-b border-[#F0F0F0] p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFE6A7] flex items-center justify-center">
              <User className="w-5 h-5 text-[#99582A]" />
            </div>
            <div>
              <h3 className="text-[#333333] font-semibold">Account Information</h3>
              <p className="text-[#717182] text-sm">Update your personal details</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.firstName || 'admin'}`}
              alt="Avatar"
              className="w-20 h-20 rounded-full"
            />
            <div>
              <button className="border border-[#F0F0F0] hover:border-[#99582A] px-4 py-2 rounded-md text-sm">
                Change Avatar
              </button>
              <p className="text-sm text-[#717182] mt-2">JPG, PNG or GIF (max. 2MB)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium text-[#333333]">First Name</label>
              <input
                id="firstName"
                placeholder="First Name"
                defaultValue={currentUser?.firstName || ""}
                className="w-full px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium text-[#333333]">Last Name</label>
              <input
                id="lastName"
                placeholder="Last Name"
                defaultValue={currentUser?.lastName || ""}
                className="w-full px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-[#333333]">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="email@example.com"
              defaultValue={currentUser?.email || ""}
              className="w-full px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-[#333333]">Phone Number</label>
            <input
              id="phone"
              type="tel"
              placeholder="+254 XXX XXX XXX"
              defaultValue={currentUser?.phoneNumber || ""}
              className="w-full px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={async () => {
                const firstName = document.getElementById('firstName').value;
                const lastName = document.getElementById('lastName').value;
                const email = document.getElementById('email').value;
                const phoneNumber = document.getElementById('phone').value;

                try {
                  await updateUser(currentUser.id, {
                    firstName,
                    lastName,
                    email,
                    phoneNumber
                  });
                  toast.success("Profile updated successfully");
                  // Refresh current user data
                  const updatedUser = await getUserById(currentUser.id);
                  setCurrentUser(updatedUser);
                } catch (error) {
                  toast.error("Failed to update profile");
                  console.error(error);
                }
              }}
              className="bg-[#99582A] hover:bg-[#7d4622] text-white px-4 py-2 rounded-md"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>


      {/* Team Management */}
      <div className="border border-[#F0F0F0] rounded-lg bg-white">
        <div className="border-b border-[#F0F0F0] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFE6A7] flex items-center justify-center">
                <Users className="w-5 h-5 text-[#99582A]" />
              </div>
              <div>
                <h3 className="text-[#333333] font-semibold">Team Members</h3>
                <p className="text-[#717182] text-sm">Manage admin access and permissions</p>
              </div>
            </div>
            <button className="bg-[#99582A] hover:bg-[#7d4622] text-white px-4 py-2 rounded-md">
              Invite Member
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {allUsers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 rounded-lg border border-[#F0F0F0] hover:bg-[#FFE6A7]/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.firstName || 'user'}`}
                  alt={`${member.firstName} ${member.lastName}`}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-[#333333]">{member.firstName} {member.lastName}</p>
                  <p className="text-sm text-[#717182]">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="bg-[#FFE6A7] text-[#99582A] px-2 py-1 rounded text-sm capitalize">
                  {member.role}
                </span>
                {member.role !== "OWNER" && member.id !== currentUser?.id && (
                  <select
                    defaultValue={member.role.toLowerCase()}
                    onChange={async (e) => {
                      try {
                        await updateUser(member.id, { role: e.target.value.toUpperCase() });
                        toast.success(`Role updated to ${e.target.value}`);
                        // Refresh users list
                        const updatedUsers = await getUsers();
                        setAllUsers(updatedUsers);
                      } catch (error) {
                        toast.error("Failed to update role");
                        console.error(error);
                      }
                    }}
                    className="w-32 px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md"
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="user">User</option>
                  </select>
                )}
                {member.role !== "OWNER" && member.id !== currentUser?.id && (
                  <button
                    onClick={async () => {
                      if (window.confirm(`Are you sure you want to remove ${member.firstName} ${member.lastName}?`)) {
                        try {
                          // Note: We don't have a delete user endpoint, so this is just a placeholder
                          toast.info("User removal not implemented yet");
                        } catch (error) {
                          toast.error("Failed to remove user");
                          console.error(error);
                        }
                      }
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Danger Zone */}
      <div className="border border-red-200 rounded-lg bg-red-50/30">
        <div className="border-b border-red-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-red-600 font-semibold">Danger Zone</h3>
              <p className="text-[#717182] text-sm">Irreversible and destructive actions</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#333333]">Delete Account</p>
              <p className="text-sm text-[#717182] mt-1">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button
              className="bg-red-500 hover:bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={() => {
                // Simple alert for demo; in real app, use a modal
                if (window.confirm("Are you absolutely sure? This action cannot be undone. This will permanently delete your account and remove all your data from our servers.")) {
                  // Handle delete
                }
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}