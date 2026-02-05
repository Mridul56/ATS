import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, MapPin, Video, Plus, Users } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Interview = Database['public']['Tables']['interviews']['Row'] & {
  job_applications: {
    job_id: string;
    candidate_id: string;
    candidates: {
      full_name: string;
      email: string;
    };
    jobs: {
      title: string;
    };
  };
};

export const Interviews: React.FC = () => {
  const { profile } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select(`
          *,
          job_applications!inner(
            job_id,
            candidate_id,
            candidates!inner(full_name, email),
            jobs!inner(title)
          )
        `)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      setInterviews(data as any || []);
    } catch (error) {
      console.error('Error loading interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredInterviews = () => {
    const now = new Date();
    return interviews.filter((interview) => {
      const interviewDate = new Date(interview.scheduled_at);
      if (filter === 'upcoming') return interviewDate > now;
      if (filter === 'past') return interviewDate <= now;
      return true;
    });
  };

  const getStatusColor = (status: Interview['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const canScheduleInterviews =
    profile?.role === 'admin' ||
    profile?.role === 'recruiter' ||
    profile?.role === 'hiring_manager';

  const filteredInterviews = getFilteredInterviews();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Interviews</h2>
          <p className="text-slate-600">Manage interview schedules and feedback</p>
        </div>
        {canScheduleInterviews && (
          <button className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition">
            <Plus className="w-5 h-5" />
            <span>Schedule Interview</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex space-x-2">
          {[
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'past', label: 'Past' },
            { id: 'all', label: 'All' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInterviews.map((interview) => {
          const { date, time } = formatDateTime(interview.scheduled_at);
          return (
            <div
              key={interview.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    {interview.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {interview.job_applications.candidates.full_name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {interview.job_applications.jobs.title}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    interview.status
                  )}`}
                >
                  {interview.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>{date}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    {time} ({interview.duration_minutes} min)
                  </span>
                </div>
                {interview.meeting_link ? (
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Video className="w-4 h-4" />
                    <a
                      href={interview.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      Join Meeting
                    </a>
                  </div>
                ) : interview.location ? (
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span>{interview.location}</span>
                  </div>
                ) : null}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-1 text-sm text-slate-500">
                  <Users className="w-4 h-4" />
                  <span className="capitalize">{interview.interview_type}</span>
                </div>
                <button className="text-sm font-medium text-slate-900 hover:text-slate-700">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredInterviews.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No interviews found</h3>
          <p className="text-slate-600 mb-6">
            {filter === 'upcoming'
              ? 'No upcoming interviews scheduled'
              : filter === 'past'
              ? 'No past interviews'
              : 'Start scheduling interviews with your candidates'}
          </p>
          {canScheduleInterviews && filter === 'all' && (
            <button className="inline-flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition">
              <Plus className="w-5 h-5" />
              <span>Schedule Interview</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
