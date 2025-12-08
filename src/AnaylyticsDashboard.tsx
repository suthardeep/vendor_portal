import React from 'react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoreVertical, Package } from 'lucide-react';
import { StatsCard } from './components/base/StatsCard';

const ordersData = [
  { month: 'Jan', '2024': 12, '2023': -15 },
  { month: 'Feb', '2024': 2, '2023': -20 },
  { month: 'Mar', '2024': 8, '2023': -10 },
  { month: 'Apr', '2024': 24, '2023': -15 },
  { month: 'May', '2024': 12, '2023': -8 },
  { month: 'Jun', '2024': 6, '2023': -18 },
  { month: 'Jul', '2024': 5, '2023': -12 }
];

const salesData = [
  { day: 'Mon', sales: 290 },
  { day: 'Tue', sales: 350 },
  { day: 'Wed', sales: 480 },
  { day: 'Thu', sales: 420 },
  { day: 'Fri', sales: 550 },
  { day: 'Sat', sales: 480 },
  { day: 'Sun', sales: 320 }
];

export default function Dashboard() {
  return (
   <div className=" relative max-w-7xl mx-auto flex flex-col min-h-screen p-2 w-full">
  {/* Stats Cards Row - Now inside the same container */}
  <div className='flex justify-around mb-6 gap-6'> {/* Added margin-bottom */}
    <StatsCard
      title="Total Orders"
      value="42.3K"
      subtitle="Recurring Revenue"
      percentage={52}
      trend="decrease"
      iconName="Package"
      iconBgColor="bg-error"
      iconColor="text-base-1"
    />
    <StatsCard
      title="Total Orders"
      value="42.3K"
      subtitle="Recurring Revenue"
      percentage={52}
      trend="increase"
      iconName="Package"
      iconBgColor="bg-error"
      iconColor="text-base-1"
    />
    <StatsCard
      title="Total Orders"
      value="42.3K"
      subtitle="Recurring Revenue"
      percentage={52}
      trend="increase"
      iconName="Package"
      iconBgColor="bg-error"
      iconColor="text-base-1"
    
    />
    <StatsCard
      title="Total Orders"
      value="42.3K"
      subtitle="Recurring Revenue"
      percentage={52}
      trend="increase"
      iconName="Package"
      iconBgColor="bg-error"
      iconColor="text-base-1"
    />
  </div>

  {/* Charts Section */}
  <div className="flex flex-col lg:flex-row gap-6">
    
    <div className="flex flex-col lg:flex-row lg:flex-[1.5] bg-base-1 rounded-xl border border-base-3 overflow-hidden shadow-sm">
      
      <div className="flex-1 p-6 flex flex-col border-r border-base-3">
        <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-base-3 -mx-6 px-6">
          <h3 className="text-lg font-semibold text-base-content">Orders Over Time</h3>
          <button className="text-disabled-content hover:text-base-content">
            <MoreVertical size={18} />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 bg-primary-600 rounded-full" />
            <span className="text-sm text-body-content">2024</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 bg-accent-500 rounded-full" />
            <span className="text-sm text-body-content">2023</span>
          </div>
        </div>

        <div className="w-full -mx-2">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart 
              data={ordersData}
              margin={{ left: 0, right: 0, top: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
              />
              <Tooltip />
              <Bar dataKey="2024" fill="#7033FF" radius={[6, 6, 6, 6]} barSize={16} />
              <Bar dataKey="2023" fill="#06b6d4" radius={[6, 6, 6, 6]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lg:w-56 p-4 flex flex-col items-center justify-center border-l border-base-3">
        <div className="w-full flex items-center justify-between mb-6">
          <select className="text-sm text-body-content bg-base-2 rounded-lg px-3 py-2 border border-base-3 outline-none">
            <option>2023</option>
            <option>2024</option>
          </select>
          <button className="text-disabled-content hover:text-base-content">
            <MoreVertical size={18} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center w-full">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#BAAEFF" />
                  <stop offset="100%" stopColor="#7033FF" />
                </linearGradient>
              </defs>
              {[...Array(20)].map((_, i) => {
                const startAngle = 180 + (i * 9);
                const endAngle = startAngle + 7;
                const isActive = i < 15.6;
                
                const startRad = (startAngle - 90) * Math.PI / 180;
                const endRad = (endAngle - 90) * Math.PI / 180;
                const outerRadius = 90;
                const innerRadius = 70;
                
                const x1 = 100 + outerRadius * Math.cos(startRad);
                const y1 = 100 + outerRadius * Math.sin(startRad);
                const x2 = 100 + outerRadius * Math.cos(endRad);
                const y2 = 100 + outerRadius * Math.sin(endRad);
                const x3 = 100 + innerRadius * Math.cos(endRad);
                const y3 = 100 + innerRadius * Math.sin(endRad);
                const x4 = 100 + innerRadius * Math.cos(startRad);
                const y4 = 100 + innerRadius * Math.sin(startRad);
                
                return (
                  <path
                    key={i}
                    d={`M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`}
                    fill={isActive ? 'url(#gaugeGradient)' : '#e5e7eb'}
                  />
                );
              })}
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-base-content">78%</div>
              <div className="text-xs text-body-content mt-1">Order Growth</div>
            </div>
          </div>

          <div className="text-sm text-success mt-6 font-medium">↑ 62% Your Growth</div>

          <div className="grid grid-cols-2 gap-3 w-full mt-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package size={16} className="text-primary-600" />
              </div>
              <div>
                <div className="text-xs text-body-content">2024</div>
                <div className="text-sm font-semibold text-base-content">32.5k</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-accent-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package size={16} className="text-accent-600" />
              </div>
              <div>
                <div className="text-xs text-body-content">2023</div>
                <div className="text-sm font-semibold text-base-content">41.2k</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="lg:flex-1 bg-base-1 rounded-xl border border-base-3 shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4 border-b-2 border-base-2 -mx-6 px-6">
          <h3 className="text-lg font-semibold text-base-content">Last 7 Days Sales</h3>
          <button className="text-disabled-content hover:text-base-content">
            <MoreVertical size={18} />
          </button>
        </div>

        <div className="w-full -mx-2">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart 
              data={salesData}
              margin={{ left: 0, right: 0, top: 10, bottom: 10 }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#02CA4B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#02CA4B" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
              />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#02CA4B" 
                strokeWidth={3}
                fill="url(#salesGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <div className="text-sm text-body-content mb-1">Items Sold</div>
            <div className="text-xl font-semibold text-base-content mb-1">1,259</div>
            <div className="text-xs text-success flex items-center gap-1 font-medium">
              <span>↑ 25.6%</span>
              <span className="text-body-content">77 item</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-body-content mb-1">Revenue</div>
            <div className="text-xl font-semibold text-base-content mb-1">₹14,698</div>
            <div className="text-xs text-success flex items-center gap-1 font-medium">
              <span>↑ 5.6%</span>
              <span className="text-body-content">₹230</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}