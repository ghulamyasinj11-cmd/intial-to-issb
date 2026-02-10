import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  User,
  CheckCircle,
  XCircle,
  Key,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getUsers, createUser, updateUser, deleteUser, changePassword, getCurrentUser } from '@/lib/auth';
import { toast } from 'sonner';
import type { User as UserType } from '@/types/cms';

export default function UserManagement() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'editor' as UserType['role'],
    password: '',
    isActive: true,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadUsers();
    setCurrentUser(getCurrentUser());
  }, []);

  const loadUsers = () => {
    setUsers(getUsers());
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'editor',
      password: '',
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (user: UserType) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
      isActive: user.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (user: UserType) => {
    if (user.id === currentUser?.id) {
      toast.error('You cannot delete your own account');
      return;
    }
    if (confirm(`Are you sure you want to delete "${user.name}"?`)) {
      deleteUser(user.id);
      loadUsers();
      toast.success('User deleted');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingUser) {
        updateUser(editingUser.id, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          isActive: formData.isActive,
        });
        toast.success('User updated');
      } else {
        if (!formData.password) {
          toast.error('Password is required for new users');
          return;
        }
        await createUser(formData.email, formData.password, formData.name, formData.role);
        toast.success('User created');
      }
      loadUsers();
      setIsDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      const success = await changePassword(
        editingUser?.id || currentUser?.id || '',
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (success) {
        toast.success('Password changed successfully');
        setIsPasswordDialogOpen(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error('Current password is incorrect');
      }
    } catch {
      toast.error('Failed to change password');
    }
  };

  const openPasswordDialog = (user: UserType) => {
    setEditingUser(user);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsPasswordDialogOpen(true);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-700">Admin</Badge>;
      case 'editor':
        return <Badge className="bg-blue-100 text-blue-700">Editor</Badge>;
      case 'author':
        return <Badge className="bg-green-100 text-green-700">Author</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1220]">Users</h1>
          <p className="text-[#5A6578] mt-1">Manage user accounts and permissions.</p>
        </div>
        <Button onClick={handleAdd} className="btn-primary rounded-full">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A6578]" />
        <Input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-4 py-3 rounded-xl"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[rgba(11,18,32,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F6F7F9]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1220]">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1220]">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1220]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1220]">Last Login</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[#0B1220]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(11,18,32,0.08)]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#F6F7F9]/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1D4ED8]/10 rounded-full flex items-center justify-center">
                        <span className="text-[#1D4ED8] font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-[#0B1220]">{user.name}</p>
                        <p className="text-sm text-[#5A6578]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4">
                    {user.isActive ? (
                      <span className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600 text-sm">
                        <XCircle className="w-4 h-4 mr-1" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#5A6578]">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : 'Never'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openPasswordDialog(user)}
                        className="text-[#5A6578] hover:text-[#1D4ED8]"
                      >
                        <Key className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user)}
                        className="text-[#1D4ED8] hover:bg-[#1D4ED8]/10"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      {user.id !== currentUser?.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user)}
                          className="text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-[#5A6578]/30 mx-auto mb-4" />
            <p className="text-[#5A6578]">No users found.</p>
          </div>
        )}
      </div>

      {/* Add/Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full name"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as UserType['role'] })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin - Full access</SelectItem>
                  <SelectItem value="editor">Editor - Can edit content</SelectItem>
                  <SelectItem value="author">Author - Can create content</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {!editingUser && (
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 8 characters"
                  className="mt-1"
                  required={!editingUser}
                  minLength={8}
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label>Active</Label>
            </div>
            <Button type="submit" className="w-full btn-primary">
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePasswordChange} className="space-y-4 mt-4">
            <div>
              <Label>Current Password</Label>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Minimum 8 characters"
                className="mt-1"
                required
                minLength={8}
              />
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <Button type="submit" className="w-full btn-primary">
              Change Password
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
