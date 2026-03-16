import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Sale } from '../types';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const { data, error } = await supabase
          .from('sales')
          .select(`
            *,
            promoter:users!sales_promoter_id_fkey (
              email
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const mappedSales = (data || []).map((sale: any) => ({
          ...sale,
          promoter_email: sale.promoter?.email || 'Unknown',
        }));
        
        setSales(mappedSales);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const stats = [
    {
      name: 'Total Sales Submitted',
      value: sales.length,
      icon: TrendingUp,
      color: 'bg-blue-500',
      change: '+12.5%',
      changeType: 'increase',
    },
    {
      name: 'Pending Approval',
      value: sales.filter(s => s.status === 'pending').length,
      icon: Clock,
      color: 'bg-orange-500',
      change: '-2%',
      changeType: 'decrease',
    },
    {
      name: 'Total Approved',
      value: sales.filter(s => s.status === 'approved' || s.status === 'paid').length,
      icon: CheckCircle,
      color: 'bg-emerald-500',
      change: '+18.2%',
      changeType: 'increase',
    },
    {
      name: 'Incentives Paid',
      value: sales.filter(s => s.payment_status === 'paid').length,
      icon: CreditCard,
      color: 'bg-purple-500',
      change: '+5.4%',
      changeType: 'increase',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Overview</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative bg-white pt-6 px-6 pb-6 shadow-sm border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group"
          >
            <dt>
              <div className={`absolute rounded-xl p-3 ${item.color} text-white shadow-lg shadow-indigo-100 transition-transform group-hover:scale-110`}>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">{item.name}</p>
            </dt>
            <dd className="ml-16 flex flex-col items-start">
              <span className="text-3xl font-bold text-gray-900">{item.value}</span>
              <div className="mt-1 flex items-center">
                {item.changeType === 'increase' ? (
                  <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-rose-500 mr-1" />
                )}
                <span className={`text-xs font-semibold ${item.changeType === 'increase' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {item.change}
                </span>
                <span className="ml-1 text-xs text-gray-400">vs last month</span>
              </div>
            </dd>
          </div>
        ))}
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Recent Sales</h2>
          <Link
            to="/sales"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 flex items-center"
          >
            View all
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Promoter</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 italic-none">
              {sales.slice(0, 5).map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => window.location.href = `/sales/${sale.id}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.promoter_email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.product_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">₹{sale.bill_amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                      sale.status === 'approved' || sale.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : sale.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(sale.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    No sales submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
