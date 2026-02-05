import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Briefcase, Users, Calendar, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface Stats {
  totalJobs: number;
  activeJobs: number;
  totalCandidates: number;
  upcomingInterviews: number;
  pendingOffers: number;
  hiredThisMonth: number;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalJobs: 0,
    activeJobs: 0,
    totalCandidates: 0,
    upcomingInterviews: 0,
    pendingOffers: 0,
    hiredThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [jobs, candidates, interviews, offers] = await Promise.all([
        supabase.from('jobs').select('status', { count: 'exact' }),
        supabase.from('candidates').select('current_stage', { count: 'exact' }),
        supabase.from('interviews').select('status, scheduled_at', { count: 'exact' }),
        supabase.from('offers').select('status', { count: 'exact' }),
      ]);

      const activeJobs = jobs.data?.filter(j => j.status === 'published').length || 0;
      const upcomingInterviews = interviews.data?.filter(i =>
        i.status === 'scheduled' && new Date(i.scheduled_at) > new Date()
      ).length || 0;
      const pendingOffers = offers.data?.filter(o => o.status === 'sent').length || 0;
      const hiredThisMonth = candidates.data?.filter(c => {
        return c.current_stage === 'hired';
      }).length || 0;

      setStats({
        totalJobs: jobs.count || 0,
        activeJobs,
        totalCandidates: candidates.count || 0,
        upcomingInterviews,
        pendingOffers,
        hiredThisMonth,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Active Jobs',
      value: stats.activeJobs,
      total: stats.totalJobs,
      icon: Briefcase,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Total Candidates',
      value: stats.totalCandidates,
      icon: Users,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Upcoming Interviews',
      value: stats.upcomingInterviews,
      icon: Calendar,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      name: 'Pending Offers',
      value: stats.pendingOffers,
      icon: Clock,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      name: 'Hired This Month',
      value: stats.hiredThisMonth,
      icon: CheckCircle,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      name: 'Growth Rate',
      value: '+12%',
      icon: TrendingUp,
      color: 'bg-violet-500',
      textColor: 'text-violet-600',
      bgColor: 'bg-violet-50',
      isPercentage: true,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Overview</h2>
        <p className="text-slate-600">Your hiring metrics at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {stat.isPercentage ? stat.value : stat.value}
                  </p>
                  {stat.total !== undefined && (
                    <p className="text-sm text-slate-500 mt-1">of {stat.total} total</p>
                  )}
                </div>
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start space-x-3 pb-4 border-b border-slate-100 last:border-0">
                <div className="w-2 h-2 bg-slate-400 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-slate-600">Loading recent activities...</p>
                  <p className="text-xs text-slate-400 mt-1">Just now</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Pipeline Overview</h3>
          <div className="space-y-3">
            {[
              { stage: 'Applied', count: 45, color: 'bg-blue-500' },
              { stage: 'Screening', count: 28, color: 'bg-yellow-500' },
              { stage: 'Interview', count: 15, color: 'bg-orange-500' },
              { stage: 'Offer', count: 8, color: 'bg-green-500' },
              { stage: 'Hired', count: 12, color: 'bg-emerald-500' },
            ].map((item) => (
              <div key={item.stage}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-slate-700">{item.stage}</span>
                  <span className="text-sm font-semibold text-slate-900">{item.count}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all`}
                    style={{ width: `${(item.count / 45) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
