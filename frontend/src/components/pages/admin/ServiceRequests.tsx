import { useState, useEffect } from 'react';
import { Check, X, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { API_BASE_URL } from '../../../config';

interface ServiceRequest {
  id: number;
  service: number;
  service_title: string;
  beneficiary_name: string;
  beneficiary_contact: string;
  details: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DONE';
  created_at: string;
}

export default function ServiceRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'DONE'>('ALL');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const url = filter === 'ALL'
        ? `${API_BASE_URL}/api/service-requests/`
        : `${API_BASE_URL}/api/service-requests/?status=${filter}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data.results || data);
      } else {
        setError('فشل في تحميل طلبات الخدمات');
      }
    } catch (error) {
      console.error('Error fetching service requests:', error);
      setError('حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId: number, action: 'approve' | 'reject' | 'mark_done') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE_URL}/api/service-requests/${requestId}/${action}/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        // Refresh the list
        fetchRequests();
      } else {
        const data = await response.json();
        alert(data.error || 'فشلت العملية');
      }
    } catch (error) {
      console.error('Error performing action:', error);
      alert('حدث خطأ أثناء تنفيذ العملية');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      APPROVED: { label: 'مقبول', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      REJECTED: { label: 'مرفوض', color: 'bg-red-100 text-red-800', icon: XCircle },
      DONE: { label: 'مكتمل', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-[Cairo]" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-8 h-8 text-[#6F1A28]" />
            <h1 className="text-3xl font-bold text-[#6F1A28]">طلبات الخدمات</h1>
          </div>
          <p className="text-gray-600 text-lg">إدارة ومراجعة طلبات الخدمات من المستفيدين</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'DONE'] as const).map((status) => {
              const labels = {
                ALL: 'الكل',
                PENDING: 'قيد المراجعة',
                APPROVED: 'مقبول',
                REJECTED: 'مرفوض',
                DONE: 'مكتمل',
              };

              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    filter === status
                      ? 'bg-[#6F1A28] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {labels[status]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6F1A28]"></div>
          </div>
        ) : (
          <>
            {/* Requests Count */}
            <div className="mb-4 text-gray-600 text-lg">
              عدد الطلبات: <span className="font-bold text-[#6F1A28]">{requests.length}</span>
            </div>

            {/* Requests List */}
            {requests.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">لا توجد طلبات حالياً</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-[#6F1A28]">{request.service_title}</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-gray-600 text-sm">تاريخ الطلب: {formatDate(request.created_at)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">اسم المستفيد:</p>
                        <p className="text-lg font-semibold text-gray-800">{request.beneficiary_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">معلومات التواصل:</p>
                        <p className="text-lg font-semibold text-gray-800">{request.beneficiary_contact}</p>
                      </div>
                    </div>

                    {request.details && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">تفاصيل الطلب:</p>
                        <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{request.details}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      {request.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleAction(request.id, 'approve')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                          >
                            <Check className="w-4 h-4" />
                            قبول
                          </button>
                          <button
                            onClick={() => handleAction(request.id, 'reject')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                          >
                            <X className="w-4 h-4" />
                            رفض
                          </button>
                        </>
                      )}
                      {(request.status === 'PENDING' || request.status === 'APPROVED') && (
                        <button
                          onClick={() => handleAction(request.id, 'mark_done')}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                          <CheckCircle className="w-4 h-4" />
                          وضع علامة كمكتمل
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
