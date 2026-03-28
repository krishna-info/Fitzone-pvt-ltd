import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Mail, Phone, MessageSquare, Clock, Filter, Search } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const metadata: Metadata = {
  title: 'Enquiries | FitZone Admin',
};

export default async function EnquiriesPage() {
  const supabase = createSupabaseServerClient();

  const { data: enquiries, error } = await supabase
    .from('contact_enquiries')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error('Error fetching enquiries:', error.message);
  }

  return (
    <div className="bg-brand-surface min-h-screen pb-20">
      {/* Header */}
      <div className="bg-brand-dark py-8 px-8">
        <div className="max-w-screen-xl mx-auto">
          <Link href="/admin" className="text-brand-secondary text-sm font-bold flex items-center gap-2 hover:translate-x-1 transition-transform mb-4">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-black text-white">Customer Enquiries</h1>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-8 -mt-6">
        <div className="bg-white rounded-[2rem] shadow-card border border-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none bg-white text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-brand-dark hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>
          </div>

          {/* List */}
          <div className="divide-y divide-gray-50">
            {enquiries && enquiries.length > 0 ? (
              enquiries.map((enquiry) => (
                <div key={enquiry.id} className="p-8 hover:bg-brand-surface transition-colors group">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          enquiry.enquiry_type === 'bulk' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {enquiry.enquiry_type || 'General'}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-brand-muted font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(enquiry.submitted_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-black text-brand-dark">{enquiry.name}</h3>
                        <div className="flex flex-wrap gap-4 mt-2">
                          <a href={`mailto:${enquiry.email}`} className="flex items-center gap-1.5 text-sm text-brand-primary font-bold hover:underline">
                            <Mail className="w-4 h-4" /> {enquiry.email}
                          </a>
                          {enquiry.phone && (
                            <a href={`tel:${enquiry.phone}`} className="flex items-center gap-1.5 text-sm text-brand-muted font-medium hover:text-brand-dark transition-colors">
                              <Phone className="w-4 h-4" /> {enquiry.phone}
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-6 rounded-2xl relative">
                        <MessageSquare className="w-5 h-5 text-gray-200 absolute top-4 right-4" />
                        <p className="text-brand-dark leading-relaxed whitespace-pre-wrap">{enquiry.message}</p>
                      </div>
                    </div>
                    
                    <div className="flex lg:flex-col gap-3">
                      <button className="flex-1 px-6 py-3 rounded-xl bg-brand-dark text-white text-sm font-black hover:bg-brand-primary transition-colors shadow-sm">
                        Mark Processed
                      </button>
                      <button className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-brand-dark text-sm font-black hover:bg-gray-50 transition-colors">
                        Archive
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                  <MessageSquare className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-dark">No enquiries yet</h3>
                  <p className="text-brand-muted">New submissions will appear here automatically.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
