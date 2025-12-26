import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  User, 
  Trophy, 
  Target, 
  Star, 
  LogOut,
  Settings,
  Share2,
  Calendar,
  Mail,
  Shield
} from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) return null;

  const profileStats = [
    {
      icon: <Trophy className="w-5 h-5 text-yellow-400" />,
      label: 'Total Score',
      value: user.profile.total_score.toLocaleString()
    },
    {
      icon: <Target className="w-5 h-5 text-blue-400" />,
      label: 'Challenges Completed',
      value: user.profile.challenges_completed
    },
    {
      icon: <Star className="w-5 h-5 text-purple-400" />,
      label: 'Badges Earned',
      value: user.profile.badges_earned
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.profile.avatar_url || undefined} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {user.profile.display_name || user.username}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                  <Shield className="w-3 h-3 mr-1" />
                  {user.role}
                </Badge>
                <span className="text-slate-400 text-sm flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={logout} className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profileStats.map((stat, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-slate-300 data-[state=active]:text-white">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-slate-300 data-[state=active]:text-white">
              Activity
            </TabsTrigger>
            <TabsTrigger value="social" className="text-slate-300 data-[state=active]:text-white">
              Social
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-slate-400 text-sm">Username</label>
                    <p className="text-white font-medium">{user.username}</p>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm">Email</label>
                    <p className="text-white font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm">Bio</label>
                    <p className="text-white">
                      {user.profile.bio || "No bio added yet. Share something about yourself!"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">
                    Activity tracking will be available soon. Keep completing challenges!
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Your Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Complete challenges to earn badges and unlock achievements!
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Challenge History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Your challenge completion history will appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Social Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Share your achievements and connect with the cybersecurity community!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
